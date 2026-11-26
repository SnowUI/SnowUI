# Dialog style overrides

Read the [styling guide](../../guides/styling.md) before overriding a component. The entries below come from the reviewed component reference; verify the scope of each public variable.

<a id="dialog-样式覆盖"></a>

# Dialog style overlay

First use public component Props to match the desired appearance, preserving the existing look where possible. If changes are necessary, follow the [style selection and override order](../../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F): use your own class (including Tailwind already in the project) or an instance style. The names below are public overrides actually consumed by source; check their scope and do not modify private DOM. Choose the correct SnowUI token family. External apps need not install SnowUI website utilities.

| Variable | Purpose and default reference |
| --- | --- |
| `--snowui-button-opacity-override` | Opacity (see the component source code for the default value) |
| `--snowui-dialog-font-size-override` | Font-size (default var(--text-14)=14px) |
| `--snowui-dialog-line-height-override` | Line-height (default var(--leading-14)=20px) |
| `--snowui-dialog-max-width-override` | Max-width (default sm=320px md=448px lg=640px) |
| `--snowui-dialog-padding-override` | Padding (default sm var(--padding-4)=16px; md/lg var(--padding-6)=24px) |
| `--snowui-dialog-radius-override` | Border-radius (default sm var(--radius-6)=24px; md/lg calc(var(--radius-4)*2)=32px) |

[Design Guide](../../guides/design-system.md) · [Token](../../reference/tokens.md) · [Combination Boundary](./reference.md)

[Full reference](./reference.md) · [Tokens](../../reference/tokens.md)
