# Spinner 更新日志归档

### v1.2.0 (2026-02-23)

#### 改进
- **SP-Perf.1** circle 变体：`radial-gradient` mask → SVG data URI mask，消除小尺寸毛边
- **SP-Perf.2** SVG `<circle>` stroke 提供矢量级抗锯齿环形裁剪，内外边缘均由 SVG 引擎渲染
- **SP-Refactor.1** `sizeMap` 提升为模块级常量，英文注释全部改为中文

### v1.1.1 (2026-02-03)

#### 修复
- **SP-Fix.1** 补齐 Frame 共享行为类与能力开关显式传参，并对齐内部变量命名规范
