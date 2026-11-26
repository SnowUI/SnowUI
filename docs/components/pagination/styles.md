# Pagination style overrides

Read the [styling guide](../../guides/styling.md) before overriding a component. The entries below come from the reviewed component reference; verify the scope of each public variable.

<a id="pagination-样式覆盖"></a>

# Pagination style overlay

First use public component Props to match the desired appearance, preserving the existing look where possible. If changes are necessary, follow the [style selection and override order](../../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F): use your own class (including Tailwind already in the project) or an instance style. The names below are public overrides actually consumed by source; check their scope and do not modify private DOM. Choose the correct SnowUI token family. External apps need not install SnowUI website utilities.

| Variable | Purpose and default reference |
| --- | --- |
| `--snowui-icon-height-override` | Height (see the component source code for the default value) |
| `--snowui-icon-min-height-override` | Minimum height (see the component source code for the default value) |
| `--snowui-icon-min-width-override` | Minimum width (see the component source code for the default value) |
| `--snowui-icon-width-override` | Width (see the component source code for the default value) |
| `--snowui-pagination-color-override` | Default text / Icon color (default var(--black-100)) |
| `--snowui-pagination-column-gap-override` | Column spacing (default var(--gap-1) = 4px) |
| `--snowui-pagination-ellipsis-color-override` | Ellipsis color (default var(--black-40)) |
| `--snowui-pagination-font-size-override` | Default text font-size (default var(--text-12) = 12px) |
| `--snowui-pagination-hover-opacity-override` | Default non-current text / Icon hover transparency (default 1) |
| `--snowui-pagination-icon-size-override` | Default arrow Icon size (default var(--size-4) = 16px) |
| `--snowui-pagination-idle-opacity-override` | Default non-current text / Icon transparency (default 0.4) |
| `--snowui-pagination-line-height-override` | Default text line-height (default var(--leading-12) = 16px) |
| `--snowui-pagination-padding-x-override` | Default text / Icon left and right padding (default var(--padding-2) = 8px) |
| `--snowui-pagination-padding-y-override` | Default text / Icon up and down padding (default var(--padding-1) = 4px) |
| `--snowui-pagination-radius-override` | Default item border-radius (default var(--radius-3) = 12px) |
| `--snowui-pagination-row-gap-override` | Line spacing (default var(--gap-1) = 4px) |

[Design Guide](../../guides/design-system.md) · [Token](../../reference/tokens.md) · [Combination Boundary](./reference.md)

[Full reference](./reference.md) · [Tokens](../../reference/tokens.md)
