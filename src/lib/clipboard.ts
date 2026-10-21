/* SnowUI source notice | LICENSE 2.3.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
export async function writeClipboardText(text: string): Promise<void> {
    if (
        typeof navigator === "undefined" ||
        !navigator.clipboard ||
        typeof navigator.clipboard.writeText !== "function"
    ) {
        throw new Error("Clipboard API is unavailable");
    }
    await navigator.clipboard.writeText(text);
}
