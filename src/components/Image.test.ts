/**
 * Image.test.ts
 * v1.1.0
 */
export const examples = [
    {
        name: "1: 素材与占位",
        code: `1
<Image size={80} />
<Image src={Image01} size={48} alt="Image 48" />
<Image src={Image01} size={32} alt="Image 32" />
<Image src={Image01} size={16} alt="Image 16" />`,
    },
    {
        name: "2: 中央图标与角标",
        code: `2
<Image src={Image01} size={80}>
    <Icon as="icon">
        <Heart />
    </Icon>
</Image>
<Image src={Image01} size={48}>
    <Radio as="badge" checked />
</Image>
<Image src={Image01} size={40}>
    <Button as="icon" variant="gray" iconOnly aria-label="选择">
        <Icon>
            <Check />
        </Icon>
    </Button>
</Image>`,
    },
    {
        name: "3: 预览模式",
        code: `3
<Image src={Image01} size={80} previewMode="viewer" aria-label="Open preview">
    <Icon as="icon">
        <Heart />
    </Icon>
</Image>`,
    },
    {
        name: "4: 字符串图片加载策略",
        code: `4
<Image src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='80' height='80' fill='gray'/%3E%3C/svg%3E" size={80} mediaLoading="eager" alt="立即加载" />
<Image src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='80' height='80' fill='gray'/%3E%3C/svg%3E" size={80} mediaLoading="lazy" alt="懒加载" />`,
        expected: { render: "原生图片分别输出 eager / lazy，mediaLoading 不泄漏到根 DOM", performance: "使用原生请求，保持 load/error 与 Skeleton 状态" },
        logic: ["4"],
    },
] as const;
