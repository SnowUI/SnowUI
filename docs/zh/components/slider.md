# Slider

通过拖动选择单个数值或数值区间，支持水平、垂直、步进与填充式展示，适合范围和参数调整。



包：@snowui-design-system/components；类别：component；运行：全部可免费使用；来源指纹：b7a09a3ef8b5830b

## 使用选择

用于连续值或范围调整。离散选项切换用 Segmented / Select；明确 minValue、maxValue、step 和可访问名称。

- bind:value 使用数值表示单滑块，数组表示双滑块范围；边界属性为 minValue / maxValue。
- step 控制步长，ariaLabel 提供名称；显式 Text as="label" 替换默认标签。
- solid／soft 的缺省条形标题随 LocaleProvider 切换；显式 title（含空字符串）、ariaLabel、数值及显式 label 保持原样。标题不替代可访问名称。

## Import

```ts
import { Slider } from '@snowui-design-system/components';
```

## 按需读取

- [快速开始代码](https://snowui.dev/llms/components/slider/quick-start.svelte)
- [API](./slider/api.md)：公开属性、默认值、事件和 Snippet
- [类型与状态](./slider/types.md)：必填项、可绑定属性、继承与数据结构
- [完整使用边界](./slider/reference.md)：使用复杂组合前读取相应章节
- [样式覆盖](./slider/styles.md)：本组件实际消费的公开变量
- [示例与变体](./slider/examples.md)
- [本组件截图索引](https://snowui.dev/llms/components/slider/images.json)：只在外观不确定时读取对应图片
- [AI 截图命令与索引说明](../reference/screenshots.md)：生成命令、路径与有效性检查
- [设计使用指南](../guides/design-system.md)：按任务还原设计与查找参数
- [样式选择与改写顺序](../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F)：首次采用时阅读，优先 Props、尽量保留原样；同任务复用
