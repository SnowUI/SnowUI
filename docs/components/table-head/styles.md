# TableHead style overrides

Read the [styling guide](../../guides/styling.md) before overriding a component. The entries below come from the reviewed component reference; verify the scope of each public variable.

<a id="tablehead-样式覆盖"></a>

# TableHead style overlay

First use public component Props to match the desired appearance, preserving the existing look where possible. If changes are necessary, follow the [style selection and override order](../../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F): use your own class (including Tailwind already in the project) or an instance style. The names below are public overrides actually consumed by source; check their scope and do not modify private DOM. Choose the correct SnowUI token family. External apps need not install SnowUI website utilities.

| Variable | Purpose and default reference |
| --- | --- |
| `--snowui-checkbox-size-override` | Overall size (size px, see the component source code for the default value) |
| `--snowui-table-head-actions-padding-override` | default: --padding-2 --padding-3 |
| `--snowui-table-head-padding-override` | default: --padding-2 --padding-3 |
| `--snowui-table-head-selection-padding-override` | default: --padding-2 --padding-3 |
| `--snowui-table-head-width-override` | default: runtime column width |
| `--snowui-table-role-overlay-width-override` | default: calc((--size-12 + --size-14) / 3) |
| `--snowui-table-row-radius-override` | default: --radius-3 |
| `--snowui-table-selection-checkbox-size-override` | Default: calc(var(--size-4) + 0.0625rem) = 17px; StyleSpec §2.2.2 registration special case, only works for selection full selection / line Checkbox |

[Design Guide](../../guides/design-system.md) · [Token](../../reference/tokens.md) · [Combination boundary](./reference.md)

[Full reference](./reference.md) · [Tokens](../../reference/tokens.md)
