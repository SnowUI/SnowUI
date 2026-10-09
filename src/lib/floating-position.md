# floating-position.ts 文档

> **职责**: 提供浮层边缘碰撞、边界夹取和反向方位计算的 公共能力。
> **依赖方**: `Tooltip.svelte`、`ChartHoverPanel.svelte`

## 能力

| API | 说明 |
| :--- | :--- |
| `clampFloatingPosition(point, size, bounds, edgeGap?)` | 将浮层左上角限制在指定边界内 |
| `constrainFloatingAnchor(side, point, size, bounds, edgeGap?)` | 按 `top/bottom/left/right` 锚点语义限制浮层锚点，保持居中锚点不越界 |
| `getFloatingVisualBounds(side, point, size)` | 根据锚点和方位计算浮层真实视觉边界 |
| `hasFloatingCollision(floating, boundary)` | 判断浮层视觉边界是否溢出给定边界 |
| `getOppositeFloatingSide(side)` | 返回反向方位 |

## 维护约定

- Tooltip、Chart hover panel、后续 Popover 类浮层的边缘碰撞逻辑优先复用本模块。
- 本模块只负责几何计算，不持有 DOM、动画、Portal 或组件状态。
- 默认边距为 `DEFAULT_FLOATING_EDGE_GAP = 8`。
