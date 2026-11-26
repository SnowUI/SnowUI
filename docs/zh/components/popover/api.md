# Popover API

来源指纹：61bd68726044be93。仅列本组件具名属性；未重新声明的基础能力按继承来源查询。

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| id | `string` | — | 模版模式的唯一标识 |
| template | `boolean` | false | 模版模式;不直接渲染,通过 `showPopover(id)` 激活 |
| size | `PopoverSize` | "sm" | 尺寸档位 |
| trigger | `PopoverTrigger` | "click" | 触发方式;模版模式生效 |
| placement | `PopoverPlacement` | "bottom" | 优先弹出方位,视口空间不足时自动翻转 |
| offset | `number` | 8 | 浮层与触发器距离,单位 px |
| closeOn | `PopoverCloseMode` | "outside" | 关闭方式:`outside` 点击空白关闭,`manual` 仅由 Popover 内按钮关闭 |
| closeOnEscape | `boolean` | true | Escape 是否关闭;两种 closeOn 模式都默认支持 |
| closeOnSelect | `boolean` | — | 点击内部 `MenuItem` 是否关闭;单个 `MenuItem closeOnSelect` 可覆盖 默认行为：`true` (sm) / `false` (md/lg)。 |
| continuousHover | `boolean` | true | 直接 `MenuItem` 之间是否使用容器级连续 hover 背景 |
| open | `boolean` | true | 静态模式手动控制显示,支持 `bind:open` |
| onOpenChange | `(open: boolean) => void` | — | 打开状态变化回调 |
| as | `"popover" \| undefined` | — | `as="popover"` 启用**内嵌模式**:自动发现宿主父元素为 anchor 和触发源 |
| children | `Snippet` | — | 面板内容 |

[类型与状态](./types.md) · [完整组合说明](./reference.md) · [共享 Frame API](../frame/api.md) · [样式覆盖](./styles.md) · [样式选择顺序](../../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F)
