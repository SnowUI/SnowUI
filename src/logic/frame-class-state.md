# frame-class-state.svelte.ts

> **版本**: v1.0.0
> **职责**: 统一解析 Frame 的 `stateVars/stateClass/stateStyle`、`childrenRenderContext` 与 `computedClass`。

`frame-class-state.svelte.ts` 承接 `Frame.svelte` 中与状态变量解析和根节点 class 组装直接相关的逻辑，包括：

- `stateVars` 的按状态取值解析
- `stateClass` / `stateStyle` 的按状态解析
- `childrenRenderContext` 的统一组装
- 根节点 `computedClass` 的拼装

该模块只处理状态与 class/style 运行时组装，不接管 `Frame.svelte` 中的最终模板渲染分支。

---

## 更新日志 (Changelog)

### v1.0.0 (2026-03-09)

- **Init**: 从 `Frame.svelte` 抽离状态变量解析、状态 class/style 解析、`childrenRenderContext` 与 `computedClass` 组装，完成本轮统管式拆分的最后一步。
