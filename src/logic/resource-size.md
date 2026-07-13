# Resource Size 视觉原子尺寸映射

> 职责：为 Avatar / Badge / Checkbox / Icon / Radio / Spinner / Switch 等视觉原子提供统一 `ResourceSize` 梯度映射。

## 尺寸梯度

视觉原子默认使用 `ResourceSize`：

```ts
12 | 16 | 20 | 24 | 28 | 32 | 40 | 48 | 80
```

映射规则：

- 16px 基准映射到 `var(--size-4)`。
- 20 / 24 / 28 / 32 / 40 / 48 / 80 映射到对应 `--size-*` Token。
- 12px 使用 `calc(var(--size-4) * 3 / 4)`，避免依赖不存在的 `--size-3`。
- 任意正数补偿使用 `calc(var(--size-4) * <n> / 16)`。

图表组件不使用此梯度，继续使用 `width` / `height` 表达画布尺寸。

