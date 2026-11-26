# ImageGroup 类型与状态

必填属性：无具名必填属性。

可双向绑定：本组件未声明具名双向绑定属性；状态更新通过公开回调或所属宿主处理。

继承声明：`Omit<FrameProps, "gap">`。继承能力以基类公开文档为准；Omit 中的字段已排除，不能按基类原样使用。

[共享 Frame API](../frame/api.md) · [返回 API](./api.md)

以下为公开属性实际引用的类型声明，来自源码；Svelte Snippet 表示内容片段，ComponentProps 表示对应组件的 Props。

## ImageGroupSize

来源：src/components/ImageGroup.svelte

```ts
type ImageGroupSize = BaseResourceSize | 56 | 64 | 72;
```

## ResourceSize

来源：src/context.ts

```ts
export type ResourceSize = 12 | 16 | 20 | 24 | 28 | 32 | 40 | 48 | 80;
```

## ImageGroupLayout

来源：src/components/ImageGroup.svelte

```ts
type ImageGroupLayout = "row" | "column" | "grid";
```

## PreviewMode

来源：src/logic/image-preview.ts

```ts
export type PreviewMode = "viewer" | "window" | "none";
```
