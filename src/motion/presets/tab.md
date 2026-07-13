# Tab Indicator Motion Preset

> **版本**: v1.0.0
> **职责**: 统一 Tab / Segmented 共享 indicator 的位置与尺寸变化时序。

## 导出

| 名称 | 描述 |
| :--- | :--- |
| `TAB_INDICATOR_MOTION` | indicator 的 transform、width、height 共用时序。 |
| `TAB_INDICATOR_MOTION_STYLE` | 同时注入 Frame control / size motion bridge 变量。 |

## 数值来源

参考 transitions.dev Tabs sliding：`250ms`，`cubic-bezier(0.22, 1, 0.36, 1)`。具体数值以 `motion/tokens.ts` 为准。

## 使用边界

- 适用于 Tab、Segmented 及同族共享 indicator。
- 普通容器宽高变化继续使用 `RESIZE_MOTION`。
- 组件只能引用本 preset，不得复制时长或缓动值。
