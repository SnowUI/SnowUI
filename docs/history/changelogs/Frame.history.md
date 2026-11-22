# Frame 更新日志归档

### v4.x – v3.x 演进摘要

- **v3.8.7**：`control / border / appear` 动效时序桥接变量改为按需输出，无对应动效配置时不再向 DOM 注入冗余内联变量。
- **v3.8.0**：`loading` 成为统一加载状态入口，`whileLoad` 回归纯加载态动效配置，`skeleton` 独立控制骨架渲染。
- **v3.6.0**：动效原语与预设迁移至 `components/src/motion/`，新增 `enableDefaultMotion` 与 `stateContent` 交叉淡化能力。
- **v3.5.0**：文本截断（`lines` / `onTruncate`）从 `Frame` 迁移至 `Text` 组件。
- **v3.2.0**：`Scale` 支持 `height / width / mixed / aspect` 四种计算依据及运行时变量写入。
- **v1.3.0**：CSS 行为工具类从 `FrameProps` 解耦为 `.snowui-hoverable` / `.snowui-field-bordered` 共享样式类，新增 `scope` 与 `access` 上下文边界。
