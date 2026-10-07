/**
 * ScrollArea.test.ts
 * v1.2.0
 * 变更记录 (2026-06-21): 新增纵向、横向、双轴与组合示例。
 * 变更记录 (2026-07-22): 明确纵向 Thumb 常态 8px hover 命中宽度。
 * 变更记录 (2026-09-01): 新增横向轨道贴近视口底部的长内容场景。
 * 变更记录 (2026-09-18): 新增横向滚动条随 ScrollArea hover 显隐场景。
 */
export const examples = [
    {
        name: "SA-06: 横向滚动条仅在 Hover 时显示",
        code: `SA-06
<ScrollArea axis="horizontal" horizontalScrollbarVisibility="hover" ariaLabel="Hover 横向内容" style="width: 18rem; height: 6rem;">
    <Frame row style="width: 48rem;" class="gap-16">
        <Text>Alpha</Text><Text>Beta</Text><Text>Gamma</Text><Text>Delta</Text>
    </Frame>
</ScrollArea>`,
        expected: {
            render: "横向溢出时，轨道默认透明，鼠标移入 ScrollArea 后显示。",
            layout: "显隐不改变 viewport 或内容布局尺寸。",
            interaction: "鼠标移出后轨道渐隐；拖动 Thumb 期间保持可见。",
            performance: "复用共享 overlay scrollbar CSS，不增加监听器。",
            responsive: "容器或内容宽度变化时继续自动重算 Thumb。",
        },
        logic: ["Horizontal", "HoverVisibility", "Drag"],
    },
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
            interaction: "支持滚轮、键盘、触控和 Thumb 拖动；纵向 Thumb 常态视觉宽 4px、轨道热区宽 16px（含两侧各 4px），鼠标进入轨道任意位置后视觉展宽到 8px；点击轨道空白处按滑块中心定位并可继续拖动。",
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
            interaction: "横向 Thumb 可拖动；轨道任意位置 hover 只改变颜色；点击轨道空白处按滑块中心定位。",
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
    {
        name: "SA-05: 长内容视口横向轨道",
        code: `SA-05
<ScrollArea axis="horizontal" horizontalTrackPosition="viewport" ariaLabel="长表格横向内容" style="width: 18rem;">
    <Frame column style="width: 48rem; min-height: 48rem;" class="gap-8">
        <Text>Wide content starts here</Text>
        <Text>Horizontal track stays reachable at the viewport bottom while this area is visible.</Text>
    </Frame>
</ScrollArea>`,
        expected: {
            render: "宽且高的内容显示固定 8px 的横向自建滚动条。",
            layout: "内容区域经过当前视口时，横向轨道贴近视口底部；到达容器末端后回到容器底边。",
            interaction: "Thumb 拖动与键盘横向滚动继续作用于同一个 viewport。",
            performance: "复用横向 useOverlayScrollbar 状态，不创建第二个同步滚动容器。",
            responsive: "容器继续独立收窄，不把最小内容宽度传播为页面最小宽度。",
        },
        logic: ["Horizontal", "ViewportTrack", "LongContent"],
    },
] as const;
