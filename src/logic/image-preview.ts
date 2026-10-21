/* SnowUI source notice | LICENSE 2.3.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
import type { Component } from "svelte";

export interface ImagePreviewItem {
    src?: string | Component;
    alt?: string;
}

export type PreviewMode = "viewer" | "window" | "none";

export interface ImagePreviewRequest {
    items: ImagePreviewItem[];
    index: number;
}

const IMAGE_PREVIEW_OPEN_EVENT = "snowui:image-preview:open";
const IMAGE_VIEWER_COUNT_KEY = "__snowuiImageViewerCount";
const IMAGE_VIEWER_REGISTRY_KEY = "__snowuiImageViewerRegistry";
const IMAGE_VIEWER_SEQUENCE_KEY = "__snowuiImageViewerSequence";
const IMAGE_VIEWER_PRESENCE_EVENT = "snowui:image-viewer:presence";
const PREVIEW_MODE_DATA_ATTR = "data-snowui-image-viewer-mode";
const PREVIEW_SCOPE_ATTR = "data-snowui-image-viewer-scope";

type ImageViewerWindow = Window &
    typeof globalThis & {
        [IMAGE_VIEWER_COUNT_KEY]?: number;
        [IMAGE_VIEWER_REGISTRY_KEY]?: ImageViewerRegistration[];
        [IMAGE_VIEWER_SEQUENCE_KEY]?: number;
    };

type ImageViewerRegistration = {
    id: number;
    onOwnerChange?: (owner: boolean) => void;
};

export function getImagePreviewOpenEventName() {
    return IMAGE_PREVIEW_OPEN_EVENT;
}

export function getImageViewerPresenceEventName() {
    return IMAGE_VIEWER_PRESENCE_EVENT;
}

export function normalizePreviewMode(
    value?: string | null,
): PreviewMode | undefined {
    if (!value) return undefined;
    if (value === "viewer" || value === "window" || value === "none") {
        return value;
    }
    return undefined;
}

export function getPreviewModeAttrName() {
    return PREVIEW_MODE_DATA_ATTR;
}

export function getPreviewScopeAttrName() {
    return PREVIEW_SCOPE_ATTR;
}

export function getElementPreviewMode(
    element?: Element | null,
): PreviewMode | undefined {
    if (!element) return undefined;
    return normalizePreviewMode(element.getAttribute(PREVIEW_MODE_DATA_ATTR));
}

export function isPreviewScopedElement(element?: Element | null) {
    return !!element?.closest(`[${PREVIEW_SCOPE_ATTR}]`);
}

function getDomImagePreviewSrc(image: HTMLImageElement) {
    const currentSrc = image.currentSrc?.trim();
    if (currentSrc) return currentSrc;
    const src = image.getAttribute("src")?.trim();
    return src || undefined;
}

function toDomImagePreviewItem(image: HTMLImageElement): ImagePreviewItem | null {
    const src = getDomImagePreviewSrc(image);
    if (!src) return null;
    return {
        src,
        alt: image.getAttribute("alt") ?? undefined,
    };
}

function collectScopedPreviewImages(scope: Element) {
    return Array.from(scope.querySelectorAll("img")).filter((candidate) => {
        if (!(candidate instanceof HTMLImageElement)) return false;
        if (candidate.closest(`[${PREVIEW_SCOPE_ATTR}]`) !== scope) return false;
        return getElementPreviewMode(candidate) === "viewer";
    });
}

export function resolvePreviewImageElement(target: EventTarget | null) {
    if (!(target instanceof Element)) return null;
    const image = target.closest("img");
    if (!(image instanceof HTMLImageElement)) return null;
    return image;
}

export function resolveDomImagePreviewRequest(
    target: EventTarget | null,
): ImagePreviewRequest | null {
    const image = resolvePreviewImageElement(target);
    if (!image || getElementPreviewMode(image) !== "viewer") return null;

    const scope = image.closest(`[${PREVIEW_SCOPE_ATTR}]`);
    if (!scope) {
        const singleItem = toDomImagePreviewItem(image);
        if (!singleItem) return null;
        return {
            items: [singleItem],
            index: 0,
        };
    }

    const images = collectScopedPreviewImages(scope);
    const items = images
        .map((candidate) => toDomImagePreviewItem(candidate))
        .filter((item): item is ImagePreviewItem => item !== null);
    const index = images.indexOf(image);
    if (!items.length || index < 0) return null;
    return {
        items,
        index,
    };
}

function dispatchImageViewerPresence(targetWindow: ImageViewerWindow) {
    const count = targetWindow[IMAGE_VIEWER_COUNT_KEY] ?? 0;
    window.dispatchEvent(
        new CustomEvent<{ count: number; active: boolean }>(
            IMAGE_VIEWER_PRESENCE_EVENT,
            {
                detail: {
                    count,
                    active: count > 0,
                },
            },
        ),
    );
}

function notifyImageViewerOwners(targetWindow: ImageViewerWindow) {
    const registry = targetWindow[IMAGE_VIEWER_REGISTRY_KEY] ?? [];
    const ownerId = registry[0]?.id;
    registry.forEach((entry) => {
        entry.onOwnerChange?.(entry.id === ownerId);
    });
}

export function registerImageViewer(
    onOwnerChange?: (owner: boolean) => void,
) {
    if (typeof window === "undefined") return () => { };
    const targetWindow = window as ImageViewerWindow;
    const registry = targetWindow[IMAGE_VIEWER_REGISTRY_KEY] ?? [];
    targetWindow[IMAGE_VIEWER_REGISTRY_KEY] = registry;
    const id = (targetWindow[IMAGE_VIEWER_SEQUENCE_KEY] ?? 0) + 1;
    targetWindow[IMAGE_VIEWER_SEQUENCE_KEY] = id;
    registry.push({ id, onOwnerChange });
    targetWindow[IMAGE_VIEWER_COUNT_KEY] = registry.length;
    notifyImageViewerOwners(targetWindow);
    dispatchImageViewerPresence(targetWindow);
    return () => {
        const currentRegistry =
            targetWindow[IMAGE_VIEWER_REGISTRY_KEY] ?? [];
        const index = currentRegistry.findIndex((entry) => entry.id === id);
        if (index >= 0) currentRegistry.splice(index, 1);
        targetWindow[IMAGE_VIEWER_COUNT_KEY] = currentRegistry.length;
        notifyImageViewerOwners(targetWindow);
        dispatchImageViewerPresence(targetWindow);
    };
}

export function hasImageViewer() {
    if (typeof window === "undefined") return false;
    const targetWindow = window as ImageViewerWindow;
    return (targetWindow[IMAGE_VIEWER_COUNT_KEY] ?? 0) > 0;
}

let lastCloseTimestamp = 0;

export function markImageViewerClosed() {
    lastCloseTimestamp = Date.now();
}

export function openImagePreview(items: ImagePreviewItem[], index = 0) {
    if (typeof window === "undefined" || !items.length) return;
    const now = Date.now();
    if (now - lastCloseTimestamp < 400) {
        return;
    }
    const nextIndex = Math.min(Math.max(index, 0), items.length - 1);
    const detail: ImagePreviewRequest = {
        items,
        index: nextIndex,
    };
    window.dispatchEvent(
        new CustomEvent<ImagePreviewRequest>(IMAGE_PREVIEW_OPEN_EVENT, {
            detail,
        }),
    );
}

export function openImageMediaInNewWindow(src?: string | Component) {
    if (typeof window === "undefined") return;
    if (typeof src !== "string" || src.trim() === "") return;
    window.open(src, "_blank", "noopener,noreferrer");
}
