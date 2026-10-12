/**
 * Text.test.ts - Text 组件测试示例
 * v3.4.1
 *
 * 示例设计原则：每个示例展示 Text 组件的一个核心特性
 * 变更 (2026-06-23): 示例 3 验证共享边界拟合与显式行内省略符。
 * 变更 (2026-03-16):
 * - Text 自带 hover 改为默认关闭，交互示例更新为显式传入 interactive={true} 才开启
 * - 调整若干示例文案，避免继续描述“默认 hover”
 * 变更 (2026-02-25):
 * - 删除与当前 Text 能力不一致或冗余的示例（tooltip 参数覆盖、无截断对比、Frame 响应式专属示例）
 * - 对齐角色化规则：移除截断示例中的 Tooltip 兄弟节点写法
 * - 调整 6/9 示例中的子用例容器约束，保证截断与 more 按钮展示稳定可复现
 */
export const examples = [
    {
        name: "1. 基础文本",
        code: `<Text>这是一段普通的文字，不会被截断。</Text>`,
        expected: { render: "源码预览与预编译运行包 SSR 均输出传入文字，水合后不递归且内容保持一致。" },
    },
    {
        name: "2. 语义化标签",
        code: `<Text tag="p">段落文本 (p)</Text>
<ul>
  <Text tag="li">列表项 (li)</Text>
</ul>
<Text tag="h3">标题 (h3)</Text>
<br>
<Text>文字</Text><Text tag="code">代码</Text><Text>文字</Text>`,
    },
    {
        name: "3. 单行截断 + 自动 Tooltip",
        code: `<div style="width: 10rem;" class="border-black-10 p-8 rounded-8">
    <Text lines={1}>
        这是一段很长很长的文字，单行截断时显示省略号，hover Tooltip 会显示完整内容。
    </Text>
</div>`,
    },
    {
        name: "4. 多行截断 (2行)",
        code: `<div style="width: 12rem;" class="border-black-10 p-8 rounded-8">
    <Text
        lines={2}
        tooltip="完整内容：这是一段非常长的文字，用于验证 lines=2 的多行截断。最多显示两行，超出部分用省略号表示。"
    >
        这是一段非常长的文字，用于验证 lines=2 的多行截断。最多显示两行，超出部分用省略号表示。这是一段非常长的文字。
    </Text>
</div>`,
    },
    {
        name: "5. 多行截断 (3行)",
        code: `<div style="width: 12rem;" class="border-black-10 p-8 rounded-8">
    <Text lines={3}>
        这是一段非常长的文字，用于验证 lines=3 的多行截断行为。最多显示三行内容，超出部分用省略号表示。这段文字需要足够长才能触发截断效果。
    </Text>
</div>`,
    },
    {
        name: "6. 可展开模式 (lines=0)",
        code: `<div>0</div>
<Frame
    data-expand-host
    class="border-black-10 p-4 rounded-8 overflow-hidden"
    style="width: 12rem; height: 3rem;"
>
    <Text lines={0} more>
        这是一段很长的文字，用于验证 lines=0 的可展开模式。当内容超出容器高度时，底部会显示渐变遮罩效果。点击展开按钮可以查看完整内容。这需要足够多的文字来触发截断。
    </Text>
</Frame>
<div>1</div>
<Frame
    data-expand-host
    class="border-black-10 p-8 rounded-8 overflow-hidden"
    style="width: 12rem; height: 5rem;"
>
    <Text lines={0} more>
        这是一段很长的文字，用于验证 lines=0 的可展开模式。当内容超出容器高度时，底部会显示渐变遮罩效果。点击展开按钮可以查看完整内容。这需要足够多的文字来触发截断。
    </Text>
</Frame>`,
    },
    {
        name: "7. 可展开模式 (未声明 as=more)",
        code: `<Text lines={0} style="width: 9.0rem; height: 4rem;" class="border-black-10 rounded-8 overflow-hidden">
  aaaaaaa aaaaa aaaa a aaaaaaa aaaaa aaaa a aaaaaaa aaaaa aaaa a a aaaaaaa aaaaa aaaa a
</Text>`,
    },
    {
        name: "8. 交互状态",
        code: `<Text>默认无 Hover 效果</Text>
<br>
<Text interactive={true}>显式开启 Hover 效果</Text>`,
    },
    {
        name: "9. 响应式文本样式",
        code: `<div>0</div>
<Text
        class="w-80 h-80 border-black-10"
        lines={3}
        enableResponsive
        responsive={{
            sm: { class: "text-14" },
            md: { class: "text-16" },
        }}
    >
        响应式文本示例：不同断点切换字号，同时保持 lines=3
        的截断上限。这段文字需要足够长来触发截断。响应式文本示例：不同断点切换字号，同时保持
        lines=3 的截断上限。这段文字需要足够长来触发截断。
    </Text>
    <div>1</div>
    <Text lines={1} class="w-80 h-20 border-black-10">
        这是一段很长很长的文字，单行截断时显示省略号，hover Tooltip 会显示完整内容。
    </Text>
    <div>2</div>
    <Text lines={2} class="w-80 h-40 border-black-10">
        这是一段很长很长的文字，单行截断时显示省略号，hover Tooltip 会显示完整内容。
    </Text>
    <div>3</div>
    <Text lines={3} class="w-80 h-80 border-black-10">
        这是一段很长很长的文字，单行截断时显示省略号，hover Tooltip 会显示完整内容。
    </Text>
    <div>4</div>
    <Text lines={0} class="w-80 h-40 border-black-10">
        这是一段很长很长的文字，单行截断时显示省略号，hover Tooltip 会显示完整内容。
    </Text>`,
    },
    {
        name: "Parts：配置截断 Tooltip",
        code: `Parts
<Text
    lines={1}
    class="w-80"
    parts={{ Tooltip: { variant: "light" } }}
>一段会被截断并显示提示的完整文字</Text>`,
        logic: ["Parts", "Tooltip"],
    },
] as const;
