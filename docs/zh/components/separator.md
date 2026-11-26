# Separator

用水平或垂直分割线划分内容与操作区域，帮助建立清晰的信息层次。



包：@snowui-design-system/components；类别：component；运行：全部可免费使用；来源指纹：668fbc6c31ac51ea

## 使用选择

用于 UI 区域之间的水平或竖直分隔。不是图表坐标线、活动轨迹线或装饰路径的通用绘图组件。

- row / column 选择方向，length / thickness 控制长度与粗细，值使用对应系统 Token。
- 纯装饰保持 decorative；只有真正表达内容分隔时才配置可访问语义。

## Import

```ts
import { Separator } from '@snowui-design-system/components';
```

## 按需读取

- [快速开始代码](https://snowui.dev/llms/components/separator/quick-start.svelte)
- [API](./separator/api.md)：公开属性、默认值、事件和 Snippet
- [类型与状态](./separator/types.md)：必填项、可绑定属性、继承与数据结构
- [完整使用边界](./separator/reference.md)：使用复杂组合前读取相应章节
- [样式覆盖](./separator/styles.md)：本组件实际消费的公开变量
- [示例与变体](./separator/examples.md)
- [本组件截图索引](https://snowui.dev/llms/components/separator/images.json)：只在外观不确定时读取对应图片
- [AI 截图命令与索引说明](../reference/screenshots.md)：生成命令、路径与有效性检查
- [设计使用指南](../guides/design-system.md)：按任务还原设计与查找参数
- [样式选择与改写顺序](../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F)：首次采用时阅读，优先 Props、尽量保留原样；同任务复用
