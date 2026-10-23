<script lang="ts">
import {Frame, Text, Icon, Button, MenuItem, Chip, Link, Table, TableHeader, TableHead, TableBody, TableRow, TableCell, Tab, Segmented, Checkbox, Radio, Switch, Input, Field, Select, SearchInput, Listbox, SearchBox, Breadcrumb, Kbd, SidebarItem, SidebarSection, Badge, Accordion, AccordionItem, SidePanel, Tooltip, Sidebar, Avatar} from '@snowui-design-system/components';
let calls=$state(0);
let checkboxValues=$state<string[]>([]);
let radioValue=$state<string|null|undefined>(null);
let switchValue=$state(false);
let captionCalls=$state(0);
let fieldActionCalls=$state(0);
let accordionValue=$state<string|string[]|undefined>('0');
let accordionChangeCalls=$state(0);
let packagePanelOpen=$state(false);
let packagePanelDraft=$state('Package draft');
</script>
{#snippet graphic()}
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" aria-hidden="true"><path d="m3 10 4 4 10-10" fill="none" stroke="currentColor" stroke-width="2"/></svg>
{/snippet}
<section aria-label="Package single-line layout">
<Frame id="package-content-line" singleLine gap={0} responsive={{direction:'column',minGap:0}} style="width:120px"><Icon as="leading" size={20}>{@render graphic()}</Icon><Text lines={1}>Long package label 运行包长标签</Text><Icon as="trailing" size={16}>{@render graphic()}</Icon></Frame>
<Frame id="package-text-line" singleLine gap={0} enableResponsive={false} style="width:120px"><Text lines={1}>Independent first label</Text><Text lines={1}>Independent second label</Text></Frame>
<Button id="package-line-button" gap={0} onclick={()=>calls++}><Icon size={20}>{@render graphic()}</Icon><Text lines={1}>Package action</Text></Button>
<MenuItem class="package-line-menu" gap={0} onclick={()=>calls++}><Icon as="leading" size={20}>{@render graphic()}</Icon><Text lines={1}>Package menu action</Text></MenuItem>
<Chip id="package-line-chip"><Text lines={1}>Package chip</Text></Chip>
<Link id="package-line-link" href="#package-content-line" variant="external" lines={1}>Package documentation</Link>
<Table horizontalScroll={false} minWidth={0} ariaLabel="Package single-line table"><TableHeader><TableRow><TableHead columnId="label">Label</TableHead></TableRow></TableHeader><TableBody><TableRow><TableCell columnId="label" singleLine gap={0}><Icon as="leading" size={20}>{@render graphic()}</Icon><Text lines={1}>Package cell label</Text></TableCell></TableRow></TableBody></Table>
<Tab id="package-label-tab" itemRole="tab" variant="icon-toggle" items={[{value:'a',label:'Package alpha'},{value:'b',label:'Package beta'}]}/>
<Segmented id="package-label-segment" items={[{value:'a',label:'Package one'},{value:'b',label:'Package two'}]}/>
<output data-testid="package-content-calls">{calls}</output>
</section>

<section aria-label="Package control labels" style="width:120px">
<Button class="package-caption-button" gap={0} style="width:120px;min-width:0" onclick={()=>captionCalls++}><Text lines={1}>Complete package action 完整执行名称</Text></Button>
<Checkbox class="package-line-checkbox" bind:group={checkboxValues} value="one" gap={0}><Text lines={1} style="width:80px">Complete package checkbox 完整选项名称</Text></Checkbox>
<Radio class="package-line-radio" bind:group={radioValue} value="one" gap={0}>Complete package radio 完整单选名称</Radio>
<Switch class="package-line-switch" bind:checked={switchValue} gap={0}>Complete package switch 完整开关名称</Switch>
<output data-testid="package-control-values">{JSON.stringify(checkboxValues)}/{String(radioValue)}/{String(switchValue)}/{captionCalls}</output>
</section>

<section aria-label="Package field owners">
<Field class="package-default-field" style="width:260px">
<Text as="label">Package due date</Text>
<Icon as="leading" size={20}>{@render graphic()}</Icon>
<Input class="package-default-date" type="date" value="2026-02-01" clearable={false} aria-label="Package due date"/>
<Button as="trailing" bare aria-label="Package date action" onclick={()=>fieldActionCalls++}><Icon size={16}>{@render graphic()}</Icon></Button>
</Field>
<output data-testid="package-field-actions">{fieldActionCalls}</output>

<form id="package-field-form" style="width:260px">
<Field row class="package-segment-field">
<Input class="package-segment-input" as="segment" gap={0} name="entry" aria-label="Package entry" value="Complete editable entry" clearable={false}><Icon as="leading" size={20}>{@render graphic()}</Icon></Input>
<Select class="package-segment-select" as="segment" gap={0} name="workspace" ariaLabel="Package workspace" defaultValue="snowui" options={[{value:'snowui',label:'Complete SnowUI workspace'},{value:'other',label:'Other workspace'}]}/>
</Field>
</form>
<SearchInput class="package-collapsing-search" collapseBelow={100} gap={0} defaultValue="Package query" aria-label="Package search" style="width:80px"/>
<Button class="package-search-leave">Leave package search</Button>
<div style="display:flex;width:240px"><SearchInput class="package-borderless-search" variant="borderless" gap={0} value="Full query" aria-label="Package borderless search"/></div>
</section>

<section aria-label="Package listbox owner" style="width:120px">
<Select class="package-long-list" ariaLabel="Package long choices" defaultValue="long" style="width:120px">
<Listbox search showCheck parts={{Text:{class:'package-list-label'}}} items={[{value:'long',label:'Complete package workspace name with a searchable distinctive TailToken'},{value:'short',label:'Short'}]}/>
</Select>
</section>

<section aria-label="Package navigation owners">
<SearchBox class="package-search-box" gap={0} value="Complete package search query" clearable={false} style="width:240px"><Kbd as="trailing">⌘K</Kbd></SearchBox>
<Breadcrumb class="package-breadcrumb" gap={0} ariaLabel="Package page path" items={[{label:'Parent workspace'},{label:'Current page'}]} style="width:320px"/>
</section>

<section aria-label="Package sidebar owners" style="width:160px">
<SidebarItem id="package-sidebar-button" label="Complete package navigation title" icon="user" updated actions={[{id:'more',label:'Package item More',icon:'three-dots'}]}>{#snippet tags()}<Badge variant="border" count="New" />{/snippet}</SidebarItem>
<SidebarItem id="package-sidebar-link" href="#package-content-line" label="Complete linked package navigation title" icon="user" updated>{#snippet tags()}<Badge variant="border" count="New" />{/snippet}</SidebarItem>
<SidebarSection id="package-sidebar-section" title="Complete package section title" actions={[{id:'more',label:'Package section More',icon:'three-dots'},{id:'add',label:'Package section Add',icon:'plus'}]}><Text>Package section body</Text></SidebarSection>
</section>

<section aria-label="Package accordion owners">
<Accordion class="package-builtin-accordion" bind:value={accordionValue} onValueChange={()=>accordionChangeCalls++} style="width:260px" parts={{Text:{class:'package-accordion-label'}}} items={[{title:'Complete package accordion installation and delivery settings',content:'Package accordion body remains ordinary prose and may wrap across several lines.'},{title:'Other package section',content:'Another package body.'}]}/>
<output data-testid="package-accordion-state">{accordionValue}/{accordionChangeCalls}</output>
<Accordion class="package-explicit-accordion" defaultValue="explicit" style="width:260px" parts={{Text:{class:'package-accordion-must-not-leak'}}}>
<AccordionItem value="explicit"><Frame as="title" singleLine><Icon as="leading" size={20}>{@render graphic()}</Icon><Text lines={1}>Complete explicit package section title</Text></Frame><Frame as="content" row>Explicit package prose remains independent.</Frame></AccordionItem>
</Accordion>
<Accordion class="package-minus-accordion" indicatorVariant="minus" defaultValue="0" style="width:260px" items={[{title:'Package legacy minus mode',content:'Legacy expansion mode remains available.'}]}/>
</section>

<section aria-label="Package SidePanel owner">
<Button id="package-show-side-panel" onclick={()=>packagePanelOpen=true}>Package panel</Button>
<SidePanel class="package-side-panel" bind:open={packagePanelOpen} showTitle closeOnOutside={false} title="Complete package panel installation and delivery settings" width={320}><Input aria-label="Package panel draft" bind:value={packagePanelDraft}/></SidePanel>
</section>

<section aria-label="Package Tooltip content ownership">
<Button id="package-tooltip-trigger">Package tooltip<Tooltip><Frame column gap={1}><Frame class="package-tooltip-row" singleLine gap={2}><Text class="package-tooltip-label" lines={1} tooltip={false}>Complete package build status</Text><Badge as="trailing" variant="border" count="Ready" /></Frame><Text class="package-tooltip-prose">Package tooltip prose stays in its original multiline layout.</Text></Frame></Tooltip></Button>
</section>

<section aria-label="Package single-line sidebar footer" style="height:300px;width:240px">
<Sidebar data-package-sidebar ariaLabel="Package footer navigation area" persistence={false} resizable={false}>
<SidebarItem id="package-footer-navigation" label="Package footer navigation" />
<Frame as="footer" singleLine><Avatar as="leading" aria-label="Package current user" /><Text lines={1}>Complete package current user name</Text></Frame>
</Sidebar>
</section>
