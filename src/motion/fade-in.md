# fade-in.ts 文档

> **版本**: v1.1.0
> **职责**: 提供默认渐显原子动效配置。

---

## 导出

| 名称 | 类型 | 描述 |
| :--- | :--- | :--- |
| `FADE_IN_MOTION` | `MotionConfig` | 透明度从 0 过渡到 1 的进入动效 |

---

## 默认参数

默认参数从 `motion/tokens.ts` 读取。组件族数值应通过 `motion/presets/` 暴露，组件不直接复制 `FADE_IN_MOTION` 的默认值。

---

## 组合规则

- `FADE_IN_MOTION` 是原子动效，只负责 opacity。
- `whileAppear` fallback 由仅渐显的 `GENERIC_APPEAR_MOTION` 提供。
- 组件语义明确时应引用对应组件族 preset。

---

## 更新日志 (Changelog)

### v1.1.0 (2026-06-18)

#### 架构调整
- 默认数值改为从 `motion/tokens.ts` 读取；组件族数值归入 `motion/presets/`。

### v1.0.0 (2026-05-23)

#### 新功能
- 新增默认渐显原子动效常量。
