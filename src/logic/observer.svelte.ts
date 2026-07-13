/**
 * 全局单例 ResizeObserver 管理器
 * 
 * ResizeObserver 是浏览器提供的原生 API，用于监听 DOM 元素尺寸的变化（如宽度、高度）。
 * 本管理器通过统一管理 ResizeObserver 实例，避免为每个组件单独创建观察者，
 * 从而显著减少浏览器资源开销，提升在大规模组件场景下的运行性能。
 */

type ResizeCallback = (entry: ResizeObserverEntry) => void;

class ResizeObserverManager {
    private static instance: ResizeObserverManager;
    private observer: ResizeObserver;
    private callbacks: Map<Element, Set<ResizeCallback>> = new Map();

    private constructor() {
        this.observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const elementCallbacks = this.callbacks.get(entry.target);
                if (elementCallbacks) {
                    elementCallbacks.forEach(cb => cb(entry));
                }
            }
        });
    }

    public static getInstance(): ResizeObserverManager {
        if (!ResizeObserverManager.instance) {
            ResizeObserverManager.instance = new ResizeObserverManager();
        }
        return ResizeObserverManager.instance;
    }

    public watch(node: Element, callback: ResizeCallback) {
        let elementCallbacks = this.callbacks.get(node);
        if (!elementCallbacks) {
            elementCallbacks = new Set();
            this.callbacks.set(node, elementCallbacks);
            this.observer.observe(node);
        }
        elementCallbacks.add(callback);

        return () => {
            elementCallbacks?.delete(callback);
            if (elementCallbacks?.size === 0) {
                this.callbacks.delete(node);
                this.observer.unobserve(node);
            }
        };
    }
}

export const resizeManager = ResizeObserverManager.getInstance();
