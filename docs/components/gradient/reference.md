# Gradient full reference

Reviewed against Chinese source SHA-256 `a6e8f0237ff20eb565d123e0dee0103e7e25a1e216ad13c137374f50242d2e31`.

<a id="gradient"></a>

# Gradient

<a id="组件介绍"></a>

## Overview

Enrich backgrounds and placeholder art with soft layered gradients, six palettes, and scalable deformation.

<a id="使用选择"></a>

## When to use it

Use Gradient for its built-in decorative artwork or an Avatar fallback. Its artistic palette is not a general UI theme color; page surfaces and text use semantic tokens.

- `size` sets width and height together and takes priority over `width` and `height`. A stable `seed` keeps an identity’s artwork consistent.
- Keep `decorative` for artwork. Its palette belongs to the graphic; page text and surfaces continue to use semantic tokens.

<a id="快速开始"></a>

## Quick start

This example shows the recommended basic composition. See the sections below for more cases and composition limits.

```svelte
<script lang="ts">
	import { Gradient } from '@snowui-design-system/components';
</script>

<div style="display: flex; flex-wrap: wrap; justify-content: center; gap: var(--gap-4) var(--gap-3); max-width: 100%;">
    <Gradient variant="blue" size={80} radius="50%" aria-label="Blue gradient" />
    <Gradient variant="cyan" size={80} radius="50%" aria-label="Cyan gradient" />
    <Gradient variant="green" size={80} radius="50%" aria-label="Green gradient" />
    <Gradient variant="red" size={80} radius="50%" aria-label="Red gradient" />
    <Gradient variant="orange" size={80} radius="50%" aria-label="Orange gradient" />
    <Gradient variant="purple" size={80} radius="50%" aria-label="Purple gradient" />
</div>
```

<a id="api"></a>

## API

| Keyword | Type | Default | Description |
| --- | --- | --- | --- |
| variant | `GradientVariant` | — | Choose the six fixed colors of Frame 200 from left to right. |
| seed | `string \| number` | — | Only with `as="avatar-image"` and no explicit `variant`, select one of six palettes stably. A palette name used as `seed` selects that variant directly. |
| size | `number \| string` | — | Set the width and height at the same time; the priority is higher than `width` / `height` |
| width | `number \| string` | — | Width; the numerical value is processed by px |
| height | `number \| string` | — | Height; the numerical value is processed by px |
| radius | `number \| string` | — | Outer clipping radius; numeric values use px. |
| motion | `boolean` | — | Whether the four colored SVG layers run continuously. An Avatar with `false` can still run ripple deformation on hover; the multicolor overlay is unaffected. Default: `true` for ordinary Gradient, `false` for `as="avatar-image"`. |
| avatarHoverActive | `boolean` | — | Avatar can control artistic hover color for its image variant. If omitted, Gradient detects interaction itself; this control has no effect outside the Avatar variant. |
| decorative | `boolean` | `true` | Decorative artwork is hidden from the accessibility tree by default. Provide `aria-label` when setting this to `false`. |

See the base component documentation for inherited capabilities not redeclared here. This table lists only named public Props declared by this component.

<a id="使用边界与详细说明"></a>

## Usage boundaries and details

<a id="布局模型"></a>

<a id="布局模型-1"></a>

### Layout model

Main layout model: internal atomic layout.

- The root is Frame. Ordinary Gradient and motion-enabled Avatar use a fixed base color plus four transparent SVG image layers. Static Avatar uses one of six complete SVG assets bundled with the package.
- The component does not accept children, does not use Leading / Content / Trailing, and does not provide `parts`.
- The default canvas is `360 × 360`, and there are no rounded corners by default; `size` or `width` / `height` can change the external geometry.
- Visible geometry uses a `0 0 360 360` coordinate system. Static SVGs use that `viewBox`; animated layers overscan beyond it and fill the canvas with `preserveAspectRatio="none"`.
- The four animated SVG layers retain `feGaussianBlur` with `filterUnits="userSpaceOnUse"`. Ordinary Gradient uses `800 × 800` overscan for Subtract 2 and `600 × 600` for the other three; Avatar’s enhanced branch uses `720 × 720` throughout. The image viewport scales both geometry and blur standard deviation, with no fixed screen-pixel blur or size observer.
- A pure alpha mask clips pre-rasterized layers at the root so the gradient base cannot leak around rounded edges.
- Ordinary Gradient runs a four-layer 15-second loop by default. Avatar fallback leaves base deformation off normally; enable it continuously with `motion` or `gradientMotion`, or run ripple deformation only on hover.
- When rendering as `Avatar fallback`, Gradient stably selects six colors according to the `seed` transmitted by Avatar; if the seed itself is `blue / cyan / green / red / orange / purple`, it will directly hit the corresponding color matching.
- Avatar supplies hover state through `.snowui-media-hoverable`. Gradient excludes the current palette, shuffles the five remaining center colors stably per instance, and crossfades two same-color overlay layers.
- Avatar hover starts from a cached static image, then creates four pre-rasterized SVG layers and five colors × two solid-color HTML overlay layers. The motion layers loop independently at `6.4s / 7.2s / 8.4s / 6.8s` across seven asymmetric waypoints. Each entry randomly chooses one of six phase/direction sets without repeating the last; the color loop remains 10 seconds. Both effects fade in over 1 second, fade out over 0.5 seconds, then fully unmount.
- A module-level shared `IntersectionObserver` pauses transforms and releases `will-change` after Gradient leaves a 128px viewport prewarm area. Without observer support, motion continues with the same appearance and semantics.
- Stop the internal loop under `prefers-reduced-motion: reduce` and restore the static design baseline without transformation.

<a id="api-1"></a>

### API

| Keyword | Type | Default | Description |
| --- | --- | --- | --- |
| `as` | `string` | - | Frame role statement; Avatar scene can use `as="avatar-image"` |

<a id="css-动效覆盖"></a>

### CSS motion coverage

| Variable | Default | Description |
| --- | --- | --- |
| `--snowui-gradient-motion-duration-override` | `15s` | The actual cycle duration shared by four layers; corresponding to GD-05 default basic duration `60s ÷ 4×` |
| `--snowui-gradient-motion-easing-override` | `steps(90, end)` | The update density of each adjacent keyframe interval of the resident four layers; explicit overlay can restore continuous easing |
| `--snowui-gradient-motion-vector-4-x-amplitude-override` / `--snowui-gradient-motion-vector-4-y-amplitude-override` | `12%` / `12%` | Vector 4 displacement amplitude |
| `--snowui-gradient-motion-vector-4-rotate-amplitude-override` | `20deg` | Vector 4 rotation amplitude |
| `--snowui-gradient-motion-vector-3-x-amplitude-override` / `--snowui-gradient-motion-vector-3-y-amplitude-override` | `12%` / `12%` | Vector 3 displacement amplitude |
| `--snowui-gradient-motion-vector-3-scale-amplitude-override` | `0.25` | Vector 3 zoom in / zoom out |
| `--snowui-gradient-motion-subtract-x-amplitude-override` / `--snowui-gradient-motion-subtract-y-amplitude-override` | `12%` / `12%` | Subtract displacement amplitude |
| `--snowui-gradient-motion-subtract-deform-amplitude-override` | `0.25` | Subtract X/Y inverse nonuniform scaling amplitude. |
| `--snowui-gradient-motion-subtract-2-x-amplitude-override` / `--snowui-gradient-motion-subtract-2-y-amplitude-override` | `12%` / `12%` | Subtract 2 displacement amplitude |
| `--snowui-gradient-motion-subtract-2-rotate-amplitude-override` | `20deg` | Subtract 2 rotation amplitude |
| `--snowui-gradient-motion-subtract-2-scale-amplitude-override` | `0.25` | Subtract 2 enlargement/reduction amplitude. |
| `--snowui-gradient-avatar-hover-entry-duration` | `1s` | Gradient Avatar Color Overlay's entrance buffer duration |
| `--snowui-gradient-avatar-hover-exit-duration` | `0.5s` | Exit buffering time of Gradient Avatar Color Overlay |
| `--snowui-gradient-avatar-hover-motion-easing-override` | `linear` | Avatar On-demand continuous time function of water wave transformation |
| `--snowui-gradient-avatar-hover-motion-vector-4-duration-override` | `6.4s` | Avatar hover Vector 4 independent cycle |
| `--snowui-gradient-avatar-hover-motion-vector-3-duration-override` | `7.2s` | Avatar hover Vector 3 independent cycle |
| `--snowui-gradient-avatar-hover-motion-subtract-duration-override` | `8.4s` | Avatar hover Subtract independent cycle |
| `--snowui-gradient-avatar-hover-motion-subtract-2-duration-override` | `6.8s` | Avatar hover Subtract 2 independent cycle |

`motion` controls only base vector deformation. The GD-05 Test has 19 controls: duration, global speed, four easing coordinates, and 13 amplitude settings across four layers. Controls appear in a four-column grid below the graphic and initialize at each adjustable maximum.

<a id="六种配色"></a>

<a id="六种配色-1"></a>

### Six palettes

| `variant` | Figma Frame | Base color | Vector 4 | Vector 3 | Subtract | Subtract 2 |
| --- | --- | --- | --- | --- | --- | --- |
| `blue` | 196 | `#290082` | `#58B7FF` | `#6560FF` | `#3AF2FC` | `#D4E6FE` |
| `cyan` | 199 | `#0B005A` | `#5BE4FF` | `#00A5BE` | `#31FF83` | `#D4FEEF` |
| `green` | 197 | `#000A4E` | `#3DE680` | `#16B335` | `#C6F94F` | `#DFFED4` |
| `red` | 194 | `#320061` | `#FF7CB0` | `#FC3551` | `#F9E84F` | `#FED4D5` |
| `orange` | 198 | `#EC2300` | `#FFC654` | `#FF6C04` | `#FF14AD` | `#FEF0D4` |
| `purple` | 195 | `#1E0069` | `#C6BAFF` | `#F935FC` | `#FFF78E` | `#FED4F5` |

These are fixed colors of the artwork, not public color props or semantic theme colors.

<a id="专业艺术色例外"></a>

<a id="专业艺术色例外-1"></a>

### Professional art color exception

Gradient’s six fixed SVG palettes, center colors, and Avatar multicolor overlays are registered artistic-color exceptions in `docs/standards/StyleSpec.md` §2.1.3. Together they form an approved generative vector asset. They do not map to SnowUI semantic tokens and cannot serve as general colors for buttons, text, states, surfaces, or other components.

The exception only covers the Gradient screen and its Avatar visual branch. The size of the component root, rounded corners, external `class` / `style` coverage, accessibility and reduced-motion still comply with the current StyleSpec; it must be re-registered before adding palette or using color for new semantics.

<a id="使用示例"></a>

<a id="使用示例-1"></a>

### Usage examples

```svelte
<Gradient variant="blue" />
```

```svelte
<Gradient variant="purple" size={160} />
```

```svelte
<Gradient variant="orange" width={240} height={120} radius={24} />
```

```svelte
<Avatar fallback={Gradient} data-name="Gradient avatar" size={80} />


<Avatar gradientMotion data-name="Animated Gradient avatar" size={80} />
```

Avatar passes `as="avatar-image"`, a stable `seed`, and `gradientMotion` to Gradient fallback. Its normal state uses a cached static image. On hover, Gradient fades in four pre-rasterized SVG layers within the circular clip and cycles through the five other palette colors. `gradientMotion` only controls whether those animated layers run continuously.

<a id="矢量与缩放"></a>

<a id="矢量与缩放-1"></a>

### Vector and zoom

- Canvas: `360 × 360`.
- Layer order: background color rectangle → Vector 4 → Vector 3 → Subtract → Subtract 2.
- Elliptic blur: `stdDeviation=60 / 60`.
- Path blur: `stdDeviation=40 / 50`.
- The module caches four transparent SVG data sources per `variant + canvas tier`. Instances of the same variant reuse strings, decoded images, and raster caches, without per-instance filter IDs or DOM.
- When Avatar’s base deformation is off, it reuses one of six complete SVG assets with short package URLs. Hover creates four animated layers only for that avatar and releases them after fading out.
- Static Avatar and animated layers share palette, paths, and blur settings. Ordinary Gradient extends only rotating topmost Subtract 2 to `800 × 800` and keeps the other three at `600 × 600`. Avatar’s `720 × 720` overscan covers its stronger motion.
- Avatar mode continues to use the browser's native `content-visibility: auto` and layout / drawing containment, skips the long list viewport external subtree drawing, and does not create an instance-by-one observer.
- SVG picture viewport is responsible for uniformly scaling all geometry and blur; the component does not read the actual pixel size and does not recalculate blur.
- For a non-square canvas, scale X and Y separately as Figma Fill does. Four HTML layers move first in the SVG foreignObject’s 360 × 360 design coordinates, then the outer viewBox fills the target. Do not stretch into a rectangle before rotation; that would expose hard edges of the pre-rasterized images.

<a id="动效与性能"></a>

<a id="动效与性能-1"></a>

### Motion and performance

- The background color remains static; after turning on `motion`, a single instance only runs CSS transform keyframes on four HTML layers carrying pre-raster SVG images.
- Animation only uses `translate3d + rotate + scale / scaleX / scaleY`; resident Gradient uses 90-level update density in each adjacent keyframe interval, and single-step displacement is less than about 1px in the default 360px canvas; only `will-change: transform` is used when `motion` is turned on and close to the viewport.
- Four `feGaussianBlur` are only executed once when the picture is decoded; the running DOM does not have `filter / clipPath / path`, and the loop does not trigger the SVG filter re-raster.
- When Avatar does not hover, Avatar directly uses shared static maps, and does not create Gradient components, active layers or color Overlay; when hovering, it mounts a Gradient, four pre-raster active layers and five candidate colors × two-layer structure, and uninstalls them all after 0.5 seconds of fading out.
- The default four-layer cycle of Avatar hover is `6.4s / 7.2s / 8.4s / 6.8s`, using the original continuous time function, seven unequal time non-mirror passing points, independent negative delay, `18%` displacement, `30deg` rotation and `32%` scaling / deformation amplitude to avoid multi-layer synchronous deceleration or return along the original path.
- The original five-layer does not animate `fill`, `mix-blend-mode` or Gaussian Blur; Avatar hover only cross-animates opacity between five sets of double-layer same-color solid color Overlay. Each layer uses independent HTML synthetic elements to execute `overlay` to ensure that the backdrop is a fully rendered Gradient graphic.
- Color order is shuffled stably from seed and instance ID at component evaluation. Each hover uses one random choice among six phase/direction sets, excluding the previous set; CSS handles all frame-by-frame movement. JavaScript uses one `requestAnimationFrame` at hover entry to separate mount and fade-in, then an exit timer removes the DOM after the 0.5-second fade. No JavaScript animation loop, Canvas, or ResizeObserver is used.
- `0%` and `100%` use exactly the same transform to ensure that the frame does not jump during continuous looping.
- One module-level `IntersectionObserver` serves all instances. Beyond the viewport prewarm range, it pauses CSS animation and releases layer promotion; animation resumes at the paused position on return. Without observer support, motion continues.
- The layer pre-grid canvas is larger than the visible canvas; the motion amplitude is limited to the overscan safe range and is uniformly cropped by the root clip-path.

---

[Styles](./styles.md) · [Types](./types.md) · [API](./api.md)
