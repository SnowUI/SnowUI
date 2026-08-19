# 通用效果 Motion Preset

> **版本**: v1.2.0
> **职责**: 将 transitions.dev 中可由单个 Frame 表达的效果整理为语义 MotionConfig。

## 导出

| 需求语义 | preset |
| :--- | :--- |
| hover 轻微放大 | `HOVER_SCALE_UP_MOTION` |
| Button 默认 hover 背景层按最终尺寸放大 | `BUTTON_HOVER_SCALE_UP_MOTIONS`；`BUTTON_HOVER_SCALE_UP_MOTION` 为默认 / sm 兼容入口 |
| hover 上浮并放大 | `HOVER_LIFT_MOTION` |
| 数字向上弹入 | `NUMBER_POP_APPEAR_MOTION` |
| 短文字替换 | `TEXT_SWAP_APPEAR_MOTION` |
| Icon 替换 | `ICON_SWAP_APPEAR_MOTION` |
| 大面板从下方浮现 / 退出 | `PANEL_REVEAL_APPEAR_MOTION` / `PANEL_REVEAL_DISAPPEAR_MOTION` |
| 右侧 SidePanel 浮层 / 内嵌模式从右滑入或滑出（复用 Frame 默认高阻尼 move spring，仅 x；位移距离包含面板整宽与右侧间距，无 opacity / scale） | `SIDE_PANEL_APPEAR_MOTION` / `SIDE_PANEL_DISAPPEAR_MOTION` |
| 页面从左 / 右轻微滑入 | `PAGE_SLIDE_FROM_LEFT_MOTION` / `PAGE_SLIDE_FROM_RIGHT_MOTION` |
| 标题或一组文字浮现 | `TEXT_REVEAL_APPEAR_MOTION` |

## 使用边界

- 本文件只收录单个 Frame 可表达的 opacity、scale、x/y、blur 与 timing 组合。
- Badge 双层动画、Avatar hover-out 强回弹、Success check 路径绘制、error shake 分段、shimmer 循环等专项动画继续由共享专项能力或组件内部实现负责。
- 组件命中这里的语义时直接引用 preset，不复制具体数值。

```svelte
<script lang="ts">
    import { HOVER_SCALE_UP_MOTION } from "@snowui-design-system/components/motion/presets/effects";
</script>

<Frame Hover whileHover={HOVER_SCALE_UP_MOTION}>...</Frame>
```
