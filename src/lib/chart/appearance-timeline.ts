/* SnowUI source notice | LICENSE 2.3.0: ../../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
import { clamp } from "./geometry";

export const SEGMENT_APPEARANCE_FILL_DURATION = 500;
export const SEGMENT_APPEARANCE_OPACITY_DURATION = 750;
export const SEGMENT_APPEARANCE_FILL_DECAY = 0.78;
export const SEGMENT_APPEARANCE_MIN_FILL_DURATION = 130;
export const SEGMENT_APPEARANCE_TAIL_BASE_TOTAL_DURATION = 400;
export const SEGMENT_APPEARANCE_TAIL_STRETCH = 0.75;

export interface SegmentAppearanceTimeline {
    fillProgress: number;
    opacityProgress: number;
}

export interface SegmentAppearanceTimelineOptions {
    startDelay?: number;
    durationMode?: "decay" | "tailOut" | "fixed";
    localEasing?: "linear" | "easeOut";
    localEasingPower?: number;
    totalDuration?: number;
    fillDuration?: number;
    opacityMode?: "duration" | "fill";
}

function easeOut(progress: number, power = 3) {
    const safeProgress = clamp(progress, 0, 1);
    const safePower = Number.isFinite(power) ? Math.max(1, power) : 3;
    return 1 - Math.pow(1 - safeProgress, safePower);
}

function easeInCubic(progress: number) {
    const safeProgress = clamp(progress, 0, 1);
    return safeProgress * safeProgress * safeProgress;
}

function resolveLocalProgress(
    progress: number,
    easing: "linear" | "easeOut",
    power?: number,
) {
    const safeProgress = clamp(progress, 0, 1);
    return easing === "easeOut" ? easeOut(safeProgress, power) : safeProgress;
}

export function resolveSegmentAppearanceFillDuration(order: number) {
    return Math.max(
        SEGMENT_APPEARANCE_MIN_FILL_DURATION,
        SEGMENT_APPEARANCE_FILL_DURATION *
            Math.pow(SEGMENT_APPEARANCE_FILL_DECAY, order),
    );
}

function resolveTailOutFillDurations(
    count: number,
    options: SegmentAppearanceTimelineOptions = {},
) {
    if (count <= 0) return [];
    if (count === 1) {
        return [
            typeof options.totalDuration === "number"
                ? Math.max(0, options.totalDuration)
                : SEGMENT_APPEARANCE_FILL_DURATION,
        ];
    }

    const weights = Array.from({ length: count }, (_, order) => {
        const normalizedOrder = order / Math.max(1, count - 1);
        return 1 + SEGMENT_APPEARANCE_TAIL_STRETCH * easeInCubic(normalizedOrder);
    });
    const weightTotal = weights.reduce((total, value) => total + value, 0);
    const totalDuration =
        typeof options.totalDuration === "number"
            ? Math.max(0, options.totalDuration)
            : Math.max(
                  SEGMENT_APPEARANCE_FILL_DURATION,
                  count * SEGMENT_APPEARANCE_TAIL_BASE_TOTAL_DURATION,
              );
    return weights.map((weight) =>
        typeof options.totalDuration === "number"
            ? (totalDuration * weight) / weightTotal
            : Math.max(
                  SEGMENT_APPEARANCE_MIN_FILL_DURATION,
                  (totalDuration * weight) / weightTotal,
              ),
    );
}

interface SegmentAppearanceSchedule {
    fillDurations: number[];
    startOffsets: number[];
    totalDuration: number;
}

/**
 * 为一帧内的全部数据项一次性建立时间表。
 *
 * Chart 的出现进度会在动画期间逐帧更新。这里把每项时长和前缀偏移合并为
 * 一次线性扫描，避免逐项解析时重复生成完整时长数组与重复累计前序偏移。
 */
function resolveSegmentAppearanceSchedule(
    count: number,
    options: SegmentAppearanceTimelineOptions = {},
): SegmentAppearanceSchedule {
    if (count <= 0) {
        return {
            fillDurations: [],
            startOffsets: [],
            totalDuration: SEGMENT_APPEARANCE_OPACITY_DURATION,
        };
    }

    let fillDurations: number[];
    if (options.durationMode === "fixed") {
        const duration = Math.max(
            0,
            options.fillDuration ?? SEGMENT_APPEARANCE_FILL_DURATION,
        );
        fillDurations = Array.from({ length: count }, () => duration);
    } else if (options.durationMode === "decay") {
        fillDurations = Array.from({ length: count }, (_, order) =>
            resolveSegmentAppearanceFillDuration(order),
        );
    } else {
        fillDurations = resolveTailOutFillDurations(count, options);
    }

    const startOffsets = new Array<number>(count);
    const startDelay =
        typeof options.startDelay === "number"
            ? Math.max(0, options.startDelay)
            : undefined;
    let prefixOffset = 0;
    for (let order = 0; order < count; order += 1) {
        startOffsets[order] =
            startDelay === undefined ? prefixOffset : startDelay * order;
        prefixOffset += fillDurations[order] ?? 0;
    }

    const lastOrder = count - 1;
    const totalDuration =
        typeof options.totalDuration === "number"
            ? Math.max(0, options.totalDuration)
            : (startOffsets[lastOrder] ?? 0) +
              Math.max(
                  fillDurations[lastOrder] ?? 0,
                  SEGMENT_APPEARANCE_OPACITY_DURATION,
              );
    return { fillDurations, startOffsets, totalDuration };
}

export function resolveSegmentAppearanceFillDurationByOptions(
    order: number,
    count: number,
    options: SegmentAppearanceTimelineOptions = {},
) {
    if (options.durationMode === "fixed") {
        return Math.max(
            0,
            options.fillDuration ?? SEGMENT_APPEARANCE_FILL_DURATION,
        );
    }
    if (options.durationMode === "decay") {
        return resolveSegmentAppearanceFillDuration(order);
    }
    return resolveTailOutFillDurations(count, options)[order] ?? 0;
}

export function resolveSegmentAppearanceStartOffset(
    order: number,
    count: number = order + 1,
    options: SegmentAppearanceTimelineOptions = {},
) {
    let offset = 0;
    for (let index = 0; index < order; index += 1) {
        offset += resolveSegmentAppearanceFillDurationByOptions(
            index,
            count,
            options,
        );
    }
    return offset;
}

export function resolveSegmentAppearanceStartOffsetByOptions(
    order: number,
    count: number,
    options: SegmentAppearanceTimelineOptions = {},
) {
    if (typeof options.startDelay === "number") {
        return Math.max(0, options.startDelay) * order;
    }
    return resolveSegmentAppearanceStartOffset(order, count, options);
}

export function resolveAppearanceTimelineDuration(
    count: number,
    options: SegmentAppearanceTimelineOptions = {},
) {
    return resolveSegmentAppearanceSchedule(count, options).totalDuration;
}

export function resolveSegmentAppearanceTimelines(
    count: number,
    startIndex: number,
    progress: number,
    options: SegmentAppearanceTimelineOptions = {},
): SegmentAppearanceTimeline[] {
    if (count <= 0) return [];
    const schedule = resolveSegmentAppearanceSchedule(count, options);
    const elapsed = clamp(progress, 0, 1) * schedule.totalDuration;
    const timelines = Array.from({ length: count }, () => ({
        fillProgress: 0,
        opacityProgress: 0,
    }));
    for (let order = 0; order < count; order += 1) {
        const index = (startIndex + order) % count;
        const startOffset = schedule.startOffsets[order] ?? 0;
        const localElapsed = elapsed - startOffset;
        const localEasing = options.localEasing ?? "linear";
        const fillProgress = resolveLocalProgress(
            localElapsed / (schedule.fillDurations[order] ?? 0),
            localEasing,
            options.localEasingPower,
        );
        timelines[index] = {
            fillProgress,
            opacityProgress:
                options.opacityMode === "fill"
                    ? fillProgress
                    : resolveLocalProgress(
                          localElapsed / SEGMENT_APPEARANCE_OPACITY_DURATION,
                          localEasing,
                          options.localEasingPower,
                      ),
        };
    }
    return timelines;
}

export function buildOpacityMaskColor(progress: number, initialOpacity: number) {
    const opacity = initialOpacity + (1 - initialOpacity) * progress;
    const channel = Math.round(clamp(opacity, 0, 1) * 255);
    return `rgb(${channel} ${channel} ${channel})`;
}
