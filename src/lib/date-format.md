# SnowUI 日期格式化工具

> **版本**: v1.0.0  
> **职责**: 将准确的日期数据统一格式化为绝对日期、时间、相对时间或日期范围。

## 核心规则

- 数据层保存 `Date`、ISO 8601 或时间戳，不保存 `Just now` 等显示文案。
- `formatDate(value, { relative: true })` 实现 `DateFormats.md` 的智能相对时间规则。
- 排序和筛选始终使用原始值；格式化结果仅用于显示。
- 批量渲染或 SSR 应传入同一个 `now`，格式化函数本身不创建计时器。
- 无效日期默认显示 `—`。

## API

```ts
formatDate(value, options)
formatDateRange(start, end, options)
formatRange(start, end, options)
mergeDateFormatOptions(...options)
```

---

> **以下内容供 AI 阅读，用于维护代码与文档的关联**

## 开发者指南 (AI)

- **实现**: [./date-format.ts](date-format.ts)
- **规范**: [../../../specs/DateFormats.md](../../../specs/DateFormats.md)
- Table、Calendar、Timeline 等组件不得平行维护日期格式规则。

## 更新日志 (Changelog)

### v1.0.0 (2026-06-19)

- 新增绝对日期、智能相对时间与日期范围格式化能力。
