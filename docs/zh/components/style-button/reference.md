# StyleButton

> **版本**: v1.0.4
> **职责**: 在 SnowUI 与 Apple 两种视觉风格之间切换，适合提供界面风格选择的入口。
> **包归属**: `@snowui-design-system/components`
> **文档修订**: 2026-09-21

## 组件介绍

在 SnowUI 与 Apple 两种视觉风格之间切换，适合提供界面风格选择的入口。

## 使用选择


用于切换支持的视觉风格；明暗模式使用 ColorSchemeButton。它不意味着可以通过一个按钮改变任意组件私有样式。

- bind:mode 同步风格，defaultMode 提供初始模式。
- 默认把模式应用到文档；局部控制使用 applyToDocument=false，不提供 children 时使用纯图标布局。


## 快速开始

以下示例展示推荐的基本组合。更多场景与组合限制见后文。


```svelte
<script lang="ts">
	import { StyleButton } from '@snowui-design-system/components';
</script>

<StyleButton />
```


## API

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| mode | `SnowUIStyleMode` | — | 当前视觉风格，支持 bind:mode。挂载时优先于 defaultMode；点击更新该值，同步页面属性时也会跟随根节点变化。 |
| defaultMode | `SnowUIStyleMode` | — | 挂载时的非受控初值；mode 优先。均未提供时读取页面根节点；applyToDocument=false 时回退为 snowui。 |
| applyToDocument | `boolean` | `true` | 将当前状态同步到 document.documentElement 和 body：Apple 时设置 mode="ios"，SnowUI 时移除 mode。false 时不读写或观察页面属性，由调用方处理主题目标；不写入 storage。 |
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


---
