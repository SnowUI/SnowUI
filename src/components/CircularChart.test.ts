/**
 * CircularChart.test.ts
 * v1.0.0
 *
 * 覆盖:CircularChart 默认形态、尺寸/环厚/圆角/隔断、最多 10 项、中心标签、出现动效、自定义颜色与组合使用。
 * 示例不引用任何 --snowui-*-override / 设计 Token。
 */
export const examples = [
    {
        name: "CC-01: 默认形态(hover 外侧增厚)",
        code: `<script lang="ts">
    let cc01Chart: any;
</script>

CC-01
<Frame class="flex-col gap-12">
    <Frame class="flex-col gap-4">
        <Text class="text-14">
            CC-01 动效细则:整体动效固定 1s,不随扇区数量变化;扇区 1 填充完成后启动扇区 2,后续依次执行。
        </Text>
        <Text class="text-12" style="color: #666666;">
            填充从 startDirection 命中的扇区起始边界开始,按顺时针方向推进;前段扇区时长接近,越靠后的扇区时长越长。
        </Text>
        <Text class="text-12" style="color: #666666;">
            透明度与填充同时启动,每段 0.75s 线性补齐到 100%;扇区启动时尾部 0%、中段 62%、扫描头 100%;圆角和透明间隔数值以 160px 图表为基准等比缩放,默认基准值为 4px / 2px;底层常驻 4% 透明度占位扇区。
        </Text>
        <Text class="text-12" style="color: #666666;">
            点击重新填充会从 0 → 100% 顺序填充;点击反向回退会先进入完成态,再按同一时间轴从 100% → 0 回退。
        </Text>
    </Frame>
    <Frame class="flex-row gap-8">
        <Button onclick={() => cc01Chart?.replay?.()}>
            重新填充
        </Button>
        <Button variant="outline" onclick={() => cc01Chart?.reverseAppearance?.()}>
            反向回退
        </Button>
    </Frame>
    <CircularChart
        bind:this={cc01Chart}
      showHoverPanel={true}
        data={[
            { name: "1", value: 1048 },
            { name: "2", value: 735 },
            { name: "3", value: 580 },
            { name: "4", value: 484 },
            { name: "5", value: 300 }
        ]}
    />
</Frame>`,
        expected: {
            render: "240px 圆环图;扇区命名为 1、2、3、4、5;示例上方写明 CC-01 真实扇区动效细则;扇区有圆角与透明隔断;颜色来自 primary + secondary 系列;动效填充前能看到 4% 透明度同色占位扇区",
            interaction: "点击重新填充时从 0 到 100% 顺序填充;点击反向回退时先进入完成态再从 100% 回退到 0;hover 任意扇区时该扇区仅向外增厚 4px、不位移;快速移入移出或切换扇区时立即从当前尺寸响应最新状态,不积压或补播旧动画;鼠标离开后若扇区仍有键盘焦点则保持增厚",
        },
        logic: ["Default", "Hover", "HoverThicknessGrowth", "Replay", "ReverseAppearance", "BaseLayer"],
    },
    {
        name: "CC-02: 尺寸/环厚/圆角/隔断可调",
        code: `<script lang="ts">
    let cc02Progress = 1;
</script>

CC-02
<Frame class="flex-col gap-12">
    <Frame class="flex-row gap-8 items-center">
        <Text class="text-14">动效进度 {Math.round(cc02Progress * 100)}%</Text>
        <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            bind:value={cc02Progress}
            class="w-80"
        />
    </Frame>
    <Frame class="flex-row gap-24 items-center">
        <CircularChart
            size={180}
            ringThickness={42}
            cornerRadius={40}
            separatorWidth={1}
            appearanceProgress={cc02Progress}
        />
        <CircularChart
            size={260}
            ringThickness={88}
            cornerRadius={30}
            separatorWidth={5}
            appearanceProgress={cc02Progress}
        />
    </Frame>
</Frame>`,
        expected: {
            render: "左侧更小更细圆环;右侧更大更粗圆环,扇区圆角和隔断按 160px 基准值随尺寸等比缩放",
            interaction: "拖动控制条时,两张图表使用相同 appearanceProgress 同步展示扇区出现动效进度",
        },
        logic: ["Size", "RingThickness", "CornerRadius", "SeparatorWidth", "AppearanceProgress"],
    },
    {
        name: "CC-03: 最多 10 项颜色序列",
        code: `CC-03
<CircularChart
    size={300}
    ringThickness={84}
    data={[
        { name: "A", value: 18 },
        { name: "B", value: 15 },
        { name: "C", value: 14 },
        { name: "D", value: 12 },
        { name: "E", value: 10 },
        { name: "F", value: 9 },
        { name: "G", value: 8 },
        { name: "H", value: 6 },
        { name: "I", value: 5 },
        { name: "J", value: 3 },
        { name: "K", value: 99 }
    ]}
/>`,
        expected: {
            render: "只显示前 10 项;颜色序列只使用 primary 与 secondary 系列",
        },
        logic: ["MaxItems", "ColorTokens"],
    },
    {
        name: "CC-04: 自定义中心标签格式",
        code: `CC-04
<CircularChart
    data={[
        { name: "Desktop", value: 62 },
        { name: "Mobile", value: 28 },
        { name: "Tablet", value: 10 }
    ]}
    labelFormatter={(item, percent) => Math.round(percent) + "%" + "\\n" + item.name}
/>`,
        expected: {
            interaction: "hover 时中心标签使用自定义格式,第一行为整数百分比,第二行为名称",
        },
        logic: ["LabelFormatter", "CenterLabel"],
    },
    {
        name: "CC-04B: 外部 Text 自定义中心标签",
        code: `CC-04B
<CircularChart
    data={[
        { name: "Direct", value: 735 },
        { name: "Email", value: 580 }
    ]}
>
    <Text as="segment-value" class="text-18 font-bold text-black-100" />
    <Text as="segment-name" class="text-14 text-black-40" />
</CircularChart>`,
        expected: {
            render: "外部 Text 角色作为中心标签样式模板,组件自动写入当前扇区百分比与名称,并可用 Text 字号、字重、颜色工具类自定义样式",
        },
        logic: ["CustomCenterLabel", "TextRole", "CenterLabel"],
    },
    {
        name: "CC-05: 与 Text 组合",
        code: `CC-05
<Frame class="flex-row gap-24 items-center">
    <CircularChart size={220} ringThickness={64} />
    <Frame class="flex-col gap-8">
        <Text class="text-18">Traffic Mix</Text>
        <Text class="text-14 text-gray">Hover chart slices to inspect each channel.</Text>
    </Frame>
</Frame>`,
        expected: {
            render: "CircularChart 作为内禀原子 Hug 子项,与右侧文本组合排列",
        },
        logic: ["Combination", "Layout"],
    },
    {
        name: "CC-06: 粗环变实心饼图",
        code: `CC-06
<Frame class="flex-row gap-24 items-center">
    <CircularChart size={220} ringThickness={140} cornerRadius={0} separatorWidth={0} />
    <CircularChart size={220} ringThickness={36} cornerRadius={8} separatorWidth={3} />
</Frame>`,
        expected: {
            render: "左侧 ringThickness 大于外半径,中间空心圆消失并呈现实心饼图;右侧保留细圆环用于对照",
            interaction: "两种形态 hover 时均保持扇区外侧增厚、不位移与中心标签出现",
        },
        logic: ["SolidPie", "RingThickness", "Hover"],
    },
    {
        name: "CC-07: 出现动效起始方向",
        code: `CC-07
<Frame class="flex-row gap-24 items-center">
    <CircularChart size={180} ringThickness={52} startDirection="top" />
    <CircularChart size={180} ringThickness={52} startDirection="right" />
    <CircularChart size={180} ringThickness={52} startDirection="bottom" />
    <CircularChart size={180} ringThickness={52} startDirection="left" />
</Frame>`,
        expected: {
            render: "四个图表从不同方向命中的扇区开始出现;方向只决定动效起始扇区,不旋转图表数据排布",
        },
        logic: ["AppearMotion", "StartDirection"],
    },
    {
        name: "CC-08: 受控出现进度",
        code: `CC-08
<Frame class="flex-row gap-24 items-center">
    <CircularChart size={180} ringThickness={52} appearanceProgress={0.35} />
    <CircularChart size={180} ringThickness={52} appearanceProgress={0.75} />
    <CircularChart size={180} ringThickness={52} appearanceProgress={1} />
</Frame>`,
        expected: {
            render: "三个图表分别停在 35%、75% 和 100% 出现进度;扇区按角度顺时针扫描填充,未填充区域保留 4% 透明度同色占位",
        },
        logic: ["AppearMotion", "AppearanceProgress", "RadarScan"],
    },
    {
        name: "CC-09: 8 个起始方向",
        code: `CC-09
<Frame class="grid gap-16" style="grid-template-columns: repeat(4, minmax(0, 1fr));">
    <CircularChart size={150} ringThickness={42} startDirection="top" appearanceProgress={0.28} />
    <CircularChart size={150} ringThickness={42} startDirection="top-right" appearanceProgress={0.28} />
    <CircularChart size={150} ringThickness={42} startDirection="right" appearanceProgress={0.28} />
    <CircularChart size={150} ringThickness={42} startDirection="bottom-right" appearanceProgress={0.28} />
    <CircularChart size={150} ringThickness={42} startDirection="bottom" appearanceProgress={0.28} />
    <CircularChart size={150} ringThickness={42} startDirection="bottom-left" appearanceProgress={0.28} />
    <CircularChart size={150} ringThickness={42} startDirection="left" appearanceProgress={0.28} />
    <CircularChart size={150} ringThickness={42} startDirection="top-left" appearanceProgress={0.28} />
</Frame>`,
        expected: {
            render: "8 个图表在同一进度下从不同方向命中的扇区开始填充;方向只影响起始扇区,不旋转数据",
        },
        logic: ["AppearMotion", "StartDirection"],
    },
    {
        name: "CC-10: 单扇区渐变填充动效",
        code: `CC-10
<Frame class="flex-col gap-16" style="width: 36rem;">
    <Text class="text-14">
        单个扇区动效规格:4.8s 循环;0-55% 时间从左到右填充,透明度同步从左侧 0% 补齐到 100%;55-94% 保持满格;94-100% 快速重置。
    </Text>
    <Text class="text-12" style="color: #666666;">
        方向:left → right;单个扇区填充保持线性;透明度线性跟随填充时间轴,右侧扫描头始终保持 100%。
    </Text>
    <svg viewBox="0 0 360 72" style="width: 100%; height: 4.5rem; display: block;">
        <defs>
            <linearGradient id="cc10-single-segment-gradient" x1="0" y1="0" x2="100%" y2="0">
                <stop offset="0%" stop-color="#000000" stop-opacity="0">
                    <animate
                        attributeName="stop-opacity"
                        dur="4.8s"
                        repeatCount="indefinite"
                        values="0;1;1;0"
                        keyTimes="0;0.55;0.94;1"
                    />
                </stop>
                <stop offset="72%" stop-color="#000000" stop-opacity="0.62">
                    <animate
                        attributeName="stop-opacity"
                        dur="4.8s"
                        repeatCount="indefinite"
                        values="0.62;1;1;0.62"
                        keyTimes="0;0.55;0.94;1"
                    />
                </stop>
                <stop offset="100%" stop-color="#000000" stop-opacity="1" />
            </linearGradient>
        </defs>
        <rect x="1" y="1" width="358" height="70" fill="#ffffff" stroke="#000000" stroke-width="2" />
        <rect x="1" y="1" height="70" fill="url(#cc10-single-segment-gradient)">
            <animate
                attributeName="width"
                dur="4.8s"
                repeatCount="indefinite"
                values="0;358;358;358;0"
                keyTimes="0;0.55;0.94;0.985;1"
                calcMode="spline"
                keySplines="0.22 1 0.36 1;0 0 1 1;0 0 1 1;0 0 1 1"
            />
        </rect>
    </svg>
</Frame>`,
        expected: {
            render: "一个长方形单扇区循环播放:填充宽度从左到右推进;透明度补齐与填充同时进行,起始时左侧透明度为 0%、右侧扫描头为 100%,填满时整段同步达到 100% 不透明",
        },
        logic: ["AppearMotion", "SingleSegment", "OpacityTimeline"],
    },
    {
        name: "CC-11: 半圆扇区渐变填充动效",
        code: `CC-11
<Frame class="flex-col gap-16" style="width: 36rem;">
    <Text class="text-14">
        半圆环扇区动效细则:每个扇区填充 0.5s,透明度补齐 0.75s;两条时间轴同时启动,并支持反向执行。
    </Text>
    <Text class="text-12" style="color: #666666;">
        正向:left → right;单个扇区填充保持线性;透明度线性补齐,右侧扫描头始终 100% 不透明。
    </Text>
    <Text class="text-12" style="color: #666666;">
        CircularChart 多扇区规则:按 startDirection 命中的扇区开始,后续扇区顺时针执行;下一个扇区只在上一个扇区填充完成后启动。
    </Text>
    <Text class="text-12" style="color: #666666;">
        从扇区 1 到扇区 5,前三段时长接近,后两段逐步变长;透明度补齐仍为每段 0.75s。
    </Text>
    <Text class="text-12" style="color: #666666;">
        反向规则:反向回退会先进入完成态,再让填充和透明度时间轴同时反着走;如果已是完成态则直接反向执行。
    </Text>
    <Frame class="flex-row gap-8">
        <Button
            onclick={() => {
                const svg = document.getElementById("cc11-half-sector-demo");
                svg?.querySelector("#cc11-half-sector-clip-rect")?.setAttribute("width", "0");
                svg?.querySelector("#cc11-left-stop")?.setAttribute("stop-opacity", "0");
                svg?.querySelector("#cc11-mid-stop")?.setAttribute("stop-opacity", "0.62");
                ["#cc11-fill-forward", "#cc11-left-opacity-forward", "#cc11-mid-opacity-forward"].forEach((id) => {
                    const animation = svg?.querySelector(id);
                    (animation as any)?.beginElement?.();
                });
            }}
        >
            重新填充
        </Button>
        <Button
            variant="outline"
            onclick={() => {
                const svg = document.getElementById("cc11-half-sector-demo");
                svg?.querySelector("#cc11-half-sector-clip-rect")?.setAttribute("width", "280");
                svg?.querySelector("#cc11-left-stop")?.setAttribute("stop-opacity", "1");
                svg?.querySelector("#cc11-mid-stop")?.setAttribute("stop-opacity", "1");
                ["#cc11-fill-reverse", "#cc11-left-opacity-reverse", "#cc11-mid-opacity-reverse"].forEach((id) => {
                    const animation = svg?.querySelector(id);
                    (animation as any)?.beginElement?.();
                });
            }}
        >
            反向回退
        </Button>
    </Frame>
    <svg id="cc11-half-sector-demo" viewBox="0 0 360 220" style="width: 100%; height: 13.75rem; display: block;">
        <defs>
            <path
                id="cc11-half-sector-path"
                d="M 40 180 A 140 140 0 0 1 320 180 L 240 180 A 60 60 0 0 0 120 180 Z"
            />
            <linearGradient id="cc11-half-sector-gradient" x1="40" y1="0" x2="320" y2="0" gradientUnits="userSpaceOnUse">
                <stop id="cc11-left-stop" offset="0%" stop-color="#000000" stop-opacity="0">
                    <animate
                        id="cc11-left-opacity-forward"
                        attributeName="stop-opacity"
                        begin="indefinite"
                        dur="0.75s"
                        fill="freeze"
                        values="0;1"
                    />
                    <animate
                        id="cc11-left-opacity-reverse"
                        attributeName="stop-opacity"
                        begin="indefinite"
                        dur="0.75s"
                        fill="freeze"
                        values="1;0"
                    />
                </stop>
                <stop id="cc11-mid-stop" offset="72%" stop-color="#000000" stop-opacity="0.62">
                    <animate
                        id="cc11-mid-opacity-forward"
                        attributeName="stop-opacity"
                        begin="indefinite"
                        dur="0.75s"
                        fill="freeze"
                        values="0.62;1"
                    />
                    <animate
                        id="cc11-mid-opacity-reverse"
                        attributeName="stop-opacity"
                        begin="indefinite"
                        dur="0.75s"
                        fill="freeze"
                        values="1;0.62"
                    />
                </stop>
                <stop offset="100%" stop-color="#000000" stop-opacity="1" />
            </linearGradient>
            <clipPath id="cc11-half-sector-clip">
                <rect id="cc11-half-sector-clip-rect" x="40" y="36" width="0" height="144">
                    <animate
                        id="cc11-fill-forward"
                        attributeName="width"
                        begin="indefinite"
                        dur="0.5s"
                        fill="freeze"
                        values="0;280"
                        calcMode="spline"
                        keySplines="0.22 1 0.36 1"
                    />
                    <animate
                        id="cc11-fill-reverse"
                        attributeName="width"
                        begin="indefinite"
                        dur="0.5s"
                        fill="freeze"
                        values="280;0"
                        calcMode="spline"
                        keySplines="0.22 1 0.36 1"
                    />
                </rect>
            </clipPath>
        </defs>
        <use href="#cc11-half-sector-path" fill="#ffffff" stroke="#000000" stroke-width="2" />
        <use
            href="#cc11-half-sector-path"
            fill="url(#cc11-half-sector-gradient)"
            clip-path="url(#cc11-half-sector-clip)"
        />
        <use href="#cc11-half-sector-path" fill="transparent" stroke="#000000" stroke-width="2" />
    </svg>
</Frame>`,
        expected: {
            render: "一个半圆环真实扇区可控播放:点击重新填充时,填充裁切在 0.5s 内从 left → right 完成,透明度在 0.75s 内同步从初始渐变补齐到 100%;点击反向回退时先进入完成态,再以同样时长反向回到未填充渐变态",
        },
        logic: ["AppearMotion", "SingleSegment", "HalfCircleSegment", "OpacityTimeline"],
    },
    {
        name: "CC-12: 颜色模式与局部自定义颜色",
        code: `CC-12
<Frame class="flex-col gap-20">
    <Frame class="flex-row gap-24 items-center">
        <CircularChart
            size={180}
            ringThickness={52}
            data={[
                { name: "A", value: 36 },
                { name: "B", value: 28 },
                { name: "C", value: 20 },
                { name: "D", value: 16, color: "Red" }
            ]}
        />
        <CircularChart
            size={180}
            ringThickness={52}
            colorMode="monochromeFade"
            color="Blue"
            data={[
                { name: "A", value: 36 },
                { name: "B", value: 28 },
                { name: "C", value: 20 },
                { name: "D", value: 16, color: "Red" }
            ]}
        />
        <CircularChart
            size={180}
            ringThickness={52}
            colorMode="monochrome"
            color="Blue"
            data={[
                { name: "A", value: 36 },
                { name: "B", value: 28 },
                { name: "C", value: 20 },
                { name: "D", value: 16, color: "Red" }
            ]}
        />
    </Frame>
    <Text class="text-14 text-gray">从左到右:默认色序、Blue 单色渐浅、Blue 单色;每张图的 D 扇区都通过 data.color 指定为 Red。</Text>
</Frame>`,
        expected: {
            render: "三张圆环图分别展示默认色序、单色渐浅和单色模式;传入 color=Blue 后,单色渐浅从 Blue 100% 递减到最后一个扇区 20%,单色模式默认所有未自定义扇区为 Blue;三张图的 D 扇区均被 data.color 覆盖为 Red",
        },
        logic: ["ColorMode", "MonochromeFade", "Monochrome", "ItemColor"],
    },
    {
        name: "CC-13: 自定义颜色与渐变",
        code: `CC-13
<Frame class="flex-row gap-24 items-center">
    <CircularChart
        size={220}
        ringThickness={64}
        data={[
            { name: "Primary Gradient", value: 42, color: "linear-gradient(135deg, #111111 0%, #6BE6D3 100%)" },
            { name: "Default Purple", value: 30 },
            { name: "Object Gradient", value: 18, color: { angle: 45, stops: ["#B899EB 0%", "#A0BCE8 100%"] } },
            { name: "Default Mint", value: 10 }
        ]}
    />
    <Frame class="flex-col gap-8">
        <Text class="text-18">Per-slice colors</Text>
        <Text class="text-14 text-gray">每个 data.color 可单独定义纯色或渐变;未定义颜色的扇区保持默认颜色序列。</Text>
    </Frame>
</Frame>`,
        expected: {
            render: "圆环图按单个数据项定义颜色;第 1 与第 3 个扇区为渐变色,第 2 与第 4 个扇区未定义颜色并保持默认颜色序列",
        },
        logic: ["ItemColor", "GradientColor", "DefaultColorFallback"],
    },
    {
        name: "CC-14: center-label 常驻中心信息与 hover 面板",
        code: `CC-14
<CircularChart
    showHoverPanelLabel
    data={[
        { name: "Desktop", value: 62 },
        { name: "Mobile", value: 28 },
        { name: "Tablet", value: 10 }
    ]}
>
    <Frame as="center-label" class="flex-col items-center gap-2 text-black-100">
        <Text class="text-18 font-bold">72%</Text>
        <Text class="text-12 text-black-40">Total</Text>
    </Frame>
</CircularChart>`,
        expected: {
            render: "center-label 常驻显示在中心,不套用默认中心 hover label 的字号、颜色和缩放规则;出现 center-label 后默认中心 hover 信息由 hover 面板承载",
            interaction: "hover 或 focus 扇区时,中心常驻内容不变化,hover 面板显示当前扇区名称和百分比",
        },
        logic: ["CenterLabel", "HoverPanel", "PersistentCenterLabel"],
    },
    {
        name: "CC-15: center-label 优先于 segment 模板",
        code: `CC-15
<CircularChart
    hoverPanelPlacement="pin-center"
    hoverPanelVariant="surface"
    data={[
        { name: "Desktop", value: 62 },
        { name: "Mobile", value: 28 },
        { name: "Tablet", value: 10 }
    ]}
>
    <Frame as="center-label" class="flex-col items-center gap-2">
        <Text>72%</Text>
        <Text>Total</Text>
    </Frame>
    <Text as="segment-value" class="text-24 font-bold text-red" />
    <Text as="segment-name" class="text-12 text-red" />
</CircularChart>`,
        expected: {
            render: "同时提供 center-label 与 segment-value / segment-name 时,中心常驻信息使用 center-label 且不套用默认 hover label 样式;未显式 showHoverPanel 时仍自动开启 hover 面板;pin-center 相对于圆形图 plot area 居中定位",
            interaction: "hover 或 focus 扇区时,中心常驻内容不变化,hover 面板使用 surface 样式显示当前扇区数据",
        },
        logic: ["CenterLabel", "HoverPanel", "PersistentCenterLabel", "PinPlacement", "SurfaceVariant"],
    },
    {
        name: "CC-16: 默认开启亮色 HoverPanel",
        code: `CC-16
<CircularChart data={[{ name: "Revenue", value: 42 }]} />`,
        expected: {
            render: "不传 showHoverPanel 时默认启用 light 面板；未 hover / focus 时不显示",
            interaction: "鼠标悬停或键盘聚焦数据项时显示面板；面板显示当前数据项的信息",
        },
        logic: ["HoverPanel", "Default", "LightVariant", "Keyboard"],
    },
    {
        name: "CC-17: 窄容器内图表本体等比缩小",
        code: `CC-17
<Frame column class="w-full gap-16">
    <CircularChart size={320} ringThickness={48} cornerRadius={8} separatorWidth={6} />
    <CircularChart size={320} ringThickness={48} cornerRadius={8} separatorWidth={6}>
        <Frame as="center-label" column class="items-center gap-4">
            <Text class="text-24">72%</Text>
            <Text>Capacity</Text>
        </Frame>
    </CircularChart>
</Frame>`,
        expected: {
            render: "显示默认中心标签与常驻中心内容两种用法；HoverPanel 使用默认大小",
            responsive: "无需开启响应式；拖窄真实预览时，环厚、间隔、圆角、hover 增厚和中心内容同倍缩小至最小 40px；放宽恢复声明尺寸，不残留空白占位",
            interaction: "缩小后 pointer 与键盘 focus 命中当前扇区，面板位置跟随实际显示尺寸",
        },
        logic: ["Responsive", "CenterLabel", "HoverPanel", "Keyboard"],
    },
    {
        name: "CC-18: 默认响应式并排收缩与 40px 下限",
        code: `CC-18
<Frame row data-wrap="false" class="w-full gap-16">
    <CircularChart size={320}>
        <Frame as="center-label"><Text>72%</Text></Frame>
    </CircularChart>
    <CircularChart size={320}>
        <Frame as="center-label"><Text>48%</Text></Frame>
    </CircularChart>
</Frame>`,
        expected: {
            responsive: "无需传入 enableResponsive；两张图表按并排剩余宽度等比收缩，最小宽度 40px；空间恢复后回到声明尺寸",
            interaction: "中心内容同步缩放，HoverPanel 保持大小",
        },
        logic: ["Responsive", "MinWidth", "Flex", "HoverPanel"],
    },
] as const;
