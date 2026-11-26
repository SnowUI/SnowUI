# SlotText

> **版本**: v1.11.2
> **职责**: 以逐字符的纵向滚动展示文字变化，适合短标题、状态、计数与计时信息。
> **包归属**: `@snowui-design-system/components`
> **文档修订**: 2026-09-21

## 组件介绍

以逐字符的纵向滚动展示文字变化，适合短标题、状态、计数与计时信息。

## 使用选择


用于槽位式文本替换动效。静态文字用 Text；数值专属滚动可选 NumberFlow 或 NumericText。

- text 更新内容，replayKey 可重播同一内容，playOnMount 控制首次展示动效。
- animated=false 直接显示；需要遵循系统减少动效偏好时启用 respectMotionPreference。


## 快速开始

以下示例展示推荐的基本组合。更多场景与组合限制见后文。


```svelte
<script lang="ts">
	import { Button, Text } from '@snowui-design-system/components';
	import { SlotText, chromatic } from '@snowui-design-system/components';
	const componentNames = ['Button', 'DataTable', 'SidePanel', 'Tooltip'];
	let componentIndex = $state(0);
</script>

<div style="display: flex; flex-direction: column; align-items: center; gap: var(--gap-4);">
	<SlotText text={componentNames[componentIndex]} motionRole="text" motionColor={chromatic()} size="--text-32" lineHeight="--leading-32" weight={600} />
	<Button onclick={() => componentIndex = (componentIndex + 1) % componentNames.length}>Next component</Button>
</div>
```


## API

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| text | `string \| number` | `""` | 最终文字 |
| direction | `SlotTextDirection` | — | 文字与数字的语义方向；`normal` 使用公共趋势方向，`reverse` 完整取反 |
| trend | `SlotTextTrend` | `0` | 数字趋势；`0` 自动判断，增加向上、减少向下 |
| motionRole | `SlotTextMotionRole` | `"auto"` | 内容语义定性；`text` 显式关闭数字推断，其他值用于普通数值、计时器或倒计时 |
| skipUnchanged | `boolean` | `true` | 跳过未变化字符 |
| interrupt | `boolean` | `true` | 新内容是否中断当前播放；`true` 从当前画面继续过渡到最新文字，`false` 等待当前播放结束后处理最新文字 |
| replayKey | `string \| number` | `0` | 文字不变时值变化会从空槽位重播；文字变化时只执行正常 diff 动画 |
| playOnMount | `boolean` | `false` | 挂载后是否从空槽位重播 |
| animated | `boolean` | `true` | 是否启用文字动效 |
| respectMotionPreference | `boolean` | `false` | 显式开启后才遵循系统减少动效设置 |
| transition | `Partial<SlotTextTransition>` | — | 调试 / Demo 用时序覆盖；不改变默认复刻基线 默认行为：参考项目默认值。 |
| font | `string` | — | 字体；支持 SnowUI Token |
| size | `string \| number` | — | 字号；支持 SnowUI Token |
| weight | `string \| number` | — | 字重 |
| color | `SnowUIColor \| string` | — | 最终文字颜色；支持 PascalCase 语意色 |
| lineHeight | `string \| number` | — | 行高；支持 SnowUI Token |
| align | `TextMotionAlign` | — | 对齐；默认继承父级 |
| motionColor | `TextMotionColor` | — | 全部目标字符从左到右回落的临时颜色；默认不改变颜色，支持 `chromatic()` 逐字符渐变 |

宿主继承说明：继承 [Frame](../frame/reference.md) 的 `tag`（默认 `"span"`）、`class`、`style` 与通用状态／动效能力；本表仅列本组件源码具名公开属性。

## 使用边界与详细说明

<a id="关键字"></a>

### 关键字

六项排版默认全部继承父级。`motionColor` 在更新时覆盖目标全文，并从左到右在主时长与逐字 delay 后回到 `color` 或父级继承色；颜色主时长保留 `duration + exitOffset`，回落时长保留 `colorFade`。数字位移仍按低位到高位启动，两条时间线互不改变对方的方向。

```svelte
<script lang="ts">
    import { SlotText, chromatic } from "@snowui-design-system/components";
</script>

<SlotText text="Deploy Ready" motionColor={chromatic()} />
```

数字内容遵循统一趋势协议：趋势只比较新旧结果值大小，`-3 -> -2` 仍是增加、`-2 -> -3` 仍是减少。乘除等运算不按运算符决定方向，只按结果变大 / 变小决定 Up / Down。完整时间文本按 `mm:ss` / `HH:mm:ss` 的 60 进制环形差值判断，`59:59 -> 00:00` 是计时器增加，`00:00 -> 59:59` 是倒计时减少；`motionRole="timer"` 或 `"countdown"` 且内容为单段 `00..59` 时也按 60 进制单位处理。`direction="normal"` 时，文字默认向上退出、从下方进入，数字增加向上、减少向下，计时器增加向上、倒计时减少向下；`direction="reverse"` 时以上规则全部取反。变化数位按低位到高位（视觉上从右向左）启动。`trend={1|-1}` 可显式覆盖自动判断，但仍会被 `reverse` 取反。

```svelte
<SlotText
    text="Deploy Ready"
    size="--text-24"
    weight={600}
    color="Primary"
    motionColor="Indigo"
/>
```

```svelte
<Field>
    <SlotText as="label" text="Email" />
    <Input />
</Field>
```

---


<a id="实现约束"></a>
