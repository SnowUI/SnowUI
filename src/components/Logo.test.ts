/**
 * Logo.test.ts
 * v1.10.0
 */
export const examples = [
    {
        name: "1: 四种组合形式",
        code: `1
<div style="display:flex;align-items:center;gap:32px;flex-wrap:wrap">
    <Logo variant="icon" />
    <Logo variant="text" />
    <Logo variant="horizontal" />
    <Logo variant="vertical" />
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
    <Logo variant="horizontal" />
    <Logo variant="horizontal" scale={2} />
    <Logo variant="vertical" scale={1.5} />
</div>`,
        expected: {
            render: "scale 同时等比缩放图标、字标与组合间距，不改变设计稿比例。",
        },
        logic: ["ProportionalScale", "BrandGeometry"],
    },
    {
        name: "3: Hover 分层旋转",
        code: `3
<Logo variant="horizontal" scale={2} />`,
        expected: {
            render: "hover 后白色米字以恒定的 0.30x 速度逆时针旋转；蓝条 1/2 与蓝条 3/4 分别作为同步整体，均以 0.10x 顺时针旋转。持续 hover 时五层按各自速度连续循环，不会在单圈结束后停顿。移出 hover 后米字就近停在 45° 对齐位，两组蓝条就近停在 90° 对齐位；蓝条 1/2 中始终有一条保持 45° 斜角，蓝条 3/4 中始终有一条指向 12 点。下一次 hover 从停止角度连续开始；字标保持静态。",
        },
        logic: ["HoverMotion", "OpposingRotation", "GroupedStripSpeeds", "ContinuousHover", "NinetyDegreeStripSettlement", "ContinuousRestart", "ReducedMotion"],
    },
    {
        name: "4: Hover 动效调节器",
        code: `4
<LogoHoverController />`,
        expected: {
            render: "显示可悬停的大号横向 Logo；调试器默认显示米字 0.30x 逆时针、蓝条 1/2 与蓝条 3/4 均为 0.10x 顺时针；三个整体可在 Test 内调整速度和方向，但这些设置不属于 Logo Props，字标保持静态。",
        },
        logic: ["HoverMotionController", "GroupedLayerSpeed", "GroupedLayerDirection"],
    },
] as const;
