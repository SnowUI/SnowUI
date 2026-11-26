# AvatarGroup

Arrange or stack multiple avatars and show the count of hidden members in team and collaborator lists.



Package: `@snowui-design-system/components`. Import: `import { AvatarGroup } from '@snowui-design-system/components';`. Source fingerprint: `fc607ff59d1f6ad836b2059654be00bfcc94f3931701814dfa01912d3cc46a9e`.

## Usage choices

Use AvatarGroup to display several participants in a row or stack. Use an ordinary list for contact details rather than placing whole rows of information in AvatarGroup.

- Direct children that participate in layout and the +N count must declare as="item". Use max to limit the visible count.
- In row layout, size is the size of one avatar. In stack layout, size is the group container size. The same value does not imply the same avatar size in both layouts.

## Read as needed

- [API](./avatar-group/api.md): Public Props and defaults
- [Types and states](./avatar-group/types.md): Public type declarations and binding rules
- [Full reference](./avatar-group/reference.md): Composition and interaction boundaries
- [Styles](./avatar-group/styles.md): Registered public overrides
- [Examples](./avatar-group/examples.md): Code and preview links
- [Image index](https://snowui.dev/llms/components/avatar-group/images.json): Use only if appearance remains uncertain
- [Changelog](./avatar-group/changelog.md): Version history reviewed in English

[Design guide](../guides/design-system.md) · [Styling guide](../guides/styling.md)
