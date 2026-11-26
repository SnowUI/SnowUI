# LineChart full reference

Reviewed against Chinese source SHA-256 `a6ab9518665411884da0a31ae9a4e8d47144266c2c04a9380b74e19973f27b12`.

<a id="linechart"></a>

# LineChart

<a id="组件介绍"></a>

## Overview

Show data trends as lines, with multiple series, area fills, solid or dashed strokes, axes, grids, and point markers.

<a id="使用选择"></a>

## When to use it

Use it for continuous values or trends over time. Use BarChart to compare categories. Configure points, axes, labels, and colors through the public chart API.

- Pass data through `series`. The component does not invent sample data; `xLabels` should match the data points.
- Loading reserves the axis and canvas, and waits for the end to display the data; HoverPanel is turned on by default, and the color and format are publicly configured using the chart.
- The default root accessible name follows LocaleProvider through `lineChart.name`; an explicit `aria-label` takes priority. The data-cell group uses `lineChart.cells`. Business names, data values, and numeric formatting remain controlled by the caller.

<a id="快速开始"></a>

## Quick start

This example shows the recommended basic composition. See the sections below for more cases and composition limits.

```svelte
<script lang="ts">
	import { Frame } from '@snowui-design-system/components';
	import { LineChart } from '@snowui-design-system/components';
</script>

<LineChart series={[{ name: 'Component pages', data: [1280, 1460, 1390, 1720, 1880, 2140, 2360], color: 'Primary', strokeWidth: 3 }, { name: 'Quick Start', data: [620, 710, 680, 840, 920, 1040, 1180], color: 'var(--secondary-purple)', strokeStyle: 'dashed' }]} xLabels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']} width="100%" height={280} yTicks={[0, 500, 1000, 1500, 2000, 2500]} yTickFormatter={(value) => value < 1000 ? String(value) : `${value / 1000}K`} showYAxis showGrid showHoverPanel hoverPanelVariant="surface" />
```

<a id="api"></a>

## API

| Keyword | Type | Default | Description |
| --- | --- | --- | --- |
| series | `LineChartSeries[]` | `[]` | Chart series data; components do not have built-in simulation data |
| xLabels | `string[]` | — | Horizontal coordinate labels; use `ChartGroup.xLabels` or generate internal coordinate labels by data point index when not transmitted |
| width | `number \| string` | `800` | The overall width of the chart; support `100%`, and the internal geometry is recalculated according to the final measured width of the root layer. |
| height | `number \| string` | `400` | The overall height of the chart; the number is converted to rem according to px semantics |
| yMin | `number` | — | The minimum value of vertical coordinates; when not passed, a nice domain is generated according to the data, and the positive data contains `0` by default behavior: automatic / inherit `ChartGroup`. |
| yMax | `number` | — | The maximum value of vertical coordinates; when automatic, it is equal to the actual maximum data value, and it is not wholeged up. Default behavior: automatic / inherit `ChartGroup`. |
| yTicks | `number[]` | — | Vertical coordinate scale Default behavior: automatic nice ticks / inherit `ChartGroup`. |
| yTickCount | `number` | — | The number of target scales used to generate nice ticks when `yTicks` is not transmitted |
| yTickFormatter | `(value: number) => string` | — | Vertical coordinate formatting Default behavior: K format / inherit `ChartGroup`. |
| showXAxis | `boolean` | — | Whether to display horizontal coordinates |
| showYAxis | `boolean` | — | Whether to display vertical coordinates |
| showGrid | `boolean` | — | Whether to display horizontal grid lines |
| showGuides | `boolean` | — | Whether to allow series drawing of node vertical auxiliary lines |
| showHoverLabel | `boolean` | — | Whether the numerical label is displayed when the hover / focus node is displayed; when `showHoverPanel=true` and not explicitly passed in, the actual rendering is closed by default. Default behavior: derived by `showHoverPanel`. |
| alwaysShowHoverLabel | `boolean` | `false` | Whether to display the numerical label all the time; allow simultaneous display when opened at the same time as `showHoverPanel` |
| adaptiveContrast | `boolean` | — | Adaptive black-and-white contrast: switch the black value and the default black-and-white node and black-fold line according to the light and dark of the pure-color host background and the superimposed column of the same origin; the explicit value of the sub-map is given priority, and the color series and color node do not change. The boundary between light and dark is sRGB grayscale 0.5, which changes with the current column shape and transparency; background pictures or cross-map coordinate transformation are not supported. It is turned on by default and can be explicitly turned off; it is realized by the Adaptive Contrast sharing ability. Default behavior: inherit ChartGroup, otherwise `true`. |
| showHoverPanel | `boolean` | `true` | Whether to turn on the Chart hover panel, the content is automatically generated according to the current node / cell; turn on by default, and display the panel when hover / focus; return to the numerical hover label when set to false, and explicitly showHoverLabel is preferred |
| hoverPanelVariant | `ChartHoverPanelVariant` | `"light"` | Hover panel visual style |
| hoverPanelPlacement | `ChartHoverPanelPlacement` | `"pointer"` | Hover panel positioning; support anchor / pointer / pin position |
| showHoverPanelLabel | `boolean` | `false` | Whether to display the current classification label at the top of the hover panel |
| hoverMode | `ChartGroupHoverMode` | — | Hover hit mode; when `cell`, the whole grid hit area is generated according to the left and right half of the center of the classification point, and responds to the shared hover |
| activeCellIndex | `number \| null` | — | Controlled current hover classification point; `ChartGroup` can be inherited when not transmitted |
| onCellHoverChange | `(index: number \| null) => void` | — | Classification point hover change callback |
| valueFormat | `NumberFormatOptions` | — | The component-level digital format of the node value label; you can set `notation: "auto"` / `"compact"` to use the English abbreviation `k/m/b/t` default behavior: NumberFormats default. |
| labelFormatter | `( value: number, context: { series: LineChartSeries; point: NormalizedPoint; seriesIndex: number; pointIndex: number; }, ) => string` | — | Node value label custom formatting; priority is higher than global, component, series and point level `valueFormat` |
| xAxisMode | `LineChartXAxisMode` | — | Horizontal coordinate point mode; `edge` means that the first and last data points and the first and last label centers are aligned to both ends of the drawing area, and `cell` is the classification cell center. |
| xLabelAutoCull | `boolean` | — | Whether to automatically reduce the horizontal coordinate label according to the actual measurement width of the complete label; do not delete data points, paths or hit cell |
| xMaxLabelCount | `number` | — | The horizontal coordinates show the maximum number of labels; always keep the beginning and end, and reduce the intermediate label and the corresponding data points by the number of steps. Default behavior: - / Inherit `ChartGroup`. |
| yLabelAutoCull | `boolean` | — | Whether to automatically reduce the vertical coordinate label according to the vertical space |
| yMaxLabelCount | `number` | — | The vertical coordinates show the maximum number of labels; when `yTicks` is not passed, it will also be used as the upper limit of generating nice ticks. Default behavior: - / Inherit `ChartGroup`. |
| cornerRadius | `number \| string` | `8` | The radius of the corner of the rounded corner of the rounded corner line; it is a straight line when `0` |
| colors | `(LineChartColor \| undefined)[]` | — | Color palette; empty item back to the current `colorMode` |
| colorMode | `LineChartColorMode` | `"sequence"` | Chart General Color Mode: Default Color Order, Monochrome Lighter, Monochrome |
| color | `LineChartColor` | — | The main color of monochrome mode; as the default color of `monochromeFade` and `monochrome` at the same time after transmission |
| monochromeColor | `LineChartColor` | `"Primary"` | The monochrome source of `monochromeFade`; the first series is 100%, the last series is 20%, and the middle series decreases evenly according to the number of seriess. |
| mutedMonochromeColor | `LineChartColor` | `"Black4"` | Monochrome source of `monochrome`; the default is 4% black body color for all non-customized seriess, and the stroke transparency is maintained at 100%. |
| showBaseLayer | `boolean` | `false` | Whether to display the final size of the same-color outline (shadow / bottom of the place), do not render by default; draw with 4% opacity after turning on, do not participate in the appearance of dynamic effects, do not change the real graphics, hit area or timeline. At the same time, control the complete line and the bottom of Area, and do not turn off the real Area gradient. |
| appearMotion | `boolean` | `true` | Whether to enable the motion effect |
| appearOnView | `boolean` | `true` | Whether the dynamic effect is automatically played when the trigger anchor enters the default position of the viewport; judge according to the real position of the outermost source page in the same source iframe |
| appearanceProgress | `number` | — | Controlled progress, range `0..1`; after input, the component only renders according to the progress, and does not play by itself. |
| defaultAppearanceProgress | `number` | `0` | Uncontrolled initial appearance progress |
| appearanceDuration | `number` | — | The total duration of automatic playback is overwritten; when not set, the self-drawing time of each series is fixed at `1000ms`, and the total completion time of multiple seriess will increase with `360ms` stagger |
| appearAnchorId | `string` | — | Dynamic effect triggers anchor element ID; use the chart's own root element when not transmitted |
| appearAnchorPoint | `AnchorPoint` | `"top"` | Use the top, middle or bottom of the anchor element as the trigger point |
| appearViewportPoint | `number \| "top" \| "center" \| "bottom"` | `0.7` | The trigger position of the viewport; `0.7` means that the height of the viewport is 70% |
| scrollAppearance | `boolean \| { distance?: number \| string }` | `false` | Whether to enable the scroll bar timeline control to have a dynamic effect; the same source iframe responds to the outer page scrolling at the same time |
| scrollAppearanceDistance | `number \| string` | `320` | The scrolling timeline corresponds to the scrolling distance from `0` to `1` |
| onAppearanceProgressChange | `(progress: number) => void` | — | There is a progress change callback |
| loading | `boolean` | — | Data waiting status. Maintain the declared canvas size, coordinate axis and grid, fix the fold line, area and marker at the starting point of the dynamic effect and suspend the interaction; after changing to false, play the dynamic effect according to the current viewport conditions. The chart does not render Skeleton, but also reads the loading context of the upper Frame. |
| children | `Snippet` | — | The custom content after the main body of the chart has no parameters; it will not replace the coordinate axis or data series. |
| class | `string` | `""` | Root layer additional class |
| style | `string` | `""` | Root layer additional style |
| enableResponsive | `boolean` | `true` | Whether to enable the Frame responsive ability |
| enableContext | `boolean` | `true` | Whether to enable the Frame context ability |
| enableScaleObserver | `boolean` | `false` | Whether to enable Frame scale observer |
| enableDefaultMotion | `boolean` | `true` | Whether to enable the default effect of Frame |

See the base component documentation for inherited capabilities not redeclared here. This table lists only named public Props declared by this component.

<a id="使用边界与详细说明"></a>

## Usage boundaries and details

HoverPanel shares a three-column layout. The dot-to-name gap prefers `--gap-1` and the name-to-value gap prefers `--gap-2`; both retain a 4 CSS px floor in LTR and RTL. At a 16px root font size the defaults remain 4px / 8px, and larger tokens are preserved. This floor does not apply to vertical panel sections or chart center annotations.

<a id="1-设计原则"></a>

<a id="设计原则"></a>

### Design principle

- **Atomic chart component**: `LineChart` renders only the chart body. It does not include a title, card background, legend, or toolbar.
- **No built-in sample data**: `LineChart` does not simulate business data within the component; examples, business pages or outer combination components must be explicitly passed into `series` and `xLabels`.
- **Area is a series option**: Enable a fill with `series[].area`; there is no separate AreaChart component.
- **Multiple series**: One chart can mix solid and dashed lines, default ChartSpec color order, and different marker strategies.
- **Built-in axes**: X and Y axes and grid lines are part of LineChart.
- **Y-axis adaptive width**: The Y-axis does not use a fixed reserved width; the width of the label area is equal to the actual rendering width of the current widest visible label, and the right edge of the label and the starting point of the drawing area are fixed for `12px`. When the label is widened, the drawing area is only compressed according to the actual increased width.
- **Dynamic top safe area**: The maximum visible edge distance of the line or marker is at least `8px` on the top of the component; at least `16px` when the Y axis is displayed. The top value label does not add an additional safe area, and remains at `4px` above the node. If necessary, it can overflow the top edge of the drawing area; the safe area of the marker radius does not depend on whether the numerical label is displayed. When the X-axis is displayed, only `8px` label spacing and `16px` label height are retained at the bottom.
- **Classification axis point model**: The horizontal coordinates use the `edge` mode by default, and the first and tail data points and the first and last label centers are aligned with both ends of the drawing area; it can also be switched to `cell` mode to make the node located in the center of the equal-width classification cell. When the label cannot be put down, it is recalculated according to the current point mode and automatically reduces the intermediate coordinates and data points, and at least the beginning and end are retained.
- **Configurable markers**: Configure markers for a series or one point. Point-level settings take precedence.
- **Hover label**: The default hover / focus node displays the numerical label 4px above the point, and does not change the position by touching the top edge of the drawing area; at the same time, the node reverses the color and displays a 0.5px black vertical line behind the node. Font size 12px, regular body, default Black/100%. The digital format consumes `NumberFormats.md`, and the default is non-integer to display 2 decimal places. `alwaysShowHoverLabel` can make the numerical label often appear.
- **Rounded corner turning line**: LineChart only keeps the rounded turning line; the main body maintains a straight line, and only generates a local rounded corner according to `cornerRadius` at the flection point, and it is a straight line when `cornerRadius=0`.
- **Chart general dynamic effect**: Each series's own drawing duration is fixed at `1000ms`, which is consistent with CircularChart; the line and Area are revealed from left to right. Multiple seriess are started in order according to the delay of `360ms`, and each series has an independent slow-out timeline; the marker appears immediately when the line reveals to the corresponding point, and does not slow down the transparency.

---

<a id="2-api"></a>

<a id="22-组件方法"></a>

### 2.2 Component method

| Way | Description |
| --- | --- |
| `replay()` | Uncontrolled motion effect is replayed from `0` to `1` |
| `resetAppearance()` | Uncontrolled dynamic effect is immediately reset to `0` |
| `reverseAppearance()` | The uncontrolled dynamic effect first enters the completion state, and then reverses from `1` to `0` along the same timeline. |

<a id="23-数据结构"></a>

### 2.3 Data structure

```ts
type LineChartColor = ChartColor;
type LineChartStrokeStyle = "solid" | "dashed";
type LineChartXAxisMode = "cell" | "edge";

interface LineChartMarkerConfig {
  size?: number | string;
  color?: LineChartColor | "line";
}

interface LineChartPointMarkerConfig {
  size?: number | string;
}

interface LineChartPoint {
  label?: string;
  value: number;
  marker?: boolean | LineChartPointMarkerConfig;
  valueFormat?: NumberFormatOptions;
}

interface LineChartSeries {
  name: string;
  data: (number | LineChartPoint)[];
  color?: LineChartColor;
  strokeWidth?: number | string;
  strokeStyle?: LineChartStrokeStyle;
  cornerRadius?: number | string;
  markers?: boolean | LineChartMarkerConfig;
  guides?: boolean;
  area?: boolean;
  valueFormat?: NumberFormatOptions;
}
```

Number-format priority: `labelFormatter → point.valueFormat → series.valueFormat → component valueFormat → NumberFormatContext → NumberFormats default`.

Color priority: `series[i].color → colors[i] → colorMode corresponds to the return color`. The default `series` color order is consistent with ChartSpec. `color` can be used as the main color of the monochrome mode. After passing in, `monochromeFade` defaults from 100% uniformly to 20% of the last series of the color. `monochrome` defaults to all non-customized seriess to use this color; when `color` is not transmitted, `monochromeFade` defaults to Primary, and `monochrome` defaults to Black4. Color supports SnowUI symanic color, ordinary CSS color, CSS variable, `linear-gradient(...) ` Strings and gradient objects.

Y-axis scale rules:

- When `yMax` / `yTicks` is not transmitted, the upper limit of the domain is equal to the actual maximum data value of `series`, and nice ticks is only generated to the last readable scale not higher than the value; the highest point can be higher than the last grid line.
- The positive data contains `0` as the starting point of the vertical axis by default; when there is a negative number, the minimum value of the data is used to participate in the calculation.
- The step length is taken according to `1 / 2 / 5 × 10^n`, and the number of target scales is controlled by `yTickCount`.
- `yMaxLabelCount` will limit the number of vertical coordinate labels; when `yTicks` is not transmitted, it will be given priority to generate nice ticks with `min(yTickCount, yMaxLabelCount)`, and when a large number of `yTicks` are transmitted, it will be diluted and displayed according to the number of steps.
- `yMin` / `yMax` can be used as a domain boundary prompt; `yTicks` has the highest priority when explicitly passed in.
- `yMin` / `yMax` will not clamp the out-of-range data to the boundary; the lines and Area beyond the domain will first generate visible fragments according to the Y domain, and the round end point will be retained at the boundary. The marker and guide will only be displayed when the point value is in the current Y domain.
- When `showGrid && showXAxis`, the total number of horizontal lines defaults to `yTickCount=6`, of which the bottom one is borne by the x-axis baseline to avoid duplicate drawing of the bottom line.

Area fill rules:

- `area: true` generates a vertical gradient when the series uses ordinary colors. The top opacity is `0.04` (4%), and the bottom gradient is `0` (fully transparent). When the series `color` explicitly uses CSS gradient or `ChartGradient` object, Area directly follows its color mark and transparency; two color marks of the same color and opaque can form a real color area.
- Area does not provide color, transparency, gradient or baseline configuration independent of the line; it affects the line and the area at the same time through the series `color`, and affects the baseline through the vertical axis domain.
- `area` is independent of `strokeStyle` and can be combined with "dotted line + translucent area filling".

Marker rules:

- Marker is turned off by default; when a node is needed, it is explicitly turned on through `series[].markers` or `point.marker`.
- `markers: true` uses the Figma Dot structure: the whole `8x8` is composed of two layers of the lower Black/100% circle and the upper White/100% circle; the lower circle is `8x8` and the upper circle is `4x4`, using `var(--black-100)` and `var(--white-100)` respectively.
- `markers.size` and `point.marker.size` scale the marker proportionally.
- `markers.color` only replaces the lower black/100% in the design draft; any color can be transmitted, or `"line"` can be passed to follow the current line color.
- Single point `point.marker` is only allowed to change the size or close, and it is not allowed to define nodes of different colors on the same line.
- When marker hover / focus, the lower circle becomes White/100% (`var(--white-100)`), the upper circle becomes Black/100% (`var(--black-100)`), and a vertical line running through the drawing area is displayed behind the node; the vertical line is `0.5px` thick, round head, Black/100%.
- Marker other structures, lower/upper ratio and hover vertical lines are not available for customization.

Line rules:

- LineChart only retains the rounded turning line, and the main body is a straight line segment. Only at the middle inflection point, the front and rear line segments are truncated according to `cornerRadius` and local rounded corners are generated.
- When `cornerRadius=0`, a rounded corner is not generated, which is shown as an ordinary straight line.
- `strokeStyle="dashed"` Use Figma stroke settings: dash `2`, gap `4`, round cap.

---

<a id="布局模型无障碍与动效"></a>

### Layout model, accessibility, and motion

Primary layout model: **intrinsic atomic layout** (source reference: `docs/standards/LayoutProtocol.md` section 12.7). The root `Frame` observes its measured width and height to recompute single-SVG coordinates.

- **Axes and label culling**: Horizontal points align via `edge` (default, first and last points at plot edges) or `cell` (category centers); X-axis labels keep at least `4px` between measured full labels and cull at even steps without removing data points or paths (hiding all X labels if the two endpoints cannot fit). Y-axis width matches the widest visible label plus `12px`, top clearance accounts for half stroke width or marker radius (`8px` minimum, `16px` with Y-axis), and `bottom=24px` when the X-axis is shown.
- **Accessibility and hit testing**: The root uses `role="group"`; each marker includes a transparent hit circle at least `16x16` with an `aria-label` containing series name, X label, and value, and supports `hoverMode="cell"` shared hover. `loading` preserves axes while holding series at initial reveal progress with Skeleton disabled.
- **Layers and reveal timeline**: SVG layers render from bottom to top as `defs`, grid/baseline, optional `showBaseLayer` (4% opacity), area paths, vertical guides, line paths, markers, and axis labels. Each series reveals over `1000ms` (`easeOut` power `6` for clip width and opacity), multiple series stagger by `360ms`, and markers appear immediately when the reveal edge reaches their X coordinate.

[Styles](./styles.md) · [Types](./types.md) · [API](./api.md)
