# Badge

> **版本**: v1.3.3
> **职责**: 用紧凑的数字、文字或圆点提示未读数量与状态，可搭配按钮、头像和导航项使用。
> **包归属**: `@snowui-design-system/components`
> **文档修订**: 2026-09-21

## 组件介绍

用紧凑的数字、文字或圆点提示未读数量与状态，可搭配按钮、头像和导航项使用。

## 使用选择

<!-- usage-guide:start -->
用于简短状态或数量提示。需要用户点击执行动作时使用 Button；输入中的可操作标签按 Chip 或 Tag 的交互选择。

- children 优先于 count；显式 `dot` 只显示圆点，不显示内容。
- 数量默认最大显示 99，零默认隐藏；使用 max / showZero 修改。Avatar 或 Icon 上的角标用 `as="badge"`。
<!-- usage-guide:end -->

## 快速开始

以下示例展示推荐的基本组合。更多场景与组合限制见后文。

<!-- quick-start:generated -->
```svelte
<script lang="ts">
	import { Avatar, Badge } from '@snowui-design-system/components';
	import { AvatarAbstract03 } from '@snowui-design-system/resource-svelte';
</script>

<div style="display: flex; align-items: center; flex-wrap: wrap; gap: var(--gap-4) var(--gap-3);">
	<Avatar fallbackColor="orange" aria-label="Release notifications" size={48}><Badge as="badge" count={5} /></Avatar>
	<Avatar fallbackColor="cyan" aria-label="Documentation inbox" size={48} badgePosition="bottom"><Badge as="badge" count={120} max={99} color="Orange" /></Avatar>
	<Avatar src={AvatarAbstract03} aria-label="New components" size={48}><Badge as="badge" count="New" color="Red" /></Avatar>
	<Avatar fallbackColor="red" aria-label="Maintainer online" size={48} badgePosition="bottom"><Badge as="badge" dot color="Green" /></Avatar>
</div>
```
<!-- /quick-start:generated -->

## API

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| variant | `"filled" \| "border"` | `"filled"` | 视觉变体。`border` 与 Kbd 默认 `border` 视觉一致：透明背景、内描边、继承文字色、0×4px padding 与 6px 圆角 |
| count | `number \| string` | — | 徽标数字或文字；数字超过 max 显示 max+，普通字符串保持原文。0 和字符串 "0" 默认隐藏，showZero 可保留；stateCount 命中状态时覆盖此值。 |
| stateCount | `StateValueMap<number \| string>` | — | 根据最近父级 Frame 状态映射 `count`，用于声明式控制 Badge 显隐 |
| dot | `boolean` | — | true 强制圆点，false 使用内容模式；未传时仅在解析后的 count 为 undefined 且没有 children 时自动显示圆点。 |
| max | `number` | `99` | 数字模式的最大值 (超过显示 max+) |
| showZero | `boolean` | `false` | false 时隐藏数值 0、字符串 "0" 及无内容的非圆点徽标；true 保留。圆点与 loading 显示不受零值隐藏控制。 |
| color | `SnowUIColor \| string` | `"Brand"` | filled 与 dot 的填充颜色，支持 PascalCase 语义色及 CSS 颜色值；filled 文字保持白色，border 内容模式仍使用透明背景与继承文字色。 |
| size | `ResourceSize` | — | 12/16/20/24/28/32/40/48/80；未指定时读取父级尺寸上下文。border 内容模式保持文字 Hug；作为 Avatar/Icon 角标时尺寸由宿主角标协议解析。 |
| children | `Snippet` | — | 自定义徽标内容，显示优先于 count；有 children 且未指定 dot 时使用内容模式，dot=true 时不渲染这些内容。 |

未重新声明的继承能力请查所属基础组件文档；本表只列本组件源码具名公开属性。

## 使用边界与详细说明

<a id="关键字-keyword"></a>

### 关键字 (Keyword)

| 关键字 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| `as` | `string` | — | 向外部宿主声明角色；"badge" 使 Icon/Avatar 按其角标协议定位并配置此 Badge，不改变其 dot/count 内容选择。 |

<a id="布局模型"></a>

### 布局模型

主布局模型：**内联外壳布局**。定义见 [../../../specs/LayoutProtocol.md §12.4](../../../specs/LayoutProtocol.md)。

Badge 的根节点是 inline-level 定位外壳，内容整体 Hug：

- 根节点保持 `inline-flex`，负责宿主定位、尺寸测量和 Frame 位移动效；默认 `flex-shrink: 0`，在窄横向容器内保留文字与内边距，不被相邻内容挤瘦。
- 内层 `.snowui-badge-surface` 负责 background / padding / radius / min-width / font-size / line-height，并作为完整视觉 Badge 承担 scale / opacity / blur 动效。
- 内部 `snowui-morph-container` 使用 Grid Stacking 保持数字变化时的布局稳定性；内容层以容器 50% 为锚点并回移自身 50%，固定尺寸小于文字最小宽度时仍以 Badge 中心为原点对称溢出，不依赖 Grid 的安全溢出回退。文字和数字均保持严格几何居中。这是 Badge 私有结构，不改变主布局模型。
- `dot` 模式仍属于内联外壳布局的特化：外壳收敛为固定点尺寸，padding 清零。
- `as="badge"` 只表示 Badge 作为 Icon / Avatar 的外层挂件角色，不改变 Badge 内部布局模型。

布局变量链：

| 变量 | 默认来源 | 用途 |
| :--- | :--- | :--- |
| `--snowui-badge-padding` | `calc(var(--padding-1) * 0.75) calc(var(--padding-1) * 1.5)` | 数字/文本模式内边距 |
| `--snowui-badge-radius` | `var(--radius-20)` | 数字/文本模式圆角 |
| `--snowui-badge-font-size` | `var(--text-12)` | 文本字号 |
| `--snowui-badge-line-height` | `1` | 数字垂直居中 |
| `--snowui-badge-dot-size` | `calc(var(--size-4) * 1.5 / 4)` | 点模式尺寸 |
| `--snowui-badge-background` | `resolveSnowUIColor(color)` | 数字和 Dot 模式的填充色 |

`variant="border"` 复用 Kbd 默认描边视觉的同一组 Token 值，但仍保持 Badge 的状态标签语义与 `<span>`/Frame 外壳：

| 属性 | `border` 值 |
| :--- | :--- |
| Padding | `var(--padding-0) var(--padding-1)`（0px 4px） |
| Radius | `calc(var(--radius-1) * 1.5)`（6px） |
| Font / Line height | `var(--text-12)` / `var(--leading-12)` |
| Background / Color | `transparent` / `inherit` |
| Border | `inset 0 0 0 var(--border-1) var(--black-10)` |

`border` 只作用于文本内容模式；`dot` 继续使用 Dot 视觉。作为 Button、SidebarItem 等宿主的后代时，`border` 保持文本 Hug，不继承宿主的固定方形尺寸上下文。
`border` 的内部 morph 文字层继承 `var(--leading-12)`，不使用 filled Badge 的紧凑 `line-height: 1`；因此可见高度与 Kbd 默认 border 一致。

`color` 使用 SnowUI 公共语意色协议，严格区分大小写：

```svelte
<Badge count={1} color="Blue" />
<Badge count={2} color="Red" />
<Badge dot color="Green" />
<Badge count="PRO" variant="border" />
```

<a id="角色化组合"></a>

### 角色化组合

```svelte
<!-- 在 Icon 中作为徽标 (必须使用命名 snippet `badge`) -->
<Icon size={24}>
    {#snippet badge()}
        <Badge as="badge" count={5} />
    {/snippet}
    <Bell />
</Icon>

<!-- 独立使用 -->
<Badge count={99} max={99} />  <!-- 显示 99+ -->
<Badge dot />                   <!-- 显示为小圆点 -->
```

<a id="智能行为"></a>

### 智能行为

1. **自动隐藏**: count 模式默认仅在数值大于等于 1 时出现；数值为 0 且 `showZero=false` 时自动隐藏，退场期间保留最后一次可见值（例如从 1 退场，不显示 0）
2. **溢出格式化**: 超过 max 自动显示为 `max+`
3. **自动内容**: 无 count 时尝试从父元素获取文本
4. **角色感知尺寸继承**:
   - **独立使用**: 自动读取父级 `Frame` (如列表项容器) 的尺寸上下文完成自适应缩放。
   - **作为徽标 (`as="badge"`)**: 忽略负级 Group 的尺寸上下文，优先保持徽标比例并由宿主（Avatar/Icon）驱动定位。

<a id="默认动效"></a>

### 默认动效

Badge 的显示 / 隐藏使用两条并行动效，与 transitions.dev Notification badge 的结构一致：

- Frame `currentState="Appear/Disappear"` 与 `whileAppear` / `whileDisappear` 负责定位外壳：出现时从左下偏移滑到锚点，退场时不反向位移。
- 内层 `.snowui-badge-surface` 是完整视觉外壳，负责 scale / opacity / blur：出现时整体从 `scale(0)`、`opacity: 0`、`blur(2px)` 回弹至正常状态；退场时以中心点将包括背景、padding 和数字在内的整个 Badge 缩小至 0。
- 内部 `.snowui-morph-container` 只负责 Grid Stacking 和内容居中，不承担出退场动效。

隐藏时 Badge 会短暂保留节点 180ms，再从 DOM 中移除。默认退场不做反向位移，只让 Badge 整体以中心点缩小、渐隐并增加模糊。`whileAppear / whileDisappear={true}` 使用 Badge 完整默认 Frame 动效；显式对象是完整视觉通道声明，只执行对象中声明的通道并继承 Badge 默认时序；传 `false` 可关闭对应 Frame 动效。`prefers-reduced-motion: reduce` 会关闭 slide / pop / blur 过渡。

私有动效变量：

| 变量 | 默认值 | 用途 |
| :--- | :--- | :--- |
| `--snowui-badge-motion-offset-x` | `-8.2px` | 外层出现位移的 X 起点 |
| `--snowui-badge-motion-offset-y` | `12.4px` | 外层出现位移的 Y 起点 |
| `--snowui-badge-motion-blur` | `2px` | Badge 整体隐藏时的模糊 |
| `--snowui-badge-motion-pop-duration` | `500ms` | Badge 整体出现 scale / blur 时长 |
| `--snowui-badge-motion-fade-duration` | `400ms` | Badge 整体出现 opacity 时长 |
| `--snowui-badge-motion-pop-close-duration` | `180ms` | Badge 整体隐藏 scale / blur 时长 |
| `--snowui-badge-motion-fade-close-duration` | `180ms` | Badge 整体隐藏 opacity 时长 |
| `--snowui-badge-motion-pop-easing` | `cubic-bezier(0.34, 1.36, 0.64, 1)` | Badge 整体出现缓动 |
| `--snowui-badge-motion-close-easing` | `cubic-bezier(0.4, 0, 0.2, 1)` | Badge 整体隐藏缓动 |



## AI Zone

**继承**: 复用 Frame.svelte 的所有通用能力 (交互、动效、响应式)。
**默认能力开关**: `enableResponsive=false`, `enableContext=false`。

<a id="样式规范-style-spec"></a>

### 样式规范 (Style Spec)

> [!IMPORTANT]
> **数字颜色**: 徽标数字/文字颜色已按用户要求制定为固定白色 **`--static-white-100`** (#FFFFFFFF)。

### 1. 基础样式 (Base Styles)

| 属性 | 值 | 说明 |
|:---|:---|:---|
| **Display** | `inline-flex` | 内联弹性布局 |
| **Align** | `center`, `justify-content: center` | 水平垂直居中 |
| **Background** | `var(--brand, #33D1FFFF)` | 默认品牌色背景 |
| **Color** | `var(--static-white-100, #ffffffff)` | **固定白色** |
| **Padding** | `--snowui-badge-padding` → `calc(var(--padding-1) * 0.75) calc(var(--padding-1) * 1.5)` | 3px 6px |
| **Font Size** | `--snowui-badge-font-size` → `var(--text-12)` | 12px |
| **Line Height** | `--snowui-badge-line-height` → `1` | 简化行高链路 |
| **Border Radius** | `--snowui-badge-radius` → `var(--radius-20)` | 胶囊形状 |
| **Min Width** | `1.125rem` | 18px |
| **Z-Index** | `10` | 确保在父元素上方 |

### 1.1 描边样式 (`variant="border"`)

描边样式与 Kbd 默认 `border` 视觉保持一致，但 Badge 继续表达状态/分类，不输出 `<kbd>` 语义。背景透明、文字继承父级颜色，并使用 1px inset shadow 表达不占布局空间的边框。

### 2. 点模式 (Dot Mode)

当 `dot` 属性启用时，Badge 切换为小圆点模式：

| 属性 | 值 |
|:---|:---|
| **Size** | `0.375rem` × `0.375rem` (6px) |
| **Padding** | `0` |
| **External Spacing** | 由父级 `gap` / `padding` 管理，组件内部不输出 `margin` |
| **Border Radius** | `var(--radius-full, 50%)` |
| **Background** | `currentColor` (继承 `--brand`) |

### 3. 布局架构 (Internal Layout)

组件内部使用 `Grid Stacking` (Morph Container) 确保布局稳定性：

- **Container**: `display: grid; grid-template: minmax(0, 1fr) / minmax(0, 1fr); place-items: start; width: 100%; height: 100%; min-width: 0; min-height: 0;`；显式的 `minmax(0, 1fr)` 禁止轨道被文字 min-content 撑大
- **Item**: 自然宽高，通过 `left/top: 50%` 与 `translate(-50%, -50%)` 围绕容器中心定位；内部继续使用 `display: flex; align-items: center; justify-content: center; text-align: center;`；filled / dot 使用 `line-height: 1`，border 继承 surface 的 `var(--leading-12)`；文字和数字均不应用额外光学偏移

---

> **以下内容供 AI 阅读，用于维护代码与文档的关联**

<a id="开发者指南-ai"></a>

### 开发者指南 (AI)

### 模块索引 (Module Index)

- **Badge 组件**: [./Badge.svelte](./Badge.svelte)

### 关联关系

- **宿主组件**: [Avatar.svelte](./Avatar.svelte), [Icon.svelte](./Icon.svelte)

---

## 更新日志

- 2026-10-05：原 Indigo 默认配色改为 Brand（`--brand`），保留原有透明度、状态与覆盖机制。


- 2026-09-21：统一使用文档、源码属性表与 Site / LLM 阅读入口；仅文档修订，不改变组件行为。

### v1.3.3 (2026-09-02)

- 根据现有源码补齐逐属性说明、默认回退和使用边界；未改变组件运行时行为。

### v1.3.2 (2026-08-28)

#### 修复
- 内容层改由 Grid 以自然宽度直接居中，并允许在 16px / 12px 固定 Badge 中围绕几何中心对称溢出，修复文本标签的光学偏移与小尺寸数字向右偏移。

### v1.3.1 (2026-07-30)

#### 修复
- Border 变体内部文字层改为继承 16px 行高，避免通用 morph-item 将实际高度压缩到 12px；PRO 标签现在与 Kbd 默认 border 高度一致。

### v1.3.0 (2026-07-30)

#### 新功能
- 新增 `variant="border"`，复用 Kbd 默认描边视觉的 Token、padding、圆角、字号与行高，用于 PRO、updated 等状态/分类标签；默认 `filled` 行为不变。

- **Badge-Motion.2026-06-18** 按 transitions.dev Notification badge 的双层结构还原默认动效：Frame 根层执行左下偏移进场，完整视觉 surface 执行中心 scale / opacity / blur；退场时 surface 整体缩小，而不是只缩放数字内容。
- **Badge-Motion.2026-06-30** 统一 `while*` 完整视觉通道语义：显式对象不再浅合并 Badge 默认 x / y / scale / opacity，只继承默认时序 / 动力学参数。

- **Badge-Docs.2026-05-25** 源码顶部历史更新日志已归档；后续新增变更统一写入本文档 更新日志，源码顶部只保留职责、当前关键架构与文档路径。

### v1.2.8 (2026-06-18)

#### 动效还原
- **BD-Motion.1** 采用定位根层 + 视觉 surface 双层结构，匹配 Notification badge 的并行 slide / pop 动效。
- **BD-Motion.2** 进场使用 260ms 位移、500ms scale/blur、400ms opacity；退场使用 180ms scale/opacity/blur，并以中心点缩小整个 Badge。
- **BD-Color.1** 新增 `color` Prop，接入公共 SnowUI PascalCase 语意色解析器并用于数字、文本和 Dot 模式填充色。

### v1.2.7 (2026-04-28)

#### 调整
- **BD-Layout.1** 按内联外壳布局协议移除组件内部 `margin` 链，点模式外部留白改由父级布局管理。

### v1.2.6 (2026-03-07)

#### 架构重构
- 释放 `whileLoad` 关键字：Badge 改用 `loading` 作为本地加载态入口，并将 `whileLoad` 透传回 `Frame` 作为加载态动效配置。

### v1.2.4 (2026-02-18)

#### 调整
- **BD-Typography.1** 组件内行高统一改为 `line-height: 1`（基础样式与 morph item）。

### v1.2.3 (2026-02-05)

#### 样式优化
- **BD-Style.2** 将数字颜色固定为白色 (`--static-white-100`)。
- **BD-Doc.1** 将组件内所有样式定义迁移至文档 `UserDefined` 区域。

### v1.2.3 (2026-02-05)

#### 修复
- **BD-Fix.2** 修复了在大尺寸下数字未居中的问题（移除强制 `line-height`）。

### v1.2.2 (2026-02-05)

#### 架构重构
- **Size Context**: 支持从 `Frame` 上下文读取 `size`。实现了角色感知（Role-aware）的继承逻辑，确保徽标在不同使用场景下均能保持正确的视觉比例。

### v1.2.0 (Initial)
- 初始版本
