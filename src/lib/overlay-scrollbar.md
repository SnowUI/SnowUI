# overlay-scrollbar.svelte.ts

> **版本**: v1.2.0
> **类型**: OSS 通用运行时能力
> **职责**: 统一计算自建滚动条 Thumb 尺寸与位置，并管理滚动同步和 pointer 拖动

## API

### `useOverlayScrollbar(getViewport, getScrollbar, axis?)`

| 参数 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| `getViewport` | `() => HTMLElement \| undefined \| null` | - | 实际滚动元素 getter |
| `getScrollbar` | `() => HTMLElement \| undefined \| null` | - | 自建轨道 getter |
| `axis` | `"vertical" \| "horizontal"` | `"vertical"` | 当前实例管理的滚动轴 |

返回响应式状态：`hasOverflow`、`thumbSize`、`thumbOffset`、兼容字段 `thumbHeight` / `thumbY`，以及 `refresh()`。

## 使用规则

- 页面和普通容器优先使用 [ScrollArea](../components/ScrollArea.md)，不要直接写轨道 DOM。
- Portal、固定头部、Pin 等特殊复合组件可以直接使用本 hook。
- viewport 必须挂 `.snowui-overlay-scrollbar-viewport`，轨道和 Thumb 使用 `scrollbar.css` 中的共享类。
- 最近的滚动容器宿主必须挂 `.snowui-overlay-scrollbar-host`；纵向轨道默认隐藏，鼠标移入宿主区域后使用 Frame 默认动效渐显，移出后渐隐。横向轨道在溢出时常显。
- 纵向 Thumb 常态视觉宽度为 4px，但常态 hover / pointer 命中宽度必须保持 8px，与 hover 视觉宽度一致；命中区由共享样式提供，组件不得私自扩展。
- 尺寸监听统一复用 `resizeManager`；禁止组件另建 ResizeObserver。

## 更新日志

### v1.2.0 (2026-07-22)

- 纵向 Thumb 在维持 4px 常态视觉宽度的同时，将常态 hover 命中宽度扩大为 8px。

### v1.1.0 (2026-06-21)

- 从 PRO 归属修正为 OSS 通用能力。
- 增加横向滚动轴、通用 `thumbSize` / `thumbOffset` 返回值。

### v1.0.0

- 提供纵向 Thumb 尺寸、位置同步和拖动。
