# SidePanel 更新日志

### v1.4.3 (2026-10-23)

- 内置标题与关闭操作的有效间距在根字号／gap缩放后保持至少4 CSS px，保留更大公开覆盖；工具栏结构、标题全文名称和面板交互不变。
- 显式名称／分类标题与Demo明细使用既有Frame单行、Text全文缩略；复杂姓名／邮箱保留两行信息结构。

### v1.4.2 (2026-10-20)

- 未传 title 时，工具栏标题与面板名称随 LocaleProvider 切换；显式 title（含空字符串）及业务内容保持原样。

- 2026-09-28：内置 Indicator 使用整边命中，移除透明颜色特化，统一常态与 hover 视觉。

- 2026-09-21：统一使用文档、源码属性表与 Site / AI 阅读入口；仅文档修订，不改变组件行为。

- **SP-Init.31 / v1.4.0 (2026-08-25)**：左侧边框全高保持可拖拽调宽，移除可见宽度调整短条；透明 Indicator 交互层继续承接 Pointer、键盘、ARIA 与滚动条避让。
- **SP-Init.30 / v1.3.2 (2026-08-09)**：适配 Button bare 默认 100%，内置 icon-only 工具操作显式使用 `emphasis="muted"` 保留原弱化视觉。

- **SP-Init.29 / v1.3.1 (2026-07-20)**：修复从浮层切换到内嵌预览时，Portal 分支切换可能导致 SidePanel 消失的问题；改为迁移稳定渲染宿主并保留内容子树。
- **SP-Init.28 / v1.3.0 (2026-07-13)**：将 SidePanel-Demo 的实现确立为默认内嵌布局协议；定义“浮动停靠 + 挤压指定内容”的语义、页面/组件职责、被挤压与被覆盖区域的选择方式、同步动效不变量、fixed rail 完整写法，以及高度与视口间距的单一事实来源。
- **SP-Init.27 (2026-07-13)**：内嵌边框由 inset box-shadow 改为真实 1px border，修复圆角边缘缺线；SidePanel-Demo 的协调式 rail 改为视口固定并保持上、右、下 16px，长页面不再拉大可视区域底部间距。
- **SP-Init.26 (2026-07-13)**：对照 RareUI 网站与开源源码，将协调式内嵌动效改为常驻 rail `transform` + 主内容 `padding-right` 同状态启动；新增 `inlineMotionOwner="layout"` 防止 SidePanel 重复位移。继续使用 SnowUI 临界阻尼，不恢复 RareUI 回弹。
- **SP-Init.25 (2026-07-13)**：内嵌模式接入与浮层相同的面板进退场 preset 和退出 presence；新增页面级 layout motion helper，SidePanel-Demo 首版以同步 grid rail 挤压 Table，并将页面 padding 从 40px 收到 16px，使表格获得更多宽度；SP-Init.26 改为 RareUI 同构的 padding + transform 协调方式。
- **SP-Init.24 (2026-07-13)**：接入组件 UI 文案多语言；默认使用 `zh-CN`，支持由上层 `LocaleProvider` 切换或覆盖固定工具栏文案。
- **SP-Init.23 (2026-07-13)**：上、下工具栏内置 icon-only Button 改由 SidePanel 内部嵌入 Tooltip，提示文案复用 `ariaLabel`。
- **SP-Init.22 (2026-07-13)**：修复背景模糊无可见效果：将 `.snowui-quick-action-panel` 从 transform 祖先下的内层 `aside` 移至实际承担位移的 motion shell；shell 复用 `Background/3 + blur(40px)`，内层透明化，仅承载内容、滚动与交互。
- **SP-Init.21 (2026-07-12)**：默认 move spring 进入无回弹对照方案：stiffness 300 / damping 34.6410161514（临界阻尼）/ mass 1 / duration 500ms。此前 Rare UI 同参数基线为 300 / 30 / 1 / 500ms，已保留记录，可准确恢复。
- **SP-Init.20 (2026-07-12)**：修复退场末段看似卡住：浮层右侧有 16px 间距，原 `x: 100%` 终点仍在视口内残留 16px；进退场距离统一改为 `calc(100% + var(--padding-4))`，确保面板完整离开视口后再卸载。
- **SP-Init.19 (2026-07-12)**：对照 Rare UI 网站与开源库，Frame 默认 `MOVE_*` 改为同参数高阻尼 spring（stiffness 300 / damping 30 / mass 1）；SidePanel 恢复正常 500ms 轨迹窗口，移除 5 倍调试时长。Frame CSS lifecycle 与 motion-engine 统一通过 spring 采样执行。
- **SP-Init.18 (2026-07-12)**：Frame 默认 `MOVE_*` 曾改为 `cubic-bezier(0.2, 0, 0, 1)` 并保持 5 倍观察时长；SP-Init.19 起由 Rare UI 同参数 spring 取代。明确共享面板视觉为 `Background/3 + blur(40px)`。
- **SP-Init.17 (2026-07-12)**：进退场改为外层 motion shell 整体位移，内层面板/工具栏/滚动条/Indicator 不再承接根 transform；`SIDE_PANEL_*` 复用 Frame 默认 move 时序并临时放大为 5 倍时长便于观察。
- **SP-Init.16 (2026-07-12)**：进退场 easing 改为 linear；`motion-engine` 修正百分比位移单位（`100%` 不再写成 `100%px`）。
- **SP-Init.16b (2026-07-12)**：撤销对 Frame 默认 generic 缓动/scale、以及 SidePanel `transform-origin` / `transition:none` 的改动；保留位移单位 bug 修复。
- **SP-Init.15 (2026-07-12)**：进退场去掉 opacity，仅保留横向位移；点击表格行切换预览时不关面板，避免退场+进场。
- **SP-Init.14 (2026-07-12)**：浮层动效改为从右滑入/滑出；默认点击面板外关闭；内容区独立滚动。
- **SP-Init.13 (2026-07-12)**：默认只读无下栏；`editable` 自动显示下栏；自定义下栏 props 也可唤出下栏；无下栏时仍保留底滚动遮罩。
- **SP-Init.12 (2026-07-12)**：上工具栏固定不可替换；下栏支持 Snippet 整组替换；默认取消 `borderless`、保存 `gray`；移除 `topActions`。
- **SP-Init.11 (2026-07-12)**：左边缘调宽距左缘 4px；命中带改由 Indicator line 全高协议统一提供。
- **SP-Init.10 (2026-07-12)**：内嵌模式默认内边框 0.5px Black/10%（`box-shadow: inset`）。
- **SP-Init.9 (2026-07-12)**：内嵌模式去掉阴影；高度支持 `--snowui-side-panel-height-override`。
- **SP-Init.8 (2026-07-12)**：上工具栏标题与关闭 X 拆分；标题只读、固定 Black/20%。
- **SP-Init.1 (2026-07-08)**：新增 `SidePanel`。
