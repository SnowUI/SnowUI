# Field

> **版本**: v1.4.2
> **职责**: 将输入控件、标签、图标和校验反馈组织为完整的表单字段，统一外观与内容布局。
> **包归属**: `@snowui-design-system/components`
> **文档修订**: 2026-11-23

## 组件介绍

将输入控件、标签、图标和校验反馈组织为完整的表单字段，统一外观与内容布局。

## 使用选择

<!-- usage-guide:start -->
用于组合标签、输入、帮助和错误。Input / Select / Textarea 放在 Field 内时由 Field 统一相关表面；连续字段段使用 as="segment"，不要重复边框与错误区。

- label 与 error 提供默认文案，invalid 与 readonly 表达字段状态。
- 用 children 组合 Input、Select、Textarea 及附件；parts 配置默认 label / error，显式子组件自行传 Props。
<!-- usage-guide:end -->

## 快速开始

以下示例展示推荐的基本组合。更多场景与组合限制见后文。

<!-- quick-start:generated -->
```svelte
<script lang="ts">
	import { Frame, Input, Select } from '@snowui-design-system/components';
	import { Field } from '@snowui-design-system/components';
</script>

<Field
	style="width: min(100%, 22.5rem); min-width: 0; overflow: hidden; gap: 0;"
	column
>
	<Select
		as="segment"
		defaultValue="us"
		name="addressCountry"
		aria-label="addressCountry"
		options={[
			{ value: "us", label: "United States" },
			{ value: "cn", label: "China" },
			{ value: "jp", label: "Japan" },
		]}
	/>
	<Input
		as="segment"
		name="addressLine1"
		placeholder="Address"
		aria-label="addressLine1"
	/>
	<Select
		as="segment"
		defaultValue="ca"
		name="addressState"
		aria-label="addressState"
		options={[
			{ value: "ca", label: "State" },
			{ value: "ny", label: "New York" },
			{ value: "tx", label: "Texas" },
		]}
	/>
	<Frame as="segment" row gap={0} width="100%">
		<Input as="segment" name="city" placeholder="City" aria-label="city" />
		<Input as="segment" name="zip" placeholder="ZIP" aria-label="zip" />
	</Frame>
</Field>
```
<!-- /quick-start:generated -->

## API

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| invalid | `boolean` | `false` | 容器级无效态，强制显示错误边框 |
| readonly | `boolean` | `false` | 容器级只读态 |
| label | `string \| Snippet` | — | 生成内置 `<Text as="label">`；默认不生成。 |
| error | `string \| Snippet` | — | `invalid=true` 时生成内置 `<Text as="error">`；默认不生成。 |
| parts | `ComponentPartsOf<{ Text: typeof Text }>` | — | 配置内置 label / error Text。 |
| children | `Snippet` | — | 自由组合的字段内容 |

未重新声明的继承能力请查所属基础组件文档；本表只列本组件源码具名公开属性。

## 使用边界与详细说明

<a id="2026-04-04-表单样式规则"></a>

### 表单组合与间距

- 基础节奏统一：`Field` 默认 `padding = 12 / 16`，`gap = 8`
- `Input / Select / Textarea` 单独使用时：组件自身带 `12 / 16` padding 和 `8` gap
- 放进 `Field` 后，先看有没有 `as="segment"`
- 没有 `as="segment"`：由外层 `Field` 负责 `12 / 16` padding 与 `8` gap；`Input / Select / Textarea` 去掉组件自身 padding，但保留组件自身 gap
- 有 `as="segment"`：这是连续字段表面的一段；保留组件自身的 padding 与 gap
- `Input` 内 icon 的最终位置由 `Input` 自身控制；`Field` 不额外给 icon 追加新的偏移规则
- `Input as="segment"` 时，icon 到最近边框或分割线的距离仍保持 `16px`
- `segment` 之间才有分割线：横向是左右分割线，纵向是上下分割线
- 相邻 `segment` 之间只能有一条分割线，不能重复画线
- `label / description` 不负责 padding、gap、分割线，它们只是内容元素
- 分段 Field 的统一 `error` 位于连续输入外框下方，不进入任何 segment 或分割线网格
- segment 内的 Input / Select / Textarea 只声明 `invalid`，错误文案统一交给 `Field.error`
- 普通 `label + host + error`：不作为 padding、gap 的判断依据，只负责文字内容
- `Field row` 或 `Field column` 里，如果是连续输入段，子项要显式写 `as="segment"`

<a id="组件定位"></a>

### 组件定位

`Field` 是表单体系里的“外壳容器”：

- 它负责当前输入型组件的默认视觉：背景、圆角、边框、focus ring、分隔线。
- 它负责把多个 `Input / Select / Textarea / Icon / Text / Checkbox / Switch` 组合成一个统一字段表面。
- 它负责默认非 `segment` 字段的 padding 与 gap，并在 `segment` 场景下组织连续字段表面的分割线。

这意味着：

- `Input / Select / Textarea` 是字段宿主（host）
- `Field` 是字段容器（container）
- 推荐用法是按结构显式声明：普通宿主直接放入 `Field`，连续字段段显式写 `as="segment"`

<a id="frame-能力继承"></a>

### Frame 能力继承

`Field` 自身仍然是一个 `Frame` 封装，因此保留：

- `responsive / stateStyle / customStates / variants / styles`
- `Hover / Click / Focus / whileAppear / timeline / orchestrate`
- `loading / skeleton / renderHints`
- `as / use / layoutId / itemId / scope / access`

也就是说，`Field` 不是写死的表单盒子，而是带字段语义的 `Frame` 容器。

<a id="关键字-keyword"></a>

### 容器协议

`Field` 会通过上下文向后代宿主暴露“当前位于字段容器内”的协议。

- `Input / Select / Textarea` 检测到该协议后，会退化为无外壳 host
- host 在容器中会自动带上 `.snowui-field-host`，由 `Field` 负责统一 padding、分隔线、背景和 focus ring
- `invalid / readonly / disabled` 可以由 `Field` 自己声明，也可以由 host 自己声明；容器会通过 `:has()` 汇总这些状态

这套协议的目标是：字段视觉只维护一份，交互宿主各自只保留原生行为和自身规则。

### 错误反馈 Shake

`Field invalid` 表示稳定错误视觉：错误边框、错误提示区域和子输入宿主的错误汇总。“提交失败 / 输入错误”的一次性 shake 已默认接入，消费方不需要传额外 prop，也不需要知道内部 CSS 类名。

推荐仍然只声明普通错误态，整块字段表面会自动反馈：

```svelte
<Field label="邮箱" error="请输入有效邮箱。" invalid>
    <Input type="email" invalid placeholder="name@example.com" />
</Field>
```

当内部 `Input / Select / Textarea` 进入 invalid 而 `Field` 本身未显式声明 `invalid` 时，`Field` 也会汇总后整体 shake；嵌入态 host 自身不单独抖动，避免嵌套位移叠加。

错误态与 shake 不会自动聚焦，也不会模拟 `focus-within`；焦点态只来自用户真实聚焦、显式 `autofocus` 或业务代码主动调用 `focus()`。

<a id="布局模型"></a>

### 布局模型

主布局模型：**槽位宿主布局**。定义见 [../../../docs/standards/LayoutProtocol.md §12.3](../../../docs/standards/LayoutProtocol.md)。

Field 只拥有外部 Leading / Content / Trailing、区域编排、连续字段表面和分割线；内部 Input / Select 或显式 singleLine 内容行继续拥有自己的布局、对齐与间距。Field 自身启用 singleLine，或直接组合 leading / trailing 附件时，图文有效间距至少为 4 CSS px；普通 row / col / segment 的结构性零间距与多行说明保持。

Field 是字段表面的槽位宿主特化：

- 根节点固定 `enableAutoLayout={true}`，普通外部传入不应关闭 Field 的三槽位协议。
- 未传 `error` 时仍由 Frame 作为唯一根；传入 `error` 时采用与 Input 一致的无视觉 `.snowui-field-error-layout`，内部第一项是真实 Field Frame surface，第二项是外置错误 Text。wrapper 不持有 Field 的边框、背景或交互视觉。
- `leading / host / trailing` 映射为 Leading / Content / Trailing；host 负责 Fill，必须 `min-width: 0`。
- `label / description / error / row / col / segment` 是 Field 自己的区域协议，不属于通用三槽位核心。
- `segment` 场景由 Field 负责连续字段表面、分割线和切角；这部分是 Field 特有规则，不应下沉到 `auto-layout.css`。
- `Input / Select / Textarea` 进入 Field 后退化为 `.snowui-field-host`；是否保留自身 padding 由 `as="segment"` 决定。

<a id="角色协议-as"></a>

### 角色协议 (`as`)

`Field` 自身不限制子组件类型，而是通过 `as` 角色识别不同部分。

| 角色 | 推荐组件 | 描述 |
| :--- | :--- | :--- |
| `label` | `Text` / `Frame` | 字段标题 |
| `description` | `Text` / `Frame` | 辅助说明 |
| `error` | `Text` / `Frame` | 错误提示 |
| `row` | `Frame` | 一行组合容器，用于图标 + 输入、双列输入、分段卡片等 |
| `col` | `Frame` | 一列组合容器，用于字段内的局部竖向分组、分段块和复合表面 |
| `segment` | `Frame` | 字段内部的单段内容容器，用于显式声明一段连续字段表面 |
| `leading` | `Icon` / `Button` / `Frame` | 行首附加内容 |
| `trailing` | `Icon` / `Button` / `Frame` | 行尾附加内容 |

### 推荐组合规则

- 一个简单字段通常是：`Field > Input`
- 需要整块水平排列时可以直接写：`Field row > host + host`
- 需要整块竖向排列时可以直接写：`Field column > host + row`
- 带标题/错误提示通常是：`Field > label + host + error`
- 一个输入宿主加前后配件时，优先写：`Field > leading + host + trailing`
- 需要局部竖向分组时可以写：`Field > col > host / row / description`
- 对于最简单的字段，也支持直接写：`Field > host + trailing`
- 多段输入通常是：`Field > row > host + host`
- `label + host + error` 适合单输入错误态；这类结构不负责处理 padding、gap，不需要额外 `segment`
- 只有“多个输入宿主 / 显式 segment 共用一张字段表面”时，才在中间加分割线；单个 host 加前后配件不要加分割线
- `segment` 是连续字段表面的显式标记。之后优先通过 `as="segment"` 判断 padding 和分割线，不再依赖纯结构猜测
- 没有 `segment`：由外层 `Field` 统一负责 `12 / 16` padding 与 `8` gap；组件去掉自身 padding，但保留组件自身 gap
- 有 `segment`：保留组件自身的 padding 与 gap，并参与连续字段表面的分割线
- `label / description / error` 只是内容元素，不负责处理 padding、gap 或分割线
- `FM-01` 这类地址复合字段属于“纵向多段连续字段表面”：每一段自己持有边线与必要圆角，相邻两段之间只保留一条共用分割线，不能上下两段各画一条
- `FM-02` 这类信用卡字段属于“横向显式 segment 连续字段表面”：外层 `Field` 持有整张表面，`segment` 之间用内部分割线切段
- 横向 `Frame as="segment" row` 的内容行与行内元素均垂直居中；Frame 响应式压缩 padding 后，MM / YY 仍与相邻 Input 段保持同一水平中心线。
- `FM-03` 这类通知方式属于“label 下并排内容行”：外层 `Field` 持有外壳，内部只用示例里显式声明的 `Frame gap` 排布选项，不加分割线

`Field` 不限制 `leading / trailing` 必须是 `Icon`。任何基于 `Frame` 的组件，只要声明了对应 `as`，都可以参与字段表面。

### `trailing` 在复杂结构中的用法

- `as="trailing"` 始终表示“当前局部容器的行尾角色”，不表示全局唯一行为
- 如果是简单结构：`Field > Input + Button as="trailing"`，`Field` 会直接把它们排成一行
- 如果进入复杂结构，建议显式引入局部容器，例如 `Frame as="row"`；不要依赖任意 `div` 自动推断 trailing 绑定
- 如果需要在字段内部再做一层竖向分组，推荐显式使用 `Frame as="col" column`
- 如果该 trailing 按钮需要承担日期选择行为，复杂场景下也仍然只写 `as="trailing"`；行为由局部容器自动推断，不再额外声明 prop

### 根节点 `row / column` 简写

- `Field row` 是根节点级别的横向组合语法糖，适合直接表达双列输入、宿主 + trailing 这类整块水平布局
- `Field column` 是根节点级别的竖向组合语法糖，适合直接表达“上方一个宿主，下方一个 row”的字段整体结构
- 当布局只影响整个 `Field` 根节点时，优先使用 `Field row / column`
- 当你只想在字段内部某一段做局部分组时，再使用 `Frame as="row"` 或 `Frame as="col"`

<a id="使用示例"></a>

### 使用示例

```svelte
<!-- Single input -->
<Field>
  <Input placeholder="请输入内容" />
</Field>

<!-- Label + Error -->
<Field label="Email" invalid>
  <Input type="email" placeholder="name@example.com" />
  <Text as="error">请输入有效邮箱。</Text>
</Field>

<!-- Explicit child composition mode -->
<Field invalid>
  <Text as="label">Email</Text>
  <Input type="email" placeholder="name@example.com" />
  <Text as="error">请输入有效邮箱。</Text>
</Field>

<!-- Select with built-in indicator -->
<Field>
  <Text as="label">Country</Text>
  <Select defaultValue="us">
    <option value="us">United States</option>
    <option value="cn">China</option>
  </Select>
</Field>

<!-- Date input with custom trailing trigger -->
<Field>
  <Input type="date" />
  <Button bare iconOnly as="trailing" aria-label="打开日期选择">
    <ArrowLineDown size={16} />
  </Button>
</Field>

<!-- Date input with custom trigger in nested row -->
<Field>
  <Frame as="row" row>
    <Input type="date" />
    <Button bare iconOnly as="trailing" aria-label="打开日期选择">
      <ArrowLineDown size={16} />
    </Button>
  </Frame>
</Field>

<!-- Segmented field composition -->
<Field row>
  <Input as="segment" placeholder="City" />
  <Input as="segment" placeholder="ZIP" />
</Field>

<!-- Root column shorthand -->
<Field column>
  <Input placeholder="First Name" />
  <Frame as="row" row>
    <Input as="segment" placeholder="City" />
    <Input as="segment" placeholder="ZIP" />
  </Frame>
</Field>
```

<a id="状态与交互边界"></a>

### 状态与交互边界

- `Field` 负责字段表面的视觉状态：默认、hover、focus-within、invalid、disabled、readonly
- `Field` 不负责真实值、原生输入事件和浏览器校验细节，这些由 host 组件负责
- `Field` 可以承接错误文案，但不主动生成错误文案；错误来源应来自原生校验、表单状态或业务校验层

### 焦点触发区域规范

- **表单类组件（`Field` 容器）的焦点触发区域为组件整体**，不仅限于内部输入控件本身
- 点击 `Field` 容器的任意位置（`label` 文字区域、内边距区域、边框区域）时，若点击目标不是可聚焦元素，则自动将焦点转发至容器内第一个可聚焦的输入控件（`<input>`、`<textarea>`、Select 触发按钮）
- 焦点转发后，`Field` 的 `:focus-within` 状态自然激活，视觉 focus ring 正常呈现
- 转发逻辑不干预直接点击可聚焦元素时的原生行为；点击 `Input / Select / Textarea` 区域本身时沿用浏览器默认焦点行为
- `disabled` 状态下不执行转发

<a id="无障碍与表单建议"></a>

### 无障碍与表单建议

- 推荐由 host 组件承接 `id / name / aria-* / form` 等原生属性
- 如果有错误提示，建议让 host 的 `aria-describedby` 指向 `Field` 内部的 `error` 或 `description` 节点
- `Field` 本身不替代 `<label>` 语义；需要明确标签时，请显式渲染 `Text as="label"` 或原生 `<label>`

---

## AI Zone

- **宿主与默认能力开关**：[Field.svelte](Field.svelte) 基于 [Frame.svelte](Frame.svelte) 封装（默认 `enableResponsive=false`、`enableContext=true`、`enableScaleObserver=false`），通过共享表单 Context 协调 [Input.svelte](Input.svelte)、[Textarea.svelte](Textarea.svelte) 与 [Select.svelte](Select.svelte)。
- **容器与分段几何约束**：默认表面使用 `--surface-1`（只读 `--surface-2`）、`--radius-4` 与 `field-bordered` 边框/聚焦环。单嵌入宿主且无 `segment` 时退回块级容器避免多余 grid 轨道干扰；`Field row > Input/Select as="segment"` 直接分段宿主自持 `12px / 16px` padding，而 `<Frame as="segment" row>` 嵌套行段由外层行 Frame 统一持有 `12px / 16px` padding、内部 host padding 归零。内嵌非 `segment` 的 `Textarea` 右侧留白由外层 Field 单独负责，仅保留底部 resize/footer 区域。
- **附件与分割线边界**：非 `segment` 模式下 `as="leading" | "trailing"` 作为 Field 直系附件（默认 `--black-40`），不生成字段分割线；`segment` 模式下附件作为各段 Input / Select 的直系子项（Select 存在外部 trailing 时自动隐藏默认 Indicator；Input 进入 `invalid` 时优先显示内置警告图标并临时隐藏外部 trailing）。日期 Input 存在外部日期触发器时不重复显示原生触发图标。

## 更新日志

### v1.4.2 (2026-11-23)

- 嵌入默认 `Field`（带标题／无 segment）的 `Textarea` 内边距覆盖与 `Input` / `Select` 统一为 `0`：标题与输入内容间距沿用 `Field` 默认 `var(--gap-2)`（8px），输入区域左右与下方间距（16px / 12px）与独立无标题 `Textarea` 保持一致；`FieldContext` 暴露外框元素与 `setWidth`，使嵌入 `Textarea` 拖拽缩放时同步调整 `Field` 外框尺寸。

### v1.4.1 (2026-10-23)

- 修复默认 Field 把 Input／Select 等控件自身的横向方向 class 当作整行容器，导致外部图标、控件和末尾操作分行；控件继续拥有内部单行，Field 只分配其外部列位。分段布局与标签／说明的上下关系保留。


### v1.4.0 (2026-10-23)

- 保留字段表面、分割线、外部区域与连续段布局；不再将 display、对齐与内部间距覆盖到已有单行内容所有者。
- 显式单行 Field 与直系附件采用 4 CSS px 下限，普通多行与结构性零间距保持。

- 2026-09-21：统一使用文档、源码属性表与 Site / LLM 阅读入口；仅文档修订，不改变组件行为。

- **Field-Motion.2026-06-18** 新增默认错误反馈 shake：`Field invalid` 或内部 host invalid 时整体播放，消费方无需手动传类名或状态。
- **Field-Docs.2026-05-25** 源码顶部历史更新日志已归档；后续新增变更统一写入本文档 更新日志，源码顶部只保留职责、当前关键架构与文档路径。

### v1.3.0 (2026-07-05)

#### 调整
- 分段 Field 的内置错误提示移到连续输入外框下方，采用正常文档流的 `surface + error` 布局。
- 分段场景由 `Field.error` 统一持有错误文案；内部 Input / Select / Textarea 只声明 invalid，不在各 segment 内重复生成错误提示。

完整历史见 [更新日志归档](../../docs/history/changelogs/Field.history.md)。
