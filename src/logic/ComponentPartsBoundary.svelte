<script lang="ts">
    import type { Snippet } from "svelte";
    import { provideComponentParts } from "./component-parts.svelte";

    let { children }: { children?: Snippet } = $props();
    provideComponentParts(() => undefined);
</script>

{@render children?.()}
<!--! @license SnowUI-Commercial-2.4.0 https://snowui.dev/LICENSE (../../LICENSE) -->
