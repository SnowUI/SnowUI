/**
 * ScrollArea.test.ts
 * v1.0.0
 * 变更记录 (2026-06-21): 新增纵向、横向、双轴与组合示例。
 */
export const examples = [
    {
        name: "SA-01: 默认纵向滚动",
        code: `SA-01
<ScrollArea ariaLabel="纵向内容" style="width: 16rem; height: 10rem;">
    <Frame column class="gap-8">
        <Text>Line 1</Text><Text>Line 2</Text><Text>Line 3</Text>
        <Text>Line 4</Text><Text>Line 5</Text><Text>Line 6</Text>
        <Text>Line 7</Text><Text>Line 8</Text><Text>Line 9</Text>
    </Frame>
</ScrollArea>`,
        expected: {
            render: "高度受限时显示 SnowUI 纵向自建滚动条。",
            layout: "viewport 填满 ScrollArea，内容自然纵向溢出。",
            interaction: "支持滚轮、键盘、触控和 Thumb 拖动；hover 时纵向 Thumb 从 4px 展宽到 8px。",
            performance: "复用 useOverlayScrollbar 与共享 resizeManager。",
            responsive: "容器尺寸改变后自动重算 Thumb。",
        },
        logic: ["Vertical", "Default", "Accessibility"],
    },
    {
        name: "SA-02: 横向滚动",
        code: `SA-02
<ScrollArea axis="horizontal" ariaLabel="横向内容" style="width: 18rem; height: 6rem;">
    <Frame row style="width: 48rem;" class="gap-16">
        <Text>Alpha</Text><Text>Beta</Text><Text>Gamma</Text>
        <Text>Delta</Text><Text>Epsilon</Text><Text>Zeta</Text>
    </Frame>
</ScrollArea>`,
        expected: {
            render: "宽内容显示固定 8px 的横向自建滚动条。",
            layout: "纵向溢出关闭，横向 viewport 保持原生滚动语义。",
            interaction: "横向 Thumb 可拖动，hover 只改变颜色。",
            performance: "只实例化横向轨道状态。",
            responsive: "容器或内容宽度变化时自动重算。",
        },
        logic: ["Horizontal", "Drag"],
    },
    {
        name: "SA-03: 双轴滚动",
        code: `SA-03
<ScrollArea axis="both" ariaLabel="双轴内容" style="width: 18rem; height: 10rem;">
    <Frame column style="width: 48rem; min-height: 24rem;" class="gap-8">
        <Text>Wide content line 1</Text>
        <Text>Wide content line 2</Text>
        <Text>Wide content line 3</Text>
    </Frame>
</ScrollArea>`,
        expected: {
            render: "内容同时溢出时显示横纵两条自建滚动条。",
            layout: "两个轨道在右下角自动避让，距容器边缘 4px。",
            interaction: "两条 Thumb 均可独立拖动。",
            performance: "两个轴共享同一 viewport，不创建嵌套滚动容器。",
            responsive: "任一轴不再溢出时，对应轨道自动隐藏。",
        },
        logic: ["Both", "EdgeGap"],
    },
    {
        name: "SA-04: Frame 角色组合",
        code: `SA-04
<Frame row class="gap-8" style="width: 24rem; height: 8rem;">
    <Text>Summary</Text>
    <ScrollArea as="trailing" ariaLabel="详情" style="width: 12rem; height: 8rem;">
        <Frame column class="gap-8">
            <Text>Detail 1</Text><Text>Detail 2</Text><Text>Detail 3</Text>
            <Text>Detail 4</Text><Text>Detail 5</Text><Text>Detail 6</Text>
        </Frame>
    </ScrollArea>
</Frame>`,
        expected: {
            render: "ScrollArea 可作为 Frame 的 trailing 角色组合使用。",
            layout: "根 FrameProps 与 as 角色正常透传，内部滚动结构不受影响。",
            interaction: "滚动交互仅发生在 ScrollArea viewport。",
            performance: "角色组合不增加另一套滚动算法。",
            responsive: "外层 Frame 可继续接管 ScrollArea 的布局位置。",
        },
        logic: ["FrameProps", "As", "Composition"],
    },
] as const;
