# TableToolbar API

来源指纹：9e673e713c4e1ce1。仅列本组件具名属性；未重新声明的基础能力按继承来源查询。

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| ariaLabel | `string` | — | 工具栏 role=toolbar 的可访问名称，未传时按当前语言显示；多工具栏场景使用不同名称。 |
| search | `boolean` | true | 显示默认 SearchInput，并将输入写入 DataTable query；显式 as=search 可替换。 |
| bulkActionsEnabled | `boolean` | true | 存在已选行时显示默认选择计数与批量操作区域；关闭不清除选择状态。 |
| sort | `boolean` | true | 显示默认排序选择入口；排序字段来自 sortOptions 或可排序表头。 |
| sortOptions | `TableToolbarSortOption[]` | — | 自定义内置排序菜单字段和顺序，可包含未展示为表格列的数据字段；显式列表替换自动表头列表，空数组仅保留默认排序。 默认行为：未指定。 |
| filter | `boolean` | true | 显示默认筛选入口；实际筛选需要 filterKey 和 filterOptions。 |
| searchPlaceholder | `string` | — | 默认搜索输入的占位文本，未传时按当前语言显示。 |
| searchAriaLabel | `string` | — | 默认搜索输入的可访问名称，未传时按当前语言显示。 |
| sortLabel | `string` | — | 排序入口的可访问名称及提示文字，未传时按当前语言显示。 |
| filterLabel | `string` | — | 筛选入口的可访问名称及提示文字，未传时按当前语言显示。 |
| filterKey | `string` | — | 写入 DataTable filters 的字段名；未配置时选择筛选项不会修改数据过滤条件。 |
| filterOptions | `TableToolbarFilterOption[]` | [] | 筛选选项，每项包含 label 和 value；值为 string、number 或 undefined，通过字符串形式匹配所选项，再写回原始值。 |
| selectedCount | `number` | — | 显式选择数量；未传时读取 DataTable 当前选中 id 数量，只覆盖展示与回调参数，不改选中集合。 |
| showClearAction | `boolean` | true | 在批量操作区显示清除选择按钮。 |
| showCopyAction | `boolean` | true | 在批量操作区显示内置 CopyButton；具体复制由 onCopy 执行。 |
| showDeleteAction | `boolean` | true | 在批量操作区显示删除按钮；具体删除由 onDelete 执行。 |
| clearLabel | `string` | — | 清除选择按钮的文字，未传时按当前语言显示。 |
| copyLabel | `string` | — | 复制操作的可访问名称及提示文字，未传时按当前语言显示。 |
| deleteLabel | `string` | — | 删除操作的可访问名称及提示文字，未传时按当前语言显示。 |
| selectionLabel | `(count: number) => string` | — | 接收已选数量并返回选择计数文案；未传时按当前语言显示，仅用于展示。 |
| onClearSelection | `(count: number) => void` | — | 清除按钮点击时接收当前选择数量；提供回调后替换默认 clearSelection，调用方需自行清除。 |
| onCopy | `(count: number) => void \| Promise<void>` | — | 复制操作接收选择数量，可返回 Promise；由回调执行实际复制，成功后 resolve，失败 reject，执行期间防止重复批量操作。 |
| onDelete | `(count: number) => void \| Promise<void>` | — | 删除操作接收选择数量，可返回 Promise；由回调执行实际删除，等待时显示加载反馈并阻止重复批量操作。 |
| bulkActions | `Snippet<[number]>` | — | 自定义附加批量操作，接收选择数量；只在有选择且批量操作区启用时显示，执行默认操作时暂不可交互。 |
| children | `Snippet` | — | 显式工具栏内容，无参数；直接 as=search/bulk/sort/filter 可替换对应默认区，其余作为操作内容。 |
| parts | `ComponentPartsOf<{ Button: typeof Button; Separator: typeof Separator; Spinner: typeof Spinner; SearchInput: typeof SearchInput; Select: typeof Select; Listbox: typeof Listbox; MenuItem: typeof MenuItem; }>` | — | 配置工具栏直接拥有的默认 Button、Separator、Spinner、SearchInput、Select、Listbox、MenuItem；不递归接管显式子组件。 |

[类型与状态](./types.md) · [完整组合说明](./reference.md) · [共享 Frame API](../frame/api.md) · [样式覆盖](./styles.md) · [样式选择顺序](../../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F)
