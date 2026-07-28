export const examples = [
    {
        name: "SB-01：默认数据模式与固定三区",
        code: `SB-01
<Frame style="height: 28rem;">
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
            render: "默认 Logo 由 SnowUILogo icon/text 变体组成，分类标题、active Dashboard、Saved 更新圆点与 Footer 均可见",
            layout: "Sidebar 宽 220px；Logo host 左右 padding 4px；Header/Footer 固定且 Body 可滚动",
            interaction: "Sidebar hover 只控制折叠按钮显形；按钮常态与自身 hover 使用 Button bare 默认颜色；分类标题文字与箭头共同点击折叠",
            performance: "as=footer 与 sections 同时传入时不抑制默认导航节点",
            responsive: "折叠后默认 Logo 只保留 as=logo-icon，图形与折叠按钮保持 8px 视觉间距；组件高度随宿主变化",
        },
        logic: ["SB-Init.1", "SB-Init.2", "SB-Init.5"],
    },
    {
        name: "SB-02：显式组合与 Logo 替换",
        code: `SB-02
<Frame style="height: 28rem;">
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
        <SidebarSection id="tags" title="Tags" collapsible={false}>
            <Frame row wrap class="gap-4">
                <Tag>Overview</Tag><Tag>Settings</Tag><Tag>Billing</Tag>
            </Frame>
        </SidebarSection>
    </Sidebar>
</Frame>`,
        expected: {
            render: "Workshop 显式 Logo 完整替换默认横向 SnowUILogo，导航与 Tags 自由混排",
            layout: "as=logo 节点位于固定 Header 且左右 padding 4px；直接子节点 as=logo-icon 定义折叠保留图形",
            interaction: "折叠按钮使用 Button bare 默认常态与 hover 颜色；Page 标题可展开收起，Tags 无折叠按钮",
            performance: "未传 sections 时只渲染显式 Body 内容",
            responsive: "折叠后只保留 as=logo-icon 图形，图形与折叠按钮间距 8px，并隐藏 Workshop、分类标题和 Tags 内容",
        },
        logic: ["SB-Init.3", "SB-Init.4", "SB-Init.6"],
    },
    {
        name: "SB-03：60px 折叠态与折叠 Footer",
        code: `SB-03
<Frame style="height: 28rem;">
    <Sidebar defaultCollapsed activeItemId="saved">
        <SidebarItem id="saved" label="Saved" icon="bookmark" updated />
        <SidebarItem id="hot" label="Hot" icon="fire" />
        <Avatar as="footer" aria-label="Current user" />
    </Sidebar>
</Frame>`,
        expected: {
            render: "折叠态仅显示 Logo mark、导航图标与更新圆点，并隐藏 as=footer 内容",
            layout: "根宽度严格为 60px，展开态直接 SidebarItem 间距默认 4px；Badge 跟随 leading icon 且不占隐藏文字空间",
            interaction: "hover 显示展开按钮，图标导航通过 Tooltip/aria-label 保留名称",
            performance: "折叠态由 Sidebar 内置机制隐藏 Footer",
            responsive: "窄栏仍保持 12px 横向 padding",
        },
        logic: ["SB-Init.2", "SB-Init.7"],
    },
    {
        name: "SB-04：长列表滚动与覆盖 Footer",
        code: `SB-04
<Frame style="height: 28rem;">
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
            row
            class="items-center gap-8"
            style="height: 32px;"
        >
            <Avatar aria-label="Current user" />
            <Text>Yuan</Text>
        </Frame>
    </Sidebar>
</Frame>`,
        expected: {
            render: "长列表、滚动条与底部用户 Footer 同时可见",
            layout: "Logo 区上下间距与渐隐带均为 4px；Footer 内容高 32px，由区域提供左右 20px、上下 8px、12px 圆角和透明 Background blur 20px",
            interaction: "向下滚动时 Logo 下方使用通用 scroll mask 渐隐；Footer 保持固定，条目从透明模糊区域下方经过",
            performance: "Footer 只定位一次，不参与列表滚动与重复渲染",
            responsive: "Sidebar 高度由 28rem 宿主约束，内容溢出仅产生纵向滚动",
        },
        logic: ["SB-Init.1", "SB-Init.2", "SB-Init.7"],
    },
] as const;
