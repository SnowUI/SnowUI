<script lang="ts">
    import { getContext } from "svelte";
    import {
        COMPONENT_ICON_CONTEXT_KEY,
        OPTIONAL_RESOURCE_ICON_CONTEXT_KEY,
        type ComponentIconContext,
        type ComponentIconWeight,
    } from "../../logic/component-icon";
    import { BUILTIN_ICON_DATA } from "./builtin-icon-data";

    interface Props {
        name: string;
        size?: number | string;
        color?: string;
        weight?: ComponentIconWeight;
        collection?: string;
        class?: string;
        as?: string;
        [key: string]: unknown;
    }

    let {
        name,
        size = undefined,
        color = "currentColor",
        weight = "regular",
        collection,
        class: className = "",
        as: role,
        ...rest
    }: Props = $props();

    const context = getContext<ComponentIconContext | undefined>(
        COMPONENT_ICON_CONTEXT_KEY,
    );
    const sizeContext = getContext<{ readonly size?: number | string } | undefined>(OPTIONAL_RESOURCE_ICON_CONTEXT_KEY);
    const iconSize = $derived(size ?? sizeContext?.size ?? 16);
    const request = $derived({ name, weight, collection });
    const ExternalIcon = $derived(context?.resolve(request));
    const builtin = $derived(BUILTIN_ICON_DATA[name]);
    const content = $derived(
        builtin?.weights[weight] ?? builtin?.weights.regular ?? "",
    );
    const resolvedSize = $derived(
        typeof iconSize === "number" ? `${iconSize}px` : iconSize,
    );
</script>

{#if ExternalIcon}
    <ExternalIcon
        size={iconSize}
        {color}
        {weight}
        class={className}
        data-as={role}
        {...rest}
    />
{:else if builtin && content}
    <svg
        width={iconSize}
        height={iconSize}
        viewBox={builtin.viewBox}
        fill={color}
        xmlns="http://www.w3.org/2000/svg"
        class={className}
        data-as={role}
        {...rest}
    >
        {@html content}
    </svg>
{:else}
    <span
        class={["snowui-component-icon-missing", className]
            .filter(Boolean)
            .join(" ")}
        data-as={role}
        style:width={resolvedSize}
        style:height={resolvedSize}
        style:font-size={resolvedSize}
        style:color={color}
        {...rest}
    >▧</span>
{/if}

<style>
    :global(:where(.snowui-component-icon-missing)) {
        display: inline-flex;
        flex: 0 0 auto;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        line-height: 1;
    }
</style>
