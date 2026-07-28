export const examples = [
    {
        name: "SI-01：Link、命令项与更新 Badge",
        code: `SI-01
<Frame style="width: 220px;">
    <Sidebar activeItemId="saved">
        <SidebarItem id="saved" label="Saved" icon="bookmark" href="#saved" updated />
        <SidebarItem id="hot" label="Hot" icon="fire" actions={[
            { id: "more", icon: "dots-three", label: "More" },
        ]} />
    </Sidebar>
</Frame>`,
        expected: {
            render: "Link 主项与 Button 主项并存，Saved 显示 6px 更新圆点和 active 背景；未激活 Hot 保持完整不透明度",
            layout: "Link 与 Button 主项的 updated 均为 6px；leading/content/trailing 对齐且无交互元素嵌套",
            interaction: "item hover/focus 显示 More；主项与 active Link 的 hover 只改变背景，Icon 与文字颜色不变；独立 action 不触发主项选择",
            performance: "未更新项目不生成 Badge",
            responsive: "折叠后只保留 leading 与 Tooltip",
        },
        logic: ["SI-Init.1"],
    },
] as const;
