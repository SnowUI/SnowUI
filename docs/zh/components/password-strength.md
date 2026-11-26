# PasswordStrength

即时评估密码并显示四段强度条及文字；不持久保存或发送密码，也不将密码放入 DOM 或事件结果。它不负责密码输入、账户政策校验或提交。



包：@snowui-design-system/components；类别：component；运行：全部可免费使用；来源指纹：ccd54192818cb279

## 使用选择

传入输入控件当前值；组件在值变化时重新计算。默认标准参考 shadcn/ui 的密码要求计数：空值为 0；少于 `minimumLength`（默认 8）个字符为 1；达到最低长度后，根据小写、大写、数字和其他字符四类的命中数评为 1–4 级。默认设定要求仅限制最低长度，可分别启用字符种类要求；未满足时提示具体要求。该启发式标准不检查泄露密码或常见密码，不保证安全；用 `evaluate` 覆盖评估标准，用 `labels` 覆盖文案。

## Import

```ts
import { PasswordStrength } from '@snowui-design-system/components';
```

## 按需读取

- [快速开始代码](https://snowui.dev/llms/components/password-strength/quick-start.svelte)
- [API](./password-strength/api.md)：公开属性、默认值、事件和 Snippet
- [类型与状态](./password-strength/types.md)：必填项、可绑定属性、继承与数据结构
- [完整使用边界](./password-strength/reference.md)：使用复杂组合前读取相应章节
- [样式覆盖](./password-strength/styles.md)：本组件实际消费的公开变量
- [示例与变体](./password-strength/examples.md)
- [本组件截图索引](https://snowui.dev/llms/components/password-strength/images.json)：只在外观不确定时读取对应图片
- [AI 截图命令与索引说明](../reference/screenshots.md)：生成命令、路径与有效性检查
- [设计使用指南](../guides/design-system.md)：按任务还原设计与查找参数
- [样式选择与改写顺序](../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F)：首次采用时阅读，优先 Props、尽量保留原样；同任务复用

相关组件：[Input](./input.md)、[Progress](./progress.md)
