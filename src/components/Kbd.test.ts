/**
 * Kbd.test.ts
 * v1.0.0
 * 示例修订：2026-10-24，组合键单行与局部滚动。
 *
 * 测试覆盖：Kbd.md 定义的所有功能点
 */
export const examples = [
    // === A: 基础功能 ===
    {
        name: "A1: 样式 A — 描边 (border)",
        code: `A1
<div class="flex-row gap-8 items-center">
    <Kbd>⌘K</Kbd>
    <Kbd>Ctrl</Kbd>
    <Kbd>Enter</Kbd>
    <Kbd>Esc</Kbd>
</div>`,
        logic: ["border"],
    },
    {
        name: "A2: 样式 B — 实心底色 (solid)",
        code: `A2
<div class="flex-row gap-8 items-center">
    <Kbd variant="solid">⌘K</Kbd>
    <Kbd variant="solid">Ctrl</Kbd>
    <Kbd variant="solid">Enter</Kbd>
    <Kbd variant="solid">Esc</Kbd>
</div>`,
        logic: ["solid"],
    },
    // === C: 组合模式 ===
    {
        name: "C1: 组合键",
        code: `C1
<ScrollArea axis="horizontal" ariaLabel="Command plus K" style="width: max-content; max-width: 100%;">
    <Frame singleLine gap={1} style="width: max-content;">
        <Kbd>⌘</Kbd>
        <span aria-hidden="true">+</span>
        <Kbd>K</Kbd>
    </Frame>
</ScrollArea>`,
        expected: {
            render: "原有两枚按键与加号保持单行，普通根字体间距4px；极窄容器局部横向滚动。",
            gap: "零间距或小根字体仍保留至少4 CSS px，较大首选值与恢复保留。",
        },
        logic: ["Composition"],
    },
    {
        name: "C2: 嵌入文本流",
        code: `C2
<div class="flex-row gap-4 items-center">
    按下 <Kbd>⌘K</Kbd> 打开搜索
</div>`,
        logic: ["Composition"],
    },
] as const;
