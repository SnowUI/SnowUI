# ColorSchemeButton types and states

These declarations come from the reviewed component reference for this source version. Check the installed version before using them.

<a id="colorschemebutton-类型与状态"></a>

# ColorSchemeButton types and state

Required Props: no named required Props.

Bindable Prop: `bind:scheme`.

Inheritance: `Omit< ButtonProps, "children" | "onclick" | "disabled" | "aria-pressed" >`. Consult the base class public documentation; fields excluded by Omit cannot be passed through unchanged.

[Shared Frame API](../frame/reference.md#api) · [Back to API](../color-scheme-button.md)

The following type declarations are actually referenced by public Props and come from source. A Svelte Snippet denotes a content fragment; ComponentProps denotes the Props of the corresponding component.

<a id="colorscheme"></a>

## ColorScheme

Source: src/components/ColorSchemeButton.svelte

```ts
export type ColorScheme = "light" | "dark";
```

<a id="buttonprops"></a>

## ButtonProps

Source: src/components/ColorSchemeButton.svelte

```ts
type ButtonProps = ComponentProps<typeof Button>;
```

[API](./api.md) · [Full reference](./reference.md)
