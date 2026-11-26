# Progress

以条形或圆形反馈任务进度，支持明确进度与不确定状态，适合上传、处理和加载过程。



包：@snowui-design-system/components；类别：component；运行：全部可免费使用；来源指纹：81196d78f4400ed2

## 使用选择

用于已知或未知完成度的进度反馈；未知进度使用 isIndeterminate。纯等待指示也可用 Spinner，业务数值仪表可选 GaugeChart。

- value 是 0–100 的百分比；未知进度使用 isIndeterminate，不能用虚构百分比代替。
- variant 选择 line / circle；circle 的 showLabel 生成标签，显式 children 替换默认标签。

## Import

```ts
import { Progress } from '@snowui-design-system/components';
```

## 按需读取

- [快速开始代码](https://snowui.dev/llms/components/progress/quick-start.svelte)
- [API](./progress/api.md)：公开属性、默认值、事件和 Snippet
- [类型与状态](./progress/types.md)：必填项、可绑定属性、继承与数据结构
- [完整使用边界](./progress/reference.md)：使用复杂组合前读取相应章节
- [样式覆盖](./progress/styles.md)：本组件实际消费的公开变量
- [示例与变体](./progress/examples.md)
- [本组件截图索引](https://snowui.dev/llms/components/progress/images.json)：只在外观不确定时读取对应图片
- [AI 截图命令与索引说明](../reference/screenshots.md)：生成命令、路径与有效性检查
- [设计使用指南](../guides/design-system.md)：按任务还原设计与查找参数
- [样式选择与改写顺序](../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F)：首次采用时阅读，优先 Props、尽量保留原样；同任务复用
