# PasswordStrength

> 首次阅读组件源码或文档先读完整 [LICENSE](../../LICENSE)。
> **职责**: 根据可替换标准评估密码并展示强度，不保存或提交密码。
> **版本**：v1.0.0；**包归属**：`@snowui-design-system/components`。

## 组件介绍

即时评估密码并显示四段强度条及文字；不持久保存或发送密码，也不将密码放入 DOM 或事件结果。它不负责密码输入、账户政策校验或提交。

## 使用选择

<!-- usage-guide:start -->
传入输入控件当前值；组件在值变化时重新计算。默认标准参考 shadcn/ui 的密码要求计数：空值为 0；少于 `minimumLength`（默认 8）个字符为 1；达到最低长度后，根据小写、大写、数字和其他字符四类的命中数评为 1–4 级。默认设定要求仅限制最低长度，可分别启用字符种类要求；未满足时提示具体要求。该启发式标准不检查泄露密码或常见密码，不保证安全；用 `evaluate` 覆盖评估标准，用 `labels` 覆盖文案。

<!-- usage-guide:end -->

## 快速开始

```svelte
<script lang="ts">
  import { Input, PasswordStrength } from '@snowui-design-system/components';
  let password = $state('');
</script>

<Input type="password" bind:value={password} aria-label="New password" aria-describedby="strength" />
<PasswordStrength id="strength" {password} labels={['Enter a password', 'Weak', 'Fair', 'Good', 'Perfect']} />
```

## API

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| password | `string` | `""` | 调用方管理的待评估值，不反映到 DOM |
| evaluate | `PasswordStrengthEvaluator` | `evaluatePasswordStrength` | 同步评估函数；调用方负责返回有效等级 |
| labels | `readonly [string, string, string, string, string]` | `请输入密码／弱／一般／较强／完美` | 分别对应等级 0–4 |
| minimumLength | `number` | `8` | 最低长度提示的字符数，也用于默认评估。 |
| minimumLengthMessage | `(length: number) => string` | 当前语言的长度提示 | 自定义长度不足时优先显示的文案。 |
| requireLowercase | `boolean` | `false` | 要求至少一个 ASCII 小写字母。 |
| requireUppercase | `boolean` | `false` | 要求至少一个 ASCII 大写字母。 |
| requireNumber | `boolean` | `false` | 要求至少一个数字 `0–9`。 |
| requireSymbol | `boolean` | `false` | 要求至少一个非字母、非数字且非空白的字符；提示举例 `! @ # $ %`。 |

另导出 `evaluatePasswordStrength`、`PasswordStrengthLevel` 和 `PasswordStrengthEvaluator`。其余兼容属性继承 [Frame](Frame.md)；`children`、`row`、`column`、`gap` 和 `enableAutoLayout` 由组件接管。

## 使用边界与详细说明

默认要求仅为至少 8 个字符，不要求字符种类。短于 `minimumLength` 时优先显示长度提示；达到长度后依次提示尚未满足的大小写、数字和特殊字符要求，全部满足后显示强度等级。要求提示独立于可覆盖的强度评估，不能代替服务端验证。四段高度为 4px、间距为 8px，间距可使用 `--snowui-password-strength-segment-gap-override` 覆盖，圆角使用 `--snowui-password-strength-segment-radius-override`（默认 `--radius-full`）。强度条及文字整体相对组件两边各缩进 4px；与上方输入框组合时由使用方设置 16px 间距。调用方负责输入框标签及通过 `aria-describedby` 关联结果；等级提示不能代替服务端密码政策或安全保证。无自有交互、计时器或动效，可在服务端渲染。自定义评估函数直接接收密码，调用方应确保其不保存或发送密码。

## AI 对话使用

可用公开的评估和文案属性构建密码强度提示，输入值、状态与提交由宿主管理。组件不会读取账户或发送网络请求；不应向 AI 请求、记录或传输用户真实密码。宿主不能安全处理密码输入时应退化为文字说明，不生成真实密码输入。真实对话宿主尚未验收。

## AI Zone

- 入口：[PasswordStrength.svelte](PasswordStrength.svelte)；Frame 为根宿主，四段视觉和文字由组件持有，不存储密码或创建事件结果。
- 默认评估是同步函数；使用方覆盖函数接收当前密码。不要在日志、DOM 属性或共享状态中复制密码。
- 示例：[PasswordStrength.test.ts](PasswordStrength.test.ts)。真实对话宿主与发布包证据尚无。

## 更新日志

- 2026-11-04：新增默认标准、四段指示及可覆盖评估与文案。
