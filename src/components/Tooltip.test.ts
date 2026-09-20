/**
 * Tooltip.test.ts
 * v1.10.4
 */
export const examples = [
    {
        name: "短视口相邻长短提示连续切换",
        code: `<div style="display: flex; gap: 12px;">
<Button>权限<Tooltip>管理成员的访问权限</Tooltip></Button>
<Button>删除<Tooltip>删除此文件</Tooltip></Button>
</div>`,
        expected: {
            interaction: "在 800×220 和 375×220 视口中双向快速切换，外框与内容进入 moving，中心位置连续变化；内容长度差不能造成某一方向跳过过渡。远于 240px 的目标仍直接定位。",
        },
        logic: ["Continuous", "Responsive", "Retarget"],
    },
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
        expected: {
            interaction:
                "默认 top Tooltip 出现时，Foreground 从下向上滑入并更明显地放大；位移方向始终由碰撞计算后的最终 placement 决定",
            accessibility:
                "prefers-reduced-motion: reduce 下直接显示最终位置、尺寸、内容与可访问名称，不执行渐显、缩放或位移",
        },
        logic: ["Basic", "Composition"],
    },
    {
        name: "B1: 复杂内容 (Complex Content)",
        code: `B1
<div class="p-40">
    <Button>
        Complex Tooltip
        <Tooltip>
            <Frame column class="items-start gap-4">
                <Frame class="items-center gap-8">
                    <Text>构建已完成</Text>
                    <Badge variant="border" count="Ready" />
                </Frame>
                <Text class="text-12 text-48">所有检查均已通过</Text>
            </Frame>
        </Tooltip>
    </Button>
</div>`,

        expected: {
            render: "Tooltip 按真实复杂内容尺寸包裹两层排版、Text 与 Badge，不把内容退化为纯文本",
        },
        logic: ["Complex", "Snippet", "IntrinsicSize"],
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
<div class="p-40 flex-row gap-40">
    <div class="flex-col gap-12">
        <Text>开启宽度回弹</Text>
        <div class="flex-row gap-12">
            <Button>保存<Tooltip widthRebound>保存当前配置</Tooltip></Button>
            <Button>复制<Tooltip widthRebound>复制分享链接</Tooltip></Button>
            <Button>下载<Tooltip widthRebound>下载完整报告文件</Tooltip></Button>
        </div>
        <div class="flex-row gap-12">
            <Button>归档<Tooltip widthRebound>移动到团队归档区，稍后仍可恢复</Tooltip></Button>
            <Button>权限<Tooltip widthRebound>管理成员访问权限与角色</Tooltip></Button>
            <Button>删除<Tooltip widthRebound>删除后进入回收站，30 天内可以找回</Tooltip></Button>
        </div>
    </div>
    <div class="flex-col gap-12">
        <Text>关闭宽度回弹（默认）</Text>
        <div class="flex-row gap-12">
            <Button>保存<Tooltip>保存当前配置</Tooltip></Button>
            <Button>复制<Tooltip>复制分享链接</Tooltip></Button>
            <Button>下载<Tooltip>下载完整报告文件</Tooltip></Button>
        </div>
        <div class="flex-row gap-12">
            <Button>归档<Tooltip>移动到团队归档区，稍后仍可恢复</Tooltip></Button>
            <Button>权限<Tooltip>管理成员访问权限与角色</Tooltip></Button>
            <Button>删除<Tooltip>删除后进入回收站，30 天内可以找回</Tooltip></Button>
        </div>
    </div>
</div>`,
        expected: {
            render: "左侧显式开启 widthRebound，右侧使用默认关闭；两侧按钮与 Tooltip 内容一一对应",
            interaction:
                "两侧都保留连续移动与裁切揭示；左侧宽度使用 1000ms 欠阻尼回弹，内容交接结束后即使宽度仍在回弹，复制与下载间再次切换也使用完整普通内容时间线；右侧宽度随 180–360ms 协调时间线单调收敛且不越过目标宽度",
            accessibility:
                "prefers-reduced-motion: reduce 下直接定位到新 Tooltip，只保留新内容，不执行移动、尺寸或裁切过渡",
            performance:
                "多 Tooltip 实例只有唯一共享 Portal host 监听 Overlay、scroll、resize 和 reduced-motion；warm 切换在新内容提交后的首个可用绘制帧进入 moving，同帧的重复定位请求仍合并，实例数增加不得线性增加全局监听",
        },
        logic: [
            "Warmup",
            "Cooldown",
            "SharedDelay",
            "SharedOverlay",
            "TwoDimensionalContentTrack",
            "FourPixelJoinThreshold",
            "ReducedMotion",
            "FirstPaintSwitchStart",
        ],
    },
    {
        name: "E2: 宽度回弹对照 (Width Rebound Comparison)",
        code: `E2
<div class="p-40 flex-row gap-40">
    <div class="flex-col gap-12">
        <Button>开启 · 短<Tooltip widthRebound variant="dark">短提示</Tooltip></Button>
        <Button>开启 · 中<Tooltip widthRebound variant="dark">中等长度的提示内容</Tooltip></Button>
        <Button>开启 · 长<Tooltip widthRebound variant="dark">这是一段用于观察宽度变宽与缩小回弹的较长提示内容</Tooltip></Button>
    </div>
    <div class="flex-col gap-12">
        <Button>关闭 · 短<Tooltip variant="dark">短提示</Tooltip></Button>
        <Button>关闭 · 中<Tooltip variant="dark">中等长度的提示内容</Tooltip></Button>
        <Button>关闭 · 长<Tooltip variant="dark">这是一段用于观察宽度直接收敛的较长提示内容</Tooltip></Button>
    </div>
</div>`,
        expected: {
            render: "仅显示两列按钮与 dark Tooltip；左列显式开启回弹，右列使用默认关闭。长内容切换到短内容时，短内容在尚未收敛的外框中继续按 top placement 水平居中，不贴在外框左侧",
            interaction: "依次 hover 同列按钮即可直接比较有回弹与无回弹的宽度变化；两列都保留连续裁切揭示",
        },
        logic: ["WidthRebound", "Comparison", "ContinuousTooltip"],
    },
    {
        name: "E3: 复杂内容连续切换 (Complex Continuous Content)",
        code: `E3
<div class="p-40 flex-row gap-4">
    <Button>
        状态
        <Tooltip>
            <Frame column class="items-start gap-4">
                <Frame class="items-center gap-8">
                    <Text>部署状态</Text>
                    <Badge variant="border" count="Ready" />
                </Frame>
                <Text class="text-12 text-48">生产环境运行正常</Text>
            </Frame>
        </Tooltip>
    </Button>
    <Button>
        快捷键
        <Tooltip>
            <Frame class="items-center gap-8">
                <Text>打开命令面板</Text>
                <Kbd>⌘ K</Kbd>
            </Frame>
        </Tooltip>
    </Button>
    <Button>
        成员
        <Tooltip>
            <Frame column class="items-start gap-4">
                <Text>设计系统团队</Text>
                <Frame class="items-center gap-8">
                    <Badge count="8" />
                    <Text class="text-12 text-48">3 人正在编辑</Text>
                </Frame>
            </Frame>
        </Tooltip>
    </Button>
</div>`,
        expected: {
            render: "三个 Tooltip 分别保留多层 Frame、Badge、Kbd 与不同宽高的真实内容结构",
            interaction: "连续 hover 时共享外框按每个复杂内容的真实宽高移动和变形；满足 4px 门槛时内容带以 16px 间距拼接且不重叠，快速改目标后只保留最新复杂内容",
            accessibility: "旧复杂内容在交接期间 aria-hidden；最终 tooltip 只暴露最新内容",
        },
        logic: [
            "Complex",
            "ContinuousTooltip",
            "IntrinsicSize",
            "ContentIsolation",
        ],
    },
    {
        name: "E4: 快速重定向对照 (Rapid Retarget Comparison)",
        code: `E4
<div class="p-40 flex-row gap-40">
    <div class="flex-col gap-4">
        <Text>快速重定向（默认开启）</Text>
        <Button>保存<Tooltip>保存当前配置</Tooltip></Button>
        <Button>复制<Tooltip>复制分享链接</Tooltip></Button>
        <Button>下载<Tooltip>下载完整报告文件</Tooltip></Button>
    </div>
    <div class="flex-col gap-4">
        <Text>普通时间线</Text>
        <Button>保存<Tooltip rapidRetarget={false}>保存当前配置</Tooltip></Button>
        <Button>复制<Tooltip rapidRetarget={false}>复制分享链接</Tooltip></Button>
        <Button>下载<Tooltip rapidRetarget={false}>下载完整报告文件</Tooltip></Button>
    </div>
</div>`,
        expected: {
            interaction: "快速扫过同列按钮时，左列的中断段使用 90–160ms 缓出快速接管；右列始终使用普通 180–360ms 协调时间线。两列均从当前可见画面接管且不排队",
        },
        logic: ["RapidRetarget", "Comparison", "ContinuousTooltip"],
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
            interaction: "Tooltip 显示后，后代图标的 animationstart 与 Button ::before / ::after hover 背景 transition 不会使 Tooltip 消失",
        },
        logic: ["DismissOnMotion", "DescendantAnimation", "Regression"],
    },
    {
        name: "H1: 交互祖先触发 (Interactive Ancestor Trigger)",
        code: `H1
<div class="p-40">
    <a
        href="#tooltip-interactive-ancestor"
        aria-label="Avatar"
        style="display: inline-flex; width: 36px; height: 36px; align-items: center; justify-content: center;"
    >
        <span aria-hidden="true">●</span>
        <span style="width: 0; overflow: hidden; white-space: nowrap;">
            Avatar
            <Tooltip position="right">Avatar</Tooltip>
        </span>
    </a>
</div>`,
        expected: {
            render: "可见触发区只显示图标，内部 label 包装层为零宽",
            interaction: "hover 链接的任意可见区域时，Tooltip 使用完整链接作为触发与定位宿主，并显示在右侧",
        },
        logic: ["InteractiveAncestor", "Link", "CollapsedLabel", "Regression"],
    },
] as const;
