<!-- SnowUI source notice | LICENSE 2.2.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 -->
<!--
 ImageGroup 图片组组件
  v1.1.2
-->

<script lang="ts">
  // SnowUI 许可入口：首次阅读源码请先读 ../../LICENSE；访问文件不代表获得修改或移植权，官方维护授权及同任务去重见该文件。
    import { setContext, type Component, type Snippet } from "svelte";
    import Frame, { type FrameProps } from "./Frame.svelte";
    import {
        IMAGE_GROUP_CONTEXT_KEY,
        getImageGroup,
        getSizeContext,
        getSize,
        type ResourceSize as BaseResourceSize,
    } from "../context";
    import type { PreviewMode } from "../logic/image-preview";

    type ImageGroupLayout = "row" | "column" | "grid";
    type ImageGroupSize = BaseResourceSize | 56 | 64 | 72;

    interface Props extends Omit<FrameProps, "gap"> {
        size?: ImageGroupSize;
        layout?: ImageGroupLayout;
        previewMode?: PreviewMode;
        enableResponsive?: boolean;
        enableContext?: boolean;
        children?: Snippet;
        [key: string]: any;
    }

    let {
        size = undefined,
        layout = "row",
        previewMode = undefined,
        enableResponsive = true,
        enableContext = true,
        class: className = "",
        style: userStyle = "",
        children,
        gap: _gap = undefined,
        ...rest
    }: Props = $props();

    getSize();
    const sizeCtx = getSizeContext();
    const imageGroupCtx = getImageGroup();
    const contextSize = $derived(
        imageGroupCtx?.size !== undefined ? imageGroupCtx.size : sizeCtx?.size,
    );
    const resolvedSize = $derived(size ?? contextSize);
    const resolvedPreviewMode = $derived(previewMode ?? imageGroupCtx?.previewMode);
    const isRow = $derived(layout === "row");
    const isColumn = $derived(layout === "column");
    const isGrid = $derived(layout === "grid");
    interface PreviewItem {
        src?: string | Component;
        alt?: string;
    }
    let previewItems: PreviewItem[] = [];

    function registerPreviewItem(item: PreviewItem) {
        const entry = { ...item };
        previewItems.push(entry);
        return {
            getIndex: () => previewItems.indexOf(entry),
            dispose: () => {
                const targetIndex = previewItems.indexOf(entry);
                if (targetIndex < 0) return;
                previewItems.splice(targetIndex, 1);
            },
        };
    }

    setContext(IMAGE_GROUP_CONTEXT_KEY, {
        get size() {
            return resolvedSize;
        },
        get previewMode() {
            return resolvedPreviewMode;
        },
        registerPreviewItem,
        getPreviewItems: () => previewItems,
    });
</script>

<Frame
    enableResponsive={enableResponsive}
    enableContext={enableContext}
    enableScaleObserver={false}
    row={isRow}
    column={isColumn}
    grid={isGrid}
    gap={1}
    class={["snowui-image-group", className].filter(Boolean).join(" ")}
    style={userStyle || undefined}
    data-layout={layout}
    {...rest}
    renderHints={{
        variant: rest.renderHints?.variant ?? "rect",
        width: rest.renderHints?.width ?? "5rem",
        height: rest.renderHints?.height ?? "2.5rem",
        radius: rest.renderHints?.radius ?? "var(--radius-3)",
        rows: rest.renderHints?.rows,
    }}
>
    {#if children}
        {@render children()}
    {/if}
</Frame>

<style>
    :global(:where(.snowui-image-group)) {
        gap: var(--snowui-image-group-gap-override, var(--gap-1));
        vertical-align: top;
        position: relative;
        --snowui-image-group-align-items: flex-start;
        --snowui-image-group-justify-content: flex-start;
        align-items: var(
            --snowui-image-group-align-items-override,
            var(--snowui-image-group-align-items)
        );
        justify-content: var(
            --snowui-image-group-justify-content-override,
            var(--snowui-image-group-justify-content)
        );
    }

    :global(:where(.snowui-image-group)[data-layout="grid"]) {
        grid-template-columns: repeat(2, max-content);
    }
</style>
