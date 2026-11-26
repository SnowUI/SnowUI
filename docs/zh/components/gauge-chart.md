# GaugeChart

用半环或半饼展示多项数据占比，支持分段、渐变、环厚与出现动效，适合比例概览。



包：@snowui-design-system/components；类别：component；运行：全部可免费使用；来源指纹：d4bb5aae5a5133f1

## 使用选择

用于半环形比例数据展示。当前数据模型与 CircularChart 一样以各项之和计算占比；任务完成进度使用 Progress。

- 当前组件展示半环形比例数据，并非 min/max 单指标仪表；data 每项使用 name 和正 value，占比按有效显示项之和计算。
- 省略 data 会显示示例数据，空数组展示空图；中心文案与内容用 centerTitle、centerSubtitle 或公开角色配置。
- 根默认可访问名称随 LocaleProvider 切换，使用 `gaugeChart.name`；显式 `aria-label` 优先。业务名称、数据值与数字格式保持调用方内容。

## Import

```ts
import { GaugeChart } from '@snowui-design-system/components';
```

## 按需读取

- [快速开始代码](https://snowui.dev/llms/components/gauge-chart/quick-start.svelte)
- [API](./gauge-chart/api.md)：公开属性、默认值、事件和 Snippet
- [类型与状态](./gauge-chart/types.md)：必填项、可绑定属性、继承与数据结构
- [完整使用边界](./gauge-chart/reference.md)：使用复杂组合前读取相应章节
- [样式覆盖](./gauge-chart/styles.md)：本组件实际消费的公开变量
- [示例与变体](./gauge-chart/examples.md)
- [本组件截图索引](https://snowui.dev/llms/components/gauge-chart/images.json)：只在外观不确定时读取对应图片
- [AI 截图命令与索引说明](../reference/screenshots.md)：生成命令、路径与有效性检查
- [设计使用指南](../guides/design-system.md)：按任务还原设计与查找参数
- [样式选择与改写顺序](../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F)：首次采用时阅读，优先 Props、尽量保留原样；同任务复用

相关组件：[CircularChart](./circular-chart.md)、[Progress](./progress.md)
