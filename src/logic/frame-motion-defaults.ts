/* SnowUI source notice | LICENSE 2.1.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
/**
 * frame-motion-defaults.ts
 * v1.8.0
 * Frame 默认动效统一管理：
 * - 默认动效按关键字自动生效（无总开关）
 * - 显式 while* 对象完整声明视觉通道，仅继承默认时序 / 动力学参数
 * - 默认动效资源由 src/motion/*.ts 独立文件提供
 * - 根据 stateStyle 的属性变化自动匹配默认动效（opacity/size/move/rotate/flip）
 * - 支持 Idle 自动链路触发默认注入（Idle -> Active / Idle -> Disabled）
 * - 形态变化识别扩展到更多布局尺寸属性；旋转/位移支持非 transform 写法
 * - 未命中精确规则时，任意样式差异兜底为 morph，避免“无动效直接跳变”
 * - morph 自动按 Idle/Target 尺寸比推导 scale 起点，保障组件尺寸跳变场景也平滑
 * - 修复 calc(var(...)) 样式差异误判：避免仅比较到 var 名字里的数字导致 morph 未触发
 * - 释放 whileLoad 关键字：loading 成为加载状态入口，whileLoad 仅保留为加载态动效配置
 */

import type { CoreState, FrameProps } from "./frame-types";
import {
    mergeWhileMotionConfig,
    type MotionConfig,
} from "./motion-config";
import { REPLACE_IN_MOTION, REPLACE_OUT_MOTION } from "../motion/replace";
import { EXPAND_IN_MOTION, EXPAND_OUT_MOTION } from "../motion/expand";
import { FADE_OUT_MOTION } from "../motion/fade-out";
import { MORPH_MOTION } from "../motion/morph";
import { CONTENT_CROSSFADE_IN_MOTION, CONTENT_CROSSFADE_OUT_MOTION } from "../motion/content-crossfade";
import {
    MOVE_DOWN_MOTION,
    MOVE_LEFT_MOTION,
    MOVE_MOTION,
    MOVE_RIGHT_MOTION,
    SLIDE_FROM_BOTTOM_MOTION,
    SLIDE_FROM_TOP_MOTION,
    SLIDE_STACK_MOTION,
    SLIDE_TO_BOTTOM_MOTION,
    SLIDE_TO_TOP_MOTION,
} from "../motion/move";
import { NUMBER_MOTION, NUMBER_MOTION_COMPONENT } from "../motion/number";
import { FLIP_MOTION, ROTATE_CLOCKWISE_MOTION } from "../motion/rotate";
import { WHILE_2XL_DEFAULT_MOTION } from "../motion/while-2xl";
import { WHILE_ACTIVE_DEFAULT_MOTION } from "../motion/while-active";
import { WHILE_APPEAR_DEFAULT_MOTION } from "../motion/while-appear";
import { WHILE_CLICK_DEFAULT_MOTION } from "../motion/while-click";
import { WHILE_COLLAPSED_DEFAULT_MOTION } from "../motion/while-collapsed";
import { WHILE_DISABLED_DEFAULT_MOTION } from "../motion/while-disabled";
import { WHILE_DISAPPEAR_DEFAULT_MOTION } from "../motion/while-disappear";
import { WHILE_DRAG_DEFAULT_MOTION } from "../motion/while-drag";
import { WHILE_EDITING_DEFAULT_MOTION } from "../motion/while-editing";
import { WHILE_EXPANDED_DEFAULT_MOTION } from "../motion/while-expanded";
import { WHILE_FOCUS_DEFAULT_MOTION } from "../motion/while-focus";
import { WHILE_HOVER_DEFAULT_MOTION } from "../motion/while-hover";
import { WHILE_IDLE_DEFAULT_MOTION } from "../motion/while-idle";
import { WHILE_KEY_DEFAULT_MOTION } from "../motion/while-key";
import { WHILE_LG_DEFAULT_MOTION } from "../motion/while-lg";
import { WHILE_LOAD_DEFAULT_MOTION } from "../motion/while-load";
import { WHILE_MD_DEFAULT_MOTION } from "../motion/while-md";
import { WHILE_RELOAD_DEFAULT_MOTION } from "../motion/while-reload";
import { WHILE_SCROLL_DEFAULT_MOTION } from "../motion/while-scroll";
import { WHILE_SM_DEFAULT_MOTION } from "../motion/while-sm";
import { WHILE_UPLOADING_DEFAULT_MOTION } from "../motion/while-uploading";
import { WHILE_VALIDATING_DEFAULT_MOTION } from "../motion/while-validating";
import { WHILE_XL_DEFAULT_MOTION } from "../motion/while-xl";
import { WHILE_XS_DEFAULT_MOTION } from "../motion/while-xs";

export type FrameWhileMotionKey =
    | "whileLoad"
    | "whileReload"
    | "whileAppear"
    | "whileDisappear"
    | "whileIdle"
    | "whileActive"
    | "whileDisabled"
    | "whileClick"
    | "whileDrag"
    | "whileHover"
    | "whileFocus"
    | "whileKey"
    | "whileScroll"
    | "whileValidating"
    | "whileUploading"
    | "whileEditing"
    | "whileCollapsed"
    | "whileExpanded"
    | "whileXs"
    | "whileSm"
    | "whileMd"
    | "whileLg"
    | "whileXl"
    | "while2xl";

export interface FrameMotionDefaultsRegistry {
    replaceIn: MotionConfig;
    replaceOut: MotionConfig;
    expandIn: MotionConfig;
    expandOut: MotionConfig;
    disappear: MotionConfig;
    morph: MotionConfig;
    move: MotionConfig;
    moveRight: MotionConfig;
    moveLeft: MotionConfig;
    moveDown: MotionConfig;
    slideFromTop: MotionConfig;
    slideFromBottom: MotionConfig;
    slideToTop: MotionConfig;
    slideToBottom: MotionConfig;
    slideStack: MotionConfig;
    rotateClockwise: MotionConfig;
    flip: MotionConfig;
    number: MotionConfig;
    numberComponent: any;
    contentCrossfadeOut: MotionConfig;
    contentCrossfadeIn: MotionConfig;
}

export const FRAME_MOTION_DEFAULTS: FrameMotionDefaultsRegistry = {
    replaceIn: REPLACE_IN_MOTION,
    replaceOut: REPLACE_OUT_MOTION,
    expandIn: EXPAND_IN_MOTION,
    expandOut: EXPAND_OUT_MOTION,
    disappear: FADE_OUT_MOTION,
    morph: MORPH_MOTION,
    move: MOVE_MOTION,
    moveRight: MOVE_RIGHT_MOTION,
    moveLeft: MOVE_LEFT_MOTION,
    moveDown: MOVE_DOWN_MOTION,
    slideFromTop: SLIDE_FROM_TOP_MOTION,
    slideFromBottom: SLIDE_FROM_BOTTOM_MOTION,
    slideToTop: SLIDE_TO_TOP_MOTION,
    slideToBottom: SLIDE_TO_BOTTOM_MOTION,
    slideStack: SLIDE_STACK_MOTION,
    rotateClockwise: ROTATE_CLOCKWISE_MOTION,
    flip: FLIP_MOTION,
    number: NUMBER_MOTION,
    numberComponent: NUMBER_MOTION_COMPONENT,
    contentCrossfadeOut: CONTENT_CROSSFADE_OUT_MOTION,
    contentCrossfadeIn: CONTENT_CROSSFADE_IN_MOTION,
};

const DEFAULT_WHILE_MOTION_MAP: Record<FrameWhileMotionKey, MotionConfig> = {
    whileLoad: WHILE_LOAD_DEFAULT_MOTION,
    whileReload: WHILE_RELOAD_DEFAULT_MOTION,
    whileAppear: WHILE_APPEAR_DEFAULT_MOTION,
    whileDisappear: WHILE_DISAPPEAR_DEFAULT_MOTION,
    whileIdle: WHILE_IDLE_DEFAULT_MOTION,
    whileActive: WHILE_ACTIVE_DEFAULT_MOTION,
    whileDisabled: WHILE_DISABLED_DEFAULT_MOTION,
    whileClick: WHILE_CLICK_DEFAULT_MOTION,
    whileDrag: WHILE_DRAG_DEFAULT_MOTION,
    whileHover: WHILE_HOVER_DEFAULT_MOTION,
    whileFocus: WHILE_FOCUS_DEFAULT_MOTION,
    whileKey: WHILE_KEY_DEFAULT_MOTION,
    whileScroll: WHILE_SCROLL_DEFAULT_MOTION,
    whileValidating: WHILE_VALIDATING_DEFAULT_MOTION,
    whileUploading: WHILE_UPLOADING_DEFAULT_MOTION,
    whileEditing: WHILE_EDITING_DEFAULT_MOTION,
    whileCollapsed: WHILE_COLLAPSED_DEFAULT_MOTION,
    whileExpanded: WHILE_EXPANDED_DEFAULT_MOTION,
    whileXs: WHILE_XS_DEFAULT_MOTION,
    whileSm: WHILE_SM_DEFAULT_MOTION,
    whileMd: WHILE_MD_DEFAULT_MOTION,
    whileLg: WHILE_LG_DEFAULT_MOTION,
    whileXl: WHILE_XL_DEFAULT_MOTION,
    while2xl: WHILE_2XL_DEFAULT_MOTION,
};

const EVENT_TRIGGER_KEYS = ["Click", "Hover", "Focus", "Drag", "Scroll"] as const;

function isPlainObject(value: unknown): value is Record<string, any> {
    return !!value && typeof value === "object" && !Array.isArray(value);
}

type NormalizedStyleMap = Record<string, string>;

function toKebabCase(key: string): string {
    return key.replace(/([A-Z])/g, "-$1").toLowerCase();
}

function parseStyleString(style: string): NormalizedStyleMap {
    const out: NormalizedStyleMap = {};
    for (const part of style.split(";")) {
        const idx = part.indexOf(":");
        if (idx < 0) continue;
        const rawKey = part.slice(0, idx).trim();
        const rawValue = part.slice(idx + 1).trim();
        if (!rawKey || !rawValue) continue;
        out[toKebabCase(rawKey)] = rawValue;
    }
    return out;
}

function normalizeStateStyleValue(
    value: string | Record<string, string | number> | undefined,
): NormalizedStyleMap {
    if (!value) return {};
    if (typeof value === "string") return parseStyleString(value);
    if (!isPlainObject(value)) return {};

    const out: NormalizedStyleMap = {};
    for (const [key, val] of Object.entries(value)) {
        if (val === undefined || val === null || val === "") continue;
        out[toKebabCase(key)] = String(val).trim();
    }
    return out;
}

function parseNumericValue(value: string | undefined): number | undefined {
    if (!value) return undefined;
    const raw = value.trim().toLowerCase();
    // calc()/var() 表达式不能直接用“首个数字”比较，否则会误命中变量名里的数字（如 --size-4）
    if (raw.includes("calc(") || raw.includes("var(")) return undefined;
    const m = value.match(/-?\d+(\.\d+)?/);
    if (!m) return undefined;
    return Number.parseFloat(m[0]);
}

function hasStyleChanged(fromValue: string | undefined, toValue: string | undefined): boolean {
    if (fromValue === undefined && toValue === undefined) return false;
    if (fromValue === undefined || toValue === undefined) return true;

    const fromNum = parseNumericValue(fromValue);
    const toNum = parseNumericValue(toValue);
    if (fromNum !== undefined && toNum !== undefined) {
        return Math.abs(fromNum - toNum) > 1e-4;
    }
    return fromValue.trim() !== toValue.trim();
}

interface TransformSnapshot {
    translateX?: number;
    translateY?: number;
    rotate?: number;
    rotateY?: number;
}

const MORPH_STYLE_KEYS = [
    "width",
    "height",
    "inline-size",
    "block-size",
    "flex-basis",
    "min-width",
    "min-height",
    "max-width",
    "max-height",
    "padding",
    "padding-left",
    "padding-right",
    "padding-top",
    "padding-bottom",
    "margin",
    "margin-left",
    "margin-right",
    "margin-top",
    "margin-bottom",
    "gap",
    "column-gap",
    "row-gap",
    "border-radius",
] as const;

const CUSTOM_MORPH_KEY_RE =
    /^--.*(?:size|width|height|padding|margin|gap|radius)/i;

function isDimensionLikeKey(key: string): boolean {
    return (
        MORPH_STYLE_KEYS.includes(key as (typeof MORPH_STYLE_KEYS)[number]) ||
        CUSTOM_MORPH_KEY_RE.test(key)
    );
}

function extractScalarFromStyleValue(value: string | undefined): number | undefined {
    if (!value) return undefined;
    const raw = value.trim().toLowerCase();
    if (!raw) return undefined;

    const direct = parseNumericValue(raw);
    if (direct !== undefined && !raw.includes("calc(") && !raw.includes("var(")) {
        return Math.abs(direct);
    }

    // calc()/var() 场景：将 var() 替换为 1，计算表达式的相对量级
    let expr = raw;
    if (expr.startsWith("calc(") && expr.endsWith(")")) {
        expr = expr.slice(5, -1);
    }
    expr = expr.replace(/var\([^)]+\)/g, "1");
    expr = expr.replace(/(-?\d+(?:\.\d+)?)([a-z%]+)/gi, "$1");

    if (!/^[0-9+\-*/().\s]+$/.test(expr)) {
        return direct !== undefined ? Math.abs(direct) : undefined;
    }

    try {
        const result = Function(`"use strict"; return (${expr});`)();
        if (typeof result === "number" && Number.isFinite(result)) {
            return Math.abs(result);
        }
    } catch {
        // fallback below
    }

    return direct !== undefined ? Math.abs(direct) : undefined;
}

function inferMorphRatio(
    idleStyle: NormalizedStyleMap,
    targetStyle: NormalizedStyleMap,
): number | undefined {
    const allKeys = new Set([
        ...Object.keys(idleStyle),
        ...Object.keys(targetStyle),
    ]);

    const ratios: number[] = [];

    for (const key of allKeys) {
        if (!isDimensionLikeKey(key)) continue;
        if (!hasStyleChanged(idleStyle[key], targetStyle[key])) continue;

        const from = extractScalarFromStyleValue(idleStyle[key]);
        const to = extractScalarFromStyleValue(targetStyle[key]);
        if (
            from === undefined ||
            to === undefined ||
            from <= 1e-4 ||
            to <= 1e-4
        ) {
            continue;
        }

        const ratio = to / from;
        if (Number.isFinite(ratio) && ratio > 0) {
            ratios.push(ratio);
        }
    }

    if (!ratios.length) return undefined;

    return ratios.reduce((prev, curr) =>
        Math.abs(Math.log(curr)) > Math.abs(Math.log(prev)) ? curr : prev,
    );
}

function buildMorphMotion(
    idleStyle: NormalizedStyleMap,
    targetStyle: NormalizedStyleMap,
): MotionConfig {
    const ratio = inferMorphRatio(idleStyle, targetStyle);
    if (ratio === undefined || Math.abs(ratio - 1) < 1e-3) {
        return { ...MORPH_MOTION };
    }

    const clampedRatio = Math.min(4, Math.max(0.25, ratio));
    const fromScale = Math.min(4, Math.max(0.25, 1 / clampedRatio));

    return {
        ...MORPH_MOTION,
        scale: [fromScale, 1],
    };
}

function hasCustomMorphKeyChanged(
    idleStyle: NormalizedStyleMap,
    targetStyle: NormalizedStyleMap,
): boolean {
    const allKeys = new Set([
        ...Object.keys(idleStyle),
        ...Object.keys(targetStyle),
    ]);

    return Array.from(allKeys).some(
        (key) =>
            CUSTOM_MORPH_KEY_RE.test(key) &&
            hasStyleChanged(idleStyle[key], targetStyle[key]),
    );
}

function parseFromTransform(transformValue: string | undefined): TransformSnapshot {
    if (!transformValue) return {};
    const capture = (re: RegExp) => {
        const match = transformValue.match(re);
        return match ? Number.parseFloat(match[1]) : undefined;
    };
    return {
        translateX: capture(/translateX\(\s*(-?\d+(?:\.\d+)?)/i),
        translateY: capture(/translateY\(\s*(-?\d+(?:\.\d+)?)/i),
        rotateY: capture(/rotateY\(\s*(-?\d+(?:\.\d+)?)deg/i),
        rotate: capture(/rotate\(\s*(-?\d+(?:\.\d+)?)deg/i),
    };
}

function parseTransformSnapshot(style: NormalizedStyleMap): TransformSnapshot {
    const transform = parseFromTransform(style.transform);

    const fromTranslateX =
        parseNumericValue(style["translate-x"]) ??
        parseNumericValue(style.translateX) ??
        parseNumericValue(style.x);
    const fromTranslateY =
        parseNumericValue(style["translate-y"]) ??
        parseNumericValue(style.translateY) ??
        parseNumericValue(style.y);
    const fromRotate =
        parseNumericValue(style.rotate) ?? parseNumericValue(style["rotate-z"]);
    const fromRotateY =
        parseNumericValue(style["rotate-y"]) ?? parseNumericValue(style.rotateY);

    return {
        translateX: fromTranslateX ?? transform.translateX,
        translateY: fromTranslateY ?? transform.translateY,
        rotate: fromRotate ?? transform.rotate,
        rotateY: fromRotateY ?? transform.rotateY,
    };
}

function hasAnyStyleChanged(
    idleStyle: NormalizedStyleMap,
    targetStyle: NormalizedStyleMap,
    keys: readonly string[],
): boolean {
    return keys.some((key) => hasStyleChanged(idleStyle[key], targetStyle[key]));
}

function inferMotionFromStateStyle(
    props: FrameProps,
    targetState: CoreState,
): MotionConfig | undefined {
    if (!props.stateStyle || !isPlainObject(props.stateStyle)) return undefined;

    const idleRaw = props.stateStyle.Idle;
    const targetRaw = props.stateStyle[targetState];
    if (!targetRaw) return undefined;

    const idleStyle = normalizeStateStyleValue(
        idleRaw as string | Record<string, string | number> | undefined,
    );
    const targetStyle = normalizeStateStyleValue(
        targetRaw as string | Record<string, string | number> | undefined,
    );

    // 规则 2：透明度变化 -> 出现/消失
    if (hasStyleChanged(idleStyle.opacity, targetStyle.opacity)) {
        const idleOpacity = parseNumericValue(idleStyle.opacity) ?? 1;
        const targetOpacity = parseNumericValue(targetStyle.opacity) ?? 1;
        return targetOpacity >= idleOpacity ? REPLACE_IN_MOTION : REPLACE_OUT_MOTION;
    }

    // 规则 4：宽高变化 -> 形态变化（morph）
    if (
        hasAnyStyleChanged(idleStyle, targetStyle, MORPH_STYLE_KEYS) ||
        hasCustomMorphKeyChanged(idleStyle, targetStyle)
    ) {
        return buildMorphMotion(idleStyle, targetStyle);
    }

    const idleTransform = parseTransformSnapshot(idleStyle);
    const targetTransform = parseTransformSnapshot(targetStyle);

    // 规则 5：位移变化 -> 移动
    const dx = (targetTransform.translateX ?? 0) - (idleTransform.translateX ?? 0);
    const dy = (targetTransform.translateY ?? 0) - (idleTransform.translateY ?? 0);
    if (Math.abs(dx) > 1e-4 || Math.abs(dy) > 1e-4) {
        if (Math.abs(dx) >= Math.abs(dy)) {
            if (dx > 0) return MOVE_RIGHT_MOTION;
            if (dx < 0) return MOVE_LEFT_MOTION;
            return MOVE_MOTION;
        }
        if (dy > 0) return MOVE_DOWN_MOTION;
        return MOVE_MOTION;
    }

    // 规则 6：旋转变化 -> 顺时针旋转
    if (
        Math.abs((targetTransform.rotate ?? 0) - (idleTransform.rotate ?? 0)) > 1e-4
    ) {
        return ROTATE_CLOCKWISE_MOTION;
    }

    // 规则 7：翻转变化 -> Flip
    if (
        Math.abs((targetTransform.rotateY ?? 0) - (idleTransform.rotateY ?? 0)) > 1e-4
    ) {
        return FLIP_MOTION;
    }

    // 兜底规则：只要存在任意样式差异，默认按 morph 处理，避免样式直接跳变
    const allKeys = new Set([
        ...Object.keys(idleStyle),
        ...Object.keys(targetStyle),
    ]);
    if (
        Array.from(allKeys).some((key) =>
            hasStyleChanged(idleStyle[key], targetStyle[key]),
        )
    ) {
        return buildMorphMotion(idleStyle, targetStyle);
    }

    return undefined;
}

function getDefaultMotionConfig(
    props: FrameProps,
    key: FrameWhileMotionKey,
): MotionConfig | undefined {
    if (!shouldEnableDefaultForKey(props, key)) return undefined;

    if (key === "whileActive") {
        // Active 默认动效按 stateStyle 的差异自动匹配（只在命中规则时生效）
        return inferMotionFromStateStyle(props, "Active");
    }

    return DEFAULT_WHILE_MOTION_MAP[key];
}

function transitionTargetsState(value: any, target: CoreState): boolean {
    if (!value) return false;
    if (typeof value === "string") return value === target;
    if (Array.isArray(value)) return value[0] === target;
    if (typeof value === "function") return false;

    if (isPlainObject(value)) {
        if ("next" in value && typeof value.next === "string") {
            return value.next === target;
        }
        // 支持状态映射写法（如 Click={{ Idle: "Load", Active: "Idle" }}）
        return Object.values(value).some((item) => transitionTargetsState(item, target));
    }

    return false;
}

function eventTargetsState(value: any, target: CoreState): boolean {
    if (!value) return false;
    if (typeof value === "string") return value === target;
    if (typeof value === "function") return false;
    if (Array.isArray(value)) return transitionTargetsState(value, target);

    if (isPlainObject(value)) {
        if ("state" in value && typeof value.state === "string") {
            return value.state === target;
        }
        if ("next" in value && typeof value.next === "string") {
            return value.next === target;
        }
        if ("target" in value || "run" in value) {
            return false;
        }
        return Object.values(value).some((item) => transitionTargetsState(item, target));
    }

    return false;
}

function anyEventTargetsState(props: FrameProps, target: CoreState): boolean {
    if (eventTargetsState(props.Key, target)) return true;
    return EVENT_TRIGGER_KEYS.some((key) =>
        eventTargetsState((props as Record<string, any>)[key], target),
    );
}

function shouldEnableDefaultForKey(
    props: FrameProps,
    key: FrameWhileMotionKey,
): boolean {
    switch (key) {
        case "whileClick":
            return props.Click !== undefined || props.whileClick !== undefined;
        case "whileHover":
            return props.Hover !== undefined || props.whileHover !== undefined;
        case "whileFocus":
            return props.Focus !== undefined || props.whileFocus !== undefined;
        case "whileDrag":
            return props.Drag !== undefined || props.whileDrag !== undefined;
        case "whileKey":
            return props.Key !== undefined || props.whileKey !== undefined;
        case "whileScroll":
            return (
                props.Scroll !== undefined ||
                props.scroll !== undefined ||
                props.whileScroll !== undefined
            );
        case "whileLoad":
            return (
                props.loading !== undefined ||
                props.StartLoad !== undefined ||
                props.Load !== undefined ||
                anyEventTargetsState(props, "Load") ||
                props.whileLoad !== undefined
            );
        case "whileReload":
            return (
                props.Reload !== undefined ||
                props.onReload !== undefined ||
                anyEventTargetsState(props, "Reload") ||
                props.whileReload !== undefined
            );
        case "whileActive":
            return (
                props.Active !== undefined ||
                transitionTargetsState(props.Idle, "Active") ||
                anyEventTargetsState(props, "Active") ||
                props.whileActive !== undefined
            );
        case "whileDisabled":
            return (
                props.Disabled !== undefined ||
                transitionTargetsState(props.Idle, "Disabled") ||
                anyEventTargetsState(props, "Disabled") ||
                props.whileDisabled !== undefined
            );
        case "whileAppear":
            return props.Appear !== undefined || props.whileAppear !== undefined;
        case "whileDisappear":
            return props.Disappear !== undefined || props.whileDisappear !== undefined;
        case "whileIdle":
            return props.Idle !== undefined || props.whileIdle !== undefined;
        case "whileValidating":
            return (
                props.Validating !== undefined ||
                anyEventTargetsState(props, "Validating") ||
                props.whileValidating !== undefined
            );
        case "whileUploading":
            return (
                props.Uploading !== undefined ||
                anyEventTargetsState(props, "Uploading") ||
                props.whileUploading !== undefined
            );
        case "whileEditing":
            return (
                props.Editing !== undefined ||
                anyEventTargetsState(props, "Editing") ||
                props.whileEditing !== undefined
            );
        case "whileCollapsed":
            return props.collapsed !== undefined || props.whileCollapsed !== undefined;
        case "whileExpanded":
            return props.expanded !== undefined || props.whileExpanded !== undefined;
        case "whileXs":
            return props.xs !== undefined || props.whileXs !== undefined;
        case "whileSm":
            return props.sm !== undefined || props.whileSm !== undefined;
        case "whileMd":
            return props.md !== undefined || props.whileMd !== undefined;
        case "whileLg":
            return props.lg !== undefined || props.whileLg !== undefined;
        case "whileXl":
            return props.xl !== undefined || props.whileXl !== undefined;
        case "while2xl":
            return props["2xl"] !== undefined || props.while2xl !== undefined;
        default:
            return false;
    }
}

/** while* key 到 alias prop 的映射（大写别名是 Frame 对外的简写 API） */
const WHILE_KEY_ALIAS_MAP: Partial<Record<FrameWhileMotionKey, string>> = {
    whileHover: "Hover",
    whileClick: "Click",
    whileFocus: "Focus",
    whileDrag: "Drag",
    whileKey: "Key",
    whileScroll: "Scroll",
    whileLoad: "Load",
    whileReload: "Reload",
    whileActive: "Active",
    whileDisabled: "Disabled",
    whileAppear: "Appear",
    whileDisappear: "Disappear",
    whileIdle: "Idle",
};

export function resolveFrameWhileMotionConfig(
    props: FrameProps,
    key: FrameWhileMotionKey,
): MotionConfig | undefined {
    // 同时读取 while* 主键和对应的大写别名（如 props.Hover / props.whileHover）
    const aliasKey = WHILE_KEY_ALIAS_MAP[key];
    const userValue = (props[key] ?? (aliasKey ? (props as Record<string, any>)[aliasKey] : undefined)) as MotionConfig | boolean | undefined;
    // enableDefaultMotion 为 false 时，跳过系统默认动效注入
    const enableDefault = props.enableDefaultMotion !== false;
    const defaultConfig = enableDefault ? getDefaultMotionConfig(props, key) : undefined;
    return mergeWhileMotionConfig(defaultConfig, userValue);
}


export function resolveFrameWhileMotionConfigs(
    props: FrameProps,
): Record<FrameWhileMotionKey, MotionConfig | undefined> {
    return {
        whileLoad: resolveFrameWhileMotionConfig(props, "whileLoad"),
        whileReload: resolveFrameWhileMotionConfig(props, "whileReload"),
        whileAppear: resolveFrameWhileMotionConfig(props, "whileAppear"),
        whileDisappear: resolveFrameWhileMotionConfig(props, "whileDisappear"),
        whileIdle: resolveFrameWhileMotionConfig(props, "whileIdle"),
        whileActive: resolveFrameWhileMotionConfig(props, "whileActive"),
        whileDisabled: resolveFrameWhileMotionConfig(props, "whileDisabled"),
        whileClick: resolveFrameWhileMotionConfig(props, "whileClick"),
        whileDrag: resolveFrameWhileMotionConfig(props, "whileDrag"),
        whileHover: resolveFrameWhileMotionConfig(props, "whileHover"),
        whileFocus: resolveFrameWhileMotionConfig(props, "whileFocus"),
        whileKey: resolveFrameWhileMotionConfig(props, "whileKey"),
        whileScroll: resolveFrameWhileMotionConfig(props, "whileScroll"),
        whileValidating: resolveFrameWhileMotionConfig(props, "whileValidating"),
        whileUploading: resolveFrameWhileMotionConfig(props, "whileUploading"),
        whileEditing: resolveFrameWhileMotionConfig(props, "whileEditing"),
        whileCollapsed: resolveFrameWhileMotionConfig(props, "whileCollapsed"),
        whileExpanded: resolveFrameWhileMotionConfig(props, "whileExpanded"),
        whileXs: resolveFrameWhileMotionConfig(props, "whileXs"),
        whileSm: resolveFrameWhileMotionConfig(props, "whileSm"),
        whileMd: resolveFrameWhileMotionConfig(props, "whileMd"),
        whileLg: resolveFrameWhileMotionConfig(props, "whileLg"),
        whileXl: resolveFrameWhileMotionConfig(props, "whileXl"),
        while2xl: resolveFrameWhileMotionConfig(props, "while2xl"),
    };
}
