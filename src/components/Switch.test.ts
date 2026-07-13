
export const examples = [
    {
        name: "1: 基础用法",
        code: `1
<div class="flex gap-4 items-center">
    <Switch checked={true}>On</Switch>
    <Switch checked={false}>Off</Switch>
    <Switch disabled>Disabled</Switch>
    <Switch disabled checked>Disabled On</Switch>
</div>`,
        expected: {
            render: "Basic Switch states",
            layout: "Flex row",
            interaction: "Click to toggle",
            responsive: "None"
        },
        logic: ["checked"]
    },
    {
        name: "2: 尺寸",
        code: `2
<div class="flex gap-4 items-center">
    <Switch size={16} checked>16</Switch>
    <Switch size={20} checked>20</Switch>
    <Switch size={24} checked>24</Switch>
    <Switch size={28} checked>28</Switch>
    <Switch size={32} checked>32</Switch>
    <Switch size={40} checked>40</Switch>
    <Switch size={48} checked>48</Switch>
    <Switch size={80} checked>80</Switch>
</div>`,
        expected: {
            render: "Switch in 8 standard gradient sizes",
            layout: "Flex row",
            interaction: "None",
            responsive: "None"
        },
        logic: ["size"]
    },
    {
        name: "3: 颜色",
        code: `3
<div class="flex gap-4 items-center">
    <Switch class="text-blue" checked>Blue</Switch>
    <Switch class="text-green" checked>Green</Switch>
    <Switch class="text-red" checked>Red</Switch>
</div>`,
        expected: {
            render: "Switches with custom colors via utility classes",
            layout: "Flex row",
            interaction: "None",
            responsive: "None"
        },
        logic: ["class"]
    }
] as const;
