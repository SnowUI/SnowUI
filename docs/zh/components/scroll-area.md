# ScrollArea

为内容提供可滚动区域与统一的滚动条，适合长列表、面板和受限空间中的正文。



包：@snowui-design-system/components；类别：component；运行：全部可免费使用；来源指纹：80574e40e8bbeb38

## 使用选择

用于需要独立滚动的区域。页面不应无意创建多层嵌套滚动；表格的局部横向滚动优先沿用 Table。

- axis 选择滚动方向；内容或宿主需要有限尺寸才能形成滚动区域。
- bind:viewport 获取实际滚动元素，onscroll 接收滚动事件；用 ariaLabel 描述区域用途。
- 滚动viewport默认名称随LocaleProvider更新，显式ariaLabel优先；children保持调用方内容。

## Import

```ts
import { ScrollArea } from '@snowui-design-system/components';
```

## 按需读取

- [快速开始代码](https://snowui.dev/llms/components/scroll-area/quick-start.svelte)
- [API](./scroll-area/api.md)：公开属性、默认值、事件和 Snippet
- [类型与状态](./scroll-area/types.md)：必填项、可绑定属性、继承与数据结构
- [完整使用边界](./scroll-area/reference.md)：使用复杂组合前读取相应章节
- [样式覆盖](./scroll-area/styles.md)：本组件实际消费的公开变量
- [示例与变体](./scroll-area/examples.md)
- [本组件截图索引](https://snowui.dev/llms/components/scroll-area/images.json)：只在外观不确定时读取对应图片
- [AI 截图命令与索引说明](../reference/screenshots.md)：生成命令、路径与有效性检查
- [设计使用指南](../guides/design-system.md)：按任务还原设计与查找参数
- [样式选择与改写顺序](../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F)：首次采用时阅读，优先 Props、尽量保留原样；同任务复用
