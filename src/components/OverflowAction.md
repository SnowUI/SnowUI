# OverflowAction

> **版本**: v1.0.0  
> **职责**: 为 OverflowActions 显式声明一个可测量、可转移到菜单的真实 Button 操作。

## API

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `id` | `string` | 必填 | 组内稳定且唯一的操作标识 |
| `label` | `string` | 必填 | 按钮文字、菜单文字与 Icon-only 无障碍名称 |
| `icon` | `string \| Snippet` | 无 | 资源图标名或自定义图标；菜单复用同一内容 |
| `disabled` | `boolean` | `false` | 禁用可见按钮与对应 MenuItem |
| `href` | `string` | 无 | 可见状态渲染链接；菜单执行时导航到同一地址 |
| `onclick` | `(event?: MouseEvent) => void` | 无 | 可见按钮与菜单执行共享的操作函数 |
| `children` | `Snippet` | 自动 Icon + label | 覆盖可见按钮内容；注册到菜单的 label / icon 仍取显式 Props |
| `...rest` | `ButtonProps` | 无 | 透传到真实 Button |

OverflowAction 只能作为 `OverflowActions` 的直系子项使用。组件保留透明测量外壳，以便父级同时获得完整与 Icon-only 宽度；交互宿主始终是真实 Button，不创建第二套按钮状态机。

父级 `OverflowActions buttonProps` 为 Button 提供组级默认值；当前 `OverflowAction` 直接声明的 Button 兼容 Props 优先，子项 `parts.Button` 位于两者之间。

> 此区域的内容受保护。AI 在修改此区域前必须请求用户审查。

---
---

> **以下内容供 AI 阅读，用于维护代码与文档的关联**

## 开发者指南 (AI)

- 包归属：OSS；主布局模型为内联外壳布局。
- 组合身份：OverflowActions 的专用显式子项。
- `as="item"` 时向最近的 OverflowActions Context 注册；缺少父级时开发环境输出警告，但仍渲染普通 Button。
- 测量副本必须不可聚焦、不可命中、不可进入无障碍树。

## 更新日志 (Changelog)

### v1.0.0 (2026-08-12)

- 初始版本。
