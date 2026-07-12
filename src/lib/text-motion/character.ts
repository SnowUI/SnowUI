import {
    animateSettledTextMotionColor,
    cancelTextMotionColor,
} from "./color";
import {
    cancelTextMotionLayout,
    flipTextMotionElement,
    splitTextMotionGraphemes,
    TEXT_MOTION_LAYOUT_TRANSITION,
    type TextMotionTransition,
} from "./layout";
import {
    extractTextMotionNumber,
    getTextMotionNumberSign,
    resolveTextMotionTrend,
} from "./numeric";
import { shouldReduceTextMotion } from "./preference";
import {
    getTextMotionStagger,
    TEXT_MOTION_SPACE,
} from "./sequence";
import {
    commitTextMotionTimeline,
    createTextMotionTimelinePlan,
} from "./timeline";
import type {
    TextMotionColor,
    TextMotionRole,
    TextMotionTrend,
} from "./types";

export interface TextMotionCharacterOptions {
    trend?: TextMotionTrend;
    motionRole?: TextMotionRole;
    respectMotionPreference?: boolean;
    motionColor?: TextMotionColor;
    animator?: TextMotionCharacterAnimator;
    transition?: Partial<TextMotionTransition>;
    motionDuration?: number;
    stagger?: number;
    numericStaggerDirection?: "left-to-right" | "right-to-left";
    animatePreservedNumericSignChange?: boolean;
}

export interface TextMotionCharacterAnimationContext {
    element: HTMLElement;
    isOut: boolean;
    trend: number;
    delay: number;
    duration: number;
    easing: string;
    label: string;
    previousLabel?: string;
    nextLabel?: string;
    previousValue?: string;
    nextValue?: string;
    characterIndex?: number;
    characterTotal?: number;
    isNumericArithmetic?: boolean;
}

export type TextMotionCharacterAnimator = (
    context: TextMotionCharacterAnimationContext,
) => Animation | undefined;

const BROWSER = typeof window !== "undefined";
const ServerSafeHTMLElement = BROWSER
    ? HTMLElement
    : (class {} as typeof HTMLElement);
const TEXT_MOTION_DIGIT_PATTERN = /^\d$/;
const TEXT_MOTION_NUMERIC_SEPARATOR_PATTERN = /^[,.:]$/;

function createPart(className?: string, text?: string) {
    const element = document.createElement("span");
    element.setAttribute("aria-hidden", "true");
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
}

export class TextMotionCharacterElement extends ServerSafeHTMLElement {
    private prefixSection!: HTMLElement;
    private middleSection!: HTMLElement;
    private suffixSection!: HTMLElement;
    private chars: HTMLElement[] = [];
    private exitingChars: [HTMLElement, number][] = [];
    private isRTL = false;
    private value = "";
    private previousValue = "";

    public transition: TextMotionTransition = TEXT_MOTION_LAYOUT_TRANSITION;
    public trend: TextMotionTrend = 0;
    public motionRole: TextMotionRole = "auto";
    public respectMotionPreference = true;
    public motionColor: TextMotionColor = "";
    public animator: TextMotionCharacterAnimator | undefined;
    public motionDuration: number | undefined;
    public stagger: number | undefined;
    public numericStaggerDirection: "left-to-right" | "right-to-left" =
        "right-to-left";
    public animatePreservedNumericSignChange = false;

    constructor() {
        super();
        if (!BROWSER) return;

        const shadow = this.attachShadow({ mode: "open" });
        const style = document.createElement("style");
        style.textContent = `
            :host {
                position: relative;
                display: inline-flex;
                white-space: nowrap;
                isolation: isolate;
                font: inherit;
                color: inherit;
                line-height: inherit;
                letter-spacing: inherit;
                font-variant-numeric: inherit;
                vertical-align: baseline;
            }
            span {
                margin: 0;
                padding: 0;
                transform-origin: center;
                font: inherit;
                color: inherit;
                line-height: inherit;
                letter-spacing: inherit;
                font-variant-numeric: inherit;
            }
            [inert] {
                position: absolute;
                display: inline-flex;
                will-change: transform;
                z-index: 0;
            }
            .section {
                position: relative;
                display: inline-flex;
                will-change: transform;
                z-index: 1;
            }
            .char {
                display: inline-block;
                white-space: pre;
                will-change: transform, filter;
            }
        `;

        this.prefixSection = createPart("section");
        this.middleSection = createPart("section");
        this.suffixSection = createPart("section");
        shadow.append(
            style,
            this.prefixSection,
            this.middleSection,
            this.suffixSection,
        );
    }

    connectedCallback() {
        this.isRTL = getComputedStyle(this).direction === "rtl";
        this.render(false);
    }

    update(nextValue: string | number, withAnimation = true) {
        const next = String(nextValue);
        if (next === this.value) return;
        this.previousValue = this.value;
        this.value = next;
        this.render(
            withAnimation &&
                !shouldReduceTextMotion(this.respectMotionPreference),
        );
    }

    setOptions(options: TextMotionCharacterOptions) {
        if (options.transition) {
            this.transition = {
                ...TEXT_MOTION_LAYOUT_TRANSITION,
                ...options.transition,
            };
        }
        if (typeof options.trend === "number") this.trend = options.trend;
        this.motionRole = options.motionRole ?? "auto";
        if (typeof options.respectMotionPreference === "boolean") {
            this.respectMotionPreference = options.respectMotionPreference;
        }
        this.motionColor = options.motionColor ?? "";
        this.animator = options.animator;
        this.motionDuration = options.motionDuration;
        this.stagger = options.stagger;
        this.numericStaggerDirection =
            options.numericStaggerDirection ?? "right-to-left";
        this.animatePreservedNumericSignChange =
            options.animatePreservedNumericSignChange ?? false;
    }

    private render(animate: boolean) {
        if (!this.shadowRoot) return;
        const plan = createTextMotionTimelinePlan(
            this.chars,
            splitTextMotionGraphemes(this.value, true),
            (char) =>
                char.getAttribute("data-text-motion-label") ??
                char.textContent ??
                "",
            (label) => createPart("char", label),
        );
        const {
            oldMiddleNodes,
            newMiddleNodes,
            prefixNodes,
            suffixNodes,
            nextNodes,
        } = plan;

        if (!animate) {
            for (const char of this.chars) cancelTextMotionColor(char);
            for (const char of oldMiddleNodes) char.remove();
            this.prefixSection.replaceChildren(...prefixNodes);
            this.middleSection.replaceChildren(...newMiddleNodes);
            this.suffixSection.replaceChildren(...suffixNodes);
            this.chars = nextNodes;
            return;
        }

        const resolvedTrend = resolveTextMotionTrend(
            this.previousValue,
            this.value,
            this.trend,
            this.motionRole,
        );
        const motionTrend = resolvedTrend.trend || 1;
        const numericPairing = resolvedTrend.isNumericArithmetic
            ? this.createNumericPairing(oldMiddleNodes, newMiddleNodes)
            : undefined;
        const oldMiddleRects = new Map(
            oldMiddleNodes.map((node) => [node, node.getBoundingClientRect()]),
        );
        if (numericPairing) {
            for (
                let index = 0;
                index < numericPairing.pairedNewNodes.length;
                index += 1
            ) {
                if (!numericPairing.pairedNewNodes[index]) continue;
                const oldIndex = numericPairing.newToOldIndexes[index];
                if (oldIndex === undefined) continue;
                const nextLabel = this.getCharacterLabel(
                    newMiddleNodes[index],
                );
                const reusedNode = oldMiddleNodes[oldIndex];
                reusedNode.setAttribute("data-text-motion-label", nextLabel);
                if (!reusedNode.childElementCount) {
                    reusedNode.textContent = nextLabel;
                }
                newMiddleNodes[index] = reusedNode;
                nextNodes[prefixNodes.length + index] = reusedNode;
            }
        }
        const oldPrefixRect = this.prefixSection.getBoundingClientRect();
        const oldMiddleRect = this.middleSection.getBoundingClientRect();
        const oldSuffixRect = this.suffixSection.getBoundingClientRect();

        let exitingX = 0;
        if (oldMiddleNodes.length) {
            const anchor = oldMiddleNodes[0];
            const parent = anchor.parentElement;
            const parentRect =
                parent === this.prefixSection
                    ? oldPrefixRect
                    : parent === this.suffixSection
                      ? oldSuffixRect
                      : oldMiddleRect;
            exitingX = this.isRTL
                ? parentRect.left + anchor.offsetLeft + anchor.offsetWidth
                : parentRect.left + anchor.offsetLeft;
        }

        commitTextMotionTimeline({
            plan,
            capture: () => ({
                oldPrefixRect,
                oldMiddleRect,
                oldSuffixRect,
                exitingX,
            }),
            commit: (_, snapshot) => {
                this.renderExitingNodes(
                    oldMiddleNodes,
                    snapshot.exitingX,
                    motionTrend,
                    resolvedTrend.isNumericArithmetic,
                    numericPairing?.replacementLabelsForOld,
                    numericPairing?.preservedOldNodes,
                    prefixNodes.length,
                );
                this.prefixSection.replaceChildren(...prefixNodes);
                this.middleSection.replaceChildren(...newMiddleNodes);
                this.suffixSection.replaceChildren(...suffixNodes);
                this.chars = nextNodes;
            },
            playLayout: (_, snapshot) => {
                cancelTextMotionLayout(this.prefixSection);
                cancelTextMotionLayout(this.suffixSection);
                const newPrefixRect = this.prefixSection.getBoundingClientRect();
                const newSuffixRect = this.suffixSection.getBoundingClientRect();
                const exitingEdge = this.isRTL
                    ? newPrefixRect.right
                    : newPrefixRect.left;
                for (const [element, x] of this.exitingChars) {
                    element.style.transform = `translateX(${x - exitingEdge}px)`;
                }
                for (let index = 0; index < newMiddleNodes.length; index += 1) {
                    if (!numericPairing?.pairedNewNodes[index]) continue;
                    const node = newMiddleNodes[index];
                    const oldRect = oldMiddleRects.get(node);
                    if (!oldRect) continue;
                    const newRect = node.getBoundingClientRect();
                    flipTextMotionElement(
                        node,
                        oldRect.left - newRect.left,
                        this.transition,
                    );
                }
                for (let index = 0; index < newMiddleNodes.length; index += 1) {
                    if (numericPairing?.preservedNewNodes[index]) {
                        continue;
                    }
                    this.playCharacterAnimation(
                        newMiddleNodes[index],
                        false,
                        motionTrend,
                        this.getDelay(
                            index,
                            newMiddleNodes,
                            resolvedTrend.isNumericArithmetic &&
                                this.numericStaggerDirection !==
                                    "left-to-right",
                        ),
                        undefined,
                        index,
                        newMiddleNodes.length,
                        numericPairing?.previousLabelsForNew[index],
                        undefined,
                        resolvedTrend.isNumericArithmetic,
                        prefixNodes.length + index,
                        nextNodes.length,
                    );
                }
                if (
                    this.animatePreservedNumericSignChange &&
                    resolvedTrend.isNumericArithmetic &&
                    getTextMotionNumberSign(
                        extractTextMotionNumber(this.previousValue),
                    ) !==
                        getTextMotionNumberSign(
                            extractTextMotionNumber(this.value),
                        )
                ) {
                    for (const node of plan.preservedNodes) {
                        const nodeIndex = nextNodes.indexOf(node);
                        if (nodeIndex === -1) continue;
                        const label = this.getCharacterLabel(node);
                        if (!TEXT_MOTION_DIGIT_PATTERN.test(label)) continue;
                        this.playCharacterAnimation(
                            node,
                            false,
                            motionTrend,
                            this.getDelay(
                                nodeIndex,
                                nextNodes,
                                resolvedTrend.isNumericArithmetic &&
                                    this.numericStaggerDirection !==
                                        "left-to-right",
                            ),
                            undefined,
                            nodeIndex,
                            nextNodes.length,
                            label,
                            label,
                            resolvedTrend.isNumericArithmetic,
                            nodeIndex,
                            nextNodes.length,
                        );
                    }
                }
                flipTextMotionElement(
                    this.prefixSection,
                    this.getEdgeDx(
                        snapshot.oldPrefixRect,
                        newPrefixRect,
                        snapshot.oldMiddleRect,
                        true,
                    ),
                    this.transition,
                );
                flipTextMotionElement(
                    this.suffixSection,
                    this.getEdgeDx(
                        snapshot.oldSuffixRect,
                        newSuffixRect,
                        snapshot.oldMiddleRect,
                        false,
                    ),
                    this.transition,
                );
            },
        });
    }

    private createNumericPairing(
        oldMiddleNodes: HTMLElement[],
        newMiddleNodes: HTMLElement[],
    ) {
        if (!oldMiddleNodes.length || !newMiddleNodes.length) return undefined;

        const oldLabels = oldMiddleNodes.map((node) =>
            this.getCharacterLabel(node),
        );
        const newLabels = newMiddleNodes.map((node) =>
            this.getCharacterLabel(node),
        );
        const oldDigitIndexes = oldLabels
            .map((label, index) =>
                TEXT_MOTION_DIGIT_PATTERN.test(label) ? index : -1,
            )
            .filter((index) => index >= 0);
        const newDigitIndexes = newLabels
            .map((label, index) =>
                TEXT_MOTION_DIGIT_PATTERN.test(label) ? index : -1,
            )
            .filter((index) => index >= 0);
        if (!oldDigitIndexes.length || !newDigitIndexes.length) {
            return undefined;
        }

        const pairCount = Math.min(oldDigitIndexes.length, newDigitIndexes.length);
        const oldOffset = oldDigitIndexes.length - pairCount;
        const newOffset = newDigitIndexes.length - pairCount;
        const newToOldIndexes: (number | undefined)[] = Array(
            newLabels.length,
        ).fill(undefined);
        const replacementLabelsForOld: (string | undefined)[] = Array(
            oldLabels.length,
        ).fill(undefined);
        const previousLabelsForNew: (string | undefined)[] = Array(
            newLabels.length,
        ).fill(undefined);
        const preservedOldNodes = Array(oldLabels.length).fill(false);
        const preservedNewNodes = Array(newLabels.length).fill(false);
        const pairedOldNodes = Array(oldLabels.length).fill(false);
        const pairedNewNodes = Array(newLabels.length).fill(false);

        for (let pairIndex = 0; pairIndex < pairCount; pairIndex += 1) {
            const oldIndex = oldDigitIndexes[oldOffset + pairIndex];
            const newIndex = newDigitIndexes[newOffset + pairIndex];
            const previousLabel = oldLabels[oldIndex];
            const nextLabel = newLabels[newIndex];

            newToOldIndexes[newIndex] = oldIndex;
            pairedOldNodes[oldIndex] = true;
            pairedNewNodes[newIndex] = true;
            if (previousLabel === nextLabel) {
                preservedOldNodes[oldIndex] = true;
                preservedNewNodes[newIndex] = true;
                continue;
            }

            replacementLabelsForOld[oldIndex] = nextLabel;
            previousLabelsForNew[newIndex] = previousLabel;
        }

        for (let newIndex = 0; newIndex < newLabels.length; newIndex += 1) {
            const nextLabel = newLabels[newIndex];
            if (
                pairedNewNodes[newIndex] ||
                !TEXT_MOTION_NUMERIC_SEPARATOR_PATTERN.test(nextLabel)
            ) {
                continue;
            }
            const oldIndex = oldLabels.findIndex(
                (previousLabel, index) =>
                    !pairedOldNodes[index] && previousLabel === nextLabel,
            );
            if (oldIndex === -1) continue;

            newToOldIndexes[newIndex] = oldIndex;
            pairedOldNodes[oldIndex] = true;
            pairedNewNodes[newIndex] = true;
            preservedOldNodes[oldIndex] = true;
            preservedNewNodes[newIndex] = true;
        }

        return {
            newToOldIndexes,
            replacementLabelsForOld,
            previousLabelsForNew,
            pairedOldNodes,
            pairedNewNodes,
            preservedOldNodes,
            preservedNewNodes,
        };
    }

    private renderExitingNodes(
        nodes: HTMLElement[],
        x: number,
        trend: number,
        isNumericArithmetic: boolean,
        replacementLabels?: (string | undefined)[],
        preservedNodes?: boolean[],
        characterIndexOffset = 0,
    ) {
        if (!nodes.length || !this.shadowRoot) return;
        const group = createPart();
        group.toggleAttribute("inert", true);
        for (let index = 0; index < nodes.length; index += 1) {
            if (preservedNodes?.[index]) continue;
            if (replacementLabels?.[index]) continue;
            group.appendChild(nodes[index]);
        }
        if (!group.childNodes.length) return;
        const entry = [group, x] as [HTMLElement, number];
        this.exitingChars.push(entry);
        this.shadowRoot.appendChild(group);

        let active = group.childNodes.length;
        for (let index = 0; index < nodes.length; index += 1) {
            if (preservedNodes?.[index]) continue;
            if (replacementLabels?.[index]) {
                continue;
            }
            this.playCharacterAnimation(
                nodes[index],
                true,
                trend,
                this.getDelay(
                    index,
                    nodes,
                    isNumericArithmetic &&
                        this.numericStaggerDirection !== "left-to-right",
                ),
                () => {
                    nodes[index].remove();
                    active -= 1;
                    if (active === 0) {
                        group.remove();
                        const entryIndex = this.exitingChars.indexOf(entry);
                        if (entryIndex !== -1) {
                            this.exitingChars.splice(entryIndex, 1);
                        }
                    }
                },
                index,
                nodes.length,
                undefined,
                undefined,
                isNumericArithmetic,
                characterIndexOffset + index,
                this.chars.length,
            );
        }
    }

    private getDelay(index: number, nodes: HTMLElement[], reverse: boolean) {
        const order = reverse ? nodes.length - index - 1 : index;
        const stagger = this.stagger ??
            getTextMotionStagger(
                this.transition.duration,
                nodes.map((node) => node.textContent),
            );
        return Math.max(0, order) * stagger;
    }

    private getEdgeDx(
        oldRect: DOMRect,
        newRect: DOMRect,
        oldMiddle: DOMRect,
        isPrefix: boolean,
    ) {
        if (this.isRTL === isPrefix) {
            const oldEdge = oldRect.width ? oldRect.right : oldMiddle.right;
            return oldEdge - newRect.right;
        }
        const oldEdge = oldRect.width ? oldRect.left : oldMiddle.left;
        return oldEdge - newRect.left;
    }

    private playCharacterAnimation(
        element: HTMLElement,
        isOut: boolean,
        trend: number,
        delay: number,
        onFinish?: () => void,
        colorIndex = 0,
        colorTotal = 1,
        previousLabel?: string,
        nextLabel?: string,
        isNumericArithmetic = false,
        characterIndex = colorIndex,
        characterTotal = colorTotal,
    ) {
        const motionDuration = this.motionDuration ?? this.transition.duration;
        const label = this.getCharacterLabel(element);
        if (label === TEXT_MOTION_SPACE) {
            if (isOut && onFinish) {
                window.setTimeout(onFinish, motionDuration + delay);
            }
            return;
        }
        const animation = this.animator?.({
            element,
            isOut,
            trend,
            delay,
            duration: motionDuration,
            easing: this.transition.easing,
            label,
            previousLabel,
            nextLabel,
            previousValue: this.previousValue,
            nextValue: this.value,
            characterIndex,
            characterTotal,
            isNumericArithmetic,
        });
        if (!isOut) {
            animateSettledTextMotionColor(
                element,
                this.motionColor,
                motionDuration,
                delay,
                colorIndex,
                colorTotal,
            );
        }
        if (!onFinish) return;
        if (!animation) {
            window.setTimeout(onFinish, motionDuration + delay);
            return;
        }
        let finished = false;
        let fallbackTimer: ReturnType<typeof window.setTimeout>;
        const finish = () => {
            if (finished) return;
            finished = true;
            window.clearTimeout(fallbackTimer);
            onFinish();
        };
        fallbackTimer = window.setTimeout(
            finish,
            motionDuration + delay + 50,
        );
        animation.addEventListener("finish", finish, { once: true });
        animation.addEventListener("cancel", finish, { once: true });
    }

    private getCharacterLabel(element: HTMLElement) {
        return (
            element.getAttribute("data-text-motion-label") ??
            element.textContent ??
            ""
        );
    }
}

export const TEXT_MOTION_CHARACTER_TAG = "snowui-text-motion";

export function registerTextMotionCharacterElement() {
    if (
        BROWSER &&
        !customElements.get(TEXT_MOTION_CHARACTER_TAG)
    ) {
        customElements.define(
            TEXT_MOTION_CHARACTER_TAG,
            TextMotionCharacterElement,
        );
    }
}
