# TableHeader

组织 Table 的表头行，明确各列含义，并保留原生表格的表头语义。



包：@snowui-design-system/components；类别：component；运行：全部可免费使用；来源指纹：67c07049c332dfd5

## 使用选择

作为 Table 的表头区域，包含表头 TableRow 与 TableHead；保持原生表格语义。

- 放在 Table 内，使用 TableRow 组织 TableHead。
- 只承担表头区域语义；排序、列宽与选择分别由对应 TableHead 和 DataTable 配置。

## Import

```ts
import { TableHeader } from '@snowui-design-system/components';
```

## 按需读取

- [快速开始代码](https://snowui.dev/llms/components/table-header/quick-start.svelte)
- [API](./table-header/api.md)：公开属性、默认值、事件和 Snippet
- [类型与状态](./table-header/types.md)：必填项、可绑定属性、继承与数据结构
- [完整使用边界](./table-header/reference.md)：使用复杂组合前读取相应章节
- [样式覆盖](./table-header/styles.md)：本组件实际消费的公开变量
- [示例与变体](./table-header/examples.md)
- [本组件截图索引](https://snowui.dev/llms/components/table-header/images.json)：只在外观不确定时读取对应图片
- [AI 截图命令与索引说明](../reference/screenshots.md)：生成命令、路径与有效性检查
- [设计使用指南](../guides/design-system.md)：按任务还原设计与查找参数
- [样式选择与改写顺序](../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F)：首次采用时阅读，优先 Props、尽量保留原样；同任务复用
