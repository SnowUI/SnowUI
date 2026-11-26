# LocaleProvider API

These are named public Props; inherited capabilities belong to their own public API.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `locale` | `string` | "zh-CN" | Current locale identifier. Built-in locales are zh-CN and en-US. An unknown locale falls back by language subtag, then to zh-CN. |
| `messages` | `SnowUIMessageOverrides` | {} | Override built-in message keys only within this LocaleProvider subtree. |
| `children` | `Snippet` | — | Subtree receiving the locale and message overrides. Takes no arguments; LocaleProvider adds no DOM wrapper. |

[Types](./types.md) · [Full reference](./reference.md) · [Styles](./styles.md)
