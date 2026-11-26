# FlowText API

来源指纹：b2e35d80af3f4a65。仅列本组件具名属性；未重新声明的基础能力按继承来源查询。

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| value | `FlowTextValue` | — | 目标文本或数值 |
| locales | `string` | "en-US" | 数字格式化区域 |
| format | `Intl.NumberFormatOptions` | — | 数字格式化选项 |
| trend | `FlowTextTrend` | 0 | 数值趋势；`0` 使用公共分类能力自动判断 |
| motionRole | `TextMotionRole` | "auto" | 内容语义定性 |
| transition | `FlowTextTransition` | — | 可覆盖时序；默认主动画与布局 550ms，逐位间隔与 NumericText 一致 |
| digits | `Record<number, { max?: number }>` | — | 分段计时器的 modulo 定义，仅参与公共趋势判断 |
| textPosition | `"left" \| "right"` | "right" | FlowText 内容相对 `children` 的位置 |
| rollDirection | `FlowTextRollDirection` | "normal" | 控制统一字符纵向流动语义；`normal` 使用公共趋势方向，`reverse` 完整取反 |
| loading | `boolean` | — | 加载状态；与 skeleton 同时开启时显示骨架，未设置时遵循容器状态 |
| skeleton | `boolean` | — | 控制骨架显示，未设置时遵循容器骨架状态 |
| renderHints | `RenderHints` | — | 骨架形状与尺寸提示 |
| respectMotionPreference | `boolean` | false | 显式开启后遵循系统减少动效设置 |
| font | `string` | — | 字体；未设置时继承容器 |
| size | `string \| number` | — | 字号；未设置时继承容器 |
| weight | `string \| number` | — | 字重；未设置时继承容器 |
| lineHeight | `string \| number` | — | 行高；未设置时继承容器 |
| color | `SnowUIColor \| string` | — | 文字最终颜色；未设置时继承容器 |
| align | `TextMotionAlign` | — | 文字对齐方式 |
| motionColor | `TextMotionColor` | — | 内容变化时全部目标字符的临时颜色，包括保留字符；resolver 的 index / total 对应目标全文的 grapheme 索引与总数，动效结束后回到文字颜色 |
| children | `Snippet` | — | 文本前后缀内容 |

[类型与状态](./types.md) · [完整组合说明](./reference.md) · [共享 Frame API](../frame/api.md) · [样式覆盖](./styles.md) · [样式选择顺序](../../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F)
