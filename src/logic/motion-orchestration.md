# motion-orchestration.ts 文档

> **版本**: v1.3.0
> **职责**: 负责编排组的播放、反向播放和重置逻辑。它处理组件间的时序关系和联动控制。

## 1. 核心函数

### playForward
正向播放编排组。

```typescript
function playForward(id: string, registry: Map<string, MotionRegistration>): void
```
- **逻辑**:
    1. 查找 ID 对应的组件。
    2. 确定作用域 (`scope`)：`children` (直接子级) 或 `descendants` (所有后代)。
    3. 收集所有带有动效配置的子组件。
    4. 根据 `orchestrateOrder` (如 `visual-row`) 对子组件进行排序。
    5. 根据 `orchestrateMode` (如 `sequential`) 计算延迟。
    6. 依次调用 `motion-engine` 执行动画。

### playReverse
反向播放编排组。

```typescript
function playReverse(id: string, registry: Map<string, MotionRegistration>, notify: Function): void
```
- **逻辑**:
    1. 查找组件及其子组件。
    2. 将子组件列表反转。
    3. 依次调用 `motion-engine` 的 `applyReverseAnimation`。

### resetGroup
重置编排组到初始状态。

```typescript
function resetGroup(id: string, registry: Map<string, MotionRegistration>, notify: Function): void
```
- **逻辑**: 清除元素及其子元素上的所有内联样式 (opacity, transform, transition)，使其恢复到 CSS 定义的默认状态。

## 2. 排序逻辑

支持多种视觉排序方式，通过 `getBoundingClientRect()` 计算：
- `visual-row`: 从左到右，从上到下。
- `visual-column`: 从上到下，从左到右。
- `dom`: 按 DOM 树顺序。
