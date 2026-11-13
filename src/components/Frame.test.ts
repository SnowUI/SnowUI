/**
 * Frame.test.ts
 * v1.0.0
 * 变更记录 (2026-05-20): 改为显式 class 示例。
 * 变更记录 (2026-05-09): 补充 Frame 基础示例，覆盖状态内容与 Skeleton 协议。
 */
export const examples = [
    {
        name: "F-single-line: 单行图文组合",
        code: `F-single-line
<Frame singleLine style="width: 12rem;">
    <Icon as="leading" icon={Resource.Check} size={20} />
    <Text lines={1}>SnowUI Store with a very long name</Text>
</Frame>`,
        expected: {render:"图文始终同排；文字省略后可查看全文。",layout:"附件不压缩，内部有效gap至少4px。",interaction:"截断与Tooltip由Text拥有。",responsive:"父容器缩窄只压间距和文字，恢复后还原；普通wrap及firstLine保持。"},
        logic:["singleLine","as","Text"],
    },
    {
        name: "F-first-line: 首行对齐与 Pin",
        code: `F-first-line
<Frame column class="gap-16">
    <Frame row firstLine class="text-18 gap-8" style="width: 18rem;">
        <Icon as="leading" size={24} icon={Resource.Check} />
        <span>All components and blocks for your next project</span>
    </Frame>
    <Frame singleLine class="text-18 gap-8" style="width: 18rem;">
        <Icon as="leading" size={24} icon={Resource.Check} />
        <Text lines={1}>1 developer seat</Text>
        <Badge as="pin-top-right">New</Badge>
    </Frame>
</Frame>`,
        expected: {
            render: "单行名称采用 singleLine，多行正文保留 firstLine，附件保持原尺寸。",
            layout: "三槽列与首行行框复用共享布局，Pin 脱离文档流。",
            interaction: "无新增交互或尺寸观察器。",
            responsive: "宽度变化只使正文换行，附件仍与首行居中。",
        },
        logic: ["firstLine", "row", "as", "pin"],
    },
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

    {
        name: "A1: 基础渲染",
        code: `A1
<Frame>Content</Frame>`,
        logic: ["A1"],
    },
    {
        name: "B1: 柱状图编排 (Bar Chart)",
        code: `B1
<script lang="ts">
    initMotion();
    const bars = [
        { heightClass: "h-32", grow: "+8px" },
        { heightClass: "h-40", grow: "+10px" },
        { heightClass: "h-48", grow: "+12px" },
        { heightClass: "h-56", grow: "+14px" },
        { heightClass: "h-64", grow: "+16px" },
        { heightClass: "h-80", grow: "+20px" },
    ];
</script>

<Frame
    id="chart-bars"
    row
    orchestrate
    orchestrateMode="sequential"
    orchestrateDelay={80}
    orchestrateTrigger="none"
    class="items-end gap-8 p-16 rounded-16 bg-background-2"
>
    {#each bars as bar}
        <Frame
            class={"w-40 rounded-full bg-indigo " + bar.heightClass}
            whileAppear={{ height: bar.grow, duration: 260 }}
        />
    {/each}
</Frame>

<Frame row class="gap-8 mt-12">
    <Frame
        tag="button"
        type="button"
        Click={{ target: "chart-bars", action: "play" }}
        class="h-32 px-12 rounded-8 bg-brand text-white-100 cursor-pointer"
    >
        Start
    </Frame>
    <Frame
        tag="button"
        type="button"
        Click={{ target: "chart-bars", action: "reset" }}
        class="h-32 px-12 rounded-8 bg-background-1 border-black-20 text-black-80 cursor-pointer"
    >
        Reset
    </Frame>
</Frame>`,
        logic: ["Motion", "Orchestration"],
    },
    {
        name: "C1: 编排模式 (Orchestration Grid)",
        code: `C1
<script lang="ts">
    initMotion();
    let order = $state("visual-row");
</script>

<Frame class="gap-16 p-16 bg-black-4 rounded-12" column>
    <!-- Controls -->
    <Frame class="gap-8 items-center" row>
        <select bind:value={order} class="h-32 px-8 rounded-8 border-black-10">
            <option value="visual-row">Visual Row (L->R, T->B)</option>
            <option value="visual-column">Visual Column (T->B, L->R)</option>
            <option value="dom">DOM Order</option>
        </select>
        <Frame
            tag="button"
            type="button"
            Click={{ target: "grid-demo", action: "play" }}
            class="h-32 px-12 rounded-8 bg-brand text-white-100 cursor-pointer"
        >
            Play
        </Frame>
        <Frame
            tag="button"
            type="button"
            Click={{ target: "grid-demo", action: "reset" }}
            class="h-32 px-12 rounded-8 bg-background-1 border-black-20 text-black-80 cursor-pointer"
        >
            Reset
        </Frame>
    </Frame>

    <!-- Grid -->
    <Frame
        id="grid-demo"
        class="gap-4"
        style="display: grid; grid-template-columns: repeat(9, 1fr);"
        orchestrate
        orchestrateMode="sequential"
        orchestrateDelay={30}
        orchestrateOrder={order}
        orchestrateTrigger="none"
    >
        {#each Array.from({ length: 81 }, (_, i) => i + 1) as n}
            <Frame
                class="w-40 h-40 bg-blue rounded-4 flex items-center justify-center text-white font-semibold size-16"
                whileAppear={{ opacity: [0, 1], y: [10, 0], duration: 200 }}
            >
                {n}
            </Frame>
        {/each}
    </Frame>
</Frame>`,
        logic: ["Motion", "Orchestration"],
    },
    {
        name: "C2: 悬停动效 (Hover Effects)",
        code: `C2
<script lang="ts">
    initMotion();
</script>

<Frame class="gap-12 p-16 bg-black-4 rounded-12" row>
    <Frame
        class="w-80 h-80 bg-purple rounded-16 flex items-center justify-center text-white font-semibold"
        whileHover={{ scale: 1.1 }}
    >
        Scale
    </Frame>
    <Frame
        class="w-80 h-80 bg-green rounded-16 flex items-center justify-center text-white font-semibold"
        whileHover={{ rotate: 15 }}
    >
        Rotate
    </Frame>
    <Frame
        class="w-80 h-80 bg-orange rounded-16 flex items-center justify-center text-white font-semibold"
        whileHover={{ y: -10 }}
    >
        Float
    </Frame>
</Frame>`,
        logic: ["Motion", "Interaction"],
    },
    {
        name: "C3: 点击动效 (Click Effects)",
        code: `C3
<script lang="ts">
    initMotion();
</script>

<Frame class="gap-12 p-16 bg-black-4 rounded-12" row>
    <Frame
        class="w-80 h-40 bg-red rounded-8 flex items-center justify-center text-white font-semibold cursor-pointer"
        whileClick={{ scale: 0.95 }}
    >
        Press
    </Frame>
    <Frame
        class="w-80 h-40 bg-indigo rounded-8 flex items-center justify-center text-white font-semibold cursor-pointer"
        whileClick={{ opacity: 0.7 }}
    >
        Dim
    </Frame>
</Frame>`,
        logic: ["Motion", "Interaction"],
    },
    {
        name: "C4: 联动控制 (Linkage Control)",
        code: `C4
<script lang="ts">
    initMotion();
</script>

<Frame class="gap-24 p-16 bg-black-4 rounded-12" row>
    <Frame column class="gap-8">
        <Button Click={{ target: "target-box", action: "play" }}>Play</Button>
        <Button Click={{ target: "target-box", action: "reset" }} variant="outline">Reset</Button>
    </Frame>

    <Frame
        id="target-box"
        class="w-80 h-80 bg-yellow rounded-16 flex items-center justify-center text-black-80 font-semibold"
        whileAppear={{ opacity: [0, 1], scale: [0.5, 1] }}
    >
        Target
    </Frame>
</Frame>`,
        logic: ["Motion", "Linkage"],
    },
    {
        name: "C5: 组控制 (Group Control)",
        code: `C5
<script lang="ts">
    initMotion();
</script>

<Frame class="gap-24 p-16 bg-black-4 rounded-12" row>
    <Frame column class="gap-8">
        <Button Click={{ target: "group-1", action: "play" }}>Play Group</Button>
        <Button Click={{ target: "group-1", action: "play", reverse: true }} variant="outline">Reverse</Button>
        <Button Click={{ target: "group-1", action: "reset" }} variant="ghost">Reset</Button>
    </Frame>

    <Frame
        id="group-1"
        class="gap-8"
        row
        orchestrate
        orchestrateTrigger="none"
    >
        {#each ["A", "B", "C"] as letter}
            <Frame
                class="w-48 h-48 bg-purple rounded-8 flex items-center justify-center text-white font-semibold"
                whileAppear={{ opacity: [0, 1], x: [-20, 0] }}
            >
                {letter}
            </Frame>
        {/each}
    </Frame>
</Frame>`,
        logic: ["Motion", "Group"],
    },
    {
        name: "C6: 状态链式转变 (State Chaining)",
        code: `C6
<Frame
    class="h-40 px-16 bg-indigo rounded-8 flex items-center justify-center text-white font-semibold cursor-pointer"
    Click="Load"
    Load={["Active", "auto"]}
    Active={["Disabled", "auto"]}
    Disabled={["Idle", "auto"]}
>
    {#snippet children({ currentState })}
        当前状态：{currentState}
    {/snippet}
</Frame>`,
        logic: ["State"],
    },
    {
        name: "C7: 响应式布局 (Responsive Layout)",
        code: `C7
<script lang="ts">
    let width = $state(860);
</script>

<Frame class="p-16 bg-black-4 rounded-12 gap-8" column>
    <Frame row class="gap-8 items-center">
        <span class="text-12 text-black-40">Container Width: {width}px</span>
        <input type="range" min="240" max="1700" bind:value={width} class="w-80" />
    </Frame>

    <Frame
        class="p-8 bg-white rounded-8 overflow-hidden gap-8"
        style="width: {width}px; transition: width 0.2s"
        column
    >
        <Frame class="p-8 bg-black-4 rounded-8 gap-8" column>
            <span class="text-12 text-black-40">xs</span>
            <Frame
                class="gap-8 w-full"
                responsive={{}}
                column
                xs="row"
            >
                <Frame class="bg-blue rounded-8 flex-1" style="height: 0.5rem; min-height: 0.5rem;" />
                <Frame class="bg-blue rounded-8 flex-1" style="height: 0.5rem; min-height: 0.5rem;" />
                <Frame class="bg-blue rounded-8 flex-1" style="height: 0.5rem; min-height: 0.5rem;" />
            </Frame>
        </Frame>

        <Frame class="p-8 bg-black-4 rounded-8 gap-8" column>
            <span class="text-12 text-black-40">sm</span>
            <Frame
                class="gap-8 w-full"
                responsive={{}}
                column
                sm="row"
            >
                <Frame class="bg-orange rounded-8 flex-1" style="height: 0.5rem; min-height: 0.5rem;" />
                <Frame class="bg-orange rounded-8 flex-1" style="height: 0.5rem; min-height: 0.5rem;" />
                <Frame class="bg-orange rounded-8 flex-1" style="height: 0.5rem; min-height: 0.5rem;" />
            </Frame>
        </Frame>

        <Frame class="p-8 bg-black-4 rounded-8 gap-8" column>
            <span class="text-12 text-black-40">md</span>
            <Frame
                class="gap-8 w-full"
                responsive={{}}
                column
                md="row"
            >
                <Frame class="bg-yellow rounded-8 flex-1" style="height: 0.5rem; min-height: 0.5rem;" />
                <Frame class="bg-yellow rounded-8 flex-1" style="height: 0.5rem; min-height: 0.5rem;" />
                <Frame class="bg-yellow rounded-8 flex-1" style="height: 0.5rem; min-height: 0.5rem;" />
            </Frame>
        </Frame>

        <Frame class="p-8 bg-black-4 rounded-8 gap-8" column>
            <span class="text-12 text-black-40">lg</span>
            <Frame
                class="gap-8 w-full"
                responsive={{}}
                column
                lg="row"
            >
                <Frame class="bg-mint rounded-8 flex-1" style="height: 0.5rem; min-height: 0.5rem;" />
                <Frame class="bg-mint rounded-8 flex-1" style="height: 0.5rem; min-height: 0.5rem;" />
                <Frame class="bg-mint rounded-8 flex-1" style="height: 0.5rem; min-height: 0.5rem;" />
            </Frame>
        </Frame>

        <Frame class="p-8 bg-black-4 rounded-8 gap-8" column>
            <span class="text-12 text-black-40">xl</span>
            <Frame
                class="gap-8 w-full"
                responsive={{}}
                column
                xl="row"
            >
                <Frame class="bg-cyan rounded-8 flex-1" style="height: 0.5rem; min-height: 0.5rem;" />
                <Frame class="bg-cyan rounded-8 flex-1" style="height: 0.5rem; min-height: 0.5rem;" />
                <Frame class="bg-cyan rounded-8 flex-1" style="height: 0.5rem; min-height: 0.5rem;" />
            </Frame>
        </Frame>

        <Frame class="p-8 bg-black-4 rounded-8 gap-8" column>
            <span class="text-12 text-black-40">2xl</span>
            <Frame
                class="gap-8 w-full"
                responsive={{}}
                column
                2xl="row"
            >
                <Frame class="bg-blue rounded-8 flex-1" style="height: 0.5rem; min-height: 0.5rem;" />
                <Frame class="bg-blue rounded-8 flex-1" style="height: 0.5rem; min-height: 0.5rem;" />
                <Frame class="bg-blue rounded-8 flex-1" style="height: 0.5rem; min-height: 0.5rem;" />
            </Frame>
        </Frame>
    </Frame>
</Frame>`,
        logic: ["Responsive", "Layout"],
    },
    {
        name: "D1: 物理弹簧 (Spring Physics)",
        code: `D1
<script lang="ts">
    initMotion();
    let selectedSpring = $state("bouncy");
</script>

<Frame class="gap-20" row>
    <!-- Soft -->
    <Frame
        class="w-80 h-80 rounded-16 flex-col flex items-center justify-center cursor-pointer border-2"
        style={selectedSpring === "soft"
            ? "border-color: var(--blue); border-width: 2px; background-color: var(--background-2); transition: border-color 160ms ease, border-width 160ms ease;"
            : "border-color: var(--black-20); border-width: 1px; background-color: var(--background-2); transition: border-color 160ms ease, border-width 160ms ease;"}
        Click={{ run: () => (selectedSpring = "soft") }}
        whileClick={{ x: -2, type: "spring", stiffness: 100, damping: 20 }}
    >
        <div class="font-semibold">Soft</div>
        <div class="text-12 text-black-40 mt-4">S:100 D:20</div>
    </Frame>

    <!-- Bouncy -->
    <Frame
        class="w-80 h-80 rounded-16 flex-col flex items-center justify-center cursor-pointer border-2"
        style={selectedSpring === "bouncy"
            ? "border-color: var(--blue); border-width: 2px; background-color: var(--background-2); transition: border-color 160ms ease, border-width 160ms ease;"
            : "border-color: var(--black-20); border-width: 1px; background-color: var(--background-2); transition: border-color 160ms ease, border-width 160ms ease;"}
        Click={{ run: () => (selectedSpring = "bouncy") }}
        whileClick={{ x: -8, type: "spring", stiffness: 300, damping: 15 }}
    >
        <div class="font-semibold">Bouncy</div>
        <div class="text-12 text-black-40 mt-4">S:300 D:15</div>
    </Frame>

    <!-- Stiff -->
    <Frame
        class="w-80 h-80 rounded-16 flex-col flex items-center justify-center cursor-pointer border-2"
        style={selectedSpring === "stiff"
            ? "border-color: var(--blue); border-width: 2px; background-color: var(--background-2); transition: border-color 160ms ease, border-width 160ms ease;"
            : "border-color: var(--black-20); border-width: 1px; background-color: var(--background-2); transition: border-color 160ms ease, border-width 160ms ease;"}
        Click={{ run: () => (selectedSpring = "stiff") }}
        whileClick={{ x: -1, type: "spring", stiffness: 500, damping: 40 }}
    >
        <div class="font-semibold">Stiff</div>
        <div class="text-12 text-black-40 mt-4">S:500 D:40</div>
    </Frame>
</Frame>`,
        logic: ["Motion", "Spring"],
    },
    {
        name: "D2: 滚动联动 (Scroll-Linked)",
        code: `D2
<script lang="ts">
    initMotion();
</script>

<div
    style="min-height: 1200px; padding-top: 440px;"
>
    <div class="sticky top-20 flex items-center justify-center">
        <Frame
            class="size-80 bg-gradient-blue rounded-16 flex items-center justify-center shadow-drop-2"
            scroll={{
                y: [0, 700],
                scale: [0.6, 1.6],
            }}
        >
            <span class="text-white font-semibold">Scroll</span>
        </Frame>
    </div>
</div>`,
        logic: ["Motion", "Scroll"],
    },
    {
        name: "D3: 共享元素 (Shared Element)",
        code: `D3
<script lang="ts">
    initMotion();
    let expanded = $state(false);
</script>

<Frame
    class="bg-black-4 rounded-16 cursor-pointer flex items-center justify-center p-24"
    style="width: 320px; height: 320px;"
    Click={{ run: () => (expanded = !expanded) }}
>
    {#if !expanded}
        <Frame
            layoutId="shared-box"
            class="bg-gradient-blue rounded-16 shadow-drop-1"
            style="width: 64px; height: 64px; flex-shrink: 0;"
        />
    {:else}
        <Frame
            layoutId="shared-box"
            class="bg-gradient-red rounded-24 shadow-drop-2"
            style="width: 272px; height: 272px; flex-shrink: 0;"
        />
    {/if}
</Frame>`,
        logic: ["Motion", "Shared"],
    },
    {
        name: "E1: 演进-CSS 行为 (Explicit Behavior)",
        code: `E1
<Frame class="gap-24 p-24 bg-background-1 rounded-16" column>
    <!-- 第一组：CSS 行为表现 -->
    <Frame class="gap-12" column>
        <span class="text-14 font-semibold text-black-80">1. 基础表现对比 (Hover over boxes)</span>
        <div class="grid grid-cols-3 gap-16">
            <Frame
                class="snowui-hoverable h-64 bg-black-4 rounded-12 flex items-center justify-center text-14 cursor-pointer"
            >
                Hoverable
            </Frame>
            <Frame
                class="h-64 border-1 border-black-10 rounded-12 flex items-center justify-center text-14"
            >
                Plain Frame
            </Frame>
            <Frame
                class="h-64 text-blue flex items-center justify-center text-14 font-semibold"
            >
                Text Link Style
            </Frame>
        </div>
    </Frame>

    <div class="w-full bg-black-10" style="height: 1px;" />

    <!-- 第二组：显式事件感知 (Cursor & Response) -->
    <Frame class="gap-12" column>
        <span class="text-14 font-semibold text-black-80">2. 事件感知 (explicit pointer)</span>
        <div class="grid grid-cols-2 gap-16">
            <Frame
                Click={{}}
                class="snowui-hoverable h-64 bg-indigo text-white rounded-12 flex items-center justify-center text-14 cursor-pointer"
                whileClick={{ scale: 0.95 }}
            >
                Clickable Frame
            </Frame>
            <Frame
                class="h-64 bg-black-4 rounded-12 flex items-center justify-center text-14 text-black-40"
            >
                Static Container
            </Frame>
        </div>
    </Frame>
</Frame>`,
        logic: ["Evolution", "class"],
    },
    {
        name: "E2: 演进-Scope (Capability Scope)",
        code: `E2
<script lang="ts">
    initMotion();
</script>

<Frame class="gap-40 p-20" row>
    <!-- Scope: Children (Only direct children animate) -->
    <Frame class="flex-1 gap-12" column>
        <div class="flex justify-between items-center">
            <span class="font-semibold">Scope: Children</span>
            <Button size="sm" Click={{ target: "scope-children", action: "play" }}>Play</Button>
        </div>
        <Frame
            id="scope-children"
            class="p-12 bg-black-4 rounded-12 gap-12"
            column
            orchestrate
            scope="children"
            orchestrateDelay={200}
        >
            <Frame class="h-40 bg-gradient-red rounded-8 flex items-center justify-center text-white" whileAppear={{ x: [-20, 0], opacity: [0, 1] }}>Child 1</Frame>
            <div class="p-12 bg-white rounded-8 border-1 border-black-10">
                <Frame class="h-32 bg-gradient-red rounded-4 flex items-center justify-center text-white" whileAppear={{ x: [-20, 0], opacity: [0, 1] }}>
                    Grandchild (No Anim)
                </Frame>
            </div>
            <Frame class="h-40 bg-gradient-red rounded-8 flex items-center justify-center text-white" whileAppear={{ x: [-20, 0], opacity: [0, 1] }}>Child 2</Frame>
        </Frame>
        <!-- 能力说明 -->
        <Frame class="mt-8 gap-8 p-12 bg-background-2 rounded-8" column>
            <span class="text-12 text-black-40">
                <strong>能力说明：</strong>控制信号仅穿透 1 层子级。被原生 div 包裹的孙节点收不到进场编排，无动画。
            </span>
            <code class="text-12 text-black p-8 bg-white border-1 border-black-10 rounded-4" style="font-family: monospace;">
                scope="children"
            </code>
        </Frame>
    </Frame>

    <!-- Scope: Descendants (All animate) -->
    <Frame class="flex-1 gap-12" column>
        <div class="flex justify-between items-center">
            <span class="font-semibold">Scope: Descendants</span>
            <Button size="sm" Click={{ target: "scope-descendants", action: "play" }}>Play</Button>
        </div>
        <Frame
            id="scope-descendants"
            class="p-12 bg-black-4 rounded-12 gap-12"
            column
            orchestrate
            scope="descendants"
            orchestrateDelay={200}
        >
            <Frame class="h-40 bg-gradient-green rounded-8 flex items-center justify-center text-white" whileAppear={{ x: [-20, 0], opacity: [0, 1] }}>Child 1</Frame>
            <div class="p-12 bg-white rounded-8 border-1 border-black-10">
                <Frame class="h-32 bg-gradient-green rounded-4 flex items-center justify-center text-white" whileAppear={{ x: [-20, 0], opacity: [0, 1] }}>
                    Grandchild (Anim)
                </Frame>
            </div>
            <Frame class="h-40 bg-gradient-green rounded-8 flex items-center justify-center text-white" whileAppear={{ x: [-20, 0], opacity: [0, 1] }}>Child 2</Frame>
        </Frame>
        <!-- 能力说明 -->
        <Frame class="mt-8 gap-8 p-12 bg-background-2 rounded-8" column>
            <span class="text-12 text-black-40">
                <strong>能力说明：</strong>控制信号穿透整棵子树。隐藏在普通 div 容器深处的孙节点也会被编排捕获并顺利入场。
            </span>
            <code class="text-12 text-black p-8 bg-white border-1 border-black-10 rounded-4" style="font-family: monospace;">
                scope="descendants"
            </code>
        </Frame>
    </Frame>
</Frame>`,
        logic: ["Evolution", "Scope"],
    },
    {
        name: "E3: 演进-Access (Context Access)",
        code: `E3
<script lang="ts">
    let count = $state(0);
</script>

<Frame class="gap-40 p-20" row>
    <!-- Access: Readonly -->
    <Frame class="flex-1 gap-12" column>
        <span class="font-semibold">Access: Readonly</span>
        <Frame class="p-20 bg-black-4 rounded-12 gap-12" access="readonly" column>
            <span>Count: {count}</span>
            <Button onclick={() => count++} disabled>Increment (Disabled)</Button>
        </Frame>
        <!-- 能力说明 -->
        <Frame class="mt-8 gap-8 p-12 bg-background-2 rounded-8" column>
            <span class="text-12 text-black-40">
                <strong>能力说明：</strong>声明此区块只能被动消费外部数据，禁止向外发起状态更改。<strong>这正是为什么当你在右侧点击增加时，这里的数字依然会实时更新：它的“读取”功能完好，只是被剥夺了修改的“控制权”。</strong>
            </span>
            <code class="text-12 text-black p-8 bg-white border-1 border-black-10 rounded-4" style="font-family: monospace;">
                access="readonly"
            </code>
        </Frame>
    </Frame>

    <!-- Access: Writeable -->
    <Frame class="flex-1 gap-12" column>
        <span class="font-semibold">Access: Writeable</span>
        <Frame class="p-20 bg-gradient-blue text-white rounded-12 gap-12" access="writeable" column>
            <span>Count: {count}</span>
            <Button onclick={() => count++}>Increment</Button>
        </Frame>
        <!-- 能力说明 -->
        <Frame class="mt-8 gap-8 p-12 bg-background-2 rounded-8" column>
            <span class="text-12 text-black-40">
                <strong>能力说明：</strong>默认权限（或显式声明）。赋予内部元素自由读取与修改上下文状态的权利。当它更改全局数据时，上方所有连接该状态的受控（只读）区域都会同步响应。
            </span>
            <code class="text-12 text-black p-8 bg-white border-1 border-black-10 rounded-4" style="font-family: monospace;">
                access="writeable"
            </code>
        </Frame>
    </Frame>
</Frame>`,
        logic: ["Evolution", "Access"],
    },
    {
        name: "F1: 样式覆盖 (Hover Override)",
        code: `F1
<Frame
    class="w-80 h-80 rounded-12 flex items-center justify-center bg-red text-black-100"
    style="--snowui-frame-hover-image-override: linear-gradient(#ffffff, #ffffff);"
>
    Hover Me
</Frame>`,
        logic: ["Override", "Style"],
    },
    {
        name: "F2: 无 SnowUI 支持 (No Tokens)",
        code: `F2
<Frame
>
    No Tokens Surface
</Frame>`,
        logic: ["NoSnowUI"],
    },
    {
        name: "G1: 能力开关 (Capability Switches)",
        code: `G1
<Frame class="gap-24 p-20 bg-background-1" column>
    <Frame class="gap-12" column>
        <span class="font-semibold">Disable Context</span>
        <Frame class="gap-12" row>
            <Frame
                class="flex-1 p-12 bg-black-4 rounded-12 gap-8 items-center justify-center"
                size={40}
                column
            >
                <span class="text-12 text-black-40">Enabled</span>
                <Icon name="check" class="bg-white border-1 border-black-10 rounded-full" />
            </Frame>
            <Frame
                class="flex-1 p-12 bg-white border-1 border-black-10 rounded-12 gap-8 items-center justify-center"
                size={40}
                enableContext={false}
                column
            >
                <span class="text-12 text-black-40">Disabled</span>
                <Icon name="check" class="bg-white border-1 border-black-10 rounded-full" />
            </Frame>
        </Frame>
    </Frame>

    <Frame class="gap-12" column>
        <span class="font-semibold">Disable Responsive</span>
        <Frame class="gap-12" row>
            <Frame
                class="flex-1 p-12 bg-black-4 rounded-12 gap-8"
                style="width: 12rem;"
                responsive={{}}
                column
                xs="row"
            >
                <Frame class="w-40 h-40 bg-blue rounded-8" />
                <Frame class="w-40 h-40 bg-blue rounded-8" />
            </Frame>
            <Frame
                class="flex-1 p-12 bg-white border-1 border-black-10 rounded-12 gap-8"
                style="width: 12rem;"
                enableResponsive={false}
                responsive={{}}
                column
                xs="row"
            >
                <Frame class="w-40 h-40 bg-orange rounded-8" />
                <Frame class="w-40 h-40 bg-orange rounded-8" />
            </Frame>
        </Frame>
    </Frame>

    <Frame class="gap-12" column>
        <span class="font-semibold">Text 截断能力（已迁移）</span>
        <Frame class="gap-12" row>
            <Text
                class="flex-1 p-12 bg-black-4 rounded-12 text-12"
                style="width: 12rem;"
                lines={1}
            >
                This line is intentionally very long so it should be truncated in one single line.
            </Text>
            <Text
                class="flex-1 p-12 bg-white border-1 border-black-10 rounded-12 text-12"
                style="width: 12rem;"
            >
                This line is intentionally very long so it should wrap to multiple lines without truncation.
            </Text>
        </Frame>
    </Frame>
</Frame>`,
        logic: ["Capability", "Switch"],
    },
    {
        name: "H1: Text 截断 (Text Truncation)",
        code: `H1
<Frame class="gap-16 p-20 bg-background-1 rounded-16" column>
    <span class="font-semibold">单行截断 (lines=1)</span>
    <Text
        class="p-12 bg-black-4 rounded-12 text-14"
        style="width: 20rem;"
        lines={1}
    >
        这是一段非常长的文本，用于展示 Text 组件的单行截断能力。当文本超出容器宽度时，多余的内容会被隐藏并显示省略号。
    </Text>

    <span class="font-semibold">多行截断 (lines=2)</span>
    <Text
        class="p-12 bg-black-4 rounded-12 text-14"
        style="width: 20rem;"
        lines={2}
    >
        这是一段非常长的文本，用于展示 Text 组件的多行截断能力。设定 lines=2 后，文本被限制为最多显示两行。超出的内容会被隐藏，并在末尾显示省略号，确保布局整洁。
    </Text>

    <span class="font-semibold">三行截断 (lines=3)</span>
    <Text
        class="p-12 bg-black-4 rounded-12 text-14"
        style="width: 20rem;"
        lines={3}
    >
        这是一段非常长的文本，用于展示 Text 组件的三行截断能力。设定 lines=3 后，文本最多显示三行。CSS line-clamp 会精确控制可见行数，多余文本被优雅地隐藏。
    </Text>

    <span class="font-semibold">不截断 (对比)</span>
    <Frame
        class="p-12 bg-white border-1 border-black-10 rounded-12 text-14"
        style="width: 20rem;"
    >
        这是同样长度的文本，但没有设定 lines 属性。文字会自然换行并完整显示所有内容，不会出现省略号。对比上方的截断效果，可以清楚地看到 Text 的截断能力是如何工作的。
    </Frame>
</Frame>`,
        logic: ["Truncation"],
    }
] as const;
