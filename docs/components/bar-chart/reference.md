# BarChart full reference

Reviewed against Chinese source SHA-256 `0fbcee6b988f66d27b179cd20f70432e99673d5e67ed4d60a3bd36afb9749ee5`.

<a id="barchart"></a>

# BarChart

<a id="组件介绍"></a>

## Overview

Compare categorical data with horizontal, vertical, grouped, or stacked bars, axes, and interactive tooltips.

<a id="使用选择"></a>

## When to use it

Use BarChart to compare categories. Use LineChart for continuous trends and CircularChart for proportions. Configure axes and colors through the public chart API.

- Input business data; omitting data will display the built-in sample data. Mode controls single column, grouping, stacking and other forms. For specific structure, please refer to API and data structure.
- Loading retains the chart and suspends data interaction; HoverPanel is turned on by default. The color of the chart is configured by colors / colorMode.
- The default root accessible name follows LocaleProvider through `barChart.name`; an explicit `aria-label` takes priority. The data-cell group uses `barChart.cells`. Business names, data values, and numeric formatting remain controlled by the caller.

<a id="快速开始"></a>

## Quick start

This example shows the recommended basic composition. See the sections below for more cases and composition limits.

```svelte
<script lang="ts">
	import { Button, Frame } from '@snowui-design-system/components';
	import { BarChart } from '@snowui-design-system/components';
	let monthlyCoverageChart: any;
</script>

<Frame column style="align-items: center; gap: var(--gap-5); width: 100%;">
	<BarChart
		bind:this={monthlyCoverageChart}
		width="100%"
		barWidth={32}
		groupGap={4}
		showYAxis
		showGrid
		hoverMode="cell"
		showHoverLabel={true}
		showHoverPanel={true}
		alwaysShowHoverLabel={true}
		hoverPanelPlacement="pointer"
		hoverPanelVariant="dark"
		data={[
			{ name: 'Jan', value: 82.6 },
			{ name: 'Feb', value: 84.1 },
			{ name: 'Mar', value: 83.4 },
			{ name: 'Apr', value: 85.7 },
			{ name: 'May', value: 86.2 },
			{ name: 'Jun', value: 84.9 },
			{ name: 'Jul', value: 87.3 },
			{ name: 'Aug', value: 86.8 },
			{ name: 'Sep', value: 88.1 },
			{ name: 'Oct', value: 87.6 },
			{ name: 'Nov', value: 89.2 },
			{ name: 'Dec', value: 88.7 }
		]}
	/>
	<div style="display: flex; justify-content: center; gap: var(--gap-2); width: 100%;">
		<Button onclick={() => monthlyCoverageChart?.replay?.()}>Replay animation</Button>
		<Button onclick={() => monthlyCoverageChart?.reverseAppearance?.()}>Reverse animation</Button>
	</div>
</Frame>
```

<a id="api"></a>

## API

| Keyword | Type | Default | Description |
| --- | --- | --- | --- |
| data | `BarChartItem[]` | `DEFAULT_DATA` | Category data; overlay recommends using the first two items of each type of bars to represent the back layer and the front layer, and the name, value, color and number format are configured separately. For details, please refer to the data structure. Default behavior: built-in default data. |
| orientation | `BarChartOrientation` | `"vertical"` | Chart direction |
| mode | `BarChartMode` | `"single"` | Unit internal column mode |
| width | `number \| string` | `800` | The overall width of the chart; support `100%`, and the geometry is recalculated internally according to the final display width. |
| height | `number \| string` | `400` | The overall height of the chart; the geometry is recalculated internally according to the final display height. |
| barWidth | `number \| string` | `32` | The thickness of a single column; the width is vertical and the height is transverse; the lower limit of the response is `2px` |
| barGap | `number \| string` | `4` | The spacing of adjacent columns in the same unit in the `group` mode; the lower limit is `4px` |
| groupGap | `number \| string` | `20` | The reserved spacing between the content of the category and the edge of the cell; the lower limit is `4px` |
| segmentGap | `number \| string` | `0` | Segment interval in `stack` mode; `0` means no interval |
| cornerRadius | `number \| string` | `8` | The size of the round corner of the column |
| roundedStart | `boolean` | `true` | Whether to keep the rounded corner of the starting point; the vertical direction is the bottom, and the horizontal direction is the left side |
| roundedEnd | `boolean` | `true` | Whether to keep the rounded corner of the end end; vertical is the top and the horizontal is the right |
| xLabels | `string[]` | — | Category label override; use `ChartGroup.xLabels` or `data[].name` when not transmitted |
| yMin | `number` | — | Value axis domain minimum default behavior: automatic / inherit `ChartGroup`. |
| yMax | `number` | — | Maximum numeric axis domain value. Automatic mode uses the actual data maximum without rounding it upward; inherits `ChartGroup` when applicable. |
| yTicks | `number[]` | — | Value axis scale Default behavior: automatic nice ticks / inherit `ChartGroup`. |
| yTickCount | `number` | — | Automatic tick target number |
| yTickFormatter | `(value: number) => string` | — | Value axis label formatting default behavior: K format / inheritance `ChartGroup`. |
| showXAxis | `boolean` | — | Whether to display the bottom axis and bottom label |
| showYAxis | `boolean` | — | Whether to display the left label |
| showGrid | `boolean` | — | Whether to display the grid line |
| showGuides | `boolean` | — | Keep the Chart API naming; no additional guide is drawn at present |
| showHoverLabel | `boolean` | — | Whether the value label is displayed when hover / focus column; when `showHoverPanel=true` and not explicitly passed in, the actual rendering is closed by default. Default behavior: derived by `showHoverPanel`. |
| alwaysShowHoverLabel | `boolean` | `false` | Whether to display the value label all the time; allow simultaneous display when opened at the same time as `showHoverPanel` |
| adaptiveContrast | `boolean` | — | Adaptive black-and-white contrast: switch the black value according to the bright and dark of the solid color host background and the superimposed column at the same origin; the explicit value of the sub-map is given priority, and the color sequence and color node do not change color. The boundary between light and dark is sRGB grayscale 0.5, which changes with the current column shape and transparency; background pictures or cross-map coordinate transformation are not supported. It is turned on by default and can be explicitly turned off; it is realized by the Adaptive Contrast sharing ability. Default behavior: inherit ChartGroup, otherwise `true`. |
| showHoverPanel | `boolean` | `true` | Whether to turn on the Chart hover panel, the content is automatically generated according to the current column / cell; turn on by default, display the panel when hover / focus; return to the numerical hover label when set to false, explicit showHoverLabel priority |
| hoverPanelVariant | `ChartHoverPanelVariant` | `"light"` | Hover panel visual style |
| hoverPanelPlacement | `ChartHoverPanelPlacement` | `"pointer"` | Hover panel positioning; support anchor / pointer / pin position |
| showHoverPanelLabel | `boolean` | `false` | Whether to display the current category label at the top of the hover panel |
| hoverMode | `ChartGroupHoverMode` | — | Hover hit mode; in `cell`, the whole grid hit area is generated according to the left and right half of the category center, and all columns/segments in the same category respond together. |
| activeCellIndex | `number \| null` | — | Controlled current hover category; `ChartGroup` can be inherited when not transmitted |
| onCellHoverChange | `(index: number \| null) => void` | — | Category unit hover change callback |
| valueFormat | `NumberFormatOptions` | — | The component-level number format of the column value label; you can set `notation: "auto"` / `"compact"` to use the English abbreviation `k/m/b/t` default behavior: NumberFormats default. |
| labelFormatter | `( value: number, context: BarChartValueLabelContext, ) => string` | — | Column value label custom formatting; priority is higher than global, component and data item `valueFormat` |
| xLabelAutoCull | `boolean` | — | Reduce the category label according to the final display size; the complete text spacing is as small as `4px`, and all are hidden when the beginning and end are still not released; do not delete the column, coordinate axis or hit cell |
| xMaxLabelCount | `number` | — | Category label Maximum number of displays Default behavior: - / Inherit `ChartGroup`. |
| valueLabelAutoCull | `boolean` | `true` | `alwaysShowHoverLabel` Whether the resident value is automatically diluted according to the final display size; the hover / focus value is not affected |
| valueMaxLabelCount | `number` | — | The maximum number of displays of the permanent top value |
| yLabelAutoCull | `boolean` | — | Whether to automatically reduce the value axis label |
| yMaxLabelCount | `number` | — | The maximum number of value axis label displays Default behavior: - / Inherit `ChartGroup`. |
| colors | `(BarChartColor \| undefined)[]` | — | Color palette; empty item back to the current `colorMode` |
| colorMode | `BarChartColorMode` | `"sequence"` | Chart Universal Color Mode |
| color | `BarChartColor` | — | Monochrome mode main color |
| monochromeColor | `BarChartColor` | `"Primary"` | The source of monochrome gradual light |
| mutedMonochromeColor | `BarChartColor` | `"Black4"` | Monochrome source |
| showBaseLayer | `boolean` | `false` | Whether to display the final size of the same-color outline (shadow / bottom of the place), do not render by default; draw with 4% opacity after turning on, do not participate in the appearance of motions, do not change the real graphics, hit area or timeline. It has nothing to do with the back-layer data column of overlay; the horizontal column is drawn according to the final width. |
| appearMotion | `boolean` | `true` | Whether to enable the motion effect |
| appearOnView | `boolean` | `true` | Whether to play automatically after entering the viewport; judge according to the real position of the outermost source page in the same source iframe |
| appearanceProgress | `number` | — | Controlled appearance progress |
| defaultAppearanceProgress | `number` | `0` | Uncontrolled initial appearance progress |
| appearanceDuration | `number` | — | Automatic playback total duration coverage |
| appearAnchorId | `string` | — | Motion trigger anchor point ID |
| appearAnchorPoint | `AnchorPoint` | `"top"` | Anchor point trigger position |
| appearViewportPoint | `number \| "top" \| "center" \| "bottom"` | `0.7` | Viewport trigger position |
| scrollAppearance | `boolean \| { distance?: number \| string }` | `false` | Whether to enable the scrolling timeline; the same source iframe responds to the outer page scrolling at the same time |
| scrollAppearanceDistance | `number \| string` | `320` | Scrolling mapping distance |
| onAppearanceProgressChange | `(progress: number) => void` | — | There is a progress change callback |
| loading | `boolean` | — | Data waiting status. Maintain the declared canvas size, coordinate axis and grid, fix the column at the starting point of the motion and pause the interaction; after changing to false, play the motion according to the current viewport conditions. The chart does not render Skeleton, but also reads the loading context of the upper Frame. |
| children | `Snippet` | — | The custom content after the main body of the chart has no parameters; it will not replace the coordinate axis or data series. |
| class | `string` | `""` | Root layer additional class |
| style | `string` | `""` | Root layer additional style |
| enableResponsive | `boolean` | `true` | Whether to enable Frame responsive |
| enableContext | `boolean` | `true` | Whether to enable Frame context |
| enableScaleObserver | `boolean` | `false` | Whether to enable Frame scale observer |
| enableDefaultMotion | `boolean` | `true` | Whether to enable the default effect of Frame |

See the base component documentation for inherited capabilities not redeclared here. This table lists only named public Props declared by this component.

<a id="使用边界与详细说明"></a>

## Usage boundaries and details

<a id="1-设计原则"></a>

<a id="设计原则"></a>

### Design principle

- **Chart Atomic Component**: `BarChart` is only responsible for the body of the bar chart, and does not have built-in titles, card backgrounds, legends or toolbars.
- **Unit model**: A category is a **bar unit**. The unit uniformly controls the thickness, rounded corners, direction and category coordinates of the column; the unit can render single columns, multi-segment, overlapping columns or multiple parallel columns.
- **Multi-segment unified rules**: Three-segment is a special case of multi-segment. `mode="stack"` uses `segments` to render any number of segments; `segmentGap={0}` means that there is no interval in the middle, and `segmentGap>0` means that there is a transparent interval between the segments and each segment has an independent rounded corner. The hover / focus / normal display value is only displayed once above the top segment, and the value is the sum of all segments.
- **Overlapping rules**: `mode="overlay"` uses the first two valid data of `bars`, the first is the back layer and the second is the front layer; the two layers are named and valued independently, and the zero baseline is coaxially superimposed without accumulation. The back layer is 10% opacity and the front layer is 100%; the front layer can be higher than the back layer.
- **Side-by-side bars**: `mode="group"` uses `bars` to place bars beside each other within a category. The default gap is `barGap=4`; colors follow Chart’s default sequence, and the group can have more than two bars.
- **Direction rule**: `orientation="vertical"` is a vertical bar chart, and the category axis is horizontal; `orientation="horizontal"` is a horizontal bar chart, and the category axis is vertical. All column modes support two directions.
- **The coordinate axis is built-in**: The coordinate axis, scale and grid line belong to the BarChart morphological ability and are placed in the component.
- **Responsive density**: BarChart directly observes the final display size of the root layer and recalculates SVG geometry with the actual measured width and height, without requiring the page to create ResizeObserver by itself. The column thickness can be narrowed with the category cell, but not less than `2px`; the visual spacing of side-to-side columns and adjacent category columns in the same category should not be less than `4px`.
- **Horizontal density**: The height of the horizontal column follows the lower limit of the column thickness `2px`, and the spacing of the upper and lower adjacent columns is `4px`; the category Y label is diluted according to the height of the final drawing area, the height of the row of the `16px` and the spacing of the upper and lower `4px`, and all of them are hidden when the beginning and the end still cannot be put down.
- **Label thinning**: `xLabelAutoCull` only reduces the category axis label of the vertical map, and does not delete the column, coordinate axis, hit cell or data; the bottom value scale of the horizontal map is automatically thinned according to the actual width of the drawing area. The empty string label does not participate in the number of candidates and the first and last judgment, and the labels such as sparse months are diluted according to non-empty items. It can be seen that the label must be displayed completely and the adjacent text must keep at least `4px`; when there is not enough space, keep the first and last non-empty items and dilute them step by step. If the first and last two complete labels still cannot be placed, all horizontal axis labels will be hidden. The permanent top value uses an independent `valueLabelAutoCull` / `valueMaxLabelCount`, which is diluted according to the text width of the final value; the omitted value will still be displayed when the corresponding column hover / focus.
- **Y-axis adaptive width**: The Y-axis does not use a fixed reserved width; the width of the label area is equal to the actual rendering width of the current widest visible label, and the right edge of the label and the starting point of the drawing area are fixed for `12px`. The vertical value axis and the horizontal category axis use the same Chart to share the measurement entrance; when the label is widened, the drawing area is only compressed according to the actual increased width.
- **Dynamic top safety zone**: The top of the ordinary column spacing component is at least `8px`; the minimum is `16px` when the longitudinal map shows the Y axis; the top value label does not add an additional safe area, but still maintains `4px` above the top of the column, and can overflow the top edge of the drawing area if necessary. When the X axis is displayed, only the `8px` label spacing and `16px` label height are retained at the bottom, and the bottom edge of the label is aligned with the bottom of the component; when the X axis is hidden, the drawing area extends to the bottom of the component.
- **Hover rule**: The column hover uses the overlay mechanism of `StyleSpec.md §2.4` and does not rewrite the color of the column itself. Solid columns with visual transparency of 40% or more are superimposed on `StaticWhite/20%` according to the filled Button hover rule; light transparent columns with visual transparency of less than 40% are superimposed on `Black/4%` according to the light black hover gear. `overlay` The back 10% and the multi-sepment light section will follow `Black/4%` overlay.
- **Hover label**: The default hover / focus column displays the value label 4px above the column, and does not change the position by touching the top edge of the drawing area. Font size 12px, regular body, the default color is Black/100%. `stack` only shows the total value of the whole stacked column in the top section, and any segment of hover points to this total value; other modes still show the corresponding column value. The number format consumes `NumberFormats.md`, and the default is non-integer to display 2 decimal places. `alwaysShowHoverLabel` can make the value label appear often; when the motion is played, the label value changes in real time according to the current column height ratio, from `80%` corresponding value to the complete value.
- **hover panel**: The label-to-row section keeps its existing 2px design baseline. HoverPanel shares a three-column layout. The dot-to-name gap prefers `--gap-1` and the name-to-value gap prefers `--gap-2`; both retain a 4 CSS px floor in LTR and RTL. At a 16px root font size the defaults remain 4px / 8px, and larger tokens are preserved. This floor does not apply to vertical panel sections or chart center annotations.
- **Appearance motion**: All categories share one BarChart timeline. Bars start at `80%` of their target height or width, then grow to `100%` from left to right. Adjacent categories start in sequence.

---

<a id="2-api"></a>

<a id="22-组件方法"></a>

### 2.2 Component method

| Way | Description |
| --- | --- |
| `replay()` | Uncontrolled motion effect is replayed from `0` to `1` |
| `resetAppearance()` | Uncontrolled motion is immediately reset to `0` |
| `reverseAppearance()` | The uncontrolled motion first enters the completion state, and then reverses from `1` to `0` along the same timeline. |

<a id="23-数据结构"></a>

### 2.3 Data structure

```ts
type BarChartOrientation = "vertical" | "horizontal";
type BarChartMode = "single" | "stack" | "overlay" | "group";

interface BarChartSegment {
  name?: string;
  value: number;
  color?: BarChartColor;
  valueFormat?: NumberFormatOptions;
}

interface BarChartBar {
  name?: string;
  value: number;
  color?: BarChartColor;
  valueFormat?: NumberFormatOptions;
}

interface BarChartItem {
  name: string;
  value?: number;
  color?: BarChartColor;
  valueFormat?: NumberFormatOptions;
  segments?: BarChartSegment[];
  bars?: BarChartBar[];
  backgroundValue?: number;
  backgroundName?: string;
}
```

The recommended data of `mode="overlay"` is `data[].bars`, and two real data columns are passed into each category:

| Field | Default / Rules | Description |
| --- | --- | --- |
| `data[].name` | Required | Category name, such as traffic source or month; `xLabels` can cover axis labels. |
| `data[].bars` | Compatible with old fields when not provided | Take the first two finite numerical data in the order of input, the first post-layer and the second pre-layer; both start from the same zero baseline. The empty array does not have a column and does not return to the old field; when there is only one valid data, it is displayed as a single column with 100% opacity. Undundant valid items are not drawn and do not participate in the domain. |
| `bars[].name` | Back to `data[].name` | Data series names, such as the previous quarter / this quarter; used for HoverPanel, hover description and screen reading, not by drawing layer hard coding name. |
| `bars[].value` | Required | The original value supports `0`; the front and rear layers independently participate in the automatic domain. The height of the rear layer is not fixed, and the front layer can be larger than the back layer, not adding each other, not clamping each other. |
| `bars[].color` | Back to classify color and chart palette | The color of the current data column; the two layers can be the same color or the color can be specified independently, and the back layer is still 10% opacity. |
| `bars[].valueFormat` | Inheritance category and component number format | The number format of the current data column is also used for hover value, HoverPanel and screen reading description. |

Legacy `value/backgroundValue/backgroundName` fields apply only when `bars` is absent. `backgroundValue` supplies the real back-layer value, named by `backgroundName ?? name`; `value` supplies the front-layer value, named by `name`. Without `backgroundValue`, render only the front layer; do not duplicate its value into a fictional back layer. New code should use `bars`. Other modes ignore `backgroundValue/backgroundName`.

```svelte
<BarChart mode="overlay" data={[
  { name: 'Organic search', bars: [{ name: 'Previous quarter', value: 8400 }, { name: 'Current quarter', value: 10200 }] },
  { name: 'Direct traffic', bars: [{ name: 'Previous quarter', value: 7600 }, { name: 'Current quarter', value: 6800 }] },
  { name: 'Referrals', bars: [{ name: 'Previous quarter', value: 4200 }, { name: 'Current quarter', value: 5100 }] }
]} />
```

Numerical format priority: `labelFormatter → segment/bar.valueFormat → item.valueFormat → component valueFormat → NumberFormatContext → NumberFormats default value`.

Color priority:

- `single`: `data[i].color → colors[i] → colorMode`。
- `stack`: `segments[j].color → data[i].color → monochromeFade`; use the transparency gradient of the same color when not customized.
- `overlay`: The back layer and the front layer use the same color by default, and the transparency of the back layer is fixed at `0.1`.
- `group`: `bars[j].color → data[i].color → colors[j] → colorMode`。

Colors may be SnowUI semantic colors, CSS colors or variables, `linear-gradient(...)` strings, or gradient objects.

---

<a id="布局模型无障碍与动效"></a>

### Layout model, accessibility, and motion

Primary layout model: **intrinsic atomic layout** (source reference: `docs/standards/LayoutProtocol.md` section 12.7). The root `Frame` observes its measured width and height to recompute single-SVG geometry, supporting `width="100%"` fill.

- **Axes and safe areas**: Y-axis label width matches the widest visible rendered label with a fixed `12px` gap to the plot area; automatic domain max equals the maximum data value, top clearance is `8px` (`16px` with a vertical Y-axis), and `bottom=24px` (`8px` gap + `16px` label height) when the X-axis is visible.
- **Accessibility and hit testing**: The root uses `role="group"`, and each bar or segment exposes an independent transparent `role="button"` hit target with `aria-label`; `hoverMode="cell"` links the full half-cell band around each category center. `loading` preserves the canvas and axes at the initial motion progress with Skeleton disabled.
- **Layers and reveal timeline**: SVG layers render from bottom to top as `defs`, grid/baseline, optional `showBaseLayer` (4% opacity), series bars, hit targets, and axis labels. Reveal motion shares one `easeOut` chart timeline where each category unit grows from `80%` to `100%` (`300ms` base duration, lengthening toward later categories; `stack` segments in a unit grow together with a fixed pixel `segmentGap`).

[Styles](./styles.md) · [Types](./types.md) · [API](./api.md)
