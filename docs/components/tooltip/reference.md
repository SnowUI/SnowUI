# Tooltip full reference

Reviewed against Chinese source SHA-256 `117e195362542492f4070625257e519c0c0a84dab35bbd79262d6ae5ea597aa5`.

<a id="tooltip"></a>

# Tooltip

<a id="组件介绍"></a>

## Overview

Show short explanations on hover, with collision-aware placement and smooth switching between triggers. Suitable for icon buttons and content needing context.

<a id="使用选择"></a>

## When to use it

Use Tooltip to add a short hint to an existing control. Essential content must remain available outside it; use Popover or Dialog for interactive forms, menus, or complex content.

- Place Tooltip inside its trigger element rather than wrapping the trigger. Without `children`, it reads the trigger’s text.
- When `open` is omitted, hover controls it; an explicit `true` or `false` lets the page control it. Do not hide essential content or actions only in a tooltip.

<a id="快速开始"></a>

## Quick start

This example shows the recommended basic composition. See the following sections for more scenarios and composition limits.

```svelte
<script lang="ts">
	import { Tooltip, Button } from '@snowui-design-system/components';
</script>

<div style="display: flex; align-items: center; gap: var(--gap-4) var(--gap-3); flex-wrap: wrap;">
	<Button>
		Source
		<Tooltip as="tooltip" position="top">Open the component source file on GitHub.</Tooltip>
	</Button>
	<Button>
		Figma
		<Tooltip as="tooltip" position="top">Inspect the component and its variants in the SnowUI library.</Tooltip>
	</Button>
	<Button>
		Copy import
		<Tooltip as="tooltip" position="top">Copy the public package import statement.</Tooltip>
	</Button>
</div>
```

<a id="api"></a>

## API

| Keyword | Type | Default | Description |
| --- | --- | --- | --- |
| position | `"top" \| "bottom" \| "left" \| "right"` | `"top"` | Preferred placement. If space is insufficient, flip or shift within the viewport safe area, then use the resolved placement for positioning and entry. |
| open | `boolean` | — | Bindable controlled visibility. When omitted, uses the parent trigger’s hover and shared Portal. Explicit `true` / `false` gives the caller an independent Portal without hover delay or speed sampling. |
| offset | `number` | `4` | Target gap along the placement axis, in pixels; final position is still constrained by viewport collision. |
| maxWidth | `number` | `360` | Maximum tooltip width in pixels, further limited by a 16px safe area on every visible edge. |
| variant | `"dark" \| "light"` | `"light"` | Tooltip appearance variant, default light, can be explicitly switched to dark |
| dismissOnMotion | `boolean` | `true` | In uncontrolled hover mode, hide immediately when the trigger or an ancestor begins motion, or a descendant begins a geometric transition. Decorative descendant animation and whole Button-content scaling do not hide it because the latter does not move the trigger anchor. |
| widthRebound | `boolean` | `false` | Enable width overshoot and rebound during continuous switching. Off by default. |
| rapidRetarget | `boolean` | `true` | On retargeting during a transition, use the fast 90–160ms cubic ease-out baseline. When disabled, use the regular 120–180ms baseline. Mouse speed can shorten either to at least 60ms. |
| children | `Snippet` | — | Parameterless hint content: text or public component composition. Without it, Tooltip reads its parent trigger’s text. Place Tooltip inside the trigger; it does not wrap it. |

See the base component documentation for inherited capabilities not redeclared here. This table lists only the named public props declared in this component’s source.

<a id="使用边界与详细说明"></a>

## Usage boundaries and details

<a id="关键字-keyword"></a>

<a id="关键字-keyword-1"></a>

### Keywords (Keyword)

| Keyword | Type | Default | Description |
| --- | --- | --- | --- |
| as | `'tooltip'` | - | Role as the parent component’s hint layer. |

<a id="使用示例"></a>

<a id="使用示例-1"></a>

### Usage examples

```svelte

<Icon icon={Info} >
    <Tooltip as="tooltip">More information</Tooltip>
</Icon>


<Button>
    Hover
    <Tooltip open={showTip}>Tooltip content</Tooltip>
</Button>


<Text lines={1}>
    This text will be truncated
    <Tooltip as="tooltip" />
</Text>
```

<a id="布局模型"></a>

<a id="布局模型-1"></a>

### Layout model

Main layout model: **inline shell**. See `docs/standards/LayoutProtocol.md` §12.4.

Tooltip's Portal, positioning and collision flipping are component behaviors; the content of the visible bubble itself is managed according to the inline shell layout:

- `.snowui-tooltip-content` is an inline-level shell that hugs its content.
- Children follow `gap`; no Content Fill is provided.
- The bubble owns padding, gap, radius, font size, and line height; external overrides use `--snowui-tooltip-*-override` variables.
- Short content hugs its width. Long content wraps at the maximum width before measurement and placement to avoid a positioning feedback loop. Long words and URLs may break.
- Hovering the bubble keeps it open. Very tall content is limited to the safe-area height and scrolls internally; leaving resumes the shared hide delay.

Layout variable chain:

<a id="智能行为"></a>

<a id="智能行为-1"></a>

### Intelligent behavior

1. **Hover delay**: The first hover waits `450ms`. Once any Tooltip has appeared, entering another during the `300ms` cooldown switches immediately without another fixed intent delay.
2. **Shared shell**: Uncontrolled hover Tooltips use one page-level Portal. After leaving a trigger, the shell remains for the `300ms` skip-delay window. Entering another Tooltip during that window cancels hiding without replaying entry motion. Once warm-switch content commits, measure its real Snippet size once and position it immediately; the continuous timeline starts moving on the first available frame. The shared ResizeObserver coalesces later size changes.
3. **Two-dimensional continuous switching**: Only executed when the shared outer frame is still visible and switched to another trigger. Calculate the displacement with the center of the bubble frame; when the center distance does not exceed `240px`, and `hypot(dx / visible width, dy / visible height) ≤ 0.25`, the outer frame moves along any two-dimensional vector and changes the width and height synchronously; direct positioning when the threshold is exceeded. The mouse speed adaptation rules are described in item 11 below; the following is the baseline when the speed is not increased. The normal close-up position and content timeline is `clamp(100ms + distance × 0.35ms/px, 120ms, 180ms)` cubic ease-out coordination curve. The default is `rapidRetarget=true`; only change the target again before the end of the position and content handover, take over from the current visible screen and change to `clamp(60ms + distance × 0.35ms/px, 90ms, 160ms)` cubic ease-out and `0.02` content lag. When set to `false`, the interruption still uses the general coordination timeline and `0.02` content lag. By default, the width is `widthRebound=false`, and the width follows the timeline of the currently selected position directly converges; when `widthRebound=true` is explicitly set, the width independently uses `1000ms` damping spring, and it is not shortened by fast redirection. When the position and content are completed and only the width rebound tail section is left, the new target must start the complete general content handover, and it must not be compressed, cut and revealed because the width is still rebounding. Both modes start from the current visible width as a new starting point and do not inherit the cumulative speed. Top / bottom to the center, left to the right, right to the left to keep the trigger side anchor point. The specific value shall be subject to the Tooltip continuous preset.
4. **Content band splicing and coordination timeline**: When the shortest distance of the new and old target Tooltip rectangle does not exceed `4px`, the old and new contents move along the outer frame vector into a content band with a projection spacing of `16px`. The measurement boundary is the `.snowui-tooltip-inner` of the complete Snippet. The position of the outer frame starts with the same frame as the content movement, and the alignment is completed within the bounded time after the current speed adaptation; the old content layer is kept until the first rebound point of the width spring `450ms`. The old layer cleanup only uninstalls the outgoing, and does not reset the incoming offset; the incoming continues to compensate for the position according to the width of the current outer frame until the width spring converges accurately, so as to avoid the clean-up frame text instantly returning to zero and then restoring to cause jitter. When changing the target in the movement, take over the content layer with a larger actual visible area in the crop window, and freeze the real-time viewport rectangle in the same frame. The rounded outer frame is the only crop window; when the distance exceeds `4px`, the old content is not stitched and the old content is not retained, but the new content must be partially aligned according to the final placement in the outer frame in transition: top / bottom horizontally in the middle, left to the right, right to the left; vertical top down, bottom up, and left / right in the middle.
5. **Reappearance**: After the outer frame hides, reset its prior position, size, and trigger. Measure and place invisibly in the first frame, then appear at the current trigger without translation or width animation.
6. **Cooldown reset**: More than `300ms` after leaving a trigger, restore the initial `450ms` hover delay. Leaving before a Tooltip appears does not activate immediate switching.
7. **Boundary collision**: Use the visualViewport of the current document (use window when it is not available), and the iframe is bounded by the iframe viewable area. Keep 16px on all sides; first limit the width of the outer frame to min(maxWidth, visible width − 32px), and the height to visible height − 32px, and then measure. Try to specify the direction, the opposite direction, and the other two directions in turn. Each direction moves along the cross axis first; give priority to the position of falling into the safety zone, otherwise select the position with the smallest total overflow distance and move back to the safety zone along the two axes. Window scaling, scrolling, soft keyboard and content size changes are all recalculated. Continuous switching (including explicit width rebound) also limits the width and position according to the safe area. Escape closes the current prompt. The ultra-small viewport where the security area is smaller than the inner margin of the content cannot guarantee 16px.
8. **Dismiss on motion**: While Tooltip is visible, one page-level listener watches transition/animation on the trigger and its ancestors and geometric transitions on descendant elements. A match immediately unmounts Tooltip without exit motion. The registered whole-content transform in Button does not move the trigger anchor, so it is ignored; other descendant geometry changes still dismiss it. Decorative Logo/Icon animations, color, background, opacity, and `::before` / `::after` transitions are ignored. Set `dismissOnMotion={false}` to disable this behavior.
9. **Retargeting and performance**: If position or content handoff is still running, recompute movement from the live shell and dominant visible content rectangles. Cancel the old timeline immediately; do not queue, wait, or jump to its endpoint. `rapidRetarget` defaults on with a 90–160ms cubic ease-out; off uses the regular 120–180ms curve. The tail of a separate width rebound is not a rapid-retarget window: a new target gets a full normal content handoff while width restarts from its visible value. A warm target needs no extra positioning or starting animation frame after content commits. The dedicated synchronous measurement runs once, without a new observer or per-frame reads. Use `will-change` only during `moving`.
10. **Triggering and reduced motion**: Every warm target change commits immediately. No fixed intent delay or burst window decides whether continuous clipping runs; smoothed pointer speed changes only duration. With `prefers-reduced-motion: reduce`, switching positions immediately and shows only the new content, without movement, size transitions, or intermediate clipping.
11. **Pointer-speed adaptation**: Effective pointer speed only shortens the selected baseline: `min(baseline duration, max(60ms, shell-center distance / smoothed speed + 20ms))`, with speed in px/ms. Use 32ms exponential smoothing; a sample expires after 100ms. Slow movement or no valid sample retains the distance baseline. Read speed once per retarget; shell position, height, default width, and content share that duration. Do not vary speed within a segment, alter the selected easing or content lag, or shorten an explicit 1000ms width rebound. Sampling uses one passive listener only while the shared Tooltip is active and smooth motion is allowed; release it on hide, unmount, or reduced motion. First-hover delay and controlled `open` are unaffected.
12. **Interactive host resolution**: When Tooltip sits in an internal Link/Button wrapper, the nearest `a`, `button`, `role="link"`, or `role="button"` ancestor is the hover and positioning trigger. Without an interactive ancestor, its direct parent remains the trigger. Thus a collapsed or hidden internal label does not shrink the hit area of the visible primary action.
13. **Multi-instance performance**: Each uncontrolled Tooltip keeps only enter/leave listeners on its trigger. The single shared Portal host owns page Overlay subscriptions, motion-disable registration, reduced-motion media query, and window scroll/resize positioning listeners. Only a visible controlled Tooltip registers its own positioning listeners. Repeated requests from scroll, resize, or size measurement are coalesced through `requestAnimationFrame`, with at most one layout read per frame.
14. **Content ownership**: The shared shell borrows a content Snippet only while its source component is alive. When the source unmounts, release its current or outgoing content immediately instead of reading a destroyed source during an exit animation. If only the outgoing source unmounts, finish that handoff and keep the live target. Ordinary pointer leave retains the original hide delay and exit animation.

<a id="样式逻辑实现对照"></a>

<a id="1-气泡基础布局"></a>

### 1) Bubble foundation layout

- The rendering layer is mounted to `document.body` through Portal, and the positioning method is `position: fixed`.
- The content container uses `inline-flex` and fixes `align-items: center`, `justify-content: flex-start`.
- The content layer can be hovered; move in to cancel the hidden timing, and move out to restore the hidden timing.
- The hierarchy is fixed as `z-index: 9999`, and the text uses `white-space: normal` and `overflow-wrap: anywhere`.

<a id="2-figma-token-映射"></a>

### 2) Figma Token mapping

- `padding`: `--snowui-tooltip-padding` → `var(--padding-1) var(--padding-2)`(up and down 4, left and right 8)
- `gap`: `--snowui-tooltip-gap` → `var(--gap-2)`（8）
- `border-radius`: `--snowui-tooltip-radius` → `var(--radius-3)`（12）
- `font-size/line-height`: `--snowui-tooltip-font-size` / `--snowui-tooltip-line-height` → `var(--text-12)` / `var(--leading-12)`

<a id="3-视觉主题"></a>

### 3) Visual theme

- `variant="dark"` (driven by `data-variant`):
  - Background: `Static Black/80%` + `Static White/10%` Overlay
  - Text: `Static White/100%`
- Default `variant="light"`:
  - Background: `Black/4%`
  - Text: `Black/100%`

<a id="4-滤镜与阴影"></a>

### 4) Filters and shadows

- Backdrop retains a fully transparent gradient paint surface so the browser does not skip filter compositing on a layer without a background. Foreground still owns color and lifecycle motion.
- Keep the frosted glass: `backdrop-filter: blur(1.25rem)` (including `-webkit-backdrop-filter`).
- Portal must remain outside the isolation layer of the application root node, and it must not mistakenly add `isolation: isolate` by the global root node selector; otherwise, although the frosted glass has a calculated value, it cannot sample the page content in the root node of the application. See StyleSpec.md §2.6.4 for the root node isolation rules.
- The current version has removed the shadow and does not use `box-shadow`.

<a id="5-显隐与连续切换动效"></a>

### 5) Visibility and continuous-switch motion

- In uncontrolled mode (`open` omitted):
  - After the mouse enters the trigger for the first time, the delay of `450ms` is displayed, and the skip-delay after the successful display is `300ms`;
  - Automatically collide and flip according to the edge of the viewport;
  - After the Tooltip is successfully displayed, other Tooltips on the page respond immediately in the `300ms` cooldown window; each target is redirected from the current screen and continuously cropped, and the old timeline is immediately invalidated, without accumulating multiple slow motion effects;
  - When switching triggers continuously, the same Portal outer frame is reused; close-range switching moves along any two-dimensional direction, and long-distance switching directly locates;
  - Continuous movement uses an independent transform wrapper to undertake position changes, and the Portal anchor point is still updated according to the existing positioning semantics; the width and height are updated by the same frame-by-frame geometric timeline;
  - When the shortest distance of the new and old target Tooltip rectangle does not exceed `4px`, the old and new contents are assembled along the actual two-dimensional moving vector into a content band with a projection spacing of `16px`; switch the ordinary/fast bounded coordination timeline after the use of speed adaptation; the `overflow: hidden` of `snowui-tooltip-size-shell` forms the only boundary with the rounded corners;
  - When the shortest distance of the new and old target Tooltip rectangle exceeds `4px`, the old content is not stitched or retained; the new content is partially aligned in the current outer frame according to the final placement and moves with the outer frame. It cannot be attached to the upper left corner by default when the long content is cut into short content;
  - When the animation is interrupted, read the real-time rectangle of the outer box and the current content layer, and then take their current visible positions as the starting point of the next paragraph;
  - The new round of display first completes the invisible measurement and positioning, and reserves an invisible pre-drawing frame for the frosted glass layer, and then displays Portal as a whole; the first frame of stable Backdrop provides blur with complete opacity, and the independent Foreground executes opacity, enhances scale and placement directional sliding through `getTooltipAppearMotion(finalPosition)`. Top from bottom up, bottom from top to bottom, left from right to left, right from left to right; the specific value is subject to the Tooltip preset catalog. Portal and Backdrop do not participate in the dynamic effect, so the gradual appearance will not weaken the filter;
  - After a hidden shell reappears, reset the motion baseline and place the first frame directly at the current trigger. Enable later size motion only after entry fade finishes.
  - After leaving the trigger for more than `300ms`, the first delay of `450ms` is restored;
  - The life cycle appears only in `snowui-tooltip-foreground` using the explicit opacity / scale / x / y channel of Tooltip appear preset; the transform origin is fixed in the center of the side near the trigger, and the subsequent size change continues to be undertaken by the Frame `Idle -> Active` morphological timing;
  - The width and height changes of the content are saved by `snowui-tooltip-size-shell`. Ordinary size changes continue to consume Frame size motion bridge; continuous switching defaults to use the frame-by-frame coordination timeline and monotonous convergence with the same position as the outer frame. When `widthRebound` is explicitly turned on, a slight cross-boundary rebound is generated by the independent width spring. Rounded corners and padding belong to size shell, frosted glass belongs to stable Backdrop, background color and content belong to Foreground; the three levels share the same size and crop boundary;
  - The top / bottom direction uses the trigger center as the fixed anchor point, and the size shell is centered with static `transform: translateX(-50%)`; the left / right direction uses the vertical center of the trigger as the fixed anchor point, and the size shell is centered by static `transform: translateY(-50%)`; the width and height are transitioned by Frame size motion bridge, but the centering offset does not participate in the transition, so Tooltip remains centered with the trigger during continuous switching and size change;
  - After pointer exit, retain the shell for the `300ms` skip-delay so an adjacent trigger can reuse it. If none is entered in that window, set the Foreground Frame to `Disappear` and run the 50ms transitions.dev-inspired exit: background and content fade and shrink to 98%. Then unmount the shared shell, including Backdrop.
  - With `prefers-reduced-motion: reduce`, disable position, size, and content-band transitions and remove the outgoing content layer immediately.
- Controlled mode (`open` supplied) uses external state directly and does not join shared warmup/cooldown.
- When the loop default ability such as `loopMotion.preset="rotateClockwise"` is passed externally, the Outer Frame of Portal will directly undertake the effect; therefore, the floating layer itself can rotate continuously and will not cover the appear `transform` of the internal content layer.

---

---

[Styles](./styles.md) · [Types](./types.md) · [API](./api.md)
