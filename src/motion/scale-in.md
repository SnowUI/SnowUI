# scale-in.ts 文档

> **版本**: v1.1.0
> **职责**: 提供默认缩放进入原子动效配置。

---

## 导出

| 名称 | 类型 | 描述 |
| :--- | :--- | :--- |
| `SCALE_IN_MOTION` | `MotionConfig` | 通用缩放进入原子动效；默认数值来自 `motion/tokens.ts` |

---

## 默认参数

默认参数从 `motion/tokens.ts` 读取。组件族数值应通过 `motion/presets/` 暴露，组件不直接复制 `SCALE_IN_MOTION` 的默认值。

---

## 组合规则

- `SCALE_IN_MOTION` 是原子动效，只负责 scale。
- `whileAppear` generic fallback 默认不再包含本 scale 原语；需要缩放进入时显式组合或使用含 scale 的组件族 preset。
- 组件语义明确时应引用对应组件族 preset。

---

## 更新日志 (Changelog)

### v1.1.0 (2026-06-18)

#### 架构调整
- 默认数值改为从 `motion/tokens.ts` 读取；组件族数值归入 `motion/presets/`。

### v1.0.0 (2026-05-23)

#### 新功能
- 新增默认缩放进入原子动效常量。
