# OverflowAction

> **许可阅读**：首次阅读组件文档、源码或 npm 使用流程，先读完整 [LICENSE](../../LICENSE)；同任务同版本去重。公开 API 配置与内部实现修改分别按许可处理；全部组件使用统一运行包，源码权益以许可为准。

> **版本**: v1.0.1
> **职责**: 定义 OverflowActions 中的一项按钮操作，让它可随可用空间在工具栏与更多菜单之间切换。
> **包归属**: `@snowui-design-system/components`
> **文档修订**: 2026-10-12

## 组件介绍

定义 OverflowActions 中的一项按钮操作，让它可随可用空间在工具栏与更多菜单之间切换。

## 使用选择

<!-- usage-guide:start -->
作为 OverflowActions 中的一个操作使用，操作身份应稳定。结构分隔使用 Separator，不作为可执行操作。

- 直接子项必须声明 as="item"，并提供唯一 id 和可读 label。
- children 只替换可见按钮内容；收进菜单后的文字与图标仍取 label / icon。
- 专用按钮使用 control Snippet 替换可见 Button，并把收到的 run 回调接入该按钮的 onclick；菜单继续调用同一项的 onclick，切换状态通过专用按钮的公开绑定完成。
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
		<OverflowAction as="item" id="github" label="SnowUI on GitHub" icon="github-logo" href="https://github.com/SnowUI" />
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
| iconOnly | `boolean` | `false` | 内建可见 Button 仅显示 icon，label 作为无障碍名称；菜单仍显示 label |
| onclick | `(event?: MouseEvent) => void` | — | 可见按钮与菜单执行共享的操作函数 |
| children | `Snippet` | — | 覆盖可见按钮内容；注册到菜单的 label / icon 仍取显式 Props 默认行为：自动 Icon + label。 |
| control | `Snippet<[(event?: MouseEvent) => void, boolean]>` | — | 用专用控件替换可见 Button；参数依次为 run 回调与最终 disabled，须接入控件的实际 onclick / disabled。菜单仍通过 onclick 执行；组件直接测量专用控件，不复制带状态控件的隐藏实例。 |
| parts | `ComponentPartsOf<{ Button: typeof Button }>` | — | 配置当前操作内建 Button；优先级低于直接 Button Props、高于父级组默认，父级不读取此配置来推断 More 按钮样式。 |
| as | `string` | — | 作为 OverflowActions 的直系子项时必须设置 "item"，以注册测量、溢出与菜单执行；未注册时不能参与父级响应式操作管理。 |

未重新声明的继承能力请查所属基础组件文档；本表只列本组件源码具名公开属性。

## 使用边界与详细说明

<a id="api"></a>

### API

OverflowAction 只能作为 `OverflowActions` 的直系子项使用。组件保留透明测量外壳，以便父级同时获得完整与 Icon-only 宽度；交互宿主始终是真实 Button，不创建第二套按钮状态机。

`control` 模式面向 `ColorSchemeButton`、`StyleButton` 等自带 Button 宿主的控件；不把控件嵌入另一颗 Button。可见控件的点击先调用 `run(event)` 以通知操作组，随后由专用控件执行自己的状态切换；进入 More 后没有可见控件点击事件，`onclick(undefined)` 应通过同一公开绑定更新状态。`icon` 与 `label` 始终负责菜单呈现和可读名称；`compact="none"` 适合混合专用控件的工具栏。此时测量现有控件本体；收纳后退出布局与绘制，需要复核宽度时仅在同一计算过程临时恢复测量，不挂载第二个会读写文档状态的控件。

链接可透传 Button 的 `target` 与 `rel`：可见状态保持原生链接，More 中对非 `_self` 目标使用新窗口且强制 `noopener`，声明 `noreferrer` 时同样保留；站内链接在原窗口导航。

父级 `OverflowActions buttonProps` 为 Button 提供组级默认值；当前 `OverflowAction` 直接声明的 Button 兼容 Props 优先，子项 `parts.Button` 位于两者之间。

> 此区域的内容受保护。AI 在修改此区域前必须请求用户审查。

---
---




## AI Zone

<a id="开发者指南-ai"></a>

### 开发者指南 (AI)

- 包归属：共享能力；主布局模型为内联外壳布局。
- 组合身份：OverflowActions 的专用显式子项。
- `as="item"` 时向最近的 OverflowActions Context 注册；缺少父级时开发环境输出警告，但仍渲染普通 Button。
- 测量副本必须不可聚焦、不可命中、不可进入无障碍树。
- control 模式只挂载一份专用控件，测量其可见壳；run 只负责把可见点击通知操作组，不接管专用控件的切换实现。
- 真实按钮使用独立视觉壳消费父级渐隐值，不干扰 Button 自身 hover、点击或 Frame 根视觉通道；减少动效时保持完全可见直到收纳。

## 更新日志

- 2026-09-21：统一使用文档、源码属性表与 Site / LLM 阅读入口；仅文档修订，不改变组件行为。

### v1.0.1 (2026-09-02)

- 根据现有源码补齐逐属性说明、默认回退和使用边界；未改变组件运行时行为。

### v1.0.0 (2026-08-12)

- 初始版本。
