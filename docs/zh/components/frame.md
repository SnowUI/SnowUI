# Frame

统一布局、状态、加载与动效，并通过显式配置支持多个组件的联动和样式编排。



包：@snowui-design-system/components；类别：component；运行：全部可免费使用；来源指纹：acd4e16843c927c5

## 使用选择

用于需要布局、状态、Context、loading、Skeleton 与动效的通用宿主；普通页面结构可使用语义 HTML。

- row / column / grid 选择布局；as 声明组合角色，bind:element 获取根元素。
- 单行标签使用 singleLine；允许换行的图文正文使用 row firstLine。颜色、间距和圆角优先 Token 与公开 class/style。
- orchestrate*、target/action 和 styles 都由 Frame 承接；跨组件 Motion 使用 initMotion() 建立上下文。
- 没有配置 styles、没有 Motion 上下文时，不创建跨组件注册表或动效订阅。

## Import

```ts
import { Frame } from '@snowui-design-system/components';
```

## 按需读取

- [快速开始代码](https://snowui.dev/llms/components/frame/quick-start.svelte)
- [API](./frame/api.md)：公开属性、默认值、事件和 Snippet
- [类型与状态](./frame/types.md)：必填项、可绑定属性、继承与数据结构
- [完整使用边界](./frame/reference.md)：使用复杂组合前读取相应章节
- [样式覆盖](./frame/styles.md)：本组件实际消费的公开变量
- [示例与变体](./frame/examples.md)
- [本组件截图索引](https://snowui.dev/llms/components/frame/images.json)：只在外观不确定时读取对应图片
- [AI 截图命令与索引说明](../reference/screenshots.md)：生成命令、路径与有效性检查
- [设计使用指南](../guides/design-system.md)：按任务还原设计与查找参数
- [样式选择与改写顺序](../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F)：首次采用时阅读，优先 Props、尽量保留原样；同任务复用
