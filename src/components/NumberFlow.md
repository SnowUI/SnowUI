# NumberFlow

> **版本**: v2.0.1
> **职责**: 展示持续变化的格式化数字，并以逐位滚轮、位数重排和容器宽度过渡表达数值变化。
> **包归属**: `@snowui/components-pro`

## 概览与选择边界

NumberFlow 适合计数器、金额、指标和时钟等连续数值。它以 `Intl.NumberFormat` 拆分数字，保留符号、分组符和小数，并按数位执行滚轮变化。只需要静态数字时使用 Text；需要字符级重组或非滚轮文字动效时使用 NumericText、SlotText 或 FlowText。

## Import

```ts
import { NumberFlow } from "@snowui/components-pro";
```

## API

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `value` | `number \| string` | — | 当前数值；无法解析的字符串按 `0` 处理 |
| `locales` | `string` | `"en-US"` | 传给 `Intl.NumberFormat` 的 locale |
| `format` | `Intl.NumberFormatOptions` | `{}` | 数字格式化选项 |
| `trend` | `-1 \| 0 \| 1` | `0` | 明确变化趋势；`0` 时根据前后数值解析 |
| `motionRole` | `"auto" \| "text" \| "number" \| "timer" \| "countdown"` | `"auto"` | 数值趋势的语义角色 |
| `transition` | `{ duration?: number }` | — | 覆盖滚轮时长 |
| `digits` | `Record<number, { max?: number }>` | — | 为指定数位声明循环上限，例如时间的十位 |
| `numberPosition` | `"left" \| "right"` | `"right"` | `children` 相对数字的位置 |
| `rollDirection` | `"normal" \| "reverse"` | `"normal"` | 正常或反向解释趋势方向 |
| `loading` | `boolean` | — | 显示按当前文本宽度推导的 Skeleton |
| `skeleton` | `boolean` | `false` | 接入 Skeleton Context |
| `renderHints` | `RenderHints` | — | 覆盖 Skeleton 形状与尺寸提示 |
| `respectMotionPreference` | `boolean` | `false` | 为 `true` 时遵守 reduced-motion 并立即提交最终数值 |
| `font` / `size` / `weight` / `lineHeight` | `string \| number` | — | 数字排版输入 |
| `color` | `SnowUIColor \| string` | `undefined` | 最终文字颜色，未设置时继承容器 |
| `motionColor` | `SnowUIColor \| string` | `undefined` | 全部目标字符从低位到高位依次回落的临时颜色，包含保留数位、分隔符及格式化货币符号，不影响 children 附加内容 |
| `align` | `TextMotionAlign` | — | 数字内部对齐 |
| `children` | `Snippet` | — | 数字左侧或右侧的附加内容 |
| FramePro Props | `FrameProps` | 见 FramePro | 支持 `tag`、`as`、class/style、状态与外层动效 |

## 示例

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

## 无障碍与组合边界

- 最终格式化文本保留在真实 DOM 中；NumberFlow 不替代业务侧对指标含义的可访问名称。
- `respectMotionPreference={true}` 时 reduced-motion 关闭滚轮、位移和等待，直接显示最终值。
- 不支持 CSS 自定义属性注册的浏览器退化为无连续滚轮插值的数值更新，核心文本与格式化结果保持可用。
- `children` 只表达附加内容；数值拆分、趋势、滚轮轨道和宽度测量由 NumberFlow 拥有。

---

## AI Zone

### 模块与所有权

- `NumberFlow.svelte`：公开 Props、Intl parts、逐位轨道、位数进退场、宽度测量与 Skeleton。
- `../lib/text-motion/numeric.ts`：数值提取、趋势、时间角色和循环数位的共享算法。
- `../lib/text-motion/color.ts`、`typography.ts`、`preference.ts`：变化色、排版桥接和 reduced-motion 判断。
- `FramePro.svelte`：公开根宿主、外层状态和 Frame 能力。

### 输出协议

- 负号的进场和退场与本次数值更新同时启动，delay 为 `0`；不参加数位的低位到高位错峰。负号沿数字滚动方向垂直进退场，步长为 `1em`，时长和缓动与数字滚轮一致；垂直位移同样采用增量叠加，中断后从当前轨迹接续。
- 连续输入使用可中断动画重定向（interruptible / retargetable animation）：滚轮、数位的 FLIP 横移与宽度采用增量叠加（additive animation），保留正在运行的残余位移，新指令仅叠加目标差值；不能重复冻结已有轨道、重置缓动起点或用快速模式突然缩短布局时长。已完成的增量及时释放；销毁与减少动效时取消全部残余，直接落到最新值。

- 同一帧内的多次更新共用第一次更新前的布局快照，按最后一次 DOM 布局执行一次补偿；快照消费后立即清除，不能重复补偿或把未补偿的中间位置当成起点。
- 宽度与数位布局共用一个可取消的帧任务，先集中测量，再写入位置和启动动效。宽度保留小数像素且不包含根 Frame 的外层缩放；ResizeObserver 保持稳定订阅，进退场事件不重复测量最终文本。
- 宽度补偿变量不向后代继承，避免每帧让全部数字重算无关样式。格式器只随 locale / format 更新；数字轴仅在正负轴实际变化时重排。

- 数字 presence 参考 Number Flow：新增数位从 `0` 滚到目标、删除数位从当前可见轨道滚回 `0`，同时在滚轮时长的前半段渐显 / 渐隐。负号叠加沿滚动方向的垂直进退场，其他符号仅渐显 / 渐隐和水平布局过渡；符号不做数字滚轮。退出节点保留至完整滚轮结束；重新出现时从当前轨道接管。此为 NumberFlow 私有视觉，不新增公开参数。
- 以上进退场继续遵守 SnowUI 的数值趋势和 `rollDirection`：normal 增加上滚、减少下滚，reverse 完整反转；正负数的数字轴调整不能改变这一语义。

- 正负数切换时，等待与滚动中的数字保持当前轨道方向；完成后再同步新符号对应的轨道，不能在启动前显示另一组数字。中断回到当前可见目标时，不强制绕行一整圈。

- 数位滚动、进场和退场统一从低位到高位启动；时间差复用 NumericText 的共享计算：动效时长 × 0.3 / 当前序列非空格字符数。退场保留退出序列的顺序和数量，以更新前统一采样的坐标作为退场起点，再和保留的个位同步水平归位，保持数位间距；不能因逐位脱离布局先横向跳位或在收缩中互相重叠；快速连续更新仍保留时间差，减少动效模式下为 0。

- 排版默认继承容器，基线与同字体、字号的普通文字对齐；滚动层和裁切边界遵循 [TextMotionSpec §2](../../../specs/TextMotionSpec.md#2-统一排版与颜色)。

- 根 class 为 `.snowui-number-flow`；内部 parts、digit 和 wheel class 是私有实现。
- `value` 是单一数据源；格式化文本、趋势、滚轮目标和 Skeleton 宽度都从它派生。
- `digits` 只定义数位循环长度，不改变最终 `Intl.NumberFormat` 文本。

### 关联关系

- 主布局登记为内禀原子布局；组合模式登记为数字动效原子。
- 与 NumericText、SlotText、FlowText 共用 text-motion 数值与排版能力，但保留自己的滚轮视觉时间线。

## 更新日志

### v2.0.1 (2026-09-09)

- `motionColor` 覆盖所有目标字符，保留字符和格式符号也参加统一的逐字颜色回落序列；完整时序遵循 [TextMotionSpec §2.1](../../../specs/TextMotionSpec.md#21-motioncolor)。
- 字符变化效果保持原有规则；未设置颜色、关闭动画（适用时）或减少动效生效时显示最终原色。连续更新重新编排颜色序列，卸载清理颜色动画。


### v2.0.0

- 使用 FramePro 承载公开根，支持格式化、趋势、循环数位、前后附加内容、宽度过渡、Skeleton 和 reduced-motion 退化。
