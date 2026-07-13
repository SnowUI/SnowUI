/**
 * 几何信息缓存工具
 * v1.0.0
 * 
 * 用于缓存元素的 getBoundingClientRect() 结果，
 * 避免在动效编排的 visual-* 排序中频繁调用导致性能问题。
 */

// 缓存存储：使用 WeakMap 允许元素被 GC 回收
const cache = new WeakMap<Element, { rect: DOMRect; timestamp: number }>();

// 缓存有效期（毫秒）
const DEFAULT_TTL = 100;

/**
 * 获取缓存的元素位置信息
 * 如果缓存过期或不存在，则重新获取并缓存
 * 
 * @param el - 目标元素
 * @param ttl - 缓存有效期（毫秒），默认 100ms
 * @returns 元素的 DOMRect
 */
export function getCachedRect(el: Element, ttl: number = DEFAULT_TTL): DOMRect {
    const cached = cache.get(el);
    const now = Date.now();

    if (cached && now - cached.timestamp < ttl) {
        return cached.rect;
    }

    const rect = el.getBoundingClientRect();
    cache.set(el, { rect, timestamp: now });
    return rect;
}

/**
 * 批量获取多个元素的位置信息
 * 对于同批次的元素，共享同一时间戳避免重复计算
 * 
 * @param elements - 元素数组
 * @returns 位置信息映射
 */
export function batchGetRects(elements: Element[]): Map<Element, DOMRect> {
    const result = new Map<Element, DOMRect>();
    const now = Date.now();

    for (const el of elements) {
        const cached = cache.get(el);

        if (cached && now - cached.timestamp < DEFAULT_TTL) {
            result.set(el, cached.rect);
        } else {
            const rect = el.getBoundingClientRect();
            cache.set(el, { rect, timestamp: now });
            result.set(el, rect);
        }
    }

    return result;
}

/**
 * 使缓存失效
 * 在布局变化后调用，强制下次获取时重新计算
 * 
 * @param el - 目标元素，如不传则清空所有缓存
 */
export function invalidateCache(el?: Element): void {
    if (el) {
        cache.delete(el);
    }
    // 注意：WeakMap 不支持 clear()，如需清空所有缓存，
    // 需要跟踪所有元素或重新创建 WeakMap（不推荐）
}

/**
 * 使用 IntersectionObserver 延迟获取位置
 * 仅当元素可见时才计算位置，用于大列表优化
 * 
 * @param elements - 元素数组
 * @param callback - 位置计算完成后的回调
 * @param options - IntersectionObserver 选项
 */
export function lazyGetRects(
    elements: Element[],
    callback: (rects: Map<Element, DOMRect>) => void,
    options: IntersectionObserverInit = {}
): () => void {
    const rects = new Map<Element, DOMRect>();
    const pending = new Set(elements);

    const observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
            if (entry.isIntersecting && pending.has(entry.target)) {
                const rect = getCachedRect(entry.target);
                rects.set(entry.target, rect);
                pending.delete(entry.target);
                observer.unobserve(entry.target);
            }
        }

        // 所有元素都已处理完毕
        if (pending.size === 0) {
            observer.disconnect();
            callback(rects);
        }
    }, {
        threshold: 0.1,
        ...options
    });

    for (const el of elements) {
        observer.observe(el);
    }

    // 返回清理函数
    return () => {
        observer.disconnect();
    };
}
