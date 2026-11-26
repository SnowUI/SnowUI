# SelectButton

Choose one dropdown option from a button, suited to toolbars and compact filters.



Package: `@snowui-design-system/components`. Import: `import { SelectButton } from '@snowui-design-system/components';`. Source fingerprint: `e945b7c2ffcdf4ed76e5172bada71cac8fcb6d1676d12af959ad5af500060d8e`.

## Usage choices

Persistent mode inherits Select required feedback; action mode does not require a retained selection.

Use SelectButton for a button that opens a choice or command menu. For a single form field, use Select. For actions that collapse according to available width, use OverflowActions.

- Provide a unique string value for each option. Use label to customize the trigger text, or children to replace the list.
- action mode does not update value or call onchange. Configure the trigger with root-level Props; parts has no Button entry.

SelectButton hides search by default; enable it with search. Its Listbox is at least as wide as the button and may grow for content. It is horizontally centered on the button, with Listbox viewport collision handling. Options fill the panel and omit selection checks. Persistent mode reuses Select's selected-item positioning: reopening restores the current selection's highlight, focus, and scroll position, centering that item on the trigger without a second selection state. This memory lasts until the instance state resets; it does not automatically persist across refresh. Action mode runs commands without saving a selection and opens below the trigger. Listbox owns the search placeholder, 160px search minimum width, and width locking while open. bare and emphasis pass directly to Button: bare defaults to 100% opacity; use emphasis="muted" for a secondary trigger.

## Read as needed

- [API](./select-button/api.md): Public Props and defaults
- [Types and states](./select-button/types.md): Public type declarations and binding rules
- [Full reference](./select-button/reference.md): Composition and interaction boundaries
- [Styles](./select-button/styles.md): Registered public overrides
- [Examples](./select-button/examples.md): Code and preview links
- [Image index](https://snowui.dev/llms/components/select-button/images.json): Use only if appearance remains uncertain
- [Changelog](./select-button/changelog.md): Version history reviewed in English

[Design guide](../guides/design-system.md) · [Styling guide](../guides/styling.md)
