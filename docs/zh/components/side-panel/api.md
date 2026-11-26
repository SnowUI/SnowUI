# SidePanel API

来源指纹：5190f855205429d4。仅列本组件具名属性；未重新声明的基础能力按继承来源查询。

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| open | `boolean` | false | 是否显示面板，支持 `bind:open` |
| placement | `SidePanelPlacement` | "floating" | 浮层或内嵌到页面右侧，支持 `bind:placement` |
| width | `number` | 460 | 面板宽度，支持 `bind:width` |
| minWidth | `number` | 320 | 拖动调整面板宽度时允许的最小宽度。 |
| maxWidth | `number` | 720 | 拖动调整面板宽度时允许的最大宽度。 |
| inlineMotionOwner | `"component" \| "layout"` | "component" | 内嵌位移动效归属。组件级 fallback 为 `component`；采用本文默认浮动停靠集成时必须传 `layout`，并配合 layout helper 与常驻 rail。 |
| showTopToolbar | `boolean` | true | 是否显示上工具栏（内容固定，不可换按钮） |
| editable | `boolean` | false | 内容可编辑；`true` 时自动显示下工具栏默认按钮 |
| showBottomToolbar | `boolean` | — | 显式覆盖下栏显隐；默认 = `editable` 或任一下栏自定义 |
| bottomLeading | `Snippet` | — | 下栏左侧整组显式替换；传入即显示下栏 |
| bottomTrailing | `Snippet` | — | 下栏右侧整组显式替换；传入即显示下栏 |
| bottomLeadingActions | `SidePanelToolbarAction[]` | — | 数据内置；传入即显示下栏；有 `bottomLeading` 时忽略 默认行为：可编辑时默认 copy/delete。 |
| bottomTrailingActions | `SidePanelToolbarAction[]` | — | 数据内置；传入即显示下栏；有 `bottomTrailing` 时忽略 默认行为：可编辑时默认 取消/保存。 |
| title | `string` | — | 上工具栏右侧标题及面板无障碍名称；未传时使用 sidePanel.title，zh-CN 为“详情”、en-US 为“Details”；显式空字符串保留 |
| showTitle | `boolean` | false | 是否显示工具栏标题；关闭后保留无障碍名称与工具栏按钮 |
| backdrop | `DialogBackdrop \| false` | false | 浮层背景，复用 Dialog 共享遮罩；内嵌模式忽略 |
| closeOnEscape | `boolean` | true | Escape 关闭 |
| closeOnOutside | `boolean` | true | 点击 SidePanel 外区域关闭 |
| onOpenChange | `(open: boolean) => void` | — | 面板打开状态变化后回调。 |
| onPlacementChange | `(placement: SidePanelPlacement) => void` | — | 浮层与内嵌位置切换后回调。 |
| onPrevious | `() => void \| Promise<void>` | — | 点击上工具栏“上一项”后回调。 |
| onNext | `() => void \| Promise<void>` | — | 点击上工具栏“下一项”后回调。 |
| onCopy | `() => void \| Promise<void>` | — | 点击默认下工具栏复制操作后回调。 |
| onDelete | `() => void \| Promise<void>` | — | 点击默认下工具栏删除操作后回调。 |
| onClose | `() => void \| Promise<void>` | — | 关闭前回调 |
| children | `Snippet` | — | 面板滚动内容区，由调用方提供详情或编辑内容。 |
| parts | `ComponentPartsOf<{ Button: typeof Button; Indicator: typeof Indicator; }>` | — | 仅配置内置工具栏 Button 与整边调宽交互层；class / style 等完整 part Props 进入默认实例，children、bottomLeading、bottomTrailing 的显式子组件不继承。 |

[类型与状态](./types.md) · [完整组合说明](./reference.md) · [共享 Frame API](../frame/api.md) · [样式覆盖](./styles.md) · [样式选择顺序](../../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F)
