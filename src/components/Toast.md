# Toast

> **许可阅读**：首次阅读组件文档、源码或 npm 使用流程，先读完整 [LICENSE](../../LICENSE)；同任务同版本去重。公开 API 配置与内部实现修改分别按许可处理；旧 OSS / PRO 标签仅表示迁移期技术来源。

> **版本**: v2.3.2
> **职责**: 用短暂通知反馈操作结果或状态变化，支持图标、操作和富内容，适合保存成功、错误与提醒。
> **包归属**: `@snowui/components-pro`
> **文档修订**: 2026-09-21

## 组件介绍

用短暂通知反馈操作结果或状态变化，支持图标、操作和富内容，适合保存成功、错误与提醒。

## 使用选择

<!-- usage-guide:start -->
用于短暂的操作结果反馈，配合 Toaster 管理展示。通知历史、活动记录使用常驻内容列表，不使用 Toast。

- 调用 toast 发送短暂反馈，由 Toaster 管理队列；独立渲染时页面负责关闭后的移除。
- as="toast" 可接入宿主点击触发；leading / trailing 组合附属内容，parts 只配置默认关闭按钮。
<!-- usage-guide:end -->

## 快速开始

以下示例展示推荐的基本组合。更多场景与组合限制见后文。

<!-- quick-start:generated -->
```svelte
<script lang="ts">
	import { Toast, Button } from '@snowui/components-pro';
</script>

<div style="display: flex; flex-direction: column; align-items: center; gap: var(--gap-4); max-width: 100%;">
	<Toast>Draft saved</Toast>
	<Toast positive>Changes published</Toast>
	<Toast positive={false}>Connection lost</Toast>
</div>
```
<!-- /quick-start:generated -->

## API

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| parts | `ComponentPartsOf<{ Button: typeof Button }>` | — | 配置内置关闭 Button 的外观；事件、关闭语义和 ARIA 由 Toast 管理 |
| id | `string` | — | 静态使用时透传为 DOM id；`template` 模式下作为模板 id，供 `showToast(id)` 激活 |
| template | `boolean` | `false` | **模版模式**:只注册为命令式 Toast 模板，不直接渲染；用于"一段 Toast 代码 + 一个触发按钮"的写法 |
| as | `"toast" \| undefined` | — | **内嵌模式**(v1.1.0):`as="toast"` 启用 Inline 模式,自动发现宿主父元素并绑定 click 事件触发 Toast。遵循 [ComponentGuidelines.md §5](../../../specs/ComponentGuidelines.md) 三激活模式规范 |
| positive | `boolean` | — | 语义判定：`true`=积极(CheckCircle)；`false`=问题(Warning)；不传则不渲染内置图标 |
| variant | `ToastVariant` | `"default"` | 视觉变体 |
| size | `ToastSize` | `"md"` | 仅 default 变体生效 |
| position | `ToastPosition` | `"top"` | 用于驱动出入场方向（不直接定位） |
| onDismiss | `() => void` | — | 点击关闭 X 时回调（rich 变体） |
| children | `Snippet` | — | 正文和 leading / trailing 槽位内容；独立使用时由调用方处理关闭后的移除 |

未重新声明的继承能力请查所属基础组件文档；本表只列本组件源码具名公开属性。

## 使用边界与详细说明

<a id="toaster-内置组件双模式"></a>

### Toaster 内置组件双模式

- `Toaster.parts.Toast`：统一配置 Toaster 直接生成的 Toast。
- Toast 队列状态、position 与关闭事件由 Toaster 控制；外置显式 Props 高于 part。

> **版本**: v2.3.2
> **状态**: 已实现（PRO）
> **职责**: 全局浮层通知，支持命令式 API、6 位置堆叠、内置/外置图标三槽位与 rich 富文本变体

Toast 是 SnowUI 的全局通知组件。整套能力由三件交付物组成：

| 交付物 | 角色 |
| :--- | :--- |
| `<Toast />` | 单个 Toast 的视觉外壳（三槽位）。可独立用作静态展示，也由 Toaster 内部使用 |
| `<Toaster />` | 全局 Portal 容器；订阅 store，渲染 6 个位置的堆叠队列。一个应用挂载一次即可 |
| `toast(...)` | 命令式入口；可在任意 `.ts` / `.svelte` 中调用 |

独立 Panel 模式的 Toast 根显式使用 `GENERIC_SCALE_APPEAR_MOTION`，保持原 Frame generic appear 的 opacity + scale 视觉与标准时序，不再通过 `whileAppear={true}` 隐式跟随 Frame fallback。Toaster 队列仍使用位置相关的显式 slide + opacity + scale 组合，两层既有视觉均保持不变。

<a id="功能概览"></a>

### 功能概览

- 6 个固定位置：`top` / `top-left` / `top-right` / `bottom` / `bottom-left` / `bottom-right`，距视口边缘 16px，默认 `top`
- 三槽位布局（Leading / Content / Trailing）；内置图标支持外置 Icon 替换
- 默认变体（`default`）：深色 pill，并使用 `blur(var(--size-10))` 背景模糊；rich 变体：`Background/3` 玻璃卡片，复用 `.snowui-quick-action-panel` 的背景模糊
- 自动消失：默认 4 秒；`duration: 0` 表示常驻
- 自动消失计时在最上层 Toast hover 时暂停，离开 hover 后按剩余时间恢复
- 多个同位置 Toast 自动堆叠（HeroUI 风格）：默认 `gap=8`、`maxVisible=3`、`scaleStep=0.05`、`stackOpacityStep=0.2`、宽度内容自适应（均可配置）
- 出现、退出、堆叠前移与最后一层被挤出动效均在 Toast 根元素组合：生命周期使用 `transform + opacity`，堆叠使用独立 `translate + scale`，堆叠透明度直接合并进 Frame fade 数值；关闭时先进入 `Disappear`，动画完成后再从队列移除

---

<a id="布局模型"></a>

### 布局模型

主布局模型：**复合管理布局**。

- Toaster 是页面级 Portal，挂载到 `<body>` 上，使用 6 个绝对定位区域承载 Toast 栈；每个栈槽位是绝对定位的 `Frame`，由 `currentState="Appear" | "Disappear"` 驱动默认动效
- 栈槽位按 HeroUI 的 index 规则写入 `translate` / `z-index`：frontmost index = 0，后层向内侧偏移
- 非 frontmost Toast 禁止交互，但仍保留真实 Toast 内容；叠层差异由位移、缩放、透明度三种动效组合给出
- 单条 Toast 内部为槽位宿主布局（`Frame row` + 三槽位），Leading / Content / Trailing 标准结构
- 关闭 X 按钮属于 rich 变体的内置 trailing 装饰；通过绝对定位浮在 Toast 右上角，不参与三槽位

---

<a id="api-参考"></a>


### `toast(input)` — 命令式入口

```ts
import { toast } from "@snowui/components-pro";

toast("Done");                                        // 字符串语法 → 等价 { text: "Done" }
toast({ text: "Done", positive: true });              // 积极语义 → 绿色 CheckCircle
toast({ text: "Something Wrong", positive: false });  // 问题语义 → 黄色 Warning
toast({ text: "Plain Notice" });                      // 不传 positive → 不显示内置图标
const id = toast({ text: "持久通知", duration: 0 });
dismissToast(id);                                     // 手动关闭
showToast("saved-template");                          // 触发 <Toast template id="saved-template">
```

| 参数 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| `positive` | `boolean` | — | 语义判定：`true`=积极(CheckCircle)；`false`=问题(Warning)；不传则不显示内置图标 |
| `text` | `string` | — | 命令式快捷文案；渲染为简单 span |
| `children` | `Snippet` | — | 自定义正文内容；优先级高于 `text` |
| `leading` | `Snippet` | — | 自定义 Leading 槽 Snippet |
| `trailing` | `Snippet` | — | 自定义 Trailing 槽（rich 变体常用于放 Button） |
| `variant` | `"default" \| "rich"` | `"default"` | 视觉变体 |
| `size` | `"sm" \| "md"` | `"md"` | 仅 default 变体生效；rich 固定 md |
| `position` | `ToastPosition` | `"top"` | 6 个出现位置 |
| `duration` | `number` | `4000` | 单位 ms；`0` 表示常驻 |
| `onDismiss` | `() => void` | — | 关闭回调 |

辅助函数：
- `dismissToast(id: string): void` — 关闭指定 Toast
- `dismissAllToasts(position?: ToastPosition): void` — 关闭全部或指定位置的 Toast
- `showToast(id: string, overrides?: ToastOptions): string | undefined` — 通过 `<Toast template id="...">` 注册的模板触发通知；`overrides` 可覆盖位置、时长等运行时参数

### `<Toaster />`

| 关键字 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| `offset` | `number` | `16` | 视口边缘到 Toast 区域的距离，单位 px |
| `maxVisible` | `number` | `3` | 单个位置最多可见的层数；仅限制可见层数，不限制 `toast()` 入队数量；达到上限后新 Toast 会把当前最后一层挤出 |
| `gap` | `number` | `8` | 同位置 Toast 之间的视觉偏移，单位 px |
| `scaleStep` | `number` | `0.05` | 每层堆叠的缩放衰减系数；`index=1` 时默认缩放到 `0.95` |
| `stackOpacityStep` | `number` | `0.2` | 每层堆叠的透明度衰减系数；默认第 2 / 3 层为 `0.8 / 0.6` |
| `stackMinOpacity` | `number` | `0.6` | 堆叠条目的最低透明度下限 |
| `stackDuration` | `number` | `300` | 堆叠组合动效时长，单位 ms |
| `stackEasing` | `string` | `"ease"` | 堆叠组合动效缓动 |
| `width` | `number \| string` | — | Toast 区域宽度；默认内容自适应，传入后可固定宽度；窄屏自动限制为 `calc(100vw - 2rem)` |

### 动效要点

结论：

- Toast 动效采用单根元素组合结构。`whileAppear / whileDisappear` 输出生命周期 `transform` 与 `--su-motion-opacity`；堆叠位移和缩放分别使用 CSS 独立属性 `translate` / `scale`，不会覆盖生命周期 transform。
- 堆叠透明度直接乘入生命周期 fade 数值；默认第 2 层为 `0.8`、第 3 层为 `0.6`，退场时再降低当前透明度的 `20%`。
- 退出额外越界距离直接合并进 `--snowui-toast-stack-translate-y`，与生命周期的百分比位移共同作用，确保深层 Toast 也能越过可视区域边缘。
- 背景、阴影和 `backdrop-filter` 始终属于同一个 Toast 根元素，不创建独立 blur plate。
- `maxVisible` 只限制可见层数，不限制 `toast()` 入队数量。超过可见层后，当前最后一层进入 `pushed-out`，不是丢弃新 Toast。
- 自动消失计时在同位置任一可见层 hover 时暂停，离开后恢复；只有 `idle` 层 hover 显示关闭 X，后层不显示 X。

### 动效参数表

| 阶段 | Frame 动效 | 触发状态 | top 系列参数 | bottom 系列参数 | 时长 | 缓动 | 说明 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 出现 | `slideFromTop` / `slideFromBottom` | `currentState="Appear"` | `y: ["-100%", 0]`, `opacity: [0.8, 1]`, `scale: [0.96, 1]` | `y: ["100%", 0]`, `opacity: [0.8, 1]`, `scale: [0.96, 1]` | `300ms` | `ease` | 整条 Toast 做轻微透明度与大小补间；rich 保持 `Background/3` 玻璃背景 |
| 退场 | `slideToTop` / `slideToBottom` | `currentState="Disappear"` | `y: [0, "-100%"]`, `opacity: [1, 0.8]`, `scale: [1, 0.96]` | `y: [0, "100%"]`, `opacity: [1, 0.8]`, `scale: [1, 0.96]` | `300ms` | `ease` | 完全按进入组合动效反向执行；距离、速度、透明度与大小变化均与入场一致 |
| 退场额外越界 | 根元素 `translate` | `exiting` / `pushed-out` | 额外 `-(index * gap + offset + 20px)` | 额外 `index * gap + offset + 20px` | `300ms` | `ease` | 与生命周期 transform 独立合成，确保 Toast 越过可视区域边缘 20px |
| 堆叠位移 | `stackTranslate` | 栈 index 变化 | `translateY(index * 8px)` | `translateY(index * -8px)` | `300ms` | `ease` | `gap=8`，由 Toaster 使用时传值；exiting 时在此基础上叠加额外越界位移 |
| 堆叠缩放 | `scale` | 栈 index 变化 | `scale=max(0, 1 - index * scaleStep)` | 同 top | `300ms` | `ease` | 默认 `scaleStep=0.05`，可由 Toaster 使用时调整 |
| 堆叠透明度 | Frame `fade` | 栈 index 变化 | `max(stackMinOpacity, 1 - index * stackOpacityStep)` | 同 top | `300ms` | `ease` | 直接合并进 appear / disappear fade，默认第 2 / 3 层为 `0.8 / 0.6`；退场终值为当前值的 `80%` |
| 层级 | 栈样式 | 栈 index 变化 | `z-index=maxVisible - index + 1` | 同 top | — | — | frontmost 位于最上层 |
| 最后一层被挤出 | `slide + fade + scale` | `pushed-out` | 沿入场方向反向位移，`opacity: [1, 0.8]`, `scale: [1, 0.96]` | 沿入场方向反向位移，`opacity: [1, 0.8]`, `scale: [1, 0.96]` | `300ms` | `ease` | 达到 `maxVisible` 后，新 Toast 入队时当前最后一层执行专属挤出动效；速度与出现动效一致 |
| 后层真实内容 | 栈样式 | `index > 0` | 保留完整 Toast 内容，仅关闭 pointer-events | 同 top | 跟随 stack transition | `ease` | 不再使用空背景壳体模拟堆叠 |
| hover 暂停 | 计时器 | 可见层 hover | 暂停同位置所有可见层自动消失倒计时 | 同 top | — | — | `idle / stack-1 / stack-n` 任一可见层 hover 都暂停整组计时；离开后恢复 |

### `<Toast />`（视觉单元）

继承 `FrameProps`（排除 `children`），并新增：


> v2.0.0 起：移除 `title` / `description` / `icon` 三个 prop。文字内容统一通过 children 外置；内置图标由 `positive` 判定(undefined 时不显示)。

---

<a id="使用示例"></a>


### 全局挂载 + 命令式触发

```svelte
<script>
    import { Button, Frame, Text, Toast, Toaster, showToast, toast } from "@snowui/components-pro";
</script>

<Toaster />

<Button onclick={() => toast("Done")}>Show Toast</Button>
<Button onclick={() => toast({ text: "Something Wrong", positive: false })}>
    Warning
</Button>
<Button
    onclick={() =>
        toast({
            text: "Saved",
            positive: true,
            variant: "rich",
            position: "top-right",
        })
    }
>
    Rich Toast
</Button>
```

### 静态使用（不通过 toast()）

```svelte
<Toast positive>Done</Toast>
<Toast positive={false}>Something Wrong</Toast>
<Toast>Plain Notice</Toast>  <!-- 不传 positive → 不显示内置图标 -->
<Toast variant="rich" positive>
    <Frame column class="flex-1 min-w-0">
        <Text>Saved</Text>
        <Text class="text-12 text-black-40">Your changes are synced.</Text>
    </Frame>
</Toast>
```

### 内嵌模式 (v1.1.0,`as="toast"`)

Toast 作为宿主子节点,点击宿主即触发,无需 id、无需手动 `showToast`。遵循 [ComponentGuidelines.md §5 浮层组件三激活模式规范](../../../specs/ComponentGuidelines.md)。

```svelte
<Toaster />

<Button variant="filled">
    保存
    <Toast as="toast" positive position="top-right">已保存</Toast>
</Button>
```

### 声明式模板 + 按钮触发

```svelte
<Toaster />

<Toast id="saved-rich-toast" template class="items-start" variant="rich" positive style="width: 15rem;">
    <Frame column class="flex-1 min-w-0">
        <Text>Text</Text>
        <Text class="text-12 text-black-40">Text 2</Text>
    </Frame>
    <Button as="trailing" variant="gray">Button</Button>
</Toast>

<Button onclick={() => showToast("saved-rich-toast", { position: "top-right" })}>
    Add Rich Toast
</Button>
```

### 替换内置图标

```svelte
<Toast positive>
    <Icon as="leading"><Heart /></Icon>
    收藏成功
</Toast>
```

---


> 此区域由用户维护；AI 修改前请先取得许可。


---




## AI Zone

### 动效组合设计记录

本节合并自 `doc/toast-motion-composition-plan.md`。该独立计划文档删除后，以本节作为 Toast 动效维护依据。

#### 原问题

早期 Toaster 为了解决后层灰角与宽度问题，把非 frontmost Toast 隐藏真实内容，只绘制一个纯背景壳体。这个方向不符合 Toast 的交互目标：

- 第 2 / 第 3 层不应该变成空图层。
- 后层应保留原本 Toast 的内容、背景、圆角与图标。
- 堆叠效果应由原 Toast 等比缩放、位移、透明度变化组合得到。
- 每个动效应只负责一个动作，最终通过 Frame 动效编排组合完成。

重构时需要同时解决以下问题：

1. 堆叠没有位置偏移，多个 Toast 叠在同一个位置。根因倾向是出现 / 退场 transform 与堆叠 transform 合成方式不清晰，后写入的 transform 覆盖了堆叠位移。
2. 动效过程中不应阻止按钮再次触发 Toast。Toast 动效不应锁住页面交互，也不应在动画未完成时阻塞新的 `toast()` 调用。
3. 连续触发到一定数量后，不应等待动效队列完成才能再次触发。Toast 队列不设置“正在播放数量”上限；可见层数可以限制为 3，但入队能力不能被限制。
4. 每个 Toast 的动效必须独立。出现、堆叠、退场不能被揉成一个总动效；当 Toast 从停留进入堆叠层，或从堆叠层恢复时，应触发对应的独立状态动效。

#### 目标架构

Toast 动效分两层：

1. **单条 Toast 生命周期状态**：描述一条 Toast 当前处于出现、停留、堆叠、退场中的哪一类状态。
2. **原子动效组合**：每个状态迁移只组合当前迁移需要的原子动作，不把所有动作合并成一个长期运行的动效。

| 状态 | 含义 | 视觉目标 |
| :--- | :--- | :--- |
| `appearing` | 新 Toast 进入视口 | 从出现方向滑入并淡入 |
| `idle` | 最前层停留态 | `translateY(0) scale(1) opacity(1)` |
| `stack-1` | 第二层堆叠态 | `translateY(gap) scale(1 - scaleStep) opacity(1 - stackOpacityStep)` |
| `stack-2` | 第三层堆叠态 | `translateY(gap * 2) scale(1 - scaleStep * 2) opacity(1 - stackOpacityStep * 2)` |
| `exiting` | 最前层退场 | 从当前位置按出现方向反向滑出并淡出 |
| `pushed-out` | 最后一层被新 Toast 挤出可见层 | 以该位置入场出现的方向继续位移并渐隐，形成“被挤出去消失”的感觉 |

`idle` 是最上面的停留层，`stack-1` 是第二层，`stack-2` 是第三层。`idle` 不建议改名为 `stack-1`：`stack-*` 只表示后层堆叠态，保留 `idle` 可以清楚表达“最上层退场后，第二层从 `stack-1` 恢复为 `idle`”。可见层数必须可配置；默认最多展示 3 个可见层，但 store 可以继续接收任意数量 Toast。第 4 个及之后只影响队列和状态迁移，不阻塞新的触发。

#### 状态迁移

| 触发 | 迁移 | 动效 |
| :--- | :--- | :--- |
| 新 Toast 入队 | `appearing -> idle` | 进入组合动效 |
| 新 Toast 入队导致旧 frontmost 后移 | `idle -> stack-1` | 变成堆叠状态 1 |
| 新 Toast 入队导致第二层后移 | `stack-1 -> stack-2` | 变成堆叠状态 2 |
| 新 Toast 入队导致最后一层离开可见层 | `stack-2 -> pushed-out` | 最后一层被挤出动效，必须按入场方向位移 + 渐隐 |
| frontmost 消失后第二层前移 | `stack-1 -> idle` | 从堆叠状态 1 恢复为停留 |
| frontmost 或第二层消失后第三层前移 | `stack-2 -> stack-1` | 从堆叠状态 2 变回堆叠状态 1 |
| 用户点击最上层 X | `idle -> exiting`，同时 `stack-1 -> idle` | 最上层退场；第二层恢复为停留态 |
| 最上层退场后第三层前移 | `stack-2 -> stack-1` | 第三层补位为第二层 |

关键原则：

- 状态迁移是每条 Toast 自己的，不存在全局“动效队列锁”。
- `toast()` 调用只负责入队，不等待任何动效完成。
- 动效期间 Toast Portal 只能让 Toast 自身接收必要交互，不能覆盖或阻塞页面按钮点击。
- 可见层限制必须由 `maxVisible` 配置控制，只影响渲染目标状态，不限制 store 中 Toast 数量。
- 新入队时，应同步计算所有受影响 Toast 的下一状态：新条目进入 `appearing`，原 `idle` 进入 `stack-1`，原 `stack-1` 进入 `stack-2`，原最后一层进入 `pushed-out`。
- 只有 `idle` 层在 hover 时显示 X 图标。后层 `stack-1 / stack-2` 不显示 X，不支持单独关闭；点击 X 只触发 `idle -> exiting`，并让 `stack-1 -> idle`、`stack-2 -> stack-1` 依次补位。
- 当可见层数达到 `maxVisible` 后，再加入新 Toast 时，当前最后一层始终触发专属的“最后一层被挤出动效”，而不是普通关闭。
- “最后一层被挤出动效”的方向等于该位置 Toast 的入场方向：top 系列从上方入场，被挤出时继续向上位移并渐隐；bottom 系列从下方入场，被挤出时继续向下位移并渐隐。

#### 原子动效

Toast 动效拆成 4 类原子动效：

| 原子动效 | 职责 | 当前参数 |
| :--- | :--- | :--- |
| `slide` | 负责出现 / 退场的 y 位移 | 内层 FramePro 只使用 `y: ["-100%", 0]`、`y: [0, "-100%"]`；bottom 系列方向相反 |
| `fade` | 负责透明度变化 | 出现 `opacity: [0.8, 1]`；退场 `opacity: [1, 0.8]` |
| `scale` | 负责出现 / 退场与叠加时等比缩放 | 出现 `scale: [0.96, 1]`；退场 `scale: [1, 0.96]`；叠加 `scale: 1 - index * scaleStep` |
| `stackTranslate` | 负责叠加时位置错位 | `translateY(index * gap)`；exiting / pushed-out 时额外叠加 `index * gap + offset + 20px` |

组合原则：

- 出现 = 内层 `slide + fade + scale`，只服务 `appearing -> idle`。
- 普通退场 = 内层 `slide + fade + scale`，只由 `idle -> exiting` 触发；内层退场保持 `translateY(±100%)`，外层 slot 在 exiting 时额外叠加 `index * gap + offset + 20px` 位移，先抵消当前堆叠偏移，再使 top 系列 Toast 底部越过视口顶部 20px，bottom 系列 Toast 顶部越过视口底部 20px。
- 最后一层被挤出 = 内层 `slide + fade + scale` + 外层额外越界位移，由最后一层 `-> pushed-out` 触发；位移方向沿入场方向继续离开，终点同样是可视区域外 20px。
- 变成堆叠状态 1 = `stackTranslate + scale + opacity`。
- 变成堆叠状态 2 = `stackTranslate + scale + opacity`。
- 从堆叠状态 2 变回堆叠状态 1 = `stackTranslate + scale + opacity`。
- 从堆叠状态 1 恢复停留 = `stackTranslate + scale + opacity`。
- transform 合成必须保留内层出现 / 退场位移与外层堆叠位移，不允许写到同一个元素上互相覆盖。
- 残影修复的关键写法：不要把 `calc(±100% ± offset ± 20px)` 写进内层 `whileDisappear`；应保持内层 `±100%`，在外层 slot 的 `--snowui-toast-stack-transform` 里对 `exiting / pushed-out` 额外加 `index * gap + offset + 20px`。

数值规则：

- `scale / fade / slide / stackTranslate` 的具体数值不是写死在原子动效里的。
- 原子动效只提供“动作类型”和可组合接口。
- 具体数值由 Toast / Toaster 使用时传入，例如 `scaleStep`、`stackOpacityStep`、`stackMinOpacity`、`gap`、`offset`。
- 同一个原子动效在不同组件中可以复用，但数值由使用方决定。

#### OSS / PRO 归属

该归属按 `specs/GUIDELINES.md`、`specs/ComponentGuidelines.md §0.5` 与 `components/src/components/Frame.md §1` 的作用半径原则执行：

| 能力 | 归属 | 原因 |
| :--- | :--- | :--- |
| scale / fade / slide / stackTranslate 等基础动效配置 | OSS：`components/src/motion/` 与 OSS Frame 默认动效系统 | 只描述单个 Frame 自身的 transform / opacity / timing，作用半径 = 1 个 Frame |
| Frame 对多个原子动效的同元素合成输出能力 | OSS：`components/src/logic/` | 仍只影响当前 Frame 自己，不控制其他 Frame |
| Toast / Toaster 的堆叠策略、队列状态、每条 Toast 的 stack index 计算 | PRO：`pro/src/components/Toaster.svelte` / `pro/src/logic/toast.svelte.ts` | Toast 是 PRO 全局通知组件，负责跨 Toast 条目的队列与层级管理 |
| 多个 Toast Frame 的出现、退场、堆叠顺序编排 | PRO：FramePro / PRO motion orchestration 能力 | 涉及多个 Frame 的启动时机、层级和状态协调，作用半径 > 1 |

结论：

- 基础动效必须作为 OSS 动效原语落在 OSS Frame / `components/src/motion/` 体系中。
- 编排能力必须留在 PRO，不把跨 Frame 的 Toast 队列编排下放到 OSS Frame。
- Toaster 只能把 stack index 映射为一组原子动效参数；原子动效本身不应命名为 Toast 专属能力。

#### 实施与验证记录

实施要求：

1. 明确 Toast 状态模型：状态至少覆盖 `appearing`、`idle`、`stack-1`、`stack-2`、`exiting`、`pushed-out`；不引入 `stack-1-exiting`；`pushed-out` 是可见层达到 `maxVisible` 后被新 Toast 挤出的专属状态。
2. 补齐 Frame 侧可组合 transform 输出能力：支持 `x/y/scale/opacity` 同时存在时合并为一个 transform，避免出现 / 退场位移与堆叠位移互相覆盖。
3. 新增通用缩放动效：命名为通用 motion 名称，不使用 Toast 专属命名，可和 `slide`、`fade` 同时组合。
4. 重写 Toaster 堆叠：移除非 frontmost 的纯背景壳体，保留真实 Toast 内容；根据每条 Toast 状态写入 Frame 组合动效；`maxVisible` 只限制可见层数，不限制 Toast 入队数量。
5. 新增 Toast 示例：TS-09 展示 scale 可以和位移、透明度叠加，连续添加 4 个 Toast 观察 `idle -> stack-1`、`stack-1 -> stack-2`、`stack-2 -> pushed-out`。
6. 同步文档：更新 `Toast.md` 动效参数表与本节维护说明。
7. 验证：运行 `node ../scripts/check-standards.js`；用浏览器验证 TS-09 最多显示 3 层、第 2 / 第 3 层是真实 Toast、三层有位置错位与缩放差异、出现/退场保持现有效果、第 4 次点击最底层执行 pushed-out、动效过程中按钮仍可继续点击。

当前实现状态：

- 已完成：真实 Toast 三层堆叠，移除空背景壳体。
- 已完成：出现 / 退场拆为 `slide + fade + scale`，并抽成 OSS `motion/primitives.ts` 原子构建器。
- 已完成：Toast 槽位切到 PRO `FramePro`，由 PRO 侧承接 `currentState`、`whileAppear`、`whileDisappear` 与最终组合输出。
- 已完成：堆叠 transform 合成拆成内外两层，避免位置偏移丢失。
- 已完成：动效播放期间不阻塞按钮点击，不限制 `toast()` 连续触发。
- 已完成：当前堆叠阶段仍由 `indexFromFront` 映射视觉状态；文档保留显式状态迁移模型作为后续维护目标。


> **内置图标统一（2026-09-11）**：功能图标的资源比例、尺寸优先级和按钮宿主遵循 [ComponentGuidelines §2.7](../../../specs/ComponentGuidelines.md#27-组件内置-icon-规范)。内置无外壳操作复用 Button bare；有padding的纯图标操作使用 iconOnly。尺寸从所属宿主继承，显式覆盖优先。`parts.Button` 配置默认内置操作按钮（包含 size、class、style），功能事件、ARIA和角色仍由父组件控制。


> **2026-09-10 浮层内边框**：rich 变体复用共享浮层视觉，在原有投影上叠加 `var(--border-2)`（16px 根字号下 1px）、`var(--surface-1)` 的 inset 内边框，不占用布局尺寸。共享契约见 [StyleSpec §2.13](../../../specs/StyleSpec.md#213-quick-action-共享浮层视觉强制)。

<a id="开发者指南-ai"></a>

### 开发者指南 (AI)

### 模块索引

| 文件 | 说明 |
| :--- | :--- |
| `Toast.svelte` | 单个 Toast 的视觉外壳；三槽位，default / rich 变体 |
| `Toaster.svelte` | 全局 Portal；订阅 store；管理 6 位置堆叠与自动消失 |
| `../logic/toast.svelte.ts` | 单例 store + `toast()` / `dismissToast()` / `dismissAllToasts()` |

### 关键字映射

| 关键字 | 处理方式 | 说明 |
| :--- | :--- | :--- |
| `variant` | `data-variant` + class | `snowui-toast-default` / `snowui-toast-rich` |
| `size` | `data-size` + class | `snowui-toast-size-sm` / `snowui-toast-size-md` |
| `position` | `data-pos` | 仅用于读取/动效方向；定位由 Toaster 控制 |
| `positive` | 内置 Icon 渲染 | `true` → `CheckCircle`(success)；`false` → `Warning`；`undefined` → 不渲染 |

### 关联关系

- **共享视觉基类**：`.snowui-quick-action-panel`（rich 变体；定义于 `components/src/styles/layout.css`）
- **内置 Icon**：Components `ComponentIcon` 的 `check-circle` / `warning` / `x-circle`；可由应用级 `IconProvider` 替换并保留包内回退
- **Skeleton 登记**：`components/src/components/Skeleton.svelte` 的 `COMPONENT_CLASS_MAPPING` 增加 `snowui-toast → toast`

---

## 更新日志

- 2026-09-21：统一使用文档、源码属性表与 Site / LLM 阅读入口；仅文档修订，不改变组件行为。

### v2.3.2 (2026-07-05)

#### 修复

- 按外置 Icon 替换协议检测 Toast 的直系 `leading` 子项；存在外置 `as="leading"` 时不再渲染内置 CheckCircle / Warning，修复 TS-04 同时显示两个图标的问题。

### v2.3.0 (2026-06-18)

#### 样式调整

- default 变体新增 `backdrop-filter: blur(var(--size-10))` 与 WebKit 前缀，背景模糊档位与共享浮层面板一致。
- rich 变体在 Toaster 的 idle 层不再覆盖为不透明 `Background/1`，统一保留 `.snowui-quick-action-panel` 提供的 `Background/3 + blur(var(--size-10))`。该调整选择玻璃效果优先，允许堆叠后层内容通过半透明背景产生轻微透出。
- Toaster 不再使用独立 slot / measure 包装层承接动效。Toast 根元素自身同时承接堆叠 `translate` / `scale`、生命周期 `transform`、组合 opacity、背景与 `backdrop-filter`，避免外置 blur plate 在内容淡入淡出时单独暴露为灰色层。
- 单层结构中的透明度直接合并进 Frame fade 配置：appear 为 `[80% × stackOpacity, stackOpacity]`，disappear 为 `[stackOpacity, 80% × stackOpacity]`。默认第 2 层稳定态 `0.8`、第 3 层 `0.6`，退场终值分别为 `0.64 / 0.48`；不复用会与 Frame blur motion 冲突的 `filter` 属性。
- 移除已无消费方的 `--snowui-toast-idle-background-override`。

### v2.2.0 (2026-05-15)

#### 新增

- **内嵌模式 `as="toast"`**:Toast 作为宿主子节点(如 Button),自动发现父元素并绑定 click 事件触发,无需 id 与手动 `showToast`。遵循 [ComponentGuidelines.md §5 浮层组件三激活模式规范](../../../specs/ComponentGuidelines.md)。Toast 三模式齐备:面板 / 内嵌 / 模版。
- 新增 TS-30 / TS-31 示例覆盖 Inline 模式 default / rich 变体。

### v2.1.0 (2026-05-11)

#### 修复
- Toast 可见栈任一层 hover 时暂停同位置所有可见层自动消失计时，离开 hover 后按剩余时间恢复；后层仍不显示 X。
- Toaster measure 层显式承接 `--su-motion-transform` / `--su-motion-opacity`，修复普通退场缺少位移动效的问题。
- Toaster idle 层 rich 背景曾改为不透明 `--background-1`，用于避免后层 Toast 内容透出；该历史策略已在 v2.3.0 撤回。
- 超过 `maxVisible` 时，当前最后一层 Toast 进入 `pushed-out` 状态，沿入场方向继续位移并渐隐，形成“被新层挤出”的专属退出动效。
- Toaster 移除 `document.startViewTransition` 更新包装，避免浏览器级过渡队列在动效过程中阻塞按钮连续触发。
- Toaster 将外层槽位用于堆叠 transform / opacity，内层 FramePro 用于出现与退场，避免 appear/disappear transform 覆盖堆叠位移。
- 退场残影修复采用“双层 transform”方案：内层 FramePro 保持 `translateY(±100%)` 的稳定退场动效，外层 slot 在 `exiting / pushed-out` 时额外平移 `index * gap + offset + 20px`，不要把 `calc(±100% ± offset ± 20px)` 写进内层 `whileDisappear`。
- 将 Toaster 堆叠槽位从普通 `div + animate:flip` 改为 `Frame/FramePro`，堆叠 transform / opacity 过渡统一消费 Frame motion。
- `dismissToast()` 改为先标记 `exiting` 并进入 `Disappear` 状态，退出动效结束后再移除队列项，避免 Toast 瞬间消失。
- Frame 新增 `currentState` 受控状态入口，并让 `Appear` / `Disappear` 状态在 Frame inline motion 中实际输出动效样式。
- 默认停留时长、区域宽度、堆叠 gap、缩放系数、隐藏规则与 top/bottom 滑入滑出方向对齐 HeroUI。
- 新增通用动效原子与组合预设，不使用 Toast 专属命名：`slide` / `fade` / `scale` / `stackTranslate`；Toast 侧按需组合为 `slideFromTop` / `slideToTop` 等具体用法。

### v2.0.0 (2026-05-11)

#### 破坏性变更
- 移除 `<Toast>` 的 `title` / `description` / `icon` 三个 prop；所有文字与槽位结构改为 children 外置
- 新增 `<Toast>` 的 `positive?: boolean` prop:`true`=CheckCircle(积极)、`false`=Warning(问题)、`undefined`=不显示内置图标
- `toast()` 命令式 API 同步:`title`/`description`/`icon` → `text` + `positive`;字符串语法仍可用,等价 `{ text }`
- 移除 `ToastIconKind` 类型导出

#### 修复
- 修复 `.snowui-toast-builtin-icon` 选择器从未匹配的问题:Icon 组件 class 落在内层 `.snowui-icon` 上(不是直接子代),选择器由 `>` 改为后代;且改用 Icon 暴露的 `--snowui-icon-width/height-override` 闭环覆盖默认 1rem 尺寸 → sm/md 现在正确区分(16/20)
- 修复"外置 Icon 替换内置图标"规则失效:按 LayoutProtocol §4.1.5 重写为 `:has(~) + :has(.builtin)` 形式(对齐 SearchInput),精准命中内置 wrapper

### v1.0.0 (2026-05-10)

#### 新功能
- 初始实现：`<Toast>` 视觉单元 + `<Toaster>` 全局 Portal + `toast()` 命令式 API
- 三槽位 Leading / Content / Trailing；内置 CheckCircle / Warning 支持外置 Icon 替换
- default（深色玻璃 pill，sm / md）与 rich（白底卡片，复用 `.snowui-quick-action-panel`）两个变体
- 6 个出现位置（top / top-left / top-right / bottom / bottom-left / bottom-right），默认 top；距边缘 40px
- 自动消失（默认 3 秒）+ 同位置堆叠 + `animate:flip` 平滑前移（历史实现，已在 v2.1.0 被 Frame 槽位方案替代）
- 出入场动效使用显式组合的 `slide + fade + scale`；生命周期状态仍由 FramePro 的 `Appear / Disappear` 承接
