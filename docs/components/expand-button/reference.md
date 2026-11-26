# ExpandButton full reference

Reviewed against Chinese source SHA-256 `bcde6b60b0832c62947b714995411f3828b03f6def46ec257cb3bf1d97234a3b`.

<a id="expandbutton"></a>

# ExpandButton

<a id="组件介绍"></a>

## Overview

Switch between expanded and collapsed states with consistent button feedback, suitable for collapsible content and detail entry points.

<a id="使用选择"></a>

## When to use it

Use to expand or restore content. If a host such as CodeBlock already provides this action, configure the host to avoid two competing expansion states.

- Receive state through `bind:expanded` or onExpandedChange; defaultExpanded supplies the initial value.
- The component provides only the expand action. It does not create or control a content panel; connect its state to the actual content in the page.

<a id="快速开始"></a>

## Quick start

This example shows the recommended basic composition. See the sections below for more cases and composition limits.

```svelte
<script lang="ts">
	import { ExpandButton } from '@snowui-design-system/components';
</script>

<ExpandButton />
```

<a id="api"></a>

## API

| Keyword | Type | Default | Description |
| --- | --- | --- | --- |
| expanded | `boolean` | — | Current expanded state; supports bind:expanded. Uses defaultExpanded when undefined. Clicking writes the next boolean value; the caller shows or hides the content region. |
| defaultExpanded | `boolean` | `false` | Fallback state when expanded is undefined. After the first click, the component-written expanded value takes over. |
| ariaLabel | `string` | `LocaleProvider` | Accessible name for the button when collapsed; describe the action it will perform. By default, LocaleProvider supplies “Expand” for English and the corresponding localized label for Chinese. |
| collapseAriaLabel | `string` | `LocaleProvider` | Accessible name for the button when expanded; describe the collapse action. By default, LocaleProvider supplies “Collapse” for English and the corresponding localized label for Chinese. |
| icon | `Snippet` | `—（arrows-out-simple）` | Custom icon in the collapsed state. Only the graphic changes; the component still manages expanded state and aria-expanded. |
| collapseIcon | `Snippet` | `—（arrows-in-simple）` | Custom icon in the expanded state; replaces content using the component's existing transition. |
| children | `Snippet` | — | Custom content after the icon. Without it, Button.iconOnly is enabled. The component does not create or control an expanded panel. |
| onExpandedChange | `(expanded: boolean) => void` | — | Receives the new state after a click, before onclick. External assignments do not call this callback. |
| onclick | `(event: MouseEvent) => void` | — | Called after the state write and onExpandedChange. It cannot cancel a completed toggle; it is not called when disabled. |

See the base component documentation for inherited capabilities not redeclared here. This table lists only named public Props declared by this component.

<a id="使用边界与详细说明"></a>

## Usage boundaries and details

<a id="使用"></a>

<a id="使用-1"></a>

### Usage

```svelte
<script lang="ts">
  import { ExpandButton } from "@snowui-design-system/components";
  let expanded = $state(false);
</script>

<ExpandButton bind:expanded bare />
```

- `expanded` / `defaultExpanded`: controlled value and default value.
- `onExpandedChange`: callback for value changes.
- `icon` / `collapseIcon`: replace the default expand and collapse icons.
- `ariaLabel` / `collapseAriaLabel`: accessible labels for the two states.
- Default icons are `arrows-out-simple` / `arrows-in-simple`. Content replacement uses the lightweight state button's 150ms replacement-appear transition.

<a id="api-1"></a>

### API

See [Button](../button/reference.md) for other compatible visual, link, and event options. ExpandButton owns children, onclick, and aria-expanded; inherited disabled prevents user toggles.

---

[Styles](./styles.md) · [Types](./types.md) · [API](./api.md)
