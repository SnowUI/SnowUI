/* SnowUI source notice | LICENSE 2.3.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
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

export function getOverflowActionsContext(): OverflowActionsContext | undefined {
    return getContext<OverflowActionsContext | undefined>(
        OVERFLOW_ACTIONS_CONTEXT_KEY,
    );
}
