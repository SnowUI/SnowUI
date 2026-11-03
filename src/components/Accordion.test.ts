/**
 * Accordion.test.ts
 * v1.7.0
 *
 * 测试覆盖：对齐 Figma 设计稿的 2 种类型 × 3 种尺寸示例。
 */

const items = `
    <AccordionItem value="order">
        <Frame as="title" singleLine>
            <Icon as="leading"><Resource.FourLeafClover /></Icon>
            <Text lines={1}>如何创建新的订单？</Text>
        </Frame>
        <Frame as="content" row>选择商品后进入结算页，确认信息即可提交订单。</Frame>
    </AccordionItem>
    <AccordionItem value="shipping">
        <Frame as="title" singleLine>
            <Icon as="leading"><Resource.WinkingFace /></Icon>
            <Text lines={1}>可以修改收货信息吗？</Text>
        </Frame>
        <Frame as="content" row>订单发货前都可以修改地址、手机号和收件人姓名。</Frame>
    </AccordionItem>
    <AccordionItem value="payment">
        <Frame as="title" singleLine>
            <Icon as="leading"><Resource.Star /></Icon>
            <Text lines={1}>支持哪些支付方式？</Text>
        </Frame>
        <Frame as="content" row>支持银行卡、余额和企业账户支付。</Frame>
    </AccordionItem>
    <AccordionItem value="invoice">
        <Frame as="title" singleLine>
            <Icon as="leading"><Resource.CreditCard /></Icon>
            <Text lines={1}>发票什么时候开具？</Text>
        </Frame>
        <Frame as="content" row>订单完成后可以在账单中心申请电子发票。</Frame>
    </AccordionItem>`;

const disabledItems = `
    <AccordionItem value="order">
        <Frame as="title" singleLine>
            <Icon as="leading"><Resource.FourLeafClover /></Icon>
            <Text lines={1}>如何创建新的订单？</Text>
        </Frame>
        <Frame as="content" row>选择商品后进入结算页，确认信息即可提交订单。</Frame>
    </AccordionItem>
    <AccordionItem value="shipping">
        <Frame as="title" singleLine>
            <Icon as="leading"><Resource.WinkingFace /></Icon>
            <Text lines={1}>可以修改收货信息吗？</Text>
        </Frame>
        <Frame as="content" row>订单发货前都可以修改地址、手机号和收件人姓名。</Frame>
    </AccordionItem>
    <AccordionItem value="payment" disabled>
        <Frame as="title" singleLine>
            <Icon as="leading"><Resource.Star /></Icon>
            <Text lines={1}>支持哪些支付方式？</Text>
        </Frame>
        <Frame as="content" row>支持银行卡、余额和企业账户支付。</Frame>
    </AccordionItem>
    <AccordionItem value="invoice">
        <Frame as="title" singleLine>
            <Icon as="leading"><Resource.CreditCard /></Icon>
            <Text lines={1}>发票什么时候开具？</Text>
        </Frame>
        <Frame as="content" row>订单完成后可以在账单中心申请电子发票。</Frame>
    </AccordionItem>`;

export const examples = [
    {
        name: "A1: filled sm（默认）",
        code: `A1
<Accordion
    size="sm"
    defaultValue="1"
    style="width: min(100%, 31.25rem);"
    items={[
        { title: "如何创建新的订单？", content: "选择商品后进入结算页，确认信息即可提交订单。" },
        { title: "可以修改收货信息吗？", content: "订单发货前都可以修改地址、手机号和收件人姓名。" },
        { title: "支持哪些支付方式？", content: "支持银行卡、余额和企业账户支付。" },
    ]}
/>`,
        expected: {
            render: "标题继承宿主前景色，展开正文使用主题自适应 Black/40%。",
        },
        logic: ["filled", "default-variant", "size-sm", "figma", "BuiltInMode", "content-black-40"],
    },
    {
        name: "A2: divided sm",
        code: `A2
<Accordion variant="divided" size="sm" defaultValue="shipping" style="width: min(100%, 31.25rem);">${items}
</Accordion>`,
        logic: ["divided", "size-sm", "figma"],
    },
    {
        name: "B1: divided md",
        code: `B1
<Accordion variant="divided" size="md" defaultValue="shipping" style="width: min(100%, 31.25rem);">${items}
</Accordion>`,
        logic: ["divided", "size-md", "figma"],
    },
    {
        name: "B2: filled md",
        code: `B2
<Accordion variant="filled" size="md" defaultValue="shipping" style="width: min(100%, 31.25rem);">${items}
</Accordion>`,
        logic: ["filled", "size-md", "figma"],
    },
    {
        name: "C1: divided lg",
        code: `C1
<Accordion variant="divided" size="lg" defaultValue="shipping" style="width: min(100%, 31.25rem);">${items}
</Accordion>`,
        logic: ["divided", "size-lg", "figma"],
    },
    {
        name: "C2: filled lg",
        code: `C2
<Accordion variant="filled" size="lg" defaultValue="shipping" style="width: min(100%, 31.25rem);">${items}
</Accordion>`,
        logic: ["filled", "size-lg", "figma"],
    },
    {
        name: "D1: disabled item",
        code: `D1
<Accordion variant="filled" size="md" defaultValue="shipping" style="width: min(100%, 31.25rem);">${disabledItems}
</Accordion>`,
        logic: ["disabled-item"],
    },
    {
        name: "D2: 加减号兼容模式",
        code: `D2
<Accordion indicatorVariant="minus" defaultValue="shipping" style="width: min(100%, 31.25rem);">${items}
</Accordion>`,
        expected: {
            render: "展开使用减号；默认模式则为加号旋转成 ×。",
            interaction: "仅标题点击可切换，正文点击不收起；hover 只有指示图标颜色变化。展开正文默认使用 Black/100%，支持局部颜色覆盖。",
        },
        logic: ["IndicatorVariant", "TitleOnly"],
    },
] as const;
