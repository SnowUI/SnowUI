/**
 * Image.test.ts
 * v1.0.0
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
] as const;
