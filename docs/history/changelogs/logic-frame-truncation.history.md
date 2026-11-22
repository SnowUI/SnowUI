# frame-truncation 更新日志归档

### v1.2.0 (2026-06-19)

- 通用类名改为 `TruncationController`，保留 `TextTruncation` / `FrameTruncation` 兼容导出。
- Text、Link 与 TableCell 共用控制器，单行尺寸监听统一使用 `resizeManager`。

### v1.1.0 (2026-02-23)

#### 架构重构
- 截断能力从 `Frame` 迁移至 `Text`，模块职责改为服务 Text 组件。
- 导出类名更新为 `TextTruncation`，并保留 `FrameTruncation` 兼容导出。

### v1.0.0 (2026-01-21)

#### 新功能
- 初始版本，从 Text 组件独立出截断能力
- 支持 lines=0/1/2/3 四种模式
- 提供 TruncationContext 给子组件
