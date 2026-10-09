# SidebarItem

> **许可阅读**：首次阅读组件文档、源码或 npm 使用流程，先读完整 [LICENSE](../../LICENSE)；同任务同版本去重。公开 API 配置与内部实现修改分别按许可处理；旧 OSS / PRO 标签仅表示迁移期技术来源。

> **版本**: v1.6.2
> **职责**: 在 Sidebar 中呈现导航入口，支持激活状态、图标、层级与状态提示，帮助识别当前位置。
> **包归属**: `@snowui-design-system/components`
> **文档修订**: 2026-09-21

## 组件介绍

在 Sidebar 中呈现导航入口，支持激活状态、图标、层级与状态提示，帮助识别当前位置。

## 使用选择

<!-- usage-guide:start -->
用于 Sidebar 导航入口，提供稳定身份、图标、文本和目标地址。激活状态不等于自动完成业务路由。

- 提供稳定 id 与 label；href 表示导航地址，onSelect 处理选择通知。
- disabled 禁止导航；actions 配置条目附加操作，parts 配置内置徽标和操作按钮。
<!-- usage-guide:end -->

## 快速开始

以下示例展示推荐的基本组合。更多场景与组合限制见后文。

<!-- quick-start:generated -->
```svelte
<script lang="ts">
	import { SidebarItem } from '@snowui-design-system/components';
	let opened = $state('');
</script>

<div style="width: min(100%, 12rem);">
<SidebarItem id="components" label="Components" icon="squares-four" iconCollection="phosphor" onSelect={() => opened = 'Components'} />
</div>
```
<!-- /quick-start:generated -->

## API

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| id | `string` | `必填` | 稳定导航标识 |
| label | `string` | `必填` | 文字与折叠态可访问名称 |
| icon | `string \| Snippet` | — | ResourceIcon 名称或自定义 leading 内容 |
| iconCollection | `string` | — | `icon` 的 ResourceIcon collection；存在同名 SnowUI 图标时传入 `"snowui"` |
| depth | `0 \| 1` | `0` | 导航层级；`1` 表示二级 Item，由组件在 leading 槽绘制 L 形层级连接线并替换普通 Icon |
| href | `string` | — | 存在时主操作渲染 Link，否则渲染 Button |
| updated | `boolean` | `false` | 内置 Badge dot；展开态位于外部 tags 之后，折叠态跟随 leading icon |
| tags | `Snippet` | — | label 后、updated 前的自定义状态/分类标签；推荐使用 `Badge variant="border"` |
| disabled | `boolean` | `false` | 禁用主操作 |
| actions | `SidebarActionData[] \| Snippet` | `[]` | 0～多个末尾操作；数组生成 `Button bare` |
| onSelect | `(id: string) => void` | — | 本项选择回调 |
| parts | `ComponentPartsOf<{ Badge: typeof Badge; Button: typeof Button }>` | — | 配置内置 Badge 与数据生成的 Button |

未重新声明的继承能力请查所属基础组件文档；本表只列本组件源码具名公开属性。

## 使用边界与详细说明

<a id="api-参考"></a>

### API 参考

提供 href 时导航内容使用链接，否则使用按钮。附属 actions 与主导航操作独立；tags 显示在 label 与 updated 提示之间。折叠后保留图标，内置 Tooltip 提供完整标签。组件负责折叠过渡、标签布局与操作位置，页面只需提供数据和业务回调。

`depth={1}` 表示二级 Item。组件在既有 20px leading 槽内通过伪元素绘制等长双臂的 L 形点线：由密集的 1px `Black/40%` 点组成，弯曲圆角为 4px；默认视觉线长为 9px × 9px。竖线中心与同列一级 Item 的 Icon 中心对齐，横线中心与二级 Item 文字中心对齐。该图形只表达层级关系，没有独立交互或无障碍语义，不进入图标资源解析，也不随 IconProvider 切换。二级 Item 不同时显示普通 `icon`；调用方在 Sidebar 折叠时仍应隐藏二级 Item。

---




## AI Zone

### 导航项布局维护

主导航操作与末尾操作是并列节点，不产生交互元素嵌套。`href` 存在时主操作使用 Link，否则使用 Button；SidebarItem 会把 Link 的内部 gap override 绑定到自身固定的 `var(--gap-2)`，因此两条路径的 leading icon 与 content 间距一致。`tags` 是外部状态 / 分类标签入口，固定渲染在 label 与内置 updated 之间；因此使用方传入 PRO 等标签时，顺序由 SidebarItem 统一保持为 label → tags → updated。`updated` prop 始终使用 `<Badge as="badge" dot />`，默认尺寸为 6px × 6px；展开态位于外部 tags 之后，折叠态跟随 leading icon。折叠态 label 与末尾 action 的 Tooltip 均由 SidebarItem 内置设置为 `position="right"`，默认显示在对应元素右侧，不要求使用方逐项配置。整体 Sidebar 折叠时，label、tags 与展开态 updated Badge 保留在 DOM 中并消费 Frame color bridge 渐隐，leading Icon 始终保持原 padding 与横向位置；主操作保持单行且在折叠态裁切已隐藏内容，因此默认 Item 高度稳定为 `var(--size-9)`（默认 36px），不会因隐藏文字换行而增高。渐隐结束后文字进入 `visibility: hidden`，不截获交互。主项属于 Sidebar 导航复合控件，使用 Button 时关闭 scale hover，只显示统一背景高亮；leading Icon 与 label 不变色。末尾操作仍是独立动作，显式使用 `Button bare emphasis="muted"`，保留 40% → hover 100% 与默认 scale 的次级反馈。

注意：源码引用 --size-9，但当前基础 tokens.css 未声明该变量；不得据此对用户承诺固定 36px 高度。接入文档只描述实际折叠行为。

> **内置图标统一（2026-09-11）**：功能图标的资源比例、尺寸优先级和按钮宿主遵循 [ComponentGuidelines §2.7](../../../specs/ComponentGuidelines.md#27-组件内置-icon-规范)。内置无外壳操作复用 Button bare；有padding的纯图标操作使用 iconOnly。尺寸从所属宿主继承，显式覆盖优先。

<a id="开发者指南-ai"></a>

### 开发者指南 (AI)

| 类别 | 关键字 | 描述 |
|:---|:---|:---|
| CSS 类名 | `snowui-sidebar-item` | 根节点 |
| 布局模型 | Slot Host | leading / content / trailing |
| Context | `SIDEBAR_CONTEXT_KEY` | 折叠与 active owner |

### 模块索引

| 模块 | 文件 | 职责 |
|:---|:---|:---|
| SidebarItem | [SidebarItem.svelte](SidebarItem.svelte) | 导航语义与状态视觉 |

## 更新日志

- 2026-09-21：统一使用文档、源码属性表与 Site / LLM 阅读入口；仅文档修订，不改变组件行为。

### v1.6.2 (2026-09-01)

#### 修复
- 将二级 Item 连接线由长虚线收紧为密集的 1px 点线，保持原有 9px × 9px 等长双臂与 4px 圆角。

### v1.6.1 (2026-09-01)

#### 修复
- 将二级 Item 的 L 形层级连接线收敛为等长双臂；默认视觉线长为 9px × 9px，并继续保持父级 Icon / 子级文字双轴对齐。

### v1.6.0 (2026-09-01)

#### 新功能
- 新增 `depth={0 | 1}`；二级 Item 内置 1px Black/40%、4px 圆角的 L 形层级连接线，并保持父级 Icon / 子级文字双轴对齐。

### v1.4.1 (2026-08-09)

#### 修复
- Link 主操作显式继承 SidebarItem 固定 gap，避免 Link 默认 2px 覆盖 Item 的 8px leading/content 间距；Link 与 Button 路径现在一致。

### v1.4.0 (2026-08-06)

#### 变更
- 输出稳定的 `data-sidebar-item-id`，供 Sidebar 在持久化恢复后识别 active item、展开所属 Section 并完成滚动定位。

### v1.3.0 (2026-07-30)

#### 新功能
- 新增外部 `tags` Snippet，固定渲染在 label 与内置 updated 之间。
- 标签位置规则归入 SidebarItem；`updated` 在展开态与折叠态均保持 Badge dot 视觉。

### v1.2.1 (2026-07-28)

#### 修复
- 主操作固定为单行布局，折叠态裁切渐隐后的文字节点，避免隐藏内容换行把默认 Item 从 36px 撑高。

### v1.2.0 (2026-07-28)

#### 动效优化
- Sidebar 整体折叠时保留 Item content 节点并使用 Frame color bridge 渐隐；leading Icon 不再因切换居中布局而横向移动。

### v1.1.0 (2026-07-28)

#### 变更
- Item action Tooltip 与折叠态 label Tooltip 统一显示在对应元素右侧。

### v1.0.1 (2026-07-28)

#### 变更
- 折叠态 label Tooltip 默认显示在 Icon 右侧。

### v1.0.0 (2026-07-23)

#### 新功能
- 初始版本：Link/Button 主操作、active、更新 Badge、折叠态与 hover/focus actions。
