# Dialog changelog

Reviewed against Chinese source SHA-256 `859fd9704fc7a3099bb0f239261f8278ee45e917ce933941798ea8b9688db71d`. For version differences, check the installed package as well.

<a id="v130-2026-11-23"></a>

### v1.3.0 (2026-11-23)

- Fixed-header scrolling: when a title or close button is present, the title, title separator, and close button stay fixed while only the body viewport scrolls; uses the shared overlay scrollbar bounded within the Panel top and bottom padding, with 4px bleed padding on the viewport so focus rings on inner controls (Textarea / Input / Button) are never clipped. Applies consistently across all sizes and activation modes.

<a id="v120-2026-11-23"></a>

### v1.2.0 (2026-11-23)

- Added single-dialog guarantee: opening any Dialog automatically closes other open Dialogs on the page (`onOpenChange(false)` in panel mode, `hideDialog` in embedded and template modes); documented switching content within the same Dialog for multi-step flows while X and Escape close the entire dialog.

<a id="v111-2026-10-23"></a>

### v1.1.1 (2026-10-23)

- Keep at least 4 CSS px between footer actions under smaller fonts or gap scales. Larger preferred gaps and explicit inline layouts remain effective. Panel/body spacing, wrapping, direct item size context, roles, and closing behavior remain unchanged.

- 2026-09-21: Aligned the usage guide, source Prop table, and Site / AI reading entry. Documentation only; component behavior is unchanged.

- `closeOnOutside` now defaults to true. Consumers that must prevent backdrop dismissal should explicitly pass false; this applies to all three activation modes.

- v1.1.0: Added a built-in title, close button, optional separator, and action area. Updated the three padding, radius, and spacing sizes from Workshop; footer `Button as="item"` receives its default size through Context.

- v1.0.0: Added Dialog with Panel, Inline, and Template modes, a focus trap, scroll lock, and backdrop variants.

[Component guide](../dialog.md) · [Full reference](./reference.md)
