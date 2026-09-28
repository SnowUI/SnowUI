/** Indicator.test.ts - 通用尺寸指示手柄示例。 */
export const examples = [
    {
        name: "IN-Insets: 默认边缘间距",
        code: `IN-Insets
<Frame style="position: relative; width: 280px; height: 160px; background: var(--background-1);">
    <Text>悬停或聚焦：可见短条距边缘 4px，加粗时向内生长。</Text>
    <Indicator axis="width" edge="end" minSize={200} maxSize={480} />
    <Indicator axis="height" edge="bottom" minSize={100} maxSize={280} />
</Frame>`,
    },
    {
        name: "IN-01: 宽度与高度拖动",
        code: `IN-01
<Frame row class="gap-16">
    <Frame style="position: relative; width: 10rem; height: 6rem;">
        <Text>拖动右侧</Text>
        <Indicator axis="width" minSize={80} maxSize={320} />
    </Frame>
    <Frame style="position: relative; width: 10rem; height: 6rem;">
        <Text>拖动底部</Text>
        <Indicator axis="height" minSize={60} maxSize={240} />
    </Frame>
</Frame>`,
        expected: {
            render: "宿主未 hover 时隐藏，进入任意宿主子内容后显示 line 手柄。",
            layout: "Indicator 绝对定位在宿主右侧或底部，不占内容布局空间。",
            interaction: "自身 hover 时由 Black/10 变为 Black/20 并沿粗细轴放大 2 倍，支持 Pointer 与方向键调整；颜色不受 Frame 样式加载顺序影响。",
            performance: "pointermove 通过共享 resizable 在 rAF 中合并。",
            responsive: "尺寸被限制在声明的 minSize 与 maxSize 范围内。",
        },
        logic: ["Width", "Height", "HostHover", "Pointer", "Keyboard"],
    },
    {
        name: "IN-02: Corner 手柄",
        code: `IN-02
<Frame style="position: relative; width: 14rem; height: 8rem;">
    <Text>CodeBlock 风格 Corner</Text>
    <Indicator appearance="corner" minSize={60} maxSize={320} />
</Frame>`,
        expected: {
            render: "宿主 hover 时显示 16px corner，常规笔画为 2px、Black/10。",
            layout: "图标固定在宿主右下角，命中区扩展不改变布局。",
            interaction: "自身 hover、focus 或 dragging 时笔画变为 4px、Black/20，图标尺寸不缩放。",
            performance: "复用 line 相同的显隐与 resizable 协议。",
            responsive: "默认拖动同时改变宿主宽度和高度。",
        },
        logic: ["Corner", "HostHover", "Dragging", "Accessibility"],
    },
    {
        name: "IN-03: Corner 双轴调整",
        code: `IN-03
<Frame style="position: relative; width: 14rem; height: 8rem;">
    <Text>拖动右下角同时改变宽高</Text>
    <Indicator axis="both" appearance="corner" minSize={60} maxSize={320} />
</Frame>`,
        expected: {
            render: "显示与默认 corner 一致的 2px / 4px 状态视觉。",
            layout: "固定在宿主右下角。",
            interaction: "使用 nwse-resize 对角双箭头，同时改变宿主宽度和高度。",
            performance: "横纵更新分别通过共享 resizable rAF 合并。",
            responsive: "宽高分别限制在 60px 到 320px。",
        },
        logic: ["Corner", "BothAxes", "Pointer", "Keyboard"],
    },
    {
        name: "IN-04: 整边命中与 Resize 优先",
        code: `IN-04
<Frame style="position: relative; width: 10rem; height: 6rem;">
    <ScrollArea style="height: 100%;">
        <Frame column class="gap-8" style="height: 12rem;">
            <Text>滚动内容</Text>
            <Text>重叠区域优先调整尺寸</Text>
        </Frame>
    </ScrollArea>
    <Indicator
        axis="width"
        pinOffset="var(--padding-1)"
        hitAreaPadding="var(--padding-1)"
    />
</Frame>`,
        expected: {
            render: "鼠标进入宿主任意区域后显示 Indicator；与实际 Thumb 重叠时仍显示 Indicator。",
            layout: "短条视觉长度不变，整条右边缘均可激活并拖动。",
            interaction: "重叠区域可拖动 Indicator 并使用键盘调整尺寸，Thumb 其余区域可滚动。",
            performance: "无需观察滚动条几何；拖动复用共享 resizable 的 rAF 合并。",
            responsive: "有无滚动溢出均遵守相同显隐和尺寸边界。",
        },
        logic: ["LocalHitArea", "ScrollbarOverlap", "PointerPriority"],
    },
] as const;
