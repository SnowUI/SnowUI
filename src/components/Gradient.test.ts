/**
 * Gradient.test.ts
 * v2.13.1
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
            performance: "不使用 ResizeObserver、Canvas 或运行时 blur 重算；活动图层复用模块级预栅格 SVG 图源，最上方的 Subtract 2 使用独立 800 × 800 安全区，避免旋转 / 缩放时暴露裁切边界。",
        },
        logic: ["VectorScaling", "BlurScaling"],
    },
    {
        name: "GD-03：非正方形 Fill",
        code: `GD-03
<Gradient variant="orange" width={360} height={180} />`,
        expected: {
            render: "SVG 以 preserveAspectRatio=none 填满 360 × 180 画布，图层先在 360 × 360 坐标内运动，X/Y 几何与模糊再分别跟随画布缩放；完整周期内不暴露硬裁切边界。",
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
            interaction: "每个头像 hover 时排除当前 variant，并按实例随机顺序在其余五种 Gradient 中心色之间持续交叉过渡；同时按需淡入四个预栅格 SVG 图层，四层以 6.4s / 7.2s / 8.4s / 6.8s 不同周期和七段非对称路径持续流动。每次进入随机选择且不重复上一组相位 / 方向配置；颜色 Overlay 保持双层、58% 峰值、10s 循环、1s进入和0.5s退出。",
            performance: "Avatar 常态直接复用 lazy / async / low-priority 的六份静态 SVG 图片资源，不创建 Gradient 组件；hover 时才为当前头像挂载 Gradient、四张无 filter DOM 的预栅格图层与五色 × 两层 Overlay，淡出后全部卸载；受控 effect 不追踪这些内部动效状态。",
            accessibility: "prefers-reduced-motion: reduce 下停止颜色循环，并以随机序列首色保留静态 hover 反馈。",
        },
        logic: ["SixVariants", "Avatar", "SeedPalette", "RandomColorCycle", "OverlayBlend", "ControlledEffectBoundary", "ReducedMotion"],
    },
    {
        name: "GD-05：全部动效参数控制台",
        code: `GD-05
<GradientMotionController />`,
        expected: {
            render: "底色矩形固定不动；Vector 4、Vector 3、Subtract、Subtract 2 分别执行位移 / 旋转、位移 / 缩放、位移 / 非等比形变、位移 / 旋转 / 缩放。图形位于上方，19 条控制条在下方按四列排列，并全部以各自可调范围上限作为默认值；基础时长 60s 与整体速度 4× 合成为实际 15s 循环。",
            performance: "控制状态仅存在于 Test 辅助组件；Gradient 只动画四个预栅格 SVG 图片宿主的 transform，不逐帧修改 Gaussian Blur、路径、颜色或混合模式；离开视口预热范围后暂停，IntersectionObserver 缺失时保持运行。",
            accessibility: "prefers-reduced-motion: reduce 下停止动画并恢复静态基线。",
        },
        logic: ["MotionControls", "LayerTransforms", "StaticBackground", "ReducedMotion"],
    },
] as const;
