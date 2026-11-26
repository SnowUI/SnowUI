# Spinner 更新日志

### v1.2.3 (2026-10-20)

- 加载状态默认名称随LocaleProvider更新，显式aria-label优先；不会替调用方翻译外部加载说明。

- 2026-09-21：统一使用文档、源码属性表与 Site / AI 阅读入口；仅文档修订，不改变组件行为。

- **Spinner-Docs.2026-05-25** 源码顶部历史更新日志已归档；后续新增变更统一写入本文档 更新日志，源码顶部只保留职责、当前关键架构与文档路径。

### v1.2.2 (2026-03-06)

#### 调整
- **SP-Bridge.3** 当外部传入 `loopMotion.preset` 时，Spinner 会在透传给根 `Frame` 前显式剔除该 preset，避免根节点与内部 spinner 产生双重旋转。

### v1.2.1 (2026-03-06)

#### 调整
- **SP-Bridge.1** 循环动画改为消费 Frame `loopMotion` 桥接变量（duration / easing / iteration / direction / playState）。
- **SP-Bridge.2** 默认速度仍由 `variant + speed` 共同推导：`circle = 1000ms / speed`，`spokes/pills = 800ms / speed`；若显式传入 `loopMotion.duration`，则以 `loopMotion` 为准。

### v1.2.0 (2026-02-23)

#### 改进
- **SP-Perf.1** circle 变体：`radial-gradient` mask → SVG data URI mask，消除小尺寸毛边
- **SP-Perf.2** SVG `<circle>` stroke 提供矢量级抗锯齿环形裁剪，内外边缘均由 SVG 引擎渲染
- **SP-Refactor.1** `sizeMap` 提升为模块级常量，英文注释全部改为中文

### v1.1.1 (2026-02-03)

#### 修复
- **SP-Fix.1** 补齐 Frame 共享行为类与能力开关显式传参，并对齐内部变量命名规范
