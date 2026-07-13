# rotate 默认资源文档

> **版本**: v1.1.0
> **职责**: 提供旋转类默认动效配置与关键帧资源。

---

## 导出

| 名称 | 类型 | 描述 |
| :--- | :--- | :--- |
| `ROTATE_CLOCKWISE_MOTION` | `MotionConfig` | 顺时针旋转一周的默认配置 |
| `FLIP_MOTION` | `MotionConfig` | 180° 翻转 |
| `rotate.css` | `CSS asset` | 承载 `snowui-frame-loop-rotate-clockwise` 全局关键帧 |

---

## 默认参数

### ROTATE_CLOCKWISE_MOTION

```ts
{
  rotate: [0, 360],
  duration: MOTION_DURATION_BASE_MS, // 250ms
  easing: "linear"
}
```

### FLIP_MOTION

```ts
{
  rotateY: [0, 180],
  duration: MOTION_DURATION_BASE_MS, // 250ms
  easing: "easeInOut"
}
```

---

## 典型用途

- `whileReload` 的旋转反馈
- `whileActive` 的翻转反馈
- `loopMotion.preset="rotateClockwise"` 的 Frame 根节点连续旋转默认能力

---

## 更新日志 (Changelog)

### v1.1.0 (2026-03-06)

#### 新功能
- 新增 `rotate.css`，将 `Frame` 连续旋转默认能力使用的全局关键帧下沉到 `motion` 目录统一管理。

### v1.0.0 (2026-02-27)

#### 新功能
- 新增旋转与翻转默认动效常量。
