export const examples = [
    {
        name: "OTP-01：默认 6 位",
        code: `OTP-01
<OTPInput aria-label="6-digit verification code" />`,
        expected: {
            render: "显示 6 格数字验证码输入。",
            layout: "单一输入宿主与分格视觉保持对齐。",
            interaction: "仅接收数字，输入后依次激活右侧格，不跳过未填格。",
            performance: "没有持续轮询或默认动效。",
            responsive: "几何使用正式 Token；激活框平移，数字使用 NUMBER_POP_APPEAR_MOTION。",
        },
        logic: ["Default", "Keyboard", "Accessibility"],
    },
    {
        name: "OTP-02：4 / 5 / 7 / 8 位",
        code: `OTP-02
<Frame column gap={12}>
    <OTPInput length={4} aria-label="4-digit code" />
    <OTPInput length={5} aria-label="5-digit code" />
    <OTPInput length={7} aria-label="7-digit code" />
    <OTPInput length={8} aria-label="8-digit code" />
</Frame>`,
        expected: {
            render: "分别显示 4、5、7、8 格。",
            layout: "各组按独立验证码字段排列。",
            interaction: "每组只接收对应长度的数字。",
            performance: "位数变化不创建逐格输入状态机。",
            responsive: "字段宽度由格数与格尺寸决定。",
        },
        logic: ["Length"],
    },
    {
        name: "OTP-03：表单与状态",
        code: `OTP-03
<form>
    <Frame column gap={12}>
        <OTPInput name="code" value="12" required aria-label="Verification code" />
        <OTPInput value="123456" readonly aria-label="Readonly code" />
        <OTPInput disabled aria-label="Disabled code" />
        <OTPInput invalid aria-label="Invalid code" />
        <Button type="reset">Reset</Button>
    </Frame>
</form>`,
        expected: {
            render: "展示必填、只读、禁用和错误状态。",
            layout: "状态不改变格数与字段尺寸。",
            interaction: "必填字段校验完整位数，重置恢复初始值。",
            performance: "重置收尾 timer 会在重复重置或卸载时清理。",
            responsive: "各状态沿用同一组件几何。",
        },
        logic: ["Form", "State"],
    },
    {
        name: "OTP-04：粘贴校验与错误恢复",
        code: `OTP-04
<Frame column gap={12}>
    <OTPInput length={4} defaultValue="12" aria-label="Paste verification code" />
    <Input invalid error="请输入 4 位数字验证码" aria-label="Error style reference" />
</Frame>`,
        expected: {
            render: "OTP 错误文字、细边框、聚焦环与 Input 共用样式。",
            layout: "激活框连续平移；点击后续空格也只激活第一未填格。",
            interaction: "完整 4 位从首格覆盖；第三格粘贴 34 或 3 可补入；首格粘贴 12 清空并提示，2 秒恢复。",
            performance: "错误 timer 重置或卸载清理，数字仅在出现或替换时播放动效。",
            responsive: "reduced-motion 直接到达最终状态。",
        },
        logic: ["Paste", "Error", "Motion"],
    },
    {
        name: "OTP-05：英文错误文案",
        code: `OTP-05
<LocaleProvider locale="en-US"><OTPInput length={4} aria-label="English verification code" /></LocaleProvider>`,
        expected: {
            render: "英文 locale 下无效粘贴显示英文错误。",
            layout: "沿用 Input 错误文字排版。",
            interaction: "错误 2 秒恢复，输入不被锁定。",
            performance: "复用多语言 Context。",
            responsive: "不依赖在线服务。",
        },
        logic: ["Locale"],
    },
] as const;
