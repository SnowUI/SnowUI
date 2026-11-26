# Chip changelog

Reviewed against Chinese source SHA-256 `bd23acadca9c50944b513ef2a1c96cb8701d0b5907a625cdd809857ef4877369`. For version differences, check the installed package as well.

<a id="v120-2026-10-22"></a>

### v1.2.0 (2026-10-22)

- Internal composition uses the Frame single-line preset. Dot and other attachments retain at least 4 CSS px spacing from text. Only Tag retains its internal spacing exception; colors, icon replacement and size presets remain unchanged.

- 2026-09-21: Aligned the usage guide, source Prop table, and Site / AI reading entry. Documentation only; component behavior is unchanged.

- 2026-09-07 (docs): Completed the public `children` description and clarified `size` context fallback and `showDot` resolution/override precedence; runtime behavior is unchanged.

<a id="v110-2026-06-21"></a>

### v1.1.0 (2026-06-21)

<a id="变更"></a>

#### Changes

- **CH-Icon.2** The `background` variant no longer shows Dot by default; added the explicit `showDot` switch.
- **CH-Padding.1** On the side with a leading or trailing icon, the `background` variant tightens padding by size: 4px for `sm`, 8px for `lg`.

<a id="v100-2026-05-09"></a>

### v1.0.0 (2026-05-09)

<a id="新增"></a>

#### Added

- **CH-Init.1** Added Chip with `default` and `background` visual variants and `sm` and `lg` sizes.
- **CH-Layout.1** Three-slot auto layout (leading / content / trailing) reuses the Frame `row` and auto-layout.css protocol.
- **CH-Icon.1** Built-in leading Dot icon follows §2.7.1 automatic detection of an external `data-as="leading"` replacement.
- **CH-Color.1** Default color inherits from the parent (`currentColor`); the `background` variant derives its background and border from `currentColor` and alpha via `color-mix`.

[Component guide](../chip.md) · [Full reference](./reference.md)
