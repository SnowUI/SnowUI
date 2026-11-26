# Radio style overrides

Read the [styling guide](../../guides/styling.md) before overriding a component. The entries below come from the reviewed component reference; verify the scope of each public variable.

<a id="radio-样式覆盖"></a>

# Radio style coverage

First use public component Props to match the desired appearance, preserving the existing look where possible. If changes are necessary, follow the [style selection and override order](../../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F): use your own class (including Tailwind already in the project) or an instance style. The names below are public overrides actually consumed by source; check their scope and do not modify private DOM. Choose the correct SnowUI token family. External apps need not install SnowUI website utilities.

| Variable | Purpose and default reference |
| --- | --- |
| `--snowui-radio-border-motion-duration-override` | The duration of the dynamic effect of the border (see the component source code for the default value) |
| `--snowui-radio-border-motion-easing-override` | Border dynamic effect curve (see the component source code for the default value) |
| `--snowui-radio-border-width-override` | Border width (see the component source code for the default value) |
| `--snowui-radio-color-override` | Color (see the component source code for the default value) |
| `--snowui-radio-dot-size-override` | Dot size (size px, see the component source code for the default value) |
| `--snowui-radio-filled-border-override` | Filled mode border (see the component source code for the default value) |
| `--snowui-radio-gap-override` | Gap (default var(--gap-1) = 4px) |
| `--snowui-radio-label-font-size-override` | Label font-size (see the component source code for the default value) |
| `--snowui-radio-label-line-height-override` | Label line-height (see the component source code for the default value) |
| `--snowui-radio-motion-duration-override` | Dynamic duration (see the component source code for the default value) |
| `--snowui-radio-motion-easing-override` | Dynamic curve (see the component source code for the default value) |
| `--snowui-radio-primary-override` | Main color (see the component source code for the default value) |
| `--snowui-radio-radius-override` | Border-radius (see the component source code for the default value) |
| `--snowui-radio-size-override` | Overall size (size px, see the component source code for the default value) |

[Design Guide](../../guides/design-system.md) · [Token](../../reference/tokens.md) · [Combination Boundary](./reference.md)

[Full reference](./reference.md) · [Tokens](../../reference/tokens.md)
