# Progress 更新日志

### v1.1.2 (2026-07-12)

- 2026-10-23：并列状态／百分比示例显式使用Frame单行组合与Text全文缩略，保留进度更新、圆环及不确定态；仅文档和示例修订。

- 2026-09-21：统一使用文档、源码属性表与 Site / AI 阅读入口；仅文档修订，不改变组件行为。

- circle 与不确定态默认 size / thickness 对齐 Spinner：16px / size×15%（2.4px）；line 确定态 thickness 仍为 4px。

### v1.1.1 (2026-07-12)

- 曾将 thickness 统一为 4px；随后被 v1.1.2 按 Spinner 几何回退 circle / 不确定态。

### v1.1.0 (2026-07-04)

- circle 新增默认关闭的 `showLabel` 内置模式，内部生成 Text，默认排版 12px / 16px。
- 新增 `parts.Text`；显式 children 存在时替换内置 label。
- line 维持显式 label 组合模式，避免锁定标题、状态与百分比的布局语义。
- circle 不确定态默认尺寸与粗细对齐 Spinner circle：16px / 15% 环宽。

### v1.0.1 (2026-06-02)

- 空的直系 `as="label"` 自动显示实时值。
- label 默认排版调整为 12px / 16px。

### v1.0.0 (2026-06-01)

- 新增长条形与圆形 Progress、自由尺寸、共享粗细、自由 label、语意色与 indeterminate 动效。
- 长条形 label 区域默认铺满可用宽度；需要两端分布时，外部 label Frame 显式使用 `row class="justify-between"`。
