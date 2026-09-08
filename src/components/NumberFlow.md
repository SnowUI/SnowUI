# NumberFlow

> **版本**: v2.0.0
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
| `color` / `motionColor` | `SnowUIColor \| string` | 默认文字色 / text-motion 默认变化色 | 静态颜色和变化期间颜色 |
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

- 排版默认继承容器，基线与同字体、字号的普通文字对齐；滚动层和裁切边界遵循 [TextMotionSpec §2](../../../specs/TextMotionSpec.md#2-统一排版与颜色)。

- 根 class 为 `.snowui-number-flow`；内部 parts、digit 和 wheel class 是私有实现。
- `value` 是单一数据源；格式化文本、趋势、滚轮目标和 Skeleton 宽度都从它派生。
- `digits` 只定义数位循环长度，不改变最终 `Intl.NumberFormat` 文本。

### 关联关系

- 主布局登记为内禀原子布局；组合模式登记为数字动效原子。
- 与 NumericText、SlotText、FlowText 共用 text-motion 数值与排版能力，但保留自己的滚轮视觉时间线。

## 更新日志

### v2.0.0

- 使用 FramePro 承载公开根，支持格式化、趋势、循环数位、前后附加内容、宽度过渡、Skeleton 和 reduced-motion 退化。
