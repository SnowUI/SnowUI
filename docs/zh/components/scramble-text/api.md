# ScrambleText API

来源指纹：14310c8c3cc5cb98。仅列本组件具名属性；未重新声明的基础能力按继承来源查询。

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| text | `string \| number` | "" | 最终文字 |
| charset | `ScrambleTextCharset` | "glyphs" | 预设替换字符集 |
| customSequence | `string` | — | 自定义替换序列，最多 64 个 grapheme |
| mode | `ScrambleTextMode` | "cascade" | 离散动效模式 |
| respectMotionPreference | `boolean` | false | 显式开启后才遵循系统减少动效设置 |
| font | `string` | — | 字体 |
| size | `string \| number` | — | 字号 |
| weight | `string \| number` | — | 字重 |
| color | `SnowUIColor \| string` | — | 最终文字颜色 |
| lineHeight | `string \| number` | — | 行高 |
| align | `TextMotionAlign` | — | 对齐；默认继承父级 |
| motionColor | `TextMotionColor` | — | 全部目标字符从左到右依次回落的临时颜色；支持语义色、CSS 色与逐字 resolver，默认不改变颜色 |

[类型与状态](./types.md) · [完整组合说明](./reference.md) · [共享 Frame API](../frame/api.md) · [样式覆盖](./styles.md) · [样式选择顺序](../../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F)
