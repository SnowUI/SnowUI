<!--
 Field 组件：表单容器
 v1.3.0

 文档: ./Field.md
-->

<script lang="ts">
    import { setContext, type Snippet } from "svelte";
    import { Frame, Text, type FrameProps } from "@snowui-design-system/components";
    import { FIELD_CONTEXT_KEY } from "@snowui-design-system/components/keys";
    import type { ComponentPartsOf } from "@snowui-design-system/components/logic/component-parts.svelte";

    interface Props extends FrameProps {
        invalid?: boolean;
        readonly?: boolean;
        /** 内置 label 内容；默认不生成。 */
        label?: string | Snippet;
        /** invalid 时显示的内置错误文字；默认不生成。 */
        error?: string | Snippet;
        parts?: ComponentPartsOf<{ Text: typeof Text }>;
        children?: Snippet;
        [key: string]: any;
    }

    let {
        invalid = false,
        readonly = false,
        label = undefined,
        error = undefined,
        parts = undefined,
        disabled = false,
        gap = undefined,
        children,
        enableResponsive = false,
        enableContext = true,
        enableScaleObserver = false,
        class: userClass = "",
        style: userStyle = "",
        renderHints: userRenderHints = undefined,
        use: userUse = [],
        ...rest
    }: Props = $props();

    setContext(FIELD_CONTEXT_KEY, { present: true });

    // 焦点转发：点击 Field 非可聚焦区域时，将焦点转发给内部第一个输入控件
    function fieldFocusForward(node: HTMLElement) {
        function handleClick(e: MouseEvent) {
            const target = e.target as HTMLElement;
            if (disabled) return;
            if (target.closest('input:not([aria-hidden="true"]), textarea, button:not([tabindex="-1"])')) return;
            const first = node.querySelector<HTMLElement>(
                'input:not([type="hidden"]):not([aria-hidden="true"]):not([disabled]), ' +
                'textarea:not([disabled]), ' +
                'button.snowui-select-trigger:not([disabled])'
            );
            first?.focus();
        }
        node.addEventListener('click', handleClick);
        return { destroy() { node.removeEventListener('click', handleClick); } };
    }

    const fieldRenderHints = $derived({
        variant: userRenderHints?.variant ?? "rect",
        width: userRenderHints?.width ?? "100%",
        height: userRenderHints?.height,
        radius: userRenderHints?.radius ?? "var(--radius-4)",
    });
</script>

{#snippet fieldSurface()}
    <Frame
        class={`snowui-field snowui-field-bordered${userClass ? ` ${userClass}` : ""}`}
        enableAutoLayout={true}
        data-as={typeof rest.as === "string" ? rest.as : undefined}
        data-invalid={invalid ? "true" : undefined}
        data-readonly={readonly ? "true" : undefined}
        {disabled}
        style={`${userStyle}${gap !== undefined ? `; --snowui-field-gap-override: var(--gap-${gap})` : ""}`}
        enableResponsive={enableResponsive}
        enableContext={enableContext}
        enableScaleObserver={enableScaleObserver}
        renderHints={fieldRenderHints}
        use={[fieldFocusForward, ...(Array.isArray(userUse) ? userUse : userUse ? [userUse] : [])]}
        {...rest}
    >
        {#if typeof label === "function"}
            <Text {...parts?.Text} as="label">
                {@render label()}
            </Text>
        {:else if label !== undefined}
            <Text {...parts?.Text} as="label">{label}</Text>
        {/if}
        {@render children?.()}
    </Frame>
{/snippet}

{#snippet builtInError()}
    {#if typeof error === "function"}
        <Text
            {...parts?.Text}
            as="error"
            class={`snowui-field-built-in-error${parts?.Text?.class ? ` ${parts.Text.class}` : ""}`}
        >
            {@render error()}
        </Text>
    {:else if error !== undefined}
        <Text
            {...parts?.Text}
            as="error"
            class={`snowui-field-built-in-error${parts?.Text?.class ? ` ${parts.Text.class}` : ""}`}
        >{error}</Text>
    {/if}
{/snippet}

{#if error !== undefined}
    <div class="snowui-field-error-layout">
        {@render fieldSurface()}
        {@render builtInError()}
    </div>
{:else}
    {@render fieldSurface()}
{/if}

<style>
    :global(:where(.snowui-field-error-layout)) {
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        align-items: start;
        gap: 0;
        min-width: 0;
        max-width: 100%;
    }

    :global(:where(.snowui-field-error-layout > .snowui-field)) {
        width: 100%;
    }

    :global(:where(.snowui-field)) {
        --snowui-field-radius: var(--radius-4);
        --snowui-field-background: var(--surface-1, #ffffffcc);
        display: grid;
        grid-template-columns: auto minmax(0, 1fr) auto;
        align-items: center;
        gap: var(--snowui-field-gap-override, var(--gap-2));
        width: 100%;
        min-width: 0;
        min-height: 0;
        cursor: var(--snowui-field-cursor, text);
        border-radius: var(
            --snowui-field-radius-override,
            var(--snowui-field-radius)
        );
        background-color: var(
            --snowui-field-background-override,
            var(--snowui-field-background)
        );
        box-sizing: border-box;
    }

    :global(
            :where(
                    .snowui-field.snowui-direction-row,
                    .snowui-field.snowui-direction-row-reverse
                )
        ) {
        display: flex;
        flex-wrap: nowrap;
    }

    :global(:where(.snowui-field[data-readonly="true"])) {
        background-color: var(--surface-2, #00000008);
    }

    :global(:where(.snowui-field[data-invalid="true"])) {
        --snowui-field-border-color: var(--secondary-red, #ff4747ff);
        --snowui-field-hover-border-color: var(--secondary-red, #ff4747ff);
        --snowui-field-focus-border-color: var(--secondary-red, #ff4747ff);
    }



    :global(
            :where(
                    .snowui-field
                        > .snowui-field-host:not(.snowui-input):not(
                            .snowui-select
                        ):not(.snowui-textarea)
                )
        ) {
        grid-column: 2;
        display: flex;
        align-items: center;
        width: 100%;
        min-width: 0;
        box-sizing: border-box;
    }

    :global(
            :where(
                    .snowui-field > .snowui-field,
                    .snowui-field
                        > .snowui-input.snowui-field-host:not(
                            [data-as="segment"]
                        ),
                    .snowui-field
                        > .snowui-select.snowui-field-host:not(
                            [data-as="segment"]
                        ),
                    .snowui-field
                        > .snowui-textarea.snowui-field-host:not(
                            [data-as="segment"]
                        )
                )
        ) {
        grid-column: 2;
        width: 100%;
        min-width: 0;
        box-sizing: border-box;
    }

    :global(
            :where(
                    .snowui-field:not(.snowui-direction-row):not(.snowui-direction-row-reverse):not(:has(> .snowui-role-leading)):not(:has(> [data-as="leading"])):not(:has(> .snowui-role-trailing:not(.snowui-input-warning-icon))):not(:has(> [data-as="trailing"]:not(.snowui-input-warning-icon)))
                        > .snowui-input.snowui-field-host:not([data-as="segment"]),
                    .snowui-field:not(.snowui-direction-row):not(.snowui-direction-row-reverse):not(:has(> .snowui-role-leading)):not(:has(> [data-as="leading"])):not(:has(> .snowui-role-trailing:not(.snowui-input-warning-icon))):not(:has(> [data-as="trailing"]:not(.snowui-input-warning-icon)))
                        > .snowui-select.snowui-field-host:not([data-as="segment"]),
                    .snowui-field:not(.snowui-direction-row):not(.snowui-direction-row-reverse):not(:has(> .snowui-role-leading)):not(:has(> [data-as="leading"])):not(:has(> .snowui-role-trailing:not(.snowui-input-warning-icon))):not(:has(> [data-as="trailing"]:not(.snowui-input-warning-icon)))
                        > .snowui-textarea.snowui-field-host:not([data-as="segment"])
                )
        ) {
        grid-column: 1 / -1;
    }

    /* 仅有 trailing（无 leading）：field-host 从 col1 延伸到 col2，消除空 col1 与 col2 之间 gap 造成的左侧多余间距 */
    :global(
            :where(
                    .snowui-field:not(.snowui-direction-row):not(.snowui-direction-row-reverse):not(:has(> .snowui-role-leading)):not(:has(> [data-as="leading"])):has(> .snowui-role-trailing:not(.snowui-input-warning-icon))
                        > :is(.snowui-input, .snowui-select, .snowui-textarea).snowui-field-host:not([data-as="segment"]),
                    .snowui-field:not(.snowui-direction-row):not(.snowui-direction-row-reverse):not(:has(> .snowui-role-leading)):not(:has(> [data-as="leading"])):has(> [data-as="trailing"]:not(.snowui-input-warning-icon))
                        > :is(.snowui-input, .snowui-select, .snowui-textarea).snowui-field-host:not([data-as="segment"])
                )
        ) {
        grid-column: 1 / 3;
    }

    /* 仅有 leading（无 trailing）：field-host 从 col2 延伸到 col3，消除空 col3 与 col2 之间 gap 造成的右侧多余间距 */
    :global(
            :where(
                    .snowui-field:not(.snowui-direction-row):not(.snowui-direction-row-reverse):has(> .snowui-role-leading):not(:has(> .snowui-role-trailing:not(.snowui-input-warning-icon))):not(:has(> [data-as="trailing"]:not(.snowui-input-warning-icon)))
                        > :is(.snowui-input, .snowui-select, .snowui-textarea).snowui-field-host:not([data-as="segment"]),
                    .snowui-field:not(.snowui-direction-row):not(.snowui-direction-row-reverse):has(> [data-as="leading"]):not(:has(> .snowui-role-trailing:not(.snowui-input-warning-icon))):not(:has(> [data-as="trailing"]:not(.snowui-input-warning-icon)))
                        > :is(.snowui-input, .snowui-select, .snowui-textarea).snowui-field-host:not([data-as="segment"])
                )
        ) {
        grid-column: 2 / -1;
    }

    :global(:where(.snowui-field > .snowui-field)) {
        --snowui-field-border-width: 0;
        --snowui-field-focus-ring-width: 0;
        --snowui-field-background-override: transparent;
        --snowui-field-radius-override: var(--radius-0);
        padding: 0;
        border-radius: 0;
        background-color: transparent;
        box-shadow: none;
    }



    :global(
            :where(
                    .snowui-field > .snowui-textarea.snowui-field-host
                )
        ) {
        display: block;
    }

    :global(
            :where(
                    .snowui-field
                        > :is(
                            .snowui-input,
                            .snowui-select,
                            .snowui-textarea
                        ).snowui-field-host:only-child
                )
        ) {
        grid-column: 1 / -1;
    }

    :global(
            :where(
                    .snowui-field
                        > :not(.snowui-field-host):not(.snowui-role-row):not(
                            .snowui-role-col
                        ):not(.snowui-role-label):not(
                            .snowui-role-description
                        ):not(.snowui-role-error):not(.snowui-role-leading):not(
                            .snowui-role-trailing
                        ):not([data-as="segment"])
                )
        ) {
        grid-column: 1 / -1;
        min-width: 0;
    }

    /* 非 segment: 去掉自身 padding，外层包含 label 在内统一接管 12/16 */
    :global(
            :where(
                    .snowui-field:not(:has(> [data-as="segment"]))
                )
        ) {
        padding: var(--snowui-field-stacked-padding-override, var(--padding-3) var(--padding-4));
    }
    :global(
            :where(
                    .snowui-field:not(:has(> [data-as="segment"])) > .snowui-input.snowui-field-host,
                    .snowui-field:not(:has(> [data-as="segment"])) > .snowui-select.snowui-field-host
                )
        ) {
        --snowui-input-padding-override: 0;
        --snowui-select-padding-override: 0;
    }
    :global(
            :where(
                    .snowui-field:not(:has(> [data-as="segment"])) > .snowui-textarea.snowui-field-host
                )
        ) {
        --snowui-textarea-padding-override: 0 0 var(--padding-6) 0;
    }

    /* segment 保留原生布局和 padding，仅去边框与容器基础 */
    :global(:where(.snowui-field > [data-as="segment"])) {
        grid-column: 1 / -1;
        display: flex;
        align-items: center;
        gap: 0;
        margin: 0;
        width: 100%;
        min-width: 0;
        border-radius: 0;
        background: transparent;
        box-shadow: none; /* 不加 !important，允许后续分割线规则覆盖 */
        box-sizing: border-box;
    }

    :global(:where(.snowui-field > [data-as="segment"] > *)) {
        min-width: 0;
    }

    :global(:where(.snowui-field > [data-as="segment"] > .snowui-field-host)) {
        flex: 1 1 0;
        width: 100%;
        box-sizing: border-box;
    }

    :global(
            :where(
                    .snowui-field
                        > [data-as="segment"]
                        > .snowui-field-host.snowui-input-has-root-accessory
                )
        ) {
        display: grid;
    }

    :global(:where(.snowui-field > .snowui-role-row)) {
        grid-column: 1 / -1;
        display: flex;
        align-items: stretch;
        gap: 0;
        width: 100%;
        min-width: 0;
        box-sizing: border-box;
    }

    :global(:where(.snowui-field > .snowui-role-row > *)) {
        min-width: 0;
    }

    :global(
            :where(
                    .snowui-field > .snowui-direction-row,
                    .snowui-field > .snowui-direction-row-reverse
                )
        ) {
        grid-column: 1 / -1;
        display: flex;
        align-items: stretch;
        gap: var(--gap-2);
        width: 100%;
        min-width: 0;
        box-sizing: border-box;
    }

    :global(
            :where(
                    .snowui-field > .snowui-direction-row > *,
                    .snowui-field > .snowui-direction-row-reverse > *
                )
        ) {
        min-width: 0;
    }

    /* 列向 Field 中的行 segment 容器（如 FM-01 City|ZIP）：
       .snowui-field > .snowui-direction-row 规则会将 gap 设为 8px，
       此规则在其之后出现，将 gap 重置为 0（分割线由 box-shadow 负责）。 */
    :global(
            :where(
                    .snowui-field:not(.snowui-direction-row):not(.snowui-direction-row-reverse)
                        > [data-as="segment"].snowui-direction-row,
                    .snowui-field:not(.snowui-direction-row):not(.snowui-direction-row-reverse)
                        > [data-as="segment"].snowui-direction-row-reverse
                )
        ) {
        gap: 0;
        align-items: stretch;
    }

    :global(
            :where(
                    .snowui-field.snowui-direction-row,
                    .snowui-field.snowui-direction-row-reverse
                )
        ) {
        align-items: stretch;
        gap: var(--snowui-field-gap-override, var(--gap-2));
        width: 100%;
        min-width: 0;
        box-sizing: border-box;
    }

    :global(
            :where(
                    .snowui-field.snowui-direction-row > *,
                    .snowui-field.snowui-direction-row-reverse > *
                )
        ) {
        min-width: 0;
    }

    :global(
            :where(
                    .snowui-field.snowui-direction-row > .snowui-direction-row,
                    .snowui-field.snowui-direction-row-reverse
                        > .snowui-direction-row-reverse
                )
        ) {
        flex: 1 1 0;
        display: flex;
        align-items: center;
        gap: var(--gap-2);
        padding: var(--padding-3) var(--padding-4);
        box-sizing: border-box;
    }

    :global(
            :where(
                    .snowui-field.snowui-direction-row
                        > .snowui-direction-row
                        > .snowui-input.snowui-field-host,
                    .snowui-field.snowui-direction-row-reverse
                        > .snowui-direction-row-reverse
                        > .snowui-input.snowui-field-host
                )
        ) {
        flex: 1 1 0;
        min-width: 0;
    }

    :global(
            :where(
                    .snowui-field.snowui-direction-row
                        > .snowui-direction-row
                        > .snowui-icon-wrapper,
                    .snowui-field.snowui-direction-row-reverse
                        > .snowui-direction-row-reverse
                        > .snowui-icon-wrapper
                )
        ) {
        color: var(--black-20, #00000033);
    }

    :global(:where(.snowui-field.snowui-direction-row:has(> [data-as="segment"]))) {
        display: flex;
        align-items: stretch;
        gap: 0;
        padding: 0;
        overflow: hidden;
        background-color: transparent;
    }

    :global(:where(.snowui-field.snowui-direction-row > [data-as="segment"].snowui-direction-row)) {
        display: flex;
        flex-direction: row;
        gap: 0;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
    }

    :global(:where(.snowui-field.snowui-direction-row > [data-as="segment"])) {
        flex: 1 1 0;
        min-width: 0;
        padding: var(--padding-3) var(--padding-4);
        gap: 0;
        box-sizing: border-box;
        border-radius: 0;
        background: transparent;
        box-shadow: none;
    }

    :global(
            :where(
                .snowui-field.snowui-direction-row > .snowui-input.snowui-field-host[data-as="segment"],
                .snowui-field.snowui-direction-row > .snowui-select.snowui-field-host[data-as="segment"]
            )
        ) {
        gap: var(--gap-2);
        --snowui-input-padding-override: 0;
        --snowui-select-padding-override: 0;
        --snowui-input-gap-override: var(--gap-2);
        --snowui-select-gap-override: var(--gap-2);
    }

    :global(
            :where(
                .snowui-field.snowui-direction-row > [data-as="segment"] .snowui-input.snowui-field-host,
                .snowui-field.snowui-direction-row > [data-as="segment"] .snowui-select.snowui-field-host
            )
        ) {
        padding: 0;
        gap: var(--gap-2);
        --snowui-input-padding-override: 0;
        --snowui-select-padding-override: 0;
        --snowui-input-gap-override: var(--gap-2);
        --snowui-select-gap-override: var(--gap-2);
    }

    :global(
        :where(
            .snowui-field:not(.snowui-direction-row) > .snowui-input.snowui-field-host[data-as="segment"],
            .snowui-field:not(.snowui-direction-row) > .snowui-select.snowui-field-host[data-as="segment"],
            .snowui-field:not(.snowui-direction-row) > [data-as="segment"] .snowui-input.snowui-field-host,
            .snowui-field:not(.snowui-direction-row) > [data-as="segment"] .snowui-select.snowui-field-host
        )
    ) {
        gap: var(--gap-2);
        --snowui-input-padding-override: var(--padding-3) var(--padding-4);
        --snowui-select-padding-override: var(--padding-3) var(--padding-4);
        --snowui-input-gap-override: var(--gap-2);
        --snowui-select-gap-override: var(--gap-2);
    }

    /* Input 含附件时切换为 grid 布局，
       grid 模式会将内层 .snowui-input-control 的 padding 清零；
       需在外层 grid 容器上补回 padding，以维持与 Select segment 相同的 44px 行高。
       仅针对非横向 Field，横向 Field 由 .snowui-field.snowui-direction-row > [data-as="segment"] 规则覆盖。
       注：不使用 :where() 以确保 specificity > Input.svelte 嵌入规则，避免 CSS bundle 顺序影响。 */
    :global(
        .snowui-field:not(.snowui-direction-row)
            > .snowui-input.snowui-field-host.snowui-input-has-root-accessory[data-as="segment"],
        .snowui-field:not(.snowui-direction-row)
            > [data-as="segment"]
            .snowui-input.snowui-field-host.snowui-input-has-root-accessory
    ) {
        padding: var(--snowui-input-padding-override, var(--padding-3) var(--padding-4));
    }

    :global(:where(.snowui-field.snowui-direction-row > [data-as="segment"]:first-child)) {
        border-radius: var(--radius-4) 0 0 var(--radius-4);
    }

    :global(:where(.snowui-field.snowui-direction-row > [data-as="segment"]:last-child)) {
        border-radius: 0 var(--radius-4) var(--radius-4) 0;
    }

    :global(:where(.snowui-field.snowui-direction-row > [data-as="segment"]:not(:last-child))) {
        box-shadow: inset calc(var(--border-1) * -1) 0 0 var(--black-20, #00000033);
    }

    :global(
            :where(
                .snowui-field.snowui-direction-row
                    > [data-as="segment"].snowui-direction-row
                    > .snowui-text
            )
        ) {
        padding: 0;
        display: flex;
        align-items: center;
        box-shadow: none;
    }

    :global(
            :where(
                .snowui-field.snowui-direction-row
                    > [data-as="segment"].snowui-direction-row
                    > * + *
            )
        ) {
        box-shadow: none;
    }

    :global(:where(.snowui-field > .snowui-role-col)) {
        grid-column: 1 / -1;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        gap: var(--gap-2);
        width: 100%;
        min-width: 0;
        box-sizing: border-box;
    }

    :global(:where(.snowui-field > .snowui-role-col > *)) {
        min-width: 0;
    }

    :global(
            :where(
                    .snowui-field > .snowui-direction-column,
                    .snowui-field > .snowui-direction-column-reverse
                )
        ) {
        grid-column: 1 / -1;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        gap: var(--gap-2);
        width: 100%;
        min-width: 0;
        box-sizing: border-box;
    }

    :global(
            :where(
                    .snowui-field > .snowui-direction-column > *,
                    .snowui-field > .snowui-direction-column-reverse > *
                )
        ) {
        min-width: 0;
    }

    :global(
            :where(
                    .snowui-field.snowui-direction-column,
                    .snowui-field.snowui-direction-column-reverse
                )
        ) {
        align-items: stretch;
        gap: var(--snowui-field-gap-override, var(--gap-2));
        width: 100%;
        min-width: 0;
        box-sizing: border-box;
    }

    :global(
            :where(
                    .snowui-field.snowui-direction-column:has(
                            > .snowui-field-host
                        ):not(:has(> :not(.snowui-field-host))),
                    .snowui-field.snowui-direction-column-reverse:has(
                            > .snowui-field-host
                        ):not(:has(> :not(.snowui-field-host))),
                    .snowui-field:has(> .snowui-field[data-as="segment"])
                )
        ) {
        gap: 0;
    }

    :global(
            :where(
                    .snowui-field.snowui-direction-column > *,
                    .snowui-field.snowui-direction-column-reverse > *
                )
        ) {
        min-width: 0;
    }

    :global(:where(.snowui-field > .snowui-role-row > .snowui-field-host)) {
        flex: 1 1 0;
        display: flex;
        align-items: center;
        box-sizing: border-box;
    }

    :global(
            :where(
                    .snowui-field.snowui-direction-row
                        > .snowui-field-host:not([data-as="segment"]),
                    .snowui-field.snowui-direction-row-reverse
                        > .snowui-field-host:not([data-as="segment"])
                )
        ) {
        flex: 1 1 0;
        display: flex;
        align-items: center;
        box-sizing: border-box;
    }

    :global(
            :where(
                .snowui-field
                    > .snowui-direction-row
                    > .snowui-field-host:not([data-as="segment"]),
                .snowui-field > .snowui-direction-row-reverse
                    > .snowui-field-host:not([data-as="segment"])
            )
        ) {
        flex: 1 1 0;
        display: flex;
        align-items: center;
        box-sizing: border-box;
    }

    :global(
            :where(
                    .snowui-field > .snowui-role-row > .snowui-field-host.snowui-input-has-root-accessory,
                    .snowui-field > .snowui-direction-row > .snowui-field-host.snowui-input-has-root-accessory,
                    .snowui-field > .snowui-direction-row-reverse > .snowui-field-host.snowui-input-has-root-accessory,
                    .snowui-field.snowui-direction-row > .snowui-field-host.snowui-input-has-root-accessory,
                    .snowui-field.snowui-direction-row-reverse > .snowui-field-host.snowui-input-has-root-accessory
                )
        ) {
        display: grid;
    }

    :global(:where(.snowui-field > .snowui-role-col > .snowui-field-host)) {
        display: flex;
        align-items: center;
        width: 100%;
        min-width: 0;
        box-sizing: border-box;
    }

    :global(
            :where(
                    .snowui-field.snowui-direction-column > .snowui-field-host,
                    .snowui-field.snowui-direction-column-reverse
                        > .snowui-field-host
                )
        ) {
        display: flex;
        align-items: center;
        width: 100%;
        min-width: 0;
        box-sizing: border-box;
    }

    :global(
            :where(
                .snowui-field > .snowui-direction-column > .snowui-field-host,
                .snowui-field > .snowui-direction-column-reverse
                    > .snowui-field-host
            )
        ) {
        display: flex;
        align-items: center;
        width: 100%;
        min-width: 0;
        box-sizing: border-box;
    }

    :global(:where(.snowui-field > [data-as="segment"] > .snowui-field-host)) {
        flex: 1 1 0;
        width: 100%;
        min-width: 0;
        padding: 0;
        box-sizing: border-box;
    }



    :global(:where(.snowui-field > .snowui-role-col > .snowui-role-row)) {
        display: flex;
        align-items: stretch;
        gap: var(--gap-2);
        width: 100%;
        min-width: 0;
        box-sizing: border-box;
    }

    :global(
            :where(
                    .snowui-field.snowui-direction-column > .snowui-role-row,
                    .snowui-field.snowui-direction-column-reverse
                        > .snowui-role-row
                )
        ) {
        display: flex;
        align-items: stretch;
        gap: var(--gap-2);
        width: 100%;
        min-width: 0;
        box-sizing: border-box;
    }

    :global(:where(.snowui-field > .snowui-role-col > .snowui-role-row > *)) {
        min-width: 0;
    }

    :global(
            :where(
                    .snowui-field.snowui-direction-column
                        > .snowui-role-row
                        > *,
                    .snowui-field.snowui-direction-column-reverse
                        > .snowui-role-row
                        > *
                )
        ) {
        min-width: 0;
    }

    :global(
            :where(
                .snowui-field
                    > .snowui-role-col
                    > .snowui-role-row
                    > .snowui-field-host
            )
        ) {
        flex: 1 1 0;
        display: flex;
        align-items: center;
        box-sizing: border-box;
    }

    :global(
            :where(
                    .snowui-field.snowui-direction-column
                        > .snowui-role-row
                        > .snowui-field-host,
                    .snowui-field.snowui-direction-column-reverse
                        > .snowui-role-row
                        > .snowui-field-host
                )
        ) {
        flex: 1 1 0;
        display: flex;
        align-items: center;
        box-sizing: border-box;
    }

    :global(
            :where(
                    .snowui-field > .snowui-role-col > .snowui-role-leading,
                    .snowui-field > .snowui-role-col > .snowui-role-trailing
                )
        ) {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: var(--padding-3) var(--padding-4);
        color: var(--black-40, #00000066);
        box-sizing: border-box;
        flex-shrink: 0;
    }

    :global(
            :where(
                    .snowui-field.snowui-direction-row > .snowui-role-leading,
                    .snowui-field.snowui-direction-row > .snowui-role-trailing,
                    .snowui-field.snowui-direction-row-reverse
                        > .snowui-role-leading,
                    .snowui-field.snowui-direction-row-reverse
                        > .snowui-role-trailing,
                    .snowui-field.snowui-direction-column
                        > .snowui-role-leading,
                    .snowui-field.snowui-direction-column
                        > .snowui-role-trailing,
                    .snowui-field.snowui-direction-column-reverse
                        > .snowui-role-leading,
                    .snowui-field.snowui-direction-column-reverse
                        > .snowui-role-trailing
                )
        ) {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: var(--padding-3) var(--padding-4);
        color: var(--black-40, #00000066);
        box-sizing: border-box;
        flex-shrink: 0;
    }

    :global(:where(.snowui-field > .snowui-role-leading)) {
        grid-column: 1;
        display: flex;
        align-items: inherit;
        justify-content: center;
        padding: 0;
        color: var(--black-40, #00000066);
        box-sizing: border-box;
        flex-shrink: 0;
    }

    :global(:where(.snowui-field > [data-as="leading"])) {
        grid-column: 1;
        display: flex;
        align-items: inherit;
        justify-content: center;
        padding: 0;
        color: var(--black-40, #00000066);
        box-sizing: border-box;
        flex-shrink: 0;
    }

    :global(:where(.snowui-field > .snowui-role-trailing)) {
        grid-column: 3;
        display: flex;
        align-items: inherit;
        justify-content: center;
        padding: 0;
        color: var(--black-40, #00000066);
        box-sizing: border-box;
        flex-shrink: 0;
    }

    :global(
            .snowui-field:has(> .snowui-select.snowui-field-host + [data-as="trailing"])
                > .snowui-select.snowui-field-host
                .snowui-select-indicator
        ) {
        display: none;
    }

    :global(:where(.snowui-field > [data-as="trailing"])) {
        grid-column: 3;
        display: flex;
        align-items: inherit;
        justify-content: center;
        padding: 0;
        color: var(--black-40, #00000066);
        box-sizing: border-box;
        flex-shrink: 0;
    }

    :global(
            :where(
                    .snowui-field > .snowui-input-warning-icon,
                    .snowui-field.snowui-direction-row > .snowui-input-warning-icon,
                    .snowui-field.snowui-direction-row-reverse > .snowui-input-warning-icon
                )
        ) {
        color: var(--secondary-red, #ff4747ff);
        align-self: auto;
        justify-self: end;
        padding: 0;
        flex-shrink: 0;
    }

    :global(
            :where(
                    .snowui-field
                        > .snowui-role-leading.snowui-button-bare,
                    .snowui-field
                        > .snowui-role-trailing.snowui-button-bare
                )
        ) {
        padding: 0;
        color: var(--black-100, #000000ff);
        box-shadow: none;
        align-self: auto;
    }

    :global(
            :where(
                    .snowui-field > .snowui-role-row > .snowui-role-leading,
                    .snowui-field > .snowui-role-row > .snowui-role-trailing
                )
        ) {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: var(--padding-3) var(--padding-4);
        color: var(--black-40, #00000066);
        box-sizing: border-box;
        flex-shrink: 0;
    }

    :global(
            :where(
                    .snowui-field
                        > .snowui-role-row
                        > .snowui-role-leading.snowui-button-bare,
                    .snowui-field
                        > .snowui-role-row
                        > .snowui-role-trailing.snowui-button-bare
                )
        ) {
        padding: 0;
        color: var(--black-100, #000000ff);
        box-shadow: none;
        align-self: auto;
    }

    :global(
            :where(
                    .snowui-field
                        > .snowui-role-col
                        > .snowui-role-leading.snowui-button-bare,
                    .snowui-field
                        > .snowui-role-col
                        > .snowui-role-trailing.snowui-button-bare
                )
        ) {
        padding: 0;
        color: var(--black-100, #000000ff);
        box-shadow: none;
        align-self: auto;
    }

    :global(
            :where(
                    .snowui-field.snowui-direction-row
                        > .snowui-role-leading.snowui-button-bare,
                    .snowui-field.snowui-direction-row
                        > .snowui-role-trailing.snowui-button-bare,
                    .snowui-field.snowui-direction-row-reverse
                        > .snowui-role-leading.snowui-button-bare,
                    .snowui-field.snowui-direction-row-reverse
                        > .snowui-role-trailing.snowui-button-bare,
                    .snowui-field.snowui-direction-column
                        > .snowui-role-leading.snowui-button-bare,
                    .snowui-field.snowui-direction-column
                        > .snowui-role-trailing.snowui-button-bare,
                    .snowui-field.snowui-direction-column-reverse
                        > .snowui-role-leading.snowui-button-bare,
                    .snowui-field.snowui-direction-column-reverse
                        > .snowui-role-trailing.snowui-button-bare
                )
        ) {
        padding: 0;
        color: var(--black-100, #000000ff);
        box-shadow: none;
        align-self: auto;
    }

    :global(:where(.snowui-field > .snowui-role-label)) {
        grid-column: 1 / -1;
        padding: 0;
        display: flex;
        align-items: center;
        width: 100%;
        max-width: none;
        color: var(--black-40, #00000066);
        font-size: var(--text-12);
        line-height: var(--leading-12);
        font-weight: var(--font-weight-regular, 400);
        box-sizing: border-box;
    }

    :global(
            :where(
                    .snowui-field > .snowui-role-error,
                    .snowui-field-error-layout > .snowui-role-error
                )
        ) {
        grid-column: 1 / -1;
        padding: 0;
        display: flex;
        align-items: center;
        width: 100%;
        max-width: none;
        color: var(--secondary-red, #ff4747ff);
        font-size: var(--text-12);
        line-height: var(--leading-12);
        box-sizing: border-box;
    }

    :global(
            :where(
                    .snowui-field > .snowui-field-built-in-error,
                    .snowui-field-error-layout > .snowui-field-built-in-error
                )
        ) {
        display: none;
    }

    :global(
            :where(
                    .snowui-field[data-invalid="true"],
                    .snowui-field:has(.snowui-field-host[data-invalid="true"]),
                    .snowui-field-error-layout:has(
                            > .snowui-field[data-invalid="true"]
                        ),
                    .snowui-field-error-layout:has(
                            > .snowui-field
                                .snowui-field-host[data-invalid="true"]
                        )
                )
                > .snowui-field-built-in-error
        ) {
        display: flex;
    }

    :global(
            :where(
                    .snowui-field-error-layout:has(
                            > .snowui-field[data-invalid="true"]
                        ),
                    .snowui-field-error-layout:has(
                            > .snowui-field
                                .snowui-field-host[data-invalid="true"]
                        )
                )
                > .snowui-field-built-in-error
        ) {
        display: flex;
        margin-top: var(--gap-2);
    }

    :global(
            :where(
                    .snowui-field
                        > :is(
                            .snowui-text,
                            .snowui-input,
                            .snowui-select,
                            .snowui-textarea,
                            .snowui-frame
                        ):not(.snowui-role-label):not(.snowui-role-description):not(
                            .snowui-role-error
                        ):not(.snowui-role-leading):not(.snowui-role-trailing):not(
                            .snowui-role-row
                        ):not(.snowui-role-col):not(.snowui-field):not(
                            .snowui-field-host
                        ),
                    .snowui-field
                        > :is(
                            .snowui-role-row,
                            .snowui-role-col,
                            .snowui-direction-row,
                            .snowui-direction-row-reverse,
                            .snowui-direction-column,
                            .snowui-direction-column-reverse
                        )
                        > :is(
                            .snowui-text,
                            .snowui-input,
                            .snowui-select,
                            .snowui-textarea,
                            .snowui-frame
                        ):not(.snowui-role-label):not(.snowui-role-description):not(
                            .snowui-role-error
                        ):not(.snowui-role-leading):not(.snowui-role-trailing):not(
                            .snowui-role-row
                        ):not(.snowui-role-col):not(.snowui-field)
                )
        ) {
        padding: 0;
        border-radius: 0;
        background-color: transparent;
        box-shadow: none;
    }

    /* 横向分割线仅适用于纵向堆叠的 Field（column 方向）；row 方向 Field 的分隔由 :not(:last-child) 右侧 inset 与 segment 专属规则负责，避免与 row 段落顶部边框叠加产生加深的伪双层描边（FM-02 / FM-09 的可见瑕疵）。 */
    :global(
            :where(
                    .snowui-field:not(.snowui-direction-row):not(.snowui-direction-row-reverse) > .snowui-field-host + .snowui-field-host,
                    .snowui-field:not(.snowui-direction-row):not(.snowui-direction-row-reverse) > .snowui-field-host + .snowui-role-row,
                    .snowui-field:not(.snowui-direction-row):not(.snowui-direction-row-reverse) > .snowui-field-host + .snowui-role-col,
                    .snowui-field:not(.snowui-direction-row):not(.snowui-direction-row-reverse) > .snowui-field-host + .snowui-direction-row,
                    .snowui-field:not(.snowui-direction-row):not(.snowui-direction-row-reverse) > .snowui-field-host + .snowui-direction-row-reverse,
                    .snowui-field:not(.snowui-direction-row):not(.snowui-direction-row-reverse) > .snowui-field-host + .snowui-direction-column,
                    .snowui-field:not(.snowui-direction-row):not(.snowui-direction-row-reverse) > .snowui-field-host + .snowui-direction-column-reverse,
                    .snowui-field:not(.snowui-direction-row):not(.snowui-direction-row-reverse) > .snowui-role-row + .snowui-field-host,
                    .snowui-field:not(.snowui-direction-row):not(.snowui-direction-row-reverse) > .snowui-role-row + .snowui-role-row,
                    .snowui-field:not(.snowui-direction-row):not(.snowui-direction-row-reverse) > .snowui-role-row + .snowui-role-col,
                    .snowui-field:not(.snowui-direction-row):not(.snowui-direction-row-reverse) > .snowui-role-row + .snowui-direction-row,
                    .snowui-field:not(.snowui-direction-row):not(.snowui-direction-row-reverse) > .snowui-role-row + .snowui-direction-row-reverse,
                    .snowui-field:not(.snowui-direction-row):not(.snowui-direction-row-reverse) > .snowui-role-row + .snowui-direction-column,
                    .snowui-field:not(.snowui-direction-row):not(.snowui-direction-row-reverse) > .snowui-role-row + .snowui-direction-column-reverse,
                    .snowui-field:not(.snowui-direction-row):not(.snowui-direction-row-reverse) > .snowui-role-col + .snowui-field-host,
                    .snowui-field:not(.snowui-direction-row):not(.snowui-direction-row-reverse) > .snowui-role-col + .snowui-role-row,
                    .snowui-field:not(.snowui-direction-row):not(.snowui-direction-row-reverse) > .snowui-role-col + .snowui-role-col,
                    .snowui-field:not(.snowui-direction-row):not(.snowui-direction-row-reverse) > .snowui-role-col + .snowui-direction-row,
                    .snowui-field:not(.snowui-direction-row):not(.snowui-direction-row-reverse) > .snowui-role-col + .snowui-direction-row-reverse,
                    .snowui-field:not(.snowui-direction-row):not(.snowui-direction-row-reverse) > .snowui-role-col + .snowui-direction-column,
                    .snowui-field:not(.snowui-direction-row):not(.snowui-direction-row-reverse) > .snowui-role-col + .snowui-direction-column-reverse,
                    .snowui-field:not(.snowui-direction-row):not(.snowui-direction-row-reverse) > .snowui-direction-row + .snowui-field-host,
                    .snowui-field:not(.snowui-direction-row):not(.snowui-direction-row-reverse) > .snowui-direction-row + .snowui-role-row,
                    .snowui-field:not(.snowui-direction-row):not(.snowui-direction-row-reverse) > .snowui-direction-row + .snowui-role-col,
                    .snowui-field:not(.snowui-direction-row):not(.snowui-direction-row-reverse) > .snowui-direction-row + .snowui-direction-row,
                    .snowui-field:not(.snowui-direction-row):not(.snowui-direction-row-reverse) > .snowui-direction-row + .snowui-direction-row-reverse,
                    .snowui-field:not(.snowui-direction-row):not(.snowui-direction-row-reverse) > .snowui-direction-row + .snowui-direction-column,
                    .snowui-field:not(.snowui-direction-row):not(.snowui-direction-row-reverse) > .snowui-direction-row + .snowui-direction-column-reverse,
                    .snowui-field:not(.snowui-direction-row):not(.snowui-direction-row-reverse) > .snowui-direction-row-reverse + .snowui-field-host,
                    .snowui-field:not(.snowui-direction-row):not(.snowui-direction-row-reverse) > .snowui-direction-row-reverse + .snowui-role-row,
                    .snowui-field:not(.snowui-direction-row):not(.snowui-direction-row-reverse) > .snowui-direction-row-reverse + .snowui-role-col,
                    .snowui-field:not(.snowui-direction-row):not(.snowui-direction-row-reverse) > .snowui-direction-row-reverse + .snowui-direction-row,
                    .snowui-field:not(.snowui-direction-row):not(.snowui-direction-row-reverse) > .snowui-direction-row-reverse + .snowui-direction-row-reverse,
                    .snowui-field:not(.snowui-direction-row):not(.snowui-direction-row-reverse) > .snowui-direction-row-reverse + .snowui-direction-column,
                    .snowui-field:not(.snowui-direction-row):not(.snowui-direction-row-reverse) > .snowui-direction-row-reverse + .snowui-direction-column-reverse,
                    .snowui-field:not(.snowui-direction-row):not(.snowui-direction-row-reverse) > .snowui-direction-column + .snowui-field-host,
                    .snowui-field:not(.snowui-direction-row):not(.snowui-direction-row-reverse) > .snowui-direction-column + .snowui-role-row,
                    .snowui-field:not(.snowui-direction-row):not(.snowui-direction-row-reverse) > .snowui-direction-column + .snowui-role-col,
                    .snowui-field:not(.snowui-direction-row):not(.snowui-direction-row-reverse) > .snowui-direction-column + .snowui-direction-row,
                    .snowui-field:not(.snowui-direction-row):not(.snowui-direction-row-reverse) > .snowui-direction-column + .snowui-direction-row-reverse,
                    .snowui-field:not(.snowui-direction-row):not(.snowui-direction-row-reverse) > .snowui-direction-column + .snowui-direction-column,
                    .snowui-field:not(.snowui-direction-row):not(.snowui-direction-row-reverse) > .snowui-direction-column + .snowui-direction-column-reverse,
                    .snowui-field:not(.snowui-direction-row):not(.snowui-direction-row-reverse) > .snowui-direction-column-reverse + .snowui-field-host,
                    .snowui-field:not(.snowui-direction-row):not(.snowui-direction-row-reverse) > .snowui-direction-column-reverse + .snowui-role-row,
                    .snowui-field:not(.snowui-direction-row):not(.snowui-direction-row-reverse) > .snowui-direction-column-reverse + .snowui-role-col,
                    .snowui-field:not(.snowui-direction-row):not(.snowui-direction-row-reverse) > .snowui-direction-column-reverse + .snowui-direction-row,
                    .snowui-field:not(.snowui-direction-row):not(.snowui-direction-row-reverse) > .snowui-direction-column-reverse + .snowui-direction-row-reverse,
                    .snowui-field:not(.snowui-direction-row):not(.snowui-direction-row-reverse) > .snowui-direction-column-reverse + .snowui-direction-column,
                    .snowui-field:not(.snowui-direction-row):not(.snowui-direction-row-reverse) > .snowui-direction-column-reverse + .snowui-direction-column-reverse
                )
        ) {
        box-shadow: inset 0 var(--border-1) 0 var(--black-20, #00000033);
    }

    :global(
            :where(
                .snowui-field.snowui-direction-column > [data-as="segment"] + [data-as="segment"],
                .snowui-field.snowui-direction-column > .snowui-field-host + [data-as="segment"],
                .snowui-field.snowui-direction-column > [data-as="segment"] + .snowui-field-host
            )
        ) {
        box-shadow: inset 0 var(--border-1) 0 var(--black-20, #00000033);
    }

    /* 列段内嵌行框架的竖向分割线（如 FM-01 City | ZIP） */
    :global(
            :where(
                .snowui-field.snowui-direction-column
                    > [data-as="segment"].snowui-direction-row
                    > [data-as="segment"]:not(:last-child)
            )
        ) {
        box-shadow: inset calc(var(--border-1) * -1) 0 0 var(--black-20, #00000033);
    }

    :global(
            :where(
                .snowui-field.snowui-direction-row
                    > .snowui-field-host:not([data-as="segment"])
                    + .snowui-field-host:not([data-as="segment"])
            )
        ) {
        box-shadow: inset var(--border-1) 0 0 var(--black-20, #00000033);
    }

    :global(
            :where(
                    .snowui-field
                        > .snowui-role-row
                        > .snowui-button-bare
                        + *,
                    .snowui-field
                        > .snowui-role-row
                        > *
                        + .snowui-button-bare
                )
        ) {
        box-shadow: none;
    }

    :global(
            :where(
                    .snowui-field.snowui-direction-row
                        > .snowui-direction-row
                        > .snowui-icon-wrapper
                        + *,
                    .snowui-field.snowui-direction-row-reverse
                        > .snowui-direction-row-reverse
                        > .snowui-icon-wrapper
                        + *
                )
        ) {
        box-shadow: none;
    }

    :global(
            :where(
                    .snowui-field.snowui-direction-row
                        > .snowui-button-bare
                        + *,
                    .snowui-field.snowui-direction-row
                        > *
                        + .snowui-button-bare,
                    .snowui-field.snowui-direction-row-reverse
                        > .snowui-button-bare
                        + *,
                    .snowui-field.snowui-direction-row-reverse
                        > *
                        + .snowui-button-bare
                )
        ) {
        box-shadow: none;
    }

    :global(
            :where(
                .snowui-field > .snowui-role-col > [data-as="segment"] + [data-as="segment"],
                .snowui-field > .snowui-role-col > .snowui-field-host + [data-as="segment"],
                .snowui-field > .snowui-role-col > [data-as="segment"] + .snowui-field-host
            )
        ) {
        box-shadow: inset 0 var(--border-1) 0 var(--black-20, #00000033);
    }

    :global(
            :where(
                    .snowui-field > .snowui-role-col > .snowui-role-row > :not(.snowui-checkbox) + :not(.snowui-checkbox)
                )
        ) {
        box-shadow: inset var(--border-1) 0 0 var(--black-20, #00000033);
    }

    :global(
            :where(
                    .snowui-field
                        > .snowui-role-col
                        > .snowui-role-row
                        > .snowui-button-bare
                        + *,
                    .snowui-field
                        > .snowui-role-col
                        > .snowui-role-row
                        > *
                        + .snowui-button-bare
                )
        ) {
        box-shadow: none;
    }

</style>
