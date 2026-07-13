# replace.ts 文档

> **版本**: v1.0.0
> **职责**: 提供同位替换场景的默认进出场动效配置。

---

## 导出

| 名称 | 类型 | 描述 |
| :--- | :--- | :--- |
| `REPLACE_IN_MOTION` | `MotionConfig` | 新元素渐现并放大到正常比例 |
| `REPLACE_OUT_MOTION` | `MotionConfig` | 旧元素渐隐并缩小离场 |

---

## 默认参数

### REPLACE_IN_MOTION

```ts
{
  opacity: [0, 1],
  scale: [0.88, 1],
  duration: MOTION_DURATION_BASE_MS, // 250ms
  easing: "easeOut"
}
```

### REPLACE_OUT_MOTION

```ts
{
  opacity: [1, 0],
  scale: [1, 0.88],
  duration: MOTION_DURATION_BASE_MS, // 250ms
  easing: "easeOut"
}
```

---

## 典型用途

- `itemId/layoutId` 同位元素替换
- 状态图标切换（如 `Spinner -> Check`）
- 同位置内容切换时的统一进出场

---

## 更新日志 (Changelog)

### v1.0.0 (2026-02-26)

#### 新功能
- 新增同位替换默认进出场动效常量。
