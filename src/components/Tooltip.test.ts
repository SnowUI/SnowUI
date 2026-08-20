/**
 * Tooltip.test.ts
 * v1.8.2
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
                "任一 Tooltip 成功显示后，hover 其他 Tooltip 立即响应；横向、纵向或斜向切换中，若两个目标 Tooltip 矩形最短距离不超过 4px，先把新旧内容沿移动方向拼成间距为 4px 的内容带，内容带与共享圆角外框同帧进入 140–280ms 有界协调时间线；外框平滑加减速，内容轻微滞后并同步结束；连续快速改目标时从当前画面进入 70–120ms 重定向，不排队、不等待、不禁用裁切；目标间距超过 4px 时不拼接，新内容随外框一起移动；超过连续移动距离阈值时直接定位；离开全部触发器超过 300ms 后外框退出并恢复 450ms 首次延迟",
            accessibility:
                "prefers-reduced-motion: reduce 下直接定位到新 Tooltip，只保留新内容，不执行移动、尺寸或裁切过渡",
            performance:
                "多 Tooltip 实例只有唯一共享 Portal host 监听 Overlay、scroll、resize 和 reduced-motion；同帧的多次定位请求合并为一次，实例数增加不得线性增加全局监听",
        },
        logic: [
            "Warmup",
            "Cooldown",
            "SharedDelay",
            "SharedOverlay",
            "TwoDimensionalContentTrack",
            "FourPixelJoinThreshold",
            "ReducedMotion",
        ],
    },
    {
        name: "E2: 连续裁切动效调节器 (Motion Tuning)",
        code: `E2
<div class="p-40">
    <TooltipMotionController />
</div>`,
        expected: {
            render: "显示三个相邻 Tooltip 触发按钮，以及基础时长、最短 / 最长时长、距离增量和内容相位滞后控制项",
            interaction: "调整任一参数后，下一次相邻 Tooltip 连续切换立即使用新的有界协调时间线；调节器不构成 Tooltip 公开 API",
        },
        logic: ["MotionTuning", "TestOnly", "ContinuousTooltip"],
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
            interaction: "连续 hover 时共享外框按每个复杂内容的真实宽高移动和变形；满足 4px 门槛时内容带不重叠，快速改目标后只保留最新复杂内容",
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
