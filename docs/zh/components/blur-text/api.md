# BlurText API

来源指纹：15a9a22044599e1c。仅列本组件具名属性；未重新声明的基础能力按继承来源查询。

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| text | `string \| number` | "" | 最终纯文本，保留空格和换行 |
| animated | `boolean` | true | 关闭时立即呈现最终文本并清理内部动画 |
| speed | `number` | 1.5 | 字符启动速率，有限正数；错峰为 30ms / speed，单字固定 600ms；无效值回退 1.5 |
| playOnMount | `boolean` | true | 首次挂载且出现门禁放行后播放 |
| replayKey | `string \| number` | 0 | 值变化时重播当前全文 |
| respectMotionPreference | `boolean` | true | 遵循系统减少动效设置；运行中开启同样立即完成 |
| font | `string` | — | 字体或字体 Token |
| size | `string \| number` | — | 字号或字号 Token |
| weight | `string \| number` | — | 字重 |
| lineHeight | `string \| number` | — | 行高 Token、CSS 长度或无单位倍率 |
| color | `SnowUIColor \| string` | — | 最终文字色，支持 PascalCase 语义色 |
| align | `TextMotionAlign` | — | 文字对齐，默认继承 |
| motionColor | `TextMotionColor` | — | 可选逐字临时色，支持 chromatic()；结束后回到最终色 |

[类型与状态](./types.md) · [完整组合说明](./reference.md) · [共享 Frame API](../frame/api.md) · [样式覆盖](./styles.md) · [样式选择顺序](../../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F)
