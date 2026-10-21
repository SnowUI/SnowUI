<!-- SnowUI source notice | LICENSE 2.3.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 -->
<!--
 Spinner 加载组件
 v1.2.3
 
 描述: 通用的加载状态指示器，支持多种视觉变体。
 详情: 详见 Spinner.md
-->

<script lang="ts">
    import { useLocale } from "../i18n/locale.svelte";
  // SnowUI 许可入口：首次阅读源码请先读 ../../LICENSE；访问文件不代表获得修改或移植权，官方维护授权及同任务去重见该文件。
    import { type Snippet } from "svelte";
    import Frame, {
        type FrameProps,
        type LoopMotionConfig,
    } from "./Frame.svelte";
    import { getSizeContext, getSize, type ResourceSize } from "../context";
    import { resolveResourceSizeToken } from "../logic/resource-size";
    import {
        mergeComponentPartProps,
        useComponentPart,
    } from "../logic/component-parts.svelte";

    type SpinnerVariant = "circle" | "spokes" | "pills";

    const localeContext = useLocale();

    interface Props extends FrameProps {
        variant?: SpinnerVariant;
        size?: ResourceSize;
        speed?: number;
        loopMotion?: LoopMotionConfig;
        children?: Snippet;
        [key: string]: any;
    }

    const inheritedSpinnerPart = useComponentPart<Props>("Spinner");
    let explicitProps: Props = $props();
    let {
        variant = "circle",
        size = undefined,
        speed = 1,
        loopMotion = undefined,
        class: className = "",
        responsive = undefined,
        style = "",
        renderHints: userRenderHints = undefined,
        ...rest
    }: Props = $derived(
        mergeComponentPartProps(inheritedSpinnerPart.current, explicitProps),
    );

    // 读取父级尺寸上下文
    getSize();
    const sizeCtx = getSizeContext();
    const contextSize = $derived(
        sizeCtx?.iconSize !== undefined ? sizeCtx.iconSize : sizeCtx?.size,
    );
    // 优先使用 prop size，其次使用 context size
    const resolvedSize = $derived(size ?? contextSize ?? 16);

    let sizeRem = $derived(resolveResourceSizeToken(resolvedSize));

    const safeSpeed = $derived.by(() => {
        const current = Number(speed);
        if (!Number.isFinite(current) || current <= 0) return 1;
        return current;
    });

    // 默认循环时长：circle 1000ms（匀速旋转），spokes/pills 800ms
    const loopDurationMs = $derived(
        variant === "circle"
            ? 1000 / safeSpeed
            : 800 / safeSpeed,
    );

    const resolvedLoopMotion = $derived.by(() => {
        const base: LoopMotionConfig = {
            duration: loopDurationMs,
            easing: "linear",
            iterationCount: "infinite",
            direction: "normal",
            playState: "running",
        };
        if (!loopMotion || typeof loopMotion !== "object") {
            return base;
        }
        return {
            ...base,
            ...loopMotion,
        };
    });

    const frameLoopMotion = $derived.by(() => {
        const { preset: _preset, ...timing } = resolvedLoopMotion;
        return timing;
    });
    const spinnerRenderHints = $derived({
        variant: userRenderHints?.variant ?? "circle",
        width: userRenderHints?.width ?? sizeRem,
        height: userRenderHints?.height ?? sizeRem,
    });

    // 辐条生成：spokes 12 根（30° 间隔），pills 8 根（45° 间隔）
    let spokesCount = $derived(variant === "pills" ? 8 : 12);
    let spokes = $derived(Array.from({ length: spokesCount }));
</script>

<Frame
    enableResponsive={false}
    enableContext={false}
    enableScaleObserver={false}
    class={["snowui-spinner", `snowui-spinner-${variant}`, className]
        .filter(Boolean)
        .join(" ")}
    loopMotion={frameLoopMotion}
    style={[
        // 仅在非默认值时输出 CSS 变量
        resolvedSize !== 16 && `--snowui-spinner-size: ${sizeRem}`,
        style,
    ]
        .filter(Boolean)
        .join("; ")}
    {responsive}
    role="status"
    aria-label={localeContext.t("spinner.loading")}
    renderHints={spinnerRenderHints}
    {...rest}
>
    {#if variant === "circle"}
        <!-- 锥形渐变 + SVG Mask 环形实现 -->
        <div class="snowui-spinner-circle-gradient"></div>
    {:else}
        <!-- SVG 辐条/药丸实现（高精度渲染） -->
        <svg
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            class="snowui-spinner-svg"
        >
            {#each spokes as _, i}
                <rect
                    class="snowui-spinner-bar"
                    x={variant === "pills" ? 10.3 : 11}
                    y="1"
                    width={variant === "pills" ? 3 : 2}
                    height={variant === "spokes" ? 6 : 7}
                    rx={variant === "pills" ? 1.7 : 1}
                    fill="currentColor"
                    style="--snowui-spinner-index: {i}; --snowui-spinner-count: {spokesCount};"
                    transform="rotate({(360 / spokesCount) * i} 12 12)"
                />
            {/each}
        </svg>
    {/if}
</Frame>

<style>
    :global(:where(.snowui-spinner)) {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        position: relative;
        /* 默认 16px (1rem)，未传变量时回退 */
        width: var(
            --snowui-spinner-size-override,
            var(--snowui-spinner-size, 1rem)
        );
        height: var(
            --snowui-spinner-size-override,
            var(--snowui-spinner-size, 1rem)
        );
        vertical-align: middle;
        box-sizing: border-box;
        /* 默认继承 currentColor */
        color: currentColor;
    }

    /* === 变体: Circle（锥形渐变 + SVG Mask） === */
    :global(:where(.snowui-spinner-circle-gradient)) {
        width: 100%;
        height: 100%;
        /* 不使用 border-radius，由 SVG mask 同时裁剪内外边缘（矢量抗锯齿） */
        /* 从透明到 currentColor 的锥形渐变 */
        background: conic-gradient(
            from 0deg,
            transparent 0%,
            currentColor 100%
        );
        /*
         * SVG Mask (replaces radial-gradient to eliminate aliasing):
         * SVG circle stroke 提供矢量级抗锯齿的环形裁剪，任意尺寸都平滑。
         * 环形几何：厚度 = 15% of diameter, 内径 = 70% of half-side
         * viewBox 100x100: r=42.5, stroke-width=15
         */
        -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='42.5' fill='none' stroke='white' stroke-width='15'/%3E%3C/svg%3E");
        mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='42.5' fill='none' stroke='white' stroke-width='15'/%3E%3C/svg%3E");
        -webkit-mask-size: 100% 100%;
        mask-size: 100% 100%;
        /* 旋转动画：默认 1s 匀速 */
        animation-name: snowui-spin;
        animation-duration: var(--snowui-frame-loop-motion-duration, 1s);
        animation-timing-function: var(
            --snowui-frame-loop-motion-easing,
            linear
        );
        animation-iteration-count: var(
            --snowui-frame-loop-motion-iteration-count,
            infinite
        );
        animation-direction: var(
            --snowui-frame-loop-motion-direction,
            normal
        );
        animation-play-state: var(
            --snowui-frame-loop-motion-play-state,
            running
        );
    }

    /* Circle 变体圆角端点 */
    :global(:where(.snowui-spinner-circle-gradient))::after {
        content: "";
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 15%; /* 匹配环宽度（直径的 15%） */
        height: 15%;
        border-radius: 50%;
        background: currentColor;
    }

    /* === 变体: Spokes & Pills（SVG） === */
    :global(:where(.snowui-spinner-svg)) {
        width: 100%;
        height: 100%;
        /* SVG 自身处理旋转，比 HTML 更精确 */
    }

    :global(:where(.snowui-spinner-spokes) .snowui-spinner-bar),
    :global(:where(.snowui-spinner-pills) .snowui-spinner-bar) {
        opacity: 0.1;
        animation-name: snowui-spinner-fade;
        animation-duration: var(--snowui-frame-loop-motion-duration, 1s);
        animation-timing-function: var(
            --snowui-frame-loop-motion-easing,
            linear
        );
        animation-iteration-count: var(
            --snowui-frame-loop-motion-iteration-count,
            infinite
        );
        animation-direction: var(
            --snowui-frame-loop-motion-direction,
            normal
        );
        animation-play-state: var(
            --snowui-frame-loop-motion-play-state,
            running
        );
        /* 
         * 顺时针旋转的交错延迟：
         * 公式: (Index - Count) * Step
         * 确保"波浪"按 0 -> 1 -> 2 顺序传播。
         */
        animation-delay: calc(
            var(--snowui-frame-loop-motion-duration, 1s) /
                var(--snowui-spinner-count) *
                (var(--snowui-spinner-index) - var(--snowui-spinner-count))
        );
    }

    /* 动画 */
    @keyframes snowui-spin {
        100% {
            transform: rotate(360deg);
        }
    }

    @keyframes snowui-spinner-fade {
        0% {
            opacity: 1;
        }
        100% {
            opacity: 0.1; /* 尾迹末端透明度 */
        }
    }
</style>
