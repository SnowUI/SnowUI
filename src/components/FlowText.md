# FlowText

> **版本**: v2.0.5
> **职责**: 以流动过渡展示文字和数字变化，适合动态文案、计数、计时与倒计时。
> **包归属**: `@snowui/components-pro`
> **文档修订**: 2026-09-21

## 组件介绍

以流动过渡展示文字和数字变化，适合动态文案、计数、计时与倒计时。

## 使用选择

<!-- usage-guide:start -->
用于文本内容更新时的流动过渡。普通静态文字用 Text；数字专属变化先比较 NumericText 与 NumberFlow。

- value 是目标文本或数值；数值格式用 locales / format，附加内容通过 children 提供。
- motionColor、transition 等控制公开动效；需要遵循系统减少动效偏好时显式启用 respectMotionPreference。
<!-- usage-guide:end -->

## 快速开始

以下示例展示推荐的基本组合。更多场景与组合限制见后文。

<!-- quick-start:generated -->
```svelte
<script lang="ts">
	import { Button } from '@snowui-design-system/components';
	import { FlowText, chromatic } from '@snowui/components-pro';
	const headlines = ['Build with SnowUI', 'Ship components', 'Write better docs'];
	let headlineIndex = $state(0);
</script>

<div style="display: flex; flex-direction: column; align-items: center; gap: var(--gap-4);">
	<FlowText value={headlines[headlineIndex]} motionRole="text" motionColor={chromatic()} size="--text-32" lineHeight="--leading-32" weight={600} />
	<Button onclick={() => headlineIndex = (headlineIndex + 1) % headlines.length}>Next headline</Button>
</div>
```
<!-- /quick-start:generated -->

## API

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| value | `FlowTextValue` | — | 目标文本或数值 |
| locales | `string` | `"en-US"` | 数字格式化区域 |
| format | `Intl.NumberFormatOptions` | — | 数字格式化选项 |
| trend | `FlowTextTrend` | `0` | 数值趋势；`0` 使用公共分类能力自动判断 |
| motionRole | `TextMotionRole` | `"auto"` | 内容语义定性 |
| transition | `FlowTextTransition` | — | 可覆盖时序；默认主动画与布局 550ms，逐位间隔与 NumericText 一致 |
| digits | `Record<number, { max?: number }>` | — | 分段计时器的 modulo 定义，仅参与公共趋势判断 |
| textPosition | `"left" \| "right"` | `"right"` | FlowText 内容相对 `children` 的位置 |
| rollDirection | `FlowTextRollDirection` | `"normal"` | 控制统一字符纵向流动语义；`normal` 使用公共趋势方向，`reverse` 完整取反 |
| loading | `boolean` | — | 加载状态；与 skeleton 同时开启时显示骨架，未设置时遵循容器状态 |
| skeleton | `boolean` | — | 控制骨架显示，未设置时遵循容器骨架状态 |
| renderHints | `RenderHints` | — | 骨架形状与尺寸提示 |
| respectMotionPreference | `boolean` | `false` | 显式开启后遵循系统减少动效设置 |
| font | `string` | — | 字体；未设置时继承容器 |
| size | `string \| number` | — | 字号；未设置时继承容器 |
| weight | `string \| number` | — | 字重；未设置时继承容器 |
| lineHeight | `string \| number` | — | 行高；未设置时继承容器 |
| color | `SnowUIColor \| string` | — | 文字最终颜色；未设置时继承容器 |
| align | `TextMotionAlign` | — | 文字对齐方式 |
| motionColor | `TextMotionColor` | — | 内容变化时全部目标字符的临时颜色，包括保留字符；resolver 的 index / total 对应目标全文的 grapheme 索引与总数，动效结束后回到文字颜色 |
| children | `Snippet` | — | 文本前后缀内容 |

未重新声明的继承能力请查所属基础组件文档；本表只列本组件源码具名公开属性。

## 使用边界与详细说明

具体组合、默认行为与限制见上方使用选择和 API；可运行代码见快速开始。


## AI Zone

以下章节保留源码维护约束，不属于应用接入步骤。

### 实现约束

- 容器尺寸变化后的临时滚轮与遮罩定位复用 OSS `resizeManager`，合帧交付并在卸载时取消监听；浏览器缺少尺寸监听能力时仅关闭这项增强，内容更新与原有字符动效继续工作。
- 动画差值与逻辑终点由 `../lib/text-motion/animation.ts` 分离管理；连续更新保留未结束的位移，旧清理回调不能覆盖最新目标。

- 内容标准化使用 `text-motion/format.ts`；字符串直出，数字使用 `Intl.NumberFormat`。
- 字符重组、LCP / LCS、自然宽度、区段 FLIP、顺序、清理与颜色生命周期全部使用 `text-motion/character.ts`。
- 数字、文字、计时器、倒计时与 `digits` modulo 分类使用 `text-motion/numeric.ts`。
- FlowText 不维护旧版 Svelte `fly` 数字运行时、私有宽度轨道或第二套清理逻辑；数字替换只允许作为 FlowText animator 内部的临时连续 wheel 视觉。
- 普通文字变化从左到右启动；数字运算按低位到高位、视觉上从右到左启动；默认 stagger 与 NumericText 一致，为 `layoutDuration × 0.3 / 非空变化字符数`；显式 `transition.stagger` 优先。
- `rollDirection="normal"` 使用公共趋势；`rollDirection="reverse"` 对公共趋势取反。普通文字没有数字趋势时使用 fallback 趋势 `1`，因此 reverse 对 `motionRole="text"` 同样有效。组件不得公开物理 `up` / `down` 方向枚举。
- 私有 animator 包含一行高度的纵向流动、独立 `scaleY` 变形与 opacity presence；数字替换额外使用临时 0-9 wheel。不得加入水平位移、旋转或模糊。
- 数字运算且新旧变化中段长度相同时，同位置、同字符的节点必须复用并保持静止；格式化分隔符如 `,`、`.`、`:` 不进入数字 wheel。保留的分隔符只参与 FLIP 或保持静止；新增 / 删除的分隔符作为普通字符执行纵向 presence，不得突然出现或消失。
- 数字 wheel 使用连续 `--snowui-flow-text-wheel-v` 轨道，支持快速连续更新时从当前插值位置继续推进到新目标。目标值选择必须按当前视觉方向寻找最近候选，不得因为负数、reverse 或 modulo 变化绕完整周期。
- 零是正负数字轴共有的锚点；从零进入负数时先切换不可见轴，保持中心零的位置。静止时切换 rollDirection 同样只重排不可见轴，连续播放时保留正在运行的轨迹。
- wheel 轴由 `axisDirection` 与 `axisOffset` 描述：`axisDirection` 控制正向 / 反向排列，`axisOffset` 用来在轴切换后保持当前中心字符不变。正数变负数时只能重排不可见数字，不能改变当前可见 digit。
- 正数 / 负数切换规则：负号作为普通字符进入或退出；数字 wheel 的正负号只影响轴映射，不改变加 / 减趋势。非负数变负数时，动画结束后更新 `previousRawValue`、`axisDirection` 与 `axisOffset`，但不得跳动 `wheel-v` 改写当前显示数字。下一次 `+1` / `-1` 必须只滚一格。
- 计时器 / 倒计时通过 `digits` 或完整时间解析得到 modulo：计时器增加沿同一方向跨 `59 -> 00`，倒计时减少沿同一方向跨 `00 -> 59`。边界处不得反向、卡停或半位停留。
- 纵向字符流与布局 FLIP 均为 `550ms`，使用 `number-flow-main` 的 transform easing；opacity 为 `275ms ease-out`。
- 纵向滚动步长为 `1em`，独立于外部行高；数字 wheel 使用 `line-height: 1`、高度 `1em`，通过继承行高的静态占位及半行距补偿保持基线。字符遮罩扩展到实际字体边界之外，不改变文字占位。
- 字符变形时机必须与位移开始时机一致，共用同一个 character delay；变形速度由 `transition.deformDuration` 单独控制，默认 `100ms`；变形缓动由 `transition.deformEasing` 单独控制，默认 `linear`。
- 动效字符使用扩展 viewport 作为字符级遮罩窗口：真实字符节点只保留原始占位宽度，不得写入 padding / margin；内部隐藏 source 保宽，viewport 以 `mask-height / mask-width` 向外扩展，glyph 通过同样的 offset 放回真实字符原点后滚动。遮罩的 `linear-gradient` / `radial-gradient` 层、`mask-size`、`mask-position` 与 `NumberFlow.svelte` 的 `.snowui-number-flow-mask` 保持一致；遮罩只在该字符的位移动效启动后显示，位移动画结束或取消后清理。
- `transition` 仅覆盖内部固定时序，主要用于 TextMotion-Demo Slow Mode；默认主动画和逐位时序与 NumericText 对齐。Slow Mode 下 wheel 的 cleanup、mask 清理和 DOM settle 必须等待实际 wheel duration，不能按普通字符 duration 提前清理。
- `motionColor` 在内容变化时覆盖全部目标字符：如 `ab → ac`，`a` 保持静止但与 `c` 一样着色。全部目标字符按全文索引从左到右参与同一颜色回落序列；保留前后缀与数字分隔符也占有对应顺序。颜色顺序不跟随数字、计时器或倒计时的位移方向。颜色使用目标全文计算默认 stagger，显式 `transition.stagger` 优先；维持主动画时长与各自 delay 后，用公共 `280ms linear` 回落。位移继续只按变化字符编排。未传颜色、内容未变或启用的减少动效偏好生效时不播放颜色动效。
- 根节点提供稳定的最终 `aria-label`，内部动画字符对辅助技术隐藏。




> **组件路径**: `pro/src/components/FlowText.svelte`


`FlowText` 以流动动效展示文字和数字的变化，适用于动态文案、计数、计时与倒计时。

## 更新日志

- 2026-09-21：统一使用文档、源码属性表与 Site / LLM 阅读入口；仅文档修订，不改变组件行为。

### v2.0.5 (2026-09-12)

- 临时字符遮罩的尺寸监听改接共享管理器，避免组件单独创建原生 Observer；保持字符动效和遮罩几何规则。

### v2.0.4 (2026-09-09)

- 内容变化时保留字符也播放颜色动效；逐字符颜色与回落时序均按目标全文分布，保留前后缀不再提前一起褪色，不改变字符位移规则。

### v2.0.3 (2026-09-09)

- 修复滚轮首次初始化遗漏定位导致数字横向排开、被裁切后消失的问题；仅当前数字参与单字占位，其余数字绝对定位在同一滚轮内。
- 增加真实 Demo 录屏操作回归，同时验证数位可见范围和单字占位宽度。

### v2.0.2 (2026-09-08)

- 默认主动画缩短至 550ms，逐位时序与 NumericText 一致；演示页正常速度直接使用组件默认值。
- 修复从零进入负数、静止后切换方向时沿用旧数字轴的问题；加减一不再绕行九格。
- 同步 TextMotion-Demo 输入值处理，手动输入后加减按钮继续执行数值计算。

### v2.0.1 (2026-09-08)

- 数字滚轮和文字进退场支持连续重定向；保留当前轨迹与方向，批量测量遮罩并取消逐位轮询。

### v2.0.0 (2026-06-16)

- 删除数字和普通字符两套运行时，所有内容统一接入公共字符重组能力。
- 字符出现 / 消失统一复刻 `number-flow-main` 的纵向数位流与 AnimatePresence opacity 视觉。
- `scaleY` 变形从位移开始时立即触发，并新增 `transition.deformDuration` / `transition.deformEasing` 独立控制变形速度与缓动。
- 字符遮罩改为每个动效字符一个临时静止窗口，复用 NumberFlow 的 mask 渐变、宽度与位置；窗口绝对定位，不改变字符占位宽度，静态字符不常驻 mask。
- 滚动距离改为 `100% - 0.22em overlap` 负间距试验方案；遮罩使用不参与布局的扩展 viewport，glyph offset 回真实字符原点，避免窄字符直接承载 NumberFlow mask 时被横向/纵向渐变吃掉。
- 数字、计时器和倒计时保留公共趋势、顺序和 modulo 语义；变化数字由 FlowText animator 临时渲染连续 wheel，复刻 NumberFlow 的 `--wheel-v` 轨道，并使用更强的先快后慢 ease-out 推进。
- TextMotion-Demo Slow Mode 可通过 `transition` 等比放慢 FlowText 的纵向 flow、opacity 与 stagger。
