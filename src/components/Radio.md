# Radio

> **版本**: v1.4.0
> **职责**: 在一组互斥选项中选择一项，适合需要直接展示所有选项的表单设置。
> **包归属**: `@snowui-design-system/components`
> **文档修订**: 2026-10-23

## 组件介绍

在一组互斥选项中选择一项，适合需要直接展示所有选项的表单设置。

## 使用选择

<!-- usage-guide:start -->
用于一组选项中的单选。多选用 Checkbox，分段参数选择用 Segmented；为组和选项提供可访问名称。

- 同组使用 bind:group 和不同的稳定 value；无初始选择可用 null。
- 组件支持取消当前项并写入 undefined，不能假定已选项永远不可取消；提供可读标签。
<!-- usage-guide:end -->

## 快速开始

以下示例展示推荐的基本组合。更多场景与组合限制见后文。

<!-- quick-start:generated -->
```svelte
<script lang="ts">
	import { Radio } from '@snowui-design-system/components';
	let subscribed = $state(false);
</script>

<Radio bind:checked={subscribed}>Email me product updates</Radio>
```
<!-- /quick-start:generated -->

## API

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| checked | `boolean` | `false` | 独立使用时以 bind:checked 双向绑定选中状态；点击或按 Space 切换，再次操作会取消。分组时选中状态由 group 与 value 是否相等决定。 |
| group | `any` | — | 同组 Radio 绑定同一状态并提供不同 value。初始值应为已选项值；无初始选择可设为 null。取消当前项后写入 undefined，后续组联动仍有效。 |
| value | `any` | — | 当前选项对应的值，以严格相等与 group 比较；同组应使用唯一且稳定的值。 |
| size | `ResourceSize \| number` | — | 控件占位尺寸，支持 12/16/20/24/28/32/40/48/80 及自定义数值；未传时优先继承尺寸上下文，否则为 16。图形占尺寸的 87.5%，不改变标签字号。 |
| required | `boolean` | `false` | 是否必须选中；空值提交仅短暂红边闪动，不显示文字。 |
| name | `string` | — | 内部原生 input 的表单字段名；Radio 使用同名分组。 |
| form | `string` | — | 关联表单元素的 id。 |
| disabled | `boolean` | `false` | 禁止点击与键盘切换，并移出 Tab 顺序；保留当前选中状态。 |
| variant | `"outline" \| "filled"` | `"filled"` | filled 使用粗选中环，outline 使用细外框与中心点；两者具有相同的选择行为。 |
| singleLine | `boolean` | `true` | 默认标签与控件保持单行，附件不压缩；窄宽时原始标签可省略显示并保留完整可访问名称，不复制 children。复杂多行内容可显式设为 false，由该内容拥有布局。需要全文提示时组合 Text lines={1}。 |
| gap | `number` | — | 继承 Frame 的间距 Token 序号；省略时使用原组件间距，显式值覆盖组件间距。有效间距至少 4 CSS px，包含零值、根字号及 gap-scale 缩放；较大首选值保留。 |
| children | `Snippet` | — | 显示在圆形控件旁的标签，可组合标题和说明；建议始终提供可读标签。 |
| enableResponsive | `boolean` | `false` | 传递给 Frame 的响应式能力开关；按 Frame 的响应式配置处理布局。 |
| enableContext | `boolean` | `false` | 传递给 Frame 的通用上下文能力开关；不控制 Radio 自身读取的尺寸与 Image 角标上下文。 |

未重新声明的继承能力请查所属基础组件文档；本表只列本组件源码具名公开属性。

## 使用边界与详细说明

<a id="关键字"></a>

### 关键字

| 关键字 | Type | Default | Description |
|:---|:---|:---|:---|
| `as` | `'badge'` | - | 角色化：作为 `Image` 角标挂件 |

分组建议在外层提供带名称的 `role="radiogroup"`。使用 Tab 聚焦、Space 切换；当前组件通过绑定管理组值，不提供组内方向键导航。原生表单分组使用相同 `name`，并通过 `bind:group` 同步组件值。

<a id="布局模型"></a>

### 布局模型

主布局模型：**内联外壳布局**。定义见 [../../../docs/standards/LayoutProtocol.md §12.4](../../../docs/standards/LayoutProtocol.md)。

Radio 属于“控件视觉体 + label”的内联外壳子类：

- 根节点保持 `inline-flex`，内容整体 Hug。
- `.snowui-radio-visual` 是固定 Hug 的控件视觉体。
- `.snowui-radio-label` 是可选标签，空间充足时 Hug，受限时允许收缩并单行省略；原始内容及完整原生名称保留。
- visual 与 label 的距离由 `--snowui-radio-gap` 管理，可通过 gap 或 `--snowui-radio-gap-override` 设置首选值；有效间距至少 4 CSS px。
- `size` 表示包含透明留白的控件占位尺寸，不改变 label 的布局策略。
- 四周留白为 `size / 16`，可见图形宽高为 `size × 0.875`；例如 `size={32}` 占位 32×32px、图形 28×28px、四边各 2px。留白与图形随 size、根字号和尺寸 Token 等比缩放，留白仍可点击。
- 留白由共享控件壳持有，label 位于壳外；内边框继续按名义 size 的 `0.0625` 计算，圆角、Dot 与选中环按可见图形尺寸计算。
- `as="badge"` 只表示 Radio 作为 Image 的角标挂件，不改变 Radio 内部布局模型。

---

<a id="使用示例"></a>

### 使用示例

```svelte
<script lang="ts">
  let checked = $state(false);
  import { Radio } from '@snowui-design-system/components';
  let selected = $state('option1');
</script>

<!-- Single-selection mode -->
<Radio bind:checked>单个选项</Radio>

<!-- Grouped mode -->
<Radio bind:group={selected} value="option1">选项 1</Radio>
<Radio bind:group={selected} value="option2">选项 2</Radio>
<Radio bind:group={selected} value="option3">选项 3</Radio>

<!-- Filled variant -->
<Radio bind:group={selected} value="filled" variant="filled">填充样式</Radio>

<!-- Custom size -->
<Radio bind:checked size={20}>大号单选</Radio>
```

<a id="变体"></a>


### Outline
- 未选中：灰色边框，透明背景
- 选中：主题色圆点，灰色边框

### Filled（默认）
- 未选中：灰色边框，透明背景
- 选中：主题色背景，白色圆点

<a id="状态"></a>

### 状态

- **unchecked**: 未选中状态
- **checked**: 选中状态
- **disabled**: 禁用状态

<a id="分组行为"></a>

### 分组行为

当使用 `group` 属性时：
- 自动管理同组内的单选逻辑
- 选中一个会自动取消其他选项
- 再次点击当前选中项会取消选中
- 取消当前选中项后，`group` 值会被清空为 `undefined`
- `group` 值等于选中项的 `value`

<a id="无障碍性"></a>

### 无障碍性

- 使用原生 `<input type="radio">` 作为基础语义，并在组件内补充“再次点击可取消”逻辑
- 支持 Tab 键聚焦
- 支持 Space 键选中与取消
- 组选择由绑定管理；当前不提供组内方向键导航
- 禁用状态下 `tabindex=-1`


### 必填反馈

显式设置 `required` 时，空值提交只让首个无效字段聚焦并短暂闪动红色边框，外光圈保持原色；结束恢复原态，不显示空值错误文字。减少动效时仅聚焦。取消浏览器校验气泡但保留无效提交拦截；非空格式错误与业务错误继续显示文字，修正输入或重置清除提示。

`required`（boolean，默认 false）、`name`（string）和 `form`（string）传给内部原生 input。可选控件的未选中状态有效。
同名单选项共享必填约束；选择组内任一项即可满足。

## AI Zone

**继承**: 复用 Frame.svelte 的所有通用能力 (交互、动效、响应式)。
**默认能力开关**: `enableResponsive=false`, `enableContext=false`。

<a id="开发者指南-ai"></a>

### 开发者指南 (AI)

### 模块索引 (Module Index)

- **Radio 组件**: [./Radio.svelte](Radio.svelte)

### 关联关系

- **父组件**: [Frame.svelte](Frame.svelte)

---

<a id="样式规范-style-spec"></a>

### 样式规范 (Style Spec)

| 属性 | 值 | 说明 |
|:---|:---|:---|
| **Class** | `.snowui-radio` | 组件根类名 |
| **CSS 行为** | 组件自管 | hover 视觉由组件内部选择器声明 |
| **Tag** | `label` | 语义化标签，点击区域包含文字 |

### 2. 默认样式 (Defaults)

- **Display**: `inline-flex`, `align-items: center`
- **Gap**: 首选 `var(--gap-1)`，缩放和零值下的有效间距仍至少为 4 CSS px。
- **Cursor**: 由 Frame `Surface` 通用规则控制（可交互时 pointer，Disabled 时 default）
- **Font**: `var(--text-14)` (14px), `line-height: var(--leading-14)` (20px)

### 3. CSS 变量 (Variables)

组件使用 CSS 变量实现等比缩放：

```css
--snowui-radio-size: var(--size-4); /* 16px baseline */
--snowui-radio-border-width: calc(var(--snowui-radio-size) * 0.0625); /* 1px */
--snowui-radio-dot-size: calc(var(--snowui-radio-visual-size) * 0.5); /* 50% of visible size */
--snowui-radio-filled-border: calc(var(--snowui-radio-visual-size) * 0.3); /* 30% of visible size */
--snowui-radio-primary: var(--primary, var(--black-100, #000000)); /* Use global Primary token */
```

### 4. 状态样式 (States)

#### Unchecked
- **Visual**: 透明背景 + `var(--black-20)` 边框
- **Border Width**: `size × 0.0625`（16px 时 1px，32px 时 2px）
- **Border Radius**: `var(--radius-full, 50%)` (圆形)
- **Hover**: 填充保持不变；独立 Hover 层在单层 `20%` 黑色边框上再叠加 `20%` 黑色 inset ring，默认等效约 `36%` 黑色；仅此状态适用 `StyleSpec §2.4.3` 例外

#### Checked (Outline 变体)
- **触发**: 根节点 `[data-checked="true"]` 驱动
- **Visual**: 边框不变，内部显示 `--radio-primary` 色 Dot
- **Dot**: `scale(1)` (弹性过渡)
- **Hover**: Dot 在主色上叠加 `20%` Static White；独立边框覆盖层在基础 `20%` 黑色外框上再叠加 `20%` 黑色，默认外框等效约 `36%` 黑色
- **交互**: 允许再次点击取消，不再把 checked 态视为不可操作状态

#### Checked (Filled 变体)
- **触发**: `[data-variant="filled"][data-checked="true"]`
- **Visual**: 边框加粗 `--radio-filled-border` 并变色为 `--radio-primary`
- **Background**: `transparent` (中空效果)
- **实现细节**: 组件始终保留一层细边框；独立选中环默认宽度为 0，仅在 Filled 选中时以 `150ms` 展开为粗边框
- **Hover**: 独立覆盖层只在粗黑选中环上叠加 `20%` Static White；中间白色孔不变，选中环的点击动效不变

#### Disabled
- **Attr**: `[data-disabled="true"]`
- **Style**: `opacity: 0.5`, `pointer-events: none`, `cursor: default`

### 5. 交互细节

- **点击区域**: 原生 `<input>` 使用 `position: absolute; inset: 0` 覆盖整个 label 区域
- **取消选中逻辑**: 组件拦截 click / `Space`，统一走内部 `toggle` 逻辑，而不是完全依赖原生 radio 的不可取消行为
- **Focus**: 支持键盘导航，聚焦时显示 `4% currentColor` 的 Ring
- **动画**: Dot、基础边框与 Filled 描边默认使用 `150ms ease-out`，与 Checkbox 常规状态节奏一致；外部仍可通过组件 CSS 变量覆写。
- **减少动效**: `prefers-reduced-motion: reduce` 下取消视觉体、Dot 与选中环过渡，直接提交最终状态。
- **选中态 Hover**: Outline 分别处理 Dot 与外框；Filled 只处理粗选中环，白色孔不变

## 更新日志

### v1.4.0 (2026-10-23)

- 标签采用共享单行预设并保留原始 Snippet；窄宽时允许标签收缩，复杂多行内容可显式退出。控件与标签间距消费共享解析，零值与字体／gap 缩放不低于 4 CSS px；较大首选值、视觉体尺寸和透明留白比例保持。
- 点击继续采用既有可取消选择合同，但不取消原生点击的默认状态提交，修复取消后绑定为 false 而原生 input 仍为 checked 的漂移；Space 仍阻止浏览器重复激活。

- 2026-09-21：统一使用文档、源码属性表与 Site / LLM 阅读入口；仅文档修订，不改变组件行为。

- **Radio-Docs.2026-05-25** 源码顶部历史更新日志已归档；后续新增变更统一写入本文档 更新日志，源码顶部只保留职责、当前关键架构与文档路径。

### v1.3.17 (2026-08-20)

- **RD-Hover.5** Filled 选中 Hover 只在粗黑选中环上叠加 `20%` Static White，中间白色孔保持不变；Outline 选中 Hover 将 Dot 调整为主色叠加 `20%` Static White，并在基础外框上额外叠加 `20%` 黑色。

### v1.3.16 (2026-08-20)

- **RD-Hover.4** 按用户裁决将未选中边框 Hover 覆盖层从 `4%` 提升为 `20%` 黑色；基础边框仍为单层 `20%` 黑色，默认叠加结果等效约 `36%` 黑色，填充保持不变。该值与独立覆盖层实现已登记为 `StyleSpec §2.4.3` 限定例外。

完整历史见 [更新日志归档](../../docs/history/changelogs/Radio.history.md)。
