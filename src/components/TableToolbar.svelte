<!-- PRO DataTable 工具栏。公开入口仅属于 PRO 包；完整行为复用同源实现。文档: ./TableToolbar.md -->
<script lang="ts">
    import TableToolbar from "@snowui-design-system/components/internal/table-toolbar";
    import type { ComponentProps } from "svelte";

    type Props = ComponentProps<typeof TableToolbar>;
    let props: Props = $props();
</script>

<TableToolbar {...props} />
