# bridge 更新日志归档

### v1.2.0 (2026-04-15)

#### 新功能
- 新增 `FRAME_COLOR_MOTION_BRIDGE`，用于前景色/背景色的 CSS transition 时序桥接。
- `MotionConfig` 新增 `color` 字段；`motionConfigToStyle` 支持将其映射为 `--su-motion-color`。
- `while-hover.ts` 默认时序填充为 `{ duration: 150, easing: "easeOut" }`，Frame 在有 `Hover` 关键字时自动注入颜色过渡时序变量。

### v1.1.0 (2026-03-06)

#### 新功能
- 新增 `loopMotion.preset` 解析与 `createLoopMotionPresetStyle()`，支持 `Frame` 根节点声明式启用完整连续旋转默认能力。

### v1.0.0 (2026-03-06)

#### 新功能
- 新增 Frame 通用动效桥接默认策略模块，并从 `Frame.svelte` 中抽离桥接实现。
