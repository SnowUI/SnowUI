# SidePanel

从页面右侧展示详情或辅助内容，支持浮层与内嵌两种形态，让用户保留主页面上下文。



包：@snowui-design-system/components；类别：component；运行：全部可免费使用；来源指纹：5190f855205429d4

## 使用选择

用于可打开、关闭的详情或辅助面板，支持浮动与内嵌。一直显示的通知、活动、联系人栏可用页面 aside，不因位置在右侧就使用此组件。

- bind:open 控制显示，placement 选择浮动或内嵌，width 可绑定并受最小/最大值限制。
- children 是滚动内容；内嵌位移动效按 inlineMotionOwner 指定唯一负责方，避免页面与组件重复移动。
- 未传 title 时，工具栏标题与面板名称随 LocaleProvider 切换；显式 title（含空字符串）及业务内容保持原样。

## Import

```ts
import { SidePanel } from '@snowui-design-system/components';
```

## 按需读取

- [快速开始代码](https://snowui.dev/llms/components/side-panel/quick-start.svelte)
- [API](./side-panel/api.md)：公开属性、默认值、事件和 Snippet
- [类型与状态](./side-panel/types.md)：必填项、可绑定属性、继承与数据结构
- [完整使用边界](./side-panel/reference.md)：使用复杂组合前读取相应章节
- [样式覆盖](./side-panel/styles.md)：本组件实际消费的公开变量
- [示例与变体](./side-panel/examples.md)
- [本组件截图索引](https://snowui.dev/llms/components/side-panel/images.json)：只在外观不确定时读取对应图片
- [AI 截图命令与索引说明](../reference/screenshots.md)：生成命令、路径与有效性检查
- [设计使用指南](../guides/design-system.md)：按任务还原设计与查找参数
- [样式选择与改写顺序](../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F)：首次采用时阅读，优先 Props、尽量保留原样；同任务复用

相关组件：[DataTable](./data-table.md)
