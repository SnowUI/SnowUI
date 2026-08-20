/**
 * Toaster.test.ts
 * v1.0.0
 * 覆盖全局挂载、队列触发和位置分组的公开消费路径。
 */
export const examples = [
    {
        name: "TSR-01: 全局挂载与默认队列",
        code: `TSR-01
<Toaster />
<Button onclick={() => toast("Saved")}>Show Toast</Button>`,
        expected: {
            render: "点击后在默认位置显示 Saved Toast；应用只挂载一个 Toaster。",
            interaction: "新 Toast 进入全局队列，达到 duration 后自动退出；hover 可暂停当前可见栈计时。",
            accessibility: "Portal 根使用 aria-live=polite，只有最前方活动 Toast 进入 Tab 顺序。",
        },
        logic: ["Portal", "Queue", "Accessibility"],
    },
    {
        name: "TSR-02: 位置分组与最大可见层数",
        code: `TSR-02
<Toaster offset={16} maxVisible={3} gap={8} />
<Button onclick={() => toast({ text: "Bottom right", position: "bottom-right" })}>
    Bottom Right
</Button>`,
        expected: {
            render: "Toast 出现在右下区域，距视口边缘 16px。",
            interaction: "同一位置最多保留三层可见 Toast，超出项按队列规则推出。",
        },
        logic: ["Position", "Stack", "Limit"],
    },
] as const;
