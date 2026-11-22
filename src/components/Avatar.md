# Avatar

> **版本**: v2.12.5
> **职责**: 展示用户或团队头像，支持图片、文字和渐变占位，让列表、评论与成员信息更易辨认。
> **包归属**: `@snowui-design-system/components`
> **文档修订**: 2026-09-21

## 组件介绍

展示用户或团队头像，支持图片、文字和渐变占位，让列表、评论与成员信息更易辨认。

## 使用选择

<!-- usage-guide:start -->
用于用户或团队身份。单个头像用 Avatar，重叠成员用 AvatarGroup；纵向联系人列表使用 Avatar 配合普通列表和文本。

- 通过 src 显示头像，使用 fallback / fallbackText 配置回退；为同一身份提供稳定 fallbackSeed。
- 附属角标用 `as="badge"`，替换头像视觉用 `as="avatar-image"`；尺寸优先使用显式 size，其次父级头像尺寸。
<!-- usage-guide:end -->

## 快速开始

以下示例展示推荐的基本组合。更多场景与组合限制见后文。

<!-- quick-start:generated -->
```svelte
<script lang="ts">
	import { Avatar } from '@snowui-design-system/components';
	import { AvatarByewind, SnowLogo } from '@snowui-design-system/resource-svelte';
</script>

<div style="display: flex; align-items: center; flex-wrap: wrap; gap: var(--gap-4) var(--gap-3);">
	<Avatar fallbackColor="blue" aria-label="Blue default avatar" size={48} />
	<Avatar fallbackColor="cyan" aria-label="Cyan default avatar" size={48} />
	<Avatar fallbackColor="green" aria-label="Green default avatar" size={48} />
	<Avatar fallbackColor="red" aria-label="Red default avatar" size={48} />
	<Avatar fallbackColor="orange" aria-label="Orange default avatar" size={48} />
	<Avatar fallbackColor="purple" aria-label="Purple default avatar" size={48} />
	<Avatar src={SnowLogo} dataName="SnowUI logo" size={48} />
	<Avatar src={AvatarByewind} dataName="ByeWind" size={48} />
</div>
```
<!-- /quick-start:generated -->

## API

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| src | `string \| Component` | — | 头像图片 URL 或图标组件 |
| size | `ResourceSize` | — | 头像尺寸档位为 12/16/20/24/28/32/40/48/80；显式值优先，其次父级头像或通用尺寸上下文，无上下文时为 16。 |
| fallback | `Component` | — | 无 `src` 或图片不可用时渲染的自定义头像组件；未传时默认内置 Gradient。动效头像场景可传 `GradientMotion`，Avatar 会传入 `as="avatar-image"`、`size="100%"`、`radius="inherit"` 与解析后的稳定 `seed`。 |
| fallbackText | `string` | — | 图片不可用时显示的显式回退文字；去除首尾空格，非空时替代默认 Gradient，显式 fallback 组件仍优先。不会从姓名自动生成首字母。 |
| fallbackColor | `GradientVariant` | — | 显式选择默认 Gradient 的具名艺术配色；优先级高于 `fallbackSeed` 和名称回退。 |
| fallbackSeed | `string \| number` | — | 稳定身份种子，推荐传入 `user.id`；组件以确定性哈希映射到六种具名配色，相同 seed 始终得到相同颜色，无需持久化颜色字段。 |
| variant | `AvatarVariant` | `"default"` | 默认样式使用稳定身份 seed 或显式具名颜色的 Gradient 配色；空头像样式使用灰色背景与默认用户图标。 |
| backgroundBlur | `boolean` | `false` | 开启头像背景模糊，与Button共享20px默认强度，仅作用于背景，不模糊头像内容。 |
| gradientMotion | `boolean` | `false` | 是否常驻运行默认 Gradient fallback 的四层基础矢量形变；为 false 时 Gradient 仍会在 hover 期间按需运行水波形变和多色 Overlay |
| children | `Snippet` | — | 头像附属内容；as="badge" 声明角标，as="avatar-image" 声明外置头像视觉并覆盖默认回退层。 |
| badgePosition | `"top" \| "bottom"` | `"top"` | as="badge" 子内容定位在头像右上或右下；Dot 角标同时参与头像切割。 |

未重新声明的继承能力请查所属基础组件文档；本表只列本组件源码具名公开属性。

## 使用边界与详细说明

字符串图片在真实加载期间自动显示圆形 Skeleton；加载成功显示图片，失败显示现有回退。页面不需要自行编写占位；显式 `skeleton={false}` 可沿用 Frame 协议关闭骨架。

<a id="布局模型"></a>

### 布局模型

主布局模型：内禀原子布局。

- Avatar 的根节点只暴露一个由 `size` / 父级尺寸上下文 / `renderHints` 决定的头像盒，作为 Button、MenuItem、Field 等外部布局的子项时表现为 Hug。
- Avatar 作为 inline-level 原子盒时统一使用中线对齐，内部图片、Gradient 与 `empty` 图标不得改变同排头像的垂直位置。
- 内部图片层、默认 Gradient / empty 图标层、hover 滤镜与 badge 切割遮罩都属于 Avatar 私有布局，不对外暴露 Leading / Content / Trailing 槽位。
- `as="badge"` 只用于 Avatar 内部识别角标角色；Avatar 自身不会输出 `data-auto-layout`，也不会接管子组件的通用排列能力。
- 外部需要排列多个头像时应使用 `AvatarGroup`，不要把 Avatar 改造成集合布局。

<a id="关键字-keyword"></a>

### 使用示例

```svelte
<!-- Basic usage -->
<Avatar src="/avatar.jpg" />

<!-- Resource icon component -->
<Avatar src={User} />

<!-- Deterministic palette from stable user ID -->
<Avatar fallbackSeed={user.id} aria-label={user.name} />

<!-- Explicit named fallback palette -->
<Avatar fallbackColor="purple" aria-label="SnowUI member" />

<!-- Deterministic blue fallback when no identity is provided -->
<Avatar />

<!-- Enable vector morph animation on default Gradient -->
<Avatar gradientMotion />

<!-- Empty avatar state with user icon -->
<Avatar variant="empty" />

<!-- Animated fallback avatar using GradientMotion -->
<Avatar fallback={GradientMotion} data-name="Ada Lovelace" />

<!-- Explicit image child role -->
<Avatar>
    <GradientMotion as="avatar-image" variant="random" seed="profile-42" />
    <Badge as="badge" dot />
</Avatar>

<!-- Attached dot badge -->
<Avatar src="/avatar.jpg">
    <Badge as="badge" dot />
</Avatar>
```

<a id="智能行为"></a>

### 智能行为

1. **默认回退**: 无图片或图片加载失败时，优先显示显式 `fallback` 组件；未传时 `default` 使用 Gradient，`empty` 使用灰色用户图标。默认 Gradient 的选择优先级为 `fallbackColor` → `fallbackSeed` → `aria-label` / `data-name` / `title` → 固定 `blue`。推荐把稳定 `user.id` 传给 `fallbackSeed`；哈希结果跨刷新稳定，不需要存储颜色。名称只作为兼容 seed，不生成首字母；Gradient 常态基础形变默认关闭，可用 `gradientMotion` 常驻开启，或由 hover 按需运行。
2. **回退延迟**: 内部固定延迟显示回退图标，减少加载闪烁。
3. **角色识别**: 内部组件 (`Badge`, `Icon`) 若设置 `as="badge"` 将自动获得定位与尺寸逻辑。
4. **子组件定位**: 提供基于 `em` 的自适应 Context 渲染样式。
5. **智能分辨率选择**: 自动将解析后的尺寸（Resolved Size）传递给资源组件（如 `AvatarByewind`），资源组件会根据该尺寸选择 **3x 分辨率** 的高精图片（例如 80px 尺寸选择 240px 图片）。
6. **默认 Hover**: 非 disabled 图片与普通组件头像每次进入时随机选择 blue / cyan / green / red / orange / purple 之一，并只对实际图形 alpha 单层叠加；Gradient fallback 无论常态基础形变是否开启，都保持原有五色循环，并按需运行不同周期的四层水波形变。

图片与普通组件 fallback 的六色 hover Overlay 是 [StyleSpec §2.1.3](../../../docs/standards/StyleSpec.md#213-专业艺术色例外强制) 为 Avatar 单独登记的专业艺术色例外：颜色由 Avatar 私有 hover 视觉拥有，不映射为 SnowUI 通用 Token。默认 Gradient 画面的固定配色由 [Gradient](Gradient.md#专业艺术色例外) 自己的例外登记拥有；作为 fallback 使用 [GradientMotion](GradientMotion.md#专业艺术色例外) 时，其 shader 画面颜色同样由 GradientMotion 自己拥有。三项例外都不扩展到 Avatar 的尺寸、排版、常规背景、状态、公开通用颜色入口或样式优先级。


### 背景模糊

`<Avatar variant="empty" backgroundBlur />` 可用于覆盖滚动内容的顶部栏。与Button一样默认关闭，显式开启后使用共享控制项模糊样式；默认20px，可通过`--snowui-avatar-background-blur-override`覆盖。实色图片会遮住其后模糊效果。

## AI Zone

**继承**: 复用 Frame.svelte 的所有通用能力 (交互、动效、响应式)。
**默认能力开关**: `enableResponsive=false`, `enableContext=false`。

<a id="样式规范-style-spec"></a>

### 样式规范 (Style Spec)

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
- Gradient fallback 自行拥有多色循环 hover，并在常态静态模式下按需淡入四个预栅格 SVG 图层的水波形变；Avatar 不再对其重复叠加单色层。
- 只过渡一个小画布纯色层的 opacity，默认峰值 `58%`、入口 / 退出 `0.5s`。
- 所有 hover 规则排除 `.snowui-disabled`、`[data-disabled="true"]` 与 `:disabled`；reduced-motion 下关闭淡入淡出并保留静态随机色反馈。

**默认 / 空头像**
- `default`：常态直接渲染按 seed 选择的共享 Gradient 静态图。`fallbackColor` 可精确指定 `blue / cyan / green / red / orange / purple`；否则 `fallbackSeed`（推荐稳定 `user.id`）通过确定性哈希选色，再回退到 `aria-label` / `data-name` / `title`。完全无身份信息时固定使用 `blue`，不以组件实例 ID 或运行时随机数选色。完整 Gradient 组件只在 hover 期间按需挂载并在退出动效完成后释放；`gradientMotion` 开启时保持常驻。
- `empty`：保留 `var(--black-4)` 灰色背景与 Components 内置语义 `user` 图标，明确表达尚无头像内容；应用级 `IconProvider` 可替换。

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


<a id="开发者指南-ai"></a>

### 开发者指南 (AI)

### 模块索引 (Module Index)

- **Avatar 组件**: [./Avatar.svelte](Avatar.svelte)

### 关联关系

- **父组件**: [Frame.svelte](Frame.svelte)
- **子组件**: [Badge.svelte](Badge.svelte), [Icon.svelte](Icon.svelte)

---

## 更新日志

### v2.12.5 (2026-09-02)

- 2026-09-21：统一使用文档、源码属性表与 Site / LLM 阅读入口；仅文档修订，不改变组件行为。

- 根据现有源码补齐逐属性说明、默认回退和使用边界；未改变组件运行时行为。

### v2.12.4 (2026-08-28)

- 新增 `fallbackColor` 六种具名默认 Gradient 配色与 `fallbackSeed` 稳定身份映射；推荐传入 `user.id`，相同 seed 跨刷新保持同色。
- 默认配色优先级调整为显式颜色、稳定 seed、名称回退、固定 `blue`；完全匿名头像不再依赖组件实例 ID。

### v2.12.3 (2026-08-15)

- 默认 Gradient hover 改为按需挂载四个模块缓存的预栅格 SVG 图层，不再创建运行时 filter DOM；活动 Gradient 同时继承共享视口暂停能力。

完整历史见 [更新日志归档](../../docs/history/changelogs/Avatar.history.md)。
