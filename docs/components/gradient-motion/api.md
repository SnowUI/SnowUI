# GradientMotion API

These are named public Props; inherited capabilities belong to their own public API.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `GradientMotionVariant` | "prism" | Glimm palette. avatar is a slow variant without blank frames for default avatar imagery. Legacy cosmic, matrix, electric, inferno, mystic, cyber, neon, plasma, and neatBlob values map to the Glimm palette. |
| `seed` | `string \| number` | — | Seed for preset selection. The same seed consistently selects the same palette. |
| `speed` | `number` | 1 | Multiplier for animation speed. |
| `duration` | `number` | 800 | Baseline Glimm sweep duration in milliseconds. |
| `size` | `number \| string` | — | Set width and height together. |
| `width` | `number \| string` | — | Graphic width. |
| `height` | `number \| string` | — | Graphic height. |
| `radius` | `number \| string` | "inherit" | Corner radius. Inherits the outer container by default so Avatar can clip it. |
| `intensity` | `number` | 1 | Glimm peakAlpha, clamped to the range 0–20. |
| `paused` | `boolean` | false | Pause the animation. |
| `decorative` | `boolean` | true | Treat the graphic as decoration; true emits aria-hidden="true". |
| `direction` | `GradientMotionDirection` | "ltr" | Direction of the light sweep. |
| `bandTight` | `number` | 14 | Gaussian tightness of the Glimm band. Larger values make the sweep band narrower. |
| `waveAmount` | `number` | 1 | Strength of the Glimm edge wave and overall avatar motion, in the range 0–20. |
| `rippleAmount` | `number` | 1 | Strength of fine ripples, in the range 0–20. |
| `brightness` | `number` | 1 | Brightness multiplier for Glimm band RGB, in the range 0–20. |
| `colorSpeed` | `number` | 1 | Time-phase speed multiplier for custom colors, in the range 0–20. At 0, colors stop flowing. |
| `highlightIntensity` | `number` | 1 | Multiplier for Fresnel and specular highlights, in the range 0–20. At 0, highlights are disabled. |
| `colors` | `GradientMotionColors` | — | Four HEX sample colors around a cycle. The component derives a mean, sine term, and cosine term for a continuous Glimm palette that flows with time phase. |
| `loopMotion` | `LoopMotionConfig` | — | Override the Frame loop bridge configuration; paused=true always takes precedence. Shader timing still uses speed, duration, and paused. Defaults to a linear infinite loop based on duration. |

[Types](./types.md) · [Full reference](./reference.md) · [Styles](./styles.md)
