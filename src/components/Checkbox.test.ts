
export const examples = [
    {
        name: "1: 基础用法",
        code: `1
<div class="flex gap-8 items-center">
    <Checkbox>Check</Checkbox>
    <Checkbox checked>Checked</Checkbox>
    <Checkbox checked disabled>禁用复选框</Checkbox>
</div>`,
        expected: {
            render: "Basic Checkbox states including Indeterminate",
            layout: "Flex row",
            interaction: "Click to toggle",
            responsive: "None"
        },
        logic: ["checked", "indeterminate"]
    },
    {
        name: "2: 尺寸",
        code: `2
<div class="flex gap-20 items-center">
    <Checkbox checked/>
    <Checkbox size={16} checked>16</Checkbox>
    <Checkbox size={20} checked>20</Checkbox>
    <Checkbox size={24} checked>24</Checkbox>
    <Checkbox size={28} checked>28</Checkbox>
    <Checkbox size={32} checked>32</Checkbox>
    <Checkbox size={40} checked>40</Checkbox>
    <Checkbox size={48} checked>48</Checkbox>
    <Checkbox size={80} checked>80</Checkbox>
</div>`,
        expected: {
            render: "Checkbox in Icon-aligned gradient sizes",
            layout: "Flex row",
            interaction: "None",
            responsive: "None"
        },
        logic: ["size"]
    },
    {
        name: "3: 颜色",
        code: `3
<div class="flex gap-8 items-center">
    <Checkbox class="text-blue" checked>Blue</Checkbox>
    <Checkbox class="text-green" checked>Green</Checkbox>
    <Checkbox class="text-red" checked>Red</Checkbox>
</div>`,
        expected: {
            render: "Checkboxes with custom colors via utility classes",
            layout: "Flex row",
            interaction: "None",
            responsive: "None"
        },
        logic: ["class"]
    }
] as const;
