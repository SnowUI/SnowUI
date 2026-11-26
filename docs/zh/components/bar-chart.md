# BarChart

用柱状图比较不同类别的数据，支持横向、纵向、分组与堆叠展示，以及坐标轴和交互提示。



包：@snowui-design-system/components；类别：component；运行：全部可免费使用；来源指纹：9e2a6f3cfeb5eab7

## 使用选择

用于比较类别数据。连续时间趋势可选 LineChart，占比可选 CircularChart；数值轴和颜色使用图表公开 API，不手写页面 SVG。

- 传入业务 data；省略 data 会显示内置示例数据。mode 控制单柱、分组、堆叠等形态，具体结构见 API 与数据结构。
- loading 保留图表占位并暂停数据交互；HoverPanel 默认开启。图表颜色通过 colors / colorMode 配置。
- 根默认可访问名称随 LocaleProvider 切换，使用 `barChart.name`；显式 `aria-label` 优先。数据单元格组使用 `barChart.cells`。业务名称、数据值与数字格式保持调用方内容。

## Import

```ts
import { BarChart } from '@snowui-design-system/components';
```

## 按需读取

- [快速开始代码](https://snowui.dev/llms/components/bar-chart/quick-start.svelte)
- [API](./bar-chart/api.md)：公开属性、默认值、事件和 Snippet
- [类型与状态](./bar-chart/types.md)：必填项、可绑定属性、继承与数据结构
- [完整使用边界](./bar-chart/reference.md)：使用复杂组合前读取相应章节
- [样式覆盖](./bar-chart/styles.md)：本组件实际消费的公开变量
- [示例与变体](./bar-chart/examples.md)
- [本组件截图索引](https://snowui.dev/llms/components/bar-chart/images.json)：只在外观不确定时读取对应图片
- [AI 截图命令与索引说明](../reference/screenshots.md)：生成命令、路径与有效性检查
- [设计使用指南](../guides/design-system.md)：按任务还原设计与查找参数
- [样式选择与改写顺序](../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F)：首次采用时阅读，优先 Props、尽量保留原样；同任务复用
