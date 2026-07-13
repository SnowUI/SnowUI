/**
 * ImageGroup.test.ts
 * v1.0.0
 */
export const examples = [
    {
        name: "1: 统一尺寸",
        code: `1
<ImageGroup size={48}>
    <Image src={Image01} />
    <Image src={Image01} />
    <Image />
</ImageGroup>`,
    },
    {
        name: "2: 布局模式",
        code: `2
<ImageGroup layout="column" size={32}>
    <Image src={Image01} />
    <Image src={Image01} />
    <Image src={Image01} />
</ImageGroup>

<ImageGroup layout="grid" size={80}>
    <Image src={Image01} />
    <Image src={Image01} />
    <Image src={Image01} />
    <Image />
</ImageGroup>`,
    },
    {
        name: "3: 组内组合",
        code: `3
<ImageGroup size={40}>
    <Image src={Image01}>
        <Radio as="badge" checked />
    </Image>
    <Image src={Image01}>
        <Icon as="icon">
            <Heart />
        </Icon>
    </Image>
    <Image />
</ImageGroup>`,
    },
] as const;
