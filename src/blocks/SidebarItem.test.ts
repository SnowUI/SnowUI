export const examples = [
    {
        name: "SI-01：Link、命令项与状态 Badge",
        code: `SI-01
<Frame style="width: 220px;">
    <Sidebar activeItemId="saved">
        <SidebarItem id="saved" label="Saved" icon="bookmark" href="#saved" updated>
            {#snippet tags()}
                <Badge variant="border" count="New" />
            {/snippet}
        </SidebarItem>
        <SidebarItem id="hot" label="Hot" icon="fire" actions={[
            { id: "more", icon: "dots-three", label: "More" },
        ]} />
    </Sidebar>
</Frame>`,
        expected: {
            render: "Link 主项与 Button 主项并存，Saved 依次显示外部 New 标签、updated 圆点和 active 背景；未激活 Hot 保持完整不透明度",
            layout: "SidebarItem 固定 label → tags → updated 顺序，New 位于文字右边，updated 圆点始终位于标签组最右；折叠态 updated 跟随 leading icon；Link 与 Button 两种主操作的 leading/content gap 均首选 var(--gap-2)，缩放后的有效间距至少为 4 CSS px；长文字缩略而 tags／updated／末尾操作完整可见，且无交互元素嵌套",
            interaction: "item hover/focus 显示 More；主项与 active Link 的 hover 只改变背景，Icon 与文字颜色不变；独立 action 不触发主项选择",
            performance: "未更新项目不生成 Badge",
            responsive: "折叠后只保留 leading 与 Tooltip",
        },
        logic: ["SI-Init.1"],
    },
    {
        name: "SI-02：二级 Item 层级连接线",
        code: `SI-02
<Frame style="width: 220px;">
    <Sidebar persistence={false}>
        <SidebarItem id="form" label="Form" icon="table" />
        <SidebarItem id="input" label="Input" depth={1} />
        <SidebarItem id="listbox" label="Listbox" depth={1} />
    </Sidebar>
</Frame>`,
        expected: {
            render: "Input 与 Listbox 的 leading 槽显示 L 形层级连接线，不显示普通 Icon",
            layout: "连接线双臂等长；竖线中心与 Form Icon 中心同列，横线中心与二级文字中心同轴；弯曲圆角 4px",
            style: "连接线为密集的 1px Black/40% 点线",
            accessibility: "连接线为伪元素装饰，不进入无障碍树",
        },
        logic: ["SI-Init.2"],
    },
    {
        name: "导航多语言：默认简中与英文",
        code: `<Frame row gap={16} style="height: 320px;">
<Sidebar persistence={false} resizable={false}><SidebarItem id="default" label="业务名称" icon="gauge" updated /></Sidebar>
<LocaleProvider locale="en-US"><Sidebar persistence={false} resizable={false}><SidebarItem id="english" label="Business label" icon="gauge" updated /></Sidebar></LocaleProvider>
</Frame>`,
        expected: {
            accessibility: "默认主导航／收起侧边栏／已更新，英文Primary navigation／Collapse sidebar／Updated；业务label不翻译，折叠状态与名称同步",
            interaction: "键盘可反复折叠展开，text变体浮层展开按钮使用当前locale",
        },
        logic: ["Sidebar.Locale"],
    },
] as const;
