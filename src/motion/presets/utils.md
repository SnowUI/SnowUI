# utils.ts 文档

> **版本**: v1.0.0
> **职责**: 提供 motion preset 的小型纯函数工具。

## API

| 名称 | 说明 |
| :--- | :--- |
| `getMotionTotalDurationMs` | 返回 `duration + delay`，用于延迟卸载等需要等待完整动效结束的场景。 |
| `motionMsVar` | 将 MotionConfig duration 转为 CSS `ms` 字符串。 |

## 变更记录

- v1.0.0 (2026-06-18): 新增 preset 工具函数。
