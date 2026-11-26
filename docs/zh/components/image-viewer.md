# ImageViewer

在页面级预览中查看图片或视频，提供前后切换与关闭操作，适合媒体详情浏览。



包：@snowui-design-system/components；类别：component；运行：全部可免费使用；来源指纹：81663d2b641fa615

## 使用选择

用于图片的放大查看与组间导航。页面内普通图片展示用 Image；不要重写组件已有的缩放、关闭与键盘操作。

- open / items / index 一起省略时使用页面级自动模式；手动模式显式提供预览列表与当前项。
- children 替换全部默认控制按钮；只调整内置按钮外观时使用 parts，避免误删关闭与前后导航。

## Import

```ts
import { ImageViewer } from '@snowui-design-system/components';
```

## 按需读取

- [快速开始代码](https://snowui.dev/llms/components/image-viewer/quick-start.svelte)
- [API](./image-viewer/api.md)：公开属性、默认值、事件和 Snippet
- [类型与状态](./image-viewer/types.md)：必填项、可绑定属性、继承与数据结构
- [完整使用边界](./image-viewer/reference.md)：使用复杂组合前读取相应章节
- [样式覆盖](./image-viewer/styles.md)：本组件实际消费的公开变量
- [示例与变体](./image-viewer/examples.md)
- [本组件截图索引](https://snowui.dev/llms/components/image-viewer/images.json)：只在外观不确定时读取对应图片
- [AI 截图命令与索引说明](../reference/screenshots.md)：生成命令、路径与有效性检查
- [设计使用指南](../guides/design-system.md)：按任务还原设计与查找参数
- [样式选择与改写顺序](../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F)：首次采用时阅读，优先 Props、尽量保留原样；同任务复用

相关组件：[Image](./image.md)、[ImageGroup](./image-group.md)
