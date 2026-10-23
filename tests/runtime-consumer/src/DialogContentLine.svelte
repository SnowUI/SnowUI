<script lang="ts">
import{Dialog,Button,Frame,Text}from'@snowui-design-system/components';
let open=$state(false);let size=$state<'sm'|'md'|'lg'>('sm');let footerStyle=$state('');
function show(next:'sm'|'md'|'lg'){size=next;footerStyle='';open=true;}
</script>
{#each ['sm','md','lg'] as const as item}<Button onclick={()=>show(item)}>Package dialog {item}</Button>{/each}
<Dialog bind:open {size} title="Package footer spacing">
<Text>Original dialog body remains independently wrapped.</Text>
<Button onclick={()=>footerStyle='gap:5px'}>Package footer custom spacing</Button>
<Frame as="footer" style={footerStyle}><Button as="item" variant="outline">Package keep editing</Button><Button as="item" variant="filled" data-dialog-close>Package save changes</Button></Frame>
</Dialog>
