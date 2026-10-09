/**
 * Collapse Logic
 * 提供通用的展开/收起动效逻辑。
 */

import { resizeManager } from "./observer.svelte";

// 折叠动效使用本模块的固定时序常量
const MORPH_STYLES = { transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)" };

export type CollapseLines = 0 | 1 | 2 | 3;

export interface CollapseInfo {
    isCollapsed: boolean;
    styles: Record<string, string | null>;
}

export interface CollapseOptions {
    lines?: CollapseLines;
    isExpanded?: boolean;
    onUpdate?: (info: CollapseInfo) => void;
    _trigger?: any; // Used to trigger re-apply
}

export function measureLineHeight(cs: CSSStyleDeclaration) {
    if (typeof document === "undefined" || !document.body) return NaN;
    const probe = document.createElement("span");
    probe.textContent = "Hg";
    probe.style.position = "fixed";
    probe.style.left = "-9999rem";
    probe.style.top = "-9999rem";
    probe.style.visibility = "hidden";
    probe.style.whiteSpace = "nowrap";
    probe.style.padding = "0";
    probe.style.border = "0";
    probe.style.margin = "0";
    probe.style.fontFamily = cs.fontFamily;
    probe.style.fontSize = cs.fontSize;
    probe.style.fontWeight = cs.fontWeight;
    probe.style.fontStyle = cs.fontStyle;
    probe.style.letterSpacing = cs.letterSpacing;
    probe.style.lineHeight = cs.lineHeight;
    document.body.appendChild(probe);
    const h = probe.getBoundingClientRect().height;
    probe.remove();
    return h;
}

export function findConstraintHost(
    el: HTMLElement,
    ignoreHeightValue: string | null = null,
) {
    const hasHeightUtilityClass = (node: HTMLElement) => {
        const cls =
            typeof node.className === "string" ? node.className : "";
        return /\b(?:h|max-h|min-h)-(?:\d+|full|screen|fill|hug|\d+p)\b/.test(cls) ||
            /\bsize-\d+\b/.test(cls);
    };

    const hasExplicitHeightConstraint = (value: string) => {
        const v = (value || "").trim();
        return (
            v !== "" &&
            v !== "auto" &&
            v !== "none" &&
            v !== "0" &&
            v !== "0px"
        );
    };

    const isIgnoredByValue = (
        node: HTMLElement,
        computedHeight: string,
        computedMaxHeight: string,
    ) => {
        if (!ignoreHeightValue) return false;
        const inlineHeight = (node.style.height || "").trim();
        const inlineMaxHeight = (node.style.maxHeight || "").trim();
        return (
            computedHeight === ignoreHeightValue ||
            computedMaxHeight === ignoreHeightValue ||
            inlineHeight === ignoreHeightValue ||
            inlineMaxHeight === ignoreHeightValue
        );
    };

    // 1) 自身优先：识别 Text 本层由 class/style 声明的显式高度约束（不仅限内联 style）。
    const selfCs = getComputedStyle(el);
    const selfComputedHeight = (selfCs.height || "").trim();
    const selfComputedMaxHeight = (selfCs.maxHeight || "").trim();
    const selfOverflow = (selfCs.overflow || "").trim();
    const selfOverflowY = (selfCs.overflowY || "").trim();
    const selfHasOverflow =
        (selfOverflow !== "" && selfOverflow !== "visible") ||
        (selfOverflowY !== "" && selfOverflowY !== "visible");
    const selfInlineHeight = (el.style.height || "").trim();
    const selfInlineMaxHeight = (el.style.maxHeight || "").trim();
    const selfIsInternalFillConstraint =
        selfInlineHeight === "100%" || selfInlineMaxHeight === "100%";
    const selfHasExplicitInlineConstraint =
        hasExplicitHeightConstraint(selfInlineHeight) ||
        hasExplicitHeightConstraint(selfInlineMaxHeight);
    const selfHasExplicitConstraint =
        selfHasExplicitInlineConstraint ||
        hasExplicitHeightConstraint(selfComputedMaxHeight) ||
        hasHeightUtilityClass(el);

    if (
        selfHasOverflow &&
        selfHasExplicitConstraint &&
        !selfIsInternalFillConstraint &&
        !isIgnoredByValue(el, selfComputedHeight, selfComputedMaxHeight)
    ) {
        return el;
    }

    // 2) 对齐 Text2：向上找首个“max-height”或“overflow + fixed height”的父容器。
    let p: HTMLElement | null = el.parentElement;
    let depth = 0;
    while (p && depth < 5) {
        const cs = getComputedStyle(p);
        const maxH = (cs.maxHeight || "").trim();
        const h = (cs.height || "").trim();
        const inlineH = (p.style.height || "").trim();
        const inlineMaxH = (p.style.maxHeight || "").trim();
        const hasUtilityHeightConstraint = hasHeightUtilityClass(p);
        const parentHeightDiff = p.scrollHeight - p.clientHeight;
        const parentWidthDiff = p.scrollWidth - p.clientWidth;
        const parentActuallyClipping =
            parentHeightDiff > 1 || parentWidthDiff > 1;

        if (!isIgnoredByValue(p, h, maxH)) {
            const overflow = (cs.overflow || "").trim();
            const overflowY = (cs.overflowY || "").trim();
            const hasMaxHeight =
                hasExplicitHeightConstraint(maxH) ||
                hasExplicitHeightConstraint(inlineMaxH);
            const hasOverflow =
                (overflow !== "" && overflow !== "visible") ||
                (overflowY !== "" && overflowY !== "visible");
            const hasFixedHeight =
                hasExplicitHeightConstraint(inlineH) ||
                hasUtilityHeightConstraint ||
                (hasExplicitHeightConstraint(h) && parentActuallyClipping);

            if (hasMaxHeight || (hasOverflow && hasFixedHeight)) {
                return p;
            }
        }

        p = p.parentElement;
        depth += 1;
    }

    // 3) 兜底：多层动态布局场景，按真实裁剪差值识别，但跳过自身内部 100% 约束假宿主。
    let current: HTMLElement | null = el;
    depth = 0;
    while (current && depth < 6) {
        const cs = getComputedStyle(current);
        const overflow = (cs.overflow || "").trim();
        const overflowY = (cs.overflowY || "").trim();
        const maxH = (cs.maxHeight || "").trim();
        const hasOverflowConstraint =
            (overflow !== "" && overflow !== "visible") ||
            (overflowY !== "" && overflowY !== "visible");
        const hasMaxHeight = hasExplicitHeightConstraint(maxH);
        const inlineHeight = (current.style.height || "").trim();
        const inlineMaxHeight = (current.style.maxHeight || "").trim();
        const isInternalSelfControl =
            current === el &&
            (inlineHeight === "100%" || inlineMaxHeight === "100%");

        if (
            !isInternalSelfControl &&
            !isIgnoredByValue(current, (cs.height || "").trim(), maxH) &&
            (hasOverflowConstraint || hasMaxHeight)
        ) {
            const heightDiff = current.scrollHeight - current.clientHeight;
            const widthDiff = current.scrollWidth - current.clientWidth;
            if (heightDiff > 1 || widthDiff > 1) {
                return current;
            }
        }

        current = current.parentElement;
        depth += 1;
    }

    return null;
}

export function computeLineMetrics(el: HTMLElement) {
    const cs = getComputedStyle(el);
    const fs = Number.parseFloat(cs.fontSize || "");
    const fontSizePx = Number.isFinite(fs) && fs > 0 ? fs : NaN;
    const lhRaw = cs.lineHeight;
    let lh = Number.parseFloat(lhRaw || "");
    if (!Number.isFinite(lh) || lh <= 0 || lhRaw === "normal") {
        lh = measureLineHeight(cs);
    }
    return {
        fontSizePx: Number.isFinite(fontSizePx) ? fontSizePx : null,
        lineHeightPx: Number.isFinite(lh) && lh > 0 ? lh : null,
    };
}

export function collapse(node: HTMLElement, options: CollapseOptions | undefined) {
    if (typeof window === "undefined") {
        return {
            update() { },
            destroy() { },
        };
    }

    let opts = options || {};
    let enabled = typeof opts.lines === "number";
    let nodeUnwatch: (() => void) | null = null;
    let hostUnwatch: (() => void) | null = null;
    let lastHost: HTMLElement | null = null;
    let host: HTMLElement | null = null;
    let didEmit = false;

    let last: CollapseInfo = {
        isCollapsed: false,
        styles: {},
    };

    const hasResizeObserver =
        typeof (globalThis as any).ResizeObserver !== "undefined";

    const state = {
        pendingRaf: null as number | null,
        pendingType: null as "raf" | "timeout" | null,
    };

    let currentStyles: Record<string, string | null> = {};

    const setStyle = (
        maxHeight: string | null,
        overflow: string | null,
        minHeight: string | null,
        lineClamp: string | null,
        height: string | null = null,
    ) => {
        currentStyles = {
            "max-height": maxHeight,
            overflow: overflow,
            "min-height": minHeight,
            "--text-line-clamp": lineClamp,
            height: height,
            transition: `var(--snowui-text-collapse-transition, ${MORPH_STYLES.transition})`,
        };
    };

    const apply = () => {
        if (!node.isConnected) return;
        if (!enabled) return;

        try {
            const { lineHeightPx } = computeLineMetrics(node);
            const isExpanded = opts.isExpanded ?? false;
            const effectiveLines = opts.lines;
            host = findConstraintHost(
                node,
                currentStyles.height || currentStyles["max-height"],
            );

            if (!host && effectiveLines === 0) {
                let fallback: HTMLElement | null = node.parentElement;
                let depth = 0;
                while (fallback && depth < 3) {
                    const cs = getComputedStyle(fallback);
                    if (
                        cs.overflow !== "visible" ||
                        cs.height !== "auto" ||
                        cs.maxHeight !== "none"
                    ) {
                        host = fallback;
                        break;
                    }
                    fallback = fallback.parentElement;
                    depth += 1;
                }
            }

            if (!host && effectiveLines === 0) {
                host = node;
            }

            const constraintHeightPx = host
                ? host.getBoundingClientRect().height || host.clientHeight
                : null;

            if (host !== lastHost) {
                hostUnwatch?.();
                hostUnwatch = null;
                lastHost = host;
                if (host) {
                    hostUnwatch = resizeManager.watch(host, requestApply);
                }
            }

            if (typeof effectiveLines !== "number") {
                setStyle(null, null, null, null);
            } else if (effectiveLines === 0) {
                if (isExpanded) {
                    setStyle(null, "visible", null, null, "auto");
                } else if (constraintHeightPx) {
                    const applyMaxHeight = host !== node;
                    setStyle(
                        applyMaxHeight ? "100%" : null,
                        "hidden",
                        null,
                        null,
                        applyMaxHeight ? "100%" : null,
                    );

                    checkCollapse(
                        node,
                        opts,
                        last,
                        (next) => (last = next),
                        constraintHeightPx,
                        currentStyles,
                    );
                    return;
                } else {
                    setStyle(null, null, null, null);
                }
            } else if (effectiveLines > 0) {
                if (lineHeightPx) {
                    const desired = Math.max(1, effectiveLines) * lineHeightPx;
                    const desiredPx = `${desired / 16}rem`;
                    if (constraintHeightPx && constraintHeightPx < desired) {
                        const capPx = `${constraintHeightPx / 16}rem`;
                        setStyle(capPx, "hidden", null, String(effectiveLines));
                    } else {
                        // lines>1 场景始终以 max-height 约束可视行数，避免仅 min-height 时在无外层容器下出现“未截断”。
                        setStyle(desiredPx, "hidden", null, String(effectiveLines));
                    }
                } else {
                    setStyle(null, null, null, String(effectiveLines));
                }
            } else {
                setStyle(null, null, null, null);
            }

            checkCollapse(
                node,
                opts,
                last,
                (next) => (last = next),
                constraintHeightPx,
                currentStyles,
            );
        } catch (e) {
            console.error("Collapse error:", e);
        }
    };

    function requestApply() {
        if (state.pendingRaf !== null) {
            if (state.pendingType === "timeout") {
                clearTimeout(state.pendingRaf as any);
            } else {
                const cancel = (globalThis as any).cancelAnimationFrame;
                cancel?.(state.pendingRaf);
            }
        }
        state.pendingRaf = requestAnimationFrame(() => {
            state.pendingRaf = null;
            state.pendingType = null;
            apply();
        });
        state.pendingType = "raf";
    }

    function checkCollapse(
        el: HTMLElement,
        opts: CollapseOptions,
        lastInfo: CollapseInfo,
        setLast: (i: CollapseInfo) => void,
        constraintHeightPx: number | null,
        styles: Record<string, string | null>,
    ) {
        let measureEl: HTMLElement = el;
        if (opts.lines === 0 && !(opts.isExpanded ?? false)) {
            const direct = el.querySelector(":scope > .snowui-text-truncate-wrapper") as HTMLElement | null;
            measureEl = direct ?? (el.querySelector(".snowui-text-truncate-wrapper") as HTMLElement | null) ?? el;
        }
        const cs = getComputedStyle(measureEl);
        const isHorizontal = cs.whiteSpace === "nowrap";
        const visibleHeightPx =
            opts.lines === 0 && !(opts.isExpanded ?? false)
                ? (() => {
                    const clientH = measureEl.clientHeight;
                    if (!constraintHeightPx) return clientH;
                    if (!clientH) return constraintHeightPx;
                    return Math.min(constraintHeightPx, clientH);
                })()
                : measureEl.clientHeight;
        const diff =
            opts.lines === 0 &&
                !(opts.isExpanded ?? false) &&
                !isHorizontal &&
                visibleHeightPx
                ? measureEl.scrollHeight - visibleHeightPx
                : isHorizontal
                    ? measureEl.scrollWidth - measureEl.clientWidth
                    : measureEl.scrollHeight - measureEl.clientHeight;

        const threshold = lastInfo.isCollapsed ? 0 : 1;
        const isCollapsed = diff > threshold;

        const info: CollapseInfo = {
            isCollapsed,
            styles,
        };

        if (!didEmit) {
            didEmit = true;
            setLast(info);
            opts.onUpdate?.(info);
            return;
        }

        if (
            info.isCollapsed !== lastInfo.isCollapsed ||
            JSON.stringify(info.styles) !== JSON.stringify(lastInfo.styles)
        ) {
            setLast(info);
            opts.onUpdate?.(info);
        }
    }

    function disable() {
        enabled = false;
        nodeUnwatch?.();
        nodeUnwatch = null;
        hostUnwatch?.();
        hostUnwatch = null;
        lastHost = null;
        setStyle(null, null, null, null);
        const nextInfo: CollapseInfo = {
            isCollapsed: false,
            styles: {},
        };
        last = nextInfo;
        opts.onUpdate?.(nextInfo);
    }

    function enable() {
        if (enabled) return;
        if (!hasResizeObserver) {
            disable();
            return;
        }
        enabled = true;
        nodeUnwatch = resizeManager.watch(node, requestApply);
        apply();
        requestApply();
    }

    if (!hasResizeObserver) {
        disable();
        return {
            update(next: CollapseOptions) {
                opts = next || {};
                disable();
            },
            destroy() { },
        };
    }
    if (enabled) {
        nodeUnwatch = resizeManager.watch(node, requestApply);
        apply();
        requestApply();
    } else {
        disable();
    }

    return {
        update(next: CollapseOptions) {
            opts = next || {};
            const nextEnabled = typeof opts.lines === "number";
            if (!nextEnabled) {
                disable();
                return;
            }
            enable();
            requestApply();
        },
        destroy() {
            nodeUnwatch?.();
            hostUnwatch?.();
            if (state.pendingRaf !== null) {
                if (state.pendingType === "timeout") {
                    clearTimeout(state.pendingRaf as any);
                } else {
                    const cancel = (globalThis as any).cancelAnimationFrame;
                    cancel?.(state.pendingRaf);
                }
            }
            setStyle(null, null, null, null);
        },
    };
}
