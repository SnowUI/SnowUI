# LocaleProvider types and states

These declarations come from the reviewed component reference for this source version. Check the installed version before using them.

<a id="localeprovider-类型与状态"></a>

# LocaleProvider types and states

Required Props: no named required Props.

Bindable Props: this component declares no named two-way binding; handle state updates through public callbacks or its host.

Inherited declaration: none. Consult the relevant base component’s public documentation for any capabilities it exposes; omitted fields cannot be used as if they were inherited.

[Shared Frame API](../frame/reference.md#api) · [Back to API](./reference.md#api)

The following type declarations are actually referenced by public Props and come from source. A Svelte Snippet denotes a content fragment; ComponentProps denotes the Props of the corresponding component.

<a id="snowuimessageoverrides"></a>

## SnowUIMessageOverrides

Source: src/i18n/messages.ts

```ts
export type SnowUIMessageOverrides = Partial<Record<SnowUIMessageKey, string>>;
```

<a id="snowuimessagekey"></a>

## SnowUIMessageKey

Source: src/i18n/messages.ts

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

[API](./api.md) · [Full reference](./reference.md)
