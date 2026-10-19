
export const examples = [
    {
        name: "1: 基础用法 (Circle)",
        code: `1
<Spinner />`,
        expected: {
            render: "Render a default circle spinner (16px, current color)",
            layout: "Inline-flex",
            interaction: "None",
            performance: "CSS Conic Gradient + SVG mask animation",
            responsive: "Fixed size"
        },
        logic: ["variant", "size"]
    },
    {
        name: "2: 变体 (Variants)",
        code: `2
<div class="flex gap-4 items-center">
    <Spinner variant="circle" size={80} />
    <Spinner variant="spokes" size={80} />
    <Spinner variant="pills" size={80} />
</div>`,
        expected: {
            render: "Three different spinner styles",
            layout: "Flex row",
            interaction: "None",
            performance: "CSS opacity animation for spokes/pills",
            responsive: "None"
        },
        logic: ["variant"]
    },
    {
        name: "3: 尺寸 (Sizes)",
        code: `3
<Spinner speed={0.5} size={12} />
<Spinner speed={0.5} size={16} />
<Spinner speed={0.5} size={20} />
<Spinner speed={0.5} size={24} />
<Spinner speed={0.5} size={28} />
<Spinner speed={0.5} size={32} />
<Spinner speed={0.5} size={40} />
<Spinner speed={0.5} size={48} />
<Spinner speed={0.5} size={80} />`,
        expected: {
            render: "Spinners of increasing sizes",
            layout: "Flex row",
            interaction: "None",
            performance: "None",
            responsive: "None"
        },
        logic: ["size"]
    },
    {
        name: "4: 颜色 (Colors)",
        code: `4
<div class="flex gap-4 items-center">
    <Spinner class="text-blue" />
    <Spinner variant="spokes" class="text-green" />
    <Spinner variant="pills" class="text-red" />
</div>`,
        expected: {
            render: "Spinners inheriting text color",
            layout: "Flex row",
            interaction: "None",
            performance: "None",
            responsive: "None"
        },
        logic: ["class"]
    },
    {
        name: "5: 速度 (Speed)",
        code: `5
<div class="flex gap-4 items-center">
    <Spinner speed={0.5} />
    <Spinner speed={1} />
    <Spinner speed={2} />
</div>`,
        expected: {
            render: "Spinners with slow, normal, and fast animations",
            layout: "Flex row",
            interaction: "None",
            performance: "Different animation durations",
            responsive: "None"
        },
        logic: ["speed"]
    },
    {
        name: "默认与英文内置名称",
        code: `<Frame column gap={16}>
<Spinner />
<LocaleProvider locale="en-US"><Spinner /></LocaleProvider>
</Frame>`,
        expected: {
            accessibility: "默认简中加载中；英文Loading，显式业务文案保持原样",
            interaction: "内置名称随Provider语言／messages变化，原操作与状态保持",
        },
        logic: ["Locale.DefaultNames"],
    },
] as const;
