import type { MotionConfig } from "../../logic/motion-config";

export function getMotionTotalDurationMs(motion: MotionConfig): number {
    const duration = typeof motion.duration === "number" ? motion.duration : 0;
    const delay = typeof motion.delay === "number" ? motion.delay : 0;
    return duration + delay;
}

export function motionMsVar(value: unknown, fallbackMs: number): string {
    return `${typeof value === "number" ? value : fallbackMs}ms`;
}
