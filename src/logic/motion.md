# Motion 编排器模块

> **版本**: v1.3.1
> **职责**: 全局与子树级 Motion 编排器 Facade，管理动效节点注册、时间轴、编排组、共享元素转场与滚动联动。

## 相关模块

| 文件 | 职责 |
| :--- | :--- |
| [motion.svelte.ts](motion.svelte.ts) | Motion 编排器 Facade（`initMotion()`、`getMotion()`） |
| [motion-types.ts](motion-types.ts) | 注册、事件、执行参数与元素组类型契约 |
| [motion-config.ts](motion-config.ts) | `MotionConfig` 与 `ScrollConfig` 类型定义 |
| [motion-engine.ts](motion-engine.ts) | 无状态动画执行器（Tween / Spring / 样式变量解析） |
| [motion-orchestration.ts](motion-orchestration.ts) | 编排容器正反向播放、排序与 reset |
| [timeline.svelte.ts](timeline.svelte.ts) | 时间轴播放、暂停、停止与区间控制 |
| [layout-flip.ts](layout-flip.ts) | 共享元素 FLIP 转场（`transform` 与 `layout` 策略） |

单组件 `while*`、`orchestrate*`、`scroll`、`layoutId` 的公开 Props 契约统一由 [Frame](../components/Frame.md) 维护，本文件只记录内部编排器接口与生命周期边界。

## 核心 API

### 1. 上下文与节点注册

| 方法 | 说明 |
| :--- | :--- |
| `initMotion()` | 在父组件初始化阶段创建 Motion 编排器并写入 Svelte Context |
| `getMotion()` | 读取当前树最近的 Motion 编排器实例 |
| `register(registration)` | 注册受控 Frame 动效节点，返回注销清理函数 |
| `notify(sourceId, event, payload)` | 上报节点触发事件，驱动订阅或联动目标 |
| `subscribe(sourceId, callback)` | 订阅目标节点的事件流 |

### 2. 时间轴与编排组控制

| 方法 | 说明 |
| :--- | :--- |
| `play(id, options?)` / `pause(id)` / `end(id)` | 控制指定时间轴播放、暂停与停止 |
| `Play(id, options?)` | 播放编排组，支持 `{ reverse: true }` 反向播放 |
| `Reset(id)` | 重置编排组到初始状态 |
| `groupPlay(groupId)` / `groupPause(groupId)` / `groupReset(groupId)` | 按 `orchestrateGroup` 控制多个编排组 |
| `registerGroup(groupId, elements, options)` | 为显式 `HTMLElement[]` 注册元素组编排（支持 `onStart`、`onComplete`、`onElementComplete`） |

```svelte
<script lang="ts">
    import { initMotion, Frame, Card, Button } from '@snowui-design-system/components';
    const motion = initMotion();
</script>

<Button onclick={() => motion.Play('cards')}>Play</Button>
<Button onclick={() => motion.Reset('cards')}>Reset</Button>

<Frame id="cards" orchestrate orchestrateMode="sequential" orchestrateDelay={120} orchestrateTrigger="none">
    <Card whileAppear={{ opacity: [0, 1], y: [12, 0] }} />
    <Card whileAppear={{ opacity: [0, 1], y: [12, 0] }} />
</Frame>
```

### 3. 共享元素布局转场

| 方法 | 说明 |
| :--- | :--- |
| `captureLayout(layoutId, elementOrRect)` | 记录元素当前几何矩形，供后续同 `layoutId` 节点挂载时读取起点 |
| `playLayoutTo(layoutId, element, target, options)` | 将当前元素过渡到目标 `HTMLElement` 或 `DOMRect`（默认读取 `--snowui-frame-appear-motion-duration/easing`，回退 `300ms ease-out`） |

## 运行与无障碍约束

1. **按需实例化**：未调用 `initMotion()` 且未声明跨组件联动时，普通 `Frame` 不创建全局编排订阅。
2. **视觉排序缓存**：`visual-row` / `visual-column` 及其反向模式通过 `geometry-cache.ts` 批量读取 `getBoundingClientRect()`，避免逐节点强制同步重排。
3. **减少动效偏好**：当 `prefers-reduced-motion: reduce` 生效时，跳过位移与弹簧过渡，直接收敛到目标状态。

## 更新日志

### v1.3.1 (2026-08-15)

- 收敛内部模块边界，统一 `Play` / `Reset` 编排组控制与 `captureLayout` / `playLayoutTo` 共享转场接口。
