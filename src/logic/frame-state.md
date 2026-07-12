# state.svelte.ts 文档

> **版本**: v1.3.0
> **职责**: 管理组件的交互状态、形态变化和用户交互事件，支持声明式状态机。

**需求**: 管理组件的生命周期状态、形态变化和用户交互事件，为动效触发器提供状态源。

## 1. 核心状态 (Core States)

组件的生命周期和交互状态，支持**链式转变**。

| 关键字 | 类型 | 描述 |
| :--- | :--- | :--- |
| StartLoad | `[State, 'auto'?]` | 开始加载后转变，配合 `auto` 自动转变 |
| Load | `[State, 'auto'?]` | 加载完成后转变 |
| Reload | `[State, 'auto'?]` | 重新加载后转变，调用 `onReload` 回调 |
| Appear | `[State, 'auto'?]` | 出现完成后转变 |
| Disappear | `[State, 'auto'?]` | 消失完成后转变 |
| Idle | `[State, 'auto'?]` | 空闲后转变 |
| Active | `[State, 'auto'?]` | 激活完成后转变 |
| Disabled | `[State, 'auto'?]` | 禁用后转变 |
| Validating | `[State, 'auto'?]` | 验证中 (New) |
| Uploading | `[State, 'auto'?]` | 上传中 (New) |
| Editing | `[State, 'auto'?]` | 编辑中 (New) |
| *Custom* | `[State, 'auto'?]` | 自定义状态 (任意字符串) |

**`auto` 关键字**: 表示动效完成后**自动**转变，无需外部触发。

### 1.1 自定义状态 (Custom States) [New]

除了预定义状态，`Frame` 支持任意字符串作为状态名。

```svelte
<Frame 
    customStates={['MyState']} 
    whileMyState={{ scale: 1.5 }} 
    Click="MyState" 
/>
```

### 1.2 Reload 状态与 onReload 回调

`Reload` 状态用于**刷新组件内的动态数据**，是局部刷新机制。

| 关键字 | 类型 | 描述 |
| :--- | :--- | :--- |
| onReload | `() => Promise<void>` | 进入 Reload 状态时执行的回调 |

**作用范围**: 作用于组件自身及其子组件。

```svelte
<Button
    Click={Reload}
    Reload={[Idle, 'auto']}
    whileReload={{ component: Spin }}
    onReload={async () => await fetchData()}
/>
```

## 2. 形态 (Morphology)

控制组件的形态变体，可由事件或状态触发。

| 关键字 | 描述 |
| :--- | :--- |
| collapsed | 收起状态控制属性 (boolean) |
| expanded | 展开状态控制属性 (boolean) |

## 3. 事件 (Events)

用户交互事件可**驱动状态转变**或**联动控制其他组件**。支持 `stop` (stopPropagation) 和 `prevent` (preventDefault) 修饰符。

| 关键字 | 类型 | 描述 |
| :--- | :--- | :--- |
| Click | `State \| LinkageControl` | 点击时转变状态或控制其他组件 |
| Drag | `State \| LinkageControl` | 拖拽时转变状态或控制其他组件 |
| Hover | `State \| LinkageControl` | 悬停时转变状态或控制其他组件 |
| Focus | `State \| LinkageControl` | 聚焦时转变状态或控制其他组件 |
| Key | `{ key, state } \| { key, target, action }` | 按键时转变状态或控制其他组件 |
| Scroll | `State \| LinkageControl` | 滚动时转变状态或控制其他组件 |

```svelte
<!-- 状态转变 -->
<Button Click={Active} />

<!-- 阻止冒泡 -->
<Button Click={{ run: handleClick, stop: true }} />

<!-- 联动控制 -->
<Button Click={{ target: 'chart', action: 'play' }} />

<!-- 联动控制 (对象引用) -->
<script>
  let chartRef;
</script>
<Frame bind:this={chartRef} ... />
<Button Click={{ target: chartRef, action: 'play' }} />
```

## 上报数据

通过 `FRAME_CONTEXT_KEY` 向子组件提供以下状态数据：

| 属性 | 描述 |
| :--- | :--- |
| currentState | 当前状态机状态 |
| interactionState | 综合交互状态 |
| collapsed | 是否收起 |
| expanded | 是否展开 |
| Click | 是否点击 |
| Drag | 是否拖拽 |
| Hover | 是否悬停 |
| Focus | 是否聚焦 |
| Key | 是否有键盘输入 |
| Scroll | 是否滚动到指定位置 |

