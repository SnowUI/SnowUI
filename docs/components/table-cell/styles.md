# TableCell style overrides

Read the [styling guide](../../guides/styling.md) before overriding a component. The entries below come from the reviewed component reference; verify the scope of each public variable.

<a id="tablecell-样式覆盖"></a>

# TableCell style overlay

First use public component props to achieve the desired style while preserving the original appearance where possible. If an override is necessary, follow the [style selection and override order](../../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F): use your own class (including Tailwind already in your project) or an instance style. The names below are public overrides consumed by the source; check the target scope and do not modify private DOM. Choose the appropriate SnowUI token category. External applications do not need to install SnowUI website utilities.

| Variable | Purpose and default reference |
| --- | --- |
| `--snowui-checkbox-size-override` | Overall size (size px, see the component source code for the default value) |
| `--snowui-table-actions-fade-coverage-override` | Default: 1 (the transparent area covers the actual button group and the inner margin on the right, and the transition extends to the left by default --size-5) |
| `--snowui-table-actions-fade-feather-override` | Default: unset (default fixed --size-5 transition; only compatible with explicit old multiples, after setting the end point = transparent area width × this multiple) |
| `--snowui-table-cell-actions-gap-override` | default: --gap-2 |
| `--snowui-table-cell-actions-padding-override` | default: --padding-2 --padding-3 |
| `--snowui-table-cell-padding-override` | default: --padding-2 --padding-3 |
| `--snowui-table-cell-selection-padding-override` | default: --padding-2 --padding-3 |
| `--snowui-table-cell-width-override` | default: runtime column width |
| `--snowui-table-role-overlay-width-override` | default: calc((--size-12 + --size-14) / 3) |
| `--snowui-table-row-hover-background-override` | Moving hover layer plus a persistent TableRow active background; default: --black-4 |
| `--snowui-table-row-radius-override` | default: --radius-3 |
| `--snowui-table-selection-checkbox-size-override` | Default: calc(var(--size-4) + 0.0625rem) = 17px; StyleSpec §2.2.2 registration special case, only works for selection full selection / line Checkbox |

[Design Guide](../../guides/design-system.md) · [Token](../../reference/tokens.md) · [Combination boundary](./reference.md)

[Full reference](./reference.md) · [Tokens](../../reference/tokens.md)
