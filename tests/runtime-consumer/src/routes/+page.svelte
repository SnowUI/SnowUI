<script lang="ts">
import * as SnowUI from "@snowui-design-system/components";
import FrameCoordination from "../FrameCoordination.svelte";
import {Button, Frame, Input, NumericText, BarChart, Sidebar, SidebarItem, DataTable, Table, TableHeader, TableRow, TableHead, TableBody, TableCell, TableToolbar, type DataTableRenderState} from '@snowui-design-system/components';
import {Frame as LegacyFrame} from '@snowui-design-system/components/compat';
import '@snowui-design-system/components/styles';
let clicks=$state(0);let value=$state('SnowUI');let tableState=$state<DataTableRenderState<{id:number;name:string}>>();
const sameFrame = LegacyFrame === Frame && Object.keys(SnowUI).filter(name => /^Frame/.test(name)).join() === "Frame";
const rows=[{id:1,name:'Alpha'},{id:2,name:'Beta'}];
</script>
<svelte:head><title>SnowUI candidate validation</title></svelte:head>
<p>仅用于示例演示与分享</p>
<p data-testid="identity">{sameFrame ? 'identity-ok' : 'identity-failed'}</p>
<Frame column><Button onclick={()=>clicks++}>Count {clicks}</Button><Input aria-label="Name" bind:value/><span data-testid="bound">{value}</span><span data-testid="animated-number"><NumericText value={clicks}/></span></Frame>
<LegacyFrame><span>Legacy snippet</span></LegacyFrame>
<Sidebar persistence={false} resizable={false}><SidebarItem id="home" label="Home"/></Sidebar>
<BarChart width={500} height={200} data={[{name:'A',value:10},{name:'B',value:20}]}/>
<DataTable {rows} rowKey={(row)=>row.id} bind:state={tableState}><TableToolbar search sort={false} filter={false} searchAriaLabel="Search rows"/><Table><TableHeader><TableRow><TableHead columnId="name">Name</TableHead></TableRow></TableHeader><TableBody>{#each tableState?.rows ?? [] as row}<TableRow><TableCell columnId="name">{row.name}</TableCell></TableRow>{/each}</TableBody></Table></DataTable>

<FrameCoordination />

<div data-testid="theme-probe" style="background:var(--background-1)">Theme probe</div>
