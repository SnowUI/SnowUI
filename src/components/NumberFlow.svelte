<!-- 
 NumberFlow 动效数字组件
  v2.0.0

 1. 核心能力 (Features):
    - 滚轮动效: 模拟物理滚轮的数字滚动效果。
    - 智能进场: 整数部分 RTL 编号，小数部分 LTR 编号，确保位数变化时位置对齐。
    - 位移平滑: 位数字增减时仅做平移动画，避免 scale 导致字形变宽。
    - 格式化支持: 完整支持 Intl.NumberFormat 格式化。
    - 属性透传: 支持自定义样式、字体大小与权重。
    - 进退场: 新数位从零滚入、旧数位滚回零并渐隐；负号沿滚动方向位移进退场。
    - 依次编排: 位数增减时按位依次滚动进场 / 依次退场。
    - 滚动方向可配: 支持通过 rollDirection 配置 normal / reverse 语义方向。
    - 常规组件模式: 通过 numberPosition 控制数字在内容左侧或右侧，无需 layout snippet。
    - 容器宽度过渡: 使用 Frame 容器并复用默认形态变化动效参数，让位数变化时宽度平滑变长/变窄。
 -->

<script lang="ts">
    import type { TransitionConfig } from "svelte/transition";
    import { cubicOut } from "svelte/easing";
    import { untrack, onDestroy, type Snippet } from "svelte";
    import type {
        FrameProps,
        RenderHints,
    } from "@snowui-design-system/components/logic/frame-types";
    import { splitTextMotionGraphemes } from "../lib/text-motion/layout";
    import type { SnowUIColor } from "@snowui-design-system/components/lib/color";
    import { Skeleton } from "@snowui-design-system/components";
    import { MORPH_MOTION } from "@snowui-design-system/components/motion/morph";
    import { resizeManager } from "@snowui-design-system/components/logic/observer.svelte";
    import { getSkeleton } from "@snowui-design-system/components/context";
    import {
        animateTextMotionColorSequence,
        cancelTextMotionColor,
    } from "../lib/text-motion/color";
    import {
        extractTextMotionNumber,
        mapDigitToSignedAxis,
        resolveTextMotionModuloTrend,
        resolveTextMotionTrend,
    } from "../lib/text-motion/numeric";
    import { shouldReduceTextMotion } from "../lib/text-motion/preference";
    import {
        DEFAULT_TEXT_MOTION_COLOR,
        type TextMotionAlign,
        type TextMotionRole,
        type TextMotionTrend,
    } from "../lib/text-motion/types";
    import {
        createTextMotionTypographyStyle,
        resolveTextMotionColor,
    } from "../lib/text-motion/typography";
    import { getTextMotionStagger } from "../lib/text-motion/sequence";
    import FramePro from "./FramePro.svelte";

    type TrendResolver = TextMotionTrend;
    interface NumberFlowTransition {
        duration?: number;
    }

    interface Props extends Omit<FrameProps, "children"> {
        value: number | string;
        locales?: string;
        format?: Intl.NumberFormatOptions;
        trend?: TrendResolver;
        motionRole?: TextMotionRole;
        transition?: NumberFlowTransition;
        digits?: Record<number, { max?: number }>;
        numberPosition?: "left" | "right";
        rollDirection?: RollDirection;
        loading?: boolean;
        skeleton?: boolean;
        renderHints?: RenderHints;
        respectMotionPreference?: boolean;
        font?: string;
        size?: string | number;
        weight?: string | number;
        lineHeight?: string | number;
        color?: SnowUIColor | string;
        align?: TextMotionAlign;
        motionColor?: SnowUIColor | string;
        children?: Snippet;
        [key: string]: any;
    }

    let {
        value,
        locales = "en-US",
        format = {},
        trend = 0,
        motionRole = "auto",
        transition = undefined,
        digits,
        numberPosition = "right",
        rollDirection = "normal",
        loading = undefined,
        skeleton = undefined,
        renderHints = undefined,
        respectMotionPreference = false,
        font = undefined,
        size = undefined,
        weight = undefined,
        lineHeight = undefined,
        color = undefined,
        align = undefined,
        motionColor = DEFAULT_TEXT_MOTION_COLOR,
        tag = "span",
        enableResponsive = false,
        enableContext = true,
        enableScaleObserver = false,
        enableDefaultMotion = true,
        class: className = "",
        style: userStyle = "",
        children,
        ...rest
    }: Props = $props();

    const skeletonCtx = getSkeleton();
    const effectiveLoading = $derived(loading || skeletonCtx?.loading);
    const effectiveSkeleton = $derived(skeleton ?? skeletonCtx?.skeleton ?? false);
    const reduceMotion = $derived(
        shouldReduceTextMotion(respectMotionPreference),
    );
    const duration = $derived(reduceMotion ? 0 : (transition?.duration ?? 900));
    const rootStyle = $derived.by(() => {
        const typographyStyle = createTextMotionTypographyStyle(
            "number-flow",
            { font, size, weight, lineHeight, color, align, motionColor },
            userStyle,
        );
        return [
            typographyStyle,
            `--snowui-number-flow-duration: ${duration}ms`,
        ]
            .filter(Boolean)
            .join("; ");
    });

    type NumberPartType = Intl.NumberFormatPartTypes | "prefix" | "suffix";
    interface KeyedPart {
        type: NumberPartType;
        value: string;
        key: string;
        order?: number;
        enterOrder?: number;
        exitOrder?: number;
        staggerValues?: string[];
        pos?: number;
    }

    const numberFormatter = $derived(new Intl.NumberFormat(locales, format));
    let currentParts = $derived(formatToParts(value, numberFormatter));
    const displayText = $derived(
        currentParts.map((part) => part.value).join(""),
    );
    const displayNumericValue = $derived(parseNumericValue(value));
    const numberFlowRenderHints = $derived.by(() => {
        const widthChars = Math.max(displayText.length, 3);
        return {
            variant: renderHints?.variant ?? "line",
            width: renderHints?.width ?? `calc(${widthChars}ch + 0.5rem)`,
            height: renderHints?.height ?? "1.25rem",
        };
    });
    let hasMounted = $state(false);
    let contentMeasureElement = $state<HTMLElement>();
    let motionElement = $state<HTMLElement>();
    let previousMotionText = $state<string | undefined>(undefined);
    let measuredContentWidth = $state<number | null>(null);
    let trackWidth = $state<number | null>(null);
    let previousNumericValue = $state<number | null>(null);
    let numericDiff = $state(0);
    let trendSign = $state<-1 | 0 | 1>(0);
    const widthMotionDuration = $derived(
        reduceMotion ? 0 : (MORPH_MOTION.duration ?? 300),
    );
    const widthSlowOffset = 500;
    function resolveInitialWidthMotionDuration() {
        return widthMotionDuration;
    }

    let widthTransitionDurationMs = $state(
        resolveInitialWidthMotionDuration(),
    );

    // 格式化数字并生成带 Key 的部分
    function formatToParts(
        val: number | string,
        formatter: Intl.NumberFormat,
    ): KeyedPart[] {
        const num = extractTextMotionNumber(String(val)) ?? 0;
        const parts = formatter.formatToParts(num);

        let integerParts: KeyedPart[] = [];
        let fractionParts: KeyedPart[] = [];
        let seenDecimal = false;
        let currentFractionPos = -1;

        const counts: Record<string, number> = {};
        const getNextKey = (type: string) => {
            counts[type] = (counts[type] ?? 0) + 1;
            return `${type}-${counts[type]}`;
        };

        for (const part of parts) {
            if (part.type === "integer") {
                const digits = part.value.split("");
                integerParts.push(
                    ...digits.map((d) => ({
                        type: "integer" as const,
                        value: d,
                        key: "", // 稍后处理
                    })),
                );
            } else if (part.type === "decimal") {
                seenDecimal = true;
                fractionParts.push({
                    type: "decimal",
                    value: part.value,
                    key: getNextKey("decimal"),
                });
            } else if (part.type === "fraction") {
                const digits = part.value.split("");
                fractionParts.push(
                    ...digits.map((d) => ({
                        type: "fraction" as const,
                        value: d,
                        key: getNextKey("fraction"),
                        pos: currentFractionPos--,
                    })),
                );
            } else {
                const target = seenDecimal ? fractionParts : integerParts;
                target.push({
                    type: part.type as any,
                    value: part.value,
                    key: getNextKey(part.type),
                });
            }
        }

        // 整数部分 RTL 编号
        let intDigitCount = integerParts.filter(
            (p) => p.type === "integer",
        ).length;
        let currentIntPos = intDigitCount - 1;
        integerParts = integerParts.map((p) => {
            if (p.type === "integer") {
                const keyed = {
                    ...p,
                    key: `integer-${currentIntPos}`,
                    pos: currentIntPos,
                };
                currentIntPos--;
                return keyed;
            }
            return p;
        });

        const merged = [...integerParts, ...fractionParts];
        const total = merged.length;
        const staggerValues = merged.map((part) => part.value);
        return merged.map((part, index) => ({
            ...part,
            order: index,
            enterOrder: total - 1 - index, // 进场：右侧优先
            exitOrder: total - 1 - index, // 退场同样从低位到高位
            staggerValues,
        }));
    }

    const digitsModulo = $derived.by(() => getDigitsModulo());
    type RollDirection = "normal" | "reverse";
    const WHEEL_DEFAULT_MAX = 9;
    const WHEEL_VALUE_VAR = "--snowui-number-flow-wheel-v";
    const WIDTH_DELTA_VAR = "--snowui-number-flow-width-delta";
    const WHEEL_DURATION_VAR = "--snowui-number-flow-wheel-duration";
    const WHEEL_DELAY_VAR = "--snowui-number-flow-wheel-delay";
    const WHEEL_EASING_VAR = "--snowui-number-flow-wheel-easing";
    const WHEEL_SPIN_EASING =
        "linear(0,.005,.019,.039,.066,.096,.129,.165,.202,.24,.278,.316,.354,.39,.426,.461,.494,.526,.557,.586,.614,.64,.665,.689,.711,.731,.751,.769,.786,.802,.817,.831,.844,.856,.867,.877,.887,.896,.904,.912,.919,.925,.931,.937,.942,.947,.951,.955,.959,.962,.965,.968,.971,.973,.976,.978,.98,.981,.983,.984,.986,.987,.988,.989,.99,.991,.992,.992,.993,.994,.994,.995,.995,.996,.996,.9963,.9967,.9969,.9972,.9975,.9977,.9979,.9981,.9982,.9984,.9985,.9987,.9988,.9989,1)";
    let wheelTransitionSupport: boolean | null = null;

    const partPositions = new WeakMap<HTMLElement, { layoutLeft: number; layoutTop: number }>();
    let layoutSnapshotPending = false;

    $effect.pre(() => {
        currentParts;
        if (!motionElement || layoutSnapshotPending) return;
        layoutSnapshotPending = true;
        // 一帧内只记录最初的布局；后续输入不能用尚未补偿的中间布局覆盖它。
        for (const track of managedTracks) {
            partPositions.set(track, {
                layoutLeft: track.offsetLeft,
                layoutTop: track.offsetTop,
            });
        }
    });

    const exitingTracks = new Set<HTMLElement>();
    const managedTracks = new Set<HTMLElement>();
    const layoutAnimations = new WeakMap<HTMLElement, Set<Animation>>();
    const layoutEasing = `linear(${Array.from({ length: 61 }, (_, i) => cubicOut(i / 60).toFixed(6)).join(",")})`;
    let layoutFrame: number | null = null;

    function schedulePartLayout() {
        if (layoutFrame !== null) return;
        layoutFrame = requestAnimationFrame(() => {
            layoutFrame = null;
            if (!motionElement) return;
            updateContentWidth();
            if (!layoutSnapshotPending) return;
            layoutSnapshotPending = false;
            // 先批量读取，再写退出位置和启动动画，避免逐位交错读写导致重复布局。
            const positions = new Map<HTMLElement, { layoutLeft: number; layoutTop: number }>();
            let anchor: HTMLElement | undefined;
            for (const track of managedTracks) {
                positions.set(track, { layoutLeft: track.offsetLeft, layoutTop: track.offsetTop });
                if (track.dataset.type === "integer" && !exitingTracks.has(track)) {
                    if (!anchor || positions.get(track)!.layoutLeft > positions.get(anchor)!.layoutLeft) anchor = track;
                }
            }
            const anchorBefore = anchor && partPositions.get(anchor);
            const anchorDelta = anchor && anchorBefore
                ? positions.get(anchor)!.layoutLeft - anchorBefore.layoutLeft
                : 0;
            for (const [track, next] of positions) {
                const previous = partPositions.get(track);
                partPositions.delete(track);
                if (!previous) continue;
                if (exitingTracks.has(track)) {
                    next.layoutLeft = previous.layoutLeft + anchorDelta;
                    track.style.left = `${next.layoutLeft}px`;
                }
                const dx = previous.layoutLeft - next.layoutLeft;
                const dy = previous.layoutTop - next.layoutTop;
                if ((dx === 0 && dy === 0) || duration === 0) continue;
                // FLIP 仅处理组件内部排列，外层宽度有独立轨道；保留旧位移并叠加本次差值。
                const animation = track.animate(
                    { transform: [`translate(${dx}px, ${dy}px)`, "translate(0px, 0px)"] },
                    { duration, easing: layoutEasing, composite: "accumulate", fill: "both" },
                );
                let animations = layoutAnimations.get(track);
                if (!animations) {
                    animations = new Set();
                    layoutAnimations.set(track, animations);
                }
                animations.add(animation);
                animation.finished.then(() => {
                    if (layoutAnimations.get(track) !== animations) return;
                    animations.delete(animation);
                    animation.cancel();
                    if (animations.size === 0) layoutAnimations.delete(track);
                }).catch(() => {});
            }
        });
    }

    $effect(() => {
        currentParts;
        if (motionElement) schedulePartLayout();
    });

    function clearPartLayout(track: HTMLElement) {
        exitingTracks.delete(track);
        managedTracks.delete(track);
        partPositions.delete(track);
        layoutAnimations.get(track)?.forEach(animation => animation.cancel());
        layoutAnimations.delete(track);
        if (managedTracks.size === 0 && layoutFrame !== null) {
            cancelAnimationFrame(layoutFrame);
            layoutFrame = null;
        }
        if (managedTracks.size === 0) layoutSnapshotPending = false;
    }

    const wheelPresence = new WeakMap<HTMLElement, {
        exit: () => void;
        resume: () => void;
    }>();

    interface PartPresenceOptions {
        delay: number;
        duration: number;
    }

    const presenceAnimations = new WeakMap<HTMLElement, Animation>();
    const signMotions = new WeakMap<HTMLElement, {
        target: number;
        animations: Set<Animation>;
    }>();

    function animateSignPresence(node: HTMLElement, options: PartPresenceOptions, entering: boolean) {
        if (node.parentElement?.dataset.type !== "minusSign") return;
        const sign = getPreferredWheelSign(rollDirection, getEnterExitTrendSign(trendSign, numericDiff));
        const target = entering ? 0 : -sign;
        let motion = signMotions.get(node);
        if (!motion) {
            motion = { target: entering ? sign : 0, animations: new Set() };
            signMotions.set(node, motion);
        }
        const delta = motion.target - target;
        motion.target = target;
        node.style.transform = `translateY(${target}em)`;
        if (options.duration === 0) {
            motion.animations.forEach(animation => animation.cancel());
            motion.animations.clear();
            return;
        }
        if (delta === 0) return;
        // 与数字滚轮共用 1em 步长和缓动；旧位移继续收敛，反向进退场只追加目标差值。
        const animation = node.animate(
            { transform: [`translateY(${delta}em)`, "translateY(0em)"] },
            { duration: options.duration, easing: WHEEL_SPIN_EASING, composite: "accumulate", fill: "both" },
        );
        motion.animations.add(animation);
        animation.finished.then(() => {
            motion.animations.delete(animation);
            animation.cancel();
        }).catch(() => {});
    }

    function managePartPresence(node: HTMLElement) {
        const track = node.parentElement;
        if (track) managedTracks.add(track);
        return {
            destroy() {
                if (track) clearPartLayout(track);
                node.querySelectorAll<HTMLElement>("[data-number-flow-color-label]").forEach(cancelTextMotionColor);
                presenceAnimations.get(node)?.cancel();
                presenceAnimations.delete(node);
                signMotions.get(node)?.animations.forEach(animation => animation.cancel());
                signMotions.delete(node);
            },
        };
    }

    function partPresence(
        node: HTMLElement,
        options: PartPresenceOptions,
        entering: boolean,
    ): TransitionConfig {
        animateSignPresence(node, options, entering);
        // 数位滚动与 opacity 独立；重新出现时从当前透明度接管，避免先闪回 0 或 1。
        const previous = presenceAnimations.get(node);
        const opacity = previous || !entering
            ? Number(getComputedStyle(node).opacity)
            : 0;
        previous?.cancel();
        presenceAnimations.delete(node);
        node.style.opacity = entering ? "1" : "0";
        if (options.duration > 0) {
            const animation = node.animate(
                { opacity: [opacity, entering ? 1 : 0] },
                { duration: options.duration / 2, delay: options.delay, easing: "ease-out", fill: "both" },
            );
            presenceAnimations.set(node, animation);
            animation.finished.then(() => {
                if (presenceAnimations.get(node) !== animation) return;
                presenceAnimations.delete(node);
                animation.cancel();
            }).catch(() => {});
        }
        // Svelte 只负责完整滚轮时长内的节点保留与清理，不再叠加斜向飞入 / 飞出。
        return options;
    }

    function enterPart(node: HTMLElement, options: PartPresenceOptions) {
        const track = node.parentElement;
        if (track) {
            exitingTracks.delete(track);
            track.style.position = "";
            track.style.left = "";
            track.style.top = "";
            track.removeAttribute("inert");
        }
        const wheel = node.querySelector<HTMLElement>(".snowui-number-flow-wheel");
        if (wheel) wheelPresence.get(wheel)?.resume();
        return partPresence(node, options, true);
    }

    function exitPart(node: HTMLElement, options: PartPresenceOptions) {
        const track = node.parentElement;
        const position = track && (partPositions.get(track) ?? {
            layoutLeft: track.offsetLeft, layoutTop: track.offsetTop,
        });
        if (track && position) {
            track.style.position = "absolute";
            track.style.left = `${position.layoutLeft}px`;
            track.style.top = `${position.layoutTop}px`;
            track.setAttribute("inert", "");
            exitingTracks.add(track);
            schedulePartLayout();
        }
        return partPresence(node, options, false);
    }

    function getPartDelay(order?: number, values: string[] = []) {
        if (reduceMotion) return 0;
        // 与 NumericText 共用错峰比例；快速更新仍保留数位启动顺序。
        return Math.max(0, order ?? 0) * getTextMotionStagger(duration, values);
    }

    function toCssEasing(easing: string | undefined) {
        if (!easing) return "ease-out";

        const map: Record<string, string> = {
            linear: "linear",
            easeIn: "ease-in",
            easeOut: "ease-out",
            easeInOut: "ease-in-out",
        };
        return map[easing] ?? easing;
    }

    function updateContentWidth() {
        if (!contentMeasureElement) return;
        // 保留小数像素，不把根 Frame 的外层缩放算进排版宽度。
        const nextWidth = Number.parseFloat(getComputedStyle(contentMeasureElement).width);
        if (!Number.isFinite(nextWidth) || nextWidth <= 0) return;
        if (nextWidth === measuredContentWidth) return;
        measuredContentWidth = nextWidth;
    }

    function scheduleWidthSync() {
        schedulePartLayout();
    }

    function normalizeWheelLength(length: number | undefined) {
        const parsed = Number.isFinite(length) ? Math.floor(length!) : 10;
        return Math.max(1, parsed);
    }

    function getPartDigitLength(part: KeyedPart) {
        if (part.type !== "integer" && part.type !== "fraction") return 10;
        const max = digits?.[part.pos ?? 0]?.max;
        const normalizedMax = Number.isFinite(max)
            ? Math.max(0, Math.floor(max!))
            : WHEEL_DEFAULT_MAX;
        return normalizedMax + 1;
    }

    function getDigitsModulo() {
        if (!digits) return null;
        const positions = Object.keys(digits)
            .map((key) => Number.parseInt(key, 10))
            .filter((pos) => Number.isInteger(pos) && pos >= 0);
        if (!positions.length) return null;

        const maxPos = Math.max(...positions);
        let modulo = 1;
        for (let pos = 0; pos <= maxPos; pos += 1) {
            const max = digits[pos]?.max;
            const length = Number.isFinite(max)
                ? Math.max(1, Math.floor(max!) + 1)
                : 10;
            modulo *= length;
        }

        return modulo > 1 ? modulo : null;
    }

    function modBy(value: number, length: number) {
        return ((value % length) + length) % length;
    }

    function parseWheelDigit(value: string, length: number) {
        const parsed = Number.parseInt(value, 10);
        if (Number.isNaN(parsed)) return null;
        return modBy(parsed, length);
    }

    function parseWheelAxisValue(
        value: string,
        length: number,
        numericValue: number | null,
        axisDirection: -1 | 1,
    ) {
        const digit = parseWheelDigit(value, length);
        return digit === null
            ? null
            : mapNumberFlowDigitAxis(
                  digit,
                  length,
                  numericValue,
                  axisDirection,
              );
    }

    function getRollAxisDirection(direction: RollDirection): -1 | 1 {
        return direction === "reverse" ? -1 : 1;
    }

    function mapNumberFlowDigitAxis(
        digit: number,
        length: number,
        numericValue: number | null | undefined,
        axisDirection: -1 | 1,
    ) {
        const signedAxis = mapDigitToSignedAxis(digit, length, numericValue);
        return axisDirection < 0 ? modBy(-signedAxis, length) : signedAxis;
    }

    function parseNumericValue(raw: number | string) {
        const parsed = extractTextMotionNumber(String(raw));
        return parsed === undefined ? null : parsed;
    }

    function toTrendSign(value: number) {
        if (value > 0) return 1 as const;
        if (value < 0) return -1 as const;
        return 0 as const;
    }

    function getWheelCssDirection(
        _sign: -1 | 0 | 1,
        _direction: RollDirection,
    ) {
        // 滚轮方向由连续轨道值的增减决定；数字轴本身保持正向，
        // 避免“轨道反向 + CSS 反向”互相抵消。
        return "1";
    }

    function getEnterExitTrendSign(sign: -1 | 0 | 1, diff: number) {
        if (sign !== 0) return sign;
        return toTrendSign(diff);
    }

    function getPreferredWheelSign(
        direction: RollDirection,
        numericTrend: -1 | 0 | 1,
    ) {
        return direction === "reverse"
            ? ((-numericTrend) as -1 | 0 | 1)
            : numericTrend;
    }

    // 无限序列轨道：计算 digit 环形最短路径。
    // 例如 9→0 返回 1，0→9 返回 -1，避免按数值趋势绕完整长圈。
    function getDeltaForDigit(
        prev: number,
        next: number,
        length: number,
    ): number {
        const forward = modBy(next - prev, length);
        const backward = forward - length;
        if (Math.abs(backward) < Math.abs(forward)) return backward;
        return forward;
    }

    function getWheelSpinDurationMs(_stepCount: number, _length: number) {
        if (reduceMotion) return 0;
        return Math.max(1, Math.round(duration));
    }

    function readWheelTrackValue(node: HTMLElement) {
        const raw = getComputedStyle(node).getPropertyValue(WHEEL_VALUE_VAR);
        const parsed = Number.parseFloat(raw);
        return Number.isFinite(parsed) ? parsed : null;
    }

    function resolveTargetWheelValue(
        currentTrackValue: number,
        targetDigit: number,
        length: number,
        preferredSign: -1 | 0 | 1,
    ) {
        // 新指令可能撤销尚未启动的错峰任务；已经位于目标时不能强制绕一整圈。
        const distance = modBy(currentTrackValue - targetDigit, length);
        if (Math.min(distance, length - distance) < 0.0001) return currentTrackValue;
        const baseCycle = Math.round((currentTrackValue - targetDigit) / length);
        const candidates = [
            targetDigit + (baseCycle - 2) * length,
            targetDigit + (baseCycle - 1) * length,
            targetDigit + baseCycle * length,
            targetDigit + (baseCycle + 1) * length,
            targetDigit + (baseCycle + 2) * length,
        ];
        const signedCandidates =
            preferredSign === 0
                ? candidates
                : candidates.filter(
                      (candidate) =>
                          toTrendSign(candidate - currentTrackValue) ===
                          preferredSign,
                  );
        const selectableCandidates =
            signedCandidates.length > 0 ? signedCandidates : candidates;

        return selectableCandidates.reduce((best, candidate) => {
            const bestDistance = Math.abs(best - currentTrackValue);
            const candidateDistance = Math.abs(candidate - currentTrackValue);
            if (candidateDistance < bestDistance) return candidate;
            return best;
        });
    }

    function supportsWheelTransitionAnimation() {
        if (wheelTransitionSupport !== null) return wheelTransitionSupport;

        if (
            typeof window === "undefined" ||
            typeof document === "undefined" ||
            typeof CSS === "undefined" ||
            typeof CSS.registerProperty !== "function"
        ) {
            wheelTransitionSupport = false;
            return wheelTransitionSupport;
        }

        for (const name of [WHEEL_VALUE_VAR, WIDTH_DELTA_VAR]) {
            try {
                CSS.registerProperty({ name, syntax: "<number>", inherits: name === WHEEL_VALUE_VAR, initialValue: "0" });
            } catch {
                // 同一属性只需注册一次，其他 NumberFlow 实例继续复用。
            }
        }

        try {
            const probe = document.createElement("span");
            probe.style.setProperty(WHEEL_VALUE_VAR, "1");
            wheelTransitionSupport = probe.style.getPropertyValue(
                WHEEL_VALUE_VAR,
            ) === "1";
        } catch {
            wheelTransitionSupport = false;
        }

        return wheelTransitionSupport;
    }

    function setWheelMotionVars(
        node: HTMLElement,
        options: {
            duration: number;
            delay?: number;
        },
    ) {
        node.style.setProperty(WHEEL_DURATION_VAR, `${options.duration}ms`);
        node.style.setProperty(WHEEL_DELAY_VAR, `${options.delay ?? 0}ms`);
        node.style.setProperty(WHEEL_EASING_VAR, WHEEL_SPIN_EASING);
    }

    const wheelAnimations = new WeakMap<HTMLElement, Set<Animation>>();
    const wheelSettled = new WeakMap<HTMLElement, () => void>();

    function cancelWheelAnimations(node: HTMLElement) {
        const animations = wheelAnimations.get(node);
        wheelAnimations.delete(node);
        animations?.forEach(animation => animation.cancel());
    }

    function jumpWheelValue(node: HTMLElement, value: number) {
        cancelWheelAnimations(node);
        node.style.setProperty(WHEEL_VALUE_VAR, String(value));
    }

    function animateWheelValue(
        node: HTMLElement,
        value: number,
        options: { duration: number; delay?: number },
    ) {
        if (options.duration === 0 || !supportsWheelTransitionAnimation()) {
            jumpWheelValue(node, value);
            return;
        }
        const previousTarget = Number(node.style.getPropertyValue(WHEEL_VALUE_VAR));
        setWheelMotionVars(node, options);
        node.style.setProperty(WHEEL_VALUE_VAR, String(value));
        const delta = previousTarget - value;
        if (delta === 0) return;

        // 保留旧动画的残余位移，新动画只补上本次目标差值。
        // delay 期间旧轨道仍继续运动，不因连续点击重新等待或从零速度起步。
        const animation = node.animate(
            { [WHEEL_VALUE_VAR]: [delta, 0] },
            {
                ...options,
                easing: WHEEL_SPIN_EASING,
                composite: "accumulate",
                fill: "both",
            },
        );
        let animations = wheelAnimations.get(node);
        if (!animations) {
            animations = new Set();
            wheelAnimations.set(node, animations);
        }
        animations.add(animation);
        animation.finished.then(() => {
            if (wheelAnimations.get(node) !== animations) return;
            animations.delete(animation);
            animation.cancel();
            if (animations.size === 0) {
                wheelAnimations.delete(node);
                wheelSettled.get(node)?.();
            }
        }).catch(() => {});
    }

    function handlePartOutroStart(event: Event) {
        const node = event.currentTarget as HTMLElement;
        const wheel = node.querySelector<HTMLElement>(".snowui-number-flow-wheel");
        if (wheel) wheelPresence.get(wheel)?.exit();
    }

    // 无限序列轨道 rollWheel action
    // 通过增量叠加的 --wheel-v 轨道值驱动 CSS mod() 圆环滚动。
    function rollWheel(
        node: HTMLElement,
        params: {
            value: string;
            delay: number;
            animateOnMount: boolean;
            direction: RollDirection;
            trendSign: -1 | 0 | 1;
            length: number;
            pos?: number;
            numericDiff: number;
            rawValue: number | string; // 组件的原始 value prop，用于内部追踪趋势
        },
    ) {
        let latest = params;
        let exiting = false;
        let currentDigit: number | null = null;
        let currentWheelValue: number | null = null;
        let currentLength = normalizeWheelLength(params.length);
        let currentDirection: RollDirection = params.direction;
        let previousRawValue: number | null = parseNumericValue(
            params.rawValue,
        );

        // 轨道方向属于当前画面，不能随新数值的正负号提前翻转。
        let axisRawValue = previousRawValue;
        const syncDigitAxis = () => {
            for (const digit of node.querySelectorAll<HTMLElement>(".snowui-number-flow-digit")) {
                digit.style.setProperty("--snowui-number-flow-n", String(mapNumberFlowDigitAxis(
                    Number(digit.textContent), currentLength, axisRawValue,
                    getRollAxisDirection(currentDirection),
                )));
            }
        };
        const settleDigitAxis = () => {
            if (exiting || currentDigit === null || axisRawValue === previousRawValue) return;
            const axisChanged = (axisRawValue !== null && axisRawValue < 0) !==
                (previousRawValue !== null && previousRawValue < 0);
            axisRawValue = previousRawValue;
            if (axisChanged) syncDigitAxis();
            currentWheelValue = mapNumberFlowDigitAxis(
                currentDigit, currentLength, axisRawValue,
                getRollAxisDirection(currentDirection),
            );
            jumpWheelValue(node, currentWheelValue);
        };
        wheelSettled.set(node, settleDigitAxis);
        syncDigitAxis();

        // 初始化 --length 和 --dir（视觉上滚=1, 下滚=-1）
        node.style.setProperty(
            "--snowui-number-flow-length",
            String(currentLength),
        );
        node.style.setProperty(
            "--snowui-number-flow-dir",
            getWheelCssDirection(params.trendSign || 1, currentDirection),
        );
        setWheelMotionVars(node, {
            duration: getWheelSpinDurationMs(1, currentLength),
        });

        const apply = (
            next: {
                value: string;
                delay: number;
                animateOnMount: boolean;
                direction: RollDirection;
                trendSign: -1 | 0 | 1;
                length: number;
                pos?: number;
                numericDiff: number;
                rawValue: number | string;
            },
            isMount: boolean,
        ) => {
            const nextLength = normalizeWheelLength(next.length);
            const targetDigit = parseWheelDigit(next.value, nextLength);
            if (targetDigit === null) return;
            const currentRawValue = parseNumericValue(next.rawValue);
            const axisDirection = getRollAxisDirection(next.direction);
            const targetAxisValue = parseWheelAxisValue(
                next.value,
                nextLength,
                axisRawValue,
                axisDirection,
            );
            if (targetAxisValue === null) return;

            // length 或 direction 改变时重置
            if (
                currentLength !== nextLength ||
                currentDirection !== next.direction
            ) {
                currentLength = nextLength;
                currentDirection = next.direction;
                syncDigitAxis();
                node.style.setProperty(
                    "--snowui-number-flow-length",
                    String(currentLength),
                );
                node.style.setProperty(
                    "--snowui-number-flow-dir",
                    getWheelCssDirection(next.trendSign || 1, currentDirection),
                );
                currentWheelValue = targetAxisValue;
                jumpWheelValue(node, currentWheelValue);
            }

            // 设置当前值
            node.style.setProperty(
                "--snowui-number-flow-current",
                String(targetAxisValue),
            );

            if (isMount && next.animateOnMount) {
                // 新数位从零开始，仍由 SnowUI 的正负轴和 normal / reverse 决定上滚或下滚。
                const mountTrend = next.trendSign === 0 ? 1 : next.trendSign;
                currentWheelValue = resolveTargetWheelValue(
                    0, targetAxisValue, nextLength,
                    getPreferredWheelSign(next.direction, mountTrend),
                );
                jumpWheelValue(node, 0);
                animateWheelValue(node, currentWheelValue, {
                    duration: getWheelSpinDurationMs(Math.abs(currentWheelValue), nextLength),
                    delay: next.delay,
                });
                currentDigit = targetDigit;
                previousRawValue = currentRawValue;
                return;
            }

            if (currentDigit === null) {
                // 首次设置，无动画
                currentDigit = targetDigit;
                currentWheelValue = targetAxisValue;
                jumpWheelValue(node, currentWheelValue);
                previousRawValue = currentRawValue;
                return;
            }

            const currentAxisValue = mapNumberFlowDigitAxis(
                currentDigit,
                currentLength,
                axisRawValue,
                axisDirection,
            );

            if (currentAxisValue === targetAxisValue) {
                currentDigit = targetDigit;
                previousRawValue = currentRawValue;
                if (!wheelAnimations.get(node)?.size) settleDigitAxis();
                return;
            }

            // 计算 delta（含跨界补偿）
            // 用 rawValue 差值推导趋势方向（同步可用，不受 $effect 异步更新影响）
            const rawDiff =
                previousRawValue !== null && currentRawValue !== null
                    ? currentRawValue - previousRawValue
                    : 0;
            const moduloTrend = resolveTextMotionModuloTrend(
                previousRawValue,
                currentRawValue,
                digitsModulo,
                motionRole,
            );
            const effectiveNumericTrend: -1 | 0 | 1 =
                trend ||
                moduloTrend ||
                next.trendSign ||
                (rawDiff > 0
                    ? 1
                    : rawDiff < 0
                      ? -1
                      : (0 as -1 | 0 | 1));
            previousRawValue = currentRawValue;
            node.style.setProperty(
                "--snowui-number-flow-dir",
                getWheelCssDirection(effectiveNumericTrend || 1, next.direction),
            );
            const delta = getDeltaForDigit(
                currentAxisValue,
                targetAxisValue,
                nextLength,
            );

            if (delta === 0) {
                currentDigit = targetDigit;
                return;
            }

            // 目标沿逻辑轨道累积；当前画面还包含未完成动画的残余位移。
            const currentTrackValue = currentWheelValue ?? currentAxisValue;
            currentWheelValue = resolveTargetWheelValue(
                currentTrackValue,
                targetAxisValue,
                nextLength,
                getPreferredWheelSign(next.direction, effectiveNumericTrend),
            );
            animateWheelValue(node, currentWheelValue, {
                duration: getWheelSpinDurationMs(Math.abs(delta), nextLength),
                delay: next.delay,
            });

            currentDigit = targetDigit;
            if (reduceMotion || duration === 0 || !supportsWheelTransitionAnimation()) settleDigitAxis();
        };

        wheelPresence.set(node, {
            exit() {
                exiting = true;
                const current = currentWheelValue ?? readWheelTrackValue(node) ?? 0;
                const exitTrend = getEnterExitTrendSign(trendSign, numericDiff);
                currentWheelValue = resolveTargetWheelValue(
                    current, 0, currentLength,
                    getPreferredWheelSign(currentDirection, exitTrend),
                );
                currentDigit = 0;
                animateWheelValue(node, currentWheelValue, {
                    duration: getWheelSpinDurationMs(Math.abs(currentWheelValue - current), currentLength),
                });
            },
            resume() {
                if (!exiting) return;
                exiting = false;
                apply(latest, false);
            },
        });
        apply(params, true);

        return {
            update(next: {
                value: string;
                delay: number;
                animateOnMount: boolean;
                direction: RollDirection;
                trendSign: -1 | 0 | 1;
                length: number;
                pos?: number;
                numericDiff: number;
                rawValue: number | string;
            }) {
                latest = next;
                exiting = false;
                apply(next, false);
            },
            destroy() {
                wheelPresence.delete(node);
                wheelSettled.delete(node);
                cancelWheelAnimations(node);
            },
        };
    }

    onDestroy(() => {
        motionElement?.querySelectorAll<HTMLElement>("[data-number-flow-color-label]").forEach(cancelTextMotionColor);
    });

    $effect(() => {
        hasMounted = true;
    });

    $effect(() => {
        if (!motionElement) return;
        const next = displayText;
        const reduced = reduceMotion;
        const characters = Array.from(motionElement.querySelectorAll<HTMLElement>("[data-number-flow-color-label]")).filter(node => node.closest(".snowui-number-flow-mask") === motionElement && !node.closest("[inert]"));
        if (reduced) characters.forEach(cancelTextMotionColor);
        if (previousMotionText === undefined) {
            previousMotionText = next;
            return;
        }
        if (next === previousMotionText) return;
        previousMotionText = next;
        if (reduced) return;
        animateTextMotionColorSequence(
            characters,
            resolveTextMotionColor(motionColor),
            characters.map(node => node.dataset.numberFlowColorLabel ?? ""),
            { duration, reverse: true },
        );
    });

    $effect.pre(() => {
        const currentNumeric = displayNumericValue;
        if (currentNumeric === null) return;

        if (previousNumericValue === null) {
            numericDiff = 0;
            trendSign = 0;
            previousNumericValue = currentNumeric;
            return;
        }

        numericDiff = currentNumeric - previousNumericValue;

        const resolvedTrend = resolveTextMotionTrend(
            String(previousNumericValue),
            String(currentNumeric),
            trend,
            motionRole,
        ).trend;
        trendSign =
            trend ||
            resolveTextMotionModuloTrend(
                previousNumericValue,
                currentNumeric,
                digitsModulo,
                motionRole,
            ) ||
            resolvedTrend;

        previousNumericValue = currentNumeric;
    });

    $effect(() => {
        if (!contentMeasureElement) return;
        untrack(scheduleWidthSync);
        const unwatch = resizeManager.watch(contentMeasureElement, (entry) => {
            if (entry.contentRect.width !== measuredContentWidth) scheduleWidthSync();
        });

        return () => unwatch();
    });

    // 宽度策略：
    // 1) 与数字位移同步开始变化
    // 2) 变窄时宽度动画比数字位移动画慢 500ms
    $effect(() => {
        const measured = measuredContentWidth;
        const current = trackWidth;

        if (measured === null) return;
        if (current === null) {
            widthTransitionDurationMs = widthMotionDuration;
            trackWidth = measured;
            return;
        }

        const isShrinking = measured < current;
        widthTransitionDurationMs = reduceMotion || duration === 0
            ? 0
            : isShrinking ? duration + widthSlowOffset : widthMotionDuration;

        if (measured !== current) {
            trackWidth = measured;
            return;
        }
    });

    function animateTrackWidth(content: HTMLElement, options: { width: number | null; duration: number }) {
        const node = content.parentElement!;
        const animations = new Set<Animation>();
        let previousWidth: number | null = null;
        const cancel = () => {
            animations.forEach(animation => animation.cancel());
            animations.clear();
        };
        const update = (next: typeof options) => {
            if (next.width === null) return;
            const previous = previousWidth;
            previousWidth = next.width;
            if (previous === null || next.duration === 0 || !supportsWheelTransitionAnimation()) {
                cancel();
                return;
            }
            const delta = previous - next.width;
            if (delta === 0) return;
            // 用宽度差补偿新的基础宽度，旧补偿继续收敛；快速增减不会重置已有轨迹。
            const animation = node.animate(
                { [WIDTH_DELTA_VAR]: [delta, 0] },
                { duration: next.duration, easing: widthMotionEasing, composite: "accumulate", fill: "both" },
            );
            animations.add(animation);
            animation.finished.then(() => {
                animations.delete(animation);
                animation.cancel();
            }).catch(() => {});
        };
        update(options);
        return { update, destroy: cancel };
    }

    const widthMotionEasing = toCssEasing(MORPH_MOTION.easing);
    const widthTrackStyle = $derived.by(() => {
        const width = trackWidth !== null
            ? `width: calc(${trackWidth}px + var(${WIDTH_DELTA_VAR}, 0) * 1px);`
            : "";
        return [
            "display: inline-flex;",
            "align-items: baseline;",
            "overflow: visible;",
            "font-size: inherit;",
            "line-height: inherit;",
            "will-change: width;",
            width,
        ]
            .filter(Boolean)
            .join(" ");
    });
</script>

{#if effectiveLoading && effectiveSkeleton}
    <Skeleton
        componentClass="snowui-number-flow"
        renderHints={numberFlowRenderHints}
    />
{:else}
    <FramePro
        {tag}
        class={["snowui-number-flow", className].filter(Boolean).join(" ")}
        style={rootStyle}
        data-align={align}
        role="img"
        aria-label={displayText}
        enableAutoLayout={false}
        {enableResponsive}
        {enableContext}
        {enableScaleObserver}
        {enableDefaultMotion}
        {...rest}
    >
        <span
            class="snowui-number-flow-measure"
            aria-hidden="true"
            bind:this={contentMeasureElement}
        >
            {displayText}
        </span>
        <span class="snowui-number-flow-mask" bind:this={motionElement} aria-hidden="true">
            <span class="snowui-number-flow-layout">
                {#if numberPosition === "left"}
                    <FramePro
                        enableResponsive={false}
                        enableContext={false}
                        enableScaleObserver={false}
                        enableDefaultMotion={false}
                        enableAutoLayout={false}
                        class="snowui-number-flow-width-track"
                        style={widthTrackStyle}
                    >
                        <span class="snowui-number-flow-content" use:animateTrackWidth={{ width: trackWidth, duration: widthTransitionDurationMs }}>
                            {#each currentParts as part (part.key)}
                                <span
                                    class="snowui-number-flow-part-track"
                                    data-type={part.type}
                                >
                                    <span
                                        class="snowui-number-flow-part"
                                        use:managePartPresence
                                        onoutrostart={handlePartOutroStart}
                                        in:enterPart={{
                                            duration,
                                            delay: part.type === "minusSign" ? 0 : getPartDelay(part.enterOrder, part.staggerValues),
                                        }}
                                        out:exitPart={{
                                            duration,
                                            delay: part.type === "minusSign" ? 0 : getPartDelay(part.exitOrder, part.staggerValues),
                                        }}
                                    >
                                        {#if part.type === "integer" || part.type === "fraction"}
                                            {@const partLength =
                                                getPartDigitLength(part)}
                                            <span
                                                class="snowui-number-flow-wheel-viewport"
                                                data-number-flow-color-label={part.value}
                                            >
                                                <span
                                                    class="snowui-number-flow-wheel"
                                                    use:rollWheel={{
                                                        value: part.value,
                                                        delay: getPartDelay(
                                                            part.enterOrder,
                                                            part.staggerValues,
                                                        ),
                                                        animateOnMount: hasMounted,
                                                        direction: rollDirection,
                                                        trendSign,
                                                        length: partLength,
                                                        pos: part.pos,
                                                        numericDiff,
                                                        rawValue: value,
                                                    }}
                                                >
                                                    {#each Array.from({ length: partLength }, (_, i) => i) as digitNum (digitNum)}
                                                        <span
                                                            class="snowui-number-flow-digit"
                                                            style="--snowui-number-flow-n: {digitNum}"
                                                            aria-hidden={digitNum !==
                                                                parseWheelDigit(
                                                                    part.value,
                                                                    partLength,
                                                                )}
                                                        >
                                                            {digitNum}
                                                        </span>
                                                    {/each}
                                                </span>
                                            </span>
                                        {:else}
                                            <span class="snowui-number-flow-symbol">
                                                {#each splitTextMotionGraphemes(part.value) as character, index (index)}
                                                    <span data-number-flow-color-label={character}>{character}</span>
                                                {/each}
                                            </span>
                                        {/if}
                                    </span>
                                </span>
                            {/each}
                        </span>
                    </FramePro>

                    {#if children}
                        <span class="snowui-number-flow-extra">
                            {@render children()}
                        </span>
                    {/if}
                {:else}
                    {#if children}
                        <span class="snowui-number-flow-extra">
                            {@render children()}
                        </span>
                    {/if}

                    <FramePro
                        enableResponsive={false}
                        enableContext={false}
                        enableScaleObserver={false}
                        enableDefaultMotion={false}
                        enableAutoLayout={false}
                        class="snowui-number-flow-width-track"
                        style={widthTrackStyle}
                    >
                        <span class="snowui-number-flow-content" use:animateTrackWidth={{ width: trackWidth, duration: widthTransitionDurationMs }}>
                            {#each currentParts as part (part.key)}
                                <span
                                    class="snowui-number-flow-part-track"
                                    data-type={part.type}
                                >
                                    <span
                                        class="snowui-number-flow-part"
                                        use:managePartPresence
                                        onoutrostart={handlePartOutroStart}
                                        in:enterPart={{
                                            duration,
                                            delay: part.type === "minusSign" ? 0 : getPartDelay(part.enterOrder, part.staggerValues),
                                        }}
                                        out:exitPart={{
                                            duration,
                                            delay: part.type === "minusSign" ? 0 : getPartDelay(part.exitOrder, part.staggerValues),
                                        }}
                                    >
                                        {#if part.type === "integer" || part.type === "fraction"}
                                            {@const partLength =
                                                getPartDigitLength(part)}
                                            <span
                                                class="snowui-number-flow-wheel-viewport"
                                                data-number-flow-color-label={part.value}
                                            >
                                                <span
                                                    class="snowui-number-flow-wheel"
                                                    use:rollWheel={{
                                                        value: part.value,
                                                        delay: getPartDelay(
                                                            part.enterOrder,
                                                            part.staggerValues,
                                                        ),
                                                        animateOnMount: hasMounted,
                                                        direction: rollDirection,
                                                        trendSign,
                                                        length: partLength,
                                                        pos: part.pos,
                                                        numericDiff,
                                                        rawValue: value,
                                                    }}
                                                >
                                                    {#each Array.from({ length: partLength }, (_, i) => i) as digitNum (digitNum)}
                                                        <span
                                                            class="snowui-number-flow-digit"
                                                            style="--snowui-number-flow-n: {digitNum}"
                                                            aria-hidden={digitNum !==
                                                                parseWheelDigit(
                                                                    part.value,
                                                                    partLength,
                                                                )}
                                                        >
                                                            {digitNum}
                                                        </span>
                                                    {/each}
                                                </span>
                                            </span>
                                        {:else}
                                            <span class="snowui-number-flow-symbol">
                                                {#each splitTextMotionGraphemes(part.value) as character, index (index)}
                                                    <span data-number-flow-color-label={character}>{character}</span>
                                                {/each}
                                            </span>
                                        {/if}
                                    </span>
                                </span>
                            {/each}
                        </span>
                    </FramePro>
                {/if}
            </span>
        </span>
    </FramePro>
{/if}

<style>
    :global(:where(.snowui-number-flow)) {
        --snowui-number-flow-mask-height: 0.24em;
        --snowui-number-flow-half-mask-height: calc(
            var(--snowui-number-flow-mask-height) / 2
        );
        --snowui-number-flow-mask-width: 0.5em;
        --snowui-number-flow-em-height: 1em;
        display: inline-flex;
        align-items: baseline;
        overflow: visible;
        font-variant-numeric: tabular-nums;
        position: relative;
        white-space: nowrap;
        isolation: isolate;
        line-height: var(--snowui-number-flow-line-height, inherit);
        vertical-align: baseline;
        font-family: var(--snowui-number-flow-font, inherit);
        font-size: var(--snowui-number-flow-size, inherit);
        font-weight: var(--snowui-number-flow-weight, inherit);
        color: var(--snowui-number-flow-color, inherit);
        text-align: var(--snowui-number-flow-align, inherit);
    }

    :global(:where(.snowui-number-flow-mask)) {
        display: inline-flex;
        align-items: baseline;
        width: max-content;
        flex: 0 0 auto;
        overflow: visible;
        margin: calc(-1 * var(--snowui-number-flow-mask-height))
            calc(-1 * var(--snowui-number-flow-mask-width));
        -webkit-mask-image: linear-gradient(
                to right,
                transparent 0,
                black var(--snowui-number-flow-mask-width),
                black calc(100% - var(--snowui-number-flow-mask-width)),
                transparent 100%
            ),
            linear-gradient(
                to bottom,
                transparent 0,
                black var(--snowui-number-flow-mask-height),
                black calc(100% - var(--snowui-number-flow-mask-height)),
                transparent 100%
            ),
            radial-gradient(at bottom right, black 0, transparent 71%),
            radial-gradient(at bottom left, black 0, transparent 71%),
            radial-gradient(at top left, black 0, transparent 71%),
            radial-gradient(at top right, black 0, transparent 71%);
        -webkit-mask-size:
            100% calc(100% - var(--snowui-number-flow-mask-height) * 2),
            calc(100% - var(--snowui-number-flow-mask-width) * 2) 100%,
            var(--snowui-number-flow-mask-width)
                var(--snowui-number-flow-mask-height),
            var(--snowui-number-flow-mask-width)
                var(--snowui-number-flow-mask-height),
            var(--snowui-number-flow-mask-width)
                var(--snowui-number-flow-mask-height),
            var(--snowui-number-flow-mask-width)
                var(--snowui-number-flow-mask-height);
        -webkit-mask-position:
            center,
            center,
            top left,
            top right,
            bottom right,
            bottom left;
        -webkit-mask-repeat: no-repeat;
        mask-image: linear-gradient(
                to right,
                transparent 0,
                black var(--snowui-number-flow-mask-width),
                black calc(100% - var(--snowui-number-flow-mask-width)),
                transparent 100%
            ),
            linear-gradient(
                to bottom,
                transparent 0,
                black var(--snowui-number-flow-mask-height),
                black calc(100% - var(--snowui-number-flow-mask-height)),
                transparent 100%
            ),
            radial-gradient(at bottom right, black 0, transparent 71%),
            radial-gradient(at bottom left, black 0, transparent 71%),
            radial-gradient(at top left, black 0, transparent 71%),
            radial-gradient(at top right, black 0, transparent 71%);
        mask-size:
            100% calc(100% - var(--snowui-number-flow-mask-height) * 2),
            calc(100% - var(--snowui-number-flow-mask-width) * 2) 100%,
            var(--snowui-number-flow-mask-width)
                var(--snowui-number-flow-mask-height),
            var(--snowui-number-flow-mask-width)
                var(--snowui-number-flow-mask-height),
            var(--snowui-number-flow-mask-width)
                var(--snowui-number-flow-mask-height),
            var(--snowui-number-flow-mask-width)
                var(--snowui-number-flow-mask-height);
        mask-position:
            center,
            center,
            top left,
            top right,
            bottom right,
            bottom left;
        mask-repeat: no-repeat;
    }

    :global(:where(.snowui-number-flow-part-track)) {
        display: inline-flex;
        position: relative;
    }

    :global(:where(.snowui-number-flow-measure)) {
        position: absolute;
        display: inline-block;
        visibility: hidden;
        pointer-events: none;
        white-space: pre;
        width: max-content;
        height: var(--snowui-number-flow-em-height);
    }

    :global(:where(.snowui-number-flow-content)) {
        position: relative;
        display: inline-flex;
        align-items: baseline;
        width: max-content;
        flex: 0 0 auto;
    }

    :global(:where(.snowui-number-flow-layout)) {
        display: inline-flex;
        align-items: baseline;
        gap: 0;
        justify-content: flex-start;
        padding: var(--snowui-number-flow-mask-height)
            var(--snowui-number-flow-mask-width);
        width: max-content;
        flex: 0 0 auto;
        overflow: visible;
    }

    :global(:where(.snowui-number-flow-extra)) {
        display: inline-flex;
        align-items: baseline;
        height: var(--snowui-number-flow-em-height);
        flex: 0 0 auto;
    }

    :global(:where(.snowui-number-flow-width-track)) {
        flex: 0 0 auto;
        width: auto;
        overflow: visible;
    }

    :global(:where(.snowui-number-flow-part)) {
        display: inline-flex;
        flex-direction: column;
        position: relative;
    }

    :global(:where(.snowui-number-flow-wheel-viewport)) {
        display: inline-flex;
        align-items: flex-start;
        overflow: visible;
        clip-path: inset(0);
        height: var(--snowui-number-flow-em-height);
        line-height: 1;
        padding-inline: 0;
        margin-inline: 0;
    }

    :global(:where(.snowui-number-flow-wheel)) {
        /* 无限序列轨道：digit 容器只占 1em 高度，digit 通过 absolute 定位 */
        display: inline-block;
        position: relative;
        height: var(--snowui-number-flow-em-height);
        --snowui-number-flow-c: var(
            --snowui-number-flow-wheel-v,
            var(--snowui-number-flow-current, 0)
        );
    }

    :global(:where(.snowui-number-flow-digit)) {
        /* CSS mod() + round() 圆环定位：每个 digit 根据 --snowui-number-flow-n 和 --snowui-number-flow-c 计算偏移 */
        display: inline-flex;
        align-items: baseline;
        justify-content: center;
        height: var(--snowui-number-flow-em-height);
        /* 计算偏移量（无限循环） */
        --snowui-number-flow-offset-raw: mod(
            var(--snowui-number-flow-length) + var(--snowui-number-flow-n) -
                mod(
                    var(--snowui-number-flow-c),
                    var(--snowui-number-flow-length)
                ),
            var(--snowui-number-flow-length)
        );
        --snowui-number-flow-offset: calc(
            var(--snowui-number-flow-offset-raw) -
                var(--snowui-number-flow-length) *
                round(
                    down,
                    var(--snowui-number-flow-offset-raw) /
                        (var(--snowui-number-flow-length) / 2),
                    1
                )
        );
        --snowui-number-flow-y: clamp(
            -100%,
            calc(
                var(--snowui-number-flow-offset) *
                    var(--snowui-number-flow-dir, 1) * 100%
            ),
            100%
        );
        --snowui-number-flow-offset-abs: max(
            var(--snowui-number-flow-offset),
            calc(var(--snowui-number-flow-offset) * -1)
        );
        --snowui-number-flow-visibility: clamp(
            0,
            calc((1.15 - var(--snowui-number-flow-offset-abs)) * 8),
            1
        );
        opacity: var(--snowui-number-flow-visibility);
        transform: translate3d(0, var(--snowui-number-flow-y), 0);
        backface-visibility: hidden;
        will-change: transform, opacity;
    }

    /* 非当前 digit 使用 absolute 定位叠加 */
    :global(:where(.snowui-number-flow-digit)[aria-hidden="true"]) {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
    }

    :global(:where(.snowui-number-flow-symbol)) {
        height: var(--snowui-number-flow-em-height);
        line-height: 1;
        display: flex;
        align-items: baseline;
        mix-blend-mode: plus-lighter;
    }

    :global(:where(.snowui-disabled) :where(.snowui-number-flow-mask)),
    :global(:where([aria-disabled="true"]) :where(.snowui-number-flow-mask)),
    :global(:where(:disabled) :where(.snowui-number-flow-mask)) {
        -webkit-mask-image: none;
        mask-image: none;
    }
</style>
