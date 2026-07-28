# SidebarItem（PRO Block）

> **版本**: v1.2.1
> **职责**: Sidebar 普通导航项，支持 active、更新 Badge、leading icon 与可选操作区。

## API 参考

| 关键字 | 类型 | 默认值 | 描述 |
|:---|:---|:---|:---|
| `id` | `string` | 必填 | 稳定导航标识 |
| `label` | `string` | 必填 | 文字与折叠态可访问名称 |
| `icon` | `string \| Snippet` | — | ResourceIcon 名称或自定义 leading 内容 |
| `iconCollection` | `string` | — | `icon` 的 ResourceIcon collection；存在同名 SnowUI 图标时传入 `"snowui"` |
| `href` | `string` | — | 存在时主操作渲染 Link，否则渲染 Button |
| `updated` | `boolean` | `false` | 内置 `Badge dot` 更新标记 |
| `disabled` | `boolean` | `false` | 禁用主操作 |
| `actions` | `SidebarActionData[] \| Snippet` | `[]` | 0～多个末尾操作；数组生成 `Button bare` |
| `onSelect` | `(id: string) => void` | — | 本项选择回调 |
| `parts` | `ComponentPartsOf` | — | 配置内置 Badge 与数据生成的 Button |

主导航操作与末尾操作是并列节点，不产生交互元素嵌套。`updated` 使用 `<Badge as="badge" dot />`，不继承主 Button 的尺寸，直接采用 Badge dot 默认尺寸 `calc(var(--size-4) * 1.5 / 4)`，即默认 scale 下的 6px × 6px；展开态位于 label 后，折叠态跟随 leading icon。折叠态 label 与末尾 action 的 Tooltip 均由 SidebarItem 内置设置为 `position="right"`，默认显示在对应元素右侧，不要求使用方逐项配置。整体 Sidebar 折叠时，label 与展开态 Badge 保留在 DOM 中并消费 Frame color bridge 渐隐，leading Icon 始终保持原 padding 与横向位置；主操作保持单行且在折叠态裁切已隐藏内容，因此默认 Item 高度稳定为 `var(--size-9)`（默认 36px），不会因隐藏文字换行而增高。渐隐结束后文字进入 `visibility: hidden`，不截获交互。主项始终保持完整不透明度；hover / active 只显示统一背景高亮，leading Icon 与 label 不变色。末尾操作仍保留自身的 bare hover 反馈。

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
