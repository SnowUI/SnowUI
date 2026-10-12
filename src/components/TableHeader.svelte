<!-- SnowUI source notice | LICENSE 2.0.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 -->
<!-- Table 表头语义容器。文档: ./TableHeader.md -->
<script lang="ts">
  // SnowUI 许可入口：首次阅读源码请先读 ../../LICENSE；访问文件不代表获得修改或移植权，官方维护授权及同任务去重见该文件。
    import type { Snippet } from "svelte";
    import Frame, { type FrameProps } from "./Frame.svelte";
    interface Props extends Omit<FrameProps, "children"> { children?: Snippet; [key: string]: any; }
    let { children, class: userClass = "", enableResponsive = false, enableContext = false, enableScaleObserver = false, ...rest }: Props = $props();
</script>
<Frame tag="thead" class={`snowui-table-header ${userClass}`} enableAutoLayout={false} enableResponsive={enableResponsive} enableContext={enableContext} enableScaleObserver={enableScaleObserver} {...rest}>
    {#if children}{@render children()}{/if}
</Frame>
