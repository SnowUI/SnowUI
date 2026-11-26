# Avatar

展示用户或团队头像，支持图片、文字和渐变占位，让列表、评论与成员信息更易辨认。



包：@snowui-design-system/components；类别：component；运行：全部可免费使用；来源指纹：d12db5edc396097f

## 使用选择

用于用户或团队身份。单个头像用 Avatar，重叠成员用 AvatarGroup；纵向联系人列表使用 Avatar 配合普通列表和文本。

- 通过 src 显示头像，使用 fallback / fallbackText 配置回退；为同一身份提供稳定 fallbackSeed。
- 附属角标用 `as="badge"`，替换头像视觉用 `as="avatar-image"`；尺寸优先使用显式 size，其次父级头像尺寸。

## Import

```ts
import { Avatar } from '@snowui-design-system/components';
```

## 按需读取

- [快速开始代码](https://snowui.dev/llms/components/avatar/quick-start.svelte)
- [API](./avatar/api.md)：公开属性、默认值、事件和 Snippet
- [类型与状态](./avatar/types.md)：必填项、可绑定属性、继承与数据结构
- [完整使用边界](./avatar/reference.md)：使用复杂组合前读取相应章节
- [样式覆盖](./avatar/styles.md)：本组件实际消费的公开变量
- [示例与变体](./avatar/examples.md)
- [本组件截图索引](https://snowui.dev/llms/components/avatar/images.json)：只在外观不确定时读取对应图片
- [AI 截图命令与索引说明](../reference/screenshots.md)：生成命令、路径与有效性检查
- [设计使用指南](../guides/design-system.md)：按任务还原设计与查找参数
- [样式选择与改写顺序](../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F)：首次采用时阅读，优先 Props、尽量保留原样；同任务复用
