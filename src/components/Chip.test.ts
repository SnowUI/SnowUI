/**
 * Chip.test.ts
 * v1.1.0
 *
 * 测试覆盖：Chip.md 定义的所有功能点
 */
export const examples = [
    {
        name: "C3: 单行图文最小间距",
        code: `C3
<Frame column style="width: 140px;">
    <Chip><Text lines={1}>Classification label 分类名称</Text></Chip>
    <Chip variant="background" showDot><Text lines={1}>Status label 状态名称</Text></Chip>
</Frame>`,
        expected: { layout: "Dot与文字至少4px；缩小根字号也不贴合；附件不压缩。" },
    },
    // === A: 基础形态（尺寸全覆盖） ===
    {
        name: "A1: 默认形态 — 尺寸全覆盖",
        code: `A1
<div class="flex-col gap-8">
    <div class="flex-row gap-8 items-center">
        <Chip>Label</Chip>
        <Chip class="text-purple">Purple</Chip>
        <Chip class="text-indigo">Indigo</Chip>
        <Chip class="text-blue">Blue</Chip>
        <Chip class="text-green">Green</Chip>
        <Chip class="text-orange">Orange</Chip>
        <Chip class="text-red">Red</Chip>
      <Chip class="text-black-40">Gray</Chip>
    </div>
    <div class="flex-row gap-8 items-center">
        <Chip size="lg">Label</Chip>
        <Chip size="lg" class="text-purple">Purple</Chip>
        <Chip size="lg" class="text-indigo">Indigo</Chip>
        <Chip size="lg" class="text-blue">Blue</Chip>
        <Chip size="lg" class="text-green">Green</Chip>
        <Chip size="lg" class="text-orange">Orange</Chip>
        <Chip size="lg" class="text-red">Red</Chip>
      <Chip size="lg" class="text-black-40">Gray</Chip>
    </div>
</div>`,
        logic: ["default", "size-sm", "size-lg"],
    },
    // === B: background 变体 ===
    {
        name: "B1: background + sm",
        code: `B1
<div class="flex-row gap-8 items-center">
    <Chip variant="background">Label</Chip>
    <Chip variant="background" class="text-purple">Purple</Chip>
    <Chip variant="background" class="text-indigo">Indigo</Chip>
    <Chip variant="background" class="text-blue">Blue</Chip>
    <Chip variant="background" class="text-green">Green</Chip>
    <Chip variant="background" class="text-orange">Orange</Chip>
    <Chip variant="background" class="text-red">Red</Chip>
    <Chip variant="background" class="text-black-40">Gray</Chip>
</div>`,
        logic: ["background", "size-sm"],
    },
    {
        name: "B2: background + lg",
        code: `B2
<div class="flex-row gap-8 items-center">
    <Chip variant="background" size="lg">Label</Chip>
    <Chip variant="background" size="lg" class="text-purple">Purple</Chip>
    <Chip variant="background" size="lg" class="text-blue">Blue</Chip>
    <Chip variant="background" size="lg" class="text-green">Green</Chip>
    <Chip variant="background" size="lg" class="text-red">Red</Chip>
</div>`,
        logic: ["background", "size-lg"],
    },
    {
        name: "B3: background Dot 开关",
        code: `B3
<div class="flex-row gap-8 items-center">
    <Chip variant="background">No dot</Chip>
    <Chip variant="background" showDot>With dot</Chip>
    <Chip variant="background" size="lg" showDot>With dot lg</Chip>
</div>`,
        logic: ["background", "show-dot"],
    },
    // === C: 槽位替换 ===
    {
        name: "C1: 替换 leading 图标",
        code: `C1
<div class="flex-row gap-8 items-center">
    <Chip>
        <Icon as="leading"><Star /></Icon>
        Featured
    </Chip>
    <Chip variant="background" class="text-green">
        <Icon as="leading"><Resource.CheckCircle /></Icon>
        Success
    </Chip>
</div>`,
        logic: ["leading-replace"],
    },
    {
        name: "C2: 添加 trailing 图标",
        code: `C2
<div class="flex-row gap-8 items-center">
    <Chip variant="background">
        Filter
        <Icon as="trailing"><Resource.X /></Icon>
    </Chip>
    <Chip variant="background" size="lg" class="text-blue">
        Active
        <Icon as="trailing"><Resource.X /></Icon>
    </Chip>
</div>`,
        logic: ["trailing"],
    },
    // === D: 颜色继承 ===
    {
        name: "D1: 颜色继承父容器",
        code: `D1
<div class="flex-row gap-8 items-center text-orange">
    <Chip>Inherited</Chip>
    <Chip variant="background">Inherited bg</Chip>
    <Chip size="lg">Inherited lg</Chip>
    <Chip variant="background" size="lg">Inherited bg lg</Chip>
</div>`,
        logic: ["color-inherit"],
    },
] as const;
