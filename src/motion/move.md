# move.ts 文档

> **版本**: v1.5.0
> **职责**: 提供默认位移动效配置。

---

## 导出

| 名称 | 类型 | 描述 |
| :--- | :--- | :--- |
| `MOVE_MOTION` | `MotionConfig` | 轻微位移后归位的默认移动动效 |
| `MOVE_RIGHT_MOTION` | `MotionConfig` | 从左向右移动 |
| `MOVE_LEFT_MOTION` | `MotionConfig` | 从右向左移动 |
| `MOVE_DOWN_MOTION` | `MotionConfig` | 从上向下移动 |
| `SLIDE_FROM_TOP_MOTION` | `MotionConfig` | 从上方滑入并渐现（由 `slide + fade` 原子动效组合） |
| `SLIDE_FROM_BOTTOM_MOTION` | `MotionConfig` | 从下方滑入并渐现（由 `slide + fade` 原子动效组合） |
| `SLIDE_TO_TOP_MOTION` | `MotionConfig` | 向上方滑出并渐隐（由 `slide + fade` 原子动效组合） |
| `SLIDE_TO_BOTTOM_MOTION` | `MotionConfig` | 向下方滑出并渐隐（由 `slide + fade` 原子动效组合） |
| `SLIDE_STACK_MOTION` | `MotionConfig` | 堆叠类过渡的通用时序预设；不再代表完整的叠层组合效果 |

---

## 默认参数

### MOVE_MOTION

```ts
{
  y: [8, 0],
  duration: MOTION_DURATION_MOVE_MS, // 500ms
  type: "spring",
  stiffness: 300,
  damping: 34.6410161514,
  mass: 1
}
```

### MOVE_RIGHT_MOTION

```ts
{
  x: [0, 160],
  ...MOVE_MOTION
}
```

### MOVE_LEFT_MOTION

```ts
{
  x: [0, -160],
  ...MOVE_MOTION
}
```

### MOVE_DOWN_MOTION

```ts
{
  y: [0, 100],
  ...MOVE_MOTION
}
```

### SLIDE_FROM_TOP_MOTION

```ts
{
  y: ["-100%", 0],
  opacity: [0.8, 1],
  duration: MOTION_DURATION_BASE_MS, // 250ms
  easing: "ease"
}
```

### SLIDE_FROM_BOTTOM_MOTION

```ts
{
  y: ["100%", 0],
  opacity: [0.8, 1],
  duration: MOTION_DURATION_BASE_MS, // 250ms
  easing: "ease"
}
```

### SLIDE_TO_TOP_MOTION

```ts
{
  y: [0, "calc(-100% - var(--snowui-toast-exit-offset, 16px))"],
  opacity: [1, 0.8],
  duration: MOTION_DURATION_BASE_MS, // 250ms
  easing: "ease"
}
```

### SLIDE_TO_BOTTOM_MOTION

```ts
{
  y: [0, "calc(100% + var(--snowui-toast-exit-offset, 16px))"],
  opacity: [1, 0.8],
  duration: MOTION_DURATION_BASE_MS, // 250ms
  easing: "ease"
}
```

### SLIDE_STACK_MOTION

```ts
{
  duration: MOTION_DURATION_BASE_MS, // 250ms
  easing: "ease"
}
```

---

## 组合关系

自 `v1.2.0` 起，`move.ts` 中的 slide 预设不再被视为“独立的大动效”，而是由 OSS 原子动效在使用阶段组合而成：

- `SLIDE_FROM_TOP_MOTION` = `createSlideYMotion(["-100%", 0]) + createFadeMotion([0.8, 1])`
- `SLIDE_FROM_BOTTOM_MOTION` = `createSlideYMotion(["100%", 0]) + createFadeMotion([0.8, 1])`
- `SLIDE_TO_TOP_MOTION` = `createSlideYMotion([0, "calc(-100% - var(--snowui-toast-exit-offset, 16px))"]) + createFadeMotion([1, 0.8])`
- `SLIDE_TO_BOTTOM_MOTION` = `createSlideYMotion([0, "calc(100% + var(--snowui-toast-exit-offset, 16px))"]) + createFadeMotion([1, 0.8])`

其中：

- 原子动效定义在 [primitives.ts](primitives.ts)
- 具体数值可由组件使用时自定义；当前这些预设只是 Toast 等组件复用的默认组合
- `SLIDE_STACK_MOTION` 仅保留时序语义，真实叠层可继续由 `stackTranslate + scale + opacity` 组合完成

---

## 典型用途

- `whileScroll`
- `whileValidating` / `whileUploading`
- 调试示例中的方向位移动效
- 需要与位置相关的浮层滑入 / 滑出
- 多条同类浮层叠加时的位置与缩放过渡

---

## 更新日志 (Changelog)

### v1.5.0 (2026-07-12)

#### 优化
- damping 从 Rare UI 原始基线 `30` 调为临界阻尼 `34.6410161514`，取消越过目标后的回弹；原基线 `stiffness: 300 / damping: 30 / mass: 1 / duration: 500ms` 保留供对照恢复。

### v1.4.0 (2026-07-12)

#### 优化
- 默认 `MOVE_*` 改为 Rare UI Sidebar 同参数的高阻尼 spring：`stiffness: 300`、`damping: 30`、`mass: 1`；当前轨迹窗口为 500ms。

### v1.3.0 (2026-07-12)

#### 优化
- `MOVE_MOTION` 与三个方向 preset 曾统一使用 `cubic-bezier(0.2, 0, 0, 1)`；v1.4.0 起由真实 spring 取代。

### v1.2.0 (2026-05-12)

#### 架构调整
- 明确 slide 系列预设由 `primitives.ts` 中的 `slide + fade` 原子动效组合而成。
- 明确 `SLIDE_STACK_MOTION` 只保留通用时序语义，不再代表完整的 Toast 叠层动效。

### v1.1.0 (2026-02-27)

#### 新功能
- 新增方向位移默认动效：右移/左移/下移。

### v1.0.0 (2026-02-26)

#### 新功能
- 新增默认位移动效常量。
