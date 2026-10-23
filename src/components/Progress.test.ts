export const examples = [
    {
        name: "A1: 长条尺寸与标签",
        code: `A1
<div class="flex-col gap-12" style="width: 240px;">
  <Progress value={60}>
    <Frame as="label" singleLine class="justify-between">
      <Text lines={1}>Loading</Text>
      <Text as="trailing" lines={1}>60%</Text>
    </Frame>
  </Progress>
  <Progress value={60} thickness={8} />
  <Progress value={60} thickness={12} color="Red" />
</div>`,
        logic: ["variant", "value", "thickness", "label", "color"],
    },
    {
        name: "B1: 圆形尺寸与标签",
        code: `B1
<div class="flex-row gap-12 items-center">
  <Progress variant="circle" value={50} />
  <Progress variant="circle" value={50} size={32} thickness={2} showLabel />
  <Progress variant="circle" value={50} size={32} thickness={4} showLabel />
  <Progress variant="circle" value={50} size={48} thickness={8} showLabel />
</div>`,
        logic: ["variant", "size", "thickness", "label", "BuiltInMode"],
    },
    {
        name: "C1: 不确定态",
        code: `C1
<div class="flex-col gap-12" style="width: 240px;">
  <Progress isIndeterminate aria-label="正在加载" />
  <Progress variant="circle" isIndeterminate aria-label="正在加载" />
</div>`,
        logic: ["isIndeterminate", "loopMotion", "aria"],
    },
    {
        name: "D1: 颜色输入",
        code: `D1
<div class="flex-col gap-12" style="width: 240px;">
  <Progress value={60} color="Red" background="Black4" />
  <Progress value={60} color="red" background="rgba(0, 0, 0, 0.1)" />
</div>`,
        logic: ["color", "background", "SnowUIColor"],
    },
    {
        name: "E1: 外部百分比标签",
        code: `E1
<div style="width: 240px;">
  <Progress value={60}>
    <Text as="label">60%</Text>
  </Progress>
</div>`,
        logic: ["label", "value", "external-format"],
    },
] as const;
