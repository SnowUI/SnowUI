# spring.ts 文档

> **版本**: v1.0.0
> **职责**: 将 `MotionConfig` 的物理弹簧参数采样为浏览器可执行的 CSS `linear()` timing function。

## 行为

- `type: "spring"` 时读取 `stiffness`、`damping`、`mass` 与 `duration`。
- 使用阻尼谐振公式采样 40 段轨迹，保留欠阻尼弹簧的轻微越界与回落。
- 输出的 `linear(...)` 同时供 Frame CSS lifecycle 动效与 `motion-engine` 命令式执行路径使用。
- 非 spring 配置继续解析为普通 CSS easing，不改变既有 tween 行为。

## 默认值

未显式提供参数时使用 `stiffness: 170`、`damping: 26`、`mass: 1`、`duration: 500ms`。

## Changelog

- v1.0.0 (2026-07-12): 新增 spring-to-CSS 共享采样能力。
