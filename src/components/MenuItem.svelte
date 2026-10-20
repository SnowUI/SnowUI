<!-- SnowUI source notice | LICENSE 2.2.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 -->
<!--
 MenuItem 组件：浮层面板操作项（统一版）
 v1.2.4

 职责：
 - 同时支持两种使用场景：
   1. Listbox 内（有 ListboxOwnerContext）：自动注册选项、从 context 派生选中/高亮/过滤状态
   2. QuickAction 内或独立使用：通过 Props 直接控制 selected / active / disabled
 - padding 在 Listbox 与 QuickAction 中保持一致，统一为 var(--padding-2) = 8px

 文档: ./MenuItem.md
-->

<script lang="ts">
    import { useLocale } from "../i18n/locale.svelte";
  // SnowUI 许可入口：首次阅读源码请先读 ../../LICENSE；访问文件不代表获得修改或移植权，官方维护授权及同任务去重见该文件。
    import type { ComponentPartsOf } from "../logic/component-parts.svelte";
    import Button from "./Button.svelte";
    import type { Snippet } from "svelte";
    import {onMount} from "svelte";
    import {ComponentIcon} from "../internal/component-icon/index";
    import Frame, { type FrameProps } from "./Frame.svelte";
    import {getListboxOwner} from "../context";
    import {splitFrameHostProps} from "../logic/frame-prop-filter";
    import {mergeComponentPartProps, useComponentPart} from "../logic/component-parts.svelte";

    const localeContext = useLocale();

    interface Props extends Omit<FrameProps, "children" | "tag"> {
        /** 内置图标按钮配置；事件与角色由所属组件控制。 */
        parts?: ComponentPartsOf<{ Button: typeof Button }>;
        /** 选项值（在 Listbox 内使用时必填，同一 Listbox 内必须唯一） */
        value?: string;
        /** 是否选中（独立使用时有效；Listbox 内由 context 覆盖） */
        selected?: boolean;
        /** 是否高亮（独立使用时有效；Listbox 内由 context 覆盖） */
        active?: boolean;
        /** 是否禁用 */
        disabled?: boolean;
        /** 是否渲染 trailing 勾选槽位；未设置时仅独立 selected 项默认开启 */
        showCheck?: boolean;
        /** 点击后是否请求父级浮层关闭；未设置时由父级浮层决定默认策略 */
        closeOnSelect?: boolean;
        /** 操作项内容（文字 + 可选外置 Icon） */
        children?: Snippet;
        [key: string]: any;
    }

    const inheritedMenuItemPart = useComponentPart<Props>("MenuItem");
    let explicitProps: Props = $props();
    let {
        value,
        selected: selectedProp = false,
        active: activeProp = false,
        disabled = false,
        showCheck = undefined,
        closeOnSelect = undefined,
        as = undefined,
        parts = undefined,
        children,
        enableAutoLayout = true,
        enableResponsive = false,
        enableContext = true,
        enableScaleObserver = false,
        class: userClass = "",
        onclick,
        ...rest
    }: Props = $derived(
        mergeComponentPartProps(inheritedMenuItemPart.current, explicitProps),
    );

    const splitProps = $derived.by(() => splitFrameHostProps(rest));
    const frameRestProps = $derived(splitProps.frameProps);
    const internalAutoLayout = $derived(
        enableAutoLayout === false ? true : enableAutoLayout,
    );

    const ownerContext = getListboxOwner();
    const owner = $derived(as === "item" ? ownerContext : undefined);
    const resolvedShowCheck = $derived(
        showCheck ?? owner?.showCheck ?? selectedProp,
    );

    // DOM ref（Listbox 内读取 textContent 提取 label）
    let itemEl = $state<HTMLElement | undefined>(undefined);

    // ── Listbox 内注册 ─────────────────────────────────────────────────────
    onMount(() => {
        if (owner && value !== undefined && !isCustom) {
            const label = getRegistrationLabel() ?? value;
            owner.registerOption({ value, label, disabled });
            return () => {
                owner.unregisterOption(value!);
            };
        }
    });

    // ── 派生状态（有 context 时从 context 读取，否则用 Props）────────────────
    const itemIndex = $derived(
        owner && value !== undefined
            ? ([...owner.options, ...owner.customOptions].findIndex(o => o.value === value) ?? -1)
            : -1,
    );
    const isCustom = $derived(
        !!owner && value !== undefined && !!owner.customOptions.some(o => o.value === value),
    );
    const isFiltered = $derived(
        !isCustom && !!owner?.filterText && itemIndex === -1,
    );
    const isSelected = $derived(
        owner && value !== undefined ? owner.selectedValue === value : selectedProp,
    );
    const isActive = $derived(
        owner ? owner.activeIndex === itemIndex : activeProp,
    );
    const optionId = $derived(
        owner && itemIndex >= 0 ? `${owner.listboxId}-opt-${itemIndex}` : undefined,
    );

    let isHovered = $state(false);

    // ── 事件处理 ────────────────────────────────────────────────────────────
    function handleMousedown(e: MouseEvent) {
        e.preventDefault();
    }

    function handleClick(e: MouseEvent) {
        if (disabled) return;
        if (owner && value !== undefined) {
            owner.selectOption(value);
        } else {
            onclick?.(e);
        }

        dispatchSelectIntent(e);
    }

    function dispatchSelectIntent(e: MouseEvent) {
        if (e.defaultPrevented || e.cancelBubble) return;

        itemEl?.dispatchEvent(
            new CustomEvent("snowui-menu-item-select", {
                bubbles: true,
                composed: true,
                detail: {
                    value,
                    closeOnSelect,
                    originalEvent: e,
                },
            }),
        );
    }

    function handleMouseEnter() {
        if (disabled || itemIndex < 0) return;
        if (owner) owner.setActiveIndex(itemIndex);
        isHovered = true;
    }

    function handleMouseLeave() {
        isHovered = false;
    }

    function handleDelete(e: MouseEvent) {
        e.stopPropagation();
        if (owner && value !== undefined) owner.removeCustomOption(value);
    }

    function getRegistrationLabel() {
        if (!itemEl) return value;
        return collectOptionText(itemEl).trim() || value;
    }

    function collectOptionText(node: Node): string {
        if (node.nodeType === Node.TEXT_NODE) return node.textContent ?? "";
        if (node.nodeType !== Node.ELEMENT_NODE) return "";

        const element = node as HTMLElement;
        if (
            element.dataset.as === "trailing" ||
            element.classList.contains("snowui-menu-item-check") ||
            element.classList.contains("snowui-menu-item-delete")
        ) {
            return "";
        }

        return Array.from(element.childNodes).map(collectOptionText).join(" ");
    }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_interactive_supports_focus -->
<Frame
    bind:element={itemEl}
    tag="div"
    {as}
    row
    id={optionId}
    role={owner ? "option" : undefined}
    class={`snowui-menu-item snowui-rounded-rectangle${userClass ? ` ${userClass}` : ""}`}
    aria-selected={owner ? isSelected : (selectedProp || undefined)}
    aria-disabled={disabled || undefined}
    data-active={isActive || undefined}
    data-custom={isCustom ? "true" : undefined}
    data-filtered={isFiltered ? "true" : undefined}
    onmousedown={handleMousedown}
    onclick={handleClick}
    onmouseenter={handleMouseEnter}
    onmouseleave={handleMouseLeave}
    contentFill
    enableAutoLayout={internalAutoLayout}
    enableResponsive={enableResponsive}
    enableContext={enableContext}
    enableScaleObserver={enableScaleObserver}
    {...frameRestProps}
    renderHints={{
        variant: frameRestProps.renderHints?.variant ?? "line",
        width: frameRestProps.renderHints?.width ?? "100%",
        height: frameRestProps.renderHints?.height ?? "2rem",
        radius: frameRestProps.renderHints?.radius,
        rows: frameRestProps.renderHints?.rows,
    }}
>
    {#if children}
        {@render children()}
    {:else if value}
        <span class="snowui-menu-item-label">
            {value}
        </span>
    {/if}

    {#if resolvedShowCheck && isCustom && isHovered}
        <!-- 自定义项 hover 时显示删除按钮（替换 ✔ 位置） -->
        <Button bare emphasis="muted" size="sm" {...parts?.Button}
            type="button"
            class={`snowui-clear-icon-btn snowui-menu-item-delete snowui-menu-item-check${parts?.Button?.class ? ` ${parts.Button.class}` : ""}`}
            as="trailing"
            aria-label={localeContext.t("menuItem.deleteCustom")}
            onclick={handleDelete}
            onmousedown={handleMousedown}
            tabindex={-1}
        >
            <ComponentIcon name="x-circle" weight="fill" aria-hidden="true" />
        </Button>
    {:else if resolvedShowCheck}
        <ComponentIcon
            name="check"
            class="snowui-menu-item-check"
            as="trailing"
            size="var(--size-4)"
            aria-hidden="true"
        />
    {/if}
</Frame>

<style>
    /* ── 操作项基础样式 ── */
    :global(:where(.snowui-menu-item)) {
        --snowui-menu-item-gap: var(--gap-2, 0.5rem);
        --snowui-menu-item-slot-gap: var(--snowui-menu-item-gap);
        padding: var(--snowui-menu-item-padding-override, var(--padding-2, 0.5rem));
        gap: var(--snowui-menu-item-gap);
        border-radius: var(--snowui-menu-item-radius-override, var(--radius-3, 0.75rem));
        font-size: var(--text-14);
        line-height: var(--leading-14);
        cursor: pointer;
        box-sizing: border-box;
    }

    /* Label 槽位（Content / Fill） */
    :global(:where(.snowui-menu-item-label)) {
        display: flex;
        align-items: center;
        gap: var(--snowui-menu-item-slot-gap);
        flex-wrap: nowrap;
        min-width: 0;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    /* 直系复合 Leading / Trailing 槽位 */
    :global(:where(.snowui-menu-item > [data-as="leading"])),
    :global(:where(.snowui-menu-item > [data-as="trailing"]:not(.snowui-menu-item-check):not(.snowui-menu-item-delete))) {
        display: inline-flex;
        align-items: inherit;
        gap: var(--snowui-menu-item-slot-gap);
        min-width: 0;
        white-space: nowrap;
    }

    :global(:where(.snowui-menu-item > [data-as="trailing"])) {
        flex-shrink: 0;
    }

    :global(:where(.snowui-menu-item:has(> [data-as="trailing"]:not(.snowui-menu-item-check):not(.snowui-menu-item-delete)) > .snowui-menu-item-check)) {
        display: none;
    }

    /* Check 图标槽位（Trailing / Hug），默认隐藏 */
    :global(:where(.snowui-menu-item-check:not(.snowui-menu-item-delete))) {
        width: var(--size-4, 1rem);
        height: var(--size-4, 1rem);
        flex-shrink: 0;
        opacity: 0;
        color: currentColor;
    }

    :global(:where(.snowui-menu-item:hover)) {
        background-color: var(--black-4, #0000000a);
    }
    :global(:where([data-continuous-hover-enabled="true"] > .snowui-menu-item:hover)) {
        background-color: transparent;
    }

    /* 选中态 */
    :global(:where(.snowui-menu-item[aria-selected="true"])) {
        color: var(--black-100, #000000ff);
    }

    :global(:where(.snowui-menu-item[aria-selected="true"] .snowui-menu-item-check)) {
        opacity: 1;
    }

    /* 活跃态（键盘导航高亮） */
    :global(:where(.snowui-menu-item[data-active="true"])) {
        background-color: var(--black-4, #0000000a);
    }
    :global(:where(.snowui-listbox[data-continuous-hover-enabled="true"] > .snowui-menu-item[data-active="true"])) {
        background-color: transparent;
    }

    /* 禁用态 */
    :global(:where(.snowui-menu-item[aria-disabled="true"])) {
        opacity: 0.2;
        cursor: not-allowed;
        pointer-events: none;
    }

    /* 过滤隐藏（Listbox 搜索过滤） */
    :global(:where(.snowui-menu-item[data-filtered="true"])) {
        display: none;
    }

    /* 删除按钮（Listbox 自定义项 hover 时替换 ✔ 的位置） */
    :global(:where(.snowui-menu-item-delete)) {
        flex-shrink: 0;
    }

    /* Listbox 选项始终保持自然高度，不参与外层剩余空间分配。 */
    :global(:where(.snowui-listbox > .snowui-menu-item)) {
        flex: 0 0 auto;
        width: 100%;
    }
</style>
