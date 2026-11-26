# ScrambleText full reference

Reviewed against Chinese source SHA-256 `624039244ce11a9b80fcc90d1bb7a2048c498ec1bc5feaac1954d066de6d4b97`.

<a id="scrambletext"></a>

# ScrambleText

<a id="组件介绍"></a>

## Overview

Reveal target text through a sequence of changing characters, suitable for headings, short phrases, and status labels.

<a id="使用选择"></a>

## When to use it

Use it for a character-scramble effect when text changes. Use Text for static copy and FlowText for continuous text movement. Keep the final text readable when reduced motion is preferred.

- `text` supplies the target text; `mode`, `charset`, and `customSequence` control how characters change.
- Enable `respectMotionPreference` to honor the system reduced-motion setting. Important information should always be conveyed by the final readable text.

<a id="快速开始"></a>

## Quick start

This example shows the recommended basic composition. See the sections below for more cases and composition limits.

```svelte
<script lang="ts">
	import { Button, Text } from '@snowui-design-system/components';
	import { ScrambleText, chromatic } from '@snowui-design-system/components';
	const statuses = ['Preparing docs', 'Checking APIs', 'Ready to publish'];
	let statusIndex = $state(0);
</script>

<div style="display: flex; flex-direction: column; align-items: center; gap: var(--gap-4);">
	<ScrambleText text={statuses[statusIndex]} mode="cascade" charset="glyphs" motionColor={chromatic()} size="--text-32" lineHeight="--leading-32" weight={600} />
	<Button onclick={() => statusIndex = (statusIndex + 1) % statuses.length}>Update status</Button>
</div>
```

<a id="api"></a>

## API

| Keyword | Type | Default | Description |
| --- | --- | --- | --- |
| text | `string \| number` | `""` | Final text |
| charset | `ScrambleTextCharset` | `"glyphs"` | Preset replacement character set |
| customSequence | `string` | — | Custom replacement sequence, up to 64 graphemes |
| mode | `ScrambleTextMode` | `"cascade"` | Discrete animation mode |
| respectMotionPreference | `boolean` | `false` | Honors the system reduced-motion setting only when explicitly enabled |
| font | `string` | — | Font family |
| size | `string \| number` | — | Font size |
| weight | `string \| number` | — | Font weight |
| color | `SnowUIColor \| string` | — | Final text color |
| lineHeight | `string \| number` | — | Line height |
| align | `TextMotionAlign` | — | Alignment; inherits from the parent by default |
| motionColor | `TextMotionColor` | — | Temporary color as target characters settle from left to right. Accepts a semantic color, CSS color, or per-character resolver; the default leaves colors unchanged. |

Host inheritance: Inherits `tag` (default `"span"`), `class`, `style`, and shared state/motion capabilities from [Frame](../frame/reference.md); this table lists only the component’s own named public props.

<a id="使用边界与详细说明"></a>

## Usage boundaries and details

<a id="关键字"></a>

<a id="关键字-1"></a>

### Keyword

```svelte
<script lang="ts">
    import { ScrambleText, chromatic } from "@snowui-design-system/components";
</script>

<ScrambleText
    text="DEPLOY READY"
    charset="glyphs"
    font="--font-mono"
    size="--text-24"
    weight={600}
    color="Primary"
    motionColor={chromatic()}
/>
```

---

<a id="实现约束"></a>

[Styles](./styles.md) · [Types](./types.md) · [API](./api.md)
