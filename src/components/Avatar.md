# Avatar.svelte 文档

> **版本**: v2.4.19
> **变更记录 (2026-06-10)**: 新增 `fallback` 组件入口，允许 PRO `GradientMotion` 等视觉组件作为默认头像；补充 `as="avatar-image"` 头像图片层组合规则。
> **变更记录 (2026-05-20)**: 点击型 Avatar 补齐 `cursor: pointer`，与 hover 视觉反馈保持一致。
> **变更记录 (2026-03-10)**: 补全文档中的 hover 实现方式与样式定义，明确有图 / 首字母 / 默认回退三种 hover 分支。
> **变更记录 (2026-04-28)**: 标注主布局模型为内禀原子布局，明确头像尺寸、回退层与 badge 定位为组件私有布局。
> **变更记录 (2026-03-06)**: 恢复 Avatar 旧版 hover 视觉分层，保留 Surface 语义并关闭默认 hover 叠加层。
> **变更记录 (2026-02-05)**: 默认头像 hover 仅背景过渡，图标不变色。
> **职责**: 头像组件，显示用户头像或占位符。

**继承**: 复用 Frame.svelte 的所有通用能力 (交互、动效、响应式)。
**默认能力开关**: `enableResponsive=false`, `enableContext=false`。

## 布局模型

主布局模型：内禀原子布局。

- Avatar 的根节点只暴露一个由 `size` / 父级尺寸上下文 / `renderHints` 决定的头像盒，作为 Button、MenuItem、Field 等外部布局的子项时表现为 Hug。
- 内部图片层、首字母层、默认图标层、hover 层与 badge 切割遮罩都属于 Avatar 私有布局，不对外暴露 Leading / Content / Trailing 槽位。
- `as="badge"` 只用于 Avatar 内部识别角标角色；Avatar 自身不会输出 `data-auto-layout`，也不会接管子组件的通用排列能力。
- 外部需要排列多个头像时应使用 `AvatarGroup`，不要把 Avatar 改造成集合布局。

## 组件特有属性 (Component-Specific Props)

| 属性 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| src | string \| Component | undefined | 头像图片 URL 或图标组件 |
| size | 12\|16\|20\|24\|28\|32\|40\|48\|80 | 16 | 头像尺寸。未显式设置时，自动继承父级 `Frame` (如 `AvatarGroup`) 提供的尺寸上下文。 |
| fallback | Component | undefined | 无 `src` 或图片不可用时渲染的默认头像组件。PRO 场景可传 `GradientMotion`，Avatar 会传入 `as="avatar-image"`、`size="100%"`、`radius="inherit"` 与基于名称的 `seed`。 |
| badgePosition | 'top'\|'bottom' | 'top' | 徽章位置 |

## 关键字 (Keyword)

| 关键字 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| badgePosition | `'top' \| 'bottom'` | `'top'` | 徽章位置关键字 |
| as | `'badge'` | - | 角色化：作为容器的徽章 |
| as | `'avatar-image'` | - | 角色化：子组件作为头像图片层覆盖默认回退；适用于 `<GradientMotion as="avatar-image" />` |

## 使用示例

```svelte
<!-- 基础使用 -->
<Avatar src="/avatar.jpg" />

<!-- 使用图标资源 -->
<Avatar src={User} />

<!-- 无 src：显示默认头像图标 -->
<Avatar />

<!-- PRO 默认头像：使用 GradientMotion 作为默认头像 -->
<Avatar fallback={GradientMotion} data-name="Ada Lovelace" />

<!-- 角色化头像图片层 -->
<Avatar>
    <GradientMotion as="avatar-image" variant="random" seed="profile-42" />
    <Badge as="badge" dot />
</Avatar>

<!-- 带切割功能的 Dot Badge -->
<Avatar src="/avatar.jpg">
    <Badge as="badge" dot />
</Avatar>
```

## 智能行为

1. **默认回退**: 无图片或图片加载失败时，优先显示 `fallback` 组件；未传 `fallback` 时显示首字母；无首字母时显示默认用户图标。
2. **回退延迟**: 内部固定延迟显示回退图标，减少加载闪烁。
3. **角色识别**: 内部组件 (`Badge`, `Icon`) 若设置 `as="badge"` 将自动获得定位与尺寸逻辑。
4. **子组件定位**: 提供基于 `em` 的自适应 Context 渲染样式。
5. **智能分辨率选择**: 自动将解析后的尺寸（Resolved Size）传递给资源组件（如 `AvatarByewind`），资源组件会根据该尺寸选择 **3x 分辨率** 的高精图片（例如 80px 尺寸选择 240px 图片）。
6. **Hover 分支**: Avatar 的 hover 由组件自身维护，不走全局统一样式；根据有图、首字母、默认回退三种状态命中不同节点。

## 样式规范 (Style Spec)

### 1. 尺寸与比例 (Sizes & Scaling)

- **容器 (Width/Height)**: 使用 `--size-*` 梯度 Token（必要时补偿 `calc()`）。
- **文字 (Font Size)**: 使用 `calc(var(--text-16) * factor)`（Token + calc）。
- **行高 (Line Height)**: 统一使用 `line-height: 1`（简化排版链路）。
- **比例策略**: `size` 只控制头像容器尺寸；内部文字/默认图标按单一比例（约 `0.375`）联动。
- **Scale 兼容策略**: 默认锁定容器尺寸，避免父级 `Frame` 的 `scale apply` 级联覆盖 Avatar 宽高；如需跟随 Scale，可显式传 `sizeRatio` 或 `avatarSizeRatio`。
- **当前策略**: 纯 Token 系统。使用 `--size-*` / `--text-*` / `--leading-*` 计算，遵循 `StyleSpec` 强制规范（不再组件内干涉全局缩放系数）。

| Size (Prop) | 容器尺寸因子 | 内部文字 (约) |
|:---|:---|:---|
| **12** | `var(--size-3)` | 4.5px |
| **16** | `var(--size-4)` | 6px |
| **20** | `var(--size-5)` | 7.5px |
| **24** | `var(--size-6)` | 9px |
| **28** | `var(--size-7)` | 10.5px |
| **32** | `var(--size-8)` | 12px |
| **40** | `var(--size-10)` | 15px |
| **48** | `var(--size-12)` | 18px |
| **80** | `var(--size-20)` | 30px |

采用 **全比例系统**，确保在所有尺寸下视觉一致性：

- **徽标尺寸 (Dot Size)**: 头像容器尺寸的 `0.28` 倍 (`DOT_SIZE_RATIO = 0.28`)。
- **边框厚度 (Border)**: 徽标尺寸的 `0.1` 倍 (`DOT_BORDER_RATIO = 0.1`)。
- **定位计算**: `right/top` 偏移量等于“边框厚度”，使徽标切割区域的外沿与头像外沿对齐。
- **切除遮罩 (True Cutout)**:
  - 当子组件报告其类型为 `dot` 时，头像容器将应用 CSS Mask。
  - **切割半径**: `徽标半径 + 边框厚度`。
  - 效果：在头像背景/图片上切出一个透明圆环，让徽标悬浮具有真实层次感。

**目标**：为 `dot` 徽标在头像背景上“切出”一圈透明边框，避免徽标贴边时破坏头像形状与层级。

**实现步骤**：
1. **徽标尺寸**：`dotSize = containerSize * 0.28`。
2. **边框厚度**：`borderSize = dotSize * 0.1`。
3. **切割半径**：`cutoutRadius = (dotSize / 2) + borderSize`。
4. **切割中心**：中心点位于 `(dotSize / 2) + borderSize` 处（从边缘向内偏移）。
5. **遮罩生成**：使用 `radial-gradient` 生成透明孔洞并叠加全黑遮罩：
   - `mask-image: radial-gradient(circle at right X top Y, black 0, black R, transparent calc(R + 0.03125rem)), linear-gradient(black, black);`
   - `mask-composite: exclude`（WebKit 使用 `destination-out`）
6. **触发条件**：仅当子组件 `registerBadgeType("dot")` 且 `children` 存在时启用。

**注意**：非 `dot` 徽标不做切割，以避免内容徽标被削减边缘。

### 4. 头像所有样式规范 (All Styles)

**根容器 `.snowui-avatar`**
- `display: inline-flex`，`align-items/justify-content: center`
- `position: relative`，`overflow: visible`，`flex-shrink: 0`
- 默认圆角：`border-radius: var(--radius-full, 9999px);`（外部样式可覆盖）

**内部容器 `.snowui-avatar-container`**
- 继承根元素圆角 `border-radius: inherit`
- `overflow: hidden` + `isolation: isolate` 确保遮罩正确叠加
- 默认背景：`background-color: var(--black-4, #0000000a)`
- 默认文字颜色：`color: currentColor`
- 图片模式（`snowui-avatar-has-image`）：`background-color: transparent`

**Frame Hover 集成**
- Avatar 保留默认 `.snowui-hoverable`，继续继承点击型语义与默认点击动效。
- 组件通过自身 hover 选择器关闭 `Surface` 的默认 hover 背景叠加层，不再在 Avatar 内部定义 Frame 命名空间变量。
- Avatar 的 hover 视觉规则定义在组件内，不再放在 `src/styles/layout.css`。
- Avatar 的 hover 视觉只作用于内部视觉层或背景层，不直接改写根节点几何属性，也不使用命令式 JS 状态。
- 所有 hover 规则必须排除 `.snowui-disabled`、`[data-disabled="true"]` 与 `:disabled`。

**首字母回退 `.snowui-avatar-initials`**
- 触发条件：无图片且具备 `aria-label` / `data-name` / `title`
- 仅显示 **1 个首字母**（大写）
- 字体大小：`0.375em`（与默认图标大小一致）
- 字重：`600`
- 字体颜色：`var(--static-white-100, #ffffff)`
- 背景色：从次要色 token 随机选择（见下方 `secondaryColors` 列表）

**次要色候选 `secondaryColors`**
- `var(--secondary-purple, #7c3aed)`
- `var(--secondary-indigo, #4f46e5)`
- `var(--secondary-blue, #3b82f6)`
- `var(--secondary-cyan, #06b6d4)`
- `var(--secondary-mint, #10b981)`
- `var(--secondary-green, #22c55e)`
- `var(--secondary-yellow, #eab308)`
- `var(--secondary-orange, #f97316)`
- `var(--secondary-red, #ef4444)`

### 5. Hover 规范 (Hover Spec)

> **v2026-05-20 起 Hover 实现迁移至共享工具类**:Avatar 与 Image 共用 [`components/src/styles/layout.css`](../styles/layout.css) 中的 `.snowui-media-hoverable` 工具类家族,组件不再在 .svelte 内自定义 hover 选择器。具体行为由根类组合决定。

**根类组合规则(由组件 JS 条件挂载)**

| Avatar 状态 | 根挂的工具类组合 | hover 视觉效果(由工具类提供) |
| :--- | :--- | :--- |
| 有图模式(`isImageMode`) | `.snowui-media-hoverable` + `.snowui-media-hoverable-has-visual` | `.snowui-avatar-visual` 层 `filter: brightness(0.92)`(媒体本身压暗) |
| 首字母模式(`hasInitials` 且非有图) | `.snowui-media-hoverable` + `.snowui-media-hoverable-tinted-bg` | `.snowui-avatar-background` 层 `filter: brightness(0.92)`(有色填充背景压暗) |
| 默认回退(空 fallback) | 只挂 `.snowui-media-hoverable` | `.snowui-avatar-background` 层 `background-color: var(--black-10)`(灰底变深) |
| fallback 组件模式 | `.snowui-media-hoverable` + `.snowui-media-hoverable-has-visual` | fallback 组件作为 `.snowui-avatar-visual` 内容，视觉层 `filter: brightness(0.92)` |
| disabled | 都不挂 | 无 hover 反馈 + cursor: default |

> **两种技术分工**:`has-visual` 和 `tinted-bg` 用 `filter: brightness(0.92)` 压暗目标层(媒体或有色背景);空 fallback 用 `background-color: var(--black-10)` 替换灰底色(灰底直接改背景色最直接,brightness 在浅灰上几乎不可见)。三者完全由 layout.css 工具类家族统一管理,Avatar 组件不再自定义 hover 选择器。

**内部分层标记(由组件模板始终挂载)**

| 内部层 | 工具类标记 |
| :--- | :--- |
| `.snowui-avatar-background` | 同时挂 `.snowui-media-hoverable-background` |
| `.snowui-avatar-visual`(仅有图态 `imageStatus === "loaded"`) | 同时挂 `.snowui-media-hoverable-visual` |

**目的**:
- 兼容规则和不规则图片(brightness filter 不会染色透明区)
- 避免黑色遮罩把透明区域整块盖黑
- 只影响头像视觉层,不影响角标区域
- 首字母文本本身不变色,只让背景变暗
- 默认头像图标或回退文本不变色,只让背景加深

**覆盖入口**:`--snowui-media-hover-brightness`(默认 `0.92`,同时用于 has-visual 与 tinted-bg)

**图片层 `.snowui-avatar-image`**
- `width/height: 100%`，`object-fit: cover`
- `border-radius: inherit`

**回退内容 `.snowui-avatar-fallback`**
- `font-size: 0.375em`，`text-transform: uppercase`
- 使用 `display:flex` 居中

**默认图标 `.snowui-avatar-default-icon`**
- `width: 1em`，`height: 1em`

---

---

> **以下内容供 AI 阅读，用于维护代码与文档的关联**

## 开发者指南 (AI)

### 模块索引 (Module Index)

- **Avatar 组件**: [./Avatar.svelte](./Avatar.svelte)

### 关联关系

- **父组件**: [Frame.svelte](./Frame.svelte)
- **子组件**: [Badge.svelte](./Badge.svelte), [Icon.svelte](./Icon.svelte)

---

## 更新日志

- **Avatar-Docs.2026-05-25** 源码顶部历史变更记录已归档；后续新增变更统一写入本文档 Changelog，源码顶部只保留职责、当前关键架构与文档路径。

### v2.4.19 (2026-06-10)

#### 新功能
- 新增 `fallback` 组件入口，支持将 `GradientMotion` 等视觉组件作为默认头像。
- 新增 `as="avatar-image"` 角色化组合说明，头像图片层可覆盖默认回退并保留 badge overlay。

### v2.4.18 (2026-03-15)

#### 修复
- **AV-Docs.1** 统一代码头、文档头与 changelog 版本号为 `v2.4.18`。
- **AV-Style.8** 移除 Avatar 内部对 `--snowui-frame-hover-image-override` 的定义，改为组件自身 hover 规则关闭背景叠加，并补齐模板 `data-disabled` 输出，保持禁用态选择器与模板同步。

### v2.4.12 (2026-03-06)

#### 调整
- **AV-Hover.1** 恢复 Avatar 旧版 hover 视觉分层：图片模式压暗 `.snowui-avatar-visual`，首字母模式压暗 `.snowui-avatar-background`，默认回退模式仅做背景色过渡。
- **AV-Hover.2** 保留 `.snowui-hoverable` 语义，改用 `--snowui-avatar-hover-image-override` 的声明式覆写关闭默认 hover 叠加层。
- **AV-Hover.3** 所有 hover 规则统一排除禁用态，确保 `disabled` 时无额外 hover 反馈。

### v2.4.10 (2026-02-18)

#### 调整
- **AV-Typography.1** 组件内回退文本、首字母与根容器行高统一改为 `line-height: 1`，保留字号比例链路不变。
- **AV-HTML.1** 根节点样式变量改为按需注入：默认 `container/text` 尺寸因子由组件 CSS 提供，不再在默认态输出内联 `style`。

### v2.4.8 (2026-02-13)

#### 优化
- **AV-Style.6** 微调角标比例：`DOT_SIZE_RATIO` 调整为 `0.28`，`DOT_BORDER_RATIO` 调整为 `0.1`，确保视觉更紧凑。
- **AV-Style.7** 闭环比例计算：角标尺寸与切割中心、偏移量均通过比例常数动态计算，适配所有头像尺寸。
- **AV-Refactor.6** 代码格式化：优化 CSS 锁定类声明格式。

### v2.3.7 (2026-02-13)

#### 修复
- **AV-Fix.13** 定位并修复尺寸倍增根因：Avatar 尺寸链路中 `--text-scale` 与 `--size-scale` 参与计算后导致放大。现通过归一化计算抵消全局系数影响。
- **AV-Fix.14** 保持纯 Token 实现前提下，确保 `size` 与容器实际尺寸一致，并保留单一比例文字联动。

#### 根因说明
- `--size` 基于 `em`，而 `em` 又受组件 `font-size` 影响；同时 `--text` 与 `--size` 各自有全局 scale 系数。
- 在 Avatar 旧链路中，容器尺寸会隐式叠乘全局系数，表现为约 3 倍放大。

### v2.3.8 (2026-02-13)

#### 修复
- **AV-Fix.15** 定位到真实根因为样式优先级冲突：Avatar 根节点内联 `style` 中的 `width/height`（Level 6）覆盖了 `.snowui-avatar-lock-size`（Level 4）归一化规则，导致锁定逻辑失效。
- 调整为仅在内联样式输出组件变量，不再输出 `width/height`；宽高统一回到组件 CSS 规则计算，保证锁定类可生效并符合 `StyleSpec` 优先级体系。

### v2.3.9 (2026-02-13)

#### 修复
- **AV-Fix.16** 修复 `lock-size` 条件误判：仅当 `sizeRatio/avatarSizeRatio` 为有效数值时才跟随 scale，避免 `null/空值` 透传导致未加锁定类。
- **AV-Fix.17** 在锁定模式下同步锁定 `min/max width/height`，防止外部最小尺寸约束把头像容器撑大。

### v2.3.10 (2026-02-13)

#### 修复
- **AV-Fix.18** 容器尺寸主链路由 `--size(em)` 切换为归一化 `--text` 长度链路，避免 `em` 在复杂上下文中被额外 font-size 影响而出现倍增。
- **AV-Fix.19** 回退文字与首字母字号同步使用归一化 `--text` 链路，继续保持与头像容器的单一比例（约 0.375）。

#### 说明
- 当 Token 基准 `--size` 以 `em` 定义时，理论上会受当前元素最终 `font-size` 影响；在存在外部样式或级联覆盖时，可能与预期比例发生偏移。
- 当前实现仍属于纯 Token 方案（未引入 px 常量），但改用更稳定的归一化长度基准来保证 Avatar 容器语义尺寸稳定。

### v2.4.0 (2026-02-13)

#### 修复
- **AV-Fix.20** 最终收敛到“固定尺寸语义 Token”方案：Avatar 容器尺寸改为 `var(--size-fixed) * factor`，文本改为 `var(--text-fixed) * factor`。
- **AV-Fix.21** `tokens.css` 新增 `--size-fixed`（4px）与 `--text-fixed`（16px）作为组件内“绝对语义”基准，避免宿主页面修改 `html font-size` 时 Avatar 尺寸随之放大。

#### 关键说明（为何此前纯 Token 链路无法稳定）
- 现有基础 Token `--size` 使用 `em`，`--text` 使用 `rem`。当宿主页面存在根字号放大时，Avatar 的 16/20/24 等“固定像素语义”会被整体放大。
- 因此，在不回退到组件内硬编码 `px` 的前提下，需要在 Token 层提供“绝对语义基准”并由 Avatar 使用。

### v2.4.1 (2026-02-13)

#### 修复
- **AV-Fix.22** 增加内联尺寸硬锁（仍基于 Token 变量）：根节点内联输出 `font-size/width/height/min/max`，确保外部级联无法改写 Avatar 容器语义尺寸。

#### 调试标记
- 根节点新增 `data-avatar-version="2.4.1-inline-lock"`，用于确认页面是否加载到最新 Avatar 实现。

### v2.4.2 (2026-02-13)

#### 规范回归
- **AV-Refactor.3** 移除临时调试用内联尺寸硬锁与版本标记，恢复为组件 CSS（Level 2/4）控制尺寸，符合 `StyleSpec.md` 优先级规范。
- 保留 Token 语义方案：容器与文字继续使用 `tokens.css` 中的固定语义基准变量（`--size-fixed` / `--text-fixed`）进行计算。

### v2.4.3 (2026-02-13)

#### 规范修正
- **AV-Refactor.4** 移除 `--size-fixed` / `--text-fixed` 方案，回归标准 Token：`--size` / `--text`。
- 继续保留归一化计算（抵消 `--size-scale` / `--text-scale`）与 `lock-size` 策略，确保尺寸稳定且符合 `StyleSpec`。

### v2.4.4 (2026-02-13)

#### 规范修正
- **AV-Refactor.5** 移除 Avatar 中对 `--size-scale` / `--text-scale` 的直接计算，改为仅使用标准基准 Token `--size` / `--text` 参与尺寸与字号计算。

### v2.4.5 (2026-02-13)

#### 修复
- **AV-Fix.23** 调整 Avatar 角标上下文默认 dot 尺寸，使 `<Badge as="badge" />` 在 Avatar 中与 Badge 单独使用的默认点尺寸保持一致，避免出现“Avatar 内点徽标尺寸偏差”。

### v2.4.6 (2026-02-13)

#### 修复
- **AV-Fix.24** `Badge as="badge"` 在 Avatar 内改为按头像容器尺寸等比缩放：默认 `badgeSize` 由固定值改为 `containerSize * ratio`。
- **AV-Fix.25** 同步调整 Avatar dot cutout 的遮罩半径与定位计算，确保缩放后徽标与切割位置保持一致。

### v2.4.7 (2026-02-13)

#### 修复
- **AV-Fix.26** 恢复切割边框视觉粗细：将 dot 边框厚度改为随 dot 尺寸同比缩放，并沿用旧版粗细比例（`0.04 / 0.25 = 0.16`）。
- **AV-Fix.27** `badgeStyle` 的 top/right inset 与 cutout 半径统一改为同一边框比例链路，避免大尺寸头像下边框显得过细。

### v2.3.6 (2026-02-13)

#### 重构
- **AV-Refactor.1** 按需求回退到纯 Token 实现：移除 `px` 尺寸变量，恢复 `width/height/font-size` 的 Token 计算链路。
- **AV-Refactor.2** 保持 `size` 语义不变（控制头像容器尺寸）以及单一比例（约 `0.375`）的文本联动。

### v2.3.5 (2026-02-13)

#### 修复
- **AV-Fix.12** 进一步屏蔽全局缩放系数影响：Avatar 容器尺寸与回退文字尺寸统一改为 `px` 变量驱动，避免 `--size-scale`/`--text-scale` 引发的倍数放大。
- **比例保持**: 容器与文字继续使用单一比例（约 `0.375`）联动，满足“近似比例”要求。

#### 说明
- 在 SnowUI 里，`--size`/`--text` 是可被全局系数放大的 Token。如果主题或容器环境修改了 `--size-scale`/`--text-scale`，纯 Token 映射会按设计同比放大。
- 若业务要求 Avatar 尺寸始终等于传入 `size`（绝对像素），需要像当前方案一样走组件内绝对尺寸变量，或新增“不受全局 scale 影响”的专用 Token。

### v2.3.4 (2026-02-13)

#### 修复
- **AV-Fix.11** 按排查策略先屏蔽 Scale：将 Avatar 容器宽高改为内联 `style` 输出，阻断父级 `.snowui-scale` 对 `.snowui-avatar` 宽高的级联覆盖。
- **规范说明**: 内联样式仅用于 `width/height` 动态尺寸，符合 `StyleSpec.md` 2.9 允许场景。

### v2.3.3 (2026-02-13)

#### 修复
- **AV-Fix.10** 修复父级 `Frame` 开启 `scale apply` 时 Avatar 被级联放大的问题：默认启用容器尺寸锁定，保持 `size` 语义稳定。
- **兼容增强**: 当显式传入 `sizeRatio` 或 `avatarSizeRatio` 时，Avatar 允许跟随 Scale 链路。

### v2.3.2 (2026-02-13)

#### 修复
- **AV-Fix.8** 修复头像容器尺寸异常放大（约 3x）问题：容器尺寸改为 `size` 到 Token 因子的直接映射（`size / 4`）。
- **AV-Fix.9** 统一头像与文字的比例链路：内部文字/默认图标改为单一比例变量（约 `0.375`）驱动。
- **语义澄清**: `size` 明确表示头像容器尺寸，不等同于图片素材分辨率尺寸。

### v2.3.1 (2026-02-13)

#### 修复
- **AV-Fix.7** 修正了 Token 联动下的比例系数计算错误，彻底解决了 3x 漂移顽疾。
- **规范适配**: 移除内联 `font-size: 1rem`，改由 CSS 锚定以对齐 `StyleSpec.md` 2.9。

#### 重构
- **Token 对齐**: 全面回归 `tokens.css` 体系。
- **规范适配**: 遵循 `StyleSpec.md` 的权重、优先级与单位规范。
- **锚点锁定**: 修复 3x 漂移顽疾，通过 `font-size: 1rem` 锚定 `em` 基准。
- **比例优化**: 调整内部比例为 32:12 (0.375)。

### v2.2.0 (2026-02-12)

#### 重构
- 支持等比缩放：锁定头像与文字比例为 0.625
- 规范单位使用：头像大小使用 em，文字大小使用 rem
- 移除硬编码 sizeMap

### v2.1.25 (2026-02-05)

#### 样式优化
- **AV-Style.5** 默认头像 hover 仅背景过渡，图标不变色；图片模式滤镜仅在图片模式触发

### v2.1.26 (2026-02-05)

#### 架构重构
- **Size Context**: 支持从 `Frame` 上下文读取 `size`。当未显式传入 `size` 属性时，将自动使用上下文尺寸。
- **高分适配**: 修正了资源组件（Resource Component）的尺寸传递逻辑，确保 3x 高清资源能根据实际显示尺寸正确加载。

### v2.1.15 (2026-02-03)

#### 修复
- **AV-Fix.6** 移除跨组件内部变量写入，避免命名冲突

### v2.1.14 (2026-02-03)

#### 修复
- **AV-Fix.5** AvatarGroup 相关内部变量命名对齐 snowui 规范

### v2.1.13 (2026-02-03)

#### 修复
- **AV-Fix.4** 仅在显式 size 时写入 AvatarGroup 尺寸变量，避免影响间距计算

### v2.1.12 (2026-02-03)

#### 修复
- **AV-Fix.3** 修复 size 检测导致的运行时递归问题

### v2.1.11 (2026-02-03)

#### 新功能
- **AV-Feat.1** 当未显式传入 `size` 时，允许 AvatarGroup 的 `size` 作为默认尺寸

### v2.1.10 (2026-02-03)

#### 修复
- **AV-Fix.2** 仅在存在样式时输出 `style`，避免空属性

### v2.1.9 (2026-02-03)

#### 修复
- **AV-Fix.1** 尺寸映射改为使用 `--size-*` Token 变量

### v2.1.8 (2026-02-03)

#### 样式优化
- **AV-Style.4** 首字母回退改为单字母，字号与默认图标一致，背景色来自次要色 token，文字使用 static white

### v2.1.1 (2026-02-03)

#### 样式优化
- **AV-Style.3** 图片模式移除容器底色，Hover 仅作用图像

### v2.1.0 (2026-02-03)

#### 样式优化
- **AV-Style.2** Hover 改为图像亮度滤镜，适配不规则图形

### v2.0.0 (2026-02-03)

#### 破坏性变更
- **AV-Break.1** 移除 `variant` / `alt` / `fallback` / `delayMs` Props，统一由内部规则与外部样式控制

#### 样式优化
- **AV-Style.1** 明确默认圆角为 `50%`，外部样式可覆盖

#### 文档完善
- **AV-Doc.1** 更新样式与行为说明以匹配新 API
