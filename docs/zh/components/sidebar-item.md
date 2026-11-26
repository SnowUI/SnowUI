# SidebarItem

在 Sidebar 中呈现导航入口，支持激活状态、图标、层级与状态提示，帮助识别当前位置。



包：@snowui-design-system/components；类别：block；运行：全部可免费使用；来源指纹：48e974d9ecc6873a

## 使用选择

用于 Sidebar 导航入口，提供稳定身份、图标、文本和目标地址。激活状态不等于自动完成业务路由。

- 提供稳定 id 与 label；href 表示导航地址，onSelect 处理选择通知。
- disabled 禁止导航；actions 配置条目附加操作，parts 配置内置徽标和操作按钮。
- 内置updated圆点的名称随LocaleProvider更新；label、tags及actions仍属调用方内容。折叠态的装饰与可访问树结构保持原有契约。

## Import

```ts
import { SidebarItem } from '@snowui-design-system/components';
```

## 按需读取

- [快速开始代码](https://snowui.dev/llms/components/sidebar-item/quick-start.svelte)
- [API](./sidebar-item/api.md)：公开属性、默认值、事件和 Snippet
- [类型与状态](./sidebar-item/types.md)：必填项、可绑定属性、继承与数据结构
- [完整使用边界](./sidebar-item/reference.md)：使用复杂组合前读取相应章节
- [样式覆盖](./sidebar-item/styles.md)：本组件实际消费的公开变量
- [示例与变体](./sidebar-item/examples.md)
- [本组件截图索引](https://snowui.dev/llms/components/sidebar-item/images.json)：只在外观不确定时读取对应图片
- [AI 截图命令与索引说明](../reference/screenshots.md)：生成命令、路径与有效性检查
- [设计使用指南](../guides/design-system.md)：按任务还原设计与查找参数
- [样式选择与改写顺序](../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F)：首次采用时阅读，优先 Props、尽量保留原样；同任务复用
