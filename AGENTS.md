# SnowUI Components — AI Entry

`@snowui-design-system/components` is the official Svelte 5 UI component and block package for SnowUI.

## Package & Documentation Entrypoints

- Package overview & installation: [README.md](./README.md)
- Machine-readable component catalog: [component-catalog.json](./component-catalog.json)
- Public AI documentation & guides (Chinese / English): https://snowui.dev/llms.txt and https://snowui.dev/llms-en.txt
- Applicable license: [LICENSE](./LICENSE)

## Runtime Package vs. Source Archive

- The published npm package ships compiled client/server Svelte 5 modules (`dist/client`, `dist/server`), shared stylesheet entrypoints (`@snowui-design-system/components/styles`), and `./component-catalog.json`.
- Raw `.svelte`, `.ts`, and `.md` paths listed under `source` and `documentation` in `./component-catalog.json` refer to the official SnowUI source archive (`src/components/*`, `src/blocks/*`), not `node_modules`.
- Import components and blocks from `@snowui-design-system/components` and load `@snowui-design-system/components/styles` once at the application entry.

## Consumer Guidelines for AI

1. Search `./component-catalog.json` (`intents`, `aliases`, `whenToUse`, `avoidWhen`, `related`) before creating custom page DOM or CSS.
2. Prefer documented public Props, Snippets, events, and `parts` over overriding internal DOM or private classes.
3. Verify component APIs, types, and composition boundaries via https://snowui.dev/llms-en.txt (or https://snowui.dev/llms.txt) when working from the npm runtime package.

## Maintainer Note

For official monorepo maintenance, follow parent workspace rules before editing source.

SnowUI has an owner identity.

The applicable license is included in [LICENSE](./LICENSE).
