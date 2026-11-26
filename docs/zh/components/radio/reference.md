# Radio

> **版本**: v1.4.0
> **职责**: 在一组互斥选项中选择一项，适合需要直接展示所有选项的表单设置。
> **包归属**: `@snowui-design-system/components`
> **文档修订**: 2026-10-23

## 组件介绍

在一组互斥选项中选择一项，适合需要直接展示所有选项的表单设置。

## 使用选择


用于一组选项中的单选。多选用 Checkbox，分段参数选择用 Segmented；为组和选项提供可访问名称。

- 同组使用 bind:group 和不同的稳定 value；无初始选择可用 null。
- 组件支持取消当前项并写入 undefined，不能假定已选项永远不可取消；提供可读标签。


## 快速开始

以下示例展示推荐的基本组合。更多场景与组合限制见后文。


```svelte
<script lang="ts">
	import { Radio } from '@snowui-design-system/components';
	let subscribed = $state(false);
</script>

<Radio bind:checked={subscribed}>Email me product updates</Radio>
```


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

主布局模型：**内联外壳布局**。定义见 ../../../docs/standards/LayoutProtocol.md §12.4。

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


<Radio bind:checked>单个选项</Radio>


<Radio bind:group={selected} value="option1">选项 1</Radio>
<Radio bind:group={selected} value="option2">选项 2</Radio>
<Radio bind:group={selected} value="option3">选项 3</Radio>


<Radio bind:group={selected} value="filled" variant="filled">填充样式</Radio>


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
