/* SnowUI source notice | LICENSE 2.1.0: ../../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
import type { TextMotionRole, TextMotionTrend } from "./types";

export interface ResolvedTextMotionTrend {
    trend: TextMotionTrend;
    isNumericArithmetic: boolean;
    isTimerArithmetic: boolean;
}

interface TextMotionClockValue {
    total: number;
    modulus: number;
    parts: number[];
}

export function extractTextMotionNumber(value: string) {
    const matches = value.match(
        /[-+]?[\d,，]+(?:[.．]\d+)?|[-+]?[.．]\d+/g,
    );
    if (!matches) return undefined;

    for (let i = matches.length - 1; i >= 0; i -= 1) {
        const normalized = matches[i]
            .replace(/[，,]/g, "")
            .replace("．", ".");
        const numeric = Number.parseFloat(normalized);
        if (Number.isFinite(numeric)) return numeric;
    }
    return undefined;
}

export function extractTextMotionClock(value: string): TextMotionClockValue | undefined {
    const matches = value.match(/\d+(?:[:：]\d+){1,}/g);
    if (!matches) return undefined;

    for (let i = matches.length - 1; i >= 0; i -= 1) {
        const parts = matches[i].split(/[:：]/).map((part) => Number.parseInt(part, 10));
        if (
            parts.length < 2 ||
            parts.some((part) => !Number.isFinite(part) || part < 0)
        ) {
            continue;
        }
        if (parts.slice(1).some((part) => part > 59)) continue;

        const total = parts.reduce((sum, part) => sum * 60 + part, 0);
        const modulus = 60 ** parts.length;
        return { total, modulus, parts };
    }

    return undefined;
}

function resolveClockTrend(
    previousClock: TextMotionClockValue | undefined,
    nextClock: TextMotionClockValue | undefined,
): TextMotionTrend {
    if (
        !previousClock ||
        !nextClock ||
        previousClock.parts.length !== nextClock.parts.length ||
        previousClock.modulus !== nextClock.modulus ||
        previousClock.total === nextClock.total
    ) {
        return 0;
    }

    return resolveTextMotionModuloTrend(
        previousClock.total,
        nextClock.total,
        previousClock.modulus,
    );
}

export function resolveTextMotionModuloTrend(
    previousValue: number | null | undefined,
    nextValue: number | null | undefined,
    modulus: number | null | undefined,
    motionRole: TextMotionRole = "auto",
): TextMotionTrend {
    if (motionRole === "number" || motionRole === "text") return 0;

    if (
        typeof previousValue !== "number" ||
        typeof nextValue !== "number" ||
        !Number.isFinite(previousValue) ||
        !Number.isFinite(nextValue) ||
        typeof modulus !== "number" ||
        !Number.isFinite(modulus) ||
        modulus <= 1
    ) {
        return 0;
    }

    const normalizedModulus = Math.max(2, Math.floor(modulus));
    const previous = ((previousValue % normalizedModulus) + normalizedModulus) %
        normalizedModulus;
    const next = ((nextValue % normalizedModulus) + normalizedModulus) %
        normalizedModulus;
    if (previous === next) return 0;

    const rawDelta = next - previous;
    const candidates = [
        rawDelta,
        rawDelta + normalizedModulus,
        rawDelta - normalizedModulus,
    ];
    const delta = candidates.reduce((best, candidate) => {
        const bestAbs = Math.abs(best);
        const candidateAbs = Math.abs(candidate);
        if (candidateAbs < bestAbs) return candidate;
        return best;
    });

    if (delta > 0) return 1;
    if (delta < 0) return -1;
    return 0;
}

export function resolveTextMotionTrend(
    previousValue: string,
    nextValue: string,
    requestedTrend: TextMotionTrend,
    motionRole: TextMotionRole = "auto",
): ResolvedTextMotionTrend {
    const previousClock = extractTextMotionClock(previousValue);
    const nextClock = extractTextMotionClock(nextValue);
    const role = motionRole ?? "auto";
    if (role === "text") {
        return {
            trend: requestedTrend,
            isTimerArithmetic: false,
            isNumericArithmetic: false,
        };
    }
    const allowsClock = role === "auto" || role === "timer" || role === "countdown";
    const allowsNumber = role === "auto" || role === "number";
    const clockTrend = allowsClock ? resolveClockTrend(previousClock, nextClock) : 0;
    const previousNumber = extractTextMotionNumber(previousValue);
    const nextNumber = extractTextMotionNumber(nextValue);
    const isUnitTimerArithmetic =
        !clockTrend &&
        (role === "timer" || role === "countdown") &&
        previousNumber !== undefined &&
        nextNumber !== undefined &&
        Number.isInteger(previousNumber) &&
        Number.isInteger(nextNumber) &&
        previousNumber >= 0 &&
        previousNumber <= 59 &&
        nextNumber >= 0 &&
        nextNumber <= 59;
    const unitClockTrend: TextMotionTrend = isUnitTimerArithmetic
        ? resolveTextMotionModuloTrend(previousNumber, nextNumber, 60, role)
        : 0;
    const numberTrend: TextMotionTrend =
        previousNumber !== undefined &&
        nextNumber !== undefined &&
        previousNumber !== nextNumber
            ? nextNumber > previousNumber
                ? 1
                : -1
            : 0;
    const autoTrend: TextMotionTrend =
        clockTrend || unitClockTrend || (allowsNumber ? numberTrend : 0);
    const trend = requestedTrend || autoTrend;
    const isTimerArithmetic =
        trend !== 0 &&
        allowsClock &&
        ((nextClock !== undefined &&
            (requestedTrend !== 0 || previousClock !== undefined)) ||
            isUnitTimerArithmetic);

    return {
        trend,
        isTimerArithmetic,
        isNumericArithmetic:
            trend !== 0 &&
            (isTimerArithmetic ||
                (allowsNumber &&
                    nextNumber !== undefined &&
                    (requestedTrend !== 0 || previousNumber !== undefined))),
    };
}

export function createRightToLeftOrder(indices: number[]) {
    return new Map(
        [...indices]
            .reverse()
            .map((index, order): [number, number] => [index, order]),
    );
}

export function getTextMotionNumberSign(value: number | null | undefined) {
    return typeof value === "number" && Number.isFinite(value) && value < 0
        ? -1
        : 1;
}

export function mapDigitToSignedAxis(
    digit: number,
    length: number,
    numericValue: number | null | undefined,
) {
    const normalizedLength = Math.max(1, Math.floor(length));
    const normalizedDigit =
        ((digit % normalizedLength) + normalizedLength) % normalizedLength;

    if (getTextMotionNumberSign(numericValue) < 0) {
        return (normalizedLength - normalizedDigit) % normalizedLength;
    }

    return normalizedDigit;
}
