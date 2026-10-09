# Motion 目录总览

> **版本**: v1.2.0
> **目录**: `src/motion/`

本目录放的是 Frame 默认动效的**资源文件层**（`while-*.ts`、`bridge.ts`、`rotate.css`、原子动效构建器等），以及 PRO 指定的复杂动效组件。不是 Motion 引擎本身。  
底层编排、时间轴、共享元素转场等基础设施在 [`src/logic/`](../logic/README.md)。

创建新组件或新动效前，必须先读本文件，避免把本该复用的动效能力重复写进组件内部。

---

## 和 `src/logic/` 的分工

| 目录 | 定位 | 例子 |
| :--- | :--- | :--- |
| `src/logic/` | 动效基础设施、状态桥、编排器、默认动效解析 | `motion.svelte.ts`、`frame-motion-defaults.ts`、`timeline.svelte.ts` |
| `src/motion/` | Frame 默认动效资源文件（`while-*.ts`、`bridge.ts`、`rotate.css`、原子动效构建器） | `bridge.ts`、`while-hover.ts`、`primitives.ts` |

简单理解：

- `logic` 解决"什么时候动、怎么编排、默认怎么注入"
- `motion` 是 `logic` 消费的**动效配置资源**（`while-*.ts` / `move.ts`）和**桥接层**（`bridge.ts`），也包含供组件组合使用的原子动效构建器（`primitives.ts`）
- `components/src/components` 是面向用户的**复杂动效组件**

---

## 文件说明

### `bridge.ts`

- 职责：提供 Frame 动效时序桥接变量（`FRAME_CONTROL_MOTION_BRIDGE` / `FRAME_BORDER_MOTION_BRIDGE` / `FRAME_APPEAR_MOTION_BRIDGE` / `FRAME_COLOR_MOTION_BRIDGE` / `FRAME_LOOP_MOTION_BRIDGE`）。
- 被 `frame-inline-style.svelte.ts` 消费，注入 CSS 变量供组件 `transition` 声明使用。

### `primitives.ts`

- 职责：提供可组合的原子动效构建器：
  - `createFadeMotion(opacity, timing?)`
  - `createScaleMotion(scale, timing?)`
  - `createSlideYMotion(y, timing?)`
  - `createStackTranslateMotion(y, timing?)`
  - `composeMotionConfigs(...configs)`
- 归属：OSS。只描述**单个 Frame 自身**的动作与时序，不负责跨 Frame 编排。
- 典型用法：Toast 这类 PRO 组件在使用时传入具体数值，把 `slide + fade`、`stackTranslate + scale + opacity` 组合成完整效果。

### `tokens.ts` / `presets/`

- `tokens.ts` 是动效基础数值单一来源。
- `presets/` 是组件族默认动效 catalog，新增组件默认动效值前必须先查。
- 已转正组件族动效不得在组件内重复写 duration / easing / scale / delay。

### `spring.ts`

- 职责：把 `type: "spring"` 的 stiffness / damping / mass 物理参数采样为 CSS `linear()` timing function。
- Frame CSS lifecycle 与命令式 `motion-engine` 共用同一解析，保留轻微越界与高阻尼停靠，不再退化为固定 cubic-bezier。

### `fade-in.ts` / `scale-in.ts`

- 职责：提供 `fadeIn` 与 `scaleIn` 两个进入类原子动效。
- 原子动效只表达基础能力，具体组件族数值由 `presets/` 决定。
- `whileAppear` fallback 现在引用仅包含 opacity 的 `GENERIC_APPEAR_MOTION`；scale 必须显式声明或由组件族 preset 提供。

### `move.ts`

- 职责：提供通用位移类默认动效预设。
- `slideFromTop / slideFromBottom / slideToTop / slideToBottom` 现在由 `primitives.ts` 中的原子动效组合而成。
- `slideStack` 当前仅保留为“堆叠类过渡的通用时序预设”，不再代表完整的 Toast 叠层效果。

### `while-*.ts`

- 每个文件对应一个 `while*` 关键字的默认动效配置。
- 被 `frame-motion-defaults.ts` 集中 import，通过 `DEFAULT_WHILE_MOTION_MAP` 分发。
- 新增 `whileXxx` 关键字时：先在 `frame-types.ts` 定义类型，再新建 `while-xxx.ts`，最后在 `frame-motion-defaults.ts` 注册。

### `rotate.css`

- 定义 `@keyframes snowui-frame-loop-rotate-clockwise` 全局关键帧。
- 由 `Frame.svelte` 直接 import。

### `FlowText.md`

- 迁移说明，不是实现文件。
- 当前统一使用 `src/components/FlowText.svelte`，兼容层已删除。

---

## 复用建议

### 1. 什么时候修改本目录

- 修改某个 `while*` 关键字的默认动效配置 → 修改对应 `while-*.ts`
- 修改动效时序桥接变量 → 修改 `bridge.ts`
- 需要新增循环关键帧 → 修改 `rotate.css`（或新建对应 css 文件）

### 2. 什么时候不要在这里新增文件

- 如果需求是"状态变化怎么通知动效系统"，应改 `logic/frame-motion.svelte.ts`
- 如果需求是"播放顺序、时间轴、滚动联动、共享元素转场"，应改 `logic/motion*.ts`
- 如果需求是面向用户的复杂动效组件，应放入 `components/src/components/`

### 3. 最常见的重复问题

- 不要再创建 `motion/FlowText.svelte` 一类兼容壳；统一从 `components/` 主实现导入。

---

## 新组件接入建议

如果组件要支持文字序列动效，推荐顺序是：

1. 由调用方提供待编排的元素数组
2. 再用 `logic/motion.svelte.ts` 的 `registerGroup()` 注册
3. 具体顺序、延迟、反向播放交给 Motion 编排器处理

如果组件只是普通的 hover/click/生命周期进入动效，不需要直接依赖本目录，优先复用 `Frame` 的 `while*` 协议与默认动效解析链。显式 `while*` 对象是完整视觉通道声明，只继承默认时序 / 动力学参数。`whileAppear` 是生命周期关键字，不是“出现”原子动效；默认 fallback 由仅渐显的 `GENERIC_APPEAR_MOTION` 提供。组件语义明确时应引用对应组件族 preset。

---

## 更新日志 (Changelog)

### v1.3.0 (2026-06-18)

#### 架构调整
- 新增 `tokens.ts` 与 `presets/` catalog，组件族动效值不再写散到组件或 Frame 默认动效中。
- `whileAppear` fallback 改为引用 `GENERIC_APPEAR_MOTION`。

### v1.2.0 (2026-05-23)

#### 新功能
- 新增 `fade-in.ts` 与 `scale-in.ts` 两个进入类原子动效。
- `whileAppear` 曾从 `replaceIn` 改为 `fadeIn + scaleIn`；自 2026-06-30 起 generic fallback 收敛为仅 fadeIn，scale 改为显式 opt-in。
- 明确原子动效组合为并行播放，组合后的默认持续时间由当时的默认组合统一管理。

### v1.1.0 (2026-05-12)

#### 新功能
- 新增 `primitives.ts`：将 `fade / scale / slide / stackTranslate` 作为 OSS 原子动效构建器纳入 `src/motion/`。
- 明确 `move.ts` 中的 slide 预设由原子动效组合而成。
- 明确跨 Frame 的动效编排仍归 PRO；OSS motion 目录只承载单 Frame 自身可复用的动效资源。
