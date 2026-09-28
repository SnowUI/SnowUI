/**
 * AccordionItem.test.ts
 * v1.3.1
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
        expected: {
            render: "默认 trailing 指示器正常显示，展开项内容可见；正文使用主题自适应 Black/40%。",
            layout: "title/content 三槽 Host 的 computed display 为 grid；默认 trailing 指示器占据最右侧独立轨道。内容区从测量高度展开，收起后不占用内容高度。",
            interaction: "点击可用 title 时展开；正文所有区域点击均不收起；无 hover 背景，仅标题内图标颜色变化。内容高度、padding 与透明度按 RESIZE_MOTION 过渡，指示器同步旋转；减少动效时立即提交相同最终状态。",
            performance: "展开高度由共享 ResizeObserver 测量，不轮询布局。",
            responsive: "宽度变化后重新测量内容高度，展开结果保持完整。",
        },
        logic: ["title", "content", "content-black-40", "TitleOnly", "CrossIndicator", "resize-motion", "reduced-motion"],
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
