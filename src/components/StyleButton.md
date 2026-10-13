# StyleButton

> **许可阅读**：首次阅读组件文档、源码或 npm 使用流程，先读完整 [LICENSE](../../LICENSE)；同任务同版本去重。公开 API 配置与内部实现修改分别按许可处理；全部组件使用统一运行包，源码权益以许可为准。

> **版本**: v1.0.4
> **职责**: 在 SnowUI 与 Apple 两种视觉风格之间切换，适合提供界面风格选择的入口。
> **包归属**: `@snowui-design-system/components`
> **文档修订**: 2026-09-21

## 组件介绍

在 SnowUI 与 Apple 两种视觉风格之间切换，适合提供界面风格选择的入口。

## 使用选择

<!-- usage-guide:start -->
用于切换支持的视觉风格；明暗模式使用 ColorSchemeButton。它不意味着可以通过一个按钮改变任意组件私有样式。

- bind:mode 同步风格，defaultMode 提供初始模式。
- 默认把模式应用到文档；局部控制使用 applyToDocument=false，不提供 children 时使用纯图标布局。
<!-- usage-guide:end -->

## 快速开始

以下示例展示推荐的基本组合。更多场景与组合限制见后文。

<!-- quick-start:generated -->
```svelte
<script lang="ts">
	import { StyleButton } from '@snowui-design-system/components';
</script>

<StyleButton />
```
<!-- /quick-start:generated -->

## API

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| mode | `SnowUIStyleMode` | — | 当前视觉风格，支持 bind:mode。挂载时优先于 defaultMode；点击更新该值，同步页面属性时也会跟随根节点变化。 |
| defaultMode | `SnowUIStyleMode` | — | 挂载时的非受控初值；mode 优先。均未提供时读取页面根节点；applyToDocument=false 时回退为 snowui。 |
| applyToDocument | `boolean` | `true` | 将当前状态同步到 document.documentElement：mode="ios"；SnowUI 时移除 mode。false 时不读写或观察页面属性，由调用方处理主题目标；不写入 storage。 |
| ariaLabel | `string` | — | 覆盖按钮的可访问名称；默认描述点击后切换到的状态，跟随 LocaleProvider。 |
| snowuiLogo | `Snippet` | `—（内置图形）` | 替换当前为 snowui 时显示的 SnowUI Logo。仅改变图形，不接管切换逻辑。 |
| appleLogo | `Snippet` | `—（内置图形）` | 替换当前为 apple 时显示的 Apple Logo。仅改变图形，不接管切换逻辑。 |
| children | `Snippet` | — | 显示在状态图形之后的自定义内容；未提供时宿主 Button 自动使用 iconOnly 布局。 |
| disabled | `boolean` | `false` | 禁用按钮操作；不会阻止外部绑定值或页面属性的同步。 |
| onModeChange | `(mode: SnowUIStyleMode) => void` | — | 用户点击切换后接收新值；初始化、外部赋值及页面属性观察同步不会调用此回调。 |
| onclick | `(event: MouseEvent) => void` | — | 有效点击时先调用，再执行状态切换；当前实现不会以 preventDefault() 取消后续切换。disabled 时不调用。 |

未重新声明的继承能力请查所属基础组件文档；本表只列本组件源码具名公开属性。

## 使用边界与详细说明

<a id="使用"></a>

### 使用

```svelte
<script lang="ts">
  import { StyleButton } from "@snowui-design-system/components";
</script>

<StyleButton bare />
```

StyleButton 平铺 Button 的兼容 Props，支持全部变体与尺寸。默认读取 `document.documentElement`：`mode="ios"` 为 Apple 风格，移除该属性为 SnowUI 风格。当前 SnowUI 状态使用 `SnowUILogo variant="icon"`，Apple 状态使用 Apple 品牌 Logo 矢量，而不是图标库中的 Apple Icon；无额外 children 时，StyleButton 主动向 Button 声明 `iconOnly=true`，因此 `sm / md / lg` 的四边 padding 分别保持 Button 原生的 `4 / 8 / 12px`。

点击后立即切换，不写入 storage，也不增加图标替换、风格切换动效。`applyToDocument={false}` 时只维护受控状态，适合由 Test、iframe 等宿主管理实际风格目标。


> 此区域的内容受保护。AI 在修改此区域前必须请求用户审查。

---




## AI Zone

> **内置图标统一（2026-09-11）**：功能图标的资源比例、尺寸优先级和按钮宿主遵循 [ComponentGuidelines §2.7](../../../specs/maintainers/ComponentGuidelines.md#27-组件内置-icon-规范)。内置无外壳操作复用 Button bare；有padding的纯图标操作使用 iconOnly。尺寸从所属宿主继承，显式覆盖优先。

<a id="开发者指南-ai"></a>

### 开发者指南 (AI)

- 包归属：共享能力；主布局模型为内联外壳布局。
- 组合身份：Button 宿主组件特化，不提供 `parts.Button`。
- 内置 SnowUI Logo 必须使用 `SnowUILogo variant="icon"`，Apple 状态必须使用 Apple Logo。
- 两个 Logo 均消费 Button 图标尺寸上下文，不得固定为单一尺寸。
- 两个 Logo 的直接根节点保留 `snowui-style-button-logo` 视觉身份；icon-only 布局由 StyleButton 显式传给 Button，不依赖 Logo DOM 类型，也不得由 StyleButton 私自覆写 padding。
- 多实例通过观察根节点 `mode` 属性同步；`applyToDocument={false}` 时由受控 `mode` 同步。

## 更新日志

- 2026-09-21：统一使用文档、源码属性表与 Site / LLM 阅读入口；仅文档修订，不改变组件行为。

### v1.0.4 (2026-09-02)

- 根据现有源码补齐逐属性说明、默认回退和使用边界；未改变组件运行时行为。

### v1.0.3 (2026-08-11)

- 无额外 children 时主动向 Button 声明 `iconOnly=true`；不再依赖 Logo DOM 自动识别。

### v1.0.2 (2026-08-11)

- Apple 状态改用 Apple 品牌 Logo 矢量，不再使用资源 Icon。
- 修复 SnowUI Logo 未被 Button 判定为 icon-only 导致两种状态左右 padding 不一致；两个状态现在统一使用 Button 原生 icon-only padding。

### v1.0.1 (2026-08-11)

- SnowUI / Apple 两个状态恢复为品牌 Logo；Logo 继续跟随 Button 图标尺寸上下文。

### v1.0.0 (2026-08-11)

- 首次实现 SnowUI / Apple 风格切换、SnowIcon / Apple Logo 内置图标及 Button 全变体兼容。
