/* SnowUI source notice | LICENSE 2.1.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
/** 自适应黑白对比：组件声明表面，通用层统一选择设计系统静态黑白。 */
export interface AdaptiveContrastSurface {
    path: string;
    fill: string;
    opacity: number;
}

export function getAdaptiveContrastColor(inverse = false): string {
    return inverse ? "var(--static-white-100, #fff)" : "var(--static-black-100, #000)";
}

/** 未知变量、半透明与彩色输入保留原色；公开语义色由 color.ts 先解析。 */
export function isAdaptiveContrastMonochrome(color: string): boolean {
    return /^(?:black|white|#(?:000|fff|000f|ffff|000000|ffffff|000000ff|ffffffff)|var\(--(?:static-)?(?:black|white)-100(?:,\s*#[\da-f]+)?\))$/i.test(color.trim());
}
