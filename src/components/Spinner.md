# Spinner

> **版本**: v1.2.3
> **职责**: 以持续旋转的视觉提示表示加载中，提供圆环、辐条和胶囊三种形式，适合按钮与内容区域。
> **包归属**: `@snowui-design-system/components`
> **文档修订**: 2026-10-20

## 组件介绍

以持续旋转的视觉提示表示加载中，提供圆环、辐条和胶囊三种形式，适合按钮与内容区域。

## 使用选择

<!-- usage-guide:start -->
用于等待状态的持续指示。能提供完成度时使用 Progress；已有按钮或表格加载态优先使用宿主内置 Spinner。

- variant 选择等待图形；size 优先于父级尺寸，无上下文时为 16。
- 不渲染 children；加载说明文字在外部组合。需要完成比例时改用 Progress。
- 加载状态默认名称随LocaleProvider更新，显式aria-label优先；不会替调用方翻译外部加载说明。
<!-- usage-guide:end -->

## 快速开始

以下示例展示推荐的基本组合。更多场景与组合限制见后文。

<!-- quick-start:generated -->
```svelte
<script lang="ts">
	import { Spinner, Text, Button } from '@snowui-design-system/components';
</script>

<div style="display: flex; align-items: center; gap: var(--gap-3);">
	<Spinner aria-label="Loading components" />
	<Text>Loading components…</Text>
</div>
```
<!-- /quick-start:generated -->

## API

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| variant | `SpinnerVariant` | `"circle"` | 视觉变体风格 |
| size | `ResourceSize` | — | 尺寸（支持 12、16、20、24、28、32、40、48、80）；省略时优先继承父级 iconSize / size，无上下文时为 16 |
| speed | `number` | `1` | 正数动画速度倍率；circle 基准周期 1000ms，spokes / pills 为 800ms，除以该倍率。非有限值或非正数回退为 1；显式 loopMotion 时序优先。 |
| loopMotion | `LoopMotionConfig` | — | 覆盖默认循环动画桥接配置；优先级高于 `speed` 推导出来的默认时长。若传入 `preset`，Spinner 仅消费其中的时序字段，不让 Frame 根节点重复旋转 |
| children | `Snippet` | — | 兼容 Frame 的类型声明；Spinner 使用内置动画图形，不渲染子内容。文字请在外部组合。 |

未重新声明的继承能力请查所属基础组件文档；本表只列本组件源码具名公开属性。

## 使用边界与详细说明

<a id="布局模型"></a>

### 布局模型

主布局模型：内禀原子布局。

- Spinner 的根节点是由 `size` 与 `variant` 决定的内禀盒，作为其他布局子项时表现为 Hug。
- circle / spokes / pills 的 SVG、mask、spoke、pill 动画层都是 Spinner 私有结构，不对外暴露 Leading / Content / Trailing 槽位。
- Spinner 不提供 label 排列能力；需要“图标 + 文案”时由外部 Button、Frame 或 Text 组合负责。
- `loopMotion` 只覆盖内部循环动效时序，不改变根布局模型。

<a id="关键字-keywords"></a>

### 关键字 (Keywords)

| 关键字 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| `class` | `string` | `''` | 自定义样式类 (如颜色) |

### Note on Color & Label
- **Color**: `Spinner` 不提供 `color` 属性。它默认继承当前文本颜色 (`currentColor`)。如需修改颜色，请使用工具类：`<Spinner class="snowui-text-blue-500" />`。
- **Label**: `Spinner` 不提供 `label` 属性。如需组合文字，请使用外部布局。

<a id="变体-variants"></a>

### 变体 (Variants)

| 变体名 | 描述 |
| :--- | :--- |
| `circle` | (默认) **CSS Conic Gradient** 实现的圆环，具有头尾透明度渐变效果 |
| `spokes` | 辐射线条，具有拖尾效果 |
| `pills` | 粗线条辐射，具有拖尾效果 |

<a id="示例"></a>


### 1. 基础用法
默认显示 16px 的 `circle` 变体。

```svelte
<Spinner />
```

### 2. 变体 (Variants)

```svelte
<div class="flex gap-4">
    <Spinner variant="circle" />
    <Spinner variant="spokes" />
    <Spinner variant="pills" />
</div>
```

---

---




## AI Zone

> **更新日志 (2026-04-28)**: 标注主布局模型为内禀原子布局，明确 Spinner 尺寸和动画层为组件私有布局。
> **描述**: 这是一个通用的加载状态指示器，支持多种视觉变体和响应式尺寸。

**继承**: 复用 Frame.svelte 的所有通用能力 (交互、动效、响应式)。
**默认能力开关**: `enableResponsive=false`, `enableContext=false`。

<a id="开发者指南-ai"></a>

### 开发者指南 (AI)

### 多语言

加载状态默认名称随LocaleProvider更新，显式aria-label优先；不会替调用方翻译外部加载说明。 通过useLocale读取`spinner.loading`，Provider messages可覆盖完整消息；未增加公开文案Prop。

### 模块索引 (Module Index)

- **Spinner 组件**: [./Spinner.svelte](Spinner.svelte)

---

## 更新日志

### v1.2.3 (2026-10-20)

- 加载状态默认名称随LocaleProvider更新，显式aria-label优先；不会替调用方翻译外部加载说明。

- 2026-09-21：统一使用文档、源码属性表与 Site / LLM 阅读入口；仅文档修订，不改变组件行为。

- **Spinner-Docs.2026-05-25** 源码顶部历史更新日志已归档；后续新增变更统一写入本文档 更新日志，源码顶部只保留职责、当前关键架构与文档路径。

### v1.2.2 (2026-03-06)

#### 调整
- **SP-Bridge.3** 当外部传入 `loopMotion.preset` 时，Spinner 会在透传给根 `Frame` 前显式剔除该 preset，避免根节点与内部 spinner 产生双重旋转。

### v1.2.1 (2026-03-06)

#### 调整
- **SP-Bridge.1** 循环动画改为消费 Frame `loopMotion` 桥接变量（duration / easing / iteration / direction / playState）。
- **SP-Bridge.2** 默认速度仍由 `variant + speed` 共同推导：`circle = 1000ms / speed`，`spokes/pills = 800ms / speed`；若显式传入 `loopMotion.duration`，则以 `loopMotion` 为准。

### v1.2.0 (2026-02-23)

#### 改进
- **SP-Perf.1** circle 变体：`radial-gradient` mask → SVG data URI mask，消除小尺寸毛边
- **SP-Perf.2** SVG `<circle>` stroke 提供矢量级抗锯齿环形裁剪，内外边缘均由 SVG 引擎渲染
- **SP-Refactor.1** `sizeMap` 提升为模块级常量，英文注释全部改为中文

### v1.1.1 (2026-02-03)

#### 修复
- **SP-Fix.1** 补齐 Frame CSS 行为 与能力开关显式传参，并对齐内部变量命名规范

### 3. 尺寸 (Sizes)

```svelte
<div class="flex gap-4 items-end">
    <Spinner size={16} />
    <Spinner size={32} />
    <Spinner size={48} />
</div>
```

### 4. 颜色 (Colors)
通过 CSS 类设置颜色。

```svelte
<Spinner class="text-blue-500" />
<Spinner variant="spokes" class="text-green-500" />
```

### 5. 速度 (Speed)

```svelte
<Spinner speed={0.5} /> <!-- 0.5x Slow -->
```

### 6. 统一循环动效桥接

`Spinner` 现在通过 `Frame loopMotion` 输出统一的 `--snowui-frame-loop-motion-*` 变量，再由内部 `animation-*` 消费这组变量。

```svelte
<!-- 默认：由 variant + speed 推导 -->
<Spinner variant="circle" speed={1.5} />

<!-- 显式覆盖 Frame 循环动画桥接 -->
<Spinner loopMotion={{ duration: 1200, easing: 'linear', iterationCount: 'infinite' }} />
```
