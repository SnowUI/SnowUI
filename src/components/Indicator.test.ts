/** Indicator.test.ts - 通用尺寸指示手柄示例。 */
export const examples = [
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
            interaction: "自身 hover 时变为 Black/40% 并沿粗细轴放大 2 倍，支持 Pointer 与方向键调整。",
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
    <Indicator axis="height" appearance="corner" minSize={60} maxSize={320} />
</Frame>`,
        expected: {
            render: "宿主 hover 时显示 16px RoundedCorner，常规描边为 1px、Black/20%。",
            layout: "图标固定在宿主右下角，命中区扩展不改变布局。",
            interaction: "自身 hover、focus 或 dragging 时描边变为 2px、Black/40%，图标尺寸不缩放。",
            performance: "复用 line 相同的显隐与 resizable 协议。",
            responsive: "拖动只改变宿主高度。",
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
            render: "显示与默认 corner 一致的 1px / 2px 状态视觉。",
            layout: "固定在宿主右下角。",
            interaction: "使用 nwse-resize 对角双箭头，同时改变宿主宽度和高度。",
            performance: "横纵更新分别通过共享 resizable rAF 合并。",
            responsive: "宽高分别限制在 60px 到 320px。",
        },
        logic: ["Corner", "BothAxes", "Pointer", "Keyboard"],
    },
] as const;
