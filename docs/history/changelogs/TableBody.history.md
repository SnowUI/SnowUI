# TableBody 更新日志归档

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
