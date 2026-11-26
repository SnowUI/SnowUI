# LineChart

用折线展示数据变化趋势，支持多序列、面积填充、实线与虚线，以及坐标轴、网格和节点样式。



包：@snowui-design-system/components；类别：component；运行：全部可免费使用；来源指纹：8afd02e81c967956

## 使用选择

用于连续数据或时间趋势。类别比较用 BarChart；数据点、轴、提示与颜色通过公开图表配置声明。

- 通过 series 提供数据；组件不生成示例数据，xLabels 与数据点应保持对应。
- loading 保留轴与画布，等待结束后展示数据；HoverPanel 默认开启，颜色和格式使用图表公开配置。
- 根默认可访问名称随 LocaleProvider 切换，使用 `lineChart.name`；显式 `aria-label` 优先。数据单元格组使用 `lineChart.cells`。业务名称、数据值与数字格式保持调用方内容。

## Import

```ts
import { LineChart } from '@snowui-design-system/components';
```

## 按需读取

- [快速开始代码](https://snowui.dev/llms/components/line-chart/quick-start.svelte)
- [API](./line-chart/api.md)：公开属性、默认值、事件和 Snippet
- [类型与状态](./line-chart/types.md)：必填项、可绑定属性、继承与数据结构
- [完整使用边界](./line-chart/reference.md)：使用复杂组合前读取相应章节
- [样式覆盖](./line-chart/styles.md)：本组件实际消费的公开变量
- [示例与变体](./line-chart/examples.md)
- [本组件截图索引](https://snowui.dev/llms/components/line-chart/images.json)：只在外观不确定时读取对应图片
- [AI 截图命令与索引说明](../reference/screenshots.md)：生成命令、路径与有效性检查
- [设计使用指南](../guides/design-system.md)：按任务还原设计与查找参数
- [样式选择与改写顺序](../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F)：首次采用时阅读，优先 Props、尽量保留原样；同任务复用
