# Sidebar（PRO Block）

> **版本**: v1.4.2
> **职责**: 提供可折叠的应用侧边栏骨架，管理固定 Header、滚动导航区与底部覆盖 Footer。
> **归属**: PRO Blocks / Template Block

Sidebar 默认内置由 SnowUILogo `icon` / `text` 变体组成的 SnowUI Logo 与折叠按钮；导航内容既可由 `sections` 数据生成，也可显式组合 `SidebarItem`、`SidebarSection`、`Separator` 和自定义内容。根容器默认透明。

## API 参考

| 关键字 | 类型 | 默认值 | 描述 |
|:---|:---|:---|:---|
| `sections` | `SidebarSectionData[]` | `[]` | 默认数据模式的分类与导航项 |
| `navigationVariant` | `"icon" \| "text"` | `"icon"` | 导航结构变体；`text` 折叠后只保留始终可见的展开按钮 |
| `collapsed` | `boolean` | — | 受控折叠状态 |
| `defaultCollapsed` | `boolean` | `false` | 非受控初始折叠状态 |
| `width` | `number` | `220` | 展开宽度，支持 `bind:width`；拖拽右侧 Indicator 时实时更新 |
| `minWidth` | `number` | `160` | 可拖拽展开宽度下限 |
| `maxWidth` | `number` | `480` | 可拖拽展开宽度上限 |
| `activeItemId` | `string` | — | 唯一 active item 来源 |
| `onCollapsedChange` | `(collapsed: boolean) => void` | — | 折叠状态变化回调 |
| `onWidthChange` | `(width: number) => void` | — | 展开宽度变化回调 |
| `onActiveItemChange` | `(itemId: string) => void` | — | 导航选择回调 |
| `children` | `Snippet` | — | 显式组合内容；可与 `sections` 同时使用 |
| `parts` | `ComponentPartsOf` | — | 配置内置 Indicator，以及默认生成的 SnowUILogo / SidebarSection / SidebarItem |

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

- 展开默认宽度 `220px`，折叠宽度 `60px`，高度 `100%`。展开宽度可通过右边缘 `Indicator` 在默认 `160px`～`480px` 范围内拖拽，并通过 `width` / `bind:width` 与 `onWidthChange` 对外同步。
- 折叠与展开以 Sidebar 根宽度为主时间轴：展开宽度 → 60px 使用 `SIDE_PANEL_DISAPPEAR_MOTION` 的临界阻尼 spring timing，60px → 上次展开宽度使用 `SIDE_PANEL_APPEAR_MOTION` 的同系 timing；该 timing 复用 Frame 默认 move spring。拖拽期间临时关闭宽度 transition，使边缘与指针同步；`enableDefaultMotion={false}` 与系统 reduced motion 均关闭该过渡。
- 右侧宽度 Indicator 仅在展开态存在，鼠标进入 Sidebar 任意区域即显示；视觉中心默认距右边缘 `4px`，默认 16px 高视觉条的命中范围只覆盖视觉条上下各 `4px`，合计 24px，不再沿 Sidebar 全高截获指针。Indicator 与 Sidebar 的可见 overlay scrollbar Thumb 重叠时由 Indicator 通用能力自动隐藏，并关闭自身 Pointer、hover、拖拽与键盘命中，只保留滚动条交互。折叠不会覆盖已调整的展开宽度，再次展开时恢复该宽度。
- 根容器默认 padding 为左右 `12px`（`var(--padding-3)`）、上下 `16px`（`var(--padding-4)`）；这是 Sidebar 组件默认值，不由使用方重复补 class 或 style。
- Header 固定，`ScrollArea` 独立滚动并延伸到 Sidebar 底部；Footer 固定覆盖在 Body 之上。Sidebar 根的 Header / Body 默认 gap 为 `var(--gap-3)`（12px），即 Logo 区域与下方导航区域之间的默认间距；它与 Body 内相邻导航内容的 4px gap 是两个独立层级。
- Body 纵向 overlay scrollbar 根据根横向 padding 自动外移，轨道右边缘始终距 Sidebar 右边框 `4px`；默认 12px 横向 padding 时其 `right` 偏移为 `-8px`。
- Logo 所在 Header 区域使用 `4px` 上下 padding；Body 向下滚动后在 Logo 下方启用通用 `.snowui-scroll-mask` 顶部渐隐，渐隐带同样限制为 `4px` 且不增加布局高度，回到顶部时移除遮罩。
- Body 导航内容默认使用 `var(--gap-1)`（4px）间距，直接组合的 SidebarItem 与 SidebarSection 内部列表保持一致。
- 默认与自定义 `as="logo"` host 均使用 `4px` 左右 padding，使 Logo 图形与 SidebarItem 图标垂直对齐。
- Header 在展开 / 折叠状态使用同一套起始对齐结构，Logo Icon 保持固定 leading slot；Test 示例以固定宽度左对齐宿主承载 Sidebar，避免居中宿主在根宽度变化时带动整个 Logo 位移。Logo host 强制保持单行，wordmark 通过 host 裁切与透明度收起，不会在窄宽度下换行并撑高 Logo，也不在动效起点直接切换整体 Header 对齐。
- 折叠按钮是内置默认变体的 icon-only `Button`，与 Logo 位于同一 Header 水平线上，并始终位于 Logo host 分配区域的右边。Logo host 填充按钮之前的剩余 Header 宽度，只设置稳定的 36px 最小 leading slot；按钮会跟随 Sidebar 宽度以 Frame 默认 move spring 从 Logo 区域右侧平移到折叠位置，不发生瞬移。默认 `navigationVariant="icon"` 时仅在 Sidebar hover / focus-within 显形；`navigationVariant="text"` 的折叠态隐藏 Logo、Body 和 Footer，只保留水平居中且始终可见的展开按钮。
- 折叠开始时，Sidebar 宽度、Item 文字与 Section 标题同时开始变化：宽度收窄，Item 文字和标题消费 Frame color bridge 渐隐；Item leading Icon 保持原横向位置。标题透明度归零后，标题高度、padding 与 Section gap 才消费 Frame size bridge 收起，Item 随后上移。展开时按同一组 bridge 平滑恢复。
- 折叠按钮不内置 Tooltip，通过随状态更新的 `aria-label` 保留“展开 / 折叠侧边栏”可访问名称。其余内置 Tooltip（折叠态 Item label、Item action、Section action）统一位于对应元素右侧（`position="right"`）。Section 标题默认可折叠但不显示 Tooltip。
- 默认不设置背景色。
- Footer 只内置底部覆盖区域，不内置业务文案；区域默认使用 Figma Auto Layout 的 Align top left：内容整体位于容器左上方，内部横向排列并在同一水平线上垂直居中，内容 gap 与四边 padding 均为 `8px`。区域保持 `12px` 圆角、透明背景与 `backdrop-filter: blur(20px)`。直接子节点 `as="footer"` 提供业务内容。折叠 / 展开期间 Footer 固定使用展开态内容宽度与底部位置，不跟随根宽度收缩或位移，只使用与 Sidebar 宽度时间轴一致的 opacity 渐隐 / 渐显；折叠态通过 `inert`、`aria-hidden` 与 `pointer-events: none` 退出交互。
- 存在 Footer 时，Sidebar 通过 `ResizeObserver` 跟踪 Footer 实际高度，并为 Navigation 的滚动末端增加“Footer 实际高度 + 固定 `12px`”安全区；滚动到底后最后一个 Item 完整停在 Footer 上方。此 `12px` 是 Footer 遮挡保护契约，不跟随外部 `--snowui-sidebar-navigation-gap-override`、Section gap 或 Item gap 改变。

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
| `collapsed` | Context + `data-collapsed` | 通过 SidePanel spring timing 控制根宽度与子组件折叠视觉 |
| `navigationVariant` | `data-navigation-variant` | `icon` 保留折叠图标轨；`text` 折叠后只保留展开按钮 |
| `width` | bindable + Indicator | 右边缘拖拽更新展开宽度；折叠后保留 |
| `activeItemId` | Context | SidebarItem 推导 active |
| `as="logo"` | 稳定 Header host | 替换默认 SnowUILogo |
| `as="logo-icon"` | 自定义 Logo 的直接子节点 | 折叠后唯一保留的 Logo 图形 |
| `as="footer"` | 稳定底部覆盖 Footer host | 折叠态自动隐藏 |
| `.snowui-scroll-mask` | OSS 通用内容渐隐能力 | Body 向下滚动后启用顶部渐隐 |
| `sections` | 默认生成 | 生成 SidebarSection / SidebarItem |

### 关联关系

- **子组件**: SidebarSection、SidebarItem
- **依赖**: Frame、ScrollArea、SnowUILogo、Button、Indicator、ResourceIcon、SidePanel motion preset
- **规范**: `../../../specs/LayoutProtocol.md`、`../../../specs/ComponentGuidelines.md`

## 更新日志 (Changelog)

### v1.4.2 (2026-07-28)

#### 修复
- Sidebar 任意区域 hover 继续显示宽度 Indicator；与可见 scrollbar Thumb 重叠时，Indicator 完全退出 Pointer、hover、拖拽和键盘命中，只允许滚动条响应。

### v1.4.1 (2026-07-28)

#### 修复
- Footer 在折叠 / 展开期间固定展开态几何位置与宽度，只做 opacity 渐隐 / 渐显，消除 SB-01 中的压缩错位和跳动；折叠态同步退出交互与无障碍焦点。

### v1.4.0 (2026-07-28)

#### 变更
- 右侧宽度 Indicator 的纵向命中范围收窄为视觉条上下各 4px；与 overlay scrollbar 重叠时由 Indicator 自动隐藏。
- Header 折叠按钮改用 Button 默认 icon-only 形态，并固定在 Logo host 分配区域的右边。

### v1.3.1 (2026-07-28)

#### 变更
- 移除 Header 折叠 / 展开按钮的内置 Tooltip，继续通过动态 `aria-label` 保留可访问名称。

### v1.3.0 (2026-07-28)

#### 动效优化
- 折叠按钮跟随 Sidebar 宽度，以 Frame 默认 move spring 平移到折叠位置。
- Sidebar 收窄、Item 文字与 Section 标题渐隐同时开始；Item leading Icon 保持横向位置。
- Section 标题完全渐隐后才收起标题占位与 gap，使 Item 在第二阶段上移。

### v1.2.1 (2026-07-28)

#### 修复
- Logo host 在折叠和展开动效期间保持单行，避免透明 wordmark 在窄宽度下换行、撑高容器并造成 Logo 垂直错位。

### v1.2.0 (2026-07-28)

#### 新功能
- 新增 `navigationVariant="icon|text"`；`text` 折叠态只保留始终可见的展开按钮，不扫描动态 children 推断 Icon。

#### 修复
- Header 改为稳定的起始对齐结构，Logo Icon 使用固定 leading slot；Test 示例使用固定宽度左对齐宿主，消除宽度收起时的 Logo 跳动。
- 显式 `as="logo"` 的 DOM 安置延后到下一帧，先让默认 Logo 条件分支稳定卸载，避免移动 Svelte 管理节点时破坏 Test 页面渲染。
- Sidebar 全部内置 Tooltip 统一位于元素右侧；标题默认可折叠但移除 Tooltip。
- 折叠按钮 Tooltip 由 Tooltip 的动效感知能力在宽度动效开始时立即关闭。

### v1.1.0 (2026-07-28)

#### 新功能
- 折叠 / 展开改为根宽度 spring 动效，复用 SidePanel 进退场的临界阻尼 timing。
- 展开态右边缘新增 Indicator，可在 160px～480px 范围拖拽并通过 `width` / `bind:width` / `onWidthChange` 同步；折叠后保留上次展开宽度。

### v1.0.5 (2026-07-28)

#### 变更
- 确认 Sidebar 根 Header / Body 默认 gap 为 12px，并将折叠态 SidebarItem Tooltip 的默认位置设为 Icon 右侧。

### v1.0.4 (2026-07-28)

#### 修复
- 根据 Footer 实际高度动态增加滚动末端安全区，最后一个 Item 与 Footer 固定保持 12px，不受外部列表 gap 覆盖影响。

### v1.0.3 (2026-07-28)

#### 变更
- Footer 四边默认 padding 统一为 8px；内容整体采用 Align top left，内部横向排列并沿同一水平线居中。

### v1.0.2 (2026-07-28)

#### 变更
- Footer 默认采用左上对齐与 8px 内容间距；SB-04 移除 Footer 节点的全部自定义布局样式。

### v1.0.1 (2026-07-28)

#### 变更
- 明确根组件默认 padding 为左右 12px、上下 16px，并将 Body 纵向滚动条对齐到距 Sidebar 右边框 4px。

### v1.0.0 (2026-07-23)

#### 新功能
- 初始 PRO Block 版本：默认 Logo、`as="logo"` 替换、整体折叠、数据/显式组合、覆盖 Footer 与滚动 Body。
