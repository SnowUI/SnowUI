# SearchBox full reference

Reviewed against Chinese source SHA-256 `0cadc87c3e9bc488ea809fcec17e8d607fbb3ff63ee05e4ff7426c66f9c0533e`.

<a id="searchbox"></a>

# SearchBox

<a id="组件介绍"></a>

## Overview

A fully clickable control that opens a search popup. It can include a keyboard shortcut hint and suits global search.

<a id="使用选择"></a>

## When to use it

Use it as a clickable entry to open a global search popup, not as an input for editing a query. Use SearchInput when users should type directly in a toolbar or list.

- This is a clickable search entry. `bind:open` synchronizes popup state; `value` displays the current query.
- Compose a popup or shortcut hint with `children`. Use SearchInput when the query must be editable directly.
- The default placeholder and clear action follow LocaleProvider. Explicit placeholder values, including an empty string, and aria-label take priority; the query remains unchanged.

<a id="快速开始"></a>

## Quick start

This example shows the recommended basic composition. See the sections below for more cases and composition limits.

```svelte
<script lang="ts">
	import { SearchBox } from '@snowui-design-system/components';
	import { Kbd, Popover, SearchInput, MenuItem, Icon, Avatar } from '@snowui-design-system/components';
	import { MagnifyingGlass, AvatarByewind } from '@snowui-design-system/resource-svelte';
</script>

<Popover template id="search-box-usage-popup" size="md" closeOnSelect={false} style="width: 20rem;">
    <SearchInput placeholder="Search" />
    <MenuItem value="overview" closeOnSelect={true}>
        <Icon as="leading"><MagnifyingGlass /></Icon>
        Search history: Overview
    </MenuItem>
    <MenuItem value="contact-byewind" closeOnSelect={true}>
        <Avatar src={AvatarByewind} size={24} as="leading" />
        Contact: Byewind
    </MenuItem>
</Popover>

<SearchBox data-popover-target="search-box-usage-popup" style="width: 10rem;" placeholder="Search">
    <Kbd as="trailing" variant="solid" style="background-color: var(--surface-3);">⌘K</Kbd>
</SearchBox>
```

<a id="api"></a>

## API

| Keyword | Type | Default | Description |
| --- | --- | --- | --- |
| parts | `ComponentPartsOf<{ Button: typeof Button }>` | — | Configures the internally generated clear Button. Explicit child content does not consume this default. |
| variant | `"gray" \| "outline"` | `"gray"` | Search control style |
| gap | `number` | — | Inherited Frame gap token index. Omit it to retain the preferred component gap; explicit values override that preference. Effective graphics/text spacing remains at least 4 CSS px, including zero, root-font scaling and gap scaling. |
| value | `string \| number` | — | Current query text or displayed value |
| placeholder | `string` | — | Placeholder text. When omitted, searchBox.placeholder provides the localized placeholder (“Search” in en-US). An explicit empty string is preserved. |
| open | `boolean` | `false` | Popup open state; supports `bind:open` |
| disabled | `boolean` | `false` | Disables the trigger |
| readonly | `boolean` | `false` | Read-only trigger; does not open the popup |
| showSearchIcon | `boolean` | `true` | Whether to render the default search icon |
| collapseBelow | `number` | — | When the component’s own width is at or below this px threshold, retains only the leading search icon. Disabled when omitted. |
| clearable | `boolean` | `true` | Whether to show the clear button when a value is present |
| children | `Snippet` | — | External leading or trailing content, such as `Kbd` |
| onOpenChange | `(open: boolean) => void` | — | Callback when open state changes |
| onClear | `() => void` | — | Clear callback |
| onclick | `(event: MouseEvent) => void` | — | Called after entry click with the original MouseEvent. When enabled and not read-only, the component opens the search popup first; the callback cannot undo that opening. |
| onkeydown | `(event: KeyboardEvent) => void` | — | Called after handling Escape to close or Enter/Space to open, with the original KeyboardEvent. It cannot undo the state change already made. |

See the base component documentation for inherited capabilities not redeclared here. This table lists only named public Props declared by this component.

<a id="使用边界与详细说明"></a>

## Usage boundaries and details

<a id="功能概览"></a>

<a id="功能概览-1"></a>

### Feature overview

- Two styles: `gray` and `outline`
- The default leading icon is `Search`
- The consumer supplies an external `Kbd` through trailing `children`; it is not included by default.
- With a value, a clear X appears using visual rules from `Input`.
- Click anywhere on the trigger to open the popup.
- `collapseBelow` retains only the leading search icon when the component itself becomes narrow. Minimum width is its actual left/right padding plus the intrinsic width of the leading Icon.
- No outer focus ring is shown. Visual state is consistent after mouse clicks and keyboard operations such as Escape.

---

<a id="api-参考"></a>

<a id="使用示例"></a>

### Usage examples

```svelte
<SearchBox placeholder="Search">
  <Kbd as="trailing" variant="solid" style="background-color: var(--surface-3);">/</Kbd>
</SearchBox>
```

```svelte

<SearchBox collapseBelow={80} placeholder="Search" />
```

```svelte
<script lang="ts">
  import { Kbd } from '@snowui-design-system/components';
  import { SearchBox } from '@snowui-design-system/components';
  let open = $state(false);
</script>

<SearchBox variant="outline" bind:open>
  <Kbd as="trailing" variant="solid" style="background-color: var(--surface-3);">⌘K</Kbd>
</SearchBox>
```

---

<a id="2026-11-13-行为同步"></a>

### Behavior updates (2026-11-13)

Default search icons use an opaque theme color with opacity 0.2 at rest and 0.4 on hover or when a value is present. Color overrides should be opaque to avoid multiplying alpha. Dimming applies to the icon, not the whole input.

[Styles](./styles.md) · [Types](./types.md) · [API](./api.md)
