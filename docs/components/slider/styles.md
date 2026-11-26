# Slider style overrides

Read the [styling guide](../../guides/styling.md) before overriding a component. The entries below come from the reviewed component reference; verify the scope of each public variable.

<a id="slider-样式覆盖"></a>

# Slider style overlay

First use public component Props to match the desired appearance, preserving the existing look where possible. If changes are necessary, follow the [style selection and override order](../../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F): use your own class (including Tailwind already in the project) or an instance style. The names below are public overrides actually consumed by source; check their scope and do not modify private DOM. Choose the correct SnowUI token family. External apps need not install SnowUI website utilities.

| Variable | Purpose and default reference |
| --- | --- |
| `--snowui-slider-background-override` | Track background color (default var(--black-4)) |
| `--snowui-slider-bar-radius-override` | Solid / soft container rounded corner (default var(--radius-2) = 8px) |
| `--snowui-slider-color-override` | Fill color (default var(--primary)) |
| `--snowui-slider-label-gap-override` | Label and thumb spacing (default calc(var(--gap-1) / 2) = 2px) |
| `--snowui-slider-thickness-override` | Track thickness / overall height of the bar (default 4px; solid / soft default 32px) |
| `--snowui-slider-thumb-color-override` | Thumb color (default var(--static-white-80)) |
| `--snowui-slider-thumb-shadow-override` | Thumb shadow (default 0 1px 2px rgba(0, 0, 0, 0.4)) |

[Design Guide](../../guides/design-system.md) · [Token](../../reference/tokens.md) · [Combination boundary](./reference.md)

[Full reference](./reference.md) · [Tokens](../../reference/tokens.md)
