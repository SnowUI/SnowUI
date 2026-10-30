# SlotText

> **许可阅读**：首次阅读组件文档、源码或 npm 使用流程，先读完整 [LICENSE](../../LICENSE)；同任务同版本去重。公开 API 配置与内部实现修改分别按许可处理；全部组件使用统一运行包，源码权益以许可为准。

> **版本**: v1.11.2
> **职责**: 以逐字符的纵向滚动展示文字变化，适合短标题、状态、计数与计时信息。
> **包归属**: `@snowui-design-system/components`
> **文档修订**: 2026-09-21

## 组件介绍

以逐字符的纵向滚动展示文字变化，适合短标题、状态、计数与计时信息。

## 使用选择

<!-- usage-guide:start -->
用于槽位式文本替换动效。静态文字用 Text；数值专属滚动可选 NumberFlow 或 NumericText。

- text 更新内容，replayKey 可重播同一内容，playOnMount 控制首次展示动效。
- animated=false 直接显示；需要遵循系统减少动效偏好时启用 respectMotionPreference。
<!-- usage-guide:end -->

## 快速开始

以下示例展示推荐的基本组合。更多场景与组合限制见后文。

<!-- quick-start:generated -->
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
<!-- /quick-start:generated -->

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

未重新声明的继承能力请查所属基础组件文档；本表只列本组件源码具名公开属性。

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


## AI Zone

以下章节保留源码维护约束，不属于应用接入步骤。

### 实现约束

- 动画差值与逻辑终点由 `../lib/text-motion/animation.ts` 分离管理；连续更新保留未结束的位移，旧清理回调不能覆盖最新目标。

- 排版默认继承容器，基线与同字体、字号的普通文字对齐；滚动层和裁切边界遵循 [TextMotionSpec §2](../../../docs/standards/TextMotionSpec.md#2-统一排版与颜色)。

- 主布局模型为内禀原子布局，根层为 `Frame`。
- 根 `Frame` 的 `enableDefaultMotion` 默认保持 `true`；字符槽位动画只作用于内部 face，显式 `while*` 与父级编排可继续控制组件整体。
- 排版、语意色、变化色与减少动效判断复用 `../lib/text-motion/`。
- 字符处理先执行 SlotText 私有 `isTail` 分类，再把非 tail 字符交给 `text-motion/timeline.ts` 的 NumericText 同源公共时间轴。不变前缀与后缀只在非 tail 范围内保留，变化中段做 SlotText 私有槽位滚动。
- 公共时间轴在同一次重组提交中完成退出字符抽离、最终自然宽度更新、保留字符 FLIP 和进退场启动，不得拆成“先移动、再改宽度、再进退场”的串行阶段。
- 宽度与剩余文字移动使用自然排版 + FLIP，布局时长与字符主体 `duration` 一致，不叠加 `exitOffset`；旧变化字符脱离文档流后按新容器边缘重新锚定到旧屏幕坐标，只做垂直下移 / 上移消失，不做水平位移。
- 新变化字符必须在 DOM 替换前设置好入场初始 `translateY(...)` 与变化色，避免自然宽度更新瞬间先显示最终落位。
- 默认字符退出方向为向上，进入方向与退出方向相反；进入使用 `opacity: 0 -> 1`，退出使用 `opacity: 1 -> 0`，可见性规则与 NumericText 一致。
- `direction="normal"` 表示普通文字向上退出、从下方进入；`direction="reverse"` 表示普通文字向下退出、从上方进入。数字、计时器和倒计时先由公共趋势得到方向，再由 `reverse` 统一取反；不得恢复公开 `up` / `down` 物理方向枚举。
- `motionRole="text"` 的普通替换字符按变化中段局部索引从左到右；尾部删除使用下一条 `isTail` 快速退场规则。数字语义从右到左。SlotText 使用参考项目的 `stagger=45ms` 与 wobble 随机扰动。
- 旧字符的原始索引超出新文本长度时属于参考实现的 `isTail` 尾部删除。该分类是 SlotText 独有规则，优先级高于公共 LCP / LCS：先从旧节点中抽出全部 tail，再对 `old[0..newLength)` 与新文本执行公共字符重组。tail 使用普通时长的 `0.75`，并从 `newLength * 0.5 + (oldIndex - newLength) * 0.25` 的中段 stagger 位置加入退场波次。它们会更快被槽位裁切，看起来接近直接消失。
- 正常文字变化必须复刻 `slot-text-main` 的 `skipUnchanged=true` 行为：同 index 且相同的字符保持静止，不得因为 `replayKey` 或外部 Demo 状态参与整行动效。
- `motionRole="text"` 时混合文案中的数字片段不触发数字右到左编排，例如 `Creator -> 2026 Design`、`2026 Design -> 2026 0615` 必须按普通文字从左到右启动；纯数字、格式化数字、时间文本或显式 `motionRole="number" | "timer" | "countdown"` 才走数字趋势语义。
- 格式符号规则与公共层一致：保留的 `$`、`%`、`,`、`.`、`:` 等只参与 FLIP 或保持静止；新增或删除的符号作为普通字符执行 SlotText 槽位出现 / 消失，不得突然出现或消失，也不得进入数字滚轮概念。
- 清理时机必须等待字符主体动画和 layout FLIP 完成。格式符号、货币符号或百分号如果被保留，动效结束时不得突然跳到最终位置。
- `duration`、`exitOffset`、`easing`、`bounce`、颜色回落时长仅为内部常量，不得恢复为公开 Props。
- 字符按 grapheme 拆分；动画字符对辅助技术隐藏，根节点提供最终 `aria-label`。




> **组件路径**: `components/src/components/SlotText.svelte`


`SlotText` 为逐字符纵向槽位滚动文字。动效时序由组件内部维护，不提供时长、错峰、弹性或缓动调参。

## 更新日志

- 2026-09-21：统一使用文档、源码属性表与 Site / LLM 阅读入口；仅文档修订，不改变组件行为。

### v1.11.2 (2026-09-09)

- `motionColor` 覆盖所有目标字符，保留字符和格式符号也参加统一的逐字颜色回落序列；完整时序遵循 [TextMotionSpec §2.1](../../../docs/standards/TextMotionSpec.md#21-motioncolor)。
- 字符变化效果保持原有规则；未设置颜色、关闭动画（适用时）或减少动效生效时显示最终原色。连续更新重新编排颜色序列，卸载清理颜色动画。


### v1.11.1 (2026-09-08)

- 连续更新从当前槽位画面继续，保留已开始的位移；减少逐字符定时器和重复布局。`interrupt=false` 仍等待当前播放完成后处理最新目标。

### v1.11.0 (2026-06-16)

- 将 SlotText 独有 `isTail` 提升到公共 LCP / LCS 之前：先按原始索引抽出超出新文本长度的旧字符，再对剩余字符使用通用重组。

### v1.10.0 (2026-06-16)

- 补齐 `slot-text-main` 的 `isTail` 尾部删除规则：超出新文本长度的旧字符缩短为 `0.75` 倍时长，并从整行中段加入退场波次。

### v1.9.0 (2026-06-16)

- 默认退出方向改为向上，与 NumericText 默认文字方向一致。
- 字符进入和退出加入与 NumericText 一致的透明度变化：进入 `0 -> 1`，退出 `1 -> 0`。

### v1.8.0 (2026-06-15)

- 接入 NumericText 同源公共时间轴，将自然宽度提交、保留字符 FLIP 与变化字符进退场统一到同一重组时机；修复宽度变化挤压尚未退出字符的问题。
- 布局 FLIP 不再叠加 `exitOffset`，普通文字 stagger 改为变化中段局部顺序，避免长前缀造成进退场延迟。

### v1.7.0 (2026-06-15)

- 按 `slot-text-main` 复刻 SlotText：默认方向改为 `down`，默认 `interrupt=true`、`playOnMount=false`，恢复 `45ms` stagger 与 wobble；字符处理切到 NumericText 同源 LCP / LCS + FLIP，SlotText 只保留垂直槽位滚动视觉。
- `replayKey` 改为只在文字未变化时触发整行重播；正常 text 变化保持参考项目的相同字符静止策略。
- 支持 TextMotion-Demo Slow Mode 的 `transition` 覆盖，并收紧混合文案判断，避免含数字的普通文本误走数字右到左顺序。

### v1.6.0 (2026-06-15)

- `motionColor` 默认改为 `undefined`，未显式设置时不改变文字颜色。

### v1.5.0 (2026-06-14)

- 新增 `motionRole` 数字语义定性，支持普通数字、计时器和倒计时；乘除等运算按结果变大 / 变小决定 Up / Down。

### v1.4.0 (2026-06-14)

- 数字趋势解析支持负数增减、完整时间文本的计时器 / 倒计时环形判断；加向上、减向下。

### v1.3.0 (2026-06-14)

- 当时默认值按确认截图调整为物理向上滚动、`stagger=45ms`、`duration=300ms`、`bounce=0.6`、`skipUnchanged=true`、`interrupt=false`；该中断策略已在 v1.7.0 按 `slot-text-main` 覆盖为 `interrupt=true`。
- 新增 `trend` 数字趋势语义；数字增加向上、减少向下，变化数位从低位到高位启动；后续方向 API 已收敛为 `normal` / `reverse` 语义。

### v1.2.0 (2026-06-14)

- 根 `Frame` 默认启用 Frame 默认动效，内部槽位动画与组件级 `while*` / 父级编排并行工作。

### v1.1.0 (2026-06-14)

- 统一六项排版 Props 与 `motionColor`。
- 移除公开动效细节 Props。
- `respectMotionPreference` 默认 `false`。
