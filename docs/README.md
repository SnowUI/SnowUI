# SnowUI Public Documentation

Official public consumer and AI documentation for `@snowui-design-system/components` (Svelte 5).

- Language: **English** · [Simplified Chinese (zh-CN)](./zh/README.md)
- Interactive component site & live previews: https://snowui.dev/components
- Applicable license: [LICENSE](../LICENSE) (`SnowUI-Commercial-2.4.0`, proprietary source-available; free without signup for in-chat UI, pure demos, and 1-developer / 1-project local development)

## Where AI Assistants & Developers Find SnowUI Docs

| Environment | Entrypoint |
| --- | --- |
| GitHub repository or source archive | Start here (`./docs/README.md`), `./docs/guides/`, `./docs/reference/`, and `./docs/components/<slug>.md` (matching `documentation` in [component-catalog.json](../component-catalog.json)) |
| Installed npm package (`node_modules/@snowui-design-system/components`) | Local [AGENTS.md](../AGENTS.md), [llms.txt](../llms.txt), and [component-catalog.json](../component-catalog.json); read full guides/APIs via HTTPS, MCP, or CLI below (`node_modules` ships compiled `dist/`, not `docs/` or `src/`) |
| Remote MCP server (Streamable HTTP) | Connect `https://snowui.dev/mcp` (`snowui_search`, `snowui_component`, `snowui_examples`, `snowui_setup`) |
| Zero-install CLI (Node.js 22+) | Download `https://snowui.dev/snowui.mjs` and run `node snowui.mjs help` |
| Direct HTTPS Markdown / JSON | English: https://snowui.dev/llms-en.txt · Chinese: https://snowui.dev/llms.txt |

## Quick Start

Current verified baseline: `@snowui-design-system/components@1.2.4` and `@snowui-design-system/resource-svelte@1.0.33`.

```sh
pnpm add --save-exact @snowui-design-system/components@1.2.4 @snowui-design-system/resource-svelte@1.0.33
```

Load the component stylesheet once at your application entry:

```svelte
<script lang="ts">
  import { Button } from '@snowui-design-system/components';
  import '@snowui-design-system/components/styles';
</script>

<Button>Continue</Button>
```

## Guides

- [Environment, Materials & AI Setup](./guides/setup.md)
- [Design System & Layout Guide](./guides/design-system.md)
- [Component Selection Guide](./guides/component-selection.md)
- [Styling & Public Overrides Guide](./guides/styling.md)
- [Figma to SnowUI Guide](./guides/figma.md)
- [Form Composition Guide](./guides/form.md)
- [Composite Blocks Guide](./guides/blocks.md)

## Reference

- [Component & Block Directory](./components/index.md)
- [CSS Token Directory](./reference/tokens.md)
- [Public Figma Component & Variable Map](./reference/figma-map.md)
- [Design System Packages & Resource Relationships](./reference/design-system-resources.md)

## Components (82)

- [Accordion](./components/accordion.md) — [API](./components/accordion/api.md) · [Reference](./components/accordion/reference.md) · [Styles](./components/accordion/styles.md) · [Types](./components/accordion/types.md)
- [AccordionItem](./components/accordion-item.md) — [API](./components/accordion-item/api.md) · [Reference](./components/accordion-item/reference.md) · [Styles](./components/accordion-item/styles.md) · [Types](./components/accordion-item/types.md)
- [Avatar](./components/avatar.md) — [API](./components/avatar/api.md) · [Reference](./components/avatar/reference.md) · [Styles](./components/avatar/styles.md) · [Types](./components/avatar/types.md)
- [AvatarGroup](./components/avatar-group.md) — [API](./components/avatar-group/api.md) · [Reference](./components/avatar-group/reference.md) · [Styles](./components/avatar-group/styles.md) · [Types](./components/avatar-group/types.md)
- [Badge](./components/badge.md) — [API](./components/badge/api.md) · [Reference](./components/badge/reference.md) · [Styles](./components/badge/styles.md) · [Types](./components/badge/types.md)
- [BarChart](./components/bar-chart.md) — [API](./components/bar-chart/api.md) · [Reference](./components/bar-chart/reference.md) · [Styles](./components/bar-chart/styles.md) · [Types](./components/bar-chart/types.md)
- [BlurText](./components/blur-text.md) — [API](./components/blur-text/api.md) · [Reference](./components/blur-text/reference.md) · [Styles](./components/blur-text/styles.md) · [Types](./components/blur-text/types.md)
- [Breadcrumb](./components/breadcrumb.md) — [API](./components/breadcrumb/api.md) · [Reference](./components/breadcrumb/reference.md) · [Styles](./components/breadcrumb/styles.md) · [Types](./components/breadcrumb/types.md)
- [Button](./components/button.md) — [API](./components/button/api.md) · [Reference](./components/button/reference.md) · [Styles](./components/button/styles.md) · [Types](./components/button/types.md)
- [ButtonGroup](./components/button-group.md) — [API](./components/button-group/api.md) · [Reference](./components/button-group/reference.md) · [Styles](./components/button-group/styles.md) · [Types](./components/button-group/types.md)
- [Card](./components/card.md) — [API](./components/card/api.md) · [Reference](./components/card/reference.md) · [Styles](./components/card/styles.md) · [Types](./components/card/types.md)
- [ChartGroup](./components/chart-group.md) — [API](./components/chart-group/api.md) · [Reference](./components/chart-group/reference.md) · [Styles](./components/chart-group/styles.md) · [Types](./components/chart-group/types.md)
- [Checkbox](./components/checkbox.md) — [API](./components/checkbox/api.md) · [Reference](./components/checkbox/reference.md) · [Styles](./components/checkbox/styles.md) · [Types](./components/checkbox/types.md)
- [Chip](./components/chip.md) — [API](./components/chip/api.md) · [Reference](./components/chip/reference.md) · [Styles](./components/chip/styles.md) · [Types](./components/chip/types.md)
- [CircularChart](./components/circular-chart.md) — [API](./components/circular-chart/api.md) · [Reference](./components/circular-chart/reference.md) · [Styles](./components/circular-chart/styles.md) · [Types](./components/circular-chart/types.md)
- [CodeBlock](./components/code-block.md) — [API](./components/code-block/api.md) · [Reference](./components/code-block/reference.md) · [Styles](./components/code-block/styles.md) · [Types](./components/code-block/types.md)
- [ColorSchemeButton](./components/color-scheme-button.md) — [API](./components/color-scheme-button/api.md) · [Reference](./components/color-scheme-button/reference.md) · [Styles](./components/color-scheme-button/styles.md) · [Types](./components/color-scheme-button/types.md)
- [CopyButton](./components/copy-button.md) — [API](./components/copy-button/api.md) · [Reference](./components/copy-button/reference.md) · [Styles](./components/copy-button/styles.md) · [Types](./components/copy-button/types.md)
- [CopyLink](./components/copy-link.md) — [API](./components/copy-link/api.md) · [Reference](./components/copy-link/reference.md) · [Styles](./components/copy-link/styles.md) · [Types](./components/copy-link/types.md)
- [DataTable](./components/data-table.md) — [API](./components/data-table/api.md) · [Reference](./components/data-table/reference.md) · [Styles](./components/data-table/styles.md) · [Types](./components/data-table/types.md)
- [Dialog](./components/dialog.md) — [API](./components/dialog/api.md) · [Reference](./components/dialog/reference.md) · [Styles](./components/dialog/styles.md) · [Types](./components/dialog/types.md)
- [ExpandButton](./components/expand-button.md) — [API](./components/expand-button/api.md) · [Reference](./components/expand-button/reference.md) · [Styles](./components/expand-button/styles.md) · [Types](./components/expand-button/types.md)
- [Field](./components/field.md) — [API](./components/field/api.md) · [Reference](./components/field/reference.md) · [Styles](./components/field/styles.md) · [Types](./components/field/types.md)
- [FlowText](./components/flow-text.md) — [API](./components/flow-text/api.md) · [Reference](./components/flow-text/reference.md) · [Styles](./components/flow-text/styles.md) · [Types](./components/flow-text/types.md)
- [Frame](./components/frame.md) — [API](./components/frame/api.md) · [Reference](./components/frame/reference.md) · [Styles](./components/frame/styles.md) · [Types](./components/frame/types.md)
- [GaugeChart](./components/gauge-chart.md) — [API](./components/gauge-chart/api.md) · [Reference](./components/gauge-chart/reference.md) · [Styles](./components/gauge-chart/styles.md) · [Types](./components/gauge-chart/types.md)
- [Gradient](./components/gradient.md) — [API](./components/gradient/api.md) · [Reference](./components/gradient/reference.md) · [Styles](./components/gradient/styles.md) · [Types](./components/gradient/types.md)
- [GradientMotion](./components/gradient-motion.md) — [API](./components/gradient-motion/api.md) · [Reference](./components/gradient-motion/reference.md) · [Styles](./components/gradient-motion/styles.md) · [Types](./components/gradient-motion/types.md)
- [Icon](./components/icon.md) — [API](./components/icon/api.md) · [Reference](./components/icon/reference.md) · [Styles](./components/icon/styles.md) · [Types](./components/icon/types.md)
- [IconProvider](./components/icon-provider.md) — [API](./components/icon-provider/api.md) · [Reference](./components/icon-provider/reference.md) · [Styles](./components/icon-provider/styles.md) · [Types](./components/icon-provider/types.md)
- [Image](./components/image.md) — [API](./components/image/api.md) · [Reference](./components/image/reference.md) · [Styles](./components/image/styles.md) · [Types](./components/image/types.md)
- [ImageGroup](./components/image-group.md) — [API](./components/image-group/api.md) · [Reference](./components/image-group/reference.md) · [Styles](./components/image-group/styles.md) · [Types](./components/image-group/types.md)
- [ImageViewer](./components/image-viewer.md) — [API](./components/image-viewer/api.md) · [Reference](./components/image-viewer/reference.md) · [Styles](./components/image-viewer/styles.md) · [Types](./components/image-viewer/types.md)
- [Indicator](./components/indicator.md) — [API](./components/indicator/api.md) · [Reference](./components/indicator/reference.md) · [Styles](./components/indicator/styles.md) · [Types](./components/indicator/types.md)
- [Input](./components/input.md) — [API](./components/input/api.md) · [Reference](./components/input/reference.md) · [Styles](./components/input/styles.md) · [Types](./components/input/types.md)
- [Kbd](./components/kbd.md) — [API](./components/kbd/api.md) · [Reference](./components/kbd/reference.md) · [Styles](./components/kbd/styles.md) · [Types](./components/kbd/types.md)
- [LineChart](./components/line-chart.md) — [API](./components/line-chart/api.md) · [Reference](./components/line-chart/reference.md) · [Styles](./components/line-chart/styles.md) · [Types](./components/line-chart/types.md)
- [Link](./components/link.md) — [API](./components/link/api.md) · [Reference](./components/link/reference.md) · [Styles](./components/link/styles.md) · [Types](./components/link/types.md)
- [Listbox](./components/listbox.md) — [API](./components/listbox/api.md) · [Reference](./components/listbox/reference.md) · [Styles](./components/listbox/styles.md) · [Types](./components/listbox/types.md)
- [LocaleProvider](./components/locale-provider.md) — [API](./components/locale-provider/api.md) · [Reference](./components/locale-provider/reference.md) · [Styles](./components/locale-provider/styles.md) · [Types](./components/locale-provider/types.md)
- [MenuItem](./components/menu-item.md) — [API](./components/menu-item/api.md) · [Reference](./components/menu-item/reference.md) · [Styles](./components/menu-item/styles.md) · [Types](./components/menu-item/types.md)
- [MetricCard](./components/metric-card.md) — [API](./components/metric-card/api.md) · [Reference](./components/metric-card/reference.md) · [Styles](./components/metric-card/styles.md) · [Types](./components/metric-card/types.md)
- [NumberFlow](./components/number-flow.md) — [API](./components/number-flow/api.md) · [Reference](./components/number-flow/reference.md) · [Styles](./components/number-flow/styles.md) · [Types](./components/number-flow/types.md)
- [NumericText](./components/numeric-text.md) — [API](./components/numeric-text/api.md) · [Reference](./components/numeric-text/reference.md) · [Styles](./components/numeric-text/styles.md) · [Types](./components/numeric-text/types.md)
- [OTPInput](./components/otp-input.md) — [API](./components/otp-input/api.md) · [Reference](./components/otp-input/reference.md) · [Styles](./components/otp-input/styles.md) · [Types](./components/otp-input/types.md)
- [OverflowAction](./components/overflow-action.md) — [API](./components/overflow-action/api.md) · [Reference](./components/overflow-action/reference.md) · [Styles](./components/overflow-action/styles.md) · [Types](./components/overflow-action/types.md)
- [OverflowActions](./components/overflow-actions.md) — [API](./components/overflow-actions/api.md) · [Reference](./components/overflow-actions/reference.md) · [Styles](./components/overflow-actions/styles.md) · [Types](./components/overflow-actions/types.md)
- [Pagination](./components/pagination.md) — [API](./components/pagination/api.md) · [Reference](./components/pagination/reference.md) · [Styles](./components/pagination/styles.md) · [Types](./components/pagination/types.md)
- [PasswordStrength](./components/password-strength.md) — [API](./components/password-strength/api.md) · [Reference](./components/password-strength/reference.md) · [Styles](./components/password-strength/styles.md) · [Types](./components/password-strength/types.md)
- [Popover](./components/popover.md) — [API](./components/popover/api.md) · [Reference](./components/popover/reference.md) · [Styles](./components/popover/styles.md) · [Types](./components/popover/types.md)
- [Progress](./components/progress.md) — [API](./components/progress/api.md) · [Reference](./components/progress/reference.md) · [Styles](./components/progress/styles.md) · [Types](./components/progress/types.md)
- [Radio](./components/radio.md) — [API](./components/radio/api.md) · [Reference](./components/radio/reference.md) · [Styles](./components/radio/styles.md) · [Types](./components/radio/types.md)
- [ScrambleText](./components/scramble-text.md) — [API](./components/scramble-text/api.md) · [Reference](./components/scramble-text/reference.md) · [Styles](./components/scramble-text/styles.md) · [Types](./components/scramble-text/types.md)
- [ScrollArea](./components/scroll-area.md) — [API](./components/scroll-area/api.md) · [Reference](./components/scroll-area/reference.md) · [Styles](./components/scroll-area/styles.md) · [Types](./components/scroll-area/types.md)
- [SearchBox](./components/search-box.md) — [API](./components/search-box/api.md) · [Reference](./components/search-box/reference.md) · [Styles](./components/search-box/styles.md) · [Types](./components/search-box/types.md)
- [SearchInput](./components/search-input.md) — [API](./components/search-input/api.md) · [Reference](./components/search-input/reference.md) · [Styles](./components/search-input/styles.md) · [Types](./components/search-input/types.md)
- [Segmented](./components/segmented.md) — [API](./components/segmented/api.md) · [Reference](./components/segmented/reference.md) · [Styles](./components/segmented/styles.md) · [Types](./components/segmented/types.md)
- [Select](./components/select.md) — [API](./components/select/api.md) · [Reference](./components/select/reference.md) · [Styles](./components/select/styles.md) · [Types](./components/select/types.md)
- [SelectButton](./components/select-button.md) — [API](./components/select-button/api.md) · [Reference](./components/select-button/reference.md) · [Styles](./components/select-button/styles.md) · [Types](./components/select-button/types.md)
- [Separator](./components/separator.md) — [API](./components/separator/api.md) · [Reference](./components/separator/reference.md) · [Styles](./components/separator/styles.md) · [Types](./components/separator/types.md)
- [SidePanel](./components/side-panel.md) — [API](./components/side-panel/api.md) · [Reference](./components/side-panel/reference.md) · [Styles](./components/side-panel/styles.md) · [Types](./components/side-panel/types.md)
- [Skeleton](./components/skeleton.md) — [API](./components/skeleton/api.md) · [Reference](./components/skeleton/reference.md) · [Styles](./components/skeleton/styles.md) · [Types](./components/skeleton/types.md)
- [Slider](./components/slider.md) — [API](./components/slider/api.md) · [Reference](./components/slider/reference.md) · [Styles](./components/slider/styles.md) · [Types](./components/slider/types.md)
- [SlotText](./components/slot-text.md) — [API](./components/slot-text/api.md) · [Reference](./components/slot-text/reference.md) · [Styles](./components/slot-text/styles.md) · [Types](./components/slot-text/types.md)
- [SnowUILogo](./components/snow-ui-logo.md) — [API](./components/snow-ui-logo/api.md) · [Reference](./components/snow-ui-logo/reference.md) · [Styles](./components/snow-ui-logo/styles.md) · [Types](./components/snow-ui-logo/types.md)
- [Spinner](./components/spinner.md) — [API](./components/spinner/api.md) · [Reference](./components/spinner/reference.md) · [Styles](./components/spinner/styles.md) · [Types](./components/spinner/types.md)
- [StyleButton](./components/style-button.md) — [API](./components/style-button/api.md) · [Reference](./components/style-button/reference.md) · [Styles](./components/style-button/styles.md) · [Types](./components/style-button/types.md)
- [Switch](./components/switch.md) — [API](./components/switch/api.md) · [Reference](./components/switch/reference.md) · [Styles](./components/switch/styles.md) · [Types](./components/switch/types.md)
- [Tab](./components/tab.md) — [API](./components/tab/api.md) · [Reference](./components/tab/reference.md) · [Styles](./components/tab/styles.md) · [Types](./components/tab/types.md)
- [Table](./components/table.md) — [API](./components/table/api.md) · [Reference](./components/table/reference.md) · [Styles](./components/table/styles.md) · [Types](./components/table/types.md)
- [TableBody](./components/table-body.md) — [API](./components/table-body/api.md) · [Reference](./components/table-body/reference.md) · [Styles](./components/table-body/styles.md) · [Types](./components/table-body/types.md)
- [TableCell](./components/table-cell.md) — [API](./components/table-cell/api.md) · [Reference](./components/table-cell/reference.md) · [Styles](./components/table-cell/styles.md) · [Types](./components/table-cell/types.md)
- [TableHead](./components/table-head.md) — [API](./components/table-head/api.md) · [Reference](./components/table-head/reference.md) · [Styles](./components/table-head/styles.md) · [Types](./components/table-head/types.md)
- [TableHeader](./components/table-header.md) — [API](./components/table-header/api.md) · [Reference](./components/table-header/reference.md) · [Styles](./components/table-header/styles.md) · [Types](./components/table-header/types.md)
- [TableRow](./components/table-row.md) — [API](./components/table-row/api.md) · [Reference](./components/table-row/reference.md) · [Styles](./components/table-row/styles.md) · [Types](./components/table-row/types.md)
- [TableToolbar](./components/table-toolbar.md) — [API](./components/table-toolbar/api.md) · [Reference](./components/table-toolbar/reference.md) · [Styles](./components/table-toolbar/styles.md) · [Types](./components/table-toolbar/types.md)
- [Tag](./components/tag.md) — [API](./components/tag/api.md) · [Reference](./components/tag/reference.md) · [Styles](./components/tag/styles.md) · [Types](./components/tag/types.md)
- [Text](./components/text.md) — [API](./components/text/api.md) · [Reference](./components/text/reference.md) · [Styles](./components/text/styles.md) · [Types](./components/text/types.md)
- [Textarea](./components/textarea.md) — [API](./components/textarea/api.md) · [Reference](./components/textarea/reference.md) · [Styles](./components/textarea/styles.md) · [Types](./components/textarea/types.md)
- [Toast](./components/toast.md) — [API](./components/toast/api.md) · [Reference](./components/toast/reference.md) · [Styles](./components/toast/styles.md) · [Types](./components/toast/types.md)
- [Toaster](./components/toaster.md) — [API](./components/toaster/api.md) · [Reference](./components/toaster/reference.md) · [Styles](./components/toaster/styles.md) · [Types](./components/toaster/types.md)
- [Tooltip](./components/tooltip.md) — [API](./components/tooltip/api.md) · [Reference](./components/tooltip/reference.md) · [Styles](./components/tooltip/styles.md) · [Types](./components/tooltip/types.md)

## Blocks (4)

- [SearchPopup](./components/search-popup.md) — [API](./components/search-popup/api.md) · [Reference](./components/search-popup/reference.md) · [Styles](./components/search-popup/styles.md) · [Types](./components/search-popup/types.md)
- [Sidebar](./components/sidebar.md) — [API](./components/sidebar/api.md) · [Reference](./components/sidebar/reference.md) · [Styles](./components/sidebar/styles.md) · [Types](./components/sidebar/types.md)
- [SidebarItem](./components/sidebar-item.md) — [API](./components/sidebar-item/api.md) · [Reference](./components/sidebar-item/reference.md) · [Styles](./components/sidebar-item/styles.md) · [Types](./components/sidebar-item/types.md)
- [SidebarSection](./components/sidebar-section.md) — [API](./components/sidebar-section/api.md) · [Reference](./components/sidebar-section/reference.md) · [Styles](./components/sidebar-section/styles.md) · [Types](./components/sidebar-section/types.md)
