# TableRow

> **版本**: v1.9.0
> **职责**: 表头或表体的 `<tr>`，统一整行 hover 几何与交互状态。

`rowId` 会映射为 `data-row-id`。仅当 DataTable 开启 selection 时，行才注册到当前渲染行集合，供全选和部分选中状态使用；只读表、排序表与行预览不维护无用的选择注册。`active` 是完全受外部控制的持久视觉状态：开启后输出 `data-active="true"`，使用 `var(--snowui-table-row-hover-background-override, var(--black-4))` 作为静态背景；真实 hover 到激活行时，TableBody 的连续 hover 移动层会再叠加一层同色背景。组件自身不通过点击、hover 或其他交互切换 `active`。

选中时只由 Table Context 输出 `data-selected="true"`，供 selection 角色列保持 Checkbox 可见；`active` 不会写入选中状态，也不会将 Checkbox 设为选中。默认 `divided` 变体的静态行两端无圆角；hover、active（含 `data-force-hover="true"` 静态预览）时首尾单元格形成 12px 外缘圆角，并隐藏该行上下相邻的分割线。普通 hover 背景只由 TableBody 的连续移动层绘制；active 与静态 hover 预览保留自己的持久背景。`striped` 所有数据行始终保持 12px 外缘圆角，active 时以 `--black-4` 激活背景覆盖条纹，hover 时连续移动层继续叠加。

位于 DataTable 的内部 `loadMore` 管线时，TableRow 只提供稳定 `rowId`；内部 opacity 渐显由普通 TableCell 消费，避免 selection/actions overlay 被整行透明度压暗。业务显式传给 TableRow 的 `whileAppear / currentState` 仍按正常 Frame 行级动效执行。

行内空白点击的全局语义由 Table Context 决定：当 DataTable 配置 `onRowPreview` 时，TableRow 将空白点击转发为行预览；未配置时空白点击不响应。选择行为只由 selection 角色列负责，不再由整行空白点击切换。

```svelte
<TableRow rowId={user.id} active={user.id === activeRowId}><TableCell>{user.name}</TableCell></TableRow>
```

## Keyword

| Keyword | 说明 |
| :--- | :--- |
| component | 当前组件公开契约 |

| 属性 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| active | `boolean` | `false` | 由使用方或外部条件写入的持久激活背景；不会触发行选中或 Checkbox 选中 |

> **以下内容供 AI 阅读，不展示在文档站点**

- Row 的 active 是外部受控视觉，selected 仍只来自 Table Context；两者不相互推导。

## Changelog

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
