/**
 * SnowUILogo.test.ts
 * v1.12.0
 */
export const examples = [
    {
        name: "1: 四种组合形式",
        code: `1
<div style="display:flex;align-items:center;gap:32px;flex-wrap:wrap">
    <SnowUILogo variant="icon" />
    <SnowUILogo variant="text" />
    <SnowUILogo variant="horizontal" />
    <SnowUILogo variant="vertical" />
</div>`,
        expected: {
            render: "依次显示 28×28 图标、71×12 字标、105×28 横向组合与 71×84 纵向组合；横向间距 6，纵向间距 8。",
        },
        logic: ["BrandGeometry", "IntrinsicPrimitive"],
    },
    {
        name: "2: 等比缩放",
        code: `2
<div style="display:flex;align-items:center;gap:32px">
    <SnowUILogo variant="horizontal" />
    <SnowUILogo variant="horizontal" scale={2} />
    <SnowUILogo variant="vertical" scale={1.5} />
</div>`,
        expected: {
            render: "scale 同时等比缩放图标、字标与组合间距，不改变设计稿比例。",
        },
        logic: ["ProportionalScale", "BrandGeometry"],
    },
    {
        name: "3: Hover 分层旋转",
        code: `3
<SnowUILogo variant="horizontal" scale={2} />`,
        expected: {
            render: "hover 后白色米字以恒定的 0.20x 速度顺时针旋转；蓝条 1/2 与蓝条 3/4 分别作为同步整体，均以 0.10x 顺时针旋转。持续 hover 时五层按各自速度连续循环，不会在单圈结束后停顿。移出 hover 后米字就近停在 45° 对齐位，两组蓝条就近停在 90° 对齐位；蓝条 1/2 中始终有一条保持 45° 斜角，蓝条 3/4 中始终有一条指向 12 点。下一次 hover 从停止角度连续开始；字标保持静态。",
        },
        logic: ["HoverMotion", "ClockwiseRotation", "GroupedStripSpeeds", "ContinuousHover", "NinetyDegreeStripSettlement", "ContinuousRestart", "ReducedMotion"],
    },
    {
        name: "4: Hover 动效调节器",
        code: `4
<SnowUILogoHoverController />`,
        expected: {
            render: "显示可悬停的大号横向 SnowUI Logo；调试器默认显示米字 0.20x 顺时针、蓝条 1/2 与蓝条 3/4 均为 0.10x 顺时针；三个整体可在 Test 内调整速度和方向，但这些设置不属于 SnowUILogo Props，字标保持静态。",
        },
        logic: ["HoverMotionController", "GroupedLayerSpeed", "GroupedLayerDirection"],
    },
    {
        name: "5: 返回主页链接",
        code: `5
<a href="/" aria-label="返回 SnowUI 首页">
    <SnowUILogo variant="horizontal" />
</a>`,
        expected: {
            render: "显示横向 SnowUI Logo，并由使用方通过原生链接包裹；点击后返回站点主页。SnowUILogo 本身不提供 href 或路由行为。",
        },
        logic: ["ExternalLinkComposition", "SemanticAnchor", "SingleResponsibility"],
    },
] as const;
