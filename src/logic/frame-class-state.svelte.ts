/**
 * frame-class-state.svelte.ts
 * v1.0.0
 * 职责：统一解析 Frame 的 stateVars/stateClass/stateStyle、childrenRenderContext 与 computedClass。
 *
 * Log:
 * - [2026-03-09] Init: 从 Frame.svelte 抽离状态变量解析、状态 class/style 解析、childrenRenderContext 与根节点 computedClass 组装。
 */

import type { FrameProps } from "./frame-types";
import type { FrameState } from "./frame-state.svelte";
import type { FrameLayout } from "./frame-layout.svelte";
import type { FrameResponsive } from "./frame-responsive.svelte";
import { FRAME_MOTION_DEFAULTS } from "./frame-motion-defaults";

interface FrameStateLike
    extends Pick<FrameState, "interactionState" | "currentState"> {}

interface FrameLayoutLike extends Pick<FrameLayout, "direction"> {}

interface FrameResponsiveLike extends Pick<FrameResponsive, "breakpoint"> {}

export interface FrameClassStateRuntimeOptions {
    getFrameProps: () => FrameProps;
    frameState: FrameStateLike;
    layout: FrameLayoutLike;
    responsive: FrameResponsiveLike | null;
    getEffectiveLoading: () => boolean;
    getElement: () => HTMLElement | undefined;
}

function toInlineStyleString(
    value: string | Record<string, string | number> | undefined,
): string {
    if (!value) return "";
    if (typeof value === "string") return value;
    return Object.entries(value)
        .filter(([, v]) => v !== undefined && v !== null && v !== "")
        .map(([k, v]) => `${k}:${String(v)}`)
        .join(";");
}

function toRoleClass(as?: string): string {
    if (!as || !as.trim()) return "";
    const normalized = as
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9_-]+/g, "-");
    return normalized ? `snowui-role-${normalized}` : "";
}

export function createFrameClassStateRuntime(
    options: FrameClassStateRuntimeOptions,
) {
    const resolvedStateVars = $derived.by(() => {
        const vars = options.getFrameProps().stateVars;
        if (!vars || typeof vars !== "object") return {};

        const out: Record<string, any> = {};
        for (const [key, value] of Object.entries(vars)) {
            if (
                value &&
                typeof value === "object" &&
                !Array.isArray(value) &&
                (options.frameState.currentState in value || "Idle" in value)
            ) {
                const map = value as Record<string, any>;
                out[key] =
                    map[options.frameState.currentState] ?? map.Idle;
            } else {
                out[key] = value;
            }
        }
        return out;
    });

    const resolvedStateClass = $derived.by(() => {
        const stateClass = options.getFrameProps().stateClass;
        if (!stateClass || typeof stateClass !== "object") return "";
        return (
            stateClass[options.frameState.currentState] ??
            stateClass.Idle ??
            ""
        );
    });

    const resolvedStateStyle = $derived.by(() => {
        const stateStyle = options.getFrameProps().stateStyle;
        if (!stateStyle || typeof stateStyle !== "object") return "";
        const value =
            stateStyle[options.frameState.currentState] ??
            stateStyle.Idle;
        return toInlineStyleString(
            value as string | Record<string, string | number> | undefined,
        );
    });

    const computedClass = $derived.by(() => {
        const frameProps = options.getFrameProps();
        return [
            "snowui-frame",
            frameProps.class,
            toRoleClass(frameProps.as),
            resolvedStateClass,
            options.layout.direction
                ? `snowui-direction-${options.layout.direction}`
                : "",
            frameProps.morph ? "snowui-morph-container" : "",
            options.getEffectiveLoading() ? "snowui-loading" : "",
            frameProps.whileDisabled ||
            !!frameProps.disabled ||
            options.frameState.currentState === "Disabled"
                ? "snowui-disabled"
                : "",
            frameProps.collapsed ? "snowui-collapsed" : "",
            frameProps.expanded ? "snowui-expanded" : "",
        ]
            .filter(Boolean)
            .join(" ");
    });

    const childrenRenderContext = $derived.by(() => {
        const frameProps = options.getFrameProps();
        return {
            ...resolvedStateVars,
            motionDefaults: FRAME_MOTION_DEFAULTS,
            interactionState: options.frameState.interactionState,
            currentState: options.frameState.currentState,
            stateVars: resolvedStateVars,
            stateClass: resolvedStateClass,
            stateStyle: resolvedStateStyle,
            breakpoint: options.responsive?.breakpoint ?? "md",
            collapsed: frameProps.collapsed,
            expanded: frameProps.expanded,
            element: options.getElement(),
            loading: options.getEffectiveLoading(),
            active:
                options.frameState.currentState === "Active" ||
                !!frameProps.whileActive,
            disabled:
                options.frameState.currentState === "Disabled" ||
                !!frameProps.whileDisabled,
        };
    });

    return {
        get resolvedStateVars() {
            return resolvedStateVars;
        },
        get resolvedStateClass() {
            return resolvedStateClass;
        },
        get resolvedStateStyle() {
            return resolvedStateStyle;
        },
        get computedClass() {
            return computedClass;
        },
        get childrenRenderContext() {
            return childrenRenderContext;
        },
    };
}
