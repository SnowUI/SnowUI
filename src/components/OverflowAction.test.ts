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
    {
        name: "OAI-02:专用状态按钮与从左侧收纳",
        code: `OAI-02
<div style="width: 180px;">
    <OverflowActions compact="none" overflow="progressive" overflowFrom="start" moreLabel="More actions" buttonProps={{ variant: 'borderless', size: 'sm' }} style="width: 100%; justify-content: flex-end;">
        <OverflowAction as="item" id="theme" label="Switch theme" icon="moon" onclick={(event) => { if (!event) { if (document.documentElement.getAttribute('theme') === 'dark') document.documentElement.removeAttribute('theme'); else document.documentElement.setAttribute('theme', 'dark'); } }}>
            {#snippet control(run, disabled)}
                <ColorSchemeButton variant="borderless" size="sm" {disabled} onclick={run} />
            {/snippet}
        </OverflowAction>
        <OverflowAction as="item" id="docs" label="Docs" icon="book-open" iconOnly href="/components" />
        <OverflowAction as="item" id="github" label="GitHub" icon="github-logo" iconOnly href="https://github.com/SnowUI" target="_blank" rel="noreferrer" />
    </OverflowActions>
</div>`,
        expected: { render: "状态按钮仅挂载一份真实 ColorSchemeButton；其余 Icon-only Action 与 More 沿用组级样式。", layout: "180px 容器内从左侧逐项收纳，保留原顺序。", interaction: "可见按钮使用原生主题切换；More 中的主题操作通过公开 document theme 契约切换；外链新窗口保持 noreferrer。", performance: "control 直接测量可见控件，不创建第二份状态控件。", responsive: "缩窄与放宽时 More / action 可逆变化，键盘焦点可恢复。" },
        logic: ["ControlSnippet", "DocumentTheme", "ProgressiveStart", "IconOnly", "ExternalLink"],
    },
] as const;
