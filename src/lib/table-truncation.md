# Table Truncation Manager

> **版本**: v1.0.0
> **职责**: 为单个语义 Table 批量检测普通 TableCell 的单行溢出。

每个 Table 创建一个 `TableTruncationManager`，只通过共享 `resizeManager` 观察 Table viewport 与原生 table。TableCell 只登记内容节点、启用状态和结果回调，不创建自己的 ResizeObserver、MutationObserver 或 animation frame。

批处理器在同一帧内分两阶段运行：先读取所有启用节点的 `scrollWidth / clientWidth`、完整文字与嵌套截断 owner，再统一通知 Cell 更新状态。该顺序禁止布局读写交错。

列宽拖动会显式请求一次批量测量；Table / viewport 尺寸变化由两个共享观察目标触发。Cell 卸载时必须注销登记，Table 卸载时必须取消未执行帧并清空目标。

## Changelog

- 2026-08-06：v1.0.0，TableCell 单行截断由逐格控制器迁移为每表批处理器。
