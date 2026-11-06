# TableHeader

> **版本**: v1.1.0
> **职责**: 组织 Table 的表头行，明确各列含义，并保留原生表格的表头语义。
> **包归属**: `@snowui-design-system/components`
> **文档修订**: 2026-09-21

## 组件介绍

组织 Table 的表头行，明确各列含义，并保留原生表格的表头语义。

## 使用选择

<!-- usage-guide:start -->
作为 Table 的表头区域，包含表头 TableRow 与 TableHead；保持原生表格语义。

- 放在 Table 内，使用 TableRow 组织 TableHead。
- 只承担表头区域语义；排序、列宽与选择分别由对应 TableHead 和 DataTable 配置。
<!-- usage-guide:end -->

## 快速开始

以下示例展示推荐的基本组合。更多场景与组合限制见后文。

<!-- quick-start:generated -->
```svelte
<script lang="ts">
	import { TableHeader, Table, TableBody, TableCell, TableRow, TableHead } from '@snowui-design-system/components';
</script>

<Table ariaLabel="SnowUI component catalog columns" minWidth={680}>
	<TableHeader><TableRow>
		<TableHead columnId="component">Component</TableHead>
		<TableHead columnId="package">Package</TableHead>
		<TableHead columnId="category">Category</TableHead>
		<TableHead columnId="updated">Last updated</TableHead>
		<TableHead columnId="status" align="end">Documentation</TableHead>
	</TableRow></TableHeader>
	<TableBody><TableRow rowId="button"><TableCell columnId="component">Button</TableCell><TableCell columnId="package">components</TableCell><TableCell columnId="category">Basic</TableCell><TableCell columnId="updated">Today</TableCell><TableCell columnId="status" align="end">Published</TableCell></TableRow></TableBody>
</Table>
```
<!-- /quick-start:generated -->

## API

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| children | `Snippet` | — | 表头行内容，无参数；使用 TableRow 组合 TableHead，保持 thead 语义。 |

未重新声明的继承能力请查所属基础组件文档；本表只列本组件源码具名公开属性。

## 使用边界与详细说明

<a id="keyword"></a>

### Keyword

| Keyword | 说明 |
| :--- | :--- |
| component | 当前组件公开契约 |


- 根节点必须保持 `thead`。



## AI Zone

仅接受 TableRow 等合法表头内容，不管理排序状态。表头首尾单元格默认不设置外缘圆角；表头下边线由 DataTable 变体决定，`striped` 为透明，`divided` 默认显示并在首个数据行 hover 时隐藏。

```svelte
<TableHeader><TableRow><TableHead columnId="name">名称</TableHead></TableRow></TableHeader>
```

## 更新日志

- 2026-09-21：统一使用文档、源码属性表与 Site / LLM 阅读入口；仅文档修订，不改变组件行为。

- 2026-06-30：v1.1.0，移除表头首尾单元格的静态外缘圆角；默认 divided 表头保持直角分割线。
- 2026-06-24：v1.0.1，表头首尾单元格补齐与数据行一致的圆角。
- 2026-06-19：v1.0.0，首次发布。
