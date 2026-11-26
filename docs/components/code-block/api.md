# CodeBlock API

These are named public Props; inherited capabilities belong to their own public API.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `"default" \| "singleLine"` | "default" | singleLine uses the same Leading, Content, and Trailing slot arrangement as Input. It displays one line and omits height resizing, language label, line numbers, fullscreen view, and vertical scrolling. |
| `code` | `string` | "" | Code string to display. |
| `language` | `string` | "" | Language identifier and formatting parser. Supports Svelte, JavaScript, JSX, TypeScript, TSX, HTML, CSS, SCSS, Less, JSON, JSONC, YAML, Markdown, and GraphQL aliases. When empty, detects Svelte/HTML, JSON, or JS/TS from content. An unknown explicit language preserves the source text. |
| `format` | `boolean` | true | Format according to language by default. The normal view, fullscreen view, line numbers, and copy action share the result. false preserves source text; singleLine always preserves it. Source text is also preserved when parsing fails, the language is unknown, or input exceeds 200,000 characters. |
| `showLanguage` | `boolean` | — | Show the language label; defaults to false for prompt and true for other languages. |
| `showLineNumbers` | `boolean` | false | Show code line numbers in normal and fullscreen views, avoiding a horizontal jump when switching views. |
| `showCopyButton` | `boolean` | true | Show the built-in copy button. |
| `showExpandButton` | `boolean` | true | Show the built-in fullscreen button. |
| `horizontalScrollbarVisibility` | `"always" \| "hover"` | "always" | Show the horizontal scrollbar whenever content overflows, or only while the pointer is over the code block. |
| `visibleLines` | `number` | 5 | Maximum number of visible lines in the normal view. Shorter content sets its own height; longer content scrolls. The fullscreen view has no such limit. |
| `copyTimeout` | `number` | 2000 | How long the copied Check icon stays visible, in milliseconds, before the Copy icon returns. |
| `children` | `Snippet` | — | Code content or accessory source. Plain text becomes code; a child with as="trailing" replaces the right action area. |
| `parts` | `ComponentPartsOf<{ Indicator: typeof Indicator; CopyButton: typeof CopyButton; ExpandButton: typeof ExpandButton; }>` | — | Configure only the built-in CopyButton, ExpandButton, and Indicator. Explicit child accessories do not inherit these settings. Button emphasis can be set here. |

[Types](./types.md) · [Full reference](./reference.md) · [Styles](./styles.md)
