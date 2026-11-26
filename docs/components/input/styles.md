# Input style overrides

Read the [styling guide](../../guides/styling.md) before overriding a component. The entries below come from the reviewed component reference; verify the scope of each public variable.

<a id="input-样式覆盖"></a>

# Input style overlay

First use public component Props to match the desired appearance, preserving the existing look where possible. If changes are necessary, follow the [style selection and override order](../../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F): use your own class (including Tailwind already in the project) or an instance style. The names below are public overrides actually consumed by source; check their scope and do not modify private DOM. Choose the correct SnowUI token family. External apps need not install SnowUI website utilities.

| Variable | Purpose and default reference |
| --- | --- |
| `--snowui-input-background-override` | Background (see component source for the default). |
| `--snowui-input-font-size-override` | font-size (see component source for the default). |
| `--snowui-input-gap-override` | Gap (default var(--gap-2) = 8px) |
| `--snowui-input-height-override` | Height (see the component source code for the default value) |
| `--snowui-input-line-height-override` | line-height (see component source for the default). |
| `--snowui-input-padding-override` | Overall padding (see the component source code for the default value) |
| `--snowui-input-placeholder-color-override` | Placeholder color (see the component source code for the default value) |
| `--snowui-input-radius-override` | border-radius |
| `--snowui-input-warning-icon-color-override` | Warning icon color (see the component source code for the default value) |
| `--snowui-input-warning-icon-font-size-override` | Warning icon font-size (see the component source code for the default value) |
| `--snowui-input-warning-icon-line-height-override` | Warning icon line-height (see the component source code for the default value) |
| `--snowui-input-warning-icon-size-override` | Warning icon size (size px, see the component source code for the default value) |
| `--snowui-input-width-override` | Width (see the component source code for the default value) |

[Design Guide](../../guides/design-system.md) · [Token](../../reference/tokens.md) · [Combination boundary](./reference.md)

[Full reference](./reference.md) · [Tokens](../../reference/tokens.md)
