# Checkbox

选择一个或多个独立选项，支持选中、未选中和部分选中状态，适合表单与批量选择。



包：@snowui-design-system/components；类别：component；运行：全部可免费使用；来源指纹：107fe9d2b81f1985

## 使用选择

用于独立开关或多项选择。互斥单选用 Radio，立即生效的二态设置用 Switch；DataTable 选择列优先使用其内置选择协议。

- 独立布尔状态使用 `bind:checked`；多选数组使用 `bind:group` 并为各项提供稳定 value。
- indeterminate 表示部分选中；与 checked 分开管理。提供标签或 ariaLabel，禁用使用 disabled。

## Import

```ts
import { Checkbox } from '@snowui-design-system/components';
```

## 按需读取

- [快速开始代码](https://snowui.dev/llms/components/checkbox/quick-start.svelte)
- [API](./checkbox/api.md)：公开属性、默认值、事件和 Snippet
- [类型与状态](./checkbox/types.md)：必填项、可绑定属性、继承与数据结构
- [完整使用边界](./checkbox/reference.md)：使用复杂组合前读取相应章节
- [样式覆盖](./checkbox/styles.md)：本组件实际消费的公开变量
- [示例与变体](./checkbox/examples.md)
- [本组件截图索引](https://snowui.dev/llms/components/checkbox/images.json)：只在外观不确定时读取对应图片
- [AI 截图命令与索引说明](../reference/screenshots.md)：生成命令、路径与有效性检查
- [设计使用指南](../guides/design-system.md)：按任务还原设计与查找参数
- [样式选择与改写顺序](../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F)：首次采用时阅读，优先 Props、尽量保留原样；同任务复用
