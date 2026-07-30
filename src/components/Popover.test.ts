/**
 * Popover.test.ts
 * v3.0.1
 *
 * 新 Popover 采用"模版 + ID 激活"模式(参考 Toast TS-10):
 * - <Popover template id="X"> 注册模版,触发按钮通过 data-popover-target="X" 关联
 * - 命令式 API: showPopover(id, anchorEl) / hidePopover(id) / togglePopover(id, anchorEl)
 * - v3.0.0 合并 QuickAction(size="sm") + SearchPopup(size="md");旧组件已删除
 *
 * 三种模式:
 * - 面板模式 (Panel,默认):<Popover>...</Popover> 直接渲染为内联面板
 * - 内嵌模式 (Inline):<Button>...<Popover as="popover">...</Popover></Button> 自动绑定宿主
 * - 模版模式 (Template):<Popover template id="X">...</Popover> 全局注册,跨组件激活
 *
 * 示例分组:
 * - POP-01 ~ POP-06: 模版模式核心 API(触发、尺寸、方位、关闭模式、多触发器共享模版)
 * - POP-10 ~ POP-15: 模版模式 + 原 QuickAction 能力(size="sm" + MenuItem)
 * - POP-20 ~ POP-22: 模版模式 + 原 SearchPopup 能力(size="md" + 自由组合)
 * - POP-30 ~ POP-33: 内嵌模式(as="popover" 自动绑定宿主父元素)
 */
export const examples = [
    /* ───────────────── 核心 API ───────────────── */
    {
        name: "POP-01:点击触发基础 Popover(size=sm)",
        code: `POP-01
<Popover template id="pop-01">
    <MenuItem>通知</MenuItem>
    <MenuItem>收藏</MenuItem>
    <MenuItem>分享</MenuItem>
</Popover>
<Button data-popover-target="pop-01">更多</Button>`,
        expected: {
            render: "点击按钮后出现小尺寸 Popover(padding 12 / radius 16),内容纵向排列且 gap 为 0",
            interaction: "再次点击按钮、点击空白区域或按 Escape 后关闭",
        },
        logic: ["Template", "Click", "OutsideClick", "Escape"],
    },
    {
        name: "POP-02:hover 延迟触发",
        code: `POP-02
<Popover template id="pop-02" trigger="hover">
    <Text>悬停 600ms 后展示</Text>
</Popover>
<Button data-popover-target="pop-02">悬停查看</Button>`,
        expected: {
            render: "hover 600ms 后出现 Popover",
            interaction: "移出触发器和 Popover 后 80ms 关闭,按 Escape 也可关闭",
        },
        logic: ["Template", "Hover", "Delay", "Escape"],
    },
    {
        name: "POP-03:尺寸档位 sm / md / lg",
        code: `POP-03
<Frame row class="gap-12 items-start">
    <Popover template id="pop-03-sm" size="sm">
        <Text>Small panel(padding 12 / radius 16)</Text>
    </Popover>
    <Popover template id="pop-03-md" size="md">
        <Text>Medium panel(padding 16 / radius 24)</Text>
    </Popover>
    <Popover template id="pop-03-lg" size="lg">
        <Text>Large panel(padding 24 / radius 32)</Text>
    </Popover>
    <Button data-popover-target="pop-03-sm">Small</Button>
    <Button data-popover-target="pop-03-md">Medium</Button>
    <Button data-popover-target="pop-03-lg">Large</Button>
</Frame>`,
        expected: {
            render: "sm padding 12px / radius 16px;md padding 16px / radius 24px;lg padding 24px / radius 32px",
        },
        logic: ["Size", "Padding", "Radius"],
    },
    {
        name: "POP-04:方位与视口避让",
        code: `POP-04
<Frame row class="gap-12">
    <Popover template id="pop-04-top" placement="top">
        <Text>Top placement</Text>
    </Popover>
    <Popover template id="pop-04-right" placement="right">
        <Text>Right placement</Text>
    </Popover>
    <Popover template id="pop-04-left" placement="left">
        <Text>Left placement</Text>
    </Popover>
    <Popover template id="pop-04-bottom" placement="bottom">
        <Text>Bottom(默认)placement</Text>
    </Popover>
    <Button data-popover-target="pop-04-top">Top</Button>
    <Button data-popover-target="pop-04-right">Right</Button>
    <Button data-popover-target="pop-04-left">Left</Button>
    <Button data-popover-target="pop-04-bottom">Bottom</Button>
</Frame>`,
        expected: {
            render: "优先按配置方位出现,距触发器 8px;靠近视口边缘时自动翻转或钳制到可视区域内",
        },
        logic: ["Placement", "Collision", "Offset"],
    },
    {
        name: "POP-05:手动关闭模式(closeOn=manual)",
        code: `POP-05
<Popover template id="pop-05" closeOn="manual" size="md">
    <Text>仅可通过内部按钮 / Escape 关闭</Text>
    <Frame row class="gap-8 pt-8">
        <Button onclick={() => hidePopover("pop-05")}>关闭</Button>
        <Button variant="filled" onclick={() => hidePopover("pop-05")}>确认</Button>
    </Frame>
</Popover>
<Button data-popover-target="pop-05">手动关闭模式</Button>`,
        expected: {
            interaction: "点击空白区域不会关闭;按 Escape 仍可关闭;内部按钮调用 hidePopover(id) 关闭",
        },
        logic: ["Template", "ManualClose", "Escape"],
    },
    {
        name: "POP-06:多触发器共享同一模版",
        code: `POP-06
<Popover template id="pop-06">
    <MenuItem>选项 A</MenuItem>
    <MenuItem>选项 B</MenuItem>
</Popover>
<Frame row class="gap-8">
    <Button data-popover-target="pop-06">触发器 1</Button>
    <Button data-popover-target="pop-06">触发器 2</Button>
    <Button data-popover-target="pop-06">触发器 3</Button>
</Frame>`,
        expected: {
            render: "三个按钮共享 id=pop-06 同一份模版内容;点击任一按钮 anchor 自动切换到该按钮",
            interaction: "再次点击当前 anchor 按钮关闭;点击空白或 Escape 关闭",
        },
        logic: ["Template", "SharedTemplate", "MultipleAnchors"],
    },

    /* ───────────────── 原 QuickAction 能力(size="sm") ───────────────── */
    {
        name: "POP-10:size=sm 基础菜单(原 QA-01)",
        code: `POP-10
<Popover template id="pop-10" size="sm" style="width: 16rem;">
    <MenuItem>
        <Icon as="leading"><Bell /></Icon>
        通知
    </MenuItem>
    <MenuItem>
        <Icon as="leading"><Bell /></Icon>
        收藏
    </MenuItem>
    <MenuItem>
        <Icon as="leading"><Bell /></Icon>
        分享
    </MenuItem>
</Popover>
<Button data-popover-target="pop-10">打开菜单</Button>`,
        expected: {
            render: "面板毛玻璃背景、圆角 16px、阴影,padding 12px;每项左侧带图标",
            layout: "面板宽度由 style 控制,MenuItem 充满面板宽度",
        },
        logic: ["Basic", "Panel", "MenuItem"],
    },
    {
        name: "POP-11:选中态(原 QA-02)",
        code: `POP-11
<Popover template id="pop-11" size="sm" style="width: 16rem;">
    <MenuItem selected>
        <Icon as="leading"><Bell /></Icon>
        已选中项(显示 check)
    </MenuItem>
    <MenuItem>
        <Icon as="leading"><Bell /></Icon>
        未选中项
    </MenuItem>
</Popover>
<Button data-popover-target="pop-11">选择</Button>`,
        expected: {
            render: "第一项右侧显示 check 图标,文字 black-100;其他项 check 隐藏,文字 black-80",
        },
        logic: ["Selected"],
    },
    {
        name: "POP-12:禁用态(原 QA-03)",
        code: `POP-12
<Popover template id="pop-12" size="sm" style="width: 16rem;">
    <MenuItem>
        <Icon as="leading"><Bell /></Icon>
        可用项
    </MenuItem>
    <MenuItem disabled>
        <Icon as="leading"><Bell /></Icon>
        禁用项
    </MenuItem>
</Popover>
<Button data-popover-target="pop-12">打开</Button>`,
        expected: {
            render: "禁用项 opacity 0.4,cursor not-allowed,点击无响应",
        },
        logic: ["Disabled"],
    },
    {
        name: "POP-13:closeOnSelect 策略(原 QA-09)",
        code: `POP-13
<Popover template id="pop-13" size="sm" style="width: 16rem;">
    <MenuItem>
        <Icon as="leading"><Bell /></Icon>
        点击选项默认关闭
    </MenuItem>
    <MenuItem closeOnSelect={false}>
        <Icon as="leading"><Bell /></Icon>
        点击后保持打开
    </MenuItem>
</Popover>
<Button data-popover-target="pop-13">打开</Button>`,
        expected: {
            interaction: "size=sm 默认点击选项后关闭;MenuItem 上 closeOnSelect={false} 可覆盖保持打开",
        },
        logic: ["CloseOnSelect"],
    },
    {
        name: "POP-14:点击回调(原 QA-06)",
        code: `POP-14
<Popover template id="pop-14" size="sm" style="width: 16rem;">
    <MenuItem onclick={() => alert("通知")}>
        <Icon as="leading"><Bell /></Icon>
        点击触发通知
    </MenuItem>
    <MenuItem onclick={() => alert("收藏")}>
        <Icon as="leading"><Bell /></Icon>
        点击触发收藏
    </MenuItem>
</Popover>
<Button data-popover-target="pop-14">操作</Button>`,
        expected: {
            interaction: "点击每项触发对应 onclick,禁用项无响应",
        },
        logic: ["Click", "Callback"],
    },
    {
        name: "POP-15:Input 固定头部 + 多项滚动(原 QA-07)",
        code: `POP-15
<Popover template id="pop-15" size="sm" style="width: 16rem; max-height: 12.5rem;">
    <Input as="search" placeholder="搜索命令..." />
    <MenuItem><Icon as="leading"><Bell /></Icon>新建任务</MenuItem>
    <MenuItem><Icon as="leading"><Bell /></Icon>打开收件箱</MenuItem>
    <MenuItem><Icon as="leading"><Bell /></Icon>标记为重要</MenuItem>
    <MenuItem><Icon as="leading"><Bell /></Icon>添加提醒</MenuItem>
    <MenuItem><Icon as="leading"><Bell /></Icon>移动到项目</MenuItem>
    <MenuItem><Icon as="leading"><Bell /></Icon>复制链接</MenuItem>
    <MenuItem><Icon as="leading"><Bell /></Icon>导出记录</MenuItem>
    <MenuItem><Icon as="leading"><Bell /></Icon>删除项目</MenuItem>
</Popover>
<Button data-popover-target="pop-15">命令面板</Button>`,
        expected: {
            render: "面板高度受 max-height 限制,MenuItem 超出时出现浮层滚动条",
            layout: "Input 由 Popover 内部布局,组合方式同 SearchPopup;滚动条复用 overlay-scrollbar",
        },
        logic: ["Input", "Scroll", "OverlayScrollbar"],
    },

    /* ───────────────── 原 SearchPopup 能力(size="md") ───────────────── */
    {
        name: "POP-20:size=md 占位面板(原 SP-01)",
        code: `POP-20
<Popover template id="pop-20" size="md" style="width: 20rem; height: 20rem;">
    <div style="width: 100%; min-height: 12rem; border-radius: var(--radius-4); background: rgba(0,0,0,0.04);" aria-hidden="true"></div>
</Popover>
<Button data-popover-target="pop-20">打开搜索浮层</Button>`,
        expected: {
            render: "中尺寸面板 padding 16 / radius 24,内部占位色块表示待填充的搜索结果区",
        },
        logic: ["Placeholder", "MediumSize"],
    },
    {
        name: "POP-21:size=md hover 信息卡",
        code: `POP-21
<Popover template id="pop-21" size="md" trigger="hover" style="width: 22rem;">
    <Frame column class="gap-8">
        <Text class="text-16 text-black-100">SnowUI Popover</Text>
        <Text class="text-14 text-black-80">通用浮层容器,合并 QuickAction 与 SearchPopup,支持模版 + ID 激活模式。</Text>
        <Frame row class="gap-8 pt-4">
            <Badge>v3.0.0</Badge>
            <Badge>OSS</Badge>
        </Frame>
    </Frame>
</Popover>
<Button data-popover-target="pop-21">悬停查看详情</Button>`,
        expected: {
            render: "悬停 600ms 后浮层出现,中尺寸 padding 16 / radius 24,适合放置富文本信息卡",
        },
        logic: ["Hover", "MediumSize", "InfoCard"],
    },
    {
        name: "POP-22:size=md 自由组合(原 SP-03)",
        code: `POP-22
<Popover template id="pop-22" size="md" closeOnSelect={false} style="width: 20rem;">
    <SearchInput placeholder="Search" />
    <MenuItem value="overview" active closeOnSelect={false}>
        <Icon as="leading"><Bell /></Icon>
        搜索历史:Overview
    </MenuItem>
    <MenuItem value="contact-byewind" closeOnSelect={true}>
        <Icon as="leading"><Bell /></Icon>
        联系人:Byewind
    </MenuItem>
</Popover>
<Button data-popover-target="pop-22">打开搜索</Button>`,
        expected: {
            interaction: "size=md 默认点击选项不关闭(沿用 SearchPopup);MenuItem 上 closeOnSelect={true} 覆盖关闭",
        },
        logic: ["MediumSize", "CloseOnSelect", "Composition"],
    },

    /* ───────────────── 内嵌模式 (as="popover") ───────────────── */
    {
        name: "POP-30:内嵌模式 - 点击按钮触发",
        code: `POP-30
<Button>
    更多
    <Popover as="popover">
        <MenuItem>通知</MenuItem>
        <MenuItem>收藏</MenuItem>
        <MenuItem>分享</MenuItem>
    </Popover>
</Button>`,
        expected: {
            render: "Popover 作为 Button 子节点,运行时自动发现 Button 为 anchor;无需 id 和 data-popover-target",
            interaction: "点击 Button 切换 Popover 显隐;点击空白 / Esc 关闭",
        },
        logic: ["Inline", "AutoAnchor", "Click"],
    },
    {
        name: "POP-31:内嵌模式 - hover 触发",
        code: `POP-31
<Button>
    悬停查看
    <Popover as="popover" trigger="hover" size="md">
        <Text>悬停 600ms 后展示中尺寸 Popover</Text>
    </Popover>
</Button>`,
        expected: {
            render: "hover Button 600ms 后出现 Popover",
            interaction: "鼠标移出 Button 和浮层 80ms 后关闭",
        },
        logic: ["Inline", "Hover", "MediumSize"],
    },
    {
        name: "POP-32:内嵌模式 - 任意宿主(Frame 包裹)",
        code: `POP-32
<Frame row class="gap-4 items-center p-8 rounded-12 bg-black-4">
    <Icon><Bell /></Icon>
    <Text>点击我</Text>
    <Popover as="popover" placement="top">
        <Text>宿主为 Frame,父元素整块区域均为触发器</Text>
    </Popover>
</Frame>`,
        expected: {
            render: "内嵌模式自动找到外层 Frame 作为 anchor;并非仅限 Button",
        },
        logic: ["Inline", "AnyHost", "Placement"],
    },
    {
        name: "POP-33:内嵌模式 - 手动关闭 + 多按钮",
        code: `POP-33
<Button>
    打开设置
    <Popover as="popover" closeOn="manual" size="lg">
        <Text>仅可通过按钮关闭(closeOn=manual)</Text>
        <Frame row class="gap-8 pt-8">
            <Button>取消</Button>
            <Button variant="filled">确认</Button>
        </Frame>
    </Popover>
</Button>`,
        expected: {
            render: "lg 尺寸 padding 24 / radius 32",
            interaction: "点击空白不关闭;Escape 关闭",
        },
        logic: ["Inline", "ManualClose", "LargeSize"],
    },
    {
        name: "P12：MenuItem 连续 Hover",
        code: `P12
<Popover><MenuItem>One</MenuItem><MenuItem active>Two</MenuItem></Popover>
<Popover continuousHover={false}><MenuItem>Fallback</MenuItem></Popover>`,
        expected: {
            render: "默认 Popover 的直接 MenuItem 共用一个 hover 层。",
            layout: "共享层限制在滚动内容区。",
            interaction: "背景连续移动；hover active 项时背景叠加加深；false 恢复逐项 hover。",
            performance: "不为每个 MenuItem 创建背景节点。",
            responsive: "滚动内容变化后重新测量。",
        },
        logic: ["ContinuousHover", "ActiveLayering", "OptOut"],
    },
] as const;
