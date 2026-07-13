# bridge.ts 文档

> **版本**: v1.3.2
> **职责**: 提供 Frame 通用动效桥接策略，将默认动效资源解析为可供组件消费的 CSS 变量。

---

## 导出

| 名称 | 类型 | 描述 |
| :--- | :--- | :--- |
| `FRAME_CONTROL_MOTION_BRIDGE` | `MotionTimingBridge` | 控制类内部过渡桥接，默认回退 `MORPH_MOTION` |
| `FRAME_BORDER_MOTION_BRIDGE` | `MotionTimingBridge` | 描边类内部过渡桥接，默认回退 `MORPH_MOTION` |
| `FRAME_APPEAR_MOTION_BRIDGE` | `MotionTimingBridge` | 生命周期进入过渡桥接，默认回退 `WHILE_APPEAR_DEFAULT_MOTION`（默认仅 fadeIn，250ms；scale 需显式声明） |
| `FRAME_COLOR_MOTION_BRIDGE` | `MotionTimingBridge` | 颜色过渡桥接，默认 150ms easeOut；CSS 消费：`transition: color var(--snowui-frame-color-motion-duration) var(--snowui-frame-color-motion-easing)` |
| `FRAME_SIZE_MOTION_BRIDGE` | `MotionTimingBridge` | 尺寸过渡桥接，默认 `MORPH_MOTION`(250ms easeOut)；CSS 消费：`transition: width var(--snowui-frame-size-motion-duration) var(--snowui-frame-size-motion-easing)`；用途场景:Tab/Segmented icon-toggle 展开宽度、Chip 折叠展开等内容驱动尺寸变化 |
| `FRAME_LOOP_MOTION_BRIDGE` | `LoopMotionBridge` | 循环动画桥接，默认回退 `ROTATE_CLOCKWISE_MOTION` |
| `resolveMotionTiming()` | `function` | 将 `duration / easing` 解析为 CSS 可直接消费的结果 |
| `createMotionTimingBridgeStyle()` | `function` | 生成 control / border / appear / color 的桥接 CSS 变量字符串 |
| `createLoopMotionBridgeStyle()` | `function` | 生成 loop 的桥接 CSS 变量字符串 |
| `resolveLoopMotionPresetName()` | `function` | 将 `loopMotion.preset` 解析为 Frame 内建循环动画名 |
| `createLoopMotionPresetStyle()` | `function` | 当声明 `loopMotion.preset` 时，生成 Frame 根节点可直接消费的完整循环动画样式 |

---

## 典型用途

- `Frame.svelte` 内联输出 `--snowui-frame-control-motion-*`
- `Radio / Checkbox / Switch` 复用默认控制类时序
- `Tooltip` 复用生命周期进入时序
- `Spinner` 复用默认循环动画时序
- `Frame` 通过 `loopMotion.preset="rotateClockwise"` 直接启用根节点连续旋转默认能力（关键帧资源位于 `rotate.css`）
- `Select / Input / Field` 等表单组件使用 `--snowui-frame-color-motion-*` 变量实现 hover 颜色过渡，而非硬编码 `transition: color 0.15s ease`

---

## 更新日志 (Changelog)

### v1.3.2 (2026-06-30)

#### 调整
- `WHILE_APPEAR_DEFAULT_MOTION` 的 generic 视觉收敛为仅 fadeIn；bridge 名称与默认时序保持兼容。

### v1.3.1 (2026-05-23)

#### 调整
- `FRAME_APPEAR_MOTION_BRIDGE` 保持变量名兼容，但默认回退从 `REPLACE_IN_MOTION` 改为 `WHILE_APPEAR_DEFAULT_MOTION`。
- `WHILE_APPEAR_DEFAULT_MOTION` 由 `fadeIn + scaleIn` 原子动效并行组合得到，默认持续时间仍为 `250ms`。
- 明确 `appear` bridge 是生命周期时序桥接名，不代表内部存在“出现”原子动效。

### v1.3.0 (2026-05-20)

#### 新功能
- 新增 `FRAME_SIZE_MOTION_BRIDGE`,用于宽高(width/height/min-*)的 CSS transition 时序桥接;默认回退 `MORPH_MOTION`(250ms easeOut)。
- `frame-inline-style.svelte.ts` 在 `activeConfig` 非空时自动注入 `--snowui-frame-size-motion-duration` / `--snowui-frame-size-motion-easing`。
- 首批消费方:Tab / Segmented 的 `icon-toggle` variant 展开宽度过渡。

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
