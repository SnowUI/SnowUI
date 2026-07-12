# Text Motion 内容标准化

`format.ts` 提供文字动效组件共用的显示内容标准化能力。

## 规则

1. 字符串值直接转为字符串，不修改内容。
2. 数字值统一通过 `Intl.NumberFormat(locales, format)` 格式化。
3. 模块保持纯函数，不持有组件状态，不定义任何动效。

## API

```ts
formatTextMotionValue(value, locales?, format?)
```
