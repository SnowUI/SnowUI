# Skeleton style overrides

Read the [styling guide](../../guides/styling.md) before overriding a component. The entries below come from the reviewed component reference; verify the scope of each public variable.

<a id="skeleton-样式覆盖"></a>

# Skeleton style overlay

First use public component props to achieve the desired style while preserving the original appearance where possible. If an override is necessary, follow the [style selection and override order](../../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F): use your own class (including Tailwind already in your project) or an instance style. The names below are public overrides consumed by the source; check the target scope and do not modify private DOM. Choose the appropriate SnowUI token category. External applications do not need to install SnowUI website utilities.

| Variable | Purpose and default reference |
| --- | --- |
| `--snowui-skeleton-background-override` | Background (see component source for the default). |
| `--snowui-skeleton-font-size-override` | font-size (see component source for the default). |
| `--snowui-skeleton-gap-override` | Layout container gap (default var(--gap-2) = 8px) |
| `--snowui-skeleton-height-override` | Height (see the component source code for the default value) |
| `--snowui-skeleton-line-height-override` | line-height (see component source for the default). |
| `--snowui-skeleton-line-radius-override` | Line rounded corner (default var(--radius-3) = 12px) |
| `--snowui-skeleton-radius-override` | Border-radius (see the component source code for the default value) |
| `--snowui-skeleton-rect-radius-override` | Rect rounded corner (default var(--radius-3) = 12px) |
| `--snowui-skeleton-width-override` | Width (see the component source code for the default value) |

[Design Guide](../../guides/design-system.md) · [Token](../../reference/tokens.md) · [Combination Boundary](./reference.md)

[Full reference](./reference.md) · [Tokens](../../reference/tokens.md)
