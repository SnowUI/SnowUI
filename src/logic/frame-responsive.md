# frame-responsive.svelte.ts 文档

> **版本**: v3.0.0
> **职责**: 根据 Frame 的当前容器宽度，压缩可用间距并在内容放不下时启用显式回退布局。

**需求**: 响应由实际内容与容器宽度触发，不要求消费方维护设备断点表。

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

## 2. 适配顺序

1. 测量 Frame 当前可用宽度与普通直系子项的首选宽度。
2. 内容放不下时，把大于下限的 gap / padding 按需向下压缩。
3. gap / padding 默认下限为 4px；首选值低于 4px 时保持首选值，不放大也不继续压缩。
4. 压缩后仍放不下，且消费方传入 `responsive` 时，启用回退方向、对齐和子项宽度策略。
5. 容器恢复到首选布局所需宽度后，完整恢复首选布局和间距。

## 3. Props

| 属性 | 类型 | 默认 | 描述 |
| :--- | :--- | :--- | :--- |
| `direction` | `row \| column \| row-reverse \| column-reverse` | 未设置 | 放不下时的排列方向 |
| `align` | `start \| center \| end \| stretch` | 未设置 | 回退布局的交叉轴对齐 |
| `justify` | `start \| center \| end \| between` | 未设置 | 回退布局的主轴对齐 |
| `childrenWidth` | `hug \| fill` | 未设置 | 回退布局中普通直系子项的宽度策略 |
| `childrenMinWidth` | `number \| string` | 未设置 | 回退布局中普通直系子项的最小宽度；数字为 px |
| `minGap` | `number` | `4` | gap 可压缩下限，单位 px |
| `minPadding` | `number \| { all?, x?, y?, top?, right?, bottom?, left? }` | `4` | padding 可压缩下限，单位 px；数字作用于四边，对象按单边 → 轴向 → all → 默认值解析 |

不传 `responsive` 时不会改变方向、对齐或子项宽度，但默认的 4px 间距下限保护仍然生效。`enableResponsive={false}` 可关闭整个尺寸适配能力。

## 4. 兼容断点状态

`breakpoint` getter 与旧 `xs`–`2xl` 方向字段暂时保留，仅用于兼容既有消费方；新 API 不再要求配置每个断点，也不以这些断点决定 fit-based 回退。

---

## 更新日志 (Changelog)

### v3.0.0 (2026-09-02)
- **新增**: 基于实际内容宽度的 gap / padding 压缩与结构回退
- **新增**: `direction`、`align`、`justify`、`childrenWidth`、`childrenMinWidth`、`minGap`、`minPadding`
- **扩展**: `minPadding` 支持 all、左右 x、上下 y 与 top / right / bottom / left 单边下限
- **约束**: 4px 仅作为大间距的默认压缩下限，原值低于 4px 时保持不变

### v2.1.0 (2026-01-20)
- **内存优化**: 使用 `WeakMap` 替代 `Map` 存储订阅者，防止内存泄漏
- **新增**: `observedElements` Set 用于管理元素生命周期
- **改进**: 完善 `destroy()` 清理逻辑

### v1.0.0
- 初始版本，实现共享 `ResizeObserver` 机制
