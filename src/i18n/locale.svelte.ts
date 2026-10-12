/* SnowUI source notice | LICENSE 2.1.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
import { getContext } from "svelte";
import { LOCALE_CONTEXT_KEY } from "../keys";
import {
    DEFAULT_LOCALE,
    SNOWUI_MESSAGES,
    type SnowUIMessageKey,
    type SnowUIMessageOverrides,
    type SnowUIMessageValues,
} from "./messages";

export interface LocaleContext {
    readonly locale: string;
    t: (key: SnowUIMessageKey, values?: SnowUIMessageValues) => string;
}

function resolveMessages(locale: string) {
    const language = locale.split("-")[0];
    return SNOWUI_MESSAGES[locale]
        ?? (language ? SNOWUI_MESSAGES[language] : undefined)
        ?? SNOWUI_MESSAGES[DEFAULT_LOCALE];
}

function interpolate(
    message: string,
    values: SnowUIMessageValues | undefined,
) {
    if (!values) return message;
    return message.replace(/\{\{(\w+)\}\}/g, (token, name: string) =>
        values[name] === undefined ? token : String(values[name]),
    );
}

export function createLocaleContext(
    getLocale: () => string,
    getOverrides: () => SnowUIMessageOverrides,
): LocaleContext {
    return {
        get locale() {
            return getLocale();
        },
        t(key, values) {
            const locale = getLocale();
            const message = getOverrides()[key]
                ?? resolveMessages(locale)[key]
                ?? SNOWUI_MESSAGES[DEFAULT_LOCALE][key]
                ?? key;
            return interpolate(message, values);
        },
    };
}

const defaultLocaleContext = createLocaleContext(
    () => DEFAULT_LOCALE,
    () => ({}),
);

/** 读取最近 LocaleProvider；未提供时使用库默认 locale。 */
export function useLocale(): LocaleContext {
    return getContext<LocaleContext>(LOCALE_CONTEXT_KEY) ?? defaultLocaleContext;
}
