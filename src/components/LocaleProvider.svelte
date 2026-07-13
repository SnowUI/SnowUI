<!-- 无视觉的组件 UI 文案 Context Provider。文档: ./LocaleProvider.md -->
<script lang="ts">
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
