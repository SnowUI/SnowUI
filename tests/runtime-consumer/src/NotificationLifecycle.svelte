<script lang="ts">
import { flushSync } from 'svelte';
import { Button, Frame, Text, Pagination, Toaster, toast, dismissAllToasts } from '@snowui-design-system/components';

let composition = $state('built-in');
let responsive = $state<'auto' | 'none'>('auto');
let visible = $state(true);
let current = $state(1);
let pageSize = $state(10);
let generation = $state(0);
let position = $state<'top' | 'top-left' | 'top-right' | 'bottom' | 'bottom-left' | 'bottom-right'>('top');
let dismissed = $state(0);
let serial = 0;
const closed = () => dismissed += 1;
function dispose() {
    flushSync(() => { current = 2; pageSize = 20; });
    flushSync(() => { current = 4; pageSize = 10; visible = false; });
}
function restore() { current = 1; pageSize = 10; generation += 1; visible = true; }
function timed() { toast({ text: 'Package timed notification', position, duration: 300, onDismiss: closed }); }
function persistent() { toast({ text: 'Package persistent notification', position, duration: 0, variant: 'rich', onDismiss: closed }); }
function stack() {
    for (let index = 0; index < 4; index += 1) {
        toast({ text: `Package revision ${++serial}`, position, duration: 0, onDismiss: closed });
    }
}
</script>

{#snippet complexNotification()}<Frame column><Text>Explicit package heading</Text><Text>Explicit package multiline body</Text></Frame>{/snippet}
<section aria-label="Package lifecycle fixture" style="width:600px;max-width:100%;padding:24px">
    <h2>Package lifecycle fixture</h2>
    <label>Composition <select aria-label="Package pagination composition" bind:value={composition}><option>built-in</option><option>explicit</option></select></label>
    <label>Responsive <select aria-label="Package pagination responsive" bind:value={responsive}><option>auto</option><option>none</option></select></label>
    <button onclick={dispose}>Dispose package pagination</button>
    <button onclick={restore}>Restore package pagination</button>
    <output data-testid="package-pagination-state">Instance {generation}, page {current}, page size {pageSize}</output>
    {#key `${composition}:${responsive}`}
        {#if visible}
            <Pagination page={current} total={6} {pageSize} pageSizeOptions={[10,20]} {responsive}
                ariaLabel="Package pagination" onPageChange={(next) => current = next}
                onPageSizeChange={(next) => pageSize = next}>
                {#if composition === 'explicit'}
                    <Button as="current"/><Button as="page"/>
                    <Button as="prev">Previous</Button><Button as="next">Next</Button><Button as="pageSize"/>
                {/if}
            </Pagination>
        {/if}
    {/key}
    <label>Position <select aria-label="Package notification position" bind:value={position}>
        <option>top</option><option>top-left</option><option>top-right</option>
        <option>bottom</option><option>bottom-left</option><option>bottom-right</option>
    </select></label>
    <button onclick={timed}>Package timed</button>
    <button onclick={persistent}>Package persistent</button>
    <button onclick={stack}>Package four notifications</button>
    <button onclick={() => dismissAllToasts()}>Package clear notifications</button>
    <output data-testid="package-notification-dismissed">{dismissed}</output>
    <button onclick={() => toast({text:'Complete package notification with a long result 完整通知结果',positive:true,variant:'rich',duration:0,class:'package-long-notification'})}>Package long notification</button>
    <button onclick={() => toast({children:complexNotification,positive:true,variant:'rich',duration:0,class:'package-explicit-notification'})}>Package complex notification</button>
    <Toaster maxVisible={3} parts={{Text:{class:'package-generated-notification-label'}}}/>
</section>
