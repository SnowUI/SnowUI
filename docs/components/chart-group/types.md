# ChartGroup types and states

These declarations come from the reviewed component reference for this source version. Check the installed version before using them.

<a id="chartgroup-类型与状态"></a>

# ChartGroup type and status

Required Props: no named required Props.

Bindable Props: this component declares no named two-way binding; handle state updates through public callbacks or its host.

Inheritance statement: `Omit<FrameProps, "children" | "skeleton" | "renderHints">`. The inheritance ability is subject to the public document of the base class; the fields in Omit have been excluded and cannot be used as they are according to the base class.

[Share Frame API](../frame/reference.md#api) · [Return API](../chart-group.md)

The following type declarations are actually referenced by public Props and come from source. A Svelte Snippet denotes a content fragment; ComponentProps denotes the Props of the corresponding component.

<a id="chartgroupxaxismode"></a>

## ChartGroupXAxisMode

Source: src/lib/chart/group-context.ts

```ts
export type ChartGroupXAxisMode = "edge" | "cell";
```

<a id="chartgroupplotbounds"></a>

## ChartGroupPlotBounds

Source: src/components/ChartGroup.svelte

```ts
export interface ChartGroupPlotBounds {
        top?: number;
        right?: number;
        bottom?: number;
        left?: number;
    }
```

<a id="chartgrouphovermode"></a>

## ChartGroupHoverMode

Source: src/lib/chart/group-context.ts

```ts
export type ChartGroupHoverMode = "item" | "cell";
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
