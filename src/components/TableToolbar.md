# TableToolbar

> **许可阅读**：首次阅读组件文档、源码或 npm 使用流程，先读完整 [LICENSE](../../LICENSE)；同任务同版本去重。公开 API 配置与内部实现修改分别按许可处理；旧 OSS / PRO 标签仅表示迁移期技术来源。

> **职责**: 为 DataTable 提供搜索、排序、筛选和批量操作入口，并展示选择状态，适合数据管理界面。
> **包归属**: `@snowui-design-system/components/compat`
> **文档修订**: 2026-09-21

## 组件介绍

为 DataTable 提供搜索、排序、筛选和批量操作入口，并展示选择状态，适合数据管理界面。

## 使用选择

<!-- usage-guide:start -->
仅用于 DataTable 的搜索、排序、筛选与批量操作，不独立搭配普通 Table。使用默认内置项或公开 as 角色替换；复制、删除实际业务由回调处理。

- 需要 DataTable 状态；search / sort / filter 控制默认工具，sortOptions 明确排序项。
- 直接 as="search" / "bulk" / "sort" / "filter" 替换对应区域；onCopy / onDelete 由业务实现。
<!-- usage-guide:end -->

## 快速开始

以下示例展示推荐的基本组合。更多场景与组合限制见后文。

<!-- quick-start:generated -->
```svelte
<script lang="ts">
	import { DataTable, TableToolbar, type DataTableRenderState } from '@snowui-design-system/components/compat';
	import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@snowui-design-system/components';
	type DocRow = { id: number; component: string; tier: 'OSS' | 'PRO'; status: string };
	const docs: DocRow[] = [
		{ id: 1, component: 'Button', tier: 'OSS', status: 'Published' },
		{ id: 2, component: 'DataTable', tier: 'PRO', status: 'Review' },
		{ id: 3, component: 'Tooltip', tier: 'OSS', status: 'Published' }
	];
	let tableState = $state<DataTableRenderState<DocRow>>();
	let selectedRowIds = $state<(string | number)[]>([2]);
	function getRowKey(row: DocRow) { return row.id; }
	function copySelection() { /* Copy selected component names. */ }
	function clearSelection() { selectedRowIds = []; }
</script>

<DataTable rows={docs} rowKey={getRowKey} selection bind:state={tableState} bind:selectedRowIds>
	<TableToolbar
		ariaLabel="Component documentation controls"
		search
		sort
		filter
		searchPlaceholder="Search component docs…"
		searchAriaLabel="Search component documentation"
		filterKey="tier"
		filterOptions={[{ label: 'OSS', value: 'OSS' }, { label: 'PRO', value: 'PRO' }]}
		copyLabel="Copy component names"
		deleteLabel="Remove from review queue"
		onCopy={copySelection}
		onDelete={clearSelection}
	/>
	<Table ariaLabel="Filtered component documentation">
		<TableHeader><TableRow><TableHead as="selection" /><TableHead columnId="component">Component</TableHead><TableHead columnId="tier">Tier</TableHead><TableHead columnId="status">Status</TableHead></TableRow></TableHeader>
		<TableBody>{#each tableState?.rows ?? [] as row}<TableRow rowId={row.id}><TableCell as="selection" /><TableCell columnId="component">{row.component}</TableCell><TableCell columnId="tier">{row.tier}</TableCell><TableCell columnId="status">{row.status}</TableCell></TableRow>{/each}</TableBody>
	</Table>
</DataTable>
```
<!-- /quick-start:generated -->

## API

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| ariaLabel | `string` | `"表格工具栏"` | 工具栏 role=toolbar 的可访问名称，多工具栏场景使用不同名称。 |
| search | `boolean` | `true` | 显示默认 SearchInput，并将输入写入 DataTable query；显式 as=search 可替换。 |
| bulkActionsEnabled | `boolean` | `true` | 存在已选行时显示默认选择计数与批量操作区域；关闭不清除选择状态。 |
| sort | `boolean` | `true` | 显示默认排序选择入口；排序字段来自 sortOptions 或可排序表头。 |
| sortOptions | `TableToolbarSortOption[]` | — | 自定义内置排序菜单字段和顺序，可包含未展示为表格列的数据字段；显式列表替换自动表头列表，空数组仅保留默认排序。 默认行为：未指定。 |
| filter | `boolean` | `true` | 显示默认筛选入口；实际筛选需要 filterKey 和 filterOptions。 |
| searchPlaceholder | `string` | `"搜索"` | 默认搜索输入的占位文本。 |
| searchAriaLabel | `string` | `"搜索"` | 默认搜索输入的可访问名称。 |
| sortLabel | `string` | `"排序"` | 排序入口的可访问名称及提示文字。 |
| filterLabel | `string` | `"筛选"` | 筛选入口的可访问名称及提示文字。 |
| filterKey | `string` | — | 写入 DataTable filters 的字段名；未配置时选择筛选项不会修改数据过滤条件。 |
| filterOptions | `TableToolbarFilterOption[]` | `[]` | 筛选选项，每项包含 label 和 value；值为 string、number 或 undefined，通过字符串形式匹配所选项，再写回原始值。 |
| selectedCount | `number` | — | 显式选择数量；未传时读取 DataTable 当前选中 id 数量，只覆盖展示与回调参数，不改选中集合。 |
| showClearAction | `boolean` | `true` | 在批量操作区显示清除选择按钮。 |
| showCopyAction | `boolean` | `true` | 在批量操作区显示内置 CopyButton；具体复制由 onCopy 执行。 |
| showDeleteAction | `boolean` | `true` | 在批量操作区显示删除按钮；具体删除由 onDelete 执行。 |
| clearLabel | `string` | `"清除"` | 清除选择按钮的文字。 |
| copyLabel | `string` | `"复制"` | 复制操作的可访问名称及提示文字。 |
| deleteLabel | `string` | `"删除"` | 删除操作的可访问名称及提示文字。 |
| selectionLabel | `(count: number) => string` | `(count) => `已选择 ${count} 项`` | 接收已选数量并返回选择计数文案，仅用于展示。 |
| onClearSelection | `(count: number) => void` | — | 清除按钮点击时接收当前选择数量；提供回调后替换默认 clearSelection，调用方需自行清除。 |
| onCopy | `(count: number) => void \| Promise<void>` | — | 复制操作接收选择数量，可返回 Promise；由回调执行实际复制，成功后 resolve，失败 reject，执行期间防止重复批量操作。 |
| onDelete | `(count: number) => void \| Promise<void>` | — | 删除操作接收选择数量，可返回 Promise；由回调执行实际删除，等待时显示加载反馈并阻止重复批量操作。 |
| bulkActions | `Snippet<[number]>` | — | 自定义附加批量操作，接收选择数量；只在有选择且批量操作区启用时显示，执行默认操作时暂不可交互。 |
| children | `Snippet` | — | 显式工具栏内容，无参数；直接 as=search/bulk/sort/filter 可替换对应默认区，其余作为操作内容。 |
| parts | `ComponentPartsOf<{ Button: typeof Button; Separator: typeof Separator; Spinner: typeof Spinner; SearchInput: typeof SearchInput; Select: typeof Select; Listbox: typeof Listbox; MenuItem: typeof MenuItem; }>` | — | 配置工具栏直接拥有的默认 Button、Separator、Spinner、SearchInput、Select、Listbox、MenuItem；不递归接管显式子组件。 |

未重新声明的继承能力请查所属基础组件文档；本表只列本组件源码具名公开属性。

## 使用边界与详细说明

<a id="组合模式"></a>

### 组合模式

- 默认内置模式：由 Props 生成 SearchInput、Select、Listbox、MenuItem、Button、CopyButton、Separator 与 Spinner。
- 显式组合模式：通过 `children` 和 `as="search|bulk|sort|filter|action"` 替换直接子项。
- `parts` 只配置直接内置子组件，不递归配置子组件内部。
- 内置 copy、delete、sort、filter 的 icon-only 触发器由工具栏内部嵌入 Tooltip，提示文案分别复用对应 label Props。
- 内置清除、复制、删除、排序与筛选均显式使用 `Button bare emphasis="muted"`，保留次级工具操作的 40% → hover 100% 视觉；调用方可通过 `parts.Button.emphasis` 统一覆盖。

内置复制复用 `CopyButton bare`，通过 `writeText` 执行已有 `onCopy` 回调；成功反馈默认保留 1600ms，期间忽略重复复制。回调应在复制完成后 resolve，失败时 reject，避免错误显示为成功。

排序选择器读取 DataTable 的当前排序，仅在用户选择新选项时写回；表头排序不被工具栏旧值覆盖。

<a id="排序选项"></a>

### 排序选项

未配置 `sortOptions` 时自动读取可排序表头。配置后，每项生成升序、降序两个选项，名称缺省使用 `columnId`；字段标识应唯一。普通字段由 DataTable 读取 `row[columnId]`，派生值由 DataTable 的 `sorters[columnId]` 提供。配置菜单不会创建表格列，也不会改变当前排序；菜单始终保留“默认排序”用于恢复 DataTable 默认顺序。server 模式仍由调用方处理排序请求。

```svelte
<TableToolbar sortOptions={[
  { columnId: 'component', label: 'Component' },
  { columnId: 'priority', label: 'Priority' }
]} />
```



## AI Zone

DataTable 专用工具栏，内置搜索、排序、筛选、选择计数与批量操作。它读取 DataTable Context，不支持独立搭配普通 Table。公开入口为 `@snowui-design-system/components/compat`。

## 更新日志

- 2026-09-21：统一使用文档、源码属性表与 Site / LLM 阅读入口；仅文档修订，不改变组件行为。

- 2026-09-20：增加 `sortOptions`，内置菜单可按未显示的原始字段或派生值排序。


- 2026-08-09：适配 Button bare 默认 100%，内置工具操作显式改用 `emphasis="muted"`。

- 2026-07-13：内置 copy、delete、sort、filter 图标按钮增加内部 Tooltip。

- 2026-07-08：默认内置项与批量操作组间距改为 8px，遵循多个 Icon 按钮排列默认 gap。

- 2026-07-07：默认内置项与批量操作组间距统一为 12px。

- 2026-07-07：默认内置模式中的清除、复制、删除、排序与筛选按钮统一使用 bare Button 外观。

- 2026-07-05：v3.0.0，改为 PRO 组件，只服务 DataTable；移出 OSS 包公开入口。
