# TableToolbar

> 包归属：PRO

DataTable 专用工具栏，内置搜索、排序、筛选、选择计数与批量操作。它读取 DataTable Context，不支持独立搭配普通 Table。公开入口为 `@snowui/components-pro`。

## 组合模式

- 默认内置模式：由 Props 生成 SearchInput、Select、Listbox、MenuItem、Button、Separator 与 Spinner。
- 显式组合模式：通过 `children` 和 `as="search|bulk|sort|filter|action"` 替换直接子项。
- `parts` 只配置直接内置子组件，不递归配置子组件内部。
- 内置 copy、delete、sort、filter 的 icon-only 触发器由工具栏内部嵌入 Tooltip，提示文案分别复用对应 label Props。
- 内置清除、复制、删除、排序与筛选均显式使用 `Button bare emphasis="muted"`，保留次级工具操作的 40% → hover 100% 视觉；调用方可通过 `parts.Button.emphasis` 统一覆盖。

## Changelog

- 2026-08-09：适配 Button bare 默认 100%，内置工具操作显式改用 `emphasis="muted"`。

- 2026-07-13：内置 copy、delete、sort、filter 图标按钮增加内部 Tooltip。

- 2026-07-08：默认内置项与批量操作组间距改为 8px，遵循多个 Icon 按钮排列默认 gap。

- 2026-07-07：默认内置项与批量操作组间距统一为 12px。

- 2026-07-07：默认内置模式中的清除、复制、删除、排序与筛选按钮统一使用 bare Button 外观。

- 2026-07-05：v3.0.0，改为 PRO 组件，只服务 DataTable；移出 OSS 包公开入口。
