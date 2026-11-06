# SnowUI Components

A Svelte 5 component library for building interfaces. Component documentation is available alongside the source in `src/components/` and at [snowui.dev](https://snowui.dev/components).

## Install

```sh
pnpm add @snowui-design-system/components
```

Import components and shared styles in your application:

```svelte
<script lang="ts">
  import { Button } from '@snowui-design-system/components';
  import '@snowui-design-system/components/styles';
</script>

<Button>Continue</Button>
```

## Develop

```sh
pnpm install
pnpm build
```

The `src/components/` directory contains components and their documentation. Shared logic, motion, and styles live under `src/logic/`, `src/motion/`, and `src/styles/`.
