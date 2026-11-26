# DataTable

> **版本**: v1.15.0
> **职责**: 统一管理数据的查询、排序与分页状态，可自由组合工具栏、表格和分页器，构建完整的数据浏览界面。
> **包归属**: `@snowui-design-system/components`
> **文档修订**: 2026-10-21

## 组件介绍

统一管理数据的查询、排序与分页状态，可自由组合工具栏、表格和分页器，构建完整的数据浏览界面。

## 使用选择


文件或记录列表需要搜索、筛选、排序、分页、勾选或操作列时使用。DataTable 协调数据状态，内部组合 TableToolbar、Table 系列与 Pagination；纯展示用 Table。选择需显式启用 selection，并使用稳定 rowKey 与行 rowId；操作列通过 actions 配置。业务请求函数与数据格式化由页面提供。

- client 模式在本地处理数据，server 模式由页面请求与提供结果；children 接收当前渲染状态。
- 显式启用 selection / actions；rowKey 默认是索引，排序或更新数据时应改用稳定业务 ID，并让 TableRow.rowId 与其一致。
- 页码从 1 开始；首次 loading、后台 refreshing 和追加 loadMore 是不同状态。


## 快速开始

以下示例展示推荐的基本组合。更多场景与组合限制见后文。


```svelte
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Avatar, Button, Chip, formatDate, Frame, Pagination, Switch, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, type TableSortState } from '@snowui-design-system/components';
	import { DataTable, TableToolbar, type DataTableLoadMoreRequest, type DataTableRenderState } from '@snowui-design-system/components';
	import { Apple, AvatarFemale01, AvatarFemale02, AvatarFemale03, AvatarMale01, AvatarMale02, Facebook, FigmaA, Google, Gradient01, MagicWand, Medium, Perplexity, Question, Slack, SnowLogo, SortAscending, Calendar, ThreeDots } from '@snowui-design-system/resource-svelte';
	import { OverflowActions, OverflowAction } from '@snowui-design-system/components';
	const DEMO_NOW = new Date("2026-06-19T04:00:00Z");
	const minute = 60 * 1000;
	const hour = 60 * minute;
	const day = 24 * hour;
	    const baseRows = [
	        { createdAt: new Date(DEMO_NOW.getTime() - 10 * 1000), store: "SnowUI Pro", logo: SnowLogo, subscriber: "Natali Craig", avatar: AvatarFemale01, plan: "Monthly $19.9", term: "First", price: 19.9, status: "Active" },
	        { createdAt: new Date(DEMO_NOW.getTime() - minute), store: "Apple", logo: Apple, subscriber: "Kate Morrison", avatar: AvatarFemale02, plan: "Affiliate Monthly $19.9", term: "Renewal", price: 19.9, status: "Active" },
	        { createdAt: new Date(DEMO_NOW.getTime() - hour), store: "Magic 3D Store", logo: MagicWand, subscriber: "Drew Cano", avatar: AvatarMale01, plan: "Monthly $19.9", term: "First", price: 9.95, status: "Active" },
	        { createdAt: new Date(DEMO_NOW.getTime() - day), store: "Facebook", logo: Facebook, subscriber: "Orlando Diggs", avatar: AvatarMale02, plan: "Affiliate Monthly $19.9", term: "Renewal", price: 9.95, status: "Active" },
	        { createdAt: new Date("2025-02-02T12:00:00Z"), store: "My illustration world", logo: Gradient01, subscriber: "Andi Lane", avatar: AvatarFemale03, plan: "Affiliate Yearly $189", term: "Renewal", price: 189, status: "Active" },
	        { createdAt: new Date(DEMO_NOW.getTime() - 20 * 1000), store: "Medium", logo: Medium, subscriber: "Natali Craig", avatar: AvatarFemale01, plan: "Yearly $189", term: "First", price: 189, status: "Active" },
	        { createdAt: new Date(DEMO_NOW.getTime() - 2 * minute), store: "Perplexity", logo: Perplexity, subscriber: "Kate Morrison", avatar: AvatarFemale02, plan: "Yearly $189", term: "First", price: 189, status: "Active" },
	        { createdAt: new Date(DEMO_NOW.getTime() - 2 * hour), store: "Figma", logo: FigmaA, subscriber: "Drew Cano", avatar: AvatarMale01, plan: "Yearly $189", term: "First", price: 189, status: "Active" },
	        { createdAt: new Date(DEMO_NOW.getTime() - day - hour), store: "Google", logo: Google, subscriber: "Orlando Diggs", avatar: AvatarMale02, plan: "Yearly $189", term: "First", price: 189, status: "Expired" },
	        { createdAt: new Date("2025-02-02T10:00:00Z"), store: "Slack", logo: Slack, subscriber: "Andi Lane", avatar: AvatarFemale03, plan: "Yearly $189", term: "First", price: 189, status: "Expired" },
	    ];
	    const initialRows = Array.from({ length: 200 }, (_, index) => {
	        const source = baseRows[index % baseRows.length];
	        return {
	            ...source,
	            id: index + 1,
	            note: source.term === "Renewal" ? "Subscription renewal" : "New subscription",
	            createdAt: new Date(
	                source.createdAt.getTime() -
	                    Math.floor(index / baseRows.length) * day,
	            ),
	        };
	    });
	    type Row = (typeof initialRows)[number];
	let rows = $state(initialRows);
	let page = $state(1);
	let pageSize = $state(10);
	let tableState = $state<DataTableRenderState<Row>>();
	let selectedRowIds = $state<Array<string | number>>([]);
	let query = $state('');
	let sort = $state<TableSortState>({ columnId: 'createdAt', direction: 'descending' });
	let feedback = $state('');
	const ACTIVE_ROW_ID = 2;
	const sorters = { createdAt: (row: Row) => row.createdAt, store: (row: Row) => row.store };
	const cellLinkStyle = 'color: inherit; text-decoration: none;';
	async function copySelected() {
	  try {
	    await navigator.clipboard.writeText(rows.filter(row => selectedRowIds.includes(row.id)).map(row => `${row.store} — ${row.subscriber}`).join('\n'));
	    feedback = 'Copied.';
	  } catch (error) { feedback = 'Copy unavailable.'; throw error; }
	}
	function deleteSelected() {
	  rows = rows.filter(row => !selectedRowIds.includes(row.id));
	  selectedRowIds = [];
	  feedback = 'Deleted.';
	}
</script>

    {#snippet subscriptionsHeader(showNote: boolean)}
        <TableHeader
            ><TableRow>
                <TableHead as="selection" />
                <TableHead columnId="createdAt" label="Date" resizable>Date</TableHead>
                <TableHead columnId="store" label="Stores" resizable>Stores</TableHead>
                <TableHead columnId="subscriber" label="Subscriber" resizable>Subscriber</TableHead>
                <TableHead columnId="price" label="Price" resizable>Price</TableHead>
                <TableHead columnId="status" label="Status" resizable>Status</TableHead>
                {#if showNote}<TableHead columnId="note" label="Note" resizable>Note</TableHead>{/if}
                <TableHead as="actions" />
            </TableRow></TableHeader
        >
    {/snippet}
    {#snippet subscriptionsBody(stateRows: Row[], showNote: boolean, activeRowId: number, onlyLastAction: boolean, footer: Snippet | undefined = undefined)}
        <TableBody>
            {#each stateRows as row (row.id)}
                <TableRow rowId={row.id} active={row.id === activeRowId}>
                    <TableCell as="selection" />
                    <TableCell columnId="createdAt" singleLine gap={1}>
                        <Text tag="a" lines={1} onclick={(event) => { event.preventDefault(); event.stopPropagation(); }} onauxclick={(event) => { event.preventDefault(); event.stopPropagation(); }} style={cellLinkStyle} href={`#subscription-${row.id}-created-at`}>
                            {formatDate(
                                    row.createdAt,
                                    { relative: true, now: DEMO_NOW, locale: 'en-US' },
                                )}
                        </Text>
                    </TableCell>
                    <TableCell columnId="store" singleLine>
                        <Avatar as="leading" src={row.logo} size={24} />
                        <Text tag="a" lines={1} onclick={(event) => { event.preventDefault(); event.stopPropagation(); }} onauxclick={(event) => { event.preventDefault(); event.stopPropagation(); }} style={cellLinkStyle} href={`#subscription-${row.id}-store`}>{row.store}</Text>
                    </TableCell>
                    <TableCell columnId="subscriber" singleLine>
                        <Avatar as="leading" src={row.avatar} size={24} />
                        <Text tag="a" lines={1} onclick={(event) => { event.preventDefault(); event.stopPropagation(); }} onauxclick={(event) => { event.preventDefault(); event.stopPropagation(); }} style={cellLinkStyle} href={`#subscription-${row.id}-subscriber`}>{row.subscriber}</Text>
                    </TableCell>
                    <TableCell columnId="price" singleLine gap={1}>
                        <Text tag="a" lines={1} onclick={(event) => { event.preventDefault(); event.stopPropagation(); }} onauxclick={(event) => { event.preventDefault(); event.stopPropagation(); }} style={cellLinkStyle} href={`#subscription-${row.id}-price`}>${row.price}</Text>
                        {#if row.term === "Renewal"}<Icon as="trailing" icon={Question} size={16} aria-label="Renewal price" />{/if}
                    </TableCell>
                    <TableCell columnId="status">
                        <a onclick={(event) => { event.preventDefault(); event.stopPropagation(); }} onauxclick={(event) => { event.preventDefault(); event.stopPropagation(); }} style={cellLinkStyle} href={`#subscription-${row.id}-status`}>
                            <Chip
                                variant="background"
                                style={`color:${row.status === "Active" ? "var(--secondary-green)" : "var(--black-40)"};`}
                                >{row.status}</Chip
                            >
                        </a>
                    </TableCell>
                    {#if showNote}<TableCell columnId="note" nowrap={false} lines={false}>
                            {row.note}
                    </TableCell>{/if}
                    <TableCell as="actions">
                        <OverflowActions moreLabel={`More actions for ${row.subscriber}`}>
                            {#if !onlyLastAction}
                                <OverflowAction as="item" id="edit" label="Edit" onclick={() => feedback = `Editing ${row.subscriber}.`} />
                                <OverflowAction as="item" id="info" label="Renewal info" icon="question" onclick={() => feedback = `${row.term} · ${row.plan}`} />
                                <OverflowAction as="item" id="sort" label="Sort by store" icon="sort-ascending" onclick={() => sort = { columnId: 'store', direction: 'ascending' }} />
                            {/if}
                            <OverflowAction as="item" id="details" label="Subscription details" onclick={() => feedback = `${row.store} · ${row.status}`} />
                        </OverflowActions>
                    </TableCell>
                </TableRow>
            {/each}
            {#if stateRows.length === 0}
                <TableRow data-empty-state="true">
                    <TableCell
                        colspan={showNote ? 8 : 7}
                        align="center"
                        lines={false}
                        tooltip={false}
                        style="height: 25rem;"
                    >
                        No subscriptions
                    </TableCell>
                </TableRow>
            {/if}
            {#if footer}{@render footer()}{/if}
        </TableBody>
    {/snippet}
<DataTable defaultSort={{ columnId: "createdAt", direction: "descending" }} variant="striped" {rows} {sorters} rowKey={(row) => row.id}
  selection actions horizontalScroll={false} roleLayout="overlay" bind:query bind:sort bind:pageSize bind:page
  bind:state={tableState} bind:selectedRowIds>
  <TableToolbar searchPlaceholder="Search subscriptions…" filterKey="status"
    filterOptions={[{ label: 'Active', value: 'Active' }, { label: 'Expired', value: 'Expired' }]}
    onCopy={copySelected} onDelete={deleteSelected} />
  <Table ariaLabel="Subscriptions">
    {@render subscriptionsHeader(true)}
    {@render subscriptionsBody(tableState?.rows ?? [], true, ACTIVE_ROW_ID, false)}
  </Table>
  <Pagination page={tableState?.page ?? 1} total={tableState?.totalPages ?? 1}
    bind:pageSize pageSizeOptions={[10, 20, 50]} onPageChange={(value) => page = value} />
</DataTable>
```


## API

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| rows | `T[]` | `[]` | 当前数据 |
| mode | `DataTableMode` | `"client"` | 客户端切片或服务端受控模式 默认行为：client。 |
| sorters | `Record<string, Sorter<T>>` | `{}` | 仅复杂派生列需要显式提供 |
| searcher | `Searcher<T>` | — | 覆盖 client 模式搜索逻辑 默认行为：浅层字符串/数字匹配。 |
| filterer | `Filterer<T>` | — | 覆盖 client 模式筛选逻辑 默认行为：字段等值匹配。 |
| rowKey | `(row: T, index: number) => string \| number` | `(_row, index) => index` | 稳定行身份读取器 默认行为：index。 |
| sort | `TableSortState` | `defaultSort` | 当前排序列与方向；client 模式执行排序，server 模式由调用方处理。 |
| defaultSort | `TableSortState` | — | 兼容用的初始单列排序；新代码优先在 TableHead 上声明 `defaultSort` |
| query | `string` | `""` | 当前搜索文本；client 模式执行搜索，server 模式由调用方处理。 |
| filters | `Record<string, unknown>` | `{}` | client 模式按字段执行等值或数组包含过滤 |
| page | `number` | `1` | 当前页码，从 1 开始；渲染状态会夹取到有效页范围。 |
| pageSize | `number` | `10` | 每页行数；变化时自动回到第 1 页 |
| totalRows | `number` | — | server 模式总行数 |
| loading | `boolean` | `false` | 首次加载状态，传递给表格加载与渲染状态。 |
| refreshing | `boolean` | `false` | 后台刷新状态，保留现有数据并通过渲染状态提供。 |
| loadMore | `DataTableLoadMore<T>` | — | 增量数据源；request 包含 offset、limit 和 AbortSignal |
| loadMoreSize | `number` | `5` | 每次增量加载的最大行数 |
| loadMoreMode | `DataTableLoadMoreMode` | `"manual"` | manual内置居中加载更多按钮，也可调用state.loadMore；auto由内部表尾哨兵触发。 |
| loadMoreThreshold | `number` | `80` | auto 模式越过表格底部后继续滚动多少 px 才触发 |
| loadMoreThrottleMs | `number` | `500` | auto 模式首次进入触发区后的确认等待时间，同时作为连续请求的最小间隔；首次等待期间离开触发区则取消 |
| hasMore | `boolean` | — | 显式覆盖是否仍可加载；否则优先按 totalRows 推导，再按返回数量推断 默认行为：自动推导。 |
| error | `unknown` | — | 外部错误，优先于增量加载错误进入 state.error；组件不自动生成业务错误文案。 |
| resetPageOnQuery | `boolean` | `true` | 查询或筛选变化时将页码重置为 1。 |
| onSortChange | `(sort: TableSortState \| undefined) => void` | — | 排序变化回调，取消排序时传入 undefined。 |
| onQueryChange | `(query: string) => void` | — | 查询文本变化时回调。 |
| onPageChange | `(page: number) => void` | — | 页码变化时回调，参数从 1 开始。 |
| onPageSizeChange | `(pageSize: number) => void` | — | 规范化后的每页行数变化时触发 |
| onStateChange | `(state: DataTableRenderState<T>) => void` | — | 当前渲染状态更新时回调，包含可见行、分页、选择及加载状态。 |
| state | `DataTableRenderState<T>` | — | 可绑定的当前渲染状态 |
| variant | `DataTableVariant` | `"divided"` | 行视觉；斑马纹或分割线 默认行为：divided。 |
| selectedRowIds | `Array<string \| number>` | `[]` | 已选行 id；选择状态由 DataTable 持有 |
| selection | `boolean` | `false` | 是否显示 checkbox 选择列；为 false 时 `as="selection"` 的 Head/Cell 不渲染 |
| actions | `boolean \| DataTableActionsConfig<T>` | `false` | 是否显示操作列；配置对象会在空 actions Cell 中默认生成 OverflowActions |
| horizontalScroll | `boolean` | `true` | 向 Table 下发横向滚动策略；false 时从右向左收起允许隐藏的普通列，保护列仍超宽时滚动兜底。 |
| roleLayout | `TableRoleLayout` | `"auto"` | 宽时角色列常驻，空间不足先转 hover 浮层；column / overlay 固定指定布局。 |
| roleOverlayLayers | `number` | `4` | overlay 渐进模糊层数 |
| roleOverlayBlurMode | `TableRoleOverlayBlurMode` | `"progressive"` | overlay 模糊算法 默认行为：progressive。 |
| roleOverlayUniformFeather | `number` | `0.3` | uniform 模式内侧羽化比例 |
| onRowPreview | `(row: T, state: DataTableRenderState<T>, event: MouseEvent) => void` | — | 配置后，TableRow 行内空白点击打开行预览；未配置时空白点击不响应 |
| onSelectedRowIdsChange | `(rowIds: Array<string \| number>) => void` | — | 选择变化后的完整快照 |
| children | `Snippet<[DataTableRenderState<T>]>` | — | 表格、工具栏和分页组合内容，接收当前渲染状态。 |

未重新声明的继承能力请查所属基础组件文档；本表只列本组件源码具名公开属性。

## 使用边界与详细说明

列标题通过 TableHead 的 children 插槽传入，支持文字、图标及非交互组件组合。纯图标标题需提供可访问名称；可排序列不要在标题内嵌套交互控件。详见 [TableHead 图标与组件标题](../table-head/reference.md#%E5%9B%BE%E6%A0%87%E4%B8%8E%E7%BB%84%E4%BB%B6%E6%A0%87%E9%A2%98)。

### 布局模型、排序与行视觉

主布局模型：**复合管理布局**。Root Frame 使用 `column + contentFill` 排列直系区域（默认间距 `var(--gap-3)` / 12px），不制造外层 padding，也不另建横向或纵向滚动容器；横向溢出与响应式收缩统一复用内部 [Table 响应式规则](../table/reference.md#%E5%93%8D%E5%BA%94%E5%BC%8F%E6%94%B6%E7%BC%A9%E4%B8%8E%E6%81%A2%E5%A4%8D)（Table 显式配置优先）。

- **自动与显式排序**：`columnId` 与行对象字段同名时自动可排序（日期字段直接保存 `Date`、数字时间戳或带时区 ISO 字符串，显示时用 `formatDate()`）；派生列通过 `sorters` 提供比较器。未声明任何 `defaultSort` 且 `sort === undefined` 时保留 `rows` 原始输入顺序。`TableHead defaultSort` 优先于 DataTable 同名兼容 prop，默认按“默认 → 反向 → 默认”循环（加 `defaultSortActive` 时改为“默认 → 反向 → 无排序 → 默认”）。
- **行变体与空态**：`striped` 从首行起使用 `Surface/3` 奇数行背景并常驻 12px 圆角；`divided` 表头下边线为 `Black/20%`、行分割线为 `Black/10%`，仅 hover 行形成 12px 圆角并隐藏上下分割线。空表或筛选为空时由 TableBody 显示本地化空文案、保留 `Black/20%` 表头底线并自动隐藏分页。

```svelte
<script lang="ts">
  import { DataTable, Pagination, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableToolbar, type DataTableRenderState } from '@snowui-design-system/components';
  const rows = [{ id: 'one', name: 'Project files' }];
  let page = $state(1);
  let state = $state<DataTableRenderState<(typeof rows)[number]>>();
</script>

<DataTable {rows} rowKey={(row) => row.id} bind:page bind:state variant="striped">
  <TableToolbar sort={false} filter={false} />
  <Table>
    <TableHeader><TableRow><TableHead columnId="name">名称</TableHead></TableRow></TableHeader>
    <TableBody>
      {#each state?.rows ?? [] as row (row.id)}
        <TableRow rowId={row.id}><TableCell columnId="name">{row.name}</TableCell></TableRow>
      {/each}
    </TableBody>
  </Table>
  <Pagination {page} total={state?.totalPages ?? 1} onPageChange={(next) => page = next} />
</DataTable>
```

### 选择列、操作列与行预览

默认只读（`selection={false}`、`actions={false}`）：即使模板写有 `<TableHead as="selection" />` / `<TableCell as="actions">`，关闭时整列不渲染且跳过选择集合计算。`actions={true}` 支持在 `<TableCell as="actions">` 内显式组合按钮；传入 `DataTableActionsConfig` 对象时，空 actions Cell 自动生成 `OverflowActions`（默认列宽 160px，`maxVisible` 缺省 3，支持 `buttonProps`、`parts`、`moreLabel`；操作区预算按局部 viewport 的 `min(20%, 14rem, 显式/拖动上限)` 先于数据列响应式分配，More 菜单展开期间冻结布局）：

```svelte
<DataTable
  {rows}
  rowKey={(row) => row.id}
  selection
  actions={{
    items: (row) => [
      { id: "edit", label: "编辑", icon: "pencil-simple" },
      { type: "separator", id: "danger" },
      { id: "delete", label: "删除", icon: "trash", disabled: !row.canDelete },
    ],
    overflow: "progressive",
    onAction: ({ row, actionId }) => runRowAction(row, actionId),
  }}
>
  …
</DataTable>
```

配置 `onRowPreview` 后，点击行内非交互空白区域触发预览（链接、按钮、输入控件及 selection / actions 区域不触发）。

### 加载态与增量加载

- **首次加载与刷新**：`loading && rows.length === 0` 时保留真实表头，由 TableBody 按 `pageSize`（默认 10）生成 40px `tr / td` Skeleton 行（`TableBody loading={false}` 可关闭）；已有 rows 时的 `loading` / `refreshing` 保留当前行并在表尾显示居中 Spinner 行。
- **增量加载（`loadMore`）**：`loadMoreMode="manual"` 由组件内置居中的 outline“加载更多”按钮（加载中或 `hasMore=false` 时自动隐藏，也可调用 `state.loadMore()`）；`loadMoreMode="auto"` 由内部表尾哨兵在越过表格底部 `loadMoreThreshold`（默认 80px）并稳定 `loadMoreThrottleMs`（默认 500ms）后触发。
