<script lang="ts">
import {Slider,Text} from '@snowui-design-system/components';
</script>
<section data-package-slider-width style="width:320px">
{#each ['ltr','rtl'] as const as dir}
<div {dir}>
{#each ['solid','soft'] as const as variant}
<Slider class="package-gap-slider" value={65} {variant} title="Complete notification volume setting" showLabel ariaLabel={`Package ${variant} ${dir} volume`} parts={{Text:{class:'package-owned-slider-text'}}}/>
<Slider class="package-gap-range-slider" value={[85,100]} {variant} title="Complete notification volume range" showLabel ariaLabel={[`Package ${variant} ${dir} minimum`,`Package ${variant} ${dir} maximum`]}/>
{/each}
</div>
{/each}
<Slider class="package-explicit-slider" value={50} variant="soft" title="Business volume" showLabel ariaLabel="Package business volume" parts={{Text:{class:'package-owned-slider-text'}}}><Text as="label" class="package-explicit-label">Business label</Text></Slider>
<Slider class="package-ordinary-slider" value={12} showLabel ariaLabel="Package ordinary value"/>
<div style="height:160px"><Slider class="package-vertical-slider" orientation="vertical" value={[3,12]} showLabel ariaLabel={['Package vertical minimum','Package vertical maximum']}/></div>
</section>
