/* SnowUI source notice | LICENSE 2.2.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
export const SNOWUI_COLOR_TOKENS = {
    StaticBlack100: "--static-black-100",
    StaticBlack80: "--static-black-80",
    StaticBlack40: "--static-black-40",
    StaticBlack20: "--static-black-20",
    StaticBlack10: "--static-black-10",
    StaticBlack4: "--static-black-4",
    StaticWhite100: "--static-white-100",
    StaticWhite80: "--static-white-80",
    StaticWhite40: "--static-white-40",
    StaticWhite20: "--static-white-20",
    StaticWhite10: "--static-white-10",
    StaticWhite4: "--static-white-4",
    Black100: "--black-100",
    Black80: "--black-80",
    Black40: "--black-40",
    Black20: "--black-20",
    Black10: "--black-10",
    Black4: "--black-4",
    White100: "--white-100",
    White80: "--white-80",
    White40: "--white-40",
    White20: "--white-20",
    White10: "--white-10",
    White4: "--white-4",
    Background1: "--background-1",
    Background2: "--background-2",
    Background3: "--background-3",
    Surface1: "--surface-1",
    Surface2: "--surface-2",
    Surface3: "--surface-3",
    Purple: "--secondary-purple",
    Indigo: "--secondary-indigo",
    Blue: "--secondary-blue",
    Cyan: "--secondary-cyan",
    Mint: "--secondary-mint",
    Green: "--secondary-green",
    Yellow: "--secondary-yellow",
    Orange: "--secondary-orange",
    Red: "--secondary-red",
    Foreground: "--foreground",
    Background: "--background",
    Primary: "--primary",
    Brand: "--brand",
    Color1: "--color-1",
    Color2: "--color-2",
    Black: "--black-100",
    White: "--white-100",
} as const;

export type SnowUIColor = keyof typeof SNOWUI_COLOR_TOKENS;

export function resolveSnowUIColor(color: SnowUIColor | string): string {
    const token = SNOWUI_COLOR_TOKENS[color as SnowUIColor];
    return token ? `var(${token})` : color;
}
