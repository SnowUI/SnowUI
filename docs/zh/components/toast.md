# Toast

用短暂通知反馈操作结果或状态变化，支持图标、操作和富内容，适合保存成功、错误与提醒。



包：@snowui-design-system/components；类别：component；运行：全部可免费使用；来源指纹：af077cd873dd50b2

## 使用选择

用于短暂的操作结果反馈，配合 Toaster 管理展示。通知历史、活动记录使用常驻内容列表，不使用 Toast。

- 调用 toast 发送短暂反馈，由 Toaster 管理队列；独立渲染时页面负责关闭后的移除。
- as="toast" 可接入宿主点击触发；leading / trailing 组合附属内容，parts 只配置默认关闭按钮。短标签使用继承的 singleLine 与 Text lines={1}；内部有效间距至少4 CSS px，rich 多行正文保持原布局。

## Import

```ts
import { Toast } from '@snowui-design-system/components';
```

## 按需读取

- [快速开始代码](https://snowui.dev/llms/components/toast/quick-start.svelte)
- [API](./toast/api.md)：公开属性、默认值、事件和 Snippet
- [类型与状态](./toast/types.md)：必填项、可绑定属性、继承与数据结构
- [完整使用边界](./toast/reference.md)：使用复杂组合前读取相应章节
- [样式覆盖](./toast/styles.md)：本组件实际消费的公开变量
- [示例与变体](./toast/examples.md)
- [本组件截图索引](https://snowui.dev/llms/components/toast/images.json)：只在外观不确定时读取对应图片
- [AI 截图命令与索引说明](../reference/screenshots.md)：生成命令、路径与有效性检查
- [设计使用指南](../guides/design-system.md)：按任务还原设计与查找参数
- [样式选择与改写顺序](../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F)：首次采用时阅读，优先 Props、尽量保留原样；同任务复用
