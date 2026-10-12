/* SnowUI source notice | LICENSE 2.0.0: ../../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
import type { MotionConfig } from "../../logic/motion-config";

export function getMotionTotalDurationMs(motion: MotionConfig): number {
    const duration = typeof motion.duration === "number" ? motion.duration : 0;
    const delay = typeof motion.delay === "number" ? motion.delay : 0;
    return duration + delay;
}

export function motionMsVar(value: unknown, fallbackMs: number): string {
    return `${typeof value === "number" ? value : fallbackMs}ms`;
}
