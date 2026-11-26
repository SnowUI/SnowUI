# CircularChart

用圆环或饼图展示数据占比，支持分段、圆角、环厚与悬停强调，适合构成分析和比例概览。



包：@snowui-design-system/components；类别：component；运行：全部可免费使用；来源指纹：3c3b50417707acec

## 使用选择

用于展示占比、环形或饼图数据。目标完成度可按语义选择 GaugeChart 或 Progress；颜色与标签使用公开配置。

- data 使用 name 与有限正 value；只显示前 maxItems 个有效项，占比分母为这些显示项之和。显式空数组展示空图。
- 推荐用数字 size；字符串几何只取数值部分，不能依赖百分比或 CSS 变量完成自适应。中心内容用公开 center-label / segment-value / segment-name 角色。
- 根默认可访问名称随 LocaleProvider 切换，使用 `circularChart.name`；显式 `aria-label` 优先。业务名称、数据值与数字格式保持调用方内容。

## Import

```ts
import { CircularChart } from '@snowui-design-system/components';
```

## 按需读取

- [快速开始代码](https://snowui.dev/llms/components/circular-chart/quick-start.svelte)
- [API](./circular-chart/api.md)：公开属性、默认值、事件和 Snippet
- [类型与状态](./circular-chart/types.md)：必填项、可绑定属性、继承与数据结构
- [完整使用边界](./circular-chart/reference.md)：使用复杂组合前读取相应章节
- [样式覆盖](./circular-chart/styles.md)：本组件实际消费的公开变量
- [示例与变体](./circular-chart/examples.md)
- [本组件截图索引](https://snowui.dev/llms/components/circular-chart/images.json)：只在外观不确定时读取对应图片
- [AI 截图命令与索引说明](../reference/screenshots.md)：生成命令、路径与有效性检查
- [设计使用指南](../guides/design-system.md)：按任务还原设计与查找参数
- [样式选择与改写顺序](../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F)：首次采用时阅读，优先 Props、尽量保留原样；同任务复用
