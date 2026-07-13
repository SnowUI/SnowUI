# morph.ts 文档

> **版本**: v1.0.0
> **职责**: 提供默认形态变化动效配置（尺寸/形态平滑过渡）。

---

## 导出

| 名称 | 类型 | 描述 |
| :--- | :--- | :--- |
| `MORPH_MOTION` | `MotionConfig` | 轻微缩放并回到正常比例的形态过渡 |

---

## 默认参数

```ts
{
  scale: [0.98, 1],
  duration: MOTION_DURATION_BASE_MS, // 250ms
  easing: "easeOut"
}
```

---

## 典型用途

- `whileHover`
- `whileFocus`
- `whileCollapsed` / `whileExpanded`
- 宽高变化时的默认平滑感

---

## 更新日志 (Changelog)

### v1.0.0 (2026-02-26)

#### 新功能
- 新增默认形态过渡动效常量。
