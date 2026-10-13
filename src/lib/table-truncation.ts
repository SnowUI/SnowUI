/* SnowUI source notice | LICENSE 2.2.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
import { resizeManager } from "../logic/observer.svelte";

export interface TableTruncationResult {
    isTruncated: boolean;
    fullText: string;
    hasNestedOwner: boolean;
}

interface TableTruncationTarget {
    isEnabled: () => boolean;
    notify: (result: TableTruncationResult) => void;
}

/**
 * Batches single-line cell overflow reads for one semantic table.
 *
 * Dense tables must not observe every cell independently. The table and its
 * viewport are the only ResizeObserver targets; all cell reads happen in one
 * animation frame, followed by a separate notification pass.
 */
export class TableTruncationManager {
    #targets = new Map<HTMLElement, TableTruncationTarget>();
    #frame = 0;

    register(
        node: HTMLElement,
        target: TableTruncationTarget,
    ) {
        this.#targets.set(node, target);
        this.schedule();
        return () => {
            this.#targets.delete(node);
        };
    }

    observe(...nodes: Array<HTMLElement | undefined>) {
        const uniqueNodes = [...new Set(nodes.filter(Boolean) as HTMLElement[])];
        const cleanups = uniqueNodes.map((node) =>
            resizeManager.watch(node, () => this.schedule()),
        );
        this.schedule();
        return () => cleanups.forEach((cleanup) => cleanup());
    }

    schedule() {
        if (this.#frame || typeof requestAnimationFrame === "undefined") return;
        this.#frame = requestAnimationFrame(() => this.#flush());
    }

    destroy() {
        if (this.#frame) cancelAnimationFrame(this.#frame);
        this.#frame = 0;
        this.#targets.clear();
    }

    #flush() {
        this.#frame = 0;
        const results: Array<[
            TableTruncationTarget,
            TableTruncationResult,
        ]> = [];

        // Read every layout value first. Notifications may update Svelte state
        // and write DOM, so keeping them in a second pass avoids read/write
        // interleaving and forced synchronous layouts.
        for (const [node, target] of this.#targets) {
            if (!target.isEnabled() || !node.isConnected) continue;
            const isTruncated = node.scrollWidth > node.clientWidth;
            results.push([
                target,
                {
                    isTruncated,
                    fullText: isTruncated ? (node.textContent || "").trim() : "",
                    hasNestedOwner: Boolean(
                        node.querySelector(':scope > [data-as="truncation-owner"]'),
                    ),
                },
            ]);
        }

        for (const [target, result] of results) target.notify(result);
    }
}
