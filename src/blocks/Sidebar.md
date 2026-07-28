# Sidebar（PRO Block）

> **版本**: v1.0.0
> **职责**: 提供可折叠的应用侧边栏骨架，管理固定 Header、滚动导航区与底部覆盖 Footer。
> **归属**: PRO Blocks / Template Block

Sidebar 默认内置由 SnowUILogo `icon` / `text` 变体组成的 SnowUI Logo 与折叠按钮；导航内容既可由 `sections` 数据生成，也可显式组合 `SidebarItem`、`SidebarSection`、`Separator` 和自定义内容。根容器默认透明。

## API 参考

| 关键字 | 类型 | 默认值 | 描述 |
|:---|:---|:---|:---|
| `sections` | `SidebarSectionData[]` | `[]` | 默认数据模式的分类与导航项 |
| `collapsed` | `boolean` | — | 受控折叠状态 |
| `defaultCollapsed` | `boolean` | `false` | 非受控初始折叠状态 |
| `activeItemId` | `string` | — | 唯一 active item 来源 |
| `onCollapsedChange` | `(collapsed: boolean) => void` | — | 折叠状态变化回调 |
| `onActiveItemChange` | `(itemId: string) => void` | — | 导航选择回调 |
| `children` | `Snippet` | — | 显式组合内容；可与 `sections` 同时使用 |
| `parts` | `ComponentPartsOf` | — | 配置默认生成的 SnowUILogo / SidebarSection / SidebarItem |

默认 Logo 的 host 为 `as="logo"`，内部以 `SnowUILogo as="logo-icon" variant="icon"` 与 `SnowUILogo as="logo-wordmark" variant="text"` 明确区分图形和字标。直接子节点 `as="logo"` 会被安置到 Header 并完整替换默认 Logo；自定义 Logo 同样必须用它的直接子节点 `as="logo-icon"` 标记折叠后保留的图形，其余直接子节点视为展开态文字或字标并在折叠时隐藏。直接子节点 `as="footer"` 会被安置到底部覆盖 Footer。它们不抑制 `sections` 生成的 Body 内容，其余显式子节点会与 `sections` 依次渲染在 Body。第三方内容不支持 `as` 时，用对应角色的 `Frame` 包裹。Sidebar 根输出 `data-collapsed`，并提供 Sidebar Context。

```svelte
<Sidebar activeItemId="dashboard">
  <Frame as="logo" row>
    <BrandIcon as="logo-icon" />
    <Text>Brand</Text>
  </Frame>
  <SidebarItem id="dashboard" label="Dashboard" icon="dashboard" updated />
  <Separator />
  <SidebarSection id="page" title="Page">
    <SidebarItem id="social" label="Social media" icon="chat" />
  </SidebarSection>
  <Text as="footer">© 2026 SnowUI</Text>
</Sidebar>
```

## 布局与行为

- 展开宽度 `220px`，折叠宽度 `60px`，高度 `100%`。
- Header 固定，`ScrollArea` 独立滚动并延伸到 Sidebar 底部；Footer 固定覆盖在 Body 之上。
- Logo 所在 Header 区域使用 `4px` 上下 padding；Body 向下滚动后在 Logo 下方启用通用 `.snowui-scroll-mask` 顶部渐隐，渐隐带同样限制为 `4px` 且不增加布局高度，回到顶部时移除遮罩。
- Body 导航内容默认使用 `var(--gap-1)`（4px）间距，直接组合的 SidebarItem 与 SidebarSection 内部列表保持一致。
- 默认与自定义 `as="logo"` host 均使用 `4px` 左右 padding，使 Logo 图形与 SidebarItem 图标垂直对齐。
- 折叠按钮是内置 `Button bare`，与 Logo 位于同一 Header 水平线上，仅在 Sidebar hover / focus-within 时通过 `visibility` 显形；Sidebar 不覆盖按钮 opacity，因此常态与按钮自身 hover 颜色均沿用 bare 默认值。折叠态下 Logo host 禁止 flex shrink，Logo 图形与按钮图标的视觉间距稳定为 `8px`。
- 默认不设置背景色。
- Footer 只内置底部覆盖区域，不内置业务文案；区域默认左右 padding `20px`、上下 padding `8px`、圆角 `12px`、透明背景与 `backdrop-filter: blur(20px)`，直接子节点 `as="footer"` 提供业务内容，折叠态由 Sidebar 内置隐藏。

---

> **以下内容供 AI 阅读，用于维护代码与文档的关联**

## 开发者指南 (AI)

### 开发者关键字

| 类别 | 关键字 | 描述 |
|:---|:---|:---|
| CSS 类名 | `snowui-sidebar` | 根节点 |
| Context Key | `SIDEBAR_CONTEXT_KEY` | 折叠与 active owner |
| 直接角色 | `logo` / `footer` | 替换默认 Logo / 安置固定 Footer 内容 |
| 布局模型 | Managed Composite | 固定 Header / ScrollArea / 覆盖 Footer 结构 |

### 模块索引

| 模块 | 文件 | 职责 |
|:---|:---|:---|
| Sidebar | [Sidebar.svelte](./Sidebar.svelte) | 根组件与默认数据模式 |
| Context | [sidebar-context.svelte.ts](./sidebar-context.svelte.ts) | 组件族共享状态 |
| SidebarSection | [SidebarSection.svelte](./SidebarSection.svelte) | 分类块 |
| SidebarItem | [SidebarItem.svelte](./SidebarItem.svelte) | 导航项 |

### 关键字映射

| 关键字 | 处理方式 | 说明 |
|:---|:---|:---|
| `collapsed` | Context + `data-collapsed` | 控制宽度与子组件折叠视觉 |
| `activeItemId` | Context | SidebarItem 推导 active |
| `as="logo"` | 稳定 Header host | 替换默认 SnowUILogo |
| `as="logo-icon"` | 自定义 Logo 的直接子节点 | 折叠后唯一保留的 Logo 图形 |
| `as="footer"` | 稳定底部覆盖 Footer host | 折叠态自动隐藏 |
| `.snowui-scroll-mask` | OSS 通用内容渐隐能力 | Body 向下滚动后启用顶部渐隐 |
| `sections` | 默认生成 | 生成 SidebarSection / SidebarItem |

### 关联关系

- **子组件**: SidebarSection、SidebarItem
- **依赖**: Frame、ScrollArea、SnowUILogo、Button、ResourceIcon
- **规范**: `../../../specs/LayoutProtocol.md`、`../../../specs/ComponentGuidelines.md`

## 更新日志 (Changelog)

### v1.0.0 (2026-07-23)

#### 新功能
- 初始 PRO Block 版本：默认 Logo、`as="logo"` 替换、整体折叠、数据/显式组合、覆盖 Footer 与滚动 Body。
