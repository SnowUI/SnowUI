# 共享 Backdrop

Dialog 与 ImageViewer 共用 `BackdropVariant` 和 `styles/backdrop.css`。公开组件通过 backdrop Prop 选择 opaque、blur 或 transparent；默认 opaque 保持 Dialog 的 10% 黑色遮罩。blur 使用同一底色与 size-5 模糊，transparent 不着色、不模糊。

仅共享视觉，不创建独立组件、不增加 Frame Props。Portal、z-index、尺寸、焦点、滚动锁定、关闭条件和出现/消失动效仍由消费者负责。CSS 只匹配 snowui-backdrop；组件隐藏不挂载遮罩，无监听器、Observer 或 JavaScript 运行开销。类型导入构建后擦除；共享样式随包内样式入口提供，不依赖 Site。

ImageViewer 保留 snowui-image-viewer-background-override 背景覆盖入口；覆盖色不改变 backdrop 的模糊状态。Dialog 原有视觉与动效不变。

来源：2026-09-15 用户授权判断通用化，并要求本次实现让 ImageViewer 复用 Dialog backdrop。
