# NumericText API

来源指纹：09e859745392ae2d。仅列本组件具名属性；未重新声明的基础能力按继承来源查询。

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| value | `NumericTextValue` | "" | 显示内容 |
| locales | `string` | "en-US" | 数字格式化区域 |
| format | `Intl.NumberFormatOptions` | — | 数字格式化选项 |
| animated | `boolean` | true | 是否启用内容变化动效 |
| trend | `NumericTextTrend` | 0 | 减少、自动、增加趋势 |
| direction | `NumericTextDirection` | "normal" | 语义方向；`normal` 使用公共趋势，`reverse` 将文字、数字、计时器和倒计时方向全部取反 |
| motionRole | `TextMotionRole` | "auto" | 内容语义定性；`text` 显式关闭数字推断，其他值用于普通数值、计时器或倒计时 |
| transition | `Partial<TextMotionTransition>` | — | 与 `numeric-text-main` 一致的动效时序入口；Demo Slow Mode 使用 默认行为：{ duration: 550, easing: reference }。 |
| respectMotionPreference | `boolean` | true | 与 `numeric-text-main` 一致，默认遵循系统减少动效设置 |
| font | `string` | — | 字体 |
| size | `string \| number` | — | 字号 |
| weight | `string \| number` | — | 字重 |
| lineHeight | `string \| number` | — | 行高 |
| color | `SnowUIColor \| string` | — | 最终文字颜色 |
| align | `TextMotionAlign` | — | 对齐；默认继承父级 |
| motionColor | `TextMotionColor` | — | 全部目标字符从左到右回落的临时颜色；默认不改变颜色，支持 `chromatic()` 逐字符渐变 |

[类型与状态](./types.md) · [完整组合说明](./reference.md) · [共享 Frame API](../frame/api.md) · [样式覆盖](./styles.md) · [样式选择顺序](../../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F)
