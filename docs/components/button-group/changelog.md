# ButtonGroup changelog

Reviewed against Chinese source SHA-256 `ea14bf16f3a21f91d797fdfc7eea5f7664f0304725398607d37554207702dd81`. For version differences, check the installed package as well.

<a id="v121-2026-09-02"></a>

### v1.2.1 (2026-09-02)

- 2026-09-21: Aligned the usage guide, source Prop table, and Site / AI reading entry. Documentation only; component behavior is unchanged.

- Expanded per-Prop descriptions, default fallbacks, and usage boundaries based on the current source. Runtime behavior is unchanged.

<a id="v120-2026-08-29"></a>

### v1.2.0 (2026-08-29)

- Adjacent Button cells now show ButtonGroup’s built-in separator by default. Added the public `showSeparator` switch, enabled by default.
- A direct child `Separator as="separator"` remains for migration compatibility without drawing a duplicate; callers no longer need to insert separators manually.

<a id="v110-2026-08-19"></a>

### v1.1.0 (2026-08-19)

- Button items inside the composite control now disable hover enlargement by default while retaining color feedback. Instances can explicitly re-enable enlargement.

<a id="v101-2026-08-16"></a>

### v1.0.1 (2026-08-16)

- Disabled Auto Layout on the root because it does not belong to this layout model, avoiding gaps among Button hover / click cells and Separator.

<a id="v100-2026-05-19"></a>

### v1.0.0 (2026-05-19)

<a id="新功能"></a>

#### New features

- Initial release with embedded Button state, Separator dividers, four variants, and three sizes.

[Component guide](../button-group.md) · [Full reference](./reference.md)
