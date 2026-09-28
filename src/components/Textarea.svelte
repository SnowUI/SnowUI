<!--
 Textarea 组件：基础多行文本输入框
 v1.0.1

 文档: ./Textarea.md
-->

<script lang="ts">
    import Frame, { type FrameProps } from "./Frame.svelte";
    import Indicator, { type IndicatorAxis } from "./Indicator.svelte";
    import { getField } from "../context";
    import {
        resolveFrameFieldInvalid,
        resolveFrameFieldValue,
        syncFrameFieldValue,
    } from "../logic/frame-field-control";
    import { resizeManager } from "../logic/observer.svelte";
    import { splitFrameHostProps } from "../logic/frame-prop-filter";
    import { useOverlayScrollbar } from "../lib/overlay-scrollbar.svelte";
    import type { ComponentPartsOf } from "../logic/component-parts.svelte";
    import type { HTMLTextareaAttributes } from "svelte/elements";

    interface Props extends Omit<FrameProps, "children" | "tag"> {
        value?: string;
        defaultValue?: string;
        placeholder?: string;
        maxCount?: number;
        exceeded?: boolean;
        name?: string;
        disabled?: boolean;
        readonly?: boolean;
        required?: boolean;
        rows?: number;
        cols?: number;
        minlength?: number;
        maxlength?: number;
        wrap?: HTMLTextareaAttributes["wrap"];
        spellcheck?: boolean;
        autocomplete?: HTMLTextareaAttributes["autocomplete"];
        enterkeyhint?: HTMLTextareaAttributes["enterkeyhint"];
        inputmode?: HTMLTextareaAttributes["inputmode"];
        form?: string;
        autofocus?: boolean;
        tabindex?: number;
        title?: string;
        id?: string;
        resize?: "none" | "vertical" | "horizontal" | "both";
        invalid?: boolean;
        parts?: ComponentPartsOf<{ Indicator: typeof Indicator }>;
        onclick?: (event: MouseEvent) => void;
        ondblclick?: (event: MouseEvent) => void;
        oninput?: (event: Event) => void;
        onchange?: (event: Event) => void;
        onfocus?: (event: FocusEvent) => void;
        onblur?: (event: FocusEvent) => void;
        onkeydown?: (event: KeyboardEvent) => void;
        onkeyup?: (event: KeyboardEvent) => void;
        onkeypress?: (event: KeyboardEvent) => void;
        onpaste?: (event: ClipboardEvent) => void;
        oncopy?: (event: ClipboardEvent) => void;
        oncut?: (event: ClipboardEvent) => void;
        [key: string]: any;
    }

    let {
        value = $bindable(),
        defaultValue = undefined,
        placeholder = undefined,
        maxCount = undefined,
        exceeded = $bindable(false),
        name = undefined,
        disabled = false,
        readonly = false,
        required = false,
        rows = 2,
        cols = undefined,
        minlength = undefined,
        maxlength = undefined,
        wrap = undefined,
        spellcheck = undefined,
        autocomplete = undefined,
        enterkeyhint = undefined,
        inputmode = undefined,
        form = undefined,
        autofocus = undefined,
        tabindex = undefined,
        title = undefined,
        id = undefined,
        resize = "both",
        invalid = false,
        parts = undefined,
        onclick: userOnClick = undefined,
        ondblclick: userOnDoubleClick = undefined,
        oninput: userOnInput = undefined,
        onchange: userOnChange = undefined,
        onfocus: userOnFocus = undefined,
        onblur: userOnBlur = undefined,
        onkeydown: userOnKeyDown = undefined,
        onkeyup: userOnKeyUp = undefined,
        onkeypress: userOnKeyPress = undefined,
        onpaste: userOnPaste = undefined,
        oncopy: userOnCopy = undefined,
        oncut: userOnCut = undefined,
        enableResponsive = false,
        enableContext = true,
        enableScaleObserver = false,
        class: userClass = "",
        style: userStyle = "",
        renderHints: userRenderHints = undefined,
        ...rest
    }: Props = $props();

    const splitProps = $derived.by(() => splitFrameHostProps(rest));
    const frameRestProps = $derived(splitProps.frameProps);
    const textareaRestProps = $derived(splitProps.hostProps);

    const resolvedValue = $derived(resolveFrameFieldValue(value, defaultValue));
    const resolvedInvalid = $derived(
        resolveFrameFieldInvalid(invalid, textareaRestProps),
    );
    const fieldContext = getField();
    const isEmbedded = $derived(!!fieldContext);
    const effectiveResize = $derived(readonly || disabled ? 'none' : resize);
    const effectiveRows = $derived(readonly ? undefined : rows);
    const currentLength = $derived((resolvedValue ?? '').length);
    const isExceeded = $derived(maxCount !== undefined && currentLength > maxCount);
    const showCounter = $derived(maxCount !== undefined);
    $effect(() => { exceeded = isExceeded; });

    const textareaRenderHints = $derived({
        variant: userRenderHints?.variant ?? "rect",
        width: userRenderHints?.width ?? "100%",
        height: userRenderHints?.height,
        radius: userRenderHints?.radius ?? "var(--radius-4)",
    });

    function syncValueFromTarget(target: EventTarget | null) {
        syncFrameFieldValue(target, (nextValue) => {
            value = nextValue;
        });
    }

    function handleInput(event: Event) {
        syncValueFromTarget(event.currentTarget);
        userOnInput?.(event);
        updateAutoHeight();
        updateScrollFade();
    }

    function handleChange(event: Event) {
        syncValueFromTarget(event.currentTarget);
        userOnChange?.(event);
        updateAutoHeight();
        updateScrollFade();
    }

    let textareaEl: HTMLTextAreaElement | undefined = $state(undefined);
    let textareaHostEl: HTMLElement | undefined = $state(undefined);
    let scrollbarEl: HTMLDivElement | undefined = $state(undefined);
    let showTopFade = $state(false);
    let showBottomFade = $state(false);
    let resizeWidth = $state<number | undefined>(undefined);
    let resizeHeight = $state<number | undefined>(undefined);
    let autoHeight = $state<number | undefined>(undefined);

    const sb = useOverlayScrollbar(
        () => textareaEl,
        () => scrollbarEl,
    );

    function refreshScrollbar() {
        sb.refresh();
    }

    function updateAutoHeight() {
        if (!textareaEl || resizeHeight !== undefined) return;
        const el = textareaEl;
        const prevH = el.style.height;
        el.style.height = 'auto';
        const scrollH = el.scrollHeight;
        el.style.height = prevH;
        const lh = parseFloat(getComputedStyle(el).lineHeight);
        const maxH = Number.isFinite(lh) ? lh * 15 : scrollH;
        autoHeight = Math.min(scrollH, maxH);
        refreshScrollbar();
    }

    const indicatorAxis = $derived<IndicatorAxis>(
        effectiveResize === "horizontal"
            ? "width"
            : effectiveResize === "both"
              ? "both"
              : "height",
    );

    function handleIndicatorSize(next: number, axis: "width" | "height") {
        if (axis === "width") resizeWidth = next;
        else resizeHeight = next;
        updateScrollFade();
    }

    const textareaAutoStyle = $derived(
        resizeHeight === undefined && autoHeight !== undefined
            ? `height:${autoHeight}px`
            : undefined
    );

    const mergedStyle = $derived([
        userStyle || '',
        resizeWidth !== undefined ? `width:${resizeWidth}px` : '',
        resizeHeight !== undefined ? `height:${resizeHeight}px` : '',
    ].filter(Boolean).join(';') || undefined);

    function updateScrollFade() {
        if (!textareaEl) return;
        const { scrollTop, clientHeight, scrollHeight } = textareaEl;
        showTopFade = scrollTop > 1;
        showBottomFade = scrollTop + clientHeight < scrollHeight - 1;
        refreshScrollbar();
    }

    function resolveScrollMask(showTop: boolean, showBottom: boolean) {
        if (showTop && showBottom) return "both";
        if (showTop) return "top";
        if (showBottom) return "bottom";
        return undefined;
    }

    $effect(() => {
        const el = textareaEl;
        if (!el) return;
        updateScrollFade();
        updateAutoHeight();
        el.addEventListener('scroll', updateScrollFade);
        const unwatch = resizeManager.watch(el, () => {
            updateScrollFade();
            updateAutoHeight();
            refreshScrollbar();
        });
        return () => {
            el.removeEventListener('scroll', updateScrollFade);
            unwatch();
        };
    });

    // 外部 value 变化时重新测量高度
    $effect(() => {
        resolvedValue;
        updateAutoHeight();
        refreshScrollbar();
    });
</script>

<Frame
    bind:element={textareaHostEl}
    tag="div"
    class={`snowui-textarea snowui-rounded-rectangle snowui-overlay-scrollbar-host${isEmbedded ? " snowui-field-host" : " snowui-field-bordered"}${userClass ? ` ${userClass}` : ""}`}
    data-invalid={resolvedInvalid ? "true" : undefined}
    data-readonly={readonly ? "true" : undefined}
    data-resize={effectiveResize}
    data-embedded={isEmbedded ? "true" : undefined}
    data-field-control={isEmbedded ? "textarea" : undefined}
    {disabled}
    style={mergedStyle}
    enableResponsive={enableResponsive}
    enableContext={enableContext}
    enableScaleObserver={enableScaleObserver}
    renderHints={textareaRenderHints}
    componentParts={parts}
    {...frameRestProps}
>
    <!-- svelte-ignore a11y_autofocus -->
    <textarea
        {...textareaRestProps}
        bind:this={textareaEl}
        class={`snowui-textarea-control snowui-native-control${readonly ? "" : " snowui-overlay-scrollbar-viewport snowui-scroll-mask"}`}
        data-scroll-mask={!readonly && !isEmbedded
            ? resolveScrollMask(showTopFade, showBottomFade)
            : undefined}
        style={textareaAutoStyle}
        {id}
        {name}
        {placeholder}
        {disabled}
        {readonly}
        {required}
        rows={effectiveRows}
        {cols}
        {minlength}
        {maxlength}
        {wrap}
        {spellcheck}
        {autocomplete}
        {enterkeyhint}
        {inputmode}
        {form}
        {autofocus}
        {tabindex}
        {title}
        value={resolvedValue}
        aria-invalid={resolvedInvalid
            ? "true"
            : textareaRestProps["aria-invalid"]}
        onclick={userOnClick}
        ondblclick={userOnDoubleClick}
        oninput={handleInput}
        onchange={handleChange}
        onfocus={userOnFocus}
        onblur={userOnBlur}
        onkeydown={userOnKeyDown}
        onkeyup={userOnKeyUp}
        onkeypress={userOnKeyPress}
        onpaste={userOnPaste}
        oncopy={userOnCopy}
        oncut={userOnCut}
    ></textarea>
    <div
        bind:this={scrollbarEl}
        class="snowui-textarea-scrollbar snowui-overlay-scrollbar"
        data-visible={!readonly && sb.hasOverflow ? "true" : undefined}
        aria-hidden="true"
    >
        <div
            class="snowui-overlay-scrollbar-thumb"
            style="height: {sb.thumbHeight}px; transform: translate3d(0, {sb.thumbY}px, 0);"
        ></div>
    </div>
    <div
        class="snowui-textarea-footer snowui-textarea-default-pin-bottom-right"
        data-as="pin-bottom-right"
        style="--pin-offset: var(--padding-1);"
    >
        {#if showCounter}
            <span class="snowui-textarea-counter" data-exceeded={isExceeded ? "true" : undefined}>{currentLength}/{maxCount}</span>
        {/if}
        {#if effectiveResize !== "none"}
            <Indicator
                as="resize-handle"
                target={textareaHostEl}
                revealTarget={textareaHostEl}
                axis={indicatorAxis}
                appearance="corner"
                value={indicatorAxis === "width" ? resizeWidth : resizeHeight}
                minWidth={120}
                minHeight={60}
                applySize={false}
                ariaLabel="调整文本域大小"
                onSizeChange={handleIndicatorSize}
            />
        {/if}
    </div>
</Frame>

<style>
    :global(:where(.snowui-textarea)) {
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        align-items: stretch;
        align-self: start;
        position: relative;
        cursor: var(--snowui-field-cursor, text);
        --snowui-textarea-width: 100%;
        --snowui-textarea-height: auto;
        --snowui-textarea-min-height: calc(var(--snowui-textarea-padding-top) + var(--snowui-textarea-padding-bottom) + var(--snowui-textarea-line-height));
        --snowui-textarea-radius: var(--radius-4);
        --snowui-textarea-background: var(--surface-1, #ffffffcc);
        --snowui-textarea-padding-top: var(--padding-3);
        --snowui-textarea-padding-right: var(--padding-4);
        --snowui-textarea-padding-bottom: var(--padding-3);
        --snowui-textarea-padding-left: var(--padding-4);
        --snowui-textarea-gap: var(--gap-2);
        --snowui-textarea-font-size: var(--text-14);
        --snowui-textarea-line-height: var(--leading-14);
        --snowui-textarea-placeholder-color: var(--black-20, #00000033);
        --snowui-textarea-footer-height: var(--padding-3);
        width: var(
            --snowui-textarea-width-override,
            var(--snowui-textarea-width)
        );
        height: var(
            --snowui-textarea-height-override,
            var(--snowui-textarea-height)
        );
        min-height: var(
            --snowui-textarea-min-height-override,
            var(--snowui-textarea-min-height)
        );
        min-width: 0;
        gap: 0;
        border-radius: var(
            --snowui-textarea-radius-override,
            var(--snowui-textarea-radius)
        );
        background-color: var(
            --snowui-textarea-background-override,
            var(--snowui-textarea-background)
        );
        font-size: var(
            --snowui-textarea-font-size-override,
            var(--snowui-textarea-font-size)
        );
        line-height: var(
            --snowui-textarea-line-height-override,
            var(--snowui-textarea-line-height)
        );
        box-sizing: border-box;
        padding: var(--snowui-textarea-padding-top)
            0
            var(--snowui-textarea-footer-height)
            var(--snowui-textarea-padding-left);
    }

    :global(:where(.snowui-textarea[data-embedded="true"])) {
        padding: 0;
        gap: 0;
        border-radius: 0;
        background-color: transparent;
        overflow: visible;
    }

    /* 文字显示区域：限制文字始终在此容器内 */
    /* body wrapper removed — textarea is a direct flex child again for resize to work */

    /* 边框提升到 ::after，确保永远渲染在遮罩层（z-index: 1）之上。
     * 父级 box-shadow（渲染在子元素之下）被抑制，由 ::after 接管。
     * 移除父级 overflow:hidden，使 ::after 的外层 focus ring 不被裁剪。
     */
    :global(.snowui-textarea:not([data-embedded="true"]),
            .snowui-textarea:not([data-embedded="true"]):hover,
            .snowui-textarea:not([data-embedded="true"]):focus-within) {
        box-shadow: none;
    }
    :global(.snowui-textarea:not([data-embedded="true"]):not([data-readonly="true"]):not(:has(> .snowui-skeleton-layout))::after) {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: inherit;
        corner-shape: inherit;
        pointer-events: none;
        z-index: 2;
        box-shadow: inset 0 0 0 var(--snowui-field-border-width, 0.03125rem)
            var(--snowui-field-border-color, var(--black-20, #00000033));
        transition: box-shadow
            var(--snowui-frame-color-motion-duration, 0.15s)
            var(--snowui-frame-color-motion-easing, ease-out);
    }
    :global(.snowui-textarea:not([data-embedded="true"]):not([data-readonly="true"]):hover::after) {
        box-shadow: inset 0 0 0 var(--snowui-field-border-width, 0.03125rem)
            var(--snowui-field-hover-border-color, var(--black-20, #00000033));
    }
    :global(.snowui-textarea:not([data-embedded="true"]):not([data-readonly="true"]):focus-within::after) {
        box-shadow:
            inset 0 0 0 var(--snowui-field-border-width, 0.03125rem)
                var(--snowui-field-focus-border-color, var(--black-40, #00000066)),
            0 0 0 var(--snowui-field-focus-ring-width, 0.25rem)
                var(--snowui-field-focus-ring-color, var(--black-4, #0000000a));
    }

    :global(
            :where(
                    .snowui-textarea[data-readonly="true"]:not(
                            [data-embedded="true"]
                        )
                )
        ) {
        --snowui-textarea-background: var(--surface-2, #00000008);
        background-color: var(--surface-2, #00000008);
        min-height: 0;
        box-shadow: none;
    }
    :global(
            :where(
                    .snowui-textarea[data-readonly="true"] .snowui-textarea-control
                )
        ) {
        -webkit-mask-image: none;
        mask-image: none;
    }

    :global(
            :where(
                    .snowui-field:has(
                            .snowui-textarea.snowui-field-host[data-readonly="true"]
                        )
                )
        ) {
        box-shadow: none;
    }

    :global(
            :where(
                    .snowui-textarea[data-invalid="true"]:not(
                            [data-embedded="true"]
                        )
                )
        ) {
        --snowui-field-border-color: var(--secondary-red, #ff4747ff);
        --snowui-field-hover-border-color: var(--secondary-red, #ff4747ff);
        --snowui-field-focus-border-color: var(--secondary-red, #ff4747ff);
    }

    /* 禁用态控制回收至 layout.css — 保留选择器供调试追踪，规则为空属预期 */
    :global(:where(.snowui-textarea.snowui-disabled:not([data-embedded="true"]),
            .snowui-textarea:not([data-embedded="true"]):has(.snowui-textarea-control:disabled))) {
        --_disabled-placeholder: 0; /* stylelint-disable-line */
    }

    /* 骨架屏：确保在 flex 容器内横向展开 */
    :global(:where(.snowui-textarea > .snowui-skeleton-layout)) {
        flex: 1 1 auto;
    }

    /* 上下滚动渐隐：接入「内容渐隐层」通用能力的 CSS 静态形态（.snowui-scroll-mask，见 lib/edge-fade.md）。 */
    :global(:where(.snowui-textarea-control)) {
        --snowui-textarea-scroll-mask-size: var(
            --snowui-textarea-scroll-mask-size-override,
            32px
        );
        display: block;
        flex: 1 1 auto;
        width: 100%;
        min-width: 0;
        min-height: 0;
        padding: 0 var(--snowui-textarea-padding-right) 0 0;
        border: 0;
        outline: none;
        resize: none;
        background: transparent;
        color: inherit;
        font-size: inherit;
        line-height: inherit;
        caret-color: currentColor;
        -webkit-appearance: none;
        appearance: none;
        overflow-x: hidden;
        /* 滚动行为与原生滚动条隐藏由 .snowui-overlay-scrollbar-viewport 承接 */
    }

    :global(:where(.snowui-textarea[data-readonly="true"] .snowui-textarea-control)) {
        field-sizing: content;
        height: auto;
        overflow: hidden;
    }

    :global(
            :where(
                    .snowui-textarea[data-embedded="true"]
                        .snowui-textarea-control
                )
        ) {
        min-height: 0;
        padding: var(
            --snowui-textarea-padding-override,
            var(--snowui-textarea-padding-top)
                var(--snowui-textarea-padding-right)
                var(--snowui-textarea-padding-bottom)
                var(--snowui-textarea-padding-left)
        );
    }

    /* 组件只声明轨道定位；视觉样式由 scrollbar.css 的 .snowui-overlay-scrollbar 承接。 */
    :global(:where(.snowui-textarea-scrollbar)) {
        top: var(--snowui-textarea-padding-top);
        bottom: var(--snowui-textarea-footer-height);
        right: var(--padding-1);
        z-index: 3;
    }

    :global(:where(.snowui-textarea[data-embedded="true"] .snowui-textarea-scrollbar)) {
        top: 0;
        bottom: 0;
        right: calc(var(--padding-1) - var(--padding-4));
    }

    :global(:where(.snowui-textarea-footer)) {
        display: inline-flex;
        align-items: center;
        justify-content: flex-end;
        gap: 0;
        min-width: 0;
        pointer-events: none;
        /* Resize 命中区高于 scrollbar；footer 空白区仍可穿透。 */
        z-index: 4;
        color: var(--black-20, #00000033);
    }

    /* 嵌入 Field 时，footer 定位基准是 .snowui-textarea 容器（padding: 0），
     * 但 Field 有 padding: padding-3 padding-4，两个方向的偏移都需要补偿：
     *   bottom: padding-1 - padding-3 = -8px → 进入 Field padding-bottom，距底 border 4px
     *   right:  padding-1 - padding-4 = -12px → 进入 Field padding-right，距右 border 4px
     * 必须置于通用 footer 规则之后（:where() 特异性 0，后者覆盖前者）。 */
    :global(:where(.snowui-textarea[data-embedded="true"] .snowui-textarea-footer)) {
        --pin-offset-y: calc(var(--padding-1) - var(--padding-3));
        --pin-offset-x: calc(var(--padding-1) - var(--padding-4));
    }

    :global(:where(.snowui-textarea-counter)) {
        visibility: hidden;
        color: var(--black-20, #00000033);
        font-size: var(--text-12);
        line-height: var(--leading-12);
        text-align: right;
        white-space: nowrap;
    }

    :global(:where(.snowui-textarea:hover .snowui-textarea-counter)),
    :global(:where(.snowui-textarea-counter[data-exceeded="true"])) {
        visibility: visible;
    }

    :global(:where(.snowui-textarea-counter[data-exceeded="true"])) {
        color: var(--secondary-red, #ff4747ff);
    }

    /* 隐藏浏览器原生 resize 手柄，使用自定义图标替代 */
    :global(:where(.snowui-textarea-control::-webkit-resizer)) {
        display: none;
        width: 0;
        height: 0;
    }

    :global(:where(.snowui-textarea-control::placeholder)) {
        color: var(
            --snowui-textarea-placeholder-color-override,
            var(--snowui-textarea-placeholder-color)
        );
        -webkit-text-fill-color: var(
            --snowui-textarea-placeholder-color-override,
            var(--snowui-textarea-placeholder-color)
        );
        opacity: 1;
    }

    :global(:where(.snowui-textarea-control::-webkit-input-placeholder)) {
        color: var(
            --snowui-textarea-placeholder-color-override,
            var(--snowui-textarea-placeholder-color)
        );
        -webkit-text-fill-color: var(
            --snowui-textarea-placeholder-color-override,
            var(--snowui-textarea-placeholder-color)
        );
        opacity: 1;
    }

    :global(:where(.snowui-textarea-control::-moz-placeholder)) {
        color: var(
            --snowui-textarea-placeholder-color-override,
            var(--snowui-textarea-placeholder-color)
        );
        opacity: 1;
    }

    :global(:where(.snowui-textarea-control:-ms-input-placeholder)) {
        color: var(
            --snowui-textarea-placeholder-color-override,
            var(--snowui-textarea-placeholder-color)
        );
        opacity: 1;
    }

    :global(:where(.snowui-textarea-control::-ms-input-placeholder)) {
        color: var(
            --snowui-textarea-placeholder-color-override,
            var(--snowui-textarea-placeholder-color)
        );
        opacity: 1;
    }

</style>
