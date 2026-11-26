# CircularChart 类型与状态

必填属性：无具名必填属性。

可双向绑定：本组件未声明具名双向绑定属性；状态更新通过公开回调或所属宿主处理。

继承声明：无接口继承。继承能力以基类公开文档为准；Omit 中的字段已排除，不能按基类原样使用。

[共享 Frame API](../frame/api.md) · [返回 API](./api.md)

以下为公开属性实际引用的类型声明，来自源码；Svelte Snippet 表示内容片段，ComponentProps 表示对应组件的 Props。

## CircularChartItem

来源：src/components/CircularChart.svelte

```ts
export interface CircularChartItem {
        name: string;
        value: number;
        color?: CircularChartColor;
        percentFormat?: NumberFormatOptions;
    }
```

## CircularChartColor

来源：src/components/CircularChart.svelte

```ts
export type CircularChartColor = ChartColor;
```

## ChartColor

来源：src/lib/chart/colors.ts

```ts
export type ChartColor = SnowUIColor | string | ChartGradient;
```

## SnowUIColor

来源：src/lib/color.ts

```ts
export type SnowUIColor = keyof typeof SNOWUI_COLOR_TOKENS;
```

## ChartGradient

来源：src/lib/chart/colors.ts

```ts
export interface ChartGradient {
    type?: "linear";
    angle?: number;
    stops: (string | ChartGradientStop)[];
}
```

## ChartGradientStop

来源：src/lib/chart/colors.ts

```ts
export interface ChartGradientStop {
    color: SnowUIColor | string;
    offset?: number | string;
    opacity?: number;
}
```

## NumberFormatOptions

来源：src/lib/number-format.ts

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

## NumberNotation

来源：src/lib/number-format.ts

```ts
export type NumberNotation = "standard" | "compact" | "auto";
```

## CircularChartColorMode

来源：src/components/CircularChart.svelte

```ts
export type CircularChartColorMode = ChartColorMode;
```

## ChartColorMode

来源：src/lib/chart/colors.ts

```ts
export type ChartColorMode = "sequence" | "monochromeFade" | "monochrome";
```

## StartDirection

来源：src/components/CircularChart.svelte

```ts
type StartDirection =
        | "top"
        | "top-right"
        | "right"
        | "bottom-right"
        | "bottom"
        | "bottom-left"
        | "left"
        | "top-left";
```

## AnchorPoint

来源：src/components/CircularChart.svelte

```ts
type AnchorPoint = "top" | "center" | "bottom";
```

## ChartHoverMode

来源：src/components/CircularChart.svelte

```ts
type ChartHoverMode = "item" | "cell";
```

## ChartHoverPanelVariant

来源：src/lib/chart/hover-panel.ts

```ts
export type ChartHoverPanelVariant = "dark" | "light" | "surface";
```

## ChartHoverPanelPlacement

来源：src/lib/chart/hover-panel.ts

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
