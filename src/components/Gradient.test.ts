/**
 * Gradient.test.ts
 * v2.5.0
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
        name: "GD-04：裁切与 Avatar 组合",
        code: `GD-04
<Frame row gap={2}>
    <Gradient variant="purple" size={160} radius={32} />
    <Avatar fallback={Gradient} data-name="Gradient avatar" size={80} />
</Frame>`,
        expected: {
            render: "Gradient 可由 radius 裁切为无有色毛边的圆角矩形，并可作为 Avatar fallback 被圆形外壳裁切；内部矢量不溢出。",
            interaction: "Gradient 只播放内部低频漂移动效，不叠加 Frame 默认动效。",
        },
        logic: ["Radius", "Avatar", "Composition", "AlwaysMoving"],
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
