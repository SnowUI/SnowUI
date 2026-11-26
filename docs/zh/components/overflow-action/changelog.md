# OverflowAction 更新日志

### v1.1.0 (2026-11-24)

- 新增 `tooltip` 公开开关（默认关闭，继承父级 `OverflowActions.tooltip`）与 `parts.Tooltip`，为 `iconOnly` 与 `compact` 内建按钮支持 SnowUI `Tooltip`（移除原生 `title`），并通过共享 `ButtonTooltipContext` 统一向 `control` 内任意基于 `Button` 的子控件下发默认开关与配置（显式子控件经 `ComponentPartsBoundary` 与父级 `parts` 隔离）。

### v1.0.1 (2026-09-02)

- 2026-09-21：统一使用文档、源码属性表与 Site / AI 阅读入口；仅文档修订，不改变组件行为。

- 根据现有源码补齐逐属性说明、默认回退和使用边界；未改变组件运行时行为。

### v1.0.0 (2026-08-12)

- 初始版本。
