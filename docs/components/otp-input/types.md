# OTPInput types and states

These declarations come from the reviewed component reference for this source version. Check the installed version before using them.

<a id="otpinput-类型与状态"></a>

# OTPInput types and states

Required Props: no named required Props.

Two-way bindings: `bind:value` and `bind:success`.

Inherited declaration: `Omit<FrameProps, "tag" | "children" | "enableScaleObserver" | "oninput" | "onchange" | "onfocus" | "onblur" | "onkeydown" | "onpaste">`. Consult the public base component documentation for inherited capabilities; excluded fields are unavailable as inherited Props.

[Shared Frame API](../frame.md) · [Back to API](../otp-input.md)

The following type declarations are actually referenced by public Props and come from source. A Svelte Snippet denotes a content fragment; ComponentProps denotes the Props of the corresponding component.

<a id="otplength"></a>

## OTPLength

Source: src/components/OTPInput.svelte

```ts
export type OTPLength = 4 | 5 | 6 | 7 | 8;
```

External type source:

- HTMLInputAttributes — svelte/elements

[API](./api.md) · [Full reference](./reference.md)
