<script lang="ts">
import {BarChart,LineChart,CircularChart,GaugeChart,ChartGroup} from '@snowui-design-system/components';
const data=[{name:'Revenue',value:42}];
</script>
<section aria-label="Package chart panel gaps">
{#each ['ltr','rtl'] as const as dir}
{#each ['bar','line','circular','gauge','group'] as const as kind}
<div class="package-chart-panel" data-kind={kind} {dir} style="width:320px;--gap-1:0px;--gap-2:0px">
{#if kind==='bar'}
<BarChart width="100%" height={200} appearMotion={false} {data}/>
{:else if kind==='line'}
<LineChart width="100%" height={200} appearMotion={false} xLabels={['Jan']} series={[{name:'Revenue',data:[42]}]}/>
{:else if kind==='circular'}
<CircularChart size={200} appearMotion={false} {data}/>
{:else if kind==='gauge'}
<GaugeChart width={320} appearMotion={false} {data}/>
{:else}
<ChartGroup width="100%" height={200} xLabels={['Revenue']}><BarChart width="100%" height={200} appearMotion={false} {data}/></ChartGroup>
{/if}
</div>
{/each}
{/each}
</section>
