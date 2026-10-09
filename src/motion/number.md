# number.ts 文档

> **版本**: v1.1.0
> **职责**: 提供默认数字变化动效配置、默认数字动效组件引用与数字补间工具。

---

## 导出

| 名称 | 类型 | 描述 |
| :--- | :--- | :--- |
| `NUMBER_MOTION_PROGRESS_POWER` | `number` | 默认数字补间进度幂值，数值越大前段越慢 |
| `NUMBER_MOTION` | `MotionConfig` | 默认数字变化动效配置 |
| `NUMBER_MOTION_COMPONENT` | `Component` | 默认数字动效组件（`FlowText`） |
| `interpolateNumberMotionValue(from, to, progress)` | `(number, number, number) => number` | 按 `0..1` 进度计算当前数字，适合 SVG / canvas / 非 DOM 滚轮场景 |

---

## 默认参数

```ts
{
  duration: MOTION_DURATION_BASE_MS, // 250ms
  easing: "easeOut",
  component: undefined
}
```

---

## 使用说明

- 该模块用于 Frame 默认动效系统中的数字场景默认值。
- 默认不捆绑 FlowText 组件；调用方可在运行时注入 `component` 字段。
- 若业务需要自定义数字动效，可在 `while*` 中覆写 `component`/`duration`。
- `interpolateNumberMotionValue` 只负责数值补间，不创建 DOM，不绑定特定组件；调用方可以自行决定格式化与渲染方式。补间进度默认经过 `NUMBER_MOTION_PROGRESS_POWER` 幂值处理。

---

## 更新日志 (Changelog)

### v1.1.0 (2026-06-07)

#### 新功能
- 新增 `interpolateNumberMotionValue`，用于 BarChart label 等非 FlowText 场景复用数字补间。

### v1.0.0 (2026-02-26)

#### 新功能
- 新增默认数字动效配置与组件导出（基于 `FlowText`）。
