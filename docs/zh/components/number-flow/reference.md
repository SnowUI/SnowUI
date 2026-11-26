# NumberFlow

> **版本**: v2.1.0
> **职责**: 以逐位滚动和宽度过渡展示数字变化，保留金额、分组符与小数格式，适合计数器和实时指标。
> **包归属**: `@snowui-design-system/components`
> **文档修订**: 2026-09-21

## 组件介绍

以逐位滚动和宽度过渡展示数字变化，保留金额、分组符与小数格式，适合计数器和实时指标。

## 使用选择


用于数字滚动效果。需要不同数字过渡时比较 NumericText；普通静态数值用 Text，不额外启动动效。

- value 表示数值，无法解析的字符串显示为 0；locales / format 控制数字格式。
- children 放置前后附加内容；需要遵循系统减少动效偏好时显式启用 respectMotionPreference。


## 快速开始

以下示例展示推荐的基本组合。更多场景与组合限制见后文。


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
