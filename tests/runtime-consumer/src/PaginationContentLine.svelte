<script lang="ts">
import {Pagination} from '@snowui-design-system/components';
let selected=$state(0);let calls=$state(0);
</script>
<section aria-label="Package pagination gaps">
{#each ['ltr','rtl'] as const as dir}
{#each ['default','zero','large'] as const as profile}
<div class="package-pagination-width" {dir} data-profile={profile} style="width:1024px">
<Pagination class="package-pagination-gap" page={2} total={5} gap={profile==='zero'?0:profile==='large'?24:undefined} pageSizeGap={profile==='zero'?0:profile==='large'?48:undefined} pageSizeOptions={[10,20,50]} onPageChange={next=>{selected=next;calls+=1}}/>
</div>
{/each}
{/each}
<output data-package-page-events>{selected}:{calls}</output>
</section>
