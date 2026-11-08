# ColorSchemeButton

> **版本**: v1.0.2
> **职责**: 在亮色与暗色主题之间切换，并以图标反馈当前方案，适合网站和应用的主题入口。
> **包归属**: `@snowui-design-system/components`
> **文档修订**: 2026-09-21

## 组件介绍

在亮色与暗色主题之间切换，并以图标反馈当前方案，适合网站和应用的主题入口。

## 使用选择

<!-- usage-guide:start -->
用于切换浅色与深色方案。新代码使用此名称；ThemeButton 是兼容导出。设计风格切换使用 StyleButton。

- 通过 `bind:scheme` 或 onSchemeChange 同步明暗状态，defaultScheme 提供默认方案。
- 默认同步文档主题；局部控制设置 `applyToDocument={false}`。不提供 children 时使用纯图标布局。
<!-- usage-guide:end -->

## 快速开始

以下示例展示推荐的基本组合。更多场景与组合限制见后文。

<!-- quick-start:generated -->
```svelte
<script lang="ts">
	import { ColorSchemeButton } from '@snowui-design-system/components';
</script>

<ColorSchemeButton />
```
<!-- /quick-start:generated -->

## API

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| scheme | `ColorScheme` | — | 当前配色方案，支持 bind:scheme。关闭 systemPreference 时，挂载值优先于 defaultScheme；点击更新该值，同步页面属性时也会跟随根节点变化。 |
| defaultScheme | `ColorScheme` | — | 关闭 systemPreference 时的非受控初值；scheme 优先。均未提供时读取页面根节点；applyToDocument=false 时回退为 light。 |
| applyToDocument | `boolean` | `true` | 将当前状态同步到 document.documentElement：theme="dark"；亮色时移除 theme。false 时不读写或观察页面属性，由调用方处理主题目标；系统偏好和 Cookie 能力由 systemPreference 单独控制。 |
| systemPreference | `boolean` | `true` | 无有效手动 Cookie 时跟随系统亮暗；手动选择保存 365 天，到期恢复系统。开启时 Cookie／系统优先于初值；false 不读取系统或偏好 Cookie，也不写偏好。 |
| ariaLabel | `string` | — | 覆盖按钮的可访问名称；默认描述点击后切换到的状态，跟随 LocaleProvider。 |
| lightIcon | `Snippet` | `—（内置图形）` | 替换当前为 light 时显示的 Sun 图标。仅改变图形，不接管切换逻辑。 |
| darkIcon | `Snippet` | `—（内置图形）` | 替换当前为 dark 时显示的 Moon 图标。仅改变图形，不接管切换逻辑。 |
| children | `Snippet` | — | 显示在状态图形之后的自定义内容；未提供时宿主 Button 自动使用 iconOnly 布局。 |
| disabled | `boolean` | `false` | 禁用按钮操作；不会阻止外部绑定值或页面属性的同步。 |
| onSchemeChange | `(scheme: ColorScheme) => void` | — | 用户点击切换后接收新值；初始化、外部赋值及页面属性观察同步不会调用此回调。 |
| onclick | `(event: MouseEvent) => void` | — | 有效点击时先调用，再执行状态切换；当前实现不会以 preventDefault() 取消后续切换。disabled 时不调用。 |

未重新声明的继承能力请查所属基础组件文档；本表只列本组件源码具名公开属性。

## 使用边界与详细说明

<a id="使用"></a>

### 使用

```svelte
<script lang="ts">
  import { ColorSchemeButton } from "@snowui-design-system/components";
</script>

<ColorSchemeButton bare />
```

ColorSchemeButton 平铺 Button 的兼容 Props，支持全部变体与尺寸。关闭 `systemPreference` 时读取 `document.documentElement`：`theme="dark"` 为暗色，移除该属性为亮色。无额外 children 时，组件主动向 Button 声明 `iconOnly=true`；内置 Sun / Moon 图标跟随 Button 尺寸上下文：普通 icon-only 的 `sm / md / lg` 为 `16 / 20 / 24px`，`bare` icon-only 则沿用 Button 的 `12 / 16 / 20px`。

`toggleScheme()` 为实例公开方法，与点击使用同一切换、禁用及记忆逻辑，适用于外部菜单入口。系统读取使用浏览器 `prefers-color-scheme`，适用于 macOS 与 Windows；Cookie 被浏览器禁用时无法跨访问保存。Test 与独立组件示例使用 `systemPreference={false}` 保持可复现。

旧名称 `ThemeButton` 仅作为弃用兼容别名保留；新代码统一使用 ColorSchemeButton。

点击后立即更新方案；默认写入一年期主题 Cookie，`systemPreference={false}` 时不读写偏好；图标替换使用 150ms 动效，不对整页主题增加过渡。`applyToDocument={false}` 时组件只维护受控状态，适合由 Test、iframe 等宿主管理实际主题目标。


> 此区域的内容受保护。AI 在修改此区域前必须请求用户审查。

---




## AI Zone

> **内置图标统一（2026-09-11）**：功能图标的资源比例、尺寸优先级和按钮宿主遵循 [ComponentGuidelines §2.7](../../../docs/standards/ComponentGuidelines.md#27-组件内置-icon-规范)。内置无外壳操作复用 Button bare；有padding的纯图标操作使用 iconOnly。尺寸从所属宿主继承，显式覆盖优先。

<a id="开发者指南-ai"></a>

### 开发者指南 (AI)

- 包归属：共享能力；主布局模型为内联外壳布局。
- 组合身份：Button 宿主组件特化，不提供 `parts.Button`。
- 内置图标不传显式 size，必须由 `ComponentIcon` 消费 Button 提供的图标尺寸 Context；切换 IconProvider 不能改变该尺寸所有权。
- 多实例通过观察根节点 `theme` 属性同步；`applyToDocument={false}` 时由受控 `scheme` 同步。
- 状态切换不接入 replacement preset、CSS transition 或 View Transition。

## 更新日志

- 2026-09-21：统一使用文档、源码属性表与 Site / LLM 阅读入口；仅文档修订，不改变组件行为。

### v1.0.2 (2026-09-02)

- 根据现有源码补齐逐属性说明、默认回退和使用边界；未改变组件运行时行为。

### v1.0.1 (2026-08-11)

- 无额外 children 时主动向 Button 声明 `iconOnly=true`；不再依赖图标 DOM 自动识别。

### v1.0.0 (2026-08-11)

- 从 ThemeButton 收敛命名为 ColorSchemeButton；修正内置图标按 Button 尺寸显示。

### 状态按钮动效时长

默认图标切换以及 Button 宿主的 hover / 点击缩放统一为 150ms，与 Checkbox、Switch 的默认主要状态切换时长对齐；遵守 reduced-motion。外置显式动效配置仍按既有公开入口生效。
