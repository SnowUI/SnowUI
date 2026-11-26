# NumberFlow changelog

Reviewed against Chinese source SHA-256 `4fc8924fe96fb69d958d30e8c30235ec684dc303d3322038372d3a95459b8b04`. For version differences, check the installed package as well.

<a id="v210-2026-09-17"></a>

### v2.1.0 (2026-09-17)

- 2026-09-21: Aligned the usage guide, source Prop table, and Site / AI reading entry. Documentation only; component behavior is unchanged.

- Rechecked the old layout measurement, node updates, and animation startup order in `number-flow@0.6.2`, while retaining SnowUI continuous updates and staggered motion.
- `chromatic()` now uses one visible overlay: one-, three-, and ten-digit numbers all cover the full color spectrum and transition directly to the final text color. It no longer paints through a transparent wheel viewport or leaves black underlying text at colorful edges.
- The documentation now covers the original code repository, official documentation, MIT attribution, SnowUI extensions, and the boundary of upstream interfaces that SnowUI does not expose.

<a id="v201-2026-09-09"></a>

### v2.0.1 (2026-09-09)

- `motionColor` now covers every target character. Preserved characters and formatting symbols join the unified per-character color fallback and support `chromatic()`. The main color stage lasts a fixed `550ms`, matching FlowText’s default, then falls back over a shared `280ms linear` stage; the digit wheel keeps its own `transition.duration`. Full timing follows TextMotionSpec §2.1.
- Character-change effects keep their existing rules. Final original colors appear when no color is set, animation is disabled where applicable, or reduced motion applies. Continuous updates replan the color sequence, and unmount cleans up color animation.

<a id="v200"></a>

### v2.0.0

- Frame now hosts the public root, supporting formatting, trends, cycling digits, prefixes and suffixes, width transitions, Skeleton, and a reduced-motion fallback.

[Component guide](../number-flow.md) · [Full reference](./reference.md)
