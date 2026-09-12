# 内置图标图形比例核对（2026-09-11）

## 范围与方法

扫描 Components 与 PRO 的 src 中 Svelte、TypeScript、CSS：核对 ComponentIcon 随包集合，以及直接 SVG、SVG data URL 和动态 SVG 创建入口；不包括调用方显式传入内容及测试示例自绘图形。

31 个功能图标、34 个 weight 变体逐一对照 raw-assets。浏览器测量 viewBox、图形包围盒相对外框的位置、宽度及高度；viewBox 必须完全一致，包围盒误差在 16px 名义尺寸下不得超过 0.1px（允许 SVG 优化的曲线舍入）。生成器另外校验随包 path 内容与 assets 一致，仅允许黑色归一化为 currentColor。包围盒检查不等同于逐像素光栅比较。

## 发现与修复

Indicator corner 原先单独绘制中心线，在 32×32 外框中使用 2 单位描边；默认着墨范围为 16×16，和 RoundedCorner 原图一致。但 hover / focus / dragging 将描边增至 4，着墨范围变为 18×18，宽高占比从 50% 变为 56.25%。

现通过 ComponentIcon 复用 rounded-corner 的资源路径，并加入随包 fallback。删除私有 SVG 和描边加粗规则，各状态维持原图的 8,8,16,16 包围盒；继续保留颜色反馈、宿主显隐、拖拽与键盘调整。没有修改 raw-assets 原文件。

其余 33 个既有功能图标变体未发现比例漂移，无需重绘。

## 非功能图标 SVG 的逐项归类

以下按 ComponentGuidelines §2.7 的职责例外保留，不计入“功能图标比例一致”的结论：

| 实现 | 用途与处理 |
| --- | --- |
| Checkbox | checked / indeterminate 控件状态路径；不替换为包含完整方框的 CheckboxTrue / CheckboxMultiple 资源 |
| Chip | 装饰圆点，不是独立功能操作 |
| Spinner、Progress | 旋转 / 进度绘图，几何由状态或进度决定 |
| SnowUILogo、StyleButtonLogo | 品牌图形，保留品牌构图与动效 |
| Avatar | 颜色滤镜定义，无可见图标路径 |
| Gradient | 模糊装饰图形 |
| Tag | 标签箭头外壳；关闭图标已在功能图标集合中核对 |
| BarChart、LineChart、CircularChart、GaugeChart、ChartGroup | 数据图形、遮罩或滤镜，不作为资源图标替换 |

## 逐资源结果

| 语义名 | Weight | 原始来源（工作区相对路径） | 比例 |
| --- | --- | --- | --- |
| `arrow-line-down` | `regular` | `resource-base/raw-assets/icons/snowui/ArrowLineDown.svg` | 一致 |
| `arrow-line-left` | `regular` | `resource-base/raw-assets/icons/snowui/ArrowLineLeft.svg` | 一致 |
| `arrow-line-right` | `regular` | `resource-base/raw-assets/icons/snowui/ArrowLineRight.svg` | 一致 |
| `arrow-line-up` | `regular` | `resource-base/raw-assets/icons/snowui/ArrowLineUp.svg` | 一致 |
| `arrow-line-up-down` | `regular` | `resource-base/raw-assets/icons/snowui/ArrowLineUpDown.svg` | 一致 |
| `arrow-square-out` | `regular` | `resource-base/raw-assets/icons/phosphor/ArrowSquareOut.svg` | 一致 |
| `arrow-up-right` | `regular` | `resource-base/raw-assets/icons/phosphor/ArrowUpRight.svg` | 一致 |
| `arrows-down` | `regular` | `resource-base/raw-assets/icons/snowui/ArrowsDown.svg` | 一致 |
| `arrows-down-up` | `regular` | `resource-base/raw-assets/icons/snowui/ArrowsDownUp.svg` | 一致 |
| `arrows-in-simple` | `regular` | `resource-base/raw-assets/icons/phosphor/ArrowsInSimple.svg` | 一致 |
| `arrows-out-simple` | `regular` | `resource-base/raw-assets/icons/phosphor/ArrowsOutSimple.svg` | 一致 |
| `arrows-up` | `regular` | `resource-base/raw-assets/icons/snowui/ArrowsUp.svg` | 一致 |
| `calendar-blank` | `regular` | `resource-base/raw-assets/icons/phosphor/CalendarBlank.svg` | 一致 |
| `check` | `regular` | `resource-base/raw-assets/icons/phosphor/Check.svg` | 一致 |
| `check-circle` | `regular` | `resource-base/raw-assets/icons/phosphor/CheckCircle.svg` | 一致 |
| `check-circle` | `fill` | `resource-base/raw-assets/icons/phosphor/CheckCircle-fill.svg` | 一致 |
| `clock` | `regular` | `resource-base/raw-assets/icons/phosphor/Clock.svg` | 一致 |
| `close` | `regular` | `resource-base/raw-assets/icons/snowui/Close.svg` | 一致 |
| `copy` | `regular` | `resource-base/raw-assets/icons/snowui/Copy.svg` | 一致 |
| `funnel-simple` | `regular` | `resource-base/raw-assets/icons/phosphor/FunnelSimple.svg` | 一致 |
| `minus` | `regular` | `resource-base/raw-assets/icons/phosphor/Minus.svg` | 一致 |
| `moon` | `regular` | `resource-base/raw-assets/icons/phosphor/Moon.svg` | 一致 |
| `plus` | `regular` | `resource-base/raw-assets/icons/phosphor/Plus.svg` | 一致 |
| `rightbar` | `regular` | `resource-base/raw-assets/icons/snowui/Rightbar.svg` | 一致 |
| `rounded-corner` | `regular` | `resource-base/raw-assets/icons/snowui/RoundedCorner.svg` | 一致 |
| `search` | `regular` | `resource-base/raw-assets/icons/snowui/Search.svg` | 一致 |
| `sun` | `regular` | `resource-base/raw-assets/icons/phosphor/Sun.svg` | 一致 |
| `three-dots` | `regular` | `resource-base/raw-assets/icons/snowui/ThreeDots.svg` | 一致 |
| `trash` | `regular` | `resource-base/raw-assets/icons/phosphor/Trash.svg` | 一致 |
| `user` | `regular` | `resource-base/raw-assets/icons/phosphor/User.svg` | 一致 |
| `warning` | `regular` | `resource-base/raw-assets/icons/phosphor/Warning.svg` | 一致 |
| `warning` | `fill` | `resource-base/raw-assets/icons/phosphor/Warning-fill.svg` | 一致 |
| `x-circle` | `regular` | `resource-base/raw-assets/icons/snowui/XCircle.svg` | 一致 |
| `x-circle` | `fill` | `resource-base/raw-assets/icons/snowui/XCircle-fill.svg` | 一致 |

## 验证

- builtin-icon-geometry：全部资源比例，以及真实 Preview 中 Indicator 的 hover、focus、键盘调整；分别覆盖包内 fallback 和资源 Provider。
- builtin-icon-unification：尺寸上下文、rem 缩放，以及 Input、Tag、MenuItem、SearchBox、Toast、CodeBlock、Accordion、Dialog 的图标消费行为。
- 上述浏览器用例共 9 项通过。
