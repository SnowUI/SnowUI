# frame-layout.svelte.ts 文档

> **版本**: v1.0.0
> **职责**: 管理组件的内部布局方向，支持响应式级联控制。

**需求**: 控制子元素的排列方向，确保状态切换时布局稳定（无尺寸跳动）。

## 1. 基础布局方向

| 关键字 | 描述 |
| :--- | :--- |
| row | 水平布局 |
| column | 垂直布局 |
| grid | 网格布局 |
| reverse | 反向布局修饰符 (配合 row/column/grid 使用) |

## 2. 响应式布局 (Responsive Layout)

`FrameLayout` 实现了 **Mobile First** 的响应式级联逻辑。

### 2.1 断点属性

支持以下断点属性来覆写布局方向：

| 关键字 | 阈值 | 类型 |
| :--- | :--- | :--- |
| xs | < 640px | `Layout` |
| sm | ≥ 640px | `Layout` |
| md | ≥ 768px | `Layout` |
| lg | ≥ 1024px | `Layout` |
| xl | ≥ 1280px | `Layout` |
| 2xl | ≥ 1536px | `Layout` |

**Layout 值**: `"row" | "column" | "grid" | "row-reverse" | "column-reverse"`

### 2.2 级联逻辑 (Cascade Logic)

1.  **基础方向**: 首先读取基础属性 (`row`, `column` 等)。
2.  **断点覆盖**: 根据当前容器宽度所在的断点，**从大到小**或**从小到大**应用覆盖规则。
    *   本模块采用 **Mobile First** 策略（从小到大覆盖）。
    *   即：`xs` 的设置会被 `sm` 覆盖，`sm` 会被 `md` 覆盖，以此类推。

**示例**:

```svelte
<!-- 
  默认 (xs): row
  sm 及以上: column (覆盖 row)
  lg 及以上: row (覆盖 column)
-->
<Frame row sm="column" lg="row" />
```

## 3. 上报数据

`FrameLayout` 计算出最终的 `direction` 属性，供 `Frame` 组件生成 CSS 类名：

- `snowui-direction-row`
- `snowui-direction-column`
- `snowui-direction-row-reverse`
- ...

## 3. 布局过渡 (Layout Transition)

`FrameLayout` 模块还导出了一个独立的工具函数 `createLayoutTransition`，用于实现 FLIP (First, Last, Invert, Play) 动画，常用于处理布局变化时的平滑过渡。

### 3.1 使用方法

```typescript
import { createLayoutTransition } from "./frame-layout.svelte";

const transition = createLayoutTransition();

// 1. 记录初始状态 (First)
transition.capture(element);

// ... DOM 更新 ...

// 2. 播放过渡动画 (Last -> Invert -> Play)
transition.play(element, { duration: 300 });
```

### 3.2 核心逻辑

1.  **Capture (First)**: 记录元素当前的 `BoundingClientRect`。
2.  **Play (Last -> Invert -> Play)**:
    *   获取元素新的 `BoundingClientRect`。
    *   计算位置 (`dx`, `dy`) 和尺寸 (`dw`, `dh`) 的差异。
    *   **Invert**: 立即应用逆变换 (`transform: translate(...) scale(...)`)，使元素视觉上保持在原位。
    *   **Play**: 在下一帧移除变换，利用 CSS `transition` 让元素平滑过渡到新位置。

