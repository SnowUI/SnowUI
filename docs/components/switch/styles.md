# Switch style overrides

Read the [styling guide](../../guides/styling.md) before overriding a component. The entries below come from the reviewed component reference; verify the scope of each public variable.

<a id="switch-样式覆盖"></a>

# Switch style overrides

First use public component Props to match the desired appearance, preserving the existing look where possible. If changes are necessary, follow the [style selection and override order](../../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F): use your own class (including Tailwind already in the project) or an instance style. The names below are public overrides actually consumed by source; check their scope and do not modify private DOM. Choose the correct SnowUI token family. External apps need not install SnowUI website utilities.

| Variable | Purpose and default reference |
| --- | --- |
| `--snowui-switch-color-override` | Color (see component source for the default) |
| `--snowui-switch-gap-override` | Gap (default `var(--gap-1)` = 4px) |
| `--snowui-switch-height-override` | Height (see component source for the default) |
| `--snowui-switch-label-font-size-override` | Label font size (see component source for the default) |
| `--snowui-switch-label-line-height-override` | Label line height (see component source for the default) |
| `--snowui-switch-motion-duration-override` | Motion duration (see component source for the default) |
| `--snowui-switch-motion-easing-override` | Motion curve (see component source for the default) |
| `--snowui-switch-overlay-color-override` | Overlay color (see component source for the default) |
| `--snowui-switch-overlay-opacity-override` | Overlay opacity (see component source for the default) |
| `--snowui-switch-primary-override` | Primary color (see component source for the default) |
| `--snowui-switch-radius-override` | Corner radius (see component source for the default) |
| `--snowui-switch-size-override` | Overall size in px (see component source for the default) |
| `--snowui-switch-thumb-gap-override` | Thumb spacing (see component source for the default) |
| `--snowui-switch-thumb-size-override` | Thumb size in px (see component source for the default) |
| `--snowui-switch-width-override` | Width (see component source for the default) |

[Design guide](../../guides/design-system.md) · [Tokens](../../reference/tokens.md) · [Composition boundaries](./reference.md)

[Full reference](./reference.md) · [Tokens](../../reference/tokens.md)
