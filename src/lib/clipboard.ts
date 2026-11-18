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
/*! @license SnowUI-Commercial-2.4.0 https://snowui.dev/LICENSE (../../LICENSE) */
