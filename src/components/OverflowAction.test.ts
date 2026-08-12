export const examples = [
    {
        name: "OAI-01:专用显式子项",
        code: `OAI-01
<OverflowActions availableWidth={240}>
    <OverflowAction as="item" id="edit" label="编辑" icon="pencil-simple" variant="outline" />
</OverflowActions>`,
        expected: { render: "OverflowAction 渲染真实 outline Button。", layout: "透明测量外壳不占额外空间。", interaction: "可见按钮和菜单调用同一执行函数。", performance: "Context 只注册公开元数据和测量节点。", responsive: "父级可在 full、compact、hidden 间切换。" },
        logic: ["ExplicitChild", "ButtonHost", "Context"],
    },
] as const;
