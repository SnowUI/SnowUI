import { resizeManager } from "./observer.svelte";

export type ContinuousHoverAxis = "x" | "y" | "xy";

export interface ContinuousHoverOptions {
    selector: string;
    layerClass?: string;
    axis?: ContinuousHoverAxis;
    enabled?: boolean;
    overlayHost?: HTMLElement;
    /** 是否让 data-active="true" 项驱动同一视觉层（Listbox 键盘高亮场景）。 */
    followActive?: boolean;
    /** 连续排列且 pointer 总能直接命中 item 时，可关闭全量几何缓存与逐项 ResizeObserver。 */
    geometryMode?: "all" | "direct";
    /** 命中或更接近该选择器时隐藏共享层，不把该区域及其相邻空隙推断为 item。 */
    blockedSelector?: string;
}

type MeasuredItem = {
    element: HTMLElement;
    rect: DOMRect;
};

function isEligibleItem(element: HTMLElement): boolean {
    return !(
        element.matches(
            '[aria-disabled="true"], [disabled], [data-disabled="true"], [data-filtered="true"], [data-skeleton="true"], [data-loading-spinner="true"], [aria-hidden="true"]',
        ) || element.hidden
    );
}

/**
 * 容器级连续 hover 控制器。
 * 一个容器只创建一个视觉层，并在候选项之间移动，避免逐项 hover 背景闪断。
 */
export class ContinuousHoverController {
    private host?: HTMLElement;
    private overlayHost?: HTMLElement;
    private layer?: HTMLDivElement;
    private selector = "";
    private closestSelector = "";
    private layerClass = "";
    private axis: ContinuousHoverAxis = "xy";
    private enabled = true;
    private followActive = false;
    private geometryMode: "all" | "direct" = "all";
    private blockedSelector = "";
    private activeItem?: HTMLElement;
    private items: HTMLElement[] = [];
    private measuredItems: MeasuredItem[] = [];
    private frame = 0;
    private geometryDirty = false;
    private pendingPointer?: {
        x: number;
        y: number;
        directItem?: HTMLElement;
        blocked?: boolean;
    };
    private cleanups: Array<() => void> = [];
    private itemResizeCleanups: Array<() => void> = [];

    attach(host: HTMLElement, options: ContinuousHoverOptions): () => void {
        this.destroy();
        this.host = host;
        this.overlayHost = options.overlayHost ?? host;
        this.selector = options.selector;
        this.closestSelector = options.selector.replace(
            /^:scope\s*>\s*/,
            "",
        );
        this.layerClass = options.layerClass ?? "";
        this.axis = options.axis ?? "xy";
        this.enabled = options.enabled ?? true;
        this.followActive = options.followActive ?? false;
        this.geometryMode = options.geometryMode ?? "all";
        this.blockedSelector = options.blockedSelector ?? "";

        if (this.enabled) this.ensureLayer();

        const onPointerMove = (event: PointerEvent) => {
            if (event.pointerType === "touch") return;
            this.pendingPointer = {
                x: event.clientX,
                y: event.clientY,
                directItem: this.resolveItem(event.target),
                blocked: this.resolveBlocked(event.target),
            };
            this.requestFrame();
        };
        const onPointerLeave = () => {
            this.pendingPointer = undefined;
            this.clearOrRestoreActive();
        };
        const onFocusIn = (event: FocusEvent) => {
            const item = this.resolveItem(event.target);
            if (item) this.moveTo(item);
        };
        const onFocusOut = (event: FocusEvent) => {
            if (
                event.relatedTarget instanceof Node &&
                this.host?.contains(event.relatedTarget)
            ) return;
            this.clearOrRestoreActive();
        };
        const onScroll = () => {
            this.requestGeometryRefresh();
        };

        host.addEventListener("pointermove", onPointerMove);
        host.addEventListener("pointerleave", onPointerLeave);
        host.addEventListener("focusin", onFocusIn);
        host.addEventListener("focusout", onFocusOut);
        host.addEventListener("scroll", onScroll, true);
        const mutationObserver = new MutationObserver((mutations) => {
            this.refresh();
            if (
                this.followActive &&
                mutations.some(
                    (mutation) =>
                        mutation.type === "attributes" &&
                        mutation.attributeName === "data-active",
                )
            ) {
                this.syncActiveItem();
            }
        });
        mutationObserver.observe(host, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: [
                "aria-disabled",
                "aria-hidden",
                "data-disabled",
                "data-filtered",
                "data-skeleton",
                "data-loading-spinner",
                "data-active",
                "hidden",
            ],
        });
        this.cleanups.push(
            () => host.removeEventListener("pointermove", onPointerMove),
            () => host.removeEventListener("pointerleave", onPointerLeave),
            () => host.removeEventListener("focusin", onFocusIn),
            () => host.removeEventListener("focusout", onFocusOut),
            () => host.removeEventListener("scroll", onScroll, true),
            () => mutationObserver.disconnect(),
            resizeManager.watch(host, () => this.refresh()),
            resizeManager.watch(this.overlayHost, () => this.refresh()),
        );
        this.updateItems();
        this.measureItems();
        this.syncEnabledState();
        if (this.followActive) queueMicrotask(() => this.syncActiveItem());
        return () => this.destroy();
    }

    setEnabled(enabled: boolean) {
        if (this.enabled === enabled) return;
        this.enabled = enabled;
        if (enabled) this.ensureLayer();
        this.syncEnabledState();
        if (!enabled) {
            this.clear();
            this.layer?.remove();
            this.layer = undefined;
        }
    }

    refresh() {
        this.updateItems();
        this.measureItems();
        this.remeasureActive();
    }

    destroy() {
        cancelAnimationFrame(this.frame);
        this.frame = 0;
        this.geometryDirty = false;
        this.pendingPointer = undefined;
        this.clear();
        this.cleanups.splice(0).forEach((cleanup) => cleanup());
        this.itemResizeCleanups.splice(0).forEach((cleanup) => cleanup());
        this.layer?.remove();
        this.host?.removeAttribute("data-continuous-hover-enabled");
        this.overlayHost?.removeAttribute("data-continuous-hover-overlay-host");
        this.host = undefined;
        this.overlayHost = undefined;
        this.layer = undefined;
        this.items = [];
        this.measuredItems = [];
    }

    private syncEnabledState() {
        if (!this.host || !this.overlayHost) return;
        if (this.enabled) {
            this.host.dataset.continuousHoverEnabled = "true";
            this.overlayHost.dataset.continuousHoverOverlayHost = "true";
        } else {
            this.host.removeAttribute("data-continuous-hover-enabled");
            this.overlayHost.removeAttribute("data-continuous-hover-overlay-host");
        }
    }

    private ensureLayer() {
        if (this.layer || !this.overlayHost) return;
        const layer = document.createElement("div");
        layer.className = ["snowui-continuous-hover-layer", this.layerClass]
            .filter(Boolean)
            .join(" ");
        layer.setAttribute("aria-hidden", "true");
        this.layer = layer;
        this.overlayHost.append(layer);
    }

    private collectItems(): HTMLElement[] {
        if (!this.host) return [];
        return Array.from(this.host.querySelectorAll<HTMLElement>(this.selector))
            .filter((item) => this.host?.contains(item) && isEligibleItem(item));
    }

    private resolveItem(target: EventTarget | null): HTMLElement | undefined {
        if (!(target instanceof Element) || !this.host) return undefined;
        const item = target.closest<HTMLElement>(this.closestSelector);
        return item && this.items.includes(item) && isEligibleItem(item)
            ? item
            : undefined;
    }

    private resolveBlocked(target: EventTarget | null): boolean {
        if (!(target instanceof Element) || !this.host || !this.blockedSelector) {
            return false;
        }
        const blocker = target.closest(this.blockedSelector);
        return !!blocker && this.host.contains(blocker);
    }

    private updateFromPoint(x: number, y: number) {
        if (!this.enabled || !this.host) return;
        if (this.geometryMode === "direct") return this.clear();
        if (this.measuredItems.length === 0) return this.clear();

        let nearest: HTMLElement | undefined;
        let nearestDistance = Number.POSITIVE_INFINITY;
        for (const { element, rect } of this.measuredItems) {
            const distance = this.distanceToRect(x, y, rect);
            if (distance < nearestDistance) {
                nearestDistance = distance;
                nearest = element;
            }
        }
        if (this.isBlockerNearest(x, y, nearestDistance)) {
            this.clear();
            return;
        }
        if (nearest) {
            const rect = this.measuredItems.find(
                ({ element }) => element === nearest,
            )?.rect;
            this.moveTo(nearest, rect);
        }
    }

    private distanceToRect(x: number, y: number, rect: DOMRect) {
        const dx =
            this.axis === "y"
                ? 0
                : x < rect.left
                  ? rect.left - x
                  : x > rect.right
                    ? x - rect.right
                    : 0;
        const dy =
            this.axis === "x"
                ? 0
                : y < rect.top
                  ? rect.top - y
                  : y > rect.bottom
                    ? y - rect.bottom
                    : 0;
        return dx * dx + dy * dy;
    }

    private isBlockerNearest(
        x: number,
        y: number,
        nearestItemDistance: number,
    ) {
        if (!this.host || !this.blockedSelector) return false;
        return Array.from(
            this.host.querySelectorAll<HTMLElement>(this.blockedSelector),
        ).some((blocker) => {
            const rect = blocker.getBoundingClientRect();
            if (rect.width <= 0 || rect.height <= 0) return false;
            return this.distanceToRect(x, y, rect) <= nearestItemDistance;
        });
    }

    private moveTo(item: HTMLElement, measuredRect?: DOMRect) {
        if (!this.enabled || !this.layer || !this.overlayHost) return;
        const wasVisible = this.layer.dataset.visible === "true";
        this.activeItem = item;
        const itemRect = measuredRect ?? item.getBoundingClientRect();
        const hostRect = this.overlayHost.getBoundingClientRect();
        this.layer.style.setProperty(
            "--snowui-continuous-hover-x",
            `${itemRect.left - hostRect.left + this.overlayHost.scrollLeft}px`,
        );
        this.layer.style.setProperty(
            "--snowui-continuous-hover-y",
            `${itemRect.top - hostRect.top + this.overlayHost.scrollTop}px`,
        );
        this.layer.style.setProperty(
            "--snowui-continuous-hover-width",
            `${itemRect.width}px`,
        );
        this.layer.style.setProperty(
            "--snowui-continuous-hover-height",
            `${itemRect.height}px`,
        );
        if (wasVisible) {
            this.layer.removeAttribute("data-instant");
            this.layer.dataset.visible = "true";
        } else {
            this.layer.dataset.instant = "true";
            this.layer.dataset.visible = "true";
            requestAnimationFrame(() =>
                this.layer?.removeAttribute("data-instant"),
            );
        }
    }

    private remeasureActive() {
        if (
            !this.activeItem ||
            !this.activeItem.isConnected ||
            !this.items.includes(this.activeItem) ||
            !isEligibleItem(this.activeItem)
        ) {
            return this.clearOrRestoreActive();
        }
        this.moveTo(this.activeItem);
    }

    private clear() {
        this.activeItem = undefined;
        this.layer?.removeAttribute("data-visible");
        this.layer?.removeAttribute("data-instant");
    }

    private clearOrRestoreActive() {
        if (this.followActive && this.syncActiveItem()) return;
        this.clear();
    }

    private syncActiveItem(): boolean {
        if (!this.enabled) return false;
        const active = this.items.find(
            (item) => item.dataset.active === "true",
        );
        if (!active) return false;
        this.moveTo(active);
        return true;
    }

    private requestFrame() {
        if (this.frame) return;
        this.frame = requestAnimationFrame(() => {
            this.frame = 0;
            if (this.geometryDirty) {
                this.geometryDirty = false;
                this.measureItems();
            }

            const pointer = this.pendingPointer;
            this.pendingPointer = undefined;
            if (pointer) {
                if (pointer.blocked) {
                    this.clear();
                    return;
                }
                const directItem = pointer.directItem;
                if (directItem?.isConnected && isEligibleItem(directItem)) {
                    // 直接命中必须使用当帧真实几何，避免布局变化后缓存尚未刷新。
                    this.moveTo(directItem, directItem.getBoundingClientRect());
                } else {
                    // 间隙命中才扫描集合，并在扫描前刷新位置，避免祖先位移未触发 ResizeObserver。
                    if (this.geometryMode === "all") this.measureItems();
                    this.updateFromPoint(pointer.x, pointer.y);
                }
                return;
            }

            this.remeasureActive();
        });
    }

    private requestGeometryRefresh() {
        this.geometryDirty = true;
        this.requestFrame();
    }

    private updateItems() {
        const nextItems = this.collectItems();
        const itemsChanged =
            nextItems.length !== this.items.length ||
            nextItems.some((item, index) => item !== this.items[index]);
        if (!itemsChanged) return;

        this.items = nextItems;
        this.itemResizeCleanups.splice(0).forEach((cleanup) => cleanup());
        if (this.geometryMode === "all") {
            for (const item of this.items) {
                this.itemResizeCleanups.push(
                    resizeManager.watch(item, () =>
                        this.requestGeometryRefresh(),
                    ),
                );
            }
        }
    }

    private measureItems() {
        if (this.geometryMode === "direct") {
            this.measuredItems = [];
            return;
        }
        this.measuredItems = this.items
            .filter((item) => item.isConnected && isEligibleItem(item))
            .map((element) => ({
                element,
                rect: element.getBoundingClientRect(),
            }));
    }
}
