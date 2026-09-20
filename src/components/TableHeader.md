# TableHeader

> **版本**: v1.1.0  
> **职责**: Table 的 `<thead>` 语义容器。

仅接受 TableRow 等合法表头内容，不管理排序状态。表头首尾单元格默认不设置外缘圆角；表头下边线由 DataTable 变体决定，`striped` 为透明，`divided` 默认显示并在首个数据行 hover 时隐藏。

```svelte
<TableHeader><TableRow><TableHead columnId="name">名称</TableHead></TableRow></TableHeader>
```

## 组件介绍

组织 Table 的表头行，明确各列含义，并保留原生表格的表头语义。

## Keyword

| Keyword | 说明 |
| :--- | :--- |
| component | 当前组件公开契约 |

> **以下内容供 AI 阅读，不展示在文档站点**

- 根节点必须保持 `thead`。

## Changelog

- 2026-06-30：v1.1.0，移除表头首尾单元格的静态外缘圆角；默认 divided 表头保持直角分割线。
- 2026-06-24：v1.0.1，表头首尾单元格补齐与数据行一致的圆角。
- 2026-06-19：v1.0.0，首次发布。
