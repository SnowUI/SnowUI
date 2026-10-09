# Accordion

> **许可阅读**：首次阅读组件文档、源码或 npm 使用流程，先读完整 [LICENSE](../../LICENSE)；同任务同版本去重。公开 API 配置与内部实现修改分别按许可处理；全部组件使用统一运行包，源码权益以许可为准。

> **版本**: v1.6.2
> **职责**: 将相关内容组织为可展开、收起的分组，适合常见问题、设置和分段说明，支持单项或多项同时展开。
> **包归属**: `@snowui-design-system/components`
> **文档修订**: 2026-09-21

## 组件介绍

将相关内容组织为可展开、收起的分组，适合常见问题、设置和分段说明，支持单项或多项同时展开。

## 使用选择

<!-- usage-guide:start -->
适合 FAQ、设置分组和可折叠说明。需要切换同一区域的内容面板时使用 Tab；AccordionItem 应放在 Accordion 中。

- `type="single"` 使用字符串值，`multiple` 使用数组；`bind:value` 同步展开项，`defaultValue` 只提供初始状态。
- `items` 模式使用索引字符串作为值；显式 children 替换 items，子项自行配置，不读取默认子项的 parts。
- Accordion 内的 `Icon as="leading"` 在未显式指定 `size` 时继承 Accordion 图标尺寸：sm/md/lg 分别为 16/20/24；未声明 leading 的 Icon 不参与这项继承，显式 `size` 优先。
<!-- usage-guide:end -->

## 快速开始

以下示例展示推荐的基本组合。更多场景与组合限制见后文。

<!-- quick-start:generated -->
```svelte
<script lang="ts">
	import { Accordion, AccordionItem, Frame, Icon } from '@snowui-design-system/components';
	import { BookOpen, Package, Palette, Rocket, ShieldCheck } from '@snowui-design-system/resource-svelte';
</script>

<Accordion type="multiple" defaultValue={['installation', 'themes']} variant="filled" size="md" style="width: min(100%, 36rem);">
	<AccordionItem value="installation">
		<Frame as="title" row><Icon as="leading"><Package /></Icon>How do I install SnowUI?</Frame>
		<Frame as="content" row>Install the Components and Resource packages, then import only the components your page uses.</Frame>
	</AccordionItem>
	<AccordionItem value="components">
		<Frame as="title" row><Icon as="leading"><BookOpen /></Icon>Where can I explore every component?</Frame>
		<Frame as="content" row>Open the Components catalog for live previews, copy-ready code, API details, and source links.</Frame>
	</AccordionItem>
	<AccordionItem value="themes">
		<Frame as="title" row><Icon as="leading"><Palette /></Icon>Does SnowUI support light and dark themes?</Frame>
		<Frame as="content" row>Yes. Components use the same semantic theme contract in applications and isolated documentation previews.</Frame>
	</AccordionItem>
	<AccordionItem value="quality">
		<Frame as="title" row><Icon as="leading"><ShieldCheck /></Icon>How are components verified?</Frame>
		<Frame as="content" row>Public behavior is checked with type validation, accessibility coverage, and real browser previews.</Frame>
	</AccordionItem>
	<AccordionItem value="pro">
		<Frame as="title" row><Icon as="leading"><Rocket /></Icon>When do I need component source?</Frame>
		<Frame as="content" row>Choose Pro or Team when you need component source, internal modifications, or the included Figma resources.</Frame>
	</AccordionItem>
</Accordion>
```
<!-- /quick-start:generated -->

## API

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| type | `AccordionType` | `"single"` | single 一次只展开一项；multiple 可同时展开多项。决定 value/defaultValue 与 onValueChange 的值形态。 |
| value | `AccordionValue` | — | 当前展开值，支持 bind:value；优先于内部状态。single 使用字符串，multiple 使用数组；single 空字符串表示全部收起。 |
| defaultValue | `AccordionValue` | — | 非受控初始展开值；仅初始化内部状态时读取，value 优先。items 模式使用索引字符串，显式 AccordionItem 使用其 value。 |
| collapsible | `boolean` | `true` | 单开模式下，点击已展开项是否允许收起。 |
| variant | `AccordionVariant` | `"filled"` | filled 为带背景的独立折叠项；divided 使用项间分割线。两者共享展开状态与交互。 |
| size | `AccordionSize` | — | 尺寸密度；显式值优先，其次父级尺寸上下文，再回退 md。统一控制标题、正文、间距及子项尺寸。 |
| disabled | `boolean` | `false` | 禁用整个 Accordion。 |
| continuousHover | `boolean` | `false` | 已弃用，仅保留调用兼容；任意值均不再显示 hover 背景。 |
| indicatorVariant | `"cross" \| "minus"` | `"cross"` | cross 使用同一个加号旋转 45° 成为 ×；minus 保留加号/减号切换与半圈旋转。自定义 trailing 替换默认图标。 |
| role | `string` | `"presentation"` | 根容器的 ARIA role；默认仅作展示分组，标题触发器与内容 region 的语义仍由 AccordionItem 管理。 |
| items | `AccordionEntry[]` | `[]` | 默认内置模式的数据；内部 value 使用数组索引字符串。 |
| children | `Snippet` | — | 显式组合内容；存在时替换内置 items。 |
| parts | `ComponentPartsOf<{ AccordionItem: typeof AccordionItem; Frame: typeof Frame; }>` | — | 仅配置 items 模式内建的 AccordionItem 与标题、正文 Frame；显式 children 不读取这些默认子项配置。 |
| onValueChange | `(value: AccordionValue) => void` | — | 用户切换展开项后回调；single 返回当前项字符串（全部收起时为空字符串），multiple 返回展开项数组。可配合 bind:value 同步页面状态。 |

未重新声明的继承能力请查所属基础组件文档；本表只列本组件源码具名公开属性。

## 使用边界与详细说明

<a id="功能概览"></a>

### 功能概览

- 默认内置模式通过 `items` 渲染内容；每项只包含 `title` 与 `content`，内部自动生成 AccordionItem 和 `Frame as="title|content"`。
- 显式 children 存在时替换内置 items，用于自定义 AccordionItem 结构。
- 支持单开与多开两种模式。
- 支持非受控 `defaultValue` 与受控 `value`。
- 支持 `variant="filled" | "divided"` 两种视觉形态。
- 支持 `size="sm" | "md" | "lg"` 三档密度。
- 展开正文默认使用主题自适应的 `Black/40%` 次要文字色；标题继续继承宿主前景色。
- hover 不显示背景，只改变标题内默认指示图标的颜色。
- 仅标题可点击展开或收起；正文文字、空白和交互后代均不触发切换。
- 默认 `indicatorVariant="cross"` 复用同一个 ComponentIcon plus，仅旋转 45° 得到 ×；`indicatorVariant="minus"` 保留旧 plus/minus 切换和半圈旋转。外置 trailing 继续替换默认图标。

---

<a id="api-参考"></a>


### 核心属性


默认内置模式的 value 为数组索引字符串，例如 `defaultValue="1"` 默认展开第二项。显式组合模式仍使用 AccordionItem 自己声明的稳定 value。尺寸只由 `Accordion size` 控制，`AccordionItem` 不提供独立尺寸属性。

<a id="布局模型"></a>

### 布局模型

主布局模型：**复合管理布局**。定义见 [../../../specs/LayoutProtocol.md §12.6](../../../specs/LayoutProtocol.md)。

结构：

- Root Frame（复合容器，提供 AccordionContext）
  - AccordionItem（单项容器，负责背景、圆角、分隔线与展开状态）
    - Frame as="title"（标题触发器）
    - Frame as="content"（展开内容 region）

局部布局来源：

| 区域 | 布局来源 |
| :--- | :--- |
| Root | Frame column；容器统一管理 item 间距 |
| Item | AccordionItem 外层 `Frame column`；承载整项背景、圆角、分隔线 |
| Title | 直系 `Frame as="title" row`；Leading / Content / Trailing 三槽位 |
| Content | 直系 `Frame as="content" row`；Leading / Content / Trailing 三槽位 |

padding 归属：`Frame as="title"` 负责可点击区 padding；`Frame as="content"` 负责正文 padding，Root 不重复制造外层 padding。
gap 归属：Root 通过 `--snowui-accordion-gap` 管理子项间距；Title 与 Content 内部槽位间距由 `--snowui-accordion-trigger-gap` 管理。
滚动归属：Accordion 自身不创建滚动区。

hover 归属：标题 hover 仅改变默认指示图标的透明度，不创建共享背景层，也不启用 title hover overlay。

设计稿映射：

| variant / size | Title padding | Content padding | Radius | Gap |
| :--- | :--- | :--- | :--- | :--- |
| `divided sm` | `8px 8px` | `8px 8px` | `0` | `0` |
| `divided md` | `12px 8px` | `12px 8px` | `0` | `0` |
| `divided lg` | `16px 8px` | `16px 8px` | `0` | `0` |
| `filled sm` | `8px 12px` | `8px 12px` | `12px` | `4px` |
| `filled md` | `12px 16px` | `12px 16px` | `16px` | `4px` |
| `filled lg` | `16px 20px` | `16px 20px` | `24px` | `4px` |

<a id="样式变量链"></a>

### 样式变量链

| 变量 | 默认值 | 用途 |
| :--- | :--- | :--- |
| `--snowui-accordion-font-size` | `var(--text-16)` | md 标题字号；sm/lg 分别映射 `--text-14` / `--text-18` |
| `--snowui-accordion-line-height` | `var(--leading-16)` | md 标题行高；sm/lg 分别映射 `--leading-14` / `--leading-18` |
| `--snowui-accordion-content-font-size` | 标题字号 | sm/md/lg 正文与标题均为 14/16/18px；保留正文显式覆盖入口 |
| `--snowui-accordion-content-line-height` | 标题行高 | 默认随同尺寸标题行高 |
| `--snowui-accordion-content-color` | `var(--black-40)` | 正文默认使用 40% 黑色语义 Token；Dark 主题自动映射为 40% 白色 |
| `--snowui-accordion-content-color-override` | - | 局部覆盖正文文字颜色；不影响标题 |
| `--snowui-accordion-padding-y` | `var(--padding-3)` | md Title 纵向 padding |
| `--snowui-accordion-padding-x` | `var(--padding-2)` | divided md Title 横向 padding；filled md 覆写为 `--padding-4` |
| `--snowui-accordion-content-padding-y` | `var(--padding-3)` | md Content 纵向 padding |
| `--snowui-accordion-content-padding-x` | `var(--padding-2)` | divided md Content 横向 padding；filled md 覆写为 `--padding-4` |
| `--snowui-accordion-gap` | `0` | 子项间距 |
| `--snowui-accordion-trigger-gap` | `var(--gap-2)` | Title 内部间距 |
| `--snowui-accordion-radius` | `var(--radius-0)` | default 圆角；filled sm/md/lg 分别为 `--radius-3` / `--radius-4` / `--radius-6` |
| `--snowui-accordion-icon-size` | `var(--size-5)` | md 图标尺寸；sm/lg 分别为 `--size-4` / `--size-6` |
| `--snowui-accordion-item-bg` | `transparent` | divided 背景；filled 覆写为 `var(--black-4)` |
| `--snowui-accordion-content-max-block-size-override` | `100vh` | Content 展开时的最大高度覆盖入口，用于极长内容场景 |

公开覆盖入口见 [components.css](../styles/components.css) 的 Accordion 段。

<a id="无障碍"></a>

### 无障碍

- 根节点输出 `role`，默认 `presentation`；消费方可通过 `role` 覆盖。
- `Frame as="title"` 由 AccordionItem 接管 button-like 语义，输出 `role="button"`、`tabindex`、`aria-expanded`、`aria-controls`。
- Title 输出 `aria-expanded`、`aria-controls`。
- Content 输出 `role="region"` 与 `aria-labelledby`。
- 禁用 Title 输出 `aria-disabled="true"`，并从 tab 顺序中移除。
- 指针及键盘切换语义只归属 Title；正文文字、空白与交互控件的点击均不改变展开状态。

<a id="使用示例"></a>

### 使用示例

```svelte
<Accordion
    defaultValue="0"
    items={[
        { title: "基础设置", content: "基础内容。" },
        { title: "高级设置", content: "高级内容。" },
    ]}
/>

<Accordion defaultValue="basic">
    <AccordionItem value="basic">
        <Frame as="title" row>
            基础设置
        </Frame>
        <Frame as="content" row>基础内容。</Frame>
    </AccordionItem>

    <AccordionItem value="advanced">
        <Frame as="title" row>
            高级设置
            <Icon as="trailing"><Resource.Plus /></Icon>
        </Frame>
        <Frame as="content" row>外部 trailing 图标会替换默认箭头。</Frame>
    </AccordionItem>
</Accordion>
```


> 此区域的内容受保护。AI 在修改此区域前必须请求用户审查。

---




## AI Zone

**继承**: 根层复用 Frame.svelte 的通用能力（响应式、上下文、Skeleton、状态与动效关键字透传）。
**默认能力开关**: `enableResponsive=true`、`enableContext=true`、`enableScaleObserver=false`、`enableDefaultMotion=true`。

<a id="开发者指南-ai"></a>

### 开发者指南 (AI)

### 开发者关键字

| 类别 | 关键字 | 描述 |
| :--- | :--- | :--- |
| CSS 类名 | `snowui-accordion` | 根元素类名 |
| Context Key | `ACCORDION_CONTEXT_KEY` | Accordion 与 AccordionItem 通信 |

### 模块索引

| 模块 | 文件 | 职责 |
| :--- | :--- | :--- |
| Accordion | [Accordion.svelte](Accordion.svelte) | 分组容器与状态上下文 |
| AccordionItem | [AccordionItem.svelte](AccordionItem.svelte) | 单项容器 |
| Accordion 示例 | [Accordion.test.ts](Accordion.test.ts) | Test 项目示例 |

### 关键字映射

| 关键字 | 处理方式 | 说明 |
| :--- | :--- | :--- |
| `type` | `"single" \| "multiple"` | `"single"` | single 一次只展开一项；multiple 可同时展开多项。决定 value/defaultValue 与 onValueChange 的值形态。 |
| `value` / `defaultValue` | 状态逻辑 | 受控值优先 |
| `variant` / `size` | CSS 类 | 映射为 `.snowui-accordion-{variant}` 与 `.snowui-accordion-{size}` |
| `disabled` | Frame + Context | 根禁用并阻断所有 title 交互 |
| `indicatorVariant` | AccordionContext | 选择默认 cross 或兼容 minus 指示图标 |
| `items` | 默认内置 | 生成 AccordionItem + Frame title/content |
| `children` | Snippet | 显式组合内容；存在时替换 items |
| `...rest` | Frame 透传 | 保留 `as`、事件、状态、动效等 Frame 能力 |

### 关联关系

- **子组件**: [AccordionItem.svelte](AccordionItem.svelte)
- **依赖**: Frame、`ACCORDION_CONTEXT_KEY`
- **规范**: [../../../specs/LayoutProtocol.md §12.6](../../../specs/LayoutProtocol.md)、[../../../specs/ComponentGuidelines.md](../../../specs/ComponentGuidelines.md)

---

## 更新日志

- 2026-09-28：取消 hover 背景与正文点击收起；默认加号旋转为 ×，新增 indicatorVariant="minus" 保留旧模式；各尺寸正文与标题字号一致。continuousHover 保留为无效兼容参数。

- 2026-09-21：统一使用文档、源码属性表与 Site / LLM 阅读入口；仅文档修订，不改变组件行为。

### v1.6.2 (2026-09-02)

- 根据现有源码补齐逐属性说明、默认回退和使用边界；未改变组件运行时行为。

### v1.6.1 (2026-08-28)

- 展开正文的默认文字颜色改为主题自适应 `var(--black-40)`；标题仍继承宿主前景色。
- 新增 `--snowui-accordion-content-color-override`，允许调用方局部覆盖正文颜色。

### v1.6.0 (2026-08-28)

- Accordion 接入容器级唯一 Continuous Hover Background，在 Item 间以 60ms 专项时序连续移动和变形；展开项覆盖 title 与完整 content，并随展开高度同步重测。
- 新增 `continuousHover`，默认开启；关闭后恢复 title 的普通 hover overlay。
- 展开项的非交互 content 区域可点击收起；Link、Button、表单控件、交互 role 与可编辑内容保持自身行为。
- disabled item 作为连续 hover 阻断区，不显示背景，也不回退点亮相邻项。

### v1.5.0 (2026-08-17)

- 将默认视觉形态从原 `variant="default"` 调整为 `variant="filled"`。
- 将原分割线形态重命名为 `variant="divided"`，与 DataTable 命名统一；彻底移除 `variant="default"`，不提供兼容别名。
- 将默认 `filled` 形态的 item 背景从 `Background/2` 调整为 `Black/4%`。

### v1.4.0 (2026-07-04)

- 新增默认内置模式：`items` 每项只接受 `title` 与 `content`。
- 内部自动生成 AccordionItem 与 title/content Frame，并提供 `parts.AccordionItem` / `parts.Frame`。
- 保留显式 children 组合模式；children 存在时替换内置 items。

### v1.3.1 (2026-06-18)

#### 动效调整
- Accordion 根注入 `RESIZE_MOTION`，展开 / 收起使用 transitions.dev resize 时序，并尊重系统减少动效偏好。

### v1.3.0 (2026-05-25)

#### 破坏性变更
- `AccordionItem` 改为单项容器；标题与内容改由内部直系 `Frame as="title"` / `Frame as="content"` 声明。

#### 样式调整
- 背景、圆角与分隔线归属外层 `AccordionItem`，content 折叠时只负责高度与透明度动画，避免背景残留。

### v1.2.0 (2026-05-25)

#### 破坏性变更
- 移除 `bordered` 视觉形态，Accordion 仅保留设计稿中的 `default` 与 `filled`。

#### 样式调整
- 根据 Workshop 设计稿同步两种视觉形态、三档尺寸的 padding、radius、gap、字号与默认图标尺寸。
- 默认 `+ / -` 图标改为组件内部线条绘制；hover 仅提升图标颜色，不改变标题底色。

### v1.1.0 (2026-05-24)

#### 破坏性变更
- 从 `items` 数据渲染模式改为组合式模式。

### v1.0.0 (2026-05-23)

#### 新功能
- 新增 Accordion 组件，支持单开 / 多开、受控 / 非受控、禁用项、视觉形态与三档尺寸。
