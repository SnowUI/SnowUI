# Chip.svelte 文档

> **版本**: v1.1.0
> **职责**: 标签芯片组件，用于轻量状态、分类、标签等行内信息展示。

**继承**: 复用 Frame.svelte 的所有通用能力（交互、动效、响应式）。
**默认能力开关**: `enableResponsive=true`、`enableContext=true`、`enableScaleObserver=false`。

## 组件特有属性 (Component-Specific Props)

| 属性 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| variant | `"default"` \| `"background"` | `"default"` | 视觉变体。`default` 默认显示内置 Dot；`background` 增加色块背景与 0.5px 边框，默认不显示 Dot |
| size | `"sm"` \| `"lg"` | `"sm"` | 尺寸档位。`sm` 文字 12/16；`lg` 文字 14/20 |
| showDot | `boolean` | `variant === "default"` | 是否显示内置 Dot；`background` 可通过 `showDot` 开启 |

## 关键字 (Keyword)

| 关键字 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| variant | `"default"` \| `"background"` | `"default"` | 是否带色块背景 |
| size | `"sm"` \| `"lg"` | `"sm"` | 尺寸档位 |
| showDot | `boolean` | `variant === "default"` | 是否显示内置 Dot |

## 布局模型

主布局模型：**槽位宿主布局**（三槽位：leading / content / trailing）。
通过 `<Frame row>` 输出 `data-auto-layout`，复用 [`auto-layout.css`](../styles/auto-layout.css) 的三槽位 grid 模板，子元素以 `data-as="leading" | "trailing"` 声明角色。

### 默认 Leading 图标 (Built-in)

`default` 默认带前置 Dot，`background` 默认不显示；可通过 `showDot` 显式控制：

- **形状**：内联 SVG，`viewBox 0 0 32 32`，圆心 `(16, 16)`，半径 `6`，`fill="currentColor"`
- **大小**：`sm` 12 × 12px；`lg` 16 × 16px（由 `--snowui-chip-icon-size` 变量驱动）
- **颜色**：`currentColor`，跟随父级字色

### 内置图标替换规则（强制）

遵循 [ComponentGuidelines.md §2.7.1](../../../specs/ComponentGuidelines.md)。当外部传入 `data-as="leading"`（原生 HTML）或 `as="leading"`（SnowUI 大写组件）的子元素时，组件自动隐藏内置 Dot：

```svelte
<!-- 默认：内置 Dot -->
<Chip>Label</Chip>

<!-- 替换 leading -->
<Chip>
    <Icon as="leading"><CheckCircle /></Icon>
    Label
</Chip>

<!-- 同时使用 trailing -->
<Chip>
    Label
    <Icon as="trailing"><X /></Icon>
</Chip>
```

## 颜色规则

- **默认颜色**：`color: inherit`，即继承父容器文字颜色（`currentColor`）。组件内部不内置任何颜色变体。
- **多色实现**：通过外部传入工具类（如 `text-purple`、`text-red`）或内联 `style="color: ..."` 改变 `color`。
- **背景与边框联动**：`background` 变体下，背景与边框基于 `currentColor` + 透明度自动派生：
  - 背景：`color-mix(in srgb, currentColor 10%, transparent)`
  - 边框：`inset 0 0 0 0.5px color-mix(in srgb, currentColor 20%, transparent)`（使用 inset box-shadow，避免占用布局空间）

修改文字颜色 → 背景与边框同步变化，无需额外 prop / 变量。

## 布局变量链

| 变量 | 默认来源 | 用途 |
| :--- | :--- | :--- |
| `--snowui-chip-font-size` | `var(--text-12)`（lg：`var(--text-14)`) | 文字字号 |
| `--snowui-chip-line-height` | `var(--leading-12)`（lg：`var(--leading-14)`) | 文字行高 |
| `--snowui-chip-gap` | `0` | 槽位间距（与设计稿对齐，无间距；通过外部 override 调整） |
| `--snowui-chip-icon-size` | `12px`（sm）/ `16px`（lg） | 默认 Dot 尺寸 |
| `--snowui-chip-padding` | `0`（default）/ `2px 8px`（sm+bg）/ `4px 12px`（lg+bg） | 内边距 |
| `--snowui-chip-radius` | `0`（default）/ `9999px`（background） | 圆角 |
| `--snowui-chip-bg` | `transparent` / `color-mix(... 10%)` | 背景 |
| `--snowui-chip-shadow` | `none` / `inset 0 0 0 0.5px color-mix(... 20%)` | 描边 |

## 用法示例

```svelte
<!-- 默认（仅 Dot + 文字） -->
<Chip>Label</Chip>

<!-- 大尺寸 -->
<Chip size="lg">Label</Chip>

<!-- 背景变体 -->
<Chip variant="background">Label</Chip>

<!-- 背景变体开启 Dot -->
<Chip variant="background" showDot>Label</Chip>

<!-- 大尺寸 + 背景 -->
<Chip variant="background" size="lg">Label</Chip>

<!-- 通过外部 class 改变颜色（背景与边框同步） -->
<Chip variant="background" class="text-purple">Purple</Chip>
<Chip variant="background" class="text-red">Red</Chip>

<!-- 替换 leading -->
<Chip>
    <Icon as="leading"><Star /></Icon>
    Featured
</Chip>

<!-- 添加 trailing -->
<Chip variant="background">
    Filter
    <Icon as="trailing"><X /></Icon>
</Chip>
```

## 样式规范 (Style Spec)

### 1. 基础样式（default 变体）

| 属性 | 值 |
| :--- | :--- |
| Display | `inline-flex` |
| Align | `center` |
| Color | `inherit`（继承父容器） |
| Font Size | `var(--text-12)` |
| Line Height | `var(--leading-12)` |
| Gap | `0` |
| Padding | `0` |
| Background | `transparent` |
| Border | `none` |

### 2. lg 尺寸

| 属性 | 值 |
| :--- | :--- |
| Font Size | `var(--text-14)` |
| Line Height | `var(--leading-14)` |
| Icon Size | `16 × 16px` |

### 3. background 变体

| 属性 | sm | lg |
| :--- | :--- | :--- |
| Padding | `2px 8px` | `4px 12px` |
| Border Radius | `9999px` | `9999px` |
| Background | `color-mix(in srgb, currentColor 10%, transparent)` | 同 |
| Border (inset shadow) | `0 0 0 0.5px color-mix(... 20%)` | 同 |

当 leading 或 trailing 一侧存在图标时，`sm` 该侧 padding 为 `4px`，`lg` 为 `8px`；无图标侧仍保持表中默认值。内置 Dot 也按 leading 图标处理。


---

> **以下内容供 AI 阅读，用于维护代码与文档的关联**

## 开发者指南 (AI)

### 模块索引

- **Chip 组件**: [./Chip.svelte](./Chip.svelte)

### 关联关系

- **基础**：基于 Frame `row` 接入三槽位自动布局协议
- **替换协议**：遵循 [ComponentGuidelines.md §2.7.1](../../../specs/ComponentGuidelines.md) 内置 Icon 替换规则
- **覆盖入口**：所有 padding / gap / radius / 字号等都暴露 `--snowui-chip-*-override` 变量

---

## 更新日志 (Changelog)

### v1.1.0 (2026-06-21)

#### 变更
- **CH-Icon.2** `background` 变体默认不显示 Dot，新增 `showDot` 显式开关。
- **CH-Padding.1** `background` 变体中有 leading / trailing 图标的一侧 padding 按尺寸收紧：`sm` 为 4px，`lg` 为 8px。

### v1.0.0 (2026-05-09)

#### 新增
- **CH-Init.1** 创建 Chip 组件，支持 `default` / `background` 两种视觉变体与 `sm` / `lg` 两档尺寸。
- **CH-Layout.1** 三槽位（leading / content / trailing）自动布局，复用 Frame `row` + auto-layout.css 协议。
- **CH-Icon.1** 内置 Dot leading 图标，遵循 §2.7.1 自动检测外部 `data-as="leading"` 替换。
- **CH-Color.1** 默认颜色继承父容器（`currentColor`）；`background` 变体的背景 / 边框基于 `currentColor` + 透明度自动派生（`color-mix`）。
