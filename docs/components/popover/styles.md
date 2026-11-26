# Popover style overrides

Read the [styling guide](../../guides/styling.md) before overriding a component. The entries below come from the reviewed component reference; verify the scope of each public variable.

<a id="popover-样式覆盖"></a>

# Popover style overlay

First use public component Props to match the desired appearance, preserving the existing look where possible. If changes are necessary, follow the [style selection and override order](../../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F): use your own class (including Tailwind already in the project) or an instance style. The names below are public overrides actually consumed by source; check their scope and do not modify private DOM. Choose the correct SnowUI token family. External apps need not install SnowUI website utilities.

| Variable | Purpose and default reference |
| --- | --- |
| `--snowui-menu-item-radius-override` | Border-radius (default var(--radius-3) = 12px) |
| `--snowui-popover-font-size-override` | Font-size(default var(--text-14) = 14px) |
| `--snowui-popover-line-height-override` | Line-height(default var(--leading-14)) |
| `--snowui-popover-padding-override` | Padding (default sm 12 / md 16 / lg 24) |
| `--snowui-popover-radius-override` | Border-radius (default sm 16 / md 24 / lg 32) |

[Design Guide](../../guides/design-system.md) · [Token](../../reference/tokens.md) · [Combination boundary](./reference.md)

[Full reference](./reference.md) · [Tokens](../../reference/tokens.md)
