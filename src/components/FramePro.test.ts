
// Log (2026-02-19): C6 去除 script 逻辑，改为纯 Frame Click + 状态链配置实现。
// Log (2026-02-19): C7 重构为“可调容器 + 方向链/继承/禁用响应式”三段式示例，更集中展示 Frame 响应式能力。
// Log (2026-02-19): C6 修复点击卡住问题：改为“每次点击进入目标状态后自动回 Idle”，并用按钮文字显示当前目标状态。
// Log (2026-02-19): C6 简化为单按钮逐次状态切换，每次点击进入下一个状态并显示当前状态。
// Log (2026-02-19): C6 增强状态可视差异，移除内部 Frame 点击干扰，并新增按钮触发状态链。
// Log (2026-02-19): C6 重写为多状态自动链路（Click -> Load -> Active -> Disabled -> Idle），并在示例中实时显示 currentState。
// Log (2026-02-22): F1, F2, G1 终极打磨：F1的覆盖变为强效的 --hover-color: #fff，达到 100% 遮盖红色；F2 移除了多余的过渡动画，改写为极其存粹的 fallback 环境验证；G1 重塑了响应式双排列与截断长文本挤压溢出。
// Log (2026-02-22): F1, F2 精调：F1 将 Hover Overlay 透明度覆写改为 100% 极值；F2 增加了非 Token 体系下的后备原生 hover 以观察滤镜；两处一并移除了 Container 掩人耳目的强制 pointer 光标。
// Log (2026-02-22): G1 精调：大幅优化原“不具有代表性”的示例；Disable Context 变为截断 Size 传递的内外对比框；Disable Responsive 改用直观的尺寸监听定格表现。
// Log (2026-02-22): F1, F2, G1 补充说明：统一重构为直观的能力对比面板，于底部附接详细解说与开关参数。
// Log (2026-02-22): 按用户新反馈重构 F1/F2/G1：F1 改为无 !important 的纯变量覆写并使用正确变量名 --snowui-hover-opacity；F2 简化为单一 Surface 的 No Tokens 验证；G1 重做 Disable Context/Responsive/Truncation 对比，确保尺寸、排列、截断差异可直接观察。
// Log (2026-02-22): F1 再精简：改为单方块示例；去除对比容器；使用纯颜色值（非 Frame 内部 Token）+ --snowui-hover-opacity: 100% 展示 hover 白色完全覆盖红底。
// Log (2026-02-22): F1 规范修正：去除自定义类名（test utilities 校验不允许），改为仅用 utilities + 行内颜色值与 --snowui-hover-opacity 变量。
// Log (2026-02-22): F1 最终按用户要求切换到方法2：不用内建变量链，使用示例内 :hover 直接覆写 background-image/background-color，实现完整覆盖。
// Log (2026-02-22): F1 修复方法2失效：去除内联红底（内联优先级压制 hover 覆写），改为 data 选择器基态 + hover 覆写，确保白色完全覆盖。
// Log (2026-02-22): F1 强化为事件直控：使用 onmouseenter/onmouseleave 直接写内联样式，完全绕过 Surface 默认 hover 叠加链路，确保红底→白底可见且稳定。
// Log (2026-02-22): F1 回归能力化方案：新增 Frame hover 覆写变量（--snowui-frame-hover-image-override），示例改为纯声明式一行覆盖，不再依赖事件脚本。
// Log (2026-02-22): F1 能力收敛：仅保留单一覆写入口变量 --snowui-frame-hover-image-override，确保“简单覆盖”与规范一致。
// Log (2026-02-23): F2 Hover 可见性修复：保持 No Tokens 的单 Surface 示例，通过红底白字 + --snowui-hover-opacity 提升默认 hover 叠加可感知度。
// Log (2026-05-20): 改为显式 CSS 行为工具类示例。
// Log (2026-02-23): F2 再按能力本意精简：验证 hover 显式工具类的最小写法。
// Log (2026-02-22): E3 补充说明优化：针对易造成误解的“只读却还在更新”现象，修改图注说明了它是正确响应了全局数据但失去了自身改写能力的体现。
// Log (2026-02-22): E3 补充说明：为 Access (权限访问) 测试用例左右两部分附加文字详解及 access 属性设置，清晰化权限控制概念。
// Log (2026-02-22): E2 补充说明：在视觉图例下方附上 scope 能力文字详解和代码参数，更直观地阐述控制传播的穿透特性。
// Log (2026-02-22): E1 重写示例：分两组对比直观呈现 Surface、Container、Anchor 在 Hover 与 Click 交互下的默认行为与指针风格差异。
// Log (2026-02-22): D3 极简化：移除行内 style 模拟状态的逻辑，改用 {#if} 块加 layoutId 展示 Frame 的共享组件平滑过渡能力。
// Log (2026-02-19): B1 柱状图最小化实现，去除 tooltip/hover，保留运行时高度增量与 reset 回到初始态。

export const examples = [
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

<FramePro
    id="chart-bars"
    row
    orchestrate
    orchestrateMode="sequential"
    orchestrateDelay={80}
    orchestrateTrigger="none"
    class="items-end gap-8 p-16 rounded-16 bg-background-2"
>
    {#each bars as bar}
        <FramePro
            class={"w-40 rounded-full bg-indigo " + bar.heightClass}
            whileAppear={{ height: bar.grow, duration: 260 }}
        />
    {/each}
</FramePro>

<FramePro row class="gap-8 mt-12">
    <FramePro
        tag="button"
        type="button"
        Click={{ target: "chart-bars", action: "play" }}
        class="h-32 px-12 rounded-8 bg-logo-1 text-white-100 cursor-pointer"
    >
        Start
    </FramePro>
    <FramePro
        tag="button"
        type="button"
        Click={{ target: "chart-bars", action: "reset" }}
        class="h-32 px-12 rounded-8 bg-background-1 border-black-20 text-black-80 cursor-pointer"
    >
        Reset
    </FramePro>
</FramePro>`,
        logic: ["Motion", "Orchestration"],
    },
    {
        name: "C1: 编排模式 (Orchestration Grid)",
        code: `C1
<script lang="ts">
    initMotion();
    let order = $state("visual-row");
</script>

<FramePro class="gap-16 p-16 bg-black-4 rounded-12" column>
    <!-- Controls -->
    <FramePro class="gap-8 items-center" row>
        <select bind:value={order} class="h-32 px-8 rounded-8 border-black-10">
            <option value="visual-row">Visual Row (L->R, T->B)</option>
            <option value="visual-column">Visual Column (T->B, L->R)</option>
            <option value="dom">DOM Order</option>
        </select>
        <FramePro
            tag="button"
            type="button"
            Click={{ target: "grid-demo", action: "play" }}
            class="h-32 px-12 rounded-8 bg-logo-1 text-white-100 cursor-pointer"
        >
            Play
        </FramePro>
        <FramePro
            tag="button"
            type="button"
            Click={{ target: "grid-demo", action: "reset" }}
            class="h-32 px-12 rounded-8 bg-background-1 border-black-20 text-black-80 cursor-pointer"
        >
            Reset
        </FramePro>
    </FramePro>

    <!-- Grid -->
    <FramePro
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
            <FramePro
                class="w-40 h-40 bg-blue rounded-4 flex items-center justify-center text-white font-semibold size-16"
                whileAppear={{ opacity: [0, 1], y: [10, 0], duration: 200 }}
            >
                {n}
            </FramePro>
        {/each}
    </FramePro>
</FramePro>`,
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
