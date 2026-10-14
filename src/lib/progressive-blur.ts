/* SnowUI source notice | LICENSE 2.2.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
export type ProgressiveBlurDirection = "left-to-right" | "right-to-left";
export type EdgeProgressiveBlurDirection =
    | "top-to-bottom"
    | "bottom-to-top"
    | ProgressiveBlurDirection;

export interface EdgeProgressiveBlurOptions {
    direction?: EdgeProgressiveBlurDirection;
    /** Visible height for vertical directions or width for horizontal directions. */
    extent?: string;
    position?: "absolute" | "fixed";
    zIndex?: number;
}

export interface ProgressiveBlurOptions {
    direction?: ProgressiveBlurDirection;
    width?: string;
    layerCount?: number;
    maxBlur?: string;
    minBlur?: string;
    stripWidth?: string;
    sampleExtension?: string;
    leadWidthRatio?: number;
    startRatio?: number;
    endRatio?: number;
    tintColor?: string;
    tintOpacity?: string;
    zIndex?: number;
    featherRatio?: number;
    tailOpacity?: number;
    /**
     * 仅用于 createUniformBlur*：单层背景模糊内侧边缘的羽化比例（占可见宽度的比例，0~1）。
     * 0 = 硬边界；>0 = 在内侧 mask 上加一段线性渐变，使模糊块边缘过渡柔和。
     */
    edgeFeatherRatio?: number;
}

export interface ProgressiveBlurLayerStyle {
    index: number;
    style: string;
}

export interface ProgressiveBlurStyles {
    containerStyle: string;
    layers: ProgressiveBlurLayerStyle[];
}

/** Four layers match the established 80px Site edge treatment. */
const EDGE_BLUR_LAYERS = [
    { blur: "2px", solid: "20%", fade: "100%" },
    { blur: "6px", solid: "16%", fade: "72%" },
    { blur: "12px", solid: "10%", fade: "48%" },
    { blur: "24px", solid: "4%", fade: "28%" },
] as const;

/**
 * Decorative full-edge blur. The host supplies aria-hidden and owns its stacking context.
 * Unsupported backdrop-filter leaves transparent layers and readable content.
 */
export function createEdgeProgressiveBlurStyles(
    options: EdgeProgressiveBlurOptions = {},
): ProgressiveBlurStyles {
    const direction = options.direction ?? "top-to-bottom";
    const vertical = direction === "top-to-bottom" || direction === "bottom-to-top";
    const edge = {
        "top-to-bottom": "top: 0; left: 0; right: 0",
        "bottom-to-top": "bottom: 0; left: 0; right: 0",
        "left-to-right": "left: 0; top: 0; bottom: 0",
        "right-to-left": "right: 0; top: 0; bottom: 0",
    }[direction];
    const gradient = {
        "top-to-bottom": "to bottom",
        "bottom-to-top": "to top",
        "left-to-right": "to right",
        "right-to-left": "to left",
    }[direction];
    const extent = options.extent ?? "80px";
    const size = vertical ? `height: ${extent}` : `width: ${extent}`;
    return {
        containerStyle: [
            `position: ${options.position ?? "absolute"}`,
            edge,
            size,
            options.zIndex === undefined ? "" : `z-index: ${options.zIndex}`,
            "pointer-events: none",
        ].filter(Boolean).join("; "),
        layers: EDGE_BLUR_LAYERS.map((layer, index) => {
            const mask = `linear-gradient(${gradient}, #000 0%, #000 ${layer.solid}, transparent ${layer.fade})`;
            return {
                index,
                style: [
                    "position: absolute",
                    "inset: 0",
                    "pointer-events: none",
                    "background-image: linear-gradient(transparent, transparent)",
                    `-webkit-backdrop-filter: blur(${layer.blur})`,
                    `backdrop-filter: blur(${layer.blur})`,
                    `-webkit-mask-image: ${mask}`,
                    `mask-image: ${mask}`,
                ].join("; "),
            };
        }),
    };
}

export const DEFAULT_PROGRESSIVE_BLUR_LAYER_COUNT = 16;
export const DEFAULT_PROGRESSIVE_BLUR_WIDTH =
    "calc((var(--size-12, 3rem) + var(--size-14, 3.5rem)) / 3)";

const DEFAULT_OPTIONS: Required<ProgressiveBlurOptions> = {
    direction: "left-to-right",
    width: DEFAULT_PROGRESSIVE_BLUR_WIDTH,
    layerCount: DEFAULT_PROGRESSIVE_BLUR_LAYER_COUNT,
    maxBlur: "0.75rem",
    minBlur: "0rem",
    stripWidth: "0.625rem",
    sampleExtension: "4rem",
    leadWidthRatio: 0.32,
    startRatio: 0,
    endRatio: 0.74,
    tintColor: "var(--background-1, #ffffff)",
    tintOpacity: "0%",
    zIndex: 1,
    featherRatio: 2.4,
    tailOpacity: 0,
    edgeFeatherRatio: 0,
};

const clamp = (value: number, min: number, max: number) =>
    Math.min(max, Math.max(min, value));

const formatNumber = (value: number) => {
    const rounded = Math.round(value * 1000) / 1000;
    return String(rounded);
};

const toLength = (width: string, value: number) =>
    `calc(${width} * ${formatNumber(Math.max(0, value))})`;

const normalizeOptions = (
    options: ProgressiveBlurOptions = {},
): Required<ProgressiveBlurOptions> => {
    const layerCount = Math.max(
        1,
        Math.floor(options.layerCount ?? DEFAULT_OPTIONS.layerCount),
    );
    const startRatio = clamp(options.startRatio ?? DEFAULT_OPTIONS.startRatio, 0, 1);
    const endRatio = clamp(
        options.endRatio ?? DEFAULT_OPTIONS.endRatio,
        startRatio,
        1,
    );

    return {
        direction: options.direction ?? DEFAULT_OPTIONS.direction,
        width: options.width ?? DEFAULT_OPTIONS.width,
        layerCount,
        maxBlur: options.maxBlur ?? DEFAULT_OPTIONS.maxBlur,
        minBlur: options.minBlur ?? DEFAULT_OPTIONS.minBlur,
        stripWidth: options.stripWidth ?? DEFAULT_OPTIONS.stripWidth,
        sampleExtension:
            options.sampleExtension ?? DEFAULT_OPTIONS.sampleExtension,
        leadWidthRatio: clamp(
            options.leadWidthRatio ?? DEFAULT_OPTIONS.leadWidthRatio,
            0,
            1,
        ),
        startRatio,
        endRatio,
        tintColor: options.tintColor ?? DEFAULT_OPTIONS.tintColor,
        tintOpacity: options.tintOpacity ?? DEFAULT_OPTIONS.tintOpacity,
        zIndex: options.zIndex ?? DEFAULT_OPTIONS.zIndex,
        featherRatio: clamp(
            options.featherRatio ?? DEFAULT_OPTIONS.featherRatio,
            1,
            4,
        ),
        tailOpacity: clamp(
            options.tailOpacity ?? DEFAULT_OPTIONS.tailOpacity,
            0,
            1,
        ),
        edgeFeatherRatio: clamp(
            options.edgeFeatherRatio ?? DEFAULT_OPTIONS.edgeFeatherRatio,
            0,
            1,
        ),
    };
};

export const createProgressiveBlurContainerStyle = (
    options: ProgressiveBlurOptions = {},
) => {
    const normalized = normalizeOptions(options);
    const horizontalInset =
        normalized.direction === "right-to-left"
            ? "inset-inline-end: 0"
            : "inset-inline-start: 0;";

    return [
        "position: absolute",
        "inset-block: 0",
        horizontalInset,
        `width: calc(${normalized.width} + ${normalized.sampleExtension})`,
        "border-radius: inherit",
        "overflow: hidden",
        "pointer-events: none",
        `z-index: ${normalized.zIndex}`,
        "--snowui-progressive-blur-inset: 0rem",
        `--snowui-progressive-blur-width: ${normalized.width}`,
        `--snowui-progressive-blur-sample-extension: ${normalized.sampleExtension}`,
        `--snowui-progressive-blur-strip-width: ${normalized.stripWidth}`,
        `--snowui-progressive-blur-tint-color: ${normalized.tintColor}`,
        `--snowui-progressive-blur-tint-opacity: ${normalized.tintOpacity}`,
        `--snowui-progressive-blur-lead-width-ratio: ${formatNumber(
            normalized.leadWidthRatio,
        )}`,
    ].join("; ");
};

export const createProgressiveBlurLayerStyles = (
    options: ProgressiveBlurOptions = {},
): ProgressiveBlurLayerStyle[] => {
    const normalized = normalizeOptions(options);
    const gradientDirection =
        normalized.direction === "right-to-left" ? "to left" : "to right";
    const stepCount = normalized.layerCount - 1;
    const range = Math.max(0.001, normalized.endRatio - normalized.startRatio);
    const step = range / Math.max(1, normalized.layerCount - 1);
    const feather = step * normalized.featherRatio;
    const plateau = step * 0.18;

    return Array.from({ length: normalized.layerCount }, (_, index) => {
        const progress = stepCount === 0 ? 1 : index / stepCount;
        const easedProgress = progress * progress;
        const blur =
            index === 0
                ? normalized.maxBlur
                : `calc(${normalized.maxBlur} * ${formatNumber(
                      1 - easedProgress,
                  )} + ${normalized.minBlur} * ${formatNumber(easedProgress)})`;
        const center = normalized.startRatio + step * index;
        const leadingHold =
            index === 0 ? step * normalized.leadWidthRatio : 0;
        const start = clamp(center - feather, 0, normalized.endRatio);
        const fadeIn = clamp(center - plateau, 0, 1);
        const holdEnd = clamp(center + plateau + leadingHold, 0, 1);
        const fadeOut = clamp(
            center + feather + leadingHold,
            start + 0.001,
            normalized.endRatio,
        );
        const layerEnd =
            index === normalized.layerCount - 1 ? normalized.endRatio : fadeOut;
        const localStart = toLength(normalized.width, start);
        const localFadeIn = toLength(normalized.width, fadeIn);
        const localHoldEnd = toLength(normalized.width, holdEnd);
        const localFadeOut = toLength(normalized.width, layerEnd);
        const tailAlpha = formatNumber(normalized.tailOpacity);
        const transparentStop = `rgba(0, 0, 0, ${tailAlpha})`;
        const extendedMaskStops =
            index === 0
                ? `rgba(0, 0, 0, 1) 0, rgba(0, 0, 0, 1) ${localHoldEnd}, ${transparentStop} ${localFadeOut}, ${transparentStop} 100%`
                : index === normalized.layerCount - 1
                  ? `${transparentStop} 0, ${transparentStop} ${localStart}, rgba(0, 0, 0, 1) ${localFadeIn}, ${transparentStop} ${localFadeOut}, ${transparentStop} 100%`
                  : `${transparentStop} 0, ${transparentStop} ${localStart}, rgba(0, 0, 0, 1) ${localFadeIn}, rgba(0, 0, 0, 1) ${localHoldEnd}, ${transparentStop} ${localFadeOut}, ${transparentStop} 100%`;

        return {
            index,
            style: [
                "position: absolute",
                "inset: 0",
                "border-radius: inherit",
                "pointer-events: none",
                "transform: translateZ(0)",
                `background: color-mix(in srgb, var(--snowui-progressive-blur-tint-color) var(--snowui-progressive-blur-tint-opacity), transparent)`,
                `-webkit-backdrop-filter: blur(${blur})`,
                `backdrop-filter: blur(${blur})`,
                `-webkit-mask-image: linear-gradient(${gradientDirection}, ${extendedMaskStops})`,
                `mask-image: linear-gradient(${gradientDirection}, ${extendedMaskStops})`,
            ].join("; "),
        };
    });
};

export const createProgressiveBlurStyles = (
    options: ProgressiveBlurOptions = {},
): ProgressiveBlurStyles => ({
    containerStyle: createProgressiveBlurContainerStyle(options),
    layers: createProgressiveBlurLayerStyles(options),
});

// 单层、固定强度、硬边界的“普通背景模糊”。复用与渐进式模糊相同的容器与定位，
// 但只生成一层 backdrop-filter 且 mask 在可见宽度处直接截断，方便和渐进式模糊做 A/B 对比。
export const createUniformBlurLayerStyles = (
    options: ProgressiveBlurOptions = {},
): ProgressiveBlurLayerStyle[] => {
    const normalized = normalizeOptions(options);
    const gradientDirection =
        normalized.direction === "right-to-left" ? "to left" : "to right";
    const tailAlpha = formatNumber(normalized.tailOpacity);
    const transparentStop = `rgba(0, 0, 0, ${tailAlpha})`;
    // 内侧边缘羽化：从 (endRatio - edgeFeatherRatio) 处由实心线性过渡到 endRatio 处的透明。
    // edgeFeatherRatio 为 0 时退化为硬边界。
    const solidEnd = toLength(
        normalized.width,
        Math.max(0, normalized.endRatio - normalized.edgeFeatherRatio),
    );
    const fadeEnd = toLength(normalized.width, normalized.endRatio);
    const maskStops = `rgba(0, 0, 0, 1) 0, rgba(0, 0, 0, 1) ${solidEnd}, ${transparentStop} ${fadeEnd}, ${transparentStop} 100%`;

    return [
        {
            index: 0,
            style: [
                "position: absolute",
                "inset: 0",
                "border-radius: inherit",
                "pointer-events: none",
                "transform: translateZ(0)",
                `background: color-mix(in srgb, var(--snowui-progressive-blur-tint-color) var(--snowui-progressive-blur-tint-opacity), transparent)`,
                `-webkit-backdrop-filter: blur(${normalized.maxBlur})`,
                `backdrop-filter: blur(${normalized.maxBlur})`,
                `-webkit-mask-image: linear-gradient(${gradientDirection}, ${maskStops})`,
                `mask-image: linear-gradient(${gradientDirection}, ${maskStops})`,
            ].join("; "),
        },
    ];
};

export const createUniformBlurStyles = (
    options: ProgressiveBlurOptions = {},
): ProgressiveBlurStyles => ({
    containerStyle: createProgressiveBlurContainerStyle(options),
    layers: createUniformBlurLayerStyles(options),
});
