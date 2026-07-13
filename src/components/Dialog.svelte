<!--
 Dialog 通用模态对话框
 v1.0.0

 职责:
 - 面板模式: <Dialog bind:open>
 - 内嵌模式: <Button>...<Dialog as="dialog">...</Dialog></Button>
 - 模版模式: <Dialog template id="x">...</Dialog> + showDialog / data-dialog-target
-->

<script lang="ts">
    import { tick, onMount, onDestroy, type Snippet } from "svelte";
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

    interface Props extends Omit<FrameProps, "children" | "as"> {
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
        closeOnOutside = false,
        closeOnEscape = true,
        pinOffset = 12,
        pinOffsetX = undefined,
        pinOffsetY = undefined,
        role = "dialog",
        children,
        class: userClass = "",
        style: userStyle = "",
        enableResponsive = false,
        enableContext = true,
        enableScaleObserver = false,
        ...rest
    }: Props = $props();

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
        inlineTrigger = placeholderRef.parentElement;
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
        ["snowui-dialog", "snowui-quick-action-panel", userClass]
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
        class="snowui-dialog-backdrop"
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
                data-size={resolvedSize}
                data-open={presence.closing ? undefined : "true"}
                data-closing={presence.closing ? "true" : undefined}
                class={panelClass}
                style={userStyle || undefined}
                {pinOffset}
                {pinOffsetX}
                {pinOffsetY}
                onclick={handlePanelClick}
                enableResponsive={enableResponsive}
                enableContext={enableContext}
                enableScaleObserver={enableScaleObserver}
                {...rest}
            >
                {@render children?.()}
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
        background: rgb(0 0 0 / 10%);
        opacity: 1;
        transition: opacity var(--snowui-dialog-backdrop-appear-duration)
            var(--snowui-dialog-backdrop-appear-easing);
    }

    :global(:where(.snowui-dialog-backdrop[data-closing="true"])) {
        opacity: 0;
        pointer-events: none;
        transition: opacity var(--snowui-dialog-backdrop-disappear-duration)
            var(--snowui-dialog-backdrop-disappear-easing);
    }

    :global(:where(.snowui-dialog-backdrop[data-backdrop="blur"])) {
        background: rgb(0 0 0 / 10%);
        backdrop-filter: blur(var(--size-5));
        -webkit-backdrop-filter: blur(var(--size-5));
    }

    :global(:where(.snowui-dialog-backdrop[data-backdrop="transparent"])) {
        background: transparent;
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
        --snowui-dialog-padding: var(--padding-6);
        --snowui-dialog-radius: calc(var(--radius-4) * 2);
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
        :global(:where(.snowui-dialog-backdrop, .snowui-dialog)) {
            transition: none;
        }
    }

    :global(:where(.snowui-dialog[data-size="sm"])) {
        --snowui-dialog-max-width: var(
            --snowui-dialog-max-width-override,
            20rem
        );
        --snowui-dialog-padding: var(--padding-4);
        --snowui-dialog-radius: var(--radius-6);
    }

    :global(:where(.snowui-dialog[data-size="lg"])) {
        --snowui-dialog-max-width: var(
            --snowui-dialog-max-width-override,
            40rem
        );
        --snowui-dialog-padding: var(--padding-6);
        --snowui-dialog-radius: calc(var(--radius-4) * 2);
    }
</style>
