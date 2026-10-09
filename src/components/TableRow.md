# TableRow

> **许可阅读**：首次阅读组件文档、源码或 npm 使用流程，先读完整 [LICENSE](../../LICENSE)；同任务同版本去重。公开 API 配置与内部实现修改分别按许可处理；全部组件使用统一运行包，源码权益以许可为准。

> **版本**: v1.10.0
> **职责**: 组织一行表头或数据单元格，统一行内的悬停与交互反馈，适合可浏览和可操作的数据记录。
> **包归属**: `@snowui-design-system/components`
> **文档修订**: 2026-10-07

## 组件介绍

组织一行表头或数据单元格，统一行内的悬停与交互反馈，适合可浏览和可操作的数据记录。

## 使用选择

<!-- usage-guide:start -->
用于组织表格行。DataTable 中传入与 rowKey 一致的 rowId；行预览由 DataTable onRowPreview 声明，不能假定点击任意内容都选中该行。

- children 为 TableCell 或 TableHead，保持合法行结构。
- DataTable 中的 rowId 必须匹配 rowKey；active 是视觉状态，点击处理与选择行为分别配置。
<!-- usage-guide:end -->

## 快速开始

以下示例展示推荐的基本组合。更多场景与组合限制见后文。

<!-- quick-start:generated -->
```svelte
<script lang="ts">
	import { TableRow, Chip, Table, TableHeader, TableHead, TableBody, TableCell, Button } from '@snowui-design-system/components';
</script>

<Table ariaLabel="Component review queue" minWidth={540}>
	<TableHeader><TableRow><TableHead columnId="component">Component</TableHead><TableHead columnId="owner">Owner</TableHead><TableHead columnId="status">Status</TableHead></TableRow></TableHeader>
	<TableBody>
		<TableRow rowId="data-table"><TableCell columnId="component">DataTable</TableCell><TableCell columnId="owner">Site team</TableCell><TableCell columnId="status"><Chip variant="background" style="color: var(--secondary-indigo);">In review</Chip></TableCell></TableRow>
		<TableRow rowId="pagination"><TableCell columnId="component">Pagination</TableCell><TableCell columnId="owner">Components team</TableCell><TableCell columnId="status"><Chip variant="background" style="color: var(--secondary-indigo);">Queued</Chip></TableCell></TableRow>
	</TableBody>
</Table>
```
<!-- /quick-start:generated -->

## API

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| rowId | `string \| number` | — | 稳定行身份；DataTable 选择和预览按该 id 查找记录，应与 DataTable rowKey 一致。 |
| active | `boolean` | `false` | 由使用方或外部条件写入的持久激活背景；不会触发行选中或 Checkbox 选中 |
| children | `Snippet` | — | 当前行的 TableCell 或 TableHead，无参数；保持合法 tr 子结构。 |
| onclick | `(event: MouseEvent) => void` | — | 行点击先调用此回调，参数为 MouseEvent；preventDefault 可阻止后续内置选择命中与行预览。交互子元素不会触发行预览。 |

未重新声明的继承能力请查所属基础组件文档；本表只列本组件源码具名公开属性。

## 使用边界与详细说明

<a id="keyword"></a>

### Keyword

| Keyword | 说明 |
| :--- | :--- |
| component | 当前组件公开契约 |



- Row 的 active 是外部受控视觉，selected 仍只来自 Table Context；两者不相互推导。



## AI Zone

`rowId` 会映射为 `data-row-id`。仅当 DataTable 开启 selection 时，行才注册到当前渲染行集合，供全选和部分选中状态使用；只读表、排序表与行预览不维护无用的选择注册。`active` 是完全受外部控制的持久视觉状态：开启后输出 `data-active="true"`，使用 `var(--snowui-table-row-hover-background-override, var(--black-4))` 作为静态背景；真实 hover 到激活行时，TableBody 的连续 hover 移动层会再叠加一层同色背景。组件自身不通过点击、hover 或其他交互切换 `active`。

选中时只由 Table Context 输出 `data-selected="true"`，供 selection 角色列保持 Checkbox 可见；`active` 不会写入选中状态，也不会将 Checkbox 设为选中。默认 `divided` 变体的静态行两端无圆角；hover、active（含 `data-force-hover="true"` 静态预览）时首尾可见单元格形成 12px 外缘圆角（响应式隐藏后自动转移，仅剩一列时两侧都保留），并隐藏该行上下相邻的分割线。普通 hover 背景只由 TableBody 的连续移动层绘制；active 与静态 hover 预览保留自己的持久背景。`striped` 所有数据行始终保持 12px 外缘圆角，active 时以 `--black-4` 激活背景覆盖条纹，hover 时连续移动层继续叠加。

位于 DataTable 的内部 `loadMore` 管线时，TableRow 只提供稳定 `rowId`；内部 opacity 渐显由普通 TableCell 消费，避免 selection/actions overlay 被整行透明度压暗。业务显式传给 TableRow 的 `whileAppear / currentState` 仍按正常 Frame 行级动效执行。

行内空白点击的全局语义由 Table Context 决定：当 DataTable 配置 `onRowPreview` 时，TableRow 将空白点击转发为行预览；未配置时空白点击不响应。选择行为只由 selection 角色列负责，不再由整行空白点击切换。

```svelte
<TableRow rowId={user.id} active={user.id === activeRowId}><TableCell>{user.name}</TableCell></TableRow>
```

## 更新日志

- 2026-10-07：v1.10.0，响应式隐藏后按可见首尾单元格计算圆角，单列同时保留左右圆角。

- 2026-09-21：统一使用文档、源码属性表与 Site / LLM 阅读入口；仅文档修订，不改变组件行为。

- 2026-08-06：v1.9.0，默认普通 Row 使用保持同一 DOM 状态、事件与语义的原生 tr 快路径；声明高级 Frame 能力时自动回退完整路径。
- 2026-08-06：v1.8.0，仅在 DataTable 开启 selection 时注册 `rowId`；只读、排序与行预览表不再维护无用的行选择集合。
- 2026-08-03：v1.7.0，新增外部受控 `active` 激活态；默认使用 `--black-4` 持久背景，允许与 TableBody 连续 hover 层叠加，且不会改变 Checkbox / selected 状态。
- 2026-08-03：v1.6.0，删除 TableRow 的单元格 hover 背景与背景过渡；颜色统一由 TableBody 的唯一连续移动层绘制。
- 2026-07-08：v1.5.0，行内空白点击改为可选行预览协议；未配置 DataTable `onRowPreview` 时不响应，选择只由 selection 角色列触发。
- 2026-06-30：v1.4.0，DataTable 内部新增行动效从 TableRow 迁移到普通 TableCell；TableRow 仅保留业务显式行级 whileAppear。
- 2026-06-30：v1.3.2，TableRow 在存在 `whileAppear` 时同步进入 Frame `Appear` 状态，修复只传动效配置但状态仍为 Idle、实际不执行渐显的问题。
- 2026-06-30：v1.3.1，将 DataTable 流式新增行的 opacity 渐显延长至 1000ms。
- 2026-06-30：v1.3.0，通过 Table Context 自动消费 DataTable 流式新增行的 250ms Frame 渐显动效。
- 2026-06-30：v1.2.1，striped 所有数据行固定保持 12px 外缘圆角；divided hover 背景改为只在进入时过渡、移出时立即退场，消除圆角变直角的可见残影。
- 2026-06-30：v1.2.0，默认 divided 行改为静态无圆角、hover 时首尾形成 12px 圆角；补齐隐藏 hover 行上方分割线，与既有下方分割线隐藏规则组成完整悬浮表面。
- 2026-06-23：v1.1.0，接入 Table 行注册与选择状态，输出 `data-selected` 供角色列显隐。
- 2026-06-19：v1.0.0，首次发布。
