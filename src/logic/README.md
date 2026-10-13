# 通用逻辑模块总览

> **版本**: v1.7.0
> **目录**: `src/logic/`

本目录不是“零散工具箱”，而是 SnowUI 组件运行时的共享基础设施。新组件在实现前必须先检查这里是否已经提供相同能力，尤其是 `Frame` 外壳、动效、响应式、骨架、截断、图片预览、样式编排相关需求。

---

## 阅读顺序

创建新组件前，建议至少按以下顺序阅读：

1. `frame-types.ts` / `frame-types.md`
2. [共享布局样式](../styles/layout.css)（不是 logic 目录中的文件）
3. `frame-prop-filter.ts` / `frame-prop-filter.md`
4. `frame-field-control.ts` / `frame-field-control.md`
5. `frame-state.svelte.ts` / `frame-state.md`
6. `frame-motion.svelte.ts` / `frame-motion.md`
7. `frame-motion-defaults.ts` / `frame-motion-defaults.md`
8. `frame-inline-style.svelte.ts` / `frame-inline-style.md`
9. `frame-dom-runtime.svelte.ts` / `frame-skeleton-runtime.svelte.ts`
10. 按需再读 `text-collapse`、`image-preview`、`frame-orchestrator`、`scale`、`responsive`

如果组件是“外层 `Frame` + 内层原生宿主元素”结构，还必须优先查看 `frame-prop-filter.ts`，直接复用 `splitFrameHostProps()`，不要再手写一套白名单。

---

## 模块地图

### 1. Frame 核心契约

| 文件 | 作用 | 什么时候先看 |
| :--- | :--- | :--- |
| `frame-types.ts` | `FrameProps`、状态机、事件、动效、编排、Scale、样式编排的总类型契约 | 任何基于 `Frame` 的新组件 |
| [layout.css](../styles/layout.css) | `.snowui-hoverable` / `.snowui-field-bordered` 工具类 | 判断共享 hover 或输入外框行为时 |
| `frame-identity.svelte.ts` | 处理 `id`，并在存在动效配置时生成稳定自动 ID | 组件需要注册 Motion 或依赖 ID 暴露变量时 |
| `frame-prop-filter.ts` | 统一识别 Frame 内部关键字；同时负责 `Frame -> DOM` 过滤与 `复合组件 -> Frame/宿主元素` 分发 | `Input / Textarea / Select / SearchField` 这类复合组件 |
| `frame-field-control.ts` | 统一处理原生表单宿主的 `value/defaultValue`、`invalid/aria-invalid` 与值同步 | `Input / Textarea / Select` 这类字段型复合组件 |

### 2. Frame 运行时主链

| 文件 | 作用 | 关键输出 |
| :--- | :--- | :--- |
| `frame-state.svelte.ts` | 维护 hovered/pressed/focused 等交互状态与 `currentState` 状态机；负责状态链式跳转和事件触发 | `interactionState`、事件处理器、状态转移 |
| `frame-layout.svelte.ts` | 解析 `row / column / grid / reverse` 与断点布局覆盖；附带 FLIP 布局过渡工具 | `direction`、`createLayoutTransition()` |
| `frame-responsive.svelte.ts` | 基于共享 `ResizeObserver` 计算容器断点 | `containerWidth`、`breakpoint` |
| `frame-perception.svelte.ts` | 向子组件透出 `FRAME_CONTEXT_KEY`、旧交互上下文、Skeleton 上下文和尺寸上下文 | 父级状态/断点/编排能力的上下文感知 |
| `component-parts.svelte.ts` | `parts.ComponentName` 直接所有权边界、默认 Props 读取、class/style 合并 | 复合组件默认内置 + `as` 外置双模式 |
| `continuous-hover.svelte.ts` | 容器唯一背景层在候选项之间连续移动 | 连续列表、菜单、导航和行 hover |
| `frame-actions.svelte.ts` | 统一拼装并挂载用户 action 与内部 action | `buildFrameActions()`、`mountFrameActions()` |
| `frame-dom-runtime.svelte.ts` | 组装 DOM props、disabled/aria、capture handlers、原生事件包装器、运行时 `data-*` 属性 | `domProps`、`nativeHandlers`、`dataAttrs` |
| `frame-class-state.svelte.ts` | 解析 `stateVars / stateClass / stateStyle`，并生成 `computedClass` 与 `childrenRenderContext` | 状态映射 class/style 与子内容上下文 |
| `frame-state-value.ts` | 为子组件按最近父 Frame `currentState` 解析状态值 | `Icon stateIcon`、`Text stateText` |
| `frame-inline-style.svelte.ts` | 统一拼装 `computedStyle`：`while*`、桥接变量、Scale 变量、编排变量、状态样式 | 根节点最终内联样式 |
| `frame-skeleton-runtime.svelte.ts` | Skeleton 渲染前判定、首层子骨架探测、`renderHints` 解析 | `shouldRenderSkeleton` 等布尔判断 |

### 3. 响应式与尺寸基础设施

| 文件 | 作用 | 备注 |
| :--- | :--- | :--- |
| `observer.svelte.ts` | 延迟创建、按帧交付的全局单例 `ResizeObserverManager` | 共享监听基础设施；SSR 与能力缺失时不创建原生 Observer，所有项目禁止在此入口之外 `new ResizeObserver` |
| `frame-scale-observer.svelte.ts` | 把运行时宽高、高宽比、统一尺寸写进 CSS 变量 | 仅观察和写变量，不直接决定视觉样式 |
| `frame-scale-resolver.svelte.ts` | 把 `FrameProps` 解析成 Scale observer 参数和 style 变量 | `resolveScaleObserverOptions()`、`resolveScaleStyleVars()` |
| `responsive.svelte.ts` | 旧的 headless 响应式控制器，支持断点规则对象 | 老链路/非 Frame 逻辑可复用，但新组件先看 `frame-responsive.svelte.ts` |
| `geometry-cache.ts` | 缓存 `getBoundingClientRect()` 结果，降低视觉排序开销 | 供动效编排视觉排序使用 |

### 4. Motion 基础设施

| 文件 | 作用 | 备注 |
| :--- | :--- | :--- |
| `motion.svelte.ts` | 全局 Motion 编排器 facade；注册节点、时间轴、编排组、共享元素转场、滚动联动 | `initMotion()`、`getMotion()` |
| `motion-types.ts` | Motion 的注册、事件、执行参数、元素组类型契约 | 所有 motion 模块的公共类型 |
| `motion-config.ts` | `MotionConfig`、`ScrollConfig` 类型定义 | `while*` 配置的核心结构 |
| `motion-engine.ts` | 执行 appear/reverse 动画、从元素样式变量读取配置 | 无状态执行器 |
| `motion-orchestration.ts` | 编排容器的正向播放、反向播放和 reset | 排序、延迟、视觉行列顺序 |
| `timeline.svelte.ts` | 时间轴播放、暂停、结束、区间控制 | `Motion` 的时间轴引擎 |
| `frame-motion.svelte.ts` | `Frame` 和全局 Motion 之间的桥；把状态/断点变化上报给编排器 | `controller.play/reset/pause` |
| `frame-motion-defaults.ts` | 默认 `while*` 动效的统一真相来源，负责默认注入、合并、关闭、按 `stateStyle` 差异推导动效 | 新组件不要在组件内重复声明默认 hover/active/morph 动效 |
| `layout-flip.ts` | 共享元素位置/尺寸转场；默认 `transform` FLIP，也可用 `layout` 策略保持文字字形不缩放 | 卡片↔全屏、文字排版需要保持字号的形态切换 |
| `morph.ts` | 通用 morph 过渡常量 | 给折叠/形态变化场景兜底 |
| `frame-orchestrator.svelte.ts` | 高优先级样式编排器，支持 `$#target.prop` 和 `$self.prop` 表达式联动 | 复杂跨组件样式联动优先复用这里 |

### 5. 文本折叠与截断

| 文件 | 作用 | 备注 |
| :--- | :--- | :--- |
| `text-collapse.svelte.ts` | 实际的多行/可展开折叠测量 action；负责高度约束宿主识别、样式生成、截断判断 | `Text` 组件的主折叠能力 |
| `frame-truncation.svelte.ts` | 历史文件名保留，当前导出通用 `TruncationController`，并兼容 `TextTruncation`；负责 `lines`、`isExpanded`、`onTruncate` | Text 与 TableCell 共用，尺寸监听统一走 resizeManager |
| `collapse.svelte.ts` | 兼容旧路径的转发文件 | 仅用于避免旧导入/HMR 404 |

### 6. 媒体与宿主适配

| 文件 | 作用 | 备注 |
| :--- | :--- | :--- |
| `image-preview.ts` | 页面级图片预览事件总线，协调 `Image / ImageGroup / ImageViewer` | 图片预览、viewer presence、window fallback |
| `wc-adapter.ts` | Web Components 适配层 | 只在自定义元素/宿主集成场景需要 |
| `../lib/floating-position.ts` | 浮层边缘碰撞、边界夹取和反向方位计算 | Tooltip、Chart hover panel、后续浮层定位 |
| `../lib/tooltip-delay.ts` | Tooltip hover warmup / cooldown 协调器 | 多个 Tooltip 之间共享首次延迟与快速切换窗口；Popover 复用 `600ms` 基础延迟常量 |
| `../lib/resizable.ts` | 通用容器尺寸拖动 action 与 clamp 内核 | TableHead、普通容器与 SplitPane 共用 |

### 7. 工具与兼容项

| 文件 | 作用 | 备注 |
| :--- | :--- | :--- |
| `frame-utils.ts` | Motion 识别、动效配置转样式、readonly capture handler 等通用工具 | `hasMotionConfig()` 经常被 ID / Motion 注册复用 |

---

## 复用准则

### 1. 新组件先问这几个问题

| 需求 | 先查哪里 |
| :--- | :--- |
| 只是要一个标准交互外壳 | `Frame.svelte` + `layout.css` |
| 需要把 props 拆给 `Frame` 和原生元素 | `frame-prop-filter.ts` |
| 需要 hover/click/focus/active/default motion | `frame-motion-defaults.ts` |
| 需要把状态机/事件接入 Motion | `frame-state.svelte.ts` + `frame-motion.svelte.ts` |
| 需要子组件按父 Frame 状态切换自身内容 | `frame-state-value.ts`（已接入 `Icon stateIcon` / `Text stateText`） |
| 需要响应式断点 | `frame-responsive.svelte.ts` / `frame-layout.svelte.ts` |
| 需要运行时尺寸驱动 | `frame-scale-observer.svelte.ts` + `frame-scale-resolver.svelte.ts` |
| 需要 loading/skeleton | `frame-skeleton-runtime.svelte.ts` |
| 需要文本行数截断/展开 | `text-collapse.svelte.ts` + `TruncationController` |
| 需要拖动列宽或容器尺寸 | `../lib/resizable.ts` + `Indicator.svelte` |
| 需要图片预览/查看器联动 | `image-preview.ts` |
| 需要浮层边缘碰撞/边界夹取 | `../lib/floating-position.ts` |
| 需要 Tooltip 首次延迟/快速切换时序 | `../lib/tooltip-delay.ts` |
| 需要共享元素转场，且文字不能随容器缩放 | `layout-flip.ts` 的 `strategy: "layout"` |
| 需要跨组件样式联动 | `frame-orchestrator.svelte.ts` |

### 2. 最常见的重复造轮子场景

- 不要在组件里重新维护一套 Frame prop 白名单。复合组件直接用 `splitFrameHostProps()`。
- 不要在每个字段组件里重复写 `value/defaultValue`、`aria-invalid`、`file input` 同步规则。统一复用 `frame-field-control.ts`。
- 不要在组件里单独推导 hover/active/appear 默认动效。默认注入和差异推导统一走 `frame-motion-defaults.ts`。
- 不要为每个组件单独 new `ResizeObserver`。统一走 `observer.svelte.ts` 或 `frame-responsive.svelte.ts`。
- 不要把文本截断、可展开逻辑重写在组件内部。直接复用 `TruncationController` / `collapse`。
- 不要在 Table、容器或 SplitPane 中复制 pointer、keyboard 和 clamp；统一复用 `resizable.ts`。
- 不要在图片组件里私造全局预览总线。统一使用 `image-preview.ts`。
- 不要在组件内部写“跨组件尺寸/间距联动”补丁。先看 `frame-orchestrator.svelte.ts` 是否能表达。

### 3. 组件开发前的最低检查清单

- 是否已经有匹配的 `CSS 行为`？
- 是否已经有共享状态/观察器/编排器可以复用？
- 是否只是需要在 `Frame` 外再包一层原生宿主元素？
- 是否属于 `Text`、`ImageViewer`、Motion 默认资源已经覆盖的能力？
- 是否会和 `Skeleton`、`renderHints`、`Frame` 默认动效重复实现？

如果其中任一问题答案是“是”，先复用现有逻辑，再写新代码。

---

## 目录文档规则

- 每个逻辑文件应尽量有同名 `.md` 文档，说明职责、关键字、依赖与更新日志。
- `README.md` 负责给“新组件作者”做入口地图，不代替每个模块的细节文档。
- 当新增共享逻辑时，必须同步更新本 README，避免后续组件继续重复造轮子。
