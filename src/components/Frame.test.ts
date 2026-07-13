/**
 * Frame.test.ts
 * v1.0.0
 * 变更记录 (2026-05-20): 改为显式 class 示例。
 * 变更记录 (2026-05-09): 补充 OSS Frame 基础示例，覆盖状态内容与 Skeleton 协议。
 */
export const examples = [
    {
        name: "F1: 显式类与布局",
        code: `F1
<Frame class="flex flex-col gap-8 p-16 rounded-12 bg-background-2">
    <Text class="text-14">普通 Frame</Text>
    <Frame class="p-12 rounded-8 bg-background-1 cursor-pointer">
        Interactive Frame
    </Frame>
</Frame>`,
        expected: {
            render: "Frame composition with explicit classes",
            layout: "Vertical container with nested interactive frame",
            interaction: "Pointer cursor comes from explicit class",
            responsive: "None",
        },
        logic: ["class", "children"],
    },
    {
        name: "F2: 状态内容",
        code: `F2
{#snippet idleContent()}
    Idle
{/snippet}
{#snippet activeContent()}
    Active
{/snippet}

<Frame
    class="p-16 rounded-12 bg-background-2 cursor-pointer"
    Click={{ Idle: "Active", Active: "Idle" }}
    stateContent={{ Idle: idleContent, Active: activeContent }}
>
    Idle
</Frame>`,
        expected: {
            render: "Frame switches rendered content by state",
            layout: "Single surface frame",
            interaction: "Click toggles Idle and Active",
            responsive: "None",
        },
        logic: ["Click", "stateContent"],
    },
    {
        name: "F3: Skeleton 协议",
        code: `F3
<Frame loading skeleton class="w-64">
    Loading content
</Frame>`,
        expected: {
            render: "Skeleton placeholder is rendered while loading",
            layout: "Single frame skeleton",
            interaction: "None",
            responsive: "None",
        },
        logic: ["loading", "skeleton"],
    },
    {
        name: "F4: 内容宽度策略",
        code: `F4
<Frame column class="gap-8">
    <Frame row contentHug class="gap-8 p-8 bg-background-2 rounded-8">
        <Text>Hug</Text>
        <Text>Content</Text>
    </Frame>
    <Frame row contentFill style="width: 18rem;" class="gap-8 p-8 bg-background-2 rounded-8">
        <Text>Fill</Text>
        <Text>Content</Text>
    </Frame>
</Frame>`,
        expected: {
            render: "Frame 支持 contentHug 与 contentFill。",
            layout: "contentHug 普通子项按内容收缩，contentFill 普通子项填满可用宽度。",
            interaction: "None",
            responsive: "固定宽度 Frame 内 contentFill 子项随容器分配宽度。",
        },
        logic: ["contentFill", "contentHug", "layout"],
    },
    {
        name: "F5: 单一 opacity 动效通道",
        code: `F5
<Frame
    Appear={["Idle", "auto"]}
    whileAppear={{ opacity: [0, 1] }}
    class="p-16 rounded-12 bg-background-2"
>
    只渐显，不继承默认 scale
</Frame>`,
        expected: {
            render: "Frame 从透明到不透明出现，尺寸始终保持不变。",
            layout: "单一 surface frame。",
            interaction: "显式 whileAppear 对象只执行 opacity，并继承默认进入时序。",
            responsive: "None",
        },
        logic: ["whileAppear", "opacity", "motionChannels"],
    },
    {
        name: "F6: 单一 scale 动效通道",
        code: `F6
<Frame
    Appear={["Idle", "auto"]}
    whileAppear={{ scale: [0.95, 1] }}
    class="p-16 rounded-12 bg-background-2"
>
    只缩放，不继承默认 opacity
</Frame>`,
        expected: {
            render: "Frame 从 0.95 缩放到 1，透明度始终保持不变。",
            layout: "单一 surface frame。",
            interaction: "显式 whileAppear 对象只执行 scale，并继承默认进入时序。",
            responsive: "None",
        },
        logic: ["whileAppear", "scale", "motionChannels"],
    },
] as const;
