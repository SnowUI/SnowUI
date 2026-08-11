/**
 * Tooltip.test.ts
 * v1.5.1
 */
export const examples = [
    {
        name: "A1: 基础提示 (Composition)",
        code: `A1
<div class="p-40">
    <Button>
        Hover Me
        <Tooltip>
            Simple Tooltip
        </Tooltip>
    </Button>
</div>`,

        logic: ["Basic", "Composition"],
    },
    {
        name: "B1: 复杂内容 (Complex Content)",
        code: `B1
<div class="p-40">
    <Button>
        Complex Tooltip
        <Tooltip>
            <div class="flex-row items-center gap-8">
                <span>Tooltip with</span>
                <Button size="sm" variant="filled" theme="dark">Button</Button>
            </div>
        </Tooltip>
    </Button>
</div>`,

        logic: ["Complex"],
    },
    {
        name: "C1: 静态模式 (Static Mode)",
        code: `C1
<div>
    <Tooltip open>Default Light Tooltip</Tooltip>
</div>
<br />
<br />
<div>
    <Tooltip open variant="dark">Dark Tooltip</Tooltip>
</div>`,

        expected: {
            render: "未传 variant 时使用 light 外观；显式 variant=dark 时保留 dark 外观",
        },
        logic: ["Static"],
    },
    {
        name: "D1: 自动内容 (Auto Content)",
        code: `D1
<div class="p-40">
    <div style="width: 100px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; border: 1px solid #ccc; padding: 4px;">
        This is a very long text that will be truncated.
        <Tooltip />
    </div>
    <p class="text-12 text-black-40 mt-8">注：当 Tooltip 为空时，自动抓取父级元素的文本内容。</p>
</div>`,

        logic: ["Auto"],
    },
    {
        name: "E1: 共享延迟切换 (Warmup / Cooldown)",
        code: `E1
<div class="p-40 flex-row gap-12">
    <Button>
        保存
        <Tooltip>保存当前配置</Tooltip>
    </Button>
    <Button>
        复制
        <Tooltip>复制分享链接</Tooltip>
    </Button>
    <Button>
        下载
        <Tooltip>下载完整报告文件</Tooltip>
    </Button>
    <Button>
        归档
        <Tooltip>移动到团队归档区，稍后仍可恢复</Tooltip>
    </Button>
    <Button>
        权限
        <Tooltip>管理成员访问权限与角色</Tooltip>
    </Button>
    <Button>
        删除
        <Tooltip>删除后进入回收站，30 天内可以找回</Tooltip>
    </Button>
</div>
<div class="p-40 flex-row gap-12">
    <Button>
        保存
        <Tooltip>保存当前配置</Tooltip>
    </Button>
    <Button>
        复制
        <Tooltip>复制分享链接</Tooltip>
    </Button>
    <Button>
        下载
        <Tooltip>下载完整报告文件</Tooltip>
    </Button>
    <Button>
        归档
        <Tooltip>移动到团队归档区，稍后仍可恢复</Tooltip>
    </Button>
    <Button>
        权限
        <Tooltip>管理成员访问权限与角色</Tooltip>
    </Button>
    <Button>
        删除
        <Tooltip>删除后进入回收站，30 天内可以找回</Tooltip>
    </Button>
</div>`,
        expected: {
            render: "多个相邻按钮分别显示不同 Tooltip 内容",
            interaction:
                "任一 Tooltip 成功显示后，300ms 内 hover 另一个 Tooltip 时立即显示；指针穿过相邻按钮 gap 并停留 150ms 时，共享外框仍保持挂载，内容更新并移动到当前按钮上方；离开全部触发器超过 300ms 后外框退出并恢复 450ms 首次延迟",
        },
        logic: ["Warmup", "Cooldown", "SharedDelay", "SharedOverlay"],
    },
    {
        name: "F1: 动效感知立即关闭 (Dismiss On Motion)",
        code: `F1
<Frame
    style="width: 160px; transition: width 500ms ease-out;"
>
    <Button onclick={(event) => {
        const host = event.currentTarget.parentElement;
        if (host) host.style.width = host.offsetWidth < 200 ? "240px" : "160px";
    }}>
        切换容器宽度
        <Tooltip position="right">动效开始前关闭</Tooltip>
    </Button>
</Frame>`,
        expected: {
            render: "Tooltip 默认显示在按钮右侧",
            interaction: "Tooltip 已显示时点击按钮，祖先 Frame 的 width transition 开始即立即卸载 Tooltip，不播放退出动效",
            performance: "仅 Tooltip 显示期间启用 document 级共享监听；无逐帧布局读取、ResizeObserver 或 MutationObserver；颜色和背景过渡不会触发关闭",
        },
        logic: ["DismissOnMotion", "ImmediateDismiss", "Performance"],
    },
    {
        name: "G1: 后代装饰动效保持提示 (Descendant Animation)",
        code: `G1
<div class="p-40">
    <Button class="tooltip-descendant-animation-trigger">
        <span class="tooltip-descendant-animation-icon">✦</span>
        动画图标
        <Tooltip>后代装饰动效不关闭提示</Tooltip>
    </Button>
</div>

<style>
    .tooltip-descendant-animation-trigger:hover .tooltip-descendant-animation-icon {
        animation: tooltip-test-spin 1200ms linear infinite;
    }

    @keyframes tooltip-test-spin {
        to { transform: rotate(360deg); }
    }
</style>`,
        expected: {
            render: "按钮内图标 hover 后持续旋转",
            interaction: "Tooltip 显示后，后代图标的 animationstart 不会使 Tooltip 消失",
        },
        logic: ["DismissOnMotion", "DescendantAnimation", "Regression"],
    },
] as const;
