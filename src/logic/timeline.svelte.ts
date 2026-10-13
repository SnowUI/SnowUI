/* SnowUI source notice | LICENSE 2.2.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
/**
 * Motion Timeline
 * 动效时间轴：负责管理一组动效节点的执行序列。
 */

import { type Motion } from "./motion.svelte";

export type TimelineStatus = "idle" | "playing" | "paused" | "finished";

export interface TimelineNode {
    motionId: string;
    order: number;
}

export class Timeline {
    private nodes: TimelineNode[] = [];
    private status: TimelineStatus = "idle";
    private currentIndex = 0;
    private timer: any = null;
    private isReversed = false;
    private isLoop = false;
    private range: [string, string] | null = null;
    private until: string | null = null;

    constructor(
        public readonly id: string,
        private orchestrator: Motion,
        private onRelease: (id: string) => void
    ) { }

    /**
     * 添加节点到时间轴
     */
    addNode(node: TimelineNode) {
        this.nodes.push(node);
        this.nodes.sort((a, b) => a.order - b.order);
    }

    /**
     * 移除节点
     */
    removeNode(motionId: string) {
        this.nodes = this.nodes.filter((n) => n.motionId !== motionId);
        if (this.nodes.length === 0) {
            this.release();
        }
    }

    /**
     * 开始播放
     */
    play(options?: { reverse?: boolean; loop?: boolean; range?: [string, string]; until?: string }) {
        this.isReversed = options?.reverse ?? false;
        this.isLoop = options?.loop ?? false;
        this.range = options?.range ?? null;
        this.until = options?.until ?? null;
        this.status = "playing";

        if (this.isReversed) {
            this.currentIndex = this.nodes.length - 1;
        } else {
            this.currentIndex = 0;
        }

        if (this.range) {
            const startIdx = this.nodes.findIndex(n => n.motionId === this.range![0]);
            const endIdx = this.nodes.findIndex(n => n.motionId === this.range![1]);
            if (startIdx !== -1 && endIdx !== -1) {
                this.currentIndex = this.isReversed ? Math.max(startIdx, endIdx) : Math.min(startIdx, endIdx);
            }
        }

        this.step();
    }

    /**
     * 暂停
     */
    pause() {
        this.status = "paused";
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
    }

    /**
     * 停止并释放
     */
    end() {
        this.status = "finished";
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        this.release();
    }

    /**
     * 执行下一步
     */
    private step() {
        if (this.status !== "playing") return;

        const node = this.nodes[this.currentIndex];
        if (!node) {
            this.handleComplete();
            return;
        }

        // 触发动效
        // 注意：这里假设动效是即时触发的，或者我们通过某种方式知道它何时结束。
        // 为了简化，我们目前按顺序触发。如果需要等待动效结束，需要组件反馈。
        this.orchestrator.notify(node.motionId, "whileActive", { timeline: this.id });

        // 移动到下一个索引
        if (this.isReversed) {
            this.currentIndex--;
        } else {
            this.currentIndex++;
        }

        // 检查范围限制
        if (this.range) {
            const startIdx = this.nodes.findIndex(n => n.motionId === this.range![0]);
            const endIdx = this.nodes.findIndex(n => n.motionId === this.range![1]);
            const min = Math.min(startIdx, endIdx);
            const max = Math.max(startIdx, endIdx);

            if (this.currentIndex < min || this.currentIndex > max) {
                this.handleComplete();
                return;
            }
        }

        // 检查是否结束
        if (this.currentIndex < 0 || this.currentIndex >= this.nodes.length || (this.until && node.motionId === this.until)) {
            this.handleComplete();
        } else {
            // 模拟步进延迟，实际可能需要根据配置或组件反馈
            this.timer = setTimeout(() => this.step(), 50);
        }
    }

    private handleComplete() {
        if (this.isLoop) {
            this.play({ reverse: this.isReversed, loop: this.isLoop, range: this.range ?? undefined });
        } else {
            this.status = "finished";
            this.release();
        }
    }

    private release() {
        this.onRelease(this.id);
    }
}
