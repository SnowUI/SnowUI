export const examples = [
    {
        name: "A1: 单值尺寸与颜色",
        code: `A1
<div class="flex-col gap-12" style="width: 240px;">
  <Slider value={60} aria-label="默认滑动条" />
  <Slider value={60} thickness={8} color="Red" aria-label="红色滑动条" />
  <Slider value={60} thickness={2} background="Black10" aria-label="细滑动条" />
</div>`,
        logic: ["value", "thickness", "background", "color"],
    },
    {
        name: "B1: Label 与 Range",
        code: `B1
<div class="flex-col gap-12" style="width: 240px;">
  <Slider value={12} showLabel aria-label="数值" />
  <Slider value={[3, 12]} showLabel ariaLabel={["最小值", "最大值"]} />
</div>`,
        logic: ["label", "range", "ariaLabel"],
    },
    {
        name: "C1: 纵向与 Steps",
        code: `C1
<div class="flex-row gap-12 items-center" style="height: 160px;">
  <Slider orientation="vertical" value={60} showLabel aria-label="纵向滑动条" />
  <div style="width: 240px;">
    <Slider value={60} step={10} showSteps aria-label="分段滑动条" />
  </div>
</div>`,
        logic: ["orientation", "showSteps", "step"],
    },
    {
        name: "D1: 禁用态与表单",
        code: `D1
<form class="flex-col gap-12" style="width: 240px;">
  <Slider name="volume" value={40} aria-label="音量" />
  <Slider value={60} disabled aria-label="禁用滑动条" />
</form>`,
        logic: ["name", "disabled", "form"],
    },
    {
        name: "E1: 外部百分比标签",
        code: `E1
<div style="width: 240px;">
  <Slider value={60} aria-label="百分比">
    <Text as="label">60%</Text>
  </Slider>
</div>`,
        logic: ["label", "value", "external-format"],
    },
    {
        name: "F1: Solid 变体与指示器",
        code: `F1
<div class="flex-col gap-12" style="width: 160px;">
  <Slider value={45} variant="solid" showLabel aria-label="四十五百分比" />
  <Slider value={28} variant="solid" title="Text" showLabel aria-label="二十八百分比" />
  <Slider value={74} variant="solid" title="Text" showLabel aria-label="七十四百分比" />
  <Slider value={100} variant="solid" title="Text" showLabel aria-label="一百百分比" />
</div>`,
        expected: {
            render: "默认 32px 高、8px 圆角；内置标题与showLabel百分比label分配独立单行预算，至少4 CSS px间隔，长标题可悬停查看全文；填充的左右两端均为圆角。",
            interaction: "数值 label 使用 100% 基色与独立 opacity：常态 40%，hover、focus 与拖动时 80%；填充边缘内侧 4px 的全圆角 Static White/100% 指示器以中心点为基准渐显、短变长、细变粗，退出时反向消失。",
        },
        logic: ["variant", "title", "showLabel", "solid", "indicator-motion", "percentage"],
    },
    {
        name: "F2: Solid 分段样式",
        code: `F2
<div style="width: 160px;">
  <Slider value={50} step={25} showSteps showLabel variant="solid" aria-label="分段百分比" />
</div>`,
        expected: {
            render: "轨道只在 25、50、75 三个内部位置显示 2px 圆点，不显示最左和最右端点。",
            interaction: "分段点固定使用 Black/10%，hover 和填充覆盖时均不改变颜色；保持原生 Slider 的点击、拖动与键盘交互。",
        },
        logic: ["variant", "solid", "showSteps", "step"],
    },
    {
        name: "F3: Solid 标题与粗细",
        code: `F3
<div style="width: 160px;">
  <Slider value={0} variant="solid" title="Volume" thickness={40} showLabel aria-label="音量百分比" />
</div>`,
        expected: {
            render: "标题可配置为 Volume，solid 高度由 thickness 设为 40px；0 值指示器位于 Slider 左边框内侧 4px。",
            interaction: "数值 label 继续使用 showLabel、parts.Text 与默认关闭规则。",
        },
        logic: ["variant", "title", "thickness", "showLabel", "zero-indicator"],
    },
    {
        name: "F4: Solid 实时文字分色",
        code: `F4
<div style="width: 160px;">
  <Slider value={88} variant="solid" title="Text" showLabel aria-label="实时分色百分比" />
</div>`,
        expected: {
            render: "黑色填充覆盖到 title 或数值 label 的哪一部分，该部分文字即为白色；未覆盖部分保持黑色。",
            interaction: "点击或拖动时，文字黑白分界与填充右缘使用同一个实时百分比连续移动，不做整段文字阈值切换。",
        },
        logic: ["variant", "title", "showLabel", "live-contrast", "background-clip"],
    },
    {
        name: "G1: Soft 自适应配色",
        code: `G1
<div class="flex-col gap-12" style="width: 160px;">
  <Slider value={45} variant="soft" title="Text" showLabel aria-label="柔和四十五百分比" />
  <Slider value={88} variant="soft" title="Text" showLabel aria-label="柔和八十八百分比" />
  <Slider value={100} step={25} showSteps variant="soft" title="Text" showLabel aria-label="柔和一百百分比" />
</div>`,
        expected: {
            render: "填充使用 Black/10%，title、数值 label 与指示器使用 Black/100% 基色；内部 steps 固定使用 Black/10%，颜色 token 随亮色 / 暗色主题变化。",
            interaction: "文字仍与填充边界实时同步，但覆盖前后均保持 Black/100% 基色；数值 label 继续使用 40% / 80% opacity。",
        },
        logic: ["variant", "soft", "theme-adaptive", "Black10", "Black100"],
    },
    {
        name: "Locale: 默认中文与英文内置文案",
        code: `Locale
<Slider variant="soft" value={42} showLabel ariaLabel="业务数值" />
<LocaleProvider locale="en-US">
<Slider variant="soft" value={42} showLabel ariaLabel="业务数值" />
</LocaleProvider>`,
        expected: {
            render: "默认中文与英文Provider分别提供内置文案；业务内容保持原样",
            interaction: "语言切换不重置原有值与状态，显式文案保持优先",
        },
        logic: ["Locale", "ExplicitTextPriority", "BusinessContent"],
    },
] as const;
