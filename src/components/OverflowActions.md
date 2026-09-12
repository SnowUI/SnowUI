# OverflowActions

> **内置图标统一（2026-09-11）**：功能图标的资源比例、尺寸优先级和按钮宿主遵循 [ComponentGuidelines §2.7](../../../specs/ComponentGuidelines.md#27-组件内置-icon-规范)。内置无外壳操作复用 Button bare；有padding的纯图标操作使用 iconOnly。尺寸从所属宿主继承，显式覆盖优先。


> **版本**: v1.0.2
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
| `items` | `OverflowActionsItem[]` | `[]` | 默认内建操作与分隔项数组；action 提供 id、label，可选 icon/disabled/href/onAction，separator 提供 type="separator" 与 id。每个 id 唯一；children 存在时改用显式子项。 |
| `compact` | `"auto" \| "none"` | `"auto"` | auto 在宽度不足且所有 Action 都有 icon 与 label 时先统一隐藏文字；none 跳过此步骤，直接按 overflow 转移操作。 |
| `overflow` | `"all" \| "progressive"` | `"all"` | all 在放不下时将全部操作转入 More；progressive 按 overflowFrom 逐项转入，保留可容纳的操作。菜单展开时冻结布局。 |
| `overflowFrom` | `"start" \| "end"` | `"end"` | progressive 模式从数据/组合顺序的开头或末尾依次转移操作；all 模式不区分方向。 |
| `availableWidth` | `number` | —（实测容器宽度） | 外部给定可用于操作组布局的宽度，单位 px；提供后不再注册自身尺寸观察，适合 DataTable 复用列宽。 |
| `moreLabel` | `string` | `"更多操作"` | More 按钮的无障碍名称 |
| `align` | `"start" \| "end"` | `"end"` | Listbox 水平对齐 |
| `disabled` | `boolean` | `false` | 禁用全部操作 |
| `buttonProps` | `GlobalButtonProps` | — | 所有 Action、More 与隐藏测量副本共享的 Button 默认 Props；支持 variant/size/bare/emphasis/class/style，排除由操作组接管的内容、角色、点击、链接、禁用与名称字段。 |
| `children` | `Snippet` | — | 声明直系 OverflowAction as="item" 与 Separator as="separator"；存在时替换 items 内建操作，结构项不作为独立溢出候选。 |
| `parts` | `Parts` | — | 配置默认生成的 Button、SelectButton、Listbox、MenuItem、Separator；More 的 parts.SelectButton 高于组级 parts.Button。公开 Parts 结构与覆盖优先级见下文。 |
| `onAction` | `(event: OverflowActionsActionEvent) => void` | — | 操作执行后回调：id 为稳定标识，source 为 "button" 或 "menu"；item 为匹配的内建数据（显式模式通常无），originalEvent 为可选鼠标事件。 |

`OverflowAction` 的 `icon` 支持资源图标名称或 Snippet；MenuItem 自动复用相同 icon。内置资源图标使用 MenuItem 的默认 16px，文字使用 MenuItem 的默认 14px / 20px，不继承 More 触发按钮的 Icon-only 尺寸；自定义 Snippet 保留自身视觉。当前不提供菜单项图标或文字尺寸接口。`href` Action 在可见状态使用链接，在菜单中执行时导航到同一地址。每个 Action 的 `id` 在组内必须唯一。

`buttonProps` 是组级 Button 默认值，并同时作用于完整 Action、Icon-only Action、隐藏测量副本与 More 触发按钮。`parts.Button` 继续作为所有 Action 与 More 的组级 Button 覆盖；`parts.SelectButton` 只覆盖 More，并高于前两者。More 的可见实例与隐藏测量副本使用同一套最终 Props，单独改变 variant、size、bare、class 或 style 后不会造成响应式测量漂移。

Action 的优先级为 `buttonProps` → `parts.Button` → 子项 `parts.Button` → `OverflowAction` 直接 Props；More 的优先级为 `buttonProps` → `parts.Button` → `parts.SelectButton` → More 受控行为字段，越靠后优先级越高。未单独指定 More 样式时，它与组级 Action 使用同一 Button 样式；若没有任何组级样式，则使用 Button 默认的 `variant="gray"` 与 `size="sm"`。显式 `OverflowAction as="item"` 的直接 Props 只属于该外置 Action，父组件不会反向读取这些子项来推断 More 样式；因此所有外置 Action 都只在自身直接指定样式、而父级没有组级样式时，More 仍使用 Button 默认样式。

### 数据类型与继承边界

`OverflowActionsItem` 是两种数据的联合：操作为 `{ type?: "action"; id: string; label: string; icon?: string | Snippet; disabled?: boolean; href?: string; onAction?: () => void }`，结构项为 `{ type: "separator"; id: string }`。单项 onAction 在组级 onAction 之前调用。

`GlobalButtonProps` 为 Button Props 排除 `children / as / iconOnly / disabled / href / onclick / aria-label / title`。`Parts` 为 `ComponentPartsOf<{ Button: typeof Button; SelectButton: typeof SelectButton; Listbox: typeof Listbox; MenuItem: typeof MenuItem; Separator: typeof Separator }>`。每个键配置对应默认子组件的公开 Props，完整覆盖顺序见上文。

其余兼容 Frame Props 透传根容器，共享关键字参见 [FramePro](../../../pro/src/components/FramePro.md) 的 OSS 子集；不引入 PRO 专属能力。

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

### v1.0.2 (2026-09-02)

- 根据现有源码补齐逐属性说明、默认回退和使用边界；未改变组件运行时行为。

### v1.0.1 (2026-08-29)

- More 默认跟随组级 Button 样式，支持通过 `parts.SelectButton` 单独覆盖；显式外置 Action 的直接样式不反向影响 More。
- More 的测量副本改为真实 SelectButton，确保单独样式覆盖后的响应式宽度准确。

### v1.0.0 (2026-08-12)

- 初始版本：支持完整、Icon-only、全部溢出、双向逐个溢出、结构 Separator、组级 `buttonProps` 与 DataTable 外部宽度驱动；More 默认使用 Button 默认样式。
