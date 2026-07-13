# SnowUI 语意色解析器

> **版本**: v1.0.0
> **职责**: 将组件公开颜色 Props 中的 PascalCase SnowUI 语意色解析为主题 Token。

## 规则

- 语意色只用于组件公开颜色 Props，不用于组件内部 CSS 定义。
- 映射唯一来源为包内 `../styles/themes.css`。
- 命中语意色时只返回 `var(--token)`，不附带 fallback。
- 未命中时原样返回，保留浏览器原生 CSS 颜色能力。
- 严格区分大小写：`"Red"` 解析为 `var(--secondary-red)`，`"red"` 保持原生 CSS 关键字。
- 顶层 Prop 与公开嵌套对象中的颜色字段使用同一协议，例如 Frame 动效配置和图表渐变 stop。

## API

```ts
resolveSnowUIColor(color: SnowUIColor | string): string
```

---

> **以下内容供 AI 阅读，用于维护代码与文档的关联**

## 开发者指南 (AI)

- **实现**: [./color.ts](./color.ts)
- **规范**: [../../../specs/StyleSpec.md §2.1.2](../../../specs/StyleSpec.md)
- 项目所有者手工同步修改 `../styles/themes.css` 与仓库外 `styles/snowui-themes.css` 后，如新增颜色 Token，必须同步增加映射。AI 和自动脚本不得修改或互相覆盖两份主题文件。

## 更新日志 (Changelog)

### v1.0.0 (2026-06-01)

- 新增全量 SnowUI PascalCase 语意色映射与 `resolveSnowUIColor()`。
- 接入 Progress、Link、Frame 动效配置和图表渐变颜色入口。
