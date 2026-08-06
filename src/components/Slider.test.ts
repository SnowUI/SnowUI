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
        name: "F1: Filled 变体与指示器",
        code: `F1
<div class="flex-col gap-12" style="width: 160px;">
  <Slider value={45} variant="filled" showLabel aria-label="四十五百分比" />
  <Slider value={28} variant="filled" title="Text" showLabel aria-label="二十八百分比" />
  <Slider value={74} variant="filled" title="Text" showLabel aria-label="七十四百分比" />
  <Slider value={100} variant="filled" title="Text" showLabel aria-label="一百百分比" />
</div>`,
        expected: {
            render: "默认 32px 高、8px 圆角；内置标题位于左侧，showLabel 生成的百分比 label 位于右侧，填充的左右两端均为圆角。",
            interaction: "数值 label 使用 100% 基色与独立 opacity：常态 40%，hover、focus 与拖动时 80%；填充边缘内侧 4px 的全圆角 Static White/100% 指示器以中心点为基准渐显、短变长、细变粗，退出时反向消失。",
        },
        logic: ["variant", "title", "showLabel", "filled", "indicator-motion", "percentage"],
    },
    {
        name: "F2: Filled 分段样式",
        code: `F2
<div style="width: 160px;">
  <Slider value={50} step={25} showSteps showLabel variant="filled" aria-label="分段百分比" />
</div>`,
        expected: {
            render: "轨道按 0、25、50、75、100 五个位置显示 2px 圆点分段标记。",
            interaction: "保持原生 Slider 的点击、拖动与键盘交互。",
        },
        logic: ["variant", "filled", "showSteps", "step"],
    },
    {
        name: "F3: Filled 标题与粗细",
        code: `F3
<div style="width: 160px;">
  <Slider value={0} variant="filled" title="Volume" thickness={40} showLabel aria-label="音量百分比" />
</div>`,
        expected: {
            render: "标题可配置为 Volume，filled 高度由 thickness 设为 40px；0 值指示器位于 Slider 左边框内侧 4px。",
            interaction: "数值 label 继续使用 showLabel、parts.Text 与默认关闭规则。",
        },
        logic: ["variant", "title", "thickness", "showLabel", "zero-indicator"],
    },
] as const;
