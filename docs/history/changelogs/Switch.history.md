# Switch 更新日志归档

### v1.1.15 (2026-03-06)

#### 调整
- **TG-Bridge.4** Track 背景与 Thumb 位移过渡改为消费 Frame `control` 通用时序桥接变量，组件不再维护独立默认 duration / easing。

### v1.1.14 (2026-02-18)

#### 调整
- **TG-Adj.3** 与 Radio/Checkbox 统一动效时间与缓动曲线（`0.2s` + `cubic-bezier(0.4, 0, 0.2, 1)`），覆盖 Track/Thumb 过渡。

### v1.1.13 (2026-02-18)

#### 修复
- **TG-Fix.8** 修复 Switch hover 无效：状态选择器从 `:has(...)` 改为 `input:checked + .snowui-switch-track` 链路，提升兼容性与稳定性。

### v1.1.11 (2026-02-18)

#### 调整
- **TG-Adj.1** 默认颜色链路改为主色：未设置颜色类时激活态使用 `--primary`（行为对齐 Filled Button）。
- **TG-Adj.2** Thumb 圆形固定白色 token：`--static-white-100`。

### v1.1.10 (2026-02-18)

#### 修复
- **TG-Fix.7** 进一步修复 hover 闪动：移除 Track 颜色过渡，避免颜色链插值抖动。

### v1.1.9 (2026-02-18)

#### 修复
- **TG-Fix.5** 修复 hover 进出时的消失闪动：overlay 改为固定 gradient，通过变量切换透明度，避免 hover 时切换 `background-image`。
- **TG-Fix.6** 恢复激活态对比：选中轨道恢复主色实底，Thumb 恢复 `--white-100`。

### v1.1.8 (2026-02-18)

#### 修复
- **TG-Fix.4** 修复 hover 闪动：Track 改为常驻 0% overlay 基线，hover 仅切换 overlay 强度，避免 `none -> gradient` 切换闪烁。

### v1.1.7 (2026-02-18)

#### 调整
- **TG-Color.1** 组件颜色统一改为 `currentColor` 链路，支持 `class="text-*"` 覆盖整组件。
- **TG-Color.2** 原灰阶层改为同色透明度层（20%/40%），激活与未激活统一同色体系。

### v1.1.6 (2026-02-18)

#### 修复
- **TG-Fix.3** 修复大尺寸下 thumb 视觉贴边：`thumb-gap` 改为基于高度等比缩放（`gap = height * 0.125`，16 时为 2px）。

### v1.1.5 (2026-02-18)

#### 优化
- **TG-Opt.1** 尺寸梯度与 Icon 组件对齐：`16/20/24/28/32/40/48/80`。
- **TG-Opt.2** 尺寸链路改为 `--size-*` token，且以高度为基准推导宽度与 thumb 尺寸。
- **TG-Opt.3** 补齐 `override -> internal -> token` 变量桥接链。

### v1.1.4 (2026-02-18)

#### 修复
- **TG-Fix.2** 移除组件内 `cursor: pointer`，禁用态 cursor 统一由 Frame `Surface` + `.snowui-disabled` 通用链路控制。

### v1.1.3 (2026-02-03)

#### 修复
- **TG-Fix.1** 补齐 Frame 能力开关显式传参并对齐内部变量命名规范

---

---
