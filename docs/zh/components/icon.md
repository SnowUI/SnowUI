# Icon

展示 SVG 图标，并统一尺寸与颜色，适合按钮、导航和内容中的视觉标识。



包：@snowui-design-system/components；类别：component；运行：全部可免费使用；来源指纹：1216a8993e89d40e

## 使用选择

用于统一图标宿主与尺寸。优先复用 SnowUI 资源图标；有操作行为时放入 Button 并提供可访问名称，不把装饰图形误作功能图标。

- 优先提供资源图标；src 与解析后的 icon 均未命中时才渲染 children。
- size 可继承父级尺寸；角标使用 Badge as="badge"。交互名称应提供给拥有操作的按钮。
- Accordion 内的 `Icon as="leading"` 在未显式指定 `size` 时继承 Accordion 图标尺寸：sm/md/lg 分别为 16/20/24；未声明 leading 的 Icon 不参与这项继承，显式 `size` 优先。

## Import

```ts
import { Icon } from '@snowui-design-system/components';
```

## 按需读取

- [快速开始代码](https://snowui.dev/llms/components/icon/quick-start.svelte)
- [API](./icon/api.md)：公开属性、默认值、事件和 Snippet
- [类型与状态](./icon/types.md)：必填项、可绑定属性、继承与数据结构
- [完整使用边界](./icon/reference.md)：使用复杂组合前读取相应章节
- [样式覆盖](./icon/styles.md)：本组件实际消费的公开变量
- [示例与变体](./icon/examples.md)
- [本组件截图索引](https://snowui.dev/llms/components/icon/images.json)：只在外观不确定时读取对应图片
- [AI 截图命令与索引说明](../reference/screenshots.md)：生成命令、路径与有效性检查
- [设计使用指南](../guides/design-system.md)：按任务还原设计与查找参数
- [样式选择与改写顺序](../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F)：首次采用时阅读，优先 Props、尽量保留原样；同任务复用
