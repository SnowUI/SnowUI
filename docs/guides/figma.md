# Turn a SnowUI Figma Design into a Page

Source fingerprint: `ded0e98ab8ad340a`.

<a id="开始前确认资料"></a>

## Confirm the source first

Confirm access to the target Figma file and necessary component materials.

Break down the page with the [design guide](./design-system.md). Find components through the [component selection guide](./component-selection.md) and [component directory](../components/index.md). Existing components provide visuals and interactions; the page provides structure, business data, and routing. Read the [token directory](../reference/tokens.md) for exact parameters and the [styling guide](./styling.md) and relevant public component styles for internal visual changes.

Read the component and design materials needed for the page.

<a id="先读取设计语义再写代码"></a>

## Read design semantics before writing code

Prefer readable design data for the target frame: component instances and variants; Variable and Style names with their active modes; Auto Layout; size constraints; font and line height; border sides; icon assets; and states to implement. Record the target page, viewport, and theme.

A screenshot reveals broad structure and visible state, but cannot confirm color bindings, Hug / Fill, exact spacing, hidden interactions, or responsive constraints. Implement what is known first and list the missing evidence. Do not treat a sampled HEX or visual estimate as a SnowUI token. When no value is specified, say which existing parameter you used. When an explicit design value cannot be mapped, preserve the discrepancy and request confirmation.

Describe each region by intent, such as “left product navigation,” “switch file content tabs,” “choose view settings,” or “filter and select file rows,” then find the corresponding component. Names and appearance are clues only: content switching differs from parameter selection, and a persistent sidebar differs from an opening detail overlay.

<a id="将颜色名翻译为主题-token"></a>

## Map color names to theme tokens

Natural language maps phrases such as “Black 40,” “brand color,” and “Background 1” to semantics; an exact Figma Style or Variable maps to a real CSS variable. These are established examples. See the token directory for complete declarations and theme conditions:

| Figma name or user phrase | CSS variable | Public Prop value where semantic colors are supported | Page utility example |
| --- | --- | --- | --- |
| Black/40%, Black-40% | `--black-40` | `Black40` | `text-black-40`, `bg-black-40` |
| Brand | `--brand` | `Brand` | `text-brand`, `bg-brand` |
| Primary | `--primary` | `Primary` | `text-primary`, `bg-primary` |
| Background/1, Background-1 | `--background-1` | `Background1` | `bg-background-1` |
| Surface/1, Surface-1 | `--surface-1` | `Surface1` | `bg-surface-1` |
| Static Black/40% | `--static-black-40` | `StaticBlack40` | `text-static-black-40` |

Pass semantic values such as `Black40` and `Brand` only when the target component’s public API supports them. The component’s documentation determines the Prop name, background entry point, and affected element. Do not invent `color`, `background`, or `fill` Props for arbitrary components.

`Black/40%` changes with the theme and may resolve to white in dark mode; `Static Black/40%` stays black. `Brand` and `Primary` need not always have the same value. `Background` and `Background/1` are different names even if they happen to reference the same value in a theme. Preserve the active theme and mode in the mapping record; do not hard-code the light-mode HEX on a component.

Start with existing component Props, including variants, sizes, and color values, to match the design and preserve the original appearance where possible. For a genuine gap, follow the [style selection and override order](./styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F), changing only what is needed through your class (including existing Tailwind), an instance style, and real registered overrides. Do not reach into private DOM or classes. Use tokens from the proper family, such as `color: var(--black-40)`. Record an unmatched exact design value rather than silently substituting an approximation.

<a id="将布局几何与文字分别映射"></a>

## Map layout, geometry, and text separately

Figma Auto Layout describes direction, spacing, alignment, and distribution. Establish who owns padding, which elements are ordinary content or leading/trailing attachments, and which need Hug or Fill. Then choose public component composition or ordinary semantic HTML. Use absolute positioning only for elements genuinely outside normal flow, not to patch a layout you have not understood.

| Design input | Code mapping rule |
| --- | --- |
| Gap / space between items | Use `--gap-*`; page utility suffixes express nominal values and cannot be substituted for token indices. |
| Padding / distance from content to shell | Use `--padding-*`; the actual shell or content owner sets it, avoiding duplicate parent and child padding. |
| Fixed width and height, Hug, Fill | Check the component size API first; use layout and dimension tokens on ordinary pages. `size` is not a universal width/height Prop. |
| Stroke / Border | Record color, width, and inside/outside placement; prefer an existing public visual entry point for a component border. |
| Radius / corners | Use `--radius-*`; follow component semantics for pills and fully rounded shapes rather than mechanically applying one fixed radius. |
| Text style | Pair `--text-*` with `--leading-*`; preserve weight, font, and actual copy. |
| Effect / focus, shadow, blur | Check existing component effects and states; do not recreate form focus behavior in the page. |

A token suffix is not a pixel value, and token families need not use the same scale. For example, nominal Gap 8 maps to `--gap-2`, Padding 16 to `--padding-4`, Radius 12 to `--radius-3`, and Border 0.5 to `--border-1`. Read exact declarations from the token directory. Component `size` semantics come from its API and may use `sm` / `md` / `lg` or a numeric context; do not infer that `size={3}` must mean 12px width and height.

Geometry tokens express nominal dimensions through rem and category-specific factors. Root font size and zoom affect the rendered result. Responsive changes need design or content evidence; a viewport change does not automatically move every token to a different level. Check font size and line height together, and do not derive font size from dimension tokens.

This example only maps page text and tokens from their correct families. It does not implement a control, overlay, or form interaction; use the matching components for those regions:

```html
<section style="padding: var(--padding-4); background: var(--background-1);">
  <h2 style="font-size: var(--text-18); line-height: var(--leading-18);">Project files</h2>
  <p style="color: var(--black-40); font-size: var(--text-14); line-height: var(--leading-14);">Select a file to view details.</p>
</section>
```

<a id="先确认框架再生成实现"></a>

## Confirm the framework before implementation

The current component runtime package uses Svelte 5. If the target project can use it, import the public package, initialize its styles, and follow examples for the matching components. HTML describes the final page semantics and appearance; a Svelte example cannot simply be pasted into a plain HTML or React project and run.

For online AI tools, establish the target framework, dependencies, and file capabilities. Explain any necessary port or adapter, and do not claim an unavailable component has been installed. Use the public links instead of local maintainer paths.

<a id="以差异清单完成还原"></a>

## Finish with a discrepancy list

For each key region, record “design source → component / API → token / page structure.” For an unmapped color, geometry value, state, or interaction, say whether evidence, a public capability, or framework compatibility is missing, and explain the impact. Do not hide the difference with a similar color, arbitrary gap, or private page patch.

Verify the rendered page’s structure, content, layout, padding ownership, alignment, and visual details. Then check narrow screens, long text, light and dark themes, and required hover, focus, disabled, loading, and other states. A screenshot proves only its recorded viewport, theme, and state; passing a code check cannot replace real-page verification.

<a id="color-reference"></a>

## Complete color mapping

This mapping is generated from the same reference and actual CSS/color parser. Check exact values and theme conditions in the token directory. Use semantic colors only in public Props that actually support them.

| Figma aliases | CSS variable | Public semantic colors |
| --- | --- | --- |
| Black-100%, Black/100% | `--black-100` | `Black100`, `Black` |
| Black-80%, Black/80% | `--black-80` | `Black80` |
| Black-40%, Black/40% | `--black-40` | `Black40` |
| Black-20%, Black/20% | `--black-20` | `Black20` |
| Black-10%, Black/10% | `--black-10` | `Black10` |
| Black-4%, Black/4% | `--black-4` | `Black4` |
| White-100%, White/100% | `--white-100` | `White100`, `White` |
| White-80%, White/80% | `--white-80` | `White80` |
| White-40%, White/40% | `--white-40` | `White40` |
| White-20%, White/20% | `--white-20` | `White20` |
| White-10%, White/10% | `--white-10` | `White10` |
| White-4%, White/4% | `--white-4` | `White4` |
| Background-1, Background/1 | `--background-1` | `Background1` |
| Background-2, Background/2 | `--background-2` | `Background2` |
| Background-3, Background/3 | `--background-3` | `Background3` |
| Foreground | `--foreground` | `Foreground` |
| Background | `--background` | `Background` |
| Color-1, Color/1 | `--color-1` | `Color1` |
| Color-2, Color/2 | `--color-2` | `Color2` |
| Surface-1, Surface/1 | `--surface-1` | `Surface1` |
| Surface-2, Surface/2 | `--surface-2` | `Surface2` |
| Surface-3, Surface/3 | `--surface-3` | `Surface3` |
| Primary | `--primary` | `Primary` |
| Brand | `--brand` | `Brand` |
| Secondary-Purple, Secondary/Purple | `--secondary-purple` | `Purple` |
| Secondary-Indigo, Secondary/Indigo | `--secondary-indigo` | `Indigo` |
| Secondary-Blue, Secondary/Blue | `--secondary-blue` | `Blue` |
| Secondary-Cyan, Secondary/Cyan | `--secondary-cyan` | `Cyan` |
| Secondary-Mint, Secondary/Mint | `--secondary-mint` | `Mint` |
| Secondary-Green, Secondary/Green | `--secondary-green` | `Green` |
| Secondary-Yellow, Secondary/Yellow | `--secondary-yellow` | `Yellow` |
| Secondary-Orange, Secondary/Orange | `--secondary-orange` | `Orange` |
| Secondary-Red, Secondary/Red | `--secondary-red` | `Red` |
| Static Black/100%, Static-Black-100%, --static-black-100 | `--static-black-100` | `StaticBlack100` |
| Static Black/80%, Static-Black-80%, --static-black-80 | `--static-black-80` | `StaticBlack80` |
| Static Black/40%, Static-Black-40%, --static-black-40 | `--static-black-40` | `StaticBlack40` |
| Static Black/20%, Static-Black-20%, --static-black-20 | `--static-black-20` | `StaticBlack20` |
| Static Black/10%, Static-Black-10%, --static-black-10 | `--static-black-10` | `StaticBlack10` |
| Static Black/4%, Static-Black-4%, --static-black-4 | `--static-black-4` | `StaticBlack4` |
| Static White/100%, Static-White-100%, --static-white-100 | `--static-white-100` | `StaticWhite100` |
| Static White/80%, Static-White-80%, --static-white-80 | `--static-white-80` | `StaticWhite80` |
| Static White/40%, Static-White-40%, --static-white-40 | `--static-white-40` | `StaticWhite40` |
| Static White/20%, Static-White-20%, --static-white-20 | `--static-white-20` | `StaticWhite20` |
| Static White/10%, Static-White-10%, --static-white-10 | `--static-white-10` | `StaticWhite10` |
| Static White/4%, Static-White-4%, --static-white-4 | `--static-white-4` | `StaticWhite4` |

## Figma Community and design resources

[Get SnowUI Design System on Figma Community](https://www.figma.com/community/file/1388431032861751537), then read the [public component and variable map](../reference/figma-map.md) or [resource relationships](../reference/design-system-resources.md) as needed. Provide your own copy URL and relocate by page or collection, name, type, mode, and current value; verify node IDs in that copy even when they happen to match the reference file.
