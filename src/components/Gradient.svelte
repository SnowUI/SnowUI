<!--
  Gradient 静态渐变图组件
  v1.1.0

  职责：渲染 Workshop 设计稿最终图层 c 顶部裁出的 2x 正方形 PNG，为后续头像动效提供静态视觉基线。
  文档：./Gradient.md
-->

<script lang="ts">
    import Frame, { type FrameProps } from "./Frame.svelte";
    import { getSize } from "../context";
    import gradientImageUrl from "../assets/gradient-c-square.png";

    interface Props
        extends Omit<
            FrameProps,
            "children" | "size" | "width" | "height" | "radius"
        > {
        size?: number | string;
        width?: number | string;
        height?: number | string;
        radius?: number | string;
        decorative?: boolean;
        seed?: string | number;
        [key: string]: any;
    }

    let {
        size = undefined,
        width = undefined,
        height = undefined,
        radius = undefined,
        decorative = true,
        seed: _seed = undefined,
        role = undefined,
        "aria-label": ariaLabel = undefined,
        class: className = "",
        style: userStyle = "",
        renderHints: userRenderHints = undefined,
        enableResponsive = false,
        enableContext = false,
        enableScaleObserver = false,
        enableDefaultMotion = true,
        ...rest
    }: Props = $props();

    const DEFAULT_WIDTH = 355;
    const DEFAULT_HEIGHT = 355;
    const DEFAULT_RADIUS = "var(--radius-5)";

    getSize();

    function toCssLength(value: number | string): string {
        return typeof value === "number" ? `${value}px` : value;
    }

    const resolvedWidth = $derived(
        toCssLength(size ?? width ?? DEFAULT_WIDTH),
    );
    const resolvedHeight = $derived(
        toCssLength(size ?? height ?? DEFAULT_HEIGHT),
    );
    const resolvedRadius = $derived(
        radius === undefined ? DEFAULT_RADIUS : toCssLength(radius),
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
</script>

<Frame
    enableResponsive={enableResponsive}
    enableContext={enableContext}
    enableScaleObserver={enableScaleObserver}
    enableDefaultMotion={enableDefaultMotion}
    class={["snowui-gradient", className].filter(Boolean).join(" ")}
    style={gradientStyle}
    role={decorative ? undefined : (role ?? "img")}
    aria-label={decorative ? undefined : ariaLabel}
    aria-hidden={decorative ? "true" : undefined}
    renderHints={gradientRenderHints}
    {...rest}
>
    <img
        class="snowui-gradient-image"
        src={gradientImageUrl}
        alt=""
        draggable="false"
    />
</Frame>

<style>
    :global(:where(.snowui-gradient)) {
        display: inline-flex;
        flex: none;
        width: var(
            --snowui-gradient-width-override,
            var(--snowui-gradient-width, calc(var(--size-4) * 355 / 16))
        );
        height: var(
            --snowui-gradient-height-override,
            var(--snowui-gradient-height, calc(var(--size-4) * 355 / 16))
        );
        overflow: hidden;
        border-radius: var(
            --snowui-gradient-radius-override,
            var(--snowui-gradient-radius, var(--radius-5))
        );
        box-sizing: border-box;
    }

    :global(:where(.snowui-gradient-image)) {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: fill;
        pointer-events: none;
        user-select: none;
    }
</style>
