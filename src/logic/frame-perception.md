# perception.svelte.ts 文档

> **版本**: v1.3.0
> **职责**: 管理组件的上下文感知能力，支持子组件感知父组件状态和联动控制。

**需求**: 子组件可感知父组件的**所有关键字**，实现组件间的隐式通信和联动控制。

## 1. 感知范围 (Perception Scope)

子组件通过 `getContext(FRAME_CONTEXT_KEY)` 感知父组件的**完整能力**（Frame 第1-5章所有关键字）：

| 类别 | 可感知的关键字 |
| :--- | :--- |
| **1. 基础属性** | `class`, `style`, `as`, `tag`, `id` |
| **2. 核心状态** | `StartLoad`, `Load`, `Reload`, `Appear`, `Disappear`, `Idle`, `Active`, `Disabled`, `currentState` |
| **2. 形态** | `collapsed`, `expanded` |
| **2. 事件** | `Click`, `Drag`, `Hover`, `Focus`, `Key`, `Scroll` |
| **3. 响应式** | `breakpoint`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl` |
| **4. 布局** | `row`, `column`, `grid`, `reverse`, `morph` |
| **5. 动效** | 所有 `while*` 触发器、`variants`、`delay`、`duration`、`easing`、`timeline` |
| **5. 编排** | `orchestrate`, `orchestrateMode`, `orchestrateDelay`, `orchestrateOrder`, `orchestrateGroup` |
| **链式继承** | `parent` (访问祖父组件上下文) |

## 2. 联动控制 (Linkage Control)

**所有关键字**都支持 `{ target, action }` 语法**控制其他组件**：

```typescript
interface LinkageControl {
    target: string;                      // 目标组件 ID
    action: 'play' | 'reset' | 'pause';  // 动作类型
    reverse?: boolean;                   // 是否反向执行
}
```

| 触发方式 | 示例 |
| :--- | :--- |
| **事件触发** | `Click={{ target: 'id', action: 'play' }}` |
| **状态触发** | `Active={{ target: 'id', action: 'play' }}` |
| **形态触发** | `collapsed={{ target: 'id', action: 'pause' }}` |
| **响应式触发** | `md={{ target: 'id', action: 'play' }}` |
| **布局触发** | `row={{ target: 'id', action: 'play' }}` |
| **动效触发** | `whileHover={{ target: 'id', action: 'play' }}` |

**action 可选值**：`play`, `reset`, `pause`

## 3. 响应原则 (Response Principles)

| 原则 | 描述 |
| :--- | :--- |
| 默认静默 | 子组件默认不会对父组件的任何能力做出响应，保持独立性 |
| 转化机制 | 子组件可将感知到的父组件能力转化为自身的属性、事件或动效 |

## 4. 父状态声明式消费组件

部分轻量子组件已接入父 Frame 状态消费协议。它们只读取最近父级 `FRAME_CONTEXT_KEY.currentState`，并只改变自身展示，不修改父组件状态，也不触发其他组件行为。

| 组件 | 关键字 | 行为 |
| :--- | :--- | :--- |
| `Icon` | `stateIcon` | 按父 Frame 状态切换图标组件；状态值为 `null` 时隐藏 Icon。 |
| `Text` | `stateText` | 按父 Frame 状态切换文本内容。 |

示例：

```svelte
<Button
    Click={{ Idle: "Pending", Active: "Idle" }}
    Pending={["Active", "auto"]}
>
    <Icon stateIcon={{ Idle: null, Pending: Spinner, Active: Check }} />
    <Text stateText={{ Idle: "Ready", Pending: "Loading...", Active: "Completed" }} />
</Button>
```

> `Load` 是 Frame loading / skeleton 协议状态名。若子组件需要展示真实 Spinner / 文案,使用 `Pending` 这类业务状态名,避免骨架屏协议接管子内容。

## 5. 上下文 Key

| Key | 描述 |
| :--- | :--- |
| FRAME_CONTEXT_KEY | 主上下文 Key，包含父组件的完整能力 |
| MOTION_ORCHESTRATOR_CONTEXT_KEY | 动效编排器上下文 Key |
| SKELETON_CONTEXT_KEY | 骨架屏加载状态上下文 Key |
