# Sidebar 更新日志归档

### v1.9.1 (2026-10-12)
- 分隔线组合占位使用最小高度保留上下 padding 与实际线宽，消除源码模式和运行包 CSS 注入顺序差异导致的线条消失。内置、显式分隔线与厚度覆盖保持一致。

- 2026-09-28：Footer 实测高度由组件状态与根样式共同维护，拖宽时不再短暂丢失滚动区的底部预留空间。

- 2026-09-28：Footer 全宽贴底，内边距上 12px / 下 16px / 左右 20px；按更新设计在 Footer 高度内使用 0% / 80% / 100% 覆盖透明度渐隐，并移除圆角。

- 2026-09-28：内置 Indicator 使用整边命中，移除透明颜色特化，统一常态与 hover 视觉。

- 2026-09-21：统一使用文档、源码属性表与 Site / LLM 阅读入口；仅文档修订，不改变组件行为。

### v1.9.0 (2026-09-18)

- 无图标 text 模式完全收起，不保留 60px 空栏；展开按钮独立浮于可视区域左上角，左侧沿用 Sidebar 12px 间距 Token。
- 保留有图标模式的 60px 折叠栏；补齐隐藏内容不可聚焦、浮层清理及键盘焦点恢复。


### v1.8.0 (2026-08-25)

#### 交互变更
- 右侧边框全高改为可拖拽调宽，不再把 Pointer 命中限制在短条附近。
- 移除可见宽度调整短条，保留透明 Indicator 交互层承接 Pointer、键盘、ARIA 与滚动条避让。

### v1.7.3 (2026-08-17)

#### 优化
- 展开态折叠按钮移除额外位移，由 `--size-6` 命中 host 与 `ResourceSize` 16 图标的居中关系确定位置；图标保持在 Header / 导航项内容右边界内侧，名义间距为 4px。

### v1.7.2 (2026-08-17)

#### 修复
- 自定义 `as="logo"` 被安置到 Header 后，导航区由 Svelte 补回的源节点始终保持隐藏；宿主的 `flex` 等 utility 不再覆盖该结构边界并显示重复 Logo。

### v1.7.1 (2026-08-17)

#### 修复
- Footer、Navigation 与滚动区域的尺寸监听迁入共享 `resizeManager`，统一 SSR、能力退化、按帧交付与资源释放边界。

### v1.7.0 (2026-08-15)

#### 新功能
- 将 Site Sidebar 的分割线视觉设为 Sidebar 内全部横向 Separator 的默认样式；内置与外置分割线统一使用四边 8px padding、零行高及同一公开 padding override。

### v1.6.1 (2026-08-12)

#### 变更
- Header 折叠 / 展开按钮从 Button 默认视觉改为 `bare` 模式；icon-only、sm 尺寸、透明命中 host、ARIA、显隐与位移动效保持不变，并与既有 SidebarRequirement 定义重新一致。

### v1.6.0 (2026-08-09)

#### 新功能
- 状态记忆改为默认开启：刷新后恢复 Section 展开 / 折叠与最后 active item，并定位到该 Item；`persistence={false}` 可关闭，多实例通过 `persistenceKey` 隔离。
- 新增 `resizable` 开关；数据模式的 `SidebarItemData` 补齐 `tags` Snippet 与 Snippet Icon 能力，避免站点薄适配层重建 SidebarItem。

### v1.5.2 (2026-08-06)

#### 修复
- 折叠态不再误隐藏 continuous hover 背景层，Item hover 与展开态保持相同背景效果。
- 折叠按钮新增透明命中 host；鼠标直接移动到按钮预期位置时也会显示按钮。

### v1.5.1 (2026-08-06)

#### 修复
- Section 标题除了直接命中会阻断连续 hover，在标题相邻空隙中也参与最近距离判断，避免两个折叠标题之间的鼠标位置错误点亮下方 Table。

### v1.5.0 (2026-08-06)

#### 新功能
- 新增可选 `persistenceKey`：记忆 active item 与 Section 折叠状态，刷新后恢复；active 所在 Section 强制展开。
- 长列表恢复时将 active item 尽量定位到扣除 Footer 覆盖后的可视中心，并在布局动效结束后校正。

#### 修复
- Section 标题被 hover 时阻断连续 hover 最近项推断，避免已折叠标题下方的 SidebarItem 错误出现 hover 背景。

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
- 初始 区块 版本：默认 Logo、`as="logo"` 替换、整体折叠、数据/显式组合、覆盖 Footer 与滚动 Body。
