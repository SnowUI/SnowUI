# Switch

> **版本**: v1.2.0
> **职责**: 在开启与关闭之间切换，适合需要即时生效的设置和功能开关。
> **包归属**: `@snowui-design-system/components`
> **文档修订**: 2026-10-23

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
| required | `boolean` | `false` | 是否必须选中；空值提交仅短暂红边闪动，不显示文字。 |
| name | `string` | — | 内部原生 input 的表单字段名；Radio 使用同名分组。 |
| form | `string` | — | 关联表单元素的 id。 |
| disabled | `boolean` | `false` | 禁用原生输入及用户切换，保留当前开关值和标签，退出 Tab 顺序。外部仍可更新 `checked`。 |
| singleLine | `boolean` | `true` | 默认标签与控件保持单行，附件不压缩；窄宽时原始标签可省略显示并保留完整可访问名称，不复制 children。复杂多行内容可显式设为 false，由该内容拥有布局。需要全文提示时组合 Text lines={1}。 |
| gap | `number` | — | 继承 Frame 的间距 Token 序号；省略时使用原组件间距，显式值覆盖组件间距。有效间距至少 4 CSS px，包含零值、根字号及 gap-scale 缩放；较大首选值保留。 |
| children | `Snippet` | — | 无参数标签内容，显示在轨道后；省略时不显示标签。标签文字同时为内部开关提供可访问名称，可通过内容 Snippet 组合文本。 |
| enableResponsive | `boolean` | `false` | 传给根 Frame，启用其容器内容适配监听；不改变 Switch 的标准尺寸值域。通用行为见 [Frame 能力开关](Frame.md)。 |
| enableContext | `boolean` | `false` | 传给根 Frame，控制向子组件提供状态、加载与动效等 Context；不控制 Switch 读取父级尺寸 Context。通用行为见 [Frame 能力开关](Frame.md)。 |

未重新声明的继承能力请查所属基础组件文档；本表只列本组件源码具名公开属性。

## 使用边界与详细说明

<a id="布局模型"></a>

### 布局模型

主布局模型：**内联外壳布局**。定义见 [../../../docs/standards/LayoutProtocol.md §12.4](../../../docs/standards/LayoutProtocol.md)。

Switch 属于“控件视觉体 + label”的内联外壳子类：

- 根节点保持 `inline-flex`，内容整体 Hug。
- `.snowui-switch-track` 是固定 Hug 的控件视觉体。
- `.snowui-switch-label` 是可选标签，空间充足时 Hug，受限时允许收缩并单行省略；原始内容及完整原生名称保留。
- track 与 label 的距离由 `--snowui-switch-gap` 管理，可通过 gap 或 `--snowui-switch-gap-override` 设置首选值；有效间距至少 4 CSS px。
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

<!-- Basic usage -->
<Switch bind:checked>开关</Switch>

<!-- Custom size -->
<Switch bind:checked size={20}>大号开关</Switch>

<!-- Disabled state -->
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


### 必填反馈

显式设置 `required` 时，空值提交只让首个无效字段聚焦并短暂闪动红色边框，外光圈保持原色；结束恢复原态，不显示空值错误文字。减少动效时仅聚焦。取消浏览器校验气泡但保留无效提交拦截；非空格式错误与业务错误继续显示文字，修正输入或重置清除提示。

`required`（boolean，默认 false）、`name`（string）和 `form`（string）传给内部原生 input。可选控件的未选中状态有效。
只有业务明确要求开启时设置 required；一般开关不设置必填。

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


### 尺寸与圆角

- **轨道圆角**: `var(--radius-full, 50%)` (pill shape)
- **滑块圆角**: `var(--radius-full, 50%)` (circle)
- **组件间距**: 首选 `var(--gap-1)`，有效间距至少为 4 CSS px。

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

### v1.2.0 (2026-10-23)

- 标签采用共享单行预设并保留原始 Snippet；窄宽时允许标签收缩，复杂多行内容可显式退出。控件与标签间距消费共享解析，零值与字体／gap 缩放不低于 4 CSS px；较大首选值、视觉体尺寸和透明留白比例保持。

- 2026-09-21：统一使用文档、源码属性表与 Site / LLM 阅读入口；仅文档修订，不改变组件行为。

- **Switch-Docs.2026-05-25** 源码顶部历史更新日志已归档；后续新增变更统一写入本文档 更新日志，源码顶部只保留职责、当前关键架构与文档路径。

### v1.1.17 (2026-08-31)

#### 调整
- **TG-Motion.1** Track 背景与 Thumb 位移继续消费 Frame `control` 通用时序桥接，并将默认时长上限收敛为与 Checkbox、Radio 一致的 `150ms`；`prefers-reduced-motion: reduce` 下取消过渡并直接提交最终状态。

### v1.1.16 (2026-04-28)

#### 调整
- **TG-Layout.1** 按 `LayoutProtocol.md` 将组件注册为内联外壳布局，补充 track + label 的布局边界说明，并将 gap 收敛到 `--snowui-switch-gap` / `--snowui-switch-gap-override` 链路。

完整历史见 [更新日志归档](../../docs/history/changelogs/Switch.history.md)。
