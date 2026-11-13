/**
 * Skeleton.test.ts
 * v1.4.0
 * 变更记录 (2026-08-15): 新增 renderHints 自注册、radius 与父 Frame 首层探测示例；验证不依赖已知组件 class。
 * 变更记录 (2026-03-07): 新增“骨架渲染逻辑验证”示例，覆盖 Frame 第一层组件优先、Frame 回退文字骨架、Text 多段落骨架。
 */
export const examples = [
    {
        name: "G1：卡片与内容一起加载",
        code: `G1
<Frame column class="gap-16 w-full" Click={{ Idle: "Active", Active: "Idle" }}>
    {#snippet children({ currentState })}
    <Button>切换加载状态</Button>
    <Skeleton group loading={currentState !== "Active"} renderHints={{ radius: 20 }}>
        <Frame column class="bg-background-2 rounded-20 p-24 gap-16">
            <Text size={20}>项目概览</Text>
            <Input placeholder="加载时也保持挂载，输入不会丢失" />
            <Button variant="filled">查看项目</Button>
        </Frame>
    </Skeleton>
    {/snippet}
</Frame>`,
        logic: ["group", "loading", "mounted-content", "whole-surface"],
    },
    {
        name: "1: 基础排版骨架",
        code: `1
<Button loading skeleton>提交按钮</Button>
<Text loading skeleton>段落或标题文本占位</Text>
<FlowText value={100} loading skeleton />`,
        logic: ["loading", "skeleton", "Button", "Text", "FlowText"],
    },
    {
        name: "2: 图文展示骨架",
        code: `2
<Frame class="flex flex-col gap-16 p-16">
    <Icon loading skeleton size={24} />
    <Avatar aria-label="A" loading skeleton />
    <AvatarGroup loading skeleton size={16}>
        <Avatar as="item" aria-label="1" />
        <Avatar as="item" aria-label="2" />
        <Avatar as="item" aria-label="3" />
    </AvatarGroup>
    <Badge count={5} loading skeleton />
</Frame>`,
        logic: ["loading", "skeleton", "Icon", "Avatar", "AvatarGroup", "Badge"],
    },
    {
        name: "3: 表单控制骨架",
        code: `3
<Frame class="flex flex-col gap-16 p-16">
    <Checkbox loading skeleton>记住我</Checkbox>
    <Radio loading skeleton>接收通知</Radio>
    <Switch loading skeleton>开启功能</Switch>
</Frame>`,
        logic: ["loading", "skeleton", "Checkbox", "Radio", "Switch"],
    },
    {
        name: "4: 浮层与反馈骨架",
        code: `4
<Frame class="flex flex-col gap-16 p-16">
    <Spinner loading skeleton />
    <Tooltip open loading skeleton>帮助信息</Tooltip>
    <Popover open loading skeleton content="浮层详情">
        <Button>操作</Button>
    </Popover>
</Frame>`,
        logic: ["loading", "skeleton", "Spinner", "Tooltip", "Popover"],
    },
    {
        name: "5: 容器布局骨架",
        code: `5
<Frame class="flex flex-col gap-16 p-16">
    <Frame loading skeleton class="p-24 inset-black-10 rounded-16">
        <Text>内部子内容将被骨架占位替代，不会渲染</Text>
    </Frame>
</Frame>`,
        logic: ["loading", "skeleton", "Frame"],
    },
    {
        name: "6: 全组件骨架默认样式总览",
        code: `6
<Frame class="flex flex-col gap-16 p-24">
    <Frame class="flex items-center gap-16"><Frame class="w-80 text-12 text-black-40">Button</Frame><Button loading skeleton>按钮</Button></Frame>
    <Frame class="flex items-center gap-16"><Frame class="w-80 text-12 text-black-40">Text</Frame><Text loading skeleton>文本</Text></Frame>
    <Frame class="flex items-center gap-16"><Frame class="w-80 text-12 text-black-40">FlowText</Frame><FlowText loading skeleton value={1280} /></Frame>
    <Frame singleLine gap={4}><Frame class="w-80 text-12 text-black-40">Icon</Frame><Icon loading skeleton size={24} /></Frame>
    <Frame class="flex items-center gap-16"><Frame class="w-80 text-12 text-black-40">Avatar</Frame><Avatar loading skeleton aria-label="A" /></Frame>
    <Frame class="flex items-center gap-16"><Frame class="w-80 text-12 text-black-40">AvatarGroup</Frame><AvatarGroup loading skeleton size={16}><Avatar as="item" aria-label="A" /><Avatar as="item" aria-label="B" /></AvatarGroup></Frame>
    <Frame class="flex items-center gap-16"><Frame class="w-80 text-12 text-black-40">Badge</Frame><Badge loading skeleton count={8} /></Frame>
    <Frame class="flex items-center gap-16"><Frame class="w-80 text-12 text-black-40">Radio</Frame><Radio loading skeleton>单选</Radio></Frame>
    <Frame class="flex items-center gap-16"><Frame class="w-80 text-12 text-black-40">Checkbox</Frame><Checkbox loading skeleton>复选</Checkbox></Frame>
    <Frame class="flex items-center gap-16"><Frame class="w-80 text-12 text-black-40">Switch</Frame><Switch loading skeleton>开关</Switch></Frame>
    <Frame class="flex items-center gap-16"><Frame class="w-80 text-12 text-black-40">Spinner</Frame><Spinner loading skeleton /></Frame>
    <Frame class="flex items-center gap-16"><Frame class="w-80 text-12 text-black-40">Tooltip</Frame><Tooltip open loading skeleton>提示</Tooltip></Frame>
    <Frame class="flex items-center gap-16"><Frame class="w-80 text-12 text-black-40">Popover</Frame><Popover open loading skeleton content="内容"><Button>弹</Button></Popover></Frame>
    <Frame class="flex items-center gap-16"><Frame class="w-80 text-12 text-black-40">Frame</Frame><Frame loading skeleton class="p-16 inset-black-10 rounded-8 w-full">容器</Frame></Frame>
</Frame>`,
        logic: ["overview", "loading", "skeleton", "real-components"],
    },
    {
        name: "7: 骨架渲染逻辑验证",
        code: `7
<Frame class="flex flex-col gap-24 p-24">
    <Frame class="flex flex-col gap-8">
        <div class="text-12 text-black-40">A. Frame 只渲染第一层组件 Skeleton，Button 内部的 Icon 与 Text 不单独渲染</div>
        <Frame loading skeleton class="p-16 inset-black-10 rounded-12">
            <Button variant="filled">
                <Icon />
                <Text>Search</Text>
            </Button>
        </Frame>
    </Frame>

    <Frame class="flex flex-col gap-8">
        <div class="text-12 text-black-40">B. Frame 第一层没有组件时，回退成文字形态 Skeleton</div>
        <Frame loading skeleton class="p-16 inset-black-10 rounded-12">
            这里只有普通文字内容，没有第一层组件。
        </Frame>
    </Frame>

    <Frame class="flex flex-col gap-8">
        <div class="text-12 text-black-40">C. Text 按第一层段落数量生成多条 Skeleton</div>
        <Text loading skeleton class="w-full">
            <div>段落一，段落一，段落一。</div>
            <div>段落二，段落二，段落二。</div>
            <div>段落三，段落三，段落三。</div>
        </Text>
    </Frame>
</Frame>`,
        logic: [
            "loading",
            "skeleton",
            "first-layer-components",
            "frame-fallback",
            "text-paragraph-rows",
        ],
    },
    {
        name: "8: renderHints 自注册验证",
        code: `8
<Frame loading skeleton class="p-16 inset-black-10 rounded-12">
    <Frame
        renderHints={{
            variant: "rect",
            width: "18rem",
            height: "4rem",
            radius: "var(--radius-6)",
        }}
    >
        任意组件内容
    </Frame>
</Frame>

<Frame
    loading
    skeleton
    renderHints={{ variant: "line", width: "18rem", height: "1rem", rows: 3 }}
/>

<Frame loading skeleton>
    <Tooltip>直接以 Skeleton 为加载根的组件也能被父 Frame 探测</Tooltip>
</Frame>`,
        logic: [
            "loading",
            "skeleton",
            "renderHints-registration",
            "radius",
            "rows",
            "direct-skeleton-root",
            "no-class-mapping",
        ],
    },
] as const;
