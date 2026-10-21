/* SnowUI source notice | LICENSE 2.3.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
/** SnowUI 组件内置 UI 文案 catalog。文档: ../../../specs/maintainers/LocalizationSpec.md */

export const DEFAULT_LOCALE = "zh-CN";

export type SnowUIMessageKey =
    | "copyButton.copy"
    | "copyButton.copied"
    | "codeBlock.copyCode"
    | "codeBlock.fullscreen"
    | "codeBlock.exitFullscreen"
    | "codeBlock.resize"
    | "codeBlock.fullscreenDialog"
    | "expandButton.expand"
    | "expandButton.collapse"
    | "sidebarSection.expand"
    | "sidebarSection.collapse"
    | "breadcrumb.navigation"
    | "pagination.navigation"
    | "spinner.loading"
    | "scrollArea.content"
    | "barChart.name"
    | "barChart.cells"
    | "lineChart.name"
    | "lineChart.cells"
    | "circularChart.name"
    | "gaugeChart.name"
    | "chartGroup.name"
    | "chartGroup.cells"
    | "chartGroup.cell"
    | "searchBox.placeholder"
    | "searchBox.clear"
    | "sidePanel.title"
    | "slider.title"
    | "menuItem.deleteCustom"
    | "listbox.search"
    | "tag.close"
    | "sidebar.navigation"
    | "sidebar.expand"
    | "sidebar.collapse"
    | "sidebarItem.updated"
    | "sidebar.resize"
    | "pagination.pageSize"
    | "pagination.previous"
    | "pagination.next"
    | "pagination.page"
    | "otpInput.invalidCode"
    | "input.clear"
    | "input.increment"
    | "input.decrement"
    | "input.openTime"
    | "input.openDate"
    | "input.year"
    | "input.month"
    | "input.day"
    | "input.week"
    | "input.hour"
    | "input.minute"
    | "input.second"
    | "input.yearPlaceholder"
    | "input.monthPlaceholder"
    | "input.dayPlaceholder"
    | "input.weekPlaceholder"
    | "imageViewer.previous"
    | "imageViewer.next"
    | "imageViewer.close"
    | "toast.close"
    | "table.scrollRegion"
    | "table.scrollRegionNamed"
    | "tableHead.selectAll"
    | "tableHead.resizeColumn"
    | "tableHead.resizeColumnGeneric"
    | "tableCell.selectRow"
    | "text.expand"
    | "textarea.resize"
    | "indicator.resizeWidth"
    | "indicator.resizeHeight"
    | "indicator.resizeBoth"
    | "colorSchemeButton.toLight"
    | "colorSchemeButton.toDark"
    | "styleButton.toSnowUI"
    | "styleButton.toApple"
    | "sidePanel.placement.toInline"
    | "sidePanel.placement.toFloating"
    | "sidePanel.previous"
    | "sidePanel.next"
    | "sidePanel.copy"
    | "sidePanel.delete"
    | "sidePanel.cancel"
    | "sidePanel.save"
    | "sidePanel.close"
    | "sidePanel.resize"
    | "tableToolbar.name"
    | "tableToolbar.search"
    | "tableToolbar.sort"
    | "tableToolbar.filter"
    | "tableToolbar.clear"
    | "tableToolbar.copy"
    | "tableToolbar.delete"
    | "tableToolbar.selected"
    | "tableToolbar.deleting"
    | "tableToolbar.defaultSort"
    | "tableToolbar.ascending"
    | "tableToolbar.descending"
    | "tableToolbar.defaultFilter"
    | "overflowActions.more"
    | "dialog.close";

export type SnowUIMessageValues = Record<string, string | number>;
export type SnowUIMessageOverrides = Partial<Record<SnowUIMessageKey, string>>;

export const SNOWUI_MESSAGES: Record<
    string,
    Record<SnowUIMessageKey, string>
> = {
    "zh-CN": {
        "copyButton.copy": "复制",
        "copyButton.copied": "已复制",
        "codeBlock.copyCode": "复制代码",
        "codeBlock.fullscreen": "全屏查看",
        "codeBlock.exitFullscreen": "退出全屏",
        "codeBlock.resize": "调整代码块宽度和高度",
        "codeBlock.fullscreenDialog": "全屏代码查看",
        "expandButton.expand": "展开",
        "expandButton.collapse": "收起",
        "sidebarSection.expand": "展开{{title}}",
        "sidebarSection.collapse": "收起{{title}}",
        "breadcrumb.navigation": "面包屑导航",
        "pagination.navigation": "分页导航",
        "spinner.loading": "加载中",
        "scrollArea.content": "可滚动内容",
        "barChart.name": "柱状图",
        "barChart.cells": "柱状图数据单元格",
        "lineChart.name": "折线图",
        "lineChart.cells": "折线图数据单元格",
        "circularChart.name": "圆形图表",
        "gaugeChart.name": "仪表图",
        "chartGroup.name": "组合图表",
        "chartGroup.cells": "组合图表数据单元格",
        "chartGroup.cell": "单元格 {{index}}",
        "searchBox.placeholder": "搜索",
        "searchBox.clear": "清除搜索内容",
        "sidePanel.title": "详情",
        "slider.title": "文本",
        "menuItem.deleteCustom": "删除自定义选项",
        "listbox.search": "搜索",
        "tag.close": "关闭标签",
        "sidebar.navigation": "主导航",
        "sidebar.expand": "展开侧边栏",
        "sidebar.collapse": "收起侧边栏",
        "sidebarItem.updated": "已更新",
        "sidebar.resize": "调整侧边栏宽度",
        "pagination.pageSize": "每页条数",
        "pagination.previous": "上一页",
        "pagination.next": "下一页",
        "pagination.page": "第 {{page}} 页",
        "otpInput.invalidCode": "请输入 {{length}} 位数字验证码",
        "input.clear": "清除输入",
        "input.increment": "增加数值",
        "input.decrement": "减少数值",
        "input.openTime": "打开时间选择",
        "input.openDate": "打开日期选择",
        "input.year": "年",
        "input.month": "月",
        "input.day": "日",
        "input.week": "周",
        "input.hour": "时",
        "input.minute": "分",
        "input.second": "秒",
        "input.yearPlaceholder": "年",
        "input.monthPlaceholder": "月",
        "input.dayPlaceholder": "日",
        "input.weekPlaceholder": "周",
        "imageViewer.previous": "上一张",
        "imageViewer.next": "下一张",
        "imageViewer.close": "关闭图片预览",
        "toast.close": "关闭通知",
        "table.scrollRegion": "可横向滚动的表格",
        "table.scrollRegionNamed": "{{name}}，可横向滚动",
        "tableHead.selectAll": "选择全部当前行",
        "tableHead.resizeColumn": "调整 {{column}} 列宽",
        "tableHead.resizeColumnGeneric": "调整列宽",
        "tableCell.selectRow": "选择当前行",
        "text.expand": "展开",
        "textarea.resize": "调整文本域大小",
        "indicator.resizeWidth": "调整宽度",
        "indicator.resizeHeight": "调整高度",
        "indicator.resizeBoth": "调整宽度和高度",
        "colorSchemeButton.toLight": "切换到亮色",
        "colorSchemeButton.toDark": "切换到暗色",
        "styleButton.toSnowUI": "切换到 SnowUI 风格",
        "styleButton.toApple": "切换到 Apple 风格",
        "sidePanel.placement.toInline": "切换为内嵌预览",
        "sidePanel.placement.toFloating": "切换为浮层预览",
        "sidePanel.previous": "上一项",
        "sidePanel.next": "下一项",
        "sidePanel.copy": "复制",
        "sidePanel.delete": "删除",
        "sidePanel.cancel": "取消",
        "sidePanel.save": "保存",
        "sidePanel.close": "关闭",
        "sidePanel.resize": "调整弹出窗宽度",
        "tableToolbar.name": "表格工具栏",
        "tableToolbar.search": "搜索",
        "tableToolbar.sort": "排序",
        "tableToolbar.filter": "筛选",
        "tableToolbar.clear": "清除",
        "tableToolbar.copy": "复制",
        "tableToolbar.delete": "删除",
        "tableToolbar.selected": "已选择 {{count}} 项",
        "tableToolbar.deleting": "删除中",
        "tableToolbar.defaultSort": "默认排序",
        "tableToolbar.ascending": "升序",
        "tableToolbar.descending": "降序",
        "tableToolbar.defaultFilter": "默认筛选",
        "overflowActions.more": "更多操作",
        "dialog.close": "关闭",
    },
    "en-US": {
        "copyButton.copy": "Copy",
        "copyButton.copied": "Copied",
        "codeBlock.copyCode": "Copy code",
        "codeBlock.fullscreen": "View fullscreen",
        "codeBlock.exitFullscreen": "Exit fullscreen",
        "codeBlock.resize": "Resize code block",
        "codeBlock.fullscreenDialog": "Fullscreen code view",
        "expandButton.expand": "Expand",
        "expandButton.collapse": "Collapse",
        "sidebarSection.expand": "Expand {{title}}",
        "sidebarSection.collapse": "Collapse {{title}}",
        "breadcrumb.navigation": "Breadcrumb",
        "pagination.navigation": "Pagination",
        "spinner.loading": "Loading",
        "scrollArea.content": "Scrollable content",
        "barChart.name": "Bar chart",
        "barChart.cells": "Bar chart data cells",
        "lineChart.name": "Line chart",
        "lineChart.cells": "Line chart data cells",
        "circularChart.name": "Circular chart",
        "gaugeChart.name": "Gauge chart",
        "chartGroup.name": "Chart group",
        "chartGroup.cells": "Chart group data cells",
        "chartGroup.cell": "Cell {{index}}",
        "searchBox.placeholder": "Search",
        "searchBox.clear": "Clear search",
        "sidePanel.title": "Details",
        "slider.title": "Text",
        "menuItem.deleteCustom": "Delete custom option",
        "listbox.search": "Search",
        "tag.close": "Close tag",
        "sidebar.navigation": "Primary navigation",
        "sidebar.expand": "Expand sidebar",
        "sidebar.collapse": "Collapse sidebar",
        "sidebarItem.updated": "Updated",
        "sidebar.resize": "Resize sidebar width",
        "pagination.pageSize": "Items per page",
        "pagination.previous": "Previous page",
        "pagination.next": "Next page",
        "pagination.page": "Page {{page}}",
        "otpInput.invalidCode": "Enter a {{length}}-digit verification code",
        "input.clear": "Clear input",
        "input.increment": "Increase value",
        "input.decrement": "Decrease value",
        "input.openTime": "Open time picker",
        "input.openDate": "Open date picker",
        "input.year": "Year",
        "input.month": "Month",
        "input.day": "Day",
        "input.week": "Week",
        "input.hour": "Hour",
        "input.minute": "Minute",
        "input.second": "Second",
        "input.yearPlaceholder": "YYYY",
        "input.monthPlaceholder": "MM",
        "input.dayPlaceholder": "DD",
        "input.weekPlaceholder": "WW",
        "imageViewer.previous": "Previous image",
        "imageViewer.next": "Next image",
        "imageViewer.close": "Close image viewer",
        "toast.close": "Close notification",
        "table.scrollRegion": "Scrollable table",
        "table.scrollRegionNamed": "{{name}}, horizontally scrollable",
        "tableHead.selectAll": "Select all current rows",
        "tableHead.resizeColumn": "Resize {{column}} column",
        "tableHead.resizeColumnGeneric": "Resize column width",
        "tableCell.selectRow": "Select current row",
        "text.expand": "Expand",
        "textarea.resize": "Resize text area",
        "indicator.resizeWidth": "Resize width",
        "indicator.resizeHeight": "Resize height",
        "indicator.resizeBoth": "Resize width and height",
        "colorSchemeButton.toLight": "Switch to light color scheme",
        "colorSchemeButton.toDark": "Switch to dark color scheme",
        "styleButton.toSnowUI": "Switch to SnowUI style",
        "styleButton.toApple": "Switch to Apple style",
        "sidePanel.placement.toInline": "Switch to inline preview",
        "sidePanel.placement.toFloating": "Switch to floating preview",
        "sidePanel.previous": "Previous item",
        "sidePanel.next": "Next item",
        "sidePanel.copy": "Copy",
        "sidePanel.delete": "Delete",
        "sidePanel.cancel": "Cancel",
        "sidePanel.save": "Save",
        "sidePanel.close": "Close",
        "sidePanel.resize": "Resize panel width",
        "tableToolbar.name": "Table toolbar",
        "tableToolbar.search": "Search",
        "tableToolbar.sort": "Sort",
        "tableToolbar.filter": "Filter",
        "tableToolbar.clear": "Clear",
        "tableToolbar.copy": "Copy",
        "tableToolbar.delete": "Delete",
        "tableToolbar.selected": "{{count}} selected",
        "tableToolbar.deleting": "Deleting",
        "tableToolbar.defaultSort": "Default sort",
        "tableToolbar.ascending": "Ascending",
        "tableToolbar.descending": "Descending",
        "tableToolbar.defaultFilter": "Default filter",
        "overflowActions.more": "More actions",
        "dialog.close": "Close",
    },
};
