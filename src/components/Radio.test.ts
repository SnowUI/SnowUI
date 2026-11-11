
export const examples = [
    {
        name: "Required: shared empty feedback",
        code: `Required
<script>let requiredPlan = $state();</script>
<form onsubmit={(event) => event.preventDefault()}>
<Radio bind:group={requiredPlan} name="plan" value="a" required>Plan A</Radio>
<Radio bind:group={requiredPlan} name="plan" value="b" required>Plan B</Radio>
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
<div style="width: 140px;"><Radio gap={0}>接收完整产品更新通知</Radio></div>
<Radio singleLine={false}><Frame column gap={1}><Text>主要设置</Text><Text>保留多行说明</Text></Frame></Radio>`,
        expected: {
            layout: "单行标签与控件间距至少 4 CSS px；受限文字可收缩，控件保持尺寸；复杂内容显式退出后仍为两行。",
            interaction: "原生完整名称、点击及 Space 切换保持一致。",
        },
    },
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
    <Radio size={12}>12</Radio>
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
            render: "Radio in all ResourceSize steps; 32px 占位包含四边各 2px 的可点击透明留白，可见图形为 28×28px；留白和图形等比缩放",
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
