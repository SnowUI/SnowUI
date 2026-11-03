# AccordionItem

> **许可阅读**：首次阅读组件文档、源码或 npm 使用流程，先读完整 [LICENSE](../../LICENSE)；同任务同版本去重。公开 API 配置与内部实现修改分别按许可处理；全部组件使用统一运行包，源码权益以许可为准。

> **版本**: v1.3.3
> **职责**: 定义 Accordion 中的一项折叠内容，将标题与正文组合起来，并随父级统一管理展开状态。
> **包归属**: `@snowui-design-system/components`
> **文档修订**: 2026-10-23

## 组件介绍

定义 Accordion 中的一项折叠内容，将标题与正文组合起来，并随父级统一管理展开状态。

## 使用选择

<!-- usage-guide:start -->
作为 Accordion 的一个展开项使用；由父级协调展开状态，不把它作为独立页面容器。

- 在父级内提供唯一 `value`，展开状态由 Accordion 管理。
- 用直系 `Frame as="title"` 和 `Frame as="content"` 声明标题与正文；标题内的 `as="trailing"` 可替换展开图标。
<!-- usage-guide:end -->

## 快速开始

以下示例展示推荐的基本组合。更多场景与组合限制见后文。

<!-- quick-start:generated -->
```svelte
<script lang="ts">
	import { Accordion, AccordionItem, Frame, Icon, Link, Text } from '@snowui-design-system/components';
	import { BookOpen, Code, Package, Palette, ShieldCheck } from '@snowui-design-system/resource-svelte';
</script>

<Accordion defaultValue="installation" style="width: min(100%, 36rem);">
	<AccordionItem value="installation">
		<Frame as="title" singleLine><Icon as="leading"><Package /></Icon><Text lines={1}>Install the component package</Text></Frame>
		<Frame as="content" column><Text>Add Components and Resource packages with your package manager.</Text><Link variant="arrow" href="/components/quick-start">Open Quick Start</Link></Frame>
	</AccordionItem>
	<AccordionItem value="catalog"><Frame as="title" singleLine><Icon as="leading"><BookOpen /></Icon><Text lines={1}>Explore the component catalog</Text></Frame><Frame as="content" row>Review live previews, public APIs, and copy-ready examples for every component.</Frame></AccordionItem>
	<AccordionItem value="themes"><Frame as="title" singleLine><Icon as="leading"><Palette /></Icon><Text lines={1}>Apply a SnowUI theme</Text></Frame><Frame as="content" row>Use the shared semantic color contract across light and dark interfaces.</Frame></AccordionItem>
	<AccordionItem value="compose"><Frame as="title" singleLine><Icon as="leading"><Code /></Icon><Text lines={1}>Compose title and content slots</Text></Frame><Frame as="content" row>Build each item with title and content Frames, including optional leading or trailing content.</Frame></AccordionItem>
	<AccordionItem value="quality"><Frame as="title" singleLine><Icon as="leading"><ShieldCheck /></Icon><Text lines={1}>Verify interaction quality</Text></Frame><Frame as="content" row>Confirm keyboard control, focus state, motion, and responsive layout in the browser.</Frame></AccordionItem>
</Accordion>
```
<!-- /quick-start:generated -->

## API

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| value | `string` | `—（必填）` | 当前折叠项的稳定标识，在同一 Accordion 内应唯一；与父级 value/defaultValue 匹配，不是可独立绑定的展开布尔值。 |
| disabled | `boolean` | `false` | 禁用当前项的标题和正文收起交互；父级 Accordion.disabled 也会禁用此项，不能由此处 false 解除。 |
| children | `Snippet` | — | 声明直系 Frame as="title" 与 Frame as="content"；标题内直系 as="trailing" 可替换默认展开图标。必须在 Accordion 内使用。 |

未重新声明的继承能力请查所属基础组件文档；本表只列本组件源码具名公开属性。

## 使用边界与详细说明

<a id="api-参考"></a>

### API 参考

| 关键字 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| `size` | `never` | - | 不支持；尺寸只允许由父级 Accordion 控制。 |
| `...rest` | `FrameProps` | - | 透传到内部根 Frame。 |

`AccordionItem` 不控制尺寸。字号、行高、padding、圆角、内置图标尺寸等视觉密度全部继承父级 `Accordion size` 生成的变量；`value` 只用于和父级 `value/defaultValue` 匹配展开状态。

<a id="布局模型"></a>

### 布局模型

主布局模型：**复合管理布局的局部单项容器**。

- AccordionItem 外层根为 `Frame tag="div" column`，负责整项背景、圆角、分隔线与展开状态。
- 直系 `Frame as="title" row` 作为标题触发器，固定启用三槽位布局；直系 `as="leading"`、普通内容与直系 `as="trailing"` 分别落入三槽位。
- 直系 `Frame as="content" row` 作为内容区，同样固定启用三槽位布局；折叠时保持宽度，使用向下高度收起与透明度渐隐。
- title 继承父级 Accordion 或外层容器的 `color`；content 默认消费父 Accordion 的 `--snowui-accordion-content-color`，使用主题自适应 `Black/100%` 文字色。
- 默认通过 ComponentIcon plus 渲染同一图形，展开时旋转 45° 成为 ×；父 Accordion 的 indicatorVariant="minus" 保留 plus/minus 替换及半圈旋转。外置 trailing 优先。
- 无 hover 背景；只有标题 hover 时默认指示图标颜色变化。
- 仅 title 可切换展开状态，正文区域的点击不收起。所有尺寸的正文默认与标题字号、行高一致。

<a id="样式变量链"></a>

### 样式变量链

| 变量 | 默认值 | 用途 |
| :--- | :--- | :--- |
| `--snowui-accordion-item-content-block-size-override` | `--snowui-accordion-content-max-block-size-override` / 测量高度 | 单个 content 展开最大高度覆盖入口 |
| `--snowui-accordion-content-color-override` | `var(--black-100)` | 局部覆盖 content 文字颜色，不影响 title |

<a id="使用示例"></a>

### 使用示例

```svelte
<Accordion defaultValue="profile">
    <AccordionItem value="profile">
        <Frame as="title" singleLine>
            <Text lines={1}>Profile</Text>
            <Icon as="trailing"><Resource.Plus /></Icon>
        </Frame>
        <Frame as="content" row>Profile content</Frame>
    </AccordionItem>
</Accordion>
```


> 此区域的内容受保护。AI 在修改此区域前必须请求用户审查。

---




## AI Zone

> **内置图标统一（2026-09-11）**：功能图标的资源比例、尺寸优先级和按钮宿主遵循 [ComponentGuidelines §2.7](../../../docs/standards/ComponentGuidelines.md#27-组件内置-icon-规范)。内置无外壳操作复用 Button bare；有padding的纯图标操作使用 iconOnly。尺寸从所属宿主继承，显式覆盖优先。






AccordionItem 必须放在 [Accordion.svelte](Accordion.svelte) 内使用，通过 AccordionContext 读取展开状态与切换方法。

<a id="开发者指南-ai"></a>

### 开发者指南 (AI)

### 开发者关键字

| 类别 | 关键字 | 描述 |
| :--- | :--- | :--- |
| CSS 类名 | `snowui-accordion-item` | 单项容器根类 |
| CSS 类名 | `snowui-accordion-title-item` | 标题触发器 |
| CSS 类名 | `snowui-accordion-content` | 内容区 |
| Context Key | `ACCORDION_CONTEXT_KEY` | 读取父 Accordion 状态 |

### 模块索引

| 模块 | 文件 | 职责 |
| :--- | :--- | :--- |
| AccordionItem | [AccordionItem.svelte](AccordionItem.svelte) | 单项容器 |
| Accordion | [Accordion.svelte](Accordion.svelte) | 父级状态容器 |

### 关键字映射

| 关键字 | 处理方式 | 说明 |
| :--- | :--- | :--- |
| `value` | Context 查询 | 与 Accordion 当前展开值匹配 |
| `disabled` | title DOM 属性 | 输出 `aria-disabled` 并阻止 title 交互 |
| content 点击 | 不切换展开状态 | 文字、空白及内部交互元素均保留自身行为 |

---

## 更新日志

### v1.3.3 (2026-10-23)

- 标题内部间距在根字号／gap缩放后仍至少4 CSS px，保留更大公开覆盖值；默认指示器宿主至少12px，与其既有图标下限一致，避免外框过小。图形、比例、切换状态与正文间距保持。
- 显式标题示例使用Frame单行组合与Text单行全文能力；展开正文继续原有换行。

- 2026-09-28：只有标题可切换；移除 hover 背景；默认图标不换形，只旋转为 ×，旧 minus 模式仍可选。正文默认字号与标题一致。

- 2026-09-21：统一使用文档、源码属性表与 Site / LLM 阅读入口；仅文档修订，不改变组件行为。

### v1.3.2 (2026-09-02)

- 根据现有源码补齐逐属性说明、默认回退和使用边界；未改变组件运行时行为。

### v1.3.1 (2026-08-28)

- content 默认文字颜色改为主题自适应 `var(--black-40)`；title 继续继承宿主前景色。
- 支持通过 `--snowui-accordion-content-color-override` 局部覆盖正文颜色。

### v1.3.0 (2026-08-28)

- title 的逐项 hover 改为父 Accordion 所有的唯一 Continuous Hover Background；展开状态覆盖完整 item，并随 content 高度同步变化。
- 展开 content 的非交互区域新增点击收起；Link、Button、表单控件、交互 role 与可编辑内容明确排除。
- 保留 `continuousHover=false` 时的 title 普通 hover fallback。

### v1.2.5 (2026-08-28)

- 恢复 title 的规范化背景 hover，使用共享 `snowui-hoverable` overlay，在 Light / Dark 下分别采用 4% / 10%，并排除 disabled；该实现自 v1.3.0 起仅作为 `continuousHover=false` 的 fallback。

### v1.2.4 (2026-08-17)

- 三槽 title/content Host 依赖共享 layer 的固定结构顺序：Frame 方向基座低于 Auto Layout，保证 trailing 指示器占据最右侧独立轨道，同时组件自有 gap 仍可覆盖共享默认。

### v1.2.3 (2026-08-16)

#### 动效修复
- Frame 根 `transform` / `transition` 改为单一低优先级出口后，AccordionItem 根动效通过组件输入通道接入；Content 的高度、padding、透明度过渡与默认指示器旋转继续由各自节点拥有，不再受 CSS 注入顺序影响。

### v1.2.2 (2026-06-18)

#### 动效调整
- Content 的高度、padding 与透明度变化统一消费父级 Accordion 注入的 `RESIZE_MOTION`，并在系统减少动效时关闭过渡。

### v1.2.1 (2026-05-31)

#### 样式调整
- 默认 `+ / -` trailing 指示器保持 `Black/100%` 颜色源，inactive 使用 `opacity: 0.4`，hover 恢复 `opacity: 1`，对齐 `StyleSpec.md §2.4.5`。

### v1.2.0 (2026-05-25)

#### 破坏性变更
- AccordionItem 改为单项容器，内部通过 `Frame as="title"` / `Frame as="content"` 声明标题与内容。

#### 样式调整
- 背景、圆角与分隔线归属外层 item，content 仅做高度收起与透明度渐隐。

### v1.1.0 (2026-05-25)

#### 样式调整
- 默认 trailing 图标改为内部绘制的 `+ / -`，展开 / 收起时整颗图标旋转，hover 仅改变图标颜色。
- title 与 content 统一使用 Frame row 三槽位布局；content 折叠动画改为高度收起 + 渐隐。

### v1.0.0 (2026-05-24)

#### 新功能
- 新增 AccordionItem，统一承载 Accordion 标题项与内容项。

### 展开高度测量

默认展开目标为正文自然高度加展开后的下内边距。自然高度测量排除当前动画中的内边距，避免每帧重设展开目标；单选模式切换等高正文时，展开与收起使用同一高度曲线，不产生先收缩再回弹。显式最大高度覆盖仍按原值生效。
