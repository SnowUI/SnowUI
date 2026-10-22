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
        name: "MI-Line: 单行与复杂内容的显式边界",
        code: `MI-Line
<Frame column style="width: 200px;">
    <MenuItem selected gap={0}><Icon as="leading" icon={Bell} /><Text lines={1}>通知设置 Notification preferences</Text></MenuItem>
    <MenuItem singleLine={false}><Frame column gap={1}><Text>复杂内容</Text><Text>保留调用方多行结构</Text></Frame></MenuItem>
</Frame>`,
        expected: { layout: "默认单行保持附件及至少4px间距；复杂多行内容显式退出。" },
    },

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
        <Frame as="leading" singleLine>
            <Icon as="leading" icon={Resource.Tag} />
            <Text lines={1}>Tags</Text>
        </Frame>
        <Frame as="trailing" singleLine gap={1}>
            <Text lines={1} class="text-black-40">Multi-Select</Text>
            <Icon as="trailing" icon={Resource.CaretRight} class="text-black-20" />
        </Frame>
    </MenuItem>
</Popover>`,
        expected: {
            render: "MenuItem 使用直系 Frame as=leading 呈现 Tag 图标与 Tags,使用直系 Frame as=trailing 替换默认 check 呈现 Multi-Select 与箭头",
            layout: "leading 与 trailing 都作为整体槽位参与根级三槽位布局,复合槽位显式单行，leading 保持默认 8px，trailing 首选 4px，均不低于 4 CSS px",
        },
        logic: ["Popover", "Layout", "Icon"],
    },
    {
        name: "Locale: 默认中文与英文内置文案",
        code: `Locale
<Select value="docs" options={[{value:"docs",label:"业务选项"}]} parts={{Listbox:{search:true},Input:{allowCustomValue:true}}} />
<LocaleProvider locale="en-US">
<Select value="docs" options={[{value:"docs",label:"业务选项"}]} parts={{Listbox:{search:true},Input:{allowCustomValue:true}}} />
</LocaleProvider>`,
        expected: {
            render: "默认中文与英文Provider分别提供内置文案；业务内容保持原样",
            interaction: "打开选项，输入新名称后Enter创建；hover自定义项时删除名称随Provider语言变化",
        },
        logic: ["Locale", "ExplicitTextPriority", "BusinessContent"],
    },
] as const;






