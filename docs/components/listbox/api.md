# Listbox API

These are named public Props; inherited capabilities belong to their own public API.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `Snippet` | — | Explicit option content without arguments. Replaces items. Give each MenuItem as="item" a unique value. For external search, use Input as="search" and set search={false}. |
| `items` | `ListboxItem[]` | [] | Built-in options with a required unique string value, a display and search label, and optional disabled state. Ignored when children is supplied; the host manages custom runtime items. |
| `parts` | `ComponentPartsOf<{ Input: typeof Input; MenuItem: typeof MenuItem; Text: typeof Text; }>` | — | Configure public Props of generated Input, MenuItem and string-label Text instances, including search placeholders, custom values, check marks and label typography. parts.Text only applies to generated items and custom-option labels; configure explicit children directly. parts.MenuItem.showCheck takes priority over the Listbox showCheck default. |
| `search` | `boolean` | — | Whether to add a fixed search Input at the top. Resolves from the explicit value, host configuration, then true. Select supplies false by default; enable it explicitly when needed. |
| `maxHeight` | `number \| string` | — | Maximum panel height. A number means pixels; a string is a CSS length. Limited by viewport space. Without a value, shows up to 10 complete items and retains at least the first two actual options when space is short. |
| `minWidth` | `number \| string` | — | Minimum panel width. A number means pixels; a string is a CSS length. Without a value, defaults to 160px with search or 0 without search. Content and viewport limits still affect final width. |
| `scrollbar` | `boolean` | true | Show the overlay scrollbar when content overflows. false hides only the track; wheel and keyboard scrolling still work. |
| `matchTriggerWidth` | `boolean` | true | With true, start from measured anchor width plus 2px, covering 1px on each side; wider content may expand the panel. With false, hug option content without compensation, subject to minWidth and viewport limits. |
| `placementMode` | `"selected" \| "bottom"` | "selected" | selected centers the chosen item on the trigger; bottom opens below the trigger. Available viewport space constrains final position and height. |
| `align` | `"start" \| "center" \| "end"` | "start" | Align the panel to the anchor's left edge, horizontal center, or right edge. Differences are visible when a Hug panel and anchor have different widths; final placement remains constrained by the viewport. |
| `showCheck` | `boolean` | false | Reserve space for and show a trailing check on the selected item. Select supplies true by default. An explicit MenuItem can override it, and a custom trailing item replaces the built-in check. |
| `continuousHover` | `boolean` | true | Move one highlight background between direct MenuItem entries, shared with keyboard active state. false restores each item’s immediate background. Disabled and filtered entries are not targets. |

[Types](./types.md) · [Full reference](./reference.md) · [Styles](./styles.md)
