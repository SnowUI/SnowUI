# SidebarSection（PRO Block）

> **版本**: v1.3.0
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

整体 Sidebar 折叠时，标题行先消费 Frame color bridge 渐隐；透明度归零后，标题高度、纵向 padding 与 Section gap 才消费 Frame size bridge 收起，因此内容 Item 在标题消失后才开始上移。标题节点保留在 DOM 中，并在折叠期间通过 `inert`、`aria-hidden` 与延迟 `visibility: hidden` 停止交互。分类自身折叠时不渲染内容子树；Sidebar 在折叠前记忆 active item 的 Section 归属，因此刷新恢复无需保留隐藏内容 DOM。标题行默认 padding 为左右 `8px`（`var(--padding-2)`）、上下 `4px`（`var(--padding-1)`），同时作用于标题、折叠箭头与 actions 的完整排列区域。有标题时默认可折叠；标题文字与箭头共同位于一个 `Button bare emphasis="muted"` 中，整段标题均可点击且不显示 Tooltip。数据生成的 action 可用 `iconCollection: "snowui"` 显式选择同名 SnowUI 图标，action Tooltip 统一显示在按钮右侧。标题操作按钮之间固定使用 `var(--gap-2)`（8px），并同样显式使用 muted 强调级别保留 40% → hover 100% 的次级操作视觉。

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
