export const examples = [
    {
        name: "SB-01：默认数据模式与固定三区",
        code: `SB-01
<Frame style="width: 220px; height: 28rem; align-items: flex-start;">
    <Sidebar
        activeItemId="dashboard"
        sections={[
            { id: "quick", items: [
                { id: "saved", label: "Saved", icon: "bookmark", updated: true },
                { id: "creations", label: "Creations", icon: "palette" },
            ] },
            { id: "page", title: "Page", actions: [
                { id: "more", icon: "three-dots", iconCollection: "snowui", label: "More" },
                { id: "add", icon: "add", iconCollection: "snowui", label: "Add page" },
            ], items: [
                { id: "dashboard", label: "Dashboard", icon: "gauge", actions: [{ id: "more", icon: "three-dots", iconCollection: "snowui", label: "More actions" }] },
                { id: "social", label: "Social media", icon: "chat" },
            ] },
        ]}
    >
        <Text as="footer" class="text-black-40">© 2026 SnowUI</Text>
    </Sidebar>
</Frame>`,
        expected: {
            render: "默认 Logo 由 SnowUILogo icon/text 变体组成，分类标题、分类末尾内置 Separator、active Dashboard、Saved updated 圆点与 Footer 均可见",
            layout: "Sidebar 展开默认宽 220px、折叠宽 60px，根 padding 左右 12px / 上下 16px；Section 标题行 padding 左右 8px / 上下 4px，分类末尾 Separator 节点四边 padding 8px；Logo host 左右 padding 4px；Header/Footer 固定，Body 可滚动且纵向滚动条可见并距 Sidebar 右边框 4px",
            interaction: "Sidebar 任意区域 hover 显示位于 Logo 区域右边的默认变体 icon-only 折叠按钮与右侧宽度 Indicator；折叠按钮不内置 Tooltip，通过动态 aria-label 保留名称，并以 Frame 默认 move spring 跟随 Sidebar 平移；Indicator 只在 16px 视觉条上下各 4px 的局部范围内激活，默认允许 160px～480px 拖拽且拖拽期间无宽度 transition；Indicator 与可见 scrollbar Thumb 重叠时隐藏并完全退出 Pointer、hover、拖拽和键盘命中，只允许滚动条响应；分类标题文字与箭头共同点击折叠且标题无 Tooltip",
            performance: "as=footer 与 sections 同时传入时不抑制默认导航节点",
            responsive: "固定宽度、左对齐 Test 宿主保持 Sidebar 左边缘不动；折叠时根宽度、Item 文字与标题渐隐同时开始，Item Icon 保持横向位置，标题完全渐隐后 Item 才上移；Footer 固定展开态宽度与底部位置且只渐隐 / 渐显，不随根宽度压缩或位移；折叠后 Item 保持默认 36px 高度，Logo Icon 不跳动，Logo host 保持单行且透明 wordmark 不得换行撑高容器；默认 Logo 只保留 as=logo-icon，同时隐藏宽度 Indicator",
        },
        logic: ["SB-Init.1", "SB-Init.2", "SB-Init.5"],
    },
    {
        name: "SB-02：显式组合与 Logo 替换",
        code: `SB-02
<Frame style="width: 220px; height: 28rem; align-items: flex-start;">
    <Sidebar activeItemId="dashboard">
        <Frame as="logo" row class="items-center gap-8">
            <SnowUILogo as="logo-icon" variant="icon" />
            <Text>Workshop</Text>
        </Frame>
        <SidebarItem id="explore" label="Explore" icon="compass" updated />
        <Separator />
        <SidebarSection id="page" title="Page">
            <SidebarItem id="dashboard" label="Dashboard" icon="gauge" />
            <SidebarItem id="social" label="Social media" icon="chat" />
        </SidebarSection>
        <SidebarSection id="tags" title="Tags">
            <Frame row wrap class="gap-4">
                <Tag>Overview</Tag><Tag>Settings</Tag><Tag>Billing</Tag>
            </Frame>
        </SidebarSection>
    </Sidebar>
</Frame>`,
        expected: {
            render: "Workshop 显式 Logo 完整替换默认横向 SnowUILogo，导航与 Tags 自由混排",
            layout: "as=logo 节点位于固定 Header 且左右 padding 4px；Header 与下方 Body 的根级 gap 为 12px；显式 Separator 与两个 SidebarSection 内置 Separator 均使用上下 / 左右 8px padding、零行高和相同线条视觉；直接子节点 as=logo-icon 定义折叠保留图形",
            interaction: "Section 折叠按钮显式使用 muted bare 的常态与 hover 透明度；Page 与 Tags 标题默认均可展开收起且标题无需 Tooltip",
            performance: "未传 sections 时只渲染显式 Body 内容",
            responsive: "折叠后只保留 as=logo-icon 图形，图形与折叠按钮间距 8px，并隐藏 Workshop、分类标题和 Tags 内容",
        },
        logic: ["SB-Init.3", "SB-Init.4", "SB-Init.6"],
    },
    {
        name: "SB-03：60px 折叠态与折叠 Footer",
        code: `SB-03
<Frame style="width: 220px; height: 28rem; align-items: flex-start;">
    <Sidebar defaultCollapsed activeItemId="saved">
        <SidebarItem id="saved" label="Saved" icon="bookmark" updated />
        <SidebarItem id="hot" label="Hot" icon="fire" />
        <Avatar as="footer" aria-label="Current user" />
    </Sidebar>
</Frame>`,
        expected: {
            render: "折叠态仅显示 Logo mark、导航图标与更新圆点，并隐藏 as=footer 内容",
            layout: "根宽度严格为 60px，展开态直接 SidebarItem 间距默认 4px；Badge 跟随 leading icon 且不占隐藏文字空间",
            interaction: "hover 显示展开按钮；图标导航通过 aria-label 保留名称，label Tooltip 默认显示在 Icon 右侧",
            performance: "折叠态由 Sidebar 内置机制隐藏 Footer",
            responsive: "窄栏仍保持 12px 横向 padding；Footer 保持展开态几何宽度与底部位置，仅以 opacity 隐藏并退出交互",
        },
        logic: ["SB-Init.2", "SB-Init.7"],
    },
    {
        name: "SB-04：长列表滚动与覆盖 Footer",
        code: `SB-04
<Frame style="width: 220px; height: 28rem; align-items: flex-start;">
    <Sidebar activeItemId="dashboard">
        <SidebarItem id="saved" label="Saved" icon="bookmark" updated />
        <SidebarItem id="dashboard" label="Dashboard" icon="gauge" />
        <SidebarItem id="messages" label="Messages" icon="chat" />
        <SidebarItem id="creations" label="Creations" icon="palette" />
        <SidebarItem id="discover" label="Discover" icon="compass" />
        <SidebarItem id="popular" label="Popular" icon="fire" />
        <SidebarItem id="archive" label="Archive" icon="bookmark" />
        <SidebarItem id="reports" label="Reports" icon="gauge" />
        <SidebarItem id="comments" label="Comments" icon="chat" />
        <SidebarItem id="drafts" label="Drafts" icon="palette" />
        <SidebarItem id="following" label="Following" icon="compass" />
        <SidebarItem id="trending" label="Trending" icon="fire" />
        <SidebarItem id="favorites" label="Favorites" icon="bookmark" />
        <SidebarItem id="analytics" label="Analytics" icon="gauge" />
        <Frame
            as="footer"
        >
            <Avatar aria-label="Current user" />
            <Text>Yuan</Text>
        </Frame>
    </Sidebar>
</Frame>`,
        expected: {
            render: "长列表、滚动条与底部用户 Footer 同时可见",
            layout: "根 padding 左右 12px / 上下 16px，纵向滚动条距 Sidebar 右边框 4px；Logo 区上下间距与渐隐带均为 4px；Footer 不带示例自定义样式，内容整体位于容器左上方，内部横向排列并在同一水平线上居中，gap 与四边 padding 均为 8px",
            interaction: "向下滚动时 Logo 下方使用通用 scroll mask 渐隐；Footer 保持固定，条目从透明模糊区域下方经过；滚动到底后最后一个 Item 完整停在 Footer 上方并保持固定 12px 间距",
            performance: "Footer 只定位一次，不参与列表滚动与重复渲染",
            responsive: "Sidebar 高度由 28rem 宿主约束，内容溢出仅产生纵向滚动；Footer 内容高度变化时底部安全区自动更新",
        },
        logic: ["SB-Init.1", "SB-Init.2", "SB-Init.7"],
    },
    {
        name: "SB-05：无 Icon 导航变体",
        code: `SB-05
<Frame style="width: 220px; height: 28rem; align-items: flex-start;">
    <Sidebar navigationVariant="text" defaultCollapsed activeItemId="overview">
        <SidebarSection id="workspace" title="Workspace">
            <SidebarItem id="overview" label="Overview" />
            <SidebarItem id="projects" label="Projects" />
            <SidebarItem id="settings" label="Settings" />
        </SidebarSection>
    </Sidebar>
</Frame>`,
        expected: {
            render: "text 变体折叠后只显示内置展开按钮，不显示 Logo、导航 Item 或 Footer",
            layout: "展开按钮在 60px 折叠栏的内容区域水平居中，左对齐 Test 宿主保持 Sidebar 左边缘稳定",
            interaction: "折叠状态无需 hover 即可看到展开按钮；按钮不内置 Tooltip，并通过 aria-label 保留名称；展开后标题默认可折叠且无 Tooltip",
            performance: "不扫描 children 或 sections 判断是否存在 Icon，变体完全由 navigationVariant 显式决定",
            responsive: "隐藏导航内容后不存在不可见的键盘焦点；展开恢复完整文本导航",
        },
        logic: ["SB-Init.2", "SB-Init.6", "NavigationVariant"],
    },
    {
        name: "SB-06：连续 Hover 与关闭开关",
        code: `SB-06
<Frame style="width: 220px; height: 20rem;">
    <Sidebar activeItemId="overview">
        <SidebarItem id="overview" label="Overview" />
        <SidebarItem id="projects" label="Projects" />
        <SidebarItem id="settings" label="Settings" />
    </Sidebar>
</Frame>
<Sidebar continuousHover={false}>
    <SidebarItem id="fallback" label="Fallback" />
</Sidebar>`,
        expected: {
            render: "默认实例仅生成一个共享 hover 背景层；关闭实例不生成可见共享层。",
            layout: "背景层匹配当前 SidebarItem 的位置、宽高与圆角。",
            interaction: "背景在项目间连续移动；hover active 项时与 active 背景叠加加深；关闭后恢复逐项 hover。",
            performance: "容器级 rAF 与共享 ResizeObserver，不为每项创建动画节点。",
            responsive: "折叠、展开和尺寸变化后重新测量当前项。",
        },
        logic: ["ContinuousHover", "ActiveLayering", "OptOut"],
    },
    {
        name: "SB-07：状态记忆与 active 定位",
        code: `SB-07
<Frame style="width: 220px; height: 20rem;">
    <Sidebar>
        <SidebarSection id="top" title="Top">
            <SidebarItem id="overview" label="Overview" />
            <SidebarItem id="projects" label="Projects" />
            <SidebarItem id="activity" label="Activity" />
            <SidebarItem id="members" label="Members" />
        </SidebarSection>
        <SidebarSection id="middle" title="Middle">
            <SidebarItem id="reports" label="Reports" />
            <SidebarItem id="comments" label="Comments" />
            <SidebarItem id="drafts" label="Drafts" />
            <SidebarItem id="archive" label="Archive" />
        </SidebarSection>
        <SidebarSection id="bottom" title="Bottom">
            <SidebarItem id="table" label="Table" />
            <SidebarItem id="settings" label="Settings" />
            <SidebarItem id="billing" label="Billing" />
        </SidebarSection>
    </Sidebar>
</Frame>`,
        expected: {
            render: "刷新后恢复各 Section 的展开 / 折叠状态与最后选中的 active item。",
            layout: "列表可滚动时，恢复后的 active item 尽量位于扣除 Footer 安全区后的可视中心；首尾按滚动边界夹紧。",
            interaction: "若 active item 所属 Section 上次被折叠，刷新后该 Section 自动展开；hover Section 标题或两个折叠标题之间的空隙时共享 hover 层隐藏，不点亮下方最近 Item；整体折叠后 Item 仍显示连续 hover 背景，直接进入折叠按钮预期位置也会显示按钮。",
            performance: "默认使用 snowui:sidebar:default 命名空间读写 localStorage；恢复后进行即时与动效结束后的两次定位校正。多实例通过不同 persistenceKey 隔离。",
            responsive: "Section 内容折叠时卸载；active item 的 Section 归属由 Sidebar 独立记忆。",
        },
        logic: ["Persistence", "ActiveReveal", "SectionRecovery", "HoverBlocker"],
    },
    {
        name: "SB-08：关闭宽度调整、状态记忆与数据标签",
        code: `SB-08
{#snippet proTag()}<Tag>PRO</Tag>{/snippet}
<Frame style="width: 220px; height: 20rem;">
    <Sidebar
        resizable={false}
        persistence={false}
        sections={[
            { id: "components", title: "Components", items: [
                { id: "gauge-chart", label: "GaugeChart", icon: "gauge", tags: proTag },
            ] },
        ]}
    />
</Frame>`,
        expected: {
            render: "数据模式 SidebarItem 正常渲染由 tags Snippet 提供的 PRO 标签。",
            layout: "关闭 resizable 后不渲染右侧宽度 Indicator，Sidebar 保持 width 指定或默认宽度。",
            interaction: "导航选择与 Section 折叠仍可用；刷新后不恢复 active item 或 Section 折叠状态。",
            performance: "persistence={false} 时不读取或写入 localStorage。",
            responsive: "站点可由外层响应式布局决定何时使用固定宽度或其他导航形态。",
        },
        logic: ["ResizableOptOut", "PersistenceOptOut", "DataTags"],
    },
] as const;
