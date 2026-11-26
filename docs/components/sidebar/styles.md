# Sidebar style overrides

Read the [styling guide](../../guides/styling.md) before overriding a component. The entries below come from the reviewed component reference; verify the scope of each public variable.

<a id="sidebar-样式覆盖"></a>

# Sidebar style overlay

First use public component Props to match the desired appearance, preserving the existing look where possible. If changes are necessary, follow the [style selection and override order](../../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F): use your own class (including Tailwind already in the project) or an instance style. The names below are public overrides actually consumed by source; check their scope and do not modify private DOM. Choose the correct SnowUI token family. External apps need not install SnowUI website utilities.

| Variable | Purpose and default reference |
| --- | --- |
| `--snowui-button-opacity-override` | Opacity (see component source for default). |
| `--snowui-separator-thickness-override` | Separator thickness. |
| `--snowui-sidebar-collapsed-header-gap-override` | Folding state Logo host and folding button spacing (default var(--gap-1)) |
| `--snowui-sidebar-collapsed-logo-slot-width-override` | Icon variant folding state Logo leading slot width (default 36px) |
| `--snowui-sidebar-collapsed-width-override` | Collapsed width (derived from padding and icon width; default 56px) |
| `--snowui-sidebar-default-logo-gap-override` | Default Logo icon / wordmark spacing (default calc(var(--gap-1) * 1.25) = 5px) |
| `--snowui-sidebar-footer-gap-override` | Footer content spacing (default var(--gap-2) = 8px) |
| `--snowui-sidebar-footer-padding-x-override` | Overlay Footer horizontal padding (default var(--padding-5) = 20px) |
| `--snowui-sidebar-footer-padding-y-override` | Overwrite Footer vertical padding (default upper 12px, lower 16px) |
| `--snowui-sidebar-gap-override` | Root-level Header / Body spacing (default var(--gap-3) = 12px) |
| `--snowui-sidebar-item-background-override` | Hover / active background (default var(--black-4)) |
| `--snowui-sidebar-item-padding-x-override` | Navigation item horizontal padding (default var(--padding-2)). |
| `--snowui-sidebar-item-radius-override` | Navigation item rounded corner (default var(--radius-3)) |
| `--snowui-sidebar-logo-padding-x-override` | Default/custom Logo host horizontal padding (default var(--padding-1)) |
| `--snowui-sidebar-logo-padding-y-override` | Vertical padding in the Header area where Logo is located (default 0px) |
| `--snowui-sidebar-logo-scroll-mask-size-override` | Logo area reverse fading height (default Header actual height + top padding + Header/Body gap) |
| `--snowui-sidebar-navigation-gap-override` | Body adjacent navigation content spacing (default var(--gap-1)) |
| `--snowui-sidebar-padding-x-override` | Root horizontal padding (default var(--padding-3) = 12px; Body scrolling bar keeps the distance between the right border of the Sidebar 4px) |
| `--snowui-sidebar-padding-y-override` | Root vertical padding (default var(--padding-4) = 16px) |
| `--snowui-sidebar-resize-indicator-offset-override` | Width on the right side of the expanded state Indicator Visual center from the right edge (default var(--padding-) = 4px) |
| `--snowui-sidebar-separator-padding-x-override` | Horizontal padding of all horizontal Separator in Sidebar (default var(--padding-2) = 8px) |
| `--snowui-sidebar-separator-padding-y-override` | Vertical padding of all horizontal Separator in Sidebar (default var(--padding-2) = 8px) |
| `--snowui-sidebar-width-override` | Expanded width (default 220px) |

[Design Guide](../../guides/design-system.md) · [Token](../../reference/tokens.md) · [Combination boundary](./reference.md)

[Full reference](./reference.md) · [Tokens](../../reference/tokens.md)
