export function shouldReduceTextMotion(respectMotionPreference: boolean) {
    return (
        respectMotionPreference &&
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
}

