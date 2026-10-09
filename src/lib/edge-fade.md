# edge-fade（内容渐隐层 + 悬浮操作层）

> **版本**: v1.2.0  
> **职责**: 统一「内容渐隐层 + 悬浮操作层」模式的通用能力：让操作控件浮在内容之上，其下方内容朝控件一侧渐隐到透明，保证控件清晰可读、内容不被硬切。

## 模式拆解

该模式由两块可独立使用、也可组合使用的能力组成：

1. **内容渐隐层（Content Edge Fade）** —— 把内容朝某条边缘渐隐到透明的 `mask-image`（alpha-only，不绘制色块、不需匹配背景色、不新增可见 DOM 层）。
2. **悬浮操作层（Floating Action Overlay）** —— 让操作控件浮在内容之上、容器 hover / 聚焦时显现。

二者都不依赖对方：可只用渐隐（滚动 / 截断边缘提示），也可只用悬浮（无需渐隐的浮动控件），表格 overlay 角色列则两者组合。

## 一、内容渐隐层

同一套渐隐有**两种落地形态**，按「静态 / 动态」选用，二者底层都是 `mask-image` 线性渐变，性能等价：

| 形态 | 入口 | 何时用 | 是否要 JS |
| :--- | :--- | :--- | :--- |
| **CSS 类** | 纵向 `.snowui-scroll-mask` + `data-scroll-mask="top \| bottom \| both"`；横向 `.snowui-horizontal-scroll-mask` + `data-scroll-mask-x="left \| right \| both"`（`components/src/styles/layout.css`） | 渐隐边与渐隐宽度**固定**、只随滚动 / 截断状态切换；可通过 `--snowui-scroll-mask-*-size` / `*-solid-ratio` 调高度与实心占比 | 否（纯 CSS，切 data 属性即可） |
| **JS 生成器** | `edge-fade.ts` 的 `createEdgeFadeMaskImage` / `createEdgeFadeMaskStyle` | 渐隐宽度**需要运行时计算**（如按实测控件宽度收缩），或要按状态把 gradient 存到 CSS 变量再消费 | 是（生成字符串，由消费方应用） |

> 选择原则：固定边缘渐隐（滚动条 / 文本截断提示）优先用 `.snowui-scroll-mask`（零 JS）；渐隐尺寸随内容动态变化（表格按钮列按实测宽度收缩）用 `edge-fade.ts`。两者产出的都是 `linear-gradient(... transparent ... #000 ...)` 形态的 mask，可互相对照。

### JS 生成器 API

```ts
createEdgeFadeMaskImage(options): string   // 返回 linear-gradient(...) 字符串
createEdgeFadeMaskStyle(options): string   // 返回 "-webkit-mask-image:...;mask-image:...;" 内联声明串
```

| 参数 | 必填 | 说明 |
| :--- | :--- | :--- |
| `direction` | 是 | `to left` / `to right` / `to top` / `to bottom`；内容朝该条边缘渐隐到透明 |
| `fadeStart` | 是 | 完全透明区终点：从该边缘到此位置内容完全透明（盖住浮层控件）。任意 CSS 长度 / 百分比 / `var()` / `calc()` |
| `fadeEnd` | 是 | 完全不透明区起点：从此位置起完全可见；`fadeStart`→`fadeEnd` 之间为柔和过渡 |
| `visibleColor` | 否 | 可见区颜色（mask 只取 alpha），默认 `#000` |

生成结构固定为 `linear-gradient(<direction>, transparent <fadeStart>, <visibleColor> <fadeEnd>)`。

> 单边滚动 / 截断渐隐也可用本生成器表达（如「底边渐隐」= `{direction:"to top", fadeStart:"0", fadeEnd:"<size>"}`）；但**双边同时渐隐**（both）需要多色标渐变，仍用 `.snowui-scroll-mask[data-scroll-mask="both"]`。

### 两段式语义

每条渐隐都是「完全透明区 + 柔和过渡区」两段：`[边缘, fadeStart]` 完全透明（盖住浮层控件、内容不透出），`[fadeStart, fadeEnd]` 柔和过渡，`fadeEnd` 之后完全可见。减小 `fadeStart` / `fadeEnd` 时整段按比例内移，过渡始终连续、不会断层。

## 二、悬浮操作层（`.snowui-overlay-action`）

`components/src/styles/layout.css` 提供一对通用基类，用于「控件浮在内容之上、容器 hover / 聚焦时显现」的**就地浮动**场景：

| 类 | 加在哪 | 作用 |
| :--- | :--- | :--- |
| `.snowui-overlay-action-host` | 内容宿主（如 Tag 根、卡片） | 建立 `position: relative` 定位上下文 |
| `.snowui-overlay-action` | 浮动控件（删除 X / 操作按钮） | `position: absolute` + 默认 `opacity:0 / pointer-events:none`，宿主 `:hover` / `:focus-within` 时显现；控件自行声明 `inset` / 贴哪条边 / 尺寸 |

覆盖入口：`--snowui-overlay-action-opacity-override`（静止态，默认 0）、`--snowui-overlay-action-reveal-opacity-override`（显现态，默认 1）。

> **定位边界**：简单就地浮动（控件相对自身宿主定位，如 Tag 删除 X）用本基类即可。需要**随行 sticky / fixed 跟踪**（如 Table 数据行操作列要随表格横向滚动、贴行右边缘、最高层级压住真实内容）的复杂定位，是组件布局职责，由组件自管（Table 用 `getBoundingClientRect` + `position:fixed` 的 `$effect`），不强行套本基类。这部分跟踪逻辑跨组件不可干净复用，故不纳入通用基类。

## 组合用法（悬浮 + 渐隐）

```svelte
<!-- 宿主 + 浮动控件 + 内容朝控件一侧渐隐 -->
<span class="snowui-overlay-action-host" style={`--edge-fade:${createEdgeFadeMaskImage({ direction: "to left", fadeStart: "0", fadeEnd: "2rem" })}`}>
  <span class="content">……内容……</span>
  <button class="snowui-overlay-action" style="inset-inline-end: 0; inset-block: 0;">×</button>
  <!-- 组件 CSS：:where(.snowui-overlay-action-host:hover) .content { mask-image: var(--edge-fade); -webkit-mask-image: var(--edge-fade); } -->
</span>
```

## 性能说明

- **渐隐**：所有形态都是 `mask-image`（GPU 合成、alpha-only、零额外 DOM 层、无需匹配背景色）。Textarea / Text / CodeBlock 当前已是 `mask-image`（`.snowui-scroll-mask`），与表格同机制，互相切换无性能差异；滚动时切换 `data-scroll-mask` 触发一次 mask 重栅格，是既有成本，不因接入本能力增加。
- **悬浮**：`.snowui-overlay-action` 用 `position:absolute` + `opacity` 显隐（合成层，不触发回流），优于「就地撑开宽度」的布局动画。表格的 `position:fixed` + 每帧 `getBoundingClientRect` 跟踪是表格随行 sticky 的固有成本，**不会**被引入 Tag 这类简单浮动场景。

## 行为契约

- 渐隐生成器只输出字符串，不读 DOM、不绑生命周期；`mask-image` 必须同时写 `-webkit-mask-image`；需要平滑出现时由消费方在被渐隐元素上加 `transition: mask-image ...`。
- `mask` 只改变可见度，不改变命中测试；被渐隐内容里的链接 / 按钮仍可点击。
- 「完全透明区」宽度应不小于浮层控件实际宽度，否则透明背景的描边 / 图标控件下方会透出内容。

## 消费者

| 组件 | 渐隐 | 悬浮 |
| :--- | :--- | :--- |
| Table overlay 角色列 | `edge-fade.ts`（checkbox / 表头与 actions 均按控件实测边缘定位，默认固定 20px 过渡） | 随行 fixed 跟踪（组件自管） |
| Textarea | `.snowui-scroll-mask`（top/bottom/both 滚动渐隐） | — |
| Text（`lines={0}`） | `.snowui-scroll-mask`（内置展开按钮启用时为 bottom 截断渐隐；未启用时按滚动位置切换 top/bottom/both） | — |
| CodeBlock | `.snowui-scroll-mask`（top/bottom 滚动渐隐） | — |
| SidePanel | `.snowui-scroll-mask`（内容区 top/bottom 滚动渐隐） | — |
| Sidebar | `.snowui-scroll-mask`（Body 向下滚动后在 Logo 下方显示 top 渐隐） | — |
| Input / Listbox 搜索 Input / SearchInput | `.snowui-horizontal-scroll-mask`；发生横向溢出后持续显示左右渐隐。清除 X 以 overlay 覆盖文字，并从 X 最右边缘保留原有的 14px → 26px 参数 | X 为 Input trailing overlay 控件 |
| Tag（删除 X，规划中） | 可选：删除 X 浮起后内容右侧渐隐 | `.snowui-overlay-action` 就地浮动 |

> 以上组件除 Table 外当前**未接入本统一能力封装**（仍各自直接用 `.snowui-scroll-mask`）；本能力已就绪，可按需逐步接入，渐隐部分接入为零性能差异。

## Changelog

- 2026-07-05：v1.2.0，新增 `.snowui-horizontal-scroll-mask` 与 `data-scroll-mask-x`，供 Input 系单行输入按真实横向滚动状态显示 left/right/both 渐隐；Input 清除 X 的右侧渐隐参数与 Table 表头 checkbox 对齐。
- 2026-06-27：v1.1.0，扩展为「内容渐隐层 + 悬浮操作层」统一能力：纳入 `.snowui-scroll-mask`（静态 CSS 渐隐形态）与新增 `.snowui-overlay-action` / `.snowui-overlay-action-host`（就地悬浮基类）；补充两种渐隐形态选型、性能说明与消费者清单。明确随行 sticky/fixed 跟踪定位为组件职责、不纳入通用基类。
- 2026-06-27：v1.0.0，从 Table overlay 角色列的内容边缘渐隐提炼为 基础共享能力，新增 `createEdgeFadeMaskImage` / `createEdgeFadeMaskStyle`。
