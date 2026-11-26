# Skeleton API

来源指纹：6b26069824e19cc5。仅列本组件具名属性；未重新声明的基础能力按继承来源查询。

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| variant | `SkeletonVariant` | — | 显式指定骨架形状；别名会归一化到 `line / circle / rect` |
| width | `string \| number` | — | 显式宽度；数字会自动转成 `rem` |
| height | `string \| number` | — | 显式高度；数字会自动转成 `rem` |
| componentClass | `string` | — | 旧调用方兼容入口；仅在没有 `renderHints` 时匹配历史默认布局，新组件不得以此登记 |
| renderHints | `FrameRenderHints` | — | 组件自注册协议，支持 `variant / width / height / radius / rows` |
| loading | `boolean` | true | 是否显示骨架；为 `false` 时显示 `children`，group 模式不重新挂载 |
| group | `boolean` | false | 将 children 作为整体骨架；加载期间保持挂载与布局，隐藏内容和交互，完成后原位显示。 |
| responsive | `ResponsiveConfig` | — | 响应式宽高覆写 |
| class | `string` | "" | 外部类名；多项骨架时挂到布局容器，单项骨架时挂到骨架块本身 |
| style | `string` | "" | 行内样式；多项骨架时挂到布局容器，单项骨架时挂到骨架块本身 |
| children | `Snippet` | — | 真实子内容，无参数；默认仅在未加载时渲染，group 模式始终保持挂载。 |

[类型与状态](./types.md) · [完整组合说明](./reference.md) · [共享 Frame API](../frame/api.md) · [样式覆盖](./styles.md) · [样式选择顺序](../../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F)
