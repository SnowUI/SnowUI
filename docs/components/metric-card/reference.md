# MetricCard full reference

Reviewed against Chinese source SHA-256 `26233182e36308462a9f7d1ed43313b947c0132449c06cad0ea92b126af7db6f`.

<a id="metriccard"></a>

# MetricCard

<a id="组件介绍"></a>

## Overview

Display one dashboard metric and an optional change. This component does not fetch data or calculate changes.

<a id="使用选择"></a>

## When to use it

Arrange multiple MetricCard components for a dashboard; use Card for general content. The caller provides values and comparisons. Use emphasis to select the primary value and trend to describe its direction.

<a id="快速开始"></a>

## Quick start

```svelte
<script lang="ts">
  import { MetricCard } from '@snowui-design-system/components';
</script>

<MetricCard label="Orders" value="694" change="+22.41%" trend="positive" />
<MetricCard label="Orders" value="694" change="+22.41%" trend="positive" emphasis="value" />
```

<a id="api"></a>

## API

| Keyword | Type | Default | Description |
| --- | --- | --- | --- |
| label | `string` | Required | Metric name |
| value | `string` | Required | Formatted current value |
| change | `string` | — | Formatted change; without it the current value is primary |
| emphasis | `'value' \| 'change'` | `"change"` | Select the current value or change as the primary value |
| trend | `'positive' \| 'negative' \| 'neutral'` | `"neutral"` | Visual state of the initial sign; the caller supplies the value and its meaning |

Other compatible Props are inherited from [Card](../card/reference.md). The component owns children, contentFill, contentHug, and scrollable.

<a id="使用边界与详细说明"></a>

## Usage boundaries and details

Card is the actual host. Callers own layout and formatted values. Empty values display "-", real zero remains visible, and omitting change removes its region. The default background is Background/3, configurable through --snowui-metric-card-background-override. With emphasis="change", change is on the left and the current value on the right. Include a sign or text to convey direction without color alone. MetricCard does not fetch data or calculate comparisons and supports SSR.

<a id="ai-对话使用"></a>

### Use in AI conversations

Use the public label, value, change, emphasis, and trend Props with caller-provided metrics. The component does not read data or trigger business actions. If the host cannot run the component and its styles, use text instead. No specific conversation host has been verified.

[Styles](./styles.md) · [Types](./types.md) · [API](./api.md)
