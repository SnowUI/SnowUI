# Spinner 加载组件 (Spinner)

> **版本**: v1.2.2
> **职责**: 表达加载中的非文本状态，并提供 circle、spokes 与 pills 三种内禀视觉变体。
> **变更记录 (2026-04-28)**: 标注主布局模型为内禀原子布局，明确 Spinner 尺寸和动画层为组件私有布局。
> **描述**: 这是一个通用的加载状态指示器，支持多种视觉变体和响应式尺寸。

**继承**: 复用 Frame.svelte 的所有通用能力 (交互、动效、响应式)。
**默认能力开关**: `enableResponsive=false`, `enableContext=false`。

## 布局模型

主布局模型：内禀原子布局。

- Spinner 的根节点是由 `size` 与 `variant` 决定的内禀盒，作为其他布局子项时表现为 Hug。
- circle / spokes / pills 的 SVG、mask、spoke、pill 动画层都是 Spinner 私有结构，不对外暴露 Leading / Content / Trailing 槽位。
- Spinner 不提供 label 排列能力；需要“图标 + 文案”时由外部 Button、Frame 或 Text 组合负责。
- `loopMotion` 只覆盖内部循环动效时序，不改变根布局模型。

## 关键字 (Keywords)

| 关键字 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| `variant` | `'circle' \| 'spokes' \| 'pills'` | `'circle'` | 视觉变体风格 |
| `size` | `ResourceSize` | `16` | 尺寸（支持 12、16、20、24、28、32、40、48、80）；省略时优先继承父级 iconSize / size，无上下文时为 16 |
| `speed` | `number` | `1` | 正数动画速度倍率；circle 基准周期 1000ms，spokes / pills 为 800ms，除以该倍率。非有限值或非正数回退为 1；显式 loopMotion 时序优先。 |
| `loopMotion` | `LoopMotionConfig` | - | 覆盖默认循环动画桥接配置；优先级高于 `speed` 推导出来的默认时长。若传入 `preset`，Spinner 仅消费其中的时序字段，不让 Frame 根节点重复旋转 |
| `children` | `Snippet` | - | 兼容 Frame 的类型声明；Spinner 使用内置动画图形，不渲染子内容。文字请在外部组合。 |
| `class` | `string` | `''` | 自定义样式类 (如颜色) |

### Note on Color & Label
- **Color**: `Spinner` 不提供 `color` 属性。它默认继承当前文本颜色 (`currentColor`)。如需修改颜色，请使用工具类：`<Spinner class="snowui-text-blue-500" />`。
- **Label**: `Spinner` 不提供 `label` 属性。如需组合文字，请使用外部布局。

## 变体 (Variants)

| 变体名 | 描述 |
| :--- | :--- |
| `circle` | (默认) **CSS Conic Gradient** 实现的圆环，具有头尾透明度渐变效果 |
| `spokes` | 辐射线条，具有拖尾效果 |
| `pills` | 粗线条辐射，具有拖尾效果 |

## 示例

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

> **以下内容供 AI 阅读，用于维护代码与文档的关联**

## 开发者指南 (AI)

### 模块索引 (Module Index)

- **Spinner 组件**: [./Spinner.svelte](./Spinner.svelte)

---

## 更新日志 (Changelog)

- **Spinner-Docs.2026-05-25** 源码顶部历史变更记录已归档；后续新增变更统一写入本文档 Changelog，源码顶部只保留职责、当前关键架构与文档路径。

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
