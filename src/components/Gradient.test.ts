/**
 * Gradient.test.ts
 * v1.1.0
 */
export const examples = [
    {
        name: "1: Figma c 正方形裁切",
        code: `1
<Gradient size={355} radius={20} />`,
        expected: {
            render: "显示从 Figma 最终图层 c 的 2x 原图左上角直接裁出的 710 × 710 PNG，对应 355 × 355；不缩放源像素、不调色、不增加滤镜。",
        },
        logic: ["StaticGradient", "FigmaReference"],
    },
    {
        name: "2: 静态头像裁切",
        code: `2
<Avatar fallback={Gradient} data-name="Gradient avatar" size={80} />`,
        expected: {
            render: "Gradient 被 Avatar 裁切为 80 尺寸的圆形静态头像，不播放任何动画。",
        },
        logic: ["Composition", "Avatar", "StaticGradient"],
    },
] as const;
