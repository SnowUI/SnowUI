<!-- SnowUI source notice | LICENSE 2.0.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 -->
<!-- 无视觉的组件 UI 文案 Context Provider。文档: ./LocaleProvider.md -->
<script lang="ts">
  // SnowUI 许可入口：首次阅读源码请先读 ../../LICENSE；访问文件不代表获得修改或移植权，官方维护授权及同任务去重见该文件。
    import { setContext, type Snippet } from "svelte";
    import { LOCALE_CONTEXT_KEY } from "../keys";
    import { createLocaleContext } from "../i18n/locale.svelte";
    import {
        DEFAULT_LOCALE,
        type SnowUIMessageOverrides,
    } from "../i18n/messages";

    interface Props {
        locale?: string;
        messages?: SnowUIMessageOverrides;
        children?: Snippet;
        [key: string]: any;
    }

    let {
        locale = DEFAULT_LOCALE,
        messages = {},
        children,
    }: Props = $props();

    setContext(
        LOCALE_CONTEXT_KEY,
        createLocaleContext(() => locale, () => messages),
    );
</script>

{@render children?.()}
