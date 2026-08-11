# CopyButton

> **版本**: v1.0.1
> **职责**: 以真实 Button 为宿主的剪贴板复制与瞬时反馈按钮。

## 使用

```svelte
<CopyButton text="SnowUI" variant="outline" />
```

平铺 Button 兼容 Props。`text` 提供静态内容，`getText` 提供同步或异步动态内容；复制成功触发 `onCopy`，失败触发 `onCopyError`。从复制开始到成功反馈结束的整个非 idle 阶段禁止重复触发；此时不设置 disabled，不改变按钮视觉，只关闭 Button 点击反馈并忽略后续点击。成功反馈在 `feedbackDuration` 后复位。不提供 parts。

`showText={false}` 启用无文字模式，只显示 Copy / Check 图标，并自动提供复制状态的 `aria-label`。图标变化复用 CodeBlock 的 Frame `stateContent` 协议：内部 Icon Frame 在 Idle 渲染 Copy、Active 渲染 Check；Button 本身不进入 Active/toggle 视觉。带文字模式下文字始终保持“复制”，只有图标执行内容替换动效。

> 此区域的内容受保护。AI 在修改此区域前必须请求用户审查。

---

> **以下内容供 AI 阅读，用于维护代码与文档的关联**

## 开发者指南 (AI)

| 关键字 | 说明 |
| --- | --- |
| text / getText | 静态或动态复制内容 |
| feedbackDuration | 成功反馈复位时间 |
| showText | `false` 时仅显示状态图标 |

- 主布局模型：宿主组件特化。
- 宿主：Button。
- Clipboard 能力复用 `../lib/clipboard.ts`。
- 默认 Copy/Check 为 resource-svelte 功能图标基础设施。
- Copy/Check 变化使用 Button → Frame 的 `stateContent`，与 CodeBlock 复制按钮采用同一协议。
- pending / success 反馈期保持正常 Button 样式，但 `whileClick=false` 且业务点击被忽略，避免 Check 缩小和按钮闪动。

## 更新日志 (Changelog)

### v1.0.1 (2026-08-11)

- `showText=false` 时主动向 Button 声明 `iconOnly=true`，保持纯图标复制按钮的尺寸与命中区域。

### v1.0.0 (2026-07-03)

- 首次实现异步复制、成功/失败事件和反馈复位。
