# NumberFlow

> **许可阅读**：首次阅读组件文档、源码或 npm 使用流程，先读完整 [LICENSE](../../LICENSE)；同任务同版本去重。公开 API 配置与内部实现修改分别按许可处理；全部组件使用统一运行包，源码权益以许可为准。

> **版本**: v2.1.0
> **职责**: 以逐位滚动和宽度过渡展示数字变化，保留金额、分组符与小数格式，适合计数器和实时指标。
> **包归属**: `@snowui-design-system/components`
> **文档修订**: 2026-09-21

## 组件介绍

以逐位滚动和宽度过渡展示数字变化，保留金额、分组符与小数格式，适合计数器和实时指标。

## 使用选择

<!-- usage-guide:start -->
用于数字滚动效果。需要不同数字过渡时比较 NumericText；普通静态数值用 Text，不额外启动动效。

- value 表示数值，无法解析的字符串显示为 0；locales / format 控制数字格式。
- children 放置前后附加内容；需要遵循系统减少动效偏好时显式启用 respectMotionPreference。
<!-- usage-guide:end -->

## 快速开始

以下示例展示推荐的基本组合。更多场景与组合限制见后文。

<!-- quick-start:generated -->
```svelte
<script lang="ts">
	import { Button, Text } from '@snowui-design-system/components';
	import { NumberFlow, chromatic } from '@snowui-design-system/components';
	let count = $state(0);
</script>

<div style="display: flex; flex-direction: column; align-items: center; gap: var(--gap-4);">
	<NumberFlow value={count} format={{ useGrouping: true }} motionRole="number" motionColor={chromatic()} size="--text-48" lineHeight="--leading-48" weight={600} />
	<div style="display: flex; align-items: center; gap: var(--gap-2);">
		<Button aria-label="Decrease installs" onclick={() => count -= 128}>−128</Button>
		<Button aria-label="Increase installs" onclick={() => count += 128}>+128</Button>
		<Button onclick={() => count = 0}>Reset</Button>
	</div>
</div>
```
<!-- /quick-start:generated -->

## API

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| value | `number \| string` | — | 当前数值；无法解析的字符串按 `0` 处理 |
| locales | `string` | `"en-US"` | 传给 `Intl.NumberFormat` 的 locale |
| format | `Intl.NumberFormatOptions` | `{}` | 数字格式化选项 |
| trend | `TrendResolver` | `0` | 明确变化趋势；`0` 时根据前后数值解析 |
| motionRole | `TextMotionRole` | `"auto"` | 数值趋势的语义角色 |
| transition | `NumberFlowTransition` | — | 覆盖滚轮时长 |
| digits | `Record<number, { max?: number }>` | — | 为指定数位声明循环上限，例如时间的十位 |
| numberPosition | `"left" \| "right"` | `"right"` | `children` 相对数字的位置 |
| rollDirection | `RollDirection` | `"normal"` | 正常或反向解释趋势方向 |
| loading | `boolean` | — | 显示按当前文本宽度推导的 Skeleton |
| skeleton | `boolean` | — | 接入 Skeleton Context |
| renderHints | `RenderHints` | — | 覆盖 Skeleton 形状与尺寸提示 |
| respectMotionPreference | `boolean` | `false` | 为 `true` 时遵守 reduced-motion 并立即提交最终数值 |
| font | `string` | — | 数字字体；未传时继承容器字体 |
| size | `string \| number` | — | 数字字号；数字转换为 `px`，字符串可使用 SnowUI token 或 CSS 值 |
| weight | `string \| number` | — | 数字字重；未传时继承容器字重 |
| lineHeight | `string \| number` | — | 根排版行高；内部滚轮仍使用独立 `1em` 裁切窗口 |
| color | `SnowUIColor \| string` | — | 最终文字颜色，未设置时继承容器 |
| align | `TextMotionAlign` | — | 数字内部对齐 |
| motionColor | `TextMotionColor` | — | 全部目标字符从左到右依次回落的临时颜色；`chromatic()` 将完整彩谱连续铺满全部数位，包含保留数位、分隔符及格式化货币符号，不影响 children 附加内容 |
| children | `Snippet` | — | 数字左侧或右侧的附加内容 |

未重新声明的继承能力请查所属基础组件文档；本表只列本组件源码具名公开属性。

## 使用边界与详细说明

<a id="概览与选择边界"></a>

### 概览与选择边界

NumberFlow 适合计数器、金额、指标和时钟等连续数值。它以 `Intl.NumberFormat` 拆分数字，保留符号、分组符和小数，并按数位执行滚轮变化。只需要静态数字时使用 Text；需要字符级重组或非滚轮文字动效时使用 NumericText、SlotText 或 FlowText。

<a id="原始实现与-snowui-扩展"></a>

### Import

```ts
import { NumberFlow } from "@snowui-design-system/components";
```

<a id="示例"></a>

### 示例

```svelte
<NumberFlow
    value={12840}
    locales="en-US"
    format={{ maximumFractionDigits: 0 }}
    rollDirection="normal"
/>
```

带前缀时通过 `numberPosition` 决定数字位置：

```svelte
<NumberFlow value={99.5} numberPosition="right">
    <Text>$</Text>
</NumberFlow>
```

<a id="无障碍与组合边界"></a>

### 无障碍与组合边界

- 最终格式化文本保留在真实 DOM 中；NumberFlow 不替代业务侧对指标含义的可访问名称。
- `respectMotionPreference={true}` 时 reduced-motion 关闭滚轮、位移和等待，直接显示最终值。
- 不支持 CSS 自定义属性注册的浏览器退化为无连续滚轮插值的数值更新，核心文本与格式化结果保持可用。
- `children` 只表达附加内容；数值拆分、趋势、滚轮轨道和宽度测量由 NumberFlow 拥有。

---


## AI Zone

以下章节保留源码维护约束，不属于应用接入步骤。

### 原始实现与 SnowUI 扩展

SnowUI NumberFlow 以 Maxwell Barvian 的 MIT 开源项目 [Number Flow](https://github.com/barvian/number-flow) 为原始实现参考，原始 API、示例和使用限制见 [Number Flow 官方文档](https://number-flow.barvian.me/)。当前对照版本为 core `number-flow@0.6.2` 与 Svelte wrapper `@number-flow/svelte@0.4.2`。

SnowUI 在原始逐位滚轮、`Intl.NumberFormat` parts、趋势方向和进退场架构上增加：

- Frame 根宿主、SnowUI 排版 / 语义颜色、Skeleton 与 RenderHints；
- `motionRole`、`rollDirection`、低位到高位交错，以及时间 / 倒计时的循环数位；
- `motionColor` 全文颜色序列；`chromatic()` 把完整彩谱连续铺满一位、三位或更多数位，并用独立覆盖层保证颜色不改变原始滚轮；
- `children` 与 `numberPosition`，以及同帧更新、连续中断时的布局和宽度重定向。

SnowUI 没有原样公开上游的 `plugins`、`NumberFlowGroup`、CSS parts / Shadow DOM、`prefix` / `suffix`、`willChange`、`animated`、事件和分离的 spin / transform / opacity timing。需要这些原始接口时直接使用上游包；SnowUI 只承诺本文 API。

<a id="import"></a>



<a id="ai-zone"></a>

### AI Zone

### 模块与所有权

- `NumberFlow.svelte`：公开 Props、Intl parts、逐位轨道、位数进退场、宽度测量与 Skeleton。
- `../lib/text-motion/numeric.ts`：数值提取、趋势、时间角色和循环数位的共享算法。
- `../lib/text-motion/color.ts`、`typography.ts`、`preference.ts`：变化色、排版桥接和 reduced-motion 判断。
- `Frame.svelte`：公开根宿主、外层状态和 Frame 能力。

### 输出协议

- 负号的进场和退场与本次数值更新同时启动，delay 为 `0`；不参加数位的低位到高位错峰。负号沿数字滚动方向垂直进退场，步长为 `1em`，时长和缓动与数字滚轮一致；垂直位移同样采用增量叠加，中断后从当前轨迹接续。
- 连续输入使用可中断动画重定向（interruptible / retargetable animation）：滚轮、数位的 FLIP 横移与宽度采用增量叠加（additive animation），保留正在运行的残余位移，新指令仅叠加目标差值；不能重复冻结已有轨道、重置缓动起点或用快速模式突然缩短布局时长。已完成的增量及时释放；销毁与减少动效时取消全部残余，直接落到最新值。

- `chromatic()` 不把 wheel viewport、滚轮轨道或布局节点设为透明。每个数字 / 符号拥有一个不参与布局的伪元素覆盖层，完整色相按全文字符切片后绘制到覆盖层；彩色阶段暂时抑制真实字形的填充，由这一层直接把五个色标过渡到最终文字色，再无缝交回真实字形。整个过程只有一个可见字形绘制层，避免彩色边缘与底层黑字的抗锯齿像素叠加成黑边。

- 同一帧内的多次更新共用第一次更新前的布局快照，按最后一次 DOM 布局执行一次补偿；快照消费后立即清除，不能重复补偿或把未补偿的中间位置当成起点。
- 宽度与数位布局共用一个可取消的帧任务，先集中测量，再写入位置和启动动效。宽度保留小数像素且不包含根 Frame 的外层缩放；ResizeObserver 保持稳定订阅，进退场事件不重复测量最终文本。
- 宽度补偿变量不向后代继承，避免每帧让全部数字重算无关样式。格式器只随 locale / format 更新；数字轴仅在正负轴实际变化时重排。

- 数字 presence 参考 Number Flow：新增数位从 `0` 滚到目标、删除数位从当前可见轨道滚回 `0`，同时在滚轮时长的前半段渐显 / 渐隐。负号叠加沿滚动方向的垂直进退场，其他符号仅渐显 / 渐隐和水平布局过渡；符号不做数字滚轮。退出节点保留至完整滚轮结束；重新出现时从当前轨道接管。此为 NumberFlow 私有视觉，不新增公开参数。
- 以上进退场继续遵守 SnowUI 的数值趋势和 `rollDirection`：normal 增加上滚、减少下滚，reverse 完整反转；正负数的数字轴调整不能改变这一语义。

- 正负数切换时，等待与滚动中的数字保持当前轨道方向；完成后再同步新符号对应的轨道，不能在启动前显示另一组数字。中断回到当前可见目标时，不强制绕行一整圈。

- 数位滚动、进场和退场统一从低位到高位启动；时间差复用 NumericText 的共享计算：动效时长 × 0.3 / 当前序列非空格字符数。退场保留退出序列的顺序和数量，以更新前统一采样的坐标作为退场起点，再和保留的个位同步水平归位，保持数位间距；不能因逐位脱离布局先横向跳位或在收缩中互相重叠；快速连续更新仍保留时间差，减少动效模式下为 0。

- 排版默认继承容器，基线与同字体、字号的普通文字对齐；滚动层和裁切边界遵循 [TextMotionSpec §2](../../../docs/standards/TextMotionSpec.md#2-统一排版与颜色)。

- 根 class 为 `.snowui-number-flow`；内部 parts、digit 和 wheel class 是私有实现。
- `value` 是单一数据源；格式化文本、趋势、滚轮目标和 Skeleton 宽度都从它派生。
- `digits` 只定义数位循环长度，不改变最终 `Intl.NumberFormat` 文本。

### 关联关系

- 主布局登记为内禀原子布局；组合模式登记为数字动效原子。
- 与 NumericText、SlotText、FlowText 共用 text-motion 数值与排版能力，但保留自己的滚轮视觉时间线。

## 更新日志

- 2026-09-21：统一使用文档、源码属性表与 Site / LLM 阅读入口；仅文档修订，不改变组件行为。

### v2.1.0 (2026-09-17)

- 重新对照 `number-flow@0.6.2` 的旧布局测量、节点更新和动画启动顺序，保留 SnowUI 的连续更新与交错能力。
- `chromatic()` 改为单一可见覆盖层：一位、三位或十位数字都覆盖完整彩谱，并直接过渡到最终文字色；不再通过透明 wheel viewport 绘制，也不会让黑色底字在彩色边缘形成黑边。
- 文档补充原始代码仓库、官方文档、MIT 归属、SnowUI 扩展能力和未公开的上游接口边界。

### v2.0.1 (2026-09-09)

- `motionColor` 覆盖所有目标字符，保留字符和格式符号也参加统一的逐字颜色回落序列，并支持 `chromatic()`。颜色主时长固定为与 FlowText 默认值一致的 `550ms`，再以公共 `280ms linear` 回落；数字滚轮仍保留自身 `transition.duration`。完整时序遵循 [TextMotionSpec §2.1](../../../docs/standards/TextMotionSpec.md#21-motioncolor)。
- 字符变化效果保持原有规则；未设置颜色、关闭动画（适用时）或减少动效生效时显示最终原色。连续更新重新编排颜色序列，卸载清理颜色动画。


### v2.0.0

- 使用 Frame 承载公开根，支持格式化、趋势、循环数位、前后附加内容、宽度过渡、Skeleton 和 reduced-motion 退化。
