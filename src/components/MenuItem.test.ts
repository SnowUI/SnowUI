/**
 * MenuItem.test.ts
 * v1.1.0(2026-05-15: QuickAction 合并入 Popover size="sm")
 *
 * 覆盖：MenuItem 在 Popover size="sm"(原 QuickAction 场景,独立 Props)
 * 与 Listbox(context 驱动)两种场景下的所有能力。
 * Icon 均为外置图标,使用 resource-svelte 标准素材。
 */
export const examples = [
    {
        name: "MI-01:Popover sm 内基础渲染(原 QuickAction 场景)",
        code: `MI-01
<Popover size="sm" style="width: 16rem;">
    <MenuItem as="item">
        <Icon as="leading"><Bell /></Icon>
        通知
    </MenuItem>
    <MenuItem as="item">
        <Icon as="leading"><Bell /></Icon>
        收藏
    </MenuItem>
    <MenuItem as="item">
        <Icon as="leading"><Bell /></Icon>
        分享
    </MenuItem>
</Popover>`,
        expected: {
            render: "面板带毛玻璃背景、圆角 16px、阴影;Item padding 8px 12px,图标左对齐,check 隐藏",
        },
        logic: ["Basic", "Popover"],
    },
    {
        name: "MI-02:Popover sm 内选中 / 禁用 / 活跃",
        code: `MI-02
<Popover size="sm" style="width: 16rem;">
    <MenuItem as="item" selected>
        <Icon as="leading"><Bell /></Icon>
        选中项(check 可见)
    </MenuItem>
    <MenuItem as="item" active>
        <Icon as="leading"><Bell /></Icon>
        活跃项(键盘高亮)
    </MenuItem>
    <MenuItem as="item" disabled>
        <Icon as="leading"><Bell /></Icon>
        禁用项
    </MenuItem>
    <MenuItem as="item">
        <Icon as="leading"><Bell /></Icon>
        普通项
    </MenuItem>
</Popover>`,
        expected: {
            render: "选中项 check opacity:1;活跃项背景 black-4;禁用项 opacity:0.4",
        },
        logic: ["Selected", "Active", "Disabled", "Popover"],
    },
    {
        name: "MI-03:Popover sm 内点击回调",
        code: `MI-03
<Popover size="sm" style="width: 16rem;">
    <MenuItem as="item" onclick={() => alert("通知")}>
        <Icon as="leading"><Bell /></Icon>
        点击触发通知
    </MenuItem>
    <MenuItem as="item" onclick={() => alert("收藏")}>
        <Icon as="leading"><Bell /></Icon>
        点击触发收藏
    </MenuItem>
    <MenuItem as="item" disabled onclick={() => alert("不会触发")}>
        <Icon as="leading"><Bell /></Icon>
        禁用(不触发)
    </MenuItem>
</Popover>`,
        expected: {
            interaction: "点击非禁用项触发对应 onclick;禁用项无响应",
        },
        logic: ["Click", "Disabled", "Popover"],
    },
    {
        name: "MI-04:Listbox 内基础渲染(context 自动接管)",
        code: `MI-04
<Select placeholder="请选择城市" style="width: 20rem;">
    <Listbox>
        <MenuItem as="item" value="shanghai">Shanghai</MenuItem>
        <MenuItem as="item" value="hangzhou">Hangzhou</MenuItem>
        <MenuItem as="item" value="shenzhen">Shenzhen</MenuItem>
    </Listbox>
</Select>`,
        expected: {
            render: "点击 Select 后浮层展开,MenuItem 自动注册;padding 为 8px",
            interaction: "点击选项后浮层收起,Select 显示选中文本",
        },
        logic: ["Listbox", "Context", "Padding"],
    },
    {
        name: "MI-05:Listbox 内搜索过滤",
        code: `MI-05
<Select placeholder="请选择城市" style="width: 20rem;">
    <Listbox>
        <Input as="search" placeholder="搜索..." />
        <MenuItem as="item" value="shanghai">Shanghai</MenuItem>
        <MenuItem as="item" value="hangzhou">Hangzhou</MenuItem>
        <MenuItem as="item" value="shenzhen">Shenzhen</MenuItem>
        <MenuItem as="item" value="beijing">Beijing</MenuItem>
    </Listbox>
</Select>`,
        expected: {
            render: "顶部显示搜索框;输入后实时过滤 MenuItem",
            interaction: "不匹配项 display:none;清空后恢复全量",
        },
        logic: ["Listbox", "Filter", "Search"],
    },
    {
        name: "MI-06:Listbox 内选中项对齐 Trigger",
        code: `MI-06
<Select defaultValue="hangzhou" style="width: 20rem;">
    <Listbox>
        <MenuItem as="item" value="shanghai">Shanghai</MenuItem>
        <MenuItem as="item" value="hangzhou">Hangzhou</MenuItem>
        <MenuItem as="item" value="shenzhen">Shenzhen</MenuItem>
    </Listbox>
</Select>`,
        expected: {
            render: "浮层打开后选中项(Hangzhou)与 Trigger 中心对齐,右侧显示 check",
        },
        logic: ["Listbox", "Selected", "Positioning"],
    },
    {
        name: "MI-07:Popover sm 与 Listbox padding 一致",
        code: `MI-07
<Popover size="sm" style="width: 16rem;">
    <MenuItem as="item">
        <Icon as="leading"><Bell /></Icon>
        Popover sm 项(8px)
    </MenuItem>
    <MenuItem as="item">
        <Icon as="leading"><Bell /></Icon>
        另一个操作项(8px)
    </MenuItem>
</Popover>`,
        expected: {
            render: "Popover sm 内 MenuItem 上下左右 padding 均为 8px,与 Listbox 场景一致",
        },
        logic: ["Popover", "Padding"],
    },
    {
        name: "MI-08:左右信息结构",
        code: `MI-08
<Popover size="sm" style="width: 29.75rem;">
    <MenuItem as="item">
        <Frame as="leading" row>
            <Icon icon={Resource.Tag} />
            <span>Tags</span>
        </Frame>
        <Frame as="trailing" style="gap:4px" row>
            <span class="text-black-40">Multi-Select</span>
            <Icon icon={Resource.CaretRight} class="text-black-20" />
        </Frame>
    </MenuItem>
</Popover>`,
        expected: {
            render: "MenuItem 使用直系 Frame as=leading 呈现 Tag 图标与 Tags,使用直系 Frame as=trailing 替换默认 check 呈现 Multi-Select 与箭头",
            layout: "leading 与 trailing 都作为整体槽位参与根级三槽位布局,复合槽位内部默认保持 8px gap",
        },
        logic: ["Popover", "Layout", "Icon"],
    },
] as const;






