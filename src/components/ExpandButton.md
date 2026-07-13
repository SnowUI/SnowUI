# ExpandButton

> **版本**: v1.0.0  
> **职责**: 以真实 Button 为宿主的展开 / 收起二态按钮。

## 使用

```svelte
<ExpandButton bind:expanded bare />
```

- `expanded` / `defaultExpanded`：受控值与默认值。
- `onExpandedChange`：值切换回调。
- `icon` / `collapseIcon`：替换默认的放大、收起图标。
- `ariaLabel` / `collapseAriaLabel`：两种状态的辅助文本。
- 默认图标为 `arrows-out-simple` / `arrows-in-simple`，内容替换使用统一 replacement appear 动效。

> 此区域的内容受保护。AI 在修改此区域前必须请求用户审查。

---

> **以下内容供 AI 阅读，用于维护代码与文档的关联**

## 开发者指南 (AI)

| 关键字 | 说明 |
| --- | --- |
| expanded / defaultExpanded | 展开状态与默认值 |
| icon / collapseIcon | 两种状态的图标槽 |
| onExpandedChange | 展开状态变更回调 |

- 主布局模型：宿主组件特化。
- 宿主：Button，宿主 Props 平铺。
- 图标属于内部基础设施，不提供 parts。
- 作为父组件的默认内置依赖时，可消费 `parts.ExpandButton`。

## 更新日志 (Changelog)

### v1.0.0 (2026-07-03)

- 首次实现 Button 宿主特化、展开语义与图标替换动效。
