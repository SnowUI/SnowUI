# OverflowActions

> **版本**: v1.0.1
> **职责**: 在有限宽度内保留一组操作，并把容纳不下的操作转移到 More 菜单。

## 使用

默认内置模式通过稳定数据生成 Button、Separator、SelectButton、Listbox 与 MenuItem：

```svelte
<OverflowActions
  items={[
    { type: "action", id: "edit", label: "编辑", icon: "pencil-simple" },
    { type: "separator", id: "main-separator" },
    { type: "action", id: "delete", label: "删除", icon: "trash" },
  ]}
  onAction={({ id }) => runAction(id)}
/>
```

显式组合模式使用专用 `OverflowAction as="item"` 声明可响应操作，使用 `Separator as="separator" column` 声明结构项：

```svelte
<OverflowActions overflow="progressive" overflowFrom="end">
  <OverflowAction as="item" id="edit" label="编辑" icon="pencil-simple" onclick={edit} />
  <Separator as="separator" column />
  <OverflowAction as="item" id="delete" label="删除" icon="trash" onclick={remove} />
</OverflowActions>
```

## 响应式规则

组件按以下顺序适应可用宽度：

1. 完整显示 Icon + Text。
2. `compact="auto"` 且每个 Action 都同时声明 icon 与 label 时，统一收起文字，只显示 Icon。
3. 仍然放不下时显示 More 按钮，并根据 `overflow` 转移操作：
   - `all`：全部操作转入菜单。
   - `progressive`：按 `overflowFrom="start" | "end"` 从一侧逐个转入菜单。

结构项不作为独立的溢出候选。Separator 仅在主操作区域两侧都仍有可见操作时保留；首尾 Separator、连续重复 Separator 自动隐藏。操作转入 More/Listbox 后只生成连续 MenuItem，即使来源结构中存在 Separator，菜单内也一律不显示分割线。Separator 的宽度仍计入主操作区域布局计算。

More 按钮使用 `SelectButton selectionMode="action"`，内部直接组合 `Listbox + MenuItem`，不引入 Popover。菜单展开期间冻结当前布局，避免触发器因列宽或容器宽度变化而消失。

## API

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `items` | `OverflowActionsItem[]` | `[]` | 默认内置模式的数据；包含 action 与 separator |
| `compact` | `"auto" \| "none"` | `"auto"` | 是否在溢出前统一尝试 Icon-only |
| `overflow` | `"all" \| "progressive"` | `"all"` | 操作进入 More 菜单的方式 |
| `overflowFrom` | `"start" \| "end"` | `"end"` | progressive 模式的收起方向 |
| `availableWidth` | `number` | 容器实测宽度 | 外部提供的可用宽度；DataTable 用它避免每个单元格单独观察尺寸 |
| `moreLabel` | `string` | `"更多操作"` | More 按钮的无障碍名称 |
| `align` | `"start" \| "end"` | `"end"` | Listbox 水平对齐 |
| `disabled` | `boolean` | `false` | 禁用全部操作 |
| `buttonProps` | `Omit<ButtonProps, 受控行为字段>` | 无 | 所有 Action Button 与 More Button 的组级默认 Props；可配置 variant / size / bare / emphasis / class / style 等视觉能力 |
| `children` | `Snippet` | 无 | 显式组合模式内容 |
| `parts` | `ComponentPartsOf` | 无 | 配置内建 Button / SelectButton / Listbox / MenuItem / Separator |
| `onAction` | `(event: OverflowActionsActionEvent) => void` | 无 | 任一可见按钮或菜单项执行后的统一回调 |

`OverflowAction` 的 `icon` 支持资源图标名称或 Snippet；MenuItem 自动复用相同 icon。内置资源图标使用 MenuItem 的默认 16px，文字使用 MenuItem 的默认 14px / 20px，不继承 More 触发按钮的 Icon-only 尺寸；自定义 Snippet 保留自身视觉。当前不提供菜单项图标或文字尺寸接口。`href` Action 在可见状态使用链接，在菜单中执行时导航到同一地址。每个 Action 的 `id` 在组内必须唯一。

`buttonProps` 是组级 Button 默认值，并同时作用于完整 Action、Icon-only Action、隐藏测量副本与 More 触发按钮。`parts.Button` 继续作为所有 Action 与 More 的组级 Button 覆盖；`parts.SelectButton` 只覆盖 More，并高于前两者。More 的可见实例与隐藏测量副本使用同一套最终 Props，单独改变 variant、size、bare、class 或 style 后不会造成响应式测量漂移。

Action 的优先级为 `buttonProps` → `parts.Button` → 子项 `parts.Button` → `OverflowAction` 直接 Props；More 的优先级为 `buttonProps` → `parts.Button` → `parts.SelectButton` → More 受控行为字段，越靠后优先级越高。未单独指定 More 样式时，它与组级 Action 使用同一 Button 样式；若没有任何组级样式，则使用 Button 默认的 `variant="gray"` 与 `size="sm"`。显式 `OverflowAction as="item"` 的直接 Props 只属于该外置 Action，父组件不会反向读取这些子项来推断 More 样式；因此所有外置 Action 都只在自身直接指定样式、而父级没有组级样式时，More 仍使用 Button 默认样式。

> 此区域的内容受保护。AI 在修改此区域前必须请求用户审查。

---
---

> **以下内容供 AI 阅读，用于维护代码与文档的关联**

## 开发者指南 (AI)

- 包归属：OSS；主布局模型为复合管理布局。
- 组合模式：默认内置模式与显式组合模式并存；显式模式只识别直系 `OverflowAction as="item"` 与 `Separator as="separator"`。
- `OverflowAction` 通过专用 Context 注册 id / label / icon / disabled / href / 执行函数与测量节点；父组件不得读取任意 Button 内部结构推断语义。
- 自测量模式复用全局 `resizeManager`；传入 `availableWidth` 时不注册 ResizeObserver。
- 布局计算统一读取完整、Icon-only、Separator 与 More 的测量宽度；读写按单次调度分批完成。
- DataTable 应从列宽上下文传入 `availableWidth`，禁止为每个 actions 单元格新增 Observer。
- More 菜单由 SelectButton / Listbox / MenuItem 承担打开、Portal、焦点、键盘与关闭行为。

## 模块索引

- [OverflowActions.svelte](./OverflowActions.svelte)
- [OverflowAction.svelte](./OverflowAction.svelte)
- [SelectButton.svelte](./SelectButton.svelte)
- [Listbox.svelte](./Listbox.svelte)
- [MenuItem.svelte](./MenuItem.svelte)

## 更新日志 (Changelog)

### v1.0.1 (2026-08-29)

- More 默认跟随组级 Button 样式，支持通过 `parts.SelectButton` 单独覆盖；显式外置 Action 的直接样式不反向影响 More。
- More 的测量副本改为真实 SelectButton，确保单独样式覆盖后的响应式宽度准确。

### v1.0.0 (2026-08-12)

- 初始版本：支持完整、Icon-only、全部溢出、双向逐个溢出、结构 Separator、组级 `buttonProps` 与 DataTable 外部宽度驱动；More 默认使用 Button 默认样式。
