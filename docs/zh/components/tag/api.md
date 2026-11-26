# Tag API

来源指纹：082b4bef0b59d624。仅列本组件具名属性；未重新声明的基础能力按继承来源查询。

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| parts | `ComponentPartsOf<{ Button: typeof Button }>` | — | 配置组件生成的关闭 Button；不影响显式 children 内的按钮。 |
| variant | `"default" \| "active"` | "default" | 视觉变体。`default` = Black/4% 背景；`active` = Brand 10% 背景 + Brand 文字 |
| toggle | `boolean` | false | Toggle 模式语法糖。内部自动注入 `Click={{ Idle: "Active", Active: "Idle" }}` 与 `whileClick=false`；Active 状态由 Frame 输出的 `data-state="Active"` 触发 Brand 激活态；`aria-pressed` 自动输出。消费方可继续传 `Click` / `whileClick` 显式覆盖。 |
| closable | `boolean` | false | 是否显示内置删除 X（hover Tag 时显形） |
| shape | `"default" \| "left-arrow" \| "right-arrow"` | "default" | 外壳形状，用于路径 / 面包屑片段 |
| onClose | `(event: MouseEvent) => void` | — | 点击 X 时回调（不直接销毁 Tag，移除逻辑由消费方决定） |
| children | `Snippet` | — | 标签显示内容，由 Frame 的 children 渲染协议承接；关闭按钮由组件另行管理。 |

[类型与状态](./types.md) · [完整组合说明](./reference.md) · [共享 Frame API](../frame/api.md) · [样式覆盖](./styles.md) · [样式选择顺序](../../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F)
