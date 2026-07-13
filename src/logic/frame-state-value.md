# frame-state-value.ts

> **版本**: v1.0.0
> **职责**: 为子组件提供只读的父 Frame 状态值解析能力。

## 1. 能力边界

`frame-state-value.ts` 只做一件事：根据最近父级 Frame Context 的 `currentState`，从 `StateValueMap<T>` 中解析当前值。

它不创建状态机、不写 DOM、不修改父 Frame，也不触发其他组件行为。

## 2. API

```ts
type StateValueMap<T> = Partial<Record<CoreState, T>>;

resolveParentStateValue<T>(
    map: StateValueMap<T> | undefined,
    parentContext: { currentState?: CoreState } | undefined,
    fallback?: T,
): T | undefined
```

解析顺序：

1. 命中 `map[currentState]` 时返回当前状态值。
2. 未命中时回退 `map.Idle`。
3. 仍未命中时返回 `fallback`。

### 2.1 状态命名边界

`Load` 是 Frame loading / skeleton 协议状态名。若组件只是表达“任务处理中、等待完成、稍后自动进入 Active”等业务等待态,优先使用 `Pending` 这类自定义状态名,避免误触发骨架屏协议。

```svelte
<Button
    Click={{ Idle: "Pending", Active: "Idle" }}
    Pending={["Active", "auto"]}
>
    <Icon stateIcon={{ Idle: null, Pending: Spinner, Active: Check }} />
    <Text stateText={{ Idle: "Ready", Pending: "Loading...", Active: "Completed" }} />
    <Badge stateCount={{ Idle: 0, Active: 1 }} />
</Button>
```

## 3. 已接入组件

| 组件 | 关键字 | 说明 |
| --- | --- | --- |
| `Icon` | `stateIcon` | 根据父 Frame 状态切换图标组件；状态值为 `null` 时隐藏 Icon。 |
| `Text` | `stateText` | 根据父 Frame 状态切换文本内容。 |
| `Badge` | `stateCount` | 根据父 Frame 状态切换计数；默认 `0` 隐藏，`>= 1` 显示并走出入场动效。 |

## 4. 归属

该能力属于 OSS：子组件只读取父 Frame 已提供的 Context，并只改变自身展示，作用半径仍为 1 个 Frame 子树内的自包含消费，不涉及 FramePro 的跨组件编排、联动控制或样式编排。

## 5. 扩展原则

新增子组件状态映射关键字时必须满足：

1. 只读最近父 Frame Context。
2. 只改变组件自身公开 prop 对应的展示。
3. 不修改父 Frame 状态。
4. 不触发兄弟组件或其他 Frame 行为。
5. 不新增宿主专用 prop；能力应落在真正改变形态或内容的子组件上。

候选扩展示例：

| 组件 | 候选关键字 | 用途 |
| --- | --- | --- |
| `Badge` | `stateLabel` / `stateTone` | 状态徽标文字或语义色 |
| `Avatar` | `stateSrc` / `stateFallback` | 状态头像或回退字符 |
| `Spinner` | `stateVisible` | 按父状态显隐 |
| `Kbd` | `stateText` | 快捷键提示切换 |
