# Motion Preset Catalog

> **版本**: v1.28.0
> **职责**: 登记 SnowUI 已转正的组件族动效 preset，作为“新组件用哪个动效值”的查询入口。

组件默认动效值不得散落在组件内部。新增或修改组件时，先按语义查本目录：

| preset | 适用 | 不适用 | 来源 |
| :--- | :--- | :--- | :--- |
| `GENERIC_APPEAR_MOTION` / `GENERIC_DISAPPEAR_MOTION` | Frame fallback、普通内容进入 / 退出 | 语义明确的 overlay、Tooltip、Dialog | SnowUI generic default |
| `GENERIC_SCALE_APPEAR_MOTION` | 普通组件显式 opt-in 保留 generic opacity + scale 进入 | Frame 默认 fallback、语义明确的 overlay / Tooltip / Dialog | SnowUI 旧 generic appear 组合的兼容显式 preset |
| `DROPDOWN_OVERLAY_APPEAR_MOTION` / `DROPDOWN_OVERLAY_DISAPPEAR_MOTION` | Popover、Listbox、Menu dropdown，仅 opacity | Tooltip、Dialog、普通内容替换 | SnowUI dropdown overlay |
| `TOOLTIP_APPEAR_MOTION` / `getTooltipAppearMotion()` / `TOOLTIP_DISAPPEAR_MOTION` | Tooltip Foreground 的 opacity + scale 与按最终 placement 定向滑入；不得用于 Portal、size shell 或 Backdrop | Dropdown、Dialog、承载 backdrop-filter 的祖先 | transitions.dev Tooltip + SnowUI backdrop-filter 合成约束 |
| `TOOLTIP_CONTINUOUS_*_DURATION_*` / `TOOLTIP_CONTINUOUS_*_CONTENT_LAG` | 普通连续 Tooltip 使用 `180–360ms` 正弦协调时间线；默认快速重定向使用 `90–160ms` cubic ease-out 与 `0.02` 内容滞后，关闭 `rapidRetarget` 后中断继续使用普通时间线 | Tooltip 首次出现、远距离直接定位、reduced-motion | 参考视频协调交接 + 高频 hover 与复杂 Snippet 验证 |
| `MODAL_DIALOG_APPEAR_MOTION` / `MODAL_DIALOG_DISAPPEAR_MOTION` | Modal 内容面板；Dialog 打开即时显示，仅关闭使用消失 preset | Tooltip、Dropdown | transitions.dev Modal open / close |
| `DIALOG_BACKDROP_APPEAR_MOTION` / `DIALOG_BACKDROP_DISAPPEAR_MOTION` | 共享遮罩 opacity；Dialog 打开即时显示，仅关闭渐出 | 内容面板 scale | SnowUI 遮罩行为 |
| `REPLACEMENT_APPEAR_MOTION` | Icon / Text / CodeBlock 等内容替换 | Overlay、Dialog | SnowUI replacement default |
| `RESIZE_MOTION` | Accordion、Card、Panel 及后续组件的宽高、padding 等尺寸变化 | 生命周期进入、内容替换 | transitions.dev Card resize |
| `TAB_INDICATOR_MOTION` | Tab、Segmented 共享 indicator 的位置与尺寸变化 | 普通容器 resize、生命周期进入 | transitions.dev Tabs sliding |
| `CONTINUOUS_HOVER_MOTION` | Sidebar、Listbox、Popover、TableBody、Accordion、Tab / Segmented 的共享 hover 背景移动 | 单项独立 hover、生命周期进入 | Fluid Functionalism proximity hover |
| `HOVER_SCALE_UP_MOTION` | hover 轻微放大 | 生命周期出现、Modal | transitions.dev Avatar group hover-in |
| `BUTTON_HOVER_SCALE_UP_MOTION` / `getButtonBackgroundScale(size)` | 独立动作 Button 背景使用 `200ms ease`；标准高度 `H=24/36/48`，系数 `k=24/H`，hover 终点 `1+0.06k` 为 sm `1.06`、md `1.04`、lg `1.03`；Borderless 隐藏起点 `1-0.16k` 为 `0.84/0.893333…/0.92`；点击中点 `1+0.03k` 为 `1.03/1.02/1.015`，两段各 100ms。内容默认整体跟随，可独立关闭；颜色、命中区与布局不变；按 size 校准，不测量自定义高度，横向总外扩由 `getButtonBackgroundWidthFactor` 限制为 `MOTION_BUTTON_HOVER_MAX_WIDTH_GROWTH_REM=0.25rem`；横向系数 q=min(1, 0.25rem / (实际宽度 × (hoverTo-1)))，hover、Borderless 起点与点击相对 1 的差值均乘 q，纵向不变 | bare、默认关闭的复合控件项、非 Button hover、生命周期出现 | 保留 2026-08-27 恢复的默认 / sm 基线；2026-09-04 用户要求直接实现 md / lg 感知幅度补偿，等待视觉验收 |
| `HOVER_LIFT_MOTION` | hover 上浮并轻微放大 | 普通内容进入 | transitions.dev Avatar group hover |
| `NUMBER_POP_APPEAR_MOTION` | 数字或短计数值弹入 | 长文本、页面切换 | transitions.dev Number pop-in |
| `TEXT_SWAP_APPEAR_MOTION` | 短文字状态替换 | 长段落、Overlay | transitions.dev Text states swap |
| `ICON_SWAP_APPEAR_MOTION` | Icon 状态替换 | Dialog、普通 hover | transitions.dev Icon swap |
| `PANEL_REVEAL_APPEAR_MOTION` / `PANEL_REVEAL_DISAPPEAR_MOTION` | 抽屉、大面板从下方浮现 / 退出 | Dropdown、Tooltip | transitions.dev Panel reveal |
| `SIDE_PANEL_APPEAR_MOTION` / `SIDE_PANEL_DISAPPEAR_MOTION` | 右侧 SidePanel / 抽屉的浮层与内嵌进退场：复用 Frame 默认高阻尼 move spring，仅 x 从右滑入/滑出；页面兄弟宽度变化由 `createSidePanelLayoutMotionStyle()` 解析同一 timing | Dialog 居中放大、Dropdown | Rare UI Sidebar / SidePanel 浮层 |
| `PAGE_SLIDE_FROM_LEFT_MOTION` / `PAGE_SLIDE_FROM_RIGHT_MOTION` | 页面或同级视图轻微滑入 | 小组件内容替换 | transitions.dev Page side-by-side |
| `TEXT_REVEAL_APPEAR_MOTION` | 标题、Hero 文案或文字组浮现 | 单个 Icon、Tooltip | transitions.dev Texts reveal |

## 规则

1. 命中已有 preset 时，组件只能引用 preset，不复制 duration / easing / scale / delay。
2. 第二个组件复用同一语义值时，必须抽到 preset。
3. 组件文档应引用 preset 名称；如写具体数字，必须注明以本 catalog 为准。
4. 触发延迟不是 MotionConfig，归共享 lib 管理。
5. 自然语言出现“放大”时必须结合触发语义选择：Button 默认 hover 用 `BUTTON_HOVER_SCALE_UP_MOTION` 缩放背景与默认跟随的整体内容，其他 hover 放大用 `HOVER_SCALE_UP_MOTION`；生命周期从小到大进入用对应 appear preset；Modal / Dropdown 不得改用 hover preset。
6. 自然语言出现“尺寸变化 / 展开 / 收起 / 高度变化 / 宽度变化”时，优先使用 `RESIZE_MOTION`；只有语义明确不同且已存在专项 preset 时例外。
7. Tab / Segmented indicator 同时移动和变形时必须使用 `TAB_INDICATOR_MOTION`，不得使用普通 `RESIZE_MOTION` 或分别维护 transform / size 时序。
8. `GENERIC_APPEAR_MOTION` 默认只包含 opacity；需要生命周期缩放时必须显式声明 scale 或选择含 scale 的组件族 preset。
9. 显式 `while*` 对象是完整视觉通道声明，不会自动混入 preset 中未声明于对象的视觉通道；默认时序仍可继承。
10. SnowUI 组件源码拥有明确默认视觉时必须显式引用 preset，不得写 `whileXxx={true}` 绑定可变的 Frame 默认值；旧 generic opacity + scale 视觉统一迁移到 `GENERIC_SCALE_APPEAR_MOTION`。

## 变更记录

- v1.28.0 (2026-09-04): 新增 Button 标准高度反比补偿解析器；同步缩短 md / lg 的 hover、Borderless 隐藏起点与点击行程，保留默认 / sm 及原有时序。

- v1.27.0 (2026-08-27): 恢复 Owner 已确认的 Button 背景层 `1 → 1.06` 与 Borderless `0.84 → 1.06` 比例放大方案；背景使用 `200ms ease`，内容与布局不缩放。

- v1.26.0 (2026-08-21): 恢复默认开启、可通过 `rapidRetarget` 关闭的 Tooltip 快速重定向 preset；中断段使用 `90–160ms` cubic ease-out 与 `0.02` 内容滞后，宽度回弹时间线保持独立。
- v1.25.0 (2026-08-21): 删除 Tooltip 快速重定向的专属时长、cubic ease-out、内容滞后和 preset 导出；运动中改目标仍从当前画面接管，但与普通连续切换使用同一正弦时间线。
- v1.24.0 (2026-08-21): Tooltip Foreground 以 `110ms` 从 `0.94` 放大到 `1`，并通过 `getTooltipAppearMotion()` 按最终 placement 从触发器方向反向滑入 `2px`。
- v1.23.0 (2026-08-21): Tooltip 连续裁切揭示调整为最初版本约 `0.75` 倍速度；稳定段为 `180–360ms`，retarget 为 `90–160ms`，内容相位关系不变。
- v1.22.0 (2026-08-21): Tooltip 稳定 / retarget 时间线上限分别收敛为 `140–280ms` 与 `70–120ms`，改善 Sidebar 短距离逐项切换响应；内容滞后同步收窄。
- v1.21.0 (2026-08-21): Tooltip 进行中的连续切换新增 `90–160ms` cubic ease-out 快速重定向 preset，内容相位滞后收窄为 `0.04`。
- v1.20.0 (2026-08-21): Tooltip 连续切换改为有界协调时间线，取消外框 / 内容独立像素速度；加入平滑加减速、轻微内容相位滞后和同帧收敛。
- v1.19.0 (2026-08-20): Tooltip 内容带移动改用 cubic ease-out 缓出；保留用户当前调定的 `0.4px/ms` 内容时长速度与 `0.5px/ms` 外框线性速度。
- v1.18.0 (2026-08-20): Tooltip 连续移动拆分外框与内容带速度；外框保留 `0.5px/ms`，内容带改为较慢的 `0.3px/ms`。
- v1.17.0 (2026-08-20): Tooltip 连续切换改用统一 `0.5px/ms` 线性速度；外框与内容带同时开始，各自按移动距离计算时长。
- v1.16.0 (2026-08-19): Button hover 颜色与背景外扩统一为 `150ms ease-in-out`，进入与退出使用同一时间线。
- v1.15.0 (2026-08-19): Button hover 几何改为 `150ms ease-in-out`，缩短亚像素边缘重绘窗口并缓和进入 / 退出首段；颜色继续使用更慢的 `300ms ease-in-out`。
- v1.14.0 (2026-08-19): Button hover 颜色层使用 `300ms ease-in-out` opacity 渐现 / 渐隐，慢于 `200ms ease` 背景外扩。
- v1.13.0 (2026-08-19): Button hover 从按尺寸比例 scale 改为固定像素背景扩张；三档及不同内容宽度的背景总宽、总高统一增加 `2px`。
- v1.12.0 (2026-08-19): lg Button hover 背景层终点由 `1.01` 调整为 `1.015`；颜色立即切换由 Button 组件视觉层拥有。
- v1.11.0 (2026-08-19): Button hover 背景层终点比例改为按最终尺寸解析：sm `1.05`、md `1.03`、lg `1.01`；原单数 preset 保留为默认 / sm 兼容入口。
- v1.10.2 (2026-08-19): Button hover 背景层终点比例由 `1.06` 调整为 `1.05`。
- v1.10.1 (2026-08-19): Button hover preset 的消费对象从组件根收敛为独立背景层，文字与 Icon 不参与缩放。
- v1.10.0 (2026-08-19): 新增 Button 专属 `1.06` hover scale preset，保留通用 hover preset 的既有 `1.05` 消费语义。
- v1.9.0 (2026-08-12): Tooltip preset 恢复 opacity + scale，但消费目标限定为独立 Foreground；Portal / Backdrop 保持稳定。
- v1.8.0 (2026-08-12): Test Footer 复测后移除 Tooltip 出现 preset 的 scale；毛玻璃 Portal 出现态不执行 opacity 或 transform。
- v1.7.0 (2026-08-12): Tooltip 出现 preset 移除 Portal opacity 与 delay，仅保留 scale，确保毛玻璃和 Tooltip 同一首帧可见；退出 preset 不变。
- v1.6.0 (2026-07-01): Popover、Listbox、Menu dropdown 统一移除 scale，共用 opacity-only dropdown overlay preset。
- v1.5.0 (2026-06-30): 新增显式 opt-in 的 `GENERIC_SCALE_APPEAR_MOTION`，供组件迁移旧 generic opacity + scale 视觉；组件源码禁止继续依赖 boolean 默认视觉。
- v1.4.0 (2026-06-30): generic appear 改为仅 opacity，并登记显式 while* 对象的完整通道语义。
- v1.3.0 (2026-06-21): 新增 `TAB_INDICATOR_MOTION`，统一 Tabs sliding 的位置与尺寸时序。
- v1.2.0 (2026-06-18): 尺寸变化统一使用 `RESIZE_MOTION`，删除旧 Card 限定导出。
- v1.1.0 (2026-06-18): 新增 transitions.dev 通用效果 preset 与自然语言选择规则。
- v1.0.0 (2026-06-18): 新增 generic、overlay、tooltip、dialog、replacement preset catalog。
