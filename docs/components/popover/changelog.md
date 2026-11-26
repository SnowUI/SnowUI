# Popover changelog

Reviewed against Chinese source SHA-256 `7c0caa376296b04a5a948acb8f9da0f9339bbacbd11370c74de3b6abc42252bb`. For version differences, check the installed package as well.

<a id="v311-2026-06-02"></a>

### v3.1.1 (2026-06-02)

- 2026-10-23：The icon and short label in the arbitrary Frame host Test use the public single-line composition, retaining a 4px gap and complete accessible text with truncation. Parent-host activation and the Popover runtime remain unchanged; documentation and example revision only.

- 2026-09-21: Aligned the usage guide, source Prop table, and Site / AI reading entry. Documentation only; component behavior is unchanged.

- Popover hover delay changed to `450ms`, matching Tooltip’s first hover delay.
- Popover directly reuses Tooltip’s initial delay constant but does not join Tooltip’s `300ms` quick-switch window.

<a id="v310-2026-05-15"></a>

### v3.1.0 (2026-05-15)

- Added **Inline mode** with `as="popover"`: a zero-configuration composition in Tooltip style. Placing Popover inside any host automatically binds its parent as anchor and trigger.
- The three modes are formally named **Panel / Inline / Template**.
- Added POP-30–POP-33 examples for Inline mode click, hover, arbitrary hosts, and manual close.

<a id="v300-2026-05-15"></a>

### v3.0.0 (2026-05-15)

- Deprecated the former Popover definition in favor of Template + ID activation mode, following Toast TS-10.
- Merged QuickAction (small size) and replaced SearchPopup (medium size); those source components were removed.
- The trigger button no longer lives inside Popover; connect it through `data-popover-target` or `showPopover(id, anchorEl)`.
- Added imperative APIs `showPopover`, `hidePopover`, and `togglePopover` in `../logic/popover.svelte.ts`.
- Three sizes: `sm` (12/16), `md` (16/24), and `lg` (24/32), defaulting to `sm`.
- Renamed `closeOnOutsideClick` to the clearer `closeOn: "outside" | "manual"`.
- Kept static mode for free-form SP-02 style composition.

<a id="v200-2026-05-15已废弃"></a>

### v2.0.0 (2026-05-15) (deprecated)

- Changed to a general QuickAction-style floating container with a wrapping trigger.

<a id="v111-2026-02-03"></a>

### v1.1.1 (2026-02-03)

- Initial release.

[Component guide](../popover.md) · [Full reference](./reference.md)
