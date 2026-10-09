/** BlurText v1.0.0 */
export const examples = [
    {
        name: "A3: 揭示速率",
        code: `A3
<Frame column class="gap-24">
    <BlurText text="Slow · You can just ship things." speed={0.5} class="text-32" />
    <BlurText text="Normal · You can just ship things." speed={1.5} class="text-32" />
    <BlurText text="Fast · You can just ship things." speed={2} class="text-32" />
</Frame>`,
        expected: { render: "三行按0.5、1.5、2 速率揭示；字号、行高与最终内容不受速率影响。" },
        logic: ["speed"],
    },
    {
        name: "A1: 标题逐字揭示",
        code: `A1
<BlurText text="让灵感逐渐清晰。" size="--text-32" lineHeight="--leading-32" weight={600} />`,
        expected: { render: "逐字由模糊淡入清晰，结束后无滤镜。", layout: "使用设计系统 32 字号与对应行高，不因揭示移动行盒。" },
        logic: ["appearance", "typography"],
    },
    {
        name: "A2: 字号梯度与颜色",
        code: `A2
<Frame column class="gap-16">
    <BlurText text="12 · Small details" size="--text-12" lineHeight="--leading-12" />
    <BlurText text="16 · Made for people" size="--text-16" lineHeight="--leading-16" />
    <BlurText text="24 · 清晰表达" size="--text-24" lineHeight="--leading-24" color="Primary" />
    <BlurText text="48 · SnowUI" size="--text-48" lineHeight="--leading-48" motionColor="Indigo" />
    <BlurText text="64 · Hello" size="--text-64" lineHeight="--leading-64" />
</Frame>`,
        expected: { render: "动效按字号同比缩放；临时 Indigo 回到继承色。", layout: "所有行高与对应 Token 一致。" },
        logic: ["size", "lineHeight", "motionColor"],
    },
    {
        name: "B1: 自然换行与继承",
        code: `B1
<div class="text-24" style="max-width: 320px;">
    <BlurText text={"让每一行文字自然呼吸。\\nMade for thoughtful interfaces. 👩🏽‍💻 é"} />
</div>`,
        expected: { render: "保留换行、组合字符和 emoji，不拆分字素。", responsive: "窄屏中英文自然换行，不锁定字符宽度。" },
        logic: ["grapheme", "wrap", "inheritance"],
    },
    {
        name: "C1: 组合与角色",
        code: `C1
<Field>
    <BlurText as="label" text="Project name" playOnMount={false} />
    <Input placeholder="Your next idea" />
</Field>`,
        expected: { render: "作为 Field 标签使用，显示稳定完整内容。", layout: "根节点保留 label 角色，无多余角色 wrapper。" },
        logic: ["as", "playOnMount"],
    },
    {
        name: "D1: 静态退化",
        code: `D1
<BlurText text="Ready when you are." animated={false} class="text-32" />`,
        expected: { render: "始终显示清晰文字，内部无动画。", responsive: "默认遵循系统减少动效偏好。" },
        logic: ["animated", "reducedMotion"],
    },
] as const;
