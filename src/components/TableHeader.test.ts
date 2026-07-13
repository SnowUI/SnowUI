export const examples = [{ name: "A1: 表头", code: `A1
<Table><TableHeader><TableRow><TableHead columnId="name">名称</TableHead></TableRow></TableHeader></Table>`, expected: { render: "渲染 thead。", layout: "高 40px。", interaction: "无独立交互。", performance: "无额外观察器。", responsive: "跟随 Table。" }, logic: ["Header"] }];

