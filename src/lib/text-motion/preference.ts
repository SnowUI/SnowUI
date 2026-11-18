export function shouldReduceTextMotion(respectMotionPreference: boolean) {
    return (
        respectMotionPreference &&
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
}
/*! @license SnowUI-Commercial-2.4.0 https://snowui.dev/LICENSE (../../../LICENSE) */
