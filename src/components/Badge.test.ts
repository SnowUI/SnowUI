/**
 * Badge.test.ts
 * v1.3.2
 * 
 * 测试覆盖：Badge.md 定义的所有功能点
 */
export const examples = [
    // === A: 基础功能 ===
    {
        name: "A1: 基础计数 (Count)",
        code: `A1
<div class="flex-row gap-8">
    <Badge count={5} />
    <Badge count={10} />
    <Badge count="New" />
</div>`,

        expected: {
            render: "数字和文本标签均在 Badge surface 中水平、垂直居中。",
        },
        logic: ["Count", "CenteredContent"],
    },
    {
        name: "A2: 最大值限制 (Max)",
        code: `A2
<div class="flex-row gap-8">
    <Badge count={99} max={99} />
    <Badge count={100} max={99} />
    <Badge count={999} max={99} />
</div>`,

        logic: ["Max"],
    },
    {
        name: "A3: 点模式 (Dot)",
        code: `A3
<Badge dot />
<Badge />`,

        logic: ["Dot"],
    },
    {
        name: "A4: 显示零值 (ShowZero)",
        code: `A4
<div class="flex-row gap-8">
    <Badge count={0} />
    <Badge count={0} showZero />
</div>`,

        logic: ["ShowZero"],
    },
    {
        name: "A5: 语意填充色 (Color)",
        code: `A5
<div class="flex-row gap-8 items-center">
    <Badge count={1} color="Blue" />
    <Badge count={2} color="Green" />
    <Badge count={3} color="Orange" />
    <Badge count={4} color="Red" />
    <Badge dot color="Purple" />
</div>`,

        expected: {
            render: "五个 Badge 分别使用 Blue、Green、Orange、Red、Purple 语意色作为填充色，数字文字保持白色。",
        },
        logic: ["Color", "SemanticColor", "Dot"],
    },
    {
        name: "A6: 描边状态标签 (Border)",
        code: `A6
<div class="flex-row gap-8 items-center">
    <Kbd>PRO</Kbd>
    <Badge count="PRO" variant="border" />
    <Badge count="updated" variant="border" />
</div>`,
        expected: {
            render: "Kbd 与两个 Badge 使用一致的 12/16px 排版、16px 可见高度、透明背景、内描边、继承文字色、0×4px padding 与 6px 圆角。",
        },
        logic: ["Variant", "Border", "Status"],
    },
    // === C: 组合模式 ===
    {
        name: "C1: 在 Icon 中作为徽标",
        code: `C1
<div class="flex-row gap-24">
    <Icon icon={Bell} size={32}>
        <Badge as="badge" count={5} />
    </Icon>
    <Icon icon={Bell} size={32}>
        <Badge as="badge" dot />
    </Icon>
</div>`,

        logic: ["Composition"],
    },
    {
        name: "C2: 在 Button 中作为徽标",
        code: `C2
<Button variant="outline">
    Messages
    <Badge as="badge" count={3} />
</Button>`,

        logic: ["Composition"],
    },
    {
        name: "D1: Button 点击触发徽标出入场",
        code: `D1
<Frame
    column
    Click={{ Idle: "Active", Active: "Idle" }}
    class="gap-24 items-center"
    style="pointer-events: none;"
>
    <Icon size={48}>
        <Badge as="badge" stateCount={{ Idle: 0, Active: 1 }} />
        <Bell />
    </Icon>

    <Button
        variant="gray"
        size="lg"
        whileClick={false}
        style="pointer-events: auto;"
    >
        Button
    </Button>
</Frame>`,

        expected: {
            render: "默认只显示 Bell 图标和 Button 按钮文案，徽标隐藏。",
            interaction:
                "点击独立 Button 后 Frame 切换 Active，Icon 中的 Badge 从左下锚点弹出；再次点击后 Badge 从中心缩小退场并隐藏。",
        },
        logic: ["Motion", "Composition", "State"],
    },

    {
        name: "Custom 22-14-21",
        code: `<section class=" flex flex-col items-center p-40 gap-16">
    <div class="flex gap-8 flex-row items-center">
        <Badge count={100} max={99} />
        <Badge count={99} />
        <Badge count={1} />
        <Badge count={0} showZero />
        <Badge count="New" />
        <Badge />
    </div>
    <div class="flex gap-8 flex-row items-center">
        <Icon size={80} background>
            <Badge as="badge" />
            <Bell />
        </Icon>
        <Icon size={48} background>
            <Badge as="badge" />
            <Bell />
        </Icon>
        <Icon size={40} background>
            <Badge as="badge" />
            <Bell />
        </Icon>
        <Icon size={32} background>
            <Badge as="badge" />
            <Bell />
        </Icon>
        <Icon size={24} background>
            <Badge as="badge" />
            <Bell />
        </Icon>
        <Icon size={20} background>
            <Badge as="badge" />
            <Bell />
        </Icon>
        <Icon size={16} background>
            <Badge as="badge" />
            <Bell />
        </Icon>
        <Icon size={12} background>
            <Badge as="badge" />
            <Bell />
        </Icon>
    </div>
    <div class="flex gap-8 flex-row items-center">
        <Icon size={80}>
            <Badge as="badge" />
            <Bell />
        </Icon>
        <Icon size={48}>
            <Badge as="badge" />
            <Bell />
        </Icon>
        <Icon size={40}>
            <Badge as="badge" />
            <Bell />
        </Icon>
        <Icon size={32}>
            <Badge as="badge" />
            <Bell />
        </Icon>
        <Icon size={24}>
            <Badge as="badge" />
            <Bell />
        </Icon>
        <Icon size={20}>
            <Badge as="badge" />
            <Bell />
        </Icon>
        <Icon size={16}>
            <Badge as="badge" />
            <Bell />
        </Icon>
        <Icon size={12}>
            <Badge as="badge" />
            <Bell />
        </Icon>
    </div>
    <div class="flex gap-8 flex-row items-center">
        <Icon size={80}>
            <Badge as="badge" count={99} />
            <Bell />
        </Icon>
        <Icon size={48}>
            <Badge as="badge" count={99} />
            <Bell />
        </Icon>
        <Icon size={40}>
            <Badge as="badge" count={99} />
            <Bell />
        </Icon>
        <Icon size={32}>
            <Badge as="badge" count={99} />
            <Bell />
        </Icon>
        <Icon size={24}>
            <Badge as="badge" count={99} />
            <Bell />
        </Icon>
        <Icon size={20}>
            <Badge as="badge" count={99} />
            <Bell />
        </Icon>
        <Icon size={16}>
            <Badge as="badge" count={99} />
            <Bell />
        </Icon>
        <Icon size={12}>
            <Badge as="badge" count={99} />
            <Bell />
        </Icon>
    </div>

    <div class="flex gap-8 flex-row items-center">
        <Icon size={80} background badgePosition="bottom">
            <Badge as="badge" />
            <Bell />
        </Icon>
        <Icon size={48} background badgePosition="bottom">
            <Badge as="badge" />
            <Bell />
        </Icon>
        <Icon size={40} background badgePosition="bottom">
            <Badge as="badge" />
            <Bell />
        </Icon>
        <Icon size={32} background badgePosition="bottom">
            <Badge as="badge" />
            <Bell />
        </Icon>
        <Icon size={24} background badgePosition="bottom">
            <Badge as="badge" />
            <Bell />
        </Icon>
        <Icon size={20} background badgePosition="bottom">
            <Badge as="badge" />
            <Bell />
        </Icon>
        <Icon size={16} background badgePosition="bottom">
            <Badge as="badge" />
            <Bell />
        </Icon>
        <Icon size={12} background badgePosition="bottom">
            <Badge as="badge" />
            <Bell />
        </Icon>
    </div>
    <div class="flex gap-8 flex-row items-center">
        <Icon size={80} badgePosition="bottom">
            <Badge as="badge" />
            <Bell />
        </Icon>
        <Icon size={48} badgePosition="bottom">
            <Badge as="badge" />
            <Bell />
        </Icon>
        <Icon size={40} badgePosition="bottom">
            <Badge as="badge" />
            <Bell />
        </Icon>
        <Icon size={32} badgePosition="bottom">
            <Badge as="badge" />
            <Bell />
        </Icon>
        <Icon size={24} badgePosition="bottom">
            <Badge as="badge" />
            <Bell />
        </Icon>
        <Icon size={20} badgePosition="bottom">
            <Badge as="badge" />
            <Bell />
        </Icon>
        <Icon size={16} badgePosition="bottom">
            <Badge as="badge" />
            <Bell />
        </Icon>
        <Icon size={12} badgePosition="bottom">
            <Badge as="badge" />
            <Bell />
        </Icon>
    </div>
    <div class="flex gap-8 flex-row items-center">
        <Icon size={80} badgePosition="bottom">
            <Badge as="badge" count={99} />
            <Bell />
        </Icon>
        <Icon size={48} badgePosition="bottom">
            <Badge as="badge" count={99} />
            <Bell />
        </Icon>
        <Icon size={40} badgePosition="bottom">
            <Badge as="badge" count={99} />
            <Bell />
        </Icon>
        <Icon size={32} badgePosition="bottom">
            <Badge as="badge" count={99} />
            <Bell />
        </Icon>
        <Icon size={24} badgePosition="bottom">
            <Badge as="badge" count={99} />
            <Bell />
        </Icon>
        <Icon size={20} badgePosition="bottom">
            <Badge as="badge" count={99} />
            <Bell />
        </Icon>
        <Icon size={16} badgePosition="bottom">
            <Badge as="badge" count={99} />
            <Bell />
        </Icon>
        <Icon size={12} badgePosition="bottom">
            <Badge as="badge" count={99} />
            <Bell />
        </Icon>
    </div>
</section>`,
        logic: ["UserCreated"],
    },] as const;
