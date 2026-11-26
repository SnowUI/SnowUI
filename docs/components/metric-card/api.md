# MetricCard API

These are named public Props; inherited capabilities belong to their own public API.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | required | The name of the metric displayed above its values. |
| `value` | `string` | required | The current value, already formatted by the caller. |
| `change` | `string` | — | An optional formatted change; without it the current value is primary. |
| `emphasis` | `'value' \| 'change'` | "change" | Choose whether the current value or the change is visually primary. |
| `trend` | `'positive' \| 'negative' \| 'neutral'` | "neutral" | Style the initial change sign as positive, negative, or neutral; the caller determines its meaning. |

[Types](./types.md) · [Full reference](./reference.md) · [Styles](./styles.md)
