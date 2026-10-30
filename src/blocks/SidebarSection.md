# SidebarSection

> **许可阅读**：首次阅读组件文档、源码或 npm 使用流程，先读完整 [LICENSE](../../LICENSE)；同任务同版本去重。公开 API 配置与内部实现修改分别按许可处理；全部组件使用统一运行包，源码权益以许可为准。

> **版本**: v1.5.0
> **职责**: 将 Sidebar 导航组织为带标题的分组，支持展开、收起与附加操作，便于浏览较长的导航列表。
> **包归属**: `@snowui-design-system/components`
> **文档修订**: 2026-10-23

## 组件介绍

将 Sidebar 导航组织为带标题的分组，支持展开、收起与附加操作，便于浏览较长的导航列表。

## 使用选择

<!-- usage-guide:start -->
用于 Sidebar 中带标题的导航分组。分组已有分隔能力时不重复添加 Separator；子项使用 SidebarItem。

- id 标识分组，title 提供组名，children 放置导航项。
- collapsible / collapsed 控制分组收起，defaultCollapsed 为初始状态；actions 提供组级操作。
- 内置展开／收起可访问名称随 LocaleProvider 更新；title 与 action.label 属于调用方内容，保持原样。
<!-- usage-guide:end -->

## 快速开始

以下示例展示推荐的基本组合。更多场景与组合限制见后文。

<!-- quick-start:generated -->
```svelte
<script lang="ts">
	import { SidebarItem, SidebarSection } from '@snowui-design-system/components';
	let opened = $state('');
</script>

<div style="width: min(100%, 12rem);">
<SidebarSection id="documentation" title="Documentation">
    <SidebarItem id="introduction" label="Introduction" onSelect={() => opened = 'Introduction'} />
    <SidebarItem id="quick-start" label="Quick Start" updated onSelect={() => opened = 'Quick Start'} />
    <SidebarItem id="components" label="Components" onSelect={() => opened = 'Components'} />
</SidebarSection>
</div>
```
<!-- /quick-start:generated -->

## API

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| id | `string` | `必填` | 稳定分类标识 |
| title | `string` | — | 内置分类标题；未传时不渲染标题行 |
| collapsible | `boolean` | — | 是否提供内置展开/收起按钮 默认行为：有标题时 `true`。 |
| collapsed | `boolean` | — | 传入布尔值时控制分类折叠状态；省略时由分类内部状态及 Sidebar 持久化状态管理 |
| defaultCollapsed | `boolean` | `false` | 非受控初始状态 |
| onCollapsedChange | `(collapsed: boolean) => void` | — | 分类折叠变化回调 |
| actions | `SidebarActionData[] \| Snippet` | `[]` | 0～多个标题操作；数组生成 `Button bare` |
| children | `Snippet` | — | 分类内容 |
| parts | `ComponentPartsOf<{ Button: typeof Button; Separator: typeof Separator; }>` | — | 配置数据生成的 Button 与内置 Separator |

未重新声明的继承能力请查所属基础组件文档；本表只列本组件源码具名公开属性。

## 使用边界与详细说明

<a id="api-参考"></a>

### API 参考

长标题使用 Text 单行缩略并保留完整可访问名称，不新增标题 Tooltip；箭头与末尾操作保留自身尺寸，标题与操作之间的有效间距至少为 4 CSS px。标题行高度同时容纳内置图标既有的 12px 下限与上下 padding，避免小根字号裁切图形；正文、分隔线与整体折叠时序保持不变。

整体 Sidebar 折叠时，标题行先消费 Frame color bridge 渐隐；透明度归零后，标题高度、纵向 padding 与 Section gap 才消费 Frame size bridge 收起，因此内容 Item 在标题消失后才开始上移。标题节点保留在 DOM 中，并在折叠期间通过 `inert`、`aria-hidden` 与延迟 `visibility: hidden` 停止交互。分类自身折叠时不渲染内容子树；未传 `collapsed` 时不得把一次点击的内部状态写成受控 Prop，否则会盖住 Sidebar 的持久化状态并阻止再次展开。Sidebar 在折叠前记忆 active item 的 Section 归属，因此刷新恢复无需保留隐藏内容 DOM。每个分类内容末尾内置一个横向 `Separator`，展开、分类折叠与 Sidebar 整体折叠时均由 SidebarSection 统一保留，调用方无需手动添加；它与 Sidebar 内显式组合的横向 Separator 一起消费 Sidebar 统一的四边 `8px` padding、零行高和横向 / 纵向 padding override，Separator 自身仍可通过 `parts.Separator` 配置。标题行默认 padding 为左右 `8px`（`var(--padding-2)`）、上下 `4px`（`var(--padding-1)`），同时作用于标题、折叠箭头与 actions 的完整排列区域。有标题时默认可折叠；标题文字与箭头共同位于一个 `Button bare emphasis="muted"` 中，整段标题均可点击且不显示 Tooltip。数据生成的 action 可用 `iconCollection: "snowui"` 显式选择同名 SnowUI 图标，action Tooltip 统一显示在按钮右侧。标题操作按钮之间固定使用 `var(--gap-2)`（8px），并同样显式使用 muted 强调级别保留 40% → hover 100% 的次级操作视觉。

---




## AI Zone

> **内置图标统一（2026-09-11）**：功能图标的资源比例、尺寸优先级和按钮宿主遵循 [ComponentGuidelines §2.7](../../../docs/standards/ComponentGuidelines.md#27-组件内置-icon-规范)。内置无外壳操作复用 Button bare；有padding的纯图标操作使用 iconOnly。尺寸从所属宿主继承，显式覆盖优先。

<a id="开发者指南-ai"></a>

### 开发者指南 (AI)

| 类别 | 关键字 | 描述 |
|:---|:---|:---|
| CSS 类名 | `snowui-sidebar-section` | 根节点 |
| 布局模型 | Managed Composite | Header + content |

### 多语言

内置标题按钮通过 `useLocale()` 读取 `sidebarSection.expand`／`sidebarSection.collapse`，用 `{{title}}` 插入原始标题。无 Provider 时为默认简中；可用 LocaleProvider 的 `messages` 覆盖完整模板。没有新增显式文案 Prop；标题及操作标签不由组件翻译。

### 模块索引

| 模块 | 文件 | 职责 |
|:---|:---|:---|
| SidebarSection | [SidebarSection.svelte](SidebarSection.svelte) | 分类折叠与标题操作 |

## 更新日志

### v1.5.0 (2026-10-23)

- 长标题使用 Text 单行缩略并保留完整可访问名称，不新增标题 Tooltip；箭头与末尾操作保留自身尺寸，标题与操作之间的有效间距至少为 4 CSS px。标题行高度同时容纳内置图标既有的 12px 下限与上下 padding，避免小根字号裁切图形；正文、分隔线与整体折叠时序保持不变。

- 2026-10-20：内置分类展开／收起名称接入统一 locale 与 messages 覆盖，支持动态语言切换，标题与操作内容保持调用方原文。

- 2026-10-14：修复未传 `collapsed` 的分类折叠后无法重新展开；保持布尔值受控用法、键盘操作与 Sidebar 持久化状态。
- 2026-09-21：统一使用文档、源码属性表与 Site / LLM 阅读入口；仅文档修订，不改变组件行为。

### v1.4.0 (2026-08-15)

#### 新功能
- 分类内容末尾内置横向 Separator，调用方无需手动添加；它与 Sidebar 内显式 Separator 共用四边 8px padding、零行高及 Sidebar 横向 / 纵向 padding override，并通过 `parts.Separator` 保留自身配置入口。

### v1.3.0 (2026-08-06)

#### 变更
- 接入 Sidebar Context 的持久化折叠状态；Sidebar 在折叠前记忆 active item 的 Section 归属，分类内容继续按原有规则在折叠时卸载。

### v1.2.0 (2026-07-28)

#### 动效优化
- Sidebar 整体折叠时先渐隐标题，渐隐结束后再收起标题高度、padding 与 Section gap，使 Item 延后上移。

### v1.1.0 (2026-07-28)

#### 变更
- 明确有标题时默认可折叠，标题按钮不显示 Tooltip。
- Section action Tooltip 统一显示在对应按钮右侧。

### v1.0.1 (2026-07-28)

#### 变更
- SidebarSection 标题行默认增加左右 8px、上下 4px padding。

### v1.0.0 (2026-07-23)

#### 新功能
- 初始版本：内置分类标题、下箭头折叠与 hover/focus 操作区。
