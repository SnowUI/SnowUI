# expand.ts 文档

> **版本**: v1.0.0
> **职责**: 提供展开/收起场景的默认进出场动效配置。

---

## 导出

| 名称 | 类型 | 描述 |
| :--- | :--- | :--- |
| `EXPAND_IN_MOTION` | `MotionConfig` | 元素从 95% 放大到正常比例并渐现（展开进场） |
| `EXPAND_OUT_MOTION` | `MotionConfig` | 元素从正常比例缩小到 95% 并渐隐（收起离场） |

---

## 默认参数

### EXPAND_IN_MOTION

```ts
{
  opacity: [0, 1],
  scale: [0.95, 1],
  duration: MOTION_DURATION_BASE_MS, // 250ms
  easing: "easeOut"
}
```

### EXPAND_OUT_MOTION

```ts
{
  opacity: [1, 0],
  scale: [1, 0.95],
  duration: MOTION_DURATION_BASE_MS, // 250ms
  easing: "easeOut"
}
```

---

## 典型用途

- `whileExpanded` 默认动效（元素切换到展开态时的进场）
- `whileCollapsed` 默认动效（元素切换到收起态时的离场）
- 全屏放大（CodeBlock 全屏覆盖层进入 / 退出）
- 抽屉、面板、弹出层的中心缩放动效

---

## 与 replace.ts 的区别

| 动效 | scale 起点 | 适用场景 |
| :--- | :--- | :--- |
| `REPLACE_IN_MOTION` | 0.88 | 元素替换、图标切换（较明显的缩放感） |
| `EXPAND_IN_MOTION` | 0.95 | 面板展开、全屏放大（轻微的放大感） |

---

## 更新日志 (Changelog)

### v1.0.0 (2026-05-02)

#### 新功能
- 新增展开/收起场景默认进出场动效常量。
