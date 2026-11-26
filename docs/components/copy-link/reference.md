# CopyLink full reference

Reviewed against Chinese source SHA-256 `cedd16bce329c7a42b990a77bb867d70be0ca302bf4d203962fbca3714f9f915`.

<a id="copylink"></a>

# CopyLink

<a id="组件介绍"></a>

## Overview

Display a link address that users can open or copy: clicking its text opens the link, while clicking the rest of the surface copies the address.

<a id="使用选择"></a>

## When to use it

Use for share URLs, invitation links, and AI documentation entry points. CopyLink belongs to the link family alongside Link.

- Use Link for ordinary text navigation, CopyLink when the address must be copied, and Input when it must be edited.
- href is the complete address used for display, navigation, and copying. Long addresses are truncated only visually; copying retains the full value.
- Hovering text shows an underline; navigation opens a new tab by default. Clicking blank space or the trailing icon copies; CopyButton manages success feedback.

<a id="快速开始"></a>

## Quick start

```svelte
<script lang="ts">
  import { CopyLink } from '@snowui-design-system/components';
</script>

<CopyLink href="https://snowui.dev/llms.txt" />
```

<a id="api"></a>

## API

| Keyword | Type | Default | Description |
| --- | --- | --- | --- |
| href | `string` | Required | Address to display, navigate to, and copy. Pass a full URL when an absolute address must be copied. |
| target | `string` | `"_blank"` | Link opening target. |
| rel | `string` | `"noopener noreferrer"` | Link relation attribute. |
| disabled | `boolean` | `false` | Disables both navigation and copying. |
| parts | `ComponentPartsOf<{ Link: typeof Link; CopyButton: typeof CopyButton }>` | — | Configure public child Props such as Link.color / underline and CopyButton.ariaLabel / writeText / feedbackDuration. The parent owns the address, disabled state, and layout. |
| onCopy | `(text: string) => void` | — | Receives the complete address after a successful copy. |
| onCopyError | `(error: unknown) => void` | — | Callback when copying fails. |

Other compatible Props are inherited from Frame; class / style apply to the surface.

<a id="使用边界与详细说明"></a>

## Usage boundaries and details

- The default surface has no border or form hover transition and uses surface-2. Link defaults to Black100; its hover color stays the same and an underline appears.
- Link and CopyButton are sibling interactive elements. The text region navigates; the rest of the surface copies. Each gets a Tab stop; Enter opens, while Enter / Space copies.
- Reserve size-4 for the copy icon, with the built-in 12 CSS px floor, plus gap-2 with a 4 CSS px floor. At a 16px root font size the defaults remain a 16px icon and 8px gap. Long addresses use an ellipsis while navigation and copying retain the complete address.
- The copy button is bare and muted, with its icon centered on the right. CopyButton prevents repeated clicks during feedback.
- Does not participate in form submission or provide editing, validation, or an input role. No additional component package is needed.
- `--snowui-copy-link-padding-x-override` / `--snowui-copy-link-padding-y-override` / `--snowui-copy-link-radius-override` replace the default padding-4 / padding-3 / radius-4 respectively.

[Styles](./styles.md) · [Types](./types.md) · [API](./api.md)
