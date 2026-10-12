/* SnowUI source notice | LICENSE 2.0.0: ../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
/**
 * 全局上下文定义 (Global Context Definitions)
 *
 * 作用 (Purpose):
 * 此文件定义了 SnowUI 组件系统中所有的 Context Key (Symbol) 和对应的类型接口。
 * 它充当了组件间状态共享的“协议层”。
 *
 * 为什么需要此文件 (Why):
 * 1. **解耦 (Decoupling)**: 避免组件之间直接引用（例如 Button 不需要引入 Icon，Icon 也不需要引入 Button），防止循环依赖。
 * 2. **类型安全 (Type Safety)**: 统一管理 Context 的类型定义，确保 `getContext` 时的类型提示准确无误。
 * 3. **单一真理来源 (Single Source of Truth)**: 所有的状态流（State Flow）协议都在此定义，便于维护和查阅。
 */

import { getContext, type Component } from "svelte";
import type { PreviewMode } from "./logic/image-preview";
import type { NumberFormatOptions } from "./lib/number-format";

export * from "./keys";

import {
    INTERACTION_CONTEXT_KEY,
    MORPH_CONTEXT_KEY,
    SKELETON_CONTEXT_KEY,
    LAYOUT_CONTEXT_KEY,
    SCROLL_CONTEXT_KEY,
    TEXT_CONTEXT_KEY,
    ICON_CONTEXT_KEY,
    AVATAR_CONTEXT_KEY,
    IMAGE_CONTEXT_KEY,
    IMAGE_GROUP_CONTEXT_KEY,
    IMAGE_VIEWER_CONTEXT_KEY,
    MOTION_ORCHESTRATOR_CONTEXT_KEY,
    TRUNCATION_CONTEXT_KEY,
    SIZE_CONTEXT_KEY,
    FIELD_CONTEXT_KEY,
    BUTTON_GROUP_CONTEXT_KEY,
    BUTTON_COLLECTION_CONTEXT_KEY,
    BUTTON_SIZE_CONTEXT_KEY,
    BREADCRUMB_CONTEXT_KEY,
    ACCORDION_CONTEXT_KEY,
    LISTBOX_OWNER_CONTEXT_KEY,
    LISTBOX_HEADER_PORTAL_KEY,
    NUMBER_FORMAT_CONTEXT_KEY,
} from "./keys";

// --- State Types ---
// 定义组件可能处于的交互状态和形态状态
export type InteractionState = "idle" | "loading" | "active" | "disabled" | "hovered" | "pressed" | "focused";
export type MorphState = "collapsed" | "expanded" | "compact" | "loose";

// 资源组件统一尺寸档位 (Avatar, Badge, Checkbox, Icon, Radio, Spinner, Switch 等共用)
export type ResourceSize = 12 | 16 | 20 | 24 | 28 | 32 | 40 | 48 | 80;

// --- Context Interfaces ---
// 定义 Context 对象的数据结构
export interface InteractionContext {
    state: InteractionState;
    hovered: boolean;
    pressed: boolean;
    focused: boolean;
    isDragging: boolean;
}

export interface MorphContext {
    state: MorphState;
}

export interface SkeletonContext {
    loading: boolean;
    skeleton?: boolean;
}

// --- Helper Functions ---
// 封装 getContext 调用，提供更语义化的 API
export function getInteraction(): InteractionContext | undefined {
    return getContext<InteractionContext>(INTERACTION_CONTEXT_KEY);
}

export function getMorph(): MorphContext | undefined {
    return getContext<MorphContext>(MORPH_CONTEXT_KEY);
}

export function getSkeleton(): SkeletonContext | undefined {
    return getContext<SkeletonContext>(SKELETON_CONTEXT_KEY);
}

export interface LayoutContext {
    registerLayout: (id: string, el: HTMLElement) => void;
    unregisterLayout: (id: string) => void;
    getLayout: (id: string) => HTMLElement | undefined;
    // 编排支持
    registerChild?: (callback: (variant: string, delay: number) => void) => () => void;
    notifyVariantChange?: (variant: string) => void;
}

export function getLayout(): LayoutContext | undefined {
    return getContext<LayoutContext>(LAYOUT_CONTEXT_KEY);
}

// --- Text Context ---

export interface TextContext {
    isTruncated: boolean;
    isCollapsed: boolean;
    isExpanded: boolean;
    fullText: string;
    handleExpand: () => void | number;
    handleCollapse: () => void;
}

export function getText(): TextContext | undefined {
    return getContext<TextContext>(TEXT_CONTEXT_KEY) || getContext<TruncationContext>(TRUNCATION_CONTEXT_KEY);
}

// --- Truncation Context (Text 提供) ---
// 接口与 TextContext 相同，供 Tooltip/Button 等子组件使用
export type TruncationContext = TextContext;

export function getTruncation(): TruncationContext | undefined {
    return getContext<TruncationContext>(TRUNCATION_CONTEXT_KEY);
}

// --- Icon Context ---

export interface IconContext {
    badgeStyle: string;
    badgeSize: string;
    registerTooltip?: () => void;
    registerBadgeSize?: (sizeRem: number) => void;
    registerBadgeType?: (type: string) => void;
    registerBadgeGeometry?: (
        widthRem: number,
        heightRem: number,
        radiusRem: number,
    ) => void;
}

export function getIcon(): IconContext | undefined {
    return getContext<IconContext>(ICON_CONTEXT_KEY);
}

// --- Avatar Context ---

export interface AvatarContext {
    badgeStyle: string;
    badgeSize: string;
    /**
     * Callback for child Badge/Icon to register its custom size.
     * This allows the Avatar to update the cutout mask to match the actual child size.
     * @param sizeRem The size of the badge in rem (number or string value without unit? Let's use string '1rem' or number).
     * Actually, logic uses number for calc. Let's pass number (rem value).
     */
    registerBadgeSize?: (sizeRem: number) => void;
    registerBadgeType?: (type: string) => void;
    registerBadgeGeometry?: (
        widthRem: number,
        heightRem: number,
        radiusRem: number,
    ) => void;
}

export function getAvatar(): AvatarContext | undefined {
    return getContext<AvatarContext>(AVATAR_CONTEXT_KEY);
}

// --- Image Context ---

export interface ImageContext {
    badgeStyle: string;
    badgeAs?: string;
    iconStyle: string;
    iconAs?: string;
}

export function getImage(): ImageContext | undefined {
    return getContext<ImageContext>(IMAGE_CONTEXT_KEY);
}

// --- ImageGroup Context ---

export interface ImageGroupContext {
    size?: ResourceSize | number;
    previewMode?: PreviewMode;
    registerPreviewItem?: (
        item: { src?: string | Component; alt?: string },
    ) => { dispose: () => void; getIndex: () => number };
    getPreviewItems?: () => { src?: string | Component; alt?: string }[];
}

export function getImageGroup(): ImageGroupContext | undefined {
    return getContext<ImageGroupContext>(IMAGE_GROUP_CONTEXT_KEY);
}

// --- ImageViewer Context ---

export interface ImageViewerContext {
    prevStyle: string;
    prevAs?: string;
    nextStyle: string;
    nextAs?: string;
    closeStyle: string;
    closeAs?: string;
    showPrev?: () => void;
    showNext?: () => void;
    close?: () => void;
}

export function getImageViewer(): ImageViewerContext | undefined {
    return getContext<ImageViewerContext>(IMAGE_VIEWER_CONTEXT_KEY);
}

// --- Scroll Context ---
export interface ScrollContext {
    progress: number;
}

export function getScroll(): ScrollContext | undefined {
    return getContext<ScrollContext>(SCROLL_CONTEXT_KEY);
}

// --- Motion Orchestrator Context ---

export interface MotionContext {
    [key: string]: any;
}

export function getMotion(): MotionContext | undefined {
    return getContext<MotionContext>(MOTION_ORCHESTRATOR_CONTEXT_KEY);
}

// --- Size Context ---
// 用于传递组件尺寸给子组件（如 AvatarByewind 等资源组件）

export interface SizeContext {
    size: number;
    iconSize?: number;
    avatarSize?: number;
}

export function getSizeContext(): SizeContext | undefined {
    return getContext<SizeContext>(SIZE_CONTEXT_KEY);
}

export function getSize(type?: 'icon' | 'avatar'): number | undefined {
    // Note: If you want reactivity, you should use getSizeContext() and access its properties reactively.
    // This helper returns a static snapshot.
    const ctx = getContext<SizeContext>(SIZE_CONTEXT_KEY);
    if (!ctx) return undefined;
    if (type === 'icon' && ctx.iconSize !== undefined) return ctx.iconSize;
    if (type === 'avatar' && ctx.avatarSize !== undefined) return ctx.avatarSize;
    return ctx.size;
}

// --- Number Format Context ---

export type NumberFormatContext = NumberFormatOptions;

export function getNumberFormat(): NumberFormatContext | undefined {
    return getContext<NumberFormatContext>(NUMBER_FORMAT_CONTEXT_KEY);
}

// --- Field Context ---

export interface FieldContext {
    present: true;
}

export function getField(): FieldContext | undefined {
    return getContext<FieldContext>(FIELD_CONTEXT_KEY);
}

// --- ButtonGroup Context ---

export type ButtonGroupSize = "sm" | "md" | "lg";
export type ButtonGroupVariant = "gray" | "filled" | "outline" | "borderless";

export interface ButtonGroupContext {
    present: true;
    size: ButtonGroupSize;
    variant: ButtonGroupVariant;
    disabled: boolean;
}

export function getButtonGroup(): ButtonGroupContext | undefined {
    return getContext<ButtonGroupContext>(BUTTON_GROUP_CONTEXT_KEY);
}

// --- Button Collection Context ---

export interface ButtonCollectionContext {
    readonly scaleOnHover: boolean;
}

export function getButtonCollection(): ButtonCollectionContext | undefined {
    return getContext<ButtonCollectionContext>(BUTTON_COLLECTION_CONTEXT_KEY);
}

// --- Button Size Context ---

export type ButtonSizeContextValue = "sm" | "md" | "lg";

export interface ButtonSizeContext {
    present: true;
    readonly size: ButtonSizeContextValue;
    /** 可按已注册的直系角色限定尺寸默认值；返回 undefined 时保留 Button 自身默认。 */
    readonly resolveSize?: (element: HTMLElement | undefined) => ButtonSizeContextValue | undefined;
    /** 复合控件可同时提供 Button item 的内置 hover scale 默认值。 */
    readonly scaleOnHover?: boolean;
}

export function getButtonSize(): ButtonSizeContext | undefined {
    return getContext<ButtonSizeContext>(BUTTON_SIZE_CONTEXT_KEY);
}

// --- Breadcrumb Context ---

export type BreadcrumbVariant = "gray" | "filled" | "outline" | "borderless";

export interface BreadcrumbContext {
    present: true;
    variant?: BreadcrumbVariant;
}

export function getBreadcrumb(): BreadcrumbContext | undefined {
    return getContext<BreadcrumbContext>(BREADCRUMB_CONTEXT_KEY);
}

// --- Accordion Context ---

export type AccordionType = "single" | "multiple";
export type AccordionValue = string | string[];

export interface AccordionContext {
    readonly indicatorVariant: "cross" | "minus";
    readonly accordionId: string;
    readonly disabled: boolean;
    readonly type: AccordionType;
    isOpen: (value: string) => boolean;
    toggle: (value: string) => void;
    getTriggerId: (value: string) => string;
    getContentId: (value: string) => string;
}

export function getAccordion(): AccordionContext | undefined {
    return getContext<AccordionContext>(ACCORDION_CONTEXT_KEY);
}

// --- Listbox Owner Context ---
// Select / Combobox 等宿主组件通过此上下文与 Listbox 通信

export interface ListboxOptionRegistration {
    value: string;
    label: string;
    disabled: boolean;
}

export interface ListboxOwnerContext {
    /** Listbox 是否展开 */
    readonly open: boolean;
    /** 当前选中值 */
    readonly selectedValue: string | undefined;
    /** 当前活跃（键盘高亮）选项索引 */
    readonly activeIndex: number;
    /** 宿主是否要求选中项显示勾选；未声明时由 MenuItem 自身决定 */
    readonly showCheck?: boolean;
    /** 宿主提供的 Listbox 搜索框默认值；Listbox 显式 Props 优先 */
    readonly search?: boolean;
    /** 宿主的 Trigger 元素（用于垂直定位基准） */
    readonly triggerEl: HTMLElement | null;
    /** 宿主的锚点元素（用于宽度和水平位置基准） */
    readonly anchorEl: HTMLElement | null;
    /** Listbox DOM id（ARIA 关联） */
    readonly listboxId: string;
    /** Trigger DOM id（ARIA 关联） */
    readonly triggerId: string;
    /** 注册选项（MenuItem 挂载时调用） */
    registerOption: (option: ListboxOptionRegistration) => void;
    /** 注销选项（MenuItem 卸载时调用） */
    unregisterOption: (value: string) => void;
    /** 选中某选项 */
    selectOption: (value: string) => void;
    /** 设置活跃索引 */
    setActiveIndex: (index: number) => void;
    /** 设置展开状态 */
    setOpen: (open: boolean) => void;
    /** Listbox 将自身最终 showCheck 配置同步给宿主 */
    setShowCheck?: (showCheck: boolean) => void;
    /** 已注册选项列表（供 Listbox 读取） */
    readonly options: ListboxOptionRegistration[];
    /** 当前搜索过滤文本（as="search" Input 写入） */
    readonly filterText: string;
    /** 更新搜索文本（由 Input as="search" 调用） */
    setFilterText: (v: string) => void;
    /** 用户自定义选项列表（通过搜索添加） */
    readonly customOptions: ListboxOptionRegistration[];
    /** 添加用户自定义选项 */
    addCustomOption: (value: string) => void;
    /** 删除用户自定义选项 */
    removeCustomOption: (value: string) => void;
}

export function getListboxOwner(): ListboxOwnerContext | undefined {
    return getContext<ListboxOwnerContext>(LISTBOX_OWNER_CONTEXT_KEY);
}

/** Input as="search" 通过此 context 获取 Listbox header 区域的挂载目标 */
export interface ListboxHeaderPortalContext {
    /** header 区域的 DOM 元素引用（Listbox 展开后由 Listbox.svelte 注入） */
    readonly el: HTMLElement | undefined;
}

export { LISTBOX_HEADER_PORTAL_KEY };

export function getListboxHeaderPortal(): ListboxHeaderPortalContext | undefined {
    return getContext<ListboxHeaderPortalContext>(LISTBOX_HEADER_PORTAL_KEY);
}
