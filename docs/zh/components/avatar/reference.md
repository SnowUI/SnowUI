# Avatar

> **版本**: v2.12.5
> **职责**: 展示用户或团队头像，支持图片、文字和渐变占位，让列表、评论与成员信息更易辨认。
> **包归属**: `@snowui-design-system/components`
> **文档修订**: 2026-09-21

## 组件介绍

展示用户或团队头像，支持图片、文字和渐变占位，让列表、评论与成员信息更易辨认。

## 使用选择


用于用户或团队身份。单个头像用 Avatar，重叠成员用 AvatarGroup；纵向联系人列表使用 Avatar 配合普通列表和文本。

- 通过 src 显示头像，使用 fallback / fallbackText 配置回退；为同一身份提供稳定 fallbackSeed。
- 附属角标用 `as="badge"`，替换头像视觉用 `as="avatar-image"`；尺寸优先使用显式 size，其次父级头像尺寸。


## 快速开始

以下示例展示推荐的基本组合。更多场景与组合限制见后文。


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

<Avatar src="/avatar.jpg" />


<Avatar src={User} />


<Avatar fallbackSeed={user.id} aria-label={user.name} />


<Avatar fallbackColor="purple" aria-label="SnowUI member" />


<Avatar />


<Avatar gradientMotion />


<Avatar variant="empty" />


<Avatar fallback={GradientMotion} data-name="Ada Lovelace" />


<Avatar>
    <GradientMotion as="avatar-image" variant="random" seed="profile-42" />
    <Badge as="badge" dot />
</Avatar>


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

图片与普通组件 fallback 的六色 hover Overlay 是 StyleSpec §2.1.3 为 Avatar 单独登记的专业艺术色例外：颜色由 Avatar 私有 hover 视觉拥有，不映射为 SnowUI 通用 Token。默认 Gradient 画面的固定配色由 [Gradient](../gradient/reference.md#%E4%B8%93%E4%B8%9A%E8%89%BA%E6%9C%AF%E8%89%B2%E4%BE%8B%E5%A4%96) 自己的例外登记拥有；作为 fallback 使用 [GradientMotion](../gradient-motion/reference.md#%E4%B8%93%E4%B8%9A%E8%89%BA%E6%9C%AF%E8%89%B2%E4%BE%8B%E5%A4%96) 时，其 shader 画面颜色同样由 GradientMotion 自己拥有。三项例外都不扩展到 Avatar 的尺寸、排版、常规背景、状态、公开通用颜色入口或样式优先级。


### 背景模糊

`<Avatar variant="empty" backgroundBlur />` 可用于覆盖滚动内容的顶部栏。与Button一样默认关闭，显式开启后使用共享控制项模糊样式；默认20px，可通过`--snowui-avatar-background-blur-override`覆盖。实色图片会遮住其后模糊效果。
