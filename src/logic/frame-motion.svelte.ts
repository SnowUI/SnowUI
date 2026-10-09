/**
 * OSS Frame 动效控制器（v1.0.0 起在 OSS）
 *
 * 与 PRO 版本（components/src/logic/frame-pro-motion.svelte.ts）的差异：
 * - 不依赖 Motion 编排器（PRO `motion.svelte.ts`）
 * - 不向 Motion 注册自身（无 `register` / `notify` 调用）
 * - 不实现 `orchestrate*` 编排触发（4 处 $effect 已剥离）
 * - controller 仅暴露 FLIP 自身转场方法（`captureFlip` / `playFlipTo`），不暴露 `play` / `reset` / `captureLayout` / `playLayoutTo` 等需要 Motion 上下文的方法
 *
 * OSS 支持的能力：
 * - layoutId / itemId 自身 FLIP 进场（自动从 layout-flip 模块注册表读取起点）
 * - whileScroll 自身滚动联动
 * - whileAppear / whileHover / whileActive 等通过 CSS bridge 变量（由 frame-motion-defaults.ts 注入）由浏览器原生 transition 执行
 *
 * 作用半径：1 个 Frame
 *
 * PRO 版本独立维护一份完整实现，FramePro 使用 PRO 版本。
 * 详见 ../components/Frame.md §1 切割原则与 /Frame-Refactor-Plan.md §3.4。
 */

import type { FrameProps } from "./frame-types";
import type { FrameState } from "./frame-state.svelte";
import {
    captureFlipRect,
    beginFlipEnter,
    applyFlipExit,
    type FlipTransitionOptions,
} from "./layout-flip";

export class FrameMotion {
    #props: FrameProps;
    #state: FrameState;
    #getId: () => string | undefined;
    #getElement: () => HTMLElement | undefined;

    constructor(
        props: FrameProps,
        state: FrameState,
        getId: () => string | undefined,
        getElement: () => HTMLElement | undefined,
    ) {
        this.#props = props;
        this.#state = state;
        this.#getId = getId;
        this.#getElement = getElement;
        // 注：OSS 不接受 FrameResponsive 参数（PRO 用它做 whileXs/Sm/... 断点 notify，
        // OSS 不向编排器 notify，断点动效由 frame-motion-defaults 写入 CSS bridge 完成）

        // === 独立 FLIP 进场 ===
        // layoutId/itemId 存在时尝试从模块注册表（layout-flip.ts）读取起点并播放进场动效。
        // 与 PRO 不同：OSS 不向 Motion 编排器注册，所以这是唯一的 FLIP 进场路径。
        $effect(() => {
            const element = this.#getElement();
            const flipId = this.#props.itemId ?? this.#props.layoutId;
            if (flipId && element) {
                beginFlipEnter(flipId, element);
            }
        });

        // === whileScroll 触发器 ===
        $effect(() => {
            if (this.#props.whileScroll) {
                return this.#setupWhileScroll();
            }
        });

        // 注：OSS 不实现 PRO 的以下能力
        // - 注册到 Motion 编排器（PRO line 49-58）
        // - 状态→Motion notify 差量更新（PRO line 67-111）
        // - 生命周期 whileAppear/whileDisappear notify（PRO line 114-132）
        // - orchestrateTrigger: appear/hover/click/scroll（PRO line 121-165）
        // - 响应式断点 whileXs/Sm/Md/Lg/Xl/2xl notify（PRO line 168-185）
        //
        // 在 OSS 中：
        // - 状态驱动的视觉变化（hover/focus/active 等）通过 frame-inline-style 注入的 CSS bridge
        //   变量配合组件 CSS 的 transition 实现，由浏览器原生执行
        // - whileAppear 生命周期进入组合动效通过 frame-motion-defaults 写入 CSS 变量后
        //   组件 CSS / Frame 默认 CSS 完成
        // - 跨组件编排（orchestrate*）属 PRO，OSS 静默忽略相关 props
    }

    /** OSS 不需要 shouldRegister 概念，但保留 getter 以兼容旧调用方（始终返回 false） */
    get shouldRegister() {
        return false;
    }

    get controller() {
        return {
            /** 捕获当前 Frame 位置写入模块级 FLIP 注册表，无需 Motion 上下文。 */
            captureFlip: (layoutId?: string) => {
                const id =
                    layoutId ??
                    this.#props.itemId ??
                    this.#props.layoutId ??
                    this.#getId();
                const element = this.#getElement();
                if (id && element) captureFlipRect(id, element);
            },
            /** 将当前 Frame 以 FLIP 方式过渡到目标位置，无需 Motion 上下文。 */
            playFlipTo: (
                target?: HTMLElement | DOMRect,
                options?: FlipTransitionOptions,
            ) => {
                const element = this.#getElement();
                if (element && target) {
                    applyFlipExit(element, target, options);
                } else {
                    options?.onComplete?.();
                }
            },
            // 以下方法在 OSS 中不可用（需要 Motion 编排器）：
            // - play / reset / pause（需要 Motion.Play/Reset/pause）
            // - captureLayout / playLayoutTo（需要 Motion.captureLayout/playLayoutTo）
            // 如需以上能力请使用 FramePro。
        };
    }

    #setupWhileScroll() {
        const element = this.#getElement();
        if (!element) return;

        // 解析 offset 配置 (如 ["start center", "end center"])
        const scrollConfig = this.#props.scroll;
        const offset = scrollConfig?.offset ?? ["start center", "end center"];

        // 解析偏移量
        const parseOffset = (str: string): { element: string; viewport: string } => {
            const parts = str.split(" ");
            return {
                element: parts[0] || "start", // start, center, end
                viewport: parts[1] || "center" // start, center, end
            };
        };

        const startOffset = parseOffset(offset[0]);

        const handleScroll = () => {
            const rect = element.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            // 计算元素位置
            const getElementPosition = (pos: string): number => {
                if (pos === "start") return rect.top;
                if (pos === "end") return rect.bottom;
                return rect.top + rect.height / 2; // center
            };

            // 计算视口位置
            const getViewportPosition = (pos: string): number => {
                if (pos === "start") return 0;
                if (pos === "end") return viewportHeight;
                return viewportHeight / 2; // center
            };

            const elementPos = getElementPosition(startOffset.element);
            const viewportTrigger = getViewportPosition(startOffset.viewport);

            // 当元素位置到达视口触发点时激活
            const isActive = elementPos <= viewportTrigger;

            if (this.#state.isScrolling !== isActive) {
                this.#state.isScrolling = isActive;
            }
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll(); // Initial check

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }
}
