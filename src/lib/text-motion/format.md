# Text Motion 内容标准化

`format.ts` 提供文字动效组件共用的显示内容标准化能力。

## 规则

1. 字符串值直接转为字符串，不修改内容。
2. 数字值统一通过 `Intl.NumberFormat(locales, format)` 格式化。
3. 模块不持有全局可变缓存，不定义任何动效。消费者以 `createTextMotionFormatter` 创建独立格式化闭包，仅在 locale 或 format 变化时重建；纯文字不创建 `Intl.NumberFormat`。

## API

```ts
formatTextMotionValue(value, locales?, format?)
createTextMotionFormatter(locales?, format?): (value: string | number) => string
```
