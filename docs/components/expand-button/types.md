# ExpandButton types and states

These declarations come from the reviewed component reference for this source version. Check the installed version before using them.

<a id="expandbutton-类型与状态"></a>

# ExpandButton types and state

Required Props: no named required Props.

Bindable Prop: `bind:expanded`.

Inheritance: `Omit<ButtonProps, "children" | "onclick" | "aria-expanded">`. Consult the base class public documentation; fields excluded by Omit cannot be passed through unchanged.

[Shared Frame API](../frame/reference.md#api) · [Back to API](../expand-button.md)

The following type declarations are actually referenced by public Props and come from source. A Svelte Snippet denotes a content fragment; ComponentProps denotes the Props of the corresponding component.

<a id="buttonprops"></a>

## ButtonProps

Source: src/components/ExpandButton.svelte

```ts
type ButtonProps = ComponentProps<typeof Button>;
```

[API](./api.md) · [Full reference](./reference.md)
