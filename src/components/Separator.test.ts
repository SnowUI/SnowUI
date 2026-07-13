/**
 * Separator.test.ts
 * v1.0.0
 */

export const examples = [
    {
        name: "A1: 基础方向",
        code: `A1
<div class="flex-col gap-12" style="width: 240px;">
  <Text>水平分割线</Text>
  <Separator />
  <div class="flex-row gap-8 items-center" style="height: 40px;">
    <Text>左侧</Text>
    <Separator column length="24px" />
    <Text>右侧</Text>
  </div>
</div>`,
        logic: ["Direction"],
    },
    {
        name: "B1: 尺寸与圆角",
        code: `B1
<div class="flex-col gap-12" style="width: 240px;">
  <Separator length="160px" />
  <Separator thickness="1px" length="160px" rounded={false} />
  <div class="flex-row gap-8 items-center" style="height: 48px;">
    <Separator column length="12px" />
    <Separator column length="16px" />
    <Separator column length="20px" rounded={false} />
  </div>
</div>`,
        logic: ["Size", "Style"],
    },
];
