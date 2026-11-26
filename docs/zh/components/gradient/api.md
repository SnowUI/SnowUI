# Gradient API

来源指纹：164917a2722f32cb。仅列本组件具名属性；未重新声明的基础能力按继承来源查询。

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| variant | `GradientVariant` | — | 选择 Frame 200 从左到右对应的六种固定配色 |
| seed | `string \| number` | — | 仅在 `as="avatar-image"` 且未显式传 `variant` 时用于稳定选择六种配色；配色名可直接命中对应 variant |
| size | `number \| string` | — | 同时设置宽高；优先级高于 `width` / `height` |
| width | `number \| string` | — | 宽度；数字值按 px 处理 |
| height | `number \| string` | — | 高度；数字值按 px 处理 |
| radius | `number \| string` | — | 外部裁切圆角；数字值按 px 处理 |
| motion | `boolean` | — | 控制四个 SVG 有色图层是否常驻运行；Avatar 为 false 时仍会在 hover 期间按需运行水波形变，不影响多色 Overlay 默认行为：普通 Gradient 为 `true`；`as="avatar-image"` 为 `false`。 |
| avatarHoverActive | `boolean` | — | 由 Avatar 宿主控制头像变体的 hover 艺术色反馈；未传时使用组件自己的交互检测，非头像变体不使用此控制。 |
| decorative | `boolean` | true | 装饰图默认隐藏于无障碍树；设为 `false` 时应同时提供 `aria-label` |

[类型与状态](./types.md) · [完整组合说明](./reference.md) · [共享 Frame API](../frame/api.md) · [样式覆盖](./styles.md) · [样式选择顺序](../../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F)
