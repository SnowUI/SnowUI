# MenuItem

Present an option in a list or quick-action menu with icon, selected, and disabled states.



Package: `@snowui-design-system/components`. Import: `import { MenuItem } from '@snowui-design-system/components';`. Source fingerprint: `6d8740207344a7bd8a0bd867abff2c29d75429a0feb2026f04b95b3d5a61361d`.

## Usage choices

Use MenuItem as an option within Listbox. For ordinary navigation, use Link or SidebarItem. A content list does not make every row a selectable option.

- Use as="item" inside Listbox, and give each option in the same list a unique value.
- disabled prevents activation. leading and trailing hold attachments; closeOnSelect controls whether selection closes the owning panel.
- The built-in action for deleting a custom option follows LocaleProvider. Query text, option names, and values remain unchanged; the owning Listbox still manages deletion.

## Read as needed

- [API](./menu-item/api.md): Public Props and defaults
- [Types and states](./menu-item/types.md): Public type declarations and binding rules
- [Full reference](./menu-item/reference.md): Composition and interaction boundaries
- [Styles](./menu-item/styles.md): Registered public overrides
- [Examples](./menu-item/examples.md): Code and preview links
- [Image index](https://snowui.dev/llms/components/menu-item/images.json): Use only if appearance remains uncertain
- [Changelog](./menu-item/changelog.md): Version history reviewed in English

[Design guide](../guides/design-system.md) · [Styling guide](../guides/styling.md)
