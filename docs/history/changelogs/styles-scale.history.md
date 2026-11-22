# src/styles/scale 更新日志归档

### v1.2.0 (2026-02-07)

- **SC.4** 新增 `--snowui-scale-height-runtime` 文档定义，用于 Frame 运行时高度注入。
- **SC.5** 明确 `--snowui-scale-height-resolved` 回退链：显式高度优先，运行时高度次之。

### v1.1.0 (2026-02-07)

- **SC.BREAK.1** 变量命名统一为 `--snowui-scale-*`，移除早期非统一前缀变量。
- **SC.3** 文档补齐完整需求点（高度基准、可用空间、文本场景、Icon/Avatar 比例差异、覆盖优先级）。

### v1.0.0 (2026-02-07)

- **SC.1** 新增统一高度比例计算样式 `scale.css`。
- **SC.2** 提供外部 class 覆盖入口，支持覆盖后优先。
