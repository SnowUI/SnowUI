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
            render: "Page 标题、内置下箭头与两个 bare action 正确渲染",
            layout: "标题与 action 位于同一行，内容在下方",
            interaction: "hover/focus 显示按钮，下箭头切换内容",
            performance: "折叠时不渲染分类内容子树；Sidebar 通过独立状态记忆 active item 的 Section 归属",
            responsive: "随 Sidebar 折叠隐藏标题行",
        },
        logic: ["SS-Init.1"],
    },
] as const;
