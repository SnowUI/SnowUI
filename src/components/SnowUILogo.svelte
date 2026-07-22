<!--
  SnowUILogo 组件
  v1.12.0

  职责：按 Workshop 品牌设计稿渲染 SnowUI 图标、字标及其横向/纵向组合。
  文档：./SnowUILogo.md
-->

<script lang="ts">
    import { onDestroy } from "svelte";
    import Frame, { type FrameProps } from "./Frame.svelte";

    type SnowUILogoVariant = "icon" | "text" | "horizontal" | "vertical";
    type SnowUILogoRotationDirection = "clockwise" | "counterclockwise";

    interface Props
        extends Omit<
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
        vertical: { width: 71, height: 84 },
    } as const;
    const FRAME_LOOP_MOTION = {
        duration: 1000,
        easing: "linear",
        iterationCount: 1,
        direction: "normal",
        playState: "running",
    } as const;
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
        [
            safeScale !== 1 && `--snowui-snow-ui-logo-scale: ${safeScale}`,
            userStyle,
        ]
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
                    ".snowui-snow-ui-logo-star, .snowui-snow-ui-logo-strip",
                ),
            )
            : [];
        if (layers.length !== 5) {
            cycleActive = false;
            return;
        }

        const snapshots = layers.map((element) => {
            const turn = Number.parseFloat(
                getComputedStyle(element).getPropertyValue(
                    "--snowui-snow-ui-logo-angle-360",
                ),
            );
            const direction: SnowUILogoRotationDirection = turn < 0
                ? "counterclockwise"
                : "clockwise";
            const start = readRotationAngle(element);
            const alignmentStep = element.classList.contains(
                "snowui-snow-ui-logo-star",
            ) ? 45 : 90;
            const end = resolveAlignmentTarget(
                start,
                direction,
                alignmentStep,
            );
            const fullTurnDuration = readDurationMs(element);
            const remainingDegrees = Math.abs(end - start);
            const duration = fullTurnDuration > 0
                ? fullTurnDuration * (remainingDegrees / 360)
                : 0;
            return { element, start, end, duration };
        });

        const currentRun = ++settleRun;
        settleAnimations.forEach((animation) => animation.cancel());
        settleAnimations = [];
        cycleActive = false;
        settling = true;

        const completions = snapshots.map(({ element, start, end, duration }) => {
            if (duration <= 1) {
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
    class={[
        "snowui-snow-ui-logo",
        `snowui-snow-ui-logo-${variant}`,
        className,
    ]
        .filter(Boolean)
        .join(" ")}
    data-variant={variant}
    data-snow-ui-logo-cycle={cycleActive ? "active" : (settling ? "settling" : "idle")}
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
            <g class="snowui-snow-ui-logo-strip snowui-snow-ui-logo-strip-4">
                <path d="M27.2 11.2002C29.851 11.2002 32 13.3492 32 16.0002C32 18.6512 29.851 20.8002 27.2 20.8002L4.8 20.8002C2.14903 20.8002 -1.15877e-07 18.6512 0 16.0002C1.15877e-07 13.3492 2.14903 11.2002 4.8 11.2002L27.2 11.2002Z" fill="var(--logo-1, #4C98FD)" />
                <path d="M27.2 11.2002C29.851 11.2002 32 13.3492 32 16.0002C32 18.6512 29.851 20.8002 27.2 20.8002L4.8 20.8002C2.14903 20.8002 -1.15877e-07 18.6512 0 16.0002C1.15877e-07 13.3492 2.14903 11.2002 4.8 11.2002L27.2 11.2002Z" fill="var(--static-white-100, white)" fill-opacity="0" />
            </g>
            <g class="snowui-snow-ui-logo-strip snowui-snow-ui-logo-strip-3">
                <path d="M11.2001 4.8C11.2001 2.14903 13.3491 0 16.0001 0C18.651 0 20.8001 2.14903 20.8001 4.8V27.2C20.8001 29.851 18.651 32 16.0001 32C13.3491 32 11.2001 29.851 11.2001 27.2V4.8Z" fill="var(--logo-1, #4C98FD)" />
                <path d="M11.2001 4.8C11.2001 2.14903 13.3491 0 16.0001 0C18.651 0 20.8001 2.14903 20.8001 4.8V27.2C20.8001 29.851 18.651 32 16.0001 32C13.3491 32 11.2001 29.851 11.2001 27.2V4.8Z" fill="var(--static-white-100, white)" fill-opacity="0.4" style="mix-blend-mode:screen" />
            </g>
            <g class="snowui-snow-ui-logo-strip snowui-snow-ui-logo-strip-2">
                <path d="M27.3145 20.5259C29.189 22.4005 29.189 25.4398 27.3145 27.3143C25.4399 29.1889 22.4006 29.1889 20.526 27.3143L4.68633 11.4746C2.81175 9.60007 2.81175 6.56078 4.68633 4.68621C6.5609 2.81163 9.60019 2.81163 11.4748 4.68621L27.3145 20.5259Z" fill="var(--logo-1, #4C98FD)" />
                <path d="M27.3145 20.5259C29.189 22.4005 29.189 25.4398 27.3145 27.3143C25.4399 29.1889 22.4006 29.1889 20.526 27.3143L4.68633 11.4746C2.81175 9.60007 2.81175 6.56078 4.68633 4.68621C6.5609 2.81163 9.60019 2.81163 11.4748 4.68621L27.3145 20.5259Z" fill="var(--static-white-100, white)" fill-opacity="0.2" style="mix-blend-mode:soft-light" />
            </g>
            <g class="snowui-snow-ui-logo-strip snowui-snow-ui-logo-strip-1">
                <path d="M20.526 4.68621C22.4006 2.81163 25.4399 2.81163 27.3145 4.68621C29.189 6.56078 29.189 9.60007 27.3145 11.4746L11.4748 27.3143C9.60019 29.1889 6.5609 29.1889 4.68633 27.3143C2.81175 25.4398 2.81175 22.4005 4.68633 20.5259L20.526 4.68621Z" fill="var(--logo-1, #4C98FD)" />
                <path d="M20.526 4.68621C22.4006 2.81163 25.4399 2.81163 27.3145 4.68621C29.189 6.56078 29.189 9.60007 27.3145 11.4746L11.4748 27.3143C9.60019 29.1889 6.5609 29.1889 4.68633 27.3143C2.81175 25.4398 2.81175 22.4005 4.68633 20.5259L20.526 4.68621Z" fill="var(--static-white-100, white)" fill-opacity="0.3" style="mix-blend-mode:overlay" />
            </g>
            <path class="snowui-snow-ui-logo-star" data-direction={asteriskMotion.direction} fill-rule="evenodd" clip-rule="evenodd" d="M15.9999 4.7998C15.6465 4.7998 15.3599 5.08634 15.3599 5.4398V13.8367C15.3599 14.0305 15.3599 14.1275 15.3216 14.1723C15.2883 14.2113 15.2384 14.232 15.1874 14.2279C15.1285 14.2233 15.06 14.1548 14.9229 14.0177L8.98543 8.08021C8.7355 7.83028 8.33027 7.83028 8.08034 8.08021C7.8304 8.33015 7.8304 8.73537 8.08034 8.98531L14.0178 14.9228C14.1549 15.0599 14.2234 15.1284 14.2281 15.1873C14.2321 15.2383 14.2114 15.2882 14.1725 15.3215C14.1276 15.3598 14.0307 15.3598 13.8368 15.3598H5.43993C5.08646 15.3598 4.79993 15.6463 4.79993 15.9998C4.79993 16.3533 5.08646 16.6398 5.43993 16.6398H13.8368C14.0307 16.6398 14.1276 16.6398 14.1725 16.6781C14.2114 16.7114 14.2321 16.7613 14.2281 16.8124C14.2234 16.8712 14.1549 16.9397 14.0178 17.0768L8.08033 23.0143C7.8304 23.2642 7.8304 23.6695 8.08033 23.9194C8.33027 24.1693 8.7355 24.1693 8.98543 23.9194L14.9229 17.9819C15.06 17.8448 15.1285 17.7763 15.1874 17.7717C15.2384 17.7677 15.2883 17.7883 15.3216 17.8273C15.3599 17.8722 15.3599 17.9691 15.3599 18.1629V26.5598C15.3599 26.9133 15.6465 27.1998 15.9999 27.1998C16.3534 27.1998 16.6399 26.9133 16.6399 26.5598V18.1629C16.6399 17.9691 16.6399 17.8721 16.6783 17.8273C16.7115 17.7883 16.7614 17.7676 16.8125 17.7717C16.8713 17.7763 16.9399 17.8448 17.0769 17.9819L23.0144 23.9194C23.2644 24.1693 23.6696 24.1693 23.9195 23.9194C24.1695 23.6695 24.1695 23.2642 23.9195 23.0143L17.982 17.0768C17.845 16.9397 17.7764 16.8712 17.7718 16.8124C17.7678 16.7613 17.7884 16.7114 17.8274 16.6781C17.8723 16.6398 17.9692 16.6398 18.1631 16.6398H26.5599C26.9134 16.6398 27.1999 16.3533 27.1999 15.9998C27.1999 15.6463 26.9134 15.3598 26.5599 15.3598H18.1631C17.9692 15.3598 17.8723 15.3598 17.8274 15.3215C17.7884 15.2882 17.7678 15.2383 17.7718 15.1873C17.7764 15.1284 17.845 15.0599 17.982 14.9228L23.9195 8.98531C24.1695 8.73537 24.1695 8.33015 23.9195 8.08021C23.6696 7.83027 23.2644 7.83027 23.0144 8.08021L17.0769 14.0177C16.9399 14.1548 16.8713 14.2233 16.8125 14.2279C16.7614 14.232 16.7115 14.2113 16.6783 14.1723C16.6399 14.1275 16.6399 14.0305 16.6399 13.8367V5.4398C16.6399 5.08634 16.3534 4.7998 15.9999 4.7998Z" fill="var(--static-white-100, white)" />
        </svg>
    {/if}

    {#if variant !== "icon"}
        <svg class="snowui-snow-ui-logo-wordmark" viewBox="0 0 71 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <g class="snowui-snow-ui-logo-wordmark-ui">
                <!-- UI Fill 从下到上：Logo 2 → White/20% → White/10%。 -->
                <path class="snowui-snow-ui-logo-wordmark-ui-logo-2" d="M58 7L58 0H56V7C56 9.76142 58.2386 12 61 12C63.7614 12 66 9.76142 66 7L66 0H64L64 7C64 8.65685 62.6569 10 61 10C59.3431 10 58 8.65685 58 7Z" fill="var(--logo-2, #4F507F)" />
                <path class="snowui-snow-ui-logo-wordmark-ui-white-20" d="M58 7L58 0H56V7C56 9.76142 58.2386 12 61 12C63.7614 12 66 9.76142 66 7L66 0H64L64 7C64 8.65685 62.6569 10 61 10C59.3431 10 58 8.65685 58 7Z" fill="var(--white-100)" fill-opacity="0.2" />
                <path class="snowui-snow-ui-logo-wordmark-ui-white-10" d="M58 7L58 0H56V7C56 9.76142 58.2386 12 61 12C63.7614 12 66 9.76142 66 7L66 0H64L64 7C64 8.65685 62.6569 10 61 10C59.3431 10 58 8.65685 58 7Z" fill="var(--white-100)" fill-opacity="0.1" />
                <path class="snowui-snow-ui-logo-wordmark-ui-logo-2" d="M69 0V12H71V0H69Z" fill="var(--logo-2, #4F507F)" />
                <path class="snowui-snow-ui-logo-wordmark-ui-white-20" d="M69 0V12H71V0H69Z" fill="var(--white-100)" fill-opacity="0.2" />
                <path class="snowui-snow-ui-logo-wordmark-ui-white-10" d="M69 0V12H71V0H69Z" fill="var(--white-100)" fill-opacity="0.1" />
            </g>
            <path d="M7.75145 11.0976C6.91908 11.7073 5.80058 12 4.39595 12C3.53757 12 2.75723 11.878 2.05491 11.6585C1.3526 11.439 0.650289 11.1463 0 10.7561L0.806358 9.02439C1.45665 9.43902 2.05491 9.70732 2.62717 9.87805C3.19942 10.0488 3.77168 10.1463 4.31792 10.1463C5.12428 10.1463 5.72254 10.0244 6.16474 9.7561C6.58093 9.48781 6.78902 9.12195 6.78902 8.63415C6.78902 8.09756 6.55491 7.68293 6.06069 7.41463C5.56647 7.14634 4.9422 6.87805 4.18786 6.60976C3.06936 6.21951 2.18497 5.78049 1.53468 5.29268C0.858382 4.80488 0.520231 4.09756 0.49422 3.17073C0.468208 2.17073 0.858382 1.39024 1.66474 0.829268C2.4711 0.268293 3.51156 0 4.81214 0C5.46243 0 6.08671 0.0731705 6.71098 0.243902C7.33526 0.414634 7.93353 0.658536 8.47977 1L7.67341 2.65854C7.17919 2.39024 6.71098 2.19512 6.26879 2.04878C5.80058 1.90244 5.30636 1.82927 4.81214 1.82927C4.16185 1.82927 3.64162 1.92683 3.25145 2.14634C2.86127 2.36585 2.67919 2.70732 2.67919 3.14634C2.67919 3.63415 2.93931 4 3.43353 4.2439C3.92775 4.4878 4.57803 4.7561 5.33237 5.04878C6.45087 5.43902 7.33526 5.87805 8.01156 6.39024C8.66185 6.90244 9 7.60976 9 8.56098C9 9.65854 8.58382 10.4878 7.75145 11.0976Z" fill="var(--logo-2, #4F507F)" />
            <path d="M20 5V12H22V5C22 2.23858 19.7614 0 17 0C14.2386 0 12 2.23858 12 5V12H14V5C14 3.34315 15.3431 2 17 2C18.6569 2 20 3.34315 20 5Z" fill="var(--logo-2, #4F507F)" />
            <path fill-rule="evenodd" clip-rule="evenodd" d="M37 6C37 9.31371 34.3137 12 31 12C27.6863 12 25 9.31371 25 6C25 2.68629 27.6863 0 31 0C34.3137 0 37 2.68629 37 6ZM35 6C35 8.20914 33.2091 10 31 10C28.7909 10 27 8.20914 27 6C27 3.79086 28.7909 2 31 2C33.2091 2 35 3.79086 35 6Z" fill="var(--logo-2, #4F507F)" />
            <path d="M39 0L40.8849 10.3516C41.2759 12.4988 44.143 12.5684 44.6258 10.4424L45.7431 4.54182C45.7842 4.32506 46.0747 4.32948 46.11 4.5474L47.0502 10.3547C47.4675 12.4986 50.339 12.5261 50.7927 10.3906L53 0H51.0588L49.1166 9.9604C49.0748 10.1745 48.7885 10.1717 48.7505 9.9568L46.9863 0H45.0323L42.9663 9.9897C42.9221 10.2031 42.6362 10.1968 42.6003 9.98168L40.932 0H39Z" fill="var(--logo-2, #4F507F)" />
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
            calc(var(--gap-2) * var(--snowui-snow-ui-logo-scale))
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
            calc(var(--size-16) * var(--snowui-snow-ui-logo-scale))
        );
        height: var(
            --snowui-snow-ui-logo-icon-size-override,
            calc(var(--size-16) * var(--snowui-snow-ui-logo-scale))
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

    :global(:where(.snowui-snow-ui-logo-strip)),
    :global(:where(.snowui-snow-ui-logo-star)) {
        --snowui-snow-ui-logo-rest-angle: 0deg;
        transform-box: view-box;
        transform-origin: center;
        transform: rotate(var(--snowui-snow-ui-logo-rest-angle));
        animation-timing-function: var(
            --snowui-frame-loop-motion-easing,
            linear
        );
        animation-iteration-count: infinite;
        animation-direction: var(
            --snowui-frame-loop-motion-direction,
            normal
        );
        animation-fill-mode: both;
        animation-name: none;
        animation-play-state: var(
            --snowui-frame-loop-motion-play-state,
            running
        );
    }

    :global(:where(.snowui-snow-ui-logo[data-snow-ui-logo-cycle="active"]) :where(.snowui-snow-ui-logo-strip, .snowui-snow-ui-logo-star)) {
        animation-name: snowui-snow-ui-logo-rotation;
    }

    :global(:where(.snowui-snow-ui-logo-strip-1)) {
        --snowui-snow-ui-logo-angle-360: var(
            --snowui-snow-ui-logo-test-strip-12-turn,
            360deg
        );
        animation-duration: calc(
            var(--snowui-frame-loop-motion-duration, 1s)
            * var(--snowui-snow-ui-logo-test-strip-12-duration-factor, 10)
        );
    }

    :global(:where(.snowui-snow-ui-logo-strip-2)) {
        --snowui-snow-ui-logo-angle-360: var(
            --snowui-snow-ui-logo-test-strip-12-turn,
            360deg
        );
        animation-duration: calc(
            var(--snowui-frame-loop-motion-duration, 1s)
            * var(--snowui-snow-ui-logo-test-strip-12-duration-factor, 10)
        );
    }

    :global(:where(.snowui-snow-ui-logo-strip-3)) {
        --snowui-snow-ui-logo-angle-360: var(
            --snowui-snow-ui-logo-test-strip-34-turn,
            360deg
        );
        animation-duration: calc(
            var(--snowui-frame-loop-motion-duration, 1s)
            * var(--snowui-snow-ui-logo-test-strip-34-duration-factor, 10)
        );
    }

    :global(:where(.snowui-snow-ui-logo-strip-4)) {
        --snowui-snow-ui-logo-angle-360: var(
            --snowui-snow-ui-logo-test-strip-34-turn,
            360deg
        );
        animation-duration: calc(
            var(--snowui-frame-loop-motion-duration, 1s)
            * var(--snowui-snow-ui-logo-test-strip-34-duration-factor, 10)
        );
    }

    :global(:where(.snowui-snow-ui-logo-star)) {
        --snowui-snow-ui-logo-angle-360: var(
            --snowui-snow-ui-logo-test-asterisk-turn,
            360deg
        );
        animation-duration: calc(
            var(--snowui-frame-loop-motion-duration, 1s)
            * var(
                --snowui-snow-ui-logo-test-asterisk-duration-factor,
                5
            )
        );
    }

    @keyframes snowui-snow-ui-logo-rotation {
        0% {
            transform: rotate(var(--snowui-snow-ui-logo-rest-angle));
        }
        100% {
            transform: rotate(calc(
                var(--snowui-snow-ui-logo-rest-angle)
                + var(--snowui-snow-ui-logo-angle-360)
            ));
        }
    }

    @media (prefers-reduced-motion: reduce) {
        :global(:where(.snowui-snow-ui-logo-strip)),
        :global(:where(.snowui-snow-ui-logo-star)) {
            animation: none;
        }
    }
</style>
