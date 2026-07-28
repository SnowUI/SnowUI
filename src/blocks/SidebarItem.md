# SidebarItem（PRO Block）

> **版本**: v1.0.0
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

主导航操作与末尾操作是并列节点，不产生交互元素嵌套。`updated` 使用 `<Badge as="badge" dot />`，不继承主 Button 的尺寸，直接采用 Badge dot 默认尺寸 `calc(var(--size-4) * 1.5 / 4)`，即默认 scale 下的 6px × 6px；展开态位于 label 后，折叠态跟随 leading icon。主项始终保持完整不透明度；hover / active 只显示统一背景高亮，leading Icon 与 label 不变色。末尾操作仍保留自身的 bare hover 反馈。

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

### v1.0.0 (2026-07-23)

#### 新功能
- 初始版本：Link/Button 主操作、active、更新 Badge、折叠态与 hover/focus actions。
