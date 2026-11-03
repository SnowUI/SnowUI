<script lang="ts">
 import Avatar from '../src/components/Avatar.svelte';
 import Image from '../src/components/Image.svelte';
 import Icon from '../src/components/Icon.svelte';
 let { src, skeleton = true, loading = false }: { src?: string; skeleton?: boolean; loading?: boolean } = $props();
</script>
<Avatar {src} size={40} {skeleton} {loading} />
<Image {src} size={80} />
<Icon {src} size={24} {skeleton} />
