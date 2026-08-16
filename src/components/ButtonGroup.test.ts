export const examples = [
    {
        name: "BG-01:显式分组角色",
        code: `BG-01
<ButtonGroup size="sm">
    <Button as="item">复制</Button>
    <Separator as="separator" column />
    <Button as="item">更多</Button>
</ButtonGroup>`,
        expected: { render: "item 形成统一分组外壳。", layout: "根不输出 data-auto-layout，computed gap 为 0；两个 Button 盒分别紧贴 Separator 两侧。", interaction: "按钮各自处理点击，hover 覆盖完整单元格并连续到 Separator 边界。", performance: "只扫描角色子项。", responsive: "跟随容器。" },
        logic: ["Contract", "GroupCell"],
    },
    {
        name: "BG-02:尺寸与变体 Context",
        code: `BG-02
<ButtonGroup size="md" variant="outline">
    <Button as="item"><Icon><Paperclip /></Icon>附件</Button>
    <Separator as="separator" column />
    <Button as="item">发送</Button>
</ButtonGroup>`,
        expected: { render: "item 消费公开 ButtonGroup Context。", layout: "首尾位置正确。", interaction: "保持 Button 行为。", performance: "无未知子项注入。", responsive: "跟随容器。" },
        logic: ["Context", "Variant"],
    },
    {
        name: "BG-03:禁用",
        code: `BG-03
<ButtonGroup disabled variant="filled">
    <Button as="item">不可用</Button>
    <Separator as="separator" column />
    <Button as="item">不可用</Button>
</ButtonGroup>`,
        expected: { render: "分组整体禁用。", layout: "结构不变。", interaction: "item 不响应点击。", performance: "Context 单向传递。", responsive: "跟随容器。" },
        logic: ["Disabled", "Context"],
    },
    {
        name: "BG-04:全部尺寸",
        code: `BG-04
<Frame column gap={2}>
    <ButtonGroup size="sm"><Button as="item">Small</Button></ButtonGroup>
    <ButtonGroup size="md"><Button as="item">Medium</Button></ButtonGroup>
    <ButtonGroup size="lg"><Button as="item">Large</Button></ButtonGroup>
</Frame>`,
        expected: { render: "三档尺寸分别生效。", layout: "纵向展示三组。", interaction: "item 保持按钮能力。", performance: "共享 Context 协议。", responsive: "跟随容器。" },
        logic: ["Size", "Context"],
    },
    {
        name: "BG-05:全部变体",
        code: `BG-05
<Frame column gap={2}>
    <ButtonGroup variant="gray"><Button as="item">Gray</Button><Separator as="separator" column /><Button as="item">Gray</Button></ButtonGroup>
    <ButtonGroup variant="filled"><Button as="item">Filled</Button><Separator as="separator" column /><Button as="item">Filled</Button></ButtonGroup>
    <ButtonGroup variant="outline"><Button as="item">Outline</Button><Separator as="separator" column /><Button as="item">Outline</Button></ButtonGroup>
    <ButtonGroup variant="borderless"><Button as="item">Borderless</Button><Separator as="separator" column /><Button as="item">Borderless</Button></ButtonGroup>
</Frame>`,
        expected: { render: "四种分组外观。", layout: "纵向展示。", interaction: "item 保持按钮能力。", performance: "仅角色子项消费变体。", responsive: "跟随容器。" },
        logic: ["Variant", "Contract"],
    },
];
