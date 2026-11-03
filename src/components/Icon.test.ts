/**
 * Icon.test.ts
 * v2.1.3
 *
 * 变更记录 (2026-02-03):
 * - 示例1覆盖全部尺寸
 * - 示例2覆盖全部尺寸与图片地址
 * - 示例3覆盖全部尺寸与徽标组合
 */
export const examples = [
    {
        name: "1: 全部尺寸",
        code: `1
<Icon size={80} />
<Icon size={80}><Bell /></Icon>`,
        expected: { render: "空占位与外部图形各渲染一次；直接children在源码及运行包SSR／水合均不得递归。" },
    },
    {
        name: "2: 图片地址与尺寸",
        code: `2
<Icon src="/icon-12.svg" size={12} />
<Icon src="/icon-16.svg" size={16} />
<Icon src="/icon-20.svg" size={20} />
<Icon src="/icon-24.svg" size={24} />
<Icon src="/icon-28.svg" size={28} />
<Icon src="/icon-32.svg" size={32} />
<Icon src="/icon-40.svg" size={40} />
<Icon src="/icon-48.svg" size={48} />
<Icon src="/icon-80.svg" size={80} />`,
        expected: { render: "图片地址真实加载期间自动显示对应尺寸骨架，成功或失败后退出；skeleton=false 不显示占位。" },
    },
    {
        name: "3: 徽标组合与尺寸",
        code: `3
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
</div>`,
    },
    {
        name: "4: 角色组合",
        code: `4
<Avatar size={40}>
    <Icon as="badge" background>
        <Check />
    </Icon>
</Avatar>
<Frame as="item">
    <Icon size={24}>
        <Heart />
    </Icon>
</Frame>`,
    },
] as const;
