<!-- Table 表头语义容器。文档: ./TableHeader.md -->
<script lang="ts">
    import type { Snippet } from "svelte";
    import Frame, { type FrameProps } from "./Frame.svelte";
    interface Props extends Omit<FrameProps, "children"> { children?: Snippet; [key: string]: any; }
    let { children, class: userClass = "", enableResponsive = false, enableContext = false, enableScaleObserver = false, ...rest }: Props = $props();
</script>
<Frame tag="thead" class={`snowui-table-header ${userClass}`} enableAutoLayout={false} enableResponsive={enableResponsive} enableContext={enableContext} enableScaleObserver={enableScaleObserver} {...rest}>
    {#if children}{@render children()}{/if}
</Frame>
