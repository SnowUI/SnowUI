/* SnowUI source notice | LICENSE 2.3.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
// FrameMotion 逻辑模块
// v1.1.0
// 变更记录 (2026-05-03): 接入 layout-flip.ts，captureFlip / playFlipTo 无需 initMotion 上下文即可使用。
// 变更记录 (2026-03-07): whileLoad 触发源改为 loading，释放 whileLoad 关键字回归纯加载态动效。
// 变更记录 (2026-02-03): 移除未使用变量以通过检查

import type { FrameProps } from "./frame-types";
import type { LayoutTransitionOptions } from "./motion-types";
import type { Motion, MotionEvent } from "./motion.svelte";
import type { FrameState } from "./frame-state.svelte";
import type { FrameResponsive } from "./frame-responsive.svelte";
import {hasMotionConfig} from "./frame-utils";
import {captureFlipRect, beginFlipEnter, applyFlipExit, type FlipTransitionOptions} from "./layout-flip";

export class FrameMotion {
    #props: FrameProps;
    #motion: Motion | undefined;
    #state: FrameState;
    #responsive: FrameResponsive | null;
    #getId: () => string | undefined;
    #getElement: () => HTMLElement | undefined;

    constructor(
        props: FrameProps,
        motion: Motion | undefined,
        state: FrameState,
        responsive: FrameResponsive | null,
        getId: () => string | undefined,
        getElement: () => HTMLElement | undefined,
    ) {
        this.#props = props;
        this.#motion = motion;
        this.#state = state;
        this.#responsive = responsive;
        this.#getId = getId;
        this.#getElement = getElement;

        // 注册到编排器，并触发独立 FLIP 进场（无需 Motion 上下文）
        $effect(() => {
            const id = this.#getId();
            const element = this.#getElement();

            // 独立 FLIP 进场：layoutId/itemId 存在时尝试从模块注册表读取起点
            const flipId = this.#props.itemId ?? this.#props.layoutId;
            if (flipId && element) {
                beginFlipEnter(flipId, element);
            }

            if (!this.#motion || !this.shouldRegister || !element || !id)
                return;
            return this.#motion.register({
                id,
                element,
                timeline: this.#props.timeline,
                scroll: this.#props.scroll,
                layoutId: this.#props.itemId ?? this.#props.layoutId,
                scope: this.#props.scope,
            });
        });

        // === 状态变化 -> 动效通知 (合并优化) ===
        // 使用单一 effect 替代多个独立 effect，减少响应式订阅开销

        // 缓存上一次的触发器状态，用于差量更新
        let prevTriggerStates: Record<string, boolean> = {};

        $effect(() => {
            if (!this.#motion) return;
            // 收集所有触发器状态
            const currentStates: Record<string, boolean> = {
                whileHover: this.#state.hovered,
                whileClick: this.#state.pressed,
                whileFocus: this.#state.focused,
                whileDrag: this.#state.isDragging,
                whileScroll: this.#state.isScrolling,
                whileKey: this.#state.isKeyActive,
                whileLoad:
                    this.#state.currentState === "StartLoad" ||
                    this.#state.currentState === "Load" ||
                    !!this.#props.loading,
                whileReload:
                    this.#state.currentState === "Reload" ||
                    !!this.#props.whileReload,
                whileActive:
                    this.#state.currentState === "Active" ||
                    !!this.#props.whileActive,
                whileDisabled:
                    this.#state.currentState === "Disabled" ||
                    !!this.#props.whileDisabled,
                whileValidating:
                    this.#state.currentState === "Validating" ||
                    !!this.#props.whileValidating,
                whileUploading:
                    this.#state.currentState === "Uploading" ||
                    !!this.#props.whileUploading,
                whileEditing:
                    this.#state.currentState === "Editing" ||
                    !!this.#props.whileEditing,
                whileCollapsed: !!this.#props.collapsed,
                whileExpanded: !!this.#props.expanded,
                whileIdle: !this.#state.isAnyTriggerActive,
            };

            // 仅通知发生变化的触发器
            for (const [event, active] of Object.entries(currentStates)) {
                if (prevTriggerStates[event] !== active) {
                    this.#notify(event as any, { active });
                }
            }

            prevTriggerStates = currentStates;
        });

        // 生命周期通知 (单独保留，因为需要 cleanup)
        $effect(() => {
            this.#notify("whileAppear", { active: true });

            // === 编排触发逻辑 ===
            // 根据 orchestrateTrigger 决定何时触发编排
            const trigger = this.#props.orchestrateTrigger ?? "appear";

            if (this.#props.orchestrate && trigger === "appear") {
                const id = this.#getId();
                if (id && this.#motion) {
                    // 使用微任务或下一帧确保子组件已挂载并注册
                    requestAnimationFrame(() => {
                        this.#motion?.Play(id);
                    });
                }
            }

            return () => this.#notify("whileDisappear", { active: true });
        });

        // === orchestrateTrigger: hover ===
        $effect(() => {
            const trigger = this.#props.orchestrateTrigger;
            if (this.#props.orchestrate && trigger === "hover" && this.#state.hovered) {
                const id = this.#getId();
                if (id && this.#motion) {
                    this.#motion.Play(id);
                }
            }
        });

        // === orchestrateTrigger: click ===
        $effect(() => {
            const trigger = this.#props.orchestrateTrigger;
            if (this.#props.orchestrate && trigger === "click" && this.#state.pressed) {
                const id = this.#getId();
                if (id && this.#motion) {
                    this.#motion.Play(id);
                }
            }
        });

        // === orchestrateTrigger: scroll ===
        $effect(() => {
            const trigger = this.#props.orchestrateTrigger;
            if (this.#props.orchestrate && trigger === "scroll" && this.#state.isScrolling) {
                const id = this.#getId();
                if (id && this.#motion) {
                    this.#motion.Play(id);
                }
            }
        });

        // 响应式断点通知
        let prevBreakpoint: string | undefined;
        $effect(() => {
            if (!this.#motion || !this.#responsive) return;
            const breakpoint = this.#responsive.breakpoint;
            if (!breakpoint || breakpoint === prevBreakpoint) return;

            const eventMap: Record<string, any> = {
                xs: "whileXs",
                sm: "whileSm",
                md: "whileMd",
                lg: "whileLg",
                xl: "whileXl",
                "2xl": "while2xl",
            };
            const eventName = eventMap[breakpoint];
            if (eventName) this.#notify(eventName, { active: true });
            prevBreakpoint = breakpoint;
        });

        // Setup whileScroll trigger
        $effect(() => {
            if (this.#props.whileScroll) {
                return this.#setupWhileScroll();
            }
        });
    }

    get shouldRegister() {
        const id = this.#getId();
        return !!id || hasMotionConfig(this.#props);
    }

    get controller() {
        return {
            play: (options?: { reverse?: boolean }) => {
                const id = this.#getId();
                if (id && this.#motion) this.#motion.Play(id, options);
            },
            captureLayout: (layoutId?: string) => {
                const id =
                    layoutId ??
                    this.#props.itemId ??
                    this.#props.layoutId ??
                    this.#getId();
                const element = this.#getElement();
                if (id && element && this.#motion) {
                    this.#motion.captureLayout(id, element);
                }
            },
            playLayoutTo: (
                target?: HTMLElement | DOMRect,
                options?: LayoutTransitionOptions & { layoutId?: string },
            ) => {
                const id =
                    options?.layoutId ??
                    this.#props.itemId ??
                    this.#props.layoutId ??
                    this.#getId();
                const element = this.#getElement();
                if (id && element && this.#motion) {
                    this.#motion.playLayoutTo(id, element, target, options);
                } else {
                    options?.onComplete?.();
                }
            },
            /** 捕获当前 Frame 位置写入模块级 FLIP 注册表，无需 initMotion 上下文。 */
            captureFlip: (layoutId?: string) => {
                const id =
                    layoutId ??
                    this.#props.itemId ??
                    this.#props.layoutId ??
                    this.#getId();
                const element = this.#getElement();
                if (id && element) captureFlipRect(id, element);
            },
            /** 将当前 Frame 以 FLIP 方式过渡到目标位置，无需 initMotion 上下文。 */
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
            reset: () => {
                const id = this.#getId();
                if (id && this.#motion) this.#motion.Reset(id);
            },
            pause: () => {
                // TODO
            }
        };
    }

    #notify(event: MotionEvent, detail: any) {
        const id = this.#getId();
        if (!this.#motion || !this.shouldRegister || !id) return;
        this.#motion.notify(id, event, detail);
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
