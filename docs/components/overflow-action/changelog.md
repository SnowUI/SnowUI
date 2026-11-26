# OverflowAction changelog

Reviewed against Chinese source SHA-256 `4840b763d5bde6f9c356b42f0a43f13272b90036c79e4b9c53bd13bb1e974f06`. For version differences, check the installed package as well.

<a id="v110-2026-11-24"></a>

### v1.1.0 (2026-11-24)

- Added public `tooltip` toggle (disabled by default, inheriting parent `OverflowActions.tooltip`) and `parts.Tooltip`, enabling SnowUI `Tooltip` on `iconOnly` and `compact` built-in buttons (replacing native `title`) and propagating default tooltip settings to any Button-based control inside `control` via shared `ButtonTooltipContext` (while isolating explicit controls from parent `parts` via `ComponentPartsBoundary`).

<a id="v101-2026-09-02"></a>

### v1.0.1 (2026-09-02)

- 2026-09-21: Aligned the usage guide, source Prop table, and Site / AI reading entry. Documentation only; component behavior is unchanged.

- Expanded per-Prop descriptions, default fallbacks, and usage boundaries based on the current source. Runtime behavior is unchanged.

<a id="v100-2026-08-12"></a>

### v1.0.0 (2026-08-12)

- Initial release.

[Component guide](../overflow-action.md) · [Full reference](./reference.md)
