/**
 * Morph.test.ts
 * SVG 路径变形动效测试用例
 * v1.2.0
 */
export const examples = [
    {
        name: "M1: 基础形状变形 (Shape Morph)",
        code: `<script lang="ts">
    let isDiamond = $state(false);
    const square = "M4 4 L20 4 L20 20 L4 20 Z";
    const diamond = "M12 2 L22 12 L12 22 L2 12 Z";
</script>

<div class="flex-col items-center gap-20">
    <Icon 
        d={isDiamond ? diamond : square} 
        morph 
        size={80} 
        color="var(--primary)" 
    />
    <Button onclick={() => isDiamond = !isDiamond}>
        切换形状
    </Button>
</div>`,

        logic: ["SVG", "Morph"],
    },
    {
        name: "M2: 状态图标变形 (State Morph)",
        code: `<script lang="ts">
    let isPlay = $state(true);
    const play = "M5 3 L19 12 L5 21 Z";
    const pause = "M6 4 L10 4 L10 20 L6 20 Z M14 4 L18 4 L18 20 L14 20 Z";
</script>

<div class="flex-col items-center gap-20">
    <div class="p-20 bg-black-4 rounded-full">
        <Icon 
            d={isPlay ? play : pause} 
            morph 
            size={40} 
            color="var(--black-100)" 
        />
    </div>
    <Button variant="outline" onclick={() => isPlay = !isPlay}>
        {isPlay ? "暂停" : "播放"}
    </Button>
</div>`,

        logic: ["SVG", "Morph"],
    },
] as const;
