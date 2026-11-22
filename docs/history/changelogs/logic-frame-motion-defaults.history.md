# frame-motion-defaults 更新日志归档

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
