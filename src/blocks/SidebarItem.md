# SidebarItem（PRO Block）

> **版本**: v1.4.1
> **职责**: Sidebar 普通导航项，支持 active、状态标签、更新 Badge、leading icon 与可选操作区。

## API 参考

| 关键字 | 类型 | 默认值 | 描述 |
|:---|:---|:---|:---|
| `id` | `string` | 必填 | 稳定导航标识 |
| `label` | `string` | 必填 | 文字与折叠态可访问名称 |
| `icon` | `string \| Snippet` | — | ResourceIcon 名称或自定义 leading 内容 |
| `iconCollection` | `string` | — | `icon` 的 ResourceIcon collection；存在同名 SnowUI 图标时传入 `"snowui"` |
| `href` | `string` | — | 存在时主操作渲染 Link，否则渲染 Button |
| `updated` | `boolean` | `false` | 内置 Badge dot；展开态位于外部 tags 之后，折叠态跟随 leading icon |
| `tags` | `Snippet` | — | label 后、updated 前的自定义状态/分类标签；推荐使用 `Badge variant="border"` |
| `disabled` | `boolean` | `false` | 禁用主操作 |
| `actions` | `SidebarActionData[] \| Snippet` | `[]` | 0～多个末尾操作；数组生成 `Button bare` |
| `onSelect` | `(id: string) => void` | — | 本项选择回调 |
| `parts` | `ComponentPartsOf` | — | 配置内置 Badge 与数据生成的 Button |

主导航操作与末尾操作是并列节点，不产生交互元素嵌套。`href` 存在时主操作使用 Link，否则使用 Button；SidebarItem 会把 Link 的内部 gap override 绑定到自身固定的 `var(--gap-2)`，因此两条路径的 leading icon 与 content 间距一致。`tags` 是外部状态 / 分类标签入口，固定渲染在 label 与内置 updated 之间；因此使用方传入 PRO 等标签时，顺序由 SidebarItem 统一保持为 label → tags → updated。`updated` prop 始终使用 `<Badge as="badge" dot />`，默认尺寸为 6px × 6px；展开态位于外部 tags 之后，折叠态跟随 leading icon。折叠态 label 与末尾 action 的 Tooltip 均由 SidebarItem 内置设置为 `position="right"`，默认显示在对应元素右侧，不要求使用方逐项配置。整体 Sidebar 折叠时，label、tags 与展开态 updated Badge 保留在 DOM 中并消费 Frame color bridge 渐隐，leading Icon 始终保持原 padding 与横向位置；主操作保持单行且在折叠态裁切已隐藏内容，因此默认 Item 高度稳定为 `var(--size-9)`（默认 36px），不会因隐藏文字换行而增高。渐隐结束后文字进入 `visibility: hidden`，不截获交互。主项始终保持完整不透明度；hover / active 只显示统一背景高亮，leading Icon 与 label 不变色。末尾操作显式使用 `Button bare emphasis="muted"`，保留 40% → hover 100% 的次级反馈。

---

> **以下内容供 AI 阅读，用于维护代码与文档的关联**

## 开发者指南 (AI)

| 类别 | 关键字 | 描述 |
|:---|:---|:---|
| CSS 类名 | `snowui-sidebar-item` | 根节点 |
| 布局模型 | Slot Host | leading / content / trailing |
| Context | `SIDEBAR_CONTEXT_KEY` | 折叠与 active owner |

### 模块索引

| 模块 | 文件 | 职责 |
|:---|:---|:---|
| SidebarItem | [SidebarItem.svelte](./SidebarItem.svelte) | 导航语义与状态视觉 |

## 更新日志 (Changelog)

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
