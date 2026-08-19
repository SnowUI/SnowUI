/**
 * Button.test.ts
 * v1.12.0
 * 变更记录 (2026-08-19): hover 颜色层改为 300ms ease-in-out 渐现 / 渐隐，慢于 200ms 背景外扩。
 * 变更记录 (2026-08-19): hover 从按尺寸比例 scale 改为固定像素背景扩张；sm/md/lg 的背景总宽、总高统一增加 2px。
 * 变更记录 (2026-08-19): lg hover 背景层终点改为 1.015；hover 背景颜色立即切换，不执行 opacity 渐现或渐隐。
 * 变更记录 (2026-08-19): hover 背景层终点比例按最终尺寸改为 sm 1.05、md 1.03、lg 1.01。
 * 变更记录 (2026-08-19): Button hover 背景层终点比例由 1.06 调整为 1.05。
 * 变更记录 (2026-08-19): hover 基础背景与颜色叠层分离，放大只动画 transform，颜色反馈只动画叠层 opacity，避免 scale 期间逐帧重绘 color-mix 背景。
 * 变更记录 (2026-08-19): A1 覆盖独立动作只放大背景层到 1.06、内容保持原尺寸及 scaleOnHover 独立关闭；Borderless 保留原色并扩张，bare 不增加背景或缩放内容。
 * 变更记录 (2026-08-16): A1/A2 明确验证 filled 的 Static White 前景色不受宿主基线加载顺序影响。
 * 变更记录 (2026-08-11): icon-only 改为显式 iconOnly=true；未声明等同于 false。
 * 变更记录 (2026-08-09): bare 默认 100% 不透明，新增 emphasis="muted" 示例覆盖 40% → hover 100%。
 * 变更记录 (2026-07-05): 新增 backgroundBlur 开启状态示例。
 * 变更记录 (2026-05-18): 新增 B6 复制按钮示例，覆盖 P0.2 瞬时反馈模式：副作用挂 onclick，状态切换与内容回弹由 Frame 接管。
 * 变更记录 (2026-03-15): 修复 B3 图标按钮示例运行时错误，示例下拉图标改为 test 沙箱已注入的 `ArrowLineDown`。
 * 变更记录 (2026-02-04): H1 示例使用 Icon 组件，避免未导入的 Command 组件导致运行时错误。
 * 变更记录 (2026-02-26): 修复 B1/B2/D1/F1/G1/G2/G3/H1 示例为当前 Button/Frame 能力；重写 H2 为直观对比并补充说明。
 * 变更记录 (2026-02-26): D1 右侧改为 C6 同款状态链流转；G1 增加 count 加减与 FlowText 数字滚动动效。
 * 变更记录 (2026-02-26): D1 改为“仅 Button”点击状态流：Ready -> Loading -> Completed -> Disabled，并去除额外点击动效。
 * 变更记录 (2026-02-26): D1 改为纯 Frame 状态链能力（Button 透传 currentState），移除手动 DOM 状态推进。
 * 变更记录 (2026-02-26): 修复 D1 按钮不可点击（移除 whileLoad/whileActive，避免触发 skeleton 的 pointer-events:none）。
 * 变更记录 (2026-02-26): D1 改为 Frame 通用 stateVars 写法（去除 stateText 特化能力）。
 * 变更记录 (2026-02-26): D1 升级为 Frame 默认动效示例：Idle(无图标) -> Load(Spinner+文案) -> Active(Check+文案)，Active 再次点击回 Idle。
 * 变更记录 (2026-02-26): D1 简化为纯 Button 状态链示例（移除内嵌 Frame 与显式 whileAppear/whileDisappear）。
 * 变更记录 (2026-03-02): 修复 examples 数组末尾缺少逗号导致的语法错误（esbuild: Expected "]" but found "{")。
 */
export const examples = [
    {
        name: "A1: 基础样式 (Styles)",
        code: `A1
<Button>Default</Button>
<Button variant="gray">Gray</Button>
<Button variant="filled">Filled</Button>
<Button variant="outline">Outline</Button>
<Button variant="borderless">Borderless</Button>
<Button bare>Bare</Button>
<Button scaleOnHover={false}>No scale</Button>
<Button bare iconOnly aria-label="减少"><Minus /></Button>`,

        expected: {
            render: "全部 variant 与 bare 保持各自原有背景、边框和前景色。",
            layout: "hover 缩放只影响绘制，Button 与自适应父容器的布局尺寸不变。",
            interaction: "独立动作默认只扩张背景层；sm、md、lg 的背景总宽与总高都增加 2px（四边各 1px），文字与 Icon 保持原尺寸。hover 背景颜色以 300ms ease-in-out 渐现 / 渐隐，慢于 200ms ease 外扩；scaleOnHover=false、disabled 与复合控件项不放大；Borderless 使用同一像素扩张与颜色渐现，bare 不出现背景或内置放大。",
            performance: "基础背景层只动画绝对定位 inset；hover 颜色叠层只动画 opacity，不逐帧重算 color-mix 背景，也不触发布局重排。",
            responsive: "固定 2px 背景增量不随 Button size、内容宽度或根字号改变。",
            accessibility: "prefers-reduced-motion: reduce 下直接提交四边 1px 外扩和最终颜色，不执行 inset 或 opacity 过渡。",
        },

        logic: ["Style", "Motion", "Layout", "Accessibility"],
    },
    {
        name: "A2: 尺寸 (Sizes)",
        code: `A2
<div class="flex-col gap-8">
    <div class="flex-row gap-8 items-center">
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
    </div>
    <div class="flex-row gap-8 items-center">
        <Button variant="filled" size="sm">Small</Button>
        <Button variant="filled" size="md">Medium</Button>
        <Button variant="filled" size="lg">Large</Button>
    </div>
</div>`,
        expected: {
            render: "三种尺寸的 filled Button 均保持 Primary 背景与 Static White 文字，文字清晰可见。",
            layout: "尺寸与原有 padding、圆角和内容布局不变。",
            interaction: "hover 以 300ms ease-in-out 渐现既有 overlay，并将 sm/md/lg 背景层的总宽、总高统一增加 2px，不改变前景色或内容尺寸。",
            performance: "宿主基线与组件样式的先后加载不影响 filled 前景色。",
            responsive: "sm、md、lg 使用同一变体颜色契约。",
        },
        logic: ["Size", "FilledColor", "CascadeOrder"],
    },
    {
        name: "A3: 禁用状态 (Disabled)",
        code: `A3
<div class="flex-row gap-8">
    <Button disabled>Gray</Button>
    <Button variant="filled" disabled>Filled</Button>
    <Button variant="outline" disabled>Outline</Button>
    <Button variant="borderless" disabled>Borderless</Button>
</div>`,

        logic: ["State"],
    },
    {
        name: "A4: 无外壳按钮 (Bare)",
        code: `A4
<div class="flex-row gap-12 items-center">
    <Button bare>All</Button>
    <Button bare iconOnly aria-label="四叶草"><FourLeafClover size={24} /></Button>
    <Button bare emphasis="muted">Muted</Button>
    <Button bare disabled>Disabled</Button>
</div>`,

        expected: {
            render: "无外壳按钮可包含文字或 Icon，无 padding、圆角、背景和边框；默认保持 100% 不透明，muted 为 40%。",
            layout: "按钮尺寸由内部内容自然撑开。",
            interaction: "默认按钮 hover 时透明度不变；muted hover 时由 40% 提升到 100%，禁用按钮不响应 hover。",
            performance: "仅通过 Button class 与 CSS 变量切换视觉。",
            responsive: "字号与行高继续跟随 Button size。",
        },
        logic: ["Style", "State", "Bare"],
    },
    {
        name: "A5: 背景模糊 (Background Blur)",
        code: `A5
<div class="bg-gradient-indigo p-40 rounded-12">
    <Button size="md" variant="gray" backgroundBlur>
        Background Blur
    </Button>
</div>`,
        expected: {
            render: "gray Button 保持半透明背景，并模糊按钮背后的渐变内容。",
            layout: "Button 使用 md 尺寸，外层仅提供便于观察模糊效果的背景。",
            interaction: "hover 与点击行为保持普通 gray Button 语义。",
            performance: "仅在显式 backgroundBlur 时启用 backdrop-filter。",
            responsive: "按钮尺寸与模糊强度不随示例容器变化。",
        },
        logic: ["Style", "BackgroundBlur"],
    },
    {
        name: "B1: 内容组合 (Composition)",
        code: `B1
<Button>
    <Icon><FourLeafClover /></Icon>
    Search
</Button>
<Button variant="filled">
    <Icon><FourLeafClover /></Icon>
    Search
</Button>

<Button size="sm">
    <Icon><FourLeafClover /></Icon>
    Small
</Button>
<Button size="lg">
    <Icon><FourLeafClover /></Icon>
    Large
</Button>`,

        logic: ["Composition"],
    },
    {
        name: "B2: 纯图标按钮 (Icon Only)",
        code: `B2
<Button aria-label="未声明 iconOnly">
    <FourLeafClover />
</Button>
<Button iconOnly size="sm" aria-label="四叶草">
    <FourLeafClover />
</Button>
<Button iconOnly size="md" aria-label="四叶草">
    <FourLeafClover />
</Button>
<Button iconOnly size="lg" aria-label="四叶草">
    <FourLeafClover />
</Button>`,

        expected: {
            render: "未声明 iconOnly 的 Button 使用普通内容布局；后三个显式 iconOnly Button 使用对应尺寸的对称 padding。",
            layout: "iconOnly=false 不根据单个 SVG 自动改变布局；iconOnly=true 的 sm/md/lg 使用 4/8/12px 四边 padding。",
            interaction: "所有按钮保持普通 Button 交互；纯图标按钮通过 aria-label 提供可访问名称。",
        },
        logic: ["Composition"],
    },
    {
        name: "B3: Bare 单 Icon 与混合内容",
        code: `B3
<div class="flex-col gap-12">
    <div class="flex-row gap-8 items-center">
        <Button bare iconOnly aria-label="减少">
            <Minus size={12} />
        </Button>
        <Button bare iconOnly aria-label="筛选">
            <FourLeafClover size={16} />
        </Button>
        <Button bare iconOnly size="lg" variant="filled" aria-label="展开">
            <ArrowLineDown />
        </Button>
        <Button bare iconOnly aria-label="增加">
            <Plus size={24} />
        </Button>
    </div>
    <div class="flex-row gap-8 items-center p-8 rounded-12 bg-surface-1">
        <Input placeholder="搜索内容" />
        <Button bare iconOnly size="md" variant="outline" aria-label="展开筛选">
            <ArrowLineDown />
        </Button>
        <Button bare iconOnly aria-label="清空输入">
            <Minus size={16} />
        </Button>
    </div>
    <div class="flex-row gap-8 items-center">
        <Button bare variant="filled">
            仅文本内容
        </Button>
        <Button bare size="lg" variant="outline">
            <FourLeafClover />
            带文字图标
        </Button>
    </div>
    <div class="text-12 text-black-40">
        说明：bare 忽略 filled/outline 等 variant 的视觉结果。显式 iconOnly 的单视觉内容继承当前 size 档位的 12/16/20px 尺寸上下文，并获得至少 16×16px 的透明点击热区；未声明 iconOnly 等同于 false。精确尺寸直接声明在子 Icon 上，Icon + 文字继续保留普通 Button 的内容 gap。
    </div>
</div>`,

        logic: ["Composition", "State"],
    },
    {
        name: "B4: Toggle 切换 (toggle prop 语法糖 / 等价完整声明)",
        code: `B4
<div class="flex-col gap-16">
    <div class="flex-row gap-8 items-center">
        <Button toggle>
            <Icon><Bell /></Icon>
            通知
        </Button>
        <Button variant="outline" toggle>
            <Icon><Star /></Icon>
            收藏
        </Button>
        <Button
            whileClick={false}
            Click={{ Idle: "Active", Active: "Idle" }}
        >
            <Icon><Heart /></Icon>
            等价完整写法
        </Button>
    </div>
    <div class="text-12 text-black-40">
        说明:Toggle 由 Frame 状态机驱动。&lt;Button toggle&gt; 是语法糖,内部自动注入 Click={"{ Idle: 'Active', Active: 'Idle' }"} 与 whileClick=false;Active 状态由 Frame 自动暴露的 data-state=&quot;Active&quot; 触发 Secondary/Indigo 配色(与 Tag variant=&quot;active&quot; 一致);aria-pressed 由 Frame 自动输出。消费方需要复杂状态机时绕过 toggle 直接写 Click 字典即可。
    </div>
</div>`,

        logic: ["Toggle", "State"],
    },
    {
        name: "B5: 瞬时反馈 (Click + Active=[Idle,auto])",
        code: `B5
<div class="flex-col gap-16">
    <div class="flex-row gap-8 items-center">
        <Button
            variant="outline"
            whileClick={false}
            Click="Active"
            Active={["Idle", "auto"]}
            whileActive={{ duration: 2000 }}
        >
            <Icon><Paperclip /></Icon>
            复制内容
        </Button>
        <Button
            variant="filled"
            whileClick={false}
            Click="Active"
            Active={["Idle", "auto"]}
            whileActive={{ duration: 1500 }}
            stateClass={{ Idle: "", Active: "opacity-40" }}
        >
            <Icon><PaperPlaneRight /></Icon>
            发送
        </Button>
    </div>
    <div class="text-12 text-black-40">
        说明:Click="Active" 进入 Active;Active={"[\\"Idle\\", \\"auto\\"]"} 自动回弹到 Idle;whileActive.duration 只用作 Active 停留时长。复制按钮 variant=&quot;outline&quot;,在 Active 期间由 Frame 自动暴露的 data-state=&quot;Active&quot; 触发 Indigo 配色,无需手写 stateClass;发送按钮 variant=&quot;filled&quot; 被默认 Indigo 规则排除,通过 stateClass={"{ Active: 'opacity-40' }"} 自定义反馈(说明消费方仍可通过 stateClass / stateStyle 完全自定义 Active 视觉)。
    </div>
</div>`,

        logic: ["Feedback", "Motion", "State"],
    },
    {
        name: "B6: 复制按钮反馈 (Copy Feedback)",
        code: `B6
<div class="flex-col gap-16">
    <div class="flex-row gap-8 items-center">
        <Button
            variant="outline"
            aria-label="复制 SnowUI Button 示例文本"
            whileClick={false}
            Click="Active"
            Active={["Idle", "auto"]}
            whileActive={{ duration: 2000 }}
            stateClass={{ Idle: "", Active: "snowui-button-active" }}
            onclick={() => void navigator.clipboard?.writeText("SnowUI Button")?.catch(() => {})}
        >
            <Icon stateIcon={{ Idle: Paperclip, Active: Check }} />
            <Text stateText={{ Idle: "复制 SnowUI Button", Active: "已复制" }} />
        </Button>
        <Button
            variant="filled"
            aria-label="复制安装命令"
            whileClick={false}
            Click="Active"
            Active={["Idle", "auto"]}
            whileActive={{ duration: 2000 }}
            stateClass={{ Idle: "", Active: "opacity-40" }}
            onclick={() => void navigator.clipboard?.writeText("pnpm add @snowui-design-system/components")?.catch(() => {})}
        >
            <Icon stateIcon={{ Idle: Paperclip, Active: Check }} />
            <Text stateText={{ Idle: "复制安装命令", Active: "已复制" }} />
        </Button>
    </div>
    <div class="text-12 text-black-40">
        说明:复制副作用只放在 onclick;Click="Active" 触发反馈态,Active={"{[\\"Idle\\", \\"auto\\"]}"} 在 2 秒后自动回弹;Icon 和 Text 通过父 Frame Context 读取 currentState 并声明式切换展示。
    </div>
</div>`,

        logic: ["Feedback", "Copy", "State"],
    },
    {
        name: "C1: 角色化组合 - 提示 (Role-based Composition: Tooltip)",
        code: `C1
<div class="flex-row gap-8">
    <Button>
        <span>保存更改</span>
        <Tooltip as="tooltip">保存更改</Tooltip>
    </Button>
    <Button variant="filled">
        <span>组合模式</span>
        <Tooltip as="tooltip" position="bottom">点击上传</Tooltip>
    </Button>
</div>`,

        logic: ["Tooltip"],
    },
    {
        name: "D1: 状态流 (State Flow)",
        code: `D1
<Button
    whileClick={false}
    Click={{ Idle: "Pending", Active: "Idle" }}
    Pending={["Active", "auto"]}
>
    <Icon stateIcon={{ Idle: null, Pending: Spinner, Active: Check }} />
    <Text stateText={{ Idle: "Ready", Pending: "Loading...", Active: "Completed" }} />
</Button>`,

        logic: ["State"],
    },
    {
        name: "E1: 响应式配置 (Responsive)",
        code: `E1
<Button 
    enableResponsive
    responsive={{ 
        sm: { size: "sm", variant: "outline" }, 
        lg: { size: "lg", variant: "filled" } 
    }}
>
    Responsive Button
</Button>`,

        logic: ["Responsive"],
    },
    {
        name: "F1: 多态链接 (Polymorphic Link)",
        code: `F1
<div class="flex-col gap-8">
    <div class="flex-row gap-8 items-center">
        <Button href="https://google.com" target="_blank" rel="noreferrer">
            外链（a）
        </Button>
        <Button href="#">站内链接（a）</Button>
        <Button>普通动作（button）</Button>
    </div>
    <div class="text-12 text-black-40">
        说明：传入 href 时渲染 a 标签；不传 href 时渲染 button 标签。
    </div>
</div>`,

        logic: ["Polymorphism"],
    },
    {
        name: "F3: 长文本按钮（无内置截断）",
        code: `F3
<div class="flex-col gap-16" style="width: 200px;">
    <Button variant="outline">
        这也是一个很长的按钮文本，若需要截断请在内容侧使用 Text 组件的 lines 能力。
    </Button>
</div>`,

        logic: ["Layout"],
    },
    {
        name: "G1: 计数器示例 (Counter Example)",
        code: `G1
<Frame
    class="flex-col gap-8"
    Click="Active"
    Active={["Disabled", "auto"]}
    Disabled={["Idle", "auto"]}
>
    {#snippet children({ currentState })}
        <div class="flex-row gap-16 items-center bg-background-1 p-16 rounded-12 border-black-10 w-hug">
            <Button iconOnly variant="gray" size="lg" aria-label="减少">
                <Minus />
            </Button>
            <div class="text-24 font-semibold min-w-48" style="text-align: center;">
                <FlowText
                    value={currentState === "Active" ? 6 : currentState === "Disabled" ? 4 : 5}
                    duration={500}
                />
            </div>
            <Button iconOnly variant="gray" size="lg" aria-label="增加">
                <Plus />
            </Button>
        </div>
        <div class="text-12 text-black-40">
            说明：点击计数器区域后数字按 5 -> 6 -> 4 -> 5 流转，FlowText 负责滚动过渡动效。
        </div>
    {/snippet}
</Frame>`,

        logic: ["Motion", "Composition"],
    },
    {
        name: "G2: 神奇移动 (Magic Move / layoutId)",
        code: `G2
<div class="flex-col gap-8">
    <div class="flex-row gap-16 p-16 bg-background-1 rounded-16 border-black-10 w-hug">
        <Button variant="filled" class="relative">
            选中项
            <Frame
                layoutId="active-pill"
                class="absolute top-0 right-0 bottom-0 left-0 bg-primary -z-10"
                style="border-radius: inherit;"
            />
        </Button>
        <Button variant="gray">未选中</Button>
        <Button variant="gray">未选中</Button>
    </div>
    <div class="text-12 text-black-40">
        说明：共享元素转场请挂在 Frame 上（layoutId），不要写在原生 div 上。
    </div>
</div>`,

        logic: ["Motion", "SharedLayout"],
    },
    {
        name: "G3: 布局过渡 (Layout Transition)",
        code: `G3
<div class="p-16 bg-background-1 rounded-16 border-black-10 w-hug flex-col gap-16">
    <Button
        variant="filled"
        Click="Active"
        Active={["Idle", "auto"]}
        whileActive={{ width: "+40px", duration: 600 }}
    >
        点击后宽度过渡
    </Button>
    <div class="text-12 text-black-40">
        说明：用状态链 + whileActive 驱动尺寸变化；layout 不是 Button 的有效能力。
    </div>
</div>`,

        logic: ["Motion", "Layout"],
    },
    {
        name: "H1: 复杂动效",
        code: `H1
<div class="flex-col gap-8">
<Button
  variant="gray"
  size="md"
  Click="Active"
  Active={["Disabled", "auto"]}
  Disabled={["Idle", "auto"]}
  whileHover={{ scale: 1.02 }}
  whileClick={{ scale: 0.98 }}
  whileActive={{ duration: 1500 }}
  whileDisabled={{ duration: 2000 }}
>
  <Star />
  Button
</Button>
<div class="text-12 text-black-40">
  说明：点击后状态链 Active -> Disabled -> Idle 自动轮转。
</div>
</div>`,

        logic: ["Motion", "Layout"],
    },
    {
        name: "H2: 启用上下文 (Enable Context)",
        code: `H2
<div class="flex-col gap-8">
    <div class="flex-row gap-8 items-center">
        <Button size="lg" variant="outline">
            <Icon><FourLeafClover /></Icon>
            enableContext 默认 true
        </Button>
        <Button size="lg" variant="outline" enableContext={false}>
            <Icon><FourLeafClover /></Icon>
            enableContext=false
        </Button>
    </div>
    <div class="text-12 text-black-40">
        说明：左侧 Icon 会继承 Button 的 size=lg（约24）；右侧关闭 context 后回退默认尺寸（16）。
    </div>
	</div>`,
        logic: ["Context", "Capability"],
    },
    {
        name: "Custom 00-48-19",
        code: `<Button><Spinner/>Loading...</Button>`,
        logic: ["UserCreated"],
    },

    {
        name: "Custom 00-42-34",
        code: `<section class=" flex flex-col items-center p-40 gap-16 justify-center">
    <div class="flex gap-8 flex-row items-center">
        <Button
            ><Icon>
                <FourLeafClover />
            </Icon></Button
        >
        <Button>Default</Button>
        <Button variant="gray">Gray</Button>
        <Button variant="filled">Filled</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="borderless">Borderless</Button>
    </div>
    <div class="flex gap-8 flex-row items-center">
        <Button disabled
            ><Icon>
                <FourLeafClover />
            </Icon></Button
        >
        <Button disabled>Default</Button>
        <Button disabled variant="gray">Gray</Button>
        <Button disabled variant="filled">Filled</Button>
        <Button disabled variant="outline">Outline</Button>
        <Button disabled variant="borderless">Borderless</Button>
    </div>
    <div class="flex gap-8 flex-row items-center">
        <Button size="md"
            ><Icon>
                <FourLeafClover />
            </Icon></Button
        >
        <Button size="md">Default</Button>
        <Button size="md" variant="gray">Gray</Button>
        <Button size="md" variant="filled">Filled</Button>
        <Button size="md" variant="outline">Outline</Button>
        <Button size="md" variant="borderless">Borderless</Button>
    </div>
    <div class="flex gap-8 flex-row items-center">
        <Button size="lg"
            ><Icon>
                <FourLeafClover />
            </Icon></Button
        >
        <Button size="lg">Default</Button>
        <Button size="lg" variant="gray">Gray</Button>
        <Button size="lg" variant="filled">Filled</Button>
        <Button size="lg" variant="outline">Outline</Button>
        <Button size="lg" variant="borderless">Borderless</Button>
    </div>
    <div class="flex gap-8 flex-row items-center">
        <Button
            ><Icon>
                <FourLeafClover />
            </Icon></Button
        >
        <Button
            ><Icon>
                <FourLeafClover />
            </Icon>Default</Button
        >
        <Button variant="gray"
            ><Icon>
                <FourLeafClover />
            </Icon>Gray</Button
        >
        <Button variant="filled"
            ><Icon>
                <FourLeafClover />
            </Icon>Filled</Button
        >
        <Button variant="outline"
            ><Icon>
                <FourLeafClover />
            </Icon>Outline</Button
        >
        <Button variant="borderless"
            ><Icon>
                <FourLeafClover />
            </Icon>Borderless</Button
        >
    </div>
    <div class="flex gap-8 flex-row items-center">
        <Button size="md"
            ><Icon>
                <FourLeafClover />
            </Icon></Button
        >
        <Button size="md"
            ><Icon>
                <FourLeafClover />
            </Icon>Default</Button
        >
        <Button variant="gray" size="md"
            ><Icon>
                <FourLeafClover />
            </Icon>Gray</Button
        >
        <Button variant="filled" size="md"
            ><Icon>
                <FourLeafClover />
            </Icon>Filled</Button
        >
        <Button variant="outline" size="md"
            ><Icon>
                <FourLeafClover />
            </Icon>Outline</Button
        >
        <Button variant="borderless" size="md"
            ><Icon>
                <FourLeafClover />
            </Icon>Borderless</Button
        >
    </div>
    <div class="flex gap-8 flex-row items-center">
        <Button size="lg"
            ><Icon>
                <FourLeafClover />
            </Icon></Button
        >
        <Button size="lg"
            ><Icon>
                <FourLeafClover />
            </Icon>Default</Button
        >
        <Button variant="gray" size="lg"
            ><Icon>
                <FourLeafClover />
            </Icon>Gray</Button
        >
        <Button iconOnly aria-label="四叶草" variant="filled" size="lg"
            ><Icon>
                <FourLeafClover />
            </Icon>Filled</Button
        >
        <Button iconOnly aria-label="四叶草" variant="outline" size="lg"
            ><Icon>
                <FourLeafClover />
            </Icon>Outline</Button
        >
        <Button iconOnly aria-label="四叶草" variant="borderless" size="lg"
            ><Icon>
                <FourLeafClover />
            </Icon>Borderless</Button
        >
    </div>
    <div class="flex gap-8 flex-row items-center">
        <Button
            ><Icon>
                <FourLeafClover />
            </Icon></Button
        >
        <Button variant="gray"
            ><Icon>
                <FourLeafClover />
            </Icon></Button
        >
        <Button variant="filled"
            ><Icon>
                <FourLeafClover />
            </Icon></Button
        >
        <Button variant="outline"
            ><Icon>
                <FourLeafClover />
            </Icon></Button
        >
        <Button variant="borderless"
            ><Icon>
                <FourLeafClover />
            </Icon></Button
        >
    </div>
    <div class="flex gap-8 flex-row items-center">
        <Button size="md"
            ><Icon>
                <FourLeafClover />
            </Icon></Button
        >
        <Button variant="gray" size="md"
            ><Icon>
                <FourLeafClover />
            </Icon></Button
        >
        <Button variant="filled" size="md"
            ><Icon>
                <FourLeafClover />
            </Icon></Button
        >
        <Button variant="outline" size="md"
            ><Icon>
                <FourLeafClover />
            </Icon></Button
        >
        <Button variant="borderless" size="md"
            ><Icon>
                <FourLeafClover />
            </Icon></Button
        >
    </div>
    <div class="flex gap-8 flex-row items-center">
        <Button size="lg"
            ><Icon>
                <FourLeafClover />
            </Icon></Button
        >
        <Button variant="gray" size="lg"
            ><Icon>
                <FourLeafClover />
            </Icon></Button
        >
        <Button variant="filled" size="lg"
            ><Icon>
                <FourLeafClover />
            </Icon></Button
        >
        <Button variant="outline" size="lg"
            ><Icon>
                <FourLeafClover />
            </Icon></Button
        >
        <Button variant="borderless" size="lg"
            ><Icon>
                <FourLeafClover />
            </Icon></Button
        >
    </div>
</section>`,
        logic: ["UserCreated"],
    },
    {
        name: "Custom 23-00-59",
        code: `<Button bare iconOnly aria-label="四叶草"><FourLeafClover size={16} /></Button>
<Button bare iconOnly aria-label="四叶草"><FourLeafClover size={20} /></Button>
<Button bare iconOnly aria-label="四叶草"><FourLeafClover size={24} /></Button>
<Button bare iconOnly aria-label="四叶草"><FourLeafClover size={32} /></Button>
<Button bare iconOnly aria-label="四叶草"><FourLeafClover size={40} /></Button>
<Button bare iconOnly aria-label="四叶草"><FourLeafClover size={48} /></Button>
<Button bare iconOnly aria-label="四叶草"><FourLeafClover size={80} /></Button>
<Button bare>文字</Button>`,
        logic: ["UserCreated"],
    },] as const;
