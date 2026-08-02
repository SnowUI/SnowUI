export const examples = [
    {
        name: "A1: 单值尺寸与颜色",
        code: `A1
<div class="flex-col gap-12" style="width: 240px;">
  <Slider value={60} aria-label="默认滑动条" />
  <Slider value={60} thickness={8} color="Red" aria-label="红色滑动条" />
  <Slider value={60} thickness={2} background="Black10" aria-label="2px 滑动条" />
  <Slider value={60} thickness={1} background="Black10" aria-label="1px 滑动条" />
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
] as const;
