# Accordion API

来源指纹：1dfa4a12c12b52b6。仅列本组件具名属性；未重新声明的基础能力按继承来源查询。

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| type | `AccordionType` | "single" | single 一次只展开一项；multiple 可同时展开多项。决定 value/defaultValue 与 onValueChange 的值形态。 |
| value | `AccordionValue` | — | 当前展开值，支持 bind:value；优先于内部状态。single 使用字符串，multiple 使用数组；single 空字符串表示全部收起。 |
| defaultValue | `AccordionValue` | — | 非受控初始展开值；仅初始化内部状态时读取，value 优先。items 模式使用索引字符串，显式 AccordionItem 使用其 value。 |
| collapsible | `boolean` | true | 单开模式下，点击已展开项是否允许收起。 |
| variant | `AccordionVariant` | "filled" | filled 为带背景的独立折叠项；divided 使用项间分割线。两者共享展开状态与交互。 |
| size | `AccordionSize` | — | 尺寸密度；显式值优先，其次父级尺寸上下文，再回退 md。统一控制标题、正文、间距及子项尺寸。 |
| disabled | `boolean` | false | 禁用整个 Accordion。 |
| continuousHover | `boolean` | false | 已弃用，仅保留调用兼容；任意值均不再显示 hover 背景。 |
| indicatorVariant | `"cross" \| "minus"` | "cross" | cross 使用同一个加号旋转 45° 成为 ×；minus 保留加号/减号切换与半圈旋转。自定义 trailing 替换默认图标。 |
| role | `string` | "presentation" | 根容器的 ARIA role；默认仅作展示分组，标题触发器与内容 region 的语义仍由 AccordionItem 管理。 |
| items | `AccordionEntry[]` | [] | 默认内置模式的数据；内部 value 使用数组索引字符串。 |
| children | `Snippet` | — | 显式组合内容；存在时替换内置 items。 |
| parts | `ComponentPartsOf<{ AccordionItem: typeof AccordionItem; Frame: typeof Frame; Text: typeof Text; }>` | — | 仅配置 items 模式内建的 AccordionItem、标题／正文 Frame 和标题 Text；显式 children 不读取这些默认子项配置。 |
| onValueChange | `(value: AccordionValue) => void` | — | 用户切换展开项后回调；single 返回当前项字符串（全部收起时为空字符串），multiple 返回展开项数组。可配合 bind:value 同步页面状态。 |

[类型与状态](./types.md) · [完整组合说明](./reference.md) · [共享 Frame API](../frame/api.md) · [样式覆盖](./styles.md) · [样式选择顺序](../../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F)
