<!-- SnowUI source notice | LICENSE 2.3.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 -->
<script lang="ts">
    import { onDestroy, type Snippet } from "svelte";
    import { useNativeValidation } from "../logic/native-validation.svelte";
    import Text from "./Text.svelte";
    import { useLocale } from "../i18n/locale.svelte";
    import { TAB_INDICATOR_MOTION_STYLE } from "../motion/presets/tab";
    import Frame, { type FrameProps } from "./Frame.svelte";
    import { splitFrameHostProps } from "../logic/frame-prop-filter";
    import type { HTMLInputAttributes } from "svelte/elements";

    export type OTPLength = 4 | 5 | 6 | 7 | 8;

    interface Props extends Omit<FrameProps, "tag" | "children" | "enableScaleObserver" | "oninput" | "onchange" | "onfocus" | "onblur" | "onkeydown" | "onpaste"> {
        value?: string;
        defaultValue?: string;
        length?: OTPLength;
        name?: string;
        form?: string;
        disabled?: boolean;
        readonly?: boolean;
        required?: boolean;
        autocomplete?: HTMLInputAttributes["autocomplete"];
        autofocus?: boolean;
        tabindex?: number;
        id?: string;
        title?: string;
        invalid?: boolean;
        success?: boolean;
        error?: string | Snippet;
        oncomplete?: (value: string) => void;
        oninput?: (event: Event) => void;
        onchange?: (event: Event) => void;
        onfocus?: (event: FocusEvent) => void;
        onblur?: (event: FocusEvent) => void;
        onkeydown?: (event: KeyboardEvent) => void;
        onpaste?: (event: ClipboardEvent) => void;
        [key: string]: any;
    }

    let {
        value = $bindable(),
        defaultValue,
        length = 6,
        name,
        form,
        disabled = false,
        readonly = false,
        required = false,
        autocomplete = "one-time-code",
        autofocus,
        tabindex,
        id,
        title,
        invalid = false,
        success = $bindable(false),
        error,
        enableResponsive = true,
        enableContext = true,
        oncomplete,
        oninput,
        onchange,
        onfocus,
        onblur,
        onkeydown,
        onpaste,
        class: userClass = "",
        style: userStyle = "",
        ...rest
    }: Props = $props();

    let inputElement = $state<HTMLInputElement>();
    const nativeValidation = useNativeValidation(() => inputElement);
    const locale = useLocale();
    const instanceId = $props.id();
    const errorId = `${instanceId}-error`;
    let focused = $state(false);
    let hoveredIndex = $state<number | undefined>();
    let pasteInvalid = $state(false);
    let incompleteInvalid = $state(false);
    let errorTimer: ReturnType<typeof setTimeout> | undefined;
    const resolvedInvalid = $derived(invalid || pasteInvalid || incompleteInvalid || !!nativeValidation.message);
    const errorContent = $derived(nativeValidation.message || (error ?? locale.t("otpInput.invalidCode", { length })));
    onDestroy(() => { if (errorTimer) clearTimeout(errorTimer); });
    let selectionIndex = $state(0);
    let initialValue = "";
    let initialized = false;
    let lastUserCompletion = "";
    let resetTimer: ReturnType<typeof setTimeout> | undefined;

    const splitProps = $derived.by(() => splitFrameHostProps(rest));
    const frameRestProps = $derived(splitProps.frameProps);
    const inputRestProps = $derived(splitProps.hostProps);

    // 空格仅表示尚未填写的格子；尾部空格不进入外部值。
    const normalize = (raw: unknown) => String(raw ?? "").replace(/[^0-9 ]/g, "").slice(0, length).replace(/ +$/, "");
    const currentValue = $derived(normalize(value === undefined ? defaultValue : value));
    const digits = $derived(Array.from({ length }, (_, index) => currentValue[index] === " " ? "" : currentValue[index] ?? ""));
    const activeIndex = $derived(Math.min(selectionIndex, length - 1));
    const groupLabel = $derived(inputRestProps["aria-label"]);
    const groupLabelledby = $derived(inputRestProps["aria-labelledby"]);
    const nativeInputProps = $derived.by(() => {
        const { "aria-label": _label, "aria-labelledby": _labelledby, ...props } = inputRestProps;
        return props;
    });

    $effect(() => {
        const normalized = currentValue;
        if (!initialized) {
            initialValue = normalize(defaultValue ?? normalized);
            initialized = true;
        }
        if (value !== normalized) value = normalized;
        if (normalized.length < length) lastUserCompletion = "";
    });

    $effect(() => {
        if (!success) return;
        const timer = setTimeout(() => { success = false; }, 2000);
        return () => clearTimeout(timer);
    });

    function formReset(node: HTMLInputElement, formId: string | undefined) {
        let active = true;
        const reset = (event: Event) => {
            if (event.target !== node.form) return;
            const valueBeforeReset = normalize(node.value);
            if (resetTimer) clearTimeout(resetTimer);
            resetTimer = setTimeout(() => {
                if (!active) return;
                value = normalize(event.defaultPrevented ? valueBeforeReset : initialValue);
                if (inputElement) inputElement.value = value;
                selectionIndex = value.length;
                if (!event.defaultPrevented) { lastUserCompletion = ""; incompleteInvalid = false; clearPasteError(); }
            }, 0);
        };
        document.addEventListener("reset", reset, true);
        return {
            update(nextFormId: string | undefined) {
                formId = nextFormId;
                void formId;
            },
            destroy() {
                active = false;
                document.removeEventListener("reset", reset, true);
                if (resetTimer) clearTimeout(resetTimer);
            },
        };
    }

    function commitFromUser(raw: string, filledLast = false) {
        const next = normalize(raw);
        const previous = currentValue;
        value = next;
        selectionIndex = inputElement?.selectionStart ?? next.length;
        if (next.length < length || !next.includes(" ")) incompleteInvalid = false;
        else if (filledLast) incompleteInvalid = true;
        if (/^[0-9]+$/.test(next) && next.length === length && next !== previous && next !== lastUserCompletion) {
            lastUserCompletion = next;
            oncomplete?.(next);
        }
    }

    function clearPasteError() {
        if (errorTimer) clearTimeout(errorTimer);
        errorTimer = undefined;
        pasteInvalid = false;
    }

    function rejectPaste(clear: boolean) {
        if (clear) {
            value = "";
            if (inputElement) inputElement.value = "";
            moveCaret(0);
        }
        if (errorTimer) clearTimeout(errorTimer);
        pasteInvalid = true;
        errorTimer = setTimeout(clearPasteError, 2000);
    }

    function moveCaret(index: number, select = false) {
        const at = Math.max(0, Math.min(index, length - 1));
        selectionIndex = at;
        if (inputElement && inputElement.value.length < at) inputElement.value = inputElement.value.padEnd(at, " ");
        inputElement?.setSelectionRange(at, select && at < currentValue.length ? at + 1 : at);
    }

    function handleInput(event: Event) {
        const target = event.currentTarget as HTMLInputElement;
        if (disabled || readonly) { target.value = currentValue; return; }
        // 浏览器自动填充或整段替换包含非数字字符时按原有规则过滤；
        // 仅数字和空格组成的值才保留逐格编辑产生的空位。
        if (/[^0-9 ]/.test(target.value)) target.value = target.value.replace(/\D/g, "");
        const caret = normalize(target.value.slice(0, target.selectionStart ?? target.value.length)).length;
        const filledLast = (event as InputEvent).inputType?.startsWith("insert") === true && (target.selectionStart ?? 0) >= length;
        commitFromUser(target.value, filledLast);
        target.value = normalize(target.value);
        // Use the accepted digit count, not the raw text length, so filtering cannot skip a slot.
        target.setSelectionRange(caret, caret);
        selectionIndex = Math.min(caret, length - 1);
        oninput?.(event);
    }

    function handleBeforeInput(event: InputEvent) {
        if (disabled || readonly || !event.inputType.startsWith("delete")) return;
        const target = event.currentTarget as HTMLInputElement;
        let start = target.selectionStart ?? selectionIndex;
        let end = target.selectionEnd ?? start;
        if (start === end) {
            if (event.inputType === "deleteContentBackward") start = Math.max(0, start - 1);
            else if (event.inputType === "deleteContentForward") end = Math.min(length, end + 1);
            else return;
        }
        event.preventDefault();
        const padded = currentValue.padEnd(length, " ");
        target.value = normalize(padded.slice(0, start) + " ".repeat(end - start) + padded.slice(end));
        target.setSelectionRange(Math.min(start, target.value.length), Math.min(start, target.value.length));
        target.dispatchEvent(new Event("input", { bubbles: true }));
        moveCaret(start);
    }

    function handlePaste(event: ClipboardEvent) {
        onpaste?.(event);
        if (event.defaultPrevented || disabled || readonly) return;
        event.preventDefault();
        const pasted = event.clipboardData?.getData("text") ?? "";
        const at = Math.min(selectionIndex, length - 1);
        if (!/^[0-9]+$/.test(pasted)) { rejectPaste(false); return; }
        let next: string;
        let caret: number;
        if (pasted.length === length) {
            next = pasted;
            caret = length;
        } else if (at > 0 && pasted.length <= length - at && /^[0-9]+$/.test(currentValue.slice(0, at)) && currentValue.slice(0, at).length === at) {
            // Interior paste may complete or partially fill the remaining contiguous suffix.
            next = currentValue.slice(0, at) + pasted + currentValue.slice(at + pasted.length);
            caret = at + pasted.length;
        } else {
            rejectPaste(at === 0);
            return;
        }
        commitFromUser(next);
        if (inputElement) {
            inputElement.value = next;
            inputElement.setSelectionRange(caret, caret);
        }
        selectionIndex = Math.min(caret, length - 1);
        oninput?.(event);
    }

    function pointerIndex(event: PointerEvent) {
        const row = (event.currentTarget as HTMLInputElement).parentElement;
        const slots = Array.from(row?.querySelectorAll<HTMLElement>(".snowui-otp-slot") ?? []);
        return slots.findIndex(slot => {
            const rect = slot.getBoundingClientRect();
            return event.clientX >= rect.left && event.clientX <= rect.right;
        });
    }

    function handlePointerDown(event: PointerEvent) {
        if (disabled) return;
        event.preventDefault();
        const index = pointerIndex(event);
        inputElement?.focus();
        moveCaret(index < 0 ? currentValue.length : index, true);
    }

    function syncSelection() {
        if (!inputElement) return;
        const index = Math.min(inputElement.selectionStart ?? currentValue.length, length - 1);
        selectionIndex = index;
    }

</script>

<Frame
    {...frameRestProps}
    tag="div"
    class={`snowui-otp-input${resolvedInvalid ? " snowui-feedback-error-shake" : ""} ${userClass}`.trim()}
    style={userStyle || undefined}
    data-disabled={disabled ? "true" : undefined}
    data-readonly={readonly ? "true" : undefined}
    data-invalid={resolvedInvalid ? "true" : undefined}
    data-focus={focused ? "true" : undefined}
    data-success={success ? "true" : undefined}
    role="group"
    aria-label={groupLabel}
    aria-labelledby={groupLabelledby}
    enableAutoLayout={false}
    enableResponsive={enableResponsive}
    enableContext={enableContext}
    enableScaleObserver={false}
>
    <span class="snowui-otp-slots">
        <!-- svelte-ignore a11y_autofocus -->
        <input
            use:formReset={form}
            {...nativeInputProps}
            bind:this={inputElement}
            class="snowui-otp-native"
            type="text"
            value={currentValue}
            {name} {form} {disabled} {readonly} {required} {autocomplete} {autofocus} {tabindex} {id} {title}
            aria-label={groupLabel}
            aria-labelledby={groupLabelledby}
            aria-describedby={[inputRestProps["aria-describedby"], resolvedInvalid ? errorId : undefined].filter(Boolean).join(" ") || undefined}
            inputmode="numeric"
            pattern={`[0-9]{${length}}`}
            minlength={length}
            aria-invalid={resolvedInvalid || undefined}
            oninput={handleInput}
            onbeforeinput={handleBeforeInput}
            {onchange}
            onfocus={(event) => { focused = true; syncSelection(); onfocus?.(event); }}
            onblur={(event) => { focused = false; onblur?.(event); }}
            onkeydown={(event) => { onkeydown?.(event); queueMicrotask(syncSelection); }}
            onselect={syncSelection}
            onpointerdown={handlePointerDown}
            onpointermove={(event) => { const index = pointerIndex(event); hoveredIndex = index < 0 ? undefined : index; }}
            onpointerleave={() => hoveredIndex = undefined}
            onpaste={handlePaste}
        />
        {#each digits as digit, index}
            <span class="snowui-otp-slot snowui-field-bordered snowui-rounded-rectangle"
                aria-hidden="true" data-active={focused && !success && index === activeIndex || undefined}
                data-field-hover={hoveredIndex === index && !disabled && !success ? "true" : undefined}
                data-invalid={resolvedInvalid ? "true" : undefined} data-filled={!!digit || undefined}>
                {#if digit}
                    {#key digit}
                        <span class="snowui-otp-digit">{digit}</span>
                    {/key}
                {/if}
                {#if focused && index === activeIndex && !disabled && !readonly && !success}
                    <span class="snowui-otp-caret" aria-hidden="true"></span>
                {/if}
            </span>
        {/each}
        <span aria-hidden="true" class="snowui-otp-indicator snowui-field-bordered snowui-rounded-rectangle"
            data-field-focus={focused && !disabled && !success ? "true" : undefined}
            data-invalid={resolvedInvalid ? "true" : undefined}
            style={`${TAB_INDICATOR_MOTION_STYLE}; --snowui-otp-input-active-index: ${activeIndex}`}></span>
    </span>
    {#if resolvedInvalid}
        <Text id={errorId} as="error" role="status" aria-live="polite" class="snowui-field-error-message">
            {#if typeof errorContent === "function"}{@render errorContent()}{:else}{errorContent}{/if}
        </Text>
    {/if}
</Frame>

<style>
    :global(:where(.snowui-otp-input)) {
        --snowui-otp-input-gap: var(--gap-2);
        --snowui-otp-input-size: calc(var(--leading-18, 28px) + 2 * var(--padding-3, 12px));
        --snowui-otp-input-radius: var(--radius-4);
        --snowui-otp-input-font-size: var(--text-18);
        --snowui-otp-input-line-height: var(--leading-18);
        position: relative;
        display: inline-flex;
        flex-direction: column;
        align-items: flex-start;
        gap: var(--gap-2);
        width: fit-content;
        max-width: 100%;
        color: var(--black-100, #000000);
        cursor: text;
    }
    :global(:where(.snowui-otp-slots)) {
        position: relative;
        display: flex;
        gap: var(--snowui-otp-input-gap-override, var(--snowui-otp-input-gap, var(--gap-2)));
    }
    :global(:where(.snowui-otp-slot, .snowui-otp-indicator)) {
        display: grid;
        place-items: center;
        width: var(--snowui-otp-input-size-override, var(--snowui-otp-input-size, var(--size-10)));
        height: var(--snowui-otp-input-size-override, var(--snowui-otp-input-size, var(--size-10)));
        box-sizing: border-box;
        padding: var(--padding-3, 12px) var(--padding-4, 16px);
        border: 0;
        border-radius: var(--snowui-otp-input-radius-override, var(--snowui-otp-input-radius, var(--radius-4)));
        font-size: var(--snowui-otp-input-font-size-override, var(--snowui-otp-input-font-size, var(--text-18, 18px)));
        line-height: var(--snowui-otp-input-line-height-override, var(--snowui-otp-input-line-height, var(--leading-18, 28px)));
        font-variant-numeric: tabular-nums;
    }
    :global(:where(.snowui-otp-slot)) { position: relative; background: var(--surface-1, #ffffffcc); }
    :global(:where(.snowui-otp-digit)) { display: inline-block; animation: snowui-otp-digit-appear 300ms cubic-bezier(0.34, 1.45, 0.64, 1) both; }
    @keyframes snowui-otp-digit-appear { from { opacity: 0; transform: perspective(240px) translateY(6px) rotateX(-35deg); } to { opacity: 1; transform: perspective(240px) translateY(0) rotateX(0); } }
    :global(:where(.snowui-otp-caret)) { position: absolute; width: calc(var(--size-1, 4px) / 4); height: var(--size-5, 20px); background: var(--black-100, #000000); animation: snowui-otp-caret-blink 1s step-end infinite; }
    :global(:where(.snowui-otp-slot[data-filled="true"] .snowui-otp-caret)) { transform: translateX(8px); }
    @keyframes snowui-otp-caret-blink { 50% { opacity: 0; } }
    :global(.snowui-otp-input :where(.snowui-otp-indicator)) {
        position: absolute;
        left: 0;
        top: 0;
        pointer-events: none;
        opacity: 0;
        transform: translateX(calc(var(--snowui-otp-input-active-index) * (var(--snowui-otp-input-size-override, var(--snowui-otp-input-size)) + var(--snowui-otp-input-gap-override, var(--snowui-otp-input-gap)))));
        transition: transform var(--snowui-frame-control-motion-duration) var(--snowui-frame-control-motion-easing), box-shadow var(--snowui-frame-control-motion-duration) var(--snowui-frame-control-motion-easing);
    }
    :global(.snowui-otp-input :where(.snowui-otp-indicator[data-field-focus="true"])) { opacity: 1; }
    :global(.snowui-otp-input :where(.snowui-otp-indicator[data-field-focus="true"]:not([data-invalid="true"]))) { box-shadow: inset 0 0 0 2px var(--black-100, #000000); }
    :global(:where(.snowui-otp-input[data-disabled="true"])) { cursor: default; opacity: 0.2; }
    :global(:where(.snowui-otp-input[data-readonly="true"])) { cursor: default; }
    :global(:where(.snowui-otp-input[data-readonly="true"] .snowui-otp-slot)) { background: var(--surface-2, #00000008); box-shadow: none; }
    :global(:where(.snowui-otp-input[data-success="true"] .snowui-otp-slot)) { background: var(--surface-2, #00000008); box-shadow: none; }
    :global(.snowui-otp-input[data-readonly="true"] :where(.snowui-otp-indicator)) { opacity: 0; }
    :global(:where(.snowui-otp-native)) {
        position: absolute;
        inset: 0;
        z-index: 1;
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        border: 0;
        opacity: 0;
        cursor: inherit;
    }
    @media (prefers-reduced-motion: reduce) {
        :global(.snowui-otp-input :where(.snowui-otp-indicator)) { transition: none; }
        :global(:where(.snowui-otp-caret)) { animation: none; }
        :global(:where(.snowui-otp-digit)) { animation: none; }
    }
</style>
