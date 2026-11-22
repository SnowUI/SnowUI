# Tag 更新日志归档

### v1.2.2 (2026-08-30)

- 修复 closable Tag 非 hover 时隐藏 X 被共享 `flex` shorthand 恢复为 12px 占位，造成右侧多余空间的问题。

### v1.2.1 (2026-08-16)

- 恢复 Tag 根与 closable 状态的完整 transition 通道，并显式保留 hover overlay 过渡。

### v1.2.0 (2026-05-22)

#### 修复
- **TAG-Shape.3** `shape="left-arrow" / "right-arrow"` 改为内部 SVG 背景 path，根据当前 Tag 宽高动态生成完整圆角箭头轮廓；所有外角均圆角化，避免原 body + 伪元素拼接方案在主体侧留下直角。

### v1.1.2 (2026-05-21)

#### 修复
- **TAG-Close.3** 内置 X 通过 `ComponentIcon name="close"` 使用 Components 随包 plain X 默认图标，并可由 IconProvider 统一替换；默认形状仍来源于 `close-regular.svg` 与 Workshop 12×12。
- **TAG-Close.4** 激活态内置 X 颜色源改为 `--secondary-indigo`：未 hover X 时 40%，hover X 时 100%，避免激活 Tag 内的 X hover 成黑色。

### v1.1.1 (2026-05-21)

#### 修复
- **TAG-Close.2** 内置 X 改为复用 `.snowui-clear-icon-btn` 共享基类与 `<XCircle weight="fill" />`，补齐 hover X 自身时 `opacity: 0.4 → 1` 的反馈。

### v1.1.0 (2026-05-21)

#### 新增
- **TAG-Toggle.1** 新增 `toggle` prop，与 Button 同款语法糖：默认注入 `Click={{ Idle: "Active", Active: "Idle" }}` 与 `whileClick=false`，点击在常态 / 激活态之间切换。

#### 修复
- **TAG-State.1** 默认 `variant="default"` 不再把 Frame 受控锁定到 `Idle`，显式 `Click` 状态机可正常驱动 `data-state="Active"`。

### v1.0.0 (2026-05-21)

#### 新增
- **TAG-Init.1** 创建 Tag 组件，支持 `default` / `active` 两种视觉变体。
- **TAG-Layout.1** 内联外壳布局（与 Button 一致），不内置 leading Icon。
- **TAG-Close.1** 内置 `closable` 关闭 X：hover Tag 时显形，颜色 currentColor、默认 opacity 0.4，hover X 自身时 1；点击触发 `onClose` 并 `stopPropagation`。
- **TAG-Shape.1** 支持 `shape="left-arrow" / "right-arrow"` 路径片段形态（CSS clip-path）。
- **TAG-Shape.2** 箭头 path 按 Workshop `node-id=11887-37739` 补齐圆角轮廓；继续使用纯 CSS 伪元素 + `clip-path: path()`，避免 SVG 与主体产生间距或叠加。
- **TAG-A11y.1** 与 Button 一致自动输出 `aria-pressed`（基于 currentState，由 frame-dom-runtime 注入）；外部 `aria-pressed` / `aria-selected` 优先。
- **TAG-Color.1** 激活态背景 `--secondary-indigo` 10% + 文字 `--secondary-indigo`，与 Button `.snowui-button-active` 完全一致。
