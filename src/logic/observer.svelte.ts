/* SnowUI source notice | LICENSE 2.1.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
/**
 * 全局单例 ResizeObserver 管理器
 * 
 * ResizeObserver 是浏览器提供的原生 API，用于监听 DOM 元素尺寸的变化（如宽度、高度）。
 * 本管理器通过统一管理 ResizeObserver 实例，避免为每个组件单独创建观察者，
 * 从而显著减少浏览器资源开销，提升在大规模组件场景下的运行性能。
 */

type ResizeCallback = (entry: ResizeObserverEntry) => void;

class ResizeObserverManager {
    private static instance: ResizeObserverManager | undefined;
    private observer: ResizeObserver;
    private callbacks: Map<Element, Set<ResizeCallback>> = new Map();
    private pendingEntries: Map<Element, ResizeObserverEntry> = new Map();
    private deliveryFrame: number | undefined;
    private deliveryTimer: ReturnType<typeof globalThis.setTimeout> | undefined;

    private constructor() {
        this.observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                this.pendingEntries.set(entry.target, entry);
            }
            this.scheduleDelivery();
        });
    }

    public static getInstance(): ResizeObserverManager {
        if (!ResizeObserverManager.instance) {
            ResizeObserverManager.instance = new ResizeObserverManager();
        }
        return ResizeObserverManager.instance;
    }

    private static release(instance: ResizeObserverManager) {
        if (
            ResizeObserverManager.instance === instance &&
            instance.callbacks.size === 0
        ) {
            instance.destroy();
            ResizeObserverManager.instance = undefined;
        }
    }

    private scheduleDelivery() {
        if (this.deliveryFrame !== undefined || this.deliveryTimer !== undefined) return;

        const requestFrame = globalThis.requestAnimationFrame;
        if (typeof requestFrame === "function") {
            this.deliveryFrame = requestFrame(() => this.flush());
            return;
        }

        this.deliveryTimer = globalThis.setTimeout(() => this.flush(), 0);
    }

    private flush() {
        this.deliveryFrame = undefined;
        this.deliveryTimer = undefined;
        const entries = Array.from(this.pendingEntries.values());
        this.pendingEntries.clear();

        for (const entry of entries) {
            const elementCallbacks = this.callbacks.get(entry.target);
            if (!elementCallbacks) continue;
            for (const callback of Array.from(elementCallbacks)) callback(entry);
        }
    }

    private destroy() {
        if (
            this.deliveryFrame !== undefined &&
            typeof globalThis.cancelAnimationFrame === "function"
        ) {
            globalThis.cancelAnimationFrame(this.deliveryFrame);
        }
        if (this.deliveryTimer !== undefined) {
            globalThis.clearTimeout(this.deliveryTimer);
        }
        this.deliveryFrame = undefined;
        this.deliveryTimer = undefined;
        this.pendingEntries.clear();
        this.observer.disconnect();
    }

    public watch(node: Element, callback: ResizeCallback) {
        let elementCallbacks = this.callbacks.get(node);
        if (!elementCallbacks) {
            elementCallbacks = new Set();
            this.observer.observe(node);
            this.callbacks.set(node, elementCallbacks);
        }
        elementCallbacks.add(callback);

        let active = true;
        return () => {
            if (!active) return;
            active = false;
            elementCallbacks?.delete(callback);
            if (elementCallbacks?.size === 0) {
                this.callbacks.delete(node);
                this.observer.unobserve(node);
            }
            ResizeObserverManager.release(this);
        };
    }
}

const noop = () => {};

/**
 * 延迟创建浏览器原生 ResizeObserver。
 *
 * 组件模块会在 SSR 阶段被导入；此时不得读取或实例化浏览器 API。
 * 浏览器不支持 ResizeObserver 或初始化失败时，仅关闭尺寸观察增强。
 */
export const resizeManager = {
    watch(node: Element, callback: ResizeCallback) {
        if (typeof ResizeObserver === "undefined") return noop;

        try {
            return ResizeObserverManager.getInstance().watch(node, callback);
        } catch {
            return noop;
        }
    },
};
