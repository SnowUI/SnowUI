# Frame.svelte（OSS）

> **版本**: v1.0.0
> **职责**: OSS 版基础容器。承载所有**自包含**的组件能力——布局、状态机、JS 动效执行、FLIP、Scale 观察、Perception、Skeleton 协议。
> **边界**: 不包含**跨组件协调**能力（编排模式 / 联动控制 / 样式编排）。这三类能力由 `FramePro.svelte` 提供。
> **包归属**: `@snowui-design-system/components`（OSS，公开）


`Frame.svelte` 是 OSS 组件层的基础容器。它承载所有「单个 Frame 自身就能完成」的运行时能力，供所有 OSS 组件复用。当组件需要让一个 Frame 去**控制另一个 Frame**（启动时机、动效播放、远程改样式）时，使用 `FramePro.svelte`（OSS Frame 的超集）。

> **以下内容供 AI 阅读，用户可忽略。**

---

> ## 完整关键字 API 速查（OSS 子集）
>
> 本文档章节 §1–§5 是**架构与切割原则**。
>
> **OSS Frame 实际支持的全部关键字、参数、示例**见仓库根 [/Frame.md](../../../Frame.md)，章节标题加 `[OSS]` 标签的部分即 OSS 版完整支持的能力：
>
> - **[OSS] §1** 能力开关 (`enableResponsive` / `enableContext` / `enableScaleObserver` / `enableDefaultMotion` / `enableAutoLayout`)
> - **[OSS] 布局模型** + **§1.1 动效时序桥接变量**
> - **[OSS] §2** 基础属性 (含 `stateContent` / `stateClass` / `stateStyle`) + §2.1 尺寸控制
> - **[OSS] §3** 交互与状态 (核心状态、形态、事件、状态驱动内容、原生事件同步)
> - **[OSS] §4** 文本截断（迁移说明）
> - **[OSS] §5** 响应式能力（断点 + Scale）
> - **[OSS] §6** 布局与样式（Direction / 布局稳定性 / Surface Hover 覆写）
> - **[OSS] §7.0–§7.6** 动效能力（默认动效、while* 关键字、事件/形态/响应式驱动、动效参数、滚动联动、共享元素 FLIP）
> - **[OSS] §9** Frame 演进（CSS 行为 / Scope / Access）
>
> **OSS Frame 不支持的关键字（如使用会被静默忽略，需切换到 FramePro）**：
> - `orchestrate*`（§7.7 编排模式）
> - `Click={{target, action}}` / `Hover={{target}}` 等带 `target` 字段的事件触发器（§8 联动控制）
> - `styles={{ "#id": {...} }}`（§10 样式编排）

---

## 1. OSS / PRO 职责切割原则

> **本节是向 Frame 增加新功能时的决策依据**。每次有新功能要加入 Frame 系统时，必须先对照本节判断归属，再决定写入 OSS `Frame.svelte` 还是 PRO `FramePro.svelte`。

### 1.1 设计哲学（v1.0.0 起）

```
OSS Frame = 自包含能力容器（作用半径 = 1 个 Frame）
FramePro  = 跨组件协调器（作用半径 = N 个 Frame，叠加在 OSS Frame 之上）
```

判定标准是**机械的、物理的**：

> **看这个能力的"作用半径"——它是否会修改另一个 Frame 的状态、动效或样式？**
>
> - **不会** → OSS（自包含，效果只在自己这一个 Frame 内）
> - **会** → PRO（跨组件，需要注册表 / 编排器 / ID 寻址）

按这条线，OSS Frame 是一个**功能完整的独立组件容器**——它可以执行 JS 动效、管理交互状态机、做 FLIP 转场、观察自身尺寸、感知可见性。它唯一不做的事情是**伸手到别的 Frame 里去**。

FramePro 在 OSS Frame 之上只增加三类跨组件协调能力：
1. **编排模式**（`orchestrate*`）—— 父 Frame 控制子 Frame 们的动效启动时机
2. **联动控制**（`Click={target, action}`）—— A Frame 的事件触发 B Frame 的 play / reset / pause
3. **样式编排**（`styles={{...}}`）—— 容器通过 ID 寻址跨层修改深层 Target 的样式

### 1.2 OSS Frame 职责清单（✅ 可以做 / ❌ 不应做）

> **判定原则**：作用半径 = 1 个 Frame → ✅ OSS；作用半径 > 1 个 Frame → ❌ PRO

| 职责 | 归属 | 作用半径 | 关联模块 |
|:---|:---:|:---:|:---|
| 收集并归一化 props | ✅ OSS | 1 | `frame-types.ts`、`frame-prop-filter.ts` |
| 应用 CSS class（direction / size / variant / 工具类） | ✅ OSS | 1 | `frame-layout.svelte.ts`、`layout.css` |
| 输出 CSS bridge 变量（动效时序桥接） | ✅ OSS | 1 | `frame-motion-defaults.ts` |
| Skeleton / loading 协议 | ✅ OSS | 1 | `frame-skeleton-runtime.svelte.ts` |
| DOM prop 过滤（aria / data-* / native events） | ✅ OSS | 1 | `frame-dom-runtime.svelte.ts` |
| 静态 size context（setContext） | ✅ OSS | 1 | （无外部观察器，简单 setContext） |
| 断点响应式 class（`enableResponsive`） | ✅ OSS | 1 | `frame-responsive.svelte.ts` |
| CSS 行为工具类（hoverable / field-bordered） | ✅ OSS | 1 | `layout.css` |
| 解析 `while*` props → motion 配置 | ✅ OSS | 1 | `frame-motion-defaults.ts` |
| **JS 动效执行**（Tween / Spring / 缓动函数） | ✅ OSS | 1 | `motion-engine.ts`（迁入）、`frame-motion.svelte.ts`（迁入） |
| **交互状态机**（`currentState` / hovered / pressed / focused） | ✅ OSS | 1 | `frame-state.svelte.ts`（迁入） |
| **状态驱动 class**（`stateClass`） | ✅ OSS | 1 | `frame-class-state.svelte.ts`（迁入） |
| **状态驱动 inline-style**（`stateStyle`） | ✅ OSS | 1 | `frame-inline-style.svelte.ts` 自包含部分（迁入） |
| **状态驱动 Snippet**（`stateContent`） | ✅ OSS | 1 | `Frame.svelte` 模板内（迁入） |
| **父状态声明式消费**（子组件读取父 `currentState` 并切换自身展示） | ✅ OSS | 1 | `frame-state-value.ts`、`Icon.svelte`、`Text.svelte` |
| **FLIP / 共享元素转场**（`layoutId` / `captureFlip` / `playFlipTo`） | ✅ OSS | 1* | `layout-flip.ts`（已在 OSS） |
| **Scale 观察**（`enableScaleObserver`） | ✅ OSS | 1 | `frame-scale-observer.svelte.ts`（迁入） |
| **Scale 解析**（`frame-scale-resolver`，自身比例计算部分） | ✅ OSS | 1 | `frame-scale-resolver.svelte.ts`（迁入自包含部分） |
| **Perception**（可见性感知，自身可见性 → 自身行为） | ✅ OSS | 1 | `frame-perception.svelte.ts`（迁入） |
| **形态过渡 morph** | ✅ OSS | 1 | `morph.ts`（迁入） |
| **滚动联动 `whileScroll`** | ✅ OSS | 1 | `frame-motion.svelte.ts`（迁入） |
| **FrameActions（声明式事件 → 自身状态变更）** | ✅ OSS | 1 | `frame-actions.svelte.ts` 自身向部分（迁入） |
| **Timeline（跨 Frame 时间线编排）** | ❌ PRO | N | `pro/src/logic/timeline.svelte.ts`（保持 PRO） |
| **§7.7 编排模式**（`orchestrate*`：父 → 多个子 Frame 的启动时机） | ❌ PRO | N | `frame-orchestrator.svelte.ts`、`motion-orchestration.ts` |
| **§8 联动控制**（`Click={target, action}`：A Frame → B Frame 的动效） | ❌ PRO | N | `frame-actions.svelte.ts` 跨组件部分 |
| **§10 样式编排**（`styles={{ "#id": {...} }}`：远程改深层 Target） | ❌ PRO | N | `frame-orchestrator.svelte.ts`、`frame-inline-style.svelte.ts` 跨组件部分 |
| **跨组件 motion 编排器**（`motion.svelte.ts`：跨 Frame 时序协调） | ❌ PRO | N | `motion.svelte.ts` 跨组件部分 |

> *FLIP 的 `layoutId` 注册表虽然是模块级共享的，但每个 Frame 仅读取/写入**自己的位置**，不修改其他 Frame 的状态，作用半径仍是 1。

### 1.3 新功能归属判断流程

收到"向 Frame 增加 XX 功能"的需求时，按以下机械流程判断：

```
新功能
  │
  ├─ 它会修改另一个 Frame 的状态、动效或样式吗？
  │
  ├─ 不会（只影响自己） → OSS Frame.svelte + components/src/logic/
  │
  └─ 会（要伸手到别的 Frame）→ FramePro.svelte + pro/src/logic/
        典型信号：
          • 父组件控制多个子组件的启动顺序 / 时机 → §7.7
          • 一个组件的事件去触发另一个组件的动效 → §8
          • 通过 ID 寻址远程修改深层组件的样式 → §10
```

### 1.4 边界案例说明

| 场景 | 正确处置 | 原因（作用半径） |
|:---|:---|:---|
| 新增一个 `whileXxx` 关键字 | OSS：`frame-types.ts` + `frame-motion-defaults.ts` + `motion/while-*.ts` | 影响自身，半径 1 |
| 新增一个需要 JS 驱动的过渡效果 | OSS：`motion-engine.ts` + `frame-motion.svelte.ts` | 影响自身，半径 1 |
| 新增 `stateClass` / `stateStyle` / `stateContent` | OSS：`frame-class-state.svelte.ts` / `frame-inline-style.svelte.ts` 自包含部分 / `Frame.svelte` 模板 | 状态机驱动自身的 class/style/content，半径 1 |
| 新增 FLIP 共享元素转场（`layoutId`） | OSS：`layout-flip.ts` + `frame-motion.svelte.ts` | 每个 Frame 只读写自己的位置，半径 1 |
| 新增基于滚动的动效（`whileScroll`） | OSS：`frame-motion.svelte.ts` + `frame-perception.svelte.ts` | 观察自身位置驱动自身动效，半径 1 |
| 新增 `enableScaleObserver` | OSS：`frame-scale-observer.svelte.ts` | 观察自己的尺寸，半径 1 |
| 新增 `Click="Active"` + `Active={["Idle","auto"]}` 自动回流 | OSS：`frame-state.svelte.ts` | 切换自己的 currentState，半径 1 |
| 新增 `Icon stateIcon` / `Text stateText` 这类父状态声明式消费 | OSS：`frame-state-value.ts` + 对应子组件 | 子组件只读父 Context 并改变自身展示，半径 1 |
| **新增 `orchestrate*`（父控子动效启动时机）** | **PRO**：`frame-orchestrator.svelte.ts` | 父 Frame 修改子 Frame 们的播放时机，半径 N |
| **新增 `Click={{ target: "#chart", action: "play" }}`（事件联动其他组件）** | **PRO**：`frame-actions.svelte.ts` 跨组件部分 | A Frame 的事件触发 B Frame 的动效，半径 ≥ 2 |
| **新增 `styles={{ "#deep_btn": { size: "$#root.width / 10" } }}`** | **PRO**：`frame-orchestrator.svelte.ts` + `frame-inline-style.svelte.ts` | 容器通过 ID 寻址改深层 Target 样式，半径 N |
| 新增响应式断点 | OSS：`frame-responsive.svelte.ts` | 纯 CSS class，半径 1 |
| 新增 loading 态骨架变体 | OSS：`frame-skeleton-runtime.svelte.ts` | 渲染协议，半径 1 |

### 1.5 Tree-shaking 强制要求

由于 OSS Frame 现在承载所有自包含运行时能力（动效引擎、状态机、FLIP、Scale Observer、Perception 等），**必须保证未使用的能力不被打包**。否则纯静态 Frame 用户也要为他们用不到的能力付出 bundle 体积代价。

**实现要求**：

1. **能力模块按需注册**：每个能力模块（`frame-state` / `frame-motion` / `frame-scale-observer` / `frame-perception` / `motion-engine` / `layout-flip`）必须按 props 条件激活——未传入 `while*` / `stateClass` / `enableScaleObserver` / `layoutId` 等触发 props 时，对应模块的副作用代码不应执行，**理想情况下其 import 也应可被 Vite tree-shake 掉**。

2. **避免顶层副作用**：`logic/` 模块禁止在顶层执行带副作用的代码（注册全局监听、创建 Map、setInterval 等），所有运行时状态必须挂在 `$effect` / `$state` 内或通过工厂函数延迟创建。

3. **CI 体积守卫**：仓库根 `scripts/` 必须维护 OSS Frame bundle size 基线（按 props 组合采样），CI 失败阈值上限设为基线 +5%。基线由 `scripts/check-bundle-size.mjs` 在每次 PR 上执行。新增 OSS 能力时同步更新基线（PR 中说明涨幅原因）。

4. **静态导入规则**：`Frame.svelte` 顶部禁止静态 import 重型能力模块（如 `motion-engine`、`frame-orchestrator`），必须通过 `frame-prop-filter.ts` 在运行时按 props 决定是否激活。

### 1.6 切割线变更历史

| 版本 | 切割原则 | 状态 |
|:---|:---|:---|
| v0.x | OSS = 静态信息收集容器 / PRO = 所有运行时动态能力（含状态机、动效执行、FLIP） | 已废弃 |
| **v1.0.0** | **OSS = 自包含能力（半径 1）/ PRO = 跨组件协调（半径 N，限 §7.7 / §8 / §10）** | **当前** |

v1.0.0 的动机：v0.x 把 CodeBlock 这类只是想做"自身状态切换 + 自身 FLIP 全屏转场"的组件强行划到 PRO，导致 PRO 包被自包含组件污染、OSS 组件无法享受 Frame 统一动效。新切割线按"作用半径"这个物理判据划分，让 OSS Frame 成为功能完整的独立容器，PRO 专注其真正的价值：跨组件编排。

---

## 2. 关键依赖（OSS logic）

| 文件 | 职责 |
|:---|:---|
| `../logic/frame-types.ts` | 所有 props 类型定义 |
| `../logic/frame-identity.svelte.ts` | 组件身份与 ID 解析 |
| `../logic/frame-layout.svelte.ts` | 布局 class 拼装 |
| `../logic/frame-responsive.svelte.ts` | 响应式断点 class |
| `../logic/frame-dom-runtime.svelte.ts` | DOM prop 过滤、aria、data-* |
| `../logic/frame-skeleton-runtime.svelte.ts` | Skeleton 渲染协议 |
| `../styles/layout.css` | CSS 行为工具类 |
| `../logic/frame-motion-defaults.ts` | `while*` → `motion/` 动效配置解析 |
| `../logic/frame-prop-filter.ts` | props 分发与按需能力激活（tree-shaking 入口） |
| `../logic/frame-state.svelte.ts` | **状态机**（`currentState` / hovered / pressed / focused / 状态链） |
| `../logic/frame-class-state.svelte.ts` | **`stateClass`** 应用 |
| `../logic/frame-inline-style.svelte.ts`（自包含部分） | **`stateStyle`** 应用 |
| `../logic/frame-state-value.ts` | **父状态值解析**（子组件按最近父 Frame `currentState` 解析自身展示值） |
| `../logic/frame-motion.svelte.ts` | **动效执行调度**（自身动效；不含 `orchestrate*` 与跨组件 target） |
| `../logic/motion-engine.ts` | **JS 动效引擎**（Tween / Spring / 缓动） |
| `../logic/motion-config.ts` | 动效配置类型与默认值（已在 OSS） |
| `../logic/timeline.svelte.ts` | **自身动效时间线** |
| `../logic/morph.ts` | **形态过渡** |
| `../logic/layout-flip.ts` | **FLIP 工具**（已在 OSS） |
| `../logic/frame-scale-observer.svelte.ts` | **Scale 观察**（`enableScaleObserver`） |
| `../logic/frame-scale-resolver.svelte.ts`（自包含部分） | **Scale 解析** |
| `../logic/frame-perception.svelte.ts` | **可见性感知**（自身 → 自身） |
| `../logic/frame-actions.svelte.ts`（自身向部分） | **声明式事件 → 自身状态变更** |

> 标 **粗体** 的模块为 v1.0.0 从 PRO 迁入。`timeline.svelte.ts` 保持 PRO，OSS Frame 不引用（跨 Frame 时间线编排作用半径 = N）。

---

## 3. OSS Frame 关键能力

| 关键字 / 能力 | 说明 |
|:---|:---|
| `enableResponsive` | 响应式断点 class 监听 |
| `enableContext` | 向子组件提供 Frame Context（`currentState` / `interactionState` / loading / skeleton / while* 等）；子组件可只读消费 |
| `enableScaleObserver` | 观察自身尺寸驱动比例响应 |
| `loading` + `skeleton` | Skeleton 协议与加载态渲染 || `tag` / `as` / `class` / `style` / `...rest` | 基础 DOM 与样式透传 |
| `while*` 关键字（解析 + 执行） | 完整 JS 动效引擎执行 whileHover/Active/Appear/... |
| `Click` / `Hover` / `Focus` / 状态链（`Active={["Idle","auto"]}`） | 自身状态机驱动 |
| `stateClass` / `stateStyle` / `stateContent` | 状态驱动 class / inline-style / Snippet 切换 |
| 父状态声明式消费 | `Icon stateIcon` / `Text stateText` 可读取最近父 Frame `currentState` 并切换自身展示 |
| `layoutId` / `itemId` / `captureFlip` / `playFlipTo` | FLIP 共享元素转场（自身） |
| `whileScroll` / `scroll={{ ... }}` | 滚动联动动效 |
| `loopMotion` | 循环动效 |
| `morph` | 形态过渡容器 |
| bridge 变量输出 | `--snowui-frame-*-motion-*` 供组件 CSS 消费 |

> **OSS Frame 不支持的能力**（这些必须用 FramePro）：
> - `orchestrate*` 编排模式（父控子启动时机）
> - `Click={{ target, action }}` 跨组件联动
> - `styles={{ "#id": {...} }}` 跨组件样式编排

---

## 4. 使用建议

- **OSS 组件**（`components/src/components/`）：使用 `import Frame from "./Frame.svelte"`。绝大多数组件都属于此类——只要它的能力是"修改自己"，无论多复杂（状态机、JS 动效、FLIP 转场、Scale 响应），都用 OSS Frame。
- **PRO 组件**（`pro/src/components/`）：使用 `import FramePro from "./FramePro.svelte"`。仅当组件**必须**做以下任一时才属于 PRO：
  1. 父 Frame 编排子 Frame 们的动效启动时机（`orchestrate*`）
  2. 一个 Frame 的事件触发另一个 Frame 的动效（`Click={{ target, action }}`）
  3. 容器通过 ID 寻址跨层修改深层 Target 的样式（`styles={{...}}`）
- **不要在 OSS 组件中直接 import `pro/src/`**。跨包依赖一律走 `@snowui-design-system/components-pro`。
- **新建组件优先尝试 OSS**：除非你已经确定要做跨组件编排，否则默认 OSS。把组件放进 PRO 之前问自己："这个能力会改另一个 Frame 吗？" 不会就留 OSS。
- **子组件消费父状态优先放 OSS**：只要子组件只是读取最近父 Frame 的 `currentState` 并改变自身公开 prop 对应的展示（例如 `Icon.stateIcon`、`Text.stateText`），它仍是半径 1 的自包含能力，不应进入 FramePro。

---

## 5. 关联文件

- OSS 实现：`./Frame.svelte`
- PRO 超集：`../../../pro/src/components/FramePro.svelte`（薄层：仅挂载 §7.7 / §8 / §10 的跨组件协调器）
- PRO 文档：`../../../pro/src/components/FramePro.md`
- 全量关键字 API 速查：`../../../Frame.md`（仓库根，按章节列出所有 `while*` / `state*` / `orchestrate*` 等）
- 组件开发规范：`../../../specs/ComponentGuidelines.md`（含 OSS vs PRO 判断流程 §0.5）
- 切割线变更日志：本文档 §1.6

## 更新日志

- v1.1.0 (2026-06-30): 所有显式 `while*` 对象统一为完整视觉通道声明，仅继承默认时序 / 动力学参数；generic `whileAppear` 默认仅渐显。

- v1.0.0 (2026-05-06): OSS / PRO 切割线重构，OSS Frame 接入自包含状态机、动效执行、FLIP、Scale Observer、Perception 与 stateContent。
