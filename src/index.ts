/* SnowUI source notice | LICENSE 2.2.0: ../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
// SnowUI 许可入口：阅读或使用本公开入口前先读 ../LICENSE；同任务同许可版本去重，源码修改与框架移植须有相应权限。
export { default as Accordion } from "./components/Accordion.svelte";
export type { CoreState, FrameProps, RenderHints } from "./logic/frame-types";
export { default as AccordionItem } from "./components/AccordionItem.svelte";
export { default as Button } from './components/Button.svelte'
export { default as SelectButton } from "./components/SelectButton.svelte";
export type {
    SelectButtonLabelContext,
    SelectButtonIndicatorContext,
} from "./components/SelectButton.svelte";
export { default as CopyButton } from "./components/CopyButton.svelte";
export { default as ExpandButton } from "./components/ExpandButton.svelte";
export { default as ColorSchemeButton } from "./components/ColorSchemeButton.svelte";
export type { ColorScheme } from "./components/ColorSchemeButton.svelte";
/** @deprecated Use ColorSchemeButton. */
export { default as ThemeButton } from "./components/ColorSchemeButton.svelte";
/** @deprecated Use ColorScheme. */
export type { ColorScheme as ThemeButtonTheme } from "./components/ColorSchemeButton.svelte";
export { default as StyleButton } from "./components/StyleButton.svelte";
export type { SnowUIStyleMode } from "./components/StyleButton.svelte";
export { default as ButtonGroup } from "./components/ButtonGroup.svelte";
export { default as OverflowActions } from "./components/OverflowActions.svelte";
export type {
    OverflowActionsActionEvent,
    OverflowActionsActionItem,
    OverflowActionsItem,
    OverflowActionsSeparatorItem,
} from "./components/OverflowActions.svelte";
export { default as OverflowAction } from "./components/OverflowAction.svelte";
export type { OverflowActionIcon } from "./logic/overflow-actions.svelte";
export { default as Breadcrumb } from "./components/Breadcrumb.svelte";
export type { BreadcrumbItem } from "./components/Breadcrumb.svelte";
export { default as Card } from "./components/Card.svelte";
export { default as ScrollArea } from "./components/ScrollArea.svelte";
export { default as Indicator } from "./components/Indicator.svelte";
export type {
    IndicatorAxis,
    IndicatorEdge,
    IndicatorAppearance,
} from "./components/Indicator.svelte";
export type {
    ScrollAreaAxis,
    ScrollAreaHorizontalTrackPosition,
} from "./components/ScrollArea.svelte";
export { default as Pagination } from "./components/Pagination.svelte";
export type { PaginationWidthMode } from "./components/Pagination.svelte";
export { default as Table } from "./components/Table.svelte";
export { default as TableHeader } from "./components/TableHeader.svelte";
export { default as TableBody } from "./components/TableBody.svelte";
export { default as TableRow } from "./components/TableRow.svelte";
export { default as TableHead } from "./components/TableHead.svelte";
export { default as TableCell } from "./components/TableCell.svelte";
export {
    useOverlayScrollbar,
    type OverlayScrollbarAxis,
    type OverlayScrollbarState,
} from "./lib/overlay-scrollbar.svelte";
export { default as Separator } from "./components/Separator.svelte";
export { default as Progress } from "./components/Progress.svelte";
export { default as Slider } from "./components/Slider.svelte";
export { default as Input } from './components/Input.svelte'
export { default as OTPInput } from "./components/OTPInput.svelte";
export type { OTPLength } from "./components/OTPInput.svelte";
export { default as SearchInput } from "./components/SearchInput.svelte";
export { default as Textarea } from "./components/Textarea.svelte";
export { default as Select } from "./components/Select.svelte";
export type {
    SelectOption,
    SelectValue,
    SelectTriggerContext,
} from "./components/Select.svelte";
export { default as Listbox } from "./components/Listbox.svelte";
export type { ListboxItem } from "./components/Listbox.svelte";
export { default as MenuItem } from "./components/MenuItem.svelte";
export { default as Frame } from "./components/Frame.svelte";
export { default as LocaleProvider } from "./components/LocaleProvider.svelte";
export { default as IconProvider } from "./components/IconProvider.svelte";
export {
    createComponentIconResolver,
    type ComponentIconComponent,
    type ComponentIconMap,
    type ComponentIconRenderProps,
    type ComponentIconRequest,
    type ComponentIconResolver,
    type ComponentIconWeight,
} from "./logic/component-icon";

export { default as Text } from './components/Text.svelte'
export { default as Tooltip } from "./components/Tooltip.svelte";
export { default as Badge } from "./components/Badge.svelte";
export { default as Chip } from "./components/Chip.svelte";
export { default as Link } from "./components/Link.svelte";
export { default as Tag } from "./components/Tag.svelte";
export { default as Kbd } from "./components/Kbd.svelte";
export { default as CodeBlock } from "./components/CodeBlock.svelte";
export { default as Popover } from "./components/Popover.svelte";
export { default as Dialog } from "./components/Dialog.svelte";
export {
    showPopover,
    hidePopover,
    togglePopover,
    cancelHidePopover,
    scheduleHidePopover,
    isPopoverOpen,
    registerPopoverTemplate,
    unregisterPopoverTemplate,
    initPopoverDelegate,
    POPOVER_HOVER_SHOW_DELAY_MS,
    POPOVER_HOVER_CLOSE_DELAY_MS,
    type PopoverPlacement,
    type PopoverTrigger,
    type PopoverSize,
    type PopoverCloseMode,
    type PopoverTemplateConfig,
} from "./logic/popover.svelte";
export {
    showDialog,
    hideDialog,
    isDialogOpen,
    registerDialogTemplate,
    unregisterDialogTemplate,
    initDialogDelegate,
    type DialogSize,
    type DialogBackdrop,
    type DialogTemplateConfig,
} from "./logic/dialog.svelte";
export { default as Avatar } from "./components/Avatar.svelte";
export { default as AvatarGroup } from "./components/AvatarGroup.svelte";
export { default as Gradient } from "./components/Gradient.svelte";
export { default as SnowUILogo } from "./components/SnowUILogo.svelte";
export { provideMediaLoading, type MediaLoading } from "./lib/media-loading";
export { default as Image } from "./components/Image.svelte";
export { default as ImageGroup } from "./components/ImageGroup.svelte";
export { default as Icon } from './components/Icon.svelte'
export { default as Spinner } from './components/Spinner.svelte'
export { default as Radio } from './components/Radio.svelte'
export { default as Checkbox } from './components/Checkbox.svelte'
export { default as Switch } from './components/Switch.svelte'

export { default as Skeleton, getSkeletonComponentKey } from './components/Skeleton.svelte'
export * from "./logic/component-parts.svelte";
export {
    ContinuousHoverController,
    type ContinuousHoverAxis,
    type ContinuousHoverOptions,
} from "./logic/continuous-hover.svelte";


// 共享能力公开工具导出
export { resizeManager } from './logic/observer.svelte'
export { resizable, clampResizableSize, type ResizableOptions, type ResizeAxis, type ResizeEdge } from "./lib/resizable";
export {
    TABLE_CONTEXT_KEY,
    provideTableContext,
    getTableContext,
    type TableContext,
    type TableColumnRegistration,
    type TableSelectionController,
    type TableSortState,
    type TableSortDirection,
    type TableRoleLayout,
    type TableRoleOverlayBlurMode,
} from "./lib/table-context.svelte";
export { TruncationController } from "./logic/frame-truncation.svelte";
export {
    SNOWUI_COLOR_TOKENS,
    resolveSnowUIColor,
    type SnowUIColor,
} from "./lib/color";
export {
    DEFAULT_NUMBER_COMPACT_THRESHOLD,
    DEFAULT_NUMBER_EMPTY_VALUE,
    DEFAULT_NUMBER_LOCALE,
    DEFAULT_NUMBER_PERCENT_FRACTION_DIGITS,
    DEFAULT_NUMBER_VALUE_LABEL_FRACTION_DIGITS,
    formatPercentLabel,
    formatNumberLabel,
    mergeNumberFormatOptions,
    type NumberFormatOptions,
    type NumberNotation,
} from "./lib/number-format";
export {
    DEFAULT_DATE_EMPTY_VALUE,
    DEFAULT_DATE_LOCALE,
    formatDate,
    formatDateRange,
    formatRange,
    mergeDateFormatOptions,
    type DateFormatOptions,
    type DateFormatStyle,
    type DateInput,
    type TimeFormatStyle,
} from "./lib/date-format";
export { getNumberFormat, type NumberFormatContext } from "./context";
export {
    DEFAULT_LOCALE,
    SNOWUI_MESSAGES,
    type SnowUIMessageKey,
    type SnowUIMessageOverrides,
    type SnowUIMessageValues,
} from "./i18n/messages";
export {
    createLocaleContext,
    useLocale,
    type LocaleContext,
} from "./i18n/locale.svelte";
export {
    getTooltipBehaviorEnhancement,
    registerTooltipBehaviorEnhancement,
    resetTooltipBehaviorEnhancement,
    type ResolvedTooltipBehaviorEnhancement,
    type TooltipBehaviorEnhancement,
} from "./lib/tooltip-behavior";
export {
    DEFAULT_FLOATING_EDGE_GAP,
    clampFloatingPosition,
    clampFloatingValue,
    constrainFloatingAnchor,
    getFloatingVisualBounds,
    getOppositeFloatingSide,
    hasFloatingCollision,
    type FloatingBounds,
    type FloatingPoint,
    type FloatingSide,
} from "./lib/floating-position";
export {
    DEFAULT_PROGRESSIVE_BLUR_LAYER_COUNT,
    DEFAULT_PROGRESSIVE_BLUR_WIDTH,
    createEdgeProgressiveBlurStyles,
    createProgressiveBlurContainerStyle,
    createProgressiveBlurLayerStyles,
    createProgressiveBlurStyles,
    createUniformBlurLayerStyles,
    createUniformBlurStyles,
    type EdgeProgressiveBlurDirection,
    type EdgeProgressiveBlurOptions,
    type ProgressiveBlurDirection,
    type ProgressiveBlurLayerStyle,
    type ProgressiveBlurOptions,
    type ProgressiveBlurStyles,
} from "./lib/progressive-blur";
export {
    createEdgeFadeMaskImage,
    createEdgeFadeMaskStyle,
    type EdgeFadeDirection,
    type EdgeFadeMaskOptions,
} from "./lib/edge-fade";
export { writeClipboardText } from "./lib/clipboard";

export { default as CopyLink } from "./components/CopyLink.svelte";

// 全量组件与区块；Frame 保持独立技术身份。
export { default as FlowText }      from './components/FlowText.svelte'
export { default as NumberFlow }    from './components/NumberFlow.svelte'
export { default as NumericText }     from './components/NumericText.svelte'
export { default as ScrambleText }    from './components/ScrambleText.svelte'
export { default as SlotText }        from './components/SlotText.svelte'
export {
    chromatic,
    type ChromaticOptions,
} from './lib/text-motion/color'
export type {
    TextMotionColor,
    TextMotionColorResolver,
} from './lib/text-motion/types'
export { default as GradientMotion }  from './components/GradientMotion.svelte'
export { default as ImageViewer }     from './components/ImageViewer.svelte'
export { default as SidePanel }       from './components/SidePanel.svelte'
export {
    SIDE_PANEL_INLINE_GAP_PX,
    createSidePanelLayoutMotionStyle,
    type SidePanelPlacement,
    type SidePanelToolbarAction,
} from './lib/side-panel'
export { default as Field }           from './components/Field.svelte'
export { default as SearchBox }       from './components/SearchBox.svelte'
export {
    default as DataTable,
    type DataTableRenderState,
    type DataTableLoadMoreRequest,
    type DataTableLoadMoreSource,
    type DataTableLoadMore,
    type DataTableLoadMoreMode,
    type DataTableActionEvent,
    type DataTableActionItem,
    type DataTableActionSeparatorItem,
    type DataTableActionsItem,
    type DataTableActionsConfig,
} from './components/DataTable.svelte'
export { default as TableToolbar } from './components/TableToolbar.svelte'
export {
    compareDataTableValues,
    sortDataTableRows,
    paginateDataTableRows,
    type DataTableSortState,
    type DataTableSortDirection,
} from './lib/data-table'
export { default as CircularChart }   from './components/CircularChart.svelte'
export { default as GaugeChart }      from './components/GaugeChart.svelte'
export { default as LineChart }       from './components/LineChart.svelte'
export { default as BarChart }        from './components/BarChart.svelte'
export { default as ChartGroup }      from './components/ChartGroup.svelte'
export { default as Tab, type TabItem } from './components/Tab.svelte'
export { default as Segmented }       from './components/Segmented.svelte'
export { default as Toast }         from './components/Toast.svelte'
export { default as Toaster }       from './components/Toaster.svelte'
export {
    toast,
    showToast,
    dismissToast,
    dismissAllToasts,
    registerToastTemplate,
    unregisterToastTemplate,
    DEFAULT_TOAST_DURATION,
    type ToastOptions,
    type ToastItem,
    type ToastPosition,
    type ToastVariant,
    type ToastSize,
} from './logic/toast.svelte'
export { initMotion, getMotion }      from './logic/motion.svelte'
// 可复用区块
export * from './blocks'

export * from './lib/split-pane'

export { default as SearchPopup, type SearchPopupItem } from "./blocks/SearchPopup.svelte";

export { default as BlurText } from "./components/BlurText.svelte";
