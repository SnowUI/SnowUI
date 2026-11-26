# Slider 更新日志

### v1.4.4 (2026-10-23)

- 水平solid／soft标题与数值分配独立单行预算并保留4 CSS px下限，长标题提供全文访问；逐像素分界继续对齐完整Slider画布与RTL。全部内置Text统一parts.Text，默认数值改为响应式文本渲染，显式label及普通／纵向轨道注释协议保持。

### v1.4.3 (2026-10-20)

- solid／soft 的缺省条形标题随 LocaleProvider 切换；显式 title（含空字符串）、ariaLabel、数值及显式 label 保持原样。标题不替代可访问名称。

- 2026-09-21：统一使用文档、源码属性表与 Site / AI 阅读入口；仅文档修订，不改变组件行为。

### v1.4.2 (2026-09-12)

- 水平 `solid` / `soft` 区间默认 label 合并为一个百分比范围，避免右侧重叠；显式 label 内容仍由调用方控制。
- 区间两端竖线向填充内部偏移，窄区间限制偏移为区间的一半，并始终保留与单值相同的轨道边缘留白，包括 `0%–0%` 和 `100%–100%`；单值模式保持原定位。

### v1.4.1 (2026-08-06)

- `solid` / `soft` 分段点不再渲染 0% 和 100% 两个端点；内部圆点固定使用 `Black/10%`，hover 与填充覆盖时均不变色。

### v1.4.0 (2026-08-06)

- `filled` 重命名为更准确的 `solid`，并新增共享相同条形几何的 `soft` 变体。
- `soft` 默认使用 `Black/10%` 填充；title、数值 label 与指示器使用 `Black/100%` 基色，以适配亮色和暗色主题。
- 条形圆角覆盖入口由 `--snowui-slider-filled-radius-override` 重命名为 `--snowui-slider-bar-radius-override`。

### v1.3.0 (2026-08-06)

- `filled` title 与数值 label 改为实时逐像素分色：黑色填充覆盖区域为白色，未覆盖区域为黑色，文字分界与填充右缘共用实时百分比并随拖动连续移动。

### v1.2.4 (2026-08-06)

- `filled` 数值 label 常态透明度由 20% 提升到 40%，hover、focus 与拖动时由 40% 提升到 80%，修复 100% 填充时白色 label 不清晰的问题。

### v1.2.3 (2026-08-06)

- `filled` 指示器高度由 12px 调整为 8px，保持 2px 宽、全圆角、中心点双轴缩放以及 generic Frame preset 的时长与 easing。

### v1.2.2 (2026-08-06)

- `filled` 指示器调整为 2px × 12px 全圆角胶囊；在黑色填充内固定使用 `Static White/100%`。
- 指示器以图形中心点为基准，从 50% 宽度和高度渐显至完整尺寸；消失时反向缩短、变细并渐隐。

### v1.2.1 (2026-08-06)

- `filled` 新增内置可配置 `title`（默认 `"Text"`），并将右侧百分比统一到既有 `showLabel` / `parts.Text` / 显式 label 协议。
- `filled` 的 `thickness` 默认值为 32px，并可使用与其他变体相同的 prop 或 CSS override 定制整体高度。
- 填充右缘保留 8px 圆角；指示器固定在填充右缘内侧 4px，0 值时固定在 Slider 左边框内侧 4px。

### v1.2.0 (2026-08-06)

- 新增 `filled` 水平视觉变体：32px 高、8px 圆角、完整高度填充、左侧 label 与右侧实时百分比。
- hover、focus 与拖动时在填充边缘显示指示器；出现 / 消失复用 generic Frame preset 的 opacity、scale、duration 与 easing，并支持 reduced motion。
- `filled + showSteps` 新增 2px 圆点分段样式。

### v1.1.1 (2026-08-06)

- thumb 默认背景更新为 `Static White/80%`（`--static-white-80`）；新增 `0.5px` 白色 Inside Stroke（inset shadow）与 `blur(2px)` 背景模糊。
- 原有 drop shadow 保持不变。

### v1.1.0 (2026-07-04)

- label 升级为默认内置模式；默认关闭，通过 `showLabel` 开启。
- 单值自动生成一个 Text，Range 自动生成两个 Text；通过 `parts.Text` 配置内置实例。
- 保留显式 `<Text as="label">` 作为自定义内容入口，默认字号维持 12px。

### v1.0.3 (2026-06-02)

- steps mask 收敛到固定尺寸 track，修复切割线随拖动块移动以及 fill 被错误裁切的问题。

### v1.0.2 (2026-06-02)

- 空 `as="label"` 自动注入对应拖动块的实时值；label 默认排版调整为 12px / 16px。

### v1.0.1 (2026-06-02)

- 按更新后的 Figma 节点 `12550:576` 将拖动块调整为 `20px × 14px`、全圆角白底与 `0 1px 2px rgba(0, 0, 0, 0.4)` 阴影。

### v1.0.0 (2026-06-01)

- 新增单值、Range、水平、纵向、steps、自由 label、语意色、表单与键盘支持。
