# ScrollArea 类型与状态

必填属性：无具名必填属性。

可双向绑定：`bind:viewport`。

继承声明：`Omit<FrameProps, "children" | "enableAutoLayout">`。继承能力以基类公开文档为准；Omit 中的字段已排除，不能按基类原样使用。

[共享 Frame API](../frame/api.md) · [返回 API](./api.md)

以下为公开属性实际引用的类型声明，来自源码；Svelte Snippet 表示内容片段，ComponentProps 表示对应组件的 Props。

## ScrollAreaAxis

来源：src/components/ScrollArea.svelte

```ts
export type ScrollAreaAxis = "vertical" | "horizontal" | "both";
```

## ScrollAreaHorizontalTrackPosition

来源：src/components/ScrollArea.svelte

```ts
export type ScrollAreaHorizontalTrackPosition = "container" | "viewport";
```
