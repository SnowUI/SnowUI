/**
 * AvatarGroup.test.ts
 * v1.1.3
 *
 * 变更记录 (2026-02-03):
 * - 新增 max 溢出计数示例与组合示例
 */
export const examples = [
    {
        name: "1: 线性排列",
        code: `1
<AvatarGroup layout="row" size={24}>
    <Avatar as="item" src={AvatarByewind} />
    <Avatar as="item" src={AvatarByewind} />
    <Avatar as="item" />
    <Avatar as="item" />
    <Avatar as="item" />
</AvatarGroup>`,
    },
    {
        name: "2: 圆形堆叠",
        code: `2
<AvatarGroup layout="stack" size={80} max={3}>
    <Avatar as="item" src={AvatarByewind} />
    <Avatar as="item" src={AvatarByewind} />
    <Avatar as="item" />
    <Avatar as="item" />
</AvatarGroup>`,
    },
    {
        name: "3: 组合与 as",
        code: `3
<AvatarGroup as="section">
    <Avatar as="item" src={AvatarByewind} size={24} />
    <Icon>
        <Heart />
    </Icon>
    <Avatar as="item" size={32} />
</AvatarGroup>`,
    },

    {
        name: "Custom 20-49-56",
        code: `<section class=" flex flex-col items-center p-40 gap-16 justify-center">
    <div class="inset-black">
        <AvatarGroup size={48}>
            <Avatar as="item" src={AvatarByewind} />
            <Avatar as="item" src={AvatarByewind} />
            <Avatar as="item" src={AvatarByewind} />
            <Avatar as="item" aria-label="A" />
            <Avatar as="item" />
            <Button as="item" variant="gray" size="lg" class="rounded-full"
                ><FourLeafClover /></Button
            >
        </AvatarGroup>
    </div>

    <AvatarGroup size={80} max={4}>
        <Avatar as="item" src={AvatarByewind} />
        <Avatar as="item" src={AvatarByewind} />
        <Avatar as="item" src={AvatarByewind} />
        <Avatar as="item" aria-label="A" />
        <Avatar as="item" />
    </AvatarGroup>
    <AvatarGroup size={48}>
        <Avatar as="item" src={AvatarByewind} />
        <Avatar as="item" src={AvatarByewind} />
        <Avatar as="item" src={AvatarByewind} />
        <Avatar as="item" aria-label="B" />
        <Avatar as="item" />
    </AvatarGroup>
    <AvatarGroup size={40}>
        <Avatar as="item" src={AvatarByewind} />
        <Avatar as="item" src={AvatarByewind} />
        <Avatar as="item" src={AvatarByewind} />
        <Avatar as="item" aria-label="C" />
        <Avatar as="item" />
    </AvatarGroup>
    <AvatarGroup size={32}>
        <Avatar as="item" src={AvatarByewind} />
        <Avatar as="item" src={AvatarByewind} />
        <Avatar as="item" src={AvatarByewind} />
        <Avatar as="item" aria-label="D" />
        <Avatar as="item" />
    </AvatarGroup>
    <AvatarGroup size={28}>
        <Avatar as="item" src={AvatarByewind} />
        <Avatar as="item" src={AvatarByewind} />
        <Avatar as="item" src={AvatarByewind} />
        <Avatar as="item" aria-label="E" />
        <Avatar as="item" />
    </AvatarGroup>
    <AvatarGroup size={24}>
        <Avatar as="item" src={AvatarByewind} />
        <Avatar as="item" src={AvatarByewind} />
        <Avatar as="item" src={AvatarByewind} />
        <Avatar as="item" aria-label="F" />
        <Avatar as="item" />
    </AvatarGroup>
    <AvatarGroup size={20}>
        <Avatar as="item" src={AvatarByewind} />
        <Avatar as="item" src={AvatarByewind} />
        <Avatar as="item" src={AvatarByewind} />
        <Avatar as="item" aria-label="G" />
        <Avatar as="item" />
    </AvatarGroup>
    <AvatarGroup size={16}>
        <Avatar as="item" src={AvatarByewind} />
        <Avatar as="item" src={AvatarByewind} />
        <Avatar as="item" src={AvatarByewind} />
        <Avatar as="item" aria-label="H" />
        <Avatar as="item" />
    </AvatarGroup>
    <AvatarGroup size={12}>
        <Avatar as="item" src={AvatarByewind} />
        <Avatar as="item" src={AvatarByewind} />
        <Avatar as="item" src={AvatarByewind} />
        <Avatar as="item" aria-label="H" />
        <Avatar as="item" />
    </AvatarGroup>
</section>`,
        logic: ["UserCreated"],
    },
    {
        name: "Custom 22-30-35",
        code: `<div class="flex flex-col gap-16 items-center">
        {#each [80, 48, 40, 32, 28, 24, 20, 16, 12] as s}
            <div class="flex gap-8 flex-row">
                {#each [2, 3, 4] as m}
                    <AvatarGroup layout="stack" size={s} max={m}>
                        <Avatar as="item" src={AvatarByewind} />
                        <Avatar as="item" src={AvatarByewind} />
                        <Avatar as="item" src={AvatarByewind} />
                        <Avatar as="item" src={AvatarByewind} />
                        <Avatar as="item" src={AvatarByewind} />
                    </AvatarGroup>
                {/each}
            </div>
        {/each}
    </div>`,
        logic: ["UserCreated"],
    },
] as const;
