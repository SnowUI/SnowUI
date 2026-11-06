# Icon

> **版本**: v2.3.4
> **职责**: 展示 SVG 图标，并统一尺寸与颜色，适合按钮、导航和内容中的视觉标识。
> **包归属**: `@snowui-design-system/components`
> **文档修订**: 2026-09-21

## 组件介绍

展示 SVG 图标，并统一尺寸与颜色，适合按钮、导航和内容中的视觉标识。

## 使用选择

<!-- usage-guide:start -->
用于统一图标宿主与尺寸。优先复用 SnowUI 资源图标；有操作行为时放入 Button 并提供可访问名称，不把装饰图形误作功能图标。

- 优先提供资源图标；src 与解析后的 icon 均未命中时才渲染 children。
- size 可继承父级尺寸；角标使用 Badge as="badge"。交互名称应提供给拥有操作的按钮。
- Accordion 内的 `Icon as="leading"` 在未显式指定 `size` 时继承 Accordion 图标尺寸：sm/md/lg 分别为 16/20/24；未声明 leading 的 Icon 不参与这项继承，显式 `size` 优先。
<!-- usage-guide:end -->

## 快速开始

以下示例展示推荐的基本组合。更多场景与组合限制见后文。

<!-- quick-start:generated -->
```svelte
<script lang="ts">
	import { Icon } from '@snowui-design-system/components';
	import { IconSet } from '@snowui-design-system/resource-svelte';
	const sizes = [12, 16, 20, 24, 28, 32, 40, 48, 80] as const;
</script>

<div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: var(--gap-4) var(--gap-3); max-width: 100%;">
{#each sizes as size}
    <Icon icon={IconSet} {size} aria-label={`Component icon, size ${size}`} />
{/each}
</div>
```
<!-- /quick-start:generated -->

## API

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| src | `string` | — | 图标图片 URL |
| icon | `Component<any>` | — | 直接渲染 resource-svelte 图标组件。 |
| stateIcon | `StateValueMap<Component<any> \| null>` | — | 根据最近父级 Frame 的 `currentState` 解析图标。未命中当前状态时回退 `Idle`，再回退 `icon` / `src` / children；状态值为 `null` 时隐藏 Icon。 |
| size | `IconSize` | — | 图标尺寸。未显式设置时，自动继承父级 `Frame` 提供尺寸上下文。 |
| background | `boolean` | `false` | 是否显示背景 |
| weight | `string` | — | 透传给图标资源的视觉权重；资源支持时可用 thin、light、regular、bold、fill、duotone。未设置时由资源或上下文决定，不会凭空生成资源缺少的变体。 |
| as | `\| "badge" \| "icon" \| "prev" \| "next" \| "close" \| (string & {})` | `"icon"` | 角色：作为独立图标、徽标、图片中央图标或 Viewer 控制图标 |
| children | `Snippet` | — | 图标内容与角标组合；仅当 src 和解析后的 icon 均未命中时渲染；可同时放入资源图标与 Badge as="badge"，角标由宿主定位。 |
| badgePosition | `"top" \| "bottom"` | `"top"` | 作为角标宿主时的位置：top 为右上，bottom 为右下。 |

未重新声明的继承能力请查所属基础组件文档；本表只列本组件源码具名公开属性。

## 使用边界与详细说明

字符串图标在真实加载期间自动显示注册尺寸的 Skeleton；加载成功或失败时退出骨架，调用方无需编写占位结构。`skeleton={false}` 可关闭该占位。

<a id="布局模型"></a>

### 布局模型

主布局模型：内禀原子布局。

- Icon 的根节点是由 `size`、`background` padding 与图标资源共同决定的内禀盒，作为其他布局子项时表现为 Hug。
- `as="leading" / "trailing" / "icon" / "badge" / "prev" / "next" / "close"` 只声明 Icon 在外部宿主中的角色；进入 Image / ImageViewer 宿主时会由宿主上下文翻译为对应 `pin-*` 方位。
- 背景、空占位、badge overlay 与图片资源渲染都是 Icon 私有结构，不对外承诺通用槽位。
- 外部需要图标加文字排列时，应由 Button、MenuItem、Frame 等宿主组件负责 gap / padding / alignment。

<a id="关键字-keyword"></a>


### `stateIcon` 解析规则

1. `Icon` 读取最近父级 Frame Context 的 `currentState`。
2. 当前状态命中 `stateIcon[currentState]` 时使用该图标。
3. 未命中当前状态时回退 `stateIcon.Idle`。
4. 仍未解析出图标时回退现有 `icon` / `src` / children 渲染规则。
5. 状态值为 `null` 时隐藏 Icon,用于 `Idle` 无图标、`Pending` 显示 Spinner 这类稳定结构状态流。
6. `stateIcon` 只影响 Icon 自身展示,不修改父 Frame 状态。

> `Load` 是 Frame loading / skeleton 协议状态名。若只是按钮任务处理中并需要展示真实 Spinner,优先使用 `Pending`。

<a id="使用示例"></a>

### 使用示例

```svelte
<!-- 基础使用 -->
<Icon src="/bell.svg" size={24} />

<!-- 基础用法 -->
<Icon size={24}>
    <Bell /> <!-- 内部图标现在自动设为 size="100%" -->
</Icon>

<!-- 子图标显式 size/weight（可生效但不推荐） -->
<Icon background class="bg-black-4">
    <Bell size={48} weight="duotone" />
</Icon>

<!-- 附加 Badge 徽标（无需 snippet 切割隔离） -->
<Icon size={32} background class="bg-black-4">
    <Badge as="badge" dot />
    <Bell />
</Icon>

<!-- 父 Frame / Button 状态驱动图标 -->
<Button Click="Active" Active={["Idle", "auto"]} whileActive={{ duration: 2000 }}>
    <Icon stateIcon={{ Idle: Paperclip, Active: Check }} />
    <Text stateText={{ Idle: "复制", Active: "已复制" }} />
</Button>

<!-- 状态流:Idle 无图标,Pending 显示 Spinner,Active 显示 Check -->
<Button
    Click={{ Idle: "Pending", Active: "Idle" }}
    Pending={["Active", "auto"]}
>
    <Icon stateIcon={{ Idle: null, Pending: Spinner, Active: Check }} />
    <Text stateText={{ Idle: "Ready", Pending: "Loading...", Active: "Completed" }} />
</Button>

<!-- 作为 Badge 附加在头像上 -->
<Avatar size={40}>
    <Icon as="badge" background class="bg-blue text-white">
        <Check />
    </Icon>
</Avatar>
```

<a id="子组件上下文-context"></a>

### 子组件上下文 (Context)

Icon 为子组件 (如 Badge 或 另一个 Icon) 提供自适应定位上下文：
- `badgeStyle`: 基于 `em` 的绝对定位样式，确保图标外缘角落对齐。
- `badgeSize`: 默认点状态尺寸 (`0.25em`)。
 - `size/weight`: Icon 容器默认透传；子图标显式传入时覆盖（不推荐）。



## AI Zone

> **更新日志 (2026-08-15)**: 内置图片与 SVG 显式拥有 block、100% 尺寸和 max-width 基线，不依赖可选 `snowui-base.css` 的媒体初始化。
> **更新日志 (2026-05-18)**: 新增 `stateIcon`，支持读取父 Frame `currentState` 后声明式切换图标。
> **更新日志 (2026-04-28)**: 标注主布局模型为内禀原子布局，明确 `as` 仅作为外部/宿主角色，不改变 Icon 内部尺寸原语语义。
> **更新日志 (2026-03-31)**: 新增 `icon` 资源组件透传能力：支持 `<Icon icon={Warning} />` 直接渲染 `resource-svelte` 图标，避免回退为默认占位块。
> **更新日志 (2026-03-10)**: 新增 Image / ImageViewer 宿主角色接入，支持 `as="icon" / "badge" / "prev" / "next" / "close"`。
> **更新日志 (2026-03-02)**: 移除 Badge 的 `mask-image` 镂空切割效果，支持 `<Badge>` 组件直接作为默认子节点嵌套。


**继承**: 复用 Frame.svelte 的所有通用能力 (交互、动效、响应式)。
**默认能力开关**: `enableResponsive=false`, `enableContext=false`。

<a id="样式规范-style-spec"></a>

### 样式规范 (Style Spec)

### 1. 默认样式 (Defaults)

| 属性 | 值 | 说明 |
|:---|:---|:---|
| **Display** | `inline-flex` | 内联弹性布局 |
| **Align** | `center` | 水平垂直居中 |
| **Position** | `relative` | 支持子组件定位 |
| **Box-Sizing** | `border-box` | 盒模型标准 |

### 2. 尺寸配置 (Sizes)

| Size | Width/Height | 用途 |
|:---|:---|:---|
| **12** | `var(--size-3)` | 微标 |
| **16** | `var(--size-4)` | 小号 |
| **20** | `var(--size-5)` | |
| **24** | `var(--size-6)` | 1.5x |
| **28** | `var(--size-7)` | |
| **32** | `var(--size-8)` | 2x |
| **40** | `var(--size-10)` | |
| **48** | `var(--size-12)` | 3x |
| **80** | `var(--size-20)` | 5x |

### 3. 背景模式与映射 (Background Mode)

当 `background` 开启时，组件会应用动态的半径和间距：

| Size | Radius | Padding |
|:---|:---|:---|
| **12, 16, 20** | `var(--radius-2)` | `var(--padding-1)` |
| **24, 28, 32** | `var(--radius-3)` | `var(--padding-1)` |
| **40** | `var(--radius-4)` | `var(--padding-2)` |
| **48** | `var(--radius-5)` | `var(--padding-2)` |
| **80** | `var(--radius-7)` | `var(--padding-3)` |

### 4. 徽标自适应定位 (Adaptive Badge Logic)

组件摒弃了像素级定位，改用 **EM 比例化绝对定位** 以适配所有尺寸跨度：

- **圆点直径 (Dot)**: `0.25em` (宿主尺寸的 25%)
- **定位原则**: 获取到绝对定位上下文后，将徽标外沿与宿主容器边缘对齐。

> **注意**: 在 v2.3.0 之后，主动取消了底层 `mask-image` 徽标切除掩膜，允许直接将 `<Badge>` 抛入 `children` 渲染，消除了因为裁切结构导致的深层层级渲染限制。

### 5. 空图标占位 (Empty Default)

当 `<Icon>` 未传入 `src` 且 `children` 插槽为空时，组件会自动渲染为一个空占位圈（用于占位或设计调试阶段）：
- **边框**: `var(--border-1)` 粗细的 `dashed` 虚线，颜色为 `var(--black-80)`。
- **背景**: `var(--black-4)`。
- **圆角**: 统一继承当前尺寸应有的 `var(--radius-1)` 渲染（随外框大小自动缩放，若无特例默认 4px）。
一旦传入了图标元素，此占位会被自动消除。


---

---

> **以下内容供 AI 阅读，用于维护代码与文档的关联**

<a id="开发者指南-ai"></a>

### 开发者指南 (AI)

### 模块索引 (Module Index)

- **Icon 组件**: [./Icon.svelte](Icon.svelte)

### 关联关系

- **父组件**: [Frame.svelte](Frame.svelte)
- **子组件**: [Badge.svelte](Badge.svelte)

---

---

> **以下内容供 AI 阅读，用于维护代码与文档的关联**

<a id="开发者指南-ai"></a>

### 开发者指南 (AI)

### 模块索引 (Module Index)

- **Icon 组件**: [./Icon.svelte](Icon.svelte)

### 关联关系

- **父组件**: [Frame.svelte](Frame.svelte)
- **子组件**: [Badge.svelte](Badge.svelte)

---

## 更新日志

### v2.3.4 (2026-10-23)

- 外部children使用独立内部名称，避免被传给Frame的同名children片段遮蔽，修复预编译运行包SSR直接子图形递归；公开Props、图形比例、尺寸与角色不变。

- 2026-09-21：统一使用文档、源码属性表与 Site / LLM 阅读入口；仅文档修订，不改变组件行为。

- **Icon-Docs.2026-05-25** 源码顶部历史更新日志已归档；后续新增变更统一写入本文档 更新日志，源码顶部只保留职责、当前关键架构与文档路径。

### v2.3.3 (2026-08-15)

#### 修复
- **IC-Base.1** 内置图片与 SVG 显式拥有 block、100% 尺寸和 max-width 基线，不依赖可选 `snowui-base.css` 的媒体初始化。

### v2.3.2 (2026-03-31)

#### 新功能
- **IC-Resource.1** 新增 `icon` 资源组件透传能力：支持 `<Icon icon={Warning} />` 直接渲染 `resource-svelte` 图标，避免回退为默认占位块。

### v2.3.1 (2026-03-10)

#### 新功能
- **IC-Role.3** Icon 新增 `Image` 宿主组合支持：`as="icon"` 通过 `pin-center` 居中覆盖，`as="badge"` 通过 `pin-top-right` / `pin-bottom-right` 显示角标。
- **IC-Role.4** Icon 新增 `ImageViewer` 宿主组合支持：`as="prev"` / `as="next"` / `as="close"` 可直接接入预览控制定位协议。

### v2.3.0 (2026-03-02)

#### 架构重构
- **IC-Badge.1** 移除了 `mask-image` 透明打孔切割特效。允许 `<Badge>` 作为普通子节点与主体直接堆叠。
- **IC-Badge.2** 简化了 DOM 结构，剔除了所有跟切割空间几何相关的无用跟踪变量计算。

#### 新功能
- **IC-Feat.3** 新增了空状态下的虚线框占位符样式。当无 `src` 且 `children` 为空时自动渲染浅色虚线框。

### v2.2.8 (2026-02-18)

#### 修复
- **IC-Fix.9** 背景尺寸语义修正：`size` 固定表示内部图标尺寸；开启 `background` 时，padding 作为外扩尺寸叠加（例如 `size=80` 时总外框为 `80 + padding*2`）。
- **IC-HTML.1** 根节点样式变量改为按需注入：默认尺寸链路下沉到 CSS，默认态不再输出内联尺寸变量。
- **IC-Role.1** 新增 Badge 角色尺寸类规则，保持 `as="badge"` 场景不受 Button icon-size 覆盖影响。

### v2.2.6 (2026-02-18)

#### 架构调整
- **IC-Arch.1** 改为单层尺寸控制：尺寸变量与 `width/height/min-size` 下沉到 `.snowui-icon`（Frame 层），wrapper 仅负责定位。
- **IC-Arch.2** 移除 `wrapperSizeClass` 尺寸类透传补丁，恢复按样式优先级由外部 class 直接覆盖 `.snowui-icon`。

### v2.2.5 (2026-02-18)

#### 修复
- **IC-Fix.8** 修复外部尺寸类不生效：将 `size-*` / `w-*` / `h-*` / `min/max-*` 尺寸工具类同步应用到 wrapper 层，确保 `<Icon class="size-80">` 可覆盖外框尺寸。

### v2.2.4 (2026-02-18)

#### 架构调整
- **IC-Bridge.1** 尺寸/排版桥接：`width`/`height`/`min-width`/`min-height`/`font-size`/`line-height` 统一改为 `--snowui-icon-*-override` 链路。
- **IC-Bridge.2** 背景模式桥接：`padding`/`border-radius`/`background-color` 统一改为 `--snowui-icon-*-override` 链路。
- **IC-Bridge.3** `style` 内仅保留变量注入与定位能力，不再直接输出动态视觉终值。

### v2.2.3 (2026-02-18)

#### 调整
- **IC-Token.1** `background=false` 时的默认值改为 `padding: var(--padding-0)` 与 `radius: var(--radius-0)`。
- **IC-Token.2** dot 徽标遮罩羽化边界由硬编码 `0.03125rem` 改为 `var(--border-1)`。

### v2.2.2 (2026-02-18)

#### 调整
- **IC-Map.1** `background` 模式 padding 全量切换到 `--padding-1/2/3`，分别对应 `16-32=>4px`、`40-48=>8px`、`80=>12px`。
- **IC-Map.2** `background` 模式 radius 映射更新为 `16-20=>--radius-2`、`24-32=>--radius-3`、`40=>--radius-4`、`48=>--radius-5`、`80=>--radius-7`。

### v2.2.0 (2026-02-07)

#### 新功能
- **IC-Feat.2** 圆角改用 CSS 变量 `--size-radius`，允许外部 class 覆盖 (如 `.rounded-full`)

### v2.2.1 (2026-02-13)

#### 修复
- **IC-Fix.7** 修正 `sizeMap` 比例错误：改为直接使用 `--size-4/5/6/7/8/10/12/20`，并在非标准尺寸场景回退到补偿计算，避免 `as="badge"` 场景徽标尺寸异常放大导致定位错位。

### v2.1.5 (2026-02-03)

#### 文档完善
- **IC-Doc.1** 补充 weight 字重说明以匹配实现

### v2.1.6 (2026-02-05)

#### 架构重构
- **Size Context**: 支持从 `Frame` 上下文读取 `size`。这不仅影响图标自身的字号（sizeRem），还会自动驱动 `background` 模式下的圆角和边距映射。

### v2.1.4 (2026-02-03)

#### 修复
- **IC-Fix.4** 背景色改为类名控制，避免内联样式覆盖外部颜色
- **IC-Fix.5** 字号使用 rem，避免根字号变化导致缩放偏差
- **IC-Fix.6** SSR 环境缺少 btoa 时跳过遮罩生成，避免渲染报错

### v2.1.3 (2026-02-03)

#### 修复
- **IC-Fix.3** dot 徽标切割采用径向遮罩，表现与 Avatar 一致

### v2.1.2 (2026-02-03)

#### 修复
- **IC-Fix.2** 子图标显式 size 覆盖时，容器字号同步生效

### v2.1.1 (2026-02-03)

#### 修复
- **IC-Fix.1** 徽标切割对 `children` 中的 Badge 也生效

### v2.1.0 (2026-02-03)

#### 新功能
- **IC-Feat.1** 子图标显式 `size`/`weight` 覆盖容器（不推荐用法）

#### 破坏性变更
- **IC-Break.1** 移除 `name` Props，`<img>` 使用空 `alt`
