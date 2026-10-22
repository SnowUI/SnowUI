/**
 * Link.test.ts
 * v1.4.0
 *
 * 测试覆盖：Link.md 定义的默认视觉、Figma 样式 2 / 样式 3、hoverColor、
 * underline、external trailing Icon 替换与通用单行截断 Tooltip。
 */
export const examples = [
    {
        name: "L-Colors: 常态与悬停颜色",
        code: `L-Colors
<div style="display:flex;gap:16px;flex-wrap:wrap;">
<Link href="#">Default</Link>
<Link href="#" color="Black100">Black100</Link>
<Link href="#" color="Indigo">Indigo</Link>
<Link href="#" color="Orange">Orange</Link>
<Link href="#" color="Indigo" hoverColor={false}>Unchanged</Link>
<Link href="#" color="Black100" hoverColor="Orange">Explicit hover</Link>
</div>`,
        expected: { interaction: "默认 Black40 → Black100；Black100 → Black40；其他颜色 → Black100；显式 hoverColor 或 false 优先。" },
    },
    {
        name: "L-01: 默认样式与 Figma 变体",
        code: `L-01
<div class="flex-col gap-8">
    <Link href="#">默认 Link</Link>
    <Link href="#" variant="arrow">样式 2</Link>
    <Link href="#" variant="external">样式 3</Link>
</div>`,
        expected: {
            render: "所有变体默认 Black40，hover Black100；arrow 显示 12px ArrowUpRight；external 显示 12px ArrowSquareOut",
            interaction: "hover 时所有默认变体文字进入 Black100；trailing 箭头 / Icon 继承文字颜色并由 opacity 0.4 提升到 1",
        },
        logic: ["LINK-Init.1", "LINK-Variant.1"],
    },
    {
        name: "L-02: 下划线策略",
        code: `L-02
<div class="flex-col gap-8">
    <Link href="#" underline="always">常态下划线</Link>
    <Link href="#" underline="hover">悬停时出现下划线</Link>
    <Link href="#" underline="until-hover">悬停时隐藏下划线</Link>
    <Link href="#" variant="arrow" underline="always">箭头不带下划线</Link>
    <Link href="#" variant="external" underline="always">图标不带下划线</Link>
</div>`,
        expected: {
            render: "下划线只覆盖 Link 文字，不覆盖 arrow 或 external Icon",
            interaction: "underline=hover 仅在 hover 时显示下划线；underline=until-hover 常态显示，hover 时隐藏；禁用状态不响应 hover",
        },
        logic: ["LINK-Underline.1", "LINK-Underline.2"],
    },
    {
        name: "L-03: Hover 颜色覆盖",
        code: `L-03
<div class="flex-col gap-8">
    <Link href="#" hoverColor="#ff4747">自定义红色 Hover</Link>
    <Link href="#" variant="arrow" hoverColor={false}>样式 2 Hover 不变色</Link>
    <Link href="#" variant="external" hoverColor={false}>样式 3 Hover 不变色</Link>
</div>`,
        expected: {
            interaction: "hoverColor 接受 CSS 颜色；false 时文字保持常态颜色，trailing 装饰仍按规范由 opacity 0.4 提升到 1",
        },
        logic: ["LINK-Hover.1"],
    },
    {
        name: "L-04: 外置 trailing 替换内置 Icon",
        code: `L-04
<div class="flex-col gap-8">
    <Link href="#" variant="external">
        默认外链 Icon
    </Link>
    <Link href="#" variant="external">
        替换 trailing
        <Icon as="trailing"><ArrowUpRight /></Icon>
    </Link>
</div>`,
        expected: {
            render: "两个 Link 根均保持 Hug；第二个 Link 将外置 trailing 投影为根级直系槽位，清除格式空白并隐藏内置 ArrowSquareOut；文字缩短时 Icon 随文字左移，布局 gap 保持至少4px",
        },
        logic: ["LINK-Icon.1"],
    },
    {
        name: "L-05: 禁用与组合槽位",
        code: `L-05
<div class="flex-col gap-8">
    <Link href="#" disabled>禁用 Link</Link>
    <Link href="#">
        <Icon as="leading"><Star /></Icon>
        带 leading 的 Link
    </Link>
</div>`,
        expected: {
            render: "禁用 Link 使用全局 disabled 视觉；默认 16px 的外置 leading Icon 投影为 Link 根级直系槽位，参与 Frame 三槽位布局并与文字水平居中",
            interaction: "禁用 Link 不跳转、不响应 hover",
        },
        logic: ["LINK-Init.1", "LINK-Icon.1"],
    },
    {
        name: "L-06: 全变体文字截断",
        code: `L-06
<div class="flex-col gap-8 items-start">
    <Link href="#" lines={1} class="max-w-80">默认 Link 的完整长链接文字</Link>
    <Link href="#" variant="arrow" lines={1} class="max-w-80">Arrow Link 的完整长链接文字</Link>
    <Link href="#" variant="external" lines={1} class="max-w-80">External Link 的完整长链接文字</Link>
</div>`,
        expected: {
            render: "default、arrow、external 三种变体均在 80px 最大宽度内按完整单词 / Unicode 字素边界省略；arrow 与 external 的 trailing Icon 保持完整可见，并与省略符保持 Link 默认 gap",
            interaction: "仅当文字真实截断时，hover 截断文字会显示包含完整链接文字的 Tooltip；点击或聚焦任一 Link 后省略号保持显示，不退化为直接裁切",
            responsive: "容器尺寸变化后通过共享 TruncationController 重新检测截断状态",
        },
        logic: ["LINK-Truncation.1", "LINK-Truncation.2", "LINK-Truncation.3", "LINK-Truncation.4"],
    },
    {
        name: "LINK-Parts：配置内置 Tooltip",
        code: `LINK-Parts
<Link
    href="#"
    lines={1}
    class="max-w-80"
    parts={{ Tooltip: { variant: "light" } }}
>一段会被截断的完整链接文字</Link>`,
        logic: ["Parts", "Tooltip", "Truncation"],
    },
] as const;
