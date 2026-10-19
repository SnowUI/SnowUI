/**
 * Tag.test.ts
 * v1.2.2
 *
 * 测试覆盖：Tag.md 定义的所有功能点
 */
export const examples = [
    // === A: 基础形态 ===
    {
        name: "A1: 默认形态（仅文字 / 含 leading / 含 trailing / 含 X / 组合）",
        code: `A1
<div class="flex-col gap-8">
    <div class="flex-row gap-8 items-center">
        <Tag>Label</Tag>
        <Tag>
            <Icon as="leading"><DotCircle Weight="fill" /></Icon>
            Label
        </Tag>
        <Tag>
            Label
            <Icon as="trailing"><Check /></Icon>
        </Tag>
        <Tag closable>Label</Tag>
        <Tag closable>
            <Icon as="leading"><DotCircle Weight="fill" /></Icon>
            Label
        </Tag>
        <Tag closable>
            <Icon as="leading"><DotCircle Weight="fill" /></Icon>
            Label
            <Icon as="trailing"><Check /></Icon>
        </Tag>
    </div>
    <div class="text-12 text-black-40">
        说明:边距按"靠近边的元素类型"自动调整 —— 文字距边 8px、Icon/X 距边 4px。组件通过 MutationObserver 检测真实首/末位节点（含文本节点），写入 data-edge-left / data-edge-right;closable 的 X 不计入末位检测，由 hover 状态另行收紧右 padding。
    </div>
</div>`,
        expected: {
            layout: "closable Tag 非 hover 时隐藏 X 不占位，与同内容非 closable Tag 等宽",
            interaction: "hover 时 X 展开为 12px，移出后完全收起",
        },
        logic: ["EdgePadding", "HiddenCloseNoLayoutSpace", "CloseHoverExpansion"],
    },

    // === B: 激活态 ===
    {
        name: "B1: 激活态 — 文字、Icon、X 统一渲染为 Brand；aria-pressed=true",
        code: `B1
<div class="flex-row gap-8 items-center">
    <Tag variant="active">Filtered</Tag>
    <Tag variant="active" closable>
        <Icon as="leading"><DotCircle Weight="fill" /></Icon>
        Filtered
    </Tag>
</div>`,
    },

    // === C: 箭头形状 ===
    {
        name: "C1: 路径片段（左 / 右箭头壳）",
        code: `C1
<div class="flex-row gap-8 items-center">
    <Tag shape="left-arrow">Settings</Tag>
    <Tag shape="right-arrow">Home</Tag>
    <Tag shape="right-arrow" closable>Filters</Tag>
</div>`,
    },

    // === D: 外部 gap 覆盖 ===
    {
        name: "D1: 外部 gap 覆盖 — 所有子元素间距同步变为 4px",
        code: `D1
<div class="flex-row gap-8 items-center">
    <Tag closable style="--snowui-tag-gap: 4px;">
        <Icon as="leading"><DotCircle Weight="fill" /></Icon>
        Label
    </Tag>
</div>`,
    },

    // === E: Toggle 与 aria ===
    {
        name: "E1: Toggle 写法 — aria-pressed 自动输出",
        code: `E1
<div class="flex-row gap-8 items-center">
    <Tag toggle>Toggle me</Tag>
    <Tag toggle closable>
        <Icon as="leading"><DotCircle Weight="fill" /></Icon>
        Filter
    </Tag>
    <Tag whileClick={false} Click={{ Idle: "Active", Active: "Idle" }}>
        Custom toggle
    </Tag>
</div>`,
    },
    {
        name: "默认与英文内置名称",
        code: `<Frame column gap={16}>
<Tag closable>Business tag</Tag>
<LocaleProvider locale="en-US"><Tag closable>Business tag</Tag></LocaleProvider>
</Frame>`,
        expected: {
            accessibility: "默认简中关闭标签；英文Close tag，显式业务文案保持原样",
            interaction: "内置名称随Provider语言／messages变化，原操作与状态保持",
        },
        logic: ["Locale.DefaultNames"],
    },
];
