export const examples = [
    {
        name: "TB-01:显式 item 契约",
        code: `TB-01
<Tab value="web">
    <Button as="item" value="web"><Icon><FourLeafClover /></Icon>Web</Button>
    <Button as="item" value="mobile"><Icon><Star /></Icon>Mobile</Button>
</Tab>`,
        expected: { render: "仅 as=item 的 Button 成为 Tab 项；默认 pill 半透明背景使用 20px 背景模糊。", layout: "横向 pill。", interaction: "点击与方向键切换。", performance: "只扫描角色子项；模糊仅作用于小面积静态容器。", responsive: "跟随容器。" },
        logic: ["Contract", "Selection", "Keyboard"],
    },
    {
        name: "TB-02:Underline",
        code: `TB-02
<Tab variant="underline" value="a" size="md">
    <Button as="item" value="a">Alpha</Button>
    <Button as="item" value="b">Beta</Button>
</Tab>`,
        expected: { render: "激活项显示下划线。", layout: "中尺寸。", interaction: "切换激活项。", performance: "共享 indicator。", responsive: "跟随容器。" },
        logic: ["Variant", "Indicator"],
    },
    {
        name: "TB-03:Icon Toggle",
        code: `TB-03
<Tab variant="icon-toggle" value="web">
    <Button as="item" value="web"><Icon><FourLeafClover /></Icon><Text>Web</Text></Button>
    <Button as="item" value="mobile"><Icon><Star /></Icon><Text>Mobile</Text></Button>
</Tab>`,
        expected: { render: "非激活项隐藏文字。", layout: "宽度随内容变化。", interaction: "切换时由 Button 自己处理内部文字。", performance: "父级不穿透 Text。", responsive: "跟随容器。" },
        logic: ["PublicBridge", "ContentVisibility"],
    },
    {
        name: "TB-04:纵向与禁用项",
        code: `TB-04
<Tab column value="a">
    <Button as="item" value="a">Alpha</Button>
    <Button as="item" value="b" disabled>Beta</Button>
    <Button as="item" value="c">Gamma</Button>
</Tab>`,
        expected: { render: "纵向排列，禁用项保持禁用。", layout: "column。", interaction: "键盘导航跳过禁用项。", performance: "角色集合一次查询。", responsive: "跟随容器。" },
        logic: ["Column", "Disabled", "Keyboard"],
    },
    {
        name: "TB-05:Fill",
        code: `TB-05
<Tab fill value="web" style="width: 320px">
    <Button as="item" value="web">Web</Button>
    <Button as="item" value="mobile">Mobile</Button>
    <Button as="item" value="desktop">Desktop</Button>
</Tab>`,
        expected: { render: "三个 item 等宽。", layout: "填满 320px。", interaction: "切换选中项。", performance: "无额外包装。", responsive: "容器变宽时等分。" },
        logic: ["Fill", "Contract"],
    },
    {
        name: "TB-06:Bare",
        code: `TB-06
<Tab variant="bare" value="random">
    <Button as="item" value="all">All</Button>
    <Button as="item" value="random">Random</Button>
    <Button as="item" value="icon" iconOnly aria-label="收藏"><Icon><Star /></Icon></Button>
</Tab>`,
        expected: { render: "文字和单 Icon Item 均无外壳，激活项 100%、未激活项 40%。", layout: "容器与按钮均无 padding 和圆角，间距由 Tab gap 控制。", interaction: "hover 与切换只改变 opacity。", performance: "复用既有 Tab item 扫描和 Button 变量桥接。", responsive: "跟随 Tab 与 Button 尺寸档位。" },
        logic: ["Contract", "Selection", "Bare", "OpacityOverride"],
    },
    {
        name: "TB-07:全部变体与尺寸",
        code: `TB-07
<Frame column class="gap-24">
    <Frame column class="gap-8">
        <Text>pill</Text>
        <Frame row wrap class="gap-16 items-center">
            <Tab variant="pill" size="sm" value="all"><Button as="item" value="all">All</Button><Button as="item" value="random">Random</Button></Tab>
            <Tab variant="pill" size="md" value="all"><Button as="item" value="all">All</Button><Button as="item" value="random">Random</Button></Tab>
            <Tab variant="pill" size="lg" value="all"><Button as="item" value="all">All</Button><Button as="item" value="random">Random</Button></Tab>
        </Frame>
    </Frame>
    <Frame column class="gap-8">
        <Text>solid</Text>
        <Frame row wrap class="gap-16 items-center">
            <Tab variant="solid" size="sm" value="all"><Button as="item" value="all">All</Button><Button as="item" value="random">Random</Button></Tab>
            <Tab variant="solid" size="md" value="all"><Button as="item" value="all">All</Button><Button as="item" value="random">Random</Button></Tab>
            <Tab variant="solid" size="lg" value="all"><Button as="item" value="all">All</Button><Button as="item" value="random">Random</Button></Tab>
        </Frame>
    </Frame>
    <Frame column class="gap-8">
        <Text>underline</Text>
        <Frame row wrap class="gap-16 items-center">
            <Tab variant="underline" size="sm" value="all"><Button as="item" value="all">All</Button><Button as="item" value="random">Random</Button></Tab>
            <Tab variant="underline" size="md" value="all"><Button as="item" value="all">All</Button><Button as="item" value="random">Random</Button></Tab>
            <Tab variant="underline" size="lg" value="all"><Button as="item" value="all">All</Button><Button as="item" value="random">Random</Button></Tab>
        </Frame>
    </Frame>
    <Frame column class="gap-8">
        <Text>icon-toggle</Text>
        <Frame row wrap class="gap-16 items-center">
            <Tab variant="icon-toggle" size="sm" value="all"><Button as="item" value="all"><Icon><FourLeafClover /></Icon><Text>All</Text></Button><Button as="item" value="random"><Icon><Star /></Icon><Text>Random</Text></Button></Tab>
            <Tab variant="icon-toggle" size="md" value="all"><Button as="item" value="all"><Icon><FourLeafClover /></Icon><Text>All</Text></Button><Button as="item" value="random"><Icon><Star /></Icon><Text>Random</Text></Button></Tab>
            <Tab variant="icon-toggle" size="lg" value="all"><Button as="item" value="all"><Icon><FourLeafClover /></Icon><Text>All</Text></Button><Button as="item" value="random"><Icon><Star /></Icon><Text>Random</Text></Button></Tab>
        </Frame>
    </Frame>
    <Frame column class="gap-8">
        <Text>bare</Text>
        <Frame row wrap class="gap-16 items-center">
            <Tab variant="bare" size="sm" value="all"><Button as="item" value="all">All</Button><Button as="item" value="random">Random</Button></Tab>
            <Tab variant="bare" size="md" value="all"><Button as="item" value="all">All</Button><Button as="item" value="random">Random</Button></Tab>
            <Tab variant="bare" size="lg" value="all"><Button as="item" value="all">All</Button><Button as="item" value="random">Random</Button></Tab>
        </Frame>
    </Frame>
</Frame>`,
        expected: { render: "pill、solid、underline、icon-toggle、bare 各自完整展示 sm、md、lg 三档，Tab size 同步成为 Item Button 的默认 size。", layout: "五行 variant 分组，每行三个尺寸并允许窄屏换行。", interaction: "每组均可独立点击和键盘切换。", performance: "每个 Tab 只维护自身共享 indicator。", responsive: "示例容器不足时按 variant 分组换行。" },
        logic: ["Variant", "Size", "Indicator", "Contract"],
    },
    {
        name: "TB-08:Item 尺寸覆盖优先级",
        code: `TB-08
<Tab variant="solid" size="lg" value="inherit">
    <Button as="item" value="inherit">继承 Tab lg</Button>
    <Button as="item" value="size" size="sm">Button size sm</Button>
    <Button as="item" value="class" size="lg" class="text-12 p-4">Class 覆盖 lg</Button>
    <Button as="item" value="style" size="lg" class="text-12 p-4" style="font-size: 18px; padding: 8px;">Style 覆盖 class</Button>
</Tab>`,
        expected: { render: "四个 Item 依次验证 Tab 默认 lg、Button size sm、class 覆盖 lg、style 覆盖 class。", layout: "Tab 容器始终使用 lg 的 padding、radius 和 gap；Item 遵循 style > class > Button size > Tab size。", interaction: "四个不同覆盖层级的 Item 均可切换。", performance: "通过组合 Context 与 CSS 原生层叠实现，不复制 Button 尺寸 CSS。", responsive: "Item 的显式覆盖不改变 Tab 容器尺寸。" },
        logic: ["Size", "Contract", "Override"],
    },
    {
        name: "TB-09:items 默认内置 Button",
        code: `TB-09
<Tab
    value="overview"
    items={[
        { value: "overview", label: "Overview" },
        { value: "activity", label: "Activity" },
        { value: "settings", label: "Settings" }
    ]}
/>`,
        logic: ["BuiltInMode", "Parts", "Button"],
    },
    {
        name: "TB-10:Icon Toggle 默认内置模式",
        code: `TB-10
<Tab
    variant="icon-toggle"
    value="web"
    items={[
        { value: "web", label: "Web", icon: FourLeafClover },
        { value: "mobile", label: "Mobile", icon: Star }
    ]}
/>`,
        expected: {
            render: "Tab 根据 items 内置生成两个 Button，并为每项生成 Icon + Text。",
            layout: "激活项显示图标与文字，非激活项只显示图标，宽度随内容平滑变化。",
            interaction: "点击或键盘切换后，新激活项展开文字，原激活项收起文字。",
            performance: "复用默认内置 Button 与现有 icon-toggle indicator / 宽度动效。",
            responsive: "跟随 Tab 容器与 size 档位。",
        },
        logic: ["BuiltInMode", "IconToggle", "Icon", "Text"],
    },
];
