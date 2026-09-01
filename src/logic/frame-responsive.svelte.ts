import { getContext } from "svelte";
import { FRAME_BREAKPOINTS_CONTEXT_KEY } from "../keys";
import { resizeManager } from "./observer.svelte";
import type {
    FrameProps,
    FrameResponsivePaddingMinimum,
    FrameResponsiveProps,
} from "./frame-types";

const DEFAULT_MIN_SPACING = 4;
// DOMRect / scrollWidth 混合测量会产生不足 1px 的取整差，不能把它当作真实溢出。
const EPSILON = 1;

interface InlineStyleSnapshot {
    value: string;
    priority: string;
}

function snapshotStyle(
    node: HTMLElement,
    property: string,
): InlineStyleSnapshot {
    return {
        value: node.style.getPropertyValue(property),
        priority: node.style.getPropertyPriority(property),
    };
}

function restoreStyle(
    node: HTMLElement,
    property: string,
    snapshot: InlineStyleSnapshot,
) {
    if (snapshot.value) {
        node.style.setProperty(property, snapshot.value, snapshot.priority);
    } else {
        node.style.removeProperty(property);
    }
}

function px(value: string): number {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 0;
}

function lerpToFloor(preferred: number, floor: number, ratio: number) {
    return preferred - (preferred - floor) * ratio;
}

function resolveFloor(preferred: number, configured?: number) {
    if (preferred <= 0) return 0;
    return Math.min(preferred, Math.max(0, configured ?? DEFAULT_MIN_SPACING));
}

type PaddingSide = "top" | "right" | "bottom" | "left";

function resolvePaddingMinimum(
    configured: number | FrameResponsivePaddingMinimum | undefined,
    side: PaddingSide,
) {
    if (typeof configured === "number") return configured;
    if (!configured) return DEFAULT_MIN_SPACING;
    const axis = side === "left" || side === "right" ? configured.x : configured.y;
    return configured[side] ?? axis ?? configured.all ?? DEFAULT_MIN_SPACING;
}

function resolvePaddingFloor(
    preferred: number,
    configured: number | FrameResponsivePaddingMinimum | undefined,
    side: PaddingSide,
) {
    return resolveFloor(preferred, resolvePaddingMinimum(configured, side));
}

function isMeasurableChild(node: Element): node is HTMLElement {
    if (!(node instanceof HTMLElement)) return false;
    const style = getComputedStyle(node);
    return (
        style.display !== "none" &&
        style.position !== "absolute" &&
        style.position !== "fixed"
    );
}

function measurePreferredChildWidth(child: HTMLElement, style: CSSStyleDeclaration) {
    const flexGrow = Number.parseFloat(style.flexGrow);
    if (!(flexGrow > 0)) {
        return Math.max(child.getBoundingClientRect().width, child.scrollWidth);
    }

    const snapshots = {
        flex: snapshotStyle(child, "flex"),
        width: snapshotStyle(child, "width"),
        maxWidth: snapshotStyle(child, "max-width"),
    };
    child.style.setProperty("flex", "0 0 auto", "important");
    child.style.setProperty("width", "max-content", "important");
    child.style.setProperty("max-width", "none", "important");
    const width = Math.max(child.getBoundingClientRect().width, child.scrollWidth);
    restoreStyle(child, "flex", snapshots.flex);
    restoreStyle(child, "width", snapshots.width);
    restoreStyle(child, "max-width", snapshots.maxWidth);
    return width;
}

export class FrameResponsive {
    containerWidth = $state(0);
    fitActive = $state(false);
    #breakpoints: Record<string, number>;
    #getProps: () => FrameProps;
    #node: HTMLElement | null = null;
    #preferredWidth = 0;
    #originalStyles: Record<string, InlineStyleSnapshot> | null = null;

    constructor(getProps: () => FrameProps = () => ({})) {
        this.#getProps = getProps;
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

    bindProps(getProps: () => FrameProps) {
        this.#getProps = getProps;
    }

    get config(): FrameResponsiveProps | undefined {
        const responsive = this.#getProps().responsive;
        return responsive && typeof responsive === "object"
            ? responsive
            : undefined;
    }

    get fitDirection() {
        return this.fitActive ? this.config?.direction : undefined;
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

    #captureOriginalStyles(node: HTMLElement) {
        this.#originalStyles = Object.fromEntries(
            ["gap", "padding-top", "padding-right", "padding-bottom", "padding-left"].map(
                (property) => [property, snapshotStyle(node, property)],
            ),
        );
    }

    #restoreSpacing(node: HTMLElement) {
        if (!this.#originalStyles) return;
        for (const [property, snapshot] of Object.entries(this.#originalStyles)) {
            restoreStyle(node, property, snapshot);
        }
    }

    #applyFallbackAttributes(node: HTMLElement) {
        const config = this.config;
        if (!this.fitActive || !config) {
            node.removeAttribute("data-responsive-layout");
            node.removeAttribute("data-responsive-align");
            node.removeAttribute("data-responsive-justify");
            node.removeAttribute("data-responsive-children-width");
            node.removeAttribute("data-responsive-children-min-width");
            node.style.removeProperty("--snowui-frame-responsive-child-min-width");
            return;
        }

        node.setAttribute("data-responsive-layout", "true");
        const attributes = [
            ["data-responsive-align", config.align],
            ["data-responsive-justify", config.justify],
            ["data-responsive-children-width", config.childrenWidth],
        ] as const;
        for (const [name, value] of attributes) {
            if (value) node.setAttribute(name, value);
            else node.removeAttribute(name);
        }
        if (config.childrenMinWidth !== undefined) {
            node.setAttribute("data-responsive-children-min-width", "true");
            node.style.setProperty(
                "--snowui-frame-responsive-child-min-width",
                typeof config.childrenMinWidth === "number"
                    ? `${config.childrenMinWidth}px`
                    : config.childrenMinWidth,
            );
        } else {
            node.removeAttribute("data-responsive-children-min-width");
            node.style.removeProperty("--snowui-frame-responsive-child-min-width");
        }
    }

    #measure(node: HTMLElement, width: number) {
        if (width <= 0) return;
        this.containerWidth = width;

        if (
            this.fitActive &&
            this.#preferredWidth > 0 &&
            width + EPSILON < this.#preferredWidth
        ) {
            this.#restoreSpacing(node);
            const computed = getComputedStyle(node);
            const gap = px(computed.columnGap === "normal" ? "0" : computed.columnGap);
            const gapFloor = resolveFloor(gap, this.config?.minGap);
            node.style.setProperty("gap", `${gapFloor}px`);
            for (const side of ["top", "right", "bottom", "left"] as const) {
                const property = `padding${side[0].toUpperCase()}${side.slice(1)}` as keyof CSSStyleDeclaration;
                const preferred = px(computed[property] as string);
                node.style.setProperty(
                    `padding-${side}`,
                    `${resolvePaddingFloor(preferred, this.config?.minPadding, side)}px`,
                );
            }
            this.#applyFallbackAttributes(node);
            return;
        }

        this.fitActive = false;
        this.#restoreSpacing(node);
        this.#applyFallbackAttributes(node);

        const computed = getComputedStyle(node);
        const direction = computed.flexDirection;
        const isFlex =
            computed.display === "flex" || computed.display === "inline-flex";
        const isRow =
            isFlex && (direction === "row" || direction === "row-reverse");
        const children = Array.from(node.children).filter(isMeasurableChild);
        const gap = px(computed.columnGap === "normal" ? "0" : computed.columnGap);
        const padding = {
            top: px(computed.paddingTop),
            right: px(computed.paddingRight),
            bottom: px(computed.paddingBottom),
            left: px(computed.paddingLeft),
        };
        const childWidths = children.map((child) => {
            const childStyle = getComputedStyle(child);
            return (
                measurePreferredChildWidth(child, childStyle) +
                px(childStyle.marginLeft) +
                px(childStyle.marginRight)
            );
        });
        const contentWidth = isRow
            ? childWidths.reduce((total, childWidth) => total + childWidth, 0) +
              Math.max(0, children.length - 1) * gap
            : Math.max(0, ...childWidths);
        const preferredWidth = contentWidth + padding.left + padding.right;
        this.#preferredWidth = preferredWidth;

        if (preferredWidth <= width + EPSILON) return;

        const gapFloor = resolveFloor(gap, this.config?.minGap);
        const paddingFloor = {
            top: resolvePaddingFloor(
                padding.top,
                this.config?.minPadding,
                "top",
            ),
            right: resolvePaddingFloor(
                padding.right,
                this.config?.minPadding,
                "right",
            ),
            bottom: resolvePaddingFloor(
                padding.bottom,
                this.config?.minPadding,
                "bottom",
            ),
            left: resolvePaddingFloor(
                padding.left,
                this.config?.minPadding,
                "left",
            ),
        };
        const horizontalGapCount = isRow ? Math.max(0, children.length - 1) : 0;
        const horizontalCapacity =
            (gap - gapFloor) * horizontalGapCount +
            (padding.left - paddingFloor.left) +
            (padding.right - paddingFloor.right);
        const shortage = preferredWidth - width;
        const compressionRatio = horizontalCapacity > 0
            ? Math.min(1, shortage / horizontalCapacity)
            : 1;

        if (gap > gapFloor) {
            node.style.setProperty("gap", `${lerpToFloor(gap, gapFloor, compressionRatio)}px`);
        }
        for (const side of ["top", "right", "bottom", "left"] as const) {
            if (padding[side] > paddingFloor[side]) {
                node.style.setProperty(
                    `padding-${side}`,
                    `${lerpToFloor(padding[side], paddingFloor[side], compressionRatio)}px`,
                );
            }
        }

        if (shortage > horizontalCapacity + EPSILON && this.config) {
            this.fitActive = true;
            this.#applyFallbackAttributes(node);
        }
    }

    refresh = () => {
        if (!this.#node) return;
        this.#measure(this.#node, this.#node.getBoundingClientRect().width);
    };

    resizeObserver = (node: HTMLElement) => {
        this.#node = node;
        this.#captureOriginalStyles(node);
        const unwatch = resizeManager.watch(node, () => {
            // 使用 border-box 与子项 + padding 的需求宽度保持同一口径。
            this.#measure(node, node.getBoundingClientRect().width);
        });

        // 初始化宽度
        this.#measure(node, node.getBoundingClientRect().width);

        return {
            destroy: () => {
                unwatch();
                this.fitActive = false;
                this.#restoreSpacing(node);
                this.#applyFallbackAttributes(node);
                this.#node = null;
            },
        };
    };
}
