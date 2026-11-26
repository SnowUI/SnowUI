# Toast style overrides

Read the [styling guide](../../guides/styling.md) before overriding a component. The entries below come from the reviewed component reference; verify the scope of each public variable.

<a id="toast-样式覆盖"></a>

# Toast style overlay

First use public component Props to match the desired appearance, preserving the existing look where possible. If changes are necessary, follow the [style selection and override order](../../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F): use your own class (including Tailwind already in the project) or an instance style. The names below are public overrides actually consumed by source; check their scope and do not modify private DOM. Choose the correct SnowUI token family. External apps need not install SnowUI website utilities.

| Variable | Purpose and default reference |
| --- | --- |
| `--snowui-button-opacity-override` | Opacity (see the component source code for the default value) |
| `--snowui-icon-height-override` | Height (see the component source code for the default value) |
| `--snowui-icon-width-override` | Width (see the component source code for the default value) |
| `--snowui-toast-font-size-override` | Default variant font-size (default md=var(---text-14) / sm=var(--text-12)) |
| `--snowui-toast-gap-override` | Gap (default md=var(--gap-2)=8px / sm=var(--gap-1)=4px) |
| `--snowui-toast-line-height-override` | Default variant line-height (default md=var(--leading-14) / sm=var(--leading-12)) |
| `--snowui-toast-padding-override` | Rich variant overall padding (default var(--padding-3) = 12px) |
| `--snowui-toast-padding-x-override` | Default variant padding-x (default md=var(--padding-3)=12px / sm=var(--padding-2)=8px) |
| `--snowui-toast-padding-y-override` | Default variant padding-y (default md=var(---padding-2)=8px / sm=var(--padding-1)=4px) |
| `--snowui-toast-radius-override` | Border-radius (default var(--radius-4) = 16px) |
| `--snowui-toast-success-color-override` | Built-in success icon color (default var(--secondary-green) = #71DD8C) |
| `--snowui-toast-warning-color-override` | Built-in warning icon color (default var(--secondary-yellow) = #FFCC00) |

[Design Guide](../../guides/design-system.md) · [Token](../../reference/tokens.md) · [Combination Boundary](./reference.md)

[Full reference](./reference.md) · [Tokens](../../reference/tokens.md)
