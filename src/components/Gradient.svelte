<!--
  Gradient 矢量渐变组件
  v2.10.0

  职责：以可缩放 SVG 矢量绘制 Workshop Frame 200 的六种固定渐变视觉，并让四个有色图层持续柔和形变。
  文档：./Gradient.md
-->

<script module lang="ts">
    export type GradientVariant =
        | "blue"
        | "cyan"
        | "green"
        | "red"
        | "orange"
        | "purple";

    type GradientPalette = {
        background: string;
        vector4: string;
        vector3: string;
        subtract: string;
        subtract2: string;
        center: string;
    };

    const GRADIENT_PALETTES: Record<GradientVariant, GradientPalette> = {
        blue: {
            background: "#290082",
            vector4: "#58B7FF",
            vector3: "#6560FF",
            subtract: "#3AF2FC",
            subtract2: "#D4E6FE",
            center: "#6560FF",
        },
        cyan: {
            background: "#0B005A",
            vector4: "#5BE4FF",
            vector3: "#00A5BE",
            subtract: "#31FF83",
            subtract2: "#D4FEEF",
            center: "#00A5BE",
        },
        green: {
            background: "#000A4E",
            vector4: "#3DE680",
            vector3: "#16B335",
            subtract: "#C6F94F",
            subtract2: "#DFFED4",
            center: "#16B335",
        },
        red: {
            background: "#320061",
            vector4: "#FF7CB0",
            vector3: "#FC3551",
            subtract: "#F9E84F",
            subtract2: "#FED4D5",
            center: "#FC3551",
        },
        orange: {
            background: "#EC2300",
            vector4: "#FFC654",
            vector3: "#FF6C04",
            subtract: "#FF14AD",
            subtract2: "#FEF0D4",
            center: "#FF6C04",
        },
        purple: {
            background: "#1E0069",
            vector4: "#C6BAFF",
            vector3: "#F935FC",
            subtract: "#FFF78E",
            subtract2: "#FED4F5",
            center: "#F935FC",
        },
    };

    function createStaticGradientSource(palette: GradientPalette) {
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 360" preserveAspectRatio="none"><defs><filter id="v4" x="-245.611" y="-286.49" width="921.128" height="796.487" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="b"/><feBlend mode="normal" in="SourceGraphic" in2="b" result="s"/><feGaussianBlur stdDeviation="60"/></filter><filter id="v3" x="-29.5047" y="-133.435" width="624.294" height="621.927" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="b"/><feBlend mode="normal" in="SourceGraphic" in2="b" result="s"/><feGaussianBlur stdDeviation="60"/></filter><filter id="s1" x="-16.1127" y="-99.2028" width="555.729" height="639.235" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="b"/><feBlend mode="normal" in="SourceGraphic" in2="b" result="s"/><feGaussianBlur stdDeviation="40"/></filter><filter id="s2" x="-93.4444" y="-230.518" width="734.724" height="616.471" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="b"/><feBlend mode="normal" in="SourceGraphic" in2="b" result="s"/><feGaussianBlur stdDeviation="50"/></filter><clipPath id="c"><rect width="360" height="360"/></clipPath></defs><g clip-path="url(#c)"><rect width="360" height="360" fill="${palette.background}"/><g filter="url(#v4)"><ellipse cx="214.952" cy="111.754" rx="384.575" ry="213.162" transform="rotate(-146.037 214.952 111.754)" fill="${palette.vector4}"/></g><g filter="url(#v3)"><ellipse cx="282.642" cy="177.528" rx="223.026" ry="153.731" transform="rotate(-135.496 282.642 177.528)" fill="${palette.vector3}"/></g><g filter="url(#s1)"><path d="M63.8873 -19.2028C116.398 1.25526 169.035 25.0829 221.278 52.3178C285.966 86.04 346.709 123.243 403 163.081C584.414 291.473 271.178 628.302 278.61 357.5C282.932 200.002 197.822 55.4726 63.8873 -19.2028Z" fill="${palette.subtract}"/></g><g filter="url(#s2)"><path d="M417.77 -97.6118C594.82 20.5018 571.194 414.723 412.576 243.5C361.565 188.436 300.326 136.413 230.397 90.6631C173.62 53.5181 115.35 23.2776 57.5 0.00434098C-138.842 -78.9842 286.515 -185.174 417.77 -97.6118Z" fill="${palette.subtract2}"/></g></g></svg>`;
        return `data:image/svg+xml,${encodeURIComponent(svg)}`;
    }

    const STATIC_GRADIENT_SOURCES = Object.fromEntries(
        Object.entries(GRADIENT_PALETTES).map(([variant, palette]) => [
            variant,
            createStaticGradientSource(palette),
        ]),
    ) as Record<GradientVariant, string>;

    const GRADIENT_VARIANTS = Object.keys(
        GRADIENT_PALETTES,
    ) as GradientVariant[];

    function resolveSeedVariant(seed: string | number | undefined) {
        const normalizedSeed = String(seed ?? "").trim().toLowerCase();
        if (GRADIENT_VARIANTS.includes(normalizedSeed as GradientVariant)) {
            return normalizedSeed as GradientVariant;
        }

        let hash = 0;
        for (let index = 0; index < normalizedSeed.length; index += 1) {
            hash = (hash * 31 + normalizedSeed.charCodeAt(index)) | 0;
        }
        return (
            GRADIENT_VARIANTS[Math.abs(hash) % GRADIENT_VARIANTS.length] ??
            "blue"
        );
    }

    function hashString(value: string) {
        let hash = 2166136261;
        for (let index = 0; index < value.length; index += 1) {
            hash ^= value.charCodeAt(index);
            hash = Math.imul(hash, 16777619);
        }
        return hash >>> 0;
    }

    function resolveAvatarColorCycle(
        currentVariant: GradientVariant,
        seed: string | number | undefined,
        instanceId: string,
    ) {
        const variants = GRADIENT_VARIANTS.filter(
            (candidate) => candidate !== currentVariant,
        );
        let state = hashString(`${String(seed ?? currentVariant)}:${instanceId}`);

        for (let index = variants.length - 1; index > 0; index -= 1) {
            state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
            const targetIndex = state % (index + 1);
            [variants[index], variants[targetIndex]] = [
                variants[targetIndex],
                variants[index],
            ];
        }

        return variants;
    }
</script>

<script lang="ts">
    import { onDestroy } from "svelte";
    import Frame, { type FrameProps } from "./Frame.svelte";
    import { getSize } from "../context";

    interface Props
        extends Omit<
            FrameProps,
            | "children"
            | "size"
            | "width"
            | "height"
            | "radius"
            | "enableDefaultMotion"
        > {
        variant?: GradientVariant;
        seed?: string | number;
        size?: number | string;
        width?: number | string;
        height?: number | string;
        radius?: number | string;
        motion?: boolean;
        decorative?: boolean;
        [key: string]: any;
    }

    let {
        variant = undefined,
        seed = undefined,
        size = undefined,
        width = undefined,
        height = undefined,
        radius = undefined,
        motion = undefined,
        decorative = true,
        role = undefined,
        "aria-label": ariaLabel = undefined,
        class: className = "",
        style: userStyle = "",
        renderHints: userRenderHints = undefined,
        onpointerenter: userPointerEnter = undefined,
        onpointerleave: userPointerLeave = undefined,
        enableResponsive = false,
        enableContext = false,
        enableScaleObserver = false,
        ...rest
    }: Props = $props();

    const DEFAULT_SIZE = 360;
    const DEFAULT_RADIUS = "var(--radius-0)";
    const componentId = $props.id();
    const instanceId = `snowui-gradient-${componentId}`;
    const clipId = `${instanceId}-clip`;
    const vector4FilterId = `${instanceId}-vector-4-blur`;
    const vector3FilterId = `${instanceId}-vector-3-blur`;
    const subtractFilterId = `${instanceId}-subtract-blur`;
    const subtract2FilterId = `${instanceId}-subtract-2-blur`;

    getSize();

    function toCssLength(value: number | string): string {
        return typeof value === "number" ? `${value}px` : value;
    }

    const resolvedWidth = $derived(
        toCssLength(size ?? width ?? DEFAULT_SIZE),
    );
    const resolvedHeight = $derived(
        toCssLength(size ?? height ?? DEFAULT_SIZE),
    );
    const resolvedRadius = $derived(
        radius === undefined ? DEFAULT_RADIUS : toCssLength(radius),
    );
    const isAvatarVariant = $derived(rest.as === "avatar-image");
    const motionEnabled = $derived(motion ?? !isAvatarVariant);
    const resolvedVariant = $derived(
        variant ?? (isAvatarVariant ? resolveSeedVariant(seed) : "blue"),
    );
    const palette = $derived(
        GRADIENT_PALETTES[resolvedVariant] ?? GRADIENT_PALETTES.blue,
    );
    const staticAvatarSource = $derived(
        STATIC_GRADIENT_SOURCES[resolvedVariant] ??
            STATIC_GRADIENT_SOURCES.blue,
    );
    const avatarColorCycle = $derived(
        isAvatarVariant
            ? resolveAvatarColorCycle(resolvedVariant, seed, instanceId)
            : [],
    );
    const gradientStyle = $derived(
        [
            `--snowui-gradient-width: ${resolvedWidth}`,
            `--snowui-gradient-height: ${resolvedHeight}`,
            `--snowui-gradient-radius: ${resolvedRadius}`,
            userStyle,
        ]
            .filter(Boolean)
            .join("; "),
    );
    const gradientRenderHints = $derived({
        variant: userRenderHints?.variant ?? "rect",
        width: userRenderHints?.width ?? resolvedWidth,
        height: userRenderHints?.height ?? resolvedHeight,
        radius: userRenderHints?.radius ?? resolvedRadius,
    });

    let avatarOverlayMounted = $state(false);
    let avatarOverlayReady = $state(false);
    let avatarOverlayFrame: number | undefined;
    let avatarOverlayUnmountTimer: ReturnType<typeof setTimeout> | undefined;
    const hoverMotionMounted = $derived(
        isAvatarVariant && !motionEnabled && avatarOverlayMounted,
    );
    const motionRunning = $derived(motionEnabled || hoverMotionMounted);
    const renderLiveGradient = $derived(
        !isAvatarVariant || motionEnabled || avatarOverlayMounted,
    );

    function clearAvatarOverlaySchedule() {
        if (avatarOverlayFrame !== undefined) {
            cancelAnimationFrame(avatarOverlayFrame);
            avatarOverlayFrame = undefined;
        }
        if (avatarOverlayUnmountTimer !== undefined) {
            clearTimeout(avatarOverlayUnmountTimer);
            avatarOverlayUnmountTimer = undefined;
        }
    }

    function handleMouseEnter(event: MouseEvent) {
        if (
            isAvatarVariant &&
            !(event.currentTarget as HTMLElement).closest(
                ".snowui-disabled, [data-disabled='true'], :disabled",
            )
        ) {
            clearAvatarOverlaySchedule();
            avatarOverlayMounted = true;
            avatarOverlayReady = false;
            avatarOverlayFrame = requestAnimationFrame(() => {
                avatarOverlayReady = true;
                avatarOverlayFrame = undefined;
            });
        }
    }

    function handleMouseLeave() {
        if (isAvatarVariant) {
            if (avatarOverlayFrame !== undefined) {
                cancelAnimationFrame(avatarOverlayFrame);
                avatarOverlayFrame = undefined;
            }
            avatarOverlayReady = false;
            avatarOverlayUnmountTimer = setTimeout(() => {
                avatarOverlayMounted = false;
                avatarOverlayUnmountTimer = undefined;
            }, 550);
        }
    }

    onDestroy(clearAvatarOverlaySchedule);
</script>

<Frame
    enableAutoLayout={false}
    enableResponsive={enableResponsive}
    enableContext={enableContext}
    enableScaleObserver={enableScaleObserver}
    enableDefaultMotion={false}
    class={[
        "snowui-gradient",
        `snowui-gradient-${resolvedVariant}`,
        isAvatarVariant ? "snowui-gradient-avatar" : "",
        motionRunning ? "snowui-gradient-motion-enabled" : "",
        hoverMotionMounted ? "snowui-gradient-hover-motion-enabled" : "",
        className,
    ]
        .filter(Boolean)
        .join(" ")}
    data-variant={resolvedVariant}
    data-avatar={isAvatarVariant ? "true" : undefined}
    data-motion={motionEnabled ? "true" : "false"}
    data-avatar-overlay-ready={avatarOverlayReady ? "true" : undefined}
    style={gradientStyle}
    role={decorative ? undefined : (role ?? "img")}
    aria-label={decorative ? undefined : ariaLabel}
    aria-hidden={decorative ? "true" : undefined}
    renderHints={gradientRenderHints}
    onmouseenter={handleMouseEnter}
    onmouseleave={handleMouseLeave}
    onpointerenter={userPointerEnter}
    onpointerleave={userPointerLeave}
    {...rest}
>
    {#if isAvatarVariant && !motionEnabled}
        <img
            class="snowui-gradient-svg snowui-gradient-static-image"
            src={staticAvatarSource}
            alt=""
            decoding="async"
            draggable="false"
            aria-hidden="true"
        />
    {/if}
    {#if renderLiveGradient}
        <svg
        class={`snowui-gradient-svg ${hoverMotionMounted ? "snowui-gradient-hover-motion-svg" : ""}`}
        viewBox="0 0 360 360"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
        xmlns="http://www.w3.org/2000/svg"
    >
        <defs>
            <filter
                id={vector4FilterId}
                x="-245.611"
                y="-286.49"
                width="921.128"
                height="796.487"
                filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB"
            >
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="BackgroundImageFix"
                    result="shape"
                />
                <feGaussianBlur
                    stdDeviation="60"
                    result="effect1_foregroundBlur"
                />
            </filter>
            <filter
                id={vector3FilterId}
                x="-29.5047"
                y="-133.435"
                width="624.294"
                height="621.927"
                filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB"
            >
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="BackgroundImageFix"
                    result="shape"
                />
                <feGaussianBlur
                    stdDeviation="60"
                    result="effect1_foregroundBlur"
                />
            </filter>
            <filter
                id={subtractFilterId}
                x="-16.1127"
                y="-99.2028"
                width="555.729"
                height="639.235"
                filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB"
            >
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="BackgroundImageFix"
                    result="shape"
                />
                <feGaussianBlur
                    stdDeviation="40"
                    result="effect1_foregroundBlur"
                />
            </filter>
            <filter
                id={subtract2FilterId}
                x="-93.4444"
                y="-230.518"
                width="734.724"
                height="616.471"
                filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB"
            >
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="BackgroundImageFix"
                    result="shape"
                />
                <feGaussianBlur
                    stdDeviation="50"
                    result="effect1_foregroundBlur"
                />
            </filter>
            <clipPath id={clipId}>
                <rect width="360" height="360" />
            </clipPath>
        </defs>

        <g clip-path={`url(#${clipId})`}>
            <rect width="360" height="360" fill={palette.background} />
            <g
                class="snowui-gradient-layer snowui-gradient-layer-vector-4"
                filter={`url(#${vector4FilterId})`}
            >
                <ellipse
                    cx="214.952"
                    cy="111.754"
                    rx="384.575"
                    ry="213.162"
                    transform="rotate(-146.037 214.952 111.754)"
                    fill={palette.vector4}
                />
            </g>
            <g
                class="snowui-gradient-layer snowui-gradient-layer-vector-3"
                filter={`url(#${vector3FilterId})`}
            >
                <ellipse
                    cx="282.642"
                    cy="177.528"
                    rx="223.026"
                    ry="153.731"
                    transform="rotate(-135.496 282.642 177.528)"
                    fill={palette.vector3}
                />
            </g>
            <g
                class="snowui-gradient-layer snowui-gradient-layer-subtract"
                filter={`url(#${subtractFilterId})`}
            >
                <path
                    d="M63.8873 -19.2028C116.398 1.25526 169.035 25.0829 221.278 52.3178C285.966 86.04 346.709 123.243 403 163.081C584.414 291.473 271.178 628.302 278.61 357.5C282.932 200.002 197.822 55.4726 63.8873 -19.2028Z"
                    fill={palette.subtract}
                />
            </g>
            <g
                class="snowui-gradient-layer snowui-gradient-layer-subtract-2"
                filter={`url(#${subtract2FilterId})`}
            >
                <path
                    d="M417.77 -97.6118C594.82 20.5018 571.194 414.723 412.576 243.5C361.565 188.436 300.326 136.413 230.397 90.6631C173.62 53.5181 115.35 23.2776 57.5 0.00434098C-138.842 -78.9842 286.515 -185.174 417.77 -97.6118Z"
                    fill={palette.subtract2}
                />
            </g>
        </g>
        </svg>
    {/if}
    {#if isAvatarVariant && avatarOverlayMounted}
        <div class="snowui-gradient-avatar-overlay" aria-hidden="true">
            {#each avatarColorCycle as targetVariant, index}
                {#each [0, 1] as overlayLayer}
                    <div
                        class="snowui-gradient-avatar-color-pass"
                        data-color={targetVariant}
                        data-overlay-layer={overlayLayer + 1}
                    >
                        <div
                            class="snowui-gradient-avatar-color"
                            data-color={targetVariant}
                            style={`--snowui-gradient-avatar-color-index: ${index}; --snowui-gradient-avatar-color: ${GRADIENT_PALETTES[targetVariant].center}`}
                        ></div>
                    </div>
                {/each}
            {/each}
        </div>
    {/if}
</Frame>

<style>
    :global(:where(.snowui-gradient)) {
        position: relative;
        display: inline-flex;
        flex: none;
        width: var(
            --snowui-gradient-width-override,
            var(
                --snowui-gradient-width,
                calc(var(--size-4) * 45 / 2)
            )
        );
        height: var(
            --snowui-gradient-height-override,
            var(
                --snowui-gradient-height,
                calc(var(--size-4) * 45 / 2)
            )
        );
        overflow: hidden;
        border-radius: var(
            --snowui-gradient-radius-override,
            var(--snowui-gradient-radius, var(--radius-0))
        );
        /*
         * 带 SVG filter 的子树可能被浏览器单独合成，直接使用
         * border-radius + overflow 会在最外圈露出一条底色采样线。
         * 纯 alpha mask 强制圆角与滤镜在同一合成层完成裁切。
         */
        -webkit-mask-image: linear-gradient(black, black);
        mask-image: linear-gradient(black, black);
        box-sizing: border-box;
        isolation: isolate;
    }

    :global(:where(.snowui-gradient-svg)) {
        display: block;
        width: 100%;
        height: 100%;
        pointer-events: none;
        user-select: none;
    }

    :global(:where(.snowui-gradient-static-image)) {
        object-fit: fill;
    }

    :global(:where(.snowui-gradient-hover-motion-svg)) {
        position: absolute;
        inset: 0;
        opacity: 0;
        transition: opacity
            var(--snowui-gradient-avatar-hover-exit-duration, 0.5s)
            cubic-bezier(0.4, 0, 0.2, 1);
    }

    :global(
            :where(.snowui-gradient-hover-motion-enabled[data-avatar-overlay-ready="true"])
                :where(.snowui-gradient-hover-motion-svg)
        ) {
        opacity: 1;
        transition-duration: var(
            --snowui-gradient-avatar-hover-entry-duration,
            1s
        );
    }

    :global(:where(.snowui-gradient-avatar)) {
        contain: layout paint style;
        content-visibility: auto;
    }

    :global(:where(.snowui-gradient-layer)) {
        transform-box: view-box;
        transform-origin: center;
    }

    :global(
            :where(.snowui-gradient-motion-enabled)
                :where(.snowui-gradient-layer)
        ) {
        will-change: transform;
        animation-duration: var(
            --snowui-gradient-motion-duration-override,
            var(--snowui-gradient-motion-duration, 15s)
        );
        animation-timing-function: var(
            --snowui-gradient-motion-easing-override,
            cubic-bezier(1, 1, 1, 1)
        );
        animation-iteration-count: infinite;
    }

    :global(
            :where(.snowui-gradient-motion-enabled)
                :where(.snowui-gradient-layer-vector-4)
        ) {
        animation-name: snowui-gradient-vector-4-motion;
    }

    :global(
            :where(.snowui-gradient-motion-enabled)
                :where(.snowui-gradient-layer-vector-3)
        ) {
        animation-name: snowui-gradient-vector-3-motion;
    }

    :global(
            :where(.snowui-gradient-motion-enabled)
                :where(.snowui-gradient-layer-subtract)
        ) {
        animation-name: snowui-gradient-subtract-motion;
    }

    :global(
            :where(.snowui-gradient-motion-enabled)
                :where(.snowui-gradient-layer-subtract-2)
        ) {
        animation-name: snowui-gradient-subtract-2-motion;
    }

    :global(
            :where(.snowui-gradient-hover-motion-enabled)
                :where(.snowui-gradient-layer)
        ) {
        animation-timing-function: var(
            --snowui-gradient-avatar-hover-motion-easing-override,
            linear
        );
    }

    :global(
            :where(.snowui-gradient-hover-motion-enabled)
                :where(.snowui-gradient-layer-vector-4)
        ) {
        animation-duration: var(
            --snowui-gradient-avatar-hover-motion-vector-4-duration-override,
            6.4s
        );
        animation-delay: -1.7s;
    }

    :global(
            :where(.snowui-gradient-hover-motion-enabled)
                :where(.snowui-gradient-layer-vector-3)
        ) {
        animation-duration: var(
            --snowui-gradient-avatar-hover-motion-vector-3-duration-override,
            7.2s
        );
        animation-delay: -4.1s;
    }

    :global(
            :where(.snowui-gradient-hover-motion-enabled)
                :where(.snowui-gradient-layer-subtract)
        ) {
        animation-duration: var(
            --snowui-gradient-avatar-hover-motion-subtract-duration-override,
            8.4s
        );
        animation-delay: -2.8s;
    }

    :global(
            :where(.snowui-gradient-hover-motion-enabled)
                :where(.snowui-gradient-layer-subtract-2)
        ) {
        animation-duration: var(
            --snowui-gradient-avatar-hover-motion-subtract-2-duration-override,
            6.8s
        );
        animation-delay: -5.3s;
    }

    :global(:where(.snowui-gradient-hover-motion-enabled)) {
        --snowui-gradient-motion-vector-4-x-amplitude-override: 18%;
        --snowui-gradient-motion-vector-4-y-amplitude-override: 18%;
        --snowui-gradient-motion-vector-4-rotate-amplitude-override: 30deg;
        --snowui-gradient-motion-vector-3-x-amplitude-override: 18%;
        --snowui-gradient-motion-vector-3-y-amplitude-override: 18%;
        --snowui-gradient-motion-vector-3-scale-amplitude-override: 0.32;
        --snowui-gradient-motion-subtract-x-amplitude-override: 18%;
        --snowui-gradient-motion-subtract-y-amplitude-override: 18%;
        --snowui-gradient-motion-subtract-deform-amplitude-override: 0.32;
        --snowui-gradient-motion-subtract-2-x-amplitude-override: 18%;
        --snowui-gradient-motion-subtract-2-y-amplitude-override: 18%;
        --snowui-gradient-motion-subtract-2-rotate-amplitude-override: 30deg;
        --snowui-gradient-motion-subtract-2-scale-amplitude-override: 0.32;
    }

    :global(:where(.snowui-gradient-avatar-overlay)) {
        position: absolute;
        inset: 0;
        overflow: hidden;
        border-radius: inherit;
        pointer-events: none;
    }

    :global(:where(.snowui-gradient-avatar-color-pass)) {
        position: absolute;
        inset: 0;
        opacity: 0;
        mix-blend-mode: overlay;
        transition: opacity
            var(--snowui-gradient-avatar-hover-exit-duration, 0.5s)
            var(
                --snowui-gradient-avatar-hover-entry-easing,
                cubic-bezier(0.4, 0, 0.2, 1)
            );
        will-change: opacity;
    }

    :global(:where(.snowui-gradient-avatar-color)) {
        position: absolute;
        inset: 0;
        opacity: 0;
        background: var(--snowui-gradient-avatar-color);
        animation: snowui-gradient-avatar-color-cycle
            var(--snowui-gradient-avatar-hover-color-duration, 10s)
            linear infinite;
        animation-delay: calc(
            var(--snowui-gradient-avatar-color-index) * -2s
        );
        animation-play-state: paused;
    }

    :global(
            .snowui-media-hoverable:hover:not(.snowui-disabled)
                .snowui-gradient-avatar[data-avatar-overlay-ready="true"]
                .snowui-gradient-avatar-color-pass
        ) {
        opacity: 1;
        transition-duration: var(
            --snowui-gradient-avatar-hover-entry-duration,
            1s
        );
    }

    :global(
            .snowui-media-hoverable:hover:not(.snowui-disabled)
                .snowui-gradient-avatar[data-avatar-overlay-ready="true"]
                .snowui-gradient-avatar-color
        ) {
        animation-play-state: running;
    }

    @keyframes snowui-gradient-avatar-color-cycle {
        0%,
        10% {
            opacity: var(
                --snowui-gradient-avatar-hover-color-opacity,
                0.58
            );
        }

        20%,
        90% {
            opacity: 0;
        }

        100% {
            opacity: var(
                --snowui-gradient-avatar-hover-color-opacity,
                0.58
            );
        }
    }

    @keyframes snowui-gradient-vector-4-motion {
        0%,
        100% {
            transform: translate3d(
                    calc(
                        0% -
                            var(
                                --snowui-gradient-motion-vector-4-x-amplitude-override,
                                12%
                            )
                    ),
                    calc(
                        0% -
                            var(
                                --snowui-gradient-motion-vector-4-y-amplitude-override,
                                12%
                            )
                    ),
                    0
                )
                rotate(
                    calc(
                        0deg -
                            var(
                                --snowui-gradient-motion-vector-4-rotate-amplitude-override,
                                20deg
                            )
                    )
                );
        }

        42% {
            transform: translate3d(
                    var(
                        --snowui-gradient-motion-vector-4-x-amplitude-override,
                        12%
                    ),
                    var(
                        --snowui-gradient-motion-vector-4-y-amplitude-override,
                        12%
                    ),
                    0
                )
                rotate(
                    var(
                        --snowui-gradient-motion-vector-4-rotate-amplitude-override,
                        20deg
                    )
                );
        }

        73% {
            transform: translate3d(
                    calc(
                        0% -
                            var(
                                --snowui-gradient-motion-vector-4-x-amplitude-override,
                                12%
                            )
                    ),
                    var(
                        --snowui-gradient-motion-vector-4-y-amplitude-override,
                        12%
                    ),
                    0
                )
                rotate(0deg);
        }
    }

    @keyframes snowui-gradient-vector-3-motion {
        0%,
        100% {
            transform: translate3d(
                    var(
                        --snowui-gradient-motion-vector-3-x-amplitude-override,
                        12%
                    ),
                    calc(
                        0% -
                            var(
                                --snowui-gradient-motion-vector-3-y-amplitude-override,
                                12%
                            )
                    ),
                    0
                )
                scale(1);
        }

        36% {
            transform: translate3d(
                    calc(
                        0% -
                            var(
                                --snowui-gradient-motion-vector-3-x-amplitude-override,
                                12%
                            )
                    ),
                    var(
                        --snowui-gradient-motion-vector-3-y-amplitude-override,
                        12%
                    ),
                    0
                )
                scale(
                    calc(
                        1 +
                            var(
                                --snowui-gradient-motion-vector-3-scale-amplitude-override,
                                0.25
                            )
                    )
                );
        }

        68% {
            transform: translate3d(
                    var(
                        --snowui-gradient-motion-vector-3-x-amplitude-override,
                        12%
                    ),
                    var(
                        --snowui-gradient-motion-vector-3-y-amplitude-override,
                        12%
                    ),
                    0
                )
                scale(
                    calc(
                        1 -
                            var(
                                --snowui-gradient-motion-vector-3-scale-amplitude-override,
                                0.25
                            )
                    )
                );
        }
    }

    @keyframes snowui-gradient-subtract-motion {
        0%,
        100% {
            transform: translate3d(
                    calc(
                        0% -
                            var(
                                --snowui-gradient-motion-subtract-x-amplitude-override,
                                12%
                            )
                    ),
                    var(
                        --snowui-gradient-motion-subtract-y-amplitude-override,
                        12%
                    ),
                    0
                )
                scaleX(
                    calc(
                        1 +
                            var(
                                --snowui-gradient-motion-subtract-deform-amplitude-override,
                                0.25
                            )
                    )
                )
                scaleY(
                    calc(
                        1 -
                            var(
                                --snowui-gradient-motion-subtract-deform-amplitude-override,
                                0.25
                            )
                    )
                );
        }

        48% {
            transform: translate3d(
                    var(
                        --snowui-gradient-motion-subtract-x-amplitude-override,
                        12%
                    ),
                    calc(
                        0% -
                            var(
                                --snowui-gradient-motion-subtract-y-amplitude-override,
                                12%
                            )
                    ),
                    0
                )
                scaleX(
                    calc(
                        1 -
                            var(
                                --snowui-gradient-motion-subtract-deform-amplitude-override,
                                0.25
                            )
                    )
                )
                scaleY(
                    calc(
                        1 +
                            var(
                                --snowui-gradient-motion-subtract-deform-amplitude-override,
                                0.25
                            )
                    )
                );
        }

        76% {
            transform: translate3d(
                    calc(
                        0% -
                            var(
                                --snowui-gradient-motion-subtract-x-amplitude-override,
                                12%
                            )
                    ),
                    calc(
                        0% -
                            var(
                                --snowui-gradient-motion-subtract-y-amplitude-override,
                                12%
                            )
                    ),
                    0
                )
                scaleX(1)
                scaleY(1);
        }
    }

    @keyframes snowui-gradient-subtract-2-motion {
        0%,
        100% {
            transform: translate3d(
                    var(
                        --snowui-gradient-motion-subtract-2-x-amplitude-override,
                        12%
                    ),
                    var(
                        --snowui-gradient-motion-subtract-2-y-amplitude-override,
                        12%
                    ),
                    0
                )
                rotate(
                    var(
                        --snowui-gradient-motion-subtract-2-rotate-amplitude-override,
                        20deg
                    )
                )
                scale(
                    calc(
                        1 +
                            var(
                                --snowui-gradient-motion-subtract-2-scale-amplitude-override,
                                0.25
                            )
                    )
                );
        }

        31% {
            transform: translate3d(
                    calc(
                        0% -
                            var(
                                --snowui-gradient-motion-subtract-2-x-amplitude-override,
                                12%
                            )
                    ),
                    calc(
                        0% -
                            var(
                                --snowui-gradient-motion-subtract-2-y-amplitude-override,
                                12%
                            )
                    ),
                    0
                )
                rotate(
                    calc(
                        0deg -
                            var(
                                --snowui-gradient-motion-subtract-2-rotate-amplitude-override,
                                20deg
                            )
                    )
                )
                scale(
                    calc(
                        1 -
                            var(
                                --snowui-gradient-motion-subtract-2-scale-amplitude-override,
                                0.25
                            )
                    )
                );
        }

        64% {
            transform: translate3d(
                    var(
                        --snowui-gradient-motion-subtract-2-x-amplitude-override,
                        12%
                    ),
                    calc(
                        0% -
                            var(
                                --snowui-gradient-motion-subtract-2-y-amplitude-override,
                                12%
                            )
                    ),
                    0
                )
                rotate(0deg)
                scale(1);
        }
    }

    @media (prefers-reduced-motion: reduce) {
        :global(:where(.snowui-gradient-layer)) {
            animation: none;
            transform: none;
            will-change: auto;
        }

        :global(:where(.snowui-gradient-avatar-overlay)) {
            will-change: auto;
        }

        :global(:where(.snowui-gradient-avatar-color-pass)) {
            transition: none;
            will-change: auto;
        }

        :global(:where(.snowui-gradient-avatar-color)) {
            animation: none;
            opacity: 0;
            will-change: auto;
        }

        :global(
                :where(
                        .snowui-gradient-avatar-color-pass:nth-child(-n + 2)
                            .snowui-gradient-avatar-color
                    )
            ) {
            opacity: var(
                --snowui-gradient-avatar-hover-color-opacity,
                0.58
            );
        }
    }
</style>
