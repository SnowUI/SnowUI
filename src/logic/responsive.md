# responsive.svelte.ts 文档

> **版本**: v1.4.0
> **职责**: 管理组件的响应式能力和断点检测，支持断点触发布局和联动控制。

**需求**: 基于容器宽度实现响应式设计，允许在不同断点下覆写组件属性、样式、形态或布局。

## 关键字

| 关键字 | 类型 | 描述 |
| :--- | :--- | :--- |
| responsive | `object` | 针对不同断点覆写组件的 Props、样式或形态 |

## 断点 (Breakpoints)

断点可**触发布局变化**或**联动控制其他组件**。

| 关键字 | 阈值 | 类型 |
| :--- | :--- | :--- |
| xs | < 640px | `Layout \| LinkageControl` |
| sm | ≥ 640px | `Layout \| LinkageControl` |
| md | ≥ 768px | `Layout \| LinkageControl` |
| lg | ≥ 1024px | `Layout \| LinkageControl` |
| xl | ≥ 1280px | `Layout \| LinkageControl` |
| 2xl | ≥ 1536px | `Layout \| LinkageControl` |

**Layout 值**: `row` | `column` | `grid` | `row-reverse` | `column-reverse`

```svelte
<!-- 布局变化 -->
<Button xs={column} sm={row} />

<!-- 联动控制：进入 md 断点时触发其他组件 -->
<Container md={{ target: 'sidebar', action: 'play' }} />
```

## 联动控制

所有断点关键字都支持 `{ target, action }` 语法控制其他组件。详见 [frame-perception.md](./frame-perception.md)。

## 规则配置

`responsive` 属性接收对象，键名为断点名称，值为该断点下的覆写配置：

```typescript
responsive={{
    xs: { collapsed: true, style: "font-size: 12px" },
    md: { expanded: true },
    lg: { class: "large-view" }
}}
```

## 上报数据

| 属性 | 描述 |
| :--- | :--- |
| breakpoint | 当前激活的断点 (xs, sm, md, lg, xl, 2xl) |
| xs | 是否在 xs 断点 |
| sm | 是否在 sm 断点 |
| md | 是否在 md 断点 |
| lg | 是否在 lg 断点 |
| xl | 是否在 xl 断点 |
| 2xl | 是否在 2xl 断点 |

