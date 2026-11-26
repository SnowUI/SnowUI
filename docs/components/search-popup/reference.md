# SearchPopup full reference

Reviewed against Chinese source SHA-256 `cc2d6e1d5da8c2268095dc462299a6a47c721a4143687eae04c89386435b4532`.

<a id="searchpopup"></a>

# SearchPopup

<a id="组件介绍"></a>

## Overview

Composable search panel with a built-in SearchInput and optional data-driven results, supporting ungrouped lists, group headings, and explicit custom content while leaving search ranking, history, popularity, and routing to the host.

<a id="使用选择"></a>

## When to use it

Use it for a standard search input and results layout. SearchBox is an opening control; SearchPopup is the panel and is static by default. Set `backdrop` for the shared modal overlay. Without an overlay, an anchored trigger uses the inherited Popover template or inline mode.

- `items` creates text or link results with optional `group`; `showGroupTitles` controls group headings.
- `children` replaces all built-in results. Use `Text as="group-title"` for explicit headings and `MenuItem as="item"` for items.
- With `search={false}`, supply an explicit `SearchInput as="content"`. Configure that input directly; it does not consume `parts`.

<a id="快速开始"></a>

## Quick start

```svelte
<script lang="ts">
    import { SearchPopup } from '@snowui-design-system/components';
</script>
<SearchPopup items={[{ value: 'button', label: 'Button', href: '/components/button', group: 'Recommended components' }]} />
```

<a id="api"></a>

## API

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| backdrop | `BackdropVariant \| false` | `false` | `false` keeps static or anchored mode; `opaque`, `blur`, and `transparent` enable the shared Dialog modal overlay. |
| closeOnOutside | `boolean` | `true` | In modal mode, whether clicking the overlay closes the panel; independent of overlay appearance. |
| value | `string \| number` | `''` | Search input value; supports `bind:value`. The consumer owns filtering. |
| search | `boolean` | `true` | Whether to create the default SearchInput; turn it off when supplying an explicit input. |
| title | `string` | — | Optional panel title above the results. Explicit content owns it in `children` mode. |
| showGroupTitles | `boolean` | `true` | Whether to show group headings for `items`; does not reorder them. |
| items | `SearchPopupItem[]` | `[]` | `value`, `label`, and `href` are required; `group` and `disabled` are optional. Items follow input order; consecutive items with the same group show one heading. |
| children | `Snippet` | — | Replaces all default results and headings; `items`, `title`, and `showGroupTitles` are no longer read. |
| parts | `ComponentPartsOf<{ SearchInput: typeof SearchInput; MenuItem: typeof MenuItem; Text: typeof Text }>` | — | Configures the generated input, results, and headings. Their data owns `value`, `children`, identity, and `disabled`. |

Host inheritance: Forwards `Popover` props including `open`, `onOpenChange`, `template`, `id`, `as`, `closeOnEscape`, `size` (default `'md'`, nominal width 480px), `closeOn` (default `'manual'`), and outer `class` / `style`. When `backdrop` is enabled, an internal `Dialog` manages modal behavior while `class`, `style`, and `parts` continue targeting the inner search panel.

<a id="使用边界与详细说明"></a>

## Usage boundaries and details

Default built-in mode creates SearchInput, Text, and MenuItem. `parts` does not rewrite explicit `children`. `parts.SearchInput` can configure the input’s placeholder, ARIA attributes, and autofocus. Built-in labels follow SearchInput’s locale defaults; SearchPopup adds no fixed application copy. Default results use native links and must supply `href`. For commands or other non-navigation results, explicitly compose a keyboard-accessible Button in `children`.

Follow [Figma SearchPopup](https://www.figma.com/file/PAA0JKidFMVK44KRRWB1zL) vertical spacing: the default `md` panel has 16px top and bottom padding; the search area has 4px above and 16px below; the results begin 12px after the input divider. Results form one column. Heading-to-item and item-to-item spacing is `gap-1` (4px). Later group headings add `gap-2` (8px) above, for 12px total with row spacing. The first heading adds no extra margin; without a heading the first item also begins 12px below the divider. Headings have 0 vertical and 8px horizontal padding; items have 8px vertical padding. Public role `group-title` accepts multiple items through Text or native `data-as`; it controls heading color and spacing, not application content. `as="item"` preserves MenuItem semantics and does not create a Listbox selection owner.

Headings and groups may be omitted. Explicit complex content can combine Avatar, Icon, and MenuItem. With `backdrop`, the internal Dialog manages the shared overlay, enter/exit motion and reversal, reduced motion, focus containment and restoration, and background scroll lock. `closeOnEscape` controls Escape; `closeOnOutside` controls overlay clicks. Use `bind:open` for visibility. Template/id mode uses `data-dialog-target`, `data-dialog-close`, or `showDialog`/`hideDialog`; `as="popover"` uses Dialog’s inline trigger in this mode. Do not wrap another Dialog around it, which would create two overlays. In modal mode, the inner Popover does not close itself; `closeOn`/`closeOnSelect` apply only without a backdrop. Default link results close Dialog; explicit results may use `data-dialog-close`. Static-panel SSR does not access browser globals. Motion and reduced-motion behavior inherit from Popover. Without positioning mode, no new positioning listener is installed.

[Styles](./styles.md) · [Types](./types.md) · [API](./api.md)
