/* SnowUI source notice | LICENSE 2.0.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
import { setContext, getContext } from "svelte";
import {
    FRAME_CONTEXT_KEY,
    INTERACTION_CONTEXT_KEY,
    SKELETON_CONTEXT_KEY,
    SIZE_CONTEXT_KEY,
} from "../keys";
import type { FrameProps } from "./frame-types";
import type { FrameLayout } from "./frame-layout.svelte";
import type { FrameResponsive } from "./frame-responsive.svelte";

type FramePerceptionState = Pick<
    import("./frame-state.svelte").FrameState,
    | "interactionState"
    | "currentState"
    | "hovered"
    | "pressed"
    | "focused"
    | "isDragging"
    | "isKeyActive"
    | "isScrolling"
>;

export class FramePerception {
    constructor(
        props: FrameProps,
        state: FramePerceptionState,
        layout: FrameLayout,
        responsive: FrameResponsive | null,
        getLoading: () => boolean,
        getSkeleton: () => boolean,
    ) {
        // 获取父组件上下文（如果存在）
        const parentContext = getContext<any>(FRAME_CONTEXT_KEY);

        // 提供完整的上下文给子组件
        const baseContext = {
            // 角色 (Role)
            get role() {
                return props.as;
            },
            get size() {
                return props.size;
            },

            // 状态 (State)
            get interactionState() {
                return state.interactionState;
            },
            get currentState() {
                return state.currentState;
            },

            // 形态 (Morphology)
            get collapsed() {
                return props.collapsed;
            },
            get expanded() {
                return props.expanded;
            },

            // 事件 (Events)
            get Hover() {
                return state.hovered;
            },
            get Click() {
                return state.pressed;
            },
            get Focus() {
                return state.focused;
            },
            get Drag() {
                return state.isDragging;
            },
            get Key() {
                return state.isKeyActive;
            },
            get Scroll() {
                return state.isScrolling;
            },

            // 响应断点 (Responsive)
            get breakpoint() {
                return responsive?.breakpoint ?? 'md';
            },

            // 布局 (Layout)
            get direction() {
                return layout.direction;
            },
            get row() {
                return props.row;
            },
            get column() {
                return props.column;
            },
            get grid() {
                return props.grid;
            },
            get reverse() {
                return props.reverse;
            },

            // 动效 (Motion) - 事件驱动触发器
            get whileLoad() {
                return props.whileLoad;
            },
            get loading() {
                return props.loading;
            },
            get skeleton() {
                return props.skeleton;
            },
            get whileAppear() {
                return props.whileAppear;
            },
            get whileDisappear() {
                return props.whileDisappear;
            },
            get whileIdle() {
                return props.whileIdle;
            },
            get whileActive() {
                return props.whileActive;
            },
            get whileDisabled() {
                return props.whileDisabled;
            },
            get whileClick() {
                return props.whileClick;
            },
            get whileDrag() {
                return props.whileDrag;
            },
            get whileHover() {
                return props.whileHover;
            },
            get whileFocus() {
                return props.whileFocus;
            },
            get whileKey() {
                return props.whileKey;
            },
            get whileScroll() {
                return props.whileScroll;
            },

            // [New] 内置扩展状态
            get whileValidating() { return props.whileValidating; },
            get whileUploading() { return props.whileUploading; },
            get whileEditing() { return props.whileEditing; },

            // 动效 (Motion) - 形态驱动触发器
            get whileCollapsed() {
                return props.whileCollapsed;
            },
            get whileExpanded() {
                return props.whileExpanded;
            },

            // 动效 (Motion) - 响应式驱动触发器
            get whileXs() {
                return props.whileXs;
            },
            get whileSm() {
                return props.whileSm;
            },
            get whileMd() {
                return props.whileMd;
            },
            get whileLg() {
                return props.whileLg;
            },
            get whileXl() {
                return props.whileXl;
            },
            get while2xl() {
                return props.while2xl;
            },

            // 动效 (Motion) - 变体和参数
            get variants() {
                return props.variants;
            },
            get delay() {
                return props.delay;
            },
            get timeline() {
                return props.timeline;
            },

            // 动效 (Motion) - 编排模式
            get orchestrate() {
                return props.orchestrate;
            },
            get orchestrateMode() {
                return props.orchestrateMode;
            },
            get orchestrateDelay() {
                return props.orchestrateDelay;
            },
            get orchestrateOrder() {
                return props.orchestrateOrder;
            },
            get orchestrateGroup() {
                return props.orchestrateGroup;
            },
            get orchestrateTrigger() {
                return props.orchestrateTrigger;
            },
            get orchestrateTarget() {
                return props.orchestrateTarget;
            },

            // 父组件上下文（用于链式继承）
            parent: parentContext,

            // === Frame Evolution ===
            get scope() {
                return props.scope;
            },
            get access() {
                return props.access ?? 'writeable'; // 默认为 writeable
            },
            // 辅助方法：检查是否有写权限
            canWrite() {
                return (props.access ?? 'writeable') === 'writeable';
            }
        };

        // 使用 Proxy 包装以支持动态属性透传 (Custom States)
        const contextProxy = new Proxy(baseContext, {
            get(target, prop, receiver) {
                if (Reflect.has(target, prop)) {
                    return Reflect.get(target, prop, receiver);
                }
                // 动态透传 FrameProps 中的属性 (例如 whileMyState)
                return props[prop as keyof FrameProps];
            }
        });

        setContext(FRAME_CONTEXT_KEY, contextProxy);

        // 兼容旧的上下文 Key（向后兼容）
        setContext(INTERACTION_CONTEXT_KEY, {
            get state() {
                return state.interactionState;
            },
            get Hover() {
                return state.hovered;
            },
            get Click() {
                return state.pressed;
            },
            get Focus() {
                return state.focused;
            },
            get Drag() {
                return state.isDragging;
            },
        });

        setContext(SKELETON_CONTEXT_KEY, {
            get loading() {
                return getLoading();
            },
            get skeleton() {
                return getSkeleton();
            },
        });

        setContext(SIZE_CONTEXT_KEY, {
            get size() {
                return props.size;
            },
            get iconSize() {
                return props.iconSize;
            },
            get avatarSize() {
                return props.avatarSize;
            },
        });
    }
}
