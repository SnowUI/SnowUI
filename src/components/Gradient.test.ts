/**
 * Gradient.test.ts
 * v2.8.6
 */
export const examples = [
    {
        name: "GD-01：六种 Frame 200 配色",
        code: `GD-01
<Frame row gap={2}>
    <Gradient variant="blue" />
    <Gradient variant="cyan" />
    <Gradient variant="green" />
    <Gradient variant="red" />
    <Gradient variant="orange" />
    <Gradient variant="purple" />
</Frame>`,
        expected: {
            render: "按 Figma Frame 200 从左到右渲染 blue、cyan、green、red、orange、purple 六种 360 × 360 SVG 矢量渐变，并持续柔和漂移。",
            layout: "每个 Gradient 保持自身 360 × 360 内禀尺寸；外层 Frame 只负责排列与换行。",
        },
        logic: ["Vector", "SixVariants", "FigmaReference", "AlwaysMoving"],
    },
    {
        name: "GD-02：图形与模糊同步缩放",
        code: `GD-02
<Frame row gap={2}>
    <Gradient variant="blue" size={90} />
    <Gradient variant="blue" size={180} />
    <Gradient variant="blue" size={360} />
</Frame>`,
        expected: {
            render: "三项使用同一套 viewBox 矢量；尺寸按 0.25×、0.5×、1× 缩放时，图形边界与四层 Gaussian Blur 同比缩放。",
            performance: "不使用 ResizeObserver、Canvas 或运行时 blur 重算。",
        },
        logic: ["VectorScaling", "BlurScaling"],
    },
    {
        name: "GD-03：非正方形 Fill",
        code: `GD-03
<Gradient variant="orange" width={360} height={180} />`,
        expected: {
            render: "SVG 以 preserveAspectRatio=none 填满 360 × 180 画布，X/Y 几何与模糊分别跟随画布缩放。",
            layout: "外部宽高决定内禀画布，不产生留白。",
        },
        logic: ["NonSquare", "FigmaFill", "BlurScaling"],
    },
    {
        name: "GD-04：六种 Avatar Hover",
        code: `GD-04
<Frame style="display: grid; grid-template-columns: repeat(3, 5rem); gap: var(--gap-2);">
    <Avatar fallback={Gradient} data-name="blue" size={80} />
    <Avatar fallback={Gradient} data-name="cyan" size={80} />
    <Avatar fallback={Gradient} data-name="green" size={80} />
    <Avatar fallback={Gradient} data-name="red" size={80} />
    <Avatar fallback={Gradient} data-name="orange" size={80} />
    <Avatar fallback={Gradient} data-name="purple" size={80} />
</Frame>`,
        expected: {
            render: "以三列两行依次渲染 blue、cyan、green、red、orange、purple 六个 80 × 80 Gradient Avatar；圆形外壳裁切无有色毛边，内部矢量不溢出。",
            interaction: "每个头像 hover 时排除当前 variant，并按实例随机顺序在其余五种 Gradient 中心色之间持续交叉过渡；每种颜色使用两个位于完整 SVG 上方的独立 HTML overlay pass，单层峰值固定为 58%，10s 完成一轮并以 0.5s 缓冲进入；每层 0% / 100% opacity 完全一致，循环边界不闪烁。",
            performance: "Avatar Gradient 基础矢量形变默认关闭；未 hover 时不创建颜色层，hover 时按需挂载认可版本的五色 × 四层 Overlay 并在淡出后卸载；视口外 SVG 由 content-visibility 跳过绘制。",
            accessibility: "prefers-reduced-motion: reduce 下停止颜色循环，并以随机序列首色保留静态 hover 反馈。",
        },
        logic: ["SixVariants", "Avatar", "SeedPalette", "RandomColorCycle", "OverlayBlend", "ReducedMotion"],
    },
    {
        name: "GD-05：全部动效参数控制台",
        code: `GD-05
<GradientMotionController />`,
        expected: {
            render: "底色矩形固定不动；Vector 4、Vector 3、Subtract、Subtract 2 分别执行位移 / 旋转、位移 / 缩放、位移 / 非等比形变、位移 / 旋转 / 缩放。图形位于上方，19 条控制条在下方按四列排列，并全部以各自可调范围上限作为默认值；基础时长 60s 与整体速度 4× 合成为实际 15s 循环。",
            performance: "控制状态仅存在于 Test 辅助组件；Gradient 只动画四个有色 SVG 图层的 transform，不逐帧修改 Gaussian Blur、路径、颜色或混合模式。",
            accessibility: "prefers-reduced-motion: reduce 下停止动画并恢复静态基线。",
        },
        logic: ["MotionControls", "LayerTransforms", "StaticBackground", "ReducedMotion"],
    },
] as const;
