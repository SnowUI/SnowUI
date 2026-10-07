<!--
 Dialog 通用模态对话框
 v1.1.0

 职责:
 - 面板模式: <Dialog bind:open>
 - 内嵌模式: <Button>...<Dialog as="dialog">...</Dialog></Button>
 - 模版模式: <Dialog template id="x">...</Dialog> + showDialog / data-dialog-target
-->

<script lang="ts">
    import { tick, onMount, onDestroy, setContext, type Snippet } from "svelte";
    import Button from "./Button.svelte";
    import Text from "./Text.svelte";
    import Separator from "./Separator.svelte";
    import { getButtonSize } from "../context";
    import { BUTTON_SIZE_CONTEXT_KEY } from "../keys";
    import { ComponentIcon } from "../internal/component-icon/index";
    import { useLocale } from "../i18n/locale.svelte";
    import type { ComponentPartsOf } from "../logic/component-parts.svelte";
    import Frame, { type FrameProps } from "./Frame.svelte";
    import {
        dialogStore,
        hideDialog,
        registerDialogTemplate,
        showDialog,
        unregisterDialogTemplate,
        type DialogBackdrop,
        type DialogSize,
    } from "../logic/dialog.svelte";
    import {
        useOverlayPresence,
    } from "../logic/overlay-presence.svelte";
    import {
        DIALOG_BACKDROP_MOTION_STYLE,
        MODAL_DIALOG_APPEAR_MOTION,
        MODAL_DIALOG_DISAPPEAR_MOTION,
    } from "../motion/presets/dialog";
    import { getMotionTotalDurationMs } from "../motion/presets/utils";
    import { getSize } from "../context";

    function portal(node: HTMLElement) {
        document.body.appendChild(node);
        return {
            destroy() {
                if (node.parentNode) {
                    node.parentNode.removeChild(node);
                }
            },
        };
    }

    interface Props extends Omit<FrameProps, "children" | "as" | "title"> {
        id?: string;
        template?: boolean;
        as?: "dialog" | undefined;
        open?: boolean;
        onOpenChange?: (open: boolean) => void;
        backdrop?: DialogBackdrop;
        size?: DialogSize;
        closeOnOutside?: boolean;
        closeOnEscape?: boolean;
        pinOffset?: number;
        pinOffsetX?: number;
        pinOffsetY?: number;
        role?: "dialog" | string;
        title?: string;
        separator?: boolean;
        showCloseButton?: boolean;
        closeLabel?: string;
        parts?: ComponentPartsOf<{ Button: typeof Button; Text: typeof Text; Separator: typeof Separator }>;
        children?: Snippet;
        [key: string]: any;
    }

    let {
        id = undefined,
        template = false,
        as = undefined,
        open = $bindable(false),
        onOpenChange = undefined,
        backdrop = "opaque",
        size = "md",
        closeOnOutside = true,
        closeOnEscape = true,
        pinOffset = undefined,
        pinOffsetX = undefined,
        pinOffsetY = undefined,
        role = "dialog",
        title,
        separator = undefined,
        showCloseButton = true,
        closeLabel,
        parts,
        children,
        class: userClass = "",
        style: userStyle = "",
        enableResponsive = false,
        enableContext = true,
        enableScaleObserver = false,
        ...rest
    }: Props = $props();

    const locale = useLocale();
    const componentId = $props.id();
    const titleId = `${componentId}-title`;

    type DialogMode = "panel" | "inline" | "template";
    const mode = $derived<DialogMode>(
        template ? "template" : as === "dialog" ? "inline" : "panel",
    );

    const internalId = `dialog-inline-${Math.random().toString(36).slice(2, 11)}`;
    const effectiveId = $derived(
        mode === "inline" ? internalId : mode === "template" ? id : undefined,
    );
    const contextSize = getSize();
    const resolvedSize = $derived(
        (size ?? (contextSize as DialogSize | undefined) ?? "md") as DialogSize,
    );

    $effect(() => {
        if (mode === "panel") return;
        const eid = effectiveId;
        if (!eid) return;
        registerDialogTemplate(eid, {
            size: resolvedSize,
            backdrop,
            closeOnOutside,
            closeOnEscape,
        });
        return () => unregisterDialogTemplate(eid);
    });

    const activeEntry = $derived.by(() => {
        if (mode === "panel") return undefined;
        if (!effectiveId) return undefined;
        return dialogStore.active.find((item) => item.id === effectiveId);
    });

    const isOpen = $derived(
        mode === "panel" ? open : activeEntry !== undefined,
    );
    const presence = useOverlayPresence(
        () => isOpen,
        getMotionTotalDurationMs(MODAL_DIALOG_DISAPPEAR_MOTION),
    );

    let placeholderRef = $state<HTMLElement | undefined>(undefined);
    let backdropEl = $state<HTMLElement | undefined>(undefined);
    let panelEl = $state<HTMLElement | undefined>(undefined);
    let contentEl = $state<HTMLDivElement>();
    let externalClose = $state<HTMLElement>();
    let externalFooter = $state<HTMLElement>();
    let externalTitle = $state<HTMLElement>();
    let externalSeparator = $state<HTMLElement>();
    let externalContent = $state<HTMLElement>();
    let externalTitleId = $state<string>();
    const hasTitle = $derived(!!title || !!externalTitle);
    const structuredChildren = $derived(!!externalTitle || !!externalContent || !!externalSeparator);
    $effect(() => {
        const node = externalTitle;
        if (!node) { externalTitleId = undefined; return; }
        const originalId = node.getAttribute("id");
        if (!originalId) node.id = titleId;
        externalTitleId = node.id;
        const observer = new MutationObserver(() => {
            if (!node.id) node.id = titleId;
            externalTitleId = node.id;
        });
        observer.observe(node, { attributes: true, attributeFilter: ["id"] });
        return () => {
            observer.disconnect();
            if (originalId !== titleId && node.id === titleId) node.removeAttribute("id");
        };
    });
    const parentButtonSize = getButtonSize();
    setContext(BUTTON_SIZE_CONTEXT_KEY, {
        present: true,
        get scaleOnHover() { return parentButtonSize?.scaleOnHover; },
        get size() { return resolvedSize === "sm" ? "sm" : "md"; },
        resolveSize(element: HTMLElement | undefined) {
            if (externalFooter && element?.parentElement === externalFooter) return resolvedSize === "sm" ? "sm" : "md";
            return parentButtonSize?.resolveSize ? parentButtonSize.resolveSize(element) : parentButtonSize?.size;
        },
    });
    const hasClose = $derived(showCloseButton || !!externalClose);

    // 只识别调用方 children 的直系角色，正文包装不改变角色所有权。
    $effect(() => {
        const host = contentEl ?? panelEl;
        if (!host || !children) {
            externalClose = undefined;
            externalFooter = undefined;
            externalTitle = undefined;
            externalSeparator = undefined;
            externalContent = undefined;
            return;
        }
        const reportedDuplicates = new Set<string>();
        const update = () => {
            for (const role of ["close", "footer", "title", "separator", "content"]) {
                const candidates = Array.from(host.querySelectorAll<HTMLElement>(
                    `:scope > [data-as="${role}"]:not([data-dialog-builtin-close]):not([data-dialog-builtin])`,
                ));
                if (role === "close") externalClose = candidates[0];
                else if (role === "footer") externalFooter = candidates[0];
                else if (role === "title") externalTitle = candidates[0];
                else if (role === "separator") externalSeparator = candidates[0];
                else externalContent = candidates[0];
                if (candidates.length > 1) {
                    if (!reportedDuplicates.has(role) && import.meta.env.DEV) {
                        console.error(`[SnowUI Dialog] ${role} ${role === "close" ? "关闭角色" : role === "footer" ? "底部角色" : "角色"}只能有一个；仅使用第一个。`);
                    }
                    reportedDuplicates.add(role);
                } else reportedDuplicates.delete(role);
            }
        };
        update();
        const observer = new MutationObserver(update);
        observer.observe(host, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-as'] });
        return () => observer.disconnect();
    });
    let inlineTrigger: HTMLElement | null = null;
    let originalCursor = "";
    let restoreFocusEl: HTMLElement | null = null;

    function setPanelOpen(next: boolean) {
        if (open === next) return;
        open = next;
        onOpenChange?.(next);
    }

    function requestClose() {
        if (mode === "panel") {
            setPanelOpen(false);
        } else if (effectiveId) {
            hideDialog(effectiveId);
        }
    }

    function handleInlineClick(event: MouseEvent) {
        if (!effectiveId || !inlineTrigger) return;
        event.stopPropagation();
        showDialog(effectiveId, inlineTrigger);
    }

    onMount(() => {
        if (mode !== "inline") return;
        if (!placeholderRef) return;
        // Button 的内容包装层不可聚焦，触发和焦点恢复使用实际交互宿主。
        const parent = placeholderRef.parentElement;
        inlineTrigger = parent?.closest<HTMLElement>(
            'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
        ) ?? parent;
        if (!inlineTrigger) return;
        originalCursor = inlineTrigger.style.cursor;
        inlineTrigger.style.cursor = "pointer";
        inlineTrigger.addEventListener("click", handleInlineClick);
    });

    onDestroy(() => {
        if (!inlineTrigger) return;
        inlineTrigger.style.cursor = originalCursor;
        inlineTrigger.removeEventListener("click", handleInlineClick);
    });

    function getFocusableElements(): HTMLElement[] {
        if (!panelEl) return [];
        const selector = [
            "a[href]",
            "button:not([disabled])",
            "textarea:not([disabled])",
            "input:not([disabled])",
            "select:not([disabled])",
            "[tabindex]:not([tabindex='-1'])",
        ].join(",");
        return Array.from(
            panelEl.querySelectorAll<HTMLElement>(selector),
        ).filter(
            (node) =>
                !node.hasAttribute("disabled") && node.offsetParent !== null,
        );
    }

    function focusFirstElement() {
        const focusable = getFocusableElements();
        const preferred = focusable.find((node) =>
            node.hasAttribute("data-dialog-initial-focus"),
        );
        (preferred ?? focusable[0] ?? panelEl)?.focus();
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === "Escape" && closeOnEscape) {
            event.preventDefault();
            requestClose();
            return;
        }
        if (event.key !== "Tab") return;
        const focusable = getFocusableElements();
        if (focusable.length === 0) {
            event.preventDefault();
            panelEl?.focus();
            return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    }

    function handleBackdropPointerdown(event: PointerEvent) {
        if (!closeOnOutside) return;
        if (event.target !== backdropEl) return;
        requestClose();
    }

    function handlePanelClick(event: MouseEvent) {
        const target = event.target;
        if (!(target instanceof Element)) return;
        if (event.defaultPrevented) return;
        const closeRole = target.closest<HTMLElement>('[data-as="close"]');
        if (closeRole && closeRole === externalClose) {
            if (closeRole.matches(':disabled, [aria-disabled="true"]')) return;
            requestClose();
            return;
        }
        if (target.closest("[data-" + "dialog-close]")) {
            requestClose();
        }
    }

    $effect(() => {
        if (!isOpen) return;
        const active = document.activeElement;
        restoreFocusEl =
            mode === "panel" && active instanceof HTMLElement
                ? active
                : (activeEntry?.triggerEl ?? inlineTrigger ?? null);
        tick().then(focusFirstElement);
    });

    $effect(() => {
        if (!isOpen) return;
        document.addEventListener("keydown", handleKeydown, true);
        return () =>
            document.removeEventListener("keydown", handleKeydown, true);
    });

    $effect(() => {
        if (!presence.present) return;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = previousOverflow;
            restoreFocusEl?.focus?.();
        };
    });

    const panelClass = $derived(
        ["snowui-dialog", "snowui-quick-action-panel", "snowui-rounded-rectangle", userClass]
            .filter(Boolean)
            .join(" "),
    );
</script>

{#if mode === "inline"}
    <span bind:this={placeholderRef} style="display: none;" aria-hidden="true"
        >&#8203;</span
    >
{/if}

{#if presence.present}
    <div
        bind:this={backdropEl}
        use:portal
        role="presentation"
        class="snowui-dialog-backdrop snowui-backdrop"
        data-backdrop={backdrop}
        data-open={presence.closing ? undefined : "true"}
        data-closing={presence.closing ? "true" : undefined}
        style={DIALOG_BACKDROP_MOTION_STYLE}
        onpointerdown={handleBackdropPointerdown}
    >
        <div class="snowui-dialog-container">
            <Frame
                bind:element={panelEl}
                tag="div"
                column
                enableAutoLayout={false}
                currentState={presence.closing ? "Disappear" : "Appear"}
                whileAppear={MODAL_DIALOG_APPEAR_MOTION}
                whileDisappear={MODAL_DIALOG_DISAPPEAR_MOTION}
                tabindex="-1"
                {role}
                aria-modal="true"
                aria-labelledby={rest["aria-label"] ? undefined : externalTitle ? externalTitleId : title ? titleId : undefined}
                data-has-close={hasClose ? "true" : undefined}
                data-size={resolvedSize}
                data-open={presence.closing ? undefined : "true"}
                data-closing={presence.closing ? "true" : undefined}
                class={panelClass}
                style={userStyle || undefined}
                pinOffset={pinOffset ?? "var(--snowui-dialog-close-offset)"}
                {pinOffsetX}
                {pinOffsetY}
                onclick={handlePanelClick}
                enableResponsive={enableResponsive}
                enableContext={enableContext}
                enableScaleObserver={enableScaleObserver}
                {...rest}
                renderHints={{
                    variant: rest.renderHints?.variant ?? "rect",
                    width: rest.renderHints?.width ?? "20rem",
                    height: rest.renderHints?.height ?? "10rem",
                    radius: rest.renderHints?.radius ?? "var(--radius-3)",
                    rows: rest.renderHints?.rows,
                }}
            >
                {#if title && !externalTitle}
                    <Text {...parts?.Text} as="title" data-dialog-builtin="true" tag="h2" id={titleId}
                        class={["snowui-dialog-title", hasClose ? "snowui-dialog-title-with-close" : "", parts?.Text?.class].filter(Boolean).join(" ")}>
                        {title}
                    </Text>
                {/if}
                {#if hasTitle && !externalSeparator && (separator ?? resolvedSize !== "sm")}
                    <Separator thickness="var(--border-2)" {...parts?.Separator} as="separator" data-dialog-builtin="true" class={["snowui-dialog-separator", parts?.Separator?.class].filter(Boolean).join(" ")} />
                {/if}
                {#if children}
                    {#if !title && !showCloseButton}
                        {@render children()}
                    {:else}
                        <div bind:this={contentEl} class="snowui-dialog-content" data-structured={structuredChildren ? "true" : undefined} data-has-footer={externalFooter ? "true" : undefined} data-close-space={!hasTitle && hasClose ? "true" : undefined}>{@render children()}</div>
                    {/if}
                {/if}
                {#if showCloseButton && !externalClose}
                    <Button variant="borderless" iconOnly size={resolvedSize === "sm" ? "sm" : "md"} {...parts?.Button} type="button" as="close" data-dialog-builtin-close="true"
                        class={["snowui-dialog-close", parts?.Button?.class].filter(Boolean).join(" ")}
                        aria-label={closeLabel ?? locale.t("dialog.close")} onclick={requestClose}>
                        <ComponentIcon name="close" aria-hidden="true" />
                    </Button>
                {/if}
            </Frame>
        </div>
    </div>
{/if}

<style>
    :global(:where(.snowui-dialog-backdrop)) {
        position: fixed;
        inset: 0;
        z-index: 50;
        display: flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        padding: var(--padding-4);
    }

    :global(:where(.snowui-dialog-container)) {
        width: 100%;
        max-height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: none;
    }

    :global(:where(.snowui-dialog)) {
        width: min(100%, var(--snowui-dialog-max-width));
        max-height: calc(100vh - var(--size-16));
        overflow: auto;
        pointer-events: auto;
        position: relative;
        box-sizing: border-box;
        align-items: stretch;
        gap: var(--snowui-dialog-gap-override, var(--snowui-dialog-gap));
        --snowui-dialog-gap: var(--gap-4);
        --snowui-dialog-title-font-size: var(--text-18);
        --snowui-dialog-title-line-height: var(--leading-18);
        --snowui-dialog-close-size: calc(var(--size-6) + var(--size-3));
        --snowui-dialog-close-offset: var(--padding-4);
        --snowui-dialog-footer-gap: var(--gap-3);
        transform-origin: center;
        will-change: transform, opacity;
        font-size: var(--snowui-dialog-font-size-override, var(--text-14));
        line-height: var(
            --snowui-dialog-line-height-override,
            var(--leading-14)
        );
        --snowui-dialog-max-width: var(
            --snowui-dialog-max-width-override,
            28rem
        );
        --snowui-dialog-padding: var(--padding-5);
        --snowui-dialog-radius: var(--radius-6);
        padding: var(
            --snowui-dialog-padding-override,
            var(--snowui-dialog-padding)
        );
        border-radius: var(
            --snowui-dialog-radius-override,
            var(--snowui-dialog-radius)
        );
    }

    :global(:where(.snowui-dialog[data-closing="true"])) {
        pointer-events: none;
    }

    @media (prefers-reduced-motion: reduce) {
        :global(:where(.snowui-dialog)) {
            transition: none;
        }
    }

    :global(:where(.snowui-dialog[data-size="sm"])) {
        --snowui-dialog-max-width: var(
            --snowui-dialog-max-width-override,
            20rem
        );
        --snowui-dialog-padding: var(--padding-4);
        --snowui-dialog-radius: var(--radius-5);
        --snowui-dialog-gap: var(--gap-3);
        --snowui-dialog-title-font-size: var(--text-16);
        --snowui-dialog-title-line-height: var(--leading-16);
        --snowui-dialog-close-size: var(--size-6);
        --snowui-dialog-footer-gap: var(--gap-2);
    }

    :global(:where(.snowui-dialog[data-size="lg"])) {
        --snowui-dialog-max-width: var(
            --snowui-dialog-max-width-override,
            40rem
        );
        --snowui-dialog-padding: var(--padding-6);
        --snowui-dialog-radius: var(--radius-7);
        --snowui-dialog-gap: var(--gap-5);
        --snowui-dialog-close-offset: var(--padding-5);
    }
    :global(:where(.snowui-dialog-title, .snowui-dialog > [data-as="title"], .snowui-dialog > .snowui-dialog-content > [data-as="title"])) {
        order: -3;
        margin: 0;
        min-width: 0;
        padding-inline: var(--snowui-dialog-text-padding-override, var(--padding-1));
        font-size: var(--snowui-dialog-title-font-size);
        line-height: var(--snowui-dialog-title-line-height);
        font-weight: 600;
        color: var(--black-100, #000);
        overflow-wrap: anywhere;
    }

    :global(:where(.snowui-dialog-title-with-close, .snowui-dialog[data-has-close="true"] > [data-as="title"], .snowui-dialog[data-has-close="true"] > .snowui-dialog-content > [data-as="title"])) {
        padding-right: calc(var(--snowui-dialog-close-size) + var(--padding-1));
    }

    :global(:where(.snowui-dialog-content)) {
        position: static;
        display: flex;
        flex-direction: column;
        min-width: 0;
        flex: 0 0 auto;
        gap: var(--snowui-dialog-content-gap-override, var(--gap-2));
        padding-inline: var(--snowui-dialog-text-padding-override, var(--padding-1));
        font-size: inherit;
        line-height: inherit;
        overflow-wrap: anywhere;
    }

    :global(:where(.snowui-dialog-content[data-close-space="true"])) {
        padding-top: calc(var(--snowui-dialog-close-size) + var(--padding-2));
    }

    :global(:where(.snowui-dialog > [data-as="close"], .snowui-dialog > .snowui-dialog-content > [data-as="close"])) {
        position: absolute;
        z-index: 1;
        top: var(--pin-offset-y, var(--pin-offset, var(--snowui-dialog-close-offset)));
        right: var(--pin-offset-x, var(--pin-offset, var(--snowui-dialog-close-offset)));
    }

    :global(:where(.snowui-dialog-content[data-has-footer="true"])) {
        gap: var(--snowui-dialog-gap-override, var(--snowui-dialog-gap));
    }

    :global(:where(.snowui-dialog > [data-as="footer"], .snowui-dialog > .snowui-dialog-content > [data-as="footer"])) {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: flex-end;
        align-items: center;
        gap: var(--snowui-dialog-footer-gap-override, var(--snowui-dialog-footer-gap));
        min-width: 0;
        order: 1;
    }

    :global(:where(.snowui-dialog > [data-as="footer"] ~ [data-as="footer"], .snowui-dialog > .snowui-dialog-content > [data-as="footer"] ~ [data-as="footer"])) {
        display: none;
    }

    :global(:where(.snowui-dialog-content[data-structured="true"])) {
        display: contents;
    }

    :global(:where(.snowui-dialog-separator, .snowui-dialog > [data-as="separator"], .snowui-dialog > .snowui-dialog-content > [data-as="separator"])) {
        order: -2;
    }

    :global(:where(.snowui-dialog > [data-as="content"], .snowui-dialog > .snowui-dialog-content > [data-as="content"])) {
        display: flex;
        flex-direction: column;
        gap: var(--snowui-dialog-content-gap-override, var(--gap-2));
        padding-inline: var(--snowui-dialog-text-padding-override, var(--padding-1));
        font-size: inherit;
        line-height: inherit;
        min-width: 0;
        overflow-wrap: anywhere;
    }

    :global(:where(.snowui-dialog > [data-as="title"] ~ [data-as="title"], .snowui-dialog > .snowui-dialog-content > [data-as="title"] ~ [data-as="title"],
        .snowui-dialog > [data-as="separator"] ~ [data-as="separator"], .snowui-dialog > .snowui-dialog-content > [data-as="separator"] ~ [data-as="separator"],
        .snowui-dialog > [data-as="content"] ~ [data-as="content"], .snowui-dialog > .snowui-dialog-content > [data-as="content"] ~ [data-as="content"])) {
        display: none;
    }

    :global(:where(.snowui-dialog-close)) {
        --snowui-button-opacity-override: 0.4;
    }
    :global(:where(.snowui-dialog-close:hover, .snowui-dialog-close:focus-visible)) {
        --snowui-button-opacity-override: 1;
    }
    :global(:where(.snowui-dialog-content > [data-as="close"] ~ [data-as="close"], .snowui-dialog > [data-as="close"]:not([data-dialog-builtin-close]) ~ [data-as="close"]:not([data-dialog-builtin-close]))) {
        display: none;
    }
</style>
