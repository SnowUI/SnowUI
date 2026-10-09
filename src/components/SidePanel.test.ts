export const examples = [
    {
        name: "SP-00：LocaleProvider 内置文案",
        code: `SP-00
<LocaleProvider locale="en-US">
    <SidePanel open editable />
</LocaleProvider>`,
        expected: {
            render: "上工具栏与可编辑下工具栏显示英文内置文案和英文 Tooltip",
            layout: "面板与工具栏布局保持不变",
            interaction: "placement、关闭、复制和删除仍保持原有内置行为",
            performance: "只更新文案，不新增面板层或动画",
            responsive: "英文文案在下工具栏保持单行排列",
        },
        logic: ["SP-Init.24"],
    },
    {
        name: "SP-01：默认浮层与显式内容",
        code: `SP-01
<SidePanel open title="Subscription">
    <Frame column gap={3}>
        <Text class="text-18 text-black-100">SnowUI Pro</Text>
        <Text class="text-black-40">内容由调用方显式写入，组件只提供右侧面板、滚动区域和上下工具栏。</Text>
        <Input value="Monthly $19.9" />
        <Input value="Natali Craig" />
        <Textarea value="A long subscription note keeps the body scrollable when content exceeds the panel height." />
        <Frame column gap={2}>
            <Text>Activity</Text>
            <Text class="text-black-40">Created at 2026-06-19 04:00</Text>
            <Text class="text-black-40">Affiliate renewal is enabled for this customer.</Text>
        </Frame>
    </Frame>
</SidePanel>`,
        expected: {
            render: "右侧 460px 浮层面板出现，上工具栏含预览切换/上一项/下一项；默认只读无下工具栏，底滚动遮罩仍在",
            layout: "面板与页面上右下保持 16px 间距，内容区独立滚动",
            interaction: "Escape 或点击面板外关闭；左侧边框全高均可拖拽调整宽度，边缘不显示宽度调整指示器",
            performance: "滚动条仅在内容溢出时显示",
            responsive: "窄屏时宽度不超过视口减 32px",
        },
        logic: ["SP-Init.13"],
    },
    {
        name: "SP-01b：可编辑显示下工具栏",
        code: `SP-01b
<SidePanel open editable title="Edit">
    <Frame column gap={3}>
        <Input value="可编辑内容" />
    </Frame>
</SidePanel>`,
        expected: {
            render: "editable 时下工具栏出现：左 copy/delete，右 borderless 取消 + gray 保存",
            layout: "下栏占位与底遮罩对齐工具栏高度",
            interaction: "取消关闭面板；复制/删除走 onCopy/onDelete",
            performance: "只读切换为可编辑时才挂载下栏 DOM",
            responsive: "下栏按钮一行排列",
        },
        logic: ["SP-Init.13"],
    },
    {
        name: "SP-02：内嵌预览模式",
        code: `SP-02
<Frame row gap={3} style="height: 36rem;">
    <Frame class="bg-background-2 rounded-16 p-16" contentFill>
        表格或页面主体区域
    </Frame>
    <SidePanel open placement="inline" title="Inline">
        <Frame column gap={3}>
            <Text class="text-18 text-black-100">Inline details</Text>
            <Input value="Embedded on the right side" />
            <Textarea value="The panel participates in the page layout instead of opening as a floating layer." />
        </Frame>
    </SidePanel>
</Frame>`,
        expected: {
            render: "SidePanel 作为页面右侧内嵌栏渲染",
            layout: "页面主内容 padding 与常驻 rail transform 同步变化并保留 16px 间距；SidePanel 不修改兄弟 DOM",
            interaction: "inlineMotionOwner=layout 时页面用同一 spring 驱动面板和 Table；上工具栏第一个按钮可在浮层 / 内嵌之间稳定往返",
            performance: "切换 placement 时迁移同一个渲染宿主，不销毁内容子树；关闭后等待退场完成再卸载",
            responsive: "面板宽度仍遵循最大视口约束",
        },
        logic: ["SP-Init.26"],
    },
    {
        name: "SP-03：下工具栏整组替换",
        code: `SP-03
<SidePanel open title="Actions">
    {#snippet bottomLeading()}
        <Frame row gap={2}>
            <Button bare iconOnly emphasis="muted" size="sm" aria-label="下载">
                <ResourceIcon name="arrow-line-down" size={16} />
            </Button>
        </Frame>
    {/snippet}
    {#snippet bottomTrailing()}
        <Frame row gap={2}>
            <Button size="sm" variant="borderless">关闭</Button>
            <Button size="sm" variant="gray">应用</Button>
        </Frame>
    {/snippet}
    <Frame column gap={3}>
        <Text class="text-18 text-black-100">Custom toolbar</Text>
        <Text class="text-black-40">bottomLeading / bottomTrailing Snippet 用 Frame 包多个 Button 整组替换该侧默认按钮。</Text>
    </Frame>
</SidePanel>`,
        expected: {
            render: "下工具栏左侧为下载 icon，右侧为 borderless 关闭 + gray 应用；上工具栏仍为默认三枚 icon",
            layout: "显式 Frame 组沿用工具栏 gap 8px 排列",
            interaction: "显式按钮事件由调用方接管；上栏 placement/prev/next 仍内置",
            performance: "有 Snippet 时不渲染该侧默认 actions",
            responsive: "按钮组不溢出工具栏",
        },
        logic: ["SP-Init.12"],
    },
    {
        name: "SP-04：parts 批量配置内置 Button",
        code: `SP-04
<SidePanel
    open
    title="Parts"
    parts={{
        Button: { variant: "outline" },
    }}
>
    <Frame column gap={3}>
        <Text class="text-18 text-black-100">Parts</Text>
        <Text class="text-black-40">内置工具栏按钮通过 parts.Button 批量配置。</Text>
    </Frame>
</SidePanel>`,
        expected: {
            render: "内置工具栏按钮消费 parts.Button 的 outline 配置",
            layout: "工具栏结构不变",
            interaction: "预览切换、关闭等内置行为仍归 SidePanel 管理",
            performance: "parts 不递归注入显式内容",
            responsive: "工具栏在 460px 宽度下保持一行",
        },
        logic: ["SP-Init.1"],
    },
] as const;
