# SnowUI Components

A Svelte 5 component and block library for building interfaces, dashboards, and admin panels.

- Interactive component docs & live previews: https://snowui.dev/components
- Repository public documentation: `docs/README.md` (Simplified Chinese: `docs/zh/README.md` — in `https://github.com/SnowUI/SnowUI` & source archives)
- Online AI documentation: https://snowui.dev/llms-en.txt (Simplified Chinese: https://snowui.dev/llms.txt · MCP: `https://snowui.dev/mcp` · CLI: `https://snowui.dev/snowui.mjs`)
- Package AI entry & component catalog: [AGENTS.md](./AGENTS.md) · [component-catalog.json](./component-catalog.json)
- License: [LICENSE](./LICENSE)

## Install

```sh
pnpm add @snowui-design-system/components
```

Import components and load the package stylesheet once at your application entry:

```svelte
<script lang="ts">
  import { Button } from '@snowui-design-system/components';
  import '@snowui-design-system/components/styles';
</script>

<Button>Continue</Button>
```

## Package Contents vs. GitHub Repository

- **Published npm package (`node_modules/@snowui-design-system/components`)**: ships compiled client/server Svelte 5 modules (`dist/`), shared styles, [AGENTS.md](./AGENTS.md), [llms.txt](./llms.txt), and [component-catalog.json](./component-catalog.json). For full component APIs, guides, and examples from an npm install, use https://snowui.dev/llms-en.txt, `https://snowui.dev/mcp`, or `https://snowui.dev/snowui.mjs`.
- **GitHub repository & source archive (`https://github.com/SnowUI/SnowUI`)**: includes Svelte/TypeScript sources under `src/` and complete offline consumer documentation under `docs/` (`docs/README.md`, `docs/guides/*`, `docs/reference/*`, `docs/components/<slug>.md`, and `docs/zh/*`; build with `pnpm install --frozen-lockfile && pnpm build`).
