<!--
 Select 组件：自定义下拉选择框（Trigger + 外置 Listbox 组合架构）
 v3.2.2

 文档: ./Select.md
-->

<script lang="ts">
    import type { ComponentProps, Snippet } from "svelte";
    import { setContext } from "svelte";
    import { ComponentIcon } from "../internal/component-icon/index";
    import Frame, { type FrameProps } from "./Frame.svelte";
    import Button from "./Button.svelte";
    import Input from "./Input.svelte";
    import Listbox, { type ListboxItem } from "./Listbox.svelte";
    import MenuItem from "./MenuItem.svelte";
    import { getField, type ListboxOwnerContext, type ListboxOptionRegistration } from "../context";
    import { LISTBOX_OWNER_CONTEXT_KEY } from "../keys";
    import {
        resolveFrameFieldInvalid,
        resolveFrameFieldValue,
    } from "../logic/frame-field-control";
    import { splitFrameHostProps } from "../logic/frame-prop-filter";
    import { matchesSearch } from "../lib/search-filter";
    import {
        mergeComponentPartProps,
        type ComponentPartsOf,
        useComponentPart,
    } from "../logic/component-parts.svelte";

    export type SelectValue = string | number | undefined;
    export type SelectOption = ListboxItem;
    export interface SelectTriggerContext {
        value: SelectValue;
        option: SelectOption | undefined;
        label: string | undefined;
        placeholder: string | undefined;
        open: boolean;
        disabled: boolean;
    }
    type SelectParts = ComponentPartsOf<{
        Listbox: typeof Listbox;
        Input: typeof Input;
        MenuItem: typeof MenuItem;
    }> & {
        Button?: Omit<
            ComponentProps<typeof Button>,
            "children" | "onclick" | "onkeydown" | "disabled"
        >;
    };

    interface Props extends Omit<FrameProps, "children" | "tag"> {
        value?: SelectValue;
        defaultValue?: SelectValue;
        placeholder?: string;
        name?: string;
        disabled?: boolean;
        readonly?: boolean;
        required?: boolean;
        form?: string;
        autofocus?: boolean;
        tabindex?: number;
        title?: string;
        id?: string;
        invalid?: boolean;
        /** 子内容：<Listbox> + <MenuItem> 组合 */
        children?: Snippet;
        /** 默认内置模式：无需显式书写 Listbox / MenuItem。 */
        options?: SelectOption[];
        /** 按钮触发模式下的按钮内容。 */
        triggerContent?: Snippet<[SelectTriggerContext]>;
        /** 使用 bare Button 作为 Listbox 触发器。 */
        buttonTrigger?: boolean;
        /** buttonTrigger 模式是否使用 Button bare 外观。 */
        buttonBare?: boolean;
        selectionMode?: "persistent" | "action";
        onAction?: (value: string) => void;
        /** 内置 SnowUI 子组件 Props；同类型直接实例统一生效。 */
        parts?: SelectParts;
        ariaLabel?: string;
        onclick?: (event: MouseEvent) => void;
        oninput?: (event: Event) => void;
        onchange?: (event: Event) => void;
        onfocus?: (event: FocusEvent) => void;
        onblur?: (event: FocusEvent) => void;
        onkeydown?: (event: KeyboardEvent) => void;
        onkeyup?: (event: KeyboardEvent) => void;
        [key: string]: any;
    }

    const inheritedSelectPart = useComponentPart<Props>("Select");
    let {
        value = $bindable(),
        ...explicitProps
    }: Props = $props();
    let {
        defaultValue = undefined,
        placeholder = undefined,
        name = undefined,
        disabled = false,
        readonly = false,
        required = false,
        form = undefined,
        autofocus = undefined,
        tabindex = undefined,
        title = undefined,
        id = undefined,
        invalid = false,
        children,
        options = [],
        triggerContent,
        buttonTrigger = false,
        buttonBare = true,
        selectionMode = "persistent",
        onAction = undefined,
        parts = undefined,
        ariaLabel = undefined,
        onclick: userOnClick = undefined,
        oninput: userOnInput = undefined,
        onchange: userOnChange = undefined,
        onfocus: userOnFocus = undefined,
        onblur: userOnBlur = undefined,
        onkeydown: userOnKeyDown = undefined,
        onkeyup: userOnKeyUp = undefined,
        enableAutoLayout = true,
        enableResponsive = false,
        enableContext = true,
        enableScaleObserver = false,
        class: userClass = "",
        style: userStyle = "",
        renderHints: userRenderHints = undefined,
        ...rest
    }: Omit<Props, "value"> = $derived(
        mergeComponentPartProps(
            inheritedSelectPart.current as Partial<Omit<Props, "value">>,
            explicitProps,
        ),
    );

    const splitProps = $derived.by(() => splitFrameHostProps(rest));
    const frameRestProps = $derived(splitProps.frameProps);
    const internalAutoLayout = $derived(
        enableAutoLayout === false ? true : enableAutoLayout,
    );
    const resolvedSelectParts = $derived({
        ...parts,
        Listbox: {
            search: false,
            showCheck: true,
            ...parts?.Listbox,
        },
    });

    const resolvedValue = $derived(
        selectionMode === "action"
            ? undefined
            : resolveFrameFieldValue(value, defaultValue),
    );
    const resolvedValueStr = $derived(
        resolvedValue !== undefined ? String(resolvedValue) : undefined,
    );
    const resolvedInvalid = $derived(resolveFrameFieldInvalid(invalid, {}));

    const fieldContext = getField();
    const isEmbedded = $derived(!!fieldContext);

    // 唯一 ID（用于 ARIA 关联）
    const uid = Math.random().toString(36).slice(2, 9);
    const listboxId = `snowui-sel-lb-${uid}`;
    const triggerId = $derived(id ?? `snowui-sel-tr-${uid}`);

    // DOM refs
    let selectEl = $state<HTMLElement | undefined>(undefined);
    let triggerEl = $state<HTMLButtonElement | undefined>(undefined);
    let hiddenInputEl = $state<HTMLInputElement | undefined>(undefined);

    // UI state
    let open = $state(false);
    let activeIndex = $state(-1);
    let hasCustomTrailing = $state(false);

    // 通过 MenuItem 注册收集的选项
    let registeredOptions = $state<ListboxOptionRegistration[]>([]);

    // 搜索过滤状态
    let filterText = $state("");

    // 用户自定义选项（通过 Input as="search" + Enter 添加）
    let customOptions = $state<ListboxOptionRegistration[]>([]);
    let listboxShowCheck = $state(true);

    // 过滤后的选项：filterText 为空时返回全量；否则按以下顺序匹配（任意一条命中即保留）：
    // 自定义项始终显示（不参与过滤，由 MenuItem 自身判断）
    // 匹配策略由 src/lib/search-filter.ts 的 matchesSearch 统一处理
    const filteredOptions = $derived.by(() => {
        if (!filterText) return registeredOptions;
        return registeredOptions.filter(o => matchesSearch(o.label, filterText));
    });

    // 派生显示值
    const hasValue = $derived(resolvedValueStr !== undefined && resolvedValueStr !== "");
    const selectedOption = $derived(
        registeredOptions.find((o) => o.value === resolvedValueStr) ??
        customOptions.find((o) => o.value === resolvedValueStr)
    );
    const selectedLabel = $derived(selectedOption?.label ?? (hasValue ? resolvedValueStr : undefined));
    const isPlaceholderVisible = $derived(!hasValue);

    // 外置 trailing 替换默认 indicator。内置 ComponentIcon 自身是直系 trailing。
    $effect(() => {
        if (!selectEl) return;
        const host = selectEl;

        const update = () => {
            hasCustomTrailing = Array.from(host.children).some((child) => {
                if (!(child instanceof HTMLElement)) return false;
                if (child.dataset.as !== "trailing") return false;
                return !child.matches(".snowui-select-indicator")
                    && !child.querySelector(".snowui-select-indicator");
            });
        };

        update();
        const observer = new MutationObserver(update);
        observer.observe(host, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ["data-as", "class"],
        });
        return () => observer.disconnect();
    });

    // ── ListboxOwnerContext：与子 Listbox / MenuItem 通信 ──
    const ownerContext: ListboxOwnerContext = {
        get open() { return open; },
        get selectedValue() { return resolvedValueStr; },
        get activeIndex() { return activeIndex; },
        get showCheck() { return listboxShowCheck; },
        get search() { return false; },
        get triggerEl() { return buttonTrigger ? (selectEl ?? null) : (triggerEl ?? null); },
        get anchorEl() {
            // 宽度锚点：优先以最近 .snowui-field（含 label 的整体）等宽
            const currentTrigger = buttonTrigger ? selectEl : triggerEl;
            const fieldEl = currentTrigger?.closest(".snowui-field") as HTMLElement | null;
            return fieldEl ?? (currentTrigger?.closest(".snowui-select") as HTMLElement | null);
        },
        listboxId,
        get triggerId() { return triggerId; },
        get options() { return filteredOptions; },
        get filterText() { return filterText; },
        get customOptions() { return customOptions; },
        registerOption(option: ListboxOptionRegistration) {
            // 避免重复注册
            if (registeredOptions.some(o => o.value === option.value)) return;
            registeredOptions = [...registeredOptions, option];
        },
        unregisterOption(val: string) {
            registeredOptions = registeredOptions.filter(o => o.value !== val);
        },
        selectOption(val: string) {
            handleOptionSelect(val);
        },
        setActiveIndex(idx: number) {
            activeIndex = idx;
        },
        setOpen(val: boolean) {
            if (val) openListbox();
            else open = false;
        },
        setShowCheck(val: boolean) {
            listboxShowCheck = val;
        },
        setFilterText(v: string) {
            filterText = v;
        },
        addCustomOption(val: string) {
            const trimmed = val.trim();
            if (!trimmed) return;
            // 不与已有静态项或自定义项重复
            if (registeredOptions.some(o => o.value === trimmed)) return;
            if (customOptions.some(o => o.value === trimmed)) return;
            customOptions = [...customOptions, { value: trimmed, label: trimmed, disabled: false }];
        },
        removeCustomOption(val: string) {
            customOptions = customOptions.filter(o => o.value !== val);
            // 若删除的是当前选中项，清空选中
            if (resolvedValueStr === val) {
                value = undefined;
            }
        },
    };
    setContext(LISTBOX_OWNER_CONTEXT_KEY, ownerContext);

    // 关闭时清空搜索文本
    $effect(() => {
        if (!open) {
            filterText = "";
        }
    });

    // 打开 Listbox
    function openListbox() {
        const allOptions = [...registeredOptions, ...customOptions];
        const idx = allOptions.findIndex((o) => o.value === resolvedValueStr);
        activeIndex = idx >= 0 ? idx : 0;
        open = true;
    }

    // 选中某选项
    function handleOptionSelect(val: string) {
        if (selectionMode === "action") {
            open = false;
            if (buttonTrigger) selectEl?.querySelector<HTMLButtonElement>("button")?.focus();
            else triggerEl?.focus();
            onAction?.(val);
            return;
        }
        const prev = resolvedValueStr;
        value = val;
        open = false;
        if (buttonTrigger) selectEl?.querySelector<HTMLButtonElement>("button")?.focus();
        else triggerEl?.focus();
        if (val !== prev) {
            // 触发 change 事件（通过 hidden input 桥接）
            const ev = new Event("change", { bubbles: true });
            hiddenInputEl?.dispatchEvent(ev);
            userOnChange?.(ev);
            userOnInput?.(ev);
        }
    }

    function handleTriggerClick(e: MouseEvent) {
        if (disabled || readonly) return;
        open ? (open = false) : openListbox();
        userOnClick?.(e);
    }

    function handleTriggerKeydown(e: KeyboardEvent) {
        if (disabled || readonly) { userOnKeyDown?.(e); return; }
        const allOptions = [...filteredOptions, ...customOptions];
        const len = allOptions.length;
        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                if (!open) openListbox();
                else activeIndex = Math.min(activeIndex + 1, len - 1);
                break;
            case "ArrowUp":
                e.preventDefault();
                if (!open) openListbox();
                else activeIndex = Math.max(activeIndex - 1, 0);
                break;
            case "Enter":
            case " ":
                e.preventDefault();
                if (!open) openListbox();
                else if (activeIndex >= 0 && !allOptions[activeIndex]?.disabled)
                    handleOptionSelect(allOptions[activeIndex].value);
                break;
            case "Escape":
                if (open) { e.preventDefault(); open = false; }
                break;
            case "Tab":
                open = false;
                break;
        }
        userOnKeyDown?.(e);
    }

    const selectRenderHints = $derived({
        variant: userRenderHints?.variant ?? "line",
        width: userRenderHints?.width ?? "100%",
        height: userRenderHints?.height,
        radius: userRenderHints?.radius ?? "var(--radius-4)",
    });
</script>

<Frame
    bind:element={selectEl}
    tag="div"
    row
    class={`snowui-select snowui-rounded-rectangle${isEmbedded ? " snowui-field-host" : buttonTrigger ? "" : " snowui-field-bordered"}${userClass ? ` ${userClass}` : ""}`}
    data-as={typeof rest.as === "string" ? rest.as : undefined}
    data-invalid={resolvedInvalid ? "true" : undefined}
    data-placeholder-visible={isPlaceholderVisible ? "true" : undefined}
    data-embedded={isEmbedded ? "true" : undefined}
    data-field-control={isEmbedded ? "select" : undefined}
    data-readonly={readonly ? "true" : undefined}
    data-open={open ? "true" : undefined}
    {disabled}
    style={userStyle || undefined}
    enableResponsive={enableResponsive}
    enableContext={enableContext}
    enableScaleObserver={enableScaleObserver}
    enableAutoLayout={internalAutoLayout}
    renderHints={selectRenderHints}
    componentParts={resolvedSelectParts}
    {...frameRestProps}
>
    <!-- 隐藏表单提交 input（替代原 hidden <select>） -->
    {#if name}
        <input
            bind:this={hiddenInputEl}
            type="hidden"
            {name}
            value={resolvedValueStr ?? ""}
            {form}
        />
    {/if}

    {#if buttonTrigger}
        <Button
            class="snowui-select-button-trigger"
            bare={buttonBare}
            id={triggerId}
            aria-label={ariaLabel}
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={listboxId}
            aria-activedescendant={open && activeIndex >= 0 ? `${listboxId}-opt-${activeIndex}` : undefined}
            disabled={disabled || undefined}
            onclick={handleTriggerClick}
            onkeydown={handleTriggerKeydown}
        >
            {#if triggerContent}
                {@render triggerContent({
                    value: resolvedValue,
                    option: selectedOption,
                    label: selectedLabel,
                    placeholder,
                    open,
                    disabled,
                })}
            {:else}
                {selectedLabel ?? placeholder ?? ariaLabel ?? ""}
            {/if}
        </Button>
    {:else}
    <!-- 自定义 Trigger 按钮 -->
    <!-- svelte-ignore a11y_autofocus -->
    <button
        bind:this={triggerEl}
        class="snowui-select-trigger snowui-native-control"
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-activedescendant={open && activeIndex >= 0 ? `${listboxId}-opt-${activeIndex}` : undefined}
        aria-invalid={resolvedInvalid ? "true" : undefined}
        aria-disabled={disabled || undefined}
        id={triggerId}
        {tabindex}
        {title}
        {autofocus}
        disabled={disabled || undefined}
        onclick={handleTriggerClick}
        onkeydown={handleTriggerKeydown}
        onfocus={userOnFocus}
        onblur={userOnBlur}
        onkeyup={userOnKeyUp}
    >
        <span class="snowui-select-value">
            {hasValue ? selectedLabel : (placeholder ?? "")}
        </span>
    </button>
    {/if}

    <!-- 指示器图标（箭头） -->
    {#if !buttonTrigger && !hasCustomTrailing}
        <ComponentIcon name="arrow-line-up-down" as="trailing" class="snowui-select-indicator" size="var(--size-4)" aria-hidden="true" onclick={handleTriggerClick} />
    {/if}

    <!-- 默认内置模式生成 Listbox + MenuItem；显式 children 存在时切换为显式组合模式。 -->
    {#if children}
        {@render children()}
    {:else}
        <Listbox
            as="listbox"
            items={options}
            parts={parts?.Input || parts?.MenuItem
                ? { Input: parts?.Input, MenuItem: parts?.MenuItem }
                : undefined}
        />
    {/if}
</Frame>

<style>
    /* ── 宿主容器 ── */
    :global(:where(.snowui-select)) {
        position: relative;
        flex-wrap: nowrap;
        --snowui-select-width: 100%;
        --snowui-select-height: auto;
        --snowui-select-radius: var(--radius-4);
        --snowui-select-background: var(--surface-1, #ffffffcc);
        --snowui-select-padding-y: var(--padding-3); /* 12px */
        --snowui-select-padding-x: var(--padding-4); /* 16px */
        --snowui-select-gap: var(--gap-2);
        --snowui-select-font-size: var(--text-14);
        --snowui-select-line-height: var(--leading-14);
        --snowui-select-placeholder-color: var(--black-20, #00000033);
        --snowui-select-indicator-color: var(--black-100, #000000ff);
        --snowui-select-indicator-size: var(--size-4);
        width: var(--snowui-select-width-override, var(--snowui-select-width));
        height: var(--snowui-select-height-override, var(--snowui-select-height));
        min-width: 0;
        gap: var(--snowui-select-gap-override, var(--snowui-select-gap));
        padding: var(--snowui-select-padding-y) var(--snowui-select-padding-x);
        border-radius: var(--snowui-select-radius-override, var(--snowui-select-radius));
        background-color: var(--snowui-select-background-override, var(--snowui-select-background));
        font-size: var(--snowui-select-font-size-override, var(--snowui-select-font-size));
        line-height: var(--snowui-select-line-height-override, var(--snowui-select-line-height));
        box-sizing: border-box;
    }

    :global(:where(.snowui-select:has(> .snowui-select-button-trigger))) {
        width: auto;
        height: auto;
        padding: 0;
        gap: 0;
        overflow: visible;
        border: 0;
        background: transparent;
        box-shadow: none;
    }

    /* 嵌入态（非 segment）：Field 接管外壳 */
    :global(:where(.snowui-select[data-embedded="true"]:not([data-as="segment"]))) {
        padding: var(--snowui-select-padding-override, 0);
        gap: var(--snowui-select-gap-override, var(--snowui-select-gap));
        border-radius: 0;
        background-color: transparent;
        overflow: visible;
    }

    /* segment 嵌入态：保留自身 padding（Field 通过 CSS 变量注入值） */
    :global(:where(.snowui-select[data-embedded="true"][data-as="segment"])) {
        padding: var(--snowui-select-padding-override, var(--snowui-select-padding-y) var(--snowui-select-padding-x));
        border-radius: 0;
        background-color: transparent;
    }

    /* 错误态 */
    :global(:where(.snowui-select[data-invalid="true"]:not([data-embedded="true"]))) {
        --snowui-field-border-color: var(--secondary-red, #ff4747ff);
        --snowui-field-hover-border-color: var(--secondary-red, #ff4747ff);
        --snowui-field-focus-border-color: var(--secondary-red, #ff4747ff);
    }

    /*
     * Select 暂时不显示 Field 通用焦点外环，只保留内边框焦点态。
     * 如需恢复外环，删除当前单行 box-shadow，并启用下方被注释的完整 box-shadow。
     */
    :global(:where(.snowui-select:focus-within:not([data-embedded="true"]):not(:has(> .snowui-select-button-trigger)))) {
        box-shadow: inset 0 0 0 var(--snowui-field-border-width, 0.03125rem) var(--snowui-field-focus-border-color, var(--black-40, #00000066));
        /*
        box-shadow:
            inset 0 0 0 var(--snowui-field-border-width, 0.03125rem) var(--snowui-field-focus-border-color, var(--black-40, #00000066)),
            0 0 0 var(--snowui-field-focus-ring-width, 0.25rem) var(--snowui-field-focus-ring-color, var(--black-4, #0000000a));
        */
    }

    /* 禁用态 */
    :global(:where(.snowui-select.snowui-disabled:not([data-embedded="true"]))),
    :global(:where(.snowui-select:not([data-embedded="true"]):has(.snowui-select-trigger:disabled))) {
        pointer-events: none;
    }

    /* 只读态背景 */
    :global(:where(.snowui-select[data-readonly="true"]:not([data-embedded="true"]))) {
        background-color: var(--surface-2, #00000008);
    }

    :global(:where(.snowui-select[data-readonly="true"] .snowui-select-trigger)) {
        pointer-events: none;
        cursor: default;
    }

    /* 骨架屏：确保在 flex row 容器内横向展开 */
    :global(:where(.snowui-select > .snowui-skeleton-layout)) {
        flex: 1 1 auto;
        min-width: 0;
    }

    /* 根级三槽位：leading / trigger(content) / trailing */
    :global(:where(.snowui-select > [data-as="leading"])),
    :global(:where(.snowui-select > [data-as="trailing"]:not(.snowui-select-indicator):not(:has(.snowui-select-indicator)))) {
        display: inline-flex;
        align-items: inherit;
        justify-content: center;
        gap: var(--snowui-select-gap-override, var(--snowui-select-gap));
        min-width: 0;
        white-space: nowrap;
    }

    :global(:where(.snowui-select:has(> [data-as="trailing"]:not(.snowui-select-indicator):not(:has(.snowui-select-indicator))) > .snowui-select-indicator)) {
        display: none;
    }

    /* ── Trigger button ── */
    :global(:where(.snowui-select-trigger)) {
        display: block;
        width: 100%;
        min-width: 0;
        min-height: var(--snowui-select-line-height-override, var(--snowui-select-line-height));
        padding: 0;
        border: 0;
        outline: none;
        background: transparent;
        color: inherit;
        font-size: inherit;
        line-height: inherit;
        text-align: left;
        cursor: pointer;
        box-sizing: border-box;
    }

    :global(:where(.snowui-select:has(> [data-as]) > .snowui-select-trigger)) {
        grid-row: 1;
        min-width: 0;
    }

    :global(:where(.snowui-select:has(> [data-as="leading"]) > .snowui-select-trigger)) {
        grid-column: 2;
    }

    :global(:where(.snowui-select:not(:has(> [data-as="leading"])):has(> [data-as="trailing"]) > .snowui-select-trigger)) {
        grid-column: 1;
    }

    :global(:where(.snowui-select-trigger:focus)) {
        outline: none;
    }

    :global(:where(.snowui-select-trigger:disabled)) {
        cursor: not-allowed;
    }

    /* ── Value 显示文本 ── */
    :global(:where(.snowui-select-value)) {
        display: block;
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        color: inherit;
    }

    /* placeholder 状态 */
    :global(:where(.snowui-select[data-placeholder-visible="true"] .snowui-select-value)) {
        color: var(--snowui-select-placeholder-color-override, var(--snowui-select-placeholder-color));
    }

    /* ── 指示器图标 ── */
    :global(:where(.snowui-select-indicator)) {
        display: flex;
        align-items: center;
        justify-content: center;
        align-self: auto;
        width: var(--snowui-select-indicator-size-override, var(--snowui-select-indicator-size));
        height: var(--snowui-select-indicator-size-override, var(--snowui-select-indicator-size));
        min-width: var(--snowui-select-indicator-size-override, var(--snowui-select-indicator-size));
        min-height: var(--snowui-select-indicator-size-override, var(--snowui-select-indicator-size));
        color: var(--snowui-select-indicator-color-override, var(--snowui-select-indicator-color));
        opacity: var(--snowui-state-opacity, 0.4);
        cursor: pointer;
        flex-shrink: 0;
        transition:
            transform
                var(--snowui-frame-color-motion-duration, 0.15s)
                var(--snowui-frame-color-motion-easing, ease-out),
            color
                var(--snowui-frame-color-motion-duration, 0.15s)
                var(--snowui-frame-color-motion-easing, ease-out),
            opacity
                var(--snowui-frame-color-motion-duration, 0.15s)
                var(--snowui-frame-color-motion-easing, ease-out);
    }

    :global(:where(.snowui-select-indicator:hover)),
    :global(:where(.snowui-select:hover .snowui-select-indicator)) {
        opacity: var(--snowui-state-opacity, 1);
    }
</style>
