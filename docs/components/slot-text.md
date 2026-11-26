# SlotText

Animate text changes character by character with vertical rolls for short labels, status, and counters.



Package: `@snowui-design-system/components`. Import: `import { SlotText } from '@snowui-design-system/components';`. Source fingerprint: `cee0e81a56aa8451c34584ae5818f043d4be7358aa4f26230543fa18171f0599`.

## Usage choices

Use SlotText for a slot-style text replacement animation. Use Text for static text, or NumberFlow or NumericText for numeric scrolling.

- Update text for new content. replayKey can replay unchanged content; playOnMount controls animation on first display.
- Set animated=false to display the result immediately. Enable respectMotionPreference when the animation should follow the system reduced-motion setting.

## Read as needed

- [API](./slot-text/api.md): Public Props and defaults
- [Types and states](./slot-text/types.md): Public type declarations and binding rules
- [Full reference](./slot-text/reference.md): Composition and interaction boundaries
- [Styles](./slot-text/styles.md): Registered public overrides
- [Examples](./slot-text/examples.md): Code and preview links
- [Image index](https://snowui.dev/llms/components/slot-text/images.json): Use only if appearance remains uncertain
- [Changelog](./slot-text/changelog.md): Version history reviewed in English

[Design guide](../guides/design-system.md) · [Styling guide](../guides/styling.md)
