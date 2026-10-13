/* SnowUI source notice | LICENSE 2.2.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
/**
 * Frame 属性过滤器
 * - 分离原生事件处理器
 * - 过滤内部关键字，避免透传到 DOM
 * - 为 Input / Textarea 这类“Frame 外壳 + 原生宿主元素”组件提供共享的 props 分发能力
 */

const NATIVE_EVENT_KEYS = [
    "onclick",
    "ondblclick",
    "oncontextmenu",
    "onmouseenter",
    "onmouseleave",
    "onmousemove",
    "onmousedown",
    "onmouseup",
    "onfocus",
    "onblur",
    "onkeydown",
    "onkeyup",
    "onkeypress",
    "ontouchstart",
    "ontouchend",
    "ontouchmove",
    "ontouchcancel",
    "oninput",
    "onchange",
    "onsubmit",
    "onscroll",
] as const;

export const FRAME_INTERNAL_PROP_KEYS = [
    "enableResponsive",
    "enableContext",
    "enableScaleObserver",
    "enableDefaultMotion",
    "enableAutoLayout",
    "componentParts",
    "contentFill",
    "contentHug",
    "pinOffset",
    "pinOffsetX",
    "pinOffsetY",
    "scope",
    "lines",
    "onTruncate",
    "access",
    "responsive",
    "scaleHeightVar",
    "scaleWidthVar",
    "scaleAspectRatioVar",
    "scaleSizeVar",
    "scaleObserverTarget",
    "scaleBasis",
    "scaleMixHeightWeight",
    "scaleAspectBaseRatio",
    "sizeRatio",
    "iconSizeRatio",
    "avatarSizeRatio",
    "loopMotion",
    "loading",
    "disabled",
    "skeleton",
    "renderHints",
    "customStates",
    "stateContent",
    "styles",
    "padding",
    "gap",
    "radius",
    "border",
    "innerBorder",
    "fontSize",
    "minWidth",
    "minHeight",
    "width",
    "height",
    "opacity",
    "size",
    "iconSize",
    "avatarSize",
    "collapsed",
    "expanded",
    "row",
    "firstLine",
    "column",
    "grid",
    "reverse",
    "whileHover",
    "whileClick",
    "whileFocus",
    "whileDrag",
    "whileScroll",
    "whileKey",
    "whileLoad",
    "whileReload",
    "whileActive",
    "whileDisabled",
    "whileAppear",
    "whileDisappear",
    "whileIdle",
    "whileValidating",
    "whileUploading",
    "whileEditing",
    "whileCollapsed",
    "whileExpanded",
    "whileXs",
    "whileSm",
    "whileMd",
    "whileLg",
    "whileXl",
    "while2xl",
    "variants",
    "scroll",
    "timeline",
    "layoutId",
    "itemId",
    "orchestrate",
    "orchestrateMode",
    "orchestrateDelay",
    "orchestrateOrder",
    "orchestrateTrigger",
    "orchestrateTarget",
    "orchestrateGroup",
    "morph",
    "tag",
    "as",
    "element",
    "use",
    "currentState",
    "Click",
    "Hover",
    "Focus",
    "Key",
    "Drag",
    "Scroll",
    "Active",
    "Load",
    "Reload",
    "StartLoad",
    "Appear",
    "Disappear",
    "Idle",
    "Disabled",
    "Validating",
    "Uploading",
    "Editing",
    "onReload",
    "stateVars",
    "stateClass",
    "stateStyle",
] as const;

export const FRAME_INTERNAL_PROP_PATTERNS = [
    /^(StartLoad|Load|Reload|Appear|Disappear|Idle|Active|Disabled|Validating|Uploading|Editing)$/,
    /^(Click|Drag|Hover|Focus|Key|Scroll)$/,
    /^while[A-Z0-9].*$/,
    /^(xs|sm|md|lg|xl|2xl)$/,
    /^onReload$/,
] as const;

export interface FrameEventHandlers {
    [key: string]: any;
}

export interface SplitFrameHostPropsResult {
    frameProps: Record<string, any>;
    hostProps: Record<string, any>;
}

export interface FilteredFrameProps {
    eventHandlers: FrameEventHandlers;
    domProps: Record<string, any>;
    disabled: boolean;
}

function collectCustomStateNames(
    source?: Record<string, any>,
    options?: { customStates?: string[] },
): Set<string> {
    const names = new Set<string>();
    const candidates = [
        ...(Array.isArray(source?.customStates) ? source.customStates : []),
        ...(options?.customStates ?? []),
    ];

    for (const candidate of candidates) {
        if (typeof candidate === "string" && candidate.trim()) {
            names.add(candidate.trim());
        }
    }

    return names;
}

export function isFrameInternalProp(
    key: string,
    options?: {
        customStateNames?: Iterable<string>;
    },
): boolean {
    if (
        (FRAME_INTERNAL_PROP_KEYS as readonly string[]).includes(key) ||
        FRAME_INTERNAL_PROP_PATTERNS.some((pattern) => pattern.test(key))
    ) {
        return true;
    }

    if (options?.customStateNames) {
        for (const stateName of options.customStateNames) {
            if (stateName === key) return true;
        }
    }

    return false;
}

export function splitFrameHostProps(
    source: Record<string, any>,
    options?: {
        customStates?: string[];
    },
): SplitFrameHostPropsResult {
    const frameProps: Record<string, any> = {};
    const hostProps: Record<string, any> = {};
    const customStateNames = collectCustomStateNames(source, options);

    for (const [key, value] of Object.entries(source)) {
        if (isFrameInternalProp(key, { customStateNames })) {
            frameProps[key] = value;
        } else {
            hostProps[key] = value;
        }
    }

    return { frameProps, hostProps };
}

export function filterFrameDomProps(frameProps: any): FilteredFrameProps {
    const eventHandlers: FrameEventHandlers = {};
    for (const key of NATIVE_EVENT_KEYS) {
        eventHandlers[key] = frameProps[key];
    }

    const domProps: Record<string, any> = { ...frameProps };
    for (const key of NATIVE_EVENT_KEYS) {
        delete domProps[key];
    }
    const customStateNames = collectCustomStateNames(frameProps);
    for (const key of Object.keys(domProps)) {
        if (isFrameInternalProp(key, { customStateNames })) {
            delete domProps[key];
        }
    }

    return {
        eventHandlers,
        domProps,
        disabled: !!frameProps.disabled,
    };
}
