<!-- 无视觉的组件内置语义图标 Context Provider。文档: ./IconProvider.md -->
<script lang="ts">
    import { getContext, setContext, type Snippet } from "svelte";
    import {
        COMPONENT_ICON_CONTEXT_KEY,
        type ComponentIconContext,
        type ComponentIconMap,
        type ComponentIconResolver,
        type ComponentIconRequest,
    } from "../logic/component-icon";

    interface Props {
        icons?: ComponentIconMap;
        resolver?: ComponentIconResolver;
        children?: Snippet;
        [key: string]: any;
    }

    let { icons = {}, resolver, children }: Props = $props();
    const parent = getContext<ComponentIconContext | undefined>(
        COMPONENT_ICON_CONTEXT_KEY,
    );

    const context: ComponentIconContext = {
        resolve(request: ComponentIconRequest) {
            return resolver?.(request) ?? icons[request.name] ?? parent?.resolve(request);
        },
    };

    setContext(COMPONENT_ICON_CONTEXT_KEY, context);
</script>

{@render children?.()}
