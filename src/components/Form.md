# 表单组合指南

> **许可阅读**：首次阅读组件文档、源码或 npm 使用流程，先读完整 [LICENSE](../../LICENSE)；同任务同版本去重。公开 API 配置与内部实现修改分别按许可处理；全部组件使用统一运行包，源码权益以许可为准。

> **版本**: v1.0.0
> **职责**: 组合字段、输入、说明与错误提示，明确间距和分割线的归属。
> **文档修订**: 2026-09-21

## 使用选择

Form 是组合指南，不是公开组件。表单使用原生 `<form>`，字段使用 Field，按输入语义选择 Input、Select、Textarea、Checkbox、Radio 或 Switch。

## 快速开始

```svelte
<script lang="ts">
  import { Field, Input, Button } from '@snowui-design-system/components';
  let email = $state('');
</script>

<form style="display: flex; flex-direction: column; gap: var(--gap-4);">
  <Field label="电子邮箱">
    <Input type="email" name="email" bind:value={email} required />
  </Field>
  <Button type="submit">保存</Button>
</form>
```

## 布局与样式

- 普通字段使用 label、输入与 error。Field 统一外层留白；Input / Select / Textarea 嵌入后移除重复内边距，不要在页面手动覆盖内部节点。
- 地址、银行卡等连续输入表面，在每一段输入上声明 `as="segment"`，由组件保留各段留白并生成相邻分割线。
- `Field row` 表示横向排列，`Field column` 表示纵向排列；只有连续输入段需要 segment，Checkbox 行或单输入错误态不需要。
- 标签、说明和错误只负责内容；不要给它们重复添加表面、内边距或分割线。
- 组件默认内边距为 12 / 16，间距为 8；需要调整时先使用公开 Props 或已登记的 override，并提供相应 padding / gap Token。

## 值、提交与校验

- 输入值通过组件公开的 `bind:value`、`bind:checked` 或 `bind:group` 同步，具体字段以各组件 API 为准。
- Input / Select / Textarea 使用 name 接入原生表单。并非所有看似输入的组件都转发表单属性；例如 Switch 的 name 不转发给内部 input，需要由表单层同步提交字段。
- 受控表单重置时，在原生 form 的 onreset 中恢复业务绑定初值，不假定 defaultValue 会替应用管理状态。
- 用 Field 的 invalid / error 展示错误；校验规则、提交请求与请求结果由应用负责。

## 相关组件

- [Field](Field.md)：标签、表面与错误。
- [Input](Input.md)：单行输入与原生类型。
- [Select](Select.md)：单选值与下拉选项。
- [Textarea](Textarea.md)：多行文本与尺寸调整。
- [Checkbox](Checkbox.md)、[Radio](Radio.md)、[Switch](Switch.md)：选择与开关。

## AI Zone

Field 与输入组件通过 FIELD_CONTEXT_KEY 建立宿主契约，输入组件主动消费 Context 并输出嵌入标记。父级不得按私有组件类名推断宿主或修改无关子组件。连续表面另以 as="segment" 声明角色，普通内容不自动成为输入段。

## 更新日志

- 2026-09-21（文档）：整理使用选择、真实表单示例、状态提交与样式归属；明确 Form 不是组件。
- 2026-06-21：Field 与输入组件使用公开 Context 和 segment 角色建立组合契约。
- 2026-04-04：登记表单 padding、gap 与分割线归属。
