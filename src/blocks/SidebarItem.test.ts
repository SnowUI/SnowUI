export const examples = [
    {
        name: "SI-01：Link、命令项与状态 Badge",
        code: `SI-01
<Frame style="width: 220px;">
    <Sidebar activeItemId="saved">
        <SidebarItem id="saved" label="Saved" icon="bookmark" href="#saved" updated>
            {#snippet tags()}
                <Badge variant="border" count="PRO" />
            {/snippet}
        </SidebarItem>
        <SidebarItem id="hot" label="Hot" icon="fire" actions={[
            { id: "more", icon: "dots-three", label: "More" },
        ]} />
    </Sidebar>
</Frame>`,
        expected: {
            render: "Link 主项与 Button 主项并存，Saved 依次显示外部 PRO 标签、updated 圆点和 active 背景；未激活 Hot 保持完整不透明度",
            layout: "SidebarItem 固定 label → tags → updated 顺序，PRO 位于文字右边，updated 圆点始终位于标签组最右；折叠态 updated 跟随 leading icon；Link 与 Button 两种主操作的 leading/content gap 均固定为 var(--gap-2)，且无交互元素嵌套",
            interaction: "item hover/focus 显示 More；主项与 active Link 的 hover 只改变背景，Icon 与文字颜色不变；独立 action 不触发主项选择",
            performance: "未更新项目不生成 Badge",
            responsive: "折叠后只保留 leading 与 Tooltip",
        },
        logic: ["SI-Init.1"],
    },
] as const;
