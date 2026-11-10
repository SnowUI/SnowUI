<!-- SnowUI source notice | LICENSE 2.3.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 -->
<script lang="ts">
    import type { Snippet } from "svelte";
    import Text from "../components/Text.svelte";
    let { enabled, message, id, children }: {
        enabled: boolean; message: string; id: string; children: Snippet;
    } = $props();
</script>

{#if enabled}
    <div class="snowui-required-feedback">
        {@render children()}
        {#if message}
            <Text {id} as="error" role="alert" class="snowui-field-error-message">{message}</Text>
        {/if}
    </div>
{:else}
    {@render children()}
{/if}

<style>
    .snowui-required-feedback { display: flex; flex-direction: column; gap: var(--size-0-5, 0.125rem); min-width: 0; }
    :global([data-required-invalid="true"]) {
        outline: var(--snowui-field-border-width, 0.03125rem) solid var(--secondary-red, #ff4747ff);
        outline-offset: calc(-1 * var(--snowui-field-border-width, 0.03125rem));
    }
</style>
