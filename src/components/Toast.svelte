<!--
  Toast 全局通知(视觉单元)
  v1.1.0(2026-05-15: 新增 Inline 模式 as="toast")

  三种模式(遵循 specs/ComponentGuidelines.md §5):
  - 面板模式 (Panel, 默认): <Toast positive>...</Toast> 作为静态单体直接渲染
  - 内嵌模式 (Inline): <Button>Save<Toast as="toast" positive>Saved</Toast></Button>
    点击宿主即触发 showToast(自动生成 id);anchor 不参与定位
  - 模版模式 (Template): <Toast template id="X">...</Toast> 注册到全局,
    通过 showToast(id, overrides?) 或 [data-toast-target="X"] 激活

  其它职责:
  - 单个 Toast 的视觉外壳, 三槽位 (Leading / Content / Trailing)
  - default 变体: 深色 pill + Quick Action 同档背景模糊; rich 变体: 复用 .snowui-quick-action-panel
  - 内置图标 success / warning, 支持外置 Icon 替换(参见 §2.7.1)
  - rich 变体右上角内置 X 关闭按钮(hover 显示, 参考 Input clear-btn)
  - Panel 模式显式使用 GENERIC_SCALE_APPEAR_MOTION 保留既有渐显 + 缩放;Toaster 队列的方向进入/退出由 Toaster 显式组合

  通常由 <Toaster /> 渲染并由 toast() 调度; 也可作为静态组件独立使用。

  文档: ./Toast.md
-->

<script lang="ts">
    import type { ComponentPartsOf } from "@snowui-design-system/components/logic/component-parts.svelte";
    import { Button } from "@snowui-design-system/components";
    import { onMount, onDestroy, type Snippet } from "svelte";
    import { Frame, type FrameProps } from "@snowui-design-system/components";
    import { GENERIC_SCALE_APPEAR_MOTION } from "@snowui-design-system/components/motion/presets/generic";
    import { ComponentIcon } from "@snowui-design-system/components/internal/component-icon";
    import {
        registerToastTemplate,
        unregisterToastTemplate,
        showToast,
        type ToastPosition,
        type ToastSize,
        type ToastVariant,
    } from "../logic/toast.svelte";
    import {
        mergeComponentPartProps,
        useComponentPart,
    } from "@snowui-design-system/components/logic/component-parts.svelte";

    interface Props extends Omit<FrameProps, "children"> {
        /** 内置图标按钮配置；事件与角色由所属组件控制。 */
        parts?: ComponentPartsOf<{ Button: typeof Button }>;
        /** 模版模式 id;配合 template=true 后可通过 showToast(id) 触发;Inline 模式自动生成 */
        id?: string;
        /** 模版模式:只注册为命令式 Toast 模板,不直接渲染 */
        template?: boolean;
        /** as="toast" 启用 Inline 模式:自动发现宿主父元素,点击宿主即触发 showToast */
        as?: "toast" | undefined;
        /** 语义判定:true=积极(CheckCircle);false=问题(Warning);undefined=不渲染内置图标 */
        positive?: boolean;
        /** 是否启用 rich 变体(白底卡片 + 关闭 X) */
        variant?: ToastVariant;
        /** 仅 default 变体生效;rich 固定按 md 渲染 */
        size?: ToastSize;
        /** 用于驱动出入场方向(top/bottom + left/center/right) */
        position?: ToastPosition;
        /** rich 变体下点击关闭 X 时的回调 */
        onDismiss?: () => void;
        /** 所有正文与槽位结构均以 children 外置(含 [data-as="leading"|"trailing"] 槽) */
        children?: Snippet;
        [key: string]: any;
    }

    const inheritedToastPart = useComponentPart<Props>("Toast");
    let explicitProps: Props = $props();
    let {
        id = undefined,
        template = false,
        as = undefined,
        positive = undefined,
        variant = "default",
        size = "md",
        position = "top",
        onDismiss = undefined,
        parts = undefined,
        children,
        enableResponsive = false,
        enableContext = true,
        enableScaleObserver = false,
        class: userClass = "",
        ...rest
    }: Props = $derived(
        mergeComponentPartProps(inheritedToastPart.current, explicitProps),
    );

    /* ── 三模式判定 ──────────────────────────────────────────── */
    type ToastMode = "panel" | "inline" | "template";
    const mode = $derived<ToastMode>(
        template ? "template" : as === "toast" ? "inline" : "panel",
    );

    /* ── 内嵌模式自动生成 id;模版模式用 props.id ──────────── */
    const internalId = `toast-inline-${Math.random().toString(36).substring(2, 11)}`;
    const effectiveId = $derived(
        mode === "inline" ? internalId : mode === "template" ? id : undefined,
    );

    const isRich = $derived(variant === "rich");
    const resolvedSize: ToastSize = $derived(isRich ? "md" : size);
    const showBuiltinIcon = $derived(positive !== undefined);
    const iconKind = $derived(positive ? "success" : "warning");

    /* 外置 leading 与内置语义图标互斥（ComponentGuidelines §2.7.1）。 */
    let toastElement = $state<HTMLElement>();
    let hasCustomLeading = $state(false);

    $effect(() => {
        if (!toastElement) return;
        const host = toastElement;
        const update = () => {
            hasCustomLeading = !!host.querySelector(
                ':scope > [data-as="leading"]:not(.snowui-toast-builtin-icon)',
            );
        };
        update();
        const observer = new MutationObserver(update);
        observer.observe(host, { childList: true, subtree: true });
        return () => observer.disconnect();
    });

    /* ── 模版 / 内嵌模式:注册到 toastTemplates Map ──────────── */
    $effect(() => {
        if (mode === "panel") return;
        const eid = effectiveId;
        if (!eid) return;
        registerToastTemplate(eid, {
            positive,
            variant,
            size,
            position,
            children,
            class: userClass || undefined,
            style: typeof rest.style === "string" ? rest.style : undefined,
        });
        return () => unregisterToastTemplate(eid);
    });

    /* ── 内嵌模式:占位 + 父元素发现 + 点击监听 ────────────── */
    let placeholderRef = $state<HTMLElement | undefined>(undefined);
    let inlineAnchor: HTMLElement | null = null;

    function handleInlineClick() {
        if (!effectiveId) return;
        showToast(effectiveId);
    }

    onMount(() => {
        if (mode !== "inline") return;
        if (!placeholderRef) return;
        inlineAnchor = placeholderRef.parentElement;
        if (!inlineAnchor) return;
        inlineAnchor.addEventListener("click", handleInlineClick);
    });

    onDestroy(() => {
        if (!inlineAnchor) return;
        inlineAnchor.removeEventListener("click", handleInlineClick);
    });
</script>

{#if mode === "inline"}
    <span
        bind:this={placeholderRef}
        style="display: none;"
        aria-hidden="true">&#8203;</span
    >
{:else if mode === "panel"}
    <Frame
        bind:element={toastElement}
        row
        whileAppear={GENERIC_SCALE_APPEAR_MOTION}
        id={id}
        data-variant={variant}
        data-size={resolvedSize}
        data-pos={position}
        class={`snowui-toast snowui-rounded-rectangle snowui-toast-${variant} snowui-toast-size-${resolvedSize}${isRich ? " snowui-quick-action-panel" : ""}${userClass ? ` ${userClass}` : ""}`}
        enableResponsive={enableResponsive}
        enableContext={enableContext}
        enableScaleObserver={enableScaleObserver}
        {...rest}
        renderHints={{
            variant: rest.renderHints?.variant ?? "rect",
            width: rest.renderHints?.width ?? "12rem",
            height: rest.renderHints?.height ?? "2.25rem",
            radius: rest.renderHints?.radius ?? "var(--radius-4)",
            rows: rest.renderHints?.rows,
        }}
    >
        {#if showBuiltinIcon && !hasCustomLeading}
            <span
                data-as="leading"
                class={`snowui-toast-builtin-icon snowui-toast-builtin-icon-${iconKind}`}
                aria-hidden="true"
            >
                {#if positive}
                    <ComponentIcon name="check-circle" weight="fill" size="var(--snowui-toast-icon-size, var(--size-5))" aria-hidden="true" />
                {:else}
                    <ComponentIcon name="warning" weight="fill" size="var(--snowui-toast-icon-size, var(--size-5))" aria-hidden="true" />
                {/if}
            </span>
        {/if}

        {@render children?.()}

        {#if isRich}
            <Button bare emphasis="muted" size="sm" {...parts?.Button}
                type="button"
                class={`snowui-clear-icon-btn snowui-toast-close-btn${parts?.Button?.class ? ` ${parts.Button.class}` : ""}`}
                aria-label="关闭通知"
                onclick={() => onDismiss?.()}
                onmousedown={(e: MouseEvent) => e.preventDefault()}
                tabindex={-1}
            >
                <ComponentIcon name="x-circle" weight="fill" aria-hidden="true" />
            </Button>
        {/if}
    </Frame>
{/if}

<style>
    /* ── 视觉基类:default 为深色玻璃 pill ───────────────────────────── */
    :global(:where(.snowui-toast)) {
        --snowui-toast-padding-y: var(--padding-2);
        --snowui-toast-padding-x: var(--padding-3);
        --snowui-toast-gap: var(--gap-2);
        --snowui-toast-radius: var(--radius-4);
        --snowui-toast-font-size: var(--text-14);
        --snowui-toast-line-height: var(--leading-14);

        position: relative;
        box-sizing: border-box;
        gap: var(--snowui-toast-gap-override, var(--snowui-toast-gap));
        padding:
            var(--snowui-toast-padding-y-override, var(--snowui-toast-padding-y))
            var(--snowui-toast-padding-x-override, var(--snowui-toast-padding-x));
        border-radius: var(--snowui-toast-radius-override, var(--snowui-toast-radius));
        font-size: var(--snowui-toast-font-size-override, var(--snowui-toast-font-size));
        line-height: var(--snowui-toast-line-height-override, var(--snowui-toast-line-height));
        pointer-events: auto;
    }

    /* ── default 变体(深色 pill) ──────────────────────────────── */
    :global(:where(.snowui-toast-default)) {
        background:
            linear-gradient(
                0deg,
                var(--static-white-10, rgba(255, 255, 255, 0.1)),
                var(--static-white-10, rgba(255, 255, 255, 0.1))
            ),
            var(--static-black-100, #000);
        backdrop-filter: blur(var(--size-10));
        -webkit-backdrop-filter: blur(var(--size-10));
        color: var(--static-white-100, #ffffff);
        white-space: nowrap;
    }

    /* default sm 档(图标 16 / 字号 12) */
    :global(:where(.snowui-toast-default.snowui-toast-size-sm)) {
        --snowui-toast-padding-y: var(--padding-1);
        --snowui-toast-padding-x: var(--padding-2);
        --snowui-toast-gap: var(--gap-1);
        --snowui-toast-font-size: var(--text-12);
        --snowui-toast-line-height: var(--leading-12);
        --snowui-toast-icon-size: var(--size-4);
    }

    /* default md 档(图标 20 / 字号 14) */
    :global(:where(.snowui-toast-default.snowui-toast-size-md)) {
        --snowui-toast-icon-size: 1.25rem; /* 20px */
    }

    /* ── rich 变体(白底卡片, 复用 .snowui-quick-action-panel) ───────
     * 交叉轴对齐遵循 LayoutProtocol §4.1 默认(auto-layout row → center),
     * 不在组件层硬编码 flex-start; 若需顶部对齐(多行 description),
     * 由使用方通过 `class="items-start"` 等工具类外部传入。 */
    :global(:where(.snowui-toast-rich)) {
        color: var(--black-100, #000);
        /* padding / radius / shadow 由 .snowui-quick-action-panel 提供; 保留 override 入口 */
        padding: var(
            --snowui-toast-padding-override,
            var(--padding-3)
        );
        gap: var(--snowui-toast-gap-override, var(--gap-2));
        border-radius: var(--snowui-toast-radius-override, var(--radius-4));
        --snowui-toast-icon-size: 1.25rem; /* 20px */
    }

    /* ── 内置图标尺寸 + 语义色(fill weight; 外置 Icon 不受影响) ───── */
    :global(:where(.snowui-toast .snowui-toast-builtin-icon)) {
        flex: 0 0 auto;
        --snowui-icon-width-override: var(--snowui-toast-icon-size, 1.25rem);
        --snowui-icon-height-override: var(--snowui-toast-icon-size, 1.25rem);
    }

    :global(:where(.snowui-toast-builtin-icon-success)) {
        color: var(--snowui-toast-success-color-override, var(--secondary-green, #71DD8C));
    }

    :global(:where(.snowui-toast-builtin-icon-warning)) {
        color: var(--snowui-toast-warning-color-override, var(--secondary-yellow, #FFCC00));
    }

    /* ── 关闭 X(仅 rich 变体)───────────────────────────────────── */
    :global(:where(.snowui-toast-close-btn)) {
        position: absolute;
        top: -0.25rem;          /* -4px, 与 Figma 一致 */
        right: -0.25rem;
        --snowui-button-opacity-override: 0;
        pointer-events: none;
    }

    :global(:where(.snowui-toast-rich:hover .snowui-toast-close-btn)) {
        --snowui-button-opacity-override: var(--snowui-button-opacity);
        pointer-events: auto;
    }

    /* Toaster 只声明根状态；Toast 自己控制内部关闭按钮。 */
    :global(:where(.snowui-toast[data-frontmost="false"] .snowui-toast-close-btn)) {
        --snowui-button-opacity-override: 0;
        pointer-events: none;
    }
</style>
