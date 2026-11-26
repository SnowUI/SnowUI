# NumericText

> **版本**: v1.7.2
> **职责**: 对文字或数字中发生变化的部分进行过渡，保留未变内容，适合简短状态、数值与计时信息。
> **包归属**: `@snowui-design-system/components`
> **文档修订**: 2026-09-21

## 组件介绍

对文字或数字中发生变化的部分进行过渡，保留未变内容，适合简短状态、数值与计时信息。

## 使用选择


用于数值变化时的数字动效。完整文本替换用 FlowText 或 SlotText；样式与格式按公开 API 配置。

- 通过 value 更新数字，locales / format 控制格式；animated=false 可直接显示结果。
- 默认遵循减少动效偏好；direction / trend 控制变化方向，字体与颜色使用系统参数。


## 快速开始

以下示例展示推荐的基本组合。更多场景与组合限制见后文。


```svelte
<script lang="ts">
	import { Button, Text } from '@snowui-design-system/components';
	import { NumericText, chromatic } from '@snowui-design-system/components';
	const headlines = ['Build with SnowUI', 'Ship components', 'Write better docs'];
	let headlineIndex = $state(0);
</script>

<div style="display: flex; flex-direction: column; align-items: center; gap: var(--gap-4);">
	<NumericText value={headlines[headlineIndex]} motionRole="text" motionColor={chromatic()} size="--text-32" lineHeight="--leading-32" weight={600} />
	<Button onclick={() => headlineIndex = (headlineIndex + 1) % headlines.length}>Next headline</Button>
</div>
```


## API

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| value | `NumericTextValue` | `""` | 显示内容 |
| locales | `string` | `"en-US"` | 数字格式化区域 |
| format | `Intl.NumberFormatOptions` | — | 数字格式化选项 |
| animated | `boolean` | `true` | 是否启用内容变化动效 |
| trend | `NumericTextTrend` | `0` | 减少、自动、增加趋势 |
| direction | `NumericTextDirection` | `"normal"` | 语义方向；`normal` 使用公共趋势，`reverse` 将文字、数字、计时器和倒计时方向全部取反 |
| motionRole | `TextMotionRole` | `"auto"` | 内容语义定性；`text` 显式关闭数字推断，其他值用于普通数值、计时器或倒计时 |
| transition | `Partial<TextMotionTransition>` | — | 与 `numeric-text-main` 一致的动效时序入口；Demo Slow Mode 使用 默认行为：{ duration: 550, easing: reference }。 |
| respectMotionPreference | `boolean` | `true` | 与 `numeric-text-main` 一致，默认遵循系统减少动效设置 |
| font | `string` | — | 字体 |
| size | `string \| number` | — | 字号 |
| weight | `string \| number` | — | 字重 |
| lineHeight | `string \| number` | — | 行高 |
| color | `SnowUIColor \| string` | — | 最终文字颜色 |
| align | `TextMotionAlign` | — | 对齐；默认继承父级 |
| motionColor | `TextMotionColor` | — | 全部目标字符从左到右回落的临时颜色；默认不改变颜色，支持 `chromatic()` 逐字符渐变 |

宿主继承说明：继承 [Frame](../frame/reference.md) 的 `tag`（默认 `"span"`）、`class`、`style` 与通用状态／动效能力；本表仅列本组件源码具名公开属性。

## 使用边界与详细说明

<a id="关键字"></a>

### 关键字

六项排版默认全部继承父级，支持 SnowUI Token 与 `color="Primary"` 等 PascalCase 语意色。

数字与时间文本遵循统一趋势协议：普通数字按真实结果值判断，负数不改变加减语义；乘除等运算不按运算符决定方向，只按结果变大 / 变小决定 Up / Down。完整时间文本按 `mm:ss` / `HH:mm:ss` 的 60 进制环形差值判断；`motionRole="timer"` 或 `"countdown"` 且内容为单段 `00..59` 时也按 60 进制单位处理。计时器增加使用 Up 动效，倒计时减少使用 Down 动效，`trend={1|-1}` 可显式覆盖自动判断。`direction="reverse"` 在最终趋势上取反；`motionRole="text"` 没有自动趋势时仍使用默认趋势 `1`，因此 reverse 对纯文字模式也有效。

```svelte
<NumericText
    value={12840}
    format={{ style: "currency", currency: "USD" }}
    size="--text-24"
    weight={600}
    color="Primary"
    motionColor="Indigo"
/>
```

---


<a id="实现约束"></a>
