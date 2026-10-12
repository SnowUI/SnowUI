/* SnowUI source notice | LICENSE 2.1.0: ../../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
export type TextMotionFormattableValue = string | number;

export function formatTextMotionValue(
    value: TextMotionFormattableValue,
    locales = "en-US",
    format?: Intl.NumberFormatOptions,
) {
    if (typeof value !== "number") return String(value);
    return new Intl.NumberFormat(locales, format ?? {}).format(value);
}

// 每个消费者持有自己的 formatter，避免全局缓存增长和跨实例参数污染。
export function createTextMotionFormatter(
    locales = "en-US",
    format?: Intl.NumberFormatOptions,
) {
    const options = { ...format };
    let formatter: Intl.NumberFormat | undefined;
    return (value: string | number) => {
        if (typeof value !== "number") return String(value);
        formatter ??= new Intl.NumberFormat(locales, options);
        return formatter.format(value);
    };
}
