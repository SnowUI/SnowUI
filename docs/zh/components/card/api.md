# Card API

来源指纹：0cfeb9d3da7d299b。仅列本组件具名属性；未重新声明的基础能力按继承来源查询。

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| row | `boolean` | false | 横向排列直系普通内容。与 Frame 写法一致 |
| column | `boolean` | — | 纵向排列普通内容，未传时取 row 的反值；row 与 column 同时为 true 时 row 优先。 |
| wrap | `boolean` | false | 普通内容是否允许换行；默认不换行 |
| contentFill | `boolean` | false | 普通内容子项宽度填满 Card 内容区；优先级高于 `contentHug` |
| contentHug | `boolean` | false | 普通内容子项宽度按内容收缩 |
| selected | `boolean` | false | 激活态语义别名；作用和效果与 `active` 相同 |
| active | `boolean` | false | 是否使用激活态外观 |
| interactive | `boolean` | false | 使容器具备交互外观、指针和 hover 边框；点击副作用仍由调用方事件负责，不自动导航、选择或生成按钮键盘行为。 |
| scrollable | `boolean` | true | 内容溢出时是否启用内部滚动；无高度约束时内容自然撑高 |
| children | `Snippet` | — | 任意自定义内容 |

[类型与状态](./types.md) · [完整组合说明](./reference.md) · [共享 Frame API](../frame/api.md) · [样式覆盖](./styles.md) · [样式选择顺序](../../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F)
