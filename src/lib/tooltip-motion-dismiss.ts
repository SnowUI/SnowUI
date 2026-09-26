/**
 * Tooltip 动效感知关闭协调器。
 *
 * 性能边界：
 * - 仅在至少一个已显示 Tooltip 注册时监听 document。
 * - 每个 document 只注册一组 capture 监听器。
 * - 不使用逐帧布局读取、ResizeObserver 或 MutationObserver。
 */

export type TooltipMotionDismissRegistration = {
    id: string;
    triggerEl: HTMLElement;
    onDismiss: () => void;
};

type DocumentMotionDismissState = {
    registrations: Map<string, TooltipMotionDismissRegistration>;
    handleTransitionRun: (event: TransitionEvent) => void;
    handleAnimationStart: (event: AnimationEvent) => void;
};

const documentStates = new WeakMap<Document, DocumentMotionDismissState>();

const GEOMETRY_TRANSITION_PROPERTIES = new Set([
    "transform",
    "translate",
    "rotate",
    "scale",
    "width",
    "min-width",
    "max-width",
    "height",
    "min-height",
    "max-height",
    "top",
    "right",
    "bottom",
    "left",
    "inset",
    "inset-block",
    "inset-block-start",
    "inset-block-end",
    "inset-inline",
    "inset-inline-start",
    "inset-inline-end",
    "gap",
    "row-gap",
    "column-gap",
    "font-size",
    "line-height",
    "border-width",
    "border-top-width",
    "border-right-width",
    "border-bottom-width",
    "border-left-width",
]);

const GEOMETRY_TRANSITION_PREFIXES = [
    "margin-",
    "padding-",
    "flex-",
    "grid-",
];

function affectsGeometry(propertyName: string): boolean {
    return (
        GEOMETRY_TRANSITION_PROPERTIES.has(propertyName) ||
        GEOMETRY_TRANSITION_PREFIXES.some((prefix) =>
            propertyName.startsWith(prefix),
        )
    );
}

function isTriggerOrAncestorMotionTarget(
    triggerEl: HTMLElement,
    target: EventTarget | null,
): target is Element {
    if (!(target instanceof Element)) return false;
    return target === triggerEl || target.contains(triggerEl);
}

function dismissRelatedTooltips(
    state: DocumentMotionDismissState,
    target: EventTarget | null,
    includeDescendants: boolean,
): void {
    for (const registration of [...state.registrations.values()]) {
        const affectsTriggerAnchor = isTriggerOrAncestorMotionTarget(
            registration.triggerEl,
            target,
        );
        const isDescendant = target instanceof Element &&
            registration.triggerEl.contains(target);
        if (!affectsTriggerAnchor && !(includeDescendants && isDescendant)) {
            continue;
        }
        registration.onDismiss();
    }
}

function getDocumentState(document: Document): DocumentMotionDismissState {
    const existing = documentStates.get(document);
    if (existing) return existing;

    const state: DocumentMotionDismissState = {
        registrations: new Map(),
        handleTransitionRun: (event) => {
            // ::before / ::after 通常承载 hover 背景、边框与装饰层；事件 target
            // 会被重定向到宿主，但伪元素自身的 inset 不会移动宿主锚点。
            if (event.pseudoElement) return;
            if (!affectsGeometry(event.propertyName)) return;
            // 已登记的内容视觉层只变换绘制，不移动外层触发器锚点。
            // 标记只豁免后代 transform；自身 / 祖先及真实尺寸变化仍须关闭。
            const isAnchorDecoration = event.propertyName === "transform" &&
                event.target instanceof Element &&
                event.target.hasAttribute("data-tooltip-anchor-decoration");
            dismissRelatedTooltips(state, event.target, !isAnchorDecoration);
        },
        handleAnimationStart: (event) => {
            // Keyframe events do not expose animated property names. Only the
            // trigger itself or an ancestor can be assumed to move its anchor;
            // decorative descendant animations must not close the Tooltip.
            dismissRelatedTooltips(state, event.target, false);
        },
    };
    documentStates.set(document, state);
    return state;
}

function connectDocument(
    document: Document,
    state: DocumentMotionDismissState,
): void {
    document.addEventListener("transitionrun", state.handleTransitionRun, true);
    document.addEventListener("animationstart", state.handleAnimationStart, true);
}

function disconnectDocument(
    document: Document,
    state: DocumentMotionDismissState,
): void {
    document.removeEventListener("transitionrun", state.handleTransitionRun, true);
    document.removeEventListener("animationstart", state.handleAnimationStart, true);
}

export function registerTooltipMotionDismiss(
    registration: TooltipMotionDismissRegistration,
): () => void {
    const document = registration.triggerEl.ownerDocument;
    const state = getDocumentState(document);
    const shouldConnect = state.registrations.size === 0;

    state.registrations.set(registration.id, registration);
    if (shouldConnect) connectDocument(document, state);

    return () => {
        const current = state.registrations.get(registration.id);
        if (current !== registration) return;

        state.registrations.delete(registration.id);
        if (state.registrations.size === 0) {
            disconnectDocument(document, state);
            documentStates.delete(document);
        }
    };
}
