# Chip 更新日志

### v1.2.0 (2026-10-22)
- 内部复用 Frame 单行预设，Dot／附件与文字保持至少4 CSS px间距；仅Tag内部继续原例外。颜色、图标替换和尺寸档位保持。

- 2026-09-21：统一使用文档、源码属性表与 Site / AI 阅读入口；仅文档修订，不改变组件行为。

- 2026-09-07（文档）：- 补齐 `children` 的公开说明，澄清 size Context 回退和 showDot 的解析与替换优先级；运行时行为不变。

### v1.1.0 (2026-06-21)

#### 变更
- **CH-Icon.2** `background` 变体默认不显示 Dot，新增 `showDot` 显式开关。
- **CH-Padding.1** `background` 变体中有 leading / trailing 图标的一侧 padding 按尺寸收紧：`sm` 为 4px，`lg` 为 8px。

### v1.0.0 (2026-05-09)

#### 新增
- **CH-Init.1** 创建 Chip 组件，支持 `default` / `background` 两种视觉变体与 `sm` / `lg` 两档尺寸。
- **CH-Layout.1** 三槽位（leading / content / trailing）自动布局，复用 Frame `row` + auto-layout.css 协议。
- **CH-Icon.1** 内置 Dot leading 图标，遵循 §2.7.1 自动检测外部 `data-as="leading"` 替换。
- **CH-Color.1** 默认颜色继承父容器（`currentColor`）；`background` 变体的背景 / 边框基于 `currentColor` + 透明度自动派生（`color-mix`）。
