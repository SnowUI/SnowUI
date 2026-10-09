# TableCell

> **许可阅读**：首次阅读组件文档、源码或 npm 使用流程，先读完整 [LICENSE](../../LICENSE)；同任务同版本去重。公开 API 配置与内部实现修改分别按许可处理；全部组件使用统一运行包，源码权益以许可为准。

> **版本**: v1.11.0
> **职责**: 在 Table 的数据行中展示一个单元格，支持文字、组件与自定义内容，默认以单行截断控制长内容。
> **包归属**: `@snowui-design-system/components`
> **文档修订**: 2026-10-07

## 组件介绍

在 Table 的数据行中展示一个单元格，支持文字、组件与自定义内容，默认以单行截断控制长内容。

## 使用选择

<!-- usage-guide:start -->
作为 TableRow 中的数据单元格。选择列与操作列角色只在启用相应能力的 DataTable 中成立；显式内容替换该单元格默认内容。

- 放在 TableRow 内，通过 columnId 对齐列；lines / tooltip 控制长内容展示。
- 选择列与操作列由 DataTable 启用；actions 单元格的显式 children 替换默认操作。
<!-- usage-guide:end -->

## 快速开始

以下示例展示推荐的基本组合。更多场景与组合限制见后文。

<!-- quick-start:generated -->
```svelte
<script lang="ts">
	import { TableCell, Badge, Link, Table, TableHeader, TableHead, TableBody, TableRow, Chip } from '@snowui-design-system/components';
</script>

<Table ariaLabel="Component documentation details" minWidth={620} columnWidths={{ component: 160 }}>
	<TableHeader><TableRow><TableHead columnId="component">Component</TableHead><TableHead columnId="summary">Summary</TableHead><TableHead columnId="status">Status</TableHead></TableRow></TableHeader>
	<TableBody><TableRow rowId="data-table">
		<TableCell columnId="component" row nowrap><Link onclick={(event: MouseEvent) => { event.preventDefault(); event.stopPropagation(); }} onauxclick={(event: MouseEvent) => { event.preventDefault(); event.stopPropagation(); }} href="/components/data-table">DataTable</Link><Badge count="New" variant="border" /></TableCell>
		<TableCell columnId="summary" lines={2} tooltip>Coordinates search, filtering, sorting, selection, responsive row actions, and pagination while keeping table composition explicit.</TableCell>
		<TableCell columnId="status" align="end"><Chip variant="background" style="color: var(--secondary-indigo);">Review</Chip></TableCell>
	</TableRow></TableBody>
</Table>
```
<!-- /quick-start:generated -->

## API

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| columnId | `string` | — | 与表头共享列宽 |
| lines | `false \| 1 \| 2 \| 3` | `1` | 截断行数，false 关闭 |
| tooltip | `TooltipProp` | `true` | 溢出后展示完整或自定义提示 |
| onTruncate | `(isTruncated: boolean) => void` | — | 真实溢出状态变化 |
| align | `"start" \| "center" \| "end"` | `"start"` | 内容对齐 默认行为：start。 |
| roleLayout | `TableRoleLayout` | — | 覆盖当前角色单元格的角色列布局；普通单元格忽略 默认行为：Table context。 |
| nowrap | `boolean` | — | 文字不换行；与 row 同用时同时禁止 flex 子项换行 默认行为：`true`（lines=2/3 时 false）。 |
| skeleton | `boolean` | `false` | TableBody 内部 Skeleton rows 协议；渲染非交互占位内容并关闭截断 |
| children | `Snippet` | — | 单元格内容，无参数；actions 角色提供显式内容时替换默认操作，选择角色仍由 DataTable 协议管理。 |
| parts | `ComponentPartsOf<{ Tooltip: typeof Tooltip; Checkbox: typeof Checkbox; }>` | — | 配置内置截断 Tooltip 和选择 Checkbox；只作用于当前单元格拥有的默认实例。 |

未重新声明的继承能力请查所属基础组件文档；本表只列本组件源码具名公开属性。

## 使用边界与详细说明

<a id="内置组件双模式"></a>

### 内置组件双模式

- `parts.Tooltip`：配置截断提示。
- `parts.Checkbox`：配置 selection 角色内置 Checkbox。
- Skeleton 是加载基础设施，不作为公开 part。

> **版本**: v1.11.0
> **职责**: 接受任意 Svelte/HTML 内容的 `<td>`，默认单行截断。需要换行时显式传入 `nowrap={false} lines={false}`；声明 `lines={2}` / `lines={3}` 也视为显式开启多行，未指定 nowrap 时自动允许换行；横向图标与文字默认不换行。

默认单元格高度为 40px，内边距上下保持 8px；左右 padding 根据最近 Table 容器宽度在 4px 到 12px 之间流动，常见窄屏宽度即收敛到每侧 4px，宽表恢复为 12px，首尾可见单元格朝向表格外缘的一侧至少 8px。Table 使用原生相邻列布局，列与列之间没有额外 gap；相邻单元格 padding 相加后的最小视觉间距为 8px。单元格内部内容默认 gap 为 8px，复合内容可直接通过 `row`、`gap`、`nowrap` 控制布局，不需要额外嵌套 Frame。横向内容在单元格内垂直居中，不保留行内文字基线的下行空间。

未显式固定列宽时，单元格的固有 min-content 会参与 Table 自动列宽：可换行内容保留最长不可断单词 / 片段，`lines={1}` 或 `nowrap` 保留整行。显式 `columnWidths`、拖动列宽或其他固定宽度优先，此时仍按 `lines` / tooltip 规则截断。

| 属性 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| row | `boolean` | `false` | 内部内容使用横向 flex 布局，根 `<td>` 语义不变 |
| gap | `number` | `2` | 内部内容间距，默认 8px，对应 `--gap-{n}` token |
| as | `selection \| actions` | - | 显式角色列；角色模式关闭默认截断 |

```svelte
<TableCell columnId="name">未知长度的文字</TableCell>
<TableCell lines={false}><Avatar /> 任意复合内容</TableCell>
<TableCell row gap={1} nowrap>$19.9 <Question /></TableCell>
<TableCell as="selection" />
<TableCell as="actions"><Button bare>更多</Button></TableCell>
```

`as="selection"` 内置行 Checkbox，需要父 TableRow 提供稳定 `rowId`。常驻 column 布局中 Checkbox 一直显示，左右 padding 遵循 Table 响应式计算；overlay 时才按 hover、键盘 focus 或选中状态显示。

`as="actions"` 不内置默认按钮，children 可放任意行动按钮。常驻 column 布局中操作一直显示；overlay 时按行 hover、键盘焦点或展开菜单显示。内部横向排列、gap 为 8px，左右 padding 遵循 Table 响应式计算。

`roleLayout="overlay"` 时，selection/actions 单元格自身宽度归零并 sticky 到表格左右边缘。selection 的真实 `<td>` 只保留 table 语义和定位锚点；Checkbox 与渐进式模糊层都放在 `.snowui-table-selection-control` 中，并由运行时同步为 `position: fixed`，固定到当前行左上角。Checkbox 默认使用 `calc(var(--size-4) + 0.0625rem)`（17px），在当前奇数像素行高内上下各留 16px；固定增量已登记为 Table selection 特例，不借用边框 Token，也不改变独立 Checkbox 的 16px 默认值。覆盖块不推开第一列内容，而是直接压在第一列之上。取消选择时保留覆盖块的定位；不再满足可见条件时与遮罩同步隐藏，不产生横向位移。第一数据列的透明区覆盖到 Checkbox 实际右边缘，向右使用固定 `--size-5`（名义 20px）过渡；根据实际控件尺寸和响应式间距定位，不按列宽缩放。渐隐遮罩与 Checkbox 可见状态同步：行 hover、键盘 focus、已选中或 force-hover 时均生效；选中后移开鼠标也保持遮罩。未选中且没有键盘可见焦点时，离开 hover 后 Checkbox 与遮罩同帧撤去，不保留淡出残影；进入渐显与键盘可聚焦性不变。

selection 覆盖块的层级必须高于第一列内容：它使用最高 `z-index`，并要求使用方不要再给第一列链接或图标额外提升 `z-index`。Checkbox 本体是真实交互控件，`onCheckedChange` 直接写入 Table 选择状态并停止冒泡；TableRow 同时对行左侧 32px 点击做兜底，确保浏览器即使命中到底下第一列内容，也会优先切换行选中并阻止底层链接跳转。

selection 的 `.snowui-table-role-blur-layer` 与 Checkbox 同容器渲染，复用 `components/src/lib/progressive-blur.ts` 的通用 Progressive Blur。`width` 控制可见渐进模糊宽度，`sampleExtension` 提供透明采样区，`maxBlur` 使用 `--snowui-table-role-overlay-blur-override`。selection 左侧强模糊并向右清晰；actions 方向相反。blur layer 自身 `pointer-events: none` 且 `aria-hidden`，只在行 hover、focus-within 或已选中时显示。

actions 以当前可见行的右边缘定位，横向滚动时保持在 Table 视口内。内容渐隐按实际按钮组宽度和各内容块距该边缘的距离连续计算；按钮跨越多列时，所有被覆盖的普通内容同步渐隐，不只遮住最后一列。默认透明区覆盖到最左按钮实际左边缘，向左使用固定 `--size-5`（名义 20px）柔和过渡；不随按钮组宽度或响应式 padding 改变，仅跟随全局 Token 缩放。selection 与 actions 遮罩相交时同时生效，不遮住控件自身。

actions 仍在右侧以 overlay 内容块显示。actions 覆盖容器默认不接收 pointer event，只有内部按钮在 hover 时恢复可见和可点，避免右侧整行 fixed 容器拦截左侧 Checkbox 或中间链接。退出 hover（且没有展开的操作菜单）时，整个 actions 浮层立即隐藏，与内容遮罩撤销同步，避免按钮及模糊层的淡出残影叠在已恢复的文字上；进入仍保留渐显，selection 的选中显示保持独立。

DataTable 增量加载的新行动效由普通 TableCell 消费：普通数据单元格同步执行 opacity 渐显，selection / actions 角色单元格保持完整 opacity。这样 hover 控件不会再与整行 opacity 相乘；使用方显式传给 TableCell 的 `whileAppear / currentState` 优先于内部配置。

行点击协议：点击真实链接、按钮、输入控件、label 或 ARIA button / checkbox 不切换行；点击非交互空白区域切换当前行选中态；再次点击取消选中。

<a id="keyword"></a>

### Keyword

| Keyword | 说明 |
| :--- | :--- |
| component | 当前组件公开契约 |


- 默认单行截断登记到当前 Table 的 `TableTruncationManager`；同一表只观察 viewport / table，不允许恢复逐 Cell ResizeObserver。
- 普通 Cell 未声明高级 Frame 能力时使用原生 td 快路径；高级能力存在时自动回退完整 Frame。
- 子级 Text 显式声明 lines 时成为最近的截断 owner，Cell 不再重复生成 Tooltip。



## AI Zone

> `selection` / `actions` 角色仅在 DataTable Context 中生效；普通 Table 不提供内置 Checkbox 或按钮操作列。

## 更新日志

- 2026-10-07：关闭横向滚动时，待隐藏列按容器宽度同步渐隐；完整规则由 [Table 响应式](Table.md#响应式收缩与恢复) 统一定义。

- 2026-10-07：统一表格外缘最小 8px，相邻列内容间最小 8px（内部两侧各 4px），收列后重新分配外缘。

- 2026-10-07：常驻操作列允许按钮 hover 背景溢出内容盒，避免动效被文本截断容器裁切；overlay 保留整行范围的裁切。

- 2026-10-07：响应式单元格每侧最小 padding 从 2px 调整为 4px，相邻列最小内容间距为 8px。

- 2026-10-07：v1.11.0，配合 Table 自动角色布局与响应式隐藏，常驻控件一直显示；圆角跟随可见首尾，浮层保留固定渐隐与键盘入口。

- 2026-10-07：v1.10.3，行内与表头 Checkbox 统一按实际右边缘定位透明区，向右使用固定 `--size-5`（名义 20px）柔和过渡；跟随控件尺寸和响应式间距，不随列宽拉长。保留显式起止点覆盖。

- 2026-10-07：修复 overlay 操作层移出 hover 后的淡出残影，隐藏时与内容遮罩同步撤去；保留进入渐显及固定过渡范围。

- 2026-10-07：v1.10.2，修复 overlay 操作按钮跨列时内容未渐隐，以及窄表横向滚动时 fixed 操作层越出视口的问题；按可见行边缘统一遮罩坐标，保留 selection 遮罩；默认覆盖实际按钮左边缘，向左使用固定 20px Token 过渡，保证不同按钮组宽度的渐隐一致。

- 2026-09-21：统一使用文档、源码属性表与 Site / LLM 阅读入口；仅文档修订，不改变组件行为。

- 2026-09-20：v1.10.1，普通单元格 `lines={false}` 同时关闭内容层裁切，保留子 Button 的完整 hover 背景和边框；默认单行、多行截断、角色浮层和 Skeleton 裁切不变。

- 2026-09-01：v1.10.0，未显式固定列宽时，单元格 min-content 参与 Table 自动总最小宽度，可换行内容保留最长不可断片段。

- 2026-09-01：v1.9.1，调整响应曲线，使常见窄屏容器使用每侧 2px padding，并明确相邻列最小视觉间距为 4px。
- 2026-08-14：v1.9.0，普通、selection、actions 与 overlay 角色单元格的左右 padding 改为按 Table 容器宽度响应，范围为 2px 到 12px；上下 padding 保持 8px。
- 2026-08-06：v1.8.0，默认普通 Cell 使用语义快路径；单行截断改为表级同帧批量读、统一写，移除逐 Cell TruncationController / ResizeObserver，保留 Tooltip、onTruncate 与高级 Frame 自动回退。
- 2026-08-03：v1.7.5，selection Checkbox 的 1px 增量改为固定 `0.0625rem` 特例，移除尺寸计算对 `--border-2` 的语义误用。
- 2026-08-03：v1.7.4，selection 内置 Checkbox 默认尺寸改为 Token 计算的 17px，并新增 `--snowui-table-selection-checkbox-size-override`；`parts.Checkbox.size` 显式配置仍优先。
- 2026-08-03：v1.7.3，删除 TableCell 自身的行 hover 背景，仅保留上下分割线避让；striped hover 时单元格透明，由 TableBody 唯一连续移动层显示颜色。
- 2026-08-02：v1.7.2，selection / actions 覆盖块直接消费响应式选中状态，删除每个角色单元格的 `MutationObserver`；长表格空闲时不再常驻数百个属性观察器。
- 2026-07-08：v1.7.1，actions 按钮列源码默认 gap 从 `--gap-3` 修正为 `--gap-2`（8px），与文档和多 Icon 按钮排列规范保持一致。
- 2026-07-01：v1.7.0，静态 TableCell 文本关闭逐单元格 MutationObserver；overlay 角色块改为仅在行 hover、聚焦、选中或强制 hover 时激活尺寸观察和滚动定位，降低大 pageSize 翻页时的挂载成本。
- 2026-06-30：v1.6.0，DataTable 新行 opacity 渐显迁移到普通 TableCell；selection/actions overlay 排除在内部渐显之外，修复加载期间 hover Checkbox 偶尔近乎不可见。
- 2026-06-30：v1.5.0，新增 `skeleton` 行占位协议：普通内容列复用 Skeleton line，角色列只保留单元格几何且不创建 Checkbox / actions 控件。
- 2026-06-30：v1.4.3，默认 divided 行静态保持直角，hover 时首尾 Cell 才形成 12px 圆角；新增相邻行选择器隐藏 hover 行上方分割线，首行则由 TableHead 隐藏表头下边线。
- 2026-06-25：v1.4.2，记录 overlay selection 的当前实现：Checkbox 与 Progressive Blur 同容器 fixed 覆盖到第一列之上，Checkbox 保持最高层级并可点击，TableRow 对左侧 32px 命中做选择兜底。
- 2026-06-24：v1.4.0，overlay blur 复用 `progressive-blur.ts` 通用能力，移除组件内旧窄 strip 实现。
- 2026-06-24：v1.3.9，overlay 宽度回调到约 35px，但 strip 分布压在前 65% 内并降低 blur 半径，让模糊早于块宽结束。
- 2026-06-24：v1.3.8，overlay 默认宽度再减半为约 26px，并压缩后续 strip 分布，让右侧过渡更早结束。
- 2026-06-24：v1.3.7，回到已有模糊效果的窄分段 Progressive Blur；移除额外延伸的 blur surface，恢复首段宽 strip + 后续窄 strip 的覆盖方式。
- 2026-06-24：v1.3.8，数据行 overlay 增加真实文字采样延伸层，控件块宽度与 backdrop-filter 采样宽度分离。
- 2026-06-24：v1.3.9，数据行禁用 role cell 自身 blur，只保留相邻真实数据单元格中的 proxy blur，避免两套渐进层叠成分块。
- 2026-06-24：v1.4.1，数据行 proxy blur 使用 `4rem` 固定采样 guard 并跟随通用 Progressive Blur 的重叠羽化 mask，降低窄宽度块状感。
- 2026-06-24：v1.3.6，恢复多层 progressive backdrop 机制，改为 6 层全宽渐隐 mask，保留模糊效果并避免硬分段边缘。
- 2026-06-24：v1.3.5，overlay 控件宽度与 blur surface 宽度解耦，blur surface 额外向内容方向延伸，确保覆盖到相邻文字产生模糊。
- 2026-06-24：v1.3.4，blur surface 默认恢复 `.1%` 不可见合成触发面，并调整 alpha mask 曲线，恢复 backdrop-filter 模糊采样。
- 2026-06-24：v1.3.3，overlay blur 从多层 strip 改为单层全宽 blur surface + alpha mask，消除放大后可见的色块边缘。
- 2026-06-24：v1.3.2，overlay 默认宽度与 strip 尺寸减半；strip tint 默认归零，避免 actions 侧出现淡白块。
- 2026-06-24：v1.3.1，`roleLayout="overlay"` 的行内渐进模糊改为 hover 才显示，strip 收敛为 8 层宽首段 + 重叠窄条带；selection 左强右清，actions 右强左清。
- 2026-06-23：v1.3.0，新增角色列 `roleLayout="overlay"` 覆盖布局；actions 可见规则收窄为仅行 hover。
- 2026-06-23：v1.2.0，新增 selection/actions 角色；选择列内置 Checkbox，行动列提供自定义内容与基于 hover/selected 的显隐协议。
- 2026-06-20：v1.1.0，新增 row、gap、nowrap 内部内容布局能力。
- 2026-06-19：v1.0.0，新增默认 lines=1。
