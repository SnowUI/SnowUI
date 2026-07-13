# Form 文档

> **版本**: v1.0.0
> **职责**: 表单组合规则文档；用于约束 `Field / Input / Select / Textarea` 在真实表单示例中的结构、padding、gap 与分割线归属。

**2026-06-21 组合契约升级**：`Field` 与 `Input / Select / Textarea` 通过公开的 `FIELD_CONTEXT_KEY` 建立表单宿主契约；这不是父级按子组件类名猜测身份。普通 host 由子组件主动消费 Context 并输出 `data-embedded="true"`，父级只使用公开的 field-host 协议和 CSS bridge。连续字段另外通过 `as="segment"` 声明 segment 角色。未消费 Field Context、也未声明 `as` 角色的普通子组件只作为内容渲染，Field 不得修改其状态、样式或行为。

## 2026-04-04 表单样式规则

- 基础节奏统一：`Field` 默认 `padding = 12 / 16`，`gap = 8`
- `Input / Select / Textarea` 单独使用时：组件自身带 `12 / 16` padding 和 `8` gap
- 放进 `Field` 后，先确认子组件是否主动接入 `FIELD_CONTEXT_KEY`；只有接入者才是 field host
- field host 没有 `as="segment"`：通过公开 Context 与 bridge 协议协作，由 `Field` 提供 `12 / 16` padding 与 `8` gap，host 自己消费嵌入态并移除自身 padding
- 有 `as="segment"`：这是连续字段表面的一段；保留组件自身的 padding 与 gap
- `segment` 之间才有分割线：横向是左右分割线，纵向是上下分割线
- 相邻 `segment` 之间只能有一条分割线，不能重复画线
- `label / description / error` 不负责 padding、gap、分割线，它们只是内容元素
- 普通 `label + host + error`：不作为 padding、gap 的判断依据，只负责文字内容
- `Field row` 或 `Field column` 里，如果是连续输入段，子项要显式写 `as="segment"`
- Field CSS 禁止再用 `.snowui-input / .snowui-select / .snowui-textarea` 猜测 host；应使用 Context 约定输出的公开宿主标记及公开 override 变量

## 在表单示例中的用法

- `FM-01` 这类地址字段：属于连续字段表面；`Country / Address / State / City / ZIP` 都应该显式使用 `as="segment"`
- `FM-02` 这类信用卡字段：属于横向连续字段表面；每一段都应显式使用 `as="segment"`
- `FM-03` 这类 checkbox 行：不是连续字段表面；不使用 `segment`，需要的行间距直接写在示例的 `Frame` 上
- `F-02 / F-07` 这类单输入错误态：不是连续字段表面；不使用 `segment`

## 关联文档

- [Field.md]([项目目录]/snowui/components/src/components/Field.md)
- [Input.md]([项目目录]/snowui/components/src/components/Input.md)
- [Select.md]([项目目录]/snowui/components/src/components/Select.md)
- [Textarea.md]([项目目录]/snowui/components/src/components/Textarea.md)
