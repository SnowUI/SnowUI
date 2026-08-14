/**
 * Segmented.test.ts
 * v1.1.0
 *
 * 覆盖:Segmented 5 variant × 3 size + fill 等宽 + Form 接入 + 直切键盘行为。
 * 视觉与 Tab 共享;Segmented 侧重 ARIA radiogroup 与 Form 接入差异。
 */
export const examples = [
    {
        name: "SG-01:全部尺寸(pill 默认 variant + sm/md/lg)",
        code: `SG-01
<Frame class="flex-col gap-16 items-start">
    <Segmented value="web">
        <Button as="item" value="web">Web</Button>
        <Button as="item" value="mobile">Mobile</Button>
    </Segmented>
    <Segmented value="web" size="md">
        <Button as="item" value="web">Web</Button>
        <Button as="item" value="mobile">Mobile</Button>
    </Segmented>
    <Segmented value="web" size="lg">
        <Button as="item" value="web">Web</Button>
        <Button as="item" value="mobile">Mobile</Button>
    </Segmented>
</Frame>`,
        expected: {
            render: "与 Tab pill 视觉完全一致，半透明背景使用 20px 背景模糊;ARIA role=radiogroup,子项 role=radio",
        },
        logic: ["Variant=pill", "Size", "Default"],
    },
    {
        name: "SG-02:5 variant 一览",
        code: `SG-02
<Frame class="flex-col gap-16 items-start">
    <Segmented variant="pill" value="a"><Button as="item" value="a"><Icon><FourLeafClover /></Icon>Web</Button><Button as="item" value="b"><Icon><Star /></Icon>Mobile</Button></Segmented>
    <Segmented variant="solid" value="a"><Button as="item" value="a"><Icon><FourLeafClover /></Icon>Web</Button><Button as="item" value="b"><Icon><Star /></Icon>Mobile</Button></Segmented>
    <Segmented variant="underline" value="a"><Button as="item" value="a"><Icon><FourLeafClover /></Icon>Web</Button><Button as="item" value="b"><Icon><Star /></Icon>Mobile</Button></Segmented>
    <Segmented variant="icon-toggle" value="a">
        <Button as="item" value="a"><Icon><FourLeafClover /></Icon><Text>Web</Text></Button>
        <Button as="item" value="b"><Icon><Star /></Icon><Text>Mobile</Text></Button>
    </Segmented>
    <Segmented variant="bare" value="a"><Button as="item" value="a">Web</Button><Button as="item" value="b" iconOnly aria-label="收藏"><Icon><Star /></Icon></Button></Segmented>
</Frame>`,
        expected: {
            render:
                "5 variant 视觉与 Tab 一致；pill/icon-toggle 使用 20px 背景模糊，bare 无外壳和 indicator；Icon 与 Text 同步继承颜色。",
        },
        logic: ["Variant"],
    },
    {
        name: "SG-03:接入 Form(name 属性)",
        code: `SG-03
<form>
    <Segmented name="device" value="web">
        <Button as="item" value="web">Web</Button>
        <Button as="item" value="mobile">Mobile</Button>
    </Segmented>
</form>`,
        expected: {
            render: "Segmented 内部追加 hidden input(name=device),原生 form 提交时携带当前 value",
            interaction: "切换 Segmented 后 form data 中 device 字段同步更新",
        },
        logic: ["Form", "Combination"],
    },
    {
        name: "SG-04:键盘直切(selectionFollowsFocus=true)",
        code: `SG-04
<Segmented value="web">
    <Button as="item" value="web">Web</Button>
    <Button as="item" value="mobile">Mobile</Button>
    <Button as="item" value="desktop">Desktop</Button>
</Segmented>`,
        expected: {
            interaction:
                "←→ 直接切换并激活(不需要 Enter);Home/End 跳首末项并激活",
        },
        logic: ["Keyboard"],
    },
    {
        name: "SG-05:column 排列",
        code: `SG-05
<Segmented column variant="solid" value="a">
    <Button as="item" value="a">Web</Button>
    <Button as="item" value="b">Mobile</Button>
</Segmented>`,
        expected: {
            render: "纵向 column 排列",
        },
        logic: ["Direction=column"],
    },
    {
        name: "SG-06:fill 等宽子项",
        code: `SG-06
<Segmented fill value="web" style="width: 320px">
    <Button as="item" value="web">Web</Button>
    <Button as="item" value="mobile">Mobile</Button>
    <Button as="item" value="desktop">Desktop</Button>
</Segmented>`,
        expected: {
            render: "与 Tab fill 视觉一致;容器定宽后子项等宽填满",
        },
        logic: ["Fill", "Layout"],
    },
    {
        name: "SG-07：平铺 Tab 宿主 Props",
        code: `SG-07
<Segmented
    value="web"
    variant="underline"
    size="md"
    class="w-full"
>
    <Button as="item" value="web">Web</Button>
    <Button as="item" value="mobile">Mobile</Button>
</Segmented>`,
        logic: ["HostSpecialization", "TabProps"],
    },
    {
        name: "SG-08：items 默认内置 Button",
        code: `SG-08
<Segmented
    value="web"
    items={[
        { value: "web", label: "Web" },
        { value: "mobile", label: "Mobile" }
    ]}
    parts={{ Button: { variant: "gray" } }}
/>`,
        logic: ["BuiltInMode", "Parts", "Button"],
    },
] as const;
