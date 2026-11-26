# CopyButton

将文字或代码复制到剪贴板，并提供短暂的成功反馈，适合链接、标识符和安装命令。



包：@snowui-design-system/components；类别：component；运行：全部可免费使用；来源指纹：ed3d51e9b41c2ae6

## 使用选择

用于复制内容并显示复制反馈。复用其公开 getText / writeText 入口，不在页面再维护重复的成功状态。

- 静态内容使用 text，动态内容使用 getText；writeText 可替换实际复制实现。
- onCopy / onCopyError 处理业务反馈；showText=false 隐藏文字，成功反馈时间由 feedbackDuration 控制。

## Import

```ts
import { CopyButton } from '@snowui-design-system/components';
```

## 按需读取

- [快速开始代码](https://snowui.dev/llms/components/copy-button/quick-start.svelte)
- [API](./copy-button/api.md)：公开属性、默认值、事件和 Snippet
- [类型与状态](./copy-button/types.md)：必填项、可绑定属性、继承与数据结构
- [完整使用边界](./copy-button/reference.md)：使用复杂组合前读取相应章节
- [样式覆盖](./copy-button/styles.md)：本组件实际消费的公开变量
- [示例与变体](./copy-button/examples.md)
- [本组件截图索引](https://snowui.dev/llms/components/copy-button/images.json)：只在外观不确定时读取对应图片
- [AI 截图命令与索引说明](../reference/screenshots.md)：生成命令、路径与有效性检查
- [设计使用指南](../guides/design-system.md)：按任务还原设计与查找参数
- [样式选择与改写顺序](../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F)：首次采用时阅读，优先 Props、尽量保留原样；同任务复用

相关组件：[Button](./button.md)、[CodeBlock](./code-block.md)
