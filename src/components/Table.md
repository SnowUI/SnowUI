# Table

> **版本**: v2.7.1
> **职责**: 以语义化表格展示结构化数据，支持自适应列宽、局部横向滚动与加载状态，可自由组合表头和单元格。
> **包归属**: `@snowui-design-system/components`
> **文档修订**: 2026-10-21

## 组件介绍

以语义化表格展示结构化数据，支持自适应列宽、局部横向滚动与加载状态，可自由组合表头和单元格。

## 使用选择

<!-- usage-guide:start -->
用于纯展示结构化数据，并组合 TableHeader、TableBody、TableRow、TableHead、TableCell。出现搜索、排序、勾选、操作列或分页时由 DataTable 协调，不在普通 Table 外复制数据管理行为。

- 通过 TableHeader / TableBody / TableRow 等保持合法表格层级。
- columnWidths 保存列宽，columnId 对齐同一列；数据查询、选择、分页交给 DataTable。
<!-- usage-guide:end -->

## 快速开始

以下示例展示推荐的基本组合。更多场景与组合限制见后文。

<!-- quick-start:generated -->
```svelte
<script lang="ts">
	import { Table, Chip, Button, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@snowui-design-system/components';
	const invoices = [
	  { id: "INV-1048", customer: "Linear", status: "Paid", amount: "$240.00", note: "Design system subscription" },
	  { id: "INV-1047", customer: "Figma", status: "Paid", amount: "$120.00", note: "Additional seats for the product team" },
	  { id: "INV-1046", customer: "Notion", status: "Pending", amount: "$360.00", note: "Annual subscription, awaiting approval" },
	  { id: "INV-1045", customer: "Vercel", status: "Paid", amount: "$180.00", note: "Component library subscription" },
	  { id: "INV-1044", customer: "Framer", status: "Overdue", amount: "$90.00", note: "Payment reminder sent" },
	];
</script>

<Table ariaLabel="Sample invoices">
  <TableHeader>
    <TableRow>
      <TableHead columnId="invoice">Invoice</TableHead>
      <TableHead columnId="customer">Customer</TableHead>
      <TableHead columnId="status">Status</TableHead>
      <TableHead columnId="amount" align="end">Amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {#each invoices as invoice (invoice.id)}
      <TableRow rowId={invoice.id}>
        <TableCell columnId="invoice">{invoice.id}</TableCell>
        <TableCell columnId="customer">{invoice.customer}</TableCell>
        <TableCell columnId="status"><Chip variant="background" style={`color: ${invoice.status === "Paid" ? "var(--secondary-green)" : invoice.status === "Pending" ? "var(--secondary-orange)" : "var(--secondary-red)"};`}>{invoice.status}</Chip></TableCell>
        <TableCell columnId="amount" align="end">{invoice.amount}</TableCell>
      </TableRow>
    {/each}
  </TableBody>
</Table>
```
<!-- /quick-start:generated -->

## API

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| columnWidths | `Record<string, number>` | `{}` | 受控列宽，可 `bind:` |
| horizontalScroll | `boolean` | `true`（继承 DataTable） | 默认保留全部列并横向滚动；false 时先从右向左隐藏可隐藏列，保留列仍超宽时滚动兜底。 |
| roleLayout | `TableRoleLayout` | DataTable 配置或 `"auto"` | auto 根据空间在常驻 column 和 hover overlay 之间切换；显式 column / overlay 固定布局。 |
| minWidth | `number \| string` | — | 显式扩大表格最小宽度；未设置时由各列 min-content + Cell padding 自动汇总，溢出由 Table 内置局部横向 viewport 承接 |
| ariaLabel | `string` | — | 表格的业务可访问名称，保持调用方原文；横向滚动区域会按当前 LocaleProvider 在该名称后补充“可横向滚动”，未提供时使用本地化的通用名称。 |
| loadingSpinnerSize | `ResourceSize` | `16` | 已有数据继续加载时，表体末尾居中 Spinner 的尺寸 |
| onColumnWidthsChange | `(widths: Record<string, number>) => void` | — | 拖动列宽后的完整快照 |
| children | `Snippet` | — | 语义表格内容，无参数；组合 TableHeader / TableBody，数据管理由外层 DataTable 提供。 |

未重新声明的继承能力请查所属基础组件文档；本表只列本组件源码具名公开属性。

## 使用边界与详细说明

列标题通过 TableHead 的 children 插槽传入，支持文字、图标及非交互组件组合。纯图标标题需提供可访问名称；可排序列不要在标题内嵌套交互控件。详见 [TableHead 图标与组件标题](TableHead.md#图标与组件标题)。

<a id="oss-table-与-pro-datatable-的边界"></a>

### Table 与 DataTable 的边界

普通 `Table` 是纯数据展示组件：只负责以原生表格语义渲染表头和数据行。普通表格不提供加载更多、checkbox 选择列、按钮操作列、排序、筛选、分页或搜索。

出现上述任一数据管理或操作能力时，使用 `DataTable`：

| 能力 | Table | DataTable |
| :--- | :---: | :---: |
| 表头与数据行展示 | ✓ | ✓ |
| 加载更多 | — | ✓ |
| checkbox 选择列 | — | ✓ |
| 按钮操作列 | — | ✓ |
| 排序与筛选 | — | ✓ |
| 分页 | — | ✓ |
| 搜索 / TableToolbar | — | ✓ |

首次加载 Skeleton 与已有数据加载 Spinner 是 Table 的加载**展示协议**，不包含请求、加载更多、分页或其他数据管理逻辑；这些状态由调用方显式传入，或由 DataTable 协调。

<a id="布局模型"></a>

### 布局模型

主布局模型：**复合管理布局**。

结构：

- Root Frame（表格边界与 overlay scrollbar host）
  - Horizontal viewport（可聚焦的局部滚动区）
    - Native table（原生表格排版）
    - TableHeader / TableBody（`thead` / `tbody`）
      - TableRow（`tr`）
        - TableHead / TableCell（`th` / `td`）

局部布局来源：Root Frame 不声明 `row` / `column`，不启用通用槽位排列；`table` 及各语义子项显式关闭 Auto Layout，保持浏览器原生表格布局。TableHead 内部的排序按钮和 Indicator、TableCell 的可选内容 row 属于各子组件的局部布局。

padding 归属：Table 根层和原生 table 不制造 padding；表头与数据单元格分别由 TableHead / TableCell 负责 padding。普通、selection 与 actions 单元格的左右 padding 按 Table 自身可用宽度与内容需求在 `4px → 12px` 之间流动：窄容器优先收敛到每侧 4px，使相邻列的最小视觉间距为 8px；宽容器恢复每侧 12px；表格外缘与角色浮层的左右留白至少 8px。上下 padding 保持 8px；已登记的 Head/Cell padding override 仍可整体接管。

gap 归属：原生表格列之间无通用 gap，视觉间距来自 Cell padding；TableCell 复合内容的 gap 由 TableCell 自身控制。

固有最小宽度：未声明 `columnWidths` / `minWidth` 时，原生 `table-layout:auto` 以各列内容的 min-content 宽度自动形成整表最小宽度，并至少填满宿主。普通可换行单元格以“最长不可断单词 / 片段 + 单元格左右 padding”为列的自动下限，不会逐字拆分标识符。`lines={1}` / `nowrap` 内容的整行是不可断片段，因而会产生更保守的列下限。任一显式 `columnWidths`、拖动列宽或固定宽度都属于调用方主动覆盖，该列改按 TableCell / TableHead 的截断规则处理。

普通 Table 不提供 checkbox 选择列或按钮操作列。`TableHead/TableCell as="selection|actions"` 只有位于 DataTable Context 中才激活；选择状态、角色布局与批量操作均由 DataTable 持有。

普通 Table 的 TableHead 默认不允许拖动修改列宽；需要时显式传入 `resizable`。DataTable 的普通列保持默认可拖动，显式 `resizable={false}` 可关闭。该默认能力只负责列宽，不会让普通 Table 自动拥有数据排序规则。

DataTable selection 角色中，TableHead 的全选 Checkbox 与 TableCell 的行 Checkbox 默认使用 `calc(var(--size-4) + 0.0625rem)`，即 17×17px。额外的 `0.0625rem` 是 [StyleSpec.md §2.2.2](../../../docs/standards/StyleSpec.md) 登记的 Table 视觉居中特例，不借用任何边框 Token，也不改变 Checkbox 组件自身的 16px 默认值；可通过 `--snowui-table-selection-checkbox-size-override` 覆盖。

首次加载列协议：TableHead 通过 Table Context 显式注册列结构；TableBody 在 `loading` 生效时按该结构生成真实 `tr / td` Skeleton rows。首次加载只消费同一语义表格内部的列注册；响应式布局另由 Table 私有控制器测量所拥有的原生表格网格。DataTable 可通过继承的同一 Context 提供“首次加载且 rows 为空”状态与规范化后的 `pageSize`；独立 Table 也可由 TableBody 显式启用；已知数据数量时传入 `rowCount`，未知时按外部容器可见高度估算，详见 TableBody 文档。

已有数据加载协议：`loading` 或 `refreshing` 生效且当前存在可见数据行时，TableBody 保留业务行并在末尾追加一个真实 `tr / td` 加载行；单元格通过 `colspan` 跨越已注册表头列，内部复用 SnowUI 通用 `<Spinner size={16} />` 并在 40px 行内水平、垂直居中。表格加载 Spinner 默认 16×16px，可通过 Table 的 `loadingSpinnerSize` 统一设置。

Spinner 本体由 TableBody 内部创建，不要求页面在 Demo 或业务模板中手写。页面提供真实请求函数，并选择手动按钮调用 `DataTableRenderState.loadMore()` 或声明 `loadMoreMode="auto"`；DataTable 内部负责自动观察、请求节流、并发保护、逐条合并数据、hasMore、Spinner 时机与新增行渐显。

DataTable 的自动加载由其内部表尾哨兵负责。页面只需声明 `loadMoreMode="auto"` 和数据源；默认需让表格底部越过最近纵向滚动区域底部，再继续下滚 80px 才触发，连续请求至少间隔 500ms。Table / DataTable 仍不创建纵向滚动容器，也不改变外层 ScrollArea 或页面的纵向滚动归属。

DataTable 每收到一条数据就提交一条可见 row，并通过 Table Context 让对应行的普通 `TableCell` 进入 Frame `Appear` 状态，显式执行纯 `opacity: 0 → 1` 动效，不产生尺寸缩放。selection / actions 角色 Cell 不消费该内部动效，避免行级 opacity 与控件自身 hover opacity 相乘导致 Checkbox / actions 暂时不可见。第一条新行开始渐显时立即隐藏 Spinner；后续数据按 DataTable 内部配置的展示间隔逐条出现，各行动效彼此重叠。展示间隔为 0 时，同批本地数据在同一轮更新中提交。TableRow / TableCell 显式传入的 `whileAppear` 仍优先于内部动效。

增量加载首次开始时，Table 会在请求数据提交前测量当前表头普通数据列的自然宽度，并把尚未由 `columnWidths` 显式设置的列锁定到该宽度。后续新行中的更宽内容只在既有列宽内截断，不再让原生 `table-layout:auto` 重新分配全部列宽、带动已有行左右移动。自动锁定只执行一次并保持到当前 Table 销毁；外部 `columnWidths` 与用户拖动列宽始终优先。

角色列布局：默认 `roleLayout="auto"` 根据宽度决定常驻或浮层。显式 `roleLayout="column"` 时，selection/actions 作为普通窄列参与表格列宽；`roleLayout="overlay"` 时，角色单元格仍保留合法 table DOM，但自身宽度归零并 sticky 到表格左右边缘，内容以覆盖块浮在表格行之上。覆盖块使用左右方向相反的横向交叠 blur strip 柔化后方内容：selection 从左向右透明，actions 从右向左透明；blur layer 常驻，控件自身独立淡入淡出，避免 hover 时重建模糊层。

### 在 DataTable 中的选择与覆盖布局

本节描述 DataTable 协调下的组合行为。`roleOverlayLayers`、`roleOverlayBlurMode`、`roleOverlayUniformFeather` 与 `selectedRowIds` 传给外层 DataTable；`roleLayout` 与 `horizontalScroll` 可由 Table 显式覆盖。

`roleLayout="overlay"` 的数据行 selection 采用“合法 table 单元格 + fixed 覆盖块”的两层结构：

- `TableCell as="selection"` 仍然渲染真实 `<td>`，该 `<td>` 在 overlay 模式下宽度、最小宽度和最大宽度都归零，并 sticky 到左侧，只作为合法 table DOM 和定位锚点存在。
- 单元格内部的 `.snowui-table-selection-control` 通过 `getBoundingClientRect()` 读取当前 `tr` 的屏幕位置，在 scroll / resize / row resize 时同步为 `position: fixed`。selection 覆盖块固定到行左侧，宽度为 `--size-8`（32px），高度等于当前行高度，`z-index` 设为最高层，保证压在第一列真实内容之上。
- Checkbox 和 `.snowui-table-role-blur-layer` 位于同一个 `.snowui-table-selection-control` 容器内。Checkbox 作为真实交互控件保留在最上层；blur layer 使用 `aria-hidden` 且 `pointer-events: none`，只承担视觉效果，不参与点击命中。
- 渐进式模糊复用 `components/src/lib/progressive-blur.ts`。selection 方向为 left-to-right：左侧强模糊，向右逐渐清晰；actions 方向相反。Table Demo 中的控制条通过 `--snowui-table-role-overlay-blur-override` 和 `--snowui-table-role-overlay-width-override` 修改最大 blur 半径和可见宽度。
- 模糊层数与模糊模式由 `roleOverlayLayers` 和 `roleOverlayBlurMode` 两个 DataTable 属性统一控制，并通过 Table context 下发给同一个表格内的 selection / actions 角色块（表头 TableHead 与数据单元格 TableCell 共用同一控制器，无需逐处传参）。`roleOverlayLayers` 决定渐进式模糊叠加的层数（层数越多强度过渡越平滑）；`roleOverlayBlurMode="uniform"` 时改用 `createUniformBlurStyles` 渲染单层、固定强度的普通背景模糊，便于和渐进式模糊做 A/B 对比。`uniform` 模式下可再用 `roleOverlayUniformFeather`（0~1）给模糊块内侧边缘加渐变 mask，柔化硬边界。
- 角色块模糊层底色固定为白色（`white/100%`）；其叠加强度（透明度）由 CSS 变量 `--snowui-table-role-overlay-tint-opacity-override`（默认 `0%`，即不可见）控制，可用于在 `uniform` 背景模糊上叠加一层可调透明度的白色磨砂质感。`0%` 时层为全透明，仅有 `backdrop-filter` 模糊；`100%` 时为不透明白块。
- DataTable 持有 `selectedRowIds` 与清除选择能力，并通过 Context 共享，供内置 TableToolbar 自动显示批量操作；页面无需重复传递 `selectedCount` / `onClearSelection`。
- `.snowui-table-role-blur-layer` 默认隐藏，只在行 hover、focus-within 或已选中时显示。这样未交互状态不会额外绘制 blur，选中后 Checkbox 与模糊状态保持可见。
- 不要把第一列内容通过 padding 推开；selection 必须覆盖在第一列之上。若使用方在单元格内容上额外提升 `z-index`，会导致第一列内容压过 Checkbox 和 blur，破坏 overlay 语义。

交互命中按优先级处理：

- 点击 checkbox 本体时，由 Checkbox 的 `onCheckedChange` 更新当前行选中态，并阻止事件冒泡到 TableRow，避免双重切换。
- 因为 overlay checkbox 与第一列内容视觉重叠，TableRow 会兜底判断行左侧 `32px` 区域的点击；即使浏览器命中到底下的第一列链接，也会 `preventDefault()` 并切换当前行选中态。
- 点击单元格内的真实交互内容（`a`、`button`、`input`、`label`、`select`、`textarea`、`[role="button"]`、`[role="checkbox"]`）不会触发行选择。
- 点击行内非交互空白区域会切换当前行选中态；再次点击取消选中。

选择归属：DataTable 持有 `selectedRowIds`，TableRow 以 `rowId` 注册当前渲染行。表头全选只作用于当前已渲染的行（分页场景即当前页），跨页已选 id 会保留。

表头全选 Checkbox 在常驻 column 布局一直显示；overlay 的可见规则：仅在以下情况显示——①**hover 任意数据行**（`.snowui-table-viewport:has(.snowui-table-body .snowui-table-row:hover)`，与行内 Checkbox 同步出现）；②**hover 紧邻 selection 覆盖块的首个数据列表头**（overlay 下即 Date 列表头，`.snowui-table-head[data-as="selection"] + .snowui-table-head:hover`）；③**直接 hover / 键盘聚焦全选浮层自身**（保证指针从数据行上移到全选框时其仍可见、可点击）；④表格存在**选中态**（`data-selected="true"`）。hover 其他表头列（Stores、Subscriber 等）不会显示全选框。overlay 下全选容器恒为 `pointer-events:none`，仅其中的 Checkbox 子元素在触发时 `pointer-events:auto`。

### Overlay hover 边缘渐进式透明（内置能力）

`roleLayout="overlay"` 下，TableCell / TableHead 内置一套 **hover 边缘渐进式透明**：用 CSS `mask-image` 渐变直接作用于单元格内容，让 checkbox / 操作按钮覆盖块**正下方的内容从靠控件一侧渐隐到清晰**，从而保证浮在内容之上的控件清晰可读。该能力为表格固有行为，**参数固定、无对外开关**。

规则：

- **触发时机**：数据行内容在**该行 hover**（`.snowui-table-row:hover`）时渐隐；表头**仅第一列标题**（紧邻 selection 覆盖块的 Date 列）的渐隐与**全选 Checkbox 的出现时机完全一致**——即 hover 任意数据行、hover 该列表头、hover / 聚焦全选浮层自身、或存在选中态时才渐隐；全选 Checkbox 不出现时表头也不渐隐。其余表头列（含 actions 一侧）不渐隐。
- **作用对象**：
  - checkbox 一侧 = 紧邻 selection 覆盖块的那一个内容单元格（`[data-as="selection"] + .snowui-table-cell` 的 `.snowui-table-cell-content`），方向 `to right`。
  - actions 一侧 = actions 覆盖块之前的普通内容单元格，方向 `to left`。所有内容以当前可见行右边缘为同一坐标原点，跨列保持连续渐隐；横向滚动后浮层仍限制在 Table 视口内。selection 与 actions 同时作用于一个内容块时，使用交集保留两侧遮罩。
- **参数（可分别覆盖，三套相互独立）**：每套 Fade start / Fade end 都暴露成 CSS 覆盖变量，默认值与下方一致；可在 `<Table>` 或任意祖先容器的 `style` 上单独设置。
  - 表头第一列：`--snowui-table-head-fade-start-override`（默认实际 Checkbox 右边缘）→ `--snowui-table-head-fade-end-override`（默认右边缘 + `--size-5`），过渡不随列宽变化。
  - checkbox 一侧：`--snowui-table-selection-fade-start-override`（默认实际 Checkbox 右边缘）→ `--snowui-table-selection-fade-end-override`（默认右边缘 + `--size-5`），过渡不随列宽变化。
  - actions 一侧：完全透明区默认覆盖到最左侧按钮的实际左边缘（实测按钮组宽度含右侧内边距，coverage 默认 `1`）。从该边缘向左用 `--size-5`（名义 20px）固定长度过渡到清晰，不随按钮组宽度、按钮数量或响应式 padding 变化；随全局 Token 缩放。`--snowui-table-actions-fade-coverage-override` 仍可显式调整覆盖比例；`--snowui-table-actions-fade-feather-override` 默认不设置，仅兼容旧调用方显式设置的倍数语义，此时过渡终点仍为透明区宽度乘该倍数。

> 三处渐隐的 `mask-image` 均复用 基础共享能力 [`edge-fade`](../lib/edge-fade.md)（`createEdgeFadeMaskImage`）生成并存到 CSS 变量，TableCell / TableHead 的 hover 状态规则只 `mask-image: var(...)` 消费。selection / head 通过私有布局适配 `table-selection-fade.ts` 测量实际 Checkbox 右边缘并在内容节点生成遮罩；actions 遮罩依赖每行实测按钮宽度，因此由各普通内容 TableCell 在自身作用域生成，并减去该内容块右边缘距可见行右边缘的偏移，确保能够读取行级 `--snowui-table-role-overlay-content-width`。上面这些 `*-override` 变量即该能力对表格暴露的可配置参数。「悬浮操作层」本身的定位（sticky / fixed + JS 测量）属于表格布局职责，不在通用能力范围内。
- **退出同步**：hover 结束且没有展开的操作菜单时，actions 整个浮层立即隐藏，与内容遮罩撤销同步，避免淡出按钮或模糊层留下残影；进入渐显保持不变。
- **不影响点击**：`mask` 只改变可见度，不改变命中测试；被渐隐内容里的链接、按钮等仍可正常点击。
- **与 blur 的关系**：边缘渐隐与 `.snowui-table-role-blur-layer` 背景模糊是两套独立机制。需要只保留渐隐时，把 `--snowui-table-role-overlay-blur-override` 设为 `0rem` 关闭背景模糊即可。
- **激活行**：`<TableRow active>` 由使用方或外部条件持续写入，默认绘制 `--black-4` 背景。它不是 hover 或 selected，不会改变 Checkbox 的选中状态；真实 hover 到激活行时，连续 hover 移动层与激活背景叠加。
- **静态 hover 预览**：在某个 `<TableRow>` 上加 `data-force-hover="true"`，可让该行在不实际 hover 的情况下恒定呈现 hover 态（背景 / 行 checkbox / 行动按钮 / 两侧渐隐 / 表头全选与表头渐隐均会按该行触发），用于文档截图与视觉走查；业务持久态应使用 `active` Prop。

实现入口为 [TableCell.svelte](TableCell.svelte) 与 [TableHead.svelte](TableHead.svelte)。TableCell 在已激活行的现有定位批次中读取内容坐标，不为各内容列新建 Observer。对每个普通内容块，actions 遮罩的两个色标分别是 `fade-width − edge-offset` 与 `fade-width + 固定过渡长度 − edge-offset`；允许负色标，使远离操作区的列保持清晰。TableCell 将 selection 与 actions 两层 mask 以 `mask-composite: intersect` 合成，角色控件自身不参与内容遮罩。

滚动归属：Table **自己创建唯一的局部横向 viewport**，并通过共享 `useOverlayScrollbar` 将同一条横向轨道 sticky 到当前页面视口底部。轨道只在表格固有最小宽度超过宿主时显示，表格离开视口或到达底端后收回表格边界。不把宽表宽度传播为页面最小宽度，不应再用外层 ScrollArea 包裹 Table，也不得创建第二条同步滚动条。`minWidth` 仍可进一步扩大表格的固有宽度。Table / DataTable 仍不创建纵向滚动容器。吸底轨道必须高于 table 内容层；即使 `TableBody` 默认连续 Hover 将 table 提升为内容层，轨道仍完整接收 hover、pointer down 与拖动，不得由其下方的数据行截获。连续 Hover 层由局部横向 viewport 承载，其背景只绘制在当前可见的表格范围内，不得把隐藏列对应的背景泄露到 viewport 外。

<a id="示例"></a>

### 示例

```svelte
<script lang="ts">
  import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@snowui-design-system/components';
  let columnWidths = $state<Record<string, number>>({});
</script>

<Table bind:columnWidths minWidth={600}>
    <TableHeader><TableRow><TableHead columnId="name">名称</TableHead></TableRow></TableHeader>
    <TableBody><TableRow rowId="one"><TableCell columnId="name">一段很长的名称</TableCell></TableRow></TableBody>
</Table>
```

TableCell 默认 `lines={1}`，原始文字不需要再包一层 Text。行 hover 时首尾单元格会自动形成 12px 圆角。

<a id="密集表格性能协议"></a>

### Keyword

| Keyword | 说明 |
| :--- | :--- |
| component | 当前组件公开契约 |


- 保持合法 table DOM 树，不使用 div 模拟网格。
- 排序状态由上层 DataTable 通过共享 context 提供。
- 列宽持久化属于页面层，Table 只发出变化。


### 响应式收缩与恢复

响应式收列停留恢复：宽度 1s 不再变化后，仍显示的列恢复其原有透明度（包括表头的默认弱化透明度），位移自然完成。再次缩窄从当前透明度接续，已经收起的列保持隐藏；DataTable 复用同一规则。

渐隐计算与 OverflowActions 共用 [responsive-exit](../lib/responsive-exit.md)，统一动效边界见 [响应式项目收起](../../../docs/standards/MotionPresetSpec.md#23-响应式项目收起)。

Table 是 Table / DataTable 的唯一布局计算入口，依据自身容器可用宽度和实际列内容，不使用设备断点。

1. `roleLayout="auto"`：全部内容和首选间距放得下时，Checkbox / actions 占据常驻列并一直显示；首先收为 hover / 键盘焦点浮层，不删除角色列。已选 Checkbox、已展开操作菜单继续可见。
2. 再压缩单元格左右 padding：默认每侧从 `--padding-3`（12px）收至 `--padding-1`（4px），相邻列最小视觉间距 8px；最左／最右可见单元格及角色浮层的外侧 padding 不低于 `--padding-2`（8px）。字号、图标、行高和单元格内部 gap 不跟着缩小。显式 padding override 保留。常驻操作列会为实际按钮内容预留宽度；显式 `columnWidths.__actions` 仍优先，自动测量不回写调用方列宽。
3. `horizontalScroll` 默认 true：空间仍不足时保留所有普通列，使用 Table 局部横向滚动。
4. `horizontalScroll={false}`：普通列默认允许隐藏，按当前 DOM 顺序从右向左收起；`TableHead responsiveHide={false}` 的列及第一普通列始终保留。角色列不参与隐藏。下一待隐藏列在阈值前 `--size-5`（名义 20px）的容器宽度区间内线性渐隐，仅表头与单元格内容同步渐隐，背景与分隔线始终保持完整。跨过阈值后原生网格直接确定目标布局，内容层使用共享 resize preset（当前 250ms）过渡位置并逐步揭示扩大的内容区域，不缩放文字。背景、分隔线与圆角不参与插值，不临时切换 table-layout 或把末列压缩至零宽。连续拖动时内容按当前宽度渐显恢复；停留恢复规则见下文。位移动画仅在可见列集合改变时启动；同一集合内连续拖动不重启动画，不对换行产生的纵向位置插值。快速反向跨过收列阈值时从当前显示位置和裁切边界接管。第一列、保护列、角色列和合并单元格不参与渐隐；`prefers-reduced-motion: reduce` 保留直接切换。
5. 收到最后一列仍放不下时，若是没有硬尺寸的普通文本列，则限制为容器宽度：`nowrap` 内容保持不换行并显示省略号，默认 Tooltip 提供全文（包括 `lines={false} nowrap`）；允许换行的内容折行，长连续字符串也可断行。原始文本和数据不变，变宽后恢复自然布局。显式 `tooltip={false}` 仍可关闭 Tooltip。
   多个保护列、显式列宽 / `minWidth`、复杂合并网格或单列中的按钮、输入、图片等不可压缩控件仍使用横向滚动兜底，不截掉操作。容器窄至无法容纳两侧 8px 留白时也保留滚动。关闭横向滚动代表优先收列与文本适配，不强制隐藏不可避免的溢出。
6. 隐藏列的 Head / Cell 一起退出布局、键盘顺序和辅助技术读取，但数据、排序和选择状态不变。最后可见普通列接管右侧圆角；仅一列时同时拥有左右圆角。
多行或跨列表头、跨行数据单元格保持横向滚动，不猜测合并网格的列对应关系；普通表体的跨列 empty / Spinner 单元格跟随可见列数更新跨度。

7. 变宽时先恢复数据列，再恢复 padding，最后角色列回到常驻；隐藏列恢复基于未隐藏的原始内容测量，避免振荡。动态数据、列宽调整、字体加载和 Token 缩放会重新计算。

DataTable 的配置由 Context 下发；显式 Table 配置优先。普通 Table 复用间距、隐藏和滚动规则，不新增 选择 / 操作状态。旧显式 `roleLayout="column"` / `"overlay"` 保留固定布局含义；column 现在常驻显示角色控件。

### 操作角色预算

DataTable操作列按本表局部viewport计算20%／14rem／显式及拖动列宽上限的最小预算，先收操作再执行角色列、padding和原有数据响应式规则。预算包含padding与浮层渐隐覆盖；More最小可用尺寸优先，极窄滚动兜底。菜单展开冻结布局、关闭后更新；统一观察器和字体／Token失效触发重测，不新增逐行ResizeObserver。

## AI Zone

内置滚动区域文案使用 `table.scrollRegion` / `table.scrollRegionNamed`；`ariaLabel` 是调用方业务文案，不由组件翻译。Provider 的 `messages` 可覆盖滚动提示模板，普通表格与 DataTable 内的 Table 共用同一行为。

响应式由私有 `lib/table-responsive.ts` 批处理。只观察每表 viewport 和 Token 探针；内容、显式列宽、字体 / 资源变化使完整列测量缓存失效。隐形且 inert 的原生 DOM 副本只在测量帧存在，恢复隐藏列及原始 colspan 后测量首选 / 最小间距；不创建第二套 Svelte 组件，也不为每个 Cell 创建 Observer。正常容器 resize 复用缓存，在共享尺寸观察器的帧交付中直接计算，不再额外排队一帧；使用未取整的 CSS 内容宽度，避免慢速拖动时渐隐阶梯式跳变。可压缩区间的 padding 由已测得的首选／最小宽度生成 CSS 容器宽度公式，与列宽在同一次浏览器布局中变化，不等尺寸回调再补跳；显式固定列宽导致区间长度为零时保留边界选择。只提交角色布局、padding 公式、隐藏状态及可见边缘。


以下章节保留源码维护约束，不属于应用接入步骤。

### 密集表格性能协议

默认普通 `TableRow` / `TableCell` 在未声明高级 Frame 能力时使用等价的原生 `tr / td` 语义快路径，并保留既有 class、data state、样式、事件和无障碍语义。传入动效、响应式、Context、Scale Observer、parts 或其他 Frame 配置时自动回到完整 Frame 路径，公开能力不受限制。

单行截断由每个 Table 实例统一批处理：Table 只观察 viewport 与原生 table 两个布局宿主，在同一 animation frame 内先集中读取所有单元格的 `scrollWidth / clientWidth`，再统一提交截断状态。禁止退化为逐 Cell ResizeObserver、逐 Cell rAF 或读写交错。selection / actions 关闭或使用普通列布局时，不生成永远不可见的 overlay blur proxy 与 Cell mask 变量；启用 overlay 后仍使用完全相同的视觉层。

`roleLayout="overlay"` 适合宽表或需要边缘悬浮操作的场景。表头全选框只在 hover 数据行、hover 首个数据列表头（Date）、聚焦/直接 hover 全选框自身或存在选中态时显示（详见上文「选择归属」）；行动按钮只在该行 hover 时显示，不因行被选中而保持显示。

行动按钮（actions 列）被包裹在 `.snowui-table-role-overlay-controls` 容器内：表格的显隐渐变作用在这个**包裹层**的 `opacity` 上，而不是直接作用在按钮元素上。因此按钮自身的 `opacity`（次级操作应使用 `Button bare emphasis="muted"`，常态 40%、hover 100%）得以保留并与包裹层的渐变相乘，避免表格的 `opacity:1` 覆盖掉按钮自身的状态透明度导致图标按钮失去 hover 反馈。

<a id="keyword"></a>



Table 不包含工具栏、分页、请求或缓存。它公开 `TableHeader`、`TableBody`、`TableRow`、`TableHead`、`TableCell` 供声明式组合。

## 更新日志

### v2.7.1 (2026-10-23)

- 双击列宽手柄自动适配时计入排序按钮的实际图文间距，保留图标预算、最小／最大列宽、可换行列的原宽恢复及其他列宽。

### v2.7.0 (2026-10-21)

- 复用统一响应式控制器计算操作视觉预算，缓存More与padding测量并保留极窄滚动。

- 2026-10-07：渐隐仅作用于内容；收列与恢复由独立内容层过渡位置和可见宽度。移除临时 fixed 布局与零宽末列插值，背景、分隔线及外缘保持完整，快速反向时从当前几何接管。

- 2026-10-07：收列增加固定宽度区间内的连续透明度过渡，与容器宽度同步，支持反向恢复和减少动态效果偏好。

- 2026-10-07：统一表格外缘最小 8px，相邻列内容间最小 8px（内部两侧各 4px），收列后重新分配外缘。

- 2026-10-07：固定／自动锁定的小数列宽与整数视口宽度使用一致的半像素容限，避免宽度足够时误将单元格和操作浮层 padding 压至最小值。

- 2026-10-07：响应式单元格每侧最小 padding 从 2px 调整为 4px，相邻列最小内容间距为 8px。

- 2026-10-07：v2.6.0，新增 horizontalScroll 和 auto 角色布局；统一角色收起、间距压缩、右到左隐藏与滚动兜底，恢复原始列宽并更新可见边缘。

- 2026-10-07：v2.5.3，行内与表头 Checkbox 统一按实际右边缘定位透明区，向右使用固定 `--size-5`（名义 20px）柔和过渡；跟随控件尺寸和响应式间距，不随列宽拉长。保留显式起止点覆盖。

- 2026-10-07：同步 TableCell v1.10.2 的跨列渐隐与可见视口定位说明，默认透明区贴合实际按钮左边缘，向左使用固定 20px Token 过渡；Table 公开 API 不变。

- 2026-09-21：统一使用文档、源码属性表与 Site / LLM 阅读入口；仅文档修订，不改变组件行为。

- 2026-09-02：v2.5.2，连续 Hover 层由 Table 局部横向 viewport 承载并裁切，宽表隐藏列不再把行背景绘制到当前可见边界之外。
- 2026-09-01：v2.5.1，修复吸底横向滚动条与数据行重叠时无法操作的问题。根因是连续 Hover 将 table 提升至 `z-index: 1`，轨道仍处于默认层级；Table 现在固定让横向轨道处于内容层之上，并通过真实命中与拖动回归验证。
- 2026-09-01：v2.5.0，Table 内置局部横向 viewport 和视口贴底 overlay 轨道；未设置显式宽度时，整表最小宽度由各列 min-content 与 Cell padding 自动汇总，保留最长不可断单词 / 片段。
- 2026-09-01：v2.4.1，调整容器响应曲线，使窄表格在常见移动宽度即收敛到每侧 2px；原生相邻列的最小视觉间距固定为 4px。
- 2026-08-14：v2.4.0，Table viewport 建立 inline-size 容器；TableHead / TableCell 左右 padding 随表格自身宽度从默认 12px 流动到最小 2px，DataTable 组合自然继承。
- 2026-08-06：v2.3.0，新增密集表格语义快路径和表级单帧截断批处理；默认单元格不再初始化逐格 Frame 运行时与尺寸观察，关闭角色能力时跳过无效 overlay DOM / 样式，视觉与完整能力回退保持不变。
- 2026-08-06：v2.2.0，普通数据列的 TableHead 默认允许拖动改宽；固定列使用 `resizable={false}` 显式关闭，排序的数据规则保持现有边界。

- 2026-08-03：v2.1.2，17px selection Checkbox 的 1px 增量改为固定 `0.0625rem` 特例，禁止借用 `--border-2` 参与尺寸计算。
- 2026-08-03：v2.1.1，Table selection 内置 Checkbox 改为 Token 计算的 17px 组合特化，使奇数高度数据行内上下各留 16px；Checkbox 组件全局默认仍为 16px。

- 2026-08-03：TableRow 新增外部受控 `active` 激活态；持久 `--black-4` 背景可与连续 hover 层叠加，不与 selected / Checkbox 选中状态绑定。
- 2026-07-07：减少首屏工作量：普通单元格挂载不再额外排队逐格 rAF；overlay 角色块仅在 hover、focus、选中或强制预览时测量与监听位置，空闲行不触发布局读取。

- 2026-07-07：v2.1.0，明确 Table 只负责表格数据展示；加载更多、selection/actions 角色列、排序筛选、分页和搜索统一归 DataTable。

- 2026-07-05：v2.0.0，checkbox 选择列与按钮操作列移交 DataTable；普通 Table 删除选择和角色布局 Props。

- 2026-07-01：v1.14.0，数据行注册改为 microtask 批量提交，分页整批替换行时不再逐行触发选择状态重算。
- 2026-06-30：v1.13.0，增量加载首次开始前自动锁定当前自然列宽，避免新行更宽内容触发 `table-layout:auto` 重排并带动已有行横向晃动；显式 columnWidths / 拖动列宽保持优先。
- 2026-06-30：v1.12.0，DataTable 新增行 opacity 渐显从整行迁移到普通 TableCell，selection/actions overlay 不再被父级透明度二次压暗；selection 内容遮罩固定为约 16px → 60px，表头遮罩固定为约 14px → 26px，视觉取自表格一且不再随列宽变化。
- 2026-06-30：v1.11.1，修正 DataTable 自动加载阈值方向：默认越过表格底部后继续下滚 80px 才触发，不再提前 80px 加载。
- 2026-06-30：v1.11.0，DataTable 自动加载改由组件内部管理表尾哨兵、80px 底部阈值与 500ms 请求节流；页面无需声明滚动观察器。
- 2026-06-30：v1.10.6，补充页面滚动自动加载的 500ms 停留确认规则：向上滚出触发区取消，停留或继续下滚才加载。
- 2026-06-30：v1.10.5，适配 Frame `while*` 完整视觉通道语义；DataTable 行渐显不再需要 scale undefined 抵消字段。
- 2026-06-30：v1.10.4，DataTable 新增行改为纯 opacity 渐显，显式移除 Frame 通用 appear preset 带来的 scale 缩放。
- 2026-06-30：v1.10.3，DataTable 行展示间隔为 0 时不再创建零时长定时器，确保同批本地数据同轮提交；Demo 服务器模拟改为一次请求延迟后整批返回，避免服务器 yield 间隔干扰组件展示间隔。
- 2026-06-30：v1.10.2，修复新增行未进入 Frame `Appear` 状态导致 opacity 渐显不执行的问题；逐行提交恢复为 100ms 间隔，单行渐显保持 1000ms 并允许重叠。
- 2026-06-30：v1.10.1，将流式新增行 opacity 渐显延长至 1000ms，便于确认逐行渐显链路是否生效。
- 2026-06-30：v1.10.0，接入 DataTable 内部流式加载协议；TableRow 自动消费新行 250ms 渐显动效，页面不再手动维护新增行状态。
- 2026-06-30：v1.9.0，新增已有数据加载 Spinner 行；通过真实跨列单元格居中复用通用 Spinner，默认尺寸 16×16px，并新增 `loadingSpinnerSize` 尺寸入口。
- 2026-06-30：v1.8.0，新增首次加载 Skeleton rows 组合协议：TableHead 注册公开列结构，TableBody 按列生成语义化骨架行；DataTable 首次空数据加载可通过 Context 自动启用。
- 2026-06-30：v1.7.3，striped 数据行圆角改为始终保持；divided hover 背景仅进入时过渡、移出时立即清除，避免圆角恢复直角时仍有渐隐背景残留。
- 2026-06-30：v1.7.2，默认 divided 表头与静态数据行改为直角；数据行仅在 hover / `data-force-hover` 时形成 12px 外缘圆角，并完整隐藏 hover 表面上下相邻分割线。striped 奇数背景行圆角保持不变。
- 2026-06-29：v1.7.1，修复 actions 渐隐遮罩失效：依赖行级实测按钮宽度的 mask 生成从 Table 根移到相邻内容 TableCell 自身，避免根节点无法解析后代 CSS 变量；仍统一复用 `edge-fade`。
- 2026-06-27：v1.7.0，把 overlay「内容渐隐层」提炼为 基础共享能力 [`edge-fade`](../lib/edge-fade.md)（`createEdgeFadeMaskImage`）：Table 根用它生成 checkbox / 表头遮罩，actions 遮罩由相邻内容 TableCell 在可读取行级实测宽度的作用域生成；TableCell / TableHead 的 hover 规则统一通过 CSS 变量消费。三处渐隐参数（fade-start / fade-end / coverage / feather）保留为可配置覆盖变量；新增 `--snowui-table-actions-fade-feather-override`（默认 3）控制按钮列柔和尾巴长度。「悬浮操作层」定位仍属表格布局职责。

- 2026-06-27：v1.6.3，按实际落地参数更新文档：按钮列渐隐 coverage 默认 `0.9`、柔和尾巴终点 `× 3`（尾巴长度 = 透明区的两倍，过渡更缓）；并修正文档中过期的代码示例默认值（checkbox `15% → 60%`、表头 `50% → 100%`）。

- 2026-06-27：v1.6.2，按钮列渐隐整体宽度的 coverage 默认值由 `1` 调小为 `0.8`（遮罩宽度 = 实测按钮宽度 × 0.8，整条遮罩按比例收窄、柔和尾巴随之内移、不断层）。coverage 是「占按钮宽度的百分比」型通用值，越小越窄。

- 2026-06-27：v1.6.1，按钮列渐隐过渡改得更柔和（参考 checkbox 侧的长缓过渡）：柔和尾巴终点由透明区 × 1.2 改为 × 1.5（尾巴长度 = 透明区的一半，避免硬边）。完全透明区仍 = 实测按钮宽度（自适应、最小，保证按钮下方内容不透出）。

- 2026-06-27：v1.6.0，按钮列渐隐改为**按实测按钮宽度自适应**：JS 每行测量按钮组实际占用宽度（含右侧内边距）写入行级 `--snowui-table-role-overlay-content-width`，边缘渐隐据此自动收缩到“恰好盖住按钮 + 20% 柔和过渡”，单按钮/多按钮表格均无需再设覆盖列宽。`--snowui-table-actions-fade-coverage-override` 默认改为 `1`（贴合按钮）。背景模糊默认改为 `0rem`（默认仅保留边缘渐隐，渐进式模糊改为按需 `--snowui-table-role-overlay-blur-override` 开启）。Table-Demo 两个表格均移除内联样式，完全使用组件默认值。

- 2026-06-27：v1.5.4，按钮列渐隐的柔和过渡改为**固定长度** `1.5rem`（原为 coverage 的 20%，会随 coverage 变小而消失、且两个 gradient stop 不一致时被夹成硬边）。现透明区宽度 = 覆盖列宽 × `--snowui-table-actions-fade-coverage-override`（默认 `0.75`），过渡恒为 1.5rem，任何 coverage 下都可见。某表想更窄就调小该表的 `--snowui-table-role-overlay-width-override`。

- 2026-06-27：v1.5.3，按钮列渐隐改为单一通用比例控制：新增 `--snowui-table-actions-fade-coverage-override`（默认 `0.8`），完全透明（遮住按钮）区域宽度 = 覆盖列宽 × 该比例，其外再做固定 20% 柔和渐隐。移除原 `--snowui-table-actions-fade-start-override` / `--snowui-table-actions-fade-end-override`（之前完全透明区被硬编码为整列宽，导致遮罩过宽且无法用单值收窄）。该比例按各表自身列宽等比缩放，可在任意祖先设一次全局生效。

- 2026-06-27：v1.5.2，按钮列（actions）渐隐改为按覆盖列宽等比缩放：默认完全透明区 = 覆盖列宽（恰好盖住整列按钮），柔和渐隐终点 = 覆盖列宽 × 1.2，即渐隐遮罩始终比按钮列宽约 20%。无论列多宽，按钮下方内容都被完全遮住、不受干扰；只需把 `--snowui-table-role-overlay-width-override` 设成约等于按钮组宽度。

- 2026-06-27：v1.5.1，调整渐隐默认值：表头第一列默认 `50%` → `100%`，checkbox 列默认 `15%` → `60%`（actions 列默认仍为覆盖列宽 × 0.1 → × 0.6）。补充说明：actions 渐隐起点（完全透明区宽度）应约等于按钮组宽度，列宽固定时单按钮约 × 0.1、多按钮约 × 0.5。

- 2026-06-27：v1.5.0，将 overlay「hover 边缘渐进式透明」的固定参数拆分为三套相互独立、可覆盖的 CSS 变量：表头第一列 `--snowui-table-head-fade-start-override` / `--snowui-table-head-fade-end-override`（默认 4% / 60%）、checkbox 列 `--snowui-table-selection-fade-start-override` / `--snowui-table-selection-fade-end-override`（默认 4% / 60%）、按钮列 `--snowui-table-actions-fade-start-override` / `--snowui-table-actions-fade-end-override`（默认 覆盖列宽 × 0.1 / × 0.6）。新增 `data-force-hover="true"` 行级预览开关，可让某一行静态呈现 hover 态（用于演示 / 视觉走查）。三处同步登记于 ComponentStyleSheet.md 表 3 与 components/src/styles/components.css。

- 2026-06-27：v1.4.4，让表头第一列标题（Date 列）的「hover 边缘渐进式透明」触发条件与表头全选 Checkbox 的出现条件完全对齐：仅在 hover 数据行 / hover 该列表头 / hover|聚焦全选浮层 / 存在选中态时渐隐；全选 Checkbox 未出现时表头不再渐隐（此前为「鼠标进入表格即渐隐」）。

- 2026-06-27：v1.4.3，两项修复：(1) 进一步收敛表头全选 Checkbox 的出现规则——改为仅在 hover 任意数据行、hover 首个数据列表头（overlay 下的 Date 列）、直接 hover/聚焦全选框自身或存在选中态时显示；hover 其他表头列（Stores 等）不再显示。(2) 修复 overlay 行动按钮（actions 列）图标按钮失去 hover 反馈的问题：将按钮包进 `.snowui-table-role-overlay-controls` 包裹层，表格的显隐渐变作用于包裹层 `opacity` 而非按钮元素本身，使弱化 bare 操作的常态 40% / hover 100% 透明度得以保留（两层 `opacity` 相乘而非在同一元素上冲突；2026-08-09 起需显式写 `emphasis="muted"`）。

- 2026-06-27：v1.4.2，调整表头全选 Checkbox 的出现规则：由「鼠标进入表格视口（`.snowui-table-viewport:hover`）即显示」改为「hover 到任意表格行（`.snowui-table-viewport:has(.snowui-table-row:hover)`）、行内键盘聚焦或存在选中态时才显示」，与行内 Checkbox 的可见时机保持一致。因表头本身也是一行，触发条件天然涵盖表头行，从而保证指针从数据行上移到表头时全选框仍可见、可点击。

- 2026-06-27：v1.4.1，修复 overlay 模式下 Date / Stores 等首部数据列被「全选浮层」遮挡导致无法点击排序、无法拖拽列宽、无 hover 效果的问题。根因：表头全选控件 `.snowui-table-selection-control` 命中了非 overlay 专用的 `[data-as="selection"]` hover 状态规则（特异度 0,3,0），在鼠标进入表格时被强制 `pointer-events:auto`，而该容器在 overlay 下宽达 14rem 且 `z-index:4`，从而拦截了其浮层覆盖列的指针事件。修复：将该状态规则用 `:not([data-role-layout="overlay"])` 限定为仅非 overlay 布局；overlay 表头全选容器恒为 `pointer-events:none`（不拦截下方列），仅其中复选框在 hover 时 `pointer-events:auto`，同时容器宽度收敛为 `2rem`（仅复选框区）。
- 2026-06-27：v1.3.2，overlay 角色块模糊层底色固定为 `white/100%`，新增 `--snowui-table-role-overlay-tint-opacity-override` 控制白色磨砂层透明度（默认 `0%`）；用于在背景模糊上叠加可调白色质感。
- 2026-06-27：v1.3.1，`uniform` 背景模糊新增 `roleOverlayUniformFeather` 属性，可用渐变 mask 柔化单层模糊块的硬边界。
- 2026-06-27：v1.3.0，新增 `roleOverlayLayers` 与 `roleOverlayBlurMode` 两个 overlay 角色块模糊属性；模糊层数与模糊模式经 Table context 统一下发，表头与数据单元格的 selection / actions 模糊块共用同一控制器；`uniform` 模式复用新增的 `createUniformBlurStyles` 渲染普通背景模糊以便对比。
- 2026-06-25：v1.2.1，补充 overlay selection 的 fixed 覆盖层、渐进式模糊、层级与点击兜底实现说明；明确 Checkbox 覆盖在第一列上且链接、空白行点击仍可用。
- 2026-06-23：v1.2.0，新增 `roleLayout="overlay"`，selection/actions 角色块可覆盖到表格左右边缘，并使用反向多层透明模糊渐变遮罩保证控件清晰；行动按钮可见规则改为仅行 hover。
- 2026-06-23：v1.1.0，新增显式 selection/actions 角色列；选择列内置 Checkbox 与当前渲染行全选协议，操作列保留自定义按钮内容。
- 2026-06-22：v1.0.1，明确宽表参与页面固有宽度计算，横向滚动由页面容器负责；补充复合管理布局登记。
- 2026-06-19：v1.0.0，新增语义表格与列宽上下文。
