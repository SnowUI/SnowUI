# SnowUI 公开文档总览

`@snowui-design-system/components`（Svelte 5）面向外部开发者与 AI 助手的公开使用文档。

- 语言：**简体中文** · [English Documentation](../README.md)
- 在线交互组件站与实时预览：https://snowui.dev/components
- 适用许可：[LICENSE](../../LICENSE)（`SnowUI-Commercial-2.4.0` 专有源码可见许可；对话内界面、纯演示与单人单项目本机开发免注册免费使用）

## AI 助手与开发者文档寻址表

| 所处环境 | 文档读取入口 |
| --- | --- |
| GitHub 仓库或官方源码归档 | 本目录（`./docs/zh/README.md`，英文默认入口 `./docs/README.md`），含 `./guides/`、`./reference/` 与 `./components/<slug>.md` |
| 已安装 npm 包（`node_modules/@snowui-design-system/components`） | 包内自带 [AGENTS.md](../../AGENTS.md)、[llms.txt](../../llms.txt) 与 [component-catalog.json](../../component-catalog.json)；完整 API／指南通过下方 HTTPS、MCP 或 CLI 按需读取（`node_modules` 仅含编译产物 `dist/`，不含 `docs/` 与 `src/`） |
| 远程 MCP 服务（Streamable HTTP） | 连接 `https://snowui.dev/mcp`（提供 `snowui_search`、`snowui_component`、`snowui_examples`、`snowui_setup`） |
| 单文件 CLI（Node.js 22+） | 下载 `https://snowui.dev/snowui.mjs` 并运行 `node snowui.mjs help` |
| 在线 HTTPS 文档主入口 | 中文：https://snowui.dev/llms.txt · 英文：https://snowui.dev/llms-en.txt |

## 快速开始

当前已核对安装基线：`@snowui-design-system/components@1.2.4` 与 `@snowui-design-system/resource-svelte@1.0.33`。

```sh
pnpm add --save-exact @snowui-design-system/components@1.2.4 @snowui-design-system/resource-svelte@1.0.33
```

在应用入口只加载一次组件包样式：

```svelte
<script lang="ts">
  import { Button } from '@snowui-design-system/components';
  import '@snowui-design-system/components/styles';
</script>

<Button>继续</Button>
```

## 专题指南

- [环境、素材与 AI 配置指南](./guides/setup.md)
- [设计系统与页面搭建指南](./guides/design-system.md)
- [组件选型指南](./guides/component-selection.md)
- [样式选择与改写顺序](./guides/styling.md)
- [Figma 设计还原指南](./guides/figma.md)
- [表单组合指南](./guides/form.md)
- [复合区块（Blocks）指南](./guides/blocks.md)

## 参考与映射

- [组件与区块完整目录](./components/index.md)
- [CSS Token 目录](./reference/tokens.md)
- [公开 Figma 组件与变量对照](./reference/figma-map.md)
- [设计系统包与资料关系](./reference/design-system-resources.md)
- [AI 截图索引说明](./reference/screenshots.md)

## 组件索引（82）

- [Accordion](./components/accordion.md) — [API](./components/accordion/api.md) · [完整说明](./components/accordion/reference.md) · [样式覆盖](./components/accordion/styles.md) · [类型与状态](./components/accordion/types.md)
- [AccordionItem](./components/accordion-item.md) — [API](./components/accordion-item/api.md) · [完整说明](./components/accordion-item/reference.md) · [样式覆盖](./components/accordion-item/styles.md) · [类型与状态](./components/accordion-item/types.md)
- [Avatar](./components/avatar.md) — [API](./components/avatar/api.md) · [完整说明](./components/avatar/reference.md) · [样式覆盖](./components/avatar/styles.md) · [类型与状态](./components/avatar/types.md)
- [AvatarGroup](./components/avatar-group.md) — [API](./components/avatar-group/api.md) · [完整说明](./components/avatar-group/reference.md) · [样式覆盖](./components/avatar-group/styles.md) · [类型与状态](./components/avatar-group/types.md)
- [Badge](./components/badge.md) — [API](./components/badge/api.md) · [完整说明](./components/badge/reference.md) · [样式覆盖](./components/badge/styles.md) · [类型与状态](./components/badge/types.md)
- [BarChart](./components/bar-chart.md) — [API](./components/bar-chart/api.md) · [完整说明](./components/bar-chart/reference.md) · [样式覆盖](./components/bar-chart/styles.md) · [类型与状态](./components/bar-chart/types.md)
- [BlurText](./components/blur-text.md) — [API](./components/blur-text/api.md) · [完整说明](./components/blur-text/reference.md) · [样式覆盖](./components/blur-text/styles.md) · [类型与状态](./components/blur-text/types.md)
- [Breadcrumb](./components/breadcrumb.md) — [API](./components/breadcrumb/api.md) · [完整说明](./components/breadcrumb/reference.md) · [样式覆盖](./components/breadcrumb/styles.md) · [类型与状态](./components/breadcrumb/types.md)
- [Button](./components/button.md) — [API](./components/button/api.md) · [完整说明](./components/button/reference.md) · [样式覆盖](./components/button/styles.md) · [类型与状态](./components/button/types.md)
- [ButtonGroup](./components/button-group.md) — [API](./components/button-group/api.md) · [完整说明](./components/button-group/reference.md) · [样式覆盖](./components/button-group/styles.md) · [类型与状态](./components/button-group/types.md)
- [Card](./components/card.md) — [API](./components/card/api.md) · [完整说明](./components/card/reference.md) · [样式覆盖](./components/card/styles.md) · [类型与状态](./components/card/types.md)
- [ChartGroup](./components/chart-group.md) — [API](./components/chart-group/api.md) · [完整说明](./components/chart-group/reference.md) · [样式覆盖](./components/chart-group/styles.md) · [类型与状态](./components/chart-group/types.md)
- [Checkbox](./components/checkbox.md) — [API](./components/checkbox/api.md) · [完整说明](./components/checkbox/reference.md) · [样式覆盖](./components/checkbox/styles.md) · [类型与状态](./components/checkbox/types.md)
- [Chip](./components/chip.md) — [API](./components/chip/api.md) · [完整说明](./components/chip/reference.md) · [样式覆盖](./components/chip/styles.md) · [类型与状态](./components/chip/types.md)
- [CircularChart](./components/circular-chart.md) — [API](./components/circular-chart/api.md) · [完整说明](./components/circular-chart/reference.md) · [样式覆盖](./components/circular-chart/styles.md) · [类型与状态](./components/circular-chart/types.md)
- [CodeBlock](./components/code-block.md) — [API](./components/code-block/api.md) · [完整说明](./components/code-block/reference.md) · [样式覆盖](./components/code-block/styles.md) · [类型与状态](./components/code-block/types.md)
- [ColorSchemeButton](./components/color-scheme-button.md) — [API](./components/color-scheme-button/api.md) · [完整说明](./components/color-scheme-button/reference.md) · [样式覆盖](./components/color-scheme-button/styles.md) · [类型与状态](./components/color-scheme-button/types.md)
- [CopyButton](./components/copy-button.md) — [API](./components/copy-button/api.md) · [完整说明](./components/copy-button/reference.md) · [样式覆盖](./components/copy-button/styles.md) · [类型与状态](./components/copy-button/types.md)
- [CopyLink](./components/copy-link.md) — [API](./components/copy-link/api.md) · [完整说明](./components/copy-link/reference.md) · [样式覆盖](./components/copy-link/styles.md) · [类型与状态](./components/copy-link/types.md)
- [DataTable](./components/data-table.md) — [API](./components/data-table/api.md) · [完整说明](./components/data-table/reference.md) · [样式覆盖](./components/data-table/styles.md) · [类型与状态](./components/data-table/types.md)
- [Dialog](./components/dialog.md) — [API](./components/dialog/api.md) · [完整说明](./components/dialog/reference.md) · [样式覆盖](./components/dialog/styles.md) · [类型与状态](./components/dialog/types.md)
- [ExpandButton](./components/expand-button.md) — [API](./components/expand-button/api.md) · [完整说明](./components/expand-button/reference.md) · [样式覆盖](./components/expand-button/styles.md) · [类型与状态](./components/expand-button/types.md)
- [Field](./components/field.md) — [API](./components/field/api.md) · [完整说明](./components/field/reference.md) · [样式覆盖](./components/field/styles.md) · [类型与状态](./components/field/types.md)
- [FlowText](./components/flow-text.md) — [API](./components/flow-text/api.md) · [完整说明](./components/flow-text/reference.md) · [样式覆盖](./components/flow-text/styles.md) · [类型与状态](./components/flow-text/types.md)
- [Frame](./components/frame.md) — [API](./components/frame/api.md) · [完整说明](./components/frame/reference.md) · [样式覆盖](./components/frame/styles.md) · [类型与状态](./components/frame/types.md)
- [GaugeChart](./components/gauge-chart.md) — [API](./components/gauge-chart/api.md) · [完整说明](./components/gauge-chart/reference.md) · [样式覆盖](./components/gauge-chart/styles.md) · [类型与状态](./components/gauge-chart/types.md)
- [Gradient](./components/gradient.md) — [API](./components/gradient/api.md) · [完整说明](./components/gradient/reference.md) · [样式覆盖](./components/gradient/styles.md) · [类型与状态](./components/gradient/types.md)
- [GradientMotion](./components/gradient-motion.md) — [API](./components/gradient-motion/api.md) · [完整说明](./components/gradient-motion/reference.md) · [样式覆盖](./components/gradient-motion/styles.md) · [类型与状态](./components/gradient-motion/types.md)
- [Icon](./components/icon.md) — [API](./components/icon/api.md) · [完整说明](./components/icon/reference.md) · [样式覆盖](./components/icon/styles.md) · [类型与状态](./components/icon/types.md)
- [IconProvider](./components/icon-provider.md) — [API](./components/icon-provider/api.md) · [完整说明](./components/icon-provider/reference.md) · [样式覆盖](./components/icon-provider/styles.md) · [类型与状态](./components/icon-provider/types.md)
- [Image](./components/image.md) — [API](./components/image/api.md) · [完整说明](./components/image/reference.md) · [样式覆盖](./components/image/styles.md) · [类型与状态](./components/image/types.md)
- [ImageGroup](./components/image-group.md) — [API](./components/image-group/api.md) · [完整说明](./components/image-group/reference.md) · [样式覆盖](./components/image-group/styles.md) · [类型与状态](./components/image-group/types.md)
- [ImageViewer](./components/image-viewer.md) — [API](./components/image-viewer/api.md) · [完整说明](./components/image-viewer/reference.md) · [样式覆盖](./components/image-viewer/styles.md) · [类型与状态](./components/image-viewer/types.md)
- [Indicator](./components/indicator.md) — [API](./components/indicator/api.md) · [完整说明](./components/indicator/reference.md) · [样式覆盖](./components/indicator/styles.md) · [类型与状态](./components/indicator/types.md)
- [Input](./components/input.md) — [API](./components/input/api.md) · [完整说明](./components/input/reference.md) · [样式覆盖](./components/input/styles.md) · [类型与状态](./components/input/types.md)
- [Kbd](./components/kbd.md) — [API](./components/kbd/api.md) · [完整说明](./components/kbd/reference.md) · [样式覆盖](./components/kbd/styles.md) · [类型与状态](./components/kbd/types.md)
- [LineChart](./components/line-chart.md) — [API](./components/line-chart/api.md) · [完整说明](./components/line-chart/reference.md) · [样式覆盖](./components/line-chart/styles.md) · [类型与状态](./components/line-chart/types.md)
- [Link](./components/link.md) — [API](./components/link/api.md) · [完整说明](./components/link/reference.md) · [样式覆盖](./components/link/styles.md) · [类型与状态](./components/link/types.md)
- [Listbox](./components/listbox.md) — [API](./components/listbox/api.md) · [完整说明](./components/listbox/reference.md) · [样式覆盖](./components/listbox/styles.md) · [类型与状态](./components/listbox/types.md)
- [LocaleProvider](./components/locale-provider.md) — [API](./components/locale-provider/api.md) · [完整说明](./components/locale-provider/reference.md) · [样式覆盖](./components/locale-provider/styles.md) · [类型与状态](./components/locale-provider/types.md)
- [MenuItem](./components/menu-item.md) — [API](./components/menu-item/api.md) · [完整说明](./components/menu-item/reference.md) · [样式覆盖](./components/menu-item/styles.md) · [类型与状态](./components/menu-item/types.md)
- [MetricCard](./components/metric-card.md) — [API](./components/metric-card/api.md) · [完整说明](./components/metric-card/reference.md) · [样式覆盖](./components/metric-card/styles.md) · [类型与状态](./components/metric-card/types.md)
- [NumberFlow](./components/number-flow.md) — [API](./components/number-flow/api.md) · [完整说明](./components/number-flow/reference.md) · [样式覆盖](./components/number-flow/styles.md) · [类型与状态](./components/number-flow/types.md)
- [NumericText](./components/numeric-text.md) — [API](./components/numeric-text/api.md) · [完整说明](./components/numeric-text/reference.md) · [样式覆盖](./components/numeric-text/styles.md) · [类型与状态](./components/numeric-text/types.md)
- [OTPInput](./components/otp-input.md) — [API](./components/otp-input/api.md) · [完整说明](./components/otp-input/reference.md) · [样式覆盖](./components/otp-input/styles.md) · [类型与状态](./components/otp-input/types.md)
- [OverflowAction](./components/overflow-action.md) — [API](./components/overflow-action/api.md) · [完整说明](./components/overflow-action/reference.md) · [样式覆盖](./components/overflow-action/styles.md) · [类型与状态](./components/overflow-action/types.md)
- [OverflowActions](./components/overflow-actions.md) — [API](./components/overflow-actions/api.md) · [完整说明](./components/overflow-actions/reference.md) · [样式覆盖](./components/overflow-actions/styles.md) · [类型与状态](./components/overflow-actions/types.md)
- [Pagination](./components/pagination.md) — [API](./components/pagination/api.md) · [完整说明](./components/pagination/reference.md) · [样式覆盖](./components/pagination/styles.md) · [类型与状态](./components/pagination/types.md)
- [PasswordStrength](./components/password-strength.md) — [API](./components/password-strength/api.md) · [完整说明](./components/password-strength/reference.md) · [样式覆盖](./components/password-strength/styles.md) · [类型与状态](./components/password-strength/types.md)
- [Popover](./components/popover.md) — [API](./components/popover/api.md) · [完整说明](./components/popover/reference.md) · [样式覆盖](./components/popover/styles.md) · [类型与状态](./components/popover/types.md)
- [Progress](./components/progress.md) — [API](./components/progress/api.md) · [完整说明](./components/progress/reference.md) · [样式覆盖](./components/progress/styles.md) · [类型与状态](./components/progress/types.md)
- [Radio](./components/radio.md) — [API](./components/radio/api.md) · [完整说明](./components/radio/reference.md) · [样式覆盖](./components/radio/styles.md) · [类型与状态](./components/radio/types.md)
- [ScrambleText](./components/scramble-text.md) — [API](./components/scramble-text/api.md) · [完整说明](./components/scramble-text/reference.md) · [样式覆盖](./components/scramble-text/styles.md) · [类型与状态](./components/scramble-text/types.md)
- [ScrollArea](./components/scroll-area.md) — [API](./components/scroll-area/api.md) · [完整说明](./components/scroll-area/reference.md) · [样式覆盖](./components/scroll-area/styles.md) · [类型与状态](./components/scroll-area/types.md)
- [SearchBox](./components/search-box.md) — [API](./components/search-box/api.md) · [完整说明](./components/search-box/reference.md) · [样式覆盖](./components/search-box/styles.md) · [类型与状态](./components/search-box/types.md)
- [SearchInput](./components/search-input.md) — [API](./components/search-input/api.md) · [完整说明](./components/search-input/reference.md) · [样式覆盖](./components/search-input/styles.md) · [类型与状态](./components/search-input/types.md)
- [Segmented](./components/segmented.md) — [API](./components/segmented/api.md) · [完整说明](./components/segmented/reference.md) · [样式覆盖](./components/segmented/styles.md) · [类型与状态](./components/segmented/types.md)
- [Select](./components/select.md) — [API](./components/select/api.md) · [完整说明](./components/select/reference.md) · [样式覆盖](./components/select/styles.md) · [类型与状态](./components/select/types.md)
- [SelectButton](./components/select-button.md) — [API](./components/select-button/api.md) · [完整说明](./components/select-button/reference.md) · [样式覆盖](./components/select-button/styles.md) · [类型与状态](./components/select-button/types.md)
- [Separator](./components/separator.md) — [API](./components/separator/api.md) · [完整说明](./components/separator/reference.md) · [样式覆盖](./components/separator/styles.md) · [类型与状态](./components/separator/types.md)
- [SidePanel](./components/side-panel.md) — [API](./components/side-panel/api.md) · [完整说明](./components/side-panel/reference.md) · [样式覆盖](./components/side-panel/styles.md) · [类型与状态](./components/side-panel/types.md)
- [Skeleton](./components/skeleton.md) — [API](./components/skeleton/api.md) · [完整说明](./components/skeleton/reference.md) · [样式覆盖](./components/skeleton/styles.md) · [类型与状态](./components/skeleton/types.md)
- [Slider](./components/slider.md) — [API](./components/slider/api.md) · [完整说明](./components/slider/reference.md) · [样式覆盖](./components/slider/styles.md) · [类型与状态](./components/slider/types.md)
- [SlotText](./components/slot-text.md) — [API](./components/slot-text/api.md) · [完整说明](./components/slot-text/reference.md) · [样式覆盖](./components/slot-text/styles.md) · [类型与状态](./components/slot-text/types.md)
- [SnowUILogo](./components/snow-ui-logo.md) — [API](./components/snow-ui-logo/api.md) · [完整说明](./components/snow-ui-logo/reference.md) · [样式覆盖](./components/snow-ui-logo/styles.md) · [类型与状态](./components/snow-ui-logo/types.md)
- [Spinner](./components/spinner.md) — [API](./components/spinner/api.md) · [完整说明](./components/spinner/reference.md) · [样式覆盖](./components/spinner/styles.md) · [类型与状态](./components/spinner/types.md)
- [StyleButton](./components/style-button.md) — [API](./components/style-button/api.md) · [完整说明](./components/style-button/reference.md) · [样式覆盖](./components/style-button/styles.md) · [类型与状态](./components/style-button/types.md)
- [Switch](./components/switch.md) — [API](./components/switch/api.md) · [完整说明](./components/switch/reference.md) · [样式覆盖](./components/switch/styles.md) · [类型与状态](./components/switch/types.md)
- [Tab](./components/tab.md) — [API](./components/tab/api.md) · [完整说明](./components/tab/reference.md) · [样式覆盖](./components/tab/styles.md) · [类型与状态](./components/tab/types.md)
- [Table](./components/table.md) — [API](./components/table/api.md) · [完整说明](./components/table/reference.md) · [样式覆盖](./components/table/styles.md) · [类型与状态](./components/table/types.md)
- [TableBody](./components/table-body.md) — [API](./components/table-body/api.md) · [完整说明](./components/table-body/reference.md) · [样式覆盖](./components/table-body/styles.md) · [类型与状态](./components/table-body/types.md)
- [TableCell](./components/table-cell.md) — [API](./components/table-cell/api.md) · [完整说明](./components/table-cell/reference.md) · [样式覆盖](./components/table-cell/styles.md) · [类型与状态](./components/table-cell/types.md)
- [TableHead](./components/table-head.md) — [API](./components/table-head/api.md) · [完整说明](./components/table-head/reference.md) · [样式覆盖](./components/table-head/styles.md) · [类型与状态](./components/table-head/types.md)
- [TableHeader](./components/table-header.md) — [API](./components/table-header/api.md) · [完整说明](./components/table-header/reference.md) · [样式覆盖](./components/table-header/styles.md) · [类型与状态](./components/table-header/types.md)
- [TableRow](./components/table-row.md) — [API](./components/table-row/api.md) · [完整说明](./components/table-row/reference.md) · [样式覆盖](./components/table-row/styles.md) · [类型与状态](./components/table-row/types.md)
- [TableToolbar](./components/table-toolbar.md) — [API](./components/table-toolbar/api.md) · [完整说明](./components/table-toolbar/reference.md) · [样式覆盖](./components/table-toolbar/styles.md) · [类型与状态](./components/table-toolbar/types.md)
- [Tag](./components/tag.md) — [API](./components/tag/api.md) · [完整说明](./components/tag/reference.md) · [样式覆盖](./components/tag/styles.md) · [类型与状态](./components/tag/types.md)
- [Text](./components/text.md) — [API](./components/text/api.md) · [完整说明](./components/text/reference.md) · [样式覆盖](./components/text/styles.md) · [类型与状态](./components/text/types.md)
- [Textarea](./components/textarea.md) — [API](./components/textarea/api.md) · [完整说明](./components/textarea/reference.md) · [样式覆盖](./components/textarea/styles.md) · [类型与状态](./components/textarea/types.md)
- [Toast](./components/toast.md) — [API](./components/toast/api.md) · [完整说明](./components/toast/reference.md) · [样式覆盖](./components/toast/styles.md) · [类型与状态](./components/toast/types.md)
- [Toaster](./components/toaster.md) — [API](./components/toaster/api.md) · [完整说明](./components/toaster/reference.md) · [样式覆盖](./components/toaster/styles.md) · [类型与状态](./components/toaster/types.md)
- [Tooltip](./components/tooltip.md) — [API](./components/tooltip/api.md) · [完整说明](./components/tooltip/reference.md) · [样式覆盖](./components/tooltip/styles.md) · [类型与状态](./components/tooltip/types.md)

## 复合区块（4）

- [SearchPopup](./components/search-popup.md) — [API](./components/search-popup/api.md) · [完整说明](./components/search-popup/reference.md) · [样式覆盖](./components/search-popup/styles.md) · [类型与状态](./components/search-popup/types.md)
- [Sidebar](./components/sidebar.md) — [API](./components/sidebar/api.md) · [完整说明](./components/sidebar/reference.md) · [样式覆盖](./components/sidebar/styles.md) · [类型与状态](./components/sidebar/types.md)
- [SidebarItem](./components/sidebar-item.md) — [API](./components/sidebar-item/api.md) · [完整说明](./components/sidebar-item/reference.md) · [样式覆盖](./components/sidebar-item/styles.md) · [类型与状态](./components/sidebar-item/types.md)
- [SidebarSection](./components/sidebar-section.md) — [API](./components/sidebar-section/api.md) · [完整说明](./components/sidebar-section/reference.md) · [样式覆盖](./components/sidebar-section/styles.md) · [类型与状态](./components/sidebar-section/types.md)
