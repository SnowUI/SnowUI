/* SnowUI source notice | LICENSE 2.3.0: ../../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
export interface AppearanceViewportGeometry {
    top: number;
    bottom: number;
    height: number;
    viewportHeight: number;
    appearanceReleased: boolean;
}

/** 页面宿主和同源 iframe 共用同一个显式出现门禁。外层未放行具有优先权。 */
export function resolveAppearanceGate(element: Element, sourceWindow: Window = window) {
    const hosts: Element[] = [];
    const visited = new Set<Window>();
    let current: Element | null = element;
    let currentWindow = sourceWindow;
    while (!visited.has(currentWindow)) {
        visited.add(currentWindow);
        while (current) {
            if (current.getAttribute("data-snowui-appearance-gated") === "true") hosts.push(current);
            current = current.parentElement;
        }
        try {
            if (currentWindow.parent === currentWindow || !currentWindow.frameElement) break;
            current = currentWindow.frameElement;
            currentWindow = currentWindow.parent;
        } catch { break; }
    }
    return { hosts, controlled: hosts.length > 0, ready: hosts.every(host => host.getAttribute("data-snowui-appearance-ready") === "true") };
}

/** 静态结构先挂载；首次放行后断开观察，人工更新和重播由组件继续拥有。 */
export function observeAppearanceRelease(element: Element, release: (controlled: boolean) => void) {
    const gate = resolveAppearanceGate(element);
    if (gate.ready) { release(gate.controlled); return () => {}; }
    const observer = new MutationObserver(() => {
        if (!resolveAppearanceGate(element).ready) return;
        observer.disconnect();
        release(gate.controlled);
    });
    for (const host of gate.hosts) observer.observe(host, { attributes: true, attributeFilter: ["data-snowui-appearance-ready", "data-snowui-appearance-gated"] });
    return () => observer.disconnect();
}

/**
 * Resolve an element against the outermost same-origin viewport.
 * Embedders can keep appearance progress at its initial state by setting
 * `data-snowui-appearance-gated="true"` on an ancestor host or iframe until its matching
 * `data-snowui-appearance-ready` value becomes `true`.
 */
export function resolveAppearanceViewportGeometry(
    element: Element,
    sourceWindow: Window = window,
): AppearanceViewportGeometry {
    const sourceRect = element.getBoundingClientRect();
    let top = sourceRect.top;
    let height = sourceRect.height;
    let viewportWindow = sourceWindow;
    const gate = resolveAppearanceGate(element, sourceWindow);
    const appearanceBlocked = !gate.ready;
    const appearanceReleased = gate.controlled && gate.ready;
    const visited = new Set<Window>();

    while (!visited.has(viewportWindow)) {
        visited.add(viewportWindow);
        try {
            const parentWindow = viewportWindow.parent;
            const frameElement = viewportWindow.frameElement as HTMLElement | null;
            if (parentWindow === viewportWindow || !frameElement) break;
            const frameRect = frameElement.getBoundingClientRect();
            const layoutHeight = frameElement.clientHeight || frameRect.height;
            const scaleY = layoutHeight > 0 ? frameRect.height / layoutHeight : 1;
            top = frameRect.top + top * scaleY;
            height *= scaleY;
            viewportWindow = parentWindow;
        } catch {
            break;
        }
    }

    return {
        top: appearanceBlocked ? Number.POSITIVE_INFINITY : top,
        bottom: appearanceBlocked ? Number.POSITIVE_INFINITY : top + height,
        height,
        viewportHeight: viewportWindow.innerHeight,
        appearanceReleased,
    };
}

/** Return every same-origin window whose scrolling can move the element. */
export function resolveAppearanceViewportWindows(
    sourceWindow: Window = window,
): Window[] {
    const viewportWindows: Window[] = [];
    let viewportWindow = sourceWindow;
    const visited = new Set<Window>();

    while (!visited.has(viewportWindow)) {
        visited.add(viewportWindow);
        viewportWindows.push(viewportWindow);
        try {
            const parentWindow = viewportWindow.parent;
            if (parentWindow === viewportWindow || !viewportWindow.frameElement) break;
            viewportWindow = parentWindow;
        } catch {
            break;
        }
    }

    return viewportWindows;
}
