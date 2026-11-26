# Sidebar

组织应用的品牌入口、分组导航与底部操作，支持折叠和独立滚动，适合多页面应用。



包：@snowui-design-system/components；类别：block；运行：全部可免费使用；来源指纹：9a5c73c24e82e133

## 使用选择

用于应用左侧分组导航，组合 SidebarSection 与 SidebarItem。页面负责路由和内容；公开 logo / footer 角色可替换内置内容，普通右侧信息列不使用 Sidebar。

- sections 提供导航数据；children 与 sections 同时渲染，并非替换关系。
- 直属 as="logo" 替换标识，as="footer" 进入固定底部；宽度和折叠状态可绑定，默认启用持久化。
- 导航及滚动区默认名称、内置折叠按钮（含text浮层展开按钮）随LocaleProvider更新；显式ariaLabel优先于Provider消息。

## Import

```ts
import { Sidebar } from '@snowui-design-system/components';
```

## 按需读取

- [快速开始代码](https://snowui.dev/llms/components/sidebar/quick-start.svelte)
- [API](./sidebar/api.md)：公开属性、默认值、事件和 Snippet
- [类型与状态](./sidebar/types.md)：必填项、可绑定属性、继承与数据结构
- [完整使用边界](./sidebar/reference.md)：使用复杂组合前读取相应章节
- [样式覆盖](./sidebar/styles.md)：本组件实际消费的公开变量
- [示例与变体](./sidebar/examples.md)
- [本组件截图索引](https://snowui.dev/llms/components/sidebar/images.json)：只在外观不确定时读取对应图片
- [AI 截图命令与索引说明](../reference/screenshots.md)：生成命令、路径与有效性检查
- [设计使用指南](../guides/design-system.md)：按任务还原设计与查找参数
- [样式选择与改写顺序](../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F)：首次采用时阅读，优先 Props、尽量保留原样；同任务复用

相关组件：[SidebarSection](./sidebar-section.md)、[SidebarItem](./sidebar-item.md)
