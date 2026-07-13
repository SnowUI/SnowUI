# dialog.svelte.ts

> **版本**: v1.0.0
> **职责**: 提供 Dialog 的模版注册、命令式显示关闭与声明式触发委托。

## API

| 名称 | 说明 |
| :--- | :--- |
| `registerDialogTemplate(id, config)` | 注册 `template + id` 模版 |
| `unregisterDialogTemplate(id)` | 注销模版并关闭同 id 实例 |
| `showDialog(id, triggerEl?)` | 打开指定 Dialog,`triggerEl` 用于关闭后焦点回归 |
| `hideDialog(id)` | 关闭指定 Dialog |
| `isDialogOpen(id)` | 查询指定 id 是否打开 |
| `dialogStore` | 当前活跃 Dialog 队列 |
| `initDialogDelegate()` | 初始化 `[data-dialog-target]` 点击委托 |

<!-- @UserDefined -->
<!-- /@UserDefined -->

---

## AI Zone

- 落地文件: `./dialog.svelte.ts`
- 组件消费: `../components/Dialog.svelte`

## Changelog

- v1.0.0: 新增 Dialog store、注册 API、命令式 API 与声明式触发委托。
