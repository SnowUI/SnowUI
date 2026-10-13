/* SnowUI source notice | LICENSE 2.2.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
import { getContext, type Snippet } from "svelte";

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
    icon?: string | Snippet;
    iconCollection?: string;
    depth?: 0 | 1;
    href?: string;
    disabled?: boolean;
    updated?: boolean;
    tags?: Snippet;
    actions?: SidebarActionData[];
}
