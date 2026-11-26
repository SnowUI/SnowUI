# Card

为相关内容提供统一的卡片表面，可自由组合文字、媒体和操作，支持固定子项与内容滚动。



包：@snowui-design-system/components；类别：component；运行：全部可免费使用；来源指纹：0cfeb9d3da7d299b

## 使用选择

用于有独立信息层级的内容容器。普通页面网格和留白由页面布局负责；不要给每层嵌套内容重复添加卡片外壳。

- 用 row / column 选择主要布局，contentFill / contentHug 控制内容占位。
- selected、active 和 interactive 分别表达选择、激活与交互；内容由 children 提供，Card 不生成业务信息。

## Import

```ts
import { Card } from '@snowui-design-system/components';
```

## 按需读取

- [快速开始代码](https://snowui.dev/llms/components/card/quick-start.svelte)
- [API](./card/api.md)：公开属性、默认值、事件和 Snippet
- [类型与状态](./card/types.md)：必填项、可绑定属性、继承与数据结构
- [完整使用边界](./card/reference.md)：使用复杂组合前读取相应章节
- [样式覆盖](./card/styles.md)：本组件实际消费的公开变量
- [示例与变体](./card/examples.md)
- [本组件截图索引](https://snowui.dev/llms/components/card/images.json)：只在外观不确定时读取对应图片
- [AI 截图命令与索引说明](../reference/screenshots.md)：生成命令、路径与有效性检查
- [设计使用指南](../guides/design-system.md)：按任务还原设计与查找参数
- [样式选择与改写顺序](../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F)：首次采用时阅读，优先 Props、尽量保留原样；同任务复用
