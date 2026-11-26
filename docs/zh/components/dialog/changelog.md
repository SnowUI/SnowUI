# Dialog 更新日志

### v1.3.0 (2026-11-23)

- 固定头部滚动：有标题或关闭按钮时，标题、标题分割线与关闭按钮固定，仅正文视口滚动；滚动条改用共享 overlay scrollbar，纵向限定在 Panel 上下 padding 之内，视口外扩 4px 补偿内边距避免裁切内部输入控件（Textarea / Input / Button）的聚焦外环。全部尺寸与三种激活模式一致。

### v1.2.0 (2026-11-23)

- 新增单弹窗保证：任一 Dialog 打开时自动关闭页面上其它已打开的 Dialog（面板模式触发 `onOpenChange(false)`，内嵌／模版模式 `hideDialog`）；文档明确多步骤流程在同一 Dialog 内切换内容，X／Escape 关闭整个弹窗。

### v1.1.1 (2026-10-23)

- Footer操作间距在小字号／gap-scale下保留4 CSS px下限；较大首选值及调用方显式inline布局继续生效。面板／正文间距、原换排规则、直系item尺寸Context、角色与关闭流程不变。

- 2026-09-21：统一使用文档、源码属性表与 Site / AI 阅读入口；仅文档修订，不改变组件行为。

- closeOnOutside 默认改为 true；需要阻止遮罩关闭的消费方应显式传 false，三种激活模式一致。

- v1.1.0: 内置标题、关闭按钮、可选分割线与操作区；按 Workshop 更新三档 padding、圆角与间距；footer 的 Button as="item" 通过 Context 接收尺寸默认值。

- v1.0.0: 新增 Dialog 组件,实现 Panel / Inline / Template 三模式、焦点陷阱、滚动锁定和 backdrop 变体。
