# LocaleProvider 类型与状态

必填属性：无具名必填属性。

可双向绑定：本组件未声明具名双向绑定属性；状态更新通过公开回调或所属宿主处理。

继承声明：无接口继承。继承能力以基类公开文档为准；Omit 中的字段已排除，不能按基类原样使用。

[共享 Frame API](../frame/api.md) · [返回 API](./api.md)

以下为公开属性实际引用的类型声明，来自源码；Svelte Snippet 表示内容片段，ComponentProps 表示对应组件的 Props。

## SnowUIMessageOverrides

来源：src/i18n/messages.ts

```ts
export type SnowUIMessageOverrides = Partial<Record<SnowUIMessageKey, string>>;
```

## SnowUIMessageKey

来源：src/i18n/messages.ts

```ts
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
    | "input.showPassword"
    | "input.hidePassword"
    | "passwordStrength.minimumLength"
    | "passwordStrength.requirements"
    | "passwordStrength.lowercase"
    | "passwordStrength.uppercase"
    | "passwordStrength.number"
    | "passwordStrength.symbol"
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
    | "table.noData"
    | "table.loadMore"
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
```
