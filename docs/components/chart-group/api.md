# ChartGroup API

These are named public Props; inherited capabilities belong to their own public API.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `width` | `number \| string` | 800 | Root canvas width. Numbers become pixel CSS lengths; strings may use percentages or other CSS lengths. Shared hit regions and panels use the measured final size. Set width on child charts too, usually 100% when layered. |
| `height` | `number \| string` | 400 | Root canvas height as a number or CSS length. Percentage height needs a definite parent height. Child charts still need their own height; layered children without an X axis should subtract the one visible X axis’s 24px. |
| `xLabels` | `string[]` | [] | Full category labels in shared activeCellIndex order, also the fallback for children without xLabels. Label culling does not remove entries or hit cells. An empty array still retains one fallback hit cell. |
| `yMin` | `number` | — | Default lower Y bound for children. Without it, each child calculates its own domain. Set common bounds for a combined chart; ChartGroup does not aggregate child data domains. Explicit child values take priority. |
| `yMax` | `number` | — | Default upper Y bound for children. Without it, each child derives its own maximum and scales may differ. Set one upper bound for comparable units. Explicit child values take priority. |
| `yTicks` | `number[]` | — | Explicit Y tick values passed to children instead of automatic ticks. Visible labels may still be culled. Explicit child yTicks takes priority. |
| `yTickCount` | `number` | 6 | Target count for automatic Y ticks, not an exact guarantee. Child domain, nice steps, and label culling determine actual ticks. Explicit yTicks takes priority. |
| `yTickFormatter` | `(value: number) => string` | — | Format each Y tick for display without changing numeric values, domain, or hover values. Explicit child formatters take priority; otherwise each child uses its default. |
| `showXAxis` | `boolean` | true | Default visibility of X axis line and labels for children; ChartGroup draws no axis itself. In a layered chart, enable the X axis on only one child. |
| `showYAxis` | `boolean` | false | Default Y label visibility for children and an input to group top safe-area calculation. Explicit child values take priority. Each child measures its own side space; ChartGroup does not align different Y label widths. |
| `showGrid` | `boolean` | false | Default grid visibility for children. A child draws lines at visible Y ticks; layered charts should retain one grid owner. Explicit child values take priority. |
| `showGuides` | `boolean` | false | Default guide-line switch. LineChart can draw data-point guides; BarChart currently has no additional guide graphic. Explicit child settings take priority. |
| `xAxisMode` | `ChartGroupXAxisMode` | "edge" | LineChart point model: edge places first and last points at plot ends; cell centers points in category cells. Use cell for a line over BarChart. Shared group hit regions always use category cells. |
| `xLabelAutoCull` | `boolean` | true | Default automatic X label culling based on measured child text and available width. It hides labels without removing data, paths, cells, or shared indices. Explicit child values take priority. |
| `xMaxLabelCount` | `number` | — | Default maximum visible X label count. Children may show fewer when space is short; full categories and hover data remain. Explicit child values take priority. |
| `yLabelAutoCull` | `boolean` | true | Default automatic Y label culling when space is short. Each child handles its own layout. Explicit child values take priority. |
| `yMaxLabelCount` | `number` | — | Default maximum visible Y label count. Without yTicks, it also informs each child’s automatic tick count. Explicit child values take priority. |
| `plotBounds` | `ChartGroupPlotBounds` | {} | Plot inset from the root canvas with numeric pixel top, right, bottom, and left fields. Shared hit and panel bounds use it. top can only increase the maximum child safe area; other edges do not change child geometry. Set bottom: 0 when all X axes are off. |
| `hoverMode` | `ChartGroupHoverMode` | "cell" | cell coordinates one category hover across children. item leaves child hit handling in place without a group cell hit layer. It is also the child hoverMode fallback; explicit child values take priority. |
| `activeCellIndex` | `number \| null` | — | Controlled zero-based category index from xLabels. null means none; undefined uses internal uncontrolled state. Not bindable: controlled callers write the next value from onCellHoverChange. |
| `defaultActiveCellIndex` | `number \| null` | null | Initial uncontrolled category index only; later changes do not reset state. Ignored when activeCellIndex is defined. null starts without an active item. |
| `onCellHoverChange` | `(index: number \| null) => void` | — | Receives a new index or null after shared hover changes through pointer, cell focus, or child interactions. Internal interactions clamp finite values to valid categories. In controlled mode it only notifies; return values do not cancel updates. |
| `showHitLayer` | `boolean` | true | Show the group SVG category hit layer only when hoverMode=cell and showHoverPanel=false. With a shared panel, root pointer coordinates and child hits take over. false does not disable child interaction. |
| `adaptiveContrast` | `boolean` | true | Adaptive black-and-white contrast based on a solid host background and overlapping bars at the same origin. It adjusts black value text, default black-and-white nodes, and black lines, not colored series or nodes. The sRGB grayscale threshold is 0.5 and follows bar shape and opacity; background images and cross-chart coordinate transforms are unsupported. On by default; explicit child values take priority. |
| `showHoverPanel` | `boolean` | true | Combine child reports into one shared panel. In cell mode, root pointer position updates the category. On by default. When off, children may show their own panels through child settings. Numeric labels can coexist or be controlled with showHoverLabel. Empty data shows no panel. |
| `showHoverLabel` | `boolean` | — | Control child numeric hover labels. When omitted, follow child settings and derive a default from shared panel visibility. Explicit true or false takes priority over child settings; true permits labels alongside the shared panel. |
| `alwaysShowHoverLabel` | `boolean` | false | Enable persistent child numeric labels. Merged by logical OR with child alwaysShowHoverLabel, so group false does not turn off a child’s explicit true. Final showHoverLabel still controls visibility. |
| `hoverPanelVariant` | `ChartHoverPanelVariant` | "light" | Appearance of the one shared panel: light, dark, or blurred surface. Does not recolor bars, lines, or child numeric labels. |
| `hoverPanelPlacement` | `ChartHoverPanelPlacement` | "pointer" | Position the shared panel beside its data mark (anchor-side), at the highest data anchor (anchor-top), by the pointer, or at a plot corner with pin-*. ChartHoverPanel handles collisions. |
| `showHoverPanelLabel` | `boolean` | false | Show the active category at the top of the shared panel. Read xLabels first, then fall back to the first child panel label. |
| `children` | `Snippet` | — | Parameterless Snippet composing child charts explicitly. ChartGroup does not generate BarChart, LineChart, titles, or legends. Set each child’s width, height, and root positioning to share a canvas. |
| `class` | `string` | "" | Additional class merged with the root Frame class; not forwarded to child charts. |
| `style` | `string` | "" | Additional inline style on the root Frame after canvas-size variable declarations. Useful for host positioning; not forwarded into child charts. |
| `enableResponsive` | `boolean` | true | Enable root Frame responsive behavior. Chart canvas measurement is independent of this switch; percentage width and height do not require it. |
| `enableContext` | `boolean` | true | Enable general root Frame context. It does not disable ChartGroup’s shared category, axis, or hover protocol for children. |
| `enableScaleObserver` | `boolean` | false | Compatibility switch for root Frame scale observation, off by default. It does not control the chart’s own measured-size listener. |
| `enableDefaultMotion` | `boolean` | true | Enable root Frame default motion. It does not enable or disable child appearance motion as a group; each child uses its own public motion Props and instance methods. |

[Types](./types.md) · [Full reference](./reference.md) · [Styles](./styles.md)
