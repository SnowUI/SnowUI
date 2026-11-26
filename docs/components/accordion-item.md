# AccordionItem

Define one collapsible section within an Accordion, combining a heading and content under the parent expansion state.



Package: `@snowui-design-system/components`. Import: `import { AccordionItem } from '@snowui-design-system/components';`. Source fingerprint: `cd119cacc2301209eebda5a73db6254c322e6f57c0e0271841b5470af9d8d524`.

## Usage choices

Use AccordionItem as one expandable item inside Accordion. The parent coordinates expansion; do not use the item as a standalone page container.

- Provide a unique value inside the parent. Accordion manages the expanded state.
- Declare the title and body with direct Frame as="title" and Frame as="content" children. A direct as="trailing" child inside the title can replace the expansion icon.

## Read as needed

- [API](./accordion-item/api.md): Public Props and defaults
- [Types and states](./accordion-item/types.md): Public type declarations and binding rules
- [Full reference](./accordion-item/reference.md): Composition and interaction boundaries
- [Styles](./accordion-item/styles.md): Registered public overrides
- [Examples](./accordion-item/examples.md): Code and preview links
- [Image index](https://snowui.dev/llms/components/accordion-item/images.json): Use only if appearance remains uncertain
- [Changelog](./accordion-item/changelog.md): Version history reviewed in English

[Design guide](../guides/design-system.md) · [Styling guide](../guides/styling.md)
