# TableToolbar

> 包归属：PRO

DataTable 专用工具栏，内置搜索、排序、筛选、选择计数与批量操作。它读取 DataTable Context，不支持独立搭配普通 Table。公开入口为 `@snowui/components-pro`。

## 组合模式

- 默认内置模式：由 Props 生成 SearchInput、Select、Listbox、MenuItem、Button、CopyButton、Separator 与 Spinner。
- 显式组合模式：通过 `children` 和 `as="search|bulk|sort|filter|action"` 替换直接子项。
- `parts` 只配置直接内置子组件，不递归配置子组件内部。
- 内置 copy、delete、sort、filter 的 icon-only 触发器由工具栏内部嵌入 Tooltip，提示文案分别复用对应 label Props。
- 内置清除、复制、删除、排序与筛选均显式使用 `Button bare emphasis="muted"`，保留次级工具操作的 40% → hover 100% 视觉；调用方可通过 `parts.Button.emphasis` 统一覆盖。

内置复制复用 `CopyButton bare`，通过 `writeText` 执行已有 `onCopy` 回调；成功反馈默认保留 1600ms，期间忽略重复复制。回调应在复制完成后 resolve，失败时 reject，避免错误显示为成功。

排序选择器读取 DataTable 的当前排序，仅在用户选择新选项时写回；表头排序不被工具栏旧值覆盖。

## 排序选项

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| sortOptions | `{ columnId: string; label?: string }[]` | 未指定 | 自定义内置排序菜单字段和顺序，可包含未展示为表格列的数据字段；显式列表替换自动表头列表，空数组仅保留默认排序。 |

未配置 `sortOptions` 时自动读取可排序表头。配置后，每项生成升序、降序两个选项，名称缺省使用 `columnId`；字段标识应唯一。普通字段由 DataTable 读取 `row[columnId]`，派生值由 DataTable 的 `sorters[columnId]` 提供。配置菜单不会创建表格列，也不会改变当前排序；菜单始终保留“默认排序”用于恢复 DataTable 默认顺序。server 模式仍由调用方处理排序请求。

```svelte
<TableToolbar sortOptions={[
  { columnId: 'component', label: 'Component' },
  { columnId: 'priority', label: 'Priority' }
]} />
```

## Changelog

- 2026-09-20：增加 `sortOptions`，内置菜单可按未显示的原始字段或派生值排序。


- 2026-08-09：适配 Button bare 默认 100%，内置工具操作显式改用 `emphasis="muted"`。

- 2026-07-13：内置 copy、delete、sort、filter 图标按钮增加内部 Tooltip。

- 2026-07-08：默认内置项与批量操作组间距改为 8px，遵循多个 Icon 按钮排列默认 gap。

- 2026-07-07：默认内置项与批量操作组间距统一为 12px。

- 2026-07-07：默认内置模式中的清除、复制、删除、排序与筛选按钮统一使用 bare Button 外观。

- 2026-07-05：v3.0.0，改为 PRO 组件，只服务 DataTable；移出 OSS 包公开入口。
