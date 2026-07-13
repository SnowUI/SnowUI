
export const examples = [
    {
        name: "1: 基础用法",
        code: `1
<div class="flex gap-4 items-center">
    <Radio checked={true}>Default Checked</Radio>
    <Radio checked={false}>Unchecked</Radio>
    <Radio disabled>Disabled</Radio>
    <Radio disabled checked>Disabled Checked</Radio>
</div>`,
        expected: {
            render: "Basic Radio states",
            layout: "Flex row",
            interaction: "Click selected item again to deselect (except disabled)",
            responsive: "None"
        },
        logic: ["checked", "disabled"]
    },
    {
        name: "2: 变体",
        code: `2
<div class="flex gap-4 items-center">
    <Radio variant="filled" checked={true}>Filled (Default)</Radio>
    <Radio variant="outline" checked={true}>Outline</Radio>
</div>`,
        expected: {
            render: "Comparision of outline and filled variants",
            layout: "Flex row",
            interaction: "None",
            responsive: "None"
        },
        logic: ["variant"]
    },
    {
        name: "3: 尺寸",
        code: `3
<div class="flex gap-4 items-center">
    <Radio size={16}>16</Radio>
    <Radio size={20}>20</Radio>
    <Radio size={24}>24</Radio>
    <Radio size={28}>28</Radio>
    <Radio size={32}>32</Radio>
    <Radio size={40}>40</Radio>
    <Radio size={48}>48</Radio>
    <Radio size={80}>80</Radio>
</div>`,
        expected: {
            render: "Radio in 8 standard gradient sizes",
            layout: "Flex row",
            interaction: "None",
            responsive: "None"
        },
        logic: ["size"]
    },
    {
        name: "4: 联动 (Filled Variant，可取消)",
        code: `4
<script>
    let group = $state("A");
</script>

<div class="flex gap-4 items-center">
    <Radio bind:group value="A" variant="filled">Option A</Radio>
    <Radio bind:group value="B" variant="filled">Option B</Radio>
    <Radio bind:group value="C" variant="filled">Option C</Radio>
</div>`,
        expected: {
            render: "Radio group with mutual exclusion and deselect support, filled variant",
            layout: "Flex row",
            interaction: "Click selected item again to clear group",
            responsive: "None"
        },
        logic: ["bind:group", "variant"]
    }
] as const;
