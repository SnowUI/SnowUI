/**
 * Breadcrumb.test.ts
 * v1.0.0
 * 变更记录 (2026-05-25): 新增 Breadcrumb 容器组合式示例。
 */
export const examples = [
    {
        name: "A1: 默认路径",
        code: `A1
<Breadcrumb>
    <Button variant="borderless" as="item" href="/dashboards">Dashboards</Button>
    <Text as="separator">/</Text>
    <Button variant="borderless" as="item">Default</Button>
</Breadcrumb>`,
        expected: {
            render: "渲染 Dashboards / Default 面包屑，最后一个 item 为当前页。",
            layout: "根容器 inline-flex 横向排列，item 与 separator 间距为 4px，支持换行。",
            interaction: "Dashboards 默认 40% 透明度，hover 时恢复 100%；Default 不响应 hover 与点击。",
            performance: "仅观察直系子节点角色变化，无额外深层遍历。",
            responsive: "窄容器下按 row-gap 换行。",
        },
        logic: ["A1", "Current", "Composition"],
    },
    {
        name: "A2: 多级路径",
        code: `A2
<Breadcrumb>
    <Button as="item" href="/">Home</Button>
    <Text as="separator">/</Text>
    <Button as="item" href="/products">Products</Button>
    <Text as="separator">/</Text>
    <Button as="item" href="/products/components">Components</Button>
    <Text as="separator">/</Text>
    <Button as="item">Breadcrumb</Button>
</Breadcrumb>`,
        expected: {
            render: "渲染四级路径，separator 由使用方显式书写。",
            layout: "所有直系 item / separator 保持同一行视觉中心。",
            interaction: "前三项可点击，最后一项自动成为当前页。",
            performance: "当前项识别只基于最后一个 data-as=item。",
            responsive: "长路径允许换行。",
        },
        logic: ["Composition", "Separator"],
    },
    {
        name: "A3: 链接路径",
        code: `A3
<Breadcrumb>
    <Button as="item" href="/settings">Settings</Button>
    <Text as="separator">/</Text>
    <Button as="item" href="/settings/profile">Profile</Button>
    <Text as="separator">/</Text>
    <Button as="item" href="/settings/profile/security">Security</Button>
</Breadcrumb>`,
        expected: {
            render: "最后一个带 href 的 Button 仍被标记为当前页。",
            layout: "Button 保留自身默认变体和尺寸。",
            interaction: "前两项保留链接能力；最后一项不跳转。",
            performance: "不代理子级 href。",
            responsive: "保持内联外壳布局。",
        },
        logic: ["Link", "Current"],
    },
    {
        name: "A4: Breadcrumb 默认 Button 变体",
        code: `A4
<Breadcrumb variant="borderless">
    <Button as="item">默认按钮样式</Button>
    <Text as="separator">/</Text>
    <Button as="item" variant="outline">显式 Outline</Button>
    <Text as="separator">/</Text>
    <Button as="item">当前页</Button>
</Breadcrumb>`,
        expected: {
            render: "未写 variant 的 item 继承 Breadcrumb variant；显式 variant 的 Button 保持自己的变体。",
            layout: "Breadcrumb 只提供默认 Button 变体，不改变 Button 尺寸。",
            interaction: "非当前 item 使用各自 Button hover；当前 item 禁止 hover。",
            performance: "变体通过 Button 上下文解析，不由 Breadcrumb CSS 重写。",
            responsive: "继承变体与显式变体可混排。",
        },
        logic: ["Style", "Button"],
    },
    {
        name: "A5: 禁用项",
        code: `A5
<Breadcrumb>
    <Button as="item" href="/workspace">Workspace</Button>
    <Text as="separator">/</Text>
    <Button as="item" disabled>Archived</Button>
    <Text as="separator">/</Text>
    <Button as="item">Report</Button>
</Breadcrumb>`,
        expected: {
            render: "中间 disabled item 继承 Button disabled 视觉。",
            layout: "disabled item 仍参与路径排列。",
            interaction: "disabled item 不可点击；最后一项仍为当前页。",
            performance: "不为 disabled 单独创建路径逻辑。",
            responsive: "禁用状态下布局不跳动。",
        },
        logic: ["Disabled", "Current"],
    },
    {
        name: "A6: 长路径换行",
        code: `A6
<div style="width: 14rem;">
    <Breadcrumb>
        <Button as="item" href="/">Home</Button>
        <Text as="separator">/</Text>
        <Button as="item" href="/analytics">Analytics</Button>
        <Text as="separator">/</Text>
        <Button as="item" href="/analytics/dashboards">Dashboards</Button>
        <Text as="separator">/</Text>
        <Button as="item">Revenue Overview</Button>
    </Breadcrumb>
</div>`,
        expected: {
            render: "窄容器中路径自然换行。",
            layout: "换行行距为 Breadcrumb row-gap，列距为 column-gap。",
            interaction: "换行不改变当前项与 hover 规则。",
            performance: "仅使用 flex-wrap。",
            responsive: "容器宽度变化时自动重排。",
        },
        logic: ["Wrap", "Layout"],
    },
    {
        name: "A7: 当前项不可交互",
        code: `A7
<Breadcrumb>
    <Button as="item" href="/teams">Teams</Button>
    <Text as="separator">/</Text>
    <Button as="item" href="/teams/design" onclick={() => alert("不应触发")}>Design</Button>
</Breadcrumb>`,
        expected: {
            render: "最后一个 item 输出 aria-current=page。",
            layout: "当前 item opacity 为 100%。",
            interaction: "最后一个 item 不响应 hover、click、Enter、Space。",
            performance: "事件在 Breadcrumb / Button 当前态契约中被拦截。",
            responsive: "当前态不影响布局。",
        },
        logic: ["Current", "Accessibility"],
    },
    {
        name: "A8: items 默认内置模式",
        code: `A8
<Breadcrumb
    items={[
        { label: "Home", href: "/" },
        { label: "Library", href: "/library" },
        { label: "Current" }
    ]}
/>`,
        logic: ["BuiltInMode", "DefaultCompositionStyle", "Button", "Text"],
    },
] as const;
