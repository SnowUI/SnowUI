/* SnowUI source notice | LICENSE 2.1.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
/**
 * Popover 模版注册 + 命令式 API
 *
 * - 单例 `$state` 数组承载所有活跃 Popover,供 <Popover template> 订阅渲染
 * - `showPopover(id, anchorEl)` / `hidePopover(id)` / `togglePopover(id, anchorEl)` 提供命令式入口
 * - `[data-popover-target="id"]` 声明式属性自动绑定 click / hover 触发
 * - hover 触发使用 Tooltip 共享出现延迟,80ms 关闭延迟用于过渡到浮层本体
 * - 文档: ./popover.md
 */

import type { Snippet } from "svelte";
import { TOOLTIP_HOVER_SHOW_DELAY_MS } from "../lib/tooltip-delay";

export type PopoverPlacement = "top" | "bottom" | "left" | "right";
export type PopoverTrigger = "click" | "hover";
export type PopoverSize = "sm" | "md" | "lg";
export type PopoverCloseMode = "outside" | "manual";

export interface PopoverTemplateConfig {
    trigger: PopoverTrigger;
    placement: PopoverPlacement;
    offset: number;
    size: PopoverSize;
    closeOn: PopoverCloseMode;
    closeOnEscape: boolean;
    closeOnSelect: boolean;
    content?: Snippet;
    class?: string;
    style?: string;
}

export interface ActivePopover {
    id: string;
    anchorEl: HTMLElement;
}

/** hover 触发出现延迟 */
export const POPOVER_HOVER_SHOW_DELAY_MS = TOOLTIP_HOVER_SHOW_DELAY_MS;
/** hover 触发关闭延迟,用于鼠标从触发器移到浮层本体 */
export const POPOVER_HOVER_CLOSE_DELAY_MS = 80;

const templates = new Map<string, PopoverTemplateConfig>();
const showTimers = new Map<string, ReturnType<typeof setTimeout>>();
const closeTimers = new Map<string, ReturnType<typeof setTimeout>>();

/** 单例 store;模块级 $state 在 Svelte 5 中跨组件共享 */
export const popoverStore = $state<{ active: ActivePopover[] }>({ active: [] });

function clearShowTimer(id: string): void {
    const t = showTimers.get(id);
    if (t !== undefined) {
        clearTimeout(t);
        showTimers.delete(id);
    }
}

function clearCloseTimer(id: string): void {
    const t = closeTimers.get(id);
    if (t !== undefined) {
        clearTimeout(t);
        closeTimers.delete(id);
    }
}

/** 注册声明式 Popover 模版;供 <Popover template id="..."> 使用 */
export function registerPopoverTemplate(
    id: string,
    config: PopoverTemplateConfig,
): void {
    templates.set(id, config);
}

/** 注销声明式 Popover 模版 */
export function unregisterPopoverTemplate(id: string): void {
    templates.delete(id);
    clearShowTimer(id);
    clearCloseTimer(id);
    hidePopoverImmediate(id);
}

export function getPopoverTemplate(
    id: string,
): PopoverTemplateConfig | undefined {
    return templates.get(id);
}

function showPopoverImmediate(id: string, anchorEl: HTMLElement): void {
    const idx = popoverStore.active.findIndex((p) => p.id === id);
    if (idx === -1) {
        popoverStore.active = [...popoverStore.active, { id, anchorEl }];
    } else {
        popoverStore.active[idx] = { id, anchorEl };
    }
}

function hidePopoverImmediate(id: string): void {
    popoverStore.active = popoverStore.active.filter((p) => p.id !== id);
}

/** 显示 Popover;hover 触发模式带 Tooltip 共享延迟 */
export function showPopover(id: string, anchorEl: HTMLElement): void {
    const config = templates.get(id);
    if (!config) return;
    clearCloseTimer(id);
    if (config.trigger === "hover") {
        clearShowTimer(id);
        const timer = setTimeout(() => {
            showTimers.delete(id);
            showPopoverImmediate(id, anchorEl);
        }, POPOVER_HOVER_SHOW_DELAY_MS);
        showTimers.set(id, timer);
    } else {
        clearShowTimer(id);
        showPopoverImmediate(id, anchorEl);
    }
}

/** 关闭 Popover;hover 触发模式带 80ms 延迟以便移动到浮层本体 */
export function hidePopover(id: string): void {
    const config = templates.get(id);
    clearShowTimer(id);
    if (config?.trigger === "hover") {
        clearCloseTimer(id);
        const timer = setTimeout(() => {
            closeTimers.delete(id);
            hidePopoverImmediate(id);
        }, POPOVER_HOVER_CLOSE_DELAY_MS);
        closeTimers.set(id, timer);
    } else {
        clearCloseTimer(id);
        hidePopoverImmediate(id);
    }
}

/** 切换 Popover(click 触发常用);立即生效不走 hover 延迟 */
export function togglePopover(id: string, anchorEl: HTMLElement): void {
    const isActive = popoverStore.active.some((p) => p.id === id);
    if (isActive) {
        hidePopoverImmediate(id);
        clearShowTimer(id);
        clearCloseTimer(id);
    } else {
        clearShowTimer(id);
        clearCloseTimer(id);
        showPopoverImmediate(id, anchorEl);
    }
}

/** 取消计划中的 hide(鼠标进入浮层本体时调用) */
export function cancelHidePopover(id: string): void {
    clearCloseTimer(id);
}

/** 调度 hover 延迟关闭(浮层本体 mouseleave 时调用) */
export function scheduleHidePopover(id: string): void {
    const config = templates.get(id);
    if (!config) return;
    clearShowTimer(id);
    clearCloseTimer(id);
    const timer = setTimeout(() => {
        closeTimers.delete(id);
        hidePopoverImmediate(id);
    }, POPOVER_HOVER_CLOSE_DELAY_MS);
    closeTimers.set(id, timer);
}

/** 检查 id 是否处于活跃状态 */
export function isPopoverOpen(id: string): boolean {
    return popoverStore.active.some((p) => p.id === id);
}

/* ──────────────────────────────────────────────────────────────────────────
   声明式触发委托:`[data-popover-target="id"]`
   - 自动根据模版 config 的 trigger 字段绑定 click / hover 处理
   - 模块首次被 import 时(浏览器环境)自动初始化一次
   ────────────────────────────────────────────────────────────────────────── */

let delegateInitialized = false;

function findTrigger(target: EventTarget | null): HTMLElement | null {
    if (!(target instanceof Element)) return null;
    return target.closest("[data-popover-target]") as HTMLElement | null;
}

export function initPopoverDelegate(): void {
    if (delegateInitialized) return;
    if (typeof document === "undefined") return;
    delegateInitialized = true;

    document.addEventListener(
        "click",
        (e) => {
            const trigger = findTrigger(e.target);
            if (!trigger) return;
            const id = trigger.dataset.popoverTarget;
            if (!id) return;
            const config = templates.get(id);
            if (!config) return;
            if (config.trigger !== "click") return;
            togglePopover(id, trigger);
        },
        true,
    );

    document.addEventListener(
        "mouseenter",
        (e) => {
            const trigger = findTrigger(e.target);
            if (!trigger) return;
            const id = trigger.dataset.popoverTarget;
            if (!id) return;
            const config = templates.get(id);
            if (!config || config.trigger !== "hover") return;
            showPopover(id, trigger);
        },
        true,
    );

    document.addEventListener(
        "mouseleave",
        (e) => {
            const trigger = findTrigger(e.target);
            if (!trigger) return;
            const id = trigger.dataset.popoverTarget;
            if (!id) return;
            const config = templates.get(id);
            if (!config || config.trigger !== "hover") return;
            hidePopover(id);
        },
        true,
    );
}

if (typeof document !== "undefined") {
    initPopoverDelegate();
}
