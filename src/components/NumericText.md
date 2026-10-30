# NumericText

> **许可阅读**：首次阅读组件文档、源码或 npm 使用流程，先读完整 [LICENSE](../../LICENSE)；同任务同版本去重。公开 API 配置与内部实现修改分别按许可处理；全部组件使用统一运行包，源码权益以许可为准。

> **版本**: v1.7.2
> **职责**: 对文字或数字中发生变化的部分进行过渡，保留未变内容，适合简短状态、数值与计时信息。
> **包归属**: `@snowui-design-system/components`
> **文档修订**: 2026-09-21

## 组件介绍

对文字或数字中发生变化的部分进行过渡，保留未变内容，适合简短状态、数值与计时信息。

## 使用选择

<!-- usage-guide:start -->
用于数值变化时的数字动效。完整文本替换用 FlowText 或 SlotText；样式与格式按公开 API 配置。

- 通过 value 更新数字，locales / format 控制格式；animated=false 可直接显示结果。
- 默认遵循减少动效偏好；direction / trend 控制变化方向，字体与颜色使用系统参数。
<!-- usage-guide:end -->

## 快速开始

以下示例展示推荐的基本组合。更多场景与组合限制见后文。

<!-- quick-start:generated -->
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
<!-- /quick-start:generated -->

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

未重新声明的继承能力请查所属基础组件文档；本表只列本组件源码具名公开属性。

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


## AI Zone

以下章节保留源码维护约束，不属于应用接入步骤。

### 实现约束

- NumericText 保留原有替换关键帧与中断方式，不启用 FlowText 的叠加布局路径。格式化缓存和生命周期优化由共享层提供。

- 排版默认继承容器，基线与同字体、字号的普通文字对齐；滚动层和裁切边界遵循 [TextMotionSpec §2](../../../docs/standards/TextMotionSpec.md#2-统一排版与颜色)。

- 主布局模型为内禀原子布局，根层为 `Frame`。
- 根 `Frame` 的 `enableDefaultMotion` 默认保持 `true`；字符 diff 动画只作用于内部输出层，显式 `while*` 与父级编排可继续控制组件整体。
- 内容标准化、排版、语意色、变化色、字符重组与减少动效判断复用 `../lib/text-motion/`。
- 字符宽度使用自然排版与 LCP/LCS 区段 FLIP；普通文本变化中段按节点索引从左到右启动，数字运算变化按低位到高位启动。
- 字符节点创建 / 抽离 / 清理属于共享字符重组逻辑；NumericText 只定义字符出现和消失的视觉 keyframes。
- NumericText 私有字符动效完整沿用 `numeric-text-main`：`translateY(0.35em)`、`scale(0.6)`、`rotateZ(2deg)`、`blur(0.1em)` 与 opacity。
- 时序严格沿用 `numeric-text-main`：默认 `550ms`、原 linear easing；stagger 使用 `duration * 0.3 / 非空变化字符数`，例如 `Creative -> Create` 中 `i` 与 `v` 的退出相差 `82.5ms`。
- 数字方向复用 `../lib/text-motion/numeric.ts`：数字增加时趋势为 `1` 并向上翻，数字减小时趋势为 `-1` 并向下翻；负数、计时器与倒计时遵循统一趋势协议。
- `direction="normal"` 保持公共趋势；`direction="reverse"` 对公共趋势取反。普通文字没有数字趋势时使用 fallback 趋势 `1`，避免 `motionRole="text"` 下 reverse 无效。
- 同一数位替换使用隐藏 sizer + old face + new face：sizer 继承最终字符宽度，old/new face 绝对定位并继承 `font`、`line-height`、`font-variant-numeric`、`letter-spacing`，避免动效期间宽度抖动。
- 数字运算中未变化的数字和格式符号保持静止；新增或删除的格式符号由公共字符运行时当作普通字符处理，不进入任何数字 wheel。
- WAAPI keyframe 结构与参考项目一致：退出使用目标单值，进入使用 `[起始值, ""]` 回到当前计算样式。
- `motionColor` 在字符主动画期间保持，落地后以 `280ms linear` 回到最终颜色。共享颜色生命周期在快速连续更新时仅清理对应动画，旧结束事件不会覆盖最新颜色回落。
- `transition` 保留为 NumericText 对齐参考项目的公开能力；`stagger`、`scale`、`rotate`、`blur` 不单独公开。
- 内部 shadow DOM 必须继承字体、颜色、行高和字距。




> **组件路径**: `components/src/components/NumericText.svelte`


`NumericText` 提供 SwiftUI `numericText` 风格的单行文字 / 数字差异过渡，只动画发生变化的中间区间。

## 更新日志

- 2026-09-21：统一使用文档、源码属性表与 Site / LLM 阅读入口；仅文档修订，不改变组件行为。

### v1.7.2 (2026-09-09)

- `motionColor` 覆盖所有目标字符，保留字符和格式符号也参加统一的逐字颜色回落序列；完整时序遵循 [TextMotionSpec §2.1](../../../docs/standards/TextMotionSpec.md#21-motioncolor)。
- 字符变化效果保持原有规则；未设置颜色、关闭动画（适用时）或减少动效生效时显示最终原色。连续更新重新编排颜色序列，卸载清理颜色动画。


### v1.7.1 (2026-09-08)

- 保持现有数位替换和中断方式；复用数字格式化器，批量读取几何并及时释放替换动画与清理计时器。

### v1.7.0 (2026-06-15)

- 完整复刻 `numeric-text-main` 的字符视觉与时序：恢复 `scale(0.6)`、`rotateZ(2deg)`，stagger 改为 `duration * 0.3 / 非空变化字符数`。
- `transition` 与 `respectMotionPreference` 默认值对齐参考项目，TextMotion-Demo Slow Mode 改为通过延长 `transition.duration` 实现。
- 数字趋势重新接入共享 `numeric.ts`，确保数字增加上翻、数字减小下翻。

### v1.6.2 (2026-06-15)

- 与 `numeric-text-main` 核对并恢复垂直位移 / 模糊的原始 WAAPI keyframe 结构。
- 保持缩放和旋转关闭；透明度继续负责真正的字符出现 / 消失。

### v1.6.1 (2026-06-15)

- 恢复字符进入 / 退出的透明度变化，修复新旧字符在主动画期间同时保持实色造成的重影。
- 继续保持垂直位移 + 模糊，不恢复缩放与旋转。

### v1.6.0 (2026-06-15)

- 数字内容标准化下沉到 `../lib/text-motion/format.ts`。
- `character.ts` 改为可注入 animator 的纯字符重组运行时；NumericText 自己维护垂直位移 + 模糊的出现 / 消失动效。
- 移除 NumericText 字符缩放与旋转；透明度在 v1.6.1 恢复用于完成出现 / 消失。

### v1.1.0 (2026-06-15)

- 将字符 diff、不变区段边缘 FLIP、字符进退场与变化色生命周期提炼到 `../lib/text-motion/character.ts`，NumericText 改为共享引擎的薄封装。

### v1.5.0 (2026-06-15)

- `motionColor` 默认改为 `undefined`，未显式设置时不改变文字颜色。

### v1.4.0 (2026-06-14)

- 新增 `motionRole` 数字语义定性，支持普通数字、计时器和倒计时；乘除等运算按结果变大 / 变小决定 Up / Down。

### v1.3.0 (2026-06-14)

- 数字趋势解析支持负数增减、完整时间文本的计时器 / 倒计时环形判断；加使用 Up，减使用 Down。

### v1.2.0 (2026-06-14)

- 根 `Frame` 默认启用 Frame 默认动效，内部字符 diff 与组件级 `while*` / 父级编排并行工作。

### v1.1.0 (2026-06-14)

- 统一六项排版 Props、`motionColor` 和 `as="label"`。
- 移除公开动效细节 Props。
- `respectMotionPreference` 默认 `false`。

### v1.0.0

- 新增 NumericText 组件。
