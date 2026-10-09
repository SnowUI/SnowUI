/**
 * Toast.test.ts
 * v2.0.0
 *
 * 覆盖：Toast 视觉单元（default / rich / sm / md / positive 内置图标 / 外置图标 / 三槽位）
 * 与 Toaster + toast() 命令式 API（6 位置 / 自动消失 / 持久 / 堆叠）。
 *
 * 注意：示例使用 SnowUI 工具类与原生 CSS，不引用任何 --snowui-* override 变量。
 *      文字与多行内容均通过 children 外置；内置图标由 positive 判定。
 */
export const examples = [
    {
        name: "TS-01：默认形态（default + 全部尺寸 + positive 判定）",
        code: `TS-01
<Frame class="flex-col gap-8 items-start">
    <Toast positive>Done</Toast>
    <Toast positive={false}>Something Wrong</Toast>
    <Toast size="sm" positive>Done</Toast>
    <Toast size="sm" positive={false}>Something Wrong</Toast>
    <Toast>No Icon</Toast>
</Frame>`,
        expected: {
            render: "深色玻璃 pill；md 档字号 14、内置图标 20px；sm 档字号 12、内置图标 16px；positive=true → 绿色 CheckCircle，positive=false → 黄色 Warning；未传 positive 不渲染内置图标",
            layout: "三槽位 row；Leading 内置图标(可选) + Content 文字",
        },
        logic: ["Default", "Size", "Positive"],
    },
    {
        name: "TS-02：rich 变体（白底卡片 + 多行外置文字）",
        code: `TS-02
<Toast class="items-start" variant="rich" positive style="width: 15rem;">
    <Frame column class="flex-1 min-w-0">
        <Text>Text</Text>
        <Text class="text-12 text-black-40">Text 2</Text>
    </Frame>
  <Button as="trailing" variant="gray">Button</Button>
</Toast>`,
        expected: {
            render: "白底毛玻璃，圆角 16px，drop-shadow；左侧 CheckCircle 20px，右侧关闭 X 默认隐藏，悬停 Toast 显示",
            interaction: "悬停 Toast 时右上角 X 出现；hover X 自身颜色加深；点击 X 触发 onDismiss",
        },
        logic: ["Rich", "Close"],
    },
    {
        name: "TS-03：rich 变体 + Trailing Button",
        code: `TS-03
<Toast variant="rich" positive style="width: 15rem;">
    <Text>Text</Text>
    <Button as="trailing" variant="gray">Button</Button>
</Toast>`,
        expected: {
            render: "rich 卡片，左 Icon + 中文字 Fill + 右 Button trailing 槽；右上角 X 仍 hover 显示",
            layout: "三槽位行布局",
        },
        logic: ["Rich", "Trailing", "Combination"],
    },
    {
        name: "TS-04：外置 Icon 替换内置图标（as 示例）",
        code: `TS-04
<Toast positive>
    <Icon as="leading"><Heart /></Icon>
    收藏成功
</Toast>`,
        expected: {
            render: "Leading 槽显示 Heart 图标，内置 CheckCircle 不再渲染",
            interaction: "外置 Icon 通过 as=\"leading\" 占据 Leading 槽位；同时存在内置图标时由 LayoutProtocol §4.1.5 规则自动隐藏内置",
        },
        logic: ["Slot", "BuiltinReplacement", "as"],
    },
    {
        name: "TS-05：命令式 toast() + 6 个位置（含 Toaster 挂载）",
        code: `TS-05
<Toaster />
<Frame class="flex-row gap-8 flex-wrap">
    <Button onclick={() => toast({ text: "Top", positive: true, position: "top" })}>Top</Button>
    <Button onclick={() => toast({ text: "Top Left", positive: true, position: "top-left" })}>Top Left</Button>
    <Button onclick={() => toast({ text: "Top Right", positive: true, position: "top-right" })}>Top Right</Button>
    <Button onclick={() => toast({ text: "Bottom", positive: true, position: "bottom" })}>Bottom</Button>
    <Button onclick={() => toast({ text: "Bottom Left", positive: true, position: "bottom-left" })}>Bottom Left</Button>
    <Button onclick={() => toast({ text: "Bottom Right", positive: true, position: "bottom-right" })}>Bottom Right</Button>
</Frame>`,
        expected: {
            render: "Toast 出现在视口对应位置，距边缘 40px，3 秒后自动消失",
            interaction: "Panel 模式显式使用 GENERIC_SCALE_APPEAR_MOTION，保持既有渐显 + 缩放；连续点击同一按钮叠加堆叠",
        },
        logic: ["Toaster", "API", "Position", "AutoDismiss"],
    },
    {
        name: "TS-06：堆叠与自动消失（参考 heroui）",
        code: `TS-06
<Toaster />
<Frame class="flex-row gap-8">
    <Button onclick={() => toast({ text: "Saved", positive: true, variant: "rich", position: "top-right" })}>
        Add Rich Toast
    </Button>
    <Button onclick={() => toast("Done")}>Add Default</Button>
    <Button onclick={() => dismissAllToasts()}>Clear All</Button>
</Frame>`,
        expected: {
            render: "多次点击同一按钮，最新 Toast 在前，旧条目向内堆叠并轻微缩放；超过 3 条隐藏",
            interaction: "最后一条移除时，其余真实 Toast 通过位移、缩放、透明度组合前移",
        },
        logic: ["Stack", "Scale", "Fade", "DismissAll"],
    },
    {
        name: "TS-07：常驻 Toast（duration: 0 + 手动关闭）",
        code: `TS-07
<Toaster />
<Frame class="flex-row gap-8">
    <Button onclick={() => toast({ text: "Persistent", positive: true, variant: "rich", duration: 0 })}>
        Show Persistent
    </Button>
    <Button variant="outline" onclick={() => dismissAllToasts()}>Dismiss All</Button>
</Frame>`,
        expected: {
            render: "Toast 不会自动消失",
            interaction: "需用户点击 rich 关闭 X 或调用 dismissAllToasts() 关闭；非持久 Toast 在 hover 任一可见层时暂停同位置可见栈自动消失计时，离开 hover 后恢复",
        },
        logic: ["Duration", "Persist"],
    },
    {
        name: "TS-08：与 Button 组合（必备组合示例）",
        code: `TS-08
<Toaster />
<Button variant="filled" onclick={() => toast({ text: "Saved", positive: true })}>
    <Icon as="leading"><Check /></Icon>
    保存并通知
</Button>`,
        expected: {
            render: "Button 点击后 top 位置弹出 Toast",
            interaction: "Button 与 toast() 组合调用",
        },
        logic: ["Combination", "Button"],
    },
    {
        name: "TS-09：缩放组合动效（scale + translate + opacity）",
        code: `TS-09
<Toaster maxVisible={3} scaleStep={0.08} stackOpacityStep={0.12} stackMinOpacity={0.68} gap={10} />
<Frame class="flex-row gap-8">
    <Button onclick={() => toast({ text: "Top", positive: true })}>Add Stack Toast</Button>
    <Button onclick={() => dismissAllToasts()}>Clear All</Button>
</Frame>`,
        expected: {
            render: "连续点击 3 次后，同一位置出现 3 层真实 Toast；第 2 / 3 层保留完整内容，并伴随更明显的缩放、位移、透明度差异；继续点击第 4 次时，最后一层按入场动效反向位移、缩小并渐隐，呈现被新层挤出效果",
            interaction: "scale、translate、opacity 三种动效同时叠加；普通退场和 pushed-out 都按进入组合动效反向执行；动效播放过程中按钮仍可继续点击；maxVisible 只限制可见层数，不限制 toast() 连续入队",
        },
        logic: ["Scale", "Translate", "Opacity", "Stack"],
    },
    {
        name: "TS-10：命令式 rich Toast（TS-02 内容）",
        code: `TS-10
<Toaster />

<Toast id="ts-02-rich-toast" template class="items-start" variant="rich" positive style="width: 15rem;">
    <Frame column class="flex-1 min-w-0">
        <Text>Text</Text>
        <Text class="text-12 text-black-40">Text 2</Text>
    </Frame>
    <Button as="trailing" variant="gray">Button</Button>
</Toast>

<Button
    onclick={() => showToast("ts-02-rich-toast", { position: "top-right" })}
>
    Add TS-02 Rich Toast
</Button>`,
        expected: {
            render: "点击按钮后，在 top-right 位置弹出与 TS-02 相同内容结构的 rich Toast：左侧 CheckCircle，中间两行文字，右侧 trailing Button",
            interaction: "通过 <Toast template id=\"...\"> 注册模板，按钮调用 showToast(id) 激活；多次点击按 rich Toast 真实内容堆叠",
        },
        logic: ["Rich", "API", "Template", "Stack"],
    },

    /* ───────────────── 内嵌模式 (as="toast", 遵循 ComponentGuidelines §5) ───────────────── */
    {
        name: "TS-30:内嵌模式 - 点击 Button 触发 Toast",
        code: `TS-30
<Toaster />
<Button variant="filled">
    保存
    <Toast as="toast" positive position="top-right">已保存</Toast>
</Button>`,
        expected: {
            render: "Toast 作为 Button 子节点;运行时不渲染;点击 Button 在 top-right 弹出 Toast",
            interaction: "无需 id、无需 showToast 手动调用,组件自动绑定父元素 click 事件",
        },
        logic: ["Inline", "AutoTrigger", "Toast"],
    },
    {
        name: "TS-31:内嵌模式 - rich 变体 + 多按钮",
        code: `TS-31
<Toaster />
<Frame row class="gap-8">
    <Button>
        保存
        <Toast as="toast" variant="rich" positive position="top-right" style="width: 15rem;">
            <Frame column class="flex-1 min-w-0">
                <Text>Saved</Text>
                <Text class="text-12 text-black-40">Your changes are synced.</Text>
            </Frame>
        </Toast>
    </Button>
    <Button>
        删除
        <Toast as="toast" variant="rich" positive={false} position="top-right" style="width: 15rem;">
            <Text>Deleted</Text>
        </Toast>
    </Button>
</Frame>`,
        expected: {
            render: "每个 Button 各自挂载一份 Toast 模版,点击各自弹出对应 Toast",
            interaction: "Inline 模式自动生成不冲突的 id,多组件共存无干扰",
        },
        logic: ["Inline", "Rich", "MultipleAnchors"],
    },
    {
        name: "TS-Parts：Toaster 统一配置直接 Toast",
        code: `<Toaster
    parts={{ Toast: { variant: "rich", size: "md" } }}
/>`,
        logic: ["Parts", "Toast", "DirectOwnership"],
    },
] as const;
