# Chip style overrides

Read the [styling guide](../../guides/styling.md) before overriding a component. The entries below come from the reviewed component reference; verify the scope of each public variable.

<a id="chip-样式覆盖"></a>

# Chip style overlay

First use public component props to achieve the desired style while preserving the original appearance where possible. If an override is necessary, follow the [style selection and override order](../../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F): use your own class (including Tailwind already in your project) or an instance style. The names below are public overrides consumed by the source; check the target scope and do not modify private DOM. Choose the appropriate SnowUI token category. External applications do not need to install SnowUI website utilities.

| Variable | Purpose and default reference |
| --- | --- |
| `--snowui-chip-background-override` | Background color (default color-mix(currentColor 10%, transparent)) |
| `--snowui-chip-font-size-override` | Font-size (default sm=var(--text-12) lg=var(--text-14)) |
| `--snowui-chip-gap-override` | Gap (default 0) |
| `--snowui-chip-line-height-override` | Line-height (default sm=var(--leading-12) lg=var(--leading-14)) |
| `--snowui-chip-padding-override` | Background: sm=2px 8px, lg=4px 12px; icon side sm=4px, lg=8px |
| `--snowui-chip-radius-override` | Border-radius (only background is effective, default 9999px) |
| `--snowui-chip-shadow-override` | Stroke inset box-shadow (default 0 0 0 0.5px color-mix(currentColor 20%, transparent)) |

[Design Guide](../../guides/design-system.md) · [Token](../../reference/tokens.md) · [Combination Boundary](./reference.md)

[Full reference](./reference.md) · [Tokens](../../reference/tokens.md)
