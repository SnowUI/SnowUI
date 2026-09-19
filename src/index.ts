// ── OSS 全量 re-export（Vite alias 升级路径：import { Frame } 会拿到 FramePro）──
export {
    Avatar, AvatarGroup, Badge, Button, Card, ScrollArea, Checkbox, CodeBlock,
    Icon, Image, ImageGroup, Input, SearchInput, Kbd, Listbox, MenuItem, Pagination, LocaleProvider,
    Popover, Radio, Select, Skeleton, getSkeletonComponentKey,
    showPopover, hidePopover, togglePopover, cancelHidePopover, scheduleHidePopover,
    isPopoverOpen, registerPopoverTemplate, unregisterPopoverTemplate, initPopoverDelegate,
    POPOVER_HOVER_SHOW_DELAY_MS, POPOVER_HOVER_CLOSE_DELAY_MS,
    type PopoverPlacement, type PopoverTrigger, type PopoverSize,
    type PopoverCloseMode, type PopoverTemplateConfig,
    Spinner, Progress, Text, Textarea, Switch, Tooltip,
    type PaginationWidthMode, type ScrollAreaAxis,
    Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Indicator,
    SNOWUI_COLOR_TOKENS, resolveSnowUIColor, type SnowUIColor,
    DEFAULT_NUMBER_COMPACT_THRESHOLD, DEFAULT_NUMBER_EMPTY_VALUE,
    DEFAULT_NUMBER_LOCALE, DEFAULT_NUMBER_VALUE_LABEL_FRACTION_DIGITS,
    formatNumberLabel, mergeNumberFormatOptions,
    type NumberFormatOptions, type NumberNotation,
    DEFAULT_DATE_EMPTY_VALUE, DEFAULT_DATE_LOCALE,
    formatDate, formatDateRange, formatRange, mergeDateFormatOptions,
    type DateFormatOptions, type DateFormatStyle, type DateInput, type TimeFormatStyle,
    useLocale, type LocaleContext, type SnowUIMessageKey, type SnowUIMessageOverrides,
    resizeManager, resizable, clampResizableSize,
    TABLE_CONTEXT_KEY, provideTableContext, getTableContext,
    type ResizableOptions, type ResizeAxis, type ResizeEdge,
    type IndicatorAxis, type IndicatorEdge, type IndicatorAppearance,
    type TableContext, type TableSortState, type TableSortDirection,
} from '@snowui-design-system/components'
// 同时 re-export keys / context（PRO 组件内部用到）
export * from '@snowui-design-system/components/keys'
export * from '@snowui-design-system/components/context'

// ── Frame 升级（FramePro 接口与 OSS Frame 完全兼容）──
// 同时以 Frame 和 FramePro 两个名字导出：
//   - 使用 Vite alias 时，import { Frame } 透明拿到 FramePro
//   - 也支持显式 import { FramePro }
export { default as Frame }    from './components/FramePro.svelte'
export { default as FramePro } from './components/FramePro.svelte'

// ── frame-types re-export（PRO 组件需要用到 FrameProps 等类型）──
export * from '@snowui-design-system/components/logic/frame-types'

// ── PRO 专属组件 ──
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
// ── PRO Blocks（付费源码开放的产品级组合块）──
export * from './blocks'
// ── PRO 动效组件（复杂动效 / PRO 指定动效）（v1.0.0 起） ──

export * from './lib/overlay-scrollbar.svelte'
export * from './lib/split-pane'
