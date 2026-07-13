export const examples = [
    {
        name: "LP-01：默认中文文案",
        code: `LP-01
<LocaleProvider>
    <SidePanel open editable />
</LocaleProvider>`,
        expected: {
            render: "后代 SidePanel 的固定工具栏文案使用默认 zh-CN catalog",
            layout: "Provider 不产生额外 DOM 或布局外壳",
            interaction: "Provider 只提供文案 Context，不改变 SidePanel 交互",
            performance: "locale 解析仅发生在后代组件读取内置文案时",
            responsive: "默认 locale 不影响面板响应式尺寸策略",
        },
        logic: ["LP-01"],
    },
    {
        name: "LP-02：局部文案覆盖",
        code: `LP-02
<LocaleProvider locale="en-US" messages={{ "sidePanel.save": "Apply" }}>
    <SidePanel open editable />
</LocaleProvider>`,
        expected: {
            render: "SidePanel 使用英文 catalog，保存按钮使用局部覆盖后的 Apply",
            layout: "Provider 不产生额外布局",
            interaction: "覆盖只影响当前 Provider 子树",
            performance: "未覆盖 key 继续读取内置英文 catalog",
            responsive: "文案覆盖不改变工具栏的响应式规则",
        },
        logic: ["LP-02"],
    },
] as const;
