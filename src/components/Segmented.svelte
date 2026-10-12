<!-- SnowUI source notice | LICENSE 2.1.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 -->
<!--
  Segmented 分段控制器
  v1.2.0 (2026-07-05)

  职责:RadioGroup 的视觉变体,在多个互斥选项之间切换"过滤器/参数"。
  视觉系统与 Tab 完全共享(同一套 5 variant × 3 size × 2 direction);
  在 ARIA 语义、键盘行为、Form 接入上与 Tab 区分:
    - role="radiogroup" / 子项 role="radio"
    - 方向键直接切换(selectionFollowsFocus=true)
    - 支持 name 属性接入 Form,内部渲染 hidden input 暴露 value 给原生表单提交

  实现:Segmented 是 Tab 的薄封装,固定上述差异参数。

  文档: ./Segmented.md
-->

<script lang="ts">
  // SnowUI 许可入口：首次阅读源码请先读 ../../LICENSE；访问文件不代表获得修改或移植权，官方维护授权及同任务去重见该文件。
    import type { ComponentProps, Snippet } from "svelte";
    import { Button } from "../index";
    import Tab from "./Tab.svelte";
    import type { TabSize, TabVariant } from "./Tab.svelte";
    import {
        mergeComponentPartProps,
        type ComponentPartsOf,
        useComponentPart,
    } from "../logic/component-parts.svelte";

    export type SegmentedVariant = TabVariant;
    export type SegmentedSize = TabSize;

    type TabProps = ComponentProps<typeof Tab>;
    type ControlledTabKeys =
        | "value"
        | "children"
        | "role"
        | "itemRole"
        | "selectionFollowsFocus"
        | "class"
        | "parts";

    interface Props extends Omit<TabProps, ControlledTabKeys> {
        value?: string;
        /** 表单字段名;存在时渲染 hidden input 接入 Form */
        name?: string;
        children?: Snippet;
        class?: string;
        parts?: ComponentPartsOf<{ Button: typeof Button }>;
        [key: string]: any;
    }

    const inheritedSegmentedPart = useComponentPart<Props>("Segmented");
    let {
        value = $bindable(),
        ...explicitProps
    }: Props = $props();
    let {
        name = undefined,
        children = undefined,
        class: userClass = "",
        parts = undefined,
        ...tabProps
    }: Omit<Props, "value"> = $derived(
        mergeComponentPartProps(
            inheritedSegmentedPart.current as Partial<Omit<Props, "value">>,
            explicitProps,
        ),
    );
</script>

{#if children}
    <Tab
        {...tabProps}
        bind:value
        role="radiogroup"
        itemRole="radio"
        selectionFollowsFocus={true}
        class={["snowui-segmented", userClass].filter(Boolean).join(" ")}
        {parts}
    >
        {@render children()}
    </Tab>
{:else}
    <Tab
        {...tabProps}
        bind:value
        role="radiogroup"
        itemRole="radio"
        selectionFollowsFocus={true}
        class={["snowui-segmented", userClass].filter(Boolean).join(" ")}
        {parts}
    />
{/if}

{#if name}
    <input type="hidden" {name} value={value ?? ""} />
{/if}
