# resizable

> **版本**: v1.0.0  
> **职责**: 为表格列、普通容器与 PRO SplitPane 提供统一的尺寸拖动内核。

## 关键字

| 关键字 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| axis | `horizontal \| vertical` | `horizontal` | 尺寸变化方向 |
| edge | `start \| end \| top \| bottom` | 随 axis | 手柄所在边缘 |
| size | `number` | 当前 DOM 尺寸 | 受控尺寸 |
| minSize / maxSize | `number` | `0 / Infinity` | 尺寸边界 |
| step / largeStep | `number` | `8 / 32` | 键盘普通/Shift 步长 |
| applySize | `boolean` | `true` | 是否由 action 写宿主 width/height |
| handle | `HTMLElement` | - | 显式交互手柄；允许手柄与 resize target 不处于同一 DOM 子树 |
| onSizeChange | `(size) => void` | - | 帧合并后的尺寸变化 |

## 行为契约

- 使用 Pointer Events；pointerdown / keyboard 直接绑定显式 handle（未提供时回退到宿主委托），拖动期间同时使用 pointer capture 与 window capture 跟踪 move / up / cancel。
- 高频 pointermove 通过 requestAnimationFrame 合并。
- handle 使用 `role="separator"`、方向与 value ARIA。
- 键盘方向键调整，Shift 使用大步长。
- `clampResizableSize()` 是 Table 与 PRO SplitPane 共用的边界内核。

```svelte
<Frame use={[[resizable, { minSize: 120, maxSize: 480 }]]}>
    内容
    <Indicator axis="width" />
</Frame>
```

> **以下内容供 AI 阅读，不展示在文档站点**

- 组件不得私有复制 pointer、keyboard 或 clamp 算法。
- 业务持久化只监听 onResizeEnd，不属于 action。

## Changelog

- 2026-06-19：v1.0.0，新增共享 action、帧合并和 SplitPane clamp 复用。
