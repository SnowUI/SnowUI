# dialog.ts 文档

> **版本**: v1.0.0
> **职责**: 提供 Dialog / Modal 内容面板与遮罩 preset。

`MODAL_DIALOG_*` 提供模态面板出现与消失 preset，`DIALOG_BACKDROP_*` 提供遮罩 opacity preset。Dialog 为保证面板毛玻璃首帧可见，打开时不使用出现 preset；关闭时仍使用消失 preset。

## 来源

内容面板参考 `transitions.dev-main` Modal open / close。该参考未提供独立遮罩 preset；SnowUI 当前遮罩具有独立 opacity 规则，因此遮罩单独建 preset。

## 使用规则

1. Dialog 内容面板只在关闭时引用 modal dialog 消失 preset；打开时立即显示。
2. Dialog 遮罩通过 `DIALOG_BACKDROP_MOTION_STYLE` 注入 CSS 变量。
3. 如果未来参考实现中遮罩与内容数值完全一致，可合并；不一致则继续拆分。

## 变更记录

- v1.0.0 (2026-06-18): 新增 Dialog 内容与 backdrop preset。
