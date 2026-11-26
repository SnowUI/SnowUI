# SearchBox

提供打开搜索浮层的入口，整块区域均可点击，可组合快捷键提示，适合全局搜索。



包：@snowui-design-system/components；类别：component；运行：全部可免费使用；来源指纹：e069b6173d1d908f

## 使用选择

用于打开全局搜索浮层的可点击入口，并非直接编辑查询的输入框。工具栏或列表直接输入查询用 SearchInput。

- 这是可点击搜索入口；bind:open 同步浮层状态，value 用于展示当前查询。
- 通过 children 组合浮层或快捷键提示；需要直接编辑查询时使用 SearchInput。
- 默认占位和清除名称随 LocaleProvider 切换；显式 placeholder（含空字符串）与 aria-label 优先，查询值保持原样。

## Import

```ts
import { SearchBox } from '@snowui-design-system/components';
```

## 按需读取

- [快速开始代码](https://snowui.dev/llms/components/search-box/quick-start.svelte)
- [API](./search-box/api.md)：公开属性、默认值、事件和 Snippet
- [类型与状态](./search-box/types.md)：必填项、可绑定属性、继承与数据结构
- [完整使用边界](./search-box/reference.md)：使用复杂组合前读取相应章节
- [样式覆盖](./search-box/styles.md)：本组件实际消费的公开变量
- [示例与变体](./search-box/examples.md)
- [本组件截图索引](https://snowui.dev/llms/components/search-box/images.json)：只在外观不确定时读取对应图片
- [AI 截图命令与索引说明](../reference/screenshots.md)：生成命令、路径与有效性检查
- [设计使用指南](../guides/design-system.md)：按任务还原设计与查找参数
- [样式选择与改写顺序](../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F)：首次采用时阅读，优先 Props、尽量保留原样；同任务复用

相关组件：[SearchInput](./search-input.md)、[SearchPopup](./search-popup.md)、[Dialog](./dialog.md)
