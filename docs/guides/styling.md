# SnowUI Component Styling Guide

Source fingerprint: `0b202640b69bab74`.

<a id="先确定修改的范围"></a>

## Define the scope of the change

First confirm the component, target version, and design differences.

Read the [design guide](./design-system.md), then the relevant component’s `api.md`, `reference.md` for complex compositions, and `styles.md` for customization. For example, see [Button API](../components/button.md) and [Button styles](../components/button/reference.md). Do not load all override variables, the whole source library, or internal maintainer documents by default.

<a id="样式选择与改写顺序"></a>

## Style selection and override order

Users and AI must follow two rules: **first match suitable styles with public component Props; preserve the component’s original appearance wherever possible.** If the default already works, use it. Do not rewrite colors, sizes, radii, or every state merely to “customize.”

Props include the component’s actual public style controls, such as `variant`, `size`, `emphasis`, and color. Check supported values and defaults in the API, then choose the existing look closest to the requirement. Do not invent a field or recreate an existing variant in CSS. When the product or design genuinely differs, change only what is needed in this recommended order:

| Order | Approach | Decision rule |
| --- | --- | --- |
| 1 | Public component Props | Stop when they express the need; do not override a suitable default explicitly. |
| 2 | Your own `class`, including Tailwind utilities already in the project | Reuse app styles and adjust only necessary visuals through the actual public root or role or a registered override. Tailwind is a class approach, not a later priority tier. |
| 3 | This instance’s `style` | For a one-off or dynamic difference on this instance. Confirm the public entry point and avoid spreading it into a global reset. |

External apps may use their own CSS, existing Tailwind, and design values. They do not have to install SnowUI website utilities or use a custom class in at least two places. If Tailwind is already present, keep using it; do not add a styling framework for one component change. Tokens from the same SnowUI category help coordinate theme and scaling. Still match explicit design values accurately; “preserve the original” must not silently ignore a real difference.

This is an order for choosing an approach, **not a ranking of CSS cascade strength**. Layers, specificity, declaration order, and inline styles determine the result; class-string order does not guarantee an override. If a style does not apply, identify the public owner of that property and its registered override before adding `!important` or private selectors.

<a id="用-props-保留现有视觉"></a>

## Keep the existing look with Props

For example, Button already exposes a variant and size that express this button:

```svelte
<script lang="ts">
  import '@snowui-design-system/components/styles';
  import { Button } from '@snowui-design-system/components';
</script>

<Button variant="filled" size="md">Save changes</Button>
```

External apps need only the component package and its packaged styles. Application overrides usually load afterward; also inspect the toolchain’s CSS layers because later loading alone does not guarantee precedence. Use the [token directory](../reference/tokens.md) for SnowUI values and the [Figma mapping guide](./figma.md) for Figma sources. Optional `snowui-base.css` leaves ordinary page `<a href>` links without an underline by default and changes their color from `Black40` to `Black100` on hover or keyboard focus. A page link underlined by a stylesheet rule loses that underline on non-disabled hover; SnowUI `Link` and `Button href` keep their own styles. To use `Black100 → Black40` on an ordinary link, set `--snowui-native-link-color: var(--black-100)` and `--snowui-native-link-hover-color: var(--black-40)` on it or its container. If your app writes `color` directly, it should define its own hover color; CSS cannot infer the reverse from a computed color. An underline written directly in an element’s `style` also needs an app hover rule; the base does not use `!important` to override it. Online AI hosts that do not import `snowui-base.css` do not receive these ordinary link styles.

<a id="确需改写时先用自己的-class"></a>

## Use your own class when an override is necessary

For example, if the product requires a smaller radius and Button has no matching public Prop, set the registered radius override in your app stylesheet:

```css
.project-action {
  --snowui-button-radius-override: var(--radius-2);
}
```

Pass that class to the target instance while retaining the chosen variant and size:

```svelte
<script lang="ts">
  import '@snowui-design-system/components/styles';
  import { Button } from '@snowui-design-system/components';
</script>

<Button variant="filled" size="md" class="project-action">Save changes</Button>
```

Tailwind also enters through the component’s supported `class` Prop. Confirm that the project generated the utility and that it targets a public element. Set a registered override from the class when needed. Button draws its default background in its own background layer, so `bg-*` or `background-color` on the root need not change that layer. Find the actual `--snowui-button-background-override` in its `styles.md`; do not patch a private descendant.

<a id="最后使用实例-style"></a>

## Use an instance style last

For a one-off or dynamic radius on this instance, set the same public override through its instance style:

```svelte
<script lang="ts">
  import '@snowui-design-system/components/styles';
  import { Button } from '@snowui-design-system/components';
</script>

<Button variant="filled" size="md" style="--snowui-button-radius-override: var(--radius-2);">Save changes</Button>
```

Do not set conflicting Props, class, and style values for the same property. A more specific instance style may override an app class. Confirm that the local difference is intended, then verify the original states still work.

<a id="根宿主默认内置子项和显式子项"></a>

## Root host, generated children, and explicit children

| Target | Public entry point | Scope |
| --- | --- | --- |
| Component root host | Exposed `class` / `style` and registered overrides | Affects the documented root or role; does not imply arbitrary descendants can be changed. |
| Generated default child | Documented `parts.ComponentName` | Configures the child’s public Props; business values, identity, roles, events, and controlled state still follow the host contract. |
| Explicit child written by the caller | Pass public Props to that child directly | Does not automatically consume parent parts; selection state, keyboard, and ARIA still follow composition rules. |
| Page-owned container | Page layout and app styles | Controls arrangement, width, spacing, and responsiveness without copying component internals. |

`parts` locates a component’s default children; it is not another override method placed after style. Use the child’s public Props through `parts.Child` first, then its supported class or style if necessary. Configure an explicitly written child directly; do not assume parent parts will change it.

For example, SearchPopup lets you configure its generated input’s placeholder and accessible name through `parts.SearchInput`:

```svelte
<script lang="ts">
  import '@snowui-design-system/components/styles';
  import { SearchPopup } from '@snowui-design-system/components';
</script>

<SearchPopup
  items={[{ value: 'files', label: 'Project files', href: '/files' }]}
  parts={{ SearchInput: { placeholder: 'Search projects', 'aria-label': 'Search projects' } }}
/>
```

This is a real public entry point on [SearchPopup](../components/search-popup.md), not a universal field on all components. SearchInput itself uses Input as its host and flattens compatible Props at the root; it does not offer `parts.Input`. Read its actual API for generated children rather than guessing parts names from the structure.

<a id="使用已登记的视觉覆盖"></a>

## Use registered visual overrides

A component’s `styles.md` lists public `--snowui-…-override` values consumed by the current runtime. An override can be set in class or style; it is not a shortcut around Props. Confirm that Props cannot express the need, then choose your class or an instance style according to the order and scope above. Do not accidentally propagate a local difference to every descendant.

Expand a class or theme override only when the app intentionally changes a whole category of components. Do not put an instance-specific change in `:root` by default. Avoid unregistered internal variables, private component classes or DOM, high-specificity selectors, and `!important` used to seize state styles.

Use each SnowUI token family for its own category: color, font size, line height, border, radius, dimensions, padding, and gap. Equal computed values do not make categories interchangeable. Pair font size with its line height, such as `--text-14` / `--leading-14`; prefer a public component size when it adjusts both. Theme colors and geometric steps are separate: changing the theme alone does not promise new layout, structure, interactions, or motion.

<a id="整条边缘的渐进式背景模糊"></a>

## Progressive background blur along an entire edge

For a transparent progressive background blur along a page edge, use the package export `createEdgeProgressiveBlurStyles` instead of copying the SnowUI website’s four-layer CSS. `direction` supports `top-to-bottom`, `bottom-to-top`, `left-to-right`, and `right-to-left`. `extent` sets height for vertical directions or width for horizontal ones, defaulting to `80px`. `position` may be `absolute` (default) or `fixed`; set `zIndex` for the page stacking order. Render the returned `containerStyle` and `layers`, with `aria-hidden="true"` on the outer wrapper. Decoration layers do not receive pointer events or cover the content. If the browser lacks `backdrop-filter`, the transparent layers leave the content readable.

```svelte
<script lang="ts">
  import { createEdgeProgressiveBlurStyles } from '@snowui-design-system/components';
  const blur = createEdgeProgressiveBlurStyles({ direction: 'bottom-to-top', extent: '6rem' });
</script>

<div style="position: relative; min-height: 12rem;">
  <p>Readable content</p>
  <span style={blur.containerStyle} aria-hidden="true">
    {#each blur.layers as layer (layer.index)}<span style={layer.style}></span>{/each}
  </span>
</div>
```

<a id="公开配置无法表达时"></a>

## When public configuration cannot express the design

Check the version, component, and public contract. Record implementation changes for future upgrades and verify any port.

Verify themes, long text, narrow screens, focus, hover, disabled, and related states on the actual page. A screenshot does not replace keyboard and interaction testing. Reuse documentation read during the task.
