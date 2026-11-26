# SearchBox API

来源指纹：e069b6173d1d908f。仅列本组件具名属性；未重新声明的基础能力按继承来源查询。

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| parts | `ComponentPartsOf<{ Button: typeof Button }>` | — | 配置内部生成的清除 Button；显式子内容不消费该默认配置。 |
| variant | `"gray" \| "outline"` | "gray" | 搜索框样式 |
| gap | `number` | — | 继承 Frame 的间距 token 索引；省略时保留原首选间距，显式值覆盖首选间距；有效图文间距至少为 4 CSS px，显式零、根字号或间距缩放不压低下限。 |
| value | `string \| number` | — | 当前搜索文本或展示值 |
| placeholder | `string` | — | 占位文本；未传时使用 searchBox.placeholder，zh-CN 为“搜索”、en-US 为“Search”；显式空字符串保留 |
| open | `boolean` | false | 浮层打开状态，支持 `bind:open` |
| disabled | `boolean` | false | 禁用触发器 |
| readonly | `boolean` | false | 只读触发器，不响应打开 |
| showSearchIcon | `boolean` | true | 是否渲染默认搜索图标 |
| collapseBelow | `number` | — | 当组件自身宽度小于或等于该 px 阈值时，仅保留 leading 搜索图标；未传时不启用 |
| clearable | `boolean` | true | 有值时是否显示清除按钮 |
| children | `Snippet` | — | 外置 leading/trailing，如 `Kbd` |
| onOpenChange | `(open: boolean) => void` | — | 打开状态变化回调 |
| onClear | `() => void` | — | 清除回调 |
| onclick | `(event: MouseEvent) => void` | — | 入口点击后调用，参数为原始 MouseEvent；非 disabled、非 readonly 时组件先打开搜索层，回调不能取消已执行的打开。 |
| onkeydown | `(event: KeyboardEvent) => void` | — | 处理 Escape 关闭及 Enter/Space 打开后调用，接收原始 KeyboardEvent；不能撤销已经发生的状态变化。 |

[类型与状态](./types.md) · [完整组合说明](./reference.md) · [共享 Frame API](../frame/api.md) · [样式覆盖](./styles.md) · [样式选择顺序](../../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F)
