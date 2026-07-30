/**
 * Accordion.test.ts
 * v1.3.0
 *
 * 测试覆盖：对齐 Figma 设计稿的 2 种类型 × 3 种尺寸示例。
 */

const items = `
    <AccordionItem value="order">
        <Frame as="title" row>
            <Icon as="leading"><Resource.FourLeafClover /></Icon>
            如何创建新的订单？
        </Frame>
        <Frame as="content" row>选择商品后进入结算页，确认信息即可提交订单。</Frame>
    </AccordionItem>
    <AccordionItem value="shipping">
        <Frame as="title" row>
            <Icon as="leading"><Resource.WinkingFace /></Icon>
            可以修改收货信息吗？
        </Frame>
        <Frame as="content" row>订单发货前都可以修改地址、手机号和收件人姓名。</Frame>
    </AccordionItem>
    <AccordionItem value="payment">
        <Frame as="title" row>
            <Icon as="leading"><Resource.Star /></Icon>
            支持哪些支付方式？
        </Frame>
        <Frame as="content" row>支持银行卡、余额和企业账户支付。</Frame>
    </AccordionItem>
    <AccordionItem value="invoice">
        <Frame as="title" row>
            <Icon as="leading"><Resource.CreditCard /></Icon>
            发票什么时候开具？
        </Frame>
        <Frame as="content" row>订单完成后可以在账单中心申请电子发票。</Frame>
    </AccordionItem>`;

const disabledItems = `
    <AccordionItem value="order">
        <Frame as="title" row>
            <Icon as="leading"><Resource.FourLeafClover /></Icon>
            如何创建新的订单？
        </Frame>
        <Frame as="content" row>选择商品后进入结算页，确认信息即可提交订单。</Frame>
    </AccordionItem>
    <AccordionItem value="shipping">
        <Frame as="title" row>
            <Icon as="leading"><Resource.WinkingFace /></Icon>
            可以修改收货信息吗？
        </Frame>
        <Frame as="content" row>订单发货前都可以修改地址、手机号和收件人姓名。</Frame>
    </AccordionItem>
    <AccordionItem value="payment" disabled>
        <Frame as="title" row>
            <Icon as="leading"><Resource.Star /></Icon>
            支持哪些支付方式？
        </Frame>
        <Frame as="content" row>支持银行卡、余额和企业账户支付。</Frame>
    </AccordionItem>
    <AccordionItem value="invoice">
        <Frame as="title" row>
            <Icon as="leading"><Resource.CreditCard /></Icon>
            发票什么时候开具？
        </Frame>
        <Frame as="content" row>订单完成后可以在账单中心申请电子发票。</Frame>
    </AccordionItem>`;

export const examples = [
    {
        name: "A1: default sm",
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
        logic: ["default", "size-sm", "figma", "BuiltInMode"],
    },
    {
        name: "A2: filled sm",
        code: `A2
<Accordion variant="filled" size="sm" defaultValue="shipping" style="width: min(100%, 31.25rem);">${items}
</Accordion>`,
        logic: ["filled", "size-sm", "figma"],
    },
    {
        name: "B1: default md",
        code: `B1
<Accordion size="md" defaultValue="shipping" style="width: min(100%, 31.25rem);">${items}
</Accordion>`,
        logic: ["default", "size-md", "figma"],
    },
    {
        name: "B2: filled md",
        code: `B2
<Accordion variant="filled" size="md" defaultValue="shipping" style="width: min(100%, 31.25rem);">${items}
</Accordion>`,
        logic: ["filled", "size-md", "figma"],
    },
    {
        name: "C1: default lg",
        code: `C1
<Accordion size="lg" defaultValue="shipping" style="width: min(100%, 31.25rem);">${items}
</Accordion>`,
        logic: ["default", "size-lg", "figma"],
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
] as const;
