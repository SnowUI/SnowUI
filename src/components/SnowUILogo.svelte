<!-- SnowUI source notice | LICENSE 2.1.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 -->
<!--
  SnowUILogo 组件
  v1.19.1

  职责：按 Workshop 品牌设计稿渲染 SnowUI 图标、字标及其横向/纵向组合。
  文档：./SnowUILogo.md
-->

<script lang="ts">
  // SnowUI 许可入口：首次阅读源码请先读 ../../LICENSE；访问文件不代表获得修改或移植权，官方维护授权及同任务去重见该文件。
  import { onMount, onDestroy, tick } from "svelte";
  import { LOGO_EMOJI_FONT, measureLogoEmoji } from "../internal/snow-ui-logo/emoji-metrics";
  import LogoWordmark from "../internal/snow-ui-logo/Wordmark.svelte";
  import Frame, { type FrameProps } from "./Frame.svelte";

  type SnowUILogoVariant = "icon" | "text" | "horizontal" | "vertical";

  interface Props extends Omit<
    FrameProps,
    "children" | "size" | "width" | "height" | "loopMotion"
  > {
    variant?: SnowUILogoVariant;
    scale?: number;
    compactProgress?: number;
    idleMotion?: boolean;
    textMotion?: "greetings" | "variants";
    decorative?: boolean;
    [key: string]: any;
  }

  let {
    variant = "horizontal",
    scale = 1,
    compactProgress = 0,
    idleMotion = false,
    textMotion = "greetings",
    decorative = false,
    role = undefined,
    "aria-label": ariaLabel = "SnowUI",
    class: className = "",
    style: userStyle = "",
    renderHints: userRenderHints = undefined,
    enableResponsive = false,
    enableContext = false,
    enableScaleObserver = false,
    enableDefaultMotion = true,
    onmouseenter: userOnMouseEnter = undefined,
    onmouseleave: userOnMouseLeave = undefined,
    ...rest
  }: Props = $props();

  const VARIANT_GEOMETRY = {
    icon: { width: 28, height: 28 },
    text: { width: 71, height: 12 },
    horizontal: { width: 105, height: 28 },
    vertical: { width: 119, height: 95 },
  } as const;
  const logoId = $props.id();
  const greetings = [
    ["😀", "Hello"], ["😊", "你好"], ["😎", "Hola"], ["🥰", "Bonjour"],
    ["😄", "こんにちは"], ["🤗", "안녕하세요"], ["😉", "Ciao"], ["🤩", "Hallo"],
    ["😋", "Olá"], ["😺", "Привет"], ["🥳", "नमस्ते"], ["🙂", "مرحبا"],
  ] as const;
  let greetingIndex = $state(-1);
  let iconSvg = $state<SVGSVGElement>();
  let reducedMotion = $state(true);
  let pageVisible = $state(true);

  function startIdleMotion(node: SVGAnimateTransformElement) {
    node.beginElement();
  }
  $effect(() => {
    if (!iconSvg) return;
    if (!idleMotion || reducedMotion || !pageVisible || greetingIndex !== -1) iconSvg.pauseAnimations();
    else iconSvg.unpauseAnimations();
  });
  const iconIndex = $derived(greetingIndex);
  let emojiMetrics = $state(greetings.map(() => ({ size: 32, x: 0, y: 28 })));
  let cycleTimer: ReturnType<typeof setTimeout> | undefined;
  let hovered = false;
  let transitioning = $state(false);
  let activeTransitions = 0;
  let armed = false;
  let generation = 0;
  let disposed = false;
  let lastNode = -1;
  let resumeUntil = 0;
  let resumeRequested = false;
  let nodeStartedAt = 0;
  let settleFrame = 0;
  const compact = $derived(variant === "vertical" && Number.isFinite(compactProgress) ? Math.max(0, Math.min(1, compactProgress)) : 0);
  const greeting = $derived(greetingIndex === -1 ? null : greetings[greetingIndex][1]);

  function iconTransition(_node: SVGElement) {
    return { duration: prefersReducedMotion() ? 0 : 320, css: (t: number, u: number) => `opacity:${t};transform:scale(${1 - .55 * u});filter:blur(${3 * u}px)` };
  }

  const safeScale = $derived.by(() => {
    const current = Number(scale);
    return Number.isFinite(current) && current > 0 ? current : 1;
  });
  const geometry = $derived(variant === "vertical" ? { width: 119 - 91 * compact, height: 95 - 67 * compact } : VARIANT_GEOMETRY[variant]);
  const snowUILogoStyle = $derived(
    [variant === "vertical" && "transition: none", `--snowui-snow-ui-logo-scale: ${safeScale}`, `--snowui-snow-ui-logo-compact: ${compact}`, userStyle]
      .filter(Boolean)
      .join("; "),
  );
  const snowUILogoRenderHints = $derived({
    variant: userRenderHints?.variant ?? "rect",
    width: userRenderHints?.width ?? `${geometry.width * safeScale}px`,
    height: userRenderHints?.height ?? `${geometry.height * safeScale}px`,
  });

  function prefersReducedMotion(): boolean {
    return (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }

  function clearCycleTimer() {
    if (cycleTimer !== undefined) clearTimeout(cycleTimer);
    cycleTimer = undefined;
  }

  // 减少动效、页面隐藏和卸载属于生命周期终止，不受 hover 的排队规则限制。
  function stopCycle() {
    generation++;
    hovered = false;
    transitioning = false;
    armed = false;
    activeTransitions = 0;
    lastNode = -1;
    resumeUntil = 0;
    resumeRequested = false;
    clearCycleTimer();
    if (typeof window !== "undefined") cancelAnimationFrame(settleFrame);
    greetingIndex = -1;
  }

  $effect(() => {
    textMotion;
    stopCycle();
  });

  function motionStarted() { activeTransitions++; }
  function motionEnded() {
    activeTransitions = Math.max(0, activeTransitions - 1);
    settleIfComplete();
  }
  function settleIfComplete() {
    if (disposed || !transitioning || !armed || activeTransitions !== 0) return;
    transitioning = false;
    if (greetingIndex !== -1) lastNode = greetingIndex;
    // 保留一个真正完成的静态帧，再消费最后一次 hover 意图。
    settleFrame = requestAnimationFrame(reconcileHover);
  }

  async function moveToNode(index: number) {
    if (disposed || transitioning || greetingIndex === index) return;
    clearCycleTimer();
    if (typeof window !== "undefined") cancelAnimationFrame(settleFrame);
    transitioning = true;
    armed = false;
    const run = ++generation;
    nodeStartedAt = performance.now();
    greetingIndex = index;
    // 等 Svelte 提交所有字母和图标后，再由实际 transition end 判断完成。
    await tick();
    // transition start 由渲染帧派发，不能把 DOM 提交误判为动画完成。
    await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
    if (disposed || run !== generation) return;
    armed = true;
    settleIfComplete();
  }

  function reconcileHover() {
    if (disposed || transitioning) return;
    clearCycleTimer();
    if (!hovered) {
      if (greetingIndex !== -1) void moveToNode(-1);
      return;
    }
    if (greetingIndex === -1) {
      const next = resumeRequested ? (lastNode + 1) % greetings.length : 0;
      void moveToNode(next);
      return;
    }
    // 不积累补播：稳定节点至少停留一个绘制帧，再进入下一个节点。
    cycleTimer = setTimeout(() => {
      cycleTimer = undefined;
      if (hovered && !transitioning) void moveToNode((lastNode + 1) % greetings.length);
    }, Math.max(0, 1000 - (performance.now() - nodeStartedAt)));
  }

  function handleMouseEnter(event: MouseEvent) {
    if (!prefersReducedMotion()) {
      hovered = true;
      resumeRequested = performance.now() <= resumeUntil;
      reconcileHover();
    }
    userOnMouseEnter?.(event);
  }

  function handleMouseLeave(event: MouseEvent) {
    hovered = false;
    resumeUntil = performance.now() + 10000;
    clearCycleTimer();
    reconcileHover();
    userOnMouseLeave?.(event);
  }

  onMount(() => {
    emojiMetrics = greetings.map(([emoji]) => measureLogoEmoji(emoji));
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotion = preference.matches;
    const syncPreference = () => { reducedMotion = preference.matches; stopCycle(); };
    const stopWhenHidden = () => { pageVisible = !document.hidden; if (!pageVisible) stopCycle(); };
    stopWhenHidden();
    preference.addEventListener("change", syncPreference);
    document.addEventListener("visibilitychange", stopWhenHidden);
    return () => {
      preference.removeEventListener("change", syncPreference);
      document.removeEventListener("visibilitychange", stopWhenHidden);
    };
  });
  onDestroy(() => { disposed = true; stopCycle(); });

</script>

<Frame
  enableAutoLayout={false}
  enableResponsive={enableResponsive}
  enableContext={enableContext}
  enableScaleObserver={enableScaleObserver}
  enableDefaultMotion={enableDefaultMotion}
  class={["snowui-snow-ui-logo", `snowui-snow-ui-logo-${variant}`, className]
    .filter(Boolean)
    .join(" ")}
  data-variant={variant}
  data-snow-ui-logo-cycle={greetingIndex !== -1 ? "active" : "idle"}
  data-logo-motion={transitioning ? "transitioning" : "settled"}
  data-logo-node={greetingIndex}
  data-text-motion={textMotion}
  data-compact-progress={compact}
  style={snowUILogoStyle}
  role={decorative ? undefined : (role ?? "img")}
  aria-label={decorative ? undefined : ariaLabel}
  aria-hidden={decorative ? "true" : undefined}
  renderHints={snowUILogoRenderHints}
  onmouseenter={handleMouseEnter}
  onmouseleave={handleMouseLeave}
  {...rest}
>
  {#if variant !== "text"}
    <svg
      bind:this={iconSvg}
      class="snowui-snow-ui-logo-icon"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {#key iconIndex}
      <g class="snowui-logo-icon-face" transition:iconTransition onintrostart={motionStarted} onoutrostart={motionStarted} onintroend={motionEnded} onoutroend={motionEnded}>
      {#if iconIndex === -1}
      <g class="snowui-logo-idle-float">
      {#if idleMotion && !reducedMotion}
        <animateTransform use:startIdleMotion attributeName="transform" type="translate" values="0 0; 0 -4.5714; 0 0" keyTimes="0; .5; 1" keySplines=".45 0 .55 1; .45 0 .55 1" calcMode="spline" dur="5.8s" repeatCount="indefinite" begin="indefinite" />
      {/if}
      <g class="snowui-logo-idle-spin">
      {#if idleMotion && !reducedMotion}
        <animateTransform use:startIdleMotion attributeName="transform" type="rotate" from="0 16 16" to="360 16 16" dur="16s" repeatCount="indefinite" begin="indefinite" />
      {/if}
      <!-- 来自 resource-base/assets/logos/snow-logo.svg 的品牌矢量快照；非 hover 时保留原始图形。 -->
      <g class="snowui-snow-ui-logo-color">
        <path
          d="M27.3137 27.3135C25.4391 29.1881 22.3999 29.1881 20.5254 27.3135L12.6058 19.3939L19.3941 12.6057L27.3137 20.5253C29.1882 22.3998 29.1882 25.439 27.3137 27.3135Z"
          fill={`url(#${logoId}-paint0_linear_7159_5276)`}
        />
        <path
          d="M20.8 27.2C20.8 29.851 18.6509 32 16 32C13.349 32 11.2 29.851 11.2 27.2V16H20.8V27.2Z"
          fill={`url(#${logoId}-paint1_linear_7159_5276)`}
        />
        <path
          d="M11.4745 27.3138C9.59995 29.1883 6.56076 29.1883 4.68624 27.3138C2.81172 25.4393 2.81172 22.4001 4.68624 20.5256L12.6058 12.606L19.3941 19.3942L11.4745 27.3138Z"
          fill={`url(#${logoId}-paint2_linear_7159_5276)`}
        />
        <path
          d="M4.8 20.8002C2.14903 20.8002 -3.25692e-07 18.6512 -2.09815e-07 16.0002C-9.39372e-08 13.3492 2.14903 11.2002 4.8 11.2002L16 11.2002L16 20.8002L4.8 20.8002Z"
          fill={`url(#${logoId}-paint3_linear_7159_5276)`}
        />
        <path
          d="M4.68635 11.4746C2.81183 9.60007 2.81183 6.56088 4.68635 4.68636C6.56086 2.81184 9.60005 2.81184 11.4746 4.68636L19.3942 12.606L12.6059 19.3942L4.68635 11.4746Z"
          fill={`url(#${logoId}-paint4_linear_7159_5276)`}
        />
        <path
          d="M16 0C18.6509 0 20.8 2.14903 20.8 4.8V16H11.2V4.8C11.2 2.14903 13.349 0 16 0Z"
          fill={`url(#${logoId}-paint5_linear_7159_5276)`}
        />
        <path
          d="M27.3137 4.6861C29.1882 6.56062 29.1882 9.59981 27.3137 11.4743L19.3941 19.3939L12.6058 12.6057L20.5254 4.6861C22.4 2.81159 25.4392 2.81159 27.3137 4.6861Z"
          fill={`url(#${logoId}-paint6_linear_7159_5276)`}
        />
        <path
          d="M32 16.0002C32 18.6512 29.851 20.8002 27.2 20.8002L16 20.8002L16 11.2002L27.2 11.2002C29.851 11.2002 32 13.3492 32 16.0002Z"
          fill={`url(#${logoId}-paint7_linear_7159_5276)`}
        />
        <path
          d="M27.5563 20.7866C27.4386 20.7953 27.3197 20.7999 27.1998 20.7999L20.7999 20.7999L16.0002 16.0002L22.7884 16.0002L27.3135 20.5253C27.3983 20.6101 27.4792 20.6973 27.5563 20.7866Z"
          fill={`url(#${logoId}-paint8_linear_7159_5276)`}
        />
        <path
          d="M20.8 20.8V27.2002C20.8 27.3199 20.7953 27.4387 20.7867 27.5563C20.6975 27.4792 20.6102 27.3985 20.5255 27.3138L16 22.7883V16L20.8 20.8Z"
          fill={`url(#${logoId}-paint9_linear_7159_5276)`}
        />
        <path
          d="M16 22.7882L11.4744 27.3138C11.3897 27.3985 11.3025 27.4792 11.2132 27.5562C11.2046 27.4386 11.2 27.3198 11.2 27.2V20.8L16 16L16 22.7882Z"
          fill={`url(#${logoId}-paint10_linear_7159_5276)`}
        />
        <path
          d="M11.2 20.8L4.79984 20.8C4.68006 20.8 4.56133 20.7953 4.44375 20.7867C4.52081 20.6975 4.60153 20.6102 4.68625 20.5255L9.21172 16L16 16L11.2 20.8Z"
          fill={`url(#${logoId}-paint11_linear_7159_5276)`}
        />
        <path
          d="M9.21178 16L4.68618 11.4744C4.60149 11.3897 4.52082 11.3025 4.44378 11.2132C4.56138 11.2046 4.68018 11.2 4.79998 11.2L11.2 11.2L16 16L9.21178 16Z"
          fill={`url(#${logoId}-paint12_linear_7159_5276)`}
        />
        <path
          d="M11.2131 4.44385C11.3024 4.52095 11.3897 4.60174 11.4745 4.6865L16 9.21197V15.9998L11.2 11.1998V4.80025C11.2 4.68037 11.2044 4.56152 11.2131 4.44385Z"
          fill={`url(#${logoId}-paint13_linear_7159_5276)`}
        />
        <path
          d="M20.7867 4.44385C20.7954 4.56152 20.8 4.6804 20.8 4.80028L20.8 11.2003L16.0003 16V9.21174L20.5254 4.68659C20.6102 4.60182 20.6974 4.52095 20.7867 4.44385Z"
          fill={`url(#${logoId}-paint14_linear_7159_5276)`}
        />
        <path
          d="M27.5563 11.2133C27.4792 11.3026 27.3984 11.39 27.3136 11.4747L22.7881 16.0002L16.0003 16.0002L20.8003 11.2002L27.1999 11.2002C27.3197 11.2002 27.4386 11.2047 27.5563 11.2133Z"
          fill={`url(#${logoId}-paint15_linear_7159_5276)`}
        />
      </g>
      <path
        class="snowui-snow-ui-logo-star"
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M16 4.7998C15.6466 4.7998 15.36 5.08634 15.36 5.4398V13.8367C15.36 14.0305 15.36 14.1275 15.3217 14.1723C15.2885 14.2113 15.2386 14.232 15.1875 14.2279C15.1287 14.2233 15.0601 14.1548 14.923 14.0177L8.98556 8.08021C8.73562 7.83028 8.33039 7.83028 8.08046 8.08021C7.83052 8.33015 7.83052 8.73537 8.08046 8.98531L14.0179 14.9228C14.155 15.0599 14.2236 15.1284 14.2282 15.1873C14.2322 15.2383 14.2115 15.2882 14.1726 15.3215C14.1277 15.3598 14.0308 15.3598 13.8369 15.3598H5.44005C5.08659 15.3598 4.80005 15.6463 4.80005 15.9998C4.80005 16.3533 5.08659 16.6398 5.44005 16.6398H13.8369C14.0308 16.6398 14.1277 16.6398 14.1726 16.6781C14.2115 16.7114 14.2322 16.7613 14.2282 16.8124C14.2236 16.8712 14.155 16.9397 14.0179 17.0768L8.08046 23.0143C7.83052 23.2642 7.83052 23.6695 8.08046 23.9194C8.33039 24.1693 8.73562 24.1693 8.98555 23.9194L14.923 17.9819C15.0601 17.8448 15.1287 17.7763 15.1875 17.7717C15.2386 17.7677 15.2885 17.7883 15.3217 17.8273C15.36 17.8722 15.36 17.9691 15.36 18.1629V26.5598C15.36 26.9133 15.6466 27.1998 16 27.1998C16.3535 27.1998 16.64 26.9133 16.64 26.5598V18.1629C16.64 17.9691 16.64 17.8721 16.6784 17.8273C16.7116 17.7883 16.7615 17.7676 16.8126 17.7717C16.8714 17.7763 16.94 17.8448 17.0771 17.9819L23.0146 23.9194C23.2645 24.1693 23.6697 24.1693 23.9196 23.9194C24.1696 23.6695 24.1696 23.2642 23.9196 23.0143L17.9822 17.0768C17.8451 16.9397 17.7765 16.8712 17.7719 16.8124C17.7679 16.7613 17.7886 16.7114 17.8275 16.6781C17.8724 16.6398 17.9693 16.6398 18.1632 16.6398H26.5601C26.9135 16.6398 27.2001 16.3533 27.2001 15.9998C27.2001 15.6463 26.9135 15.3598 26.5601 15.3598H18.1632C17.9693 15.3598 17.8724 15.3598 17.8275 15.3215C17.7886 15.2882 17.7679 15.2383 17.7719 15.1873C17.7766 15.1284 17.8451 15.0599 17.9822 14.9228L23.9196 8.98531C24.1696 8.73537 24.1696 8.33015 23.9196 8.08021C23.6697 7.83027 23.2645 7.83027 23.0146 8.08021L17.0771 14.0177C16.94 14.1548 16.8714 14.2233 16.8126 14.2279C16.7615 14.232 16.7116 14.2113 16.6784 14.1723C16.64 14.1275 16.64 14.0305 16.64 13.8367V5.4398C16.64 5.08634 16.3535 4.7998 16 4.7998Z"
        fill="white"
      />
      <defs>
        <linearGradient
          id={`${logoId}-paint0_linear_7159_5276`}
          x1="12.6058"
          y1="19.3939"
          x2="27.3137"
          y2="27.3135"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#2755D1" />
          <stop offset="1" stop-color="#3347CD" />
        </linearGradient>
        <linearGradient
          id={`${logoId}-paint1_linear_7159_5276`}
          x1="11.2"
          y1="24"
          x2="20.8"
          y2="24"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#4D7FE3" />
          <stop offset="1" stop-color="#3A60E3" />
        </linearGradient>
        <linearGradient
          id={`${logoId}-paint2_linear_7159_5276`}
          x1="4.68624"
          y1="27.3138"
          x2="19.3941"
          y2="19.3942"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#3291FF" />
          <stop offset="1" stop-color="#3F85FF" />
        </linearGradient>
        <linearGradient
          id={`${logoId}-paint3_linear_7159_5276`}
          x1="1.90732e-08"
          y1="16.0002"
          x2="16"
          y2="16.0002"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#33D1FF" />
          <stop offset="1" stop-color="#56B2FF" />
        </linearGradient>
        <linearGradient
          id={`${logoId}-paint4_linear_7159_5276`}
          x1="4.68635"
          y1="4.68636"
          x2="12.6059"
          y2="19.3942"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#69D1F9" />
          <stop offset="1" stop-color="#79C4F8" />
        </linearGradient>
        <linearGradient
          id={`${logoId}-paint5_linear_7159_5276`}
          x1="11.2"
          y1="6.8"
          x2="20.8"
          y2="6.8"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#A3DAFA" />
          <stop offset="1" stop-color="#B0D0F9" />
        </linearGradient>
        <linearGradient
          id={`${logoId}-paint6_linear_7159_5276`}
          x1="27.6531"
          y1="5.02552"
          x2="16.3394"
          y2="16.3392"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#D1D9FA" />
          <stop offset="1" stop-color="#C5E2FB" />
        </linearGradient>
        <linearGradient
          id={`${logoId}-paint7_linear_7159_5276`}
          x1="16"
          y1="15.5202"
          x2="32"
          y2="15.5202"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#61A8FF" />
          <stop offset="1" stop-color="#7482FF" />
        </linearGradient>
        <linearGradient
          id={`${logoId}-paint8_linear_7159_5276`}
          x1="12.6058"
          y1="19.3941"
          x2="28.3"
          y2="23.8005"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#2755D1" />
          <stop offset="1" stop-color="#3347CD" />
        </linearGradient>
        <linearGradient
          id={`${logoId}-paint9_linear_7159_5276`}
          x1="11.2"
          y1="21.7781"
          x2="20.8"
          y2="21.7781"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#4D7FE3" />
          <stop offset="1" stop-color="#3A60E3" />
        </linearGradient>
        <linearGradient
          id={`${logoId}-paint10_linear_7159_5276`}
          x1="4.68629"
          y1="27.3137"
          x2="20.3619"
          y2="22.6397"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#3291FF" />
          <stop offset="1" stop-color="#3F85FF" />
        </linearGradient>
        <linearGradient
          id={`${logoId}-paint11_linear_7159_5276`}
          x1="0"
          y1="16"
          x2="16"
          y2="16"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#33D1FF" />
          <stop offset="1" stop-color="#56B2FF" />
        </linearGradient>
        <linearGradient
          id={`${logoId}-paint12_linear_7159_5276`}
          x1="4.68629"
          y1="4.68629"
          x2="9.36033"
          y2="20.3619"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#69D1F9" />
          <stop offset="1" stop-color="#79C4F8" />
        </linearGradient>
        <linearGradient
          id={`${logoId}-paint13_linear_7159_5276`}
          x1="11.2"
          y1="9.35512"
          x2="20.8"
          y2="9.35512"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#A3DAFA" />
          <stop offset="1" stop-color="#B0D0F9" />
        </linearGradient>
        <linearGradient
          id={`${logoId}-paint14_linear_7159_5276`}
          x1="27.3138"
          y1="4.68648"
          x2="16.0001"
          y2="16.0002"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#D1D9FA" />
          <stop offset="1" stop-color="#C5E2FB" />
        </linearGradient>
        <linearGradient
          id={`${logoId}-paint15_linear_7159_5276`}
          x1="16"
          y1="16.0002"
          x2="32"
          y2="16.0002"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#61A8FF" />
          <stop offset="1" stop-color="#7482FF" />
        </linearGradient>
      </defs>
      </g>
      </g>
      {:else}
        <text x={emojiMetrics[iconIndex].x} y={emojiMetrics[iconIndex].y} font-family={LOGO_EMOJI_FONT} font-size={emojiMetrics[iconIndex].size} fill="currentColor">{greetings[iconIndex][0]}</text>
      {/if}
      </g>
      {/key}
    </svg>
  {/if}

  {#if variant !== "icon"}
    <span class="snowui-snow-ui-logo-wordmark" aria-hidden="true">
      <LogoWordmark greeting={textMotion === "variants" ? null : greeting} formIndex={textMotion === "variants" ? greetingIndex : -1} variantMotion={textMotion === "variants"} align={variant === "horizontal" ? "left" : "center"} id={logoId} onmotionstart={motionStarted} onmotionend={motionEnded} />
    </span>
  {/if}
</Frame>

<style>
  :global(:where(.snowui-snow-ui-logo)) {
    --snowui-snow-ui-logo-scale: 1;
    display: inline-flex;
    flex: none;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    font-size: var(--text-14);
    line-height: var(--leading-14);
  }

  :global(:where(.snowui-snow-ui-logo-horizontal)) {
    flex-direction: row;
    gap: var(
      --snowui-snow-ui-logo-gap-override,
      calc(var(--gap-1) * 1.5 * var(--snowui-snow-ui-logo-scale))
    );
  }

  :global(:where(.snowui-snow-ui-logo-vertical)) {
    flex-direction: column;
    width: calc((119 - 91 * var(--snowui-snow-ui-logo-compact)) / 16 * 1rem * var(--snowui-snow-ui-logo-scale));
    gap: var(
      --snowui-snow-ui-logo-gap-override,
      calc(var(--gap-1) * 3.75 * (1 - var(--snowui-snow-ui-logo-compact)) * var(--snowui-snow-ui-logo-scale))
    );
  }

  :global(:where(.snowui-snow-ui-logo-icon)) {
    display: block;
    flex: none;
    width: var(
      --snowui-snow-ui-logo-icon-size-override,
      calc(var(--size-7) * var(--snowui-snow-ui-logo-scale))
    );
    height: var(
      --snowui-snow-ui-logo-icon-size-override,
      calc(var(--size-7) * var(--snowui-snow-ui-logo-scale))
    );
    overflow: visible;
  }

  :global(:where(.snowui-snow-ui-logo-vertical) .snowui-snow-ui-logo-icon) {
    width: var(
      --snowui-snow-ui-logo-icon-size-override,
      calc(var(--size-4) * (3.75 - 2 * var(--snowui-snow-ui-logo-compact)) * var(--snowui-snow-ui-logo-scale))
    );
    height: var(
      --snowui-snow-ui-logo-icon-size-override,
      calc(var(--size-4) * (3.75 - 2 * var(--snowui-snow-ui-logo-compact)) * var(--snowui-snow-ui-logo-scale))
    );
  }

  :global(:where(.snowui-snow-ui-logo-wordmark)) {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: calc(var(--text-12) * var(--snowui-snow-ui-logo-scale));
    flex: none;
    width: var(
      --snowui-snow-ui-logo-wordmark-width-override,
      calc(var(--size-4) * 71 / 16 * var(--snowui-snow-ui-logo-scale))
    );
    height: var(
      --snowui-snow-ui-logo-wordmark-height-override,
      calc(var(--size-3) * var(--snowui-snow-ui-logo-scale))
    );
    overflow: visible;
  }

  :global(:where(.snowui-snow-ui-logo-vertical) .snowui-snow-ui-logo-wordmark) {
    font-size: calc(var(--text-14) * 20 / 14 * (1 - var(--snowui-snow-ui-logo-compact)) * var(--snowui-snow-ui-logo-scale));
    opacity: calc(1 - var(--snowui-snow-ui-logo-compact));
    overflow: visible;
    width: var(
      --snowui-snow-ui-logo-wordmark-width-override,
      calc(var(--size-4) * 119 / 16 * (1 - var(--snowui-snow-ui-logo-compact)) * var(--snowui-snow-ui-logo-scale))
    );
    height: var(
      --snowui-snow-ui-logo-wordmark-height-override,
      calc(var(--size-5) * (1 - var(--snowui-snow-ui-logo-compact)) * var(--snowui-snow-ui-logo-scale))
    );
  }

  /* 动态字形只负责绘制，溢出和缩放不能改变根节点的悬停命中范围。 */
  :global(:where(.snowui-snow-ui-logo-icon)),
  :global(:where(.snowui-snow-ui-logo-wordmark)) { pointer-events: none; }

  :global(:where(.snowui-logo-icon-face)) { transform-origin: 16px 16px; }
</style>
