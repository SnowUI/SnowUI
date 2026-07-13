/**
 * Stagger.test.ts
 * 动画编排 (交错动画) 测试用例
 * v1.2.0
 */
export const examples = [
    {
        name: "S1: 列表交错出现 (Staggered List)",
        code: `<script lang="ts">
    let active = $state(false);
</script>

<div class="flex-col gap-20">
    <Button onclick={() => active = !active}>
        {active ? "重置" : "开始播放"}
    </Button>
    
    <Stack staggerChildren={0.1} variant={active ? "loading" : "idle"}>
        {#each [1, 2, 3, 4, 5] as i}
            <Text 
                variants={{ idle: { opacity: 0, x: -20 }, loading: { opacity: 1, x: 0 } }}
                style="transition: all 0.5s ease-out; transition-delay: var(--animation-delay); opacity: var(--opacity, 0); transform: translateX(var(--x, -20px));"
            >
                列表项 {i}
            </Text>
        {/each}
    </Stack>
</div>`,

        logic: ["Orchestration", "Stagger"],
    },
    {
        name: "S2: 图标组编排 (Staggered Icons)",
        code: `<script lang="ts">
    let show = $state(false);
</script>

<div class="flex-col gap-20 items-center">
    <Button variant="outline" onclick={() => show = !show}>
        切换图标组
    </Button>
    
    <Stack direction="row" gap={16} staggerChildren={0.05} variant={show ? "active" : "idle"}>
        {#each [1, 2, 3, 4, 5, 6] as i}
            <Icon 
                variants={{ idle: { scale: 0 }, active: { scale: 1 } }}
                size={32}
                color="var(--primary)"
                style="transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); transition-delay: var(--animation-delay); transform: scale(var(--scale, 0));"
            />
        {/each}
    </Stack>
</div>`,

        logic: ["Orchestration", "Icon"],
    },
] as const;
