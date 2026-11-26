# Dialog API

来源指纹：9590e0bf6487124b。仅列本组件具名属性；未重新声明的基础能力按继承来源查询。

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| id | `string` | — | 模版模式唯一标识 |
| template | `boolean` | false | 只注册模版,不直接显示 |
| as | `"dialog" \| undefined` | — | 内嵌模式标记 |
| open | `boolean` | false | 面板模式显隐,支持 `bind:open` |
| onOpenChange | `(open: boolean) => void` | — | 面板模式状态变化回调 |
| backdrop | `DialogBackdrop` | "opaque" | 遮罩层变体；与 ImageViewer 复用共享 backdrop 视觉，关闭与动效仍由 Dialog 管理。 |
| size | `DialogSize` | "md" | 面板尺寸 |
| closeOnOutside | `boolean` | true | 默认点击面板外的遮罩关闭；false 禁止。面板内部空白处不关闭。未保存表单或必须明确选择的场景建议显式设为 false |
| closeOnEscape | `boolean` | true | Escape 是否关闭 |
| pinOffset | `number` | — | 内置与外置 Pin 共用的统一偏移，单位 px；未传时使用随根字号缩放的 Token 默认行为：全部尺寸 16px。 |
| pinOffsetX | `number` | — | 覆盖内置与外置 Pin 的水平偏移，优先于 pinOffset |
| pinOffsetY | `number` | — | 覆盖内置与外置 Pin 的垂直偏移，优先于 pinOffset |
| role | `"dialog" \| string` | "dialog" | 面板可访问角色 |
| title | `string` | — | 生成内置文字标题；外置 as="title" 存在时忽略此值 |
| separator | `boolean` | — | 控制标题下方分割线；无标题时不生成 默认行为：sm 为 false；md/lg 为 true。 |
| showCloseButton | `boolean` | true | 是否显示内置右上角关闭按钮；不隐藏外置关闭角色 |
| closeLabel | `string` | locale 的关闭文案 | 内置关闭按钮的可访问名称 |
| parts | `ComponentPartsOf<{ Button: typeof Button; Text: typeof Text; Separator: typeof Separator }>` | — | 只配置实际内置关闭 Button、标题 Text 与 Separator；不影响 children/footer 中显式组件；标题 id、children 与 ARIA 由 Dialog 拥有 |
| children | `Snippet` | — | 对话框内容 |

[类型与状态](./types.md) · [完整组合说明](./reference.md) · [共享 Frame API](../frame/api.md) · [样式覆盖](./styles.md) · [样式选择顺序](../../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F)
