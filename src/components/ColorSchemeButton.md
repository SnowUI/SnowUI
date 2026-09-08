# ColorSchemeButton

> **版本**: v1.0.2
> **职责**: 以真实 Button 为宿主，在页面亮色与暗色方案之间切换。

## 使用

```svelte
<script lang="ts">
  import { ColorSchemeButton } from "@snowui-design-system/components";
</script>

<ColorSchemeButton bare />
```

ColorSchemeButton 平铺 Button 的兼容 Props，支持全部变体与尺寸。默认读取 `document.documentElement`：`theme="dark"` 为暗色，移除该属性为亮色。无额外 children 时，组件主动向 Button 声明 `iconOnly=true`；内置 Sun / Moon 图标跟随 Button 尺寸上下文：普通 icon-only 的 `sm / md / lg` 为 `16 / 20 / 24px`，`bare` icon-only 则沿用 Button 的 `12 / 16 / 20px`。

旧名称 `ThemeButton` 仅作为弃用兼容别名保留；新代码统一使用 ColorSchemeButton。

点击后立即更新方案，不写入 storage；图标替换使用 150ms 动效，不对整页主题增加过渡。`applyToDocument={false}` 时组件只维护受控状态，适合由 Test、iframe 等宿主管理实际主题目标。

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `scheme` | `"light" \| "dark"` | — | 当前配色方案，支持 bind:scheme。挂载时优先于 defaultScheme；点击更新该值，同步页面属性时也会跟随根节点变化。 |
| `defaultScheme` | `"light" \| "dark"` | — | 挂载时的非受控初值；scheme 优先。均未提供时读取页面根节点；applyToDocument=false 时回退为 light。 |
| `applyToDocument` | `boolean` | `true` | 将当前状态同步到 document.documentElement：theme="dark"；亮色时移除 theme。false 时不读写或观察页面属性，由调用方处理主题目标；不写入 storage。 |
| `ariaLabel` | `string` | —（本地化的下一步操作） | 覆盖按钮的可访问名称；默认描述点击后切换到的状态，跟随 LocaleProvider。 |
| `lightIcon` | `Snippet` | —（内置图形） | 替换当前为 light 时显示的 Sun 图标。仅改变图形，不接管切换逻辑。 |
| `darkIcon` | `Snippet` | —（内置图形） | 替换当前为 dark 时显示的 Moon 图标。仅改变图形，不接管切换逻辑。 |
| `children` | `Snippet` | — | 显示在状态图形之后的自定义内容；未提供时宿主 Button 自动使用 iconOnly 布局。 |
| `disabled` | `boolean` | `false` | 禁用按钮操作；不会阻止外部绑定值或页面属性的同步。 |
| `onSchemeChange` | `(scheme: "light" \| "dark") => void` | — | 用户点击切换后接收新值；初始化、外部赋值及页面属性观察同步不会调用此回调。 |
| `onclick` | `(event: MouseEvent) => void` | — | 有效点击时先调用，再执行状态切换；当前实现不会以 preventDefault() 取消后续切换。disabled 时不调用。 |

> 此区域的内容受保护。AI 在修改此区域前必须请求用户审查。

---

> **以下内容供 AI 阅读，用于维护代码与文档的关联**

## 开发者指南 (AI)

- 包归属：OSS；主布局模型为内联外壳布局。
- 组合身份：Button 宿主组件特化，不提供 `parts.Button`。
- 内置图标不传显式 size，必须由 `ComponentIcon` 消费 Button 提供的图标尺寸 Context；切换 IconProvider 不能改变该尺寸所有权。
- 多实例通过观察根节点 `theme` 属性同步；`applyToDocument={false}` 时由受控 `scheme` 同步。
- 状态切换不接入 replacement preset、CSS transition 或 View Transition。

## 更新日志 (Changelog)

### v1.0.2 (2026-09-02)

- 根据现有源码补齐逐属性说明、默认回退和使用边界；未改变组件运行时行为。

### v1.0.1 (2026-08-11)

- 无额外 children 时主动向 Button 声明 `iconOnly=true`；不再依赖图标 DOM 自动识别。

### v1.0.0 (2026-08-11)

- 从 ThemeButton 收敛命名为 ColorSchemeButton；修正内置图标按 Button 尺寸显示。

### 状态按钮动效时长

默认图标切换以及 Button 宿主的 hover / 点击缩放统一为 150ms，与 Checkbox、Switch 的默认主要状态切换时长对齐；遵守 reduced-motion。外置显式动效配置仍按既有公开入口生效。
