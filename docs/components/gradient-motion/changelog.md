# GradientMotion changelog

Reviewed against Chinese source SHA-256 `6c0b6205c9ce20f421001ebb6d4ebc423a6cdeece308a4bfc4a34a680011ac75`. For version differences, check the installed package as well.

<a id="v401-2026-08-15"></a>

### v4.0.1 (2026-08-15)

- 2026-09-21: Aligned the usage guide, source Prop table, and Site / AI reading entry. Documentation only; component behavior is unchanged.

- 2026-09-16 (rounded edge fix): The root clips the full WebGL composite with a single `clip-path` and alpha mask matching the final `radius` without re-applying canvas rounding, and removes extra cross-axis shader edge fade to prevent thin inner light seams while keeping sweep compositing, palettes, and motion unchanged.

- Registered the built-in shader palette, CSS fallback palette, and dedicated four-color `colors` art input as professional art-color exceptions. The exception does not extend to other component styling or motion contracts.

<a id="v400-2026-07-07"></a>

### v4.0.0 (2026-07-07)

<a id="glimmdev-还原"></a>

#### glimm.dev recreation

- Removed the older gradflow / Neat Blob visual algorithms and implemented the shader sweep gradient effect from `glimm@0.1.4`.
- Included six glimm cosine palettes: `prism`, `berry`, `lagoon`, `citrus`, `azure`, and `ember`.
- Recreated Gaussian bands, edge waves, ripple, Fresnel, specular highlights, entry fade, and premultiplied-alpha compositing.
- Default duration now matches glimm’s `800ms` sweep; older preset names remain as compatibility aliases.

<a id="v330-2026-06-13"></a>

### v3.3.0 (2026-06-13)

<a id="neat-blob"></a>

#### Neat Blob

- Added `variant="neatBlob"`. SnowUI named the effect; parameters come from `BLOB_PRESET` in `repos/neat-main/editor/src/components/presets.ts`.

<a id="v320-2026-06-13"></a>

### v3.2.0 (2026-06-13)

<a id="预设还原"></a>

#### Preset recreation

- Removed the old color-selection system and adopted all eight built-in `meerbahadin/gradflow` presets.

<a id="v310-2026-06-13"></a>

### v3.1.0 (2026-06-13)

<a id="视觉重写"></a>

#### Visual rewrite

- Reworked the main gradient algorithm after the Wave shader from `meerbahadin/gradflow`: three-color smoothstep mixing plus layered sine-wave, silk, smoke, stripe, and conic motion.

<a id="v300-2026-06-13"></a>

### v3.0.0 (2026-06-13)

<a id="视觉重写-1"></a>

#### Visual rewrite

- Completely rewrote the gradient effect as a built-in WebGL shader.

<a id="v200-2026-06-12"></a>

### v2.0.0 (2026-06-12)

<a id="破坏性变更仅视觉"></a>

#### Breaking change (visual only)

- Completely rewrote the gradient effect as three layers of organic fluid gradients: orbit, morph, and glow.

<a id="v100-2026-06-10"></a>

### v1.0.0 (2026-06-10)

<a id="新功能"></a>

#### New features

- Added GradientMotion with six gradient presets, a random-preset option, speed control, and avatar and background use cases.

[Component guide](../gradient-motion.md) · [Full reference](./reference.md)
