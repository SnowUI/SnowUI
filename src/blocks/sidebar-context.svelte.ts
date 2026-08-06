import { getContext } from "svelte";

export const SIDEBAR_CONTEXT_KEY = Symbol("snowui-sidebar");

export interface SidebarContext {
    readonly collapsed: boolean;
    readonly activeItemId: string | undefined;
    select(itemId: string): void;
    getSectionCollapsed(sectionId: string): boolean | undefined;
    setSectionCollapsed(sectionId: string, collapsed: boolean): void;
}

export function getSidebarContext(): SidebarContext | undefined {
    return getContext<SidebarContext | undefined>(SIDEBAR_CONTEXT_KEY);
}

export interface SidebarActionData {
    id: string;
    icon: string;
    iconCollection?: string;
    label: string;
    disabled?: boolean;
    onSelect?: (ownerId: string) => void;
}

export interface SidebarItemData {
    id: string;
    label: string;
    icon?: string;
    iconCollection?: string;
    href?: string;
    disabled?: boolean;
    updated?: boolean;
    actions?: SidebarActionData[];
}
