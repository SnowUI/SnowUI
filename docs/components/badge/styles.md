# Badge style overrides

Read the [styling guide](../../guides/styling.md) before overriding a component. The entries below come from the reviewed component reference; verify the scope of each public variable.

<a id="badge-样式覆盖"></a>

# Badge style overlay

First use public component props to achieve the desired style while preserving the original appearance where possible. If an override is necessary, follow the [style selection and override order](../../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F): use your own class (including Tailwind already in your project) or an instance style. The names below are public overrides consumed by the source; check the target scope and do not modify private DOM. Choose the appropriate SnowUI token category. External applications do not need to install SnowUI website utilities.

| Variable | Purpose and default reference |
| --- | --- |
| `--snowui-badge-dot-size-override` | Dot mode size (size px, see the component source code for the default value) |
| `--snowui-badge-font-size-override` | font-size (see component source for the default). |
| `--snowui-badge-height-override` | Height (see the component source code for the default value) |
| `--snowui-badge-line-height-override` | Line-height (filled default 1; border default var(--leading-12)) |
| `--snowui-badge-min-width-override` | Minimum width (see the component source code for the default value) |
| `--snowui-badge-padding-override` | Padding y+x (filled default calc(--padding-1 * 0.75) calc(--padding-1 * 1.5); border default 0 var(--padding-1)) |
| `--snowui-badge-radius-override` | Border-radius (filled default var(--radius-full); border default calc(var(--radius-1) * 1.5)) |
| `--snowui-badge-size-override` | Overall size (size px, see the component source code for the default value) |
| `--snowui-badge-width-override` | Width (see the component source code for the default value) |

[Design Guide](../../guides/design-system.md) · [Token](../../reference/tokens.md) · [Combination Boundary](./reference.md)

[Full reference](./reference.md) · [Tokens](../../reference/tokens.md)
