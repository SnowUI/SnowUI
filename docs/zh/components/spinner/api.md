# Spinner API

来源指纹：9fb86615b605f719。仅列本组件具名属性；未重新声明的基础能力按继承来源查询。

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| variant | `SpinnerVariant` | "circle" | 视觉变体风格 |
| size | `ResourceSize` | — | 尺寸（支持 12、16、20、24、28、32、40、48、80）；省略时优先继承父级 iconSize / size，无上下文时为 16 |
| speed | `number` | 1 | 正数动画速度倍率；circle 基准周期 1000ms，spokes / pills 为 800ms，除以该倍率。非有限值或非正数回退为 1；显式 loopMotion 时序优先。 |
| loopMotion | `LoopMotionConfig` | — | 覆盖默认循环动画桥接配置；优先级高于 `speed` 推导出来的默认时长。若传入 `preset`，Spinner 仅消费其中的时序字段，不让 Frame 根节点重复旋转 |
| children | `Snippet` | — | 兼容 Frame 的类型声明；Spinner 使用内置动画图形，不渲染子内容。文字请在外部组合。 |

[类型与状态](./types.md) · [完整组合说明](./reference.md) · [共享 Frame API](../frame/api.md) · [样式覆盖](./styles.md) · [样式选择顺序](../../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F)
