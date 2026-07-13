/**
 * SplitText.test.ts
 * 文字拆分动效测试用例
 * v1.0.0
 */
export const examples = [
    {
        name: "S1: 基础字符拆分 (Basic Chars Split)",
        code: `<script lang="ts">
    let result = $state();
    
    const motion = initMotion();
    
    $effect(() => {
        if (result?.chars?.length) {
            motion.registerGroup("demo-text", result.chars, {
                orchestrateMode: "sequential",
                orchestrateDelay: 60,
                orchestrateOrder: "ltr",
                whileAppear: { opacity: [0, 1], y: [15, 0] },
            });
        }
    });
    
    function play() {
        motion.Reset("demo-text");
        setTimeout(() => motion.Play("demo-text"), 50);
    }
</script>

<div class="flex-col gap-16">
    <div class="p-16 bg-black-4 rounded-8">
        <SplitText text="Welcome to SnowUI" bind:result class="size-24 font-regular" />
    </div>
    <div class="flex gap-8">
        <Button onclick={play}>播放动效</Button>
        <Button variant="outline" onclick={() => motion.Reset("demo-text")}>重置</Button>
    </div>
</div>`,

        logic: ["SplitText", "Motion", "Stagger"],
    },
    {
        name: "S2: 单词拆分 (Words Split)",
        code: `<script lang="ts">
    let result = $state();
    
    const motion = initMotion();
    
    $effect(() => {
        if (result?.words?.length) {
            motion.registerGroup("words-demo", result.words, {
                orchestrateMode: "sequential",
                orchestrateDelay: 150,
                orchestrateOrder: "ltr",
                whileAppear: { opacity: [0, 1], scale: [0.8, 1] },
            });
        }
    });
    
    function play() {
        motion.Reset("words-demo");
        setTimeout(() => motion.Play("words-demo"), 50);
    }
</script>

<div class="flex-col gap-16">
    <div class="p-16 bg-black-4 rounded-8">
        <SplitText text="Design System Components" by="words" bind:result class="size-20" />
    </div>
    <Button onclick={play}>播放动效</Button>
</div>`,

        logic: ["SplitText", "Words", "Scale"],
    },
    {
        name: "S3: 从右到左 (RTL Order)",
        code: `<script lang="ts">
    let result = $state();
    
    const motion = initMotion();
    
    $effect(() => {
        if (result?.chars?.length) {
            motion.registerGroup("rtl-demo", result.chars, {
                orchestrateMode: "sequential",
                orchestrateDelay: 40,
                orchestrateOrder: "rtl",
                whileAppear: { opacity: [0, 1], x: [-10, 0] },
            });
        }
    });
    
    function play() {
        motion.Reset("rtl-demo");
        setTimeout(() => motion.Play("rtl-demo"), 50);
    }
</script>

<div class="flex-col gap-16">
    <div class="p-16 bg-black-4 rounded-8">
        <SplitText text="Reverse Animation" bind:result class="size-24 font-semibold" />
    </div>
    <Button onclick={play}>从右到左播放</Button>
</div>`,

        logic: ["SplitText", "RTL", "Order"],
    },
    {
        name: "S4: 从中心扩散 (Center Order)",
        code: `<script lang="ts">
    let result = $state();
    
    const motion = initMotion();
    
    $effect(() => {
        if (result?.chars?.length) {
            motion.registerGroup("center-demo", result.chars, {
                orchestrateMode: "sequential",
                orchestrateDelay: 50,
                orchestrateOrder: "center",
                whileAppear: { opacity: [0, 1], y: [20, 0] },
            });
        }
    });
    
    function play() {
        motion.Reset("center-demo");
        setTimeout(() => motion.Play("center-demo"), 50);
    }
</script>

<div class="flex-col gap-16">
    <div class="p-16 bg-black-4 rounded-8" style="text-align: center;">
        <SplitText text="CENTER" bind:result class="size-32 font-semibold" />
    </div>
    <Button onclick={play}>从中心扩散</Button>
</div>`,

        logic: ["SplitText", "Center", "Spread"],
    },
] as const;
