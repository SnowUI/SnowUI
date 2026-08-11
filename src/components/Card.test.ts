/**
 * Card.test.ts
 * v1.0.0
 * 变更记录 (2026-05-26): 新增 Card 容器示例。
 */
export const examples = [
    {
        name: "A1: 默认 column 容器",
        code: `A1
<Card>
    <Text>Revenue</Text>
    <Text>Monthly recurring revenue</Text>
    <Text>$24,800</Text>
</Card>`,
        expected: {
            render: "渲染默认 column Card，背景为 surface/1，默认无内边框。",
            layout: "普通内容纵向排列，gap 为 4px；无显式宽度时普通内容宽度按 Hug 自动收缩。",
            interaction: "interactive 默认为 false，不显示 hover cursor。",
            performance: "只使用 Frame 根层和内容 viewport。",
            responsive: "宽度由外部容器或内容决定。",
        },
        logic: ["A1", "Column", "Default"],
    },
    {
        name: "A2: row 横向容器",
        code: `A2
<Card row>
    <Text>Text</Text>
    <Text>Text</Text>
    <Text>Text</Text>
    <Text>Text</Text>
</Card>`,
        expected: {
            render: "横向排列四个文本项。",
            layout: "row gap 为 8px；无显式宽度时普通内容按 Hug 自动收缩。",
            interaction: "无交互态。",
            performance: "row 映射到 Card 内容 viewport，而非新增子组件。",
            responsive: "默认不换行，需要时显式开启 wrap。",
        },
        logic: ["Row", "Layout"],
    },
    {
        name: "A3: 激活态",
        code: `A3
<Frame row class="gap-8">
    <Card active>
        <Text>Active</Text>
        <Text>Primary border</Text>
    </Card>
    <Card selected>
        <Text>Selected</Text>
        <Text>Same visual</Text>
    </Card>
</Frame>`,
        expected: {
            render: "active 与 selected 都显示激活态。",
            layout: "两个 Card 并排展示。",
            interaction: "激活态边框为 Primary，优先级高于 hover。",
            performance: "selected 不创建额外状态机，只映射激活外观。",
            responsive: "外层 Frame 负责横向排列。",
        },
        logic: ["Active", "Selected"],
    },
    {
        name: "A4: interactive hover",
        code: `A4
<Card interactive onclick={() => console.log("card")}>
    <Text>Interactive card</Text>
    <Text>Hover changes the container border only.</Text>
</Card>`,
        expected: {
            render: "渲染可交互 Card。",
            layout: "内容仍为普通 column 布局。",
            interaction: "hover 时只显示 0.5px black/40% 内置边框。",
            performance: "hover 使用 CSS 和 Frame bridge 变量过渡。",
            responsive: "hover 不改变布局尺寸。",
        },
        logic: ["Interactive", "Hover"],
    },
    {
        name: "A5: Pin 九方位",
        code: `A5
<Card style="width: 12rem; height: 8rem;">
    <Icon as="pin-top-left" size={16}><Star /></Icon>
    <Icon as="pin-top" size={16}><Star /></Icon>
    <Icon as="pin-top-right" size={16}><Star /></Icon>
    <Icon as="pin-left" size={16}><Star /></Icon>
    <Icon as="pin-center" size={16}><Star /></Icon>
    <Icon as="pin-right" size={16}><Star /></Icon>
    <Icon as="pin-bottom-left" size={16}><Star /></Icon>
    <Icon as="pin-bottom" size={16}><Star /></Icon>
    <Icon as="pin-bottom-right" size={16}><Star /></Icon>
    <Text>Pin</Text>
</Card>`,
        expected: {
            render: "九个 Icon 分别固定在 Card 九个方位。",
            layout: "Pin 默认距离边缘 12px，普通 Text 仍在内容流中。",
            interaction: "Pin 内容不由 Card 管理交互。",
            performance: "复用 auto-layout.css 的 pin-* 规则。",
            responsive: "Card 尺寸变化时 Pin 仍贴对应方位。",
        },
        logic: ["Pin", "Layout"],
    },
    {
        name: "A6: Frame 三槽内容",
        code: `A6
<Card>
    <Frame row>
        <Icon as="leading" size={16}><Paperclip /></Icon>
        <Text>Attachment.pdf</Text>
        <Button as="trailing" bare iconOnly emphasis="muted" variant="borderless" aria-label="下载">
            <Icon size={16}><ArrowLineDown /></Icon>
        </Button>
    </Frame>
</Card>`,
        expected: {
            render: "Card 内使用 Frame 实现 leading / content / trailing 三槽。",
            layout: "Card 不创建 CardItem，三槽由 Frame 承接。",
            interaction: "trailing Button 保留自身交互。",
            performance: "复用既有 Frame 三槽协议。",
            responsive: "三槽内容可按 Frame 规则响应。",
        },
        logic: ["Frame", "Slots"],
    },
    {
        name: "A7: 内容溢出滚动",
        code: `A7
<Card style="width: 14rem; max-height: 7rem;" class="border-red">
    <Icon as="pin-top-right" size={16}><Star /></Icon>
    <Text>Line 1</Text>
    <Text>Line 2</Text>
    <Text>Line 3</Text>
    <Text>Line 4</Text>
    <Text>Line 5</Text>
    <Text>Line 6</Text>
    <Text>Line 7</Text>
    <Text>Line 1</Text>
    <Text>Line 2</Text>
    <Text>Line 3</Text>
    <Text>Line 4</Text>
    <Text>Line 5</Text>
    <Text>Line 6</Text>
    <Text>Line 7</Text>
</Card>`,
        expected: {
            render: "高度受限时内容区可滚动。",
            layout: "滚动条按溢出自动显示，pin-top-right 不参与滚动流。",
            interaction: "未溢出时滚动条隐藏；溢出时 thumb 可拖动。",
            performance: "使用 useOverlayScrollbar 与共享滚动条样式。",
            responsive: "内容高度变化时自动刷新滚动条。",
        },
        logic: ["Scroll", "Pin"],
    },
    {
        name: "A8: 开启换行",
        code: `A8
<Card row wrap style="width: 11rem;">
    <Text>Alpha</Text>
    <Text>Beta</Text>
    <Text>Gamma</Text>
</Card>`,
        expected: {
            render: "横向 Card 显式开启换行。",
            layout: "wrap=true 输出 wrap 规则。",
            interaction: "无交互态。",
            performance: "布局只由 CSS 控制。",
            responsive: "窄宽度下内容可换到下一行。",
        },
        logic: ["Wrap", "Row"],
    },
    {
        name: "A9: 内容宽度策略",
        code: `A9
<Frame column class="gap-8">
    <Card contentHug>
        <Text>Hug</Text>
        <Text>Content</Text>
    </Card>
    <Card contentFill style="width: 16rem;">
        <Text>Fill</Text>
        <Text>Content</Text>
    </Card>
</Frame>`,
        expected: {
            render: "Card 支持 contentHug 与 contentFill。",
            layout: "contentHug 普通内容按内容宽度收缩；contentFill 普通内容填满 Card 内容区。",
            interaction: "无交互态。",
            performance: "内容宽度策略只作用在普通内容 viewport，不影响 pin-*。",
            responsive: "固定宽度 Card 内 contentFill 子项随容器宽度适配。",
        },
        logic: ["ContentWidth", "Fill", "Hug"],
    },
] as const;
