# motion.svelte.ts 文档

> **版本**: v1.3.1
> **职责**: 动效编排器，统一管理页面内的动效时间轴与联动。

需求: 将组件状态与动效绑定，当状态变化时自动触发对应的动画效果，支持时间轴编排。

## 相关文件

## 相关文件

| 文件 | 描述 |
| :--- | :--- |
| [motion.svelte.ts](./motion.svelte.ts) | Motion 编排器核心 (Facade) |
| `motion-types.ts`（@snowui-design-system/components） | 类型定义 |
| [motion-engine.ts](./motion-engine.ts) | 动画执行引擎 (Tween/Spring) |
| [motion-orchestration.ts](./motion-orchestration.ts) | 编排逻辑 (Play/Reverse) |
| [SplitText.svelte](./../motion/SplitText.svelte) | 文字拆分组件 |
| [splitText.ts](./../motion/splitText.ts) | 文字拆分 Action |
| [SplitText.md](./../motion/SplitText.md) | SplitText 文档 |

---

## while* 动效值配置

所有 `while*` 关键字支持完整的动效配置：

```svelte
whileActive={{
  // 动效属性
  scale: 1.1,
  opacity: [0, 1],
  
  // 执行参数
  delay: 100,
  duration: 1500,
  easing: 'cubicOut',
  timeline: 'main:1',
  
  // 引入动效组件
  component: FlowText,
  
  // 编排模式（容器使用）
  orchestrate: true,
  orchestrateMode: 'sequential',
  orchestrateDelay: 100,
  orchestrateOrder: 'visual-row'
}}
```

---

## 1. 事件驱动动效 (Event-Driven Triggers)

| 关键字 | 描述 |
| :--- | :--- |
| whileLoad | 加载时动效 |
| whileReload | 重新加载时动效，可配合 Spin、Rotate 等组件 |
| whileAppear | 出现时动效 |
| whileDisappear | 消失时动效 |
| whileIdle | 空闲时动效 |
| whileActive | 激活时动效 |
| whileDisabled | 禁用时动效 |
| whileClick | 点击时动效 |
| whileDrag | 拖拽时动效 |
| whileHover | 悬停时动效 |
| whileFocus | 聚焦时动效 |
| whileKey | 键盘时动效 |
| whileScroll | 滚动到组件的顶部到达以屏幕可视区域中心线 |

## 2. 形态驱动动效 (Morphology-Driven Triggers)

| 关键字 | 描述 |
| :--- | :--- |
| whileCollapsed | 收起时动效 |
| whileExpanded | 展开时动效 |

## 3. 响应式驱动动效 (Responsive-Driven Triggers)

| 关键字 | 描述 |
| :--- | :--- |
| whileXs | 超小屏动效 |
| whileSm | 小屏动效 |
| whileMd | 中屏动效 |
| whileLg | 大屏动效 |
| whileXl | 超大屏动效 |
| while2xl | 超超大屏动效 |

## 4. 动效变体 (Motion Variants)

| 关键字 | 描述 |
| :--- | :--- |
| variants | 动效变体属性 |

## 5. 动效执行参数 (Motion Execution Parameters)

> **设计决策**: 缓动/持续时间是所有 `while*` 触发器的通用参数，统一在此定义，直接复用 Svelte 原生能力。

### 5.1 基础参数

| 关键字 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| delay | number | 0 | 延迟执行时间 (ms) |
| duration | number | 300 | 动画持续时间 (ms) |
| easing | EasingFunction | cubicOut | 缓动函数 |

### 5.2 缓动函数 (Easing Functions)

> 直接使用 `svelte/easing` 模块，无需自定义实现。

| 类别 | 函数 | 描述 |
| :--- | :--- | :--- |
| **基础** | linear | 线性，无缓动 |
| **缓入** | sineIn, quadIn, cubicIn, quartIn, quintIn, expoIn, circIn, backIn, elasticIn, bounceIn | 加速进入 |
| **缓出** | sineOut, quadOut, cubicOut, quartOut, quintOut, expoOut, circOut, backOut, elasticOut, bounceOut | 减速退出 |
| **缓入缓出** | sineInOut, quadInOut, cubicInOut, quartInOut, quintInOut, expoInOut, circInOut, backInOut, elasticInOut, bounceInOut | 加速进入后减速退出 |

### 5.3 使用示例

```svelte
<script>
    import { cubicOut, elasticOut } from "svelte/easing";
</script>

<!-- 基础用法：使用默认 cubicOut -->
<Card whileAppear={{ opacity: [0, 1] }} />

<!-- 自定义持续时间和延迟 -->
<Card whileAppear={{ opacity: [0, 1], duration: 500, delay: 100 }} />

<!-- 自定义缓动函数 -->
<Card whileAppear={{ 
    y: [20, 0], 
    opacity: [0, 1],
    duration: 600,
    easing: elasticOut 
}} />

<!-- 弹性效果 -->
<Button whileHover={{ scale: 1.05, easing: elasticOut, duration: 400 }} />
```

## 6. 共享元素布局转场

`Motion` 支持 Frame controller 调用的共享元素 FLIP 转场：

| API | 描述 |
| :--- | :--- |
| `captureLayout(layoutId, elementOrRect)` | 捕获元素当前位置与尺寸，作为后续相同 `layoutId` 元素挂载时的起点。 |
| `playLayoutTo(layoutId, element, target, options)` | 将当前元素过渡到目标 `HTMLElement` 或 `DOMRect`，用于退出、缩回原位等场景。 |

默认时序读取执行元素上的 `--snowui-frame-appear-motion-duration` 与 `--snowui-frame-appear-motion-easing`，兜底为 `300ms ease-out`。变量名为兼容保留，语义是生命周期进入时序。

### 5.4 物理动效 (Spring)

> 对于需要物理模拟的场景，使用 `svelte/motion` 的 `Spring` 类。

| 参数 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| stiffness | number | 0.15 | 刚度 (0-1)，值越大弹性越强 |
| damping | number | 0.8 | 阻尼 (0-1)，值越大停止越快 |

```svelte
<script>
    import { Spring } from "svelte/motion";
    
    const scale = new Spring(1, { stiffness: 0.3, damping: 0.6 });
</script>

<div 
    style="transform: scale({scale.current})"
    onmouseenter={() => scale.target = 1.1}
    onmouseleave={() => scale.target = 1}
>
    弹性缩放
</div>
```

### 5.5 减弱动态支持

> 所有动效必须支持 `prefers-reduced-motion` 媒体查询。

```svelte
<script>
    import { prefersReducedMotion } from "svelte/motion";
</script>

<Card whileAppear={{
    y: prefersReducedMotion.current ? 0 : 20,
    opacity: [0, 1],
    duration: prefersReducedMotion.current ? 0 : 300
}} />
```

### 5.6 实现原理

```
┌─────────────────────────────────────────────────────────┐
│                    SnowUI Motion                        │
├─────────────────────────────────────────────────────────┤
│  while* 触发器 → 执行参数 (easing/duration/delay)       │
├─────────────────────────────────────────────────────────┤
│           ↓            ↓            ↓                   │
│     svelte/easing  svelte/motion  CSS Animations        │
│     (缓动函数)      (Tween/Spring)  (硬件加速)          │
└─────────────────────────────────────────────────────────┘
```

### 5.7 滚动联动 (Scroll-Linked Animations) [New in v2.0]

将动效属性映射到滚动进度。

```svelte
<Frame
    scroll={{
        y: [0, 500],       // 滚动距离范围: 0px -> 500px
        opacity: [0, 1],   // Opacity 映射: 0 -> 1
        scale: [0.8, 1.2]  // Scale 映射: 0.8 -> 1.2
    }}
/>
```

### 5.8 共享元素转场 (Shared Element Transitions) [New in v2.0]

使用 `layoutId` 实现跨组件的平滑过渡 (FLIP)。

```svelte
<!-- 组件 A -->
<Frame layoutId="hero-image" />

<!-- 组件 B (导航后) -->
<Frame layoutId="hero-image" />
```

- **原理**: 记录旧元素位置 -> 计算 Delta -> 应用逆变换 -> 播放恢复动画。
- **参数**: 支持 `stiffness`, `damping`, `mass` 物理参数。

## 6. 高级编排与时间轴 (Advanced Orchestration & Timeline)

| 关键字 | 描述 |
| :--- | :--- |
| timeline | 时间轴声明: `timeline:[ID]:[Order]`。支持逗号分隔挂载多个轴。 |
| id | 元素 ID (若未提供且存在 timeline/while*，则自动生成) |

### 6.2 控制指令 (Control Commands)

> **注意**: 控制指令 (start, pause, end, reverse, loop 等) 不是组件的 Props/关键字，而是 Motion 编排器的 API 方法。详见下方 [8. API 方法](#8-api-方法)。

---

## 7. 编排模式 (Orchestration)

> 编排的核心在于：**控制每个组件"何时"开始动效**

### 7.1 编排关键字

| 关键字 | 描述 |
| :--- | :--- |
| orchestrate | 启用编排模式 |
| orchestrateMode | 编排模式: `sequential` (有序), `random` (随机), `parallel` (同时) |
| orchestrateDelay | 基础间隔时间 (ms)，默认 100ms |
| orchestrateOrder | 视觉排序: `visual-row`, `visual-column`, `visual-row-reverse`, `visual-column-reverse`, `dom` |
| orchestrateGroup | 编排组 ID，用于组控制 |
| orchestrateTrigger | 触发时机: `appear`, `hover`, `click`, `scroll`, `none` |
| orchestrateTarget | 目标选择: `*` (所有子组件), `[as-role]` (指定角色) |

### 7.2 编排模式详解

#### Sequential (有序)
子组件按指定顺序依次启动动效。

```svelte
<Container orchestrate orchestrateMode="sequential" orchestrateDelay={200} orchestrateOrder="visual-row">
    <Card whileAppear={{ opacity: [0, 1] }} />
    <Card whileAppear={{ opacity: [0, 1] }} />
    <Card whileAppear={{ opacity: [0, 1] }} />
</Container>
<!-- 效果: 3个卡片按视觉从左到右顺序，每隔200ms依次淡入 -->
```

#### Random (随机)
子组件以随机顺序启动动效。

```svelte
<Gallery orchestrate orchestrateMode="random" orchestrateDelay={150}>
    <Image whileAppear={{ scale: [0.8, 1], opacity: [0, 1] }} />
    <Image whileAppear={{ scale: [0.8, 1], opacity: [0, 1] }} />
    <Image whileAppear={{ scale: [0.8, 1], opacity: [0, 1] }} />
</Gallery>
<!-- 效果: 图片以随机顺序、每隔150ms启动缩放淡入动效 -->
```

#### Parallel (同时)
所有子组件同时启动动效（用于统一触发时机控制）。

```svelte
<Panel orchestrate orchestrateMode="parallel" orchestrateTrigger="hover">
    <Icon whileHover={{ rotate: 15 }} />
    <Text whileHover={{ color: "blue" }} />
</Panel>
<!-- 效果: 悬停时所有子组件同时触发各自的动效 -->
```

### 7.3 视觉排序 (Visual Ordering)

基于 `getBoundingClientRect()` 检测组件在浏览器中的**实际视觉位置**进行排序。

| 值 | 描述 |
| :--- | :--- |
| `visual-row` | 按视觉从左到右排序 (基于 x 坐标) |
| `visual-column` | 按视觉从上到下排序 (基于 y 坐标) |
| `visual-row-reverse` | 按视觉从右到左排序 |
| `visual-column-reverse` | 按视觉从下到上排序 |
| `dom` | 按 DOM 顺序排序 |

```svelte
<!-- 即使 CSS 改变了视觉顺序，编排仍按实际视觉位置计算 -->
<Flex style="flex-direction: row-reverse" orchestrate orchestrateOrder="visual-row">
    <Item>1</Item>  <!-- 视觉上在右边 -->
    <Item>2</Item>  <!-- 视觉上在中间 -->
    <Item>3</Item>  <!-- 视觉上在左边 -->
</Flex>
<!-- 编排顺序: 3 → 2 → 1 (基于实际视觉从左到右) -->
```

### 7.4 组控制 (Group Control)

通过 `orchestrateGroup` 可对多个编排组进行统一控制。

| 方法 | 描述 |
| :--- | :--- |
| groupPlay(groupId) | 播放指定组的编排 |
| groupPause(groupId) | 暂停指定组的编排 |
| groupReset(groupId) | 重置指定组到初始状态 |

```svelte
<Button onclick={() => groupPlay("cards")}>播放动画</Button>
<Button onclick={() => groupPause("cards")}>暂停动画</Button>

<Container orchestrate orchestrateGroup="cards" orchestrateTrigger="none">
    <Card whileAppear={{ y: [20, 0] }} />
    <Card whileAppear={{ y: [20, 0] }} />
</Container>
<!-- orchestrateTrigger="none" 表示不自动触发，由 groupPlay 手动控制 -->
```

### 7.5 实现原理

1. **视觉检测**: 父组件通过 `ResizeObserver` 获取子组件的 `getBoundingClientRect()`
2. **排序算法**: 根据 `orchestrateOrder` 对子组件按坐标/DOM 排序
3. **延迟计算**: 根据 `orchestrateMode` 计算每个子组件的启动延迟
4. **延迟注入**: 通过 Context 向子组件注入计算后的 `delay` 值
5. **触发机制**: 根据 `orchestrateTrigger` 监听对应事件并触发

---

## 8. API 方法

### 8.1 基础方法

| 方法 | 描述 |
| :--- | :--- |
| register(registration) | 注册动效节点 |
| notify(sourceId, event, payload) | 通知编排器发生了某事件 |
| subscribe(sourceId, callback) | 订阅某节点的事件 |
| play(id, options) | 播放时间轴 |
| pause(id) | 暂停时间轴 |
| end(id) | 停止时间轴 |
| initMotion() | 初始化动效编排器并设置 Context |

### 8.2 联动控制 API

> 用于组件间的联动控制，配合 `{ target, action }` 语法使用。

| 方法 | 描述 |
| :--- | :--- |
| Play(id, options?) | 播放编排组，支持 `{ reverse: true }` 反向播放 |
| Reset(id) | 重置编排组到初始状态 |

```svelte
<script>
    import { getMotion } from "./logic/motion.svelte";
    const motion = getMotion();
    
    // 播放编排组
    motion.Play('chart-bars');
    
    // 反向播放（用于 Reset）
    motion.Play('chart-bars', { reverse: true });
    
    // 重置到初始状态
    motion.Reset('chart-bars');
</script>
```

### 8.3 元素组控制 (与 SplitText 配合)

> 用于接收 SplitText 拆分后的元素数组，进行统一编排和生命周期控制。

| 方法 | 描述 |
| :--- | :--- |
| registerGroup(groupId, elements, options) | 注册元素组 |
| playGroup(groupId, options?) | 播放元素组动效 (deprecated, 使用 Play) |
| pauseGroup(groupId) | 暂停元素组 |
| resetGroup(groupId) | 重置元素组到初始状态 (deprecated, 使用 Reset) |

#### registerGroup 参数

```ts
interface RegisterGroupOptions {
    /** 编排模式 */
    orchestrateMode?: "sequential" | "random" | "parallel";
    /** 间隔延迟 (ms) */
    orchestrateDelay?: number;
    /** 顺序：ltr (从左到右), rtl, center, random */
    orchestrateOrder?: "ltr" | "rtl" | "center" | "random";
    /** 动效定义 */
    whileAppear?: MotionConfig;
    /** 动效开始回调 */
    onStart?: () => void;
    /** 动效完成回调 (所有元素完成后触发) */
    onComplete?: () => void;
    /** 单个元素完成回调 */
    onElementComplete?: (element: HTMLElement, index: number) => void;
}
```

#### 使用示例

```svelte
<script>
    import { SplitText } from "../motion/SplitText.svelte";
    import { getMotion } from "../logic/motion.svelte";
    
    const motion = getMotion();
    let result = $state();
    
    $effect(() => {
        if (result?.chars?.length > 0) {
            motion.registerGroup("hero-text", result.chars, {
                orchestrateMode: "sequential",
                orchestrateDelay: 50,
                orchestrateOrder: "ltr",
                whileAppear: { opacity: [0, 1], y: [20, 0] },
                onStart: () => console.log("动效开始"),
                onComplete: () => console.log("所有字符动效完成"),
                onElementComplete: (el, i) => console.log(`字符 ${i} 完成`)
            });
        }
    });
</script>

<SplitText text="Welcome" bind:result />

<button onclick={() => motion.playGroup("hero-text")}>播放</button>
<button onclick={() => motion.playGroup("hero-text", { reverse: true })}>反向</button>
<button onclick={() => motion.resetGroup("hero-text")}>重置</button>
```

### 8.3 生命周期事件

| 事件 | 触发时机 |
| :--- | :--- |
| onStart | 动效开始时（第一个元素开始动画） |
| onComplete | 动效结束时（最后一个元素完成动画） |
| onElementComplete | 单个元素完成动画时 |

#### 生命周期时序图

```
时间 ───────────────────────────────────────────────────────────→

元素1:  [====动画====]
元素2:      [====动画====]
元素3:          [====动画====]
元素4:              [====动画====]
        ↑                           ↑
     onStart                   onComplete
        │                           │
        └── 第一个开始 ──────────── 最后一个结束 ──┘
```

### 8.4 编排组控制 (旧 API)

| 方法 | 描述 |
| :--- | :--- |
| groupPlay(groupId) | 播放编排组 |
| groupPause(groupId) | 暂停编排组 |
| groupReset(groupId) | 重置编排组 |

---

## 9. 动效工具规范 (Motion Tool Standards)

### 9.1 命名规范
- **工具函数**: 使用 **PascalCase** (如 `Scale`, `Opacity`, `Slide`)
- **样式类名**: 动效工具生成的类名必须以 `snowui-motion-` 开头 (如 `.snowui-motion-fade-in`)

### 9.2 代码规范
- 工具必须是纯函数或无副作用的组件
- 必须支持 `prefers-reduced-motion` 检测
- 当用户开启减弱动态时，强制降级为简单的 Fade 或瞬间切换

### 9.3 通用样式存放
- **目录**: `./../styles`
- **规则**: 仅存放组件间共享的、为了解耦而必须独立于 `snowui.css` 的样式（如 `layout.css`, `motion.css`)
