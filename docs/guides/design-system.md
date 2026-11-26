# SnowUI Design Guide

Source fingerprint: `ed8dc23cc2ff85ca`.

<a id="开始使用"></a>

## Getting started

SnowUI provides Svelte components and design parameters. Choose components to suit the page.

Confirm the framework and installed version, then consult component APIs and examples as needed.

Match design parameters and states to public component capabilities.

<a id="从设计稿开始"></a>

## Start with the design

Break the screen into page structure, navigation, actions, inputs, content, data display, and feedback. Describe what each region does, then read the [component selection guide](./component-selection.md) and search the [component directory](../components/index.md) or [AI keyword search](https://snowui.dev/llms/find?lang=en&q=file%20table). A persistent activity list is not automatically a Toast, and a right-hand page column is not automatically a SidePanel. Choose by responsibility and public contract.

Components own their default appearance, keyboard and ARIA behavior, interactions, and state. The page owns routes, business data, requests, permissions, and composition. Choose a suitable component first, match the desired appearance with its public Props (including supported variants and sizes), preserve its existing look where possible, then arrange the page layout. When first using components, read the [style selection and override order](./styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F) once and reuse it during the same task. Ordinary consumers should not copy private DOM, classes, or state logic; necessary source changes must follow the relevant component contracts.

When reading Figma designs, also consult the [Figma mapping guide](./figma.md). A screenshot proves only the visible state. It cannot establish exact values, variable bindings, hidden interactions, or responsive rules. For unspecified parameters, state which existing value you chose. If an explicit design value cannot be mapped, record the difference rather than silently substituting an arbitrary color, spacing value, or radius.

<a id="安装与样式入口"></a>

## Installation and styles

The current official component runtime package targets Svelte 5. Import component styles before application overrides.

```svelte
<script>
  import '@snowui-design-system/components/styles';
  import { Button } from '@snowui-design-system/components';
</script>

<Button>Save changes</Button>
```

External apps may use only the components and their packaged styles; they do not need all initialization and utilities from the SnowUI website. Check exports and Props against the installed version. Frame is the only general-purpose host; follow its public documentation rather than inferring another host or unsupported fields from older material.

Plain HTML, React, and online tools may not run Svelte directly. Confirm framework, dependencies, and file capabilities. A project port differs from an official runtime package; do not claim unverified compatibility.

<a id="页面布局与响应式"></a>

## Page layout and responsiveness

Ordinary `main`, `section`, `aside`, and `footer` elements express page semantics; use the corresponding components for navigation and controls where appropriate. Decide whether the parent or child owns padding and gaps so the layout does not duplicate spacing, radii, or shells. Outside components, use page utilities that are actually loaded. When using only the component package, use public tokens and minimal page CSS rather than assuming optional utility classes exist.

<a id="frame-通用布局"></a>

### Frame layout patterns

| Pattern | When to use it | Public entry point |
| --- | --- | --- |
| Three slots | Attachments keep their own size while content takes the remaining space | `row`; attachment `as="leading"` / `as="trailing"`; content has no attachment role |
| Single-line graphics, names and dates | Keep labels on one row and preserve attachment sizes; truncate when needed and retain full-text access | `singleLine`, attachment `as="leading/trailing"`, and `Text lines={1}` |
| First-line alignment | Align an icon with the first line of multiline text | `row firstLine`, using the same three-slot roles |
| Pin | Badges and other elements outside normal content flow | `as="pin-*"`; choose a real public position value |

Read the [Frame guide](../components/frame/reference.md) when you need the full composition, line-height, and layout rules. Choose singleLine for single-line labels and firstLine for prose that may wrap. Request first-line alignment explicitly; do not apply it to every horizontal container. Do not replace an existing layout capability with a fixed height, negative margin, or private page patch.

On narrow screens, adapt page arrangement, wrapping, truncation, or local scrolling to the design and content constraints. Do not keep shrinking text and functional icons. Inherited context, component size, and actual dimensions are defined by their respective public APIs; their numbers are not interchangeable.

<a id="颜色先语义再数值"></a>

## Color: semantics before values

Use these parameters to preserve or reproduce a SnowUI design. When an external app needs its own design values, make the smallest change through the public entry points described in the styling guide. Do not impose SnowUI-maintained tokens or utilities as a requirement on consumer projects.

Use a color Prop only when the component publicly supports it. Choose semantic values such as `Brand`, `Primary`, `Black40`, or `Background1` according to its documentation. For page colors, use the corresponding `var(--brand)`, `var(--black-40)`, or `var(--background-1)`. Black and White vary with the theme; StaticBlack and StaticWhite denote fixed black and white.

Preserve the meaning of photos and brand assets; they do not give ordinary text, backgrounds, and controls arbitrary colors. Record a Figma Style or Variable name together with its mode and theme. Do not treat a sampled screenshot color or light-mode HEX as the sole token value. Use the Figma guide for names and the [token directory](../reference/tokens.md) for declarations and conditions.

<a id="几何与排版参数"></a>

## Geometry and typography tokens

| Goal | Token family | Rule |
| --- | --- | --- |
| Font size and line height | `--text-*` / `--leading-*` | Choose matching levels and keep text readable |
| Dimensions | `--size-*` | For dimensions, not font size or a component’s logical size |
| Padding | `--padding-*` | Distance between content and its shell |
| Gap | `--gap-*` | Space between neighboring elements or page regions |
| Border | `--border-*` | Border width, not spacing |
| Radius | `--radius-*` | Choose ordinary steps or a fully rounded shape by meaning |

Token numbers are not universal pixel values, and a page utility suffix need not match a token number. Read exact declarations from the CSS-generated token directory; rem values depend on the root font size. Do not copy a separate fixed-value chart or borrow from a different category merely because the computed values happen to match.

```html
<section style="display: flex; flex-direction: column; gap: var(--gap-3); padding: var(--padding-4); background: var(--surface-1);">
  <h2 style="font-size: var(--text-18); line-height: var(--leading-18);">Project files</h2>
</section>
```

This example shows only a page region and text. Use an existing Card, form, or overlay component when its visual or behavioral capabilities are needed.

<a id="修改样式应该在哪里"></a>

## Where to change styles

First match the appearance with public component Props and preserve the existing look where possible. When a change is necessary, use your own class (including Tailwind already in the project), then an instance style. The full order and scope of public root, parts, child, and override entry points are in the [styling guide](./styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F); this guide does not create another priority order. Read the target component’s `styles.md` only when customization is needed.

Do not force one radius onto every component, set unregistered variables, or invent parts. Verify local and global theme scopes separately and record upgrade and migration boundaries when changing source.

<a id="完成还原前的检查"></a>

## Checks before finishing

- Each region has a reason to use a component or ordinary semantic structure; exports and APIs match the installed version.
- Color, font size and line height, dimensions, padding, gap, border, and radius use the correct token families; explicit design differences remain visible.
- Component APIs and dependencies match the installed version.
- Check structure, content, layout, padding ownership, alignment, long text, narrow screens, light and dark themes, and necessary states in the real page. Then check keyboard and accessibility behavior.

A code check or screenshot alone cannot prove hidden interactions or every responsive scenario. Read the relevant API, types, reference, styles, or examples when evidence is missing.

## Figma Community and design resources

[Get SnowUI Design System on Figma Community](https://www.figma.com/community/file/1388431032861751537), then read the [public component and variable map](../reference/figma-map.md) or [resource relationships](../reference/design-system-resources.md) as needed. Provide your own copy URL and relocate by page or collection, name, type, mode, and current value; verify node IDs in that copy even when they happen to match the reference file.
