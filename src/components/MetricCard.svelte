<!-- SnowUI source notice | LICENSE 2.3.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 -->
<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import Card from './Card.svelte';
  import Text from './Text.svelte';
  import { DEFAULT_NUMBER_EMPTY_VALUE } from '../lib/number-format';
  interface Props extends Omit<ComponentProps<typeof Card>, 'children' | 'contentFill' | 'contentHug' | 'scrollable'> {
    label: string;
    value: string;
    change?: string;
    emphasis?: 'value' | 'change';
    trend?: 'positive' | 'negative' | 'neutral';
    [key: string]: any;
  }
  let { label, value, change = undefined, emphasis = 'change', trend = 'neutral', class: userClass = '', style: userStyle = '', ...rest }: Props = $props();
  let displayedValue = $derived(value?.trim() || DEFAULT_NUMBER_EMPTY_VALUE);
  let displayedChange = $derived(change === undefined ? undefined : change.trim() || DEFAULT_NUMBER_EMPTY_VALUE);
  let sign = $derived(displayedChange && /^[+−-]\d/.test(displayedChange) ? displayedChange[0] : '');
  let changeText = $derived(sign ? displayedChange?.slice(1) : displayedChange);
</script>

<Card {...rest} class={`snowui-metric-card ${userClass}`} style={`--snowui-card-background-override: var(--snowui-metric-card-background-override, var(--background-3)); ${userStyle}`} contentFill scrollable={false}>
  <Text class="snowui-metric-label">{label}</Text>
  <div class="snowui-metric-values">
    {#if emphasis === 'change' && change !== undefined}
      <Text class="snowui-metric-primary"><span class={`snowui-metric-sign snowui-metric-${trend}`}>{sign}</span>{changeText}</Text>
      <Text class="snowui-metric-secondary">{displayedValue}</Text>
    {:else}
      <Text class="snowui-metric-primary">{displayedValue}</Text>
      {#if change !== undefined}<Text class="snowui-metric-secondary"><span class={`snowui-metric-sign snowui-metric-${trend}`}>{sign}</span>{changeText}</Text>{/if}
    {/if}
  </div>
</Card>

<style>
  :global(:where(.snowui-metric-card .snowui-metric-label)) { color: var(--black-40, #00000066); padding-inline: var(--padding-1, 4px); }
  :global(:where(.snowui-metric-values)) { display: flex; align-items: baseline; justify-content: space-between; gap: var(--gap-4, 16px); min-width: 0; }
  :global(:where(.snowui-metric-values .snowui-metric-primary)) { font-size: var(--text-32, 32px); line-height: var(--leading-32, 40px); min-width: 0; }
  :global(:where(.snowui-metric-values .snowui-metric-secondary)) { font-size: var(--text-14); line-height: var(--leading-14, 20px); flex-shrink: 0; }
  :global(:where(.snowui-metric-positive)) { color: var(--secondary-green, #71DD8CFF); }
  :global(:where(.snowui-metric-negative)) { color: var(--secondary-red, #FF4747FF); }
</style>
