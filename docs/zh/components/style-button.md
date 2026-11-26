# StyleButton

在 SnowUI 与 Apple 两种视觉风格之间切换，适合提供界面风格选择的入口。



包：@snowui-design-system/components；类别：component；运行：全部可免费使用；来源指纹：f3bd4e9279066afd

## 使用选择

用于切换支持的视觉风格；明暗模式使用 ColorSchemeButton。它不意味着可以通过一个按钮改变任意组件私有样式。

- bind:mode 同步风格，defaultMode 提供初始模式。
- 默认把模式应用到文档；局部控制使用 applyToDocument=false，不提供 children 时使用纯图标布局。

## Import

```ts
import { StyleButton } from '@snowui-design-system/components';
```

## 按需读取

- [快速开始代码](https://snowui.dev/llms/components/style-button/quick-start.svelte)
- [API](./style-button/api.md)：公开属性、默认值、事件和 Snippet
- [类型与状态](./style-button/types.md)：必填项、可绑定属性、继承与数据结构
- [完整使用边界](./style-button/reference.md)：使用复杂组合前读取相应章节
- [样式覆盖](./style-button/styles.md)：本组件实际消费的公开变量
- [示例与变体](./style-button/examples.md)
- [本组件截图索引](https://snowui.dev/llms/components/style-button/images.json)：只在外观不确定时读取对应图片
- [AI 截图命令与索引说明](../reference/screenshots.md)：生成命令、路径与有效性检查
- [设计使用指南](../guides/design-system.md)：按任务还原设计与查找参数
- [样式选择与改写顺序](../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F)：首次采用时阅读，优先 Props、尽量保留原样；同任务复用
