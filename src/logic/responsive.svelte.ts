/* SnowUI source notice | LICENSE 2.3.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
/**
 * Responsive Controller
 * 响应式控制器：管理组件的响应式能力和断点检测。
 * v1.2.0
 * 
 * 关键字：responsive
 * 断点：xs, sm, md, lg, xl, 2xl
 * 上报数据：breakpoint
 * 详见：responsive.md
 */

import { resizeManager } from "./observer.svelte";

/**
 * 断点类型
 */
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/**
 * 响应式规则配置
 */
export interface ResponsiveRule {
    collapsed?: boolean;
    expanded?: boolean;
    style?: string;
    class?: string;
    props?: Record<string, any>;
}

export type ResponsiveConfig = Partial<Record<Breakpoint, ResponsiveRule>>;

/**
 * 断点阈值 (基于容器宽度)
 */
const BREAKPOINT_THRESHOLDS = {
    xs: 200,
    sm: 400,
    md: 700,
    lg: 1024,
    xl: 1280,
};

export class ResponsiveController {
    #config = $state<ResponsiveConfig>({});
    #width = $state(0);
    #connected = false;

    constructor(config: ResponsiveConfig = {}) {
        this.#config = config;
    }

    // === 上报数据 (严格按文档定义) ===

    /**
     * 当前激活的断点
     */
    get breakpoint(): Breakpoint {
        if (this.#width < BREAKPOINT_THRESHOLDS.xs) return 'xs';
        if (this.#width < BREAKPOINT_THRESHOLDS.sm) return 'sm';
        if (this.#width < BREAKPOINT_THRESHOLDS.md) return 'md';
        if (this.#width < BREAKPOINT_THRESHOLDS.lg) return 'lg';
        if (this.#width < BREAKPOINT_THRESHOLDS.xl) return 'xl';
        return '2xl';
    }

    /**
     * 更新配置
     */
    updateConfig(newConfig: ResponsiveConfig) {
        this.#config = newConfig;
    }

    /**
     * 获取当前断点的规则配置 (内部使用)
     */
    getRule(): ResponsiveRule | undefined {
        return this.#config[this.breakpoint];
    }

    /**
     * 当前断点的 props 覆写 (便捷访问)
     */
    get props(): Record<string, any> | undefined {
        return this.getRule()?.props;
    }

    /**
     * 当前断点的 style 覆写 (便捷访问)
     */
    get style(): string | undefined {
        return this.getRule()?.style;
    }

    /**
     * Svelte Action - 绑定到容器元素进行宽度监听
     */
    connect = (node: HTMLElement) => {
        if (Object.keys(this.#config).length === 0) return;
        if (this.#connected) return;
        this.#connected = true;

        const unwatch = resizeManager.watch(node, (entry) => {
            if (entry.contentBoxSize) {
                this.#width = entry.contentBoxSize[0].inlineSize;
            } else {
                this.#width = entry.contentRect.width;
            }
        });

        this.#width = node.getBoundingClientRect().width;

        return {
            destroy() {
                unwatch();
            }
        };
    };
}
