export const examples = [
    {
        name: "CL-01：默认可复制链接",
        code: `CL-01
<CopyLink href="https://snowui.dev/llms.txt" />`,
        expected: { render: "无边框表面；文字 hover 下划线、点击新标签页打开，其余区域复制完整地址，右侧图标居中。Tab 分别聚焦链接与复制按钮。" },
        logic: ["Link", "Copy", "Keyboard"],
    },
    {
        name: "CL-02：长地址与窄容器",
        code: `CL-02
<CopyLink href="https://snowui.dev/components/quick-start?source=shared-documentation-and-design-system" style="width: 16rem;" />`,
        expected: { render: "长地址以省略号截断，与图标预留 gap-2（默认 8px），复制内容仍为完整地址，复制图标不被挤出。" },
        logic: ["Truncation", "Copy"],
    },
    {
        name: "CL-03：禁用",
        code: `CL-03
<CopyLink href="https://snowui.dev/llms.txt" disabled />`,
        logic: ["Disabled"],
    },
    {
        name: "CL-04：子组件配置与复制失败",
        code: `CL-04
<CopyLink href="https://snowui.dev/llms.txt" parts={{ Link: { underline: "always" }, CopyButton: { ariaLabel: "复制文档地址", writeText: async () => { throw new Error("复制失败示例"); } } }} />`,
        logic: ["Parts", "Error"],
    },
] as const;
