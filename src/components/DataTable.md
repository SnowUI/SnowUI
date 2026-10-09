# DataTable

> **许可阅读**：首次阅读组件文档、源码或 npm 使用流程，先读完整 [LICENSE](../../LICENSE)；同任务同版本去重。公开 API 配置与内部实现修改分别按许可处理；旧 OSS / PRO 标签仅表示迁移期技术来源。

> **版本**: v1.14.0
> **职责**: 统一管理数据的查询、排序与分页状态，可自由组合工具栏、表格和分页器，构建完整的数据浏览界面。
> **包归属**: `@snowui-design-system/components`
> **文档修订**: 2026-10-07

## 组件介绍

统一管理数据的查询、排序与分页状态，可自由组合工具栏、表格和分页器，构建完整的数据浏览界面。

## 使用选择

<!-- usage-guide:start -->
文件或记录列表需要搜索、筛选、排序、分页、勾选或操作列时使用。DataTable 协调数据状态，内部组合 TableToolbar、Table 系列与 Pagination；纯展示用 Table。选择需显式启用 selection，并使用稳定 rowKey 与行 rowId；操作列通过 actions 配置。业务请求函数与数据格式化由页面提供。

- client 模式在本地处理数据，server 模式由页面请求与提供结果；children 接收当前渲染状态。
- 显式启用 selection / actions；rowKey 默认是索引，排序或更新数据时应改用稳定业务 ID，并让 TableRow.rowId 与其一致。
- 页码从 1 开始；首次 loading、后台 refreshing 和追加 loadMore 是不同状态。
<!-- usage-guide:end -->

## 快速开始

以下示例展示推荐的基本组合。更多场景与组合限制见后文。

<!-- quick-start:generated -->
```svelte
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Avatar, Button, Chip, formatDate, Frame, Pagination, Switch, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, type TableSortState } from '@snowui-design-system/components';
	import { DataTable, TableToolbar, type DataTableLoadMoreRequest, type DataTableRenderState } from '@snowui-design-system/components';
	import { Apple, AvatarFemale01, AvatarFemale02, AvatarFemale03, AvatarMale01, AvatarMale02, Facebook, FigmaA, Google, Gradient01, MagicWand, Medium, Perplexity, Question, Slack, SnowLogo, SortAscending, Calendar, ThreeDots } from '@snowui-design-system/resource-svelte';
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
                <TableHead columnId="subscriber" resizable>Subscriber</TableHead>
                <TableHead columnId="price" resizable>Price</TableHead>
                <TableHead columnId="status" resizable>Status</TableHead>
                {#if showNote}<TableHead columnId="note" resizable>Note</TableHead>{/if}
                <TableHead as="actions" />
            </TableRow></TableHeader
        >
    {/snippet}
    {#snippet subscriptionsBody(stateRows: Row[], showNote: boolean, activeRowId: number, onlyLastAction: boolean, footer: Snippet | undefined = undefined)}
        <TableBody>
            {#each stateRows as row (row.id)}
                <TableRow rowId={row.id} active={row.id === activeRowId}>
                    <TableCell as="selection" />
                    <TableCell columnId="createdAt" row gap={1}>
                        <a onclick={(event) => { event.preventDefault(); event.stopPropagation(); }} onauxclick={(event) => { event.preventDefault(); event.stopPropagation(); }} style={cellLinkStyle} href={`#subscription-${row.id}-created-at`}>
                            {formatDate(
                                    row.createdAt,
                                    { relative: true, now: DEMO_NOW },
                                )}
                        </a>
                    </TableCell>
                    <TableCell columnId="store" row nowrap>
                        <Avatar src={row.logo} size={24} />
                        <a onclick={(event) => { event.preventDefault(); event.stopPropagation(); }} onauxclick={(event) => { event.preventDefault(); event.stopPropagation(); }} style={cellLinkStyle} href={`#subscription-${row.id}-store`}>{row.store}</a>
                    </TableCell>
                    <TableCell columnId="subscriber" row nowrap>
                        <Avatar src={row.avatar} size={24} />
                        <a onclick={(event) => { event.preventDefault(); event.stopPropagation(); }} onauxclick={(event) => { event.preventDefault(); event.stopPropagation(); }} style={cellLinkStyle} href={`#subscription-${row.id}-subscriber`}>{row.subscriber}</a>
                    </TableCell>
                    <TableCell columnId="price" row gap={1} nowrap>
                        <a onclick={(event) => { event.preventDefault(); event.stopPropagation(); }} onauxclick={(event) => { event.preventDefault(); event.stopPropagation(); }} style={cellLinkStyle} href={`#subscription-${row.id}-price`}>${row.price}</a>
                        {#if row.term === "Renewal"}<Question size={16} aria-label="Renewal price" />{/if}
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
                        {#if !onlyLastAction}
                            <Button onclick={() => feedback = `Editing ${row.subscriber}.`}>Edit</Button>
                            <Button aria-label="Renewal info" onclick={() => feedback = `${row.term} · ${row.plan}`} bare
                                ><Question size={16} /></Button
                            >
                            <Button aria-label="Sort by store" onclick={() => sort = { columnId: 'store', direction: 'ascending' }} bare
                                ><SortAscending size={16} /></Button
                            >
                        {/if}
                        <Button bare onclick={() => feedback = `${row.store} · ${row.status}`}
                            aria-label={`More actions for ${row.subscriber}`}
                            ><ThreeDots size={16} /></Button
                        >
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
  selection actions roleLayout="overlay" bind:query bind:sort bind:pageSize bind:page
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
<!-- /quick-start:generated -->

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
| loadMoreMode | `DataTableLoadMoreMode` | `"manual"` | 手动调用 `state.loadMore()`，或由内部表尾哨兵自动触发 默认行为：manual。 |
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

列标题通过 TableHead 的 children 插槽传入，支持文字、图标及非交互组件组合。纯图标标题需提供可访问名称；可排序列不要在标题内嵌套交互控件。详见 [TableHead 图标与组件标题](TableHead.md#图标与组件标题)。

<a id="布局模型"></a>

### 布局模型

主布局模型：**复合管理布局**。

结构：

- Root FramePro（column 状态与组合外壳）
  - 使用方组合的 TableToolbar（可选固定操作区）
  - Table（语义表格区）
  - Pagination（可选分页区）
  - 使用方声明的 loading / error / empty 等其他状态区

局部布局来源：Root FramePro 使用 `column + contentFill` 管理直系区域；TableToolbar 保持自身的 row 槽位宿主布局，Table 保持原生表格布局，Pagination 保持内联外壳布局。DataTable 只协调区域排列和数据状态，不改写子组件的主布局模型。

padding 归属：DataTable 根层不制造 padding；工具栏、表格 Cell、分页和自定义状态区分别由各自组件负责。内部 Table 的表头与数据 Cell 左右 padding 按 Table 容器宽度在 4px 到 12px 之间响应，上下保持 8px，表格外缘最小 8px、相邻列内容间最小 8px；DataTable 不复制单元格 padding 实现。

gap 归属：Root FramePro 统一控制直系区域间距，默认为 `var(--gap-3)`（12px）；子组件内部 gap 由子组件自身控制。

滚动归属：DataTable 不另建滚动区，水平溢出直接继承内部 Table 的局部横向 viewport 与视口贴底轨道；纵向虚拟化或固定表头仍由上层业务区域明确提供。`loadMoreMode="auto"` 只在 DataTable 内部观察表尾哨兵：优先使用最近的纵向滚动祖先作为 root，找不到时使用页面视口，不改变纵向滚动容器归属。



`columnId` 与行对象字段同名时，DataTable 自动读取原始字段并使该 TableHead 可排序。因此日期列保存 `Date`、数字时间戳或带时区的 ISO 8601 日期时间即可，不需要声明 `sortType: "date"`。展示值来自计算结果时传 `sorters`。无同名字段且无 sorter 的 TableHead 保持静态。

未在任何 TableHead 或 DataTable 上声明 `defaultSort`，且当前 `sort === undefined` 时，DataTable **不推导第一列升序**，也不施加任何其他隐式排序。客户端模式直接保留 `rows` prop 的输入顺序；页面传入 `filteredRows` 时，就恢复 / 保持 `filteredRows` 的原始相对顺序。

TableHead `defaultSort` 同时定义默认列与默认方向，优先于 DataTable 自身的兼容 prop。默认时该列按“默认 → 反向 → 默认”循环，仅反向显示激活视觉。TableHead 同时声明 `defaultSortActive` 时，默认方向也显示激活视觉，循环改为“默认 → 反向 → 无排序 → 默认”。其他列保持“无排序 → ascending → descending → 无排序”。

```svelte
<script lang="ts">
  import { Pagination, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@snowui-design-system/components';
  import { DataTable, TableToolbar, type DataTableRenderState } from '@snowui-design-system/components';
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

相对日期的正确写法是 `formatDate(row.createdAt, { relative: true, now })`。排序继续比较 `row.createdAt`，不会比较 `Just now`。

DataTable 的工具栏、Table 和 Pagination 默认区域间距为 12px。`striped` 从第一行开始使用 Surface/3 作为奇数行背景，不显示分割线，所有数据行始终保持 12px 外缘圆角；`divided` 的表头与静态数据行两端保持直角，表头下边线为 Black/20% 0.5px，数据行分割线为 Black/10% 0.5px，末行无分割线。分割线模式下，hover 行首尾形成 12px 圆角，且上下相邻分割线同时隐藏；鼠标移出时背景立即退场，不显示圆角恢复直角的背景残影。

<a id="选择列与操作列"></a>

### 响应式

与 OSS Table 共用[完整响应式规则](Table.md#响应式收缩与恢复)：先角色列转浮层，再压缩间距，最后滚动或从右向左隐藏普通列。`horizontalScroll` 默认 true；设为 false 时允许隐藏，`TableHead responsiveHide={false}` 保护指定列，第一普通列始终保留。最终单列的纯文本可收缩，不换行内容省略并默认提供 Tooltip 全文；硬尺寸或不可压缩控件仍滚动兜底。Table 的显式配置优先；DataTable 不另建测量或滚动层。

### 选择列与操作列

默认 **只读表**：`selection={false}`、`actions={false}`，不显示 checkbox 列与操作列。markup 中仍可声明 `<TableHead as="selection" />` / `<TableCell as="actions">` 等；DataTable 关闭时整列不渲染、不参与列注册。

只读默认态同时跳过行选择 Set 查询与全选集合扫描；TableRow 不读取选中状态、不注册 rowId。开启 `selection` 后再恢复完整选择路径，DOM 与交互协议不变。

```svelte
<!-- 默认：无 checkbox、无操作列 -->
<DataTable {rows}>…</DataTable>

<!-- 多选 + 操作列 -->
<DataTable selection actions {rows}>…</DataTable>

<!-- 只要多选 -->
<DataTable selection {rows}>…</DataTable>

<!-- 只要操作列 -->
<DataTable actions {rows}>…</DataTable>
```

`actions={true}` 保留原有显式组合：业务仍可在每个 `<TableCell as="actions">` 中自行书写按钮。传入配置对象时，未声明 children 的 actions Cell 默认使用 `OverflowActions`；显式 children 始终替换默认内容。

```svelte
<DataTable
    {rows}
    rowKey={(row) => row.id}
    actions={{
        items: (row) => [
            { id: "edit", label: "编辑", icon: "pencil-simple" },
            { type: "separator", id: "danger" },
            { id: "delete", label: "删除", icon: "trash", disabled: !row.canDelete },
        ],
        overflow: "progressive",
        overflowFrom: "end",
        width: 120,
        minWidth: 40,
        maxWidth: 240,
        resizable: true,
        onAction: ({ row, actionId }) => runRowAction(row, actionId),
    }}
>
    ...
</DataTable>
```

配置模式的默认列宽为 160px；`compact="auto"`、`overflow="all"`、`overflowFrom="end"`。`resizable` 默认 false；仅 `roleLayout="column"` 支持 actions 列拖动，overlay 模式始终不提供列宽 Indicator。拖动结果由 Table 的 `columnWidths.__actions` 接管并实时下发到各行；每个 OverflowActions 接收数值 `availableWidth`，不会为每个 Cell 新建尺寸观察器。overlay 模式使用同一 actions 宽度作为浮层宽度。

当 More 菜单展开时，当前响应式分配被冻结，行 hover 显隐规则也把打开的 SelectButton 视为保持可见，避免列宽或指针离开行后触发器消失。Separator 只在两侧仍有操作时保留，不会独立留在可见区域或菜单首尾。

<a id="行预览"></a>

### 行预览

配置 `onRowPreview` 后，DataTable 通过 Table Context 向 TableRow 提供行预览处理器。TableRow 只在行内空白区域触发该处理器；点击链接、按钮、输入控件、选择列或 actions 列控件不会触发行预览。未配置 `onRowPreview` 时，行内空白点击不响应；`selection={true}` 时选择仍由 selection 角色列负责。

<a id="首次加载-skeleton-rows"></a>

### 首次加载 Skeleton rows

`loading && rows.length === 0` 时，DataTable 通过 Table Context 向后代 `TableBody` 提供首次加载语义；`TableBody` 保留真实 `TableHeader`，并按已注册的 `TableHead` 列结构自动生成与当前 `pageSize` 相同数量的 40px Skeleton 数据行。Skeleton 行使用真实 `tr / td` 语义结构但整体 `aria-hidden`，DataTable 根继续输出 `aria-busy="true"`。

- 骨架行数直接跟随规范化后的 `pageSize`；默认 `pageSize=10`，因此未设置分页行数时生成 10 行。
- 不提供独立 Skeleton 行数属性，避免加载态与真实分页数据高度不一致，尽可能降低首次数据出现时的页面跳动。
- Skeleton 只替代首次空数据加载；`loading` 或 `refreshing` 时若已有 rows，继续保留现有数据，并在 TableBody 末尾追加跨列居中的 Spinner 行，避免刷新时布局跳动且明确表达仍在加载。
- `TableHead` 通过双方文档明确的 Table Context 注册列顺序、角色与列宽标识；DataTable / TableBody 不扫描子组件类名或内部 DOM。
- `TableBody loading={false}` 可显式关闭从 DataTable Context 继承的 Skeleton rows；独立 OSS Table 可用 `<TableBody loading>` 主动启用，此时无法读取分页行数，回退为 10 行。

<a id="内部加载更多管线"></a>


## AI Zone

以下章节保留源码维护约束，不属于应用接入步骤。

### 内部加载更多管线

页面通过 `loadMore` 提供服务器读取函数，通过 `state.loadMore()` 触发；DataTable 内部完成以下工作：

1. 以当前累计 rows 数量和 `loadMoreSize` 生成 `{ offset, limit, signal }`，阻止并发重复请求并在销毁时 abort。
2. 请求开始后显示 TableBody 内置 Spinner，并先让后代 Table 锁定当前自然列宽，再读取 `loadMore` 数据源。`loadMore` 可返回数组、Promise 数组或 AsyncIterable；AsyncIterable 每 yield 一条即可提前展示，不必等待服务器完成整批响应。
3. 第一条新数据开始提交时立即隐藏 Spinner，并把该 row 加入内部累计 rows。
4. 普通 TableCell 根据稳定 `rowId` 自动读取 Context，进入 Frame `Appear` 状态并执行纯 `opacity: 0 → 1` 渐显；selection / actions 角色 Cell 不消费内部新增行动效，保证 hover 控件始终以完整 opacity 显示。行提交间隔与单行渐显时长分别由 DataTable 内部常量控制；多行渐显可以重叠，不会等待当前行完整渐显后才消费下一条。展示间隔为 `0` 时不会创建定时任务，同批本地数据在同一轮更新中提交。
5. 流结束后更新 `loadingMore / hasMore / error`。显式 `hasMore` 优先；其次使用 `totalRows`；两者都没有时，返回数量少于 `loadMoreSize` 即视为结束。

`DataTableRenderState` 提供 `loadingMore`、`hasMore`、`loadMoreSize` 与 `loadMore()`。`loadMoreMode="manual"` 时，页面可放置按钮并调用 `state.loadMore()`；仍有数据时显示常态按钮，没有更多数据时直接移除按钮。`loadMoreMode="auto"` 时，DataTable 在根层内部生成不占布局的表尾哨兵。哨兵默认位于表格底部下方 80px：只有表格底部先越过滚动区域底部、用户再继续下滚 80px，哨兵才进入可见区域。首次进入后默认等待 500ms 确认滚动已经稳定；等待期间若上滚离开触发区则取消，停留或继续下滚才调用 `loadMore()`。后续请求沿用 500ms 最小间隔。这样可避免首次请求在滚动惯性尚未结束时插入 Spinner / 新行并扩展滚动高度，造成页面继续缓动。`loadingMore` 继续阻止并发，`hasMore=false` 时内部哨兵自动移除；请求错误后暂停自动重试，避免表尾持续失败循环，业务仍可调用 `state.loadMore()` 主动重试。页面无需声明 IntersectionObserver、哨兵或滚动方向逻辑。




DataTable 不发起请求，也不格式化业务字段。预取、缓存和无延迟切换属于页面数据层；日期显示统一使用 OSS `formatDate()`。

## 更新日志

- 2026-10-07：响应式单元格每侧最小 padding 从 2px 调整为 4px，相邻列最小内容间距为 8px。

- 2026-10-07：v1.14.0，新增 horizontalScroll 策略，roleLayout 默认 auto；所有响应式布局交由 OSS Table 统一计算，保留显式 column / overlay。

- 2026-09-21：统一使用文档、源码属性表与 Site / LLM 阅读入口；仅文档修订，不改变组件行为。

- 2026-08-14：v1.13.0，组合的 TableHead / TableCell 左右 padding 随内部 Table 容器宽度在 2px 到 12px 之间响应；保持由 OSS Table 单元格唯一拥有实现。
- 2026-08-06：v1.12.0，只读默认态复用稳定空选择状态并跳过逐行 Set 查询 / 全选集合扫描；开启 selection 后保持完整选择行为。
- 2026-07-12：v1.11.0，新增 `selection` / `actions`（默认 false）；默认不显示 checkbox 与操作列，可独立开启。
- 2026-07-08：v1.10.0，新增 `onRowPreview` 行空白点击预览协议；未配置时空白点击不再切换选中。

- 2026-07-07：优化客户端数据管线：搜索与筛选合并为单次遍历；无查询、筛选、排序或增量数据时复用原数组；选择判断使用 Set，减少大数据表的重复线性查找。

- 2026-07-05：v3.0.0，独占 checkbox 选择列、按钮操作列及其选择状态 / overlay 布局；TableToolbar 改为 PRO DataTable 专用组件。

- 2026-07-01：v2.0.0，client 模式内置 query 与 filters 数据处理，并向 TableToolbar 提供查询、筛选、排序和可排序列 Context。
- 2026-07-01：v1.9.0，`pageSize` 支持双向绑定；每页行数变化时自动回到第 1 页，并新增 `onPageSizeChange`。
- 2026-06-30：v1.8.4，首次增量加载在读取数据源前等待 Table 锁定当前自然列宽，避免后续更宽内容触发原生列宽重排、带动初始行左右晃动；手动与自动加载共用该行为。
- 2026-06-30：v1.8.3，auto 模式首次进入触发区也执行默认 500ms 确认等待，离开触发区则取消；避免滚动惯性期间插入 Spinner / 新行扩展滚动高度而带动页面缓动。
- 2026-06-30：v1.8.2，新增行 opacity 渐显从 TableRow 迁移到普通 TableCell，排除 selection/actions overlay，修复加载期间 hover Checkbox 被双重透明度压暗的问题。
- 2026-06-30：v1.8.1，修正 `loadMoreThreshold` 方向：内部哨兵下移到表格底部之后，默认需越过表尾继续滚动 80px 才触发，不再使用正 rootMargin 提前加载。
- 2026-06-30：v1.8.0，新增组件内置自动加载：`loadMoreMode="auto"`、`loadMoreThreshold`（默认 80px）与 `loadMoreThrottleMs`（默认 500ms）；内部管理表尾哨兵、最近滚动祖先、请求节流和清理，页面不再编写 IntersectionObserver。
- 2026-06-30：v1.7.6，页面自动加载示例改为向下进入触发区后延迟 500ms；停留或继续下滚时加载，期间向上滚出触发区则取消。
- 2026-06-30：v1.7.5，适配 Frame `while*` 完整视觉通道语义，删除 `scale: undefined` 临时抵消配置；实验常量数值保持不变。
- 2026-06-30：v1.7.4，新增行渐显配置显式移除 Frame 通用 appear preset 的 scale，只执行 opacity 渐显。
- 2026-06-30：v1.7.3，展示间隔为 0 时跳过 `setTimeout`，避免零时长定时器仍把各行拆到不同事件循环任务；明确服务器数据到达节奏与组件展示节奏的边界。
- 2026-06-30：v1.7.2，修复新增行只获得 `whileAppear` 配置却未进入 Frame `Appear` 状态、导致 opacity 渐显未执行的问题；逐条提交间隔恢复为 100ms，单行渐显保持 1000ms 并允许彼此重叠。
- 2026-06-30：v1.7.1，将内部流式新增行的 opacity 渐显和逐条消费等待统一延长至 1000ms，用于清晰验证渐显效果。
- 2026-06-30：v1.7.0，真正内置增量加载管线：新增 `loadMore / loadMoreSize / hasMore` 与 render-state `loadMore()`；支持 AsyncIterable 流式响应、逐条合并、首行开始时隐藏 Spinner、TableRow 自动 250ms 渐显及请求中止。
- 2026-06-30：v1.6.0，已有 rows 的 `loading` / `refreshing` 状态新增末尾 Spinner 行；Spinner 尺寸由 Table `loadingSpinnerSize` 控制，默认 16×16px。
- 2026-06-30：v1.5.1，移除 `skeletonRows`；首次加载骨架行数直接跟随 `pageSize`，无法读取分页配置时回退为默认 10 行。
- 2026-06-30：v1.5.0，新增首次加载 Skeleton rows：`loading && rows.length === 0` 时保留真实表头，由 TableBody 按 TableHead 注册列自动生成骨架行；新增 `skeletonRows`，已有 rows 的加载/刷新不替换数据。
- 2026-06-30：v1.4.3，striped 所有数据行固定保持 12px 圆角；divided hover 背景仅进入时过渡、移出时立即退场，消除圆角恢复过程的视觉残影。
- 2026-06-30：v1.4.2，默认 divided 变体移除表头与静态数据行两端圆角；数据行仅在 hover 时形成 12px 圆角，并补齐隐藏 hover 行上方分割线。
- 2026-06-22：v1.4.1，明确未声明 `defaultSort` 时不存在“第一列默认升序”；`sort === undefined` 始终保留输入 rows / filteredRows 顺序。
- 2026-06-22：v1.4.0，接入 TableHead `defaultSortActive` 默认激活与可取消排序循环；撤销 v1.3.1 的显式 `sortable` 要求，恢复同名原始字段 / sorter 自动启用排序。
- 2026-06-22：v1.3.1，排序能力改为由 TableHead `sortable` / `defaultSort` 显式开启，不再因数据字段同名自动使列头可交互。
- 2026-06-22：v1.3.0，支持由 TableHead `defaultSort` 注册默认排序列与方向；DataTable 同名对象 prop 保留为兼容回退。
- 2026-06-22：v1.2.2，将 `defaultSort` 方向纳入 Table context；默认列按“默认 → 反向 → 默认”循环，供 TableHead 区分默认与反向视觉。
- 2026-06-22：v1.2.1，补充复合管理布局的区域结构、局部复用、padding / gap 与滚动归属；更正工具栏示例名称。
- 2026-06-20：v1.2.0，默认区域 gap 改为 12px；新增 striped/divided 两种行视觉。
- 2026-06-19：v1.1.0，增加 defaultSort 与同名字段自动排序；恢复 Toolbar / Table / Pagination 显式自由组合。
- 2026-06-19：v1.0.0，新增客户端排序、分页切片和 server 边界。
