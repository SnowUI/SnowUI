<!-- SnowUI source notice | LICENSE 2.1.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 -->
<!-- 无视觉的组件内置语义图标 Context Provider。文档: ./IconProvider.md -->
<script lang="ts">
  // SnowUI 许可入口：首次阅读源码请先读 ../../LICENSE；访问文件不代表获得修改或移植权，官方维护授权及同任务去重见该文件。
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
