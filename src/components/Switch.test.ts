
export const examples = [
    {
        name: "Required: shared empty feedback",
        code: `Required
<form onsubmit={(event) => event.preventDefault()}>
<Switch name="acknowledged" required>Acknowledge</Switch>
<Button type="submit" variant="filled" skeleton={false}>Submit</Button>
<button type="reset">Reset</button>
</form>`,
        expected: {
            interaction: "空值提交不出现浏览器气泡；不显示空值错误文字，首个无效控件聚焦并短暂红边闪动，外光圈保持原色，结束恢复原态；重复提交可重播，修正输入或选择后清除错误，重置清除提示。",
            render: "非必填控件维持原样；减少动效时仅聚焦，不显示空值错误文字。",
        },
    },
    {
        name: "单行标签与复杂多行退出",
        code: `单行标签
<div style="width: 140px;"><Switch gap={0}>接收完整产品更新通知</Switch></div>
<Switch singleLine={false}><Frame column gap={1}><Text>主要设置</Text><Text>保留多行说明</Text></Frame></Switch>`,
        expected: {
            layout: "单行标签与控件间距至少 4 CSS px；受限文字可收缩，控件保持尺寸；复杂内容显式退出后仍为两行。",
            interaction: "原生完整名称、点击及 Space 切换保持一致。",
        },
    },
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
            interaction: "Click toggles track color and thumb position within 150ms; reduced motion commits the final state immediately",
            performance: "Track and thumb share one bounded transition timeline",
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
            render: "Switch 的 size 表示轨道高度，四边留白均为高度 / 14；28px 轨道加留白占用 32px 高，整体等比缩放",
            layout: "Flex row",
            interaction: "None",
            performance: "All sizes use the same bounded state-transition duration",
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
            performance: "Color changes use the same bounded state-transition duration",
            responsive: "None"
        },
        logic: ["class"]
    }
] as const;
