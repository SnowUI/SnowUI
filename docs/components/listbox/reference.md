# Listbox full reference

Reviewed against Chinese source SHA-256 `c0611dd01e9be93e59ed1b7172865c649cd4f14c5ce567347574b8c11015873d`.

<a id="listbox"></a>

# Listbox

<a id="组件介绍"></a>

## Overview

Display selectable options in a floating panel, with optional search filtering and keyboard navigation. Select can use it as its option panel.

<a id="使用选择"></a>

## When to use it

Use it for option selection with keyboard navigation and selection semantics, usually inside Select. Use a content list for notifications, contacts, or activity feeds.

- Each item needs a unique `value`; `label` supplies display and search text. Explicit `children` replace generated `items`.
- Use `MenuItem as="item"` for explicit options. For a custom search field, use `Input as="search"` with `search={false}` to avoid a duplicate built-in field.
- The generated search placeholder follows LocaleProvider through listbox.search. Explicit parts.Input.placeholder values, including an empty string, and native aria-label values retain priority. Configure explicit Input children yourself; query text and option content are not translated.

<a id="快速开始"></a>

## Quick start

This example shows the recommended basic composition. See the sections below for more cases and composition limits.

```svelte
<script lang="ts">
	import { Listbox, Select, Text } from '@snowui-design-system/components';
	const pages = ['Accordion', 'Avatar', 'Badge', 'Breadcrumb', 'Button', 'Card', 'Checkbox', 'Chip', 'Dialog', 'Field', 'Input', 'Listbox', 'MenuItem', 'Popover', 'Select', 'Tooltip'].map(label => ({ value: label, label }));
	let page = $state('Button');
</script>

<div style="display: flex; flex-direction: column; gap: var(--gap-4); width: min(100%, 22rem); min-width: 0;">
<Select bind:value={page} ariaLabel="Component documentation" style="width: 100%;">
    <Listbox search items={pages} parts={{ Input: { placeholder: 'Find a component…', 'aria-label': 'Find a component' } }} />
</Select>
</div>
```

<a id="api"></a>

## API

| Keyword | Type | Default | Description |
| --- | --- | --- | --- |
| children | `Snippet` | — | Parameterless explicit option content. When present, `items` are not generated. Use `MenuItem as="item"` with a unique `value`. A custom search field uses `Input as="search"` and `search={false}`. |
| items | `ListboxItem[]` | `[]` | Built-in options, each with a required unique string `value`, a display/search `label`, and optional `disabled`. Ignored when explicit children are supplied; hosts manage dynamic custom options separately. |
| parts | `ComponentPartsOf<{ Input: typeof Input; MenuItem: typeof MenuItem; Text: typeof Text; }>` | — | Configure public Props of generated Input, MenuItem and string-label Text instances, including search placeholders, custom values, check marks and label typography. parts.Text only applies to generated items and custom-option labels; configure explicit children directly. parts.MenuItem.showCheck takes priority over the Listbox showCheck default. |
| search | `boolean` | — | Whether to generate a search Input fixed above the options. Explicit setting takes precedence over host configuration, then defaults to `true`. Select passes `false` by default; enable it when needed. |
| maxHeight | `number \| string` | — | Maximum panel height as CSS px or a CSS length, constrained by available viewport space. By default, show up to ten whole items and retain at least the first two existing items when space is tight. |
| minWidth | `number \| string` | — | Minimum panel width as CSS px or a CSS length. Defaults to 160px when search is enabled, otherwise 0; content and viewport constraints still apply. |
| scrollbar | `boolean` | `true` | Show the overlay scrollbar on overflow. `false` hides its track but wheel and keyboard scrolling still work. |
| matchTriggerWidth | `boolean` | `true` | When `true`, use the measured anchor width plus 2px, extending 1px past each side of its border; content may widen the panel further. When `false`, hug option content without compensation, subject to `minWidth` and viewport limits. |
| placementMode | `"selected" \| "bottom"` | `"selected"` | `selected` centers the selected item on the trigger; `bottom` opens below it. Viewport limits determine the final position and height. |
| align | `"start" \| "center" \| "end"` | `"start"` | Align the panel to the anchor's left edge, horizontal center, or right edge. Differences are visible when a Hug panel and anchor have different widths; final placement remains constrained by the viewport. |
| showCheck | `boolean` | `false` | Prepend a selected-item check and show it at the trailing edge. Select enables this by default. Explicit MenuItems can override `showCheck` or provide custom trailing content. |
| continuousHover | `boolean` | `true` | Move one shared highlight between direct MenuItems; the keyboard-active item uses the same layer. `false` restores each item’s immediate background. Disabled and filtered items are skipped. |

See the base component documentation for inherited capabilities not redeclared here. This table lists only named public Props declared by this component.

<a id="使用边界与详细说明"></a>

## Usage boundaries and details

<a id="默认内置模式-显式组合模式"></a>

<a id="默认内置模式-显式组合模式-1"></a>

### Default built-in mode / explicit combination mode

- Default built-in mode (recommended): `items` automatically generates `<MenuItem as="item">`; setting `search` can generate a fixed search box. When `maxHeight` is not set, the height of the panel is calculated according to the height of the actual visible MenuItem: by default, up to 10 items are displayed completely, and the floating layer scroll bar is displayed after exceeding it; the built-in components are configured through `parts.Input` / `parts.MenuItem`.
- Explicit combination mode: explicitly write MenuItem, which is used for complex content or item-by-item Props differences; items are no longer generated when children exist.

Select supplies search=false by default. In generated mode, search enables the header input, search={false} hides it, maxHeight sets an explicit maximum height, and scrollbar={false} hides only the track. The default search placeholder follows locale through listbox.search (Search in en-US); parts.Input.placeholder, including an empty string, takes priority. With search, the default minimum panel width is 160px. Explicit composition can also use generated search; use search={false} and write your own <Input as="search"> to supply it yourself. maxHeight and scrollbar remain panel capabilities in both modes.

Without `maxHeight`, viewport space changes the number of completely visible items, from two to ten, without clipping half an item. If fewer than two options exist, the panel hugs their actual height. An explicit `maxHeight` is still constrained by viewport height.

**2026-04-24 (v1.2.0)**: Scrollbar spacing was standardized. `.snowui-listbox` hides the native scrollbar while retaining scrolling; `.snowui-listbox-body` shows the custom overlay thumb. MenuItem backgrounds have 8px horizontal inset. The thumb overlays the right side without consuming layout width and sits 4px from the panel border. With search, it appears only beside the option scroll area, below Input. The thumb supports dragging, and selected-item positioning uses the portal’s actual visual center even without a header Input.

**2026-04-20**: Search and custom values were added. `<Input as="search">` participates in filtering when placed in Listbox. `allowCustomValue` adds custom items with hover deletion. The old Combobox dependency was removed and `Combobox.svelte` retired.

**Automatic layout protocol**: The outer portal anchor supplies fixed positioning and size; an inner `Frame column` renders the floating panel with shared `.snowui-quick-action-panel` visuals. The `DROPDOWN_OVERLAY_APPEAR_MOTION` and `DROPDOWN_OVERLAY_DISAPPEAR_MOTION` presets animate opacity only; duration and easing come from the motion catalog. The panel remains mounted until exit motion finishes. Through `LISTBOX_HEADER_PORTAL_KEY`, the portal exposes `headerEl`; after mounting, `Input as="search"` moves into the fixed header, outside the option scroller. Listbox and QuickAction share header and scroll-body structure; only outer padding differs. Listbox sets root `gap: 0` to avoid Frame column’s default 8px gap. MenuItems scroll inside `.snowui-listbox-body.snowui-quick-action-panel-scroll-body > .snowui-listbox`; the custom scrollbar belongs to the body and never covers Input. Panel padding separates Input and the list, the shared header rule connects them, and MenuItem padding spaces option content. The overlay scrollbar is 4px wide, 4px from the right border, and grows to 8px toward the left on hover.

---

<a id="布局模型"></a>

<a id="布局模型-1"></a>

### Layout model

Main layout model: composite management layout.

- Listbox contains a portal anchor, panel, header, scroll body, option list, and overlay scrollbar.
- Header and scrolling body reuse the panel area specification of QuickAction; the option line gives priority to the slot host layout of `MenuItem`.
- `Input as="search"` is only moved as a fixed header content, and does not participate in the scrolling list layout.
- Generated items and runtime custom-option labels use Text lines=1 by default. Long labels shrink within viewport constraints and retain full-text access, keeping check/delete attachments inside the visible panel. The inner panel respects its outer width constraint; short labels retain content-based Hug width.
- Text only owns typography and full-text access for default string labels. The original owner contract still controls selection, search, registration, keyboard and focus. Explicit MenuItem or Snippet content is not wrapped automatically and does not consume parent parts.Text.
- Listbox is not a three-slot host. Portal placement, scrollbar, and search layout remain private composition logic.

<a id="架构"></a>

<a id="与宿主的关系"></a>

### Relationship with the host

| Host | Context provider | Communication mode |
| --- | --- | --- |
| Select | Select through `setContext(LISTBOX_OWNER_CONTEXT_KEY, ...) ` | `ListboxOwnerContext` |

---

<a id="组件-props"></a>

<a id="组件-props-1"></a>

### Component Props

Inherits [FrameProps](../frame/reference.md) except `children` and `tag`. Place Listbox within a host that provides selection context, such as Select. The host owns expansion, current value, and selection events. Listbox has no standalone `open`, `value`, `options`, `multiple`, or `placement` Props.

Equal-width mode uses the measured anchor width plus 2px, extending 1px past each side to cover the lower field border while preserving fractional positioning. This fixed CSS px compensation does not scale with root font size and applies to every Listbox host. Content-sized mode adds no compensation, but `minWidth` and content may still enlarge the panel. See USER-LISTBOX-WIDTH-001 in StyleSpec §2.1 (`docs/standards/StyleSpec.md`).

<a id="宿主协议"></a>

<a id="键盘交互"></a>

### Keyboard interaction

| Key | Behavior |
| --- | --- |
| `↑` / `↓` | Move highlight up or down, including custom items |
| `Enter` / `Space` (option list) | Select the highlighted option and close |
| `Enter` (search box no match + `allowCustomValue`) | Add current input as a custom option and select it |
| `Escape` | Close from the search header or option list and return focus to the trigger, even with no matching options. The caller may cancel with preventDefault(). |
| `Tab` | Close from the search header or option list while preserving native focus navigation. The caller may cancel with preventDefault(). |
| Space, Home / End (search field) | Keep native text editing; do not select options. |

---

<a id="aria"></a>

<a id="aria-1"></a>

### ARIA

| Element | Attribute |
| --- | --- |
| Floating container | `role="listbox"`, `aria-labelledby={triggerId}` |
| Each option | `role="option"`, `aria-selected` |
| Highlight | `data-highlighted="true"` |

---

<a id="使用示例"></a>

<a id="默认内置模式推荐"></a>

### Default built-in mode (recommended)

```svelte
<Select placeholder="Choose a framework">
  <Listbox
    search
    items={[
      { value: "svelte", label: "Svelte" },
      { value: "react", label: "React" },
      { value: "vue", label: "Vue" }
    ]}
    parts={{ Input: { placeholder: "Search frameworks..." } }}
  />
</Select>
```

<a id="基础用法在-select-中"></a>

### Basic usage (in Select)

```svelte
<script lang="ts">
  import { Select, Listbox, MenuItem } from '@snowui-design-system/components';
  let country = $state('us');
</script>

<Select bind:value={country} name="country">
  <Listbox>
    <MenuItem as="item" value="us">United States</MenuItem>
    <MenuItem as="item" value="cn">China</MenuItem>
    <MenuItem as="item" value="jp">Japan</MenuItem>
  </Listbox>
</Select>
```

<a id="带搜索过滤"></a>

### With search and filtering

```svelte
<Select placeholder="Choose a city">
  <Listbox search={false}>
    <Input as="search" placeholder="Search..." />
    <MenuItem as="item" value="beijing">Beijing</MenuItem>
    <MenuItem as="item" value="shanghai">Shanghai</MenuItem>
    <MenuItem as="item" value="hangzhou">Hangzhou</MenuItem>
  </Listbox>
</Select>
```

<a id="搜索-允许自定义输入"></a>

### Search + Allow custom input

```svelte
<Select placeholder="Choose or enter">
  <Listbox search={false}>
    <Input as="search" allowCustomValue placeholder="Search or enter a new option..." />
    <MenuItem as="item" value="tag-a">Tag A</MenuItem>
    <MenuItem as="item" value="tag-b">Tag B</MenuItem>
  </Listbox>
</Select>
```

---

- The Listbox panel is visually aligned with QuickAction, but the outer padding remains 8px.
- The search box is fixed in the header; the option scrolling area carries the overlay scrollbar separately.

<a id="连续-hover"></a>

<a id="连续-hover-1"></a>

### Continuous hover

`continuousHover` defaults to `true`. One container-level background moves between enabled MenuItems, and the keyboard-active item uses it too. The active item keeps its persistent background, so hovering it stacks both layers. Set `false` for each item’s immediate hover background. Disabled and filtered options are not targeted.

[Styles](./styles.md) · [Types](./types.md) · [API](./api.md)
