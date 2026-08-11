/**
 * frame-inline-style.svelte.ts
 * v1.0.1
 * 职责：统一拼装 Frame 根节点的 computedStyle。
 *
 * Log:
 * - [2026-03-09] Init: 从 Frame.svelte 抽离 while* 内联样式、时序桥接、Scale style vars、Orchestration 暴露变量与最终 computedStyle 拼装链。
 * - [2026-03-24] Perf: 将 control / border / appear bridge 与 transform-origin 收敛为按需输出，避免无动效组件默认携带冗余内联 style。
 */

import type { CoreState, FrameProps } from "./frame-types";
import type { FrameState } from "./frame-state.svelte";
import type { FrameMotion } from "./frame-motion.svelte";
import { motionConfigToStyle } from "./frame-utils";
import {
    FRAME_MOTION_DEFAULTS,
    resolveFrameWhileMotionConfigs,
} from "./frame-motion-defaults";
import { resolveScaleStyleVars } from "./frame-scale-resolver.svelte";
import {
    FRAME_APPEAR_MOTION_BRIDGE,
    FRAME_BORDER_MOTION_BRIDGE,
    FRAME_COLOR_MOTION_BRIDGE,
    FRAME_CONTROL_MOTION_BRIDGE,
    FRAME_SIZE_MOTION_BRIDGE,
    createLoopMotionBridgeStyle,
    createLoopMotionPresetStyle,
    createMotionTimingBridgeStyle,
    resolveMotionTiming,
} from "../motion/bridge";

interface FrameStateLike
    extends Pick<
        FrameState,
        | "hovered"
        | "pressed"
        | "focused"
        | "isDragging"
        | "isKeyActive"
        | "isScrolling"
        | "currentState"
    > {}

interface FrameMotionLike extends Pick<FrameMotion, "shouldRegister"> {}

export interface FrameInlineStyleRuntimeOptions {
    getFrameProps: () => FrameProps;
    frameState: FrameStateLike;
    motion: FrameMotionLike;
    getIdentityId: () => string | undefined;
    getEffectiveLoading: () => boolean;
    getShouldRenderSkeleton: () => boolean;
    getResolvedStateStyle: () => string;
    getOrchestratedStyle: () => string;
}

function isNonArrayObject(value: unknown): value is Record<string, unknown> {
    return !!value && typeof value === "object" && !Array.isArray(value);
}

function hasOwnEntries(value: unknown): value is Record<string, unknown> {
    return isNonArrayObject(value) && Object.keys(value).length > 0;
}

function toKebabCase(value: string): string {
    return value.replace(/([A-Z])/g, "-$1").toLowerCase();
}

function getAutoNextState(config: unknown): CoreState | undefined {
    if (Array.isArray(config)) {
        if (config[1] === "auto" && typeof config[0] === "string") {
            return config[0] as CoreState;
        }
        return undefined;
    }

    if (config && typeof config === "object" && !Array.isArray(config)) {
        const objectConfig = config as Record<string, unknown>;
        if (objectConfig.auto && typeof objectConfig.next === "string") {
            return objectConfig.next as CoreState;
        }
    }

    return undefined;
}

function buildExposedVariables(
    identityId: string | undefined,
    frameProps: FrameProps,
): string {
    if (!identityId) return "";

    const keys = [
        "width",
        "height",
        "minWidth",
        "minHeight",
        "size",
        "padding",
        "gap",
        "radius",
        "fontSize",
        "border",
        "innerBorder",
        "opacity",
    ] as const;

    let style = "";

    for (const key of keys) {
        const value = frameProps[key];
        if (value === undefined || value === null) continue;

        const kebabKey = toKebabCase(key);

        if (typeof value === "number") {
            const prefixMap: Record<string, string> = {
                fontSize: "text",
                radius: "radius",
                padding: "padding",
                gap: "gap",
                border: "border",
                innerBorder: "border",
            };
            const sizeProps = [
                "width",
                "height",
                "minWidth",
                "minHeight",
                "size",
            ];
            const isSize = sizeProps.includes(key);
            const prefix = isSize ? "size" : prefixMap[key] || key;

            if (prefix === "text") {
                const textTokenMap: Record<number, string> = {
                    1: "--text-12",
                    2: "--text-14",
                    3: "--text-16",
                    4: "--text-18",
                    5: "--text-24",
                    6: "--text-32",
                    7: "--text-48",
                    8: "--text-64",
                };
                const leadingTokenMap: Record<number, string> = {
                    1: "--leading-12",
                    2: "--leading-14",
                    3: "--leading-16",
                    4: "--leading-18",
                    5: "--leading-24",
                    6: "--leading-32",
                    7: "--leading-48",
                    8: "--leading-64",
                };
                const textToken = textTokenMap[value] ?? "--text-16";
                const leadingToken = leadingTokenMap[value] ?? "--leading-16";
                style += `--${identityId}-${kebabKey}: var(${textToken});`;
                style += `--${identityId}-line-height: var(${leadingToken});`;
                continue;
            }

            if (prefix === "gap") {
                style += `--${identityId}-${kebabKey}: var(--gap-${value}, calc(4px * ${value} * var(--gap-scale, 1)));`;
                continue;
            }

            if (
                ["size", "padding", "radius", "border"].includes(prefix)
            ) {
                style += `--${identityId}-${kebabKey}: calc(var(--${prefix}) * ${value});`;
                continue;
            }
        }

        style += `--${identityId}-${kebabKey}: ${value};`;
    }

    return style;
}

function toJsonCssVariable(name: string, value: unknown): string {
    return hasOwnEntries(value) ? `${name}: ${JSON.stringify(value)}` : "";
}

function hasNonEmptyMotionConfig(config: unknown): config is Record<string, unknown> {
    return isNonArrayObject(config) && Object.keys(config).length > 0;
}

function stringIncludesAny(value: string | undefined, patterns: string[]) {
    if (!value) return false;
    return patterns.some((pattern) => value.includes(pattern));
}

function toCssLength(value: number | string | undefined): string {
    if (value === undefined) return "";
    return typeof value === "number" ? `${value}px` : value;
}

function buildPinOffsetStyle(frameProps: FrameProps): string {
    return [
        frameProps.pinOffset !== undefined
            ? `--pin-offset: ${toCssLength(frameProps.pinOffset)}`
            : "",
        frameProps.pinOffsetX !== undefined
            ? `--pin-offset-x: ${toCssLength(frameProps.pinOffsetX)}`
            : "",
        frameProps.pinOffsetY !== undefined
            ? `--pin-offset-y: ${toCssLength(frameProps.pinOffsetY)}`
            : "",
    ]
        .filter(Boolean)
        .join(";");
}

function buildDirectLayoutStyle(frameProps: FrameProps): string {
    const gap = frameProps.gap;
    const styles = [
        gap === undefined || gap === null
            ? ""
            : typeof gap === "number"
              ? `gap: var(--gap-${gap}, calc(4px * ${gap} * var(--gap-scale, 1)))`
              : `gap: ${gap}`,
        frameProps.width === undefined || frameProps.width === null
            ? ""
            : `width: ${typeof frameProps.width === "number" ? `${frameProps.width}px` : frameProps.width}`,
        frameProps.minWidth === undefined || frameProps.minWidth === null
            ? ""
            : `min-width: ${typeof frameProps.minWidth === "number" ? `${frameProps.minWidth}px` : frameProps.minWidth}`,
    ];
    return styles.filter(Boolean).join(";");
}

export function createFrameInlineStyleRuntime(
    options: FrameInlineStyleRuntimeOptions,
) {
    const resolvedWhile = $derived(
        resolveFrameWhileMotionConfigs(options.getFrameProps()),
    );

    const computedStyle = $derived.by(() => {
        const frameProps = options.getFrameProps();
        const effectiveLoading = options.getEffectiveLoading();
        const shouldRenderSkeleton = options.getShouldRenderSkeleton();
        const resolvedStateStyle = options.getResolvedStateStyle();
        const identityId = options.getIdentityId();
        const orchestratedStyle = options.getOrchestratedStyle();
        const frameState = options.frameState;
        const hasMotion = options.motion.shouldRegister;

        const hoverConfig = resolvedWhile.whileHover;
        const clickConfig = resolvedWhile.whileClick;
        const focusConfig = resolvedWhile.whileFocus;
        const dragConfig = resolvedWhile.whileDrag;
        const keyConfig = resolvedWhile.whileKey;
        const scrollConfig = resolvedWhile.whileScroll;

        const loadConfig = resolvedWhile.whileLoad;
        const reloadConfig = resolvedWhile.whileReload;
        const appearConfig = resolvedWhile.whileAppear;
        const disappearConfig = resolvedWhile.whileDisappear;
        const activeConfig = resolvedWhile.whileActive;
        const disabledConfig = resolvedWhile.whileDisabled;
        const validatingConfig = resolvedWhile.whileValidating;
        const uploadingConfig = resolvedWhile.whileUploading;
        const editingConfig = resolvedWhile.whileEditing;
        const idleConfig = resolvedWhile.whileIdle;

        const hoverMotionStyle =
            frameState.hovered && hoverConfig
                ? motionConfigToStyle(hoverConfig)
                : "";
        const clickMotionStyle =
            frameState.pressed && clickConfig
                ? motionConfigToStyle(clickConfig)
                : "";
        const focusMotionStyle =
            frameState.focused && focusConfig
                ? motionConfigToStyle(focusConfig)
                : "";
        const dragMotionStyle =
            frameState.isDragging && dragConfig
                ? motionConfigToStyle(dragConfig)
                : "";
        const keyMotionStyle =
            frameState.isKeyActive && keyConfig
                ? motionConfigToStyle(keyConfig)
                : "";
        const loadMotionStyle =
            effectiveLoading && loadConfig
                ? motionConfigToStyle(loadConfig)
                : "";
        const reloadMotionStyle =
            frameState.currentState === "Reload" && reloadConfig
                ? motionConfigToStyle(reloadConfig)
                : "";
        const appearMotionStyle =
            frameState.currentState === "Appear" && appearConfig
                ? motionConfigToStyle(appearConfig, "snowui-frame-appear-transform-motion")
                : "";
        const disappearMotionStyle =
            frameState.currentState === "Disappear" && disappearConfig
                ? motionConfigToStyle(
                      disappearConfig,
                      "snowui-frame-disappear-transform-motion",
                  )
                : "";
        const activeMotionStyle =
            frameState.currentState === "Active" && activeConfig
                ? motionConfigToStyle(activeConfig)
                : "";
        const disabledMotionStyle =
            frameState.currentState === "Disabled" && disabledConfig
                ? motionConfigToStyle(disabledConfig)
                : "";
        const validatingMotionStyle =
            frameState.currentState === "Validating" && validatingConfig
                ? motionConfigToStyle(validatingConfig)
                : "";
        const uploadingMotionStyle =
            frameState.currentState === "Uploading" && uploadingConfig
                ? motionConfigToStyle(uploadingConfig)
                : "";
        const editingMotionStyle =
            frameState.currentState === "Editing" && editingConfig
                ? motionConfigToStyle(editingConfig)
                : "";
        const idleMotionStyle =
            !effectiveLoading &&
            frameState.currentState === "Idle" &&
            idleConfig
                ? motionConfigToStyle(idleConfig)
                : "";
        const scrollMotionStyle =
            frameState.isScrolling && scrollConfig
                ? motionConfigToStyle(scrollConfig)
                : "";

        const idleAutoTargetState =
            !effectiveLoading && frameState.currentState === "Idle"
                ? getAutoNextState(frameProps.Idle)
                : undefined;

        const controlMotionSource = activeConfig;
        const borderMotionSource = activeConfig;
        const appearMotionSource = resolvedWhile.whileAppear ?? activeConfig;

        const controlMotionTimingStyle = hasNonEmptyMotionConfig(
            controlMotionSource,
        )
            ? createMotionTimingBridgeStyle(
                  FRAME_CONTROL_MOTION_BRIDGE,
                  controlMotionSource,
              )
            : "";
        const borderMotionTimingStyle = hasNonEmptyMotionConfig(
            borderMotionSource,
        )
            ? createMotionTimingBridgeStyle(
                  FRAME_BORDER_MOTION_BRIDGE,
                  borderMotionSource,
              )
            : "";
        const appearMotionTimingStyle = hasNonEmptyMotionConfig(
            appearMotionSource,
        )
            ? createMotionTimingBridgeStyle(
                  FRAME_APPEAR_MOTION_BRIDGE,
                  appearMotionSource,
              )
            : "";
        const colorMotionTimingStyle = hasNonEmptyMotionConfig(hoverConfig)
            ? createMotionTimingBridgeStyle(FRAME_COLOR_MOTION_BRIDGE, hoverConfig)
            : "";
        const sizeMotionTimingStyle = hasNonEmptyMotionConfig(activeConfig)
            ? createMotionTimingBridgeStyle(
                  FRAME_SIZE_MOTION_BRIDGE,
                  activeConfig,
              )
            : "";
        const loopMotionTimingStyle = createLoopMotionBridgeStyle(
            frameProps.loopMotion,
        );
        const loopMotionPresetStyle = createLoopMotionPresetStyle(
            frameProps.loopMotion,
        );

        const stateStyleTransitionFallback = (() => {
            const stateStyle = frameProps.stateStyle;
            if (!stateStyle || typeof stateStyle !== "object") return "";

            const stateStyleMap = stateStyle as Record<string, unknown>;
            let targetState: "Active" | "Disabled" | undefined;

            if (frameState.currentState === "Active") {
                targetState = "Active";
            } else if (frameState.currentState === "Disabled") {
                targetState = "Disabled";
            } else if (
                idleAutoTargetState === "Active" ||
                idleAutoTargetState === "Disabled"
            ) {
                targetState = idleAutoTargetState as "Active" | "Disabled";
            }

            if (!targetState || stateStyleMap[targetState] === undefined) {
                return "";
            }

            const timing = resolveMotionTiming(
                targetState === "Disabled" ? disabledConfig : activeConfig,
                targetState === "Active"
                    ? FRAME_MOTION_DEFAULTS.morph
                    : undefined,
            );

            return `transition: all ${timing.durationCss} ${timing.easing}`;
        })();

        const styleOverrideBridge = frameProps.style?.includes(
            "--snowui-frame-style-override",
        )
            ? "--snowui-frame-style-override-bridge: var(--snowui-frame-style-override, initial)"
            : "";

        const shouldExposeTransformOrigin =
            hasMotion ||
            !!loopMotionPresetStyle ||
            !!controlMotionTimingStyle ||
            !!borderMotionTimingStyle ||
            !!appearMotionTimingStyle ||
            stringIncludesAny(frameProps.style, [
                "transform-origin",
                "--snowui-frame-transform-origin",
                "--su-motion-transform",
                "transform:",
            ]) ||
            stringIncludesAny(resolvedStateStyle, [
                "transform-origin",
                "--snowui-frame-transform-origin",
                "--su-motion-transform",
                "transform:",
            ]) ||
            stringIncludesAny(orchestratedStyle, [
                "transform-origin",
                "--snowui-frame-transform-origin",
                "--su-motion-transform",
                "transform:",
            ]) ||
            [
                idleMotionStyle,
                focusMotionStyle,
                hoverMotionStyle,
                clickMotionStyle,
                dragMotionStyle,
                keyMotionStyle,
                loadMotionStyle,
                reloadMotionStyle,
                appearMotionStyle,
                disappearMotionStyle,
                activeMotionStyle,
                disabledMotionStyle,
                validatingMotionStyle,
                uploadingMotionStyle,
                editingMotionStyle,
                scrollMotionStyle,
            ].some((style) =>
                stringIncludesAny(style, [
                    "--su-motion-transform",
                    "transform:",
                    "transform-origin",
                ]),
            );

        return (
            [
                buildExposedVariables(identityId, frameProps),
                buildDirectLayoutStyle(frameProps),
                buildPinOffsetStyle(frameProps),
                orchestratedStyle,
                hasMotion && (frameProps.delay || 0) > 0
                    ? `--snowui-frame-animation-delay: ${(frameProps.delay || 0) / 1000}s`
                    : "",
                controlMotionTimingStyle,
                borderMotionTimingStyle,
                appearMotionTimingStyle,
                colorMotionTimingStyle,
                sizeMotionTimingStyle,
                loopMotionTimingStyle,
                loopMotionPresetStyle,
                stateStyleTransitionFallback,
                idleMotionStyle,
                focusMotionStyle,
                hoverMotionStyle,
                clickMotionStyle,
                dragMotionStyle,
                keyMotionStyle,
                loadMotionStyle,
                reloadMotionStyle,
                appearMotionStyle,
                disappearMotionStyle,
                activeMotionStyle,
                disabledMotionStyle,
                validatingMotionStyle,
                uploadingMotionStyle,
                editingMotionStyle,
                scrollMotionStyle,
                shouldRenderSkeleton
                    ? "background: transparent; border-color: transparent; box-shadow: none; color: transparent; background-image: none;"
                    : "",
                toJsonCssVariable(
                    "--snowui-frame-while-appear",
                    resolvedWhile.whileAppear,
                ),
                toJsonCssVariable(
                    "--snowui-frame-while-disappear",
                    resolvedWhile.whileDisappear,
                ),
                toJsonCssVariable(
                    "--snowui-frame-while-idle",
                    resolvedWhile.whileIdle,
                ),
                toJsonCssVariable(
                    "--snowui-frame-while-load",
                    resolvedWhile.whileLoad,
                ),
                toJsonCssVariable(
                    "--snowui-frame-while-reload",
                    resolvedWhile.whileReload,
                ),
                toJsonCssVariable(
                    "--snowui-frame-while-hover",
                    hoverConfig,
                ),
                toJsonCssVariable(
                    "--snowui-frame-while-click",
                    clickConfig,
                ),
                toJsonCssVariable(
                    "--snowui-frame-while-drag",
                    resolvedWhile.whileDrag,
                ),
                toJsonCssVariable(
                    "--snowui-frame-while-focus",
                    resolvedWhile.whileFocus,
                ),
                toJsonCssVariable(
                    "--snowui-frame-while-active",
                    resolvedWhile.whileActive,
                ),
                toJsonCssVariable(
                    "--snowui-frame-while-disabled",
                    resolvedWhile.whileDisabled,
                ),
                toJsonCssVariable(
                    "--snowui-frame-while-key",
                    resolvedWhile.whileKey,
                ),
                toJsonCssVariable(
                    "--snowui-frame-while-scroll",
                    scrollConfig,
                ),
                toJsonCssVariable(
                    "--snowui-frame-while-validating",
                    resolvedWhile.whileValidating,
                ),
                toJsonCssVariable(
                    "--snowui-frame-while-uploading",
                    resolvedWhile.whileUploading,
                ),
                toJsonCssVariable(
                    "--snowui-frame-while-editing",
                    resolvedWhile.whileEditing,
                ),
                toJsonCssVariable(
                    "--snowui-frame-while-collapsed",
                    resolvedWhile.whileCollapsed,
                ),
                toJsonCssVariable(
                    "--snowui-frame-while-expanded",
                    resolvedWhile.whileExpanded,
                ),
                toJsonCssVariable("--snowui-frame-while-xs", resolvedWhile.whileXs),
                toJsonCssVariable("--snowui-frame-while-sm", resolvedWhile.whileSm),
                toJsonCssVariable("--snowui-frame-while-md", resolvedWhile.whileMd),
                toJsonCssVariable("--snowui-frame-while-lg", resolvedWhile.whileLg),
                toJsonCssVariable("--snowui-frame-while-xl", resolvedWhile.whileXl),
                toJsonCssVariable(
                    "--snowui-frame-while-2xl",
                    resolvedWhile.while2xl,
                ),
                toJsonCssVariable(
                    "--snowui-frame-variants",
                    frameProps.variants,
                ),
                frameProps.scroll
                    ? `--snowui-frame-scroll: ${JSON.stringify(frameProps.scroll)}`
                    : "",
                frameProps.timeline
                    ? `--snowui-frame-timeline: ${frameProps.timeline}`
                    : "",
                styleOverrideBridge,
                shouldExposeTransformOrigin
                    ? "--snowui-frame-transform-origin-default: 50% 50%"
                    : "",
                shouldExposeTransformOrigin
                    ? "transform-origin: var(--snowui-frame-transform-origin-override, var(--snowui-frame-transform-origin, var(--snowui-frame-transform-origin-default)))"
                    : "",
                ...resolveScaleStyleVars(frameProps),
                frameProps.style,
                resolvedStateStyle,
            ]
                .filter(Boolean)
                .join(";") || undefined
        );
    });

    return {
        get computedStyle() {
            return computedStyle;
        },
    };
}
