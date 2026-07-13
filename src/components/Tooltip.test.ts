/**
 * Tooltip.test.ts
 * v1.3.0
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
    <Tooltip open variant="light">Tooltip</Tooltip>
</div>
<br />
<br />
<div>
    <Tooltip open>Tooltip</Tooltip>
</div>`,

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
                "任一 Tooltip 成功显示后，300ms 内 hover 另一个 Tooltip 时立即显示；共享外框保持挂载，内容更新并移动到当前按钮上方；等待超过 300ms 后恢复 600ms 首次延迟",
        },
        logic: ["Warmup", "Cooldown", "SharedDelay", "SharedOverlay"],
    },
] as const;
