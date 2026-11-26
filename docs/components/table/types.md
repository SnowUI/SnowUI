# Table types and states

These declarations come from the reviewed component reference for this source version. Check the installed version before using them.

<a id="table-类型与状态"></a>

# Table type and status

Required Props: no named required Props.

Two-way binding: `bind:columnWidths`.

Inheritance: `Omit<FrameProps, "children">`. Consult the base class public documentation; fields excluded by Omit cannot be passed through unchanged.

[Share Frame API](../frame/reference.md#api) · [Return API](../table.md)

The following type declarations are actually referenced by public Props and come from source. A Svelte Snippet denotes a content fragment; ComponentProps denotes the Props of the corresponding component.

<a id="tablerolelayout"></a>

## TableRoleLayout

Source: src/lib/table-context.svelte.ts

```ts
export type TableRoleLayout = "auto" | "column" | "overlay";
```

<a id="resourcesize"></a>

## ResourceSize

Source: src/context.ts

```ts
export type ResourceSize = 12 | 16 | 20 | 24 | 28 | 32 | 40 | 48 | 80;
```

[API](./api.md) · [Full reference](./reference.md)
