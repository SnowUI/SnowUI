/* SnowUI source notice | LICENSE 2.3.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
import type { FrameProps, CoreState, LinkageControl } from "./frame-types";
import type { Motion } from "./motion.svelte";
import {resolveFrameWhileMotionConfig} from "./frame-motion-defaults";

export class FrameState {
    #props: FrameProps;
    #motion: Motion | undefined;

    // === 交互状态 (Internal Interaction States) ===
    hovered = $state(false);
    pressed = $state(false);
    focused = $state(false);
    isDragging = $state(false);
    isScrolling = $state(false);
    isKeyActive = $state(false);

    // === 核心状态 (Core State) ===
    currentState = $state<CoreState>("Idle");

    constructor(props: FrameProps, motion: Motion | undefined = undefined) {
        this.#props = props;
        this.#motion = motion;

        $effect(() => {
            const controlledState = this.#props.currentState;
            if (controlledState && this.currentState !== controlledState) {
                this.currentState = controlledState;
            }
        });

        // 状态变化时处理链式转变
        $effect(() => {
            const transitionConfig = this.#getTransitionConfig(this.currentState);
            const { nextState, auto, run } = this.#parseTransition(transitionConfig);

            // 执行回调
            if (run) {
                run();
            }

            // Reload 状态时调用 onReload 回调
            if (this.currentState === "Reload" && this.#props.onReload) {
                this.#props.onReload();
            }

            if (nextState && auto) {
                const duration = this.#getDuration(this.currentState);
                const timer = setTimeout(() => {
                    this.currentState = nextState;
                }, duration);
                return () => clearTimeout(timer);
            }
        });
    }

    // === 综合状态 (Derived Interaction State) ===
    get interactionState() {
        // 优先使用声明式状态机状态
        if (this.currentState !== "Idle") return this.currentState;

        // 回退到传统状态判断
        if (this.#props.whileDisabled) return "Disabled";
        if (this.#props.loading) return "Load";
        if (this.pressed) return "Click";
        if (this.hovered) return "Hover";
        if (this.focused) return "Focus";
        if (this.isDragging) return "Drag";
        if (this.isScrolling) return "Scroll";
        return "Idle";
    }

    // 是否有任何触发器激活 (用于 whileIdle)
    get isAnyTriggerActive() {
        return (
            this.hovered ||
            this.pressed ||
            this.focused ||
            this.isDragging ||
            this.isScrolling ||
            !!this.#props.loading ||
            !!this.#props.whileActive ||
            !!this.#props.whileDisabled ||
            this.#props.collapsed ||
            this.#props.expanded
        );
    }

    // === Helpers ===

    #parseTransition(config: any): {
        nextState: CoreState | null;
        auto: boolean;
        run?: () => void;
    } {
        if (!config) return { nextState: null, auto: false };

        // 1. 数组形式: [State, 'auto']
        if (Array.isArray(config)) {
            return {
                nextState: config[0] as CoreState,
                auto: config[1] === "auto",
            };
        }

        // 2. 函数形式: () => void
        if (typeof config === "function") {
            return { nextState: null, auto: false, run: config };
        }

        // 3. 对象形式: { next, auto, run }
        if (typeof config === "object" && ("next" in config || "run" in config)) {
            return {
                nextState: config.next as CoreState,
                auto: !!config.auto,
                run: config.run
            };
        }

        // 4. 字符串形式: State
        return { nextState: config as CoreState, auto: false };
    }

    #getWhileConfig(state: CoreState) {
        // 标准状态优先走统一默认动效解析，保证 auto 时长与默认/覆写配置一致
        const configMap: Record<string, any> = {
            StartLoad: resolveFrameWhileMotionConfig(this.#props, "whileLoad"),
            Load: resolveFrameWhileMotionConfig(this.#props, "whileLoad"),
            Reload: resolveFrameWhileMotionConfig(this.#props, "whileReload"),
            Appear: resolveFrameWhileMotionConfig(this.#props, "whileAppear"),
            Disappear: resolveFrameWhileMotionConfig(this.#props, "whileDisappear"),
            Idle: resolveFrameWhileMotionConfig(this.#props, "whileIdle"),
            Active: resolveFrameWhileMotionConfig(this.#props, "whileActive"),
            Disabled: resolveFrameWhileMotionConfig(this.#props, "whileDisabled"),
            Validating: resolveFrameWhileMotionConfig(this.#props, "whileValidating"),
            Uploading: resolveFrameWhileMotionConfig(this.#props, "whileUploading"),
            Editing: resolveFrameWhileMotionConfig(this.#props, "whileEditing"),
        };

        // 标准状态直接返回（可为 undefined）
        if (state in configMap) return configMap[state];

        // 尝试获取动态属性 (Custom States): while[State]
        const dynamicKey = `while${state}`;
        return this.#props[dynamicKey];
    }

    #getDuration(state: CoreState): number {
        const config = this.#getWhileConfig(state);
        if (config && typeof config === "object" && "duration" in config) {
            return config.duration;
        }
        return 300; // 默认 300ms
    }

    #getTransitionConfig(state: CoreState) {
        const transitionMap: Record<string, any> = {
            StartLoad: this.#props.StartLoad,
            Load: this.#props.Load,
            Reload: this.#props.Reload,
            Appear: this.#props.Appear,
            Disappear: this.#props.Disappear,
            Idle: this.#props.Idle,
            Active: this.#props.Active,
            Disabled: this.#props.Disabled,
        };

        // 如果是标准状态且有配置，直接返回
        if (transitionMap[state]) return transitionMap[state];

        // 尝试获取动态属性 (Custom States): [State]
        return this.#props[state];
    }

    // === Event Handlers ===

    #handleModifiers(e: Event, config: any) {
        if (config && typeof config === 'object') {
            if (config.stop) e.stopPropagation();
            if (config.prevent) e.preventDefault();
        }
    }

    #isStateMapTrigger(config: any): boolean {
        if (!config || typeof config !== "object" || Array.isArray(config)) {
            return false;
        }

        // 这些字段属于普通 Trigger/Linkage 配置，不视为“按状态映射”
        const reservedKeys = [
            "run",
            "target",
            "action",
            "reverse",
            "state",
            "key",
            "next",
            "auto",
            "stop",
            "prevent",
        ];

        if (reservedKeys.some((key) => key in config)) return false;
        return Object.keys(config).length > 0;
    }

    #resolveStateMapTrigger(config: Record<string, any>) {
        return config[this.currentState] ?? config.Idle;
    }

    #applyEventTrigger(config: any, e: Event) {
        if (!config) return;

        this.#handleModifiers(e, config);

        if (typeof config === "function") {
            config(e);
            return;
        }

        if (typeof config === "string") {
            this.currentState = config as CoreState;
            return;
        }

        if (Array.isArray(config)) {
            if (typeof config[0] === "string") {
                this.currentState = config[0] as CoreState;
            }
            return;
        }

        if (typeof config === "object") {
            if ("run" in config && typeof config.run === "function") {
                config.run(e);
            }
            if ("state" in config && typeof config.state === "string") {
                this.currentState = config.state as CoreState;
            } else if ("next" in config && typeof config.next === "string") {
                this.currentState = config.next as CoreState;
            }
            if ("target" in config) {
                this.#handleLinkageControl(config as LinkageControl);
            }
        }
    }

    // --- Mouse Events ---
    handleClick = (e: MouseEvent) => {
        const { Click } = this.#props;
        if (!Click) return;

        // 支持按当前状态分发点击触发器：
        // Click={{ Idle: "Load", Active: "Idle" }}
        if (this.#isStateMapTrigger(Click)) {
            const mapped = this.#resolveStateMapTrigger(Click as Record<string, any>);
            this.#applyEventTrigger(mapped, e);
            return;
        }

        // 兼容旧行为：非映射模式仅在 Idle 状态响应 Click
        if (this.currentState !== "Idle") return;
        this.#applyEventTrigger(Click, e);
    };

    handleDblClick = (_e: MouseEvent) => {
        // Reserved for future DblClick prop
    };

    handleContextMenu = (_e: MouseEvent) => {
        // Reserved for future ContextMenu prop
    };

    handleMouseEnter = (e: MouseEvent) => {
        this.hovered = true;
        const { Hover } = this.#props;
        if (Hover) {
            this.#handleModifiers(e, Hover);
            if (typeof Hover === "function") {
                Hover(e);
            } else if (typeof Hover === "string") {
                this.currentState = Hover as CoreState;
            } else if (typeof Hover === "object") {
                if ("run" in Hover && typeof Hover.run === "function") {
                    Hover.run(e);
                }
                if ("target" in Hover) {
                    this.#handleLinkageControl(Hover as LinkageControl);
                }
            }
        }
    };

    handleMouseLeave = () => {
        this.hovered = false;
        this.pressed = false;
    };

    handleMouseDown = () => {
        this.pressed = true;
    };

    handleMouseUp = (_e: MouseEvent) => {
        this.pressed = false;
        // Click logic moved to handleClick
    };

    handleMouseMove = (_e: MouseEvent) => {
        // Reserved
    };

    // --- Touch Events ---
    handleTouchStart = (_e: TouchEvent) => {
        this.pressed = true;
    };

    handleTouchEnd = (_e: TouchEvent) => {
        this.pressed = false;
    };

    handleTouchMove = (_e: TouchEvent) => {
        // Reserved
    };

    handleTouchCancel = (_e: TouchEvent) => {
        this.pressed = false;
    };

    // --- Focus Events ---
    handleFocus = (e: FocusEvent) => {
        this.focused = true;
        const { Focus } = this.#props;
        if (Focus) {
            this.#handleModifiers(e, Focus);
            if (typeof Focus === "function") {
                Focus(e);
            } else if (typeof Focus === "string") {
                this.currentState = Focus as CoreState;
            } else if (typeof Focus === "object") {
                if ("run" in Focus && typeof Focus.run === "function") {
                    Focus.run(e);
                }
                if ("target" in Focus) {
                    this.#handleLinkageControl(Focus as LinkageControl);
                }
            }
        }
    };

    handleBlur = () => {
        this.focused = false;
    };

    // --- Keyboard Events ---
    handleKeyDown = (e: KeyboardEvent) => {
        this.isKeyActive = true;
        const { Key } = this.#props;
        if (Key && e.key === Key.key) {
            this.#handleModifiers(e, Key);
            if ("run" in Key && typeof Key.run === "function") {
                Key.run(e);
            } else if ("state" in Key) {
                this.currentState = Key.state as CoreState;
            } else if ("target" in Key) {
                this.#handleLinkageControl(Key as any);
            }
        }
    };

    handleKeyUp = () => {
        this.isKeyActive = false;
    };

    handleKeyPress = (_e: KeyboardEvent) => {
        // Reserved
    };

    // --- Form Events ---
    handleInput = (_e: Event) => {
        // Reserved
    };

    handleChange = (_e: Event) => {
        // Reserved
    };

    handleSubmit = (_e: Event) => {
        // Reserved
    };

    // --- Drag Events ---
    handleDragStart = (e: DragEvent) => {
        this.isDragging = true;
        const { Drag } = this.#props;
        if (Drag) {
            this.#handleModifiers(e, Drag);
            if (typeof Drag === "function") {
                Drag(e);
            } else if (typeof Drag === "string") {
                this.currentState = Drag as CoreState;
            } else if (typeof Drag === "object") {
                if ("run" in Drag && typeof Drag.run === "function") {
                    Drag.run(e);
                }
                if ("target" in Drag) {
                    this.#handleLinkageControl(Drag as LinkageControl);
                }
            }
        }
    };

    handleDrag = (_e: DragEvent) => {
        // Reserved for future Drag move handling
    };

    handleDragEnd = (_e: DragEvent) => {
        this.isDragging = false;
    };

    // --- UI Events ---
    handleScroll = (_e: Event) => {
        // Reserved
    };

    #handleLinkageControl(config: LinkageControl) {
        if (config.target) {
            // 1. Resolve Target Controller
            let controller: any;

            if (typeof config.target === 'string') {
                // String ID -> Use internal motion instance
                // No controller object for string IDs, handled in step 2 directly via this.#motion
            } else if (typeof config.target === 'object') {
                // Object Ref -> Try to get controller
                // Case A: Svelte 5 bind:this instance with exported getController
                if ('getController' in config.target && typeof (config.target as any).getController === 'function') {
                    controller = (config.target as any).getController();
                }
                // Case B: Maybe it IS the controller?
                else {
                    controller = config.target;
                }
            }

            // 2. Execute Action
            if (typeof config.target === 'string' && this.#motion) {
                // Legacy String ID Logic
                if (config.action === "play") {
                    this.#motion.Play(config.target, { reverse: config.reverse });
                } else if (config.action === "reset") {
                    this.#motion.Reset(config.target);
                } else if (config.action === "pause") {
                    this.#motion.pause(config.target);
                }
            } else if (controller) {
                // Object Controller Logic
                if (config.action === "play" && controller.play) {
                    controller.play({ reverse: config.reverse });
                } else if (config.action === "reset" && controller.reset) {
                    controller.reset();
                } else if (config.action === "pause" && controller.pause) {
                    controller.pause();
                }
            }
        }
    }
}
