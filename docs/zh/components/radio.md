# Radio

在一组互斥选项中选择一项，适合需要直接展示所有选项的表单设置。



包：@snowui-design-system/components；类别：component；运行：全部可免费使用；来源指纹：5ed7ea7a44ff07f9

## 使用选择

用于一组选项中的单选。多选用 Checkbox，分段参数选择用 Segmented；为组和选项提供可访问名称。

- 同组使用 bind:group 和不同的稳定 value；无初始选择可用 null。
- 组件支持取消当前项并写入 undefined，不能假定已选项永远不可取消；提供可读标签。

## Import

```ts
import { Radio } from '@snowui-design-system/components';
```

## 按需读取

- [快速开始代码](https://snowui.dev/llms/components/radio/quick-start.svelte)
- [API](./radio/api.md)：公开属性、默认值、事件和 Snippet
- [类型与状态](./radio/types.md)：必填项、可绑定属性、继承与数据结构
- [完整使用边界](./radio/reference.md)：使用复杂组合前读取相应章节
- [样式覆盖](./radio/styles.md)：本组件实际消费的公开变量
- [示例与变体](./radio/examples.md)
- [本组件截图索引](https://snowui.dev/llms/components/radio/images.json)：只在外观不确定时读取对应图片
- [AI 截图命令与索引说明](../reference/screenshots.md)：生成命令、路径与有效性检查
- [设计使用指南](../guides/design-system.md)：按任务还原设计与查找参数
- [样式选择与改写顺序](../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F)：首次采用时阅读，优先 Props、尽量保留原样；同任务复用
