# frame-motion-defaults.ts 文档

> **版本**: v1.8.0
> **职责**: 统一管理 Frame 默认动效注册表，并按关键字解析 `while*` 默认配置。

`frame-motion-defaults.ts` 是 Frame 默认动效入口，负责：

- 维护默认动效注册表（replace/disappear/morph/move/rotate/flip/number/slide）
- 按 `FrameProps` 判定哪些 `while*` 需要默认注入
- 合并用户传入的 `while*` 覆写配置
- 作为 OSS 动效原子与默认预设之间的统一汇聚点

它不负责组件内部专项动画算法。Frame 默认动效的边界是为组件根 Frame 提供统一、简单的状态 / 生命周期动效与组件级控制；已有独立规范和共享实现的专项通用能力可以自行实现内部动画，无需接入本注册表。

---

## 导出 API

| 名称 | 类型 | 说明 |
| :--- | :--- | :--- |
| `FrameWhileMotionKey` | `type` | 支持的 `while*` 关键字联合类型 |
| `FrameMotionDefaultsRegistry` | `interface` | 默认动效注册表结构 |
| `FRAME_MOTION_DEFAULTS` | `const` | 默认动效总表（含 `numberComponent`） |
| `resolveFrameWhileMotionConfig` | `function` | 解析单个 `while*` 最终配置 |
| `resolveFrameWhileMotionConfigs` | `function` | 批量解析全部 `while*` 配置 |

---

## 解析规则

### 0. `while*` 是动效通道集合

所有 `while*` 使用统一语义：

- `true` 使用该关键字完整默认动效。
- `false` 关闭该关键字动效。
- 显式对象是完整视觉通道声明，只执行对象中出现的 `opacity / scale / x / y / rotate / rotateY / blur / width / height / backgroundColor / color` 等视觉通道。
- 显式对象不会从默认配置补入未声明视觉通道或 `component` 视觉载体；只继承 `delay / duration / easing` 与 spring 动力学参数，且用户值优先。
- 未显式传对象、由状态链或触发器自动注入时，继续使用完整默认动效。

### 1. 默认启用规则

`enableDefaultMotion` 默认为 `true`；当关键字被“使用”时，自动注入默认动效。设为 `false` 时停止自动注入，但显式传入的 `while*` 配置仍然有效。常见触发来源：

- 事件触发器：`Click` / `Hover` / `Focus` / `Drag` / `Scroll` / `Key`
- 状态链：`StartLoad` / `Load` / `Reload` / `Active` / `Disabled` / `Validating` / `Uploading` / `Editing`（含 `Idle -> Active/Disabled` 自动链路）
- 显式传入 `while*`

#### `whileActive` 差异驱动规则（v1.3.0）

当 `whileActive` 由默认系统注入时，会优先根据 `stateStyle` 中 `Idle -> Active` 的属性变化自动选择动效：

- `opacity` 变化：触发透明度进出兼容预设（当前仍使用 `replaceIn` / `replaceOut` 以保持既有状态差异视觉）
- 布局尺寸变化（`width/height/min/max/padding/margin/gap/border-radius`）：触发 `morph`
- `transform: translateX/Y` 变化：触发 `move`（按方向映射 left/right/down）
- 旋转变化（`transform: rotate` 或 `rotate` 属性）：触发 `rotateClockwise`
- 翻转变化（`transform: rotateY` 或 `rotateY/rotate-y` 属性）：触发 `flip`

若未命中以上精确规则，但 `Idle -> Active` 仍存在任意样式差异，则兜底注入 `morph`，避免组件样式直接跳变。

### 2. 合并优先级

`mergeMotionConfig(defaultConfig, userValue)`：

- `userValue === false`: 关闭该关键字默认动效（返回 `undefined`）
- `userValue === true`: 使用默认动效
- `userValue` 为对象: 只从默认值继承时序 / 动力学参数，再合并用户完整通道声明
- 其他: 返回默认值

---

## 默认动效来源

默认动效文件位于 `../motion/*.ts`，由 `FRAME_MOTION_DEFAULTS` 统一暴露：

- `replaceIn` / `replaceOut`
- `disappear`
- `morph`
- `move` / `moveRight` / `moveLeft` / `moveDown`
- `slideFromTop` / `slideFromBottom` / `slideToTop` / `slideToBottom` / `slideStack`
- `rotateClockwise` / `flip`
- `number` / `numberComponent`（默认数字变化动效：`FlowText`）

### 与组件内部专项动效的组合关系

- 默认注册表只控制组件根 Frame，不定义字符、字形、数位、图表绘制等内部算法。
- 专项通用能力可以不消费 `FRAME_MOTION_DEFAULTS`、bridge 时序或 `while*`，并自行选择 WAAPI、`requestAnimationFrame`、Svelte transition 等实现。
- 专项组件仍须保留 Frame 根与 Frame Props，使默认动效、显式 `while*` 和父级编排能够作用于组件整体。例如父级统一让子级渐隐时，内部正在滚动字符的文字动效组件也应整体渐隐。
- 外层 Frame 动效与内部专项动效可以并行运行；前者控制组件整体，后者控制内容细节，双方不得覆盖彼此职责。
- `enableDefaultMotion={false}` 只影响自动默认注入，不停止组件内部专项动效，也不阻断显式 `while*`。

文字动效的具体约束见 [`TextMotionSpec.md §5.1`](../../../specs/TextMotionSpec.md)。

### 原子动效与预设的关系（v1.4.0）

自 `v1.4.0` 起，OSS `src/motion/` 明确分为两层：

| 层级 | 文件 | 职责 |
| :--- | :--- | :--- |
| 原子动效 | `primitives.ts` | 描述单个 Frame 自身的基础动作：`fade / scale / slide / stackTranslate` |
| 默认预设 | `move.ts`、`replace.ts`、`while-*.ts` 等 | 把原子动效组合成可直接复用的默认效果 |

这意味着：

- `FRAME_MOTION_DEFAULTS` 继续暴露的是**默认预设**，不是所有原子动效本身。
- 若组件需要自定义数值组合，应直接消费 `primitives.ts` 或自定义 `while*`，而不是强迫默认注册表承担队列/编排语义。
- 多个 Frame 之间的时机协调仍属于 PRO，不进入 `frame-motion-defaults.ts`。

#### `whileAppear` 默认 preset（v1.7.0）

`whileAppear` 是生命周期进入关键字，不再把组件族数值私有写在 Frame 默认动效中。默认 fallback 引用 `GENERIC_APPEAR_MOTION`，具体数值来自 `components/src/motion/tokens.ts` 与 `components/src/motion/presets/generic.ts`。

`GENERIC_APPEAR_MOTION` 默认视觉仅包含 `opacity`。需要缩放进入时必须显式声明 `scale`，或使用 Dropdown、Tooltip、Dialog、Replacement 等含 scale 的组件族 preset。

Frame 默认动效只作为 generic fallback。Popover、Listbox、Tooltip、Dialog、CodeBlock 等组件语义明确时，应显式引用对应组件族 preset，不直接消费 Frame fallback。

组件族 preset 选择规则见 [`MotionPresetSpec.md`](../../../specs/MotionPresetSpec.md) 与 [`presets/README.md`](../motion/presets/README.md)。

`while*` 默认映射位于 `../motion/while-*.ts`，每个关键字对应一个独立文件：

- `while-load.ts`
- `while-reload.ts`
- `while-appear.ts`
- `while-disappear.ts`
- `while-idle.ts`
- `while-active.ts`
- `while-disabled.ts`
- `while-click.ts`
- `while-drag.ts`
- `while-hover.ts`
- `while-focus.ts`
- `while-key.ts`
- `while-scroll.ts`
- `while-validating.ts`
- `while-uploading.ts`
- `while-editing.ts`
- `while-collapsed.ts`
- `while-expanded.ts`
- `while-xs.ts`
- `while-sm.ts`
- `while-md.ts`
- `while-lg.ts`
- `while-xl.ts`
- `while-2xl.ts`

### 默认值策略（当前）

- 状态/生命周期关键字默认有可见动效（如 `whileLoad` / `whileReload` / `whileAppear` / `whileDisappear` / `whileActive`）。
- 交互触发关键字默认无视觉效果：`whileHover` / `whileClick` / `whileFocus` / `whileDrag` / `whileKey`。
- 页面可按需覆写或关闭默认动效。

---

## 使用示例

```svelte
<Frame Click="Load" Load={["Active", "auto"]}>
    {#snippet children({ motionDefaults })}
        <Frame whileAppear={true} />
    {/snippet}
</Frame>
```

---

## 更新日志 (Changelog)

### v1.8.0 (2026-06-30)

#### 语义调整
- 所有显式 `while*` 对象改为完整视觉通道声明，不再混入默认视觉通道。
- 默认时序 / spring 动力学参数仍可继承。
- `whileAppear` generic fallback 改为仅 opacity；scale 改为显式 opt-in。

### v1.7.0 (2026-06-18)

#### 架构调整
- `whileAppear` / `whileDisappear` 默认动效改为引用 generic motion preset。
- 组件族动效值迁移到 `motion/tokens.ts` 与 `motion/presets/`。

### v1.6.0 (2026-06-14)

#### 文档更新
- 明确 Frame 默认动效只负责组件级外层动效与控制；已转正的专项通用能力可独立实现内部动画，并与根 Frame 动效及父级编排组合。

### v1.5.0 (2026-05-23)

#### 架构调整
- `whileAppear` 默认动效从复用 `REPLACE_IN_MOTION` 改为组合 `FADE_IN_MOTION + SCALE_IN_MOTION`。
- 新增持续时间约束：进入类原子动效默认时长由当时的默认组合统一管理，组合后不叠加。
- `REPLACE_IN_MOTION` 保留为同位替换预设，不再作为生命周期进入默认来源。

### v1.4.0 (2026-05-12)

#### 文档更新
- 明确 `src/motion/` 已分为“原子动效构建器 + 默认预设”两层。
- 明确 `FRAME_MOTION_DEFAULTS` 只暴露默认预设，不承担跨 Frame 编排语义。
- 记录 slide 预设与 `primitives.ts` 的组合关系。

### v1.3.5 (2026-03-03)

#### 修复
- 修复 `calc(var(...))` 差异比较误判：不再用“首个数字”直接比较复杂表达式，避免把变量名中的数字（如 `--size-4`）当成终值，导致 `whileActive -> morph` 漏触发。

### v1.3.4 (2026-03-03)

#### 修复
- `whileActive -> morph` 新增尺寸比推导：基于 `Idle/Active` 的尺寸差异自动计算 `scale` 起点，组件在尺寸变量跳变时也能由 Frame 默认动效平滑过渡。
- morph 识别新增自定义尺寸变量键匹配（`--*size/width/height/padding/margin/gap/radius*`），无需在各组件内单独声明 morph 过渡。

### v1.3.3 (2026-03-03)

#### 修复
- `whileActive` 差异推断新增兜底策略：只要 `Idle -> Active` 存在任意样式差异，默认注入 `morph`。
- 形态变化识别补充 `inline-size / block-size / flex-basis`，提升复杂组件（非纯 width/height 写法）的命中率。

### v1.3.2 (2026-03-03)

#### 修复
- 扩展 `whileActive` 形态变化识别：由仅 `width/height` 扩展为布局尺寸/间距属性（`min/max/padding/margin/gap/border-radius`）变化也可触发 `morph`。
- 扩展旋转/翻转/位移识别：除 `transform` 字符串外，新增支持 `rotate`、`rotateY/rotate-y`、`translateX/translateY/translate-x/translate-y` 等独立属性写法。

### v1.3.1 (2026-03-03)

#### 修复
- `whileActive` 默认注入条件新增支持 `Idle={["Active","auto"]}` 自动链路。
- `whileDisabled` 默认注入条件新增支持 `Idle={["Disabled","auto"]}` 自动链路。
- 结果：不依赖 `Click/Active/Disabled` 显式关键字时，Button/Icon 等组件也可通过 Idle 自动链路触发默认动效。

### v1.3.0 (2026-03-03)

#### 新功能
- 为 `whileActive` 新增 `stateStyle` 差异驱动的默认动效匹配：
  - 透明度 -> 出现/消失
  - 宽高 -> morph
  - 位移 -> move
  - 旋转 -> rotate
  - 翻转 -> flip
- `whileActive` 默认动效改为“命中规则才注入”，未命中则不注入可见动效。

### v1.2.0 (2026-02-28)

#### 架构重构
- 将 `DEFAULT_WHILE_MOTION_MAP` 的每个 `while*` 默认值拆分到 `../motion/while-*.ts` 独立文件。

#### 文档更新
- 新增 `while*` 默认映射文件清单。

### v1.1.0 (2026-02-27)

#### 新功能
- 注册表新增 `moveRight/moveLeft/moveDown/rotateClockwise/flip`。
- 默认 `whileReload` 改为统一复用 `rotateClockwise`。

#### 文档更新
- 同步默认策略为“状态默认可见、交互默认无效果”。

### v1.0.3 (2026-02-26)

#### 调整
- 将剩余默认动效（包括状态/生命周期/响应式相关 `while*`）统一改为无视觉效果（空配置）。
