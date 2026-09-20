# OverflowAction

> **版本**: v1.0.1
> **职责**: 定义 OverflowActions 中的一项按钮操作，让它可随可用空间在工具栏与更多菜单之间切换。
> **包归属**: `@snowui-design-system/components`
> **文档修订**: 2026-09-21

## 组件介绍

定义 OverflowActions 中的一项按钮操作，让它可随可用空间在工具栏与更多菜单之间切换。

## 使用选择

<!-- usage-guide:start -->
作为 OverflowActions 中的一个操作使用，操作身份应稳定。结构分隔使用 Separator，不作为可执行操作。

- 直接子项必须声明 as="item"，并提供唯一 id 和可读 label。
- children 只替换可见按钮内容；收进菜单后的文字与图标仍取 label / icon。
<!-- usage-guide:end -->

## 快速开始

以下示例展示推荐的基本组合。更多场景与组合限制见后文。

<!-- quick-start:generated -->
```svelte
<script lang="ts">
	import { OverflowAction, OverflowActions } from '@snowui-design-system/components';
</script>

<div style="display: flex; align-items: center; justify-content: center; width: 100%;">
	<OverflowActions overflow="progressive" overflowFrom="end" availableWidth={250} moreLabel="More component actions" style="justify-content: center;">
		<OverflowAction as="item" id="source" label="View source" icon="code" href="https://github.com/SnowUI/SnowUI" />
		<OverflowAction as="item" id="copy-import" label="Copy import" icon="copy" />
		<OverflowAction as="item" id="publish" label="Publish docs" icon="upload" />
	</OverflowActions>
</div>
```
<!-- /quick-start:generated -->

## API

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| id | `string` | `必填` | 组内稳定且唯一的操作标识 |
| label | `string` | `必填` | 按钮文字、菜单文字与 Icon-only 无障碍名称 |
| icon | `OverflowActionIcon` | — | 资源图标名或自定义图标；菜单复用同一内容 |
| disabled | `boolean` | `false` | 禁用可见按钮与对应 MenuItem |
| href | `string` | — | 可见状态渲染链接；菜单执行时导航到同一地址 |
| onclick | `(event?: MouseEvent) => void` | — | 可见按钮与菜单执行共享的操作函数 |
| children | `Snippet` | — | 覆盖可见按钮内容；注册到菜单的 label / icon 仍取显式 Props 默认行为：自动 Icon + label。 |
| parts | `ComponentPartsOf<{ Button: typeof Button }>` | — | 配置当前操作内建 Button；优先级低于直接 Button Props、高于父级组默认，父级不读取此配置来推断 More 按钮样式。 |
| as | `string` | — | 作为 OverflowActions 的直系子项时必须设置 "item"，以注册测量、溢出与菜单执行；未注册时不能参与父级响应式操作管理。 |

未重新声明的继承能力请查所属基础组件文档；本表只列本组件源码具名公开属性。

## 使用边界与详细说明

<a id="api"></a>

### API

OverflowAction 只能作为 `OverflowActions` 的直系子项使用。组件保留透明测量外壳，以便父级同时获得完整与 Icon-only 宽度；交互宿主始终是真实 Button，不创建第二套按钮状态机。

父级 `OverflowActions buttonProps` 为 Button 提供组级默认值；当前 `OverflowAction` 直接声明的 Button 兼容 Props 优先，子项 `parts.Button` 位于两者之间。

> 此区域的内容受保护。AI 在修改此区域前必须请求用户审查。

---
---




## AI Zone

<a id="开发者指南-ai"></a>

### 开发者指南 (AI)

- 包归属：OSS；主布局模型为内联外壳布局。
- 组合身份：OverflowActions 的专用显式子项。
- `as="item"` 时向最近的 OverflowActions Context 注册；缺少父级时开发环境输出警告，但仍渲染普通 Button。
- 测量副本必须不可聚焦、不可命中、不可进入无障碍树。

## 更新日志

- 2026-09-21：统一使用文档、源码属性表与 Site / LLM 阅读入口；仅文档修订，不改变组件行为。

### v1.0.1 (2026-09-02)

- 根据现有源码补齐逐属性说明、默认回退和使用边界；未改变组件运行时行为。

### v1.0.0 (2026-08-12)

- 初始版本。
