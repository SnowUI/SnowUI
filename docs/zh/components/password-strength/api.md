# PasswordStrength API

来源指纹：ccd54192818cb279。仅列本组件具名属性；未重新声明的基础能力按继承来源查询。

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| password | `string` | "" | 调用方管理的待评估值，不反映到 DOM |
| evaluate | `PasswordStrengthEvaluator` | evaluatePasswordStrength | 同步评估函数；调用方负责返回有效等级 |
| labels | `readonly [string, string, string, string, string]` | ['请输入密码', '弱', '一般', '较强', '完美'] | 分别对应等级 0–4 |
| minimumLength | `number` | 8 | 最低长度提示的字符数，也用于默认评估。 |
| minimumLengthMessage | `(length: number) => string` | 当前语言的长度提示 | 自定义非空且长度不足时优先显示的文案。 |
| requireLowercase | `boolean` | false | 要求至少一个 ASCII 小写字母。 |
| requireUppercase | `boolean` | false | 要求至少一个 ASCII 大写字母。 |
| requireNumber | `boolean` | false | 要求至少一个数字 `0–9`。 |
| requireSymbol | `boolean` | false | 要求至少一个非字母、非数字且非空白的字符；提示举例 `! @ # $ %`。 |

[类型与状态](./types.md) · [完整组合说明](./reference.md) · [共享 Frame API](../frame/api.md) · [样式覆盖](./styles.md) · [样式选择顺序](../../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F)
