# SelectButton

> **版本**: v1.0.0  
> **职责**: 以真实 Button 为视觉宿主、复用 Select 单选能力的按钮型选择器。

## 使用

```svelte
<SelectButton
  bind:value
  variant="borderless"
  options={[{ value: "recent", label: "最近更新" }]}
  parts={{ Input: { placeholder: "搜索" } }}
/>
```

Button 的兼容 Props 在根级平铺；Button 是宿主，不提供 `parts.Button`。默认辅助子树为 Listbox → Input + MenuItem，通过 `parts.Listbox/Input/MenuItem` 配置。存在显式 children 时替换默认 Listbox。

默认 label 显示当前选项或 placeholder；`label` snippet 只替换 label。默认 indicator 使用 `arrow-line-down`，可用 `showIndicator={false}` 隐藏或用 `indicator` snippet 替换。

`selectionMode="persistent"` 是默认持续选择模式：trigger 显示当前选中项。`selectionMode="action"` 是命令执行模式：trigger 始终显示 placeholder，点击选项只触发 `onAction(value)`，不保存选中值。因此无需另设 MenuButton。

SelectButton 默认不显示搜索框，使用 `search` 开启。其 Listbox 默认以最长选项决定固定宽度，其他选项全部 fill，并且不显示选中 check。搜索 placeholder、搜索时 160px 最小宽度和打开后锁宽由 Listbox 统一提供。`bare` 与 `emphasis` 直接传给宿主 Button；因此 bare 默认 100%，需要次级触发器时显式使用 `emphasis="muted"`。

> 此区域的内容受保护。AI 在修改此区域前必须请求用户审查。

---

> **以下内容供 AI 阅读，用于维护代码与文档的关联**

## 开发者指南 (AI)

| 关键字 | 说明 |
| --- | --- |
| Button host | 根级兼容 Props 的真实视觉宿主 |
| parts | Listbox / Input / MenuItem 默认内置辅助子树 |
| selectionMode | `persistent` 持续选择；`action` 执行命令 |
| search | 是否显示搜索框，默认 false |

- 主布局模型：宿主组件特化 + 复合管理布局。
- 宿主：Button；状态控制器：Select。
- 受控字段：children、as、value、disabled、id、trigger 事件与 ARIA。
- 无视觉 wrapper 由 Select 提供；Button 仍是真实交互节点。
- 依赖：Select、Button、Listbox、Input、MenuItem、resource-svelte。

## 更新日志 (Changelog)

### v1.0.0 (2026-07-03)

- 首次实现宿主组件特化、默认内置和显式组合模式。
