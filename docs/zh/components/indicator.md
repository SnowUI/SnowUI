# Indicator

提供可拖动的尺寸调整手柄，支持鼠标与键盘操作，可用于面板和内容区域的大小调整。



包：@snowui-design-system/components；类别：component；运行：全部可免费使用；来源指纹：fade3c06cd8b93a0

## 使用选择

用于组件公开的指示或拖动调节能力。业务页面先使用已经内置该能力的 Sidebar、SidePanel 或表格列，不复制它们的拖动逻辑。

- target 默认是直接父元素，也可显式关联其他元素；minSize / maxSize 限制尺寸范围。
- applySize 控制是否直接应用尺寸，onSizeChange 提供更新值；键盘步长使用 step / largeStep。

## Import

```ts
import { Indicator } from '@snowui-design-system/components';
```

## 按需读取

- [快速开始代码](https://snowui.dev/llms/components/indicator/quick-start.svelte)
- [API](./indicator/api.md)：公开属性、默认值、事件和 Snippet
- [类型与状态](./indicator/types.md)：必填项、可绑定属性、继承与数据结构
- [完整使用边界](./indicator/reference.md)：使用复杂组合前读取相应章节
- [样式覆盖](./indicator/styles.md)：本组件实际消费的公开变量
- [示例与变体](./indicator/examples.md)
- [本组件截图索引](https://snowui.dev/llms/components/indicator/images.json)：只在外观不确定时读取对应图片
- [AI 截图命令与索引说明](../reference/screenshots.md)：生成命令、路径与有效性检查
- [设计使用指南](../guides/design-system.md)：按任务还原设计与查找参数
- [样式选择与改写顺序](../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F)：首次采用时阅读，优先 Props、尽量保留原样；同任务复用
