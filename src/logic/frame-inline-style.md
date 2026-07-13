# frame-inline-style.svelte.ts 文档

> **版本**: v1.0.1
> **类型**: 逻辑模块
> **职责**: 统一拼装 `Frame` 根节点的 `computedStyle`

本模块用于承接 `Frame.svelte` 中体积较大的内联样式组装链，保持 `Frame` 继续作为唯一渲染入口，同时把 `while*`、时序桥接、Scale style vars、Orchestration 暴露变量等统一收敛到单一逻辑层。

## 1. 核心能力

- 解析 `resolveFrameWhileMotionConfigs()` 输出的默认/覆写 `while*`
- 根据当前交互状态与核心状态生成运行中的 motion style
- 输出 `control / border / appear / loop` 时序桥接变量
- 输出 Scale style vars 与 Orchestration 暴露变量
- 统一拼装 `computedStyle`
- 对无动效组件按需省略 motion bridge 与 `transform-origin`，减少冗余 HTML 内联样式

## 2. 输入依赖

| 依赖 | 说明 |
|:---|:---|
| `frameProps` | 当前 `Frame` 已解析 Props |
| `frameState` | 当前交互状态与核心状态 |
| `motion` | 用于判断是否需要输出延迟动效变量 |
| `identity.id` | 用于暴露 `--[id]-*` 编排变量 |
| `effectiveLoading` | 控制加载态 style 与 `whileLoad` |
| `shouldRenderSkeleton` | 控制骨架态透明化样式 |
| `resolvedStateStyle` | 来自 `stateStyle` 的最终样式字符串 |
| `orchestratedStyle` | 样式编排器输出的高优先级样式 |

## 3. 导出接口

| 接口 | 说明 |
|:---|:---|
| `createFrameInlineStyleRuntime()` | 创建内联样式运行时，返回 `computedStyle` getter |

## 4. 关联关系

- **调用方**: [FramePro.svelte](./../components/FramePro.svelte)
- **默认动效**: `frame-motion-defaults.ts`（@snowui-design-system/components）
- **Scale 注入**: [frame-scale-resolver.svelte.ts](./frame-scale-resolver.svelte.ts)
- **工具函数**: `frame-utils.ts`（@snowui-design-system/components）
- **桥接层**: `motion/bridge.ts`（@snowui-design-system/components，路径 `motion/bridge.ts`）

## 更新日志 (Changelog)

### v1.0.1 (2026-03-24)

#### 优化
- `computedStyle` 改为按需输出 `control / border / appear` motion bridge；无相关 motion 配置时不再默认注入 `300ms ease-out`。
- `transform-origin` 改为按需输出；仅在存在 motion / transform / transform-origin 覆写链路时注入。

### v1.0.0 (2026-03-09)

#### 新功能
- 初始版本：从 `Frame.svelte` 抽离 `computedStyle` 主拼装链与 `while*` 时序桥接逻辑。
