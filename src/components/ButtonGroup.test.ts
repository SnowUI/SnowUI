export const examples = [
    {
        name: "BG-01:内置分割线",
        code: `BG-01
<ButtonGroup size="sm">
    <Button as="item">复制</Button>
    <Button as="item">更多</Button>
</ButtonGroup>`,
        expected: { render: "item 形成统一分组外壳，相邻 item 默认显示内置分割线。", layout: "根不输出 data-auto-layout，computed gap 为 0；分割线不占布局。", interaction: "按钮各自处理点击，hover 覆盖完整单元格并连续到分割线边界。", performance: "分割线为纯 CSS 装饰层，不新增 DOM。", responsive: "跟随容器。" },
        logic: ["Contract", "GroupCell", "BuiltInSeparator"],
    },
    {
        name: "BG-02:尺寸与变体 Context",
        code: `BG-02
<ButtonGroup size="md" variant="outline">
    <Button as="item"><Icon><Paperclip /></Icon>附件</Button>
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
    <ButtonGroup variant="gray"><Button as="item">Gray</Button><Button as="item">Gray</Button></ButtonGroup>
    <ButtonGroup variant="filled"><Button as="item">Filled</Button><Button as="item">Filled</Button></ButtonGroup>
    <ButtonGroup variant="outline"><Button as="item">Outline</Button><Button as="item">Outline</Button></ButtonGroup>
    <ButtonGroup variant="borderless"><Button as="item">Borderless</Button><Button as="item">Borderless</Button></ButtonGroup>
</Frame>`,
        expected: { render: "四种分组外观。", layout: "纵向展示。", interaction: "item 保持按钮能力。", performance: "仅角色子项消费变体。", responsive: "跟随容器。" },
        logic: ["Variant", "Contract"],
    },
    {
        name: "BG-06:关闭分割线",
        code: `BG-06
<ButtonGroup showSeparator={false}>
    <Button as="item">Previous</Button>
    <Button as="item">Next</Button>
</ButtonGroup>`,
        expected: { render: "相邻 item 之间不显示分割线。", layout: "关闭分割线不改变单元格 padding、gap 或外壳尺寸。", interaction: "两个 Button 仍独立交互。", performance: "关闭路径不创建装饰层、Observer 或事件。", responsive: "跟随容器。" },
        logic: ["ShowSeparator", "OptOut"],
    },
];
