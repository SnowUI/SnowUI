<!--
  SearchInput 简单搜索输入框
  v1.2.1

  文档: ./SearchInput.md
-->

<script lang="ts">
    import type { ComponentProps, Snippet } from "svelte";
    import { Icon as ResourceIcon } from "@snowui-design-system/resource-svelte";
    import Input from "./Input.svelte";
    import {
        mergeComponentPartProps,
        useComponentPart,
    } from "../logic/component-parts.svelte";

    type InputProps = ComponentProps<typeof Input>;
    type ControlledInputKeys =
        | "value"
        | "defaultValue"
        | "type"
        | "as"
        | "class"
        | "children";

    interface Props extends Omit<InputProps, ControlledInputKeys> {
        type?: InputProps["type"];
        value?: string | number;
        defaultValue?: string | number;
        showSearchIcon?: boolean;
        variant?: "default" | "borderless";
        as?: InputProps["as"];
        class?: string;
        children?: Snippet;
        [key: string]: any;
    }

    const inheritedSearchInputPart = useComponentPart<Props>("SearchInput");
    let {
        value = $bindable(),
        ...explicitProps
    }: Props = $props();
    let {
        type = "search",
        defaultValue = undefined,
        showSearchIcon = true,
        variant = "default",
        as = "search",
        class: userClass = "",
        children,
        ...rest
    }: Omit<Props, "value"> = $derived(
        mergeComponentPartProps(
            inheritedSearchInputPart.current,
            explicitProps,
        ),
    );
</script>

<Input
    bind:value
    {defaultValue}
    {type}
    {as}
    class={`snowui-search-input snowui-search-input-${variant}${userClass ? ` ${userClass}` : ""}`}
    {...rest}
>
    {#if showSearchIcon}
        <ResourceIcon
            name="search"
            as="leading"
            size={16}
            class="snowui-search-input-default-icon"
            aria-hidden="true"
        />
    {/if}
    {@render children?.()}
</Input>

<style>
    :global(:where(.snowui-input.snowui-search-input-borderless)) {
        --snowui-field-border-width: 0rem;
        --snowui-field-focus-ring-width: 0rem;
        --snowui-input-background-override: transparent;
        flex: 1 1 0;
        width: auto;
        max-width: 100%;
        min-width: 0;
        align-content: center;
    }

    /* Borderless SearchInput is commonly used in intrinsic/shrink-to-fit
       layouts. Keep the clear button in layout while visually hidden so its
       appearance cannot change the component width. */
    :global(:where(.snowui-input.snowui-search-input-borderless) .snowui-input-clear-btn) {
        display: inline-flex;
        visibility: hidden;
        pointer-events: none;
    }

    :global(:where(.snowui-input.snowui-search-input-borderless:focus-within:has(> input:not(:placeholder-shown))) .snowui-input-clear-btn) {
        visibility: visible;
        pointer-events: auto;
    }

    /* 保留三列对 shrink-to-fit 宽度的贡献，同时让有值时的 control
       延伸到预留的 gap + X 列下方，恢复 Input 原有的贴近/渐隐效果。 */
    :global(
            :where(
                    .snowui-input.snowui-search-input-borderless:focus-within:has(
                            > .snowui-input-control:not(:placeholder-shown)
                        ):has(> .snowui-input-clear-btn)
                        > .snowui-input-control
                )
        ) {
        width: calc(
            100% +
                var(--snowui-input-gap-override, var(--snowui-input-gap)) +
                var(--snowui-clear-icon-size-override, 1rem)
        );
    }

    /* SearchInput 专属默认 Search 颜色；只影响内置图标，不影响通用 Icon 或外置 leading。 */
    :global(
            :where(.snowui-input.snowui-search-input)
                .snowui-search-input-default-icon
        ) {
        color: var(
            --snowui-search-input-icon-color,
            var(--black-20, #00000033)
        );
    }

    :global(
            :where(.snowui-input.snowui-search-input):focus-within
                .snowui-search-input-default-icon
        ) {
        color: var(
            --snowui-search-input-active-icon-color,
            var(--black-40, #00000066)
        );
    }

    /* LayoutProtocol §4.1.5: 外置 leading 存在时隐藏直系默认 Search。 */
    :global(
            :where(.snowui-input.snowui-search-input):has(
                    > [data-as="leading"] ~ [data-as="leading"]
                )
                > .snowui-search-input-default-icon[data-as="leading"]
        ) {
        display: none;
    }
</style>
