/* SnowUI source notice | LICENSE 2.3.0: ../../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
export interface TextMotionTimelinePlan<T extends HTMLElement> {
    prefixCount: number;
    suffixCount: number;
    oldMiddleNodes: T[];
    newMiddleNodes: T[];
    prefixNodes: T[];
    suffixNodes: T[];
    nextNodes: T[];
    preservedNodes: T[];
}

export interface TextMotionTimelineCommit<T extends HTMLElement, Snapshot> {
    plan: TextMotionTimelinePlan<T>;
    capture: (plan: TextMotionTimelinePlan<T>) => Snapshot;
    commit: (plan: TextMotionTimelinePlan<T>, snapshot: Snapshot) => void;
    playLayout: (
        plan: TextMotionTimelinePlan<T>,
        snapshot: Snapshot,
    ) => void;
}

export function createTextMotionTimelinePlan<T extends HTMLElement>(
    currentNodes: T[],
    nextLabels: string[],
    getLabel: (node: T) => string,
    createNode: (label: string, index: number) => T,
): TextMotionTimelinePlan<T> {
    const previousLabels = currentNodes.map(getLabel);
    let prefixCount = 0;
    while (
        prefixCount < previousLabels.length &&
        prefixCount < nextLabels.length &&
        previousLabels[prefixCount] === nextLabels[prefixCount]
    ) {
        prefixCount += 1;
    }

    let suffixCount = 0;
    const maxSuffix = Math.min(
        previousLabels.length - prefixCount,
        nextLabels.length - prefixCount,
    );
    while (
        suffixCount < maxSuffix &&
        previousLabels[previousLabels.length - suffixCount - 1] ===
            nextLabels[nextLabels.length - suffixCount - 1]
    ) {
        suffixCount += 1;
    }

    const oldSuffixStart = currentNodes.length - suffixCount;
    const newSuffixStart = nextLabels.length - suffixCount;
    const prefixNodes = currentNodes.slice(0, prefixCount);
    const suffixNodes = currentNodes.slice(oldSuffixStart);
    const oldMiddleNodes = currentNodes.slice(prefixCount, oldSuffixStart);
    const newMiddleNodes = nextLabels
        .slice(prefixCount, newSuffixStart)
        .map((label, index) => createNode(label, index));
    const nextNodes = [...prefixNodes, ...newMiddleNodes, ...suffixNodes];

    return {
        prefixCount,
        suffixCount,
        oldMiddleNodes,
        newMiddleNodes,
        prefixNodes,
        suffixNodes,
        nextNodes,
        preservedNodes: [...prefixNodes, ...suffixNodes],
    };
}

export function commitTextMotionTimeline<T extends HTMLElement, Snapshot>({
    plan,
    capture,
    commit,
    playLayout,
}: TextMotionTimelineCommit<T, Snapshot>) {
    const snapshot = capture(plan);
    commit(plan, snapshot);
    playLayout(plan, snapshot);
    return snapshot;
}
