# CodeBlock style overrides

Read the [styling guide](../../guides/styling.md) before overriding a component. The entries below come from the reviewed component reference; verify the scope of each public variable.

<a id="codeblock-样式覆盖"></a>

# CodeBlock style overlay

First use public component Props to match the desired appearance, preserving the existing look where possible. If changes are necessary, follow the [style selection and override order](../../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F): use your own class (including Tailwind already in the project) or an instance style. The names below are public overrides actually consumed by source; check their scope and do not modify private DOM. Choose the correct SnowUI token family. External apps need not install SnowUI website utilities.

| Variable | Purpose and default reference |
| --- | --- |
| `--snowui-code-block-bg-override` | Background (see component source for the default). |
| `--snowui-code-block-code-gap-override` | Code area gap (see component source code for the default value) |
| `--snowui-code-block-content-height-override` | Code area height (default 5lh, about 5 lines) |
| `--snowui-code-block-fg-override` | Foreground (default #1c1c1c; syntax color value is fixed in the component) |
| `--snowui-code-block-gap-override` | Operation button gap (default var(--gap-2) = 8px) |
| `--snowui-code-block-padding-override` | Overall padding (default state 20px; singleLine up and down 12px / left and right 16px) |
| `--snowui-code-block-padding-x-override` | Left and right padding (default var(--padding-5) = 20px; singleLine var(--padding-4) = 16px) |
| `--snowui-code-block-padding-y-override` | Upper and lower padding (default var(--padding-5) = 20px; singleLine var(--padding-3) = 12px) |
| `--snowui-code-block-radius-override` | Rounded corner (default var(--radius-4) = 16px) |
| `--snowui-code-block-scroll-mask-size-override` | Scrolling edge transparent fading size (default 32px) |

[Design Guide](../../guides/design-system.md) · [Token](../../reference/tokens.md) · [Combination Boundary](./reference.md)

[Full reference](./reference.md) · [Tokens](../../reference/tokens.md)
