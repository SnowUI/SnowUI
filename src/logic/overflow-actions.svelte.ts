import { getContext, type Snippet } from "svelte";

export type OverflowActionIcon = string | Snippet;
export type OverflowActionMode = "full" | "compact" | "hidden";

export interface OverflowActionRegistration {
    id: string;
    label: string;
    icon?: OverflowActionIcon;
    disabled: boolean;
    href?: string;
    target?: string;
    rel?: string;
    execute: (event?: MouseEvent) => void;
    getElement: () => HTMLElement | undefined;
    getWidth: (mode: "full" | "compact") => number;
}

export interface OverflowActionsContext {
    register: (action: OverflowActionRegistration) => () => void;
    getMode: (id: string) => OverflowActionMode;
    invoke: (id: string, event?: MouseEvent) => void;
    requestLayout: () => void;
    disabled: boolean;
    buttonProps?: Record<string, any>;
}

export const OVERFLOW_ACTIONS_CONTEXT_KEY = Symbol("snowui-overflow-actions");

/** 宿主只提供布局约束，不接管显式子项的按钮视觉。 */
export interface OverflowActionsLayoutContext {
    readonly availableWidth: number | undefined;
    readonly maxVisible: number | undefined;
    readonly overflow: "all" | "progressive" | undefined;
}
export const OVERFLOW_ACTIONS_LAYOUT_CONTEXT_KEY = Symbol("snowui-overflow-actions-layout");

export function getOverflowActionsLayoutContext() {
    return getContext<OverflowActionsLayoutContext | undefined>(OVERFLOW_ACTIONS_LAYOUT_CONTEXT_KEY);
}

export function getOverflowActionsContext(): OverflowActionsContext | undefined {
    return getContext<OverflowActionsContext | undefined>(
        OVERFLOW_ACTIONS_CONTEXT_KEY,
    );
}
/*! @license SnowUI-Commercial-2.4.0 https://snowui.dev/LICENSE (../../LICENSE) */
