# IconProvider API

These are named public Props; inherited capabilities belong to their own public API.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `icons` | `ComponentIconMap` | {} | Map stable semantic names to external Svelte icon components. |
| `resolver` | `ComponentIconResolver` | — | Resolve an icon by { name, weight }. Takes precedence over icons on the same provider. |
| `children` | `Snippet` | — | Descendant subtree rendered in place without an added layout wrapper. |

[Types](./types.md) · [Full reference](./reference.md) · [Styles](./styles.md)
