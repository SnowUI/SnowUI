# SnowUILogo types and states

These declarations come from the reviewed component reference for this source version. Check the installed version before using them.

<a id="snowuilogo-类型与状态"></a>

# SnowUILogo type and status

Required Props: no named required Props.

Bindable Props: this component declares no named two-way binding; handle state updates through public callbacks or its host.

Inheritance statement: `Omit< FrameProps, "children" | "size" | "width" | "height" | "loopMotion" >`. The inheritance ability is subject to the public document of the base class; the fields in Omit have been excluded and cannot be used as they are according to the base class.

[Share Frame API](../frame/reference.md#api) · [Return API](../snow-ui-logo.md)

The following type declarations are actually referenced by public Props and come from source. A Svelte Snippet denotes a content fragment; ComponentProps denotes the Props of the corresponding component.

<a id="snowuilogovariant"></a>

## SnowUILogoVariant

Source: src/components/SnowUILogo.svelte

```ts
type SnowUILogoVariant = "icon" | "text" | "horizontal" | "vertical";
```

[API](./api.md) · [Full reference](./reference.md)
