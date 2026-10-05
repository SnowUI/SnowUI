# ScrambleText

> **版本**: v1.4.0
> **职责**: 通过字符扰动逐步呈现目标文字，适合标题、短句与状态文案的动态揭示。
> **包归属**: `@snowui/components-pro`
> **文档修订**: 2026-09-21

## 组件介绍

通过字符扰动逐步呈现目标文字，适合标题、短句与状态文案的动态揭示。

## 使用选择

<!-- usage-guide:start -->
用于文本更新时的字符扰动效果。静态文字用 Text，连续文本位移用 FlowText；减少动效环境保留可读内容。

- text 提供目标文字，mode / charset / customSequence 选择字符变化方式。
- 需要遵循系统减少动效偏好时启用 respectMotionPreference；关键信息应始终以最终可读文本表达。
<!-- usage-guide:end -->

## 快速开始

以下示例展示推荐的基本组合。更多场景与组合限制见后文。

<!-- quick-start:generated -->
```svelte
<script lang="ts">
	import { Button, Text } from '@snowui-design-system/components';
	import { ScrambleText, chromatic } from '@snowui/components-pro';
	const statuses = ['Preparing docs', 'Checking APIs', 'Ready to publish'];
	let statusIndex = $state(0);
</script>

<div style="display: flex; flex-direction: column; align-items: center; gap: var(--gap-4);">
	<ScrambleText text={statuses[statusIndex]} mode="cascade" charset="glyphs" motionColor={chromatic()} size="--text-32" lineHeight="--leading-32" weight={600} />
	<Button onclick={() => statusIndex = (statusIndex + 1) % statuses.length}>Update status</Button>
</div>
```
<!-- /quick-start:generated -->

## API

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| text | `string \| number` | `""` | 最终文字 |
| charset | `ScrambleTextCharset` | `"glyphs"` | 预设替换字符集 |
| customSequence | `string` | — | 自定义替换序列，最多 64 个 grapheme |
| mode | `ScrambleTextMode` | `"cascade"` | 离散动效模式 |
| respectMotionPreference | `boolean` | `false` | 显式开启后才遵循系统减少动效设置 |
| font | `string` | — | 字体 |
| size | `string \| number` | — | 字号 |
| weight | `string \| number` | — | 字重 |
| color | `SnowUIColor \| string` | — | 最终文字颜色 |
| lineHeight | `string \| number` | — | 行高 |
| align | `TextMotionAlign` | — | 对齐；默认继承父级 |
| motionColor | `TextMotionColor` | — | 全部目标字符从左到右依次回落的临时颜色；支持语义色、CSS 色与逐字 resolver，默认不改变颜色 |

未重新声明的继承能力请查所属基础组件文档；本表只列本组件源码具名公开属性。

## 使用边界与详细说明

<a id="关键字"></a>

### 关键字

```svelte
<script lang="ts">
    import { ScrambleText, chromatic } from "@snowui/components-pro";
</script>

<ScrambleText
    text="DEPLOY READY"
    charset="glyphs"
    font="--font-mono"
    size="--text-24"
    weight={600}
    color="Primary"
    motionColor={chromatic()}
/>
```

---


<a id="实现约束"></a>


## AI Zone

以下章节保留源码维护约束，不属于应用接入步骤。

### 实现约束

- 组件持有字符目标与进度，连续更新只替换正在播放字符的终点；仅显式重播或配置变化重新启动。一个运行中的循环驱动全部字符，结束或卸载时释放。

- 排版默认继承容器，基线与同字体、字号的普通文字对齐；滚动层和裁切边界遵循 [TextMotionSpec §2](../../../specs/TextMotionSpec.md#2-统一排版与颜色)。

- 主布局模型为内禀原子布局，根层为 `FramePro`。
- 根 `FramePro` 的 `enableDefaultMotion` 默认保持 `true`；扰动动画只更新内部输出层，显式 `while*` 与父级编排可继续控制组件整体。
- 排版、语意色、变化色与减少动效判断复用 `../lib/text-motion/`。
- `cascadeSpeed`、`cascadeDelay`、`duration`、`settleDuration` 等时序不得公开。
- `customSequence` 是内容语义，不是动效速度调参，可以保留。




> **组件路径**: `pro/src/components/ScrambleText.svelte`


`ScrambleText` 提供字符扰动、循环并归位到目标文字的动效。默认使用 `cascade`，动效速度和字符错峰由组件内部统一维护。

### 文档宿主的出现门禁

页面祖先或同源 iframe 显式设置 `data-snowui-appearance-gated="true"` 时，先完成静态布局，所有祖先门禁的 `data-snowui-appearance-ready="true"` 后才启动首轮动效。首次放行后取消观察，保留人工交互与卸载清理；没有门禁的独立消费保持原行为。协议由 Site `docs/ComponentExampleRuntimeSpec.md` 维护。

## 更新日志

- 2026-09-21：统一使用文档、源码属性表与 Site / LLM 阅读入口；仅文档修订，不改变组件行为。

### v1.4.0 (2026-09-17)

- `motionColor` 使用共享 `TextMotionColor`，新增逐字 resolver 支持，可通过 `chromatic()` 生成彩色渐变序列。

### v1.3.2 (2026-09-09)

- `motionColor` 覆盖所有目标字符，保留字符和格式符号也参加统一的逐字颜色回落序列；完整时序遵循 [TextMotionSpec §2.1](../../../specs/TextMotionSpec.md#21-motioncolor)。
- 字符变化效果保持原有规则；未设置颜色、关闭动画（适用时）或减少动效生效时显示最终原色。连续更新重新编排颜色序列，卸载清理颜色动画。


### v1.3.1 (2026-09-08)

- 连续更新延续正在运行的字符进度；无颜色时复用文本节点；有颜色时复用逐字符节点，仅在实际换字时更新画面。

### v1.3.0 (2026-06-15)

- `motionColor` 默认改为 `undefined`，未显式设置时不改变文字颜色。

### v1.2.0 (2026-06-14)

- 根 `FramePro` 默认启用 Frame 默认动效，内部扰动动画与组件级 `while*` / 父级编排并行工作。

### v1.1.0 (2026-06-14)

- 统一六项排版 Props 与 `motionColor`。
- 将 cascade 时序完全内部化。
- `respectMotionPreference` 默认 `false`。

### v1.0.0 (2026-06-11)

- 新增 ScrambleText PRO 组件。
