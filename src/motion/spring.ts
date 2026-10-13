/* SnowUI source notice | LICENSE 2.2.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
import type { MotionConfig } from "../logic/motion-config";

const DEFAULT_SPRING_STIFFNESS = 170;
const DEFAULT_SPRING_DAMPING = 26;
const DEFAULT_SPRING_MASS = 1;
const DEFAULT_SPRING_DURATION_MS = 500;
const SPRING_SAMPLE_COUNT = 40;

function sampleSpringProgress(
    elapsedSeconds: number,
    stiffness: number,
    damping: number,
    mass: number,
): number {
    const angularFrequency = Math.sqrt(stiffness / mass);
    const dampingRatio = damping / (2 * Math.sqrt(stiffness * mass));

    if (dampingRatio < 1) {
        const dampedFrequency = angularFrequency * Math.sqrt(1 - dampingRatio ** 2);
        const envelope = Math.exp(-dampingRatio * angularFrequency * elapsedSeconds);
        const displacement = envelope * (
            Math.cos(dampedFrequency * elapsedSeconds) +
            (dampingRatio * angularFrequency / dampedFrequency) *
                Math.sin(dampedFrequency * elapsedSeconds)
        );
        return 1 - displacement;
    }

    if (dampingRatio === 1) {
        const displacement = Math.exp(-angularFrequency * elapsedSeconds) *
            (1 + angularFrequency * elapsedSeconds);
        return 1 - displacement;
    }

    const root = Math.sqrt(dampingRatio ** 2 - 1);
    const slowRoot = -angularFrequency * (dampingRatio - root);
    const fastRoot = -angularFrequency * (dampingRatio + root);
    const slowCoefficient = -fastRoot / (slowRoot - fastRoot);
    const fastCoefficient = slowRoot / (slowRoot - fastRoot);
    const displacement = slowCoefficient * Math.exp(slowRoot * elapsedSeconds) +
        fastCoefficient * Math.exp(fastRoot * elapsedSeconds);
    return 1 - displacement;
}

function formatSample(value: number): string {
    return Number(value.toFixed(5)).toString();
}

export function resolveMotionCssTiming(
    config: Pick<
        MotionConfig,
        "type" | "duration" | "easing" | "stiffness" | "damping" | "mass"
    >,
    fallbackDurationMs = 300,
): { duration: number; easing: string } {
    const duration = config.duration ??
        (config.type === "spring" ? DEFAULT_SPRING_DURATION_MS : fallbackDurationMs);

    if (config.type !== "spring") {
        const easingMap: Record<string, string> = {
            linear: "linear",
            easeIn: "ease-in",
            easeOut: "ease-out",
            easeInOut: "ease-in-out",
        };
        return {
            duration,
            easing: config.easing
                ? easingMap[config.easing] ?? config.easing
                : "ease-out",
        };
    }

    const stiffness = config.stiffness ?? DEFAULT_SPRING_STIFFNESS;
    const damping = config.damping ?? DEFAULT_SPRING_DAMPING;
    const mass = config.mass ?? DEFAULT_SPRING_MASS;
    const samples: string[] = [];

    for (let index = 0; index <= SPRING_SAMPLE_COUNT; index += 1) {
        const ratio = index / SPRING_SAMPLE_COUNT;
        const progress = index === SPRING_SAMPLE_COUNT
            ? 1
            : sampleSpringProgress(
                (duration * ratio) / 1000,
                stiffness,
                damping,
                mass,
            );
        samples.push(`${formatSample(progress)} ${formatSample(ratio * 100)}%`);
    }

    return {
        duration,
        easing: `linear(${samples.join(", ")})`,
    };
}
