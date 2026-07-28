# SidebarSection（PRO Block）

> **版本**: v1.0.1
> **职责**: Sidebar 分类块，内置分类标题、展开/收起按钮与可选操作区。

## API 参考

| 关键字 | 类型 | 默认值 | 描述 |
|:---|:---|:---|:---|
| `id` | `string` | 必填 | 稳定分类标识 |
| `title` | `string` | — | 内置分类标题；未传时不渲染标题行 |
| `collapsible` | `boolean` | 有标题时 `true` | 是否提供内置展开/收起按钮 |
| `collapsed` | `boolean` | — | 受控分类折叠状态 |
| `defaultCollapsed` | `boolean` | `false` | 非受控初始状态 |
| `onCollapsedChange` | `(collapsed: boolean) => void` | — | 分类折叠变化回调 |
| `actions` | `SidebarActionData[] \| Snippet` | `[]` | 0～多个标题操作；数组生成 `Button bare` |
| `children` | `Snippet` | — | 分类内容 |
| `parts` | `ComponentPartsOf` | — | 配置数据生成的 Button |

整体 Sidebar 折叠时标题行隐藏，内容仍保留其中可折叠展示的 SidebarItem。分类自身折叠时只隐藏内容。标题行默认 padding 为左右 `8px`（`var(--padding-2)`）、上下 `4px`（`var(--padding-1)`），同时作用于标题、折叠箭头与 actions 的完整排列区域。可折叠分类的标题文字与箭头共同位于一个 `Button bare` 中，整段标题均可点击。数据生成的 action 可用 `iconCollection: "snowui"` 显式选择同名 SnowUI 图标。标题操作按钮之间固定使用 `var(--gap-2)`（8px），常态与 hover 颜色均沿用 `Button bare` 的默认值。

---

> **以下内容供 AI 阅读，用于维护代码与文档的关联**

## 开发者指南 (AI)

| 类别 | 关键字 | 描述 |
|:---|:---|:---|
| CSS 类名 | `snowui-sidebar-section` | 根节点 |
| 布局模型 | Managed Composite | Header + content |

### 模块索引

| 模块 | 文件 | 职责 |
|:---|:---|:---|
| SidebarSection | [SidebarSection.svelte](./SidebarSection.svelte) | 分类折叠与标题操作 |

## 更新日志 (Changelog)

### v1.0.1 (2026-07-28)

#### 变更
- SidebarSection 标题行默认增加左右 8px、上下 4px padding。

### v1.0.0 (2026-07-23)

#### 新功能
- 初始版本：内置分类标题、下箭头折叠与 hover/focus 操作区。
