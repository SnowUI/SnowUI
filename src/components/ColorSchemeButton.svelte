<!-- ColorSchemeButton：以真实 Button 为宿主的页面亮色 / 暗色方案切换按钮。 -->
<script lang="ts">
    import { onMount, type ComponentProps, type Snippet } from "svelte";
    import { ComponentIcon } from "../internal/component-icon/index";
    import Button from "./Button.svelte";
    import { useLocale } from "../i18n/locale.svelte";
    import {
        mergeComponentPartProps,
        useComponentPart,
    } from "../logic/component-parts.svelte";

    export type ColorScheme = "light" | "dark";

    type ButtonProps = ComponentProps<typeof Button>;
    interface Props extends Omit<
        ButtonProps,
        "children" | "onclick" | "disabled" | "aria-pressed"
    > {
        scheme?: ColorScheme;
        defaultScheme?: ColorScheme;
        applyToDocument?: boolean;
        ariaLabel?: string;
        lightIcon?: Snippet;
        darkIcon?: Snippet;
        children?: Snippet;
        disabled?: boolean;
        onSchemeChange?: (scheme: ColorScheme) => void;
        onclick?: (event: MouseEvent) => void;
        [key: string]: any;
    }

    const locale = useLocale();
    const inheritedPart = useComponentPart<Props>("ColorSchemeButton");
    let { scheme = $bindable(), ...explicitProps }: Props = $props();
    let {
        defaultScheme = undefined,
        applyToDocument = true,
        ariaLabel = undefined,
        lightIcon,
        darkIcon,
        children,
        disabled = false,
        onSchemeChange,
        onclick,
        ...rest
    }: Props = $derived(
        mergeComponentPartProps(inheritedPart.current, explicitProps),
    );

    let internalScheme = $state<ColorScheme>("light");
    let mounted = $state(false);
    const resolvedScheme = $derived(scheme ?? internalScheme);
    const resolvedAriaLabel = $derived(
        ariaLabel
            ?? locale.t(
                resolvedScheme === "dark"
                    ? "colorSchemeButton.toLight"
                    : "colorSchemeButton.toDark",
            ),
    );

    function readDocumentScheme(): ColorScheme {
        return document.documentElement.getAttribute("theme") === "dark"
            ? "dark"
            : "light";
    }

    function applyDocumentScheme(nextScheme: ColorScheme) {
        if (!applyToDocument) return;
        if (nextScheme === "dark") {
            document.documentElement.setAttribute("theme", "dark");
        } else {
            document.documentElement.removeAttribute("theme");
        }
    }

    onMount(() => {
        const initialScheme = scheme
            ?? defaultScheme
            ?? (applyToDocument ? readDocumentScheme() : "light");
        internalScheme = initialScheme;
        scheme = initialScheme;
        applyDocumentScheme(initialScheme);

        if (!applyToDocument) {
            mounted = true;
            return;
        }

        const observer = new MutationObserver(() => {
            const nextScheme = readDocumentScheme();
            internalScheme = nextScheme;
            if (scheme !== nextScheme) scheme = nextScheme;
        });
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["theme"],
        });
        mounted = true;
        return () => observer.disconnect();
    });

    $effect(() => {
        if (!mounted || scheme === undefined) return;
        internalScheme = scheme;
        applyDocumentScheme(scheme);
    });

    function handleClick(event: MouseEvent) {
        if (disabled) return;
        onclick?.(event);
        const nextScheme = resolvedScheme === "dark" ? "light" : "dark";
        internalScheme = nextScheme;
        scheme = nextScheme;
        applyDocumentScheme(nextScheme);
        onSchemeChange?.(nextScheme);
    }
</script>

<Button
    {...rest}
    iconOnly={!children}
    {disabled}
    data-color-scheme-button
    data-scheme={resolvedScheme}
    aria-label={resolvedAriaLabel}
    aria-pressed={resolvedScheme === "dark"}
    onclick={handleClick}
>
    {#if resolvedScheme === "dark"}
        {#if darkIcon}
            {@render darkIcon()}
        {:else}
            <ComponentIcon name="moon" aria-hidden="true" />
        {/if}
    {:else}
        {#if lightIcon}
            {@render lightIcon()}
        {:else}
            <ComponentIcon name="sun" aria-hidden="true" />
        {/if}
    {/if}
    {@render children?.()}
</Button>
