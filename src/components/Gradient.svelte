<!-- SnowUI source notice | LICENSE 2.2.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 -->
<!--
  Gradient 矢量渐变组件
  v2.13.2

  职责：以可缩放 SVG 矢量绘制 Workshop Frame 200 的六种固定渐变视觉，并以预栅格图层保持四层柔和形变。
  文档：./Gradient.md
-->

<script module lang="ts">
  // SnowUI 许可入口：首次阅读源码请先读 ../../LICENSE；访问文件不代表获得修改或移植权，官方维护授权及同任务去重见该文件。
    import blueStaticSource from "../assets/gradient-avatar/blue.svg?url";
    import cyanStaticSource from "../assets/gradient-avatar/cyan.svg?url";
    import greenStaticSource from "../assets/gradient-avatar/green.svg?url";
    import redStaticSource from "../assets/gradient-avatar/red.svg?url";
    import orangeStaticSource from "../assets/gradient-avatar/orange.svg?url";
    import purpleStaticSource from "../assets/gradient-avatar/purple.svg?url";

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

    type GradientMotionLayer =
        | "vector-4"
        | "vector-3"
        | "subtract"
        | "subtract-2";

    type GradientMotionLayerSource = {
        name: GradientMotionLayer;
        source: string;
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

    const STATIC_GRADIENT_SOURCES: Record<GradientVariant, string> = {
        blue: blueStaticSource,
        cyan: cyanStaticSource,
        green: greenStaticSource,
        red: redStaticSource,
        orange: orangeStaticSource,
        purple: purpleStaticSource,
    };

    const GRADIENT_VARIANTS = Object.keys(
        GRADIENT_PALETTES,
    ) as GradientVariant[];

    const GRADIENT_MOTION_LAYER_SOURCE_CACHE = new Map<
        string,
        GradientMotionLayerSource[]
    >();
    const GRADIENT_VISIBILITY_CALLBACKS = new WeakMap<
        Element,
        (visible: boolean) => void
    >();
    let gradientVisibilityObserver: IntersectionObserver | undefined;

    function observeGradientVisibility(
        node: Element,
        onVisibilityChange: (visible: boolean) => void,
    ) {
        if (typeof IntersectionObserver === "undefined") {
            onVisibilityChange(true);
            return () => {};
        }

        gradientVisibilityObserver ??= new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    GRADIENT_VISIBILITY_CALLBACKS.get(entry.target)?.(
                        entry.isIntersecting,
                    );
                }
            },
            { rootMargin: "128px" },
        );
        GRADIENT_VISIBILITY_CALLBACKS.set(node, onVisibilityChange);
        gradientVisibilityObserver.observe(node);

        return () => {
            gradientVisibilityObserver?.unobserve(node);
            GRADIENT_VISIBILITY_CALLBACKS.delete(node);
        };
    }

    function createGradientMotionLayerSource(
        name: GradientMotionLayer,
        palette: GradientPalette,
        canvasSize: 600 | 720 | 800,
    ) {
        const definitions: Record<
            GradientMotionLayer,
            { blur: number; shape: string }
        > = {
            "vector-4": {
                blur: 60,
                shape: `<ellipse cx="214.952" cy="111.754" rx="384.575" ry="213.162" transform="rotate(-146.037 214.952 111.754)" fill="${palette.vector4}"/>`,
            },
            "vector-3": {
                blur: 60,
                shape: `<ellipse cx="282.642" cy="177.528" rx="223.026" ry="153.731" transform="rotate(-135.496 282.642 177.528)" fill="${palette.vector3}"/>`,
            },
            subtract: {
                blur: 40,
                shape: `<path d="M63.8873 -19.2028C116.398 1.25526 169.035 25.0829 221.278 52.3178C285.966 86.04 346.709 123.243 403 163.081C584.414 291.473 271.178 628.302 278.61 357.5C282.932 200.002 197.822 55.4726 63.8873 -19.2028Z" fill="${palette.subtract}"/>`,
            },
            "subtract-2": {
                blur: 50,
                shape: `<path d="M417.77 -97.6118C594.82 20.5018 571.194 414.723 412.576 243.5C361.565 188.436 300.326 136.413 230.397 90.6631C173.62 53.5181 115.35 23.2776 57.5 0.00434098C-138.842 -78.9842 286.515 -185.174 417.77 -97.6118Z" fill="${palette.subtract2}"/>`,
            },
        };
        const definition = definitions[name];
        const canvasStart = (360 - canvasSize) / 2;
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${canvasStart} ${canvasStart} ${canvasSize} ${canvasSize}" preserveAspectRatio="none"><defs><filter id="blur" x="${canvasStart}" y="${canvasStart}" width="${canvasSize}" height="${canvasSize}" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="${definition.blur}"/></filter></defs><g filter="url(#blur)">${definition.shape}</g></svg>`;

        return `data:image/svg+xml,${encodeURIComponent(svg)}`;
    }

    function getGradientMotionLayerSources(
        variant: GradientVariant,
        avatar: boolean,
    ) {
        const cacheKey = `${variant}:${avatar ? "avatar" : "default"}`;
        const cached = GRADIENT_MOTION_LAYER_SOURCE_CACHE.get(cacheKey);
        if (cached) return cached;

        const palette = GRADIENT_PALETTES[variant];
        const sources = (
            [
                "vector-4",
                "vector-3",
                "subtract",
                "subtract-2",
            ] as GradientMotionLayer[]
        ).map((name) => ({
            name,
            source: createGradientMotionLayerSource(
                name,
                palette,
                avatar ? 720 : name === "subtract-2" ? 800 : 600,
            ),
        }));
        GRADIENT_MOTION_LAYER_SOURCE_CACHE.set(cacheKey, sources);
        return sources;
    }

    export function resolveGradientVariant(
        seed: string | number | undefined,
    ) {
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

    export function getStaticGradientSource(
        seed: string | number | undefined,
    ) {
        return STATIC_GRADIENT_SOURCES[resolveGradientVariant(seed)];
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
    import { onDestroy, untrack } from "svelte";
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
        /** Avatar 内部按需挂载协议；外部 Gradient 不使用。 */
        avatarHoverActive?: boolean;
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
        avatarHoverActive = undefined,
        decorative = true,
        role = undefined,
        "aria-label": ariaLabel = undefined,
        class: className = "",
        style: userStyle = "",
        renderHints: userRenderHints = undefined,
        onpointerenter: userPointerEnter = undefined,
        onpointerleave: userPointerLeave = undefined,
        use: userUse = [],
        enableResponsive = false,
        enableContext = false,
        enableScaleObserver = false,
        ...rest
    }: Props = $props();

    const DEFAULT_SIZE = 360;
    const DEFAULT_RADIUS = "var(--radius-0)";
    const componentId = $props.id();
    const instanceId = `snowui-gradient-${componentId}`;
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
        variant ?? (isAvatarVariant ? resolveGradientVariant(seed) : "blue"),
    );
    const palette = $derived(
        GRADIENT_PALETTES[resolvedVariant] ?? GRADIENT_PALETTES.blue,
    );
    const staticAvatarSource = $derived(
        STATIC_GRADIENT_SOURCES[resolvedVariant] ??
            STATIC_GRADIENT_SOURCES.blue,
    );
    const motionLayerSources = $derived(
        getGradientMotionLayerSources(resolvedVariant, isAvatarVariant),
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
            `--snowui-gradient-clip: ${resolvedRadius === "inherit" ? "border-box" : resolvedRadius === "50%" ? "ellipse(50% 50% at 50% 50%)" : "inset(0 round var(--snowui-gradient-radius-override, var(--snowui-gradient-radius)))"}`,
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
    let avatarMotionProfile = $state(0);
    let motionVisible = $state(true);
    let avatarOverlayFrame: number | undefined;
    let avatarOverlayUnmountTimer: ReturnType<typeof setTimeout> | undefined;
    const hoverMotionMounted = $derived(
        isAvatarVariant && !motionEnabled && avatarOverlayMounted,
    );
    const motionRunning = $derived(motionEnabled || hoverMotionMounted);
    const renderLiveGradient = $derived(
        !isAvatarVariant || motionEnabled || avatarOverlayMounted,
    );
    const controlledAvatarHover = $derived(
        isAvatarVariant && avatarHoverActive !== undefined,
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

    function activateAvatarOverlay() {
        if (isAvatarVariant) {
            clearAvatarOverlaySchedule();
            const nextProfile = Math.floor(Math.random() * 5);
            avatarMotionProfile =
                nextProfile >= avatarMotionProfile
                    ? nextProfile + 1
                    : nextProfile;
            avatarOverlayMounted = true;
            avatarOverlayReady = false;
            avatarOverlayFrame = requestAnimationFrame(() => {
                avatarOverlayReady = true;
                avatarOverlayFrame = undefined;
            });
        }
    }

    function deactivateAvatarOverlay() {
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

    function handleMouseEnter(event: MouseEvent) {
        if (
            !controlledAvatarHover &&
            isAvatarVariant &&
            !(event.currentTarget as HTMLElement).closest(
                ".snowui-disabled, [data-disabled='true'], :disabled",
            )
        ) {
            activateAvatarOverlay();
        }
    }

    function handleMouseLeave() {
        if (!controlledAvatarHover) deactivateAvatarOverlay();
    }

    function connectGradientVisibility(node: HTMLElement) {
        return {
            destroy: observeGradientVisibility(node, (visible) => {
                motionVisible = visible;
            }),
        };
    }

    $effect(() => {
        const controlled = controlledAvatarHover;
        const active = avatarHoverActive;
        if (!controlled) return;

        untrack(() => {
            if (active) activateAvatarOverlay();
            else deactivateAvatarOverlay();
        });
    });

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
        !isAvatarVariant ? "snowui-rounded-rectangle" : "",
        `snowui-gradient-${resolvedVariant}`,
        isAvatarVariant ? "snowui-gradient-avatar" : "",
        motionRunning ? "snowui-gradient-motion-enabled" : "",
        motionVisible ? "snowui-gradient-motion-visible" : "",
        hoverMotionMounted ? "snowui-gradient-hover-motion-enabled" : "",
        className,
    ]
        .filter(Boolean)
        .join(" ")}
    data-variant={resolvedVariant}
    data-avatar={isAvatarVariant ? "true" : undefined}
    data-motion={motionEnabled ? "true" : "false"}
    data-avatar-motion-profile={isAvatarVariant
        ? avatarMotionProfile
        : undefined}
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
    use={[connectGradientVisibility, ...userUse]}
    {...rest}
>
    {#if isAvatarVariant && !motionEnabled}
        <img
            class="snowui-gradient-svg snowui-gradient-static-image"
            src={staticAvatarSource}
            alt=""
            loading="lazy"
            decoding="async"
            fetchpriority="low"
            draggable="false"
            aria-hidden="true"
        />
    {/if}
    {#if renderLiveGradient}
        <div
            class={`snowui-gradient-live ${hoverMotionMounted ? "snowui-gradient-hover-motion-live" : ""}`}
            aria-hidden="true"
            style={`--snowui-gradient-background-internal: ${palette.background}`}
        >
            <!-- 先在设计画布中运动，再整体 Fill，避免长宽比放大旋转后的裁切缺口。 -->
            <svg class="snowui-gradient-motion-plane" viewBox="0 0 360 360" preserveAspectRatio="none" aria-hidden="true">
                <foreignObject width="360" height="360" overflow="visible">
                    {#each motionLayerSources as layer}
                        <div
                            class={`snowui-gradient-layer snowui-gradient-layer-${layer.name}`}
                        >
                            <img
                                class="snowui-gradient-layer-image"
                                src={layer.source}
                                alt=""
                                decoding="sync"
                                draggable="false"
                                aria-hidden="true"
                            />
                        </div>
                    {/each}
                </foreignObject>
            </svg>
        </div>
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

        border-radius: var(
            --snowui-gradient-radius-override,
            var(--snowui-gradient-radius, var(--radius-0))
        );
        /* 按实际 border-radius 统一裁切合成结果，包含 Avatar 继承的圆角。
         * alpha mask 保持图层整体合成，再由明确轮廓裁切。 */
        clip-path: var(--snowui-gradient-clip);
        -webkit-mask-image: linear-gradient(black, black);
        mask-image: linear-gradient(black, black);
        box-sizing: border-box;
        isolation: isolate;
        contain: layout paint style;
        content-visibility: auto;
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

    :global(:where(.snowui-gradient-live)) {
        position: absolute;
        inset: 0;
        background-color: var(--snowui-gradient-background-internal);
        pointer-events: none;
    }

    :global(:where(.snowui-gradient-hover-motion-live)) {
        opacity: 0;
        transition: opacity
            var(--snowui-gradient-avatar-hover-exit-duration, 0.5s)
            cubic-bezier(0.4, 0, 0.2, 1);
    }

    :global(
            :where(.snowui-gradient-hover-motion-enabled[data-avatar-overlay-ready="true"])
                :where(.snowui-gradient-hover-motion-live)
        ) {
        opacity: 1;
        transition-duration: var(
            --snowui-gradient-avatar-hover-entry-duration,
            1s
        );
    }

    :global(:where(.snowui-gradient-avatar)) {
        contain-intrinsic-size: var(--snowui-gradient-width)
            var(--snowui-gradient-height);
    }

    :global(:where(.snowui-gradient-motion-plane)) {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        overflow: visible;
        pointer-events: none;
    }

    :global(:where(.snowui-gradient-layer)) {
        position: absolute;
        inset: 0;
        transform-origin: center;
    }

    :global(:where(.snowui-gradient-layer-image)) {
        position: absolute;
        top: -33.333333%;
        left: -33.333333%;
        display: block;
        width: 166.666667%;
        max-width: none;
        height: 166.666667%;
        pointer-events: none;
        user-select: none;
    }

    :global(
            :where(.snowui-gradient-layer-subtract-2)
                :where(.snowui-gradient-layer-image)
        ) {
        top: -61.111111%;
        left: -61.111111%;
        width: 222.222222%;
        height: 222.222222%;
    }

    :global(
            :where(.snowui-gradient-avatar)
                :where(.snowui-gradient-layer-image)
        ) {
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
    }

    :global(
            :where(.snowui-gradient-motion-enabled)
                :where(.snowui-gradient-layer)
        ) {
        will-change: transform;
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
        animation-duration: var(
            --snowui-gradient-motion-duration-override,
            var(--snowui-gradient-motion-duration, 15s)
        );
        animation-timing-function: var(
            --snowui-gradient-motion-easing-override,
            steps(90, end)
        );
        animation-iteration-count: infinite;
    }

    :global(
            :where(
                    .snowui-gradient-motion-enabled:not(
                            .snowui-gradient-motion-visible
                        )
                )
                :where(.snowui-gradient-layer)
        ) {
        animation-play-state: paused;
        will-change: auto;
    }

    :global(
            :where(.snowui-gradient-motion-enabled)
                :where(.snowui-gradient-layer-vector-4)
        ) {
        --snowui-gradient-layer-x: var(
            --snowui-gradient-motion-vector-4-x-amplitude-override,
            12%
        );
        --snowui-gradient-layer-y: var(
            --snowui-gradient-motion-vector-4-y-amplitude-override,
            12%
        );
        --snowui-gradient-layer-rotate: var(
            --snowui-gradient-motion-vector-4-rotate-amplitude-override,
            20deg
        );
        animation-name: snowui-gradient-vector-4-motion;
    }

    :global(
            :where(.snowui-gradient-motion-enabled)
                :where(.snowui-gradient-layer-vector-3)
        ) {
        --snowui-gradient-layer-x: var(
            --snowui-gradient-motion-vector-3-x-amplitude-override,
            12%
        );
        --snowui-gradient-layer-y: var(
            --snowui-gradient-motion-vector-3-y-amplitude-override,
            12%
        );
        --snowui-gradient-layer-scale: var(
            --snowui-gradient-motion-vector-3-scale-amplitude-override,
            0.25
        );
        animation-name: snowui-gradient-vector-3-motion;
    }

    :global(
            :where(.snowui-gradient-motion-enabled)
                :where(.snowui-gradient-layer-subtract)
        ) {
        --snowui-gradient-layer-x: var(
            --snowui-gradient-motion-subtract-x-amplitude-override,
            12%
        );
        --snowui-gradient-layer-y: var(
            --snowui-gradient-motion-subtract-y-amplitude-override,
            12%
        );
        --snowui-gradient-layer-scale: var(
            --snowui-gradient-motion-subtract-deform-amplitude-override,
            0.25
        );
        animation-name: snowui-gradient-subtract-motion;
    }

    :global(
            :where(.snowui-gradient-motion-enabled)
                :where(.snowui-gradient-layer-subtract-2)
        ) {
        --snowui-gradient-layer-x: var(
            --snowui-gradient-motion-subtract-2-x-amplitude-override,
            12%
        );
        --snowui-gradient-layer-y: var(
            --snowui-gradient-motion-subtract-2-y-amplitude-override,
            12%
        );
        --snowui-gradient-layer-rotate: var(
            --snowui-gradient-motion-subtract-2-rotate-amplitude-override,
            20deg
        );
        --snowui-gradient-layer-scale: var(
            --snowui-gradient-motion-subtract-2-scale-amplitude-override,
            0.25
        );
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
        animation-delay: var(
            --snowui-gradient-avatar-hover-motion-vector-4-delay,
            -1.7s
        );
        animation-direction: var(
            --snowui-gradient-avatar-hover-motion-vector-4-direction,
            normal
        );
    }

    :global(
            :where(.snowui-gradient-hover-motion-enabled)
                :where(.snowui-gradient-layer-vector-3)
        ) {
        animation-duration: var(
            --snowui-gradient-avatar-hover-motion-vector-3-duration-override,
            7.2s
        );
        animation-delay: var(
            --snowui-gradient-avatar-hover-motion-vector-3-delay,
            -4.1s
        );
        animation-direction: var(
            --snowui-gradient-avatar-hover-motion-vector-3-direction,
            normal
        );
    }

    :global(
            :where(.snowui-gradient-hover-motion-enabled)
                :where(.snowui-gradient-layer-subtract)
        ) {
        animation-duration: var(
            --snowui-gradient-avatar-hover-motion-subtract-duration-override,
            8.4s
        );
        animation-delay: var(
            --snowui-gradient-avatar-hover-motion-subtract-delay,
            -2.8s
        );
        animation-direction: var(
            --snowui-gradient-avatar-hover-motion-subtract-direction,
            normal
        );
    }

    :global(
            :where(.snowui-gradient-hover-motion-enabled)
                :where(.snowui-gradient-layer-subtract-2)
        ) {
        animation-duration: var(
            --snowui-gradient-avatar-hover-motion-subtract-2-duration-override,
            6.8s
        );
        animation-delay: var(
            --snowui-gradient-avatar-hover-motion-subtract-2-delay,
            -5.3s
        );
        animation-direction: var(
            --snowui-gradient-avatar-hover-motion-subtract-2-direction,
            normal
        );
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

    :global(
            :where(.snowui-gradient-hover-motion-enabled[data-avatar-motion-profile="1"])
        ) {
        --snowui-gradient-avatar-hover-motion-vector-4-delay: -4.9s;
        --snowui-gradient-avatar-hover-motion-vector-3-delay: -1.3s;
        --snowui-gradient-avatar-hover-motion-subtract-delay: -6.6s;
        --snowui-gradient-avatar-hover-motion-subtract-2-delay: -2.1s;
        --snowui-gradient-avatar-hover-motion-vector-3-direction: reverse;
        --snowui-gradient-avatar-hover-motion-subtract-2-direction: reverse;
    }

    :global(
            :where(.snowui-gradient-hover-motion-enabled[data-avatar-motion-profile="2"])
        ) {
        --snowui-gradient-avatar-hover-motion-vector-4-delay: -0.8s;
        --snowui-gradient-avatar-hover-motion-vector-3-delay: -5.7s;
        --snowui-gradient-avatar-hover-motion-subtract-delay: -3.9s;
        --snowui-gradient-avatar-hover-motion-subtract-2-delay: -6.2s;
        --snowui-gradient-avatar-hover-motion-vector-4-direction: reverse;
        --snowui-gradient-avatar-hover-motion-subtract-direction: reverse;
    }

    :global(
            :where(.snowui-gradient-hover-motion-enabled[data-avatar-motion-profile="3"])
        ) {
        --snowui-gradient-avatar-hover-motion-vector-4-delay: -3.2s;
        --snowui-gradient-avatar-hover-motion-vector-3-delay: -2.6s;
        --snowui-gradient-avatar-hover-motion-subtract-delay: -7.5s;
        --snowui-gradient-avatar-hover-motion-subtract-2-delay: -0.9s;
        --snowui-gradient-avatar-hover-motion-vector-4-direction: reverse;
        --snowui-gradient-avatar-hover-motion-vector-3-direction: reverse;
        --snowui-gradient-avatar-hover-motion-subtract-2-direction: reverse;
    }

    :global(
            :where(.snowui-gradient-hover-motion-enabled[data-avatar-motion-profile="4"])
        ) {
        --snowui-gradient-avatar-hover-motion-vector-4-delay: -5.8s;
        --snowui-gradient-avatar-hover-motion-vector-3-delay: -3.4s;
        --snowui-gradient-avatar-hover-motion-subtract-delay: -1.1s;
        --snowui-gradient-avatar-hover-motion-subtract-2-delay: -4.6s;
        --snowui-gradient-avatar-hover-motion-vector-3-direction: reverse;
        --snowui-gradient-avatar-hover-motion-subtract-direction: reverse;
    }

    :global(
            :where(.snowui-gradient-hover-motion-enabled[data-avatar-motion-profile="5"])
        ) {
        --snowui-gradient-avatar-hover-motion-vector-4-delay: -2.4s;
        --snowui-gradient-avatar-hover-motion-vector-3-delay: -6.5s;
        --snowui-gradient-avatar-hover-motion-subtract-delay: -5.2s;
        --snowui-gradient-avatar-hover-motion-subtract-2-delay: -3.3s;
        --snowui-gradient-avatar-hover-motion-vector-4-direction: reverse;
        --snowui-gradient-avatar-hover-motion-vector-3-direction: reverse;
        --snowui-gradient-avatar-hover-motion-subtract-direction: reverse;
    }

    :global(:where(.snowui-gradient-avatar-overlay)) {
        position: absolute;
        inset: 0;
        overflow: hidden;
        border-radius: inherit;
        corner-shape: inherit;
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
                    calc(0% - var(--snowui-gradient-layer-x)),
                    0%,
                    0
                )
                rotate(
                    calc(0deg - var(--snowui-gradient-layer-rotate))
                );
        }

        11% {
            transform: translate3d(
                    calc(0% - var(--snowui-gradient-layer-x)),
                    calc(0% - var(--snowui-gradient-layer-y)),
                    0
                )
                rotate(0deg);
        }

        27% {
            transform: translate3d(
                    0%,
                    calc(0% - var(--snowui-gradient-layer-y)),
                    0
                )
                rotate(var(--snowui-gradient-layer-rotate));
        }

        43% {
            transform: translate3d(
                    var(--snowui-gradient-layer-x),
                    0%,
                    0
                )
                rotate(var(--snowui-gradient-layer-rotate));
        }

        58% {
            transform: translate3d(
                    0%,
                    var(--snowui-gradient-layer-y),
                    0
                )
                rotate(0deg);
        }

        74% {
            transform: translate3d(
                    calc(0% - var(--snowui-gradient-layer-x)),
                    var(--snowui-gradient-layer-y),
                    0
                )
                rotate(
                    calc(0deg - var(--snowui-gradient-layer-rotate))
                );
        }

        89% {
            transform: translate3d(
                    var(--snowui-gradient-layer-x),
                    var(--snowui-gradient-layer-y),
                    0
                )
                rotate(0deg);
        }
    }

    @keyframes snowui-gradient-vector-3-motion {
        0%,
        100% {
            transform: translate3d(
                    var(--snowui-gradient-layer-x),
                    0%,
                    0
                )
                scale(1);
        }

        14% {
            transform: translate3d(
                    0%,
                    calc(0% - var(--snowui-gradient-layer-y)),
                    0
                )
                scale(
                    calc(1 + var(--snowui-gradient-layer-scale))
                );
        }

        31% {
            transform: translate3d(
                    calc(0% - var(--snowui-gradient-layer-x)),
                    calc(0% - var(--snowui-gradient-layer-y)),
                    0
                )
                scale(1);
        }

        47% {
            transform: translate3d(
                    calc(0% - var(--snowui-gradient-layer-x)),
                    var(--snowui-gradient-layer-y),
                    0
                )
                scale(calc(1 - var(--snowui-gradient-layer-scale)));
        }

        62% {
            transform: translate3d(
                    var(--snowui-gradient-layer-x),
                    var(--snowui-gradient-layer-y),
                    0
                )
                scale(1);
        }

        79% {
            transform: translate3d(0%, 0%, 0)
                scale(calc(1 + var(--snowui-gradient-layer-scale)));
        }

        92% {
            transform: translate3d(
                    0%,
                    calc(0% - var(--snowui-gradient-layer-y)),
                    0
                )
                scale(calc(1 - var(--snowui-gradient-layer-scale)));
        }
    }

    @keyframes snowui-gradient-subtract-motion {
        0%,
        100% {
            transform: translate3d(
                    0%,
                    var(--snowui-gradient-layer-y),
                    0
                )
                scaleX(calc(1 + var(--snowui-gradient-layer-scale)))
                scaleY(calc(1 - var(--snowui-gradient-layer-scale)));
        }

        9% {
            transform: translate3d(
                    calc(0% - var(--snowui-gradient-layer-x)),
                    var(--snowui-gradient-layer-y),
                    0
                )
                scaleX(1)
                scaleY(1);
        }

        26% {
            transform: translate3d(
                    calc(0% - var(--snowui-gradient-layer-x)),
                    calc(0% - var(--snowui-gradient-layer-y)),
                    0
                )
                scaleX(calc(1 - var(--snowui-gradient-layer-scale)))
                scaleY(calc(1 + var(--snowui-gradient-layer-scale)));
        }

        44% {
            transform: translate3d(
                    var(--snowui-gradient-layer-x),
                    calc(0% - var(--snowui-gradient-layer-y)),
                    0
                )
                scaleX(1)
                scaleY(1);
        }

        57% {
            transform: translate3d(
                    var(--snowui-gradient-layer-x),
                    var(--snowui-gradient-layer-y),
                    0
                )
                scaleX(calc(1 + var(--snowui-gradient-layer-scale)))
                scaleY(calc(1 - var(--snowui-gradient-layer-scale)));
        }

        73% {
            transform: translate3d(0%, 0%, 0)
                scaleX(calc(1 - var(--snowui-gradient-layer-scale)))
                scaleY(calc(1 + var(--snowui-gradient-layer-scale)));
        }

        91% {
            transform: translate3d(
                    calc(0% - var(--snowui-gradient-layer-x)),
                    0%,
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
                    var(--snowui-gradient-layer-x),
                    0%,
                    0
                )
                rotate(var(--snowui-gradient-layer-rotate))
                scale(calc(1 + var(--snowui-gradient-layer-scale)));
        }

        16% {
            transform: translate3d(
                    var(--snowui-gradient-layer-x),
                    calc(0% - var(--snowui-gradient-layer-y)),
                    0
                )
                rotate(0deg)
                scale(1);
        }

        34% {
            transform: translate3d(
                    0%,
                    calc(0% - var(--snowui-gradient-layer-y)),
                    0
                )
                rotate(calc(0deg - var(--snowui-gradient-layer-rotate)))
                scale(calc(1 - var(--snowui-gradient-layer-scale)));
        }

        49% {
            transform: translate3d(
                    calc(0% - var(--snowui-gradient-layer-x)),
                    0%,
                    0
                )
                rotate(0deg)
                scale(calc(1 + var(--snowui-gradient-layer-scale)));
        }

        63% {
            transform: translate3d(
                    0%,
                    var(--snowui-gradient-layer-y),
                    0
                )
                rotate(var(--snowui-gradient-layer-rotate))
                scale(1);
        }

        81% {
            transform: translate3d(
                    var(--snowui-gradient-layer-x),
                    var(--snowui-gradient-layer-y),
                    0
                )
                rotate(calc(0deg - var(--snowui-gradient-layer-rotate)))
                scale(calc(1 - var(--snowui-gradient-layer-scale)));
        }

        93% {
            transform: translate3d(
                    calc(0% - var(--snowui-gradient-layer-x)),
                    calc(0% - var(--snowui-gradient-layer-y)),
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
