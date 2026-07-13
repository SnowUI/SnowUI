# frame-actions.svelte.ts 文档

> **版本**: v1.1.0
> **职责**: 统一组装与挂载 Frame action 列表。

## 功能

- `buildFrameActions(options)`：
  - 合并用户 action 与内部 action（scale/responsive）。
- `mountFrameActions(node, actions)`：
  - 统一执行 action 挂载，返回带 `destroy` 的清理对象。

## 设计说明

- 保持 action 执行顺序可控：
  1. 用户 action
  2. scale action
  3. responsive action

## 更新日志

### v1.1.0 (2026-02-23)

- 截断能力迁移到 Text 后，移除 `truncationActions` 内部拼装分支。

### v1.0.0 (2026-02-07)

- 新增 Frame action 组装模块，简化 `Frame.svelte` 中的多能力挂载逻辑。
