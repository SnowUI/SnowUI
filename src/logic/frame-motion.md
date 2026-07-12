# frame-motion.svelte.ts 文档

> **版本**: v2.4.0
> **职责**: 管理组件的动效注册与触发，作为组件与全局动效编排器之间的桥梁。

**需求**: 将组件状态与动效绑定，当状态变化时自动触发对应的动画效果，支持时间轴编排。

## 1. 动效注册 (Registration)

`FrameMotion` 负责将组件注册到全局 `Motion` 编排器。

### 注册条件 (`shouldRegister`)

组件仅在满足以下条件之一时才会注册：
1.  **显式指定 ID**: 用户传入了 `id` 属性。
2.  **包含动效配置**: `hasMotionConfig(props)` 返回 `true`。

**动效配置包括**:
- `orchestrate` (编排模式)
- 事件/状态触发器 (`Click` / `Hover` / `Load` / `Active` 等，触发默认 while* 动效)
- `while*` 系列属性 (如 `whileHover`, `whileClick`)
- `timeline` (时间轴)
- `variants` (变体)

### 注册信息

注册时向编排器提供：
- `id`: 组件唯一标识
- `element`: DOM 元素引用
- `timeline`: 所属时间轴信息

## 2. 事件通知 (Event Notification)

`FrameMotion` 监听 `FrameState` 和 `FrameResponsive` 的状态变化，并向编排器发送通知。

### 监听的事件源

| 事件源 | 对应 while 属性 | 触发条件 |
| :--- | :--- | :--- |
| **交互状态** | `whileHover` | `state.hovered` |
| | `whileClick` | `state.pressed` |
| | `whileFocus` | `state.focused` |
| | `whileDrag` | `state.isDragging` |
| | `whileScroll` | `state.isScrolling` |
| | `whileKey` | `state.isKeyActive` |
| **生命周期** | `whileLoad` | `props.whileLoad` |
| | `whileActive` | `props.whileActive` |
| | `whileDisabled` | `props.whileDisabled` |
| | `whileAppear` | 组件挂载 |
| | `whileDisappear` | 组件卸载 |
| **形态** | `whileCollapsed` | `props.collapsed` |
| | `whileExpanded` | `props.expanded` |
| **响应式** | `whileXs` - `while2xl` | `responsive.breakpoint` 变化 |
| **空闲** | `whileIdle` | 无其他触发器激活时 |

## 3. 动效配置 (Motion Configuration)

### 3.0 默认动效注入 (Default While Resolution)

默认动效由 `frame-motion-defaults.ts` 统一解析，资源文件位于 `src/motion/*.ts`。

- 无总开关：关键字被使用时自动注入对应默认 `while*`。
- 通道规则：`while*={{...}}` 是完整视觉通道声明，不补入默认 opacity / scale / x / y / blur / rotate 等视觉通道；只继承默认时序与 spring 动力学参数，页面值优先。
- 关闭规则：`whileXxx={false}` 明确关闭该关键字默认动效。
- 默认数字动效：`FlowText`（`motionDefaults.number` / `motionDefaults.numberComponent`）。

### 3.1 基础参数 (Basic)
- `delay`: 延迟 (ms)
- `duration`: 持续时间 (ms)
- `easing`: 缓动函数 (如 `cubicOut`)

### 3.2 物理弹簧 (Spring Physics) [New in v2.0]
当 `type: 'spring'` 时，使用物理模拟而非时间插值。

| 参数 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| `stiffness` | number | 170 | 刚度。值越大，回弹越快。 |
| `damping` | number | 26 | 阻尼。值越大，停止越快，震荡越少。 |
| `mass` | number | 1 | 质量。值越大，惯性越大，动作越慢。 |

> **注意**: 启用 Spring 后，`duration` 和 `easing` 参数将被忽略。

### 3.3 滚动联动 (Scroll-Linked) [New in v2.0]
通过 `scroll` 属性配置滚动插值。

- **键**: CSS 属性名 (如 `opacity`, `scale`, `y`) 或 `y` (滚动范围)。
- **值**: 数组 `[from, to]`。

### 3.4 共享元素 (Shared Element) [New in v2.0]
通过 `layoutId` 或 `itemId` 标识共享元素。
- 当具有相同 `layoutId` 的新组件挂载时，会自动计算位置差 (Delta) 并执行 FLIP 动画。

### 3.5 能力作用域 (Capability Scope) [New in v1.3]
通过 `scope` 属性控制编排范围。

- `self`: 仅自身
- `children`: 仅直接子组件
- `descendants`: 所有后代 (默认)
- `explicit`: 仅显式目标

### 3.6 编排触发 (Orchestration Trigger) [New in v2.1]

通过 `orchestrateTrigger` 控制编排触发时机。

| 值 | 描述 |
|:---|:---|
| `appear` | 组件出现时触发 (默认) |
| `hover` | 悬停时触发 |
| `click` | 点击时触发 |
| `scroll` | 滚动至可见时触发 |
| `none` | 不自动触发，需手动调用 |

### 3.7 编排目标 (Orchestration Target) [New in v2.1]

通过 `orchestrateTarget` 指定要编排的子元素 (CSS 选择器)。

```svelte
<Frame orchestrate orchestrateTarget=".card">
    <div class="card">Will be orchestrated</div>
    <div class="other">Will NOT be orchestrated</div>
</Frame>
```

## 4. 与 Motion 编排器的交互

- **通知**: `motion.notify(id, event, detail)`

`FrameMotion` 本身不执行动画，只负责**状态上报**。实际的动画执行由 `Motion` 编排器调度。

## 5. 外部控制器 (External Controller)

`FrameMotion` 暴露了 `controller` 对象，允许通过组件实例直接控制动效，无需依赖全局 ID。

```typescript
// 通过 Frame 组件实例调用 (bind:this)
frameInstance.getController().play({ reverse: true });
```

支持的方法：
- `play(options?: { reverse?: boolean })`
- `captureLayout(layoutId?: string)`
- `playLayoutTo(target?: HTMLElement | DOMRect, options?: { layoutId?: string; duration?: number; easing?: string; onComplete?: () => void })`
- `reset()`
- `pause()`

`captureLayout` / `playLayoutTo` 是 Frame 侧通用 FLIP 布局转场接口，用于放大、缩小、跨层覆盖层回到原位等形态变化。默认时序从目标 Frame 的生命周期进入 bridge 读取，组件不得在本地硬编码 transition 时长。

---

## 更新日志 (Changelog)

### v2.4.0 (2026-06-30)
- 统一显式 `while*` 对象的完整视觉通道声明语义；默认视觉不再浅合并。

### v2.3.0 (2026-05-02)
- 新增：Frame controller 暴露 `captureLayout` 与 `playLayoutTo`，供组件复用共享元素 FLIP 布局转场。
- 调整：共享元素转场时序改为读取 Frame 生命周期进入 bridge，避免在 Motion 编排器中硬编码 duration/easing。

### v2.2.0 (2026-02-26)
- 新增：默认动效自动注入规则文档（无总开关、可覆写、可按关键字关闭）
- 新增：记录 `src/motion/*.ts` 默认动效目录与 `frame-motion-defaults.ts` 管理关系
- 新增：共享元素锚点 `itemId`（与 `layoutId` 并行语义）

### v2.1.0 (2026-01-20)
- **性能优化**: 合并 12 个独立 `$effect` 为单一差量更新 effect
- **新增**: `orchestrateTrigger` 属性支持 `appear`/`hover`/`click`/`scroll`/`none`
- **新增**: `orchestrateTarget` 属性支持 CSS 选择器指定编排目标
- **新增**: `scroll.offset` 配置支持自定义滚动触发偏移量

### v2.0.0
- 新增物理弹簧 (Spring Physics) 支持
- 新增滚动联动 (Scroll-Linked) 支持
- 新增共享元素转场 (Shared Element) 支持
