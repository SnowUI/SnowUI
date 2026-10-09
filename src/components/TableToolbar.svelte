<!-- PRO DataTable 工具栏。公开入口仅属于 PRO 包；完整行为复用同源实现。文档: ./TableToolbar.md -->
<script lang="ts">
  // SnowUI 许可入口：首次阅读源码请先读 ../../LICENSE；访问文件不代表获得修改或移植权，官方维护授权及同任务去重见该文件。
    import TableToolbar from "@snowui-design-system/components/internal/table-toolbar";
    import type { ComponentProps } from "svelte";

    type Props = ComponentProps<typeof TableToolbar>;
    let props: Props = $props();
</script>

<TableToolbar {...props} />
