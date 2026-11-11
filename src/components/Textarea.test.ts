/**
 * Textarea.test.ts
 * v1.1.0
 * 变更记录 (2026-03-30): 将 Textarea-Demo 的 TA-01 ~ TA-12 全量迁入 test 项目，后续多行输入样式与状态调整统一在 test 中验证。
 * 变更记录 (2026-03-15): 新增 Textarea 组件示例，覆盖多行输入、原生属性透传、表单提交与 Frame 通用能力。
 */
export const examples = [
    {
        name: "Required: shared empty feedback",
        code: `Required
<form onsubmit={(event) => event.preventDefault()}>
<Textarea name="message" required placeholder="Message" />
<Button type="submit" variant="filled" skeleton={false}>Submit</Button>
<button type="reset">Reset</button>
</form>`,
        expected: {
            interaction: "空值提交不出现浏览器气泡；不显示空值错误文字，首个无效控件聚焦并短暂红边闪动，外光圈保持原色，结束恢复原态；重复提交可重播，修正输入或选择后清除错误，重置清除提示。",
            render: "非必填控件维持原样；减少动效时仅聚焦，不显示空值错误文字。",
        },
    },
    {
        name: "TA-01：空态占位符",
        code: `TA-01
<Textarea placeholder="请输入更多说明" style="width: 22.5rem;" />`,
        logic: ["Basic"],
    },
    {
        name: "TA-02：默认值",
        code: `TA-02
<Textarea defaultValue={"SnowUI\\n支持多行默认值"} style="width: 22.5rem;" />`,
        logic: ["Basic", "Value"],
    },
    {
        name: "TA-03：readonly 只读态",
        code: `TA-03
<Textarea readonly value={"Readonly\\nvalue"} style="width: 22.5rem;" />`,
        logic: ["State", "Readonly"],
    },
    {
        name: "TA-04：disabled 禁用态",
        code: `TA-04
<Textarea disabled placeholder="Disabled" style="width: 22.5rem;" />`,
        logic: ["State", "Disabled"],
    },
    {
        name: "TA-05：rows / minlength / maxCount / required",
        code: `TA-05
<Textarea
    rows={6}
    name="description"
    minlength={20}
    maxCount={200}
    required
    placeholder="至少 20 个字"
    style="width: 22.5rem;"
/>`,
        logic: ["NativeProps", "Validation"],
    },
    {
        name: "TA-05b：maxCount 超出限制",
        code: `TA-05b
<Textarea
    maxCount={20}
    defaultValue="这段文字超出了二十个字符的限制，用于演示超限红色计数。"
    placeholder="试试输入超过 20 个字"
    style="width: 22.5rem;"
/>`,
        logic: ["NativeProps", "Validation", "MaxCount"],
    },
    {
        name: "TA-05c：计数 hover 显示与超限常显",
        code: `TA-05c
<Textarea
    maxCount={20}
    defaultValue="SnowUI"
    aria-label="计数显示规则"
    placeholder="移入显示计数，超过 20 字后移出仍显示"
    style="width: 22.5rem;"
/>`,
        logic: ["State", "Validation", "MaxCount"],
    },
    {
        name: "TA-06：autocomplete / enterkeyhint / wrap / spellcheck",
        code: `TA-06
<Textarea
    autocomplete="street-address"
    enterkeyhint="done"
    wrap="hard"
    spellcheck={false}
    placeholder="autocomplete / wrap / spellcheck"
    style="width: 22.5rem;"
/>`,
        logic: ["NativeProps"],
    },
    {
        name: "TA-07：resize=none",
        code: `TA-07
<Textarea resize="none" placeholder="resize = none" style="width: 22.5rem;" />`,
        logic: ["Resize"],
    },
    {
        name: "TA-08：invalid 错误态",
        code: `TA-08
<Textarea invalid placeholder="Error textarea" style="width: 22.5rem;" />`,
        logic: ["State", "Invalid"],
    },
    {
        name: "TA-09：bind:value 对照态",
        code: `TA-09
<div class="flex-col gap-8" style="width: 22.5rem;">
    <Textarea value={"SnowUI\\n让多行文本也拥有 Frame 能力。"} rows={5} />
    <Text class="text-12 text-black-40">当前值：SnowUI 让多行文本也拥有 Frame 能力。</Text>
</div>`,
        logic: ["Value"],
    },
    {
        name: "TA-10：表单提交",
        code: `TA-10
<form class="flex-col gap-12" style="width: 22.5rem;">
    <Textarea
        name="notes"
        rows={5}
        maxCount={200}
        placeholder="提交后查看 FormData 结果"
    />
    <div class="flex gap-8">
        <Button type="submit">提交表单</Button>
        <Button type="reset" variant="outline">重置</Button>
    </div>
</form>`,
        logic: ["Form"],
    },
    {
        name: "TA-11：loading 骨架",
        code: `TA-11
<Textarea loading placeholder="Loading..." style="width: 22.5rem;" />`,
        logic: ["Frame", "Loading"],
    },
    {
        name: "TA-12：Click 状态切换",
        code: `TA-12
<Textarea
    defaultValue="点击切换状态"
    style="width: 22.5rem;"
    Click={{ Idle: "Active", Active: "Idle" }}
    stateStyle={{
        Idle: "--snowui-textarea-background: var(--surface-1, #ffffffcc);",
        Active: "--snowui-textarea-background: color-mix(in srgb, var(--primary, #000000) 8%, var(--surface-1, #ffffffcc));",
    }}
/>`,
        logic: ["Frame", "StateStyle"],
    },
    {
        name: "TA-Parts：配置内置 Indicator",
        code: `TA-Parts
<Textarea
    defaultValue="Resize me"
    resize="both"
    parts={{ Indicator: { appearance: "corner", step: 4 } }}
/>`,
        logic: ["Parts", "Indicator", "Resize"],
    },
    {
        name: "Native validation：组件错误反馈",
        code: `Native validation
<form onsubmit={(event) => event.preventDefault()} style="display: grid; gap: 16px;">
    <Textarea required minlength={8} aria-label="Required value" />
    <Button type="submit">Submit</Button>
    <Button type="reset">Reset</Button>
</form>`,
        expected: { render: "空值及格式／长度不符时阻止提交，不出现浏览器气泡；空值仅短暂红边闪动并恢复原态，不显示文字；格式／长度错误仍在组件下方左对齐显示。修正后错误消失，重置清除校验反馈。" },
        logic: ["Validation", "Form"],
    },
] as const;
