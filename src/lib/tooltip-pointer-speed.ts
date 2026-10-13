/* SnowUI source notice | LICENSE 2.2.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
/** 仅由可见的共享 Tooltip 宿主持有；事件只更新数值，不读布局或驱动渲染。 */
export function trackTooltipPointerSpeed(document: Document) {
    const clock = () => document.defaultView!.performance.now();
    let previous: { x: number; y: number; time: number } | undefined;
    let speed = 0;
    const freshnessMs = 100;
    const smoothingMs = 32;

    function sample(event: PointerEvent) {
        if (event.pointerType !== "mouse" || !event.isPrimary) return;
        const time = clock();
        const point = { x: event.clientX, y: event.clientY, time };
        if (previous) {
            const elapsed = time - previous.time;
            if (elapsed > freshnessMs) {
                speed = 0;
            } else if (elapsed >= 1) {
                const instantaneous = Math.min(4, Math.hypot(
                    point.x - previous.x, point.y - previous.y,
                ) / elapsed);
                const weight = 1 - Math.exp(-elapsed / smoothingMs);
                speed += (instantaneous - speed) * weight;
            } else {
                return;
            }
        }
        previous = point;
    }

    document.addEventListener("pointermove", sample, { capture: true, passive: true });
    return {
        read() {
            return previous && clock() - previous.time <= freshnessMs ? speed : 0;
        },
        destroy() {
            document.removeEventListener("pointermove", sample, true);
            previous = undefined;
            speed = 0;
        },
    };
}
