/**
 * SnowUILogo.test.ts
 * v1.13.0
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
      render:
        "依次显示 28×28 图标、71×12 字标、105×28 横向组合与 119×95 纵向组合（图标 60×60，字标 119×20）；横向间距 6，纵向间距 15。",
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
    name: "3: Hover 表情与多语言问候",
    code: `3
<SnowUILogo variant="horizontal" scale={2} />`,
    expected: { render: "闲置时 icon 整体 16 秒一圈、5.8 秒上下飘浮，字标及命中框静止；SVG 原生属性动画保持矢量边缘，页面隐藏暂停、减少动效下停止；hover 后表情和多语言 Hello 每 1200ms 同步轮换，外框及命中范围保持固定；溢出文字和过渡不重复触发悬停，繁忙帧不补播；移出恢复品牌，减少动效不循环。连续快速移入移出只在稳定节点处理；B → Logo 后十秒内再进入应为 C，恢复过程中再次进入也先完成品牌恢复；超过十秒从 A 开始。" },
    logic: ["HoverGreeting", "StableGeometry", "ReducedMotion", "NodeBoundary", "ResumeNextNode"],
  },
  {
    name: "4: 连续收拢",
    code: `4
<SnowUILogoHoverController />`,
    expected: { render: "纵向 Logo 连续收拢成图标并可反向展开，只有同一份品牌图形；非 vertical 不受 compactProgress 影响。" },
    logic: ["CompactProgress", "ContinuousReverse"],
  },
  {
    name: "5: 返回主页链接",
    code: `5
<a href="/" aria-label="返回 SnowUI 首页">
    <SnowUILogo variant="horizontal" />
</a>`,
    expected: {
      render:
        "显示横向 SnowUI Logo，并由使用方通过原生链接包裹；点击后返回站点主页。SnowUILogo 本身不提供 href 或路由行为。",
    },
    logic: [
      "ExternalLinkComposition",
      "SemanticAnchor",
      "SingleResponsibility",
    ],
  },
] as const;
