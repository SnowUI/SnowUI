# SnowUI Components

A Svelte 5 component and block library for building interfaces, dashboards, and admin panels.

- Online documentation & interactive previews: https://snowui.dev/components
- Online AI documentation: https://snowui.dev/llms.txt (English: https://snowui.dev/llms-en.txt)
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

## Package Contents & Source Archive

The npm package ships compiled client/server Svelte 5 modules (`dist/`), shared styles, and [component-catalog.json](./component-catalog.json). Source `.svelte`, `.ts`, and `.md` files live under `src/` in the official source archive (`pnpm install --frozen-lockfile && pnpm build`).
