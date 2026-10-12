/* SnowUI source notice | LICENSE 2.0.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
import type { ResourceSize } from "../context";

export const DEFAULT_RESOURCE_SIZE: ResourceSize = 16;
export const DEFAULT_RESOURCE_SIZE_TOKEN = "var(--size-4)";

export const RESOURCE_SIZE_TOKENS: Record<ResourceSize, string> = {
    12: "calc(var(--size-4) * 3 / 4)",
    16: "var(--size-4)",
    20: "var(--size-5)",
    24: "var(--size-6)",
    28: "var(--size-7)",
    32: "var(--size-8)",
    40: "var(--size-10)",
    48: "var(--size-12)",
    80: "var(--size-20)",
};

export const RESOURCE_SIZE_REM_VALUES: Record<ResourceSize, number> = {
    12: 0.75,
    16: 1,
    20: 1.25,
    24: 1.5,
    28: 1.75,
    32: 2,
    40: 2.5,
    48: 3,
    80: 5,
};

export function resolveResourceSizeToken(
    size: ResourceSize | number | string | undefined,
    fallback: string = DEFAULT_RESOURCE_SIZE_TOKEN,
): string {
    if (typeof size === "number") {
        const mapped = RESOURCE_SIZE_TOKENS[size as ResourceSize];
        if (mapped) return mapped;
        if (Number.isFinite(size) && size > 0) {
            return `calc(var(--size-4) * ${size} / 16)`;
        }
    }
    if (typeof size === "string" && size.trim() !== "") {
        return size;
    }
    return fallback;
}

export function resolveResourceSizeRemValue(
    size: ResourceSize | number | undefined,
): number | undefined {
    if (typeof size !== "number") return undefined;
    return RESOURCE_SIZE_REM_VALUES[size as ResourceSize];
}

