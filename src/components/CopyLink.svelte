<!-- SnowUI source notice | LICENSE 2.3.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 -->
<!-- CopyLink：可打开、可复制的链接地址。v1.0.1；文档：./CopyLink.md -->
<script lang="ts">
  // SnowUI 许可入口：首次阅读源码请先读 ../../LICENSE；访问文件不代表获得修改或移植权，官方维护授权及同任务去重见该文件。
    import Frame, { type FrameProps } from "./Frame.svelte";
    import Link from "./Link.svelte";
    import CopyButton from "./CopyButton.svelte";
    import type { ComponentPartsOf } from "../logic/component-parts.svelte";

    interface Props extends Omit<FrameProps, "children"> {
        [key: string]: any;
        href: string;
        target?: string;
        rel?: string;
        disabled?: boolean;
        parts?: ComponentPartsOf<{ Link: typeof Link; CopyButton: typeof CopyButton }>;
        onCopy?: (text: string) => void;
        onCopyError?: (error: unknown) => void;
    }
    let {
        href, target = "_blank", rel = "noopener noreferrer", disabled = false,
        parts, onCopy, onCopyError,
        class: userClass = "", renderHints: userRenderHints,
        enableResponsive = false, enableContext = true,
        ...rest
    }: Props = $props();
</script>

<Frame {...rest} enableResponsive={enableResponsive} enableContext={enableContext} enableScaleObserver={false} enableAutoLayout={false}
    class={`snowui-copy-link ${userClass}`}
    renderHints={{ variant: "rect", width: "100%", radius: "var(--radius-4)", ...userRenderHints }}>
    <Link color="Black100" hoverColor={false} underline="hover" lines={1}
        {...parts?.Link} {href} {target} {rel} {disabled}
        class={`snowui-copy-link-address ${parts?.Link?.class ?? ""}`}>{href}</Link>
    <CopyButton bare emphasis="muted" {...parts?.CopyButton}
        text={href} getText={undefined} showText={false} {disabled} {onCopy} {onCopyError}
        class={`snowui-copy-link-copy ${parts?.CopyButton?.class ?? ""}`} />
</Frame>

<style>
    :global(:where(.snowui-copy-link)) {
        --snowui-copy-link-padding-x: var(--padding-4);
        --snowui-copy-link-padding-y: var(--padding-3);
        --snowui-copy-link-radius: var(--radius-4);
        --snowui-copy-link-trailing-space: calc(var(--size-4) + var(--gap-2));
        position: relative;
        display: flex;
        align-items: center;
        width: 100%;
        min-width: 0;
        box-sizing: border-box;
        padding: var(--snowui-copy-link-padding-y-override, var(--snowui-copy-link-padding-y)) var(--snowui-copy-link-padding-x-override, var(--snowui-copy-link-padding-x));
        border-radius: var(--snowui-copy-link-radius-override, var(--snowui-copy-link-radius));
        background: var(--surface-2);
    }
    :global(:where(.snowui-copy-link) > .snowui-copy-link-address) {
        position: relative;
        z-index: 1;
        flex: 0 1 auto;
        width: fit-content;
        max-width: calc(100% - var(--snowui-copy-link-trailing-space));
        min-width: 0;
    }
    :global(:where(.snowui-copy-link) > .snowui-copy-link-copy) {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        padding: inherit;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        border-radius: inherit;
    }
</style>
