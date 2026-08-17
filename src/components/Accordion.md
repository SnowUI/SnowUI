# Accordion.svelte 文档

> **版本**: v1.5.0
> **职责**: 提供可展开 / 收起的内容分组容器，用于 FAQ、设置项、分段说明与信息折叠。
> **包归属**: OSS（标准 UI 原语；不使用跨 Frame 协调、复杂 PRO 动效或产品级区块能力）

**继承**: 根层复用 Frame.svelte 的通用能力（响应式、上下文、Skeleton、状态与动效关键字透传）。
**默认能力开关**: `enableResponsive=true`、`enableContext=true`、`enableScaleObserver=false`、`enableDefaultMotion=true`。

## 功能概览

- 默认内置模式通过 `items` 渲染内容；每项只包含 `title` 与 `content`，内部自动生成 AccordionItem 和 `Frame as="title|content"`。
- 显式 children 存在时替换内置 items，用于自定义 AccordionItem 结构。
- 支持单开与多开两种模式。
- 支持非受控 `defaultValue` 与受控 `value`。
- 支持 `variant="filled" | "divided"` 两种视觉形态。
- 支持 `size="sm" | "md" | "lg"` 三档密度。
- 默认 trailing 图标为组件内部绘制的 `+ / -`，展开 / 收起时整颗图标使用 Frame motion bridge 时序旋转半圈；外部提供直系 `as="trailing"` 时会替换默认图标。

---

## API 参考

### 核心属性

| 关键字 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| `type` | `"single" \| "multiple"` | `"single"` | 单开或多开模式。 |
| `value` | `string \| string[]` | - | 受控展开值。`single` 使用字符串；`multiple` 使用字符串数组。 |
| `defaultValue` | `string \| string[]` | - | 非受控初始展开值。 |
| `collapsible` | `boolean` | `true` | 单开模式下，点击已展开项是否允许收起。 |
| `variant` | `"filled" \| "divided"` | `"filled"` | 视觉形态；`divided` 与 DataTable 的分割线命名一致。 |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | 尺寸密度；未显式传入时可从父级尺寸上下文推导。 |
| `disabled` | `boolean` | `false` | 禁用整个 Accordion。 |
| `items` | `{ title: string; content: string }[]` | `[]` | 默认内置模式的数据；内部 value 使用数组索引字符串。 |
| `onValueChange` | `(value: string \| string[]) => void` | - | 展开值变化回调。 |
| `parts` | `{ AccordionItem?; Frame? }` | - | 配置默认内置生成的 AccordionItem 与 title/content Frame。 |
| `children` | `Snippet` | - | 显式组合内容；存在时替换内置 items。 |
| `...rest` | `FrameProps` | - | 透传到根 `Frame`。 |

默认内置模式的 value 为数组索引字符串，例如 `defaultValue="1"` 默认展开第二项。显式组合模式仍使用 AccordionItem 自己声明的稳定 value。尺寸只由 `Accordion size` 控制，`AccordionItem` 不提供独立尺寸属性。

## 布局模型

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

设计稿映射：

| variant / size | Title padding | Content padding | Radius | Gap |
| :--- | :--- | :--- | :--- | :--- |
| `divided sm` | `8px 8px` | `8px 8px` | `0` | `0` |
| `divided md` | `12px 8px` | `12px 8px` | `0` | `0` |
| `divided lg` | `16px 8px` | `16px 8px` | `0` | `0` |
| `filled sm` | `8px 12px` | `8px 12px` | `12px` | `4px` |
| `filled md` | `12px 16px` | `12px 16px` | `16px` | `4px` |
| `filled lg` | `16px 20px` | `16px 20px` | `24px` | `4px` |

## 样式变量链

| 变量 | 默认值 | 用途 |
| :--- | :--- | :--- |
| `--snowui-accordion-font-size` | `var(--text-16)` | md 标题字号；sm/lg 分别映射 `--text-14` / `--text-18` |
| `--snowui-accordion-line-height` | `var(--leading-16)` | md 标题行高；sm/lg 分别映射 `--leading-14` / `--leading-18` |
| `--snowui-accordion-content-font-size` | `var(--text-14)` | md 正文字号；sm/lg 分别映射 `--text-12` / `--text-16` |
| `--snowui-accordion-content-line-height` | `var(--leading-14)` | md 正文行高；sm/lg 分别映射 `--leading-12` / `--leading-16` |
| Content color | `inherit` | title 与 content 都继承父级文字颜色，不设置独立文本色 |
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

## 无障碍

- 根节点输出 `role`，默认 `presentation`；消费方可通过 `role` 覆盖。
- `Frame as="title"` 由 AccordionItem 接管 button-like 语义，输出 `role="button"`、`tabindex`、`aria-expanded`、`aria-controls`。
- Title 输出 `aria-expanded`、`aria-controls`。
- Content 输出 `role="region"` 与 `aria-labelledby`。
- 禁用 Title 输出 `aria-disabled="true"`，并从 tab 顺序中移除。

## 使用示例

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

> **以下内容供 AI 阅读，用于维护代码与文档的关联**

## 开发者指南 (AI)

### 开发者关键字

| 类别 | 关键字 | 描述 |
| :--- | :--- | :--- |
| CSS 类名 | `snowui-accordion` | 根元素类名 |
| Context Key | `ACCORDION_CONTEXT_KEY` | Accordion 与 AccordionItem 通信 |

### 模块索引

| 模块 | 文件 | 职责 |
| :--- | :--- | :--- |
| Accordion | [Accordion.svelte](./Accordion.svelte) | 分组容器与状态上下文 |
| AccordionItem | [AccordionItem.svelte](./AccordionItem.svelte) | 单项容器 |
| Accordion 示例 | [Accordion.test.ts](./Accordion.test.ts) | Test 项目示例 |

### 关键字映射

| 关键字 | 处理方式 | 说明 |
| :--- | :--- | :--- |
| `type` | 状态逻辑 | 控制单开或多开 |
| `value` / `defaultValue` | 状态逻辑 | 受控值优先 |
| `variant` / `size` | CSS 类 | 映射为 `.snowui-accordion-{variant}` 与 `.snowui-accordion-{size}` |
| `disabled` | Frame + Context | 根禁用并阻断所有 title 交互 |
| `items` | 默认内置 | 生成 AccordionItem + Frame title/content |
| `children` | Snippet | 显式组合内容；存在时替换 items |
| `...rest` | Frame 透传 | 保留 `as`、事件、状态、动效等 Frame 能力 |

### 关联关系

- **子组件**: [AccordionItem.svelte](./AccordionItem.svelte)
- **依赖**: Frame、`ACCORDION_CONTEXT_KEY`
- **规范**: [../../../specs/LayoutProtocol.md §12.6](../../../specs/LayoutProtocol.md)、[../../../specs/ComponentGuidelines.md](../../../specs/ComponentGuidelines.md)

---

## 更新日志 (Changelog)

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
- 新增 Accordion OSS 组件，支持单开 / 多开、受控 / 非受控、禁用项、视觉形态与三档尺寸。
