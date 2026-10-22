/**
 * Field.test.ts
 * v1.4.0
 * 变更记录 (2026-07-05): F-04 增加 Field 内置 error，验证双 segment 后方的整行错误提示。
 * 变更记录 (2026-03-30): 将 Field-Demo 的 F-01 ~ F-05 全量迁入 test 项目，后续字段组合与 Figma 样式微调统一在 test 中验证。
 * 变更记录 (2026-03-16): 新增 `Field row / column` 根节点简写示例，覆盖无需额外 `Frame` 的整块横向/竖向组合。
 * 变更记录 (2026-03-16): 新增 `col` 局部容器示例，覆盖字段内部竖向分组与嵌套 row 组合。
 * 变更记录 (2026-03-16): 移除 `control="date-picker"` 示例，复杂日期结构统一改为局部容器内的 `as="trailing"` 自动识别。
 * 变更记录 (2026-03-15): 新增日期输入自定义 trailing 触发器示例，覆盖简单自动推断与复杂局部容器结构。
 * 变更记录 (2026-03-15): 新增 Field 组合示例，覆盖 label/error、行组合、Select 默认箭头与分段字段。
 */
export const examples = [
    {
        name: "F-01：基础输入容器",
        code: `F-01
<Field style="width: 20rem;">
    <Input placeholder="请输入内容" />
</Field>`,
        logic: ["Basic"],
    },
    {
        name: "F-02：标签 + 错误态",
        code: `F-02
<Field
    label="Email"
    error="请输入有效邮箱。"
    column
    invalid
    gap={1}
    style="width: 12.5rem;"
>
    <Input
        type="email"
        placeholder="name@example.com"
        invalid
    />
</Field>`,
        logic: ["Label", "Error"],
    },
    {
        name: "F-03：Select 默认箭头",
        code: `F-03
<Field label="Country" column gap={1} style="width: 22.5rem;">
    <Select
        placeholder="选择状态"
        options={[
            { value: "todo", label: "待处理" },
            { value: "doing", label: "处理中" },
            { value: "done", label: "已完成" }
        ]}
      parts={{ Listbox: { search: true } }}
    />
</Field>`,
        logic: ["Field", "Select"],
    },
    {
        name: "F-04：双输入并排",
        code: `F-04
<Field
    row
    invalid
    error="请完整填写两项内容。"
    style="width: 22.5rem;"
>
    <Input as="segment" placeholder="Text" />
    <Input as="segment" placeholder="Text" />
</Field>`,
        logic: ["Row", "Segmented", "BuiltInError"],
    },
    {
        name: "F-05：多行字段",
        code: `F-05
<Field column style="width: 22.5rem;">
    <Text as="label">Notes</Text>
    <Textarea rows={5} maxlength={200} footer="0/200" placeholder="Text" />
</Field>`,
        logic: ["Textarea", "Counter"],
    },
    {
        name: "F-06：独立 Input 错误态",
        code: `F-06
<Field invalid style="width: 7.5rem;">
    <Input value="Text" invalid />
</Field>`,
        logic: ["Error"],
    },
    {
        name: "F-07：完整 Field 错误组合",
        code: `F-07
<Field invalid column gap={1} style="width: 12.5rem;">
    <Text as="label">Title</Text>
    <Input value="Input fields" invalid />
    <Text as="error">Error messages.</Text>
</Field>`,
        logic: ["Label", "Error"],
    },
    {
        name: "F-08：连续字段与内部内容行所有权",
        code: `F-08
<Field row style="width: 24rem; max-width: 100%;">
    <Input as="segment" gap={0} aria-label="First entry" value="First entry">
        <Icon as="leading" icon={Resource.Check} />
    </Input>
    <Input as="segment" gap={0} aria-label="Second entry" value="Second entry">
        <Icon as="leading" icon={Resource.Check} />
    </Input>
</Field>`,
        expected: {render: "连续字段表面没有结构间距，两个字段各自保留至少 4 CSS px 的图文间距。"},
        logic: ["ContentLine", "Narrow", "Ownership"],
    },
] as const;
