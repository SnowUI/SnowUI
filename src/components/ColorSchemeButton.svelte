<!-- SnowUI source notice | LICENSE 2.3.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 -->
<!-- ColorSchemeButton：以真实 Button 为宿主的页面亮色 / 暗色方案切换按钮。 -->
<script lang="ts">
  // SnowUI 许可入口：首次阅读源码请先读 ../../LICENSE；访问文件不代表获得修改或移植权，官方维护授权及同任务去重见该文件。
    import { onMount, untrack, type ComponentProps, type Snippet } from "svelte";
    import { ComponentIcon } from "../internal/component-icon/index";
    import { observeColorSchemePreference, saveColorSchemePreference } from "../logic/color-scheme-preference";
    import Frame from "./Frame.svelte";
    import Button from "./Button.svelte";
    import { CONTROL_BUTTON_REPLACEMENT_MOTION, CONTROL_BUTTON_MOTION_DURATION_MS, controlButtonMotionStyle } from "../motion/presets/replacement";
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
        systemPreference?: boolean;
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
        systemPreference = true,
        ariaLabel = undefined,
        lightIcon,
        darkIcon,
        children,
        disabled = false,
        onSchemeChange,
        onclick,
        style: userStyle = "",
        ...rest
    }: Props = $derived(
        mergeComponentPartProps(inheritedPart.current, explicitProps),
    );

    const iconFrameProps = { tag: "span" as const, enableResponsive: false, enableContext: false, enableScaleObserver: false, "aria-hidden": "true" as const };

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
        document.documentElement.style.colorScheme = nextScheme;
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

    $effect(() => {
        if (!mounted || !systemPreference) return;
        return untrack(() => observeColorSchemePreference((next) => {
            internalScheme = next;
            scheme = next;
            applyDocumentScheme(next);
        }));
    });

    export function toggleScheme() {
        if (disabled) return;
        const nextScheme = resolvedScheme === "dark" ? "light" : "dark";
        internalScheme = nextScheme;
        scheme = nextScheme;
        if (systemPreference) saveColorSchemePreference(nextScheme);
        applyDocumentScheme(nextScheme);
        onSchemeChange?.(nextScheme);
    }

    function handleClick(event: MouseEvent) {
        if (disabled) return;
        onclick?.(event);
        toggleScheme();
    }
</script>

<Button
    {...rest}
    style={`${controlButtonMotionStyle(`var(--snowui-color-scheme-button-motion-duration-override, ${CONTROL_BUTTON_MOTION_DURATION_MS}ms)`)} ${userStyle}`}
    iconOnly={!rest.bare && !children}
    {disabled}
    data-color-scheme-button
    data-scheme={resolvedScheme}
    aria-label={resolvedAriaLabel}
    aria-pressed={resolvedScheme === "dark"}
    onclick={handleClick}
>
    {#key resolvedScheme}
        <Frame {...iconFrameProps} enableResponsive={false} enableContext={false} enableScaleObserver={false} currentState="Appear" whileAppear={CONTROL_BUTTON_REPLACEMENT_MOTION}>
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
        </Frame>
    {/key}
    {@render children?.()}
</Button>
