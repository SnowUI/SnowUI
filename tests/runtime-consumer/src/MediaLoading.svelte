<script lang="ts">
import { Image, Button, provideMediaLoading, type MediaLoading } from '@snowui-design-system/components';
import Scope from './MediaLoadingScope.svelte';
let policy=$state<MediaLoading>('eager');
provideMediaLoading(()=>policy);
const src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'/%3E";
</script>
<div data-testid="media-loading">
<Button onclick={()=>policy=policy==='eager'?'lazy':'eager'}>Toggle media loading</Button>
<Image {src} alt="inherited media" size={80} previewMode="none"><Button as="icon" aria-label="Media action">Action</Button></Image>
<Image {src} alt="explicit media" size={80} mediaLoading="lazy" previewMode="none" />
<Scope name="nested media" />
<Scope policy="eager" name="nested eager media" />
</div>
