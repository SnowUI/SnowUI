# OverflowActions

> **许可阅读**：首次阅读组件文档、源码或 npm 使用流程，先读完整 [LICENSE](../../LICENSE)；同任务同版本去重。公开 API 配置与内部实现修改分别按许可处理；全部组件使用统一运行包，源码权益以许可为准。

> **版本**: v1.1.1
> **职责**: 在有限宽度内优先展示操作按钮，并将放不下的操作收进更多菜单，保持工具栏紧凑可用。
> **包归属**: `@snowui-design-system/components`
> **文档修订**: 2026-10-23

## 组件介绍

在有限宽度内优先展示操作按钮，并将放不下的操作收进更多菜单，保持工具栏紧凑可用。

## 使用选择

<!-- usage-guide:start -->
用于一组操作随可用宽度逐步收进更多菜单。使用 OverflowAction 和 Separator 组合，不在页面重做宽度检测和菜单分配。

- items 使用唯一 id 的 action / separator；显式 children 替换 items。
- 显式组合使用 OverflowAction as="item" 与 Separator as="separator"；compact / overflow / overflowFrom 控制收纳方式。
<!-- usage-guide:end -->

## 快速开始

以下示例展示推荐的基本组合。更多场景与组合限制见后文。

<!-- quick-start:generated -->
```svelte
<script lang="ts">
	import { OverflowActions, Text } from '@snowui-design-system/components';
	const websiteActions = [
		{ id: 'preview', label: 'Preview site', icon: 'code', href: '/components/showcase' },
		{ id: 'copy-install', label: 'Copy install', icon: 'copy' },
		{ id: 'edit-page', label: 'Edit page', icon: 'pencil-simple' },
		{ type: 'separator' as const, id: 'content-tools' },
		{ id: 'translate', label: 'Translate', icon: 'translate' },
		{ id: 'theme', label: 'Switch theme', icon: 'sun' },
		{ id: 'github', label: 'SnowUI on GitHub', icon: 'github-logo', href: 'https://github.com/SnowUI' },
		{ type: 'separator' as const, id: 'publishing-tools' },
		{ id: 'publish', label: 'Publish update', icon: 'upload' },
		{ id: 'delete-draft', label: 'Delete draft', icon: 'trash' }
	];
</script>

<div style="display: flex; flex-direction: column; align-items: center; width: 100%; gap: var(--gap-4) var(--gap-3);">
	<OverflowActions items={websiteActions} moreLabel="More website actions" style="justify-content: center;" />
</div>
```
<!-- /quick-start:generated -->

## API

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| items | `OverflowActionsItem[]` | `[]` | 默认内建操作与分隔项数组；action 提供 id、label，可选 icon/disabled/href/target/rel/onAction/buttonProps/parts，separator 提供 type="separator" 与 id。每个 id 唯一；children 存在时改用显式子项。 |
| compact | `"auto" \| "none"` | `"auto"` | auto 在宽度不足且所有 Action 都有 icon 与 label 时先统一隐藏文字；none 跳过此步骤，直接按 overflow 转移操作。 |
| overflow | `"all" \| "progressive"` | `"all"` | all 在放不下时将全部操作转入 More；progressive 按 overflowFrom 逐项转入，保留可容纳的操作。菜单展开时冻结布局。 |
| overflowFrom | `"start" \| "end"` | `"end"` | progressive 模式从数据/组合顺序的开头或末尾依次转移操作；all 模式不区分方向。 |
| availableWidth | `number` | — | 外部给定可用于操作组布局的宽度，单位 px；提供后不再注册自身尺寸观察，适合 DataTable 复用列宽。 |
| maxVisible | `number` | — | 最多直出操作数，不含More／Separator；缺省不限制，有限值向下取整并至少0，非有限值不限制。宽度可进一步收纳；菜单展开冻结。 |
| moreLabel | `string` | `LocaleProvider` | More 按钮的无障碍名称，未传时按当前语言显示。 |
| align | `"start" \| "end"` | `"end"` | Listbox 水平对齐 |
| disabled | `boolean` | `false` | 禁用全部操作 |
| buttonProps | `GlobalButtonProps` | — | 所有 Action、More 与隐藏测量副本共享的 Button 默认 Props；支持 variant/size/bare/emphasis/class/style，排除由操作组接管的内容、角色、点击、链接、禁用与名称字段。 |
| children | `Snippet` | — | 声明直系 OverflowAction as="item" 与 Separator as="separator"；存在时替换 items 内建操作，结构项不作为独立溢出候选。 |
| parts | `Parts` | — | 配置默认生成的 Button、SelectButton、Listbox、MenuItem、Separator；More 的 parts.SelectButton 高于组级 parts.Button。公开 Parts 结构与覆盖优先级见下文。 |
| onAction | `(event: OverflowActionsActionEvent) => void` | — | 操作执行后回调：id 为稳定标识，source 为 "button" 或 "menu"；item 为匹配的内建数据（显式模式通常无），originalEvent 为可选鼠标事件。 |

未重新声明的继承能力请查所属基础组件文档；本表只列本组件源码具名公开属性。

## 使用边界与详细说明

<a id="使用"></a>

### 使用

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

<a id="响应式规则"></a>

### 响应式规则

操作组首选间距为 `--gap-2`（默认8px），独立动作之间至少保留4 CSS px；`--snowui-overflow-actions-gap-override` 的较大值继续生效。原宽度求解直接读取实际间距，较小字体／gap-scale下可能稍早收纳，按钮／菜单操作顺序不变。

组件按以下顺序适应可用宽度：

1. 完整显示 Icon + Text。
2. `compact="auto"` 且每个 Action 都同时声明 icon 与 label 时，统一收起文字，只显示 Icon。
3. 仍然放不下时显示 More 按钮，并根据 `overflow` 转移操作：
   - `all`：全部操作转入菜单。
   - `progressive`：按 `overflowFrom="start" | "end"` 从一侧逐个转入菜单。

宽度接近按钮收纳阈值时，即将进入 More 的按钮在 `--size-5` 的固定宽度区间内渐隐；连续拖动时反向拖宽按当前宽度恢复，更多按钮和整组背景不参与渐隐。首次出现 More 可能同时收起多个按钮，它们同步渐隐。 有效宽度（优先 availableWidth）停止变化 1s 后，保留按钮使用共享恢复控制器恢复原透明度；恢复中或恢复后再次缩窄从当前透明度接续。已收纳按钮保持隐藏，More 与保留按钮的位移自然完成。菜单展开只冻结收纳布局，不阻止透明度恢复。仅 full → compact 时不淡出整颗按钮。减少动效设置下直接切换。规则与 Table 共用 [响应式项目收起](../../../specs/maintainers/MotionPresetSpec.md#23-响应式项目收起)。

响应式收纳改变可见按钮集合时，保留按钮与 More 以原生 Flex 对齐位置为终点，使用 `RESIZE_MOTION` 做水平平移；连续宽度变化不重复启动，反向收纳从当前视觉位置接续。私有适配器位于 `src/lib/overflow-actions-motion.ts`，不缩放按钮内容；减少动效时直接完成布局。

结构项不作为独立的溢出候选。Separator 仅在主操作区域两侧都仍有可见操作时保留；首尾 Separator、连续重复 Separator 自动隐藏。操作转入 More/Listbox 后只生成连续 MenuItem，即使来源结构中存在 Separator，菜单内也一律不显示分割线。Separator 的宽度仍计入主操作区域布局计算。

More 按钮使用 `SelectButton selectionMode="action"`，内部直接组合 `Listbox + MenuItem`，不引入 Popover。菜单展开期间冻结当前布局，避免触发器因列宽或容器宽度变化而消失。

<a id="api"></a>

### API

`OverflowAction` 的 `icon` 支持资源图标名称或 Snippet；MenuItem 自动复用相同 icon。内置资源图标使用 MenuItem 的默认 16px，文字使用 MenuItem 的默认 14px / 20px，不继承 More 触发按钮的 Icon-only 尺寸；自定义 Snippet 保留自身视觉。当前不提供菜单项图标或文字尺寸接口。`href` Action 在可见状态使用链接，在菜单中执行时导航到同一地址。每个 Action 的 `id` 在组内必须唯一。

`buttonProps` 是组级 Button 默认值，并同时作用于完整 Action、Icon-only Action、隐藏测量副本与 More 触发按钮。`parts.Button` 继续作为所有 Action 与 More 的组级 Button 覆盖；`parts.SelectButton` 只覆盖 More，并高于前两者。More 的可见实例与隐藏测量副本使用同一套最终 Props，单独改变 variant、size、bare、class 或 style 后不会造成响应式测量漂移。

Action 的优先级为 `buttonProps` → `parts.Button` → 子项 `parts.Button` → `OverflowAction` 直接 Props；More 的优先级为 `buttonProps` → `parts.Button` → `parts.SelectButton` → More 受控行为字段，越靠后优先级越高。未单独指定 More 样式时，它与组级 Action 使用同一 Button 样式；若没有任何组级样式，则使用 Button 默认的 `variant="gray"` 与 `size="sm"`。显式 `OverflowAction as="item"` 的直接 Props 只属于该外置 Action，父组件不会反向读取这些子项来推断 More 样式；因此所有外置 Action 都只在自身直接指定样式、而父级没有组级样式时，More 仍使用 Button 默认样式。

### 数据类型与继承边界

`OverflowActionsItem` 是两种数据的联合：操作为 `{ type?: "action"; id: string; label: string; icon?: string | Snippet; disabled?: boolean; href?: string; target?: string; rel?: string; onAction?: () => void }`，结构项为 `{ type: "separator"; id: string }`。单项 onAction 在组级 onAction 之前调用。外链的 `target` / `rel` 同时用于可见链接和 More 菜单，新窗口始终强制 `noopener`；显式 `OverflowAction` 同样支持。

`GlobalButtonProps` 为 Button Props 排除 `children / as / iconOnly / disabled / href / onclick / aria-label / title`。`Parts` 为 `ComponentPartsOf<{ Button: typeof Button; SelectButton: typeof SelectButton; Listbox: typeof Listbox; MenuItem: typeof MenuItem; Separator: typeof Separator }>`。每个键配置对应默认子组件的公开 Props，完整覆盖顺序见上文。

其余兼容 Frame Props 透传根容器，共享关键字参见 [Frame](Frame.md) 的公开 API；组合层不重复实现共享行为。


### 数量上限与数据项样式

`maxVisible?: number` 限制直出操作数量，不包含More与Separator；缺省不限制。有限数字向下取整并至少为0，NaN／Infinity按缺省处理。0时有操作只显示More，空组不显示More；数量上限同时约束full及compact，宽度可进一步收纳，`all`仍在需要收纳时全部进入菜单。菜单展开冻结，关闭再应用最新数量／宽度。数据action可用`buttonProps`配置当前项的直接Button Props、`parts.Button`配置该项owned Button，优先级为组默认→组parts→单项parts→单项buttonProps；不改变More默认。

> 此区域的内容受保护。AI 在修改此区域前必须请求用户审查。

---
---




## AI Zone

> **内置图标统一（2026-09-11）**：功能图标的资源比例、尺寸优先级和按钮宿主遵循 [ComponentGuidelines §2.7](../../../specs/maintainers/ComponentGuidelines.md#27-组件内置-icon-规范)。内置无外壳操作复用 Button bare；有padding的纯图标操作使用 iconOnly。尺寸从所属宿主继承，显式覆盖优先。

<a id="开发者指南-ai"></a>

### 开发者指南 (AI)

- 包归属：共享能力；主布局模型为复合管理布局。
- 组合模式：默认内置模式与显式组合模式并存；显式模式只识别直系 `OverflowAction as="item"` 与 `Separator as="separator"`。
- `OverflowAction` 通过专用 Context 注册 id / label / icon / disabled / href / 执行函数与测量节点；父组件不得读取任意 Button 内部结构推断语义。
- 自测量模式复用全局 `resizeManager`；传入 `availableWidth` 时不注册 ResizeObserver。
- 布局计算统一读取完整、Icon-only、Separator 与 More 的测量宽度；内容或 Props 变化后刷新固有宽度缓存，连续拖动复用缓存，不反复恢复隐藏项测量。自测量读取小数 CSS 布局宽度，并在共享 ResizeObserver 的交付帧直接求解，避免临界点取整和额外一帧引起抖动。
- DataTable 应从列宽上下文传入 `availableWidth`，禁止为每个 actions 单元格新增 Observer。
- More 菜单由 SelectButton / Listbox / MenuItem 承担打开、Portal、焦点、键盘与关闭行为。

<a id="模块索引"></a>

### 模块索引

- [OverflowActions.svelte](OverflowActions.svelte)
- [OverflowAction.svelte](OverflowAction.svelte)
- [SelectButton.svelte](SelectButton.svelte)
- [Listbox.svelte](Listbox.svelte)
- [MenuItem.svelte](MenuItem.svelte)

## 更新日志

### v1.1.1 (2026-10-23)

- 自有动作组间距保留4 CSS px下限及较大覆盖，原computed gap参与同一宽度求解；不改变compact／progressive／all、菜单冻结、测量缓存与动作回调。

### v1.1.0 (2026-10-21)

- 新增maxVisible与数据项buttonProps／parts，数量与宽度共同收纳，保持菜单冻结与独立组缺省行为。

- 2026-10-14：连续拖动时复用操作项和 Separator 宽度，按 Table 的小数布局宽度和观察器同帧求解；避免隐藏按钮反复参与测量与临界宽度抖动。

- 2026-10-07：接入共享宽度驱动渐隐与 1s 停留恢复；保留 compact、双向 progressive、all、菜单冻结及操作语义，焦点所在按钮收纳后移到 More。

- 2026-09-21：统一使用文档、源码属性表与 Site / LLM 阅读入口；仅文档修订，不改变组件行为。

### v1.0.2 (2026-09-02)

- 根据现有源码补齐逐属性说明、默认回退和使用边界；未改变组件运行时行为。

### v1.0.1 (2026-08-29)

- More 默认跟随组级 Button 样式，支持通过 `parts.SelectButton` 单独覆盖；显式外置 Action 的直接样式不反向影响 More。
- More 的测量副本改为真实 SelectButton，确保单独样式覆盖后的响应式宽度准确。

### v1.0.0 (2026-08-12)

- 初始版本：支持完整、Icon-only、全部溢出、双向逐个溢出、结构 Separator、组级 `buttonProps` 与 DataTable 外部宽度驱动；More 默认使用 Button 默认样式。
