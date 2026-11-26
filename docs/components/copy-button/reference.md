# CopyButton full reference

Reviewed against Chinese source SHA-256 `2dfca59eaaa67846cbcb1f20397efd1ff61bf16ba96c3d0a2c2eea94cbcfdc35`.

<a id="copybutton"></a>

# CopyButton

<a id="组件介绍"></a>

## Overview

Copy text or code to the clipboard with brief success feedback. Suitable for links, identifiers, and install commands.

<a id="使用选择"></a>

## When to use it

Use it to copy content and show copy feedback. Reuse its public `getText` and `writeText` hooks instead of maintaining duplicate success state in a page.

- Use `text` for static content and `getText` for dynamic content. `writeText` can replace the actual clipboard operation.
- Handle application feedback through `onCopy` and `onCopyError`. `showText={false}` hides the label; `feedbackDuration` controls how long success feedback lasts.

<a id="快速开始"></a>

## Quick start

This example shows the recommended basic composition. See the sections below for more cases and composition limits.

```svelte
<script lang="ts">
	import { CopyButton } from '@snowui-design-system/components';
</script>

<CopyButton text="pnpm add @snowui-design-system/components">Copy</CopyButton>
```

<a id="api"></a>

## API

| Keyword | Type | Default | Description |
| --- | --- | --- | --- |
| text | `string` | — | Static text to copy. A supplied `getText` takes precedence; if neither is supplied, an empty string is copied. |
| getText | `() => string \| Promise<string>` | — | Reads content on click and may return a Promise. Takes precedence over `text`. Evaluation and clipboard writing both occur while pending; failures call `onCopyError`. |
| writeText | `(text: string) => void \| Promise<void>` | `writeClipboardText` | Replaces the clipboard write operation. A resolved Promise shows success; a thrown error shows failure. Use this for an existing application copy callback to avoid writing twice. By default, CopyButton writes to the clipboard. |
| feedbackDuration | `number` | `1600` | Time before returning to idle after success or failure, in ms; negative values become 0. Repeated clicks are ignored while pending and during feedback. |
| showText | `boolean` | `true` | Shows `children` or the default copy label after the icon. The default follows LocaleProvider and is “Copy” in English. `false` shows only the state icon. Bare mode has no shell; other modes enable `Button.iconOnly`. |
| ariaLabel | `string` | — | Overrides the accessible name. Icon-only mode defaults to the LocaleProvider status label: “Copied” or “Copy” in English. Text mode is named by its content by default. |
| disabled | `boolean` | `false` | Prevents new copy operations; an asynchronous copy already in progress is not canceled. |
| children | `Snippet` | `— (Copy)` | When `showText=true`, replaces the label after the icon and remains visible on success. Ignored when `showText=false`. |
| icon | `Snippet` | `— (Copy icon)` | Replaces the icon outside the success state; pending and error also use it. |
| successIcon | `Snippet` | `— (Check icon)` | Icon content shown on success. Takes precedence over `successContent` and is displayed through the internal state-content replacement. |
| successContent | `Snippet` | — | Alternative content in the success-icon area, used only when `successIcon` is absent. It does not replace the button label. |
| onCopy | `(text: string) => void` | — | Receives the text actually copied after a successful clipboard write, when the component has entered success state. |
| onCopyError | `(error: unknown) => void` | — | Receives an error when dynamic content retrieval or clipboard writing fails. The component enters error state until the feedback period resets. |
| onclick | `(event: MouseEvent) => void` | — | Called before reading text and copying, only while idle and enabled. `preventDefault()` does not cancel copying; it is not called during feedback. |

See the base component documentation for inherited capabilities not redeclared here. This table lists only named public Props declared by this component.

<a id="使用边界与详细说明"></a>

## Usage boundaries and details

<a id="使用"></a>

<a id="使用-1"></a>

### Usage

```svelte
<script lang="ts">
  import { CopyButton } from "@snowui-design-system/components";
</script>

<CopyButton text="SnowUI" variant="outline" />
```

CopyButton accepts the compatible Button Props as flat Props. `text` supplies static content; `getText` supplies synchronous or asynchronous dynamic content. Success calls `onCopy`; failure calls `onCopyError`. From copy start through the end of feedback, non-idle state ignores repeated clicks. It does not set `disabled` or alter the button’s appearance; it suppresses Button click feedback and ignores subsequent clicks. Feedback resets after `feedbackDuration`. It exposes no parts.

`showText={false}` enables icon-only mode, showing just Copy or Check and supplying an `aria-label` for the copy state. The icon changes with the internal Frame’s 150ms replacement-appear motion: Check on success, then Copy after feedback ends. The Button itself does not enter an Active or toggle appearance. In text mode, the label remains the current LocaleProvider copy label; only the icon runs the replacement motion.

<a id="api-1"></a>

### API

For other compatible visual, link, and event Props, see [Button](../button/reference.md). CopyButton owns `children`, `onclick`, `disabled`, `currentState`, `stateContent`, `whileActive`, `Click`, and `Active`; these host fields cannot stand in for copy state.

---

<a id="提交与反馈"></a>

### Submission and feedback

With `skeleton={false}`, asynchronous copying uses the built-in Button Spinner and blocks repeated clicks until completion or failure.

[Styles](./styles.md) · [Types](./types.md) · [API](./api.md)
