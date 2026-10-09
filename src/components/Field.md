# Field

> **许可阅读**：首次阅读组件文档、源码或 npm 使用流程，先读完整 [LICENSE](../../LICENSE)；同任务同版本去重。公开 API 配置与内部实现修改分别按许可处理；旧 OSS / PRO 标签仅表示迁移期技术来源。

> **版本**: v1.3.0
> **职责**: 将输入控件、标签、图标和校验反馈组织为完整的表单字段，统一外观与内容布局。
> **包归属**: `@snowui-design-system/components/compat`
> **文档修订**: 2026-09-21

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
	import { Field } from '@snowui-design-system/components/compat';
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

- `responsive / stateStyle / customStates / variants / CSS 行为 / styles`
- `Hover / Click / Focus / whileAppear / timeline / orchestrate`
- `loading / skeleton / renderHints`
- `as / use / layoutId / itemId / scope / access`

也就是说，`Field` 不是写死的表单盒子，而是带字段语义的 `Frame` 容器。

<a id="关键字-keyword"></a>

### 关键字 (Keyword)

| 关键字 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| enableResponsive | `boolean` | `false` | 响应式能力开关 |
| enableContext | `boolean` | `true` | 上下文能力开关 |
| enableScaleObserver | `boolean` | `false` | 尺寸观察能力开关 |

<a id="容器协议"></a>

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

主布局模型：**槽位宿主布局**。定义见 [../../../specs/LayoutProtocol.md §12.3](../../../specs/LayoutProtocol.md)。

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
<!-- 单个输入 -->
<Field>
  <Input placeholder="请输入内容" />
</Field>

<!-- Label + Error -->
<Field label="Email" invalid>
  <Input type="email" placeholder="name@example.com" />
  <Text as="error">请输入有效邮箱。</Text>
</Field>

<!-- 显式组合模式仍然支持 -->
<Field invalid>
  <Text as="label">Email</Text>
  <Input type="email" placeholder="name@example.com" />
  <Text as="error">请输入有效邮箱。</Text>
</Field>

<!-- Select 默认箭头 -->
<Field>
  <Text as="label">Country</Text>
  <Select defaultValue="us">
    <option value="us">United States</option>
    <option value="cn">China</option>
  </Select>
</Field>

<!-- Date + 自定义日期按钮（简单结构） -->
<Field>
  <Input type="date" />
  <Button bare iconOnly as="trailing" aria-label="打开日期选择">
    <ArrowLineDown size={16} />
  </Button>
</Field>

<!-- Date + 自定义日期按钮（复杂结构） -->
<Field>
  <Frame as="row" row>
    <Input type="date" />
    <Button bare iconOnly as="trailing" aria-label="打开日期选择">
      <ArrowLineDown size={16} />
    </Button>
  </Frame>
</Field>

<!-- 分段组合 -->
<Field row>
  <Input as="segment" placeholder="City" />
  <Input as="segment" placeholder="ZIP" />
</Field>

<!-- 根节点 column 简写 -->
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

**2026-05-06 补充**: `Field row > Input/Select as="segment"` 这类直接横向分段宿主必须保留自身 `12 / 16` padding；只有 `Field row > Frame as="segment" > Input/Select` 这类嵌套在 segment 容器内的宿主，才由外层 segment 容器持有 padding，内部 host 归零。
**2026-04-25 补充**: `Field` 内嵌非 `segment` 的 `Textarea` 时，右侧内容留白由外层 `Field` 的 `padding-right: 16px` 单独负责；`Textarea` 自身不再额外保留右侧 padding，只保留底部 resize/footer 保留区，确保与独立 `Textarea` 的右侧视觉间距一致。
**2026-04-04 补充**: 参考 Figma `9996:17631`，`as="segment"` 是 `Field` 里处理 padding、gap 和分割线的唯一主语义。没标 `segment` 时，由外层 `Field` 负责默认 `padding = 12 / 16` 与 `gap = 8`，`Input / Select / Textarea` 去掉组件自身 padding，但保留组件自身 gap；标了 `segment` 时保留组件自身的 padding 与 gap，并参与连续字段表面的分割线。`label / description / error` 只负责文字样式，不再参与 padding、gap、分割线判断。
**2026-04-09 图标规则补充**: `Field` 负责字段外壳、分割线与 segment 切角，但不重新定义 `Input` 内 icon 的最终定位。`Input` 内的 leading / trailing / invalid warning icon 间距由 `Input` 自身控制；进入 `Field` 后只允许继承，不允许二次改写。若 `Input as="segment"` 处于连续字段表面中，icon 到最近边框或分割线的距离仍保持 `16px`。
**2026-03-24 补充**: 当 `Field` 里只有一个嵌入态 `Input / Select / Textarea` 宿主时，根容器会退回 block 容器，不再保留多列 grid 轨道；同时这类嵌入宿主不再继承 `Field` 面向普通 host 的 `display:flex / align-items / min-height` 注入，避免按钮区和内容区尺寸与独立组件继续偏离。

**继承**: 复用 Frame.svelte 的所有通用能力（状态、动效、响应式、Skeleton、样式编排）。
**默认能力开关**: `enableResponsive=false`, `enableContext=true`, `enableScaleObserver=false`。

<a id="样式规范-style-spec"></a>

### 样式规范 (Style Spec)

### 1. 容器基础视觉

| 项目 | 值 |
| :--- | :--- |
| 默认背景 | `var(--surface-1)` |
| 默认圆角 | `var(--radius-4)` |
| 默认边框 | 由 `field-bordered 工具类` 提供：`Black/20%` |
| Focus | 由 `field-bordered 工具类` 提供：`Black/40%` + `Black/4%` 的 `4px` ring |
| Label 字重 | `var(--font-weight-regular, 400)` |

Field 与独立 Input 使用相同的默认背景 `surface-1`。普通、横向分段与纵向分段均由 Field 统一绘制背景；嵌入的 Input 根及原生输入控件保持透明，避免重复叠加半透明背景。只读态继续由 Field 统一承接 `surface-2`。

### 2. 组合规则

| 区域 | 规则 |
| :--- | :--- |
| 非 `segment` 的直接字段宿主 | 由外层 `Field` 统一负责 `12 / 16` padding 与 `8` gap；组件去掉自身 padding，但保留组件自身 gap |
| `segment` 字段宿主 | 保留组件自身的 padding 与 gap |
| `label / description / error` | 只是内容元素，不负责 padding、gap、分割线 |
| `Field row` | 根节点直接作为横向组合容器，复用 `row` 的宿主与分隔线规则 |
| `Field column` | 根节点直接作为竖向组合容器，复用 `col` 的宿主与横向分隔线规则 |
| `Field` 内的 `Text / Input / Frame / Select / Textarea` | 进入字段表面后默认退掉自身边框、背景与圆角；未标 `segment` 的输入宿主去掉自身 padding（由 Field 统一负责），标了 `segment` 的输入宿主保留自身 padding 与 gap |
| `row` 行容器 | 只在多个输入宿主或显式 `segment` 共同组成一张连续字段表面时才加纵向分隔线；单个 host 配 `leading / trailing` 不加分隔线 |
| `column / col` 连续字段 | 只在多段输入宿主共同组成一张连续字段表面时才加横向分隔线；相邻两段之间只能有一条线，分隔线归属必须固定在其中一段，不能叠线 |
| 多段字段之间的横线 | 与 Field 外边框使用同样的颜色与粗细 |
| `leading / trailing` 的 `bare` Button | 不使用槽位分隔线，并通过外侧 margin 保留与边框的安全距离，垂直居中显示 |
| `label / description / error` | 不再单独占据新外壳，而是作为容器内容的一部分 |

### 3. 以示例归纳的规则

| 示例 | 结构类型 | padding 归属 | 分割线规则 |
| :--- | :--- | :--- | :--- |
| `FM-01` 地址复合字段 | `Field column > Select as="segment" + Input as="segment" + Select as="segment" + Frame as="segment" row > Input as="segment" + Input as="segment"` | 每一段 `segment` 宿主自己持有 `12 / 16` 内容 inset；外层 `Field` 统一绘制背景，不再统一包一层 padding | 顶部三段和底部双列属于同一张连续表面；段与段之间只允许一条横线，底部双列之间只允许一条竖线 |
| `FM-02` 信用卡三段 | `Field row > segment + segment + segment` | 每个 `segment` 段容器持有 `12 / 16` padding，内部 `gap = 0`；外层 `Field` 负责整张表面的外壳与分割线组织 | 三段共用同一张外壳，段与段之间使用纵向分割线 |
| `FM-03` 通知方式 | `Field > label + row(Checkbox + Checkbox)` | 外层 `Field` 持有 `12 / 16` padding；checkbox 行自己的间距要在 `Frame` 上显式声明 | 内部是并排选项，不是连续输入表面，因此不加任何内部分割线 |

### 4. segment 场景几何规范

#### 外层 Field

| 项目 | 值 |
| :--- | :--- |
| padding | `0`（不统一包一层 padding，由 segment 自持） |
| gap | `0`（segment 间不靠 gap 分开） |
| 圆角 | `var(--radius-4)` |
| 边框 | `inset 0 0 0 var(--border-1) var(--black-20, rgba(0,0,0,0.2))` |

#### 列向 segment（直接子项）

| 项目 | 值 |
| :--- | :--- |
| padding | `var(--padding-3) var(--padding-4)`（12px / 16px，由 segment 宿主自持） |
| 水平分割线 | `inset 0 var(--border-1) 0 var(--black-20, rgba(0,0,0,0.2))`（`+ [data-as="segment"]` 相邻时添加） |
| 字号 | `var(--text-14)` |
| 行高 | `var(--leading-14)` |

#### 行向嵌套 segment（列 segment 内的 `<Frame as="segment" row>`）

| 项目 | 值 |
| :--- | :--- |
| 外层行 Frame padding | `var(--padding-3) var(--padding-4)` |
| 内部 Input/Select padding | `0`（由外层行 Frame 统一持有 padding） |
| 竖向分割线 | `inset calc(var(--border-1) * -1) 0 0 var(--black-20, rgba(0,0,0,0.2))`（`:not(:last-child)` 时添加） |

### 5. 外部 Icon 规范

参考 Figma `10379-18362`（FM-02, FM-05）。图标到最近可见外边框始终为 **16px**，由各层 padding 保障，无需额外 style 覆写。图标尺寸不在表单组件层约束，由 Icon 组件自身默认尺寸决定。

外部 Icon 有两种放置层级，取决于是否使用 segment 模式：

| 模式 | 适用条件 | Icon 放置位置 |
| :--- | :--- | :--- |
| **非 segment 模式** | Field 内无 `as="segment"` 子项 | `Field` 的直接子项 |
| **segment 模式** | Field 内有 `as="segment"` 子段 | `Input` 或 `Select`（Listbox）的直接子项 |

#### Field 级图标（非 segment 模式）

图标作为 Field 直接子项，Field 的 `padding: 12px 16px` 提供与外边框的间距。

| 项目 | Leading | Trailing |
| :--- | :--- | :--- |
| prop | `as="leading"` | `as="trailing"` |
| 到外边框距离 | **16px**（`Field padding-left`） | **16px**（`Field padding-right`） |
| 默认颜色 | `var(--black-40)` — Field CSS 自动注入 | `var(--black-40)` — Field CSS 自动注入 |
| 布局 | Field `display: grid; columns: auto 1fr auto`，icon 占列 1 | icon 占列 3 |

典型示例（FM-05）：
```svelte
<Field>
    <Icon as="leading"><CalendarBlank /></Icon>
    <Input type="date" name="dueDate" />
    <Button as="trailing" bare iconOnly aria-label="打开日期选择"><Icon size={16}><ArrowLineUpDown /></Icon></Button>
</Field>
```

#### segment 宿主级图标（Input / Select 的直接子项）

图标作为 `Input as="segment"` 或 `Select as="segment"`（Listbox）的直接子项，宿主自身的 `padding: 12px 16px` 提供与外边框的间距。

| 项目 | Leading | Trailing |
| :--- | :--- | :--- |
| prop | `as="leading"` | `as="trailing"` |
| 到外边框距离 | **16px**（宿主 `padding-left`） | **16px**（宿主 `padding-right`） |
| 默认颜色 | 继承宿主文字色（`currentColor`） | 继承宿主文字色（`currentColor`） |
| ⚠️ Select trailing 与 Indicator | — | trailing 存在时，Indicator 被 CSS 自动隐藏 |
| ⚠️ Input trailing 限制 | — | `invalid` 时错误图标出现，CSS 自动隐藏外部 trailing；恢复正常态后重新显示 |

**segment 内部 grid 布局（CSS 自动切换）：**

| 图标配置 | `grid-template-columns` |
| :--- | :--- |
| 仅 leading | `auto 1fr` |
| 仅 trailing | `1fr auto` |
| leading + trailing | `auto 1fr auto` |

典型示例（FM-02）：
```svelte
<Field row>
    <Input as="segment">
        <Icon as="leading"><CreditCard /></Icon>
    </Input>
</Field>
```

<a id="开发者指南-ai"></a>

### 开发者指南 (AI)

### 模块索引 (Module Index)

- **Field 组件**: [./Field.svelte](Field.svelte)

### 关联关系

- **父组件**: [FramePro.svelte](FramePro.svelte)
- **字段宿主**: [./Input.svelte](Input.svelte), [./Textarea.svelte](Textarea.svelte), [./Select.svelte](Select.svelte)
- **共享协议**: `context.ts`（@snowui-design-system/components/context）, `keys.ts`（@snowui-design-system/components/keys）
- **角色类映射**: [../logic/frame-class-state.svelte.ts](../logic/frame-class-state.svelte.ts)

---

## 更新日志

- 2026-09-21：统一使用文档、源码属性表与 Site / LLM 阅读入口；仅文档修订，不改变组件行为。

- **Field-Motion.2026-06-18** 新增默认错误反馈 shake：`Field invalid` 或内部 host invalid 时整体播放，消费方无需手动传类名或状态。
- **Field-Docs.2026-05-25** 源码顶部历史更新日志已归档；后续新增变更统一写入本文档 更新日志，源码顶部只保留职责、当前关键架构与文档路径。

### v1.3.0 (2026-07-05)

#### 调整
- 分段 Field 的内置错误提示移到连续输入外框下方，采用正常文档流的 `surface + error` 布局。
- 分段场景由 `Field.error` 统一持有错误文案；内部 Input / Select / Textarea 只声明 invalid，不在各 segment 内重复生成错误提示。

### v1.2.0 (2026-07-05)

#### 新功能
- 新增默认关闭的 `error` 内置模式；仅在 invalid 时生成 F-02 同款 `<Text as="error">`。
- `parts.Text` 同时用于配置内置 label 与 error，显式组合模式保持不变。

### v1.1.0 (2026-07-05)

#### 新功能
- **FD-BuiltIn.1** 新增默认关闭的 `label` 内置模式，支持字符串或 Snippet，并生成既有样式的 `<Text as="label">`。
- **FD-BuiltIn.2** 新增 `parts.Text` 配置入口；原有显式 `<Text as="label">` 组合模式保持不变。

### v1.0.14 (2026-05-06)

#### 修复
- **FD-Fix.3** 修复 `Field row > Input/Select as="segment"` 横向分段宿主的 padding 被后续嵌套宿主规则清零，导致 F-04 双输入并排示例中文字贴边的问题；现在直接 segment 宿主保留自身 `12 / 16` 内容 inset，嵌套在 segment 容器内的 host 仍由外层容器持有 padding。

### v1.0.13 (2026-04-25)

#### 修复
- **FD-Fix.2** 修复 `Field` 内嵌非 `segment` 的 `Textarea` 右侧留白过大：外层 `Field` 已提供右侧 `16px` padding，Textarea control 不再额外叠加右侧 padding，仅保留底部 `resize/footer` 区域。

### v1.0.10 (2026-04-02)

#### 调整
- **FD-Doc.1** 文档补充最新字段组合规则：移除最小高度表述，明确 `label -> 内容` 默认纵向间距为 `8px`，并强调 `Text / Input / Frame / Select / Textarea` 进入 `Field` 后由外层统一控制边框、背景、圆角与 padding。
- **FD-Doc.2** 文档收敛分割线判定：只有多个输入宿主或显式分段组成连续字段表面时才使用分割线；`leading + Input + trailing` 这类配件型结构不使用分割线，并更新了 `Select + trailing` 示例写法。

### v1.0.9 (2026-03-24)

#### 修复
- **FD-Fix.1** 当 `Field` 中嵌入的宿主本身是 `Input` 时，容器不再复用通用 host 布局；改为让嵌入态 `Input` 继续使用自身的三列 grid、gap、padding 与 number stepper 对齐链路。若 `Field` 内只有这一个 `Input` 宿主，则 `Field` 根退成普通块容器、宿主跨满整行，保证 `<Field><Input /></Field>` 与独立 `<Input />` 在右侧留白和按钮尺寸上完全一致。

### v1.0.8 (2026-03-16)

#### 新功能
- **FD-Layout.9** 新增根节点 `row / column` 简写：`Field row` 和 `Field column` 现在可直接复用原有局部 `row / col` 容器规则，无需再额外包一层 `Frame`。

### v1.0.7 (2026-03-16)

#### 新功能
- **FD-Layout.8** 新增 `col` 局部容器协议：`Field > Frame as="col" column` 现在可作为字段内部的竖向组合容器，复用宿主 padding、横向分隔线和嵌套 `row` 的组合规则。

### v1.0.6 (2026-03-16)

#### 调整
- **FD-Layout.7** 多段字段内容之间的横向分割线改为与 Field 外边框一致的颜色与粗细，避免复杂结构示例里中间分割线过浅。

### v1.0.5 (2026-03-16)

#### 修复
- **FD-Layout.6** `leading / trailing` 的 `Button bare` 改为通过外侧 margin 保留与 Field 边框的间距，并显式垂直居中，避免日期示例里的按钮贴到右上角。

### v1.0.4 (2026-03-16)

#### 修复
- **FD-Layout.5** `row` 内部的通用兄弟分隔线不再作用于与 `Button bare` 相邻的节点，避免复杂结构里的 trailing 无外壳按钮继续显示边框。

### v1.0.3 (2026-03-16)

#### 修复
- **FD-Layout.4** 当 `leading / trailing` 角色本身是 `Button bare` 时，移除槽位分隔线，避免无外壳按钮在 Field 示例中出现额外边框。

### v1.0.2 (2026-03-16)

#### 调整
- **FD-Layout.3** 日期触发器不再依赖额外行为 prop；复杂结构中的日期按钮也统一只使用 `as="trailing"`，并要求位于可识别的局部容器中。

### v1.0.1 (2026-03-15)

#### 新功能
- **FD-Layout.1** 新增直接组合规则：`Field > host + trailing` 现在可直接形成一行字段表面，无需额外 `Frame as="row"`。
- **FD-Layout.2** Field 根布局升级为三列网格：`leading / host / trailing`，任意未声明角色的复杂子块默认跨满整行。

### v1.0.0 (2026-03-15)

#### 新功能
- **FD-Feat.1** 新增表单容器组件，负责承接字段视觉外壳与组合式布局协议。
