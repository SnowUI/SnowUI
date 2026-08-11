# StyleButton

> **版本**: v1.0.3  
> **职责**: 以真实 Button 为宿主，在 SnowUI 与 Apple 视觉风格之间切换。

## 使用

```svelte
<StyleButton bare />
```

StyleButton 平铺 Button 的兼容 Props，支持全部变体与尺寸。默认读取 `document.documentElement`：`mode="ios"` 为 Apple 风格，移除该属性为 SnowUI 风格。当前 SnowUI 状态使用 `SnowUILogo variant="icon"`，Apple 状态使用 Apple 品牌 Logo 矢量，而不是图标库中的 Apple Icon；无额外 children 时，StyleButton 主动向 Button 声明 `iconOnly=true`，因此 `sm / md / lg` 的四边 padding 分别保持 Button 原生的 `4 / 8 / 12px`。

点击后立即切换，不写入 storage，也不增加图标替换、风格切换动效。`applyToDocument={false}` 时只维护受控状态，适合由 Test、iframe 等宿主管理实际风格目标。

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `mode` | `"snowui" \| "apple"` | 当前页面风格 | 当前风格，可 `bind:mode` |
| `defaultMode` | `"snowui" \| "apple"` | 当前页面风格 | 非受控初始风格 |
| `applyToDocument` | `boolean` | `true` | 是否同步页面根节点 |
| `ariaLabel` | `string` | 当前操作的本地化文案 | 覆盖按钮名称 |
| `snowuiLogo` / `appleLogo` | `Snippet` | SnowUI Logo / Apple Logo | 覆盖对应内置 Logo |
| `children` | `Snippet` | 无 | 图标后的可选内容 |
| `onModeChange` | `(mode) => void` | 无 | 切换完成后的回调 |

> 此区域的内容受保护。AI 在修改此区域前必须请求用户审查。

---

> **以下内容供 AI 阅读，用于维护代码与文档的关联**

## 开发者指南 (AI)

- 包归属：OSS；主布局模型为内联外壳布局。
- 组合身份：Button 宿主组件特化，不提供 `parts.Button`。
- 内置 SnowUI Logo 必须使用 `SnowUILogo variant="icon"`，Apple 状态必须使用 Apple Logo。
- 两个 Logo 均消费 Button 图标尺寸上下文，不得固定为单一尺寸。
- 两个 Logo 的直接根节点保留 `snowui-style-button-logo` 视觉身份；icon-only 布局由 StyleButton 显式传给 Button，不依赖 Logo DOM 类型，也不得由 StyleButton 私自覆写 padding。
- 多实例通过观察根节点 `mode` 属性同步；`applyToDocument={false}` 时由受控 `mode` 同步。

## 更新日志 (Changelog)

### v1.0.3 (2026-08-11)

- 无额外 children 时主动向 Button 声明 `iconOnly=true`；不再依赖 Logo DOM 自动识别。

### v1.0.2 (2026-08-11)

- Apple 状态改用 Apple 品牌 Logo 矢量，不再使用资源 Icon。
- 修复 SnowUI Logo 未被 Button 判定为 icon-only 导致两种状态左右 padding 不一致；两个状态现在统一使用 Button 原生 icon-only padding。

### v1.0.1 (2026-08-11)

- SnowUI / Apple 两个状态恢复为品牌 Logo；Logo 继续跟随 Button 图标尺寸上下文。

### v1.0.0 (2026-08-11)

- 首次实现 SnowUI / Apple 风格切换、SnowIcon / Apple Logo 内置图标及 Button 全变体兼容。
