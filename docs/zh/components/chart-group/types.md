# ChartGroup 类型与状态

必填属性：无具名必填属性。

可双向绑定：本组件未声明具名双向绑定属性；状态更新通过公开回调或所属宿主处理。

继承声明：`Omit<FrameProps, "children" | "skeleton" | "renderHints">`。继承能力以基类公开文档为准；Omit 中的字段已排除，不能按基类原样使用。

[共享 Frame API](../frame/api.md) · [返回 API](./api.md)

以下为公开属性实际引用的类型声明，来自源码；Svelte Snippet 表示内容片段，ComponentProps 表示对应组件的 Props。

## ChartGroupXAxisMode

来源：src/lib/chart/group-context.ts

```ts
export type ChartGroupXAxisMode = "edge" | "cell";
```

## ChartGroupPlotBounds

来源：src/components/ChartGroup.svelte

```ts
export interface ChartGroupPlotBounds {
        top?: number;
        right?: number;
        bottom?: number;
        left?: number;
    }
```

## ChartGroupHoverMode

来源：src/lib/chart/group-context.ts

```ts
export type ChartGroupHoverMode = "item" | "cell";
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
