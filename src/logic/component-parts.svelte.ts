import {
    getContext,
    setContext,
    type Component,
    type ComponentProps,
} from "svelte";
import { COMPONENT_PARTS_CONTEXT_KEY } from "../keys";

export type ComponentPartProps = Record<string, unknown>;
export type ComponentParts = Record<string, ComponentPartProps | undefined>;
export type ComponentPartControlledKey =
    | "children"
    | "as"
    | "value"
    | "defaultValue"
    | "open"
    | "selected"
    | "checked"
    | "disabled"
    | "readonly"
    | "id"
    | `on${string}`
    | `aria-${string}`;
export type ConfigurableComponentPartProps<C extends Component<any>> = Partial<
    Omit<ComponentProps<C>, ComponentPartControlledKey>
>;
export type ComponentPartsOf<
    T extends Record<string, Component<any>>,
> = {
    [K in keyof T]?: ConfigurableComponentPartProps<T[K]>;
};

export type ComponentPartsContext = {
    getPart: (componentName: string) => ComponentPartProps | undefined;
};

export type ComponentPartAccessor<T extends ComponentPartProps> = {
    readonly current: Partial<T> | undefined;
};

function mergeClassValue(
    inherited: unknown,
    explicit: unknown,
): unknown {
    if (typeof inherited !== "string") return explicit ?? inherited;
    if (typeof explicit !== "string") return explicit ?? inherited;
    return [inherited, explicit].filter(Boolean).join(" ");
}

function mergeStyleValue(
    inherited: unknown,
    explicit: unknown,
): unknown {
    if (typeof inherited !== "string") return explicit ?? inherited;
    if (typeof explicit !== "string") return explicit ?? inherited;
    const inheritedStyle = inherited.trim().replace(/;+$/, "");
    const explicitStyle = explicit.trim().replace(/;+$/, "");
    return [inheritedStyle, explicitStyle].filter(Boolean).join("; ");
}

/**
 * 读取最近父级复合组件提供的同名 part。
 * 返回 accessor 而不是快照，使父级替换 parts 对象时仍保持响应式。
 */
export function useComponentPart<T extends ComponentPartProps>(
    componentName: string,
): ComponentPartAccessor<T> {
    const context = getContext<ComponentPartsContext | undefined>(
        COMPONENT_PARTS_CONTEXT_KEY,
    );

    return {
        get current() {
            return context?.getPart(componentName) as Partial<T> | undefined;
        },
    };
}

/**
 * 为当前复合组件的直接子组件建立 parts 边界。
 * 每个复合组件都提供自己的边界，因此祖先 parts 不会递归穿透。
 */
export function provideComponentParts(
    getParts: () => ComponentParts | undefined,
): ComponentPartsContext {
    const context: ComponentPartsContext = {
        getPart(componentName) {
            const parts = getParts();
            const part = parts?.[componentName];
            return part && typeof part === "object" ? part : undefined;
        },
    };
    setContext(COMPONENT_PARTS_CONTEXT_KEY, context);
    return context;
}

/**
 * 合并同类型 part 默认值与当前组件实例显式 Props。
 * 显式 Props 胜出；class 合并；style 以 part 在前、显式值在后合并。
 */
export function mergeComponentPartProps<T extends ComponentPartProps>(
    inherited: Partial<T> | undefined,
    explicit: T,
): T {
    if (!inherited) return explicit;

    const explicitDefined = Object.fromEntries(
        Object.entries(explicit).filter(([, value]) => value !== undefined),
    ) as T;
    const merged = {
        ...inherited,
        ...explicitDefined,
    } as T;
    const writableMerged = merged as ComponentPartProps;

    if ("class" in inherited || "class" in explicitDefined) {
        writableMerged["class"] = mergeClassValue(
            inherited["class"],
            explicitDefined["class"],
        );
    }
    if ("style" in inherited || "style" in explicitDefined) {
        writableMerged["style"] = mergeStyleValue(
            inherited["style"],
            explicitDefined["style"],
        );
    }

    return merged;
}
