# BarChart style overrides

Read the [styling guide](../../guides/styling.md) before overriding a component. The entries below come from the reviewed component reference; verify the scope of each public variable.

<a id="barchart-样式覆盖"></a>

# BarChart style overlay

First use public component Props to match the desired appearance, preserving the existing look where possible. If changes are necessary, follow the [style selection and override order](../../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F): use your own class (including Tailwind already in the project) or an instance style. The names below are public overrides actually consumed by source; check their scope and do not modify private DOM. Choose the correct SnowUI token family. External apps need not install SnowUI website utilities.

| Variable | Purpose and default reference |
| --- | --- |
| `--snowui-bar-chart-axis-color-override` | Coordinate axis label color (default var(--black-40)) |
| `--snowui-bar-chart-axis-font-size-override` | Coordinate axis label font size (default 12px) |
| `--snowui-bar-chart-axis-line-color-override` | X-axis baseline color (default var(--black-40)) |
| `--snowui-bar-chart-grid-color-override` | Grid line color (default var(--black-10)) |
| `--snowui-bar-chart-height-override` | Overall height (default 400px) |
| `--snowui-bar-chart-hover-label-color-override` | Hover label color (default var(--black-100)) |
| `--snowui-bar-chart-width-override` | Overall width (default 800px) |

[Design Guide](../../guides/design-system.md) · [Token](../../reference/tokens.md) · [Combination Boundary](./reference.md)

[Full reference](./reference.md) · [Tokens](../../reference/tokens.md)
