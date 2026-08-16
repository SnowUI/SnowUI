# ColorSchemeButton

> **版本**: v1.0.1  
> **职责**: 以真实 Button 为宿主，在页面亮色与暗色方案之间切换。

## 使用

```svelte
<ColorSchemeButton bare />
```

ColorSchemeButton 平铺 Button 的兼容 Props，支持全部变体与尺寸。默认读取 `document.documentElement`：`theme="dark"` 为暗色，移除该属性为亮色。无额外 children 时，组件主动向 Button 声明 `iconOnly=true`；内置 Sun / Moon 图标跟随 Button 尺寸上下文：普通 icon-only 的 `sm / md / lg` 为 `16 / 20 / 24px`，`bare` icon-only 则沿用 Button 的 `12 / 16 / 20px`。

旧名称 `ThemeButton` 仅作为弃用兼容别名保留；新代码统一使用 ColorSchemeButton。

点击后立即切换，不写入 storage，也不增加图标替换、主题切换动效。`applyToDocument={false}` 时组件只维护受控状态，适合由 Test、iframe 等宿主管理实际主题目标。

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `scheme` | `"light" \| "dark"` | 当前页面方案 | 当前方案，可 `bind:scheme` |
| `defaultScheme` | `"light" \| "dark"` | 当前页面方案 | 非受控初始方案 |
| `applyToDocument` | `boolean` | `true` | 是否同步页面根节点 |
| `ariaLabel` | `string` | 当前操作的本地化文案 | 覆盖按钮名称 |
| `lightIcon` / `darkIcon` | `Snippet` | Sun / Moon | 覆盖对应内置图标 |
| `children` | `Snippet` | 无 | 图标后的可选内容 |
| `onSchemeChange` | `(scheme) => void` | 无 | 切换完成后的回调 |

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

### v1.0.1 (2026-08-11)

- 无额外 children 时主动向 Button 声明 `iconOnly=true`；不再依赖图标 DOM 自动识别。

### v1.0.0 (2026-08-11)

- 从 ThemeButton 收敛命名为 ColorSchemeButton；修正内置图标按 Button 尺寸显示。
