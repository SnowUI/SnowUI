<script lang="ts">
import {CopyLink,Textarea,Field} from '@snowui-design-system/components';
let copied=$state('');
</script>
<section aria-label="Package copy and textarea gaps">
{#each ['ltr','rtl'] as const as dir}
<form class="package-copy-textarea" {dir} style="width:320px;--gap-2:0px">
<CopyLink href="https://snowui.dev/components/quick-start?source=complete-shared-address" parts={{CopyButton:{writeText:async()=>{}}}} onCopy={text=>copied=text}/>
<Textarea aria-label={`Package standalone ${dir}`} name={`standalone-${dir}`} maxCount={100} defaultValue="SnowUI"/>
<Field><Textarea aria-label={`Package field ${dir}`} name={`field-${dir}`} maxCount={100} defaultValue="SnowUI"/></Field>
<Field><Textarea as="segment" aria-label={`Package segment ${dir}`} name={`segment-${dir}`} maxCount={100} defaultValue="SnowUI"/></Field>
</form>
{/each}
<output data-package-copied>{copied}</output>
</section>
