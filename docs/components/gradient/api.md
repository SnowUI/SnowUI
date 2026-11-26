# Gradient API

These are named public Props; inherited capabilities belong to their own public API.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `GradientVariant` | — | Choose one of six fixed colors corresponding to Frame 200 from left to right. |
| `seed` | `string \| number` | — | Only when as="avatar-image" and variant is omitted, choose one of six colors consistently. A color name can select its matching variant directly. |
| `size` | `number \| string` | — | Set width and height together; takes priority over width and height. |
| `width` | `number \| string` | — | Width; numeric values are treated as pixels. |
| `height` | `number \| string` | — | Height; numeric values are treated as pixels. |
| `radius` | `number \| string` | — | Outer clipping radius; numeric values are treated as pixels. |
| `motion` | `boolean` | — | Whether the four colored SVG layers animate continuously. With Avatar motion=false, ripple deformation can still run on hover without changing the multicolor Overlay. Defaults to true for ordinary Gradient and false for as="avatar-image". |
| `avatarHoverActive` | `boolean` | — | Hover artistic-color feedback for the avatar variant controlled by its Avatar host. When omitted, the component uses its own interaction detection. Does not affect non-avatar variants. |
| `decorative` | `boolean` | true | Decorative art is hidden from the accessibility tree by default. When false, also provide aria-label. |

[Types](./types.md) · [Full reference](./reference.md) · [Styles](./styles.md)
