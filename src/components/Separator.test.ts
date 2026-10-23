/**
 * Separator.test.ts
 * v1.0.1
 * 示例修订：2026-10-24，短文字行单行与局部滚动。
 */

export const examples = [
    {
        name: "A1: 基础方向",
        code: `A1
<div class="flex-col gap-12" style="width: 240px;">
  <Text>水平分割线</Text>
  <Separator />
  <ScrollArea axis="horizontal" ariaLabel="Separator labels" style="width: 100%;">
    <Frame singleLine gap={2} width="100%" style="height: 40px; min-width: min-content;">
      <Text lines={1} style="min-width: 1em;">左侧</Text>
      <Separator column length="24px" />
      <Text lines={1} style="min-width: 1em;">右侧</Text>
    </Frame>
  </ScrollArea>
</div>`,
        expected: {
            render: "保留水平／垂直方向对照与24px垂直分割线，左右短文字单行，截断可读全文。",
            gap: "普通间距8px，小字体与零首选仍至少4 CSS px，较大首选值保留。",
            overflow: "文字最小可见宽度及间距无法容纳时，LTR／RTL均可从零位置键盘局部滚动。",
        },
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
