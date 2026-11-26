# NumberFlow API

来源指纹：10282cb605d8cbd6。仅列本组件具名属性；未重新声明的基础能力按继承来源查询。

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| value | `number \| string` | — | 当前数值；无法解析的字符串按 `0` 处理 |
| locales | `string` | "en-US" | 传给 `Intl.NumberFormat` 的 locale |
| format | `Intl.NumberFormatOptions` | {} | 数字格式化选项 |
| trend | `TrendResolver` | 0 | 明确变化趋势；`0` 时根据前后数值解析 |
| motionRole | `TextMotionRole` | "auto" | 数值趋势的语义角色 |
| transition | `NumberFlowTransition` | — | 覆盖滚轮时长 |
| digits | `Record<number, { max?: number }>` | — | 为指定数位声明循环上限，例如时间的十位 |
| numberPosition | `"left" \| "right"` | "right" | `children` 相对数字的位置 |
| rollDirection | `RollDirection` | "normal" | 正常或反向解释趋势方向 |
| loading | `boolean` | — | 显示按当前文本宽度推导的 Skeleton |
| skeleton | `boolean` | — | 接入 Skeleton Context |
| renderHints | `RenderHints` | — | 覆盖 Skeleton 形状与尺寸提示 |
| respectMotionPreference | `boolean` | false | 为 `true` 时遵守 reduced-motion 并立即提交最终数值 |
| font | `string` | — | 数字字体；未传时继承容器字体 |
| size | `string \| number` | — | 数字字号；数字转换为 `px`，字符串可使用 SnowUI token 或 CSS 值 |
| weight | `string \| number` | — | 数字字重；未传时继承容器字重 |
| lineHeight | `string \| number` | — | 根排版行高；内部滚轮仍使用独立 `1em` 裁切窗口 |
| color | `SnowUIColor \| string` | — | 最终文字颜色，未设置时继承容器 |
| align | `TextMotionAlign` | — | 数字内部对齐 |
| motionColor | `TextMotionColor` | — | 全部目标字符从左到右依次回落的临时颜色；`chromatic()` 将完整彩谱连续铺满全部数位，包含保留数位、分隔符及格式化货币符号，不影响 children 附加内容 |
| children | `Snippet` | — | 数字左侧或右侧的附加内容 |

[类型与状态](./types.md) · [完整组合说明](./reference.md) · [共享 Frame API](../frame/api.md) · [样式覆盖](./styles.md) · [样式选择顺序](../../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F)
