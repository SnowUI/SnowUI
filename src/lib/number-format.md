# SnowUI 数字格式化工具

> **版本**: v1.0.1
> **职责**: 为数据展示组件提供统一的数字 label 格式化、英文紧凑缩写和空值兜底。

组件与页面共同遵守[缺失数据规则](../../../docs/reference/NumberFormats.md#missing-data)；本工具处理数值空值，字符串展示边界由消费组件按同一规则处理，保留真实0与0%。

## 规则

- 默认数据 label 小数位数为 2 位。
- 默认百分比小数位数为 1 位。
- 百分比整数在未显式配置位数时不补 `.0`；显式配置 `fractionDigits` / `percentFractionDigits` 时保留指定精度。
- 整数默认不补 `.00`。
- 非整数默认补齐到 2 位。
- 显式传入 `fractionDigits` / `valueLabelFractionDigits` 时，按指定小数位固定补齐尾随 0。
- 默认启用千分位。
- `null` / `undefined` / `NaN` / `Infinity` 默认显示为 `-`；百分比空值不追加 `%`。
- 长数字缩写使用英文 compact notation：`k` / `m` / `b` / `t`。
- 默认 `notation: "standard"` 不缩写；`notation: "auto"` 达到 `1,000,000` 后缩写；`notation: "compact"` 达到 `1,000` 后缩写。

## API

```ts
formatNumberLabel(value, options)
formatPercentLabel(value, options)
mergeNumberFormatOptions(...options)
```

---

> **以下内容供 AI 阅读，用于维护代码与文档的关联**

## 开发者指南 (AI)

- **实现**: [./number-format.ts](number-format.ts)
- **规范**: [../../../docs/reference/NumberFormats.md](../../../docs/reference/NumberFormats.md)
- Chart、Table、Metric 等数据展示组件不得平行维护默认小数位、空值兜底和 compact notation。

## 更新日志 (Changelog)

### v1.0.1 (2026-10-14)

- 修复默认整数百分比被补为一位小数，以及空值错误追加 `%` 的实现漂移。
- 增加默认、显式精度、非法值与既有数字格式行为的直接回归测试。

### v1.0.0 (2026-06-07)

- 新增 `formatNumberLabel()`、`formatPercentLabel()` 与英文 compact notation。
