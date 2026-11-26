# Chip API

These are named public Props; inherited capabilities belong to their own public API.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `"default" \| "background"` | "default" | Appearance variant. default shows the built-in Dot. background adds a colored background and a 0.5px border and hides the Dot by default. |
| `size` | `"sm" \| "lg"` | — | An explicit value takes priority. When omitted, reads a snapshot of the parent numeric size context at creation: values up to 12 use sm, larger values use lg, and no numeric context falls back to sm. It does not follow later parent size changes; pass size explicitly for dynamic changes. sm text is 12/16, lg text is 14/20. |
| `showDot` | `boolean` | — | When omitted, follows variant: shown for default and hidden for background. Explicit true or false controls the built-in Dot. An external leading child always hides it. |
| `children` | `Snippet` | — | Content snippet with no parameters for label text and optional leading or trailing children. SnowUI children declare roles with as="leading" or as="trailing". An external leading child replaces the built-in Dot. |

[Types](./types.md) · [Full reference](./reference.md) · [Styles](./styles.md)
