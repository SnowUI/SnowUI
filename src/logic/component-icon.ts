/* SnowUI source notice | LICENSE 2.0.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
import type { Component } from "svelte";

export type ComponentIconWeight =
    | "regular"
    | "thin"
    | "light"
    | "bold"
    | "fill"
    | "duotone";

export interface ComponentIconRequest {
    name: string;
    weight: ComponentIconWeight;
    /** 既有显式资源 API 的可选提示；组件内置功能图标不得依赖它。 */
    collection?: string;
}

export interface ComponentIconRenderProps {
    size?: number | string;
    color?: string;
    weight?: ComponentIconWeight;
    class?: string;
    [key: string]: unknown;
}

export type ComponentIconComponent = Component<ComponentIconRenderProps>;
export type ComponentIconMap = Record<string, ComponentIconComponent | undefined>;
export type ComponentIconResolver = (
    request: ComponentIconRequest,
) => ComponentIconComponent | undefined;

export interface ComponentIconContext {
    resolve(request: ComponentIconRequest): ComponentIconComponent | undefined;
}

export const COMPONENT_ICON_CONTEXT_KEY = Symbol("COMPONENT_ICON_CONTEXT_KEY");

// 可选 resource-svelte 子组件的尺寸兼容桥；共享 Symbol 不形成包依赖。
export const OPTIONAL_RESOURCE_ICON_CONTEXT_KEY = Symbol.for(
    "@snowui-design-system/resource-icon-context",
);

export function createComponentIconResolver(
    icons: ComponentIconMap,
): ComponentIconResolver {
    return ({ name }) => icons[name];
}
