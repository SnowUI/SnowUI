# TableCell API

来源指纹：62ef5d54c9c53214。仅列本组件具名属性；未重新声明的基础能力按继承来源查询。

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| columnId | `string` | — | 与表头共享列宽 |
| lines | `false \| 1 \| 2 \| 3` | 1 | 截断行数，false 关闭 |
| tooltip | `TooltipProp` | true | 溢出后展示完整或自定义提示 |
| onTruncate | `(isTruncated: boolean) => void` | — | 真实溢出状态变化 |
| align | `"start" \| "center" \| "end"` | "start" | 内容对齐 默认行为：start。 |
| roleLayout | `TableRoleLayout` | — | 覆盖当前角色单元格的角色列布局；普通单元格忽略 默认行为：Table context。 |
| nowrap | `boolean` | — | 文字不换行；与 row 同用时同时禁止 flex 子项换行 默认行为：`true`（lines=2/3 时 false）。 |
| singleLine | `boolean` | false | 单行图文预设只作用于内部内容，不改变 td 的原生表格布局；启用 row、nowrap、单行及至少4px间距。用 Text lines={1} 管理可收缩文字及全文提示。 |
| skeleton | `boolean` | false | TableBody 内部 Skeleton rows 协议；渲染非交互占位内容并关闭截断 |
| children | `Snippet` | — | 单元格内容，无参数；actions 角色提供显式内容时替换默认操作，选择角色仍由 DataTable 协议管理。 |
| parts | `ComponentPartsOf<{ Tooltip: typeof Tooltip; Checkbox: typeof Checkbox; }>` | — | 配置内置截断 Tooltip 和选择 Checkbox；只作用于当前单元格拥有的默认实例。 |

[类型与状态](./types.md) · [完整组合说明](./reference.md) · [共享 Frame API](../frame/api.md) · [样式覆盖](./styles.md) · [样式选择顺序](../../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F)
