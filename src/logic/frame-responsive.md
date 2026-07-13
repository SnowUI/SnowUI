# frame-responsive.svelte.ts 文档

> **版本**: v2.1.0
> **职责**: 管理组件的响应式能力，提供断点检测。

**需求**: 基于容器宽度实现响应式设计，允许在不同断点下覆写组件属性、样式或形态。

## 1. 共享监听机制 (Shared Observer)

为了优化性能，`FrameResponsive` 使用**全局单例**的 `ResizeObserver`。

- **机制**: 无论页面上有多少个 `Frame` 组件，都只创建一个 `ResizeObserver` 实例。
- **订阅**: 每个 `Frame` 组件注册时，将自身元素添加到订阅列表。
- **分发**: 当 `ResizeObserver` 触发回调时，根据变化的元素分发给对应的订阅者。
- **清理**: 当所有订阅者都注销后，自动断开 `ResizeObserver` 连接以释放资源。

### 1.1 内存管理优化 [New in v2.1]

使用 `WeakMap` 替代 `Map` 存储订阅者回调，允许元素被垃圾回收时自动清理订阅关系。

```typescript
// 使用 WeakMap 防止内存泄漏
const subscribers = new WeakMap<Element, (width: number) => void>();
// 配合 Set 管理元素生命周期 (WeakMap 不可遍历)
const observedElements = new Set<Element>();
```

## 2. 断点定义 (Breakpoints)

遵循 Tailwind CSS 标准断点：

| 断点名称 | 最小宽度 (px) | 描述 |
| :--- | :--- | :--- |
| **xs** | 0 | 超小屏 (默认) |
| **sm** | 640 | 小屏 |
| **md** | 768 | 中屏 |
| **lg** | 1024 | 大屏 |
| **xl** | 1280 | 超大屏 |
| **2xl** | 1536 | 超超大屏 |

## 3. 状态属性

| 属性 | 类型 | 描述 |
| :--- | :--- | :--- |
| containerWidth | `number` | 当前容器宽度 (px) |
| breakpoint | `string` | 当前生效的断点名称 (`xs` - `2xl`) |

## 4. 使用方式

在 `Frame` 组件中：

```typescript
const responsive = new FrameResponsive();

// 绑定到 DOM 元素
use:responsive.resizeObserver

// 获取当前断点
const currentBp = responsive.breakpoint;
```

## 5. 全局配置 (Global Configuration)

支持通过 Svelte Context 注入全局断点配置。

```typescript
import { setContext } from 'svelte';
import { FRAME_BREAKPOINTS_CONTEXT_KEY } from '@snowui/keys';

setContext(FRAME_BREAKPOINTS_CONTEXT_KEY, {
    xs: 600,
    sm: 800,
    md: 1000,
    lg: 1200,
    xl: 1400,
    "2xl": 1600
});
```

---

## 更新日志 (Changelog)

### v2.1.0 (2026-01-20)
- **内存优化**: 使用 `WeakMap` 替代 `Map` 存储订阅者，防止内存泄漏
- **新增**: `observedElements` Set 用于管理元素生命周期
- **改进**: 完善 `destroy()` 清理逻辑

### v1.0.0
- 初始版本，实现共享 `ResizeObserver` 机制

