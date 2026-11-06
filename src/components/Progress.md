# Progress

> **版本**: v1.1.2
> **职责**: 以条形或圆形反馈任务进度，支持明确进度与不确定状态，适合上传、处理和加载过程。
> **包归属**: `@snowui-design-system/components`
> **文档修订**: 2026-10-23

## 组件介绍

以条形或圆形反馈任务进度，支持明确进度与不确定状态，适合上传、处理和加载过程。

## 使用选择

<!-- usage-guide:start -->
用于已知或未知完成度的进度反馈；未知进度使用 isIndeterminate。纯等待指示也可用 Spinner，业务数值仪表可选 GaugeChart。

- value 是 0–100 的百分比；未知进度使用 isIndeterminate，不能用虚构百分比代替。
- variant 选择 line / circle；circle 的 showLabel 生成标签，显式 children 替换默认标签。
<!-- usage-guide:end -->

## 快速开始

以下示例展示推荐的基本组合。更多场景与组合限制见后文。

<!-- quick-start:generated -->
```svelte
<script lang="ts">
	import { Button, Frame, Progress, Text } from '@snowui-design-system/components';
	let progress = $state(38);
	const status = $derived(progress === 100 ? 'Documentation ready' : 'Generating documentation');
	function advance() { progress = Math.min(100, progress + 16); }
</script>

<div style="display: flex; flex-direction: column; align-items: stretch; gap: var(--gap-4); width: min(100%, 32rem); min-width: 0;">
	<Progress value={progress} aria-label="Documentation generation progress">
		<Frame as="label" singleLine style="justify-content: space-between;">
			<Text lines={1}>{status}</Text>
			<Text as="trailing" lines={1}>{progress}%</Text>
		</Frame>
	</Progress>
	<div style="display: flex; justify-content: center; gap: var(--gap-2);">
		<Button onclick={advance} disabled={progress === 100}>Advance</Button>
		<Button onclick={() => progress = 0}>Reset</Button>
	</div>
</div>
```
<!-- /quick-start:generated -->

## API

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| value | `number` | `0` | 百分比进度，自动 clamp 到 0–100 |
| variant | `ProgressVariant` | `"line"` | 长条形或圆形 |
| size | `number \| string` | `16` | 圆形宽高；与 Spinner 默认一致 |
| thickness | `number \| string` | — | 长条形高度或圆环粗细；circle / 不确定态对齐 Spinner 环宽 默认行为：line 确定态 `4`；circle 与不确定态为 size 的 `15%`（size=16 时 2.4px）。 |
| background | `SnowUIColor \| string` | `"Black4"` | 轨道底色 |
| color | `SnowUIColor \| string` | `"Primary"` | 填充颜色 |
| isIndeterminate | `boolean` | `false` | 不确定态 |
| showLabel | `boolean` | `false` | 仅 circle 生效；确定态下生成显示实时 value 的内置 Text |
| loopMotion | `LoopMotionConfig` | — | 覆盖不确定态循环时序 |
| children | `Snippet` | — | 显式 label 组合；存在时替换 circle 内置 label |
| parts | `ComponentPartsOf<{ Text: typeof Text }>` | — | 配置 circle 的内置 Text label |

未重新声明的继承能力请查所属基础组件文档；本表只列本组件源码具名公开属性。

## 使用边界与详细说明

<a id="布局模型"></a>

### 布局模型

主布局模型：**复合管理布局**。

- `variant="line"`：label 保持显式组合模式，与长条轨道纵向排列，默认 gap 为 4px；label 区域横向占满 Progress 可用宽度。
- `variant="circle"`：`showLabel=true` 时内置生成 Text，与 SVG 圆环重叠并默认居中；默认不显示。
- 空的直系 `as="label"` 自动显示实时 `value`；显式 label 内容保持不变。
- label 默认排版为 12px / 16px，不限制外部自定义文字、字号和颜色。
- line 不提供内置 label：其常见结构是标题、状态与百分比的横向信息区，单一内置文本无法确定内容和对齐语义。

<a id="示例"></a>

### 示例

```svelte
<Progress value={60}>
  <Frame as="label" singleLine class="justify-between">
    <Text lines={1}>Loading</Text>
    <Text as="trailing" lines={1}>60%</Text>
  </Frame>
</Progress>

<Progress variant="circle" value={50} size={32} showLabel />

<Progress value={60}>
  <Text as="label">60%</Text>
</Progress>
```

---




## AI Zone

**继承**: 复用 Frame.svelte 的通用能力。
**默认能力开关**: `enableResponsive=false`, `enableContext=true`, `enableScaleObserver=false`, `enableDefaultMotion=true`。

<a id="开发者指南-ai"></a>

### 开发者指南 (AI)

- **实现**: [./Progress.svelte](Progress.svelte)
- **颜色协议**: [../lib/color.md](../lib/color.md)
- 长条形不确定态使用局部平移关键帧，但时序消费 Frame `loopMotion` bridge。
- 圆形不确定态在内部圆环 Frame 上使用 `loopMotion.preset="rotateClockwise"`，中心 label 不参与旋转。
- circle / 不确定态默认几何对齐 Spinner：size=16px，thickness=size×15%（16px 时 2.4px）。
- line 确定态 thickness 默认 4px。
- 空的直系 `as="label"` 由组件自动写入实时值；显式内容不被改写。

## 更新日志

- 2026-10-23：并列状态／百分比示例显式使用Frame单行组合与Text全文缩略，保留进度更新、圆环及不确定态；仅文档和示例修订。

- 2026-09-21：统一使用文档、源码属性表与 Site / LLM 阅读入口；仅文档修订，不改变组件行为。

### v1.1.2 (2026-07-12)

- circle 与不确定态默认 size / thickness 对齐 Spinner：16px / size×15%（2.4px）；line 确定态 thickness 仍为 4px。

### v1.1.1 (2026-07-12)

- 曾将 thickness 统一为 4px；随后被 v1.1.2 按 Spinner 几何回退 circle / 不确定态。

### v1.1.0 (2026-07-04)

- circle 新增默认关闭的 `showLabel` 内置模式，内部生成 Text，默认排版 12px / 16px。
- 新增 `parts.Text`；显式 children 存在时替换内置 label。
- line 维持显式 label 组合模式，避免锁定标题、状态与百分比的布局语义。
- circle 不确定态默认尺寸与粗细对齐 Spinner circle：16px / 15% 环宽。

### v1.0.1 (2026-06-02)

- 空的直系 `as="label"` 自动显示实时值。
- label 默认排版调整为 12px / 16px。

### v1.0.0 (2026-06-01)

- 新增长条形与圆形 Progress、自由尺寸、共享粗细、自由 label、语意色与 indeterminate 动效。
- 长条形 label 区域默认铺满可用宽度；需要两端分布时，外部 label Frame 显式使用 `row class="justify-between"`。
