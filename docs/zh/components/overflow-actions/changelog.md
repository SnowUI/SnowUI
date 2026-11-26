# OverflowActions 更新日志

### v1.2.0 (2026-11-24)

- 新增 `tooltip` 组级开关（默认 `false`）及 `parts.Tooltip` 支持，通过上下文向组内 `OverflowAction` 与后代 `Button` 控件下发默认配置，并同步透传至 More `SelectButton`。

### v1.1.1 (2026-10-23)

- 自有动作组间距保留4 CSS px下限及较大覆盖，原computed gap参与同一宽度求解；不改变compact／progressive／all、菜单冻结、测量缓存与动作回调。

### v1.1.0 (2026-10-21)

- 新增maxVisible与数据项buttonProps／parts，数量与宽度共同收纳，保持菜单冻结与独立组缺省行为。

- 2026-10-14：连续拖动时复用操作项和 Separator 宽度，按 Table 的小数布局宽度和观察器同帧求解；避免隐藏按钮反复参与测量与临界宽度抖动。

- 2026-10-07：接入共享宽度驱动渐隐与 1s 停留恢复；保留 compact、双向 progressive、all、菜单冻结及操作语义，焦点所在按钮收纳后移到 More。

- 2026-09-21：统一使用文档、源码属性表与 Site / AI 阅读入口；仅文档修订，不改变组件行为。

### v1.0.2 (2026-09-02)

- 根据现有源码补齐逐属性说明、默认回退和使用边界；未改变组件运行时行为。

### v1.0.1 (2026-08-29)

- More 默认跟随组级 Button 样式，支持通过 `parts.SelectButton` 单独覆盖；显式外置 Action 的直接样式不反向影响 More。
- More 的测量副本改为真实 SelectButton，确保单独样式覆盖后的响应式宽度准确。

### v1.0.0 (2026-08-12)

- 初始版本：支持完整、Icon-only、全部溢出、双向逐个溢出、结构 Separator、组级 `buttonProps` 与 DataTable 外部宽度驱动；More 默认使用 Button 默认样式。
