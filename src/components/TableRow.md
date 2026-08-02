# TableRow

> **版本**: v1.6.0
> **职责**: 表头或表体的 `<tr>`，统一整行 hover 几何与交互状态。

`rowId` 会映射为 `data-row-id`，并注册到 Table 的当前渲染行集合。选中时输出 `data-selected="true"`，供 selection 角色列保持 Checkbox 可见；选中本身不额外改变行背景，actions 仍只在行 hover 时显示。默认 `divided` 变体的静态行两端无圆角；hover（含 `data-force-hover="true"` 静态预览）时首尾单元格形成 12px 外缘圆角，并隐藏 hover 行上下相邻的分割线。背景只由 TableBody 的连续 hover 移动层绘制，TableRow 不再向单元格写入背景。`striped` 所有数据行始终保持12px外缘圆角，hover 时临时让条纹单元格透明以露出同一个移动层。

位于 DataTable 的内部 `loadMore` 管线时，TableRow 只提供稳定 `rowId`；内部 opacity 渐显由普通 TableCell 消费，避免 selection/actions overlay 被整行透明度压暗。业务显式传给 TableRow 的 `whileAppear / currentState` 仍按正常 Frame 行级动效执行。

行内空白点击的全局语义由 Table Context 决定：当 DataTable 配置 `onRowPreview` 时，TableRow 将空白点击转发为行预览；未配置时空白点击不响应。选择行为只由 selection 角色列负责，不再由整行空白点击切换。

```svelte
<TableRow rowId={user.id}><TableCell>{user.name}</TableCell></TableRow>
```

## Keyword

| Keyword | 说明 |
| :--- | :--- |
| component | 当前组件公开契约 |

> **以下内容供 AI 阅读，不展示在文档站点**

- Row 只公开 selected 状态标记，不增加 selected 默认视觉。

## Changelog

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
