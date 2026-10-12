/* SnowUI source notice | LICENSE 2.1.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
export const DEFAULT_DATE_LOCALE = "en-US";
export const DEFAULT_DATE_EMPTY_VALUE = "—";

export type DateInput = Date | number | string;
export type DateFormatStyle = "short" | "medium" | "long" | "full";
export type TimeFormatStyle = "short" | "medium" | "long" | "full";

export interface DateFormatOptions {
    locale?: string;
    format?: DateFormatStyle;
    relative?: boolean;
    includeTime?: boolean;
    timeFormat?: TimeFormatStyle;
    use24Hour?: boolean;
    now?: Date | number;
    emptyValue?: string;
}

export function mergeDateFormatOptions(
    ...options: (DateFormatOptions | undefined)[]
): DateFormatOptions {
    return Object.assign({}, ...options.filter(Boolean));
}

function toDate(value: DateInput) {
    const date = value instanceof Date ? new Date(value.getTime()) : new Date(value);
    return Number.isNaN(date.getTime()) ? undefined : date;
}

function isSameDay(left: Date, right: Date) {
    return left.getFullYear() === right.getFullYear()
        && left.getMonth() === right.getMonth()
        && left.getDate() === right.getDate();
}

function calendarDayDifference(date: Date, now: Date) {
    const day = 24 * 60 * 60 * 1000;
    const dateUtc = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
    const nowUtc = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
    return Math.round((dateUtc - nowUtc) / day);
}

function formatClock(date: Date, locale: string, use24Hour?: boolean) {
    return new Intl.DateTimeFormat(locale, {
        hour: use24Hour ? "2-digit" : "numeric",
        minute: "2-digit",
        hour12: use24Hour === undefined ? undefined : !use24Hour,
    }).format(date);
}

function relativeUnit(locale: string, value: number, unit: Intl.RelativeTimeFormatUnit) {
    return new Intl.RelativeTimeFormat(locale, { numeric: "always" }).format(value, unit);
}

function formatRelativeDate(date: Date, options: DateFormatOptions) {
    const locale = options.locale ?? DEFAULT_DATE_LOCALE;
    const now = options.now instanceof Date
        ? options.now
        : new Date(options.now ?? Date.now());
    const delta = date.getTime() - now.getTime();
    const future = delta > 0;
    const seconds = Math.floor(Math.abs(delta) / 1000);
    const minutes = Math.max(1, Math.floor(seconds / 60));
    const hours = Math.max(1, Math.floor(minutes / 60));
    const dayDifference = calendarDayDifference(date, now);
    const language = locale.toLowerCase();
    const chinese = language.startsWith("zh");
    const english = language.startsWith("en");

    if (seconds < 60) {
        if (chinese) return future ? "即将" : "刚刚";
        if (english) return future ? "Shortly" : "Just now";
        return relativeUnit(locale, 0, "second");
    }
    if (minutes < 60) return relativeUnit(locale, future ? minutes : -minutes, "minute");
    if (hours < 12) return relativeUnit(locale, future ? hours : -hours, "hour");

    if (isSameDay(date, now)) {
        const clock = formatClock(date, locale, options.use24Hour);
        if (chinese) return `今天 ${clock}`;
        if (english) return `Today, ${clock}`;
        return new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(0, "day") + `, ${clock}`;
    }
    if (dayDifference === -1) return chinese ? "昨天" : english ? "Yesterday" : new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(-1, "day");
    if (dayDifference === 1) return chinese ? "明天" : english ? "Tomorrow" : new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(1, "day");

    return formatAbsoluteDate(date, { ...options, relative: false, includeTime: false });
}

function formatAbsoluteDate(date: Date, options: DateFormatOptions) {
    const locale = options.locale ?? DEFAULT_DATE_LOCALE;
    const dateStyle = options.format ?? "medium";
    const intlOptions: Intl.DateTimeFormatOptions = { dateStyle };
    if (options.includeTime) {
        intlOptions.timeStyle = options.timeFormat ?? "short";
        if (options.use24Hour !== undefined) intlOptions.hour12 = !options.use24Hour;
    }
    return new Intl.DateTimeFormat(locale, intlOptions).format(date);
}

export function formatDate(value: DateInput, options: DateFormatOptions = {}) {
    const date = toDate(value);
    if (!date) return options.emptyValue ?? DEFAULT_DATE_EMPTY_VALUE;
    return options.relative
        ? formatRelativeDate(date, options)
        : formatAbsoluteDate(date, options);
}

export function formatDateRange(
    start: DateInput,
    end: DateInput,
    options: DateFormatOptions = {},
) {
    const startDate = toDate(start);
    const endDate = toDate(end);
    if (!startDate || !endDate) return options.emptyValue ?? DEFAULT_DATE_EMPTY_VALUE;

    const locale = options.locale ?? DEFAULT_DATE_LOCALE;
    const intlOptions: Intl.DateTimeFormatOptions = { dateStyle: options.format ?? "medium" };
    if (options.includeTime) {
        intlOptions.timeStyle = options.timeFormat ?? "short";
        if (options.use24Hour !== undefined) intlOptions.hour12 = !options.use24Hour;
    }
    const formatter = new Intl.DateTimeFormat(locale, intlOptions);
    return typeof formatter.formatRange === "function"
        ? formatter.formatRange(startDate, endDate)
        : `${formatter.format(startDate)} - ${formatter.format(endDate)}`;
}

export const formatRange = formatDateRange;
