# ChartGroup

将多个图表组合在同一区域，协调分类悬停、叠加绘制与共享坐标轴，便于比较关联数据。



包：@snowui-design-system/components；类别：component；运行：全部可免费使用；来源指纹：329e3e53c1c02dfb

## 使用选择

用于在共享配置下组合图表。各图表仍通过自己的公开数据与视觉 API 配置，不通过页面选择器修改内部 marks。

- 只提供共享轴与交互配置，不自动创建图表、标题或图例。
- 显式组合 BarChart / LineChart，并协调各自 width、height 与定位，才能共享同一画布。
- 根默认可访问名称随 LocaleProvider 切换，使用 `chartGroup.name`；显式 `aria-label` 优先。数据单元格组使用 `chartGroup.cells`。缺少 xLabels 对应项时使用 `chartGroup.cell` 的 `{{index}}` 完整模板（从 1 开始）；显式分类名称保持原样。业务名称、数据值与数字格式保持调用方内容。

## Import

```ts
import { ChartGroup } from '@snowui-design-system/components';
```

## 按需读取

- [快速开始代码](https://snowui.dev/llms/components/chart-group/quick-start.svelte)
- [API](./chart-group/api.md)：公开属性、默认值、事件和 Snippet
- [类型与状态](./chart-group/types.md)：必填项、可绑定属性、继承与数据结构
- [完整使用边界](./chart-group/reference.md)：使用复杂组合前读取相应章节
- [样式覆盖](./chart-group/styles.md)：本组件实际消费的公开变量
- [示例与变体](./chart-group/examples.md)
- [本组件截图索引](https://snowui.dev/llms/components/chart-group/images.json)：只在外观不确定时读取对应图片
- [AI 截图命令与索引说明](../reference/screenshots.md)：生成命令、路径与有效性检查
- [设计使用指南](../guides/design-system.md)：按任务还原设计与查找参数
- [样式选择与改写顺序](../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F)：首次采用时阅读，优先 Props、尽量保留原样；同任务复用
