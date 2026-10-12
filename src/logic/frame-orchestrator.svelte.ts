/* SnowUI source notice | LICENSE 2.1.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
import { getContext, setContext } from 'svelte';

const ORCHESTRATION_KEY = Symbol('FRAME_ORCHESTRATION');

export interface ComponentState {
    width?: number | string;
    height?: number | string;
    minWidth?: number | string;
    minHeight?: number | string;
    padding?: number;
    gap?: number;
    radius?: number | string;
    border?: number;
    innerBorder?: boolean | string;
    fontSize?: number | string;
    size?: number;
    opacity?: number;
    id?: string;
    [key: string]: any;
}

export class StyleOrchestrator {
    // Registry of component states, keyed by ID
    // We use $state to make it reactive
    components = $state<Record<string, ComponentState>>({});

    // Style rules, keyed by ID selector (e.g., "#my-btn")
    rules = $state<Record<string, Record<string, string | number>>>({});

    constructor() { }

    register(id: string, initialState: ComponentState) {
        if (!id) return;
        // Verify if exists to avoid overwriting unless needed (though components re-mounting might trigger this)
        // We do a shallow merge to ensure we have the latest ref
        if (!this.components[id]) {
            this.components[id] = initialState;
        } else {
            Object.assign(this.components[id], initialState);
        }
    }

    updateState(id: string, patch: Partial<ComponentState>) {
        if (!id || !this.components[id]) return;
        Object.assign(this.components[id], patch);
    }

    setRules(newRules: Record<string, Record<string, string | number>>) {
        this.rules = newRules;
    }

    /**
     * Parse and evaluate an expression string.
     * Supported syntax: "$#target.prop", "$self.prop", basic math and logic.
     */
    private evaluate(expression: string | number, contextId: string): string | number {
        if (typeof expression === 'number') return expression;
        if (typeof expression !== 'string') return expression;
        if (!expression.includes('$')) return expression;

        try {
            // Replace $#target.prop with value lookup
            // Regex for $#target.prop: \$#([\w-]+)\.(\w+)
            let parsed = expression.replace(/\$#([\w-]+)\.(\w+)/g, (_, targetId, prop) => {
                const target = this.components[targetId];
                if (!target) return '0'; // Fallback
                const val = target[prop];
                return typeof val === 'number' ? val.toString() : `"${val}"`;
            });

            // Replace $self.prop
            // Regex for $self.prop: \$self\.(\w+)
            parsed = parsed.replace(/\$self\.(\w+)/g, (_, prop) => {
                const self = this.components[contextId];
                if (!self) return '0';
                const val = self[prop];
                return typeof val === 'number' ? val.toString() : `"${val}"`;
            });

            // Safety check: allow only safe chars (alphanum, operators, parens, dots, quotes, spaces)
            // This is a basic sanitizer; for production might need more robust parsing
            // For now, we assume developer input is trusted or we catch errors.

            // Execute
            // eslint-disable-next-line no-new-func
            const fn = new Function(`return ${parsed};`);
            return fn();
        } catch (e) {
            console.warn(`[SnowUI] Orchestration Eval Error ("${expression}"):`, e);
            return 0;
        }
    }

    /**
     * Compute styles for a specific component ID.
     * Returns a CSS style string (e.g., "padding: 20px !important; ...").
     */
    getStyle(id: string): string {
        if (!id) return '';
        const targetRules = this.rules[`#${id}`];
        if (!targetRules) return '';

        let styleString = '';

        for (const [prop, rawValue] of Object.entries(targetRules)) {
            // Evaluate expression or return raw value
            let value = this.evaluate(rawValue, id);
            let lineHeightValue: string | null = null;

            // === 1. Token Properties (Size, Padding, Gap, Radius, Text, Border) ===
            const sizeProps = ['width', 'height', 'minWidth', 'minHeight', 'maxWidth', 'maxHeight', 'size'];
            const tokenProps = [...sizeProps, 'padding', 'gap', 'radius', 'fontSize', 'border'];

            if (tokenProps.includes(prop)) {
                // Check if value is a number (token index)
                if (typeof value === 'number') {
                    const prefixMap: Record<string, string> = {
                        fontSize: 'text',
                        radius: 'radius',
                        border: 'border',
                        padding: 'padding',
                        gap: 'gap'
                    };
                    const isSize = sizeProps.includes(prop);
                    const prefix = isSize ? 'size' : prefixMap[prop];

                    if (prefix === 'text') {
                        const textTokenMap: Record<number, string> = {
                            1: 'var(--text-12)',
                            2: 'var(--text-14)',
                            3: 'var(--text-16)',
                            4: 'var(--text-18)',
                            5: 'var(--text-24)',
                            6: 'var(--text-32)',
                            7: 'var(--text-48)',
                            8: 'var(--text-64)',
                        };
                        const leadingTokenMap: Record<number, string> = {
                            1: 'var(--leading-12)',
                            2: 'var(--leading-14)',
                            3: 'var(--leading-16)',
                            4: 'var(--leading-18)',
                            5: 'var(--leading-24)',
                            6: 'var(--leading-32)',
                            7: 'var(--leading-48)',
                            8: 'var(--leading-64)',
                        };
                        const numeric = value;
                        value = textTokenMap[numeric] ?? 'var(--text-16)';
                        lineHeightValue = leadingTokenMap[numeric] ?? 'var(--leading-16)';
                    } else {
                        // Dynamic calculation: calc(var(--prefix) * index)
                        // Maps to base unit tokens
                        value = `calc(var(--${prefix}) * ${value})`;
                    }
                }
                // If string, assume it's a valid CSS value (e.g. "20px") and pass through
            }

            // === 3. Property Mapping & Special Handling ===
            switch (prop) {
                case 'padding':
                    styleString += `padding: ${value} !important; `;
                    break;
                case 'gap':
                    styleString += `gap: ${value} !important; `;
                    break;
                case 'radius':
                    styleString += `border-radius: ${value} !important; `;
                    break;
                case 'fontSize':
                    styleString += `font-size: ${value} !important; `;
                    if (lineHeightValue) {
                        styleString += `line-height: ${lineHeightValue} !important; `;
                    }
                    break;
                case 'width':
                    styleString += `width: ${value} !important; `;
                    break;
                case 'height':
                    styleString += `height: ${value} !important; `;
                    break;
                case 'minWidth':
                    styleString += `min-width: ${value} !important; `;
                    break;
                case 'minHeight':
                    styleString += `min-height: ${value} !important; `;
                    break;
                case 'border':
                    // Outer border (Real border)
                    styleString += `border-width: ${value} !important; border-style: solid !important; `;
                    break;
                case 'innerBorder':
                    // Inner border (Box Shadow)
                    let width = '1px';
                    if (typeof value === 'string') width = value;
                    if (typeof value === 'number') width = `${value}px`;

                    // We might need a color variable. For now use currentColor or a border var
                    styleString += `box-shadow: inset 0 0 0 ${width} var(--border-color, currentColor) !important; `;
                    break;
                case 'opacity':
                    styleString += `opacity: ${value} !important; `;
                    break;
                // Add more cases as needed
                default:
                    // Generic fallback for other properties
                    // Convert camelCase to kebab-case
                    const cssProp = prop.replace(/([A-Z])/g, '-$1').toLowerCase();
                    // Basic sanity check to avoid injecting bad styles?
                    // Assume developer knows what they are doing with custom properties
                    styleString += `${cssProp}: ${value} !important; `;
            }
        }
        return styleString;
    }
}

export function initOrchestrator() {
    const orchestrator = new StyleOrchestrator();
    setContext(ORCHESTRATION_KEY, orchestrator);
    return orchestrator;
}

export function getOrchestrator(): StyleOrchestrator | undefined {
    return getContext(ORCHESTRATION_KEY);
}
