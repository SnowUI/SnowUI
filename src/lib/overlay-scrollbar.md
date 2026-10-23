# overlay-scrollbar.svelte.ts

> **版本**: v1.3.0
> **类型**: 通用运行时能力
> **职责**: 统一计算自建滚动条 Thumb 尺寸与位置，并管理滚动同步和 pointer 拖动

## API

### `useOverlayScrollbar(getViewport, getScrollbar, axis?)`

| 参数 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| `getViewport` | `() => HTMLElement \| undefined \| null` | - | 实际滚动元素 getter |
| `getScrollbar` | `() => HTMLElement \| undefined \| null` | - | 自建轨道 getter |
| `axis` | `"vertical" \| "horizontal"` | `"vertical"` | 当前实例管理的滚动轴 |

返回响应式状态：`hasOverflow`、`scrollOffset`（当前轴的原生滚动偏移）、`thumbSize`、`thumbOffset`、兼容字段 `thumbHeight` / `thumbY`，以及 `refresh()`。

## 使用规则

- 页面和普通容器优先使用 [ScrollArea](../components/ScrollArea.md)，不要直接写轨道 DOM。
- Portal、固定头部、Pin 等特殊复合组件可以直接使用本 hook。
- viewport 必须挂 `.snowui-overlay-scrollbar-viewport`，轨道和 Thumb 使用 `scrollbar.css` 中的共享类。
- 最近的滚动容器宿主必须挂 `.snowui-overlay-scrollbar-host`；纵向轨道默认隐藏，鼠标移入宿主区域后使用 Frame 默认动效渐显，移出后渐隐。横向轨道在溢出时常显。
- 纵向 Thumb 常态视觉宽度为 4px，hover 为 8px。整条轨道热区覆盖展开后的 8px、外侧边距 4px 与内侧 4px，共 16px；横向同理。共享透明热区不改变轨道测量与滑块位置，组件不得私自扩展。
- hover 命中范围为整条可见轨道；点击空白处让 Thumb 中心定位到点击处，边缘夹到滚动范围。轨道按下后可继续拖动，直接拖 Thumb 不跳位；仅处理主指针左键。pointercancel、丢失捕获和卸载均结束拖动并清理监听。
- 尺寸监听统一复用 `resizeManager`；禁止组件另建 ResizeObserver。

## 同一节点承接viewport与轨道

需要保留直接子项协议的复合组件可将轨道直接放在viewport内，宿主声明 `data-horizontal-track-position="self"`，并将 `scrollOffset` 通过轨道的 `--snowui-overlay-scrollbar-scroll-offset` 输入。共享CSS抵消内容滚动，使轨道保持在可见宿主边缘；不新增滚动监听或复制Thumb算法。

宿主按 `data-horizontal-overflow` 声明真实溢出，读取共享 `--snowui-overlay-scrollbar-layout-space` 为轨道保留独立行高；没有溢出时为0。组件继续拥有整体高度和子项外部布局，调用方的直接角色子项不增加中间包装。

## 更新日志

### v1.3.0 (2026-10-23)

- 公开现有测量中的scrollOffset，增加显式self轨道布局，供必须保留直接子项的复合组件复用。既有布局、Thumb与拖动算法保持。

- 2026-10-08：整条 Overlay 轨道触发 hover；点击空白轨道定位滑块中心并支持继续拖动，取消捕获和卸载时清理交互。

### v1.2.0 (2026-07-22)

- 纵向 Thumb 在维持 4px 常态视觉宽度的同时，将常态 hover 命中宽度扩大为 8px。

### v1.1.0 (2026-06-21)

- 归口为基础共享能力。
- 增加横向滚动轴、通用 `thumbSize` / `thumbOffset` 返回值。

### v1.0.0

- 提供纵向 Thumb 尺寸、位置同步和拖动。
