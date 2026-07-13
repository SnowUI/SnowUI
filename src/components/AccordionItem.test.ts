/**
 * AccordionItem.test.ts
 * v1.2.0
 *
 * AccordionItem 需要放在 Accordion 内使用，本文件提供设计稿形态的最小组合验证。
 */
export const examples = [
    {
        name: "A1: default 组合",
        code: `A1
<Accordion defaultValue="shipping" style="width: min(100%, 32rem);">
    <AccordionItem value="order">
        <Frame as="title" row>
            <Icon as="leading"><Resource.FourLeafClover /></Icon>
            如何提交订单？
        </Frame>
        <Frame as="content" row>订单提交后会进入确认流程。</Frame>
    </AccordionItem>

    <AccordionItem value="shipping">
        <Frame as="title" row>
            <Icon as="leading"><Resource.WinkingFace /></Icon>
            可以修改配送信息吗？
        </Frame>
        <Frame as="content" row>可以在发货前修改地址、联系人与备注信息。</Frame>
    </AccordionItem>
</Accordion>`,
        logic: ["title", "content"],
    },
    {
        name: "B1: filled 禁用项",
        code: `B1
<Accordion variant="filled" defaultValue="payment" style="width: min(100%, 32rem);">
    <AccordionItem value="payment">
        <Frame as="title" row>
            <Icon as="leading"><Resource.Star /></Icon>
            支持哪些付款方式？
        </Frame>
        <Frame as="content" row>支持银行卡、账户余额与企业付款。</Frame>
    </AccordionItem>

    <AccordionItem value="invoice" disabled>
        <Frame as="title" row>
            <Icon as="leading"><Resource.CreditCard /></Icon>
            发票信息
        </Frame>
        <Frame as="content" row>禁用项不会响应展开与收起。</Frame>
    </AccordionItem>
</Accordion>`,
        logic: ["filled", "disabled"],
    },
] as const;
