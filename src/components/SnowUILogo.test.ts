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
    name: "3: Hover 分层旋转",
    code: `3
<SnowUILogo variant="horizontal" scale={2} />`,
    expected: {
      render:
        "hover 后白色米字 0.20x、完整彩色图形 0.10x 顺时针匀速连续旋转。移出后米字停靠 45°、彩色图形停靠 90° 对齐点，再次 hover 从停止角度继续；字标保持静态。减少动效时两个图层静止，品牌完整可见。",
    },
    logic: [
      "HoverMotion",
      "ClockwiseRotation",
      "TwoLayerSpeeds",
      "ContinuousHover",
      "ColorLayerSettlement",
      "ContinuousRestart",
      "ReducedMotion",
    ],
  },
  {
    name: "4: Hover 动效调节器",
    code: `4
<SnowUILogoHoverController />`,
    expected: {
      render:
        "显示白色米字和彩色图形两个调节组，默认分别为 0.20x 和 0.10x 顺时针；可调整两层速度和方向，调试设置不属于组件公开 API。",
    },
    logic: [
      "HoverMotionController",
      "GroupedLayerSpeed",
      "GroupedLayerDirection",
    ],
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
