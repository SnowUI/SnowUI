# fade-out.ts 文档

> **版本**: v1.0.0
> **职责**: 提供默认消失动效（渐隐）配置。

---

## 导出

| 名称 | 类型 | 描述 |
| :--- | :--- | :--- |
| `FADE_OUT_MOTION` | `MotionConfig` | 透明度从 1 过渡到 0 的离场动效 |

---

## 默认参数

```ts
{
  opacity: [1, 0],
  duration: 150,
  easing: "cubic-bezier(0.22, 1, 0.36, 1)"
}
```

---

## 典型用途

- `whileDisappear`
- `whileDisabled`（可叠加透明度降级）
- 通用元素离场

---

## 更新日志 (Changelog)

### v1.0.0 (2026-02-26)

#### 新功能
- 新增默认渐隐离场动效常量。
