/* SnowUI source notice | LICENSE 2.2.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
import { RESIZE_MOTION } from "../motion/presets/resize";

/** 宽度驱动的退出进度；requiredWidth 是宿主下一次收起项目的宽度阈值。 */
export function getResponsiveExitOpacity(availableWidth: number, requiredWidth: number, fadeDistance: number): number {
    return Math.max(0, Math.min(1, (availableWidth - requiredWidth) / Math.max(1, fadeDistance)));
}

/** 每个宿主一个实例；只管理退出进度与停留恢复，不测量或修改布局。 */
export function createResponsiveExit(onRecover: (opacity: number) => void) {
    let previousWidth: number | undefined;
    let previousKey = '';
    let lastRaw = 1;
    let opacity = 1;
    let settled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let frame = 0;
    let resume: {width: number; opacity: number} | undefined;
    function cancel() {
        clearTimeout(timer);
        if (frame) cancelAnimationFrame(frame);
        frame = 0;
    }
    function settle() {
        settled = true;
        const from = opacity;
        const start = performance.now();
        const recover = (now: number) => {
            const progress = Math.min(1, (now - start) / (RESIZE_MOTION.duration ?? 250));
            opacity = from + (1 - from) * (1 - (1 - progress) ** 3);
            onRecover(opacity);
            frame = progress < 1 ? requestAnimationFrame(recover) : 0;
        };
        if (from < 1) frame = requestAnimationFrame(recover);
    }
    return {
        update(width: number, required: number, distance: number, key: string) {
            const changed = width !== previousWidth;
            const targetChanged = key !== previousKey;
            if (targetChanged) {
                cancel();
                resume = undefined;
                settled = false;
                opacity = 1;
            }
            if (changed || targetChanged) {
                if (!targetChanged && settled && lastRaw < 1 && previousWidth !== undefined) {
                    resume = {width: previousWidth, opacity};
                }
                cancel();
                settled = false;
                // 相同宽度的重复测量不能延长恢复等待；目标改变则开始新的生命周期。
                if (key) timer = setTimeout(settle, 1000);
                previousWidth = width;
                previousKey = key;
            }
            lastRaw = key ? getResponsiveExitOpacity(width, required, distance) : 1;
            if (!key) return opacity = 1;
            if (!settled) {
                opacity = resume
                    ? width <= resume.width
                        ? resume.opacity * getResponsiveExitOpacity(width, required, resume.width - required)
                        : Math.min(1, resume.opacity + (width - resume.width) / Math.max(1, distance))
                    : lastRaw;
            }
            return opacity;
        },
        destroy: cancel,
    };
}
