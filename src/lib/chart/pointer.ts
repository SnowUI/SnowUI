/* SnowUI source notice | LICENSE 2.3.0: ../../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
export interface ChartPointerPosition {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface ChartPointerFrameScheduler {
    schedule(event: Pick<PointerEvent | MouseEvent, "clientX" | "clientY">): void;
    clear(): void;
}

/**
 * 将高频 pointer 坐标读取合并到浏览器绘制帧。
 *
 * 事件阶段只保存最新 viewport 坐标；每帧最多读取一次根节点布局，并把最终的
 * 局部坐标交给图表。这样不改变面板的逐帧跟随语义，也不会在 pointer 热路径中
 * 对每个原始事件触发同步布局。
 */
export function createChartPointerFrameScheduler(
    resolveRoot: () => Element | null | undefined,
    commit: (position: ChartPointerPosition) => void,
): ChartPointerFrameScheduler {
    let frame: number | null = null;
    let pending: { clientX: number; clientY: number } | null = null;

    function clear() {
        pending = null;
        if (frame === null) return;
        cancelAnimationFrame(frame);
        frame = null;
    }

    return {
        schedule(event) {
            pending = { clientX: event.clientX, clientY: event.clientY };
            if (frame !== null) return;
            frame = requestAnimationFrame(() => {
                frame = null;
                const latest = pending;
                pending = null;
                const root = resolveRoot();
                if (!latest || !root) return;
                const rect = root.getBoundingClientRect();
                commit({
                    x: latest.clientX - rect.left,
                    y: latest.clientY - rect.top,
                    width: rect.width,
                    height: rect.height,
                });
            });
        },
        clear,
    };
}
