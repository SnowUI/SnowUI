/* SnowUI source notice | LICENSE 2.3.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
// 动效编排器核心逻辑（Motion Orchestrator）
// v1.3.1
// 变更记录 (2026-02-03): 移除未使用类型与参数

import { setContext } from "svelte";
import { MOTION_ORCHESTRATOR_CONTEXT_KEY } from "../keys";

/**
 * Motion Orchestrator
 * 动效编排器：负责统一管理页面内的动效时间轴与联动。
 * v1.3.1
 */

import { Timeline } from "./timeline.svelte";
import type {
    MotionRegistration,
    MotionEvent,
    RegisterGroupOptions,
    LayoutTransitionOptions
} from "./motion-types";

import {
    getWhileAppearConfig,
    applyAppearAnimation,
    applyReverseAnimation
} from "./motion-engine";

import {
    playForward,
    playReverse,
    resetGroup
} from "./motion-orchestration";

// Re-export types for consumers
export * from "./motion-types";

interface ElementGroup {
    id: string;
    elements: HTMLElement[];
    options: RegisterGroupOptions;
    isPlaying: boolean;
    completedCount: number;
}

export class Motion {
    // 注册表：存储所有活跃的动效节点
    private registry = new Map<string, MotionRegistration>();

    // 订阅表：sourceId -> Set<callback>
    private subscriptions = new Map<string, Set<(event: MotionEvent, payload?: any) => void>>();

    // 时间轴管理器：id -> Timeline
    private timelines = new Map<string, Timeline>();

    // 元素组：groupId -> ElementGroup
    private elementGroups = new Map<string, ElementGroup>();

    // 共享元素注册表：layoutId -> DOMRect (Last known position)
    private layoutRegistry = new Map<string, DOMRect>();

    constructor() {
        // Singleton per context scope
    }

    captureLayout(layoutId: string, elementOrRect?: HTMLElement | DOMRect) {
        if (!layoutId || !elementOrRect) return;
        const rect =
            elementOrRect instanceof HTMLElement
                ? elementOrRect.getBoundingClientRect()
                : elementOrRect;
        if (rect.width <= 0 || rect.height <= 0) return;
        this.layoutRegistry.set(layoutId, rect);
    }

    playLayoutTo(
        layoutId: string,
        element: HTMLElement | undefined,
        target: HTMLElement | DOMRect | undefined,
        options?: LayoutTransitionOptions
    ) {
        if (!layoutId || !element || !target) {
            options?.onComplete?.();
            return;
        }

        const fromRect = element.getBoundingClientRect();
        const toRect =
            target instanceof HTMLElement ? target.getBoundingClientRect() : target;

        this.captureLayout(layoutId, fromRect);
        this.applyLayoutTransition(element, fromRect, toRect, options, "exit");
    }

    /**
     * 注册动效节点
     */
    register(registration: MotionRegistration) {
        if (this.registry.has(registration.id)) {
            console.warn(`[Motion] Duplicate motion ID: ${registration.id}`);
        }
        this.registry.set(registration.id, registration);

        // 处理时间轴注册
        if (registration.timeline) {
            const parts = registration.timeline.split(",").map(p => p.trim());
            parts.forEach(part => {
                // 支持 "timeline:intro:1" 或 "intro:1" 或 "intro:1:loop"
                const segments = part.split(":");
                let tlId = segments[0];
                let orderIdx = 1;

                if (tlId === "timeline" && segments.length > 1) {
                    tlId = segments[1];
                    orderIdx = 2;
                }

                const order = parseInt(segments[orderIdx], 10);
                if (tlId && !isNaN(order)) {
                    this.getOrCreateTimeline(tlId).addNode({
                        motionId: registration.id,
                        order
                    });
                }
            });
        }

        // 处理滚动联动注册
        if (registration.scroll && registration.element) {
            this.setupScrollLink(registration.id, registration.element, registration.scroll);
        }

        // 处理共享元素转场 (Shared Element Transition)
        if (registration.layoutId && registration.element) {
            this.handleLayoutMount(registration.layoutId, registration.element);
        }

        return () => {
            if (registration.timeline) {
                const parts = registration.timeline.split(",").map(p => p.trim());
                parts.forEach(part => {
                    const [tlId] = part.split(":");
                    this.timelines.get(tlId)?.removeNode(registration.id);
                });
            }

            // 保存共享元素状态
            if (registration.layoutId && registration.element) {
                this.layoutRegistry.set(registration.layoutId, registration.element.getBoundingClientRect());
            }

            // 清理滚动监听
            this.registry.delete(registration.id);
        };
    }

    /**
     * 注册元素组 (用于调用方提供的元素组)
     */
    registerGroup(id: string, elements: HTMLElement[], options?: RegisterGroupOptions) {
        this.elementGroups.set(id, {
            id,
            elements,
            options: options || {},
            isPlaying: false,
            completedCount: 0
        });

        // 立即应用初始状态 (如果有)
        // 注意：这里暂时不自动应用，由 play 触发，或者需要额外的初始化逻辑

        return () => {
            this.elementGroups.delete(id);
        };
    }

    /**
     * 播放元素组
     */
    private playElementGroup(group: ElementGroup, options?: { reverse?: boolean }) {
        const { elements, options: groupOptions } = group;
        const {
            orchestrateMode = 'sequential',
            orchestrateDelay = 100,
            orchestrateOrder = 'ltr',
            whileAppear
        } = groupOptions || {};

        const isReverse = options?.reverse;

        let targetElements = [...elements];

        // 处理顺序
        if (orchestrateOrder === 'rtl') {
            targetElements.reverse();
        } else if (orchestrateOrder === 'center') {
            // 简单的从中间向两边排序 (Center -> Edges)
            // 实际需要更复杂的计算，这里简化实现
            const mid = Math.floor(targetElements.length / 2);
            const left = targetElements.slice(0, mid).reverse();
            const right = targetElements.slice(mid);
            const centered: HTMLElement[] = [];
            const len = Math.max(left.length, right.length);
            for (let i = 0; i < len; i++) {
                if (i < right.length) centered.push(right[i]);
                if (i < left.length) centered.push(left[i]);
            }
            targetElements = centered;
        } else if (orchestrateOrder === 'random') {
            targetElements.sort(() => Math.random() - 0.5);
        }

        if (isReverse) {
            targetElements.reverse();
        }

        targetElements.forEach((el, index) => {
            const delay = orchestrateMode === 'parallel' ? 0 : index * orchestrateDelay;

            setTimeout(() => {
                if (isReverse) {
                    // Reverse typically means going back to initial state or disappearing
                    // Assuming similar logic to playReverse in motion-orchestration
                    // But we rely on element having whileAppear logic or explicit reverse config
                    // For now, let's use applyReverseAnimation if available
                    // We need to reconstruct config if passed via options
                    const config = whileAppear || getWhileAppearConfig(el);
                    if (config) applyReverseAnimation(el, config);
                } else {
                    const config = whileAppear || getWhileAppearConfig(el);
                    if (config) applyAppearAnimation(el, config);
                }
            }, delay);
        });
    }

    /**
     * 通知动效事件
     */
    notify(id: string, event: MotionEvent, payload?: any) {
        // 1. 触发自身的订阅者
        if (this.subscriptions.has(id)) {
            this.subscriptions.get(id)?.forEach(cb => cb(event, payload));
        }

        // 2. 触发注册的回调
        const reg = this.registry.get(id);
        if (reg?.onEvent) {
            reg.onEvent(event, payload);
        }

        // 3. 处理联动控制 (Linkage Control)
        // 如果 payload 包含 target 和 action，则触发目标组件
        if (payload && payload.target && payload.action) {
            const { target, action, reverse } = payload;
            if (action === 'play') {
                this.Play(target, { reverse });
            } else if (action === 'reset') {
                this.Reset(target);
            } else if (action === 'pause') {
                // TODO: Implement pause
            }
        }
    }

    /**
     * 处理共享元素挂载
     */
    private handleLayoutMount(layoutId: string, element: HTMLElement) {
        const prevRect = this.layoutRegistry.get(layoutId);
        if (prevRect) {
            requestAnimationFrame(() => {
                const currentRect = element.getBoundingClientRect();
                this.applyLayoutTransition(element, prevRect, currentRect, {
                    onComplete: () => this.layoutRegistry.delete(layoutId),
                });
            });
        }
    }

    private applyLayoutTransition(
        element: HTMLElement,
        fromRect: DOMRect,
        toRect: DOMRect,
        options?: LayoutTransitionOptions,
        direction: "enter" | "exit" = "enter"
    ) {
        if (
            fromRect.width <= 0 ||
            fromRect.height <= 0 ||
            toRect.width <= 0 ||
            toRect.height <= 0
        ) {
            options?.onComplete?.();
            return;
        }

        const timing = this.resolveLayoutTiming(element, options);
        const deltaX = fromRect.left - toRect.left;
        const deltaY = fromRect.top - toRect.top;
        const deltaW = fromRect.width / toRect.width;
        const deltaH = fromRect.height / toRect.height;
        const targetTransform =
            direction === "enter"
                ? "none"
                : `translate(${deltaX}px, ${deltaY}px) scale(${deltaW}, ${deltaH})`;
        const initialTransform =
            direction === "enter"
                ? `translate(${deltaX}px, ${deltaY}px) scale(${deltaW}, ${deltaH})`
                : "none";
        let completed = false;

        const finish = () => {
            if (completed) return;
            completed = true;
            if (direction === "exit") {
                options?.onComplete?.();
            }
            element.style.transition = "";
            element.style.transformOrigin = "";
            element.style.willChange = "";
            element.removeEventListener("transitionend", onTransitionEnd);
            if (direction === "enter") {
                options?.onComplete?.();
            }
        };

        const onTransitionEnd = (event: TransitionEvent) => {
            if (event.target === element && event.propertyName === "transform") {
                finish();
            }
        };

        element.style.transformOrigin = "top left";
        element.style.willChange = "transform";
        element.style.transition = "none";
        element.style.transform = initialTransform;

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                element.addEventListener("transitionend", onTransitionEnd);
                element.style.transition = `transform ${timing.durationMs}ms ${timing.easing}`;
                element.style.transform = targetTransform;
                window.setTimeout(finish, timing.durationMs + 50);
            });
        });
    }

    private resolveLayoutTiming(
        element: HTMLElement,
        options?: LayoutTransitionOptions
    ) {
        const durationVar = element.style.getPropertyValue(
            "--snowui-frame-appear-motion-duration"
        );
        const easingVar = element.style.getPropertyValue(
            "--snowui-frame-appear-motion-easing"
        );
        const parsedDuration = Number.parseFloat(durationVar);
        return {
            durationMs:
                typeof options?.duration === "number"
                    ? options.duration
                    : Number.isFinite(parsedDuration)
                      ? parsedDuration
                      : 300,
            easing: options?.easing || easingVar.trim() || "ease-out",
        };
    }

    /**
     * 设置滚动联动
     */
    private setupScrollLink(_id: string, element: HTMLElement, config: Record<string, any>) {
        // 这是一个简化的滚动联动实现
        // 监听 window 滚动，计算进度，插值更新样式

        const handleScroll = () => {
            const scrollY = window.scrollY;
            // const viewportHeight = window.innerHeight;

            // 简单示例：根据 y 轴滚动范围插值
            // config 格式: { y: [0, 300], opacity: [0, 1], scale: [1, 0.5] }

            if (config.y && Array.isArray(config.y) && config.y.length === 2) {
                const [start, end] = config.y;
                const progress = Math.min(Math.max((scrollY - start) / (end - start), 0), 1);

                // Apply styles
                if (config.opacity && Array.isArray(config.opacity)) {
                    const [from, to] = config.opacity;
                    const val = from + (to - from) * progress;
                    element.style.opacity = String(val);
                }

                const transformParts: string[] = [];

                if (config.scale && Array.isArray(config.scale)) {
                    const [from, to] = config.scale;
                    const val = from + (to - from) * progress;
                    transformParts.push(`scale(${val})`);
                }

                if (config.translateY && Array.isArray(config.translateY)) {
                    const [from, to] = config.translateY;
                    const val = from + (to - from) * progress;
                    transformParts.push(`translateY(${val}px)`);
                }

                if (config.translateX && Array.isArray(config.translateX)) {
                    const [from, to] = config.translateX;
                    const val = from + (to - from) * progress;
                    transformParts.push(`translateX(${val}px)`);
                }

                if (config.rotate && Array.isArray(config.rotate)) {
                    const [from, to] = config.rotate;
                    const val = from + (to - from) * progress;
                    transformParts.push(`rotate(${val}deg)`);
                }

                if (transformParts.length > 0) {
                    element.style.transform = transformParts.join(" ");
                }
            }
        };

        window.addEventListener("scroll", handleScroll);
        // 立即触发一次
        handleScroll();

        // 保存清理函数到 registry (需要扩展 MotionRegistration 或另存)
        // 这里为了演示，暂时忽略清理
    }

    /**
     * 获取或创建时间轴
     */
    private getOrCreateTimeline(id: string): Timeline {
        if (!this.timelines.has(id)) {
            const tl = new Timeline(id, this, (releasedId) => {
                this.timelines.delete(releasedId);
            });
            this.timelines.set(id, tl);
        }
        return this.timelines.get(id)!;
    }

    /**
     * 播放时间轴
     */
    play(id: string, options?: { reverse?: boolean; loop?: boolean; range?: [string, string]; until?: string }) {
        this.timelines.get(id)?.play(options);
    }

    /**
     * 暂停时间轴
     */
    pause(id: string) {
        this.timelines.get(id)?.pause();
    }

    /**
     * 停止时间轴
     */
    end(id: string) {
        this.timelines.get(id)?.end();
    }

    // ========== 联动控制 API ==========

    /**
     * 播放编排组 (联动控制)
     * @param id 编排组 ID
     * @param options 播放选项
     */
    Play(id: string, options?: { reverse?: boolean }) {
        if (this.elementGroups.has(id)) {
            this.playElementGroup(this.elementGroups.get(id)!, options);
            return;
        }

        if (options?.reverse) {
            playReverse(id, this.registry, this.notify.bind(this));
        } else {
            playForward(id, this.registry);
        }
    }

    /**
     * 重置编排组到初始状态
     * @param id 编排组 ID
     */
    Reset(id: string) {
        resetGroup(id, this.registry, this.notify.bind(this));
    }

    /**
     * 播放编排组 (旧 API，保留兼容)
     * @deprecated 使用 Play(id) 替代
     */
    groupPlay(groupId: string) {
        this.Play(groupId);
    }

    /**
     * 暂停编排组 (旧 API，保留兼容)
     * @deprecated
     */
    groupPause(groupId: string) {
        this.registry.forEach((reg, id) => {
            if (reg.timeline?.includes(groupId)) {
                this.notify(id, 'whileAppear', { active: false });
            }
        });
    }

    /**
     * 订阅动效事件
     */
    subscribe(id: string, callback: (event: MotionEvent, payload?: any) => void) {
        if (!this.subscriptions.has(id)) {
            this.subscriptions.set(id, new Set());
        }
        this.subscriptions.get(id)?.add(callback);

        return () => {
            this.subscriptions.get(id)?.delete(callback);
            if (this.subscriptions.get(id)?.size === 0) {
                this.subscriptions.delete(id);
            }
        };
    }
}

// 导出单例初始化函数 (在 App 根组件调用)
let motionInstance: Motion | null = null;

export function initMotion() {
    if (!motionInstance) {
        motionInstance = new Motion();
    }
    setContext(MOTION_ORCHESTRATOR_CONTEXT_KEY, motionInstance);
    return motionInstance;
}

export function getMotion() {
    return motionInstance;
}
