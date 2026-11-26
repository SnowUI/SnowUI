# OverflowActions

在有限宽度内优先展示操作按钮，并将放不下的操作收进更多菜单，保持工具栏紧凑可用。



包：@snowui-design-system/components；类别：component；运行：全部可免费使用；来源指纹：d6a8e1d9ad1bf8e5

## 使用选择

用于一组操作随可用宽度逐步收进更多菜单。使用 OverflowAction 和 Separator 组合，不在页面重做宽度检测和菜单分配。

- items 使用唯一 id 的 action / separator；显式 children 替换 items。
- 显式组合使用 OverflowAction as="item" 与 Separator as="separator"；compact / overflow / overflowFrom 控制收纳方式。

## Import

```ts
import { OverflowActions } from '@snowui-design-system/components';
```

## 按需读取

- [快速开始代码](https://snowui.dev/llms/components/overflow-actions/quick-start.svelte)
- [API](./overflow-actions/api.md)：公开属性、默认值、事件和 Snippet
- [类型与状态](./overflow-actions/types.md)：必填项、可绑定属性、继承与数据结构
- [完整使用边界](./overflow-actions/reference.md)：使用复杂组合前读取相应章节
- [样式覆盖](./overflow-actions/styles.md)：本组件实际消费的公开变量
- [示例与变体](./overflow-actions/examples.md)
- [本组件截图索引](https://snowui.dev/llms/components/overflow-actions/images.json)：只在外观不确定时读取对应图片
- [AI 截图命令与索引说明](../reference/screenshots.md)：生成命令、路径与有效性检查
- [设计使用指南](../guides/design-system.md)：按任务还原设计与查找参数
- [样式选择与改写顺序](../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F)：首次采用时阅读，优先 Props、尽量保留原样；同任务复用

相关组件：[OverflowAction](./overflow-action.md)、[Separator](./separator.md)、[SelectButton](./select-button.md)
