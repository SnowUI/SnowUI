
export const examples = [
    {
        name: "Required: shared empty feedback",
        code: `Required
<form onsubmit={(event) => event.preventDefault()}>
<Checkbox name="consent" required>Accept terms</Checkbox>
<Button type="submit" variant="filled" skeleton={false}>Submit</Button>
<button type="reset">Reset</button>
</form>`,
        expected: {
            interaction: "空值提交不出现浏览器气泡；显示组件错误文字，首个无效控件聚焦并红边闪动，外光圈保持原色；重复提交可重播，修正输入或选择后清除错误，重置清除提示。",
            render: "非必填控件维持原样；减少动效时仅保留错误提示。",
        },
    },
    {
        name: "单行标签与复杂多行退出",
        code: `单行标签
<div style="width: 140px;"><Checkbox gap={0}>接收完整产品更新通知</Checkbox></div>
<Checkbox singleLine={false}><Frame column gap={1}><Text>主要设置</Text><Text>保留多行说明</Text></Frame></Checkbox>`,
        expected: {
            layout: "单行标签与控件间距至少 4 CSS px；受限文字可收缩，控件保持尺寸；复杂内容显式退出后仍为两行。",
            interaction: "原生完整名称、点击及 Space 切换保持一致。",
        },
    },
    {
        name: "1: 基础用法",
        code: `1
<div class="flex gap-8 items-center">
    <Checkbox>Check</Checkbox>
    <Checkbox checked>Checked</Checkbox>
    <Checkbox indeterminate>Indeterminate</Checkbox>
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
    <Checkbox size={12}>12</Checkbox>
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
            render: "Checkbox in all ResourceSize steps; 32px 占位包含四边各 2px 的可点击透明留白，可见图形为 28×28px；留白和图形等比缩放",
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
