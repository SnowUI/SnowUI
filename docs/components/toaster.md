# Toaster

Display global toast() notifications in six positions with stacking motion and a visible-item limit.



Package: `@snowui-design-system/components`. Import: `import { Toaster } from '@snowui-design-system/components';`. Source fingerprint: `2e41655a2b7db7df78946a73db4adef1884dd5a7f945227215c17b527db63181`.

## Usage choices

Use Toaster as the display host for Toast notifications, coordinating their queue and layout. Organize an ordinary notification list in the business page instead of turning every historical message into a transient Toast.

- Mount Toaster as the notification host and create messages with toast. maxVisible limits the number shown simultaneously.
- Notifications created in one runtime share a queue. Mount one Toaster at the application root and reuse it across page regions; multiple hosts display duplicate copies of the same notification.
- offset and gap control position and stacking spacing. parts configures generated Toast appearance and Text labels for string notifications; explicit appearance on one message takes priority.

## Read as needed

- [API](./toaster/api.md): Public Props and defaults
- [Types and states](./toaster/types.md): Public type declarations and binding rules
- [Full reference](./toaster/reference.md): Composition and interaction boundaries
- [Styles](./toaster/styles.md): Registered public overrides
- [Examples](./toaster/examples.md): Code and preview links
- [Image index](https://snowui.dev/llms/components/toaster/images.json): Use only if appearance remains uncertain
- [Changelog](./toaster/changelog.md): Version history reviewed in English

[Design guide](../guides/design-system.md) · [Styling guide](../guides/styling.md)
