<!--
  Toaster 全局 Toast 容器
  v1.0.1

  职责：
  - 在 <body> 上挂载 6 个固定位置的 Toast 栈（Portal）
  - 订阅 `toastStore`，渲染、堆叠、自动消失
  - 与 toast() / dismissToast() / dismissAllToasts() 配套使用
  - 一个应用全局只放一个 <Toaster />

  叠加规则：参考 heroui，同一位置最多显示 3 层真实 Toast；
  最新一条最靠近视口边缘并完整呈现，其余向"内侧"堆叠。
  关闭时先进入 Frame `Disappear` 状态；其余 Toast 由槽位的 translate / scale / opacity 组合平滑前移。

  文档: ./Toast.md
-->

<script lang="ts">
  // SnowUI 许可入口：首次阅读源码请先读 ../../LICENSE；访问文件不代表获得修改或移植权，官方维护授权及同任务去重见该文件。
    import { onMount, onDestroy } from "svelte";
    import {
        composeMotionConfigs,
        createFadeMotion,
        createScaleMotion,
        createSlideYMotion,
    } from "../motion/primitives";
    import type { MotionConfig } from "../logic/motion-config";
    import {
        toastStore,
        dismissToast,
        pushOutToast,
        type ToastItem,
        type ToastPosition,
    } from "../logic/toast.svelte";
    import Toast from "./Toast.svelte";
    import {
        provideComponentParts,
        type ComponentPartsOf,
    } from "../logic/component-parts.svelte";

    interface Props {
        /** 视口边缘到 Toast 容器的距离，单位 px；默认 16（HeroUI bottom-4 / top-4） */
        offset?: number;
        /** 单个位置最多可见的 Toast 层数；默认 3 */
        maxVisible?: number;
        /** 单条 Toast 在堆叠方向上的偏移，单位 px；默认 8 */
        gap?: number;
        /** 堆叠方向上每层缩放系数 */
        scaleStep?: number;
        /** 堆叠方向上每层透明度衰减系数 */
        stackOpacityStep?: number;
        /** 堆叠后最低透明度 */
        stackMinOpacity?: number;
        /** 堆叠组合动效时长，单位 ms */
        stackDuration?: number;
        /** 堆叠组合动效缓动 */
        stackEasing?: string;
        /** Toast 区域宽度，单位 px 或 CSS 值；默认内容自适应 */
        width?: number | string;
        parts?: ComponentPartsOf<{ Toast: typeof Toast }>;
    }

    let {
        offset = 16,
        maxVisible = 3,
        gap = 8,
        scaleStep = 0.05,
        stackOpacityStep = 0.2,
        stackMinOpacity = 0.6,
        stackDuration = 300,
        stackEasing = "ease",
        width = undefined,
        parts = undefined,
    }: Props = $props();
    provideComponentParts(() => parts);

    const POSITIONS: ToastPosition[] = [
        "top",
        "top-left",
        "top-right",
        "bottom",
        "bottom-left",
        "bottom-right",
    ];
    const EXIT_OPACITY_RATIO = 0.8;

    let mounted = $state(false);
    let portalEl = $state<HTMLDivElement | undefined>(undefined);
    onMount(() => {
        mounted = true;
        if (portalEl && portalEl.parentNode !== document.body) {
            document.body.appendChild(portalEl);
        }
    });

    onDestroy(() => {
        if (portalEl && portalEl.parentNode === document.body) {
            document.body.removeChild(portalEl);
        }
    });

    // 按位置分组；新进入的项位于数组尾部，渲染时翻转使最新一条出现在最前
    const grouped = $derived.by(() => {
        const map = new Map<ToastPosition, ToastItem[]>();
        for (const pos of POSITIONS) map.set(pos, []);
        for (const item of toastStore.items) {
            const pos = item.position ?? "top";
            map.get(pos)!.push(item);
        }
        return map;
    });

    function toastAppearMotion(position: ToastPosition, stackOpacity: number): MotionConfig {
        return composeMotionConfigs(
            createSlideYMotion(position.startsWith("top") ? ["-100%", 0] : ["100%", 0]),
            createFadeMotion([EXIT_OPACITY_RATIO * stackOpacity, stackOpacity]),
            createScaleMotion([0.96, 1]),
            { duration: 300, easing: "ease" },
        );
    }

    function toastDisappearMotion(position: ToastPosition, stackOpacity: number): MotionConfig {
        return composeMotionConfigs(
            createSlideYMotion(position.startsWith("top") ? [0, "-100%"] : [0, "100%"]),
            createFadeMotion([stackOpacity, EXIT_OPACITY_RATIO * stackOpacity]),
            createScaleMotion([1, 0.96]),
            { duration: 300, easing: "ease" },
        );
    }

    function toastPushedOutMotion(position: ToastPosition, stackOpacity: number): MotionConfig {
        return composeMotionConfigs(
            createSlideYMotion(position.startsWith("top") ? [0, "-100%"] : [0, "100%"]),
            createFadeMotion([stackOpacity, EXIT_OPACITY_RATIO * stackOpacity]),
            createScaleMotion([1, 0.96]),
            { duration: 300, easing: "ease" },
        );
    }

    interface ToastTimer {
        handle: ReturnType<typeof setTimeout>;
        remaining: number;
        startedAt: number;
        paused: boolean;
    }

    // ── 自动消失定时器：跟踪剩余时间，支持 hover 暂停 / 恢复 ──────
    const timers = new Map<string, ToastTimer>();

    function clearToastTimer(id: string): void {
        const timer = timers.get(id);
        if (!timer) return;
        clearTimeout(timer.handle);
        timers.delete(id);
    }

    function startToastTimer(item: ToastItem, items: ToastItem[], duration: number): void {
        const startedAt = Date.now();
        const handle = setTimeout(() => {
            dismissToast(item.id, stackIndexForItem(item, items));
            timers.delete(item.id);
        }, duration);
        timers.set(item.id, {
            handle,
            remaining: duration,
            startedAt,
            paused: false,
        });
    }

    function pauseToastTimer(id: string): void {
        const timer = timers.get(id);
        if (!timer) return;
        if (timer.paused) return;
        clearTimeout(timer.handle);
        timer.remaining = Math.max(0, timer.remaining - (Date.now() - timer.startedAt));
        timer.paused = true;
        timers.set(id, timer);
    }

    function resumeToastTimer(item: ToastItem, items: ToastItem[]): void {
        if (item.exiting) return;
        const timer = timers.get(item.id);
        if (!timer) return;
        if (!timer.paused) return;
        clearTimeout(timer.handle);
        startToastTimer(item, items, timer.remaining);
    }

    function visibleStackItems(items: ToastItem[]): ToastItem[] {
        const limit = visibleLimit();
        return items.filter(
            (item) => !item.exiting && stackIndexForItem(item, items) < limit,
        );
    }

    function pauseToastStack(items: ToastItem[]): void {
        for (const item of visibleStackItems(items)) {
            pauseToastTimer(item.id);
        }
    }

    function resumeToastStack(items: ToastItem[]): void {
        for (const item of visibleStackItems(items)) {
            resumeToastTimer(item, items);
        }
    }

    $effect(() => {
        const liveIds = new Set<string>();
        for (const position of POSITIONS) {
            const items = grouped.get(position) ?? [];
            for (const item of items) {
                liveIds.add(item.id);
                if (item.exiting) continue;
                const dur = item.duration;
                if (dur === undefined || dur <= 0) continue;
                const timer = timers.get(item.id);
                if (timer) {
                    if (timer.paused && stackIndexForItem(item, items) > 0) {
                        resumeToastTimer(item, items);
                    }
                    continue;
                }
                startToastTimer(item, items, dur);
            }
        }
        // 清理已被外部移除的项
        for (const id of [...timers.keys()]) {
            if (!liveIds.has(id)) {
                clearToastTimer(id);
            }
        }
    });

    onDestroy(() => {
        for (const timer of timers.values()) clearTimeout(timer.handle);
        timers.clear();
    });

    function visibleLimit(): number {
        const limit = Math.floor(maxVisible);
        return Number.isFinite(limit) ? Math.max(1, limit) : 3;
    }

    $effect(() => {
        const limit = visibleLimit();
        for (const position of POSITIONS) {
            const items = grouped.get(position) ?? [];
            const activeItems = items.filter((item) => !item.exiting);
            const surplus = activeItems.length - limit;
            if (surplus <= 0) continue;
            for (const item of activeItems.slice(0, surplus)) {
                pushOutToast(item.id, limit - 1);
            }
        }
    });

    type ToastVisualState = "idle" | `stack-${number}` | "exiting" | "pushed-out";

    function stackIndexForItem(item: ToastItem, items: ToastItem[]): number {
        if (item.exiting) return item.exitFromIndex ?? 0;
        const activeItems = items.filter((candidate) => !candidate.exiting);
        const activeIndex = activeItems.indexOf(item);
        if (activeIndex === -1) return 0;
        return activeItems.length - 1 - activeIndex;
    }

    function visualState(item: ToastItem, indexFromFront: number): ToastVisualState {
        if (item.exitKind === "pushed-out") return "pushed-out";
        if (item.exiting) return "exiting";
        return indexFromFront === 0 ? "idle" : `stack-${indexFromFront}`;
    }

    function stackOpacityForIndex(indexFromFront: number): number {
        return Math.max(
            stackMinOpacity,
            1 - indexFromFront * stackOpacityStep,
        );
    }

    // 给单条 Toast 计算堆叠样式（最新→最老 0..n-1）
    function stackStyle(
        item: ToastItem,
        items: ToastItem[],
        position: ToastPosition,
    ): string {
        const indexFromFront = stackIndexForItem(item, items);
        const isTop = position.startsWith("top");
        const direction = isTop ? 1 : -1; // top: 后一条向下偏移；bottom: 向上
        // 退场残影修复：内层 FramePro 保持稳定的 ±100% 出入场动效；
        // 外层 slot 先抵消当前堆叠层位移，再额外越过可视边缘 20px。
        const exitDistance = indexFromFront * gap + offset + 20;
        const exitTranslate = item.exiting ? (isTop ? -exitDistance : exitDistance) : 0;
        const translate = direction * indexFromFront * gap + exitTranslate;
        const scale = Math.max(0, 1 - indexFromFront * scaleStep);
        const stackOpacity = stackOpacityForIndex(indexFromFront);
        const pointerStyle = item.exiting ? " pointer-events: none;" : "";
        const zIndex = item.exiting
            ? Math.max(0, visibleLimit() - indexFromFront)
            : visibleLimit() - indexFromFront + 1;
        const transitionName = item.id.replace(/[^a-zA-Z0-9]/g, "-");
        const widthStyle =
            width === undefined ? "" : ` width: ${typeof width === "number" ? `${width}px` : width};`;
        const duration = item.exiting ? 300 : stackDuration;
        return `view-transition-name: snowui-toast-${transitionName}; --snowui-toast-stack-translate-y: ${translate}px; --snowui-toast-stack-scale: ${scale}; --snowui-toast-stack-opacity: ${stackOpacity}; --snowui-toast-stack-duration: ${duration}ms; --snowui-toast-stack-easing: ${stackEasing};${pointerStyle}${widthStyle} z-index: ${zIndex};`;
    }

    function regionStyle(position: ToastPosition): string {
        const px = `${offset}px`;
        const resolvedWidth =
            typeof width === "number"
                ? `${width}px`
                : width ?? "max-content";
        const base = `--toast-width: ${resolvedWidth}; --snowui-toast-exit-offset: ${px};`;
        switch (position) {
            case "top":
                return `${base} top: ${px}; left: ${px}; right: ${px}; width: auto; margin-inline: auto;`;
            case "top-left":
                return `${base} top: ${px}; left: ${px};`;
            case "top-right":
                return `${base} top: ${px}; right: ${px};`;
            case "bottom":
                return `${base} bottom: ${px}; left: ${px}; right: ${px}; width: auto; margin-inline: auto;`;
            case "bottom-left":
                return `${base} bottom: ${px}; left: ${px};`;
            case "bottom-right":
                return `${base} bottom: ${px}; right: ${px};`;
        }
    }
</script>

{#if mounted}
    <div bind:this={portalEl} class="snowui-toaster" aria-live="polite" aria-atomic="false">
        {#each POSITIONS as position (position)}
            {@const items = grouped.get(position) ?? []}
            <div
                class="snowui-toaster-region snowui-toaster-region-{position}"
                data-pos={position}
                data-direction={position.startsWith("top") ? "top" : "bottom"}
                style={regionStyle(position)}
            >
                {#each items as item (item.id)}
                    {@const indexFromFront = stackIndexForItem(item, items)}
                    {@const frontmost = indexFromFront === 0}
                    {@const state = visualState(item, indexFromFront)}
                    {@const stackOpacity = stackOpacityForIndex(indexFromFront)}
                    {#key `${item.id}:${item.exiting ? item.exitKind ?? "dismiss" : "active"}`}
                    <Toast
                        class={`snowui-toaster-slot${item.class ? ` ${item.class}` : ""}`}
                        data-frontmost={frontmost && !item.exiting ? "true" : "false"}
                        data-state={state}
                        data-index={indexFromFront}
                        data-variant={item.variant ?? "default"}
                        data-size={item.size ?? "md"}
                        aria-hidden={frontmost && !item.exiting ? undefined : "true"}
                        tabindex={frontmost && !item.exiting ? 0 : -1}
                        style={`${stackStyle(item, items, position)}${item.style ?? ""}`}
                        onpointerenter={() => {
                            if (!item.exiting) pauseToastStack(items);
                        }}
                        onpointerleave={() => {
                            if (!item.exiting) resumeToastStack(items);
                        }}
                        enableResponsive={false}
                        enableContext={false}
                        enableScaleObserver={false}
                        currentState={item.exiting ? "Disappear" : "Appear"}
                        whileAppear={toastAppearMotion(position, stackOpacity)}
                        whileDisappear={item.exitKind === "pushed-out" ? toastPushedOutMotion(position, stackOpacity) : toastDisappearMotion(position, stackOpacity)}
                        positive={item.positive}
                        variant={item.variant}
                        size={item.size}
                        position={item.position}
                        onDismiss={() => dismissToast(item.id, indexFromFront)}
                    >
                        {#if item.leading}{@render item.leading()}{/if}
                        {#if item.children}
                            {@render item.children()}
                        {:else if item.text !== undefined}
                            <span>{item.text}</span>
                        {/if}
                        {#if item.trailing}{@render item.trailing()}{/if}
                    </Toast>
                    {/key}
                {/each}
            </div>
        {/each}
    </div>
{/if}

<style>
    /* Portal 根：fixed 全屏覆盖，但只让真正的 Toast 接收 pointer */
    :global(:where(.snowui-toaster)) {
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: 9999;
    }

    /* 6 个位置区域：列方向堆叠，单条 Toast 居中或贴边 */
    :global(:where(.snowui-toaster-region)) {
        position: absolute;
        display: block;
        width: var(--toast-width, max-content);
        max-width: calc(100vw - 2rem);
        pointer-events: none;
    }

    @media (max-width: 40rem) {
        :global(:where(.snowui-toaster-region)) {
            width: calc(100vw - 2rem);
        }
    }

    /* 单条 Toast 的卡槽：负责堆叠 transform 与 z-index */
    :global(:where(.snowui-toaster-slot)) {
        position: absolute;
        pointer-events: auto;
        width: var(--toast-width, max-content);
        transform-origin: 50% 50%;
        translate: 0 var(--snowui-toast-stack-translate-y, 0);
        scale: var(--snowui-toast-stack-scale, 1);
        opacity: var(--su-motion-opacity, var(--snowui-toast-stack-opacity, 1));
        transform: var(--su-motion-transform, none);
        transition:
            var(--su-motion-transition, transform 300ms ease, opacity 300ms ease),
            translate var(--snowui-toast-stack-duration, 300ms) var(--snowui-toast-stack-easing, ease),
            scale var(--snowui-toast-stack-duration, 300ms) var(--snowui-toast-stack-easing, ease);
        will-change: transform, translate, scale, opacity;
    }

    :global(:where(.snowui-toaster-region[data-direction="top"] .snowui-toaster-slot)) {
        top: 0;
        left: 0;
    }

    :global(:where(.snowui-toaster-region[data-direction="bottom"] .snowui-toaster-slot)) {
        bottom: 0;
        left: 0;
    }

    :global(:where(.snowui-toaster-region-top .snowui-toaster-slot, .snowui-toaster-region-bottom .snowui-toaster-slot)) {
        left: 0;
        right: 0;
        margin-inline: auto;
    }

    :global(:where(.snowui-toaster-region-top-left .snowui-toaster-slot, .snowui-toaster-region-bottom-left .snowui-toaster-slot)) {
        left: 0;
    }

    :global(:where(.snowui-toaster-region-top-right .snowui-toaster-slot, .snowui-toaster-region-bottom-right .snowui-toaster-slot)) {
        right: 0;
        left: auto;
    }

</style>
