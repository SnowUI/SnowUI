# Accordion style overrides

Read the [styling guide](../../guides/styling.md) before overriding a component. The entries below come from the reviewed component reference; verify the scope of each public variable.

<a id="accordion-样式覆盖"></a>

# Accordion style overlay

First use public component Props to match the desired appearance, preserving the existing look where possible. If changes are necessary, follow the [style selection and override order](../../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F): use your own class (including Tailwind already in the project) or an instance style. The names below are public overrides actually consumed by source; check their scope and do not modify private DOM. Choose the correct SnowUI token family. External apps need not install SnowUI website utilities.

| Variable | Purpose and default reference |
| --- | --- |
| `--snowui-accordion-font-size-override` | Title font-size (default sm=var(--text-14) md=var(--text-16) lg=var(--text-18)) |
| `--snowui-accordion-gap-override` | Item spacing (default default 0; filled default 4) |
| `--snowui-accordion-line-height-override` | Title line-height (default sm=var(--leading-14) md=var(--leading-16) lg=var(--leading-18)) |
| `--snowui-accordion-radius-override` | Item border-radius (default default 0; filled default sm 12 / md 16 / lg 24) |

[Design Guide](../../guides/design-system.md) · [Token](../../reference/tokens.md) · [Combination boundary](./reference.md)

[Full reference](./reference.md) · [Tokens](../../reference/tokens.md)
