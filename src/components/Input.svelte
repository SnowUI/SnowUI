<!-- SnowUI source notice | LICENSE 2.2.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 -->
<!--
 Input 组件：基础单行输入框
 v1.1.5

 文档: ./Input.md
-->

<!--
  @file Input.svelte
  @implementation_details (2026-03-19)
  1. 数字步进器增强:
     - 探测逻辑: 使用 $effect 和 MutationObserver 监听 hostElement 内部 children。
     - 识别协议: 通过 [data-as="up/down"] 属性识别自定义按钮，不限组件类名（由 frame-dom-runtime 确保导出）。
     - 分离渲染: 将 Up 和 Down 的隐藏逻辑解耦，支持局部替换（仅 Up 或仅 Down），防止 4 箭头叠加。
  2. 布局优化:
     - 应用 padding-x: 步进器容器不再使用负 margin，而是使用 var(--snowui-input-padding-x) 对齐，保持与文字区域留白一致。
     - 原生隐藏: 强化 webkit-spin-button 隐藏规则，统一使用无强制优先级的 appearance: none。
  3. 日期/时间激活: 优化交互，使得日期编辑器空白区域点击能激活首个有效选区。
-->
<script lang="ts">
  // SnowUI 许可入口：首次阅读源码请先读 ../../LICENSE；访问文件不代表获得修改或移植权，官方维护授权及同任务去重见该文件。
    import Button from "./Button.svelte";
    import Frame, { type FrameProps } from "./Frame.svelte";
    import Text from "./Text.svelte";
    import {ComponentIcon} from "../internal/component-icon/index";
    import type { Snippet } from "svelte";
    import {getField, getListboxOwner, getListboxHeaderPortal} from "../context";
    import {resolveFrameFieldInvalid, resolveFrameFieldValue, syncFrameFieldValue} from "../logic/frame-field-control";
    import {splitFrameHostProps} from "../logic/frame-prop-filter";
    import {mergeComponentPartProps, useComponentPart} from "../logic/component-parts.svelte";
    import type { HTMLInputAttributes } from "svelte/elements";
    import type { ComponentPartsOf } from "../logic/component-parts.svelte";
    import {resizeManager} from "../logic/observer.svelte";
    import { useLocale } from "../i18n/locale.svelte";
    const localeContext = useLocale();

    type InputValue = string | number | undefined;
    type TemporalInputType =
        | "date"
        | "month"
        | "week"
        | "time"
        | "datetime-local";
    type TemporalSegmentKey =
        | "year"
        | "month"
        | "day"
        | "week"
        | "hour"
        | "minute"
        | "second";
    type DateDraft = Record<TemporalSegmentKey, string>;

    interface Props extends Omit<FrameProps, "tag"> {
        element?: HTMLElement;
        type?: HTMLInputAttributes["type"];
        value?: InputValue;
        defaultValue?: InputValue;
        placeholder?: string;
        name?: string;
        disabled?: boolean;
        readonly?: boolean;
        clearable?: boolean;
        required?: boolean;
        autocomplete?: HTMLInputAttributes["autocomplete"];
        minlength?: number;
        maxlength?: number;
        pattern?: string;
        min?: number | string;
        max?: number | string;
        step?: number | string;
        inputmode?: HTMLInputAttributes["inputmode"];
        enterkeyhint?: HTMLInputAttributes["enterkeyhint"];
        spellcheck?: boolean;
        list?: string;
        accept?: string;
        multiple?: boolean;
        capture?: boolean | "user" | "environment";
        form?: string;
        autofocus?: boolean;
        tabindex?: number;
        title?: string;
        id?: string;
        invalid?: boolean;
        /** invalid 时显示的内置错误文字；默认不生成。 */
        error?: string | Snippet;
        parts?: ComponentPartsOf<{ Text: typeof Text; Button: typeof Button }>;
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
        children?: Snippet;
        /**
         * 仅当 `as="search"` 且位于 `<Listbox>` 内时生效。
         * 启用后，搜索无匹配时按 Enter 可将用户输入的文本作为自定义选项添加并选中。
         */
        allowCustomValue?: boolean;
        [key: string]: any;
    }

    const inheritedInputPart = useComponentPart<Props>("Input");
    let {
        value = $bindable(),
        element = $bindable(),
        ...explicitProps
    }: Props = $props();
    let {
        type = "text",
        defaultValue = undefined,
        placeholder = undefined,
        name = undefined,
        disabled = false,
        readonly = false,
        clearable = true,
        required = false,
        autocomplete = undefined,
        minlength = undefined,
        maxlength = undefined,
        pattern = undefined,
        min = undefined,
        max = undefined,
        step = undefined,
        inputmode = undefined,
        enterkeyhint = undefined,
        spellcheck = undefined,
        list = undefined,
        accept = undefined,
        multiple = undefined,
        capture = undefined,
        form = undefined,
        autofocus = undefined,
        tabindex = undefined,
        title = undefined,
        id = undefined,
        invalid = false,
        error = undefined,
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
        enableAutoLayout = true,
        enableResponsive = true,
        enableContext = true,
        enableScaleObserver = false,
        class: userClass = "",
        style: userStyle = "",
        renderHints: userRenderHints = undefined,
        children = undefined,
        allowCustomValue = false,
        ...rest
    }: Omit<Props, "value"> = $derived(
        mergeComponentPartProps(
            inheritedInputPart.current as Partial<Omit<Props, "value">>,
            explicitProps,
        ),
    );

    const splitProps = $derived.by(() => splitFrameHostProps(rest));
    const frameRestProps = $derived(splitProps.frameProps);
    const inputRestProps = $derived(splitProps.hostProps);
    const internalAutoLayout = $derived(
        enableAutoLayout === false ? true : enableAutoLayout,
    );

    const normalizedInputType = $derived(
        type === "range" || type === "file" ? "text" : (type ?? "text"),
    );

    const fieldControlOptions = $derived({
        controlType: normalizedInputType,
        skipTypes: ["file"],
    });
    let didApplyAutofocus = false;
    let errorLayoutWidth = $state<string>();

    const resolvedValue = $derived(
        resolveFrameFieldValue(value, defaultValue, fieldControlOptions),
    );
    const resolvedInvalid = $derived(
        resolveFrameFieldInvalid(invalid, inputRestProps),
    );
    const hasBuiltInError = $derived(error !== undefined);

    $effect(() => {
        if (!hasBuiltInError || !hostElement) {
            errorLayoutWidth = undefined;
            return;
        }
        const update = () => {
            if (!hostElement) return;
            errorLayoutWidth = `${hostElement.getBoundingClientRect().width}px`;
        };
        update();
        return resizeManager.watch(hostElement, update);
    });
    const isCustomColorType = $derived(normalizedInputType === "color");
    const isCustomTemporalType = $derived(
        normalizedInputType === "date" ||
            normalizedInputType === "month" ||
            normalizedInputType === "week" ||
            normalizedInputType === "time" ||
            normalizedInputType === "datetime-local",
    );
    const isTemporalValueEmpty = $derived(
        isCustomTemporalType &&
            (resolvedValue === undefined ||
                resolvedValue === null ||
                resolvedValue === ""),
    );
    const isClearableType = $derived(
        normalizedInputType !== "number" &&
            !isCustomColorType &&
            !isCustomTemporalType,
    );
    const hasClearableValue = $derived(
        clearable && isClearableType && !readonly && !disabled &&
            resolvedValue !== undefined &&
            String(resolvedValue) !== "",
    );
    const temporalInputType = $derived(
        isCustomTemporalType
            ? (normalizedInputType as TemporalInputType)
            : null,
    );
    const fieldContext = getField();
    const isEmbedded = $derived(!!fieldContext);
    const listboxOwner = getListboxOwner();
    const isListboxSearch = $derived(rest.as === "search" && !!listboxOwner);
    const listboxHeaderPortal = getListboxHeaderPortal();
    // 浮层搜索头:as="search" 且存在 header portal(Listbox / Popover 等任意浮层提供)
    const isOverlaySearchHeader = $derived(
        rest.as === "search" && !!listboxHeaderPortal?.el,
    );
    // as="search" 时若未显式设置 maxlength，默认限制 100 字符
    const resolvedMaxlength = $derived(
        isOverlaySearchHeader ? (maxlength ?? 100) : maxlength,
    );
    const embeddedRoleClass = $derived.by(() => {
        const role = rest.as;
        if (typeof role !== "string" || !role.trim()) return "";
        return `snowui-role-${role
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9_-]+/g, "-")}`;
    });
    const rendersEmbeddedNativeHost = $derived(
        isEmbedded && !isCustomColorType && !isCustomTemporalType,
    );
    let hostElement = $state<HTMLElement | undefined>(undefined);
    $effect(() => {
        element = hostElement;
    });
    // as="search" 时自动移入浮层 header 区域（固定置顶，不随内容滚动）
    $effect(() => {
        if (!isOverlaySearchHeader || !listboxHeaderPortal?.el || !hostElement) return;
        listboxHeaderPortal.el.appendChild(hostElement);
    });
    let nativeInputElement = $state<HTMLInputElement | undefined>(undefined);
    let dateEditorFocused = $state(false);
    let dateDraft = $state<DateDraft>({
        year: "",
        month: "",
        day: "",
        week: "",
        hour: "",
        minute: "",
        second: "",
    });
    let lastDateChangeValue = $state("");
    let lastResolvedDateValue = $state("");
    let preserveDateDraftOnBlur = $state(false);
    let activeDateSegment = $state<TemporalSegmentKey | null>(null);
    let replaceDateSegmentOnNextKey = $state(false);
    let hasTemporalTrigger = $state(false);
    let hasRootAccessory = $state(false);
    let hasCustomStepperUp = $state(false);
    let hasCustomStepperDown = $state(false);
    let hasCustomTrailing = $state(false);
    let horizontalScrollMask = $state<"left" | "right" | "both" | undefined>(undefined);

    function updateHorizontalScrollMask() {
        const el = nativeInputElement;
        if (!el || isCustomColorType || isCustomTemporalType) {
            horizontalScrollMask = undefined;
            return;
        }
        horizontalScrollMask = el.scrollWidth > el.clientWidth + 1
            ? "both"
            : undefined;
    }

    $effect(() => {
        const el = nativeInputElement;
        if (!el || isCustomColorType || isCustomTemporalType) return;
        updateHorizontalScrollMask();
        el.addEventListener("scroll", updateHorizontalScrollMask);
        const unwatch = resizeManager.watch(el, updateHorizontalScrollMask);
        return () => {
            el.removeEventListener("scroll", updateHorizontalScrollMask);
            unwatch();
        };
    });

    $effect(() => {
        resolvedValue;
        queueMicrotask(updateHorizontalScrollMask);
    });

    const stepperCurrentValue = $derived(
        normalizedInputType === "number" &&
            resolvedValue !== undefined &&
            resolvedValue !== null &&
            resolvedValue !== ""
            ? parseFloat(String(resolvedValue))
            : NaN,
    );
    const stepUpDisabled = $derived(
        disabled ||
            readonly ||
            (max !== undefined &&
                max !== null &&
                !isNaN(stepperCurrentValue) &&
                stepperCurrentValue >= Number(max)),
    );
    const stepDownDisabled = $derived(
        disabled ||
            readonly ||
            (min !== undefined &&
                min !== null &&
                !isNaN(stepperCurrentValue) &&
                stepperCurrentValue <= Number(min)),
    );

    const EMPTY_DATE_DRAFT: DateDraft = {
        year: "",
        month: "",
        day: "",
        week: "",
        hour: "",
        minute: "",
        second: "",
    };
    const TEMPORAL_SEGMENT_ORDER: Record<
        TemporalInputType,
        TemporalSegmentKey[]
    > = {
        date: ["year", "month", "day"],
        month: ["year", "month"],
        week: ["year", "week"],
        time: ["hour", "minute", "second"],
        "datetime-local": ["year", "month", "day", "hour", "minute", "second"],
    };
    const TEMPORAL_SEPARATOR_AFTER: Partial<
        Record<TemporalSegmentKey, string>
    > = {
        year: "/",
        month: "/",
        day: " ",
        hour: ":",
        minute: ":",
    };

    const inputRenderHints = $derived({
        variant: userRenderHints?.variant ?? "line",
        width: userRenderHints?.width ?? "100%",
        height: userRenderHints?.height ?? "calc(var(--snowui-input-line-height) + var(--snowui-input-padding-y) * 2)",
        radius: userRenderHints?.radius ?? "var(--radius-4)",
    });
    const colorDisplayValue = $derived(
        normalizeColorValue(resolvedValue) ?? "#000000",
    );
    const colorHexValue = $derived(colorDisplayValue.slice(1));
    const temporalDefaultIconName = $derived(
        getTemporalDefaultIcon(temporalInputType),
    );

    function syncValueFromTarget(target: EventTarget | null) {
        syncFrameFieldValue(
            target,
            (nextValue) => {
                value = nextValue;
            },
            fieldControlOptions,
        );
    }

    function handleInput(event: Event) {
        syncValueFromTarget(event.currentTarget);
        if (isListboxSearch) {
            const v = (event.currentTarget as HTMLInputElement)?.value ?? "";
            listboxOwner!.setFilterText(v);
        }
        queueMicrotask(updateHorizontalScrollMask);
        userOnInput?.(event);
    }

    function handleChange(event: Event) {
        syncValueFromTarget(event.currentTarget);
        userOnChange?.(event);
    }

    function handleClear() {
        value = "";
        if (isListboxSearch) listboxOwner?.setFilterText("");
        if (nativeInputElement) {
            nativeInputElement.value = "";
            nativeInputElement.focus();
        }
        queueMicrotask(updateHorizontalScrollMask);
        emitSyntheticInput();
        emitSyntheticChange();
    }

    // 当 Listbox 关闭时，清空搜索 Input 的值
    $effect(() => {
        if (isListboxSearch && listboxOwner && !listboxOwner.open) {
            value = "";
            if (nativeInputElement) nativeInputElement.value = "";
        }
    });

    // as="search" + allowCustomValue 时，Enter 键将未匹配的输入添加为自定义选项
    function handleSearchKeydown(event: KeyboardEvent) {
        if (!isListboxSearch || !listboxOwner) return;
        if (event.key === "Enter" && allowCustomValue) {
            const text = (event.currentTarget as HTMLInputElement)?.value?.trim() ?? "";
            if (!text) return;
            const hasMatch =
                listboxOwner.options.some(o => !o.disabled) ||
                listboxOwner.customOptions.some(o => o.value === text);
            if (!hasMatch) {
                event.preventDefault();
                listboxOwner.addCustomOption(text);
                listboxOwner.selectOption(text);
            }
        }
    }

    function getResolvedStringValue(nextValue: InputValue) {
        return nextValue === undefined || nextValue === null
            ? ""
            : String(nextValue);
    }

    function normalizeColorValue(nextValue: InputValue) {
        const rawValue = getResolvedStringValue(nextValue).trim();
        if (!rawValue) return null;

        const normalizedHex = rawValue.startsWith("#")
            ? rawValue.slice(1)
            : rawValue;

        if (/^[0-9a-fA-F]{3}$/.test(normalizedHex)) {
            return `#${normalizedHex
                .split("")
                .map((char) => char + char)
                .join("")
                .toUpperCase()}`;
        }

        if (/^[0-9a-fA-F]{6}$/.test(normalizedHex)) {
            return `#${normalizedHex.toUpperCase()}`;
        }

        return null;
    }

    function handleStepUp() {
        if (disabled || readonly || normalizedInputType !== "number") return;
        nativeInputElement?.stepUp();
        syncValueFromTarget(nativeInputElement ?? null);
        emitSyntheticChange();
    }

    function handleStepDown() {
        if (disabled || readonly || normalizedInputType !== "number") return;
        nativeInputElement?.stepDown();
        syncValueFromTarget(nativeInputElement ?? null);
        emitSyntheticChange();
    }
    function emitSyntheticChange() {
        nativeInputElement?.dispatchEvent(new Event("change", { bubbles: true }));
    }

    function emitSyntheticInput() {
        nativeInputElement?.dispatchEvent(new Event("input", { bubbles: true }));
    }

    function getTemporalSegments(inputType: TemporalInputType | null) {
        return inputType ? TEMPORAL_SEGMENT_ORDER[inputType] : [];
    }

    function getTemporalDefaultIcon(inputType: TemporalInputType | null) {
        return inputType === "time" ? "clock" : "calendar-blank";
    }

    function getTemporalTriggerLabel(inputType: TemporalInputType | null) {
        return localeContext.t(inputType === "time" ? "input.openTime" : "input.openDate");
    }

    function getTemporalAriaLabel(segment: TemporalSegmentKey) {
        return localeContext.t(`input.${segment}` as const);
    }

    function getTemporalPlaceholder(segment: TemporalSegmentKey) {
        return segment === "year"
            ? localeContext.t("input.yearPlaceholder")
            : segment === "month"
              ? localeContext.t("input.monthPlaceholder")
              : segment === "day"
                ? localeContext.t("input.dayPlaceholder")
                : segment === "week"
                  ? localeContext.t("input.weekPlaceholder")
                  : "00";
    }

    function getTemporalSegmentLength(segment: TemporalSegmentKey) {
        return segment === "year" ? 4 : 2;
    }

    function parseDateValue(
        value: string,
        inputType: TemporalInputType | null = temporalInputType,
    ): DateDraft {
        const draft = { ...EMPTY_DATE_DRAFT };
        if (!inputType || !value) return draft;

        if (inputType === "date") {
            const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
            if (!match) return draft;
            const [, year, month, day] = match;
            return { ...draft, year, month, day };
        }

        if (inputType === "month") {
            const match = value.match(/^(\d{4})-(\d{2})$/);
            if (!match) return draft;
            const [, year, month] = match;
            return { ...draft, year, month };
        }

        if (inputType === "week") {
            const match = value.match(/^(\d{4})-W(\d{2})$/);
            if (!match) return draft;
            const [, year, week] = match;
            return { ...draft, year, week };
        }

        if (inputType === "time") {
            const match = value.match(/^(\d{2}):(\d{2})(?::(\d{2}))?$/);
            if (!match) return draft;
            const [, hour, minute, second = "00"] = match;
            return { ...draft, hour, minute, second };
        }

        const match = value.match(
            /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/,
        );
        if (!match) return draft;
        const [, year, month, day, hour, minute, second = "00"] = match;
        return { ...draft, year, month, day, hour, minute, second };
    }

    function sanitizeDateSegment(
        segment: TemporalSegmentKey,
        value: string,
    ): string {
        const maxLength = getTemporalSegmentLength(segment);
        return value.replace(/\D/g, "").slice(0, maxLength);
    }

    function formatDateSegmentDisplayValue(
        segment: TemporalSegmentKey,
        value: string,
    ) {
        if (!value) {
            return getTemporalPlaceholder(segment);
        }
        if (segment !== "year") {
            return value.padStart(2, "0");
        }
        return value;
    }

    function getMaxDayForDraft(year: string, month: string) {
        const numericYear = Number(year);
        const numericMonth = Number(month);
        if (
            year.length === 4 &&
            Number.isInteger(numericYear) &&
            Number.isInteger(numericMonth) &&
            numericMonth >= 1 &&
            numericMonth <= 12
        ) {
            return new Date(numericYear, numericMonth, 0).getDate();
        }
        return 31;
    }

    function getMaxWeekForYear(year: string) {
        const numericYear = Number(year);
        if (year.length !== 4 || !Number.isInteger(numericYear)) {
            return 53;
        }
        const date = new Date(Date.UTC(numericYear, 11, 28));
        const day = date.getUTCDay() || 7;
        date.setUTCDate(date.getUTCDate() + 4 - day);
        const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
        return Math.ceil(
            ((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7,
        );
    }

    function clampDateSegmentValue(
        segment: TemporalSegmentKey,
        value: string,
        draft: DateDraft,
    ) {
        if (!value || segment === "year") {
            return value;
        }
        const numericValue = Number(value);
        if (!Number.isInteger(numericValue)) {
            return value;
        }
        if (segment === "month") {
            return String(Math.min(12, Math.max(1, numericValue))).padStart(
                2,
                "0",
            );
        }
        if (segment === "week") {
            return String(
                Math.min(
                    getMaxWeekForYear(draft.year),
                    Math.max(1, numericValue),
                ),
            ).padStart(2, "0");
        }
        if (segment === "hour") {
            return String(Math.min(23, Math.max(0, numericValue))).padStart(
                2,
                "0",
            );
        }
        if (segment === "minute" || segment === "second") {
            return String(Math.min(59, Math.max(0, numericValue))).padStart(
                2,
                "0",
            );
        }
        const maxDay = getMaxDayForDraft(draft.year, draft.month);
        return String(Math.min(maxDay, Math.max(1, numericValue))).padStart(
            2,
            "0",
        );
    }

    function normalizeDateDraft(
        draft: DateDraft,
        options: { padPartialMonthDay?: boolean } = {},
    ) {
        const nextDraft = { ...draft };

        if (nextDraft.month) {
            if (options.padPartialMonthDay && nextDraft.month.length === 1) {
                nextDraft.month = nextDraft.month.padStart(2, "0");
            }
            if (nextDraft.month.length === 2) {
                nextDraft.month = clampDateSegmentValue(
                    "month",
                    nextDraft.month,
                    nextDraft,
                );
            }
        }

        if (nextDraft.day) {
            if (options.padPartialMonthDay && nextDraft.day.length === 1) {
                nextDraft.day = nextDraft.day.padStart(2, "0");
            }
            if (nextDraft.day.length === 2) {
                nextDraft.day = clampDateSegmentValue(
                    "day",
                    nextDraft.day,
                    nextDraft,
                );
            }
        }

        if (nextDraft.week) {
            if (options.padPartialMonthDay && nextDraft.week.length === 1) {
                nextDraft.week = nextDraft.week.padStart(2, "0");
            }
            if (nextDraft.week.length === 2) {
                nextDraft.week = clampDateSegmentValue(
                    "week",
                    nextDraft.week,
                    nextDraft,
                );
            }
        }

        for (const segment of ["hour", "minute", "second"] as const) {
            if (!nextDraft[segment]) continue;
            if (options.padPartialMonthDay && nextDraft[segment].length === 1) {
                nextDraft[segment] = nextDraft[segment].padStart(2, "0");
            }
            if (nextDraft[segment].length === 2) {
                nextDraft[segment] = clampDateSegmentValue(
                    segment,
                    nextDraft[segment],
                    nextDraft,
                );
            }
        }

        return nextDraft;
    }

    function normalizeDateSegmentInput(
        segment: TemporalSegmentKey,
        value: string,
    ) {
        const sanitized = sanitizeDateSegment(segment, value);
        if (
            segment === "month" &&
            sanitized.length === 1 &&
            Number(sanitized) > 1
        ) {
            return {
                value: sanitized.padStart(2, "0"),
                shouldMoveNext: true,
            };
        }
        if (
            segment === "day" &&
            sanitized.length === 1 &&
            Number(sanitized) > 3
        ) {
            return {
                value: sanitized.padStart(2, "0"),
                shouldMoveNext: true,
            };
        }
        if (
            segment === "week" &&
            sanitized.length === 1 &&
            Number(sanitized) > 5
        ) {
            return {
                value: sanitized.padStart(2, "0"),
                shouldMoveNext: true,
            };
        }
        if (
            segment === "hour" &&
            sanitized.length === 1 &&
            Number(sanitized) > 2
        ) {
            return {
                value: sanitized.padStart(2, "0"),
                shouldMoveNext: true,
            };
        }
        if (
            (segment === "minute" || segment === "second") &&
            sanitized.length === 1 &&
            Number(sanitized) > 5
        ) {
            return {
                value: sanitized.padStart(2, "0"),
                shouldMoveNext: true,
            };
        }
        if (segment !== "year" && sanitized.length === 2) {
            const nextDraft = normalizeDateDraft({
                ...dateDraft,
                [segment]: sanitized,
            });
            return {
                value: nextDraft[segment],
                shouldMoveNext: true,
            };
        }
        return {
            value: sanitized,
            shouldMoveNext:
                (segment === "year" && sanitized.length === 4) ||
                (segment !== "year" && sanitized.length === 2),
        };
    }

    function getDateSegmentElement(segment: TemporalSegmentKey) {
        return hostElement?.querySelector(`[data-segment="${segment}"]`) as
            | HTMLElement
            | undefined;
    }

    function isValidCalendarDate(year: string, month: string, day: string) {
        if (year.length !== 4 || month.length < 1 || day.length < 1) {
            return false;
        }
        const numericYear = Number(year);
        const numericMonth = Number(month);
        const numericDay = Number(day);
        if (
            !Number.isInteger(numericYear) ||
            !Number.isInteger(numericMonth) ||
            !Number.isInteger(numericDay)
        ) {
            return false;
        }
        if (numericMonth < 1 || numericMonth > 12) return false;
        if (numericDay < 1 || numericDay > 31) return false;
        const date = new Date(numericYear, numericMonth - 1, numericDay);
        return (
            date.getFullYear() === numericYear &&
            date.getMonth() === numericMonth - 1 &&
            date.getDate() === numericDay
        );
    }

    function isValidTemporalDraft(
        nextDraft: DateDraft,
        inputType: TemporalInputType | null = temporalInputType,
    ) {
        if (!inputType) return false;
        if (inputType === "date") {
            return isValidCalendarDate(
                nextDraft.year,
                nextDraft.month,
                nextDraft.day,
            );
        }
        if (inputType === "month") {
            return (
                nextDraft.year.length === 4 &&
                nextDraft.month.length === 2 &&
                Number(nextDraft.month) >= 1 &&
                Number(nextDraft.month) <= 12
            );
        }
        if (inputType === "week") {
            const numericWeek = Number(nextDraft.week);
            return (
                nextDraft.year.length === 4 &&
                nextDraft.week.length === 2 &&
                Number.isInteger(numericWeek) &&
                numericWeek >= 1 &&
                numericWeek <= getMaxWeekForYear(nextDraft.year)
            );
        }
        if (inputType === "time") {
            return (
                nextDraft.hour.length === 2 &&
                nextDraft.minute.length === 2 &&
                nextDraft.second.length === 2
            );
        }
        return (
            isValidCalendarDate(
                nextDraft.year,
                nextDraft.month,
                nextDraft.day,
            ) &&
            nextDraft.hour.length === 2 &&
            nextDraft.minute.length === 2 &&
            nextDraft.second.length === 2
        );
    }

    function formatDateDraft(
        nextDraft: DateDraft,
        inputType: TemporalInputType | null = temporalInputType,
    ) {
        const segments = getTemporalSegments(inputType);
        if (segments.length === 0) return "";
        if (!segments.some((segment) => nextDraft[segment])) return "";
        if (!isValidTemporalDraft(nextDraft, inputType)) return "";
        if (inputType === "date") {
            return `${nextDraft.year}-${nextDraft.month}-${nextDraft.day}`;
        }
        if (inputType === "month") {
            return `${nextDraft.year}-${nextDraft.month}`;
        }
        if (inputType === "week") {
            return `${nextDraft.year}-W${nextDraft.week}`;
        }
        if (inputType === "time") {
            return `${nextDraft.hour}:${nextDraft.minute}:${nextDraft.second}`;
        }
        return `${nextDraft.year}-${nextDraft.month}-${nextDraft.day}T${nextDraft.hour}:${nextDraft.minute}:${nextDraft.second}`;
    }

    function focusDateSegment(segment: TemporalSegmentKey, selectAll = true) {
        const target = getDateSegmentElement(segment);
        activeDateSegment = segment;
        replaceDateSegmentOnNextKey = selectAll;
        target?.focus();
    }

    function moveDateSegment(
        segment: TemporalSegmentKey,
        direction: "prev" | "next",
    ) {
        const segments = getTemporalSegments(temporalInputType);
        const currentIndex = segments.indexOf(segment);
        if (currentIndex === -1) return;
        const nextIndex =
            direction === "prev" ? currentIndex - 1 : currentIndex + 1;
        const nextSegment = segments[nextIndex];
        if (nextSegment) focusDateSegment(nextSegment);
    }

    let committingDateDraft = false;

    function commitDateDraft(nextDraft: DateDraft, emitChange = false) {
        dateDraft = nextDraft;
        const formatted = formatDateDraft(nextDraft);
        value = formatted;
        if (formatted !== getResolvedStringValue(nativeInputElement?.value)) {
            if (nativeInputElement) nativeInputElement.value = formatted;
        }
        committingDateDraft = true;
        try { emitSyntheticInput(); } finally { committingDateDraft = false; }
        if (emitChange && formatted !== lastDateChangeValue) {
            lastDateChangeValue = formatted;
            emitSyntheticChange();
        }
    }

    function handleDateSegmentFocus(
        segment: TemporalSegmentKey,
        event: FocusEvent,
    ) {
        dateEditorFocused = true;
        preserveDateDraftOnBlur = false;
        activeDateSegment = segment;
        replaceDateSegmentOnNextKey = true;
        userOnFocus?.(event);
    }

    function handleDateSegmentMouseDown(
        segment: TemporalSegmentKey,
        event: MouseEvent,
    ) {
        if (disabled || readonly) {
            return;
        }
        event.preventDefault();
        focusDateSegment(segment);
    }

    function handleDateSegmentClick(
        segment: TemporalSegmentKey,
        event: MouseEvent,
    ) {
        if (disabled || readonly) {
            userOnClick?.(event);
            return;
        }
        event.preventDefault();
        event.stopPropagation();
        focusDateSegment(segment);
        userOnClick?.(event);
    }

    function handleDateEditorClick(event: MouseEvent) {
        if (disabled || readonly) {
            userOnClick?.(event);
            return;
        }
        // 如果点击的是容器本身（包括分隔符等空白区域），则聚焦第一个分段
        // 注意：点击 trigger 按钮时不聚焦分段，否则焦点移动会关闭刚打开的系统 picker
        const target = event.target as HTMLElement;
        if (target.closest(".snowui-input-date-trigger")) {
            userOnClick?.(event);
            return;
        }
        if (
            target.closest(".snowui-input-date-editor") === event.currentTarget
        ) {
            const segments = getTemporalSegments(temporalInputType);
            if (segments.length > 0) {
                focusDateSegment(segments[0]);
            }
        }
        userOnClick?.(event);
    }

    function handleDateSegmentBlur(event: FocusEvent) {
        const relatedTarget = event.relatedTarget;
        if (
            relatedTarget instanceof HTMLElement &&
            relatedTarget.closest(".snowui-input-date-editor") ===
                hostElement?.querySelector(".snowui-input-date-editor")
        ) {
            return;
        }
        dateEditorFocused = false;
        activeDateSegment = null;
        replaceDateSegmentOnNextKey = false;
        const normalizedDraft = normalizeDateDraft(dateDraft, {
            padPartialMonthDay: true,
        });
        if (
            Object.keys(normalizedDraft).some(
                (segment) =>
                    normalizedDraft[segment as TemporalSegmentKey] !==
                    dateDraft[segment as TemporalSegmentKey],
            )
        ) {
            commitDateDraft(normalizedDraft);
        }
        const formatted = formatDateDraft(normalizedDraft);
        const segments = getTemporalSegments(temporalInputType);
        preserveDateDraftOnBlur =
            formatted === "" &&
            segments.some((segment) => normalizedDraft[segment] !== "");
        if (formatted !== lastDateChangeValue) {
            lastDateChangeValue = formatted;
            emitSyntheticChange();
        }
        userOnBlur?.(event);
    }

    function handleDateSegmentKeyDown(
        segment: TemporalSegmentKey,
        event: KeyboardEvent,
    ) {
        if (disabled || readonly) {
            userOnKeyDown?.(event);
            return;
        }
        if (event.key === "Enter") {
            event.preventDefault();
            return;
        }
        if (/^\d$/.test(event.key)) {
            event.preventDefault();
            const currentValue = dateDraft[segment];
            const nextRawValue = replaceDateSegmentOnNextKey
                ? event.key
                : `${currentValue}${event.key}`;
            const normalized = normalizeDateSegmentInput(segment, nextRawValue);
            const nextValue = normalized.value;
            const nextDraft = { ...dateDraft, [segment]: nextValue };
            commitDateDraft(nextDraft);
            replaceDateSegmentOnNextKey = false;
            if (normalized.shouldMoveNext) {
                moveDateSegment(segment, "next");
            }
            return;
        }
        if (event.key === "/" || event.key === "-" || event.key === ".") {
            event.preventDefault();
            moveDateSegment(segment, "next");
            return;
        }
        if (event.key === "ArrowLeft") {
            moveDateSegment(segment, "prev");
            event.preventDefault();
            return;
        }
        if (event.key === "ArrowRight") {
            moveDateSegment(segment, "next");
            event.preventDefault();
            return;
        }
        if (event.key === "Backspace" || event.key === "Delete") {
            event.preventDefault();
            const currentValue = dateDraft[segment];
            if (replaceDateSegmentOnNextKey) {
                if (currentValue.length === 0) {
                    moveDateSegment(segment, "prev");
                    return;
                }
                commitDateDraft({ ...dateDraft, [segment]: "" });
                replaceDateSegmentOnNextKey = true;
                return;
            }
            if (currentValue.length === 0) {
                moveDateSegment(segment, "prev");
                return;
            }
            const nextValue = currentValue.slice(0, -1);
            commitDateDraft({ ...dateDraft, [segment]: nextValue });
            replaceDateSegmentOnNextKey = nextValue.length === 0;
            return;
        }
        userOnKeyDown?.(event);
    }

    function handleDateSegmentPaste(
        segment: TemporalSegmentKey,
        event: ClipboardEvent,
    ) {
        if (disabled || readonly) {
            userOnPaste?.(event);
            return;
        }
        const text = event.clipboardData?.getData("text/plain") ?? "";
        if (!text) {
            userOnPaste?.(event);
            return;
        }

        const digits = text.replace(/\D/g, "");
        const segments = getTemporalSegments(temporalInputType);
        const totalLength = segments.reduce(
            (sum, key) => sum + getTemporalSegmentLength(key),
            0,
        );
        if (digits.length >= totalLength && segments.length > 0) {
            event.preventDefault();
            const nextDraft = { ...dateDraft };
            let cursor = 0;
            for (const key of segments) {
                const length = getTemporalSegmentLength(key);
                nextDraft[key] = digits.slice(cursor, cursor + length);
                cursor += length;
            }
            commitDateDraft(nextDraft, true);
            focusDateSegment(segments[segments.length - 1]);
            userOnPaste?.(event);
            return;
        }
        const sanitized = sanitizeDateSegment(segment, text);
        event.preventDefault();
        const normalized = normalizeDateSegmentInput(segment, sanitized);
        commitDateDraft({ ...dateDraft, [segment]: normalized.value });
        replaceDateSegmentOnNextKey = false;
        if (normalized.shouldMoveNext) {
            moveDateSegment(segment, "next");
        }
        userOnPaste?.(event);
    }

    function handleNativeDateInput(event: Event) {
        // 分段编辑自己的 input 通知不能把未完成草稿按原生空值重新解析。
        if (committingDateDraft) { userOnInput?.(event); return; }
        syncValueFromTarget(event.currentTarget);
        const nextValue =
            event.currentTarget instanceof HTMLInputElement
                ? event.currentTarget.value
                : "";
        dateDraft = parseDateValue(nextValue, temporalInputType);
        userOnInput?.(event);
    }

    function handleNativeDateChange(event: Event) {
        handleNativeDateInput(event);
        lastDateChangeValue =
            event.currentTarget instanceof HTMLInputElement
                ? event.currentTarget.value
                : "";
        userOnChange?.(event);
    }

    function tryOpenNativeTemporalPicker() {
        const input = nativeInputElement as
            | (HTMLInputElement & { showPicker?: () => void })
            | undefined;
        if (!input || disabled) return;

        // 某些浏览器（Safari / 旧版 Chrome）对 opacity:0 的元素拒绝 showPicker / click()，
        // 临时覆盖 opacity 为极小非零值，完成调用后立即还原。
        // 不调用 input.focus()：focus 会触发 handleDateSegmentBlur 并引起状态更新，
        // 可能在某些 runtime 条件下导致 picker 被取消。
        input.style.setProperty("opacity", "0.001", "important");
        try {
            if (typeof input.showPicker === "function") {
                input.showPicker();
            } else {
                input.click();
            }
        } catch {
            // showPicker 被拒绝；回退到 click()
            try {
                input.click();
            } catch {
                // ignore
            }
        } finally {
            input.style.removeProperty("opacity");
        }
    }

    $effect(() => {
        const host = hostElement;
        if (!host) {
            hasRootAccessory = false;
            return;
        }

        const update = () => {
            hasRootAccessory = Array.from(host.children).some((child) => {
                if (!(child instanceof HTMLElement)) return false;
                return !child.matches(
                    ".snowui-input-control, .snowui-input-control-native, .snowui-input-date-editor",
                );
            });
        };

        update();

        const observer = new MutationObserver(update);
        observer.observe(host, {
            childList: true,
            subtree: false,
            attributes: true,
            attributeFilter: ["class", "data-as"],
        });

        return () => observer.disconnect();
    });

    $effect(() => {
        const host = hostElement;
        if (!host || !isCustomTemporalType) {
            hasTemporalTrigger = false;
            return;
        }

        const scope = host.parentElement;
        if (!(scope instanceof HTMLElement)) {
            hasTemporalTrigger = false;
            return;
        }

        const update = () => {
            const hasRootTrailing = !!host.querySelector(
                ':scope > [data-as="trailing"]:not(.snowui-input-warning-icon):not(.snowui-input-clear-btn)',
            );
            const hasSiblingTrailing = Array.from(scope.children).some(
                (child) => {
                    if (!(child instanceof HTMLElement) || child === host) {
                        return false;
                    }
                    return child.matches(
                        '[data-as="trailing"], .snowui-role-trailing',
                    );
                },
            );
            hasTemporalTrigger = hasRootTrailing || hasSiblingTrailing;
        };

        update();
        queueMicrotask(update);

        const observer = new MutationObserver(update);
        observer.observe(scope, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ["class", "data-as"],
        });

        return () => {
            observer.disconnect();
        };
    });

    $effect(() => {
        const host = hostElement;
        if (!host) return;

        const updateTrailing = () => {
            // 检测是否存在用户自定义的 trailing 元素 (排除内置的 stepper 按钮、Warning 和内置 clear 按钮)
            hasCustomTrailing = !!host.querySelector(
                ':scope > [data-as="trailing"]:not(.snowui-input-warning-icon):not(.snowui-input-clear-btn)',
            );
        };

        updateTrailing();
        const observer = new MutationObserver(updateTrailing);
        observer.observe(host, { childList: true, subtree: true });
        return () => observer.disconnect();
    });

    $effect(() => {
        const host = hostElement;
        if (!host || type !== "number") {
            hasCustomStepperUp = false;
            hasCustomStepperDown = false;
            return;
        }

        const update = () => {
            hasCustomStepperUp = !!host.querySelector(
                '[data-as="up"]:not(.snowui-input-stepper-btn)',
            );
            hasCustomStepperDown = !!host.querySelector(
                '[data-as="down"]:not(.snowui-input-stepper-btn)',
            );

            // 绑定事件
            if (hasCustomStepperUp) {
                const btn = host.querySelector(
                    '[data-as="up"]:not(.snowui-input-stepper-btn)',
                ) as HTMLElement;
                btn.onclick = (e) => {
                    e.preventDefault();
                    handleStepUp();
                };
            }
            if (hasCustomStepperDown) {
                const btn = host.querySelector(
                    '[data-as="down"]:not(.snowui-input-stepper-btn)',
                ) as HTMLElement;
                btn.onclick = (e) => {
                    e.preventDefault();
                    handleStepDown();
                };
            }
        };

        update();
        const observer = new MutationObserver(update);
        observer.observe(host, { childList: true, subtree: true });
        return () => observer.disconnect();
    });

    $effect(() => {
        if (!isCustomTemporalType || dateEditorFocused) return;
        const nextValue = getResolvedStringValue(resolvedValue);
        if (preserveDateDraftOnBlur && nextValue === lastResolvedDateValue) {
            return;
        }
        preserveDateDraftOnBlur = false;
        lastResolvedDateValue = nextValue;
        const nextDraft = parseDateValue(nextValue, temporalInputType);
        dateDraft = nextDraft;
        if (lastDateChangeValue === "") {
            lastDateChangeValue = nextValue;
        }
    });

    $effect(() => {
        if (!autofocus || didApplyAutofocus) return;
        didApplyAutofocus = true;
        if (isCustomTemporalType) {
            requestAnimationFrame(() => {
                const firstSegment = getTemporalSegments(temporalInputType)[0];
                if (firstSegment) {
                    focusDateSegment(firstSegment, false);
                }
            });
        }
    });
</script>

{#snippet inputSurface()}
{#if rendersEmbeddedNativeHost}
    <div
        bind:this={hostElement}
        class={`snowui-input snowui-rounded-rectangle snowui-field-host${(hasRootAccessory || (resolvedInvalid && !hasCustomTrailing)) ? " snowui-input-has-root-accessory" : ""}${embeddedRoleClass ? ` ${embeddedRoleClass}` : ""}${userClass ? ` ${userClass}` : ""}`}
        data-auto-layout="true"
        data-as={typeof rest.as === "string" ? rest.as : undefined}
        data-embedded={isEmbedded ? "true" : undefined}
        data-field-control={isEmbedded ? "input" : undefined}
        data-has-root-accessory={(hasRootAccessory || (resolvedInvalid && !hasCustomTrailing))
            ? "true"
            : undefined}
        data-has-value={hasClearableValue ? "true" : undefined}
        data-invalid={resolvedInvalid ? "true" : undefined}
        data-readonly={readonly ? "true" : undefined}
        data-input-type={normalizedInputType}
        data-requested-input-type={type !== normalizedInputType ? type : undefined}
        style={userStyle || undefined}
    >
        <!-- svelte-ignore a11y_autofocus -->
        <input
            {...inputRestProps}
            bind:this={nativeInputElement}
            class="snowui-input-control snowui-native-control snowui-input-embedded-native snowui-horizontal-scroll-mask"
            data-scroll-mask-x={horizontalScrollMask}
            {id}
            type={normalizedInputType}
            {name}
            {placeholder}
            {disabled}
            {readonly}
            {required}
            {autocomplete}
            {minlength}
            maxlength={resolvedMaxlength}
            {pattern}
            {min}
            {max}
            {step}
            {inputmode}
            {enterkeyhint}
            {spellcheck}
            {list}
            {accept}
            {multiple}
            {capture}
            {form}
            {autofocus}
            {tabindex}
            {title}
            value={resolvedValue}
            aria-invalid={resolvedInvalid
                ? "true"
                : inputRestProps["aria-invalid"]}
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
        />
        {@render children?.()}
        {#if clearable && isClearableType && !disabled && !readonly}
            <Button bare emphasis="muted" size="sm" {...parts?.Button}
                type="button"
                class={`snowui-clear-icon-btn snowui-input-clear-btn${parts?.Button?.class ? ` ${parts.Button.class}` : ""}`}
                as="trailing"
                aria-label={localeContext.t("input.clear")}
                onclick={handleClear}
                onmousedown={(e: MouseEvent) => e.preventDefault()}
                tabindex={-1}
            >
                <ComponentIcon name="x-circle" weight="fill" aria-hidden="true" />
            </Button>
        {/if}
        {#if resolvedInvalid && !hasCustomTrailing}
            <span
                class="snowui-input-warning-icon snowui-role-trailing text-secondary-red"
                aria-hidden="true"
            >
                <ComponentIcon name="warning" size="var(--size-4)" aria-hidden="true" />
            </span>
        {/if}
    </div>
{:else}
    <Frame
        bind:element={hostElement}
        tag="div"
        class={`snowui-input snowui-rounded-rectangle${isEmbedded ? " snowui-field-host" : " snowui-field-bordered"}${hasRootAccessory ? " snowui-input-has-root-accessory" : ""}${userClass ? ` ${userClass}` : ""}`}
        data-invalid={resolvedInvalid ? "true" : undefined}
        data-readonly={readonly ? "true" : undefined}
        data-input-type={normalizedInputType}
        data-requested-input-type={type !== normalizedInputType ? type : undefined}
        data-temporal-input={isCustomTemporalType ? "true" : undefined}
        data-temporal-empty={isTemporalValueEmpty ? "true" : undefined}
        data-has-temporal-trigger={hasTemporalTrigger ? "true" : undefined}
        data-embedded={isEmbedded ? "true" : undefined}
        data-field-control={isEmbedded ? "input" : undefined}
        data-has-root-accessory={hasRootAccessory ? "true" : undefined}
        data-has-value={hasClearableValue ? "true" : undefined}
        {disabled}
        style={userStyle || undefined}
        enableResponsive={enableResponsive}
        enableContext={enableContext}
        enableScaleObserver={enableScaleObserver}
        enableAutoLayout={internalAutoLayout}
        renderHints={inputRenderHints}
        {...frameRestProps}
    >
    {#if isCustomColorType}
        <div class="snowui-input-color-shell">
            <input
                {...inputRestProps}
                bind:this={nativeInputElement}
                class="snowui-input-control snowui-native-control snowui-input-control-native snowui-input-control-color-native"
                {id}
                type="color"
                {name}
                disabled={disabled || readonly}
                {required}
                {autocomplete}
                {form}
                {tabindex}
                {title}
                value={colorDisplayValue}
                aria-invalid={resolvedInvalid
                    ? "true"
                    : inputRestProps["aria-invalid"]}
                aria-readonly={readonly ? "true" : undefined}
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
            />
            <div class="snowui-input-color-display" aria-hidden="true">
                <span
                    class="snowui-input-color-swatch"
                    style={`--snowui-input-color-swatch: ${colorDisplayValue};`}
                ></span>
                <span class="snowui-input-color-text">
                    <span class="snowui-input-color-prefix">#</span>
                    <span class="snowui-input-color-value">{colorHexValue}</span
                    >
                </span>
            </div>
        </div>
    {:else if isCustomTemporalType}
        <input
            {...inputRestProps}
            bind:this={nativeInputElement}
            class="snowui-input-control snowui-native-control snowui-input-control-native snowui-input-control-date-native"
            {id}
            type={normalizedInputType}
            {name}
            {disabled}
            {readonly}
            {required}
            {autocomplete}
            {min}
            {max}
            {step}
            {form}
            tabindex={-1}
            {title}
            value={resolvedValue}
            aria-invalid={resolvedInvalid
                ? "true"
                : inputRestProps["aria-invalid"]}
            aria-hidden="true"
            oninput={handleNativeDateInput}
            onchange={handleNativeDateChange}
        />

        <div
            class="snowui-input-date-editor"
            aria-disabled={disabled ? "true" : undefined}
            {title}
            role="textbox"
            tabindex="-1"
            onkeydown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    focusDateSegment(getTemporalSegments(temporalInputType)[0]);
                }
            }}
            onclick={handleDateEditorClick}
        >
            {#each getTemporalSegments(temporalInputType) as segment, index}
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <span
                    class="snowui-input-date-segment-shell"
                    data-active={activeDateSegment === segment
                        ? "true"
                        : undefined}
                    onmousedown={(event: MouseEvent) =>
                        handleDateSegmentMouseDown(segment, event)}
                >
                    <span
                        class="snowui-input-date-segment"
                        data-segment={segment}
                        role="spinbutton"
                        aria-label={getTemporalAriaLabel(segment)}
                        aria-valuetext={formatDateSegmentDisplayValue(
                            segment,
                            dateDraft[segment],
                        )}
                        data-placeholder={!dateDraft[segment]
                            ? "true"
                            : undefined}
                        tabindex={disabled ? undefined : (tabindex ?? 0)}
                        onmousedown={(event: MouseEvent) =>
                            handleDateSegmentMouseDown(segment, event)}
                        onclick={(event) =>
                            handleDateSegmentClick(segment, event)}
                        ondblclick={userOnDoubleClick}
                        onfocus={(event) =>
                            handleDateSegmentFocus(segment, event)}
                        onblur={handleDateSegmentBlur}
                        onkeydown={(event) =>
                            handleDateSegmentKeyDown(segment, event)}
                        onkeyup={userOnKeyUp}
                        onkeypress={userOnKeyPress}
                        onpaste={(event) =>
                            handleDateSegmentPaste(segment, event)}
                        oncopy={userOnCopy}
                        oncut={userOnCut}
                    >
                        {formatDateSegmentDisplayValue(
                            segment,
                            dateDraft[segment],
                        )}
                    </span>
                </span>
                {#if index < getTemporalSegments(temporalInputType).length - 1}
                    <span class="snowui-input-date-separator"
                        >{TEMPORAL_SEPARATOR_AFTER[segment] ?? "/"}</span
                    >
                {/if}
            {/each}
            {#if !hasTemporalTrigger}
                <Button bare emphasis="muted" size="sm" {...parts?.Button}
                    type="button"
                    class={`snowui-input-date-trigger${parts?.Button?.class ? ` ${parts.Button.class}` : ""}`}
                    aria-label={getTemporalTriggerLabel(temporalInputType)}
                    onmousedown={(event: MouseEvent) => event.preventDefault()}
                    onclick={tryOpenNativeTemporalPicker}
                    {disabled}
                    tabindex={disabled ? undefined : -1}
                >
                    <ComponentIcon name={temporalDefaultIconName} aria-hidden="true" />
                </Button>
            {/if}
        </div>
    {:else}
        <!-- svelte-ignore a11y_autofocus -->
        <input
            {...inputRestProps}
            bind:this={nativeInputElement}
            class="snowui-input-control snowui-native-control snowui-horizontal-scroll-mask"
            data-scroll-mask-x={horizontalScrollMask}
            {id}
            type={normalizedInputType}
            {name}
            {placeholder}
            {disabled}
            {readonly}
            {required}
            {autocomplete}
            {minlength}
            maxlength={resolvedMaxlength}
            {pattern}
            {min}
            {max}
            {step}
            {inputmode}
            {enterkeyhint}
            {spellcheck}
            {list}
            {accept}
            {multiple}
            {capture}
            {form}
            {autofocus}
            {tabindex}
            {title}
            value={resolvedValue}
            aria-invalid={resolvedInvalid
                ? "true"
                : inputRestProps["aria-invalid"]}
            onclick={userOnClick}
            ondblclick={userOnDoubleClick}
            oninput={handleInput}
            onchange={handleChange}
            onfocus={userOnFocus}
            onblur={userOnBlur}
            onkeydown={(e) => { handleSearchKeydown(e); userOnKeyDown?.(e); }}
            onkeyup={userOnKeyUp}
            onkeypress={userOnKeyPress}
            onpaste={userOnPaste}
            oncopy={userOnCopy}
            oncut={userOnCut}
        />
    {/if}

    {#if normalizedInputType === "number"}
        <div
            class="snowui-input-stepper"
            data-custom={hasCustomStepperUp || hasCustomStepperDown
                ? "true"
                : undefined}
        >
            {#if !hasCustomStepperUp}
                <Button bare emphasis="muted" size="sm" {...parts?.Button}
                    type="button"
                    class={`snowui-input-stepper-btn${parts?.Button?.class ? ` ${parts.Button.class}` : ""}`}
                    as="up"
                    aria-label={localeContext.t("input.increment")}
                    disabled={stepUpDisabled}
                    onclick={handleStepUp}
                    onmousedown={(e: MouseEvent) => e.preventDefault()}
                >
                    <ComponentIcon name="arrow-line-up" aria-hidden="true" />
                </Button>
            {/if}
            {#if !hasCustomStepperDown}
                <Button bare emphasis="muted" size="sm" {...parts?.Button}
                    type="button"
                    class={`snowui-input-stepper-btn${parts?.Button?.class ? ` ${parts.Button.class}` : ""}`}
                    as="down"
                    aria-label={localeContext.t("input.decrement")}
                    disabled={stepDownDisabled}
                    onclick={handleStepDown}
                    onmousedown={(e: MouseEvent) => e.preventDefault()}
                >
                    <ComponentIcon name="arrow-line-down" aria-hidden="true" />
                </Button>
            {/if}
            {@render children?.()}
            {#if resolvedInvalid && !hasCustomTrailing}
                <span
                    class="snowui-input-warning-icon snowui-role-trailing text-secondary-red"
                    aria-hidden="true"
                >
                    <ComponentIcon name="warning" size="var(--size-4)" aria-hidden="true" />
                </span>
            {/if}
        </div>
    {:else}
        {@render children?.()}
        {#if clearable && isClearableType && !disabled && !readonly}
            <Button bare emphasis="muted" size="sm" {...parts?.Button}
                type="button"
                class={`snowui-clear-icon-btn snowui-input-clear-btn${parts?.Button?.class ? ` ${parts.Button.class}` : ""}`}
                as="trailing"
                aria-label={localeContext.t("input.clear")}
                onclick={handleClear}
                onmousedown={(e: MouseEvent) => e.preventDefault()}
                tabindex={-1}
            >
                <ComponentIcon name="x-circle" weight="fill" aria-hidden="true" />
            </Button>
        {/if}
        {#if resolvedInvalid && !hasCustomTrailing}
            <span
                class="snowui-input-warning-icon snowui-role-trailing text-secondary-red"
                aria-hidden="true"
            >
                <ComponentIcon name="warning" size="var(--size-4)" aria-hidden="true" />
            </span>
        {/if}
    {/if}
    </Frame>
{/if}
{/snippet}

{#if hasBuiltInError}
    <div
        class="snowui-input-error-layout"
        style:width={errorLayoutWidth}
    >
        {@render inputSurface()}
        <Text
            {...parts?.Text}
            as="error"
            class={`snowui-input-error snowui-field-error-message${parts?.Text?.class ? ` ${parts.Text.class}` : ""}`}
        >
            {#if typeof error === "function"}
                {@render error()}
            {:else}
                {error}
            {/if}
        </Text>
    </div>
{:else}
    {@render inputSurface()}
{/if}

<style>
    /* 骨架替换整个输入表面，不重复叠加输入内容的 padding。 */
    :global(:where(.snowui-input.snowui-loading):has(> .snowui-skeleton-layout)) {
        padding: 0;
        display: block;
    }

    :global(:where(.snowui-input)) {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: center;
        /* 带附件时切换为单行 Grid；固定高度的剩余空间须上下均分。 */
        align-content: center;
        position: relative;
        cursor: var(--snowui-field-cursor, text);
        --snowui-input-width: 100%;
        --snowui-input-height: auto;
        --snowui-input-radius: var(--radius-4);
        --snowui-input-background: var(--surface-1, #ffffffcc);
        --snowui-input-padding-y: var(--padding-3); /* 12px */
        --snowui-input-padding-x: var(--padding-4); /* 16px */
        --snowui-input-gap: var(--gap-2);
        --snowui-input-font-size: var(--text-14);
        --snowui-input-line-height: var(--leading-14);
        --snowui-input-placeholder-color: var(--black-20, #00000033);
        --snowui-input-warning-icon-color: var(--secondary-red, #ff4747ff);
        --snowui-input-warning-icon-size: var(--size-4);
        --snowui-input-warning-icon-line-height: 1;
        width: var(--snowui-input-width-override, var(--snowui-input-width));
        height: var(
            --snowui-input-height-override,
            var(--snowui-input-height)
        );
        min-width: 0;
        gap: var(--snowui-input-gap-override, var(--snowui-input-gap));
        padding: var(--snowui-input-padding-y) var(--snowui-input-padding-x);
        border-radius: var(
            --snowui-input-radius-override,
            var(--snowui-input-radius)
        );
        background-color: var(
            --snowui-input-background-override,
            var(--snowui-input-background)
        );
        font-size: var(
            --snowui-input-font-size-override,
            var(--snowui-input-font-size)
        );
        line-height: var(
            --snowui-input-line-height-override,
            var(--snowui-input-line-height)
        );
        box-sizing: border-box;
    }

    :global(:where(.snowui-input-error-layout)) {
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        align-items: start;
        gap: 0;
        min-width: 0;
        max-width: 100%;
    }

    :global(:where(.snowui-input-error-layout > .snowui-input)) {
        width: 100%;
    }

    :global(:where(.snowui-input-error-layout > .snowui-input-error)) {
        display: none;
    }

    :global(
            :where(
                    .snowui-input-error-layout:has(
                            > .snowui-input[data-invalid="true"]
                        )
                )
        ) {
        gap: var(--gap-2);
    }

    :global(
            :where(
                    .snowui-input-error-layout
                        > .snowui-input[data-invalid="true"]
                        + .snowui-input-error
                )
        ) {
        display: block;
    }

    :global(:where(.snowui-input.snowui-search-input-borderless)) {
        --snowui-input-padding-y: 0rem;
        --snowui-input-padding-x: 0rem;
        --snowui-input-radius-override: 0rem;
    }

    /* 所有嵌入态 Input 外层 div 不持有自身 padding，避免与内层 control 的 override padding 叠加 */
    :global(:where(.snowui-input[data-embedded="true"])) {
        padding: 0;
    }

    /* 非 segment 嵌入态（单宿主模式）：高度收敛到行高，保持内联视觉 */
    :global(.snowui-input[data-embedded="true"]:not(.snowui-role-segment)) {
        height: var(
            --snowui-input-line-height-override,
            var(--snowui-input-line-height)
        );
    }

    :global(:where(.snowui-input-embedded-native)) {
        display: block;
        width: 100%;
        min-width: 0;
        border-radius: 0;
        background-color: transparent;
        box-shadow: none;
    }

    :global(:where(.snowui-input-stepper)) {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: var(--snowui-input-padding-y) var(--snowui-input-padding-x)
            var(--snowui-input-padding-y) 0;
        box-sizing: border-box;
        z-index: 2;
    }



    :global(
            :where(
                    .snowui-input[data-has-root-accessory="true"]:has(
                            > .snowui-input-stepper
                        )
                )
        ) {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        align-items: stretch;
        gap: var(--snowui-input-gap);
        padding: 0; /* Stepper 场景下由内部控制 Padding */
    }

    :global(
            :where(
                    .snowui-input[data-has-root-accessory="true"]:not(
                            :has(> .snowui-input-stepper)
                        )
                )
        ) {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        align-items: center;
        gap: var(--snowui-input-gap);
        box-sizing: border-box;
    }

    :global(
            :where(
                    .snowui-input[data-has-root-accessory="true"]:not(
                            [data-embedded="true"]
                        ):not(:focus-within):has(> .snowui-input-clear-btn):not(
                            :has(
                                    > [data-as="leading"],
                                    > [data-as="trailing"]:not(
                                            .snowui-input-clear-btn
                                        ),
                                    > .snowui-input-warning-icon,
                                    > .snowui-input-stepper
                                )
                        )
                )
        ) {
        gap: 0;
    }

    :global(
            :where(
                    .snowui-input[data-embedded="true"][data-has-root-accessory="true"]:not(
                            :focus-within
                        ):has(
                            > .snowui-input-clear-btn
                        ):not(
                            :has(
                                    > [data-as="leading"],
                                    > [data-as="trailing"]:not(
                                            .snowui-input-clear-btn
                                        ),
                                    > .snowui-input-warning-icon,
                                    > .snowui-input-stepper
                                )
                        )
                )
        ) {
        gap: 0;
    }

    :global(
            :where(
                    .snowui-input[data-has-root-accessory="true"]:not(
                            :has(> .snowui-input-stepper)
                        )[data-embedded="true"]
                )
        ) {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        align-items: center;
        gap: var(--snowui-input-gap);
        box-sizing: border-box;
    }

    :global(
            .snowui-input[data-has-root-accessory="true"]:not(
                    :has(> .snowui-input-stepper)
                ):has(> [data-as="leading"]):not(:has(> [data-as="trailing"]))
        ) {
        grid-template-columns: auto minmax(0, 1fr);
        gap: var(--snowui-input-gap);
    }

    :global(
            .snowui-input[data-has-root-accessory="true"]:not(
                    :has(> .snowui-input-stepper)
                ):has(> [data-as="leading"]):has(> [data-as="trailing"])
        ) {
        grid-template-columns: auto minmax(0, 1fr) auto;
        gap: var(--snowui-input-gap);
    }

    :global(
            :where(
                    .snowui-input:not([data-has-root-accessory="true"]):not(
                            [data-embedded="true"]
                        )
                )
        ) {
        display: block;
    }

    /* 独立模式：外层 div 已承载 padding，内层 control 归零避免双重叠加 */
    :global(
            .snowui-input:not([data-has-root-accessory="true"]):not(
                    [data-embedded="true"]
                )
                > .snowui-input-control
        ) {
        padding: 0;
    }

    :global(
            :where(
                    .snowui-input[data-has-root-accessory="true"]:has(
                            > .snowui-input-stepper
                        )
                        > .snowui-input-control,
                    .snowui-input[data-has-root-accessory="true"]:has(
                            > .snowui-input-stepper
                        )
                        > .snowui-input-color-shell,
                    .snowui-input[data-has-root-accessory="true"]:has(
                            > .snowui-input-stepper
                        )
                        > .snowui-input-date-editor
                )
        ) {
        grid-column: 1;
    }

    :global(
            :where(
                    .snowui-input[data-has-root-accessory="true"]:has(
                            > .snowui-input-stepper
                        )
                        > .snowui-input-stepper
                )
        ) {
        grid-column: 2;
    }

    :global(
            .snowui-input[data-has-root-accessory="true"]:not(
                    :has(> .snowui-input-stepper)
                )
                > :is(
                    .snowui-input-control,
                    .snowui-input-color-shell,
                    .snowui-input-date-editor
                )
        ) {
        grid-row: 1;
        grid-column: 1;
        min-width: 0;
        padding: 0;
    }

    :global(
            .snowui-input[data-has-root-accessory="true"]:not(
                    :has(> .snowui-input-stepper)
                ):has(> [data-as="leading"])
                > :is(
                    .snowui-input-control,
                    .snowui-input-color-shell,
                    .snowui-input-date-editor
                )
        ) {
        grid-column: 2;
    }

    :global(
            .snowui-input[data-has-root-accessory="true"]:not(
                    :has(> .snowui-input-stepper)
                )
                > [data-as="trailing"]:not(.snowui-input-clear-btn)
        ) {
        grid-row: 1;
        grid-column: -2 / -1;
        display: inline-flex;
        align-items: inherit;
        justify-content: center;
        gap: var(--snowui-input-gap);
        min-width: 0;
        white-space: nowrap;
        line-height: inherit;
    }

    /* 内建错误图标：红色 */
    :global(
            .snowui-input[data-has-root-accessory="true"]:not(
                    :has(> .snowui-input-stepper)
                )
                > .snowui-icon-wrapper.snowui-input-warning-icon
        ) {
        color: var(--secondary-red, #ff4747ff);
    }

    /* 外部 trailing 槽：跟随输入文字颜色 */
    :global(
            .snowui-input[data-has-root-accessory="true"]:not(
                    :has(> .snowui-input-stepper)
                )
                > [data-as="trailing"]:not(.snowui-input-warning-icon):not(.snowui-input-clear-btn)
        ) {
        color: currentColor;
    }

    :global(
            .snowui-input[data-has-root-accessory="true"]:has(
                    > .snowui-input-warning-icon
                )
                > [data-as="trailing"]:not(.snowui-input-warning-icon):not(.snowui-input-clear-btn)
        ) {
        display: none;
    }

    :global(
            .snowui-input[data-has-root-accessory="true"]:not(
                    :has(> .snowui-input-stepper)
                )
                > [data-as="leading"]
        ) {
        grid-row: 1;
        grid-column: 1;
        display: inline-flex;
        align-items: inherit;
        justify-content: center;
        gap: var(--snowui-input-gap);
        min-width: 0;
        white-space: nowrap;
        color: var(--black-20, #00000033);
        line-height: inherit;
    }

    :global(:where(.snowui-input[data-embedded="true"])) {
        border-radius: 0;
        background-color: transparent;
        overflow: visible;
        --snowui-input-date-trigger-cover-background: var(
            --snowui-input-background-override,
            var(--snowui-input-background, var(--surface-1, #ffffffcc))
        );
    }

    :global(
            :where(
                    .snowui-input[data-readonly="true"]:not(
                            [data-embedded="true"]
                        )
                )
        ) {
        background-color: var(--surface-2, #00000008);
        box-shadow: none;
    }

    :global(
            :where(
                    .snowui-input[data-invalid="true"]:not(
                            [data-embedded="true"]
                        )
                )
        ) {
        --snowui-field-border-color: var(--secondary-red, #ff4747ff);
        --snowui-field-hover-border-color: var(--secondary-red, #ff4747ff);
        --snowui-field-focus-border-color: var(--secondary-red, #ff4747ff);
    }



    :global(:where(.snowui-input-control)) {
        display: block;
        flex: 1 1 auto;
        position: relative;
        z-index: 0;
        width: 100%;
        min-width: 0;
        height: auto;
        padding: var(
            --snowui-input-padding-override,
            var(--snowui-input-padding-y) var(--snowui-input-padding-x)
        );
        border: 0;
        outline: none;
        background: transparent;
        color: inherit;
        font-size: inherit;
        line-height: inherit;
        caret-color: currentColor;
        -webkit-appearance: none;
        appearance: none;
    }

    :global(:where(.snowui-input-control-native)) {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
        opacity: 0;
        pointer-events: none;
    }

    :global(:where(.snowui-input-control-color-native)) {
        z-index: 1;
        pointer-events: auto;
        cursor: pointer;
    }

    :global(:where(.snowui-input-control-color-native:disabled)) {
        cursor: default;
    }

    :global(
            :where(
                    .snowui-input-color-shell,
                    .snowui-input-color-display,
                    .snowui-input-date-editor
                )
        ) {
        display: flex;
        align-items: center;
        flex: 1 1 auto;
        min-width: 0;
        width: 100%;
        position: relative;
        color: inherit;
        font-size: inherit;
        line-height: inherit;
        caret-color: currentColor;
        user-select: text;
        box-sizing: border-box;
        outline: none;
    }

    :global(:where(.snowui-input-date-editor)) {
        padding: 0;
    }

    :global(:where(.snowui-input-color-shell)) {
        position: relative;
    }

    :global(:where(.snowui-input-color-display)) {
        gap: var(--snowui-input-gap);
        padding: 0; /* 统一由 Frame 负责 Padding */
        pointer-events: none;
        user-select: none;
    }

    :global(:where(.snowui-input-color-text)) {
        display: inline-flex;
        align-items: center;
        gap: var(--gap-1);
        min-width: 0;
    }

    :global(:where(.snowui-input-color-prefix)) {
        color: var(--black-40, #00000066);
        -webkit-text-fill-color: var(--black-40, #00000066);
    }

    :global(:where(.snowui-input-color-value)) {
        color: var(--black-100, #000000);
        -webkit-text-fill-color: var(--black-100, #000000);
        white-space: nowrap;
    }

    :global(:where(.snowui-input-color-swatch)) {
        width: var(--size-4);
        height: var(--size-4);
        min-width: var(--size-4);
        min-height: var(--size-4);
        border-radius: var(--radius-full);
        background-color: var(--snowui-input-color-swatch, #000000);
        flex: 0 0 auto;
    }

    :global(:where(.snowui-input-date-editor)) {
        gap: var(--gap-1);
    }

    :global(:where(.snowui-input-date-segment-shell)) {
        position: relative;
        display: inline-grid;
        align-items: center;
        width: max-content;
        min-width: 0;
        flex: 0 0 auto;
        margin: 0;
        padding: 0;
        border-radius: calc(var(--radius-1) * 1.5);
        background-color: transparent;
        isolation: isolate;
    }

    :global(:where(.snowui-input-date-segment-shell:focus-within)) {
        background-color: var(
            --snowui-field-selection-bg,
            color-mix(
                in srgb,
                var(--brand, #33D1FFFF) 40%,
                transparent
            )
        );
    }

    :global(:where(.snowui-input-date-segment-shell[data-active="true"])) {
        background-color: var(
            --snowui-field-selection-bg,
            color-mix(
                in srgb,
                var(--brand, #33D1FFFF) 40%,
                transparent
            )
        );
    }

    :global(:where(.snowui-input-date-segment)) {
        display: inline-block;
        position: relative;
        z-index: 1;
        min-width: 0;
        padding: 0 calc(var(--padding-1) / 2);
        margin: 0;
        border: 0;
        background: transparent;
        color: var(--black-100, #000000);
        -webkit-text-fill-color: var(--black-100, #000000);
        text-align: left;
        border-radius: calc(var(--radius-1) * 1.5);
        outline: none;
        white-space: nowrap;
        user-select: none;
    }

    :global(:where(.snowui-input-date-separator)) {
        color: var(--black-10, #0000001a);
        -webkit-text-fill-color: var(--black-10, #0000001a);
        user-select: none;
    }

    :global(:where(.snowui-input-date-segment:focus)) {
        color: var(--black-100, #000000);
        -webkit-text-fill-color: var(--black-100, #000000);
    }

    :global(
            :where(.snowui-input-date-segment-shell:focus-within)
                .snowui-input-date-segment[data-placeholder="true"]
        ) {
        color: var(--black-100, #000000);
        -webkit-text-fill-color: var(--black-100, #000000);
    }

    :global(
            :where(.snowui-input-date-segment-shell[data-active="true"])
                .snowui-input-date-segment[data-placeholder="true"]
        ) {
        color: var(--black-100, #000000);
        -webkit-text-fill-color: var(--black-100, #000000);
    }

    :global(:where(.snowui-input-date-segment[data-placeholder="true"])) {
        color: var(--black-20, #00000033);
        -webkit-text-fill-color: var(--black-20, #00000033);
    }

    :global(:where(.snowui-input-date-separator)) {
        color: var(--black-20, #00000033);
        user-select: none;
    }

    :global(:where(.snowui-input-date-trigger)) {
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
    }

    :global(:where(.snowui-input-warning-icon)) {
        display: inline-flex;
        flex: 0 0
            var(
                --snowui-input-warning-icon-size-override,
                var(--snowui-input-warning-icon-size, var(--size-4))
            );
        align-items: center;
        justify-content: center;
        color: var(
            --snowui-input-warning-icon-color-override,
            var(
                --snowui-input-warning-icon-color,
                var(--secondary-red, #ff4747ff)
            )
        );
        width: var(
            --snowui-input-warning-icon-size-override,
            var(--snowui-input-warning-icon-size, var(--size-4))
        );
        height: var(
            --snowui-input-warning-icon-size-override,
            var(--snowui-input-warning-icon-size, var(--size-4))
        );
        font-size: var(
            --snowui-input-warning-icon-font-size-override,
            var(--snowui-input-warning-icon-font-size)
        );
        line-height: var(
            --snowui-input-warning-icon-line-height-override,
            var(--snowui-input-warning-icon-line-height)
        );
    }

    :global(:where(.snowui-input[data-has-root-accessory="true"] > .snowui-input-warning-icon)) {
        grid-row: 1;
        grid-column: -2 / -1;
        justify-self: center;
        align-self: auto;
    }

    :global(:where(.snowui-input-warning-icon svg)) {
        display: block;
        width: 100%;
        height: 100%;
        flex: 0 0 auto;
    }

    :global(:where(.snowui-input-control::-webkit-input-placeholder)) {
        color: var(
            --snowui-input-placeholder-color-override,
            var(--snowui-input-placeholder-color)
        );
        -webkit-text-fill-color: var(
            --snowui-input-placeholder-color-override,
            var(--snowui-input-placeholder-color)
        );
        opacity: 1;
    }

    :global(:where(.snowui-input-control::-moz-placeholder)) {
        color: var(
            --snowui-input-placeholder-color-override,
            var(--snowui-input-placeholder-color)
        );
        opacity: 1;
    }

    :global(:where(.snowui-input-control:-ms-input-placeholder)) {
        color: var(
            --snowui-input-placeholder-color-override,
            var(--snowui-input-placeholder-color)
        );
        opacity: 1;
    }

    :global(:where(.snowui-input-control::-ms-input-placeholder)) {
        color: var(
            --snowui-input-placeholder-color-override,
            var(--snowui-input-placeholder-color)
        );
        opacity: 1;
    }

    :global(:where(.snowui-input-control:placeholder-shown)) {
        color: var(
            --snowui-input-placeholder-color-override,
            var(--snowui-input-placeholder-color)
        );
        -webkit-text-fill-color: var(
            --snowui-input-placeholder-color-override,
            var(--snowui-input-placeholder-color)
        );
        caret-color: var(--black-100, #000000);
    }

    :global(
            :where(
                    .snowui-input[data-temporal-empty="true"]
                        .snowui-input-control-native
                )
        ) {
        color: var(--black-20, #00000033);
        -webkit-text-fill-color: var(--black-20, #00000033);
    }

    :global(
            :where(
                    .snowui-input[data-temporal-empty="true"]
                        .snowui-input-control-native::-webkit-datetime-edit,
                    .snowui-input[data-temporal-empty="true"]
                        .snowui-input-control-native::-webkit-datetime-edit-fields-wrapper,
                    .snowui-input[data-temporal-empty="true"]
                        .snowui-input-control-native::-webkit-datetime-edit-text,
                    .snowui-input[data-temporal-empty="true"]
                        .snowui-input-control-native::-webkit-datetime-edit-year-field,
                    .snowui-input[data-temporal-empty="true"]
                        .snowui-input-control-native::-webkit-datetime-edit-month-field,
                    .snowui-input[data-temporal-empty="true"]
                        .snowui-input-control-native::-webkit-datetime-edit-day-field,
                    .snowui-input[data-temporal-empty="true"]
                        .snowui-input-control-native::-webkit-datetime-edit-week-field,
                    .snowui-input[data-temporal-empty="true"]
                        .snowui-input-control-native::-webkit-datetime-edit-hour-field,
                    .snowui-input[data-temporal-empty="true"]
                        .snowui-input-control-native::-webkit-datetime-edit-minute-field,
                    .snowui-input[data-temporal-empty="true"]
                        .snowui-input-control-native::-webkit-datetime-edit-second-field
                )
        ) {
        color: var(--black-20, #00000033);
        -webkit-text-fill-color: var(--black-20, #00000033);
    }

    :global(:where(.snowui-input-control[type="search"])::-webkit-search-decoration),
    :global(:where(.snowui-input-control[type="search"])::-webkit-search-cancel-button),
    :global(:where(.snowui-input-control[type="search"])::-webkit-search-results-button),
    :global(:where(.snowui-input-control[type="search"])::-webkit-search-results-decoration) {
        -webkit-appearance: none;
        display: none;
        width: 0;
        height: 0;
    }

    :global(
            :where(
                    .snowui-input-control[type="number"]
                )::-webkit-outer-spin-button
        ),
    :global(
            :where(
                    .snowui-input-control[type="number"]
                )::-webkit-inner-spin-button
        ) {
        -webkit-appearance: none;
        appearance: none;
        margin: 0;
        display: none;
        width: 0;
        height: 0;
        opacity: 0;
        pointer-events: none;
    }

    :global(:where(.snowui-input-control[type="number"])) {
        -webkit-appearance: textfield;
        -moz-appearance: textfield;
        appearance: textfield;
    }

    :global(:where(.snowui-input-control)::-webkit-calendar-picker-indicator) {
        opacity: 0.72;
        cursor: pointer;
    }

    /* datalist 绑定时隐藏浏览器默认下拉箭头 */
    :global(:where(.snowui-input-control[list])::-webkit-calendar-picker-indicator) {
        display: none;
        opacity: 0;
        width: 0;
        height: 0;
        -webkit-appearance: none;
    }

    :global(
            :where(
                    .snowui-input[data-has-temporal-trigger="true"]
                        .snowui-input-control
                )::-webkit-calendar-picker-indicator
        ) {
        opacity: 0;
        display: none;
        visibility: hidden;
        -webkit-appearance: none;
        pointer-events: none;
        width: 0;
        height: 0;
        margin: 0;
        padding: 0;
    }

    :global(
            :where(
                    .snowui-input[data-temporal-input="true"][data-has-temporal-trigger="true"]::after
                )
        ) {
        content: "";
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        width: var(--snowui-input-date-trigger-cover-width);
        background-color: var(--snowui-input-date-trigger-cover-background);
        pointer-events: none;
        z-index: 1;
    }

    :global(
            :where(
                    .snowui-input[data-embedded="true"][data-temporal-input="true"][data-has-temporal-trigger="true"]::after
                )
        ) {
        display: none;
    }

    /* ─── Clear (X) 按钮 ─────────────────────────────────────────
     * 视觉/交互复用 Button bare。
     * 此处仅保留 Input 专属的 grid 落列与默认隐藏；显示时机由下方
     * focus-within 规则接管。 */

    :global(:where(.snowui-input-clear-btn)) {
        display: none;
        grid-row: 1;
        grid-column: -2 / -1;
        justify-self: center;
        align-self: auto;
        z-index: 2;
    }

    /* 普通 Input 的内置清除 X 与 control 共用同一网格列，X 显隐不新增轨道，
       避免 shrink-to-fit 宿主宽度变化。SearchInput borderless 继续使用自身的
       预留列策略。 */
    :global(
            .snowui-input:not(.snowui-search-input-borderless)[data-has-root-accessory="true"]:has(
                    > .snowui-input-clear-btn
                ):not(:has(> [data-as="leading"])):not(
                    :has(
                            > [data-as="trailing"]:not(
                                    .snowui-input-clear-btn
                                ),
                            > .snowui-input-warning-icon,
                            > .snowui-input-stepper
                        )
                )
        ) {
        grid-template-columns: minmax(0, 1fr);
        gap: 0;
    }

    :global(
            .snowui-input:not(.snowui-search-input-borderless)[data-has-root-accessory="true"]:has(
                    > .snowui-input-clear-btn
                ):has(> [data-as="leading"]):not(
                    .snowui-search-input-responsive-icon:not(
                            :focus-within
                        ):not(.snowui-search-input-has-value)
                ):not(
                    :has(
                            > [data-as="trailing"]:not(
                                    .snowui-input-clear-btn
                                ),
                            > .snowui-input-warning-icon,
                            > .snowui-input-stepper
                        )
                )
        ) {
        grid-template-columns: auto minmax(0, 1fr);
        gap: var(
            --snowui-input-gap-override,
            var(--snowui-input-gap)
        );
    }

    :global(
            .snowui-input:not(.snowui-search-input-borderless)[data-has-root-accessory="true"]:has(
                    > .snowui-input-clear-btn
                ):not(
                    :has(
                            > [data-as="trailing"]:not(
                                    .snowui-input-clear-btn
                                ),
                            > .snowui-input-warning-icon,
                            > .snowui-input-stepper
                        )
                )
                > .snowui-input-clear-btn
        ) {
        justify-self: end;
    }

    /* X 显示时，输入内容在靠近按钮的一侧渐隐。参数与 Table 表头 overlay
       checkbox 的内容渐隐一致：完全透明区 14px，26px 后恢复清晰。 */
    :global(
            :where(
                    .snowui-input[data-has-value="true"]:focus-within:has(
                            > .snowui-input-clear-btn
                        )
                        > .snowui-input-control.snowui-horizontal-scroll-mask
                )
        ) {
        --snowui-input-horizontal-scroll-mask-right-transparent: 20px;
        --snowui-input-horizontal-scroll-mask-right-visible: 32px;
    }

    /* 独立 Input（非嵌入）焦点态 + 有内容 → 显示 X */
    :global(
            .snowui-input:not([data-embedded="true"])[data-has-value="true"]:focus-within
                .snowui-input-clear-btn
        ) {
        display: inline-flex;
    }

    /* 嵌入在 Field 内的 Input：Input 焦点态 + 有内容 → 显示 X */
    :global(
            .snowui-input[data-embedded="true"][data-has-value="true"]:focus-within
                .snowui-input-clear-btn
        ) {
        display: inline-flex;
    }

    /* X 可见时隐藏外置 trailing 图标（独立模式） */
    :global(
            .snowui-input:not([data-embedded="true"])[data-has-value="true"]:focus-within
                > [data-as="trailing"]:not(.snowui-input-clear-btn)
        ) {
        display: none;
    }

    /* X 可见时隐藏外置 trailing 图标（嵌入模式） */
    :global(
            .snowui-input[data-embedded="true"][data-has-value="true"]:focus-within
                > [data-as="trailing"]:not(.snowui-input-clear-btn)
        ) {
        display: none;
    }


    /* X 可见时隐藏内置 Warning 图标（独立模式） */
    :global(
            .snowui-input:not([data-embedded="true"])[data-has-value="true"]:focus-within
                > .snowui-input-warning-icon
        ) {
        display: none;
    }

    /* X 可见时隐藏内置 Warning 图标（嵌入模式） */
    :global(
            .snowui-input[data-embedded="true"][data-has-value="true"]:focus-within
                > .snowui-input-warning-icon
        ) {
        display: none;
    }

    /*
     * ─── 浮层搜索输入 ──────────────────────────────────────
     * Listbox / QuickAction 使用固定 header + 滚动 body 结构。
     * SearchPopup 直接在面板内组合 SearchInput。
     * 选择器覆盖移位前（列表内）、移位后（header 内）和 SearchPopup 内，确保浮层输入视觉一致。
     */
    :global(:where(.snowui-quick-action-panel-header > .snowui-input, .snowui-listbox-header > .snowui-input, .snowui-listbox > .snowui-input, .snowui-quick-action-header > .snowui-input, .snowui-quick-action-list > .snowui-input, .snowui-search-popup > .snowui-input)) {
        --snowui-input-padding-y: var(--padding-2);
        --snowui-input-padding-x: var(--padding-2);
        --snowui-input-gap: var(--gap-2);
        --snowui-input-radius: var(--radius-3);
    }

    /* 焦点态：仅保留边框颜色变化，移除外扩阴影环 */
    :global(:where(.snowui-quick-action-panel-header > .snowui-input, .snowui-listbox-header > .snowui-input, .snowui-listbox > .snowui-input, .snowui-quick-action-header > .snowui-input, .snowui-quick-action-list > .snowui-input, .snowui-search-popup > .snowui-input):focus-within) {
        --snowui-field-focus-ring-width: 0rem;
    }

</style>
