import { getContext } from "svelte";
import { FRAME_BREAKPOINTS_CONTEXT_KEY } from "../keys";
import { resizeManager } from "./observer.svelte";

export class FrameResponsive {
    containerWidth = $state(0);
    #breakpoints: Record<string, number>;

    constructor() {
        // 尝试从 Context 读取配置
        const config = getContext<Record<string, number> | undefined>(FRAME_BREAKPOINTS_CONTEXT_KEY);
        this.#breakpoints = config || {
            xs: 640,
            sm: 768,
            md: 1024,
            lg: 1280,
            xl: 1536,
            "2xl": 99999
        };
    }

    get breakpoint() {
        const w = this.containerWidth;
        const b = this.#breakpoints;

        if (w < b.xs) return "xs";
        if (w < b.sm) return "sm"; // xs < w < sm
        // Wait, standard tailwind logic: 
        // sm: 640px (min-width). 
        // SnowUI implementation was: if (this.containerWidth < 640) return "xs";
        // This means "xs" range is < 640.
        // "sm" range is 640 <= w < 768.
        // The previous code was:
        // if (this.containerWidth < 640) return "xs";
        // if (this.containerWidth < 768) return "sm";

        // My new logic should follow:
        if (w < b.xs) return "xs";
        if (w < b.sm) return "sm";
        if (w < b.md) return "md";
        if (w < b.lg) return "lg";
        if (w < b.xl) return "xl";
        return "2xl";
    }

    resizeObserver = (node: HTMLElement) => {
        const unwatch = resizeManager.watch(node, (entry) => {
            this.containerWidth = entry.contentRect.width;
        });

        // 初始化宽度
        this.containerWidth = node.getBoundingClientRect().width;

        return {
            destroy: unwatch,
        };
    };
}
