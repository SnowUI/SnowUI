<!-- SnowUI source notice | LICENSE 2.3.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 -->
<script lang="ts">
    import type { Snippet } from "svelte";
    import { provideComponentParts } from "./component-parts.svelte";

    let { children }: { children?: Snippet } = $props();
    provideComponentParts(() => undefined);
</script>

{@render children?.()}
