/**
 * InView.test.ts
 * 视口进入动效测试用例
 * v1.2.0
 */
export const examples = [
    {
        name: "V1: 基础进入动效 (Basic InView)",
        code: `<div class="flex-col gap-48 py-48">
    <Text>向下滚动查看动效...</Text>
    <div style="height: 400px;"></div>
    <Text 
        whileInView={{ opacity: 1, y: 0 }}
        style="opacity: 0; transform: translateY(20px); transition: all 0.6s ease-out;"
    >
        我进入视口了！
    </Text>
</div>`,

        logic: ["Viewport", "InView"],
    },
    {
        name: "V2: 触发比例 (View Amount)",
        code: `<div class="flex-col gap-48 py-48">
    <div style="height: 400px;"></div>
    <div class="p-40 bg-black-4 rounded-12 border-black-20" style="border-style: dashed;">
        <Button 
            whileInView={{ scale: 1.2 }}
            viewport={{ amount: 0.8 }}
            variant="filled"
            style="transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);"
        >
            需显示 80% 才触发
        </Button>
    </div>
</div>`,

        logic: ["Viewport", "Threshold"],
    },
    {
        name: "V3: 单次触发 (Once)",
        code: `<div class="flex-col gap-48 py-48">
    <div style="height: 400px;"></div>
    <Text 
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true }}
        style="transform: translateX(-50px); opacity: 0; transition: all 0.8s ease-out;"
    >
        我只动一次
    </Text>
</div>`,

        logic: ["Viewport", "Once"],
    },
] as const;
