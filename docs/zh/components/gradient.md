# Gradient

以柔和的多层渐变丰富背景与占位画面，提供六种配色与可缩放的形变效果。



包：@snowui-design-system/components；类别：component；运行：全部可免费使用；来源指纹：164917a2722f32cb

## 使用选择

用于已内置的装饰性渐变图形或头像占位。艺术配色不作为普通 UI 的主题颜色；页面表面和文字仍使用语义颜色。

- size 同时设置宽高且优先于 width / height；seed 用于稳定同一对象的图形。
- 作为装饰保持 decorative；配色仅用于该装饰图形，页面文字与表面继续使用语义 Token。

## Import

```ts
import { Gradient } from '@snowui-design-system/components';
```

## 按需读取

- [快速开始代码](https://snowui.dev/llms/components/gradient/quick-start.svelte)
- [API](./gradient/api.md)：公开属性、默认值、事件和 Snippet
- [类型与状态](./gradient/types.md)：必填项、可绑定属性、继承与数据结构
- [完整使用边界](./gradient/reference.md)：使用复杂组合前读取相应章节
- [样式覆盖](./gradient/styles.md)：本组件实际消费的公开变量
- [示例与变体](./gradient/examples.md)
- [本组件截图索引](https://snowui.dev/llms/components/gradient/images.json)：只在外观不确定时读取对应图片
- [AI 截图命令与索引说明](../reference/screenshots.md)：生成命令、路径与有效性检查
- [设计使用指南](../guides/design-system.md)：按任务还原设计与查找参数
- [样式选择与改写顺序](../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F)：首次采用时阅读，优先 Props、尽量保留原样；同任务复用
