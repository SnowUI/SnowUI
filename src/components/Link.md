# Link (链接)

> **内置图标统一（2026-09-11）**：功能图标的资源比例、尺寸优先级和按钮宿主遵循 [ComponentGuidelines §2.7](../../../specs/ComponentGuidelines.md#27-组件内置-icon-规范)。内置无外壳操作复用 Button bare；有padding的纯图标操作使用 iconOnly。尺寸从所属宿主继承，显式覆盖优先。


## 组件介绍

在正文、说明和导航中提供清晰的文字链接，支持箭头等视觉形式，表达可继续访问的内容。

## 内置组件双模式

- `parts.Tooltip`：配置单行截断时的内置 Tooltip。
- 自定义提示结构时使用外置 Tooltip 组合；显式 Props 高于 part。

> **版本**: v1.3.0
> **变更记录 (2026-08-15)**: Link 根节点显式移除原生下划线，不再依赖可选 `snowui-base.css` 的裸 `a` 初始化；`underline` 仍由组件公开 Prop 控制。
> **职责**: 提供正文、说明与导航中的文字链接样式。
> **设计稿**: [Workshop / Link](https://www.figma.com/design/391NQa4yf4NJIyuZ5vHbvc/Workshop?node-id=12417-11133&t=GYb3gHf9U5Ff6hcQ-4)

Link 是独立的 OSS 文字链接组件。按钮外观但点击后跳转的场景继续使用 `<Button href>`；正文文字链接、带文字箭头链接与外链图标链接使用 `<Link>`。

## 功能概览

- 所有变体默认 `color="Black40"`，hover 变为 Black100；`color="Black100"` / `"Black"` 反向变为 Black40；Indigo 等其他颜色 hover 变为 Black100。
- `arrow`：Figma 样式 2。默认颜色文字 + 内置 `ArrowUpRight` trailing Icon；文字 hover 遵守统一颜色规则，装饰箭头使用 `currentColor × opacity: 0.4 -> 1`。
- `external`：Figma 样式 3。默认颜色文字 + 内置 `ArrowSquareOut` trailing Icon；文字 hover 遵守统一颜色规则，Icon 使用 `currentColor × opacity: 0.4 -> 1`。
- `hoverColor`：可传入任意 CSS 颜色；传 `false` 时 hover 不变色。
- `underline`：支持常态下划线、仅 hover 下划线与不显示下划线。默认不显示。
- `lines={1}`：启用单行截断；仅在真实溢出时自动显示 Tooltip，完整链接文字来自共享 `TruncationController`。
- `external` 内置 trailing Icon 可由外置直系 `as="trailing"` 替换。

## API 参考

### 核心属性

| 关键字 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| variant | `"default" \| "arrow" \| "external"` | `"default"` | 链接视觉变体 |
| color | `SnowUIColor \| string` | `"Black40"` | 常态颜色；Black100 / Black（或 `var(--black-100)`）自动 hover 为 Black40，其他颜色自动 hover 为 Black100。 |
| href | `string` | - | 链接地址 |
| target | `string` | - | 链接打开方式 |
| rel | `string` | - | 链接关系 |
| disabled | `boolean` | `false` | 禁用状态；禁用后不响应 hover |
| hoverColor | `string \| false` | - | hover 文字颜色。未传时使用 color 对应的自动 hover 色；`false` 表示 hover 不变色。trailing 装饰仍按规范执行 `opacity: 0.4 -> 1` |
| underline | `"none" \| "always" \| "hover"` | `"none"` | 下划线显示策略。下划线只覆盖 Link 文字，不覆盖 trailing 装饰或 Icon |
| lines | `false \| 1` | `false` | 单行截断开关；启用后文字超出 Link 可用宽度时显示省略号 |
| tooltip | `boolean \| string \| Snippet \| Record<string, any>` | - | 截断 Tooltip。默认仅在真实截断时显示完整文字；`false` 关闭；字符串 / Snippet 自定义内容；对象透传 Tooltip 配置 |
| onTruncate | `(isTruncated: boolean) => void` | - | 真实截断状态变化回调 |
| children | `Snippet` | - | 链接文字与可选外置槽位 |

## 文字截断

Link 复用 OSS 通用 `TruncationController` 与 `fitTextToElement()`，不自行创建尺寸观察器。`lines={1}` 时控制器测量文字层并判断真实截断状态；可见前缀按实际字体宽度拟合，英文等字母文字只保留完整单词，单个单词放不下时只显示省略符；中日韩文字可退回 Unicode 字素边界，因此不会出现半个字或组合字符。显式 `…` 作为可见文字的行内尾部渲染，与最后一个完整单词 / 字之间没有额外间距。

```svelte
<Link href="/docs" lines={1} class="max-w-80">
    一段超过可用宽度的完整文档链接
</Link>

<Link href="/docs" variant="external" lines={1} tooltip={false} class="max-w-80">
    不显示截断 Tooltip 的外链
</Link>
```

## 布局模型

主布局模型：**槽位宿主布局**（三槽位：leading / content / trailing）。

通过 `<Frame row>` 输出 `data-auto-layout`，复用 [`auto-layout.css`](../styles/auto-layout.css) 的三槽位布局。默认文字作为 Content；`external` 变体的内置 `ArrowSquareOut` 作为 trailing。Snippet 中的外置直系 `as="leading"` / `as="trailing"` 会投影回 Link 根层，保持 Frame 对直系槽位的 Grid 落列、水平居中与统一 gap 规则。Link 根通过 `[data-auto-layout]` 组件级确权，将公共槽位 gap 覆盖为 `calc(var(--gap-1) / 2)`，保证内置 / 外置 leading、trailing 与文字间距均为 2px。外置 Icon 保留自身尺寸，未传 `size` 时使用 Icon 默认的 16px。

### 内置图标与替换

| variant | 默认 trailing | 替换规则 |
| :--- | :--- | :--- |
| `default` | 无 | 可按需传入外置 `as="leading"` / `as="trailing"` |
| `arrow` | `ArrowUpRight`，12 × 12px | 外置直系 `as="trailing"` 存在时隐藏内置 Icon |
| `external` | `ArrowSquareOut`，12 × 12px | 外置直系 `as="trailing"` 存在时隐藏内置 Icon |

```svelte
<Link href="/docs" variant="external">打开文档</Link>

<Link href="/docs" variant="external">
    打开文档
    <Icon as="trailing"><ArrowUpRight /></Icon>
</Link>
```

## 下划线

```svelte
<Link href="/docs" underline="always">常态下划线</Link>
<Link href="/docs" underline="hover">悬停时出现</Link>
<Link href="/docs">默认无下划线</Link>
```

下划线只应用于链接文字。`arrow` 与 `external` 的 Icon 均不绘制下划线。

## Hover 颜色

```svelte
<Link href="/docs" hoverColor="#ff4747">自定义 hover 色</Link>
<Link href="/docs" hoverColor={false}>hover 不变色</Link>
```

未传 `hoverColor` 时，颜色由 `color` 决定，与 variant 无关。主题切换时 Black40 / Black100 跟随主题。原有 CSS 颜色 override 仍作为直接样式逃生口；需要自动 hover 规则时使用 `color`，显式 `hoverColor` 高于自动结果：

| 配置 | 常态颜色 | 默认 hover 颜色 |
| :--- | :--- | :--- |
| 任意 variant，默认 color | `var(--black-40)` | `var(--black-100)` |
| 任意 variant，color="Black100" / "Black" | `var(--black-100)` | `var(--black-40)` |
| 任意 variant，color="Indigo" 等其他颜色 | 对应 Token / CSS 颜色 | `var(--black-100)` |

`arrow` 的默认 Icon、`external` 的默认 Icon 与外置 trailing Icon 均继承文字颜色，不单独切换颜色源。它们按照无底色轻量 Icon 规范使用 `opacity: 0.4 -> 1` 表达 hover 活跃度。

## 布局变量链

| 变量 | 默认来源 | 用途 |
| :--- | :--- | :--- |
| `--snowui-link-font-size` | `var(--text-14)` | 文字字号 |
| `--snowui-link-line-height` | `var(--leading-14)` | 文字行高 |
| `--snowui-link-gap` | `calc(var(--gap-1) / 2)` | 内部内容与 leading / trailing 的间距，默认 2px |
| `--snowui-link-color` | color（默认 Black40） | 默认文字颜色 |
| `--snowui-link-hover-color` | color 自动规则 / `hoverColor` | hover 文字颜色；trailing 箭头 / Icon 继承该颜色 |
| `--snowui-link-icon-size` | `var(--size-3)` | 内置 `ArrowUpRight` / `ArrowSquareOut` 尺寸，默认 12px；不覆盖外置 Icon |
| `--snowui-link-decoration-opacity` | `var(--snowui-state-opacity, 0.4)` | trailing 箭头 / Icon 常态透明度 |
| `--snowui-link-decoration-hover-opacity` | `var(--snowui-state-opacity, 1)` | trailing 箭头 / Icon hover 透明度 |

Link 根节点默认使用 `width: fit-content; max-width: 100%`，因此在 column / stretch 父容器内仍保持 Hug，trailing 会随文字宽度移动。外部显式 width、`w-full` 或 inline style 可以覆盖。

---

> **以下内容供 AI 阅读，用于维护代码与文档的关联**

## 开发者指南 (AI)

### 模块索引

| 模块 | 文件 | 职责 |
| :--- | :--- | :--- |
| Link | [Link.svelte](./Link.svelte) | 链接语义、三种视觉变体、下划线与 trailing 替换 |

### 关联关系

- **基础**：基于 Frame `row` 接入三槽位自动布局协议。
- **替换协议**：遵循 [ComponentGuidelines.md §2.7.1](../../../specs/ComponentGuidelines.md) 内置 Icon 替换规则。
- **样式规范**：[StyleSpec.md §2.4.4](../../../specs/StyleSpec.md)。
- **通用截断**：复用 [`frame-truncation.svelte.ts`](../logic/frame-truncation.svelte.ts) 的 `TruncationController`；与 Text / TableCell 共用截断检测和 `resizeManager`。
- **迁移**：原 `<Button variant="link">` 已移除；按钮式跳转继续使用 `<Button href>`。

## 更新日志 (Changelog)

### v1.3.0 (2026-09-16)

- 新增 color；所有变体默认 Black40 → Black100，Black100 → Black40，其余常态颜色 → Black100。保留 hoverColor 的显式覆盖与 false，以及其他现有 Props。
- hoverColor=false 保留通过颜色 override 设置的常态颜色。

### v1.2.3 (2026-08-15)

- Link 根节点显式声明 `text-decoration: none`，默认视觉不再依赖可选 `snowui-base.css` 的裸 `a` 初始化；公开 `underline` Prop 继续拥有下划线状态。

### v1.2.2 (2026-07-02)

- Link 默认内部 gap 恢复为 2px；修复 leading / trailing 投影残留格式空白；Link 根默认 `width: fit-content`，避免 column 父级 stretch 后 Grid 中间列扩张并把 trailing 推到最右侧。外置 Icon 继续保留自身默认尺寸。

### v1.2.1 (2026-07-02)

- Link 默认内部 gap 从 2px 调整为 4px；内置与外置 leading / trailing 统一生效。

### v1.2.0 (2026-06-23)

#### 优化
- **LINK-Truncation.4** 接入通用 `fitTextToElement()`：英文等字母文字只在完整单词边界截断，单词整体放不下时只显示省略符；中日韩文字按 Unicode 字素边界降级，避免显示半个字符。
- **LINK-Truncation.5** 使用 `measureTextForElement()` 将截断 Content 收缩到可见文字 + `…` 的真实宽度，使 trailing Icon 与省略符之间严格保持 Link 组件 gap，不残留 Content 轨道空白。

### v1.1.1 (2026-06-23)

#### 修复
- **LINK-Truncation.3** 将文字测量层、显式 `…` 尾列与 Tooltip 触发宿主拆分，避免依赖浏览器对可聚焦链接的原生 ellipsis 绘制；Link 获得焦点、鼠标按下或 Tooltip 激活时省略符保持稳定，通用 `TruncationController` 状态与检测逻辑保持不变。

### v1.1.0 (2026-06-23)

#### 新功能
- **LINK-Truncation.1** 新增 `lines={1}` 单行截断，文字真实溢出时默认通过 Tooltip 显示完整内容。
- **LINK-Truncation.2** 新增 `tooltip` 与 `onTruncate`，截断检测复用 Text / TableCell 共用的 `TruncationController`。

### v1.0.3 (2026-06-01)

#### 修复
- **LINK-Layout.4** 移除 Link 对外置 leading / trailing Icon 的尺寸覆写。内置 `ArrowUpRight` / `ArrowSquareOut` 保持 12px；外置 Icon 保留自身尺寸，未传 `size` 时使用 Icon 默认的 16px。

### v1.0.2 (2026-06-01)

#### 修复
- **LINK-Layout.1** 外置 leading / trailing 槽位投影回 Link 根层，恢复 Frame 三槽位协议的直系槽位识别、水平居中与统一 gap。
- **LINK-Layout.2** Link 的 `[data-auto-layout]` 根显式覆盖公共槽位 gap，保证内置 / 外置 Icon 与箭头统一使用 Link gap 变量。
- **LINK-Layout.3** `arrow` 改用内置 `ArrowUpRight` Icon，消除字符箭头的字体侧边留白差异。

### v1.0.1 (2026-06-01)

#### 修复
- **LINK-Hover.2** trailing 箭头、默认 Icon 与外置 trailing Icon 改为继承文字颜色，并按轻量 Icon 规范使用 `opacity: 0.4 -> 1` 表达 hover。

### v1.0.0 (2026-06-01)

#### 新功能
- **LINK-Init.1** 新增独立 OSS Link 组件，迁移原 Button Link 默认样式。
- **LINK-Variant.1** 新增 `arrow` 与 `external` 变体，对齐 Workshop Link 样式 2 / 样式 3。
- **LINK-Hover.1** 新增 `hoverColor`，支持自定义 hover 颜色与 hover 不变色。
- **LINK-Underline.1** 新增 `underline`，支持 `none` / `always` / `hover`。
- **LINK-Icon.1** `external` 内置 `ArrowSquareOut` trailing Icon，支持外置直系 trailing 替换。
