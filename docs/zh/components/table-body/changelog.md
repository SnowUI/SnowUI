# TableBody 更新日志

### v1.5.1 (2026-09-02)

- 2026-09-21：统一使用文档、源码属性表与 Site / AI 阅读入口；仅文档修订，不改变组件行为。

- 连续 Hover 层改由 Table 局部横向滚动 viewport 承载并裁切，避免宽表中不可见列的行背景越过表格可见边界。
### v1.5.0 (2026-08-06)

- `continuousHover=false` 时不再实例化或挂载连续 hover 控制器；开启时保持原有唯一移动层、direct 命中与视觉不变。
### v1.4.0 (2026-08-03)

- Table 行背景收敛为 TableBody 唯一连续 hover 移动层；TableRow / TableCell 不再绘制第二层背景，关闭 `continuousHover` 后不显示行背景。

### v1.3.1 (2026-08-02)

- 连续 hover 改用 direct 几何模式，移除长表格逐行 ResizeObserver 和 pointermove 全量行扫描。
### v1.3.0 (2026-06-30)

- 明确手动按钮仍可作为 TableBody child；auto 模式哨兵改由 DataTable 根层内部管理，避免向原生 tbody 注入观察器结构。
### v1.2.0 (2026-06-30)

- 新增 `loadingSpinner`：已有数据加载时追加跨列居中的通用 Spinner 行。
### v1.1.1 (2026-06-30)

- 移除独立 `skeletonRows` 配置；骨架行数继承 DataTable `pageSize`，无法读取时回退 10 行。
### v1.1.0 (2026-06-30)

- 新增 `loading` / `skeletonRows` 与 Table Context 列注册消费协议，首次空数据加载时自动生成语义化 Skeleton rows。
### v1.0.0 (2026-06-19)

- 首次发布。
