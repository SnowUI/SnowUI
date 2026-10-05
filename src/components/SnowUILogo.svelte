<!--
  SnowUILogo 组件
  v1.13.0

  职责：按 Workshop 品牌设计稿渲染 SnowUI 图标、字标及其横向/纵向组合。
  文档：./SnowUILogo.md
-->

<script lang="ts">
  import { onDestroy } from "svelte";
  import Frame, { type FrameProps } from "./Frame.svelte";

  type SnowUILogoVariant = "icon" | "text" | "horizontal" | "vertical";
  type SnowUILogoRotationDirection = "clockwise" | "counterclockwise";

  interface Props extends Omit<
    FrameProps,
    "children" | "size" | "width" | "height" | "loopMotion"
  > {
    variant?: SnowUILogoVariant;
    scale?: number;
    decorative?: boolean;
    [key: string]: any;
  }

  let {
    variant = "horizontal",
    scale = 1,
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
  const FRAME_LOOP_MOTION = {
    duration: 1000,
    easing: "linear",
    iterationCount: 1,
    direction: "normal",
    playState: "running",
  } as const;
  const logoId = $props.id();
  const asteriskMotion = { direction: "clockwise" } as const;
  let isHovered = false;
  let cycleActive = $state(false);
  let settling = $state(false);
  let iconElement = $state<SVGSVGElement>();
  let settleRun = 0;
  let settleAnimations: Animation[] = [];

  function startCycle() {
    cycleActive = true;
  }

  const safeScale = $derived.by(() => {
    const current = Number(scale);
    return Number.isFinite(current) && current > 0 ? current : 1;
  });
  const geometry = $derived(VARIANT_GEOMETRY[variant]);
  const snowUILogoStyle = $derived(
    [safeScale !== 1 && `--snowui-snow-ui-logo-scale: ${safeScale}`, userStyle]
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

  function handleMouseEnter(event: MouseEvent) {
    isHovered = true;
    if (
      variant !== "text" &&
      !cycleActive &&
      !settling &&
      !prefersReducedMotion()
    ) {
      startCycle();
    }
    userOnMouseEnter?.(event);
  }

  function handleMouseLeave(event: MouseEvent) {
    isHovered = false;
    if (cycleActive && !prefersReducedMotion()) {
      settleToTwelveOClock();
    }
    userOnMouseLeave?.(event);
  }

  function readRotationAngle(element: Element): number {
    const transform = getComputedStyle(element).transform;
    if (!transform || transform === "none") return 0;

    const matrix = new DOMMatrixReadOnly(transform);
    const degrees = Math.atan2(matrix.b, matrix.a) * (180 / Math.PI);
    return (degrees + 360) % 360;
  }

  function readDurationMs(element: Element): number {
    const value = getComputedStyle(element).animationDuration.trim();
    if (value.endsWith("ms")) return Number.parseFloat(value);
    if (value.endsWith("s")) return Number.parseFloat(value) * 1000;
    return 0;
  }

  function resolveAlignmentTarget(
    angle: number,
    direction: SnowUILogoRotationDirection,
    step: number,
  ): number {
    const epsilon = 0.001;
    return direction === "clockwise"
      ? Math.ceil(angle / step - epsilon) * step
      : Math.floor(angle / step + epsilon) * step;
  }

  async function settleToTwelveOClock() {
    const layers = iconElement
      ? Array.from(
          iconElement.querySelectorAll<SVGGraphicsElement>(
            ".snowui-snow-ui-logo-star, .snowui-snow-ui-logo-color",
          ),
        )
      : [];
    if (layers.length !== 2) {
      cycleActive = false;
      return;
    }

    const snapshots = layers.map((element) => {
      const turn = Number.parseFloat(
        getComputedStyle(element).getPropertyValue(
          "--snowui-snow-ui-logo-angle-360",
        ),
      );
      const direction: SnowUILogoRotationDirection =
        turn < 0 ? "counterclockwise" : "clockwise";
      const start = readRotationAngle(element);
      const alignmentStep = element.classList.contains(
        "snowui-snow-ui-logo-star",
      )
        ? 45
        : 90;
      const end = resolveAlignmentTarget(start, direction, alignmentStep);
      const fullTurnDuration = readDurationMs(element);
      const remainingDegrees = Math.abs(end - start);
      const duration =
        fullTurnDuration > 0 ? fullTurnDuration * (remainingDegrees / 360) : 0;
      return { element, start, end, duration };
    });

    const currentRun = ++settleRun;
    settleAnimations.forEach((animation) => animation.cancel());
    settleAnimations = [];
    cycleActive = false;
    settling = true;

    const completions = snapshots.map(({ element, start, end, duration }) => {
      if (duration <= 1 || typeof element.animate !== "function") {
        element.style.setProperty(
          "--snowui-snow-ui-logo-rest-angle",
          `${end}deg`,
        );
        return Promise.resolve();
      }

      const animation = element.animate(
        [
          { transform: `rotate(${start}deg)` },
          { transform: `rotate(${end}deg)` },
        ],
        {
          duration,
          easing: "linear",
          fill: "forwards",
        },
      );
      settleAnimations.push(animation);
      return animation.finished
        .then(() => {
          element.style.setProperty(
            "--snowui-snow-ui-logo-rest-angle",
            `${end}deg`,
          );
          animation.cancel();
        })
        .catch(() => undefined);
    });

    await Promise.all(completions);
    if (currentRun !== settleRun) return;

    settleAnimations = [];
    settling = false;
    if (isHovered && !prefersReducedMotion()) startCycle();
  }

  onDestroy(() => {
    settleRun += 1;
    settleAnimations.forEach((animation) => animation.cancel());
  });
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
  data-snow-ui-logo-cycle={cycleActive
    ? "active"
    : settling
      ? "settling"
      : "idle"}
  style={snowUILogoStyle}
  role={decorative ? undefined : (role ?? "img")}
  aria-label={decorative ? undefined : ariaLabel}
  aria-hidden={decorative ? "true" : undefined}
  renderHints={snowUILogoRenderHints}
  onmouseenter={handleMouseEnter}
  onmouseleave={handleMouseLeave}
  {...rest}
  loopMotion={FRAME_LOOP_MOTION}
>
  {#if variant !== "text"}
    <svg
      bind:this={iconElement}
      class="snowui-snow-ui-logo-icon"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <!-- 来自 resource-base/assets/logos/snow-logo.svg 的品牌矢量快照；两层独立旋转。 -->
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
        data-direction={asteriskMotion.direction}
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
    </svg>
  {/if}

  {#if variant !== "icon"}
    <svg
      class="snowui-snow-ui-logo-wordmark"
      preserveAspectRatio={variant === "vertical" ? "none" : "xMidYMid meet"}
      viewBox="0 0 71 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <g id={`${logoId}-snow-paths`}>
          <path
            d="M7.75145 11.0976C6.91908 11.7073 5.80058 12 4.39595 12C3.53757 12 2.75723 11.878 2.05491 11.6585C1.3526 11.439 0.650289 11.1463 0 10.7561L0.806358 9.02439C1.45665 9.43902 2.05491 9.70732 2.62717 9.87805C3.19942 10.0488 3.77168 10.1463 4.31792 10.1463C5.12428 10.1463 5.72254 10.0244 6.16474 9.7561C6.58093 9.48781 6.78902 9.12195 6.78902 8.63415C6.78902 8.09756 6.55491 7.68293 6.06069 7.41463C5.56647 7.14634 4.9422 6.87805 4.18786 6.60976C3.06936 6.21951 2.18497 5.78049 1.53468 5.29268C0.858382 4.80488 0.520231 4.09756 0.49422 3.17073C0.468208 2.17073 0.858382 1.39024 1.66474 0.829268C2.4711 0.268293 3.51156 0 4.81214 0C5.46243 0 6.08671 0.0731705 6.71098 0.243902C7.33526 0.414634 7.93353 0.658536 8.47977 1L7.67341 2.65854C7.17919 2.39024 6.71098 2.19512 6.26879 2.04878C5.80058 1.90244 5.30636 1.82927 4.81214 1.82927C4.16185 1.82927 3.64162 1.92683 3.25145 2.14634C2.86127 2.36585 2.67919 2.70732 2.67919 3.14634C2.67919 3.63415 2.93931 4 3.43353 4.2439C3.92775 4.4878 4.57803 4.7561 5.33237 5.04878C6.45087 5.43902 7.33526 5.87805 8.01156 6.39024C8.66185 6.90244 9 7.60976 9 8.56098C9 9.65854 8.58382 10.4878 7.75145 11.0976Z"
          />
          <path
            d="M20 5V12H22V5C22 2.23858 19.7614 0 17 0C14.2386 0 12 2.23858 12 5V12H14V5C14 3.34315 15.3431 2 17 2C18.6569 2 20 3.34315 20 5Z"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M37 6C37 9.31371 34.3137 12 31 12C27.6863 12 25 9.31371 25 6C25 2.68629 27.6863 0 31 0C34.3137 0 37 2.68629 37 6ZM35 6C35 8.20914 33.2091 10 31 10C28.7909 10 27 8.20914 27 6C27 3.79086 28.7909 2 31 2C33.2091 2 35 3.79086 35 6Z"
          />
          <path
            d="M39 0L40.8849 10.3516C41.2759 12.4988 44.143 12.5684 44.6258 10.4424L45.7431 4.54182C45.7842 4.32506 46.0747 4.32948 46.11 4.5474L47.0502 10.3547C47.4675 12.4986 50.339 12.5261 50.7927 10.3906L53 0H51.0588L49.1166 9.9604C49.0748 10.1745 48.7885 10.1717 48.7505 9.9568L46.9863 0H45.0323L42.9663 9.9897C42.9221 10.2031 42.6362 10.1968 42.6003 9.98168L40.932 0H39Z"
          />
        </g>
        <g id={`${logoId}-ui-paths`}>
          <path
            d="M58 7L58 0H56V7C56 9.76142 58.2386 12 61 12C63.7614 12 66 9.76142 66 7L66 0H64L64 7C64 8.65685 62.6569 10 61 10C59.3431 10 58 8.65685 58 7Z"
          />
          <path d="M69 0V12H71V0H69Z" />
        </g>
        <linearGradient
          id={`${logoId}-snow-overlay`}
          x1="0"
          y1="6"
          x2="53"
          y2="6"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="var(--white-10, #FFFFFF1A)" />
          <stop offset="1" stop-color="#FFFFFF" stop-opacity="0" />
        </linearGradient>
        <linearGradient
          id={`${logoId}-ui-overlay`}
          x1="65"
          y1="0"
          x2="65"
          y2="12"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#FFFFFF" stop-opacity="0" />
          <stop offset="1" stop-color="#FFFFFF" stop-opacity="0.4" />
        </linearGradient>
      </defs>
      <g class="snowui-snow-ui-logo-wordmark-snow">
        <use
          href={`#${logoId}-snow-paths`}
          fill="var(--black-100, #000000FF)"
        />
        <use
          href={`#${logoId}-snow-paths`}
          fill={`url(#${logoId}-snow-overlay)`}
        />
      </g>
      <g class="snowui-snow-ui-logo-wordmark-ui">
        <use href={`#${logoId}-ui-paths`} fill="var(--brand, #33D1FFFF)" />
        <use href={`#${logoId}-ui-paths`} fill={`url(#${logoId}-ui-overlay)`} />
      </g>
    </svg>
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
    gap: var(
      --snowui-snow-ui-logo-gap-override,
      calc(var(--gap-1) * 3.75 * var(--snowui-snow-ui-logo-scale))
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
      calc(var(--size-4) * 3.75 * var(--snowui-snow-ui-logo-scale))
    );
    height: var(
      --snowui-snow-ui-logo-icon-size-override,
      calc(var(--size-4) * 3.75 * var(--snowui-snow-ui-logo-scale))
    );
  }

  :global(:where(.snowui-snow-ui-logo-wordmark)) {
    display: block;
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
    width: var(
      --snowui-snow-ui-logo-wordmark-width-override,
      calc(var(--size-4) * 119 / 16 * var(--snowui-snow-ui-logo-scale))
    );
    height: var(
      --snowui-snow-ui-logo-wordmark-height-override,
      calc(var(--size-5) * var(--snowui-snow-ui-logo-scale))
    );
  }

  :global(:where(.snowui-snow-ui-logo-color)),
  :global(:where(.snowui-snow-ui-logo-star)) {
    --snowui-snow-ui-logo-rest-angle: 0deg;
    transform-box: view-box;
    transform-origin: center;
    transform: rotate(var(--snowui-snow-ui-logo-rest-angle));
    animation-timing-function: var(--snowui-frame-loop-motion-easing, linear);
    animation-iteration-count: infinite;
    animation-direction: var(--snowui-frame-loop-motion-direction, normal);
    animation-fill-mode: both;
    animation-name: none;
    animation-play-state: var(--snowui-frame-loop-motion-play-state, running);
  }

  :global(
    :where(.snowui-snow-ui-logo[data-snow-ui-logo-cycle="active"])
      :where(.snowui-snow-ui-logo-color, .snowui-snow-ui-logo-star)
  ) {
    animation-name: snowui-snow-ui-logo-rotation;
  }

  :global(:where(.snowui-snow-ui-logo-color)) {
    --snowui-snow-ui-logo-angle-360: var(
      --snowui-snow-ui-logo-test-color-turn,
      360deg
    );
    animation-duration: calc(
      var(--snowui-frame-loop-motion-duration, 1s) *
        var(--snowui-snow-ui-logo-test-color-duration-factor, 10)
    );
  }

  :global(:where(.snowui-snow-ui-logo-star)) {
    --snowui-snow-ui-logo-angle-360: var(
      --snowui-snow-ui-logo-test-asterisk-turn,
      360deg
    );
    animation-duration: calc(
      var(--snowui-frame-loop-motion-duration, 1s) *
        var(--snowui-snow-ui-logo-test-asterisk-duration-factor, 5)
    );
  }

  @keyframes snowui-snow-ui-logo-rotation {
    0% {
      transform: rotate(var(--snowui-snow-ui-logo-rest-angle));
    }
    100% {
      transform: rotate(
        calc(
          var(--snowui-snow-ui-logo-rest-angle) +
            var(--snowui-snow-ui-logo-angle-360)
        )
      );
    }
  }

  @media (prefers-reduced-motion: reduce) {
    :global(:where(.snowui-snow-ui-logo-color)),
    :global(:where(.snowui-snow-ui-logo-star)) {
      animation: none;
    }
  }
</style>
