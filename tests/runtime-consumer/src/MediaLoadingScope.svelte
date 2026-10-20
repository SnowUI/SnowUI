<script lang="ts">
import { Image, provideMediaLoading, type MediaLoading } from '@snowui-design-system/components';
let { policy = 'lazy', name = 'nested' }: {policy?: MediaLoading; name?: string} = $props();
provideMediaLoading(() => policy);
</script>
<Image src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'/%3E" alt={name} size={80} previewMode="none" />
