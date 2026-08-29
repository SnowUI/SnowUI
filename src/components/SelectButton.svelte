<!-- SelectButton：以真实 Button 为宿主并复用 Select 单选能力。 -->
<script lang="ts">
    import type { ComponentProps, Snippet } from "svelte";
    import { ComponentIcon } from "../internal/component-icon/index";
    import Button from "./Button.svelte";
    import Select, {
        type SelectOption,
        type SelectTriggerContext,
        type SelectValue,
    } from "./Select.svelte";
    import Input from "./Input.svelte";
    import Listbox from "./Listbox.svelte";
    import MenuItem from "./MenuItem.svelte";
    import type { ComponentPartsOf } from "../logic/component-parts.svelte";

    export interface SelectButtonLabelContext {
        value: SelectValue;
        option: SelectOption | undefined;
        label: string;
        placeholder: string | undefined;
    }

    export interface SelectButtonIndicatorContext {
        open: boolean;
        disabled: boolean;
    }

    type ButtonProps = ComponentProps<typeof Button>;
    type ControlledButtonKeys =
        | "children"
        | "as"
        | "value"
        | "defaultValue"
        | "disabled"
        | "readonly"
        | "id"
        | "onclick"
        | "onkeydown"
        | "aria-label"
        | "aria-haspopup"
        | "aria-expanded"
        | "aria-controls"
        | "aria-activedescendant";

    interface Props extends Omit<ButtonProps, ControlledButtonKeys> {
        value?: SelectValue;
        defaultValue?: SelectValue;
        options?: SelectOption[];
        placeholder?: string;
        name?: string;
        form?: string;
        required?: boolean;
        disabled?: boolean;
        readonly?: boolean;
        invalid?: boolean;
        ariaLabel?: string;
        showIndicator?: boolean;
        search?: boolean;
        selectionMode?: "persistent" | "action";
        label?: Snippet<[SelectButtonLabelContext]>;
        indicator?: Snippet<[SelectButtonIndicatorContext]>;
        children?: Snippet;
        parts?: ComponentPartsOf<{
            Listbox: typeof Listbox;
            Input: typeof Input;
            MenuItem: typeof MenuItem;
        }>;
        onchange?: (event: Event) => void;
        onAction?: (value: string) => void;
        onclick?: (event: MouseEvent) => void;
        onkeydown?: (event: KeyboardEvent) => void;
        [key: string]: any;
    }

    // SelectButton 与 Select 可能由跨仓库检查器使用不同的 Svelte 物理安装展开。
    // 保留完整的触发器参数类型，只归一化 Snippet 的 nominal identity。
    function normalizeTriggerSnippet(snippet: unknown): Snippet<[SelectTriggerContext]> {
        return snippet as Snippet<[SelectTriggerContext]>;
    }

    let {
        value = $bindable(),
        defaultValue = undefined,
        options = [],
        placeholder = undefined,
        name = undefined,
        form = undefined,
        required = false,
        disabled = false,
        bare = false,
        readonly = false,
        invalid = false,
        ariaLabel = undefined,
        showIndicator = true,
        search = false,
        selectionMode = "persistent",
        label = undefined,
        indicator = undefined,
        children = undefined,
        parts = undefined,
        onchange = undefined,
        onAction = undefined,
        onclick = undefined,
        onkeydown = undefined,
        ...buttonProps
    }: Props = $props();

    const selectParts = $derived({
        ...parts,
        Listbox: {
            search,
            matchTriggerWidth: false,
            showCheck: false,
            placementMode: selectionMode === "action" ? "bottom" : "selected",
            ...parts?.Listbox,
        },
        Button: {
            scaleOnHover: false,
            ...buttonProps,
        },
    });
</script>

{#snippet renderTrigger(context: SelectTriggerContext)}
    {#if label}
        {@render label({
            value: context.value,
            option: context.option,
            label: context.label ?? context.placeholder ?? "",
            placeholder: context.placeholder,
        })}
    {:else}
        {context.label ?? context.placeholder ?? ""}
    {/if}
    {#if showIndicator}
        {#if indicator}
            {@render indicator({
                open: context.open,
                disabled: context.disabled,
            })}
        {:else}
            <ComponentIcon name="arrow-line-down" size={16} aria-hidden="true" />
        {/if}
    {/if}
{/snippet}

{#if children}
    <Select
        bind:value
        {defaultValue}
        {options}
        {placeholder}
        {name}
        {form}
        {required}
        {disabled}
        {readonly}
        {invalid}
        {ariaLabel}
        {onchange}
        {selectionMode}
        {onAction}
        {onclick}
        {onkeydown}
        buttonTrigger
        buttonBare={bare}
        triggerContent={normalizeTriggerSnippet(renderTrigger)}
        parts={selectParts}
    >
        {@render children()}
    </Select>
{:else}
    <Select
        bind:value
        {defaultValue}
        {options}
        {placeholder}
        {name}
        {form}
        {required}
        {disabled}
        {readonly}
        {invalid}
        {ariaLabel}
        {onchange}
        {selectionMode}
        {onAction}
        {onclick}
        {onkeydown}
        buttonTrigger
        buttonBare={bare}
        triggerContent={normalizeTriggerSnippet(renderTrigger)}
        parts={selectParts}
    />
{/if}
