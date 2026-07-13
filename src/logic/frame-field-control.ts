/**
 * Frame Field Control
 * v1.0.0
 *
 * 统一处理“Frame 外壳 + 原生表单宿主元素”的字段桥接：
 * - value/defaultValue 解析
 * - invalid / aria-invalid 归一
 * - 宿主元素值同步
 *
 * 目标：避免 Input / Textarea / Select 各自重复维护一套字段桥接逻辑。
 */

export type FrameFieldValue = string | number | undefined;

export type FrameFieldHostElement =
    | HTMLInputElement
    | HTMLTextAreaElement
    | HTMLSelectElement;

export interface FrameFieldControlOptions {
    controlType?: string;
    skipTypes?: string[];
}

function normalizeControlType(value?: string) {
    return value?.trim().toLowerCase();
}

function shouldSkipByType(options?: FrameFieldControlOptions) {
    const currentType = normalizeControlType(options?.controlType);
    if (!currentType) return false;

    return (options?.skipTypes ?? []).some(
        (candidate) => normalizeControlType(candidate) === currentType,
    );
}

export function resolveFrameFieldValue<T extends FrameFieldValue>(
    value: T,
    defaultValue: T,
    options?: FrameFieldControlOptions,
): T | undefined {
    if (shouldSkipByType(options)) return undefined;
    return value !== undefined ? value : defaultValue;
}

export function resolveFrameFieldInvalid(
    invalid = false,
    hostProps?: Record<string, any>,
): boolean {
    const ariaInvalid = hostProps?.["aria-invalid"];
    return (
        invalid ||
        ariaInvalid === true ||
        ariaInvalid === "true" ||
        ariaInvalid === ""
    );
}

export function readFrameFieldValue(
    target: EventTarget | null,
    options?: FrameFieldControlOptions,
): string | undefined {
    if (
        !(
            target instanceof HTMLInputElement ||
            target instanceof HTMLTextAreaElement ||
            target instanceof HTMLSelectElement
        )
    ) {
        return undefined;
    }

    const resolvedOptions =
        target instanceof HTMLInputElement
            ? {
                ...options,
                controlType: options?.controlType ?? target.type,
            }
            : options;

    if (shouldSkipByType(resolvedOptions)) return undefined;
    return target.value;
}

export function syncFrameFieldValue(
    target: EventTarget | null,
    assign: (nextValue: string) => void,
    options?: FrameFieldControlOptions,
): boolean {
    const nextValue = readFrameFieldValue(target, options);
    if (nextValue === undefined) return false;
    assign(nextValue);
    return true;
}
