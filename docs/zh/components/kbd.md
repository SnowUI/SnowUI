# Kbd

以紧凑的按键标签展示快捷键或键盘操作提示，帮助用户快速识别可用操作。



包：@snowui-design-system/components；类别：component；运行：全部可免费使用；来源指纹：966d903f9897e46a

## 使用选择

用于展示键盘按键或快捷键提示。它不注册快捷键；实际键盘处理由拥有该操作的组件或页面负责。

- children 只表示按键文字，variant 选择 border 或填充外观。
- 将快捷键提示放在对应操作旁；快捷键事件由页面或拥有该操作的组件注册。
- 多个按键组成一个快捷键时，使用 Frame singleLine 保持一行及至少 4 CSS px 间距；极窄容器由外层横向 ScrollArea 保留完整按键。

## Import

```ts
import { Kbd } from '@snowui-design-system/components';
```

## 按需读取

- [快速开始代码](https://snowui.dev/llms/components/kbd/quick-start.svelte)
- [API](./kbd/api.md)：公开属性、默认值、事件和 Snippet
- [类型与状态](./kbd/types.md)：必填项、可绑定属性、继承与数据结构
- [完整使用边界](./kbd/reference.md)：使用复杂组合前读取相应章节
- [样式覆盖](./kbd/styles.md)：本组件实际消费的公开变量
- [示例与变体](./kbd/examples.md)
- [本组件截图索引](https://snowui.dev/llms/components/kbd/images.json)：只在外观不确定时读取对应图片
- [AI 截图命令与索引说明](../reference/screenshots.md)：生成命令、路径与有效性检查
- [设计使用指南](../guides/design-system.md)：按任务还原设计与查找参数
- [样式选择与改写顺序](../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F)：首次采用时阅读，优先 Props、尽量保留原样；同任务复用
