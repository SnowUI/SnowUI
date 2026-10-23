<script lang="ts">
import {OverflowActions} from '@snowui-design-system/components';
let selected=$state('');
</script>
<div data-package-action-width style="width:600px">
<OverflowActions class="package-gap-actions" compact="none" overflow="progressive" moreLabel="Package gap actions" onAction={e=>selected+=`${e.id}:${e.source};`} items={[{id:'edit',label:'Edit document'},{id:'copy',label:'Copy document'},{id:'archive',label:'Archive document'}]}/>
</div>
<output data-testid="package-gap-action-selected">{selected}</output>
