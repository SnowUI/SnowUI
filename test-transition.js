export function customPartTransition(node, { duration, y = -20 }) {
    const width = parseFloat(getComputedStyle(node).width);
    return {
        duration,
        css: (t, u) => `
            width: ${t * width}px;
            opacity: ${t};
            transform: translateY(${u * y}px);
        `
    };
}
