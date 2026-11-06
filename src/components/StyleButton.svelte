<!-- SnowUI source notice | LICENSE 2.3.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 -->
<!-- StyleButton：以真实 Button 为宿主的 SnowUI / Apple 风格切换按钮。 -->
<script lang="ts">
  // SnowUI 许可入口：首次阅读源码请先读 ../../LICENSE；访问文件不代表获得修改或移植权，官方维护授权及同任务去重见该文件。
    import { onMount, type ComponentProps, type Snippet } from "svelte";
    import Button from "./Button.svelte";
    import StyleButtonLogo from "../internal/StyleButtonLogo.svelte";
    import { useLocale } from "../i18n/locale.svelte";
    import {
        mergeComponentPartProps,
        useComponentPart,
    } from "../logic/component-parts.svelte";

    export type SnowUIStyleMode = "snowui" | "apple";

    type ButtonProps = ComponentProps<typeof Button>;
    interface Props extends Omit<
        ButtonProps,
        "children" | "onclick" | "disabled" | "aria-pressed"
    > {
        mode?: SnowUIStyleMode;
        defaultMode?: SnowUIStyleMode;
        applyToDocument?: boolean;
        ariaLabel?: string;
        snowuiLogo?: Snippet;
        appleLogo?: Snippet;
        children?: Snippet;
        disabled?: boolean;
        onModeChange?: (mode: SnowUIStyleMode) => void;
        onclick?: (event: MouseEvent) => void;
        [key: string]: any;
    }

    const locale = useLocale();
    const inheritedPart = useComponentPart<Props>("StyleButton");
    let { mode = $bindable(), ...explicitProps }: Props = $props();
    let {
        defaultMode = undefined,
        applyToDocument = true,
        ariaLabel = undefined,
        snowuiLogo,
        appleLogo,
        children,
        disabled = false,
        onModeChange,
        onclick,
        ...rest
    }: Props = $derived(
        mergeComponentPartProps(inheritedPart.current, explicitProps),
    );

    let internalMode = $state<SnowUIStyleMode>("snowui");
    let mounted = $state(false);
    const resolvedMode = $derived(mode ?? internalMode);
    const resolvedAriaLabel = $derived(
        ariaLabel
            ?? locale.t(
                resolvedMode === "apple"
                    ? "styleButton.toSnowUI"
                    : "styleButton.toApple",
            ),
    );

    function readDocumentMode(): SnowUIStyleMode {
        return document.documentElement.getAttribute("mode") === "ios"
            ? "apple"
            : "snowui";
    }

    function applyDocumentMode(nextMode: SnowUIStyleMode) {
        if (!applyToDocument) return;
        if (nextMode === "apple") {
            document.documentElement.setAttribute("mode", "ios");
            document.body?.setAttribute("mode", "ios");
        } else {
            document.documentElement.removeAttribute("mode");
            document.body?.removeAttribute("mode");
        }
    }

    onMount(() => {
        const initialMode = mode
            ?? defaultMode
            ?? (applyToDocument ? readDocumentMode() : "snowui");
        internalMode = initialMode;
        mode = initialMode;
        applyDocumentMode(initialMode);

        if (!applyToDocument) {
            mounted = true;
            return;
        }

        const observer = new MutationObserver(() => {
            const nextMode = readDocumentMode();
            internalMode = nextMode;
            if (mode !== nextMode) mode = nextMode;
        });
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["mode"],
        });
        mounted = true;
        return () => observer.disconnect();
    });

    $effect(() => {
        if (!mounted || mode === undefined) return;
        internalMode = mode;
        applyDocumentMode(mode);
    });

    function handleClick(event: MouseEvent) {
        if (disabled) return;
        onclick?.(event);
        const nextMode = resolvedMode === "apple" ? "snowui" : "apple";
        internalMode = nextMode;
        mode = nextMode;
        applyDocumentMode(nextMode);
        onModeChange?.(nextMode);
    }
</script>

<Button
    {...rest}
    iconOnly={!rest.bare && !children}
    {disabled}
    data-style-button
    data-mode={resolvedMode}
    aria-label={resolvedAriaLabel}
    aria-pressed={resolvedMode === "apple"}
    onclick={handleClick}
>
    {#if resolvedMode === "apple"}
        {#if appleLogo}
            {@render appleLogo()}
        {:else}
            <StyleButtonLogo mode="apple" />
        {/if}
    {:else}
        {#if snowuiLogo}
            {@render snowuiLogo()}
        {:else}
            <StyleButtonLogo mode="snowui" />
        {/if}
    {/if}
    {@render children?.()}
</Button>
