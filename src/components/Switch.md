# Switch

> **许可阅读**：首次阅读组件文档、源码或 npm 使用流程，先读完整 [LICENSE](../../LICENSE)；同任务同版本去重。公开 API 配置与内部实现修改分别按许可处理；全部组件使用统一运行包，源码权益以许可为准。

> **版本**: v1.1.17
> **职责**: 在开启与关闭之间切换，适合需要即时生效的设置和功能开关。
> **包归属**: `@snowui-design-system/components`
> **文档修订**: 2026-09-21

## 组件介绍

在开启与关闭之间切换，适合需要即时生效的设置和功能开关。

## 使用选择

<!-- usage-guide:start -->
用于立即生效的二态设置。表单多选使用 Checkbox，互斥参数组使用 Radio 或 Segmented。

- bind:checked 同步开关状态；value 只表示内部输入值，不决定开关状态。
- 当前 name / form 不转发给内部 input；需要原生表单提交时由表单层显式同步字段。提供可读标签。
<!-- usage-guide:end -->

## 快速开始

以下示例展示推荐的基本组合。更多场景与组合限制见后文。

<!-- quick-start:generated -->
```svelte
<script lang="ts">
	import { Switch } from '@snowui-design-system/components';
	let subscribed = $state(false);
</script>

<Switch bind:checked={subscribed}>Email me product updates</Switch>
```
<!-- /quick-start:generated -->

## API

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| checked | `boolean` | `false` | 开关状态，支持 `bind:checked`。点击标签或聚焦后按 Space 切换；绑定变量、可见轨道与原生输入状态同步。禁用时用户操作不改变状态。 |
| value | `any` | — | 传给内部原生 checkbox 的值，不决定开关状态，也不建立选择组。当前 `name` / `form` 等其余属性传给外层标签，不转发至内部 input，因此仅设置 `value` 不会产生具名表单提交项。 |
| size | `ResourceSize \| number` | — | 可见轨道高度，数字按根字号为 16px 时的名义 px 解析，外侧留白另计。支持 12 / 16 / 20 / 24 / 28 / 32 / 40 / 48 / 80 及其它有限正数；未传时依次读取父级尺寸 Context 的 `iconSize`、`size`，最后回退到 16。非法数字回退到默认尺寸 Token。显式值优先，随根字号缩放。 |
| disabled | `boolean` | `false` | 禁用原生输入及用户切换，保留当前开关值和标签，退出 Tab 顺序。外部仍可更新 `checked`。 |
| children | `Snippet` | — | 无参数标签内容，显示在轨道后；省略时不显示标签。标签文字同时为内部开关提供可访问名称，可通过内容 Snippet 组合文本。 |
| enableResponsive | `boolean` | `false` | 传给根 Frame，启用其容器内容适配监听；不改变 Switch 的标准尺寸值域。通用行为见 [Frame 能力开关](Frame.md)。 |
| enableContext | `boolean` | `false` | 传给根 Frame，控制向子组件提供状态、加载与动效等 Context；不控制 Switch 读取父级尺寸 Context。通用行为见 [Frame 能力开关](Frame.md)。 |

未重新声明的继承能力请查所属基础组件文档；本表只列本组件源码具名公开属性。

## 使用边界与详细说明

<a id="布局模型"></a>

### 布局模型

主布局模型：**内联外壳布局**。定义见 [../../../specs/LayoutProtocol.md §12.4](../../../specs/LayoutProtocol.md)。

Switch 属于“控件视觉体 + label”的内联外壳子类：

- 根节点保持 `inline-flex`，内容整体 Hug。
- `.snowui-switch-track` 是固定 Hug 的控件视觉体。
- `.snowui-switch-label` 是可选 label，默认 Hug，不承担 Fill。
- track 与 label 的距离由 `--snowui-switch-gap` 管理，可通过 `--snowui-switch-gap-override` 覆盖。
- `size` 表示可见轨道高度；四边透明留白各为 `size / 14`，控件占位高为 `size × 8 / 7`、宽为 `size × (1.8 + 1 / 7)`。例如 `size={28}` 轨道为 50.4×28px，四边各留 2px，占位为 54.4×32px。
- 留白与 track / thumb 随 size、根字号和尺寸 Token 等比缩放，留白仍可点击；label 位于留白壳外。

---

<a id="使用示例"></a>

### 使用示例

```svelte
<script>
  import { Switch } from '@snowui-design-system/components';
  let checked = $state(false);
</script>

<!-- 基础用法 -->
<Switch bind:checked>开关</Switch>

<!-- 自定义尺寸 -->
<Switch bind:checked size={20}>大号开关</Switch>

<!-- 禁用状态 -->
<Switch checked disabled>禁用开关</Switch>
```

<a id="状态"></a>

### 状态

- **unchecked**: 未选中状态，灰色轨道
- **checked**: 选中状态，主题色轨道
- **disabled**: 禁用状态，降低透明度

<a id="无障碍性"></a>

### 无障碍性

- 使用原生 `<input type="checkbox">` 确保键盘导航
- 支持 Tab 键聚焦
- 支持 Space 键切换
- 禁用状态下 `tabindex=-1`



## AI Zone

**继承**: 复用 Frame.svelte 的所有通用能力 (交互、动效、响应式)。
**默认能力开关**: `enableResponsive=false`, `enableContext=false`。

<a id="开发者指南-ai"></a>

### 开发者指南 (AI)

### 模块索引 (Module Index)

- **Switch 组件**: [./Switch.svelte](Switch.svelte)

### 关联关系

- **父组件**: [Frame.svelte](Frame.svelte)

---

<a id="样式规范"></a>

### 样式规范

### CSS 变量

| 变量 | 默认值 | 说明 |
|:---|:---|:---|
| `--snowui-switch-size` | `var(--size-4)` | 基准尺寸（16px） |
| `--switch-primary` | `var(--primary, var(--black-100, #000000))` | 激活态背景色 |
| `--switch-width` | `size * 1.8` | 轨道宽度 |
| `--switch-height` | `size` | 轨道高度 |
| `--switch-thumb-gap` | `height * 0.125` | 滑块与轨道间距（等比缩放） |
| `--thumb-size` | `height - gap * 2` | 滑块尺寸 |

### 尺寸与圆角

- **轨道圆角**: `var(--radius-full, 50%)` (pill shape)
- **滑块圆角**: `var(--radius-full, 50%)` (circle)
- **组件间距**: `var(--gap-1)` (4px)

### 状态样式

| 状态 | Track 背景色 | Thumb 位置 |
|:---|:---|:---|
| Unchecked | `--black-20` | `left: gap` |
| Checked | `--switch-primary` | `translateX(width - size - gap*2)` |
| Disabled | 同上 + `opacity: 0.5` | 同上 |

### Hover 效果 (StyleGuide 7.4)

| 状态 | Hover 叠加 |
|:---|:---|
| Unchecked | `background-image` 叠加 4% `currentColor` |
| Checked | `background-image` 叠加 20% `--white-100` |

### 动画

- **Transition**: Track 背景色与 Thumb 位置消费 Frame `control` 通用时序，默认上限为 `150ms ease-out`，与 Checkbox、Radio 的常规点击状态一致
- **减少动效**: `prefers-reduced-motion: reduce` 下取消 Track 与 Thumb 过渡，直接提交最终状态
- **阴影**: Thumb 带 Drop Shadow 2

## 更新日志

- 2026-09-21：统一使用文档、源码属性表与 Site / LLM 阅读入口；仅文档修订，不改变组件行为。

- **Switch-Docs.2026-05-25** 源码顶部历史更新日志已归档；后续新增变更统一写入本文档 更新日志，源码顶部只保留职责、当前关键架构与文档路径。

### v1.1.17 (2026-08-31)

#### 调整
- **TG-Motion.1** Track 背景与 Thumb 位移继续消费 Frame `control` 通用时序桥接，并将默认时长上限收敛为与 Checkbox、Radio 一致的 `150ms`；`prefers-reduced-motion: reduce` 下取消过渡并直接提交最终状态。

### v1.1.16 (2026-04-28)

#### 调整
- **TG-Layout.1** 按 `LayoutProtocol.md` 将组件注册为内联外壳布局，补充 track + label 的布局边界说明，并将 gap 收敛到 `--snowui-switch-gap` / `--snowui-switch-gap-override` 链路。

### v1.1.15 (2026-03-06)

#### 调整
- **TG-Bridge.4** Track 背景与 Thumb 位移过渡改为消费 Frame `control` 通用时序桥接变量，组件不再维护独立默认 duration / easing。

### v1.1.14 (2026-02-18)

#### 调整
- **TG-Adj.3** 与 Radio/Checkbox 统一动效时间与缓动曲线（`0.2s` + `cubic-bezier(0.4, 0, 0.2, 1)`），覆盖 Track/Thumb 过渡。

### v1.1.13 (2026-02-18)

#### 修复
- **TG-Fix.8** 修复 Switch hover 无效：状态选择器从 `:has(...)` 改为 `input:checked + .snowui-switch-track` 链路，提升兼容性与稳定性。

### v1.1.11 (2026-02-18)

#### 调整
- **TG-Adj.1** 默认颜色链路改为主色：未设置颜色类时激活态使用 `--primary`（行为对齐 Filled Button）。
- **TG-Adj.2** Thumb 圆形固定白色 token：`--static-white-100`。

### v1.1.10 (2026-02-18)

#### 修复
- **TG-Fix.7** 进一步修复 hover 闪动：移除 Track 颜色过渡，避免颜色链插值抖动。

### v1.1.9 (2026-02-18)

#### 修复
- **TG-Fix.5** 修复 hover 进出时的消失闪动：overlay 改为固定 gradient，通过变量切换透明度，避免 hover 时切换 `background-image`。
- **TG-Fix.6** 恢复激活态对比：选中轨道恢复主色实底，Thumb 恢复 `--white-100`。

### v1.1.8 (2026-02-18)

#### 修复
- **TG-Fix.4** 修复 hover 闪动：Track 改为常驻 0% overlay 基线，hover 仅切换 overlay 强度，避免 `none -> gradient` 切换闪烁。

### v1.1.7 (2026-02-18)

#### 调整
- **TG-Color.1** 组件颜色统一改为 `currentColor` 链路，支持 `class="text-*"` 覆盖整组件。
- **TG-Color.2** 原灰阶层改为同色透明度层（20%/40%），激活与未激活统一同色体系。

### v1.1.6 (2026-02-18)

#### 修复
- **TG-Fix.3** 修复大尺寸下 thumb 视觉贴边：`thumb-gap` 改为基于高度等比缩放（`gap = height * 0.125`，16 时为 2px）。

### v1.1.5 (2026-02-18)

#### 优化
- **TG-Opt.1** 尺寸梯度与 Icon 组件对齐：`16/20/24/28/32/40/48/80`。
- **TG-Opt.2** 尺寸链路改为 `--size-*` token，且以高度为基准推导宽度与 thumb 尺寸。
- **TG-Opt.3** 补齐 `override -> internal -> token` 变量桥接链。

### v1.1.4 (2026-02-18)

#### 修复
- **TG-Fix.2** 移除组件内 `cursor: pointer`，禁用态 cursor 统一由 Frame `Surface` + `.snowui-disabled` 通用链路控制。

### v1.1.3 (2026-02-03)

#### 修复
- **TG-Fix.1** 补齐 Frame 能力开关显式传参并对齐内部变量命名规范

---

---

> **以下内容供 AI 阅读，用于维护代码与文档的关联**
