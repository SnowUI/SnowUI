# GaugeChart types and states

These declarations come from the reviewed component reference for this source version. Check the installed version before using them.

<a id="gaugechart-类型与状态"></a>

# GaugeChart type and status

Required Props: no named required Props.

Bindable Props: this component declares no named two-way binding; handle state updates through public callbacks or its host.

Inheritance statement: no interface inheritance. The inheritance ability is subject to the public document of the base class; the fields in Omit have been excluded and cannot be used as they are according to the base class.

[Share Frame API](../frame/reference.md#api) · [Return API](../gauge-chart.md)

The following type declarations are actually referenced by public Props and come from source. A Svelte Snippet denotes a content fragment; ComponentProps denotes the Props of the corresponding component.

<a id="gaugechartitem"></a>

## GaugeChartItem

Source: src/components/GaugeChart.svelte

```ts
export interface GaugeChartItem {
        name: string;
        value: number;
        color?: GaugeChartColor;
        percentFormat?: NumberFormatOptions;
    }
```

<a id="gaugechartcolor"></a>

## GaugeChartColor

Source: src/components/GaugeChart.svelte

```ts
export type GaugeChartColor = ChartColor;
```

<a id="chartcolor"></a>

## ChartColor

Source: src/lib/chart/colors.ts

```ts
export type ChartColor = SnowUIColor | string | ChartGradient;
```

<a id="snowuicolor"></a>

## SnowUIColor

Source: src/lib/color.ts

```ts
export type SnowUIColor = keyof typeof SNOWUI_COLOR_TOKENS;
```

<a id="chartgradient"></a>

## ChartGradient

Source: src/lib/chart/colors.ts

```ts
export interface ChartGradient {
    type?: "linear";
    angle?: number;
    stops: (string | ChartGradientStop)[];
}
```

<a id="chartgradientstop"></a>

## ChartGradientStop

Source: src/lib/chart/colors.ts

```ts
export interface ChartGradientStop {
    color: SnowUIColor | string;
    offset?: number | string;
    opacity?: number;
}
```

<a id="numberformatoptions"></a>

## NumberFormatOptions

Source: src/lib/number-format.ts

```ts
export interface NumberFormatOptions {
    fractionDigits?: number;
    valueLabelFractionDigits?: number;
    percentFractionDigits?: number;
    preserveTrailingZeros?: boolean;
    useGrouping?: boolean;
    emptyValue?: string;
    locale?: string;
    notation?: NumberNotation;
    compactThreshold?: number;
    compactFractionDigits?: number;
}
```

<a id="numbernotation"></a>

## NumberNotation

Source: src/lib/number-format.ts

```ts
export type NumberNotation = "standard" | "compact" | "auto";
```

<a id="gaugechartcolormode"></a>

## GaugeChartColorMode

Source: src/components/GaugeChart.svelte

```ts
export type GaugeChartColorMode = ChartColorMode;
```

<a id="chartcolormode"></a>

## ChartColorMode

Source: src/lib/chart/colors.ts

```ts
export type ChartColorMode = "sequence" | "monochromeFade" | "monochrome";
```

<a id="startdirection"></a>

## StartDirection

Source: src/components/GaugeChart.svelte

```ts
type StartDirection = "left" | "right";
```

<a id="anchorpoint"></a>

## AnchorPoint

Source: src/components/GaugeChart.svelte

```ts
type AnchorPoint = "top" | "center" | "bottom";
```

<a id="charthovermode"></a>

## ChartHoverMode

Source: src/components/GaugeChart.svelte

```ts
type ChartHoverMode = "item" | "cell";
```

<a id="charthoverpanelvariant"></a>

## ChartHoverPanelVariant

Source: src/lib/chart/hover-panel.ts

```ts
export type ChartHoverPanelVariant = "dark" | "light" | "surface";
```

<a id="charthoverpanelplacement"></a>

## ChartHoverPanelPlacement

Source: src/lib/chart/hover-panel.ts

```ts
export type ChartHoverPanelPlacement =
    | "anchor-top"
    | "anchor-side"
    | "pointer"
    | "pin-top-left"
    | "pin-top"
    | "pin-top-right"
    | "pin-right"
    | "pin-bottom-right"
    | "pin-bottom"
    | "pin-bottom-left"
    | "pin-left"
    | "pin-center";
```

[API](./api.md) · [Full reference](./reference.md)
