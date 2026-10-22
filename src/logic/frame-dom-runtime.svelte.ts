/* SnowUI source notice | LICENSE 2.3.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
/**
 * frame-dom-runtime.svelte.ts
 * v1.0.1
 * 职责：统一拼装 Frame 根节点的 DOM props、事件包装器与运行时 data 属性。
 *
 * Log:
 * - [2026-10-18] Fix: 事件包装器改读稳定源状态，避免同步卸载后读取已销毁派生状态，并保留同一事件中的实时禁用/加载语义。
 * - [2026-03-09] Init: 从 Frame.svelte 抽离 DOM 透传过滤、disabled/aria 补齐、readonly capture、原生事件包装与 data-* 运行时属性组装。
 */

import type { FrameProps } from "./frame-types";
import { isSingleLineLayout } from "./content-line";
import type { FrameState } from "./frame-state.svelte";
import {
    filterFrameDomProps,
    type FilteredFrameProps,
} from "./frame-prop-filter";
import { createReadonlyHandler } from "./frame-utils";

const DISABLED_ATTRIBUTE_TAGS = new Set([
    "button",
    "input",
    "select",
    "textarea",
    "option",
    "optgroup",
    "fieldset",
]);

interface FrameStateLike
    extends Pick<
        FrameState,
        | "currentState"
        | "handleClick"
        | "handleDblClick"
        | "handleContextMenu"
        | "handleMouseEnter"
        | "handleMouseLeave"
        | "handleMouseMove"
        | "handleMouseDown"
        | "handleMouseUp"
        | "handleTouchStart"
        | "handleTouchEnd"
        | "handleTouchMove"
        | "handleTouchCancel"
        | "handleFocus"
        | "handleBlur"
        | "handleKeyDown"
        | "handleKeyUp"
        | "handleKeyPress"
        | "handleInput"
        | "handleChange"
        | "handleSubmit"
        | "handleScroll"
        | "handleDragStart"
        | "handleDrag"
        | "handleDragEnd"
    > { }

export interface FrameDomRuntimeOptions {
    getFrameProps: () => FrameProps;
    frameState: FrameStateLike;
    getEffectiveLoading: () => boolean;
    getHasScaleApplyConfig: () => boolean;
}

function toRenderHintDomValue(
    value?: string | number,
): string | undefined {
    if (value === undefined || value === null || value === "") {
        return undefined;
    }
    if (typeof value === "number") {
        return `${value / 16}rem`;
    }
    return value;
}

function hasExplicitFillWidth(frameProps: FrameProps) {
    if (frameProps.width !== undefined && frameProps.width !== null) {
        const width = String(frameProps.width).trim();
        return (
            width !== "" &&
            width !== "auto" &&
            width !== "hug" &&
            width !== "fit-content"
        );
    }

    const style = typeof frameProps.style === "string" ? frameProps.style : "";
    if (/(^|;)\s*(width|inline-size)\s*:/.test(style)) return true;

    const className = typeof frameProps.class === "string" ? frameProps.class : "";
    return /\b(?:w|size)-(?:full|fill|screen|\d|[0-9]+\/[0-9]+|[0-9]+p|[0-9]+px|[0-9]+rem)\b/.test(
        className,
    );
}

function resolveContentWidth(frameProps: FrameProps) {
    if (frameProps.contentFill) return "fill";
    if (frameProps.contentHug) return "hug";
    return hasExplicitFillWidth(frameProps) ? "fill" : "hug";
}

export function createFrameDomRuntime(options: FrameDomRuntimeOptions) {
    const filteredProps = $derived(
        filterFrameDomProps(options.getFrameProps()) as FilteredFrameProps,
    );
    const resolvedTag = $derived(options.getFrameProps().tag || "div");
    const isDisabled = $derived(
        filteredProps.disabled ||
        options.frameState.currentState === "Disabled",
    );
    const supportsDisabledAttribute = $derived(
        DISABLED_ATTRIBUTE_TAGS.has(String(resolvedTag).toLowerCase()),
    );

    const domProps = $derived.by(() => {
        const props = { ...filteredProps.domProps };
        const effectiveLoading = options.getEffectiveLoading();

        if (supportsDisabledAttribute && isDisabled) {
            props.disabled = true;
        } else if (!supportsDisabledAttribute && isDisabled) {
            if (props["aria-disabled"] === undefined) {
                props["aria-disabled"] = "true";
            }
        }

        if (effectiveLoading && props["aria-busy"] === undefined) {
            props["aria-busy"] = "true";
        }
        if (effectiveLoading && props["data-loading"] === undefined) {
            props["data-loading"] = "true";
        }

        // 自动输出 aria-pressed：当 Click 为 Idle ↔ Active 的 toggle 字典、
        // 且当前状态属于 {Idle, Active} 时根据 currentState 输出布尔值。
        // 消费方显式传入 aria-pressed / aria-selected 时外部值优先（用于 listbox / tab 等列表选择语境）。
        if (
            props["aria-pressed"] === undefined &&
            props["aria-selected"] === undefined
        ) {
            const click = (options.getFrameProps() as { Click?: unknown }).Click;
            const isToggleClickDict =
                click !== null &&
                typeof click === "object" &&
                !Array.isArray(click) &&
                ("Idle" in (click as Record<string, unknown>) ||
                    "Active" in (click as Record<string, unknown>));
            if (isToggleClickDict) {
                const cs = options.frameState.currentState;
                if (cs === "Active") props["aria-pressed"] = "true";
                else if (cs === "Idle") props["aria-pressed"] = "false";
            }
        }

        return props;
    });

    function wrap(handler: any, internal: (e?: any) => void) {
        return (e: any) => {
            if (
                !!options.getFrameProps().disabled ||
                options.frameState.currentState === "Disabled" ||
                options.getEffectiveLoading()
            ) {
                e.preventDefault();
                e.stopPropagation();
                return;
            }

            internal(e);
            handler?.(e);
        };
    }

    const captureHandlers = $derived.by(() => {
        const access = options.getFrameProps().access;
        return {
            onclickcapture: createReadonlyHandler(access),
            onmousedowncapture: createReadonlyHandler(access),
            ontouchstartcapture: createReadonlyHandler(access),
            onkeydowncapture: createReadonlyHandler(access),
        };
    });

    const nativeHandlers = $derived.by(() => ({
        onclick: wrap(filteredProps.eventHandlers.onclick, options.frameState.handleClick),
        ondblclick: wrap(
            filteredProps.eventHandlers.ondblclick,
            options.frameState.handleDblClick,
        ),
        oncontextmenu: wrap(
            filteredProps.eventHandlers.oncontextmenu,
            options.frameState.handleContextMenu,
        ),
        onmouseenter: wrap(
            filteredProps.eventHandlers.onmouseenter,
            options.frameState.handleMouseEnter,
        ),
        onmouseleave: wrap(
            filteredProps.eventHandlers.onmouseleave,
            options.frameState.handleMouseLeave,
        ),
        onmousemove: wrap(
            filteredProps.eventHandlers.onmousemove,
            options.frameState.handleMouseMove,
        ),
        onmousedown: wrap(
            filteredProps.eventHandlers.onmousedown,
            options.frameState.handleMouseDown,
        ),
        onmouseup: wrap(
            filteredProps.eventHandlers.onmouseup,
            options.frameState.handleMouseUp,
        ),
        ontouchstart: wrap(
            filteredProps.eventHandlers.ontouchstart,
            options.frameState.handleTouchStart,
        ),
        ontouchend: wrap(
            filteredProps.eventHandlers.ontouchend,
            options.frameState.handleTouchEnd,
        ),
        ontouchmove: wrap(
            filteredProps.eventHandlers.ontouchmove,
            options.frameState.handleTouchMove,
        ),
        ontouchcancel: wrap(
            filteredProps.eventHandlers.ontouchcancel,
            options.frameState.handleTouchCancel,
        ),
        onfocus: wrap(
            filteredProps.eventHandlers.onfocus,
            options.frameState.handleFocus,
        ),
        onblur: wrap(
            filteredProps.eventHandlers.onblur,
            options.frameState.handleBlur,
        ),
        onkeydown: wrap(
            filteredProps.eventHandlers.onkeydown,
            options.frameState.handleKeyDown,
        ),
        onkeyup: wrap(
            filteredProps.eventHandlers.onkeyup,
            options.frameState.handleKeyUp,
        ),
        onkeypress: wrap(
            filteredProps.eventHandlers.onkeypress,
            options.frameState.handleKeyPress,
        ),
        oninput: wrap(
            filteredProps.eventHandlers.oninput,
            options.frameState.handleInput,
        ),
        onchange: wrap(
            filteredProps.eventHandlers.onchange,
            options.frameState.handleChange,
        ),
        onsubmit: wrap(
            filteredProps.eventHandlers.onsubmit,
            options.frameState.handleSubmit,
        ),
        onscroll: wrap(
            filteredProps.eventHandlers.onscroll,
            options.frameState.handleScroll,
        ),
        ondragstart: options.frameState.handleDragStart,
        ondrag: options.frameState.handleDrag,
        ondragend: options.frameState.handleDragEnd,
    }));

    const dataAttrs = $derived.by(() => {
        const frameProps = options.getFrameProps();

        return {
            "data-orchestrate-mode": frameProps.orchestrate
                ? frameProps.orchestrateMode || "sequential"
                : undefined,
            "data-orchestrate-delay": frameProps.orchestrate
                ? frameProps.orchestrateDelay || 100
                : undefined,
            "data-orchestrate-order": frameProps.orchestrate
                ? frameProps.orchestrateOrder || "dom"
                : undefined,
            "data-orchestrate-target":
                frameProps.orchestrate && frameProps.orchestrateTarget
                    ? frameProps.orchestrateTarget
                    : undefined,
            "data-orchestrate-group":
                frameProps.orchestrateGroup || undefined,
            "data-scale-basis": frameProps.scaleBasis || undefined,
            "data-scale-apply": options.getHasScaleApplyConfig()
                ? "true"
                : undefined,
            "data-skeleton-registered":
                frameProps.renderHints !== undefined ? "true" : undefined,
            "data-render-hint-variant": frameProps.renderHints?.variant,
            "data-render-hint-width": toRenderHintDomValue(
                frameProps.renderHints?.width,
            ),
            "data-render-hint-height": toRenderHintDomValue(
                frameProps.renderHints?.height,
            ),
            "data-render-hint-radius": toRenderHintDomValue(
                frameProps.renderHints?.radius,
            ),
            "data-render-hint-rows":
                frameProps.renderHints?.rows !== undefined
                    ? String(frameProps.renderHints.rows)
                    : undefined,
            "data-as": frameProps.as || undefined,
            "data-content-width": resolveContentWidth(frameProps),
            // 暴露 currentState 供组件 CSS 与消费方按状态着色（如 [data-state="Active"]）。
            // 命名沿用 FrameState 的 PascalCase（"Idle" / "Active" / "Hover" / "Pending" / "Load" / "StartLoad" / "Disabled"）。
            "data-state": options.frameState.currentState || undefined,
            "data-first-line": frameProps.firstLine === true && !isSingleLineLayout(frameProps) ? "true" : undefined,
            "data-single-line": isSingleLineLayout(frameProps) ? "true" : undefined,
            "data-auto-layout":
                (frameProps.row || frameProps.column || isSingleLineLayout(frameProps) || frameProps.enableAutoLayout === true) &&
                frameProps.enableAutoLayout !== false
                    ? "true"
                    : undefined,
        };
    });

    return {
        get resolvedTag() {
            return resolvedTag;
        },
        get domProps() {
            return domProps;
        },
        get captureHandlers() {
            return captureHandlers;
        },
        get nativeHandlers() {
            return nativeHandlers;
        },
        get dataAttrs() {
            return dataAttrs;
        },
    };
}
