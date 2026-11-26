# Gradient changelog

Reviewed against Chinese source SHA-256 `dd22fa96ab476f7e69c7ffb0afa802d19afcb84486a28fcd4330d38ae9483f94`. For version differences, check the installed package as well.

<a id="v2132-2026-09-15"></a>

### v2.13.2 (2026-09-15)

- 2026-09-21: Unified the usage guide, source property table, and Site / AI reading entry points. Documentation only; component behavior is unchanged.

- 2026-09-15 (rounded edge fix): `radius="50%"` uses an ellipse path (exact circle when square), other explicit radii clip the full composite via `inset(0 round ...)`, and inherited radii use `border-box` instead of `overflow: hidden`, preserving alpha-mask compositing and reducing circular edge fringing across `radius` and inherited Avatar radii.

- Dynamic layers now move in original design coordinates before being fitted to width and height, fixing exposed background at the top-left of wide canvases. Palette, paths, and animation parameters are unchanged. The ordinary Subtract 2 safety region expanded to 800 × 800 to cover corners at minimum scale; other layers and Avatar cache sizes are unchanged, with no size observer.

<a id="v2131-2026-08-16"></a>

### v2.13.1 (2026-08-16)

- Expanded the prerasterized safety region of the top Subtract 2 layer in ordinary Gradient from `600 × 600` to `720 × 720`, preventing a hard-edged base-color patch at top-left during rotation or scaling. The other three layers retain their original canvas sizes and composite area.

<a id="v2130-2026-08-15"></a>

### v2.13.0 (2026-08-15)

- Replaced four live SVG `<g>` layers with Gaussian Blur with module-cached transparent SVG image sources. The browser generates blur at image decode; the four HTML composite layers only transform during animation, avoiding Safari filter rerasterization on every frame.
- Ordinary Gradient uses `600 × 600` overscan and 90 update steps per segment. The stronger Avatar mode uses `720 × 720` overscan and retains the previous continuous easing. Both preserve soft paths and public amplitude and duration overrides.
- All instances share one `IntersectionObserver`. Internal animation pauses and releases `will-change` beyond the viewport’s 128px prewarm range; without observer support, continuous motion remains.

<a id="v2121-2026-08-15"></a>

### v2.12.1 (2026-08-15)

- Registered the six fixed SVG palettes, center colors, and multicolor Avatar Overlay as a professional-art-color exception. The exception does not extend to Gradient’s other styling contracts.

<a id="v2120-2026-08-06"></a>

### v2.12.0 (2026-08-06)

- Provided shared static image sources and a controlled hover lifecycle for Avatar integration. Avatar directly renders a static image at rest by default; Gradient mounts only during hover or persistent motion.
- The controlled hover effect now tracks only the active value supplied by Avatar. Internal profile, mount state, and exit timer updates no longer join effect dependencies, avoiding update loops.
- Added lazy loading, asynchronous decode, and low request priority to static Avatar images to reduce first-screen decode contention in long lists.

<a id="v2110-2026-08-03"></a>

### v2.11.0 (2026-08-03)

- Expanded the four layer transforms from two or three poses to seven unevenly timed, nonmirrored waypoints each. The final loop segment no longer retraces the previous path.
- Added six phase/direction combinations. Each Avatar hover chooses one randomly while avoiding the prior combination, so repeated entry on the same avatar does not start in the same state and direction.
- Randomization happens only at hover boundaries. Active layer and filter counts, per-frame CSS execution, and exit cleanup are unchanged.

<a id="v2100-2026-08-02"></a>

### v2.10.0 (2026-08-02)

- The default Gradient Avatar still uses a cached static image at rest and mounts one live SVG only on hover. On exit it fades for 0.5s, then releases the SVG, four filters, and Overlay.
- Changed the four internal layers to independent linear periods of `6.4s / 7.2s / 8.4s / 6.8s` with staggered negative delays. Hover amplitude rose to 18% translation, 30° rotation, and 32% scale / distortion, removing long pauses caused by synchronized easing.
- Fixed the on-demand hover lifecycle to use Frame-supported `mouseenter / mouseleave`, while still forwarding external pointer callbacks.

<a id="v290-2026-08-02"></a>

### v2.9.0 (2026-08-02)

- Reduced each candidate-color Overlay in Gradient Avatar from four layers to two. Entry buffering increased from 0.5s to 1s; exit remains 0.5s. Colors, `overlay` blend, 10s cycle, and 58% single-layer peak are unchanged.
- The default static Avatar now reuses six bundled SVG images, removing 800 instance-level filter nodes and duplicate data URIs in a 200-avatar list. Its 24px screenshot matches the previous live SVG pixel for pixel.
- Kept on-demand hover mounting and `content-visibility`; hovering one avatar now creates only 10 passes and 10 color layers.

<a id="v286-2026-08-02"></a>

### v2.8.6 (2026-08-02)

- Kept the approved hover design of five colors × four Overlay layers, `overlay` blend, 10s cycle, 0.5s buffering, and color parameters, but now mounts the complete structure on hover and unmounts it after exit fade.
- Added native `content-visibility: auto` and paint containment in Avatar mode so static SVGs outside a long-list viewport are not painted. No per-avatar IntersectionObserver is used.

<a id="v285-2026-08-02"></a>

### v2.8.5 (2026-08-02)

- Added a base deformation switch named `motion`: ordinary Gradient enables it by default, while Avatar fallback disables it by default.
- With base deformation disabled, transform animation and `will-change` are not mounted. Avatar hover retains the approved multicolor Overlay.

<a id="v284-2026-08-02"></a>

### v2.8.4 (2026-08-02)

- Fixed repeated flashes at the Avatar hover color-loop boundary: the `100%` keyframe opacity returned from the erroneous `1` to the same `0.58` as `0%`.
- All five staggered color layers now loop with identical starting and ending states while neighboring colors continue crossfading.

<a id="v283-2026-08-02"></a>

### v2.8.3 (2026-08-02)

- Fixed an SVG clip/filter compositing context that made `mix-blend-mode: overlay` degrade into nearly flat color tinting.
- Moved two color Overlay layers from SVG `<g>` into HTML composite layers above the complete SVG. Each blend now uses the original Gradient graphic as its backdrop, preserving brightness and gradient texture.

<a id="v282-2026-08-02"></a>

### v2.8.2 (2026-08-02)

- Fixed two solid-color layers at a 100% peak flattening the original Gradient texture. The layers became independent Overlay passes, each capped at 58% peak opacity.
- In response to color changes feeling too fast, increased the five-color cycle from `5s` to `10s`, giving adjacent colors longer crossfades without discrete color jumps.

<a id="v281-2026-08-02"></a>

### v2.8.1 (2026-08-02)

- Raised Avatar hover Overlay reveal duration from `0.15s` to `0.5s` with standard ease-in-out so the two color layers fade naturally into the 5s cycle.
- Animation still runs at target speed immediately on hover; the composite fade hides the startup jump without JavaScript speed ramps, timers, or per-frame computation.

<a id="v280-2026-08-02"></a>

### v2.8.0 (2026-08-02)

- Changed each Avatar candidate color from one Overlay to two synchronized same-color Overlay layers, both using `overlay` blend for stronger hue changes.
- Shortened the five-color cycle from `10s` to `5s`, doubling transition speed.
- One avatar now adds only ten solid-color opacity layers and does not duplicate the Gaussian Blur graphic.

<a id="v270-2026-08-02"></a>

### v2.7.0 (2026-08-02)

- Avatar continues to provide hover state. Gradient now manages color changes itself: it excludes the current variant, shuffles the other five colors per instance, and continuously crossfades them.
- Replaced the rotating/scaling `screen` gradient band with the center color of each of the six Gradient variants as a fixed `overlay` color.
- To avoid Gaussian Blur cost from copying complete static Gradients, candidate colors render as only five 80px solid rectangles animated through opacity.

<a id="v260-2026-08-02"></a>

### v2.6.0 (2026-08-02)

- GD-04 became six `80 × 80` Avatars showing blue, cyan, green, red, orange, and purple Gradient fallbacks one by one.
- Gradient now chooses its Avatar fallback palette stably from seed; an explicit variant still takes highest precedence.
- Added a continuous `screen` color overlay band on Avatar hover, animating only the small overlay layer’s transform. Reduced-motion mode stops the loop but keeps static color feedback.

<a id="v250-2026-08-02"></a>

### v2.5.0 (2026-08-02)

- Initialized all 19 GD-05 motion parameters to the upper ends of their adjustable ranges: base duration `60s`, overall speed `4×`, easing coordinates all `1`, translation `12%`, rotation `20deg`, and scale / distortion `25%`.
- Updated Gradient’s public CSS fallbacks to the same upper-bound combination. Base duration divided by speed gives a default actual cycle of `15s`.

<a id="v240-2026-07-30"></a>

### v2.4.0 (2026-07-30)

- Made the base-color rectangle stationary and removed the common transform animation from the entire SVG.
- The four blurred color layers now use translation / rotation, translation / scale, translation / nonuniform distortion, and translation / rotation / scale respectively, with staggered keyframe timing.
- For performance, colors, blend modes, paths, and Gaussian Blur remain static. GD-05 now arranges 19 controls in four columns.

<a id="v230-2026-07-30"></a>

### v2.3.0 (2026-07-30)

- Increased default translation for A/B/C and changed default rotation to `±3deg` and scale to `5%`, making continuous motion discernible even at `4×` speed.
- Changed Rotate / Scale from absolute values at each keyframe to overall amplitude; the timeline generates corresponding negative amplitude, center, and positive amplitude values.
- Reduced GD-05 to 14 controls in a fixed four-column grid below the artwork.

<a id="v221-2026-07-30"></a>

### v2.2.1 (2026-07-30)

- Added one overall speed multiplier Slider to GD-05, default `1×`, range `0.1×–4×`.
- Overall speed changes only the final cycle duration; it adds no second animation or Gradient runtime script.

<a id="v220-2026-07-30"></a>

### v2.2.0 (2026-07-30)

- Exposed duration, easing, and the X, Y, Scale, and Rotate values of keyframes A/B/C as CSS overrides.
- GD-05 added 17 controls through the test-only `GradientMotionController` to adjust all motion parameters live; control state does not enter Gradient runtime.

<a id="v210-2026-07-30"></a>

### v2.1.0 (2026-07-30)

- Added continuous, soft, low-frequency drift.
- Each instance animates only the SVG root `transform`; Gaussian Blur, paths, and colors are not recalculated frame by frame.
- Default cycle duration is `24s`, with an external `--snowui-gradient-motion-duration-override`.
- Under `prefers-reduced-motion: reduce`, the loop stops and the static design baseline returns.

<a id="v201-2026-07-30"></a>

### v2.0.1 (2026-07-30)

- Added a pure alpha mask at the root to fix colored fringes where SVG-filtered content meets rounded `overflow` edges.

<a id="v200-2026-07-30"></a>

### v2.0.0 (2026-07-30)

<a id="破坏性重写"></a>

#### Breaking rewrite

- Removed the old Workshop layer `c` PNG render and `355 × 355` static crop.
- Redrew six `360 × 360` SVG vector palettes from Workshop Frame 200.
- Added `variant="blue|cyan|green|red|orange|purple"`.
- Changed default size to `360 × 360` and default radius to `0`.
- Removed the visual no-op `seed` compatibility parameter.
- SVG blur scales with viewBox geometry.
- Explicitly disabled Frame’s default animation during the static stage.

[Component guide](../gradient.md) · [Full reference](./reference.md)
