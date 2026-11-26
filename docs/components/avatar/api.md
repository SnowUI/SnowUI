# Avatar API

These are named public Props; inherited capabilities belong to their own public API.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `src` | `string \| Component` | — | Avatar image URL or icon component. |
| `size` | `ResourceSize` | — | Avatar size tier: 12, 16, 20, 24, 28, 32, 40, 48, or 80. Explicit size takes priority, followed by parent avatar or general size context; defaults to 16 without context. |
| `fallback` | `Component` | — | Custom avatar component when src is missing or the image fails. Defaults to the built-in Gradient. For an animated avatar, pass GradientMotion; Avatar supplies as="avatar-image", size="100%", radius="inherit", and the resolved stable seed. |
| `fallbackText` | `string` | — | Explicit fallback text when the image is unavailable. Trims surrounding whitespace; nonempty text replaces the default Gradient, but an explicit fallback component still takes priority. Initials are not derived from the name automatically. |
| `fallbackColor` | `GradientVariant` | — | Explicit named artistic color for the default Gradient. Takes priority over fallbackSeed and name fallback. |
| `fallbackSeed` | `string \| number` | — | Stable identity seed; user.id is recommended. A deterministic hash maps it to one of six named colors, so the same seed always yields the same color without storing a color field. |
| `variant` | `AvatarVariant` | "default" | Default appearance uses the stable identity seed or explicit named Gradient color. Empty-avatar appearance uses a gray background and default user icon. |
| `gradientMotion` | `boolean` | false | Run the four-layer base vector deformation of the default Gradient fallback continuously. When false, Gradient can still run its ripple deformation and multicolor Overlay on hover. |
| `backgroundBlur` | `boolean` | false | Enable background blur, sharing the Button default of 20px. Disabled by default; avatar content remains sharp. |
| `children` | `Snippet` | — | Avatar attachments. as="badge" declares a corner badge; as="avatar-image" supplies an external avatar visual that replaces the default fallback layer. |
| `badgePosition` | `"top" \| "bottom"` | "top" | Position as="badge" content at the upper or lower right of the avatar. A Dot badge also participates in avatar clipping. |

[Types](./types.md) · [Full reference](./reference.md) · [Styles](./styles.md)
