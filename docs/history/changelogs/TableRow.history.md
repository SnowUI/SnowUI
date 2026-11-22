# TableRow 更新日志归档

### v1.7.0 (2026-08-03)

- 新增外部受控 `active` 激活态；默认使用 `--black-4` 持久背景，允许与 TableBody 连续 hover 层叠加，且不会改变 Checkbox / selected 状态。
### v1.6.0 (2026-08-03)

- 删除 TableRow 的单元格 hover 背景与背景过渡；颜色统一由 TableBody 的唯一连续移动层绘制。
### v1.5.0 (2026-07-08)

- 行内空白点击改为可选行预览协议；未配置 DataTable `onRowPreview` 时不响应，选择只由 selection 角色列触发。
### v1.4.0 (2026-06-30)

- DataTable 内部新增行动效从 TableRow 迁移到普通 TableCell；TableRow 仅保留业务显式行级 whileAppear。
### v1.3.2 (2026-06-30)

- TableRow 在存在 `whileAppear` 时同步进入 Frame `Appear` 状态，修复只传动效配置但状态仍为 Idle、实际不执行渐显的问题。
### v1.3.1 (2026-06-30)

- 将 DataTable 流式新增行的 opacity 渐显延长至 1000ms。
### v1.3.0 (2026-06-30)

- 通过 Table Context 自动消费 DataTable 流式新增行的 250ms Frame 渐显动效。
### v1.2.1 (2026-06-30)

- striped 所有数据行固定保持 12px 外缘圆角；divided hover 背景改为只在进入时过渡、移出时立即退场，消除圆角变直角的可见残影。
### v1.2.0 (2026-06-30)

- 默认 divided 行改为静态无圆角、hover 时首尾形成 12px 圆角；补齐隐藏 hover 行上方分割线，与既有下方分割线隐藏规则组成完整悬浮表面。
### v1.1.0 (2026-06-23)

- 接入 Table 行注册与选择状态，输出 `data-selected` 供角色列显隐。
### v1.0.0 (2026-06-19)

- 首次发布。
