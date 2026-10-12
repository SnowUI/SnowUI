/* SnowUI source notice | LICENSE 2.0.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
import type { FrameProps } from "./frame-types";
import type { ScaleObserverOptions } from "./frame-scale-observer.svelte";

/**
 * Scale 配置解析器
 * - 统一处理 Frame -> scale observer 的参数映射
 * - 统一处理 Frame -> scale.css 的 props 变量注入
 */
export function resolveScaleObserverOptions(
    frameProps: FrameProps,
): ScaleObserverOptions {
    return {
        heightVar: frameProps.scaleHeightVar || "--scale-height-runtime",
        widthVar: frameProps.scaleWidthVar || "--scale-width-runtime",
        aspectRatioVar:
            frameProps.scaleAspectRatioVar ||
            "--scale-aspect-ratio-runtime",
        sizeVar: frameProps.scaleSizeVar || "--scale-size-runtime",
        target: frameProps.scaleObserverTarget || "self",
        basis: frameProps.scaleBasis || "height",
        mixHeightWeight:
            frameProps.scaleMixHeightWeight !== undefined
                ? frameProps.scaleMixHeightWeight
                : 0.5,
        aspectBaseRatio:
            frameProps.scaleAspectBaseRatio !== undefined
                ? frameProps.scaleAspectBaseRatio
                : 1,
        sizeRatio:
            frameProps.sizeRatio !== undefined ? frameProps.sizeRatio : 1,
    };
}

export function resolveScaleStyleVars(frameProps: FrameProps): string[] {
    return [
        frameProps.size !== undefined
            ? `--scale-size-prop: ${frameProps.size}px`
            : "",
        frameProps.sizeRatio !== undefined
            ? `--scale-size-ratio-prop: ${frameProps.sizeRatio}`
            : "",
        frameProps.iconSizeRatio !== undefined
            ? `--scale-icon-ratio-prop: ${frameProps.iconSizeRatio}`
            : "",
        frameProps.avatarSizeRatio !== undefined
            ? `--scale-avatar-ratio-prop: ${frameProps.avatarSizeRatio}`
            : "",
        frameProps.scaleMixHeightWeight !== undefined
            ? `--scale-mix-height-weight-prop: ${frameProps.scaleMixHeightWeight}`
            : "",
        frameProps.scaleAspectBaseRatio !== undefined
            ? `--scale-aspect-base-ratio-prop: ${frameProps.scaleAspectBaseRatio}`
            : "",
    ].filter(Boolean);
}

