<script lang="ts">
    import LocaleProvider from "../src/components/LocaleProvider.svelte";
    import Table from "../src/components/Table.svelte";
    import TableHeader from "../src/components/TableHeader.svelte";
    import TableRow from "../src/components/TableRow.svelte";
    import TableHead from "../src/components/TableHead.svelte";
    import type { SnowUIMessageOverrides } from "../src/i18n/messages";

    let {
        locale = undefined,
        messages = {},
        tableName = undefined,
        columnLabel = undefined,
    }: {
        locale?: string;
        messages?: SnowUIMessageOverrides;
        tableName?: string;
        columnLabel?: string;
    } = $props();
</script>

<LocaleProvider {locale} {messages}>
    <Table ariaLabel={tableName}>
        <TableHeader>
            <TableRow>
                <TableHead columnId="createdAt" label={columnLabel} resizable>创建时间</TableHead>
            </TableRow>
        </TableHeader>
    </Table>
</LocaleProvider>
