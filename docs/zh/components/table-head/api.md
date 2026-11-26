# TableHead API

来源指纹：69b00ed22e2b0ad0。仅列本组件具名属性；未重新声明的基础能力按继承来源查询。

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| responsiveHide | `boolean` | true | 关闭横向滚动时允许该普通列自动隐藏；false 始终保留。第一普通列和角色列不隐藏。 |
| columnId | `string` | — | 稳定列标识；角色列使用内置标识 默认行为：普通列必填。 |
| label | `string` | — | 可读列名：供 TableToolbar 排序列表和列宽手柄使用。排序列表未传时沿用 columnId；列宽手柄未传时使用本地化的通用名称，不朗读内部 columnId。 |
| sortDirection | `"ascending" \| "descending"` | — | 独立受控排序方向 默认行为：context 推导。 |
| defaultSort | `"ascending" \| "descending"` | — | 声明表格默认按当前列的正序或反序排列；同时使当前列可排序 |
| defaultSortActive | `boolean` | false | 使 `defaultSort` 的默认方向也显示激活态和图标，并将交互循环扩展为可取消排序 |
| roleLayout | `TableRoleLayout` | — | 覆盖当前角色表头的角色列布局；普通表头忽略 默认行为：Table context。 |
| onSortChange | `(direction: "ascending" \| "descending" \| undefined) => void` | — | 独立使用时的三态排序回调 |
| resizable | `boolean` | — | 是否显示列宽手柄；显式设置优先于上下文默认值 默认行为：Table：`false`；DataTable：`true`。 |
| minWidth | `number` | 64 | 列宽调节的下限，单位 CSS px；仅在列宽调节能力启用时参与夹取。 |
| maxWidth | `number` | Infinity | 列宽调节的上限，单位 CSS px；默认 Infinity 表示不额外限制。 |
| align | `"start" \| "center" \| "end"` | "start" | 表头内容对齐：start 为起始侧，center 居中，end 为末端；不改变数据排序。 |
| children | `Snippet` | — | 表头标题内容，无参数；支持文字、Icon、资源图标及组件组合；可排序时放入内置排序按钮，selection 角色由内置全选控件承担。 |
| parts | `ComponentPartsOf<{ Indicator: typeof Indicator; Checkbox: typeof Checkbox; }>` | — | 配置内置列宽 Indicator 与全选 Checkbox；不配置显式子内容。 |

[类型与状态](./types.md) · [完整组合说明](./reference.md) · [共享 Frame API](../frame/api.md) · [样式覆盖](./styles.md) · [样式选择顺序](../../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F)
