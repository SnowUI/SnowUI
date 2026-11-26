# SelectButton changelog

Reviewed against Chinese source SHA-256 `10fe5e7a4f407e47bed3c00e6bccd9677d4aa4a35fde6350be36f1809cc12639`. For version differences, check the installed package as well.

<a id="v110-2026-11-24"></a>

### v1.1.0 (2026-11-24)

- Inherited host `Button` `tooltip` support and added `Tooltip` to `parts` to forward configuration to the trigger button’s built-in `Tooltip`.

<a id="v102-2026-09-02"></a>

### v1.0.2 (2026-09-02)

- 2026-09-21: Aligned the usage guide, source Prop table, and Site / AI reading entry. Documentation only; component behavior is unchanged.

- Expanded per-Prop descriptions, default fallbacks, and usage boundaries based on the current source. Runtime behavior is unchanged.

<a id="v101-2026-08-29"></a>

### v1.0.1 (2026-08-29)

- Removed a mistakenly applied outer Field border in button-trigger mode, restoring the real Button host as the sole owner of the entire visual surface.
- SelectButton disables the Button host’s hover background enlargement by default while retaining color feedback; `scaleOnHover={true}` explicitly re-enables it.

<a id="v100-2026-07-03"></a>

### v1.0.0 (2026-07-03)

- Initial release with specialized host behavior, built-in default mode, and explicit composition mode.

[Component guide](../select-button.md) · [Full reference](./reference.md)
