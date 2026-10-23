/**
 * SnowUILogo.test.ts
 * v1.19.2
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
    expected: { render: "默认闲置时 icon 静止，不旋转、不飘浮；横版 hover 时 icon 与文字同步变为 Emoji 和问候，品牌字标及变化后的问候均固定左对齐、保持图文间距，长词向右延伸，阿拉伯文保留 RTL 字序；hover 后表情和多语言 Hello 每 1000ms 同步轮换，外框及命中范围保持固定；溢出文字和过渡不重复触发悬停，繁忙帧不补播；移出恢复品牌，减少动效不循环。连续快速移入移出只在稳定节点处理；B → Logo 后十秒内再进入应为 C，恢复过程中再次进入也先完成品牌恢复；超过十秒从 A 开始。" },
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
  {
    name: "6: 两版文字动效对比",
    code: `6
<div class="flex flex-col items-start gap-40">
    <SnowUILogo textMotion="greetings" scale={3} />
    <SnowUILogo textMotion="variants" scale={3} />
</div>`,
    expected: { render: "上方保留多语言问候，下方始终轮换 SnowUI 的圆线、像素、轮廓、斜体、条纹和加粗矢量字形；图标同步轮换 Emoji。移出完成当前过渡后恢复原字标，十秒内再移入从下一节点续播；两版外框稳定。减少动效时均保持静态品牌和 SnowUI 可访问名称。" },
    logic: ["TextMotionVariants", "DefaultCompatibility", "NodeBoundary", "ReducedMotion"],
  },
  {
    name: "7: 第二版组合与收拢",
    code: `7
<div class="flex items-center gap-40 flex-wrap">
    <SnowUILogo variant="text" textMotion="variants" scale={3} />
    <SnowUILogo variant="vertical" textMotion="variants" scale={2} />
    <SnowUILogo variant="vertical" textMotion="variants" compactProgress={0.5} scale={2} />
    <SnowUILogo variant="icon" textMotion="variants" scale={2} />
</div>`,
    expected: { render: "纯字标与纵向组合居中轮换矢量字形，收拢同步缩放字标；纯图标维持 Emoji 轮换。不同实例渐变 ID 不冲突，深浅主题中 Snow 与 UI 保持既有颜色语义。" },
    logic: ["TextMotionVariants", "CompactProgress", "InstanceIsolation", "Theme"],
  },
  {
    name: "8: 可选字形动效 V2",
    code: `8
<SnowUILogo textMotion="variants" scale={3} />`,
    expected: { render: "显式选择第二版，hover 轮换 SnowUI 六种矢量字形；圆线 I 与 U 竖笔等粗。不传 textMotion 时仍为原版 greetings，Site 与 Test 默认 Logo 不切换方案。" },
    logic: ["OptInTextMotion", "BrandStrokeConsistency", "DefaultCompatibility"],
  },
] as const;
