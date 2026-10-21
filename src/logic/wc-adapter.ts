/* SnowUI source notice | LICENSE 2.3.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
/**
 * Web Components 适配层
 * v1.0.0
 * 
 * 为 Frame 组件提供 Web Components 兼容接口，
 * 使 Svelte 组件能够在原生 Web Component 环境中使用。
 */

import type { FrameProps } from './frame-types';

/**
 * Props 序列化/反序列化工具
 * 用于将 FrameProps 转换为 HTML 属性格式
 */
export interface WCPropsAdapter {
    /**
     * 将 FrameProps 序列化为 HTML 属性
     * 复杂对象会被 JSON 序列化
     */
    serialize(props: Partial<FrameProps>): Record<string, string>;

    /**
     * 从 HTML 属性反序列化为 FrameProps
     */
    deserialize(attrs: NamedNodeMap): Partial<FrameProps>;
}

/**
 * Snippet → Slot 映射配置
 */
export interface SnippetToSlotMapping {
    /** 默认 slot */
    default: string;
    /** 命名 snippets 到 named slots 的映射 */
    named: Record<string, string>;
}

/**
 * Context → 属性平坦化配置
 */
export interface ContextFlattenConfig {
    /** Context key → 属性前缀的映射 */
    prefixes: Record<symbol, string>;
    /** 需要暴露为属性的 Context 键 */
    expose: string[];
}

/**
 * Web Component 适配器接口
 */
export interface WCAdapter {
    /** Props 适配器 */
    props: WCPropsAdapter;

    /** Snippet → Slot 映射 */
    snippetMapping: SnippetToSlotMapping;

    /** Context 平坦化配置 */
    contextConfig: ContextFlattenConfig;

    /** 
     * 创建自定义元素类
     * @param tagName - 自定义元素标签名 (如 "snowui-frame")
     */
    createCustomElement(tagName: string): CustomElementConstructor;
}

// === 默认实现 ===

/**
 * 默认 Props 序列化器
 */
export const defaultPropsAdapter: WCPropsAdapter = {
    serialize(props: Partial<FrameProps>): Record<string, string> {
        const result: Record<string, string> = {};

        for (const [key, value] of Object.entries(props)) {
            if (value === undefined) continue;

            if (typeof value === 'object') {
                result[`data-${key}`] = JSON.stringify(value);
            } else if (typeof value === 'boolean') {
                if (value) result[key] = '';
            } else {
                result[key] = String(value);
            }
        }

        return result;
    },

    deserialize(attrs: NamedNodeMap): Partial<FrameProps> {
        const result: Partial<FrameProps> = {};

        for (let i = 0; i < attrs.length; i++) {
            const attr = attrs[i];
            const key = attr.name.replace(/^data-/, '');
            const value = attr.value;

            // 尝试 JSON 解析
            if (value.startsWith('{') || value.startsWith('[')) {
                try {
                    (result as any)[key] = JSON.parse(value);
                } catch {
                    (result as any)[key] = value;
                }
            } else if (value === '' || value === 'true') {
                (result as any)[key] = true;
            } else if (value === 'false') {
                (result as any)[key] = false;
            } else if (!isNaN(Number(value))) {
                (result as any)[key] = Number(value);
            } else {
                (result as any)[key] = value;
            }
        }

        return result;
    }
};

/**
 * 默认 Snippet → Slot 映射
 */
export const defaultSnippetMapping: SnippetToSlotMapping = {
    default: '',  // 默认 slot 无名称
    named: {
        // 预留：未来可扩展命名 snippets
    }
};

/**
 * 创建基础的 Web Component 包装器
 * 注意：这是一个简化的实现，完整版需要与 Svelte 的 Custom Elements 编译选项配合使用
 * 
 * @param SvelteComponent - Svelte 组件类
 * @param tagName - 自定义元素标签名
 */
export function createFrameElement(
    SvelteComponent: any,
    tagName: string = 'snowui-frame'
): CustomElementConstructor {
    class FrameElement extends HTMLElement {
        private _component: any;

        static get observedAttributes() {
            return ['class', 'style', 'disabled', 'loading'];
        }

        constructor() {
            super();
            this.attachShadow({ mode: 'open' });
        }

        connectedCallback() {
            const props = defaultPropsAdapter.deserialize(this.attributes);

            this._component = new SvelteComponent({
                target: this.shadowRoot!,
                props: {
                    ...props,
                    children: () => {
                        // 将 light DOM 内容移至 shadow DOM
                        const slot = document.createElement('slot');
                        return slot;
                    }
                }
            });
        }

        disconnectedCallback() {
            this._component?.$destroy();
        }

        attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
            if (this._component) {
                this._component.$set({ [name]: newValue });
            }
        }
    }

    // 注册自定义元素
    if (!customElements.get(tagName)) {
        customElements.define(tagName, FrameElement);
    }

    return FrameElement;
}
