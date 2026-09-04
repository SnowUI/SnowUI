export interface AppearanceViewportGeometry {
    top: number;
    bottom: number;
    height: number;
    viewportHeight: number;
    appearanceReleased: boolean;
}

/**
 * Resolve an element against the outermost same-origin viewport.
 * Embedders can keep appearance progress at its initial state by setting
 * `data-snowui-appearance-gated="true"` on the iframe until its matching
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
    let appearanceBlocked = false;
    let appearanceReleased = false;
    const visited = new Set<Window>();

    while (!visited.has(viewportWindow)) {
        visited.add(viewportWindow);
        try {
            const parentWindow = viewportWindow.parent;
            const frameElement = viewportWindow.frameElement as HTMLElement | null;
            if (parentWindow === viewportWindow || !frameElement) break;
            if (frameElement.dataset.snowuiAppearanceGated === "true") {
                if (frameElement.dataset.snowuiAppearanceReady === "true") {
                    appearanceReleased = true;
                } else {
                    appearanceBlocked = true;
                }
            }
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
