# frame-dom-runtime.svelte.ts

> **版本**: v1.0.0
> **职责**: 统一拼装 Frame 根节点的 DOM props、事件包装器与运行时 `data-*` 属性。

`frame-dom-runtime.svelte.ts` 承接 `Frame.svelte` 中与根节点 DOM 运行时直接相关的组装逻辑，包括：

- DOM 透传属性过滤后的可访问性补齐
- `readonly` capture 事件阻断
- 原生事件包装器与 disabled/loading 交互阻断
- `data-orchestrate-*`、`data-scale-*`、`data-render-hint-*` 的运行时输出

---

## 更新日志 (Changelog)

### v1.0.0 (2026-03-09)

- **Init**: 从 `Frame.svelte` 抽离 DOM props、事件包装器与运行时 `data-*` 属性组装，保持 `Frame` 主模板与公开 API 不变。
