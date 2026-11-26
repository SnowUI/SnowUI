# BlurText full reference

Reviewed against Chinese source SHA-256 `7187c74d27e21bcf1dc5eda327a44ba8a7c05221b5e831ae748673b4516b89fd`.

<a id="blurtext"></a>

# BlurText

<a id="组件介绍"></a>

## Overview

Reveal headings and short paragraphs one character at a time through sharpening, fade-in, and slight upward movement while preserving natural wrapping, font size, line height, and text baseline.

<a id="使用选择"></a>

## When to use it

Use Text for static content, BlurText for a blurred reveal, SlotText or FlowText for vertically changing text, and ScrambleText for character scrambling. BlurText accepts plain text, not a rich-text subtree, and does not interpret number or timer semantics. Prefer static Text for long prose to avoid the paint cost of per-character filters.

<a id="快速开始"></a>

## Quick start

```svelte
<script lang="ts">
  import { BlurText } from '@snowui-design-system/components';
</script>

<BlurText text="Let inspiration come into focus." size="--text-32" lineHeight="--leading-32" />
```

Typography Props inherit from the parent when omitted. You can also use `class="text-32"` directly without wrapping Text. A numeric `size` is in px; numeric `lineHeight` is a unitless multiplier. Use a Token or `"40px"` for a fixed line height.

<a id="api"></a>

## API

| Keyword | Type | Default | Description |
| --- | --- | --- | --- |
| text | `string \| number` | `""` | Final plain text, preserving spaces and line breaks |
| speed | `number` | `1.5` | Finite positive character start rate. Stagger is 30ms / speed; each character lasts 600ms. Invalid values fall back to 1.5. |
| animated | `boolean` | `true` | When turned off, immediately shows final text and clears internal animations |
| playOnMount | `boolean` | `true` | Animates on first mount after the visibility gate permits it |
| replayKey | `string \| number` | `0` | Replays the full current text when this value changes |
| respectMotionPreference | `boolean` | `true` | Honors the system reduced-motion setting; enabling it mid-animation also completes immediately |
| font | `string` | — | Font family or font Token |
| size | `string \| number` | — | Font size or font-size Token |
| weight | `string \| number` | — | Font weight |
| lineHeight | `string \| number` | — | Line-height Token, CSS length, or unitless multiplier |
| color | `SnowUIColor \| string` | — | Final text color; supports PascalCase semantic colors |
| align | `TextMotionAlign` | — | Text alignment; inherited by default |
| motionColor | `TextMotionColor` | — | Optional temporary per-character color, including `chromatic()`; returns to final color afterward |

Inherits applicable FrameProps. `tag` defaults to `span`; `as` still denotes the parent component role. Internal animation is layered separately from the root Frame’s `while*` motions; `enableDefaultMotion={false}` disables only the root default motion. Public `speed` changes character stagger in line with the reference site’s `speedReveal`; each character still lasts 600ms. There are no public duration, stagger, blur, or displacement parameters. A speed change applies on the next text update or replay, without restarting the current animation. Temporary-color timing scales with reveal speed; the return fade remains the shared 280ms.

<a id="使用边界与详细说明"></a>

## Usage boundaries and details

<a id="行为与无障碍"></a>

### Behavior and accessibility

- Initial playback and `replayKey` changes reveal the full text; a `text` update commits the latest content immediately and reveals it. During rapid updates, same-position characters still animating continue from their visible blur, opacity, and displacement. Old callbacks cannot replace new content. No numeric wheel or old-text exit animation runs.
- SSR and pages without JavaScript output the full text. With reduced motion or without the Web Animations API, content stays static and readable. All internal Animations are removed after completion.
- The root supplies a stable `aria-label` for the final text; the per-character visual layer is `aria-hidden`. Use `tag="h2"` or another semantic heading tag when appropriate. The default `span` uses an `img` role to expose the full text without reading each character separately.
- The browser’s inline layout determines wrapping. Chinese characters, English words, spaces, and explicit line breaks are not simulated with fixed per-character widths or extra margins. The browser also handles final font shaping, including ligatures.

<a id="参考来源"></a>

### Reference sources

- In the Svelte Animations reference project, the Blur Reveal example is at `src/lib/components/spell/blur-reveal/blur-reveal.svelte`. This path is relative to that project and is not included in the SnowUI component package or source archive.
- Original example: [Svelte Animations · Blur Reveal](https://sv-animations.vercel.app/spell/blur-reveal).
- Reference site: [Text Motion Observatory · References](https://text-motion-observatory.farewelltowind.chatgpt.site/references) (ChatGPT sign-in required; this supplementary reference is not required to use the component).

The reference project is used to inspect the blur-reveal motion; the reference site provides additional examples. The reference project is neither built into SnowUI nor required at runtime.

[Styles](./styles.md) · [Types](./types.md) · [API](./api.md)
