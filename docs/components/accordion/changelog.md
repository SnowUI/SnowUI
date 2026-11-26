# Accordion changelog

Reviewed against Chinese source SHA-256 `c024e60e037428b6d5b624a07d1681e98dfb36939ff78f6e0d6f8a83ccabc819`. For version differences, check the installed package as well.

<a id="v170-2026-10-23"></a>

### v1.7.0 (2026-10-23)

- Generated item titles reuse Frame single-line composition and Text truncation with complete accessible names. Typed parts.Text preserves configuration of generated title text; explicit children remain self-configured and do not read these parts.
- Titles and default indicator hosts use AccordionItem’s 4px spacing and 12px canvas floors. Prose and expansion state remain unchanged.

- 2026-10-23: Explicit title examples use Frame single-line composition and Text full-text access. Prose and initial expansion state remain unchanged; documentation and examples only.

- 2026-09-28: Removed the hover background and click-to-collapse behavior on the content. The default plus icon now rotates into ×; `indicatorVariant="minus"` retains the old mode. Content and title use the same font size at each size. `continuousHover` remains as a compatibility parameter with no effect.

- 2026-09-21: Unified the usage guide, source property table, and Site / AI reading entry points. Documentation only; component behavior is unchanged.

<a id="v162-2026-09-02"></a>

### v1.6.2 (2026-09-02)

- Expanded the per-property descriptions, default fallbacks, and usage boundaries to match the existing source. Runtime behavior is unchanged.

<a id="v161-2026-08-28"></a>

### v1.6.1 (2026-08-28)

- The default text color for expanded content now adapts to the theme through `var(--black-40)`; the title still inherits the host foreground color.
- Added `--snowui-accordion-content-color-override` for local content-color overrides.

<a id="v160-2026-08-28"></a>

### v1.6.0 (2026-08-28)

- Accordion gained one container-level Continuous Hover Background that moved and reshaped between Items with dedicated 60ms timing. An expanded Item covered its title and full content, with geometry remeasured as expansion height changed.
- Added `continuousHover`, enabled by default. Disabling it restored the ordinary title hover overlay.
- Clicking the noninteractive content area of an expanded Item could collapse it. Links, Buttons, form controls, interactive roles, and editable content kept their own behavior.
- Disabled Items blocked continuous hover without showing a background or highlighting an adjacent Item instead.

<a id="v150-2026-08-17"></a>

### v1.5.0 (2026-08-17)

- Changed the default appearance from the former `variant="default"` to `variant="filled"`.
- Renamed the former divided-line appearance to `variant="divided"`, matching DataTable terminology. Removed `variant="default"` entirely, without a compatibility alias.
- Changed the default `filled` Item background from `Background/2` to `Black/4%`.

<a id="v140-2026-07-04"></a>

### v1.4.0 (2026-07-04)

- Added a built-in mode by default: each entry in `items` accepts only `title` and `content`.
- Internally generates AccordionItem and title/content Frames, with `parts.AccordionItem` / `parts.Frame` customization.
- Retained explicit children composition; when children are present they replace the built-in items.

<a id="v131-2026-06-18"></a>

### v1.3.1 (2026-06-18)

<a id="动效调整"></a>

#### Motion adjustments

- The Accordion root injects `RESIZE_MOTION`; expanding and collapsing use transitions.dev resize timing and respect the system reduced-motion preference.

<a id="v130-2026-05-25"></a>

### v1.3.0 (2026-05-25)

<a id="破坏性变更"></a>

#### Breaking changes

- `AccordionItem` became a single-item container. Its title and content are now declared with direct child `Frame as="title"` / `Frame as="content"`.

<a id="样式调整"></a>

#### Style adjustments

- Background, corner radius, and dividers belong to the outer `AccordionItem`. When content collapses, it animates only height and opacity, avoiding a lingering background.

<a id="v120-2026-05-25"></a>

### v1.2.0 (2026-05-25)

<a id="破坏性变更-1"></a>

#### Breaking changes

- Removed the `bordered` appearance; Accordion retained only the design’s `default` and `filled` variants at that version.

<a id="样式调整-1"></a>

#### Style adjustments

- Aligned padding, radius, gap, font size, and default icon size for both appearances and three sizes with the Workshop design.
- The default `+ / -` icon is now drawn with internal component lines. Hover only increases icon color; it does not change the title background.

<a id="v110-2026-05-24"></a>

### v1.1.0 (2026-05-24)

<a id="破坏性变更-2"></a>

#### Breaking changes

- Changed from `items` data rendering to a compositional model.

<a id="v100-2026-05-23"></a>

### v1.0.0 (2026-05-23)

<a id="新功能"></a>

#### New features

- Added Accordion with single- or multiple-item expansion, controlled or uncontrolled state, disabled Items, visual variants, and three sizes.

[Component guide](../accordion.md) · [Full reference](./reference.md)
