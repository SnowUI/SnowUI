export const examples = [
    {
        name: "IP-01：默认回退",
        code: `IP-01
<IconProvider>
    <CopyButton text="SnowUI" />
</IconProvider>`,
        expected: {
            render: "未提供外部映射时，CopyButton 正常显示 Components 内置 copy 图标。",
            layout: "Provider 不产生额外 DOM 或布局盒。",
            interaction: "复制行为、成功状态与 aria-label 不受 Provider 影响。",
            performance: "只进行 Context 解析，不注册 Observer、listener 或 timer。",
            responsive: "图标继续跟随组件公开尺寸。",
        },
        logic: ["IconProvider", "BuiltInFallback", "CopyButton"],
    },
    {
        name: "IP-02：应用级替换与缺失回退",
        code: `IP-02
<IconProvider icons={{ copy: XCircle }}>
    <CopyButton text="SnowUI" />
    <ExpandButton />
</IconProvider>`,
        expected: {
            render: "CopyButton 的 copy 图标由 XCircle 替换；未映射的 ExpandButton 仍显示 Components 内置展开图标。",
            layout: "外部图标继续接收组件计算后的尺寸和 currentColor。",
            interaction: "两个按钮各自交互不变。",
            performance: "Provider 只解析当前渲染的语义图标。",
            responsive: "组件尺寸变化继续传给替换图标。",
        },
        logic: ["IconProvider", "ExternalMap", "MissingFallback"],
    },
    {
        name: "IP-03：resource-svelte 可选适配",
        code: `IP-03
<IconProvider resolver={createSnowUIComponentIconResolver({ collection: "phosphor", fallbackCollections: ["snowui"] })}>
    <CopyButton text="SnowUI" />
    <ColorSchemeButton />
</IconProvider>`,
        expected: {
            render: "组件内置图标统一使用 phosphor collection，缺失语义再按显式 snowui fallback；移除 Provider 后恢复 Components 默认集合。",
            layout: "切库不改变 Button 和图标尺寸。",
            interaction: "复制与颜色模式切换保持原行为。",
            performance: "resource-svelte 只作为当前应用显式安装的 resolver adapter。",
            responsive: "切库不改变响应布局。",
        },
        logic: ["IconProvider", "ResourceSvelteAdapter", "LibrarySwitch"],
    },
] as const;
