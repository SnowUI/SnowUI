# FlowText 文本流动效

> **版本**: v2.0.0  
> **组件路径**: `pro/src/components/FlowText.svelte`  
> **包归属**: PRO

`FlowText` 使用统一字符重组运行时显示文字、格式化数字、计时器与倒计时。文字和符号变化使用同一套字符出现 / 消失视觉：字符沿趋势纵向移动一整行，位移使用 `900ms` number-flow timing；字符变形从位移开始的同一刻触发，默认 `100ms linear` 到达边缘 scaleY；同时采用 AnimatePresence 的 `450ms ease-out` opacity。数字替换时，通用字符运行时仍负责 diff / 顺序 / 清理；同位置且相同的字符直接复用，例如保留的千分位逗号不会跟随数字滚动。新增或删除的千分位、小数点、百万分位等分隔符会作为普通字符纵向出现 / 消失。FlowText animator 内部临时渲染 NumberFlow 同款 0-9 连续 wheel，让同一位数字沿连续轨道滚到目标数字。

## 关键字

| 关键字 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| `value` | `number \| string` | - | 目标文本或数值 |
| `locales` | `string` | `"en-US"` | 数字格式化区域 |
| `format` | `Intl.NumberFormatOptions` | `undefined` | 数字格式化选项 |
| `trend` | `-1 \| 0 \| 1` | `0` | 数值趋势；`0` 使用公共分类能力自动判断 |
| `motionRole` | `"auto" \| "text" \| "number" \| "timer" \| "countdown"` | `"auto"` | 内容语义定性 |
| `transition` | `{ duration?: number; opacityDuration?: number; deformDuration?: number; stagger?: number; easing?: string; deformEasing?: string }` | `undefined` | 内部演示 / 调试时序；默认使用 number-flow 参考值 |
| `digits` | `Record<number, { max?: number }>` | `undefined` | 分段计时器的 modulo 定义，仅参与公共趋势判断 |
| `textPosition` | `"left" \| "right"` | `"right"` | FlowText 内容相对 `children` 的位置 |
| `rollDirection` | `"normal" \| "reverse"` | `"normal"` | 控制统一字符纵向流动语义；`normal` 使用公共趋势方向，`reverse` 完整取反 |
| `respectMotionPreference` | `boolean` | `false` | 显式开启后遵循系统减少动效设置 |
| `font` / `size` / `weight` / `lineHeight` | - | `undefined` | 统一排版接口 |
| `color` / `align` / `motionColor` | - | `undefined` | 最终颜色、对齐与变化色 |
| `children` | `Snippet` | `undefined` | 文本前后缀内容 |
| `...rest` | `FrameProps` | - | 透传到根 `FramePro` |

## 实现约束

- 内容标准化使用 `text-motion/format.ts`；字符串直出，数字使用 `Intl.NumberFormat`。
- 字符重组、LCP / LCS、自然宽度、区段 FLIP、顺序、清理与颜色生命周期全部使用 `text-motion/character.ts`。
- 数字、文字、计时器、倒计时与 `digits` modulo 分类使用 `text-motion/numeric.ts`。
- FlowText 不维护旧版 Svelte `fly` 数字运行时、私有宽度轨道或第二套清理逻辑；数字替换只允许作为 FlowText animator 内部的临时连续 wheel 视觉。
- 普通文字变化从左到右启动；数字运算按低位到高位、视觉上从右到左启动；固定 stagger 为 `25ms`。
- `rollDirection="normal"` 使用公共趋势；`rollDirection="reverse"` 对公共趋势取反。普通文字没有数字趋势时使用 fallback 趋势 `1`，因此 reverse 对 `motionRole="text"` 同样有效。组件不得公开物理 `up` / `down` 方向枚举。
- 私有 animator 包含一行高度的纵向流动、独立 `scaleY` 变形与 opacity presence；数字替换额外使用临时 0-9 wheel。不得加入水平位移、旋转或模糊。
- 数字运算且新旧变化中段长度相同时，同位置、同字符的节点必须复用并保持静止；格式化分隔符如 `,`、`.`、`:` 不进入数字 wheel。保留的分隔符只参与 FLIP 或保持静止；新增 / 删除的分隔符作为普通字符执行纵向 presence，不得突然出现或消失。
- 数字 wheel 使用连续 `--snowui-flow-text-wheel-v` 轨道，支持快速连续更新时从当前插值位置继续推进到新目标。目标值选择必须按当前视觉方向寻找最近候选，不得因为负数、reverse 或 modulo 变化绕完整周期。
- wheel 轴由 `axisDirection` 与 `axisOffset` 描述：`axisDirection` 控制正向 / 反向排列，`axisOffset` 用来在轴切换后保持当前中心字符不变。正数变负数时只能重排不可见数字，不能改变当前可见 digit。
- 正数 / 负数切换规则：负号作为普通字符进入或退出；数字 wheel 的正负号只影响轴映射，不改变加 / 减趋势。非负数变负数时，动画结束后更新 `previousRawValue`、`axisDirection` 与 `axisOffset`，但不得跳动 `wheel-v` 改写当前显示数字。下一次 `+1` / `-1` 必须只滚一格。
- 计时器 / 倒计时通过 `digits` 或完整时间解析得到 modulo：计时器增加沿同一方向跨 `59 -> 00`，倒计时减少沿同一方向跨 `00 -> 59`。边界处不得反向、卡停或半位停留。
- 纵向字符流与布局 FLIP 均为 `900ms`，使用 `number-flow-main` 的 transform easing；opacity 为 `450ms ease-out`。
- 纵向滚动距离使用继承行盒的 `100%`，但通过 `--snowui-flow-text-roll-overlap: 0.22em` 做负间距 overlap：实际位移为 `100% - overlap`，用来缩小相邻滚动字符的视觉间距。glyph 的 `line-height` 继续继承外部排版，避免动效期间和 restore 后使用不同的垂直参照系。
- 字符变形时机必须与位移开始时机一致，共用同一个 character delay；变形速度由 `transition.deformDuration` 单独控制，默认 `100ms`；变形缓动由 `transition.deformEasing` 单独控制，默认 `linear`。
- 动效字符使用扩展 viewport 作为字符级遮罩窗口：真实字符节点只保留原始占位宽度，不得写入 padding / margin；内部隐藏 source 保宽，viewport 以 `mask-height / mask-width` 向外扩展，glyph 通过同样的 offset 放回真实字符原点后滚动。遮罩的 `linear-gradient` / `radial-gradient` 层、`mask-size`、`mask-position` 与 `NumberFlow.svelte` 的 `.snowui-number-flow-mask` 保持一致；遮罩只在该字符的位移动效启动后显示，位移动画结束或取消后清理。
- `transition` 仅覆盖内部固定时序，主要用于 TextMotion-Demo Slow Mode；默认参考值不得改变。Slow Mode 下 wheel 的 cleanup、mask 清理和 DOM settle 必须等待实际 wheel duration，不能按普通字符 duration 提前清理。
- `motionColor` 与 `900ms` 字符流生命周期一致，之后用公共 `280ms linear` 回落。
- 根节点提供稳定的最终 `aria-label`，内部动画字符对辅助技术隐藏。

## 更新日志

### v2.0.0 (2026-06-16)

- 删除数字和普通字符两套运行时，所有内容统一接入公共字符重组能力。
- 字符出现 / 消失统一复刻 `number-flow-main` 的纵向数位流与 AnimatePresence opacity 视觉。
- `scaleY` 变形从位移开始时立即触发，并新增 `transition.deformDuration` / `transition.deformEasing` 独立控制变形速度与缓动。
- 字符遮罩改为每个动效字符一个临时静止窗口，复用 NumberFlow 的 mask 渐变、宽度与位置；窗口绝对定位，不改变字符占位宽度，静态字符不常驻 mask。
- 滚动距离改为 `100% - 0.22em overlap` 负间距试验方案；遮罩使用不参与布局的扩展 viewport，glyph offset 回真实字符原点，避免窄字符直接承载 NumberFlow mask 时被横向/纵向渐变吃掉。
- 数字、计时器和倒计时保留公共趋势、顺序和 modulo 语义；变化数字由 FlowText animator 临时渲染连续 wheel，复刻 NumberFlow 的 `--wheel-v` 轨道，并使用更强的先快后慢 ease-out 推进。
- TextMotion-Demo Slow Mode 可通过 `transition` 等比放慢 FlowText 的纵向 flow、opacity 与 stagger。
