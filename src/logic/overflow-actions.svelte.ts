import { getContext, type Snippet } from "svelte";

export type OverflowActionIcon = string | Snippet;
export type OverflowActionMode = "full" | "compact" | "hidden";

export interface OverflowActionRegistration {
    id: string;
    label: string;
    icon?: OverflowActionIcon;
    disabled: boolean;
    href?: string;
    execute: (event?: MouseEvent) => void;
    getElement: () => HTMLElement | undefined;
    getFullMeasureElement: () => HTMLElement | undefined;
    getCompactMeasureElement: () => HTMLElement | undefined;
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

export function getOverflowActionsContext(): OverflowActionsContext | undefined {
    return getContext<OverflowActionsContext | undefined>(
        OVERFLOW_ACTIONS_CONTEXT_KEY,
    );
}
