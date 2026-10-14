export const examples = [
    {
        name: "SS-01：内置标题折叠与多操作",
        code: `SS-01
<Frame style="width: 220px;">
    <Sidebar>
        <SidebarSection id="page" title="Page" actions={[
            { id: "more", icon: "dots-three", label: "More" },
            { id: "add", icon: "plus", label: "Add" },
        ]}>
            <SidebarItem id="dashboard" label="Dashboard" icon="gauge" />
        </SidebarSection>
    </Sidebar>
</Frame>`,
        expected: {
            render: "Page 标题、内置下箭头、两个 bare action 与分类末尾内置 Separator 正确渲染",
            layout: "标题与 action 位于同一行，内容在下方；横向 Separator 位于分类内容末尾且无需调用方手动添加，与 Sidebar 外置 Separator 相同，上下与左右 padding 均为 8px、line-height 为 0",
            interaction: "hover/focus 显示按钮，鼠标与键盘均可反复展开、折叠；未传 collapsed 时不锁住 Sidebar 持久化状态",
            performance: "折叠时不渲染分类内容子树；Sidebar 通过独立状态记忆 active item 的 Section 归属",
            responsive: "随 Sidebar 折叠隐藏标题行，分类末尾 Separator 保持可见",
        },
        logic: ["SS-Init.1"],
    },
] as const;
