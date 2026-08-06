# Avatar.svelte 文档

> **版本**: v2.12.0
> **变更记录 (2026-08-06)**: 默认 Gradient 头像常态改为轻量共享静态图；仅 hover 或 `gradientMotion` 开启时挂载完整 Gradient 组件，降低长表格中的组件、响应式状态与 SVG 资源开销。
> **变更记录 (2026-08-03)**: 修复外部 Badge / Icon 子内容被内部 Frame 片段遮蔽的问题；Avatar 根盒统一使用中线对齐，确保 `empty` 与图片、Gradient 头像同排等高。
> **变更记录 (2026-08-03)**: 默认 Gradient 头像 hover 使用七段非对称路径；每次进入随机切换且不重复上一组相位 / 方向配置。
> **变更记录 (2026-08-02)**: 默认头像改为随机 Gradient；原灰色用户图标改为 `empty` 空头像变体；Avatar 单色 hover 通过像素 alpha 仅叠加实际图形。
> **变更记录 (2026-08-02)**: Avatar 默认 hover 使用单层 Overlay；每次进入随机六色之一，同一次 hover 内颜色不变，默认文字与用户图标位于叠加层上方。
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
- Avatar 作为 inline-level 原子盒时统一使用中线对齐，内部图片、Gradient 与 `empty` 图标不得改变同排头像的垂直位置。
- 内部图片层、默认 Gradient / empty 图标层、hover 滤镜与 badge 切割遮罩都属于 Avatar 私有布局，不对外暴露 Leading / Content / Trailing 槽位。
- `as="badge"` 只用于 Avatar 内部识别角标角色；Avatar 自身不会输出 `data-auto-layout`，也不会接管子组件的通用排列能力。
- 外部需要排列多个头像时应使用 `AvatarGroup`，不要把 Avatar 改造成集合布局。

## 组件特有属性 (Component-Specific Props)

| 属性 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| src | string \| Component | undefined | 头像图片 URL 或图标组件 |
| size | 12\|16\|20\|24\|28\|32\|40\|48\|80 | 16 | 头像尺寸。未显式设置时，自动继承父级 `Frame` (如 `AvatarGroup`) 提供的尺寸上下文。 |
| fallback | Component | undefined | 无 `src` 或图片不可用时渲染的自定义头像组件；未传时默认内置 Gradient。PRO 场景可传 `GradientMotion`，Avatar 会传入 `as="avatar-image"`、`size="100%"`、`radius="inherit"` 与基于名称的 `seed`。 |
| variant | `'default' \| 'empty'` | `'default'` | `default` 使用按实例 / 名称稳定分散的 Gradient 配色；`empty` 使用灰色背景与默认用户图标。 |
| gradientMotion | boolean | false | 是否常驻运行默认 Gradient fallback 的四层基础矢量形变；为 false 时 Gradient 仍会在 hover 期间按需运行水波形变和多色 Overlay |
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

<!-- 无 src：显示默认随机 Gradient 头像 -->
<Avatar />

<!-- 显式开启默认 Gradient 的基础矢量形变 -->
<Avatar gradientMotion />

<!-- 空头像：显示灰色背景与用户图标 -->
<Avatar variant="empty" />

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

1. **默认回退**: 无图片或图片加载失败时，优先显示显式 `fallback` 组件；未传时 `default` 使用 Gradient，`empty` 使用灰色用户图标。名称只作为 Gradient seed，不再生成首字母；Gradient 常态基础形变默认关闭，可用 `gradientMotion` 常驻开启，或由 hover 按需运行。
2. **回退延迟**: 内部固定延迟显示回退图标，减少加载闪烁。
3. **角色识别**: 内部组件 (`Badge`, `Icon`) 若设置 `as="badge"` 将自动获得定位与尺寸逻辑。
4. **子组件定位**: 提供基于 `em` 的自适应 Context 渲染样式。
5. **智能分辨率选择**: 自动将解析后的尺寸（Resolved Size）传递给资源组件（如 `AvatarByewind`），资源组件会根据该尺寸选择 **3x 分辨率** 的高精图片（例如 80px 尺寸选择 240px 图片）。
6. **默认 Hover**: 非 disabled 图片与普通组件头像每次进入时随机选择 blue / cyan / green / red / orange / purple 之一，并只对实际图形 alpha 单层叠加；Gradient fallback 无论常态基础形变是否开启，都保持原有五色循环，并按需运行不同周期的四层水波形变。

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

**Avatar Hover 集成**
- 非 disabled 根节点挂 `.snowui-avatar-interactive`，由 Avatar 自身提供 pointer cursor 与单层颜色 Overlay；默认 Gradient 头像是唯一例外，恢复认可版本的 `.snowui-media-hoverable` / `.snowui-media-hoverable-has-visual` 与 `brightness(0.92)` 组合。
- Overlay 位于 `.snowui-avatar-container` 内、完整视觉内容上方和外部 Badge 下方，继承头像圆角与裁切。
- 每次 pointer enter 从六种 Gradient 中心主色中等概率随机选择一种；同一次 hover 内不运行颜色变化动画。
- Avatar 单色 Overlay 通过 SVG alpha composite 只作用于图片或组件实际绘制的非透明图形，透明区域保持不变；fallbackText 与 empty 用户图标不参与染色。
- Gradient fallback 自行拥有多色循环 hover，并在常态静态模式下按需淡入实时 SVG 水波形变；Avatar 不再对其重复叠加单色层。
- 只过渡一个小画布纯色层的 opacity，默认峰值 `58%`、入口 / 退出 `0.5s`。
- 所有 hover 规则排除 `.snowui-disabled`、`[data-disabled="true"]` 与 `:disabled`；reduced-motion 下关闭淡入淡出并保留静态随机色反馈。

**默认 / 空头像**
- `default`：常态直接渲染按 seed 选择的共享 Gradient 静态图，seed 优先使用 `aria-label` / `data-name` / `title`，无名称时使用实例 ID，使同屏默认头像自然分散到六种配色。完整 Gradient 组件只在 hover 期间按需挂载并在退出动效完成后释放；`gradientMotion` 开启时保持常驻。
- `empty`：保留 `var(--black-4)` 灰色背景与 resource-svelte `user` 图标，明确表达尚无头像内容。

### 5. Hover 规范 (Hover Spec)

| 状态 | 默认效果 |
| :--- | :--- |
| 图片 / Component src | 每次进入随机六色之一，通过 alpha composite 只叠加实际非透明图形 |
| fallback 组件 | Avatar 单色层只染实际图形；Gradient fallback 改由 Gradient 自身播放多色循环 |
| fallbackText / empty 用户图标 | 不叠加颜色，保持原色 |
| disabled | 不创建可运行 hover 状态，不显示 Overlay，cursor 为 default |

覆盖入口：`--snowui-avatar-hover-entry-duration`（默认 `0.5s`）、`--snowui-avatar-hover-entry-easing`、`--snowui-avatar-hover-color-opacity`（默认 `0.58`）。

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

### v2.12.0 (2026-08-06)

- 默认 Gradient fallback 常态不再为每个 Avatar 创建完整 Gradient 组件、实例 ID、hover 状态与响应式派生链，只渲染共享静态图。
- hover 时按需挂载完整 Gradient 水波与五色 Overlay，退出 0.5 秒后回收；`gradientMotion` 继续显式常驻完整 Gradient。
- 静态图使用原生 lazy loading、异步解码和低请求优先级，长表格只优先处理视口附近头像。

### v2.11.1 (2026-08-03)

- 修复外部传入的 Badge / Icon 子内容被内部 Frame `children` 片段同名遮蔽、未进入 DOM 的问题。
- Avatar 根盒统一使用 `vertical-align: middle`，使 `empty`、图片与 Gradient 头像在同一行保持一致的垂直位置。

### v2.11.0 (2026-08-03)

- 默认 Gradient fallback 的四层水波改为七段非对称闭环路径，避免可见的 A→B→A 原路折返。
- 每次 hover 从六组相位 / 方向组合中随机选择且不重复上一组；不增加活动图层、filter 或逐帧 JavaScript。

### v2.10.0 (2026-08-02)

- 默认 Gradient Avatar 常态继续使用缓存静态图，hover 时由 Gradient 按需淡入四层独立周期的水波形变；离开后释放实时 SVG 与 filter。
- `gradientMotion` 语义收窄为“是否常驻运行”，不再阻止默认 hover 的按需水波形变。

### v2.9.1 (2026-08-02)

- 默认 Gradient fallback 的四层基础矢量形变改为关闭，新增 `gradientMotion` 显式开启入口。
- Gradient 自有的认可版本五色 Overlay hover 不受基础形变开关影响。

### v2.9.0 (2026-08-02)

- 根据认可版本的原始运行条件，默认 Gradient 头像恢复 `.snowui-media-hoverable`、`.snowui-media-hoverable-has-visual` 与 `.snowui-media-hoverable-visual` 三层契约。
- Gradient 重新位于普通 visual 容器内并同时获得旧版 `brightness(0.92)` 反馈；仍跳过 Avatar 当前的单色 alpha filter，图片、Logo 与其他 fallback 保持现状。

### v2.8.0 (2026-08-02)

- 默认 Gradient fallback 改用专用直连渲染路径，不再经过普通 `.snowui-avatar-visual` 与 Avatar SVG 单色滤镜合成层。
- Gradient 直接成为圆形裁切容器的视觉内容；Avatar 只负责尺寸、最外层裁切、hover 状态与 Badge，Gradient 自行管理 SVG、颜色顺序和双层 Overlay。
- 图片、Logo 与其他组件 fallback 继续使用 Avatar 原有 visual / alpha filter hover，不受此分支影响。

- **Avatar-Docs.2026-05-25** 源码顶部历史变更记录已归档；后续新增变更统一写入本文档 Changelog，源码顶部只保留职责、当前关键架构与文档路径。

### v2.7.0 (2026-08-02)

- 删除自动首字母生成；无显式图片 / fallback / fallbackText 时默认渲染按名称或实例 seed 分散配色的 Gradient。
- 新增 `variant="empty"`，承接原灰色背景与用户图标空头像视觉。
- Avatar 单色随机 hover 改用 SVG flood + alpha composite，只染图片或普通组件实际绘制的非透明像素。
- Gradient fallback 恢复自身多色循环，Avatar 对其跳过单色滤镜，避免双重叠加。

### v2.6.0 (2026-08-02)

- 默认 hover 从五色双层持续循环简化为单层 Overlay；每次 pointer enter 随机六色之一，同一次 hover 内颜色固定。
- 每次 pointer enter 都独立从六种颜色中等概率抽取，同一次 hover 内颜色固定。
- 默认首字母、fallbackText 和用户图标提升到 Overlay 上方，避免文字与图标被染色。
- 删除十层 opacity 动画，只保留一个 0.5s opacity 过渡层。

### v2.5.0 (2026-08-02)

- 将 Gradient avatar-image 专用 hover 完整迁移到 Avatar，作为所有 Avatar 视觉状态的默认 hover。
- 删除 Avatar 对共享 media-hoverable brightness / 背景加深分支的消费，避免双重反馈。
- Avatar 自行管理随机五色、双层 Overlay、10s 循环、0.5s 入口缓冲、disabled 与 reduced-motion。

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
