# Slider full reference

Reviewed against Chinese source SHA-256 `ed8a37f5f285a1740d5ba155208b57436df7e2687338d467892d3560d0475378`.

<a id="slider"></a>

# Slider

<a id="组件介绍"></a>

## Overview

Choose one number or a numeric interval by dragging. Supports horizontal and vertical tracks, steps, and filled display for range and parameter controls.

<a id="使用选择"></a>

## When to use it

Use Slider for continuous values or ranges. Use Segmented or Select for discrete options. Specify `minValue`, `maxValue`, `step`, and accessible names.

- `bind:value` uses a number for one thumb and an array for a two-thumb range. `minValue` and `maxValue` define the bounds.
- `step` controls increments and `ariaLabel` names the control. Explicit `Text as="label"` replaces the generated label.
- The default bar title in solid and soft variants follows LocaleProvider. Explicit titles, including an empty string, ariaLabel values, numeric values, and explicit labels remain unchanged. The title does not replace an accessible name.

<a id="快速开始"></a>

## Quick start

This example shows the recommended basic composition. See the sections below for more cases and composition limits.

```svelte
<script lang="ts">
	import { Slider, Text } from '@snowui-design-system/components';
</script>

<div style="width: 20rem; max-width: 100%; display: flex; flex-direction: column; gap: var(--gap-6);">
    <Slider value={69} variant="soft" title="Volume" showLabel ariaLabel="Volume" />
    <Slider value={88} variant="soft" title="Music" showLabel ariaLabel="Music volume" />
    <Slider value={75} variant="soft" title="Notifications" step={25} showSteps showLabel ariaLabel="Notification volume" />
</div>
```

<a id="api"></a>

## API

| Keyword | Type | Default | Description |
| --- | --- | --- | --- |
| value | `number \| number[]` | `0` | Current value; an array represents a two-thumb Range Slider. Supports `bind:value`. |
| minValue | `number` | `0` | Minimum value |
| maxValue | `number` | `100` | Maximum value |
| step | `number` | `1` | Step value |
| orientation | `SliderOrientation` | `"horizontal"` | Track orientation. |
| variant | `SliderVariant` | `"default"` | `solid` is a high-contrast bar style; `soft` is a theme adaptive low-contrast bar style using Black token |
| title | `string` | — | Left-side built-in title for solid and soft variants. When omitted, slider.title provides the localized title (“Text” in en-US). An explicit empty string hides it. This is not a label and does not replace ariaLabel. |
| showSteps | `boolean` | `false` | Use 1px transparent gaps to cut tracks and fillers according to the step. |
| showLabel | `boolean` | `false` | Whether to generate a built-in Text label that follows the drag block; the horizontal bar Range is combined into a range label, and other Ranges generate two |
| thickness | `number \| string` | — | Track thickness; control the overall height in the bar variant |
| background | `SnowUIColor \| string` | `"Black4"` | Track background color |
| color | `SnowUIColor \| string` | — | Fill bar color; explicit value transmission can overwrite the default value of the variant |
| thumbColor | `SnowUIColor \| string` | `"StaticWhite80"` | Drag the block color |
| disabled | `boolean` | `false` | Disable interaction. |
| name | `string` | — | Native form field name |
| ariaLabel | `string \| string[]` | — | Accessible name for a single value; a range can name its two thumbs separately. |
| oninput | `(event: Event) => void` | — | Called after pointer dragging or native input updates with the Event (PointerEvent for the pointer path). The value has already been normalized to bounds and steps. |
| onchange | `(event: Event) => void` | — | Called when pointer dragging ends or native change fires, with the corresponding Event. Read the bound value for the committed number. |
| children | `Snippet` | — | Explicit composition slot for one or two direct `Text as="label"` children, replacing generated labels. |
| parts | `ComponentPartsOf<{ Text: typeof Text }>` | — | Configure all generated Text instances, including the title and showLabel values; explicit labels remain independent. |

See the base component documentation for inherited capabilities not redeclared here. This table lists only named public Props declared by this component.

<a id="使用边界与详细说明"></a>

## Usage boundaries and details

<a id="布局模型"></a>

<a id="布局模型-1"></a>

### Layout model

Main layout model: **composite management layout**.

- Track, fill bar and drag block rule reuse Progress: default thickness 4px, track `Black4`, fill `Primary`, full rounded corners.
- The drag block is fixed to `20px × 14px`, and the default background is `Static White/80%`, including `0.5px` white Inside Stroke (inset shadow) and `blur(2px)` background blur; drop shadow keeps `0 1px 2px rgba(0, 0, 0, 0.4)` unchanged.
- A mouse normally hides the thumb; hover, `focus-visible`, or dragging reveals it. Touch devices always show it.
- Label adopts the default built-in mode and is not displayed by default; Text is automatically generated when `showLabel=true`, and the real-time value of the corresponding dragged block is displayed. Normal and vertical Range automatically generate two Texts; horizontal `solid` / `soft` Range generates a complete percentage range (such as `85%–100%`).
- Generated titles and labels use Text lines={1} with 12px / 16px typography by default. The same `parts.Text` key configures every generated Text instance. An explicit `<Text as="label">` preserves its own content and replaces the generated value label.
- The horizontal label is located above the drag block, and the vertical label is located on the left side of the drag block. The default spacing is 2px; the label is only displayed when hovering.
- With a two-thumb Range Slider, two direct `Text as="label"` children follow the start and end thumbs respectively.
- The solid and soft variants use the two 32px bar forms from Workshop 14458:37835: the horizontal host defaults to 32px high with an 8px radius, and the fill spans its full height with both ends rounded. title is the built-in left-side heading, defaulting to localized text (“Text” in en-US); it is not a label.
- `solid` is a high-contrast style: fill in the default `Primary`, use `Static White/100%` for the title, numerical label and indicator of the overlay area; use `Black/100%` for unoverwritten text.
- `soft` theme adaptive low contrast style: fill in the default `Black/10%`, title, numerical label and indicator are all based on `Black/100%`, which changes with the light/dark theme token.
- The right value of the two bar variants reuses the label protocol of other variants: the default is not displayed, and the real-time percentage is generated when `showLabel=true`, and continues to support `parts.Text` and explicit label. The value label normal is displayed by independent `opacity: 0.4`, and is raised to `opacity: 0.8` when hovering, focusing or dragging.
- Title and numerical label use the same width as Slider and the text background of the boundary binding `--snowui-slider-end` for cropping; the boundary can pass through a single glyph and move continuously with click and drag. `solid` switches to white in the coverage area; `soft` keeps `Black/100%` before and after the coverage.
- Horizontal bar titles and values receive separate single-line space, with `--gap-1` preferred and at least 4 CSS px between them. Titles can shrink and expose their complete text on hover; values prefer their natural width. Native range values, keyboard behavior, and form semantics remain intact. The 2px annotation gap for ordinary and vertical floating labels is unchanged.
- With separate text space, CSS inline-size container units keep the gradient canvas as wide as the complete Slider, instead of resizing it to each text region. Browsers without container units fall back to clear static text on the theme background, without per-glyph split coloring. This missing-capability path has not been tested in an older browser.
- In bar variants, the thumb becomes a draggable indicator 4px inside the fill’s right edge; at value 0 it stays within the track.
- `thickness` also controls the overall height of the bar variant; `default` is still 4px, and `solid` / `soft` defaults to 32px.
- `solid` / `soft` + `showSteps` uses fixed `Black/10%` 2px dots, only renders the internal scale, and does not display 0% / 100% endpoints; the dots do not respond to hover, and do not change the color with the filling coverage. The bar variant currently only defines the horizontal layout, and the vertical Slider continues to use the `default` visual.

<a id="关键字"></a>

<a id="关键字-1"></a>

### Keyword

`gap` follows Frame’s numeric scaling but controls the space between Slider’s label and thumb. The default remains component-specific.

<a id="示例"></a>

<a id="示例-1"></a>

### Give a demonstration

```svelte
<script lang="ts">
  let value = $state(12);
  let range = $state([3, 12]);
</script>

<Slider bind:value showLabel />

<Slider bind:value={range} showLabel ariaLabel={["Minimum", "Maximum"]} />

<div style="height: 120px;">
  <Slider orientation="vertical" bind:value />
</div>

<Slider value={60} step={10} showSteps />

<Slider value={60}>
  <Text as="label">60%</Text>
</Slider>

<Slider value={74} variant="solid" title="Text" showLabel />

<Slider value={0} step={25} showSteps showLabel variant="solid" />

<Slider value={0} variant="solid" title="Volume" thickness={40} showLabel />

<Slider value={74} variant="soft" title="Text" showLabel />
```

---

[Styles](./styles.md) · [Types](./types.md) · [API](./api.md)
