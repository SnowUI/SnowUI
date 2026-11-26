# ImageGroup

统一组织多张图片的尺寸与排列，并提供成组预览，适合图库、附件和图片集合。



包：@snowui-design-system/components；类别：component；运行：全部可免费使用；来源指纹：c879f78c54a6b6b0

## 使用选择

用于在共享配置下组织图片。需要全屏查看、缩放或组间导航时配合 ImageViewer；布局与图片加载状态由公开 API 表达。

- 用 layout 选择组布局、size 统一图片尺寸。
- Image 子项自动加入媒体组；子项显式尺寸或 previewMode 优先于组默认配置。

## Import

```ts
import { ImageGroup } from '@snowui-design-system/components';
```

## 按需读取

- [快速开始代码](https://snowui.dev/llms/components/image-group/quick-start.svelte)
- [API](./image-group/api.md)：公开属性、默认值、事件和 Snippet
- [类型与状态](./image-group/types.md)：必填项、可绑定属性、继承与数据结构
- [完整使用边界](./image-group/reference.md)：使用复杂组合前读取相应章节
- [样式覆盖](./image-group/styles.md)：本组件实际消费的公开变量
- [示例与变体](./image-group/examples.md)
- [本组件截图索引](https://snowui.dev/llms/components/image-group/images.json)：只在外观不确定时读取对应图片
- [AI 截图命令与索引说明](../reference/screenshots.md)：生成命令、路径与有效性检查
- [设计使用指南](../guides/design-system.md)：按任务还原设计与查找参数
- [样式选择与改写顺序](../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F)：首次采用时阅读，优先 Props、尽量保留原样；同任务复用
