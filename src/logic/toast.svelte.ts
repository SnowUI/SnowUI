/* SnowUI source notice | LICENSE 2.3.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
/**
 * Toast 全局通知 store + 命令式 API
 *
 * - 单例 `$state` 数组承载所有 Toast，供 `<Toaster />` 订阅渲染
 * - `toast(...)` 提供命令式入口，可在组件外、纯 TS 文件中调用
 * - 文档: ../components/Toast.md
 */

import type { Snippet } from "svelte";

export type ToastPosition =
    | "top"
    | "top-left"
    | "top-right"
    | "bottom"
    | "bottom-left"
    | "bottom-right";

export type ToastVariant = "default" | "rich";
export type ToastSize = "sm" | "md";
export type ToastExitKind = "dismiss" | "pushed-out";

export interface ToastOptions {
    /** 语义判定：true=积极；false=问题；undefined=不显示内置图标 */
    positive?: boolean;
    /** 命令式快捷文案：作为 children 直接渲染为简单 span */
    text?: string;
    /** 自定义 Leading 槽 Snippet（独立于内置图标） */
    leading?: Snippet;
    /** 自定义 Trailing 槽 Snippet（rich 变体常用于放置 Button） */
    trailing?: Snippet;
    /** 自定义正文内容 Snippet；优先级高于 text */
    children?: Snippet;
    /** 默认 default；rich 即"卡片式"白底带阴影 */
    variant?: ToastVariant;
    /** 仅对 default 变体生效；rich 固定为 md */
    size?: ToastSize;
    /** 6 个出现位置；默认 top */
    position?: ToastPosition;
    /** 自动消失时长，单位 ms；0 表示常驻 */
    duration?: number;
    /** 关闭时回调 */
    onDismiss?: () => void;
    /** 透传给 Toast 视觉单元的 class */
    class?: string;
    /** 透传给 Toast 视觉单元的 style */
    style?: string;
}

export interface ToastItem extends ToastOptions {
    id: string;
    exiting?: boolean;
    exitKind?: ToastExitKind;
    exitFromIndex?: number;
}

/** 默认停留时长，单位 ms；对齐 HeroUI / Sonner 默认值 */
export const DEFAULT_TOAST_DURATION = 4000;
/** 退出动画时长，需与 Frame slide out 默认时序保持一致 */
export const TOAST_EXIT_DURATION = 450;

let counter = 0;
function nextId(): string {
    counter += 1;
    return `t${Date.now().toString(36)}-${counter}`;
}

/** 单例 store；模块级 $state 在 Svelte 5 中跨组件共享 */
export const toastStore = $state<{ items: ToastItem[] }>({ items: [] });
const toastTemplates = new Map<string, ToastOptions>();

/** 注册声明式 Toast 模板；供 <Toast template id="..."> 使用 */
export function registerToastTemplate(id: string, options: ToastOptions): void {
    toastTemplates.set(id, options);
}

/** 注销声明式 Toast 模板 */
export function unregisterToastTemplate(id: string): void {
    toastTemplates.delete(id);
}

function resolveExitFromIndex(id: string): number {
    const item = toastStore.items.find((candidate) => candidate.id === id);
    if (!item) return 0;
    const position = item.position ?? "top";
    const activeItems = toastStore.items.filter(
        (candidate) => !candidate.exiting && (candidate.position ?? "top") === position,
    );
    const activeIndex = activeItems.findIndex((candidate) => candidate.id === id);
    return activeIndex === -1 ? 0 : activeItems.length - 1 - activeIndex;
}

/** 程序化触发 Toast；返回 id 便于后续手动关闭 */
export function toast(input: string | ToastOptions): string {
    const opts: ToastOptions =
        typeof input === "string" ? { text: input } : input ?? {};
    const id = nextId();
    const item: ToastItem = {
        id,
        variant: opts.variant ?? "default",
        size: opts.size ?? "md",
        position: opts.position ?? "top",
        duration: opts.duration ?? DEFAULT_TOAST_DURATION,
        ...opts,
    };
    // 替换队列数组，确保退出标记更新后，后续入队仍使宿主分组重新求值。
    // 最新条目位于数组尾部；Toaster 渲染时将其展示在前。
    toastStore.items = [...toastStore.items, item];
    return id;
}

/** 通过声明式 Toast 模板 id 触发通知 */
export function showToast(id: string, overrides: ToastOptions = {}): string | undefined {
    const template = toastTemplates.get(id);
    if (!template) return undefined;
    return toast({ ...template, ...overrides });
}

/** 关闭指定 id 的 Toast；不存在则忽略 */
export function dismissToast(id: string, exitFromIndex?: number): void {
    const idx = toastStore.items.findIndex((t) => t.id === id);
    if (idx === -1) return;
    const item = toastStore.items[idx];
    if (item.exiting) return;

    toastStore.items = toastStore.items.map((toastItem) =>
        toastItem.id === id
            ? {
                  ...toastItem,
                  exiting: true,
                  exitKind: "dismiss",
                  exitFromIndex: exitFromIndex ?? resolveExitFromIndex(id),
              }
            : toastItem,
    );
    setTimeout(() => {
        const removeIdx = toastStore.items.findIndex((t) => t.id === id);
        if (removeIdx === -1) return;
        const removed = toastStore.items[removeIdx];
        toastStore.items = toastStore.items.filter((candidate) => candidate.id !== id);
        removed?.onDismiss?.();
    }, TOAST_EXIT_DURATION);
}

/** 标记最后一层被新 Toast 挤出可见层；由 Toaster 根据 maxVisible 触发 */
export function pushOutToast(id: string, exitFromIndex: number): void {
    const idx = toastStore.items.findIndex((t) => t.id === id);
    if (idx === -1) return;
    const item = toastStore.items[idx];
    if (item.exiting) return;

    toastStore.items = toastStore.items.map((toastItem) =>
        toastItem.id === id
            ? {
                  ...toastItem,
                  exiting: true,
                  exitKind: "pushed-out",
                  exitFromIndex,
              }
            : toastItem,
    );
    setTimeout(() => {
        const removeIdx = toastStore.items.findIndex((t) => t.id === id);
        if (removeIdx === -1) return;
        const removed = toastStore.items[removeIdx];
        toastStore.items = toastStore.items.filter((candidate) => candidate.id !== id);
        removed?.onDismiss?.();
    }, TOAST_EXIT_DURATION);
}

/** 关闭所有 Toast（可按位置过滤） */
export function dismissAllToasts(position?: ToastPosition): void {
    if (!position) {
        for (const item of [...toastStore.items]) {
            dismissToast(item.id);
        }
        return;
    }
    for (let i = toastStore.items.length - 1; i >= 0; i -= 1) {
        if (toastStore.items[i].position === position) {
            dismissToast(toastStore.items[i].id);
        }
    }
}
