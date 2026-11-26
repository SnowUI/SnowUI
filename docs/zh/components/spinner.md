# Spinner

以持续旋转的视觉提示表示加载中，提供圆环、辐条和胶囊三种形式，适合按钮与内容区域。



包：@snowui-design-system/components；类别：component；运行：全部可免费使用；来源指纹：9fb86615b605f719

## 使用选择

用于等待状态的持续指示。能提供完成度时使用 Progress；已有按钮或表格加载态优先使用宿主内置 Spinner。

- variant 选择等待图形；size 优先于父级尺寸，无上下文时为 16。
- 不渲染 children；加载说明文字在外部组合。需要完成比例时改用 Progress。
- 加载状态默认名称随LocaleProvider更新，显式aria-label优先；不会替调用方翻译外部加载说明。

## Import

```ts
import { Spinner } from '@snowui-design-system/components';
```

## 按需读取

- [快速开始代码](https://snowui.dev/llms/components/spinner/quick-start.svelte)
- [API](./spinner/api.md)：公开属性、默认值、事件和 Snippet
- [类型与状态](./spinner/types.md)：必填项、可绑定属性、继承与数据结构
- [完整使用边界](./spinner/reference.md)：使用复杂组合前读取相应章节
- [样式覆盖](./spinner/styles.md)：本组件实际消费的公开变量
- [示例与变体](./spinner/examples.md)
- [本组件截图索引](https://snowui.dev/llms/components/spinner/images.json)：只在外观不确定时读取对应图片
- [AI 截图命令与索引说明](../reference/screenshots.md)：生成命令、路径与有效性检查
- [设计使用指南](../guides/design-system.md)：按任务还原设计与查找参数
- [样式选择与改写顺序](../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F)：首次采用时阅读，优先 Props、尽量保留原样；同任务复用
