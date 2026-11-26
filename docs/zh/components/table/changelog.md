# Table 更新日志

### v2.7.1 (2026-10-23)

- 双击列宽手柄自动适配时计入排序按钮的实际图文间距，保留图标预算、最小／最大列宽、可换行列的原宽恢复及其他列宽。

### v2.7.0 (2026-10-21)

- 复用统一响应式控制器计算操作视觉预算，缓存More与padding测量并保留极窄滚动。

- 2026-10-07：渐隐仅作用于内容；收列与恢复由独立内容层过渡位置和可见宽度。移除临时 fixed 布局与零宽末列插值，背景、分隔线及外缘保持完整，快速反向时从当前几何接管。

- 2026-10-07：收列增加固定宽度区间内的连续透明度过渡，与容器宽度同步，支持反向恢复和减少动态效果偏好。

- 2026-10-07：统一表格外缘最小 8px，相邻列内容间最小 8px（内部两侧各 4px），收列后重新分配外缘。

- 2026-10-07：固定／自动锁定的小数列宽与整数视口宽度使用一致的半像素容限，避免宽度足够时误将单元格和操作浮层 padding 压至最小值。

- 2026-10-07：响应式单元格每侧最小 padding 从 2px 调整为 4px，相邻列最小内容间距为 8px。

- 2026-10-07：v2.6.0，新增 horizontalScroll 和 auto 角色布局；统一角色收起、间距压缩、右到左隐藏与滚动兜底，恢复原始列宽并更新可见边缘。

- 2026-10-07：v2.5.3，行内与表头 Checkbox 统一按实际右边缘定位透明区，向右使用固定 `--size-5`（名义 20px）柔和过渡；跟随控件尺寸和响应式间距，不随列宽拉长。保留显式起止点覆盖。

- 2026-10-07：同步 TableCell v1.10.2 的跨列渐隐与可见视口定位说明，默认透明区贴合实际按钮左边缘，向左使用固定 20px Token 过渡；Table 公开 API 不变。

- 2026-09-21：统一使用文档、源码属性表与 Site / AI 阅读入口；仅文档修订，不改变组件行为。

- 2026-09-02：v2.5.2，连续 Hover 层由 Table 局部横向 viewport 承载并裁切，宽表隐藏列不再把行背景绘制到当前可见边界之外。
- 2026-09-01：v2.5.1，修复吸底横向滚动条与数据行重叠时无法操作的问题。根因是连续 Hover 将 table 提升至 `z-index: 1`，轨道仍处于默认层级；Table 现在固定让横向轨道处于内容层之上，并通过真实命中与拖动回归验证。
- 2026-09-01：v2.5.0，Table 内置局部横向 viewport 和视口贴底 overlay 轨道；未设置显式宽度时，整表最小宽度由各列 min-content 与 Cell padding 自动汇总，保留最长不可断单词 / 片段。
- 2026-09-01：v2.4.1，调整容器响应曲线，使窄表格在常见移动宽度即收敛到每侧 2px；原生相邻列的最小视觉间距固定为 4px。
- 2026-08-14：v2.4.0，Table viewport 建立 inline-size 容器；TableHead / TableCell 左右 padding 随表格自身宽度从默认 12px 流动到最小 2px，DataTable 组合自然继承。
- 2026-08-06：v2.3.0，新增密集表格语义快路径和表级单帧截断批处理；默认单元格不再初始化逐格 Frame 运行时与尺寸观察，关闭角色能力时跳过无效 overlay DOM / 样式，视觉与完整能力回退保持不变。
- 2026-08-06：v2.2.0，普通数据列的 TableHead 默认允许拖动改宽；固定列使用 `resizable={false}` 显式关闭，排序的数据规则保持现有边界。

- 2026-08-03：v2.1.2，17px selection Checkbox 的 1px 增量改为固定 `0.0625rem` 特例，禁止借用 `--border-2` 参与尺寸计算。
- 2026-08-03：v2.1.1，Table selection 内置 Checkbox 改为 Token 计算的 17px 组合特化，使奇数高度数据行内上下各留 16px；Checkbox 组件全局默认仍为 16px。

- 2026-08-03：TableRow 新增外部受控 `active` 激活态；持久 `--black-4` 背景可与连续 hover 层叠加，不与 selected / Checkbox 选中状态绑定。
- 2026-07-07：减少首屏工作量：普通单元格挂载不再额外排队逐格 rAF；overlay 角色块仅在 hover、focus、选中或强制预览时测量与监听位置，空闲行不触发布局读取。

- 2026-07-07：v2.1.0，明确 Table 只负责表格数据展示；加载更多、selection/actions 角色列、排序筛选、分页和搜索统一归 DataTable。

- 2026-07-05：v2.0.0，checkbox 选择列与按钮操作列移交 DataTable；普通 Table 删除选择和角色布局 Props。

- 2026-07-01：v1.14.0，数据行注册改为 microtask 批量提交，分页整批替换行时不再逐行触发选择状态重算。
- 2026-06-30：v1.13.0，增量加载首次开始前自动锁定当前自然列宽，避免新行更宽内容触发 `table-layout:auto` 重排并带动已有行横向晃动；显式 columnWidths / 拖动列宽保持优先。
- 2026-06-30：v1.12.0，DataTable 新增行 opacity 渐显从整行迁移到普通 TableCell，selection/actions overlay 不再被父级透明度二次压暗；selection 内容遮罩固定为约 16px → 60px，表头遮罩固定为约 14px → 26px，视觉取自表格一且不再随列宽变化。
- 2026-06-30：v1.11.1，修正 DataTable 自动加载阈值方向：默认越过表格底部后继续下滚 80px 才触发，不再提前 80px 加载。
- 2026-06-30：v1.11.0，DataTable 自动加载改由组件内部管理表尾哨兵、80px 底部阈值与 500ms 请求节流；页面无需声明滚动观察器。
- 2026-06-30：v1.10.6，补充页面滚动自动加载的 500ms 停留确认规则：向上滚出触发区取消，停留或继续下滚才加载。
- 2026-06-30：v1.10.5，适配 Frame `while*` 完整视觉通道语义；DataTable 行渐显不再需要 scale undefined 抵消字段。
- 2026-06-30：v1.10.4，DataTable 新增行改为纯 opacity 渐显，显式移除 Frame 通用 appear preset 带来的 scale 缩放。
- 2026-06-30：v1.10.3，DataTable 行展示间隔为 0 时不再创建零时长定时器，确保同批本地数据同轮提交；Demo 服务器模拟改为一次请求延迟后整批返回，避免服务器 yield 间隔干扰组件展示间隔。
- 2026-06-30：v1.10.2，修复新增行未进入 Frame `Appear` 状态导致 opacity 渐显不执行的问题；逐行提交恢复为 100ms 间隔，单行渐显保持 1000ms 并允许重叠。
- 2026-06-30：v1.10.1，将流式新增行 opacity 渐显延长至 1000ms，便于确认逐行渐显链路是否生效。
- 2026-06-30：v1.10.0，接入 DataTable 内部流式加载协议；TableRow 自动消费新行 250ms 渐显动效，页面不再手动维护新增行状态。
- 2026-06-30：v1.9.0，新增已有数据加载 Spinner 行；通过真实跨列单元格居中复用通用 Spinner，默认尺寸 16×16px，并新增 `loadingSpinnerSize` 尺寸入口。
- 2026-06-30：v1.8.0，新增首次加载 Skeleton rows 组合协议：TableHead 注册公开列结构，TableBody 按列生成语义化骨架行；DataTable 首次空数据加载可通过 Context 自动启用。
- 2026-06-30：v1.7.3，striped 数据行圆角改为始终保持；divided hover 背景仅进入时过渡、移出时立即清除，避免圆角恢复直角时仍有渐隐背景残留。
- 2026-06-30：v1.7.2，默认 divided 表头与静态数据行改为直角；数据行仅在 hover / `data-force-hover` 时形成 12px 外缘圆角，并完整隐藏 hover 表面上下相邻分割线。striped 奇数背景行圆角保持不变。
- 2026-06-29：v1.7.1，修复 actions 渐隐遮罩失效：依赖行级实测按钮宽度的 mask 生成从 Table 根移到相邻内容 TableCell 自身，避免根节点无法解析后代 CSS 变量；仍统一复用 `edge-fade`。
- 2026-06-27：v1.7.0，把 overlay「内容渐隐层」提炼为 基础共享能力 `edge-fade`（`createEdgeFadeMaskImage`）：Table 根用它生成 checkbox / 表头遮罩，actions 遮罩由相邻内容 TableCell 在可读取行级实测宽度的作用域生成；TableCell / TableHead 的 hover 规则统一通过 CSS 变量消费。三处渐隐参数（fade-start / fade-end / coverage / feather）保留为可配置覆盖变量；新增 `--snowui-table-actions-fade-feather-override`（默认 3）控制按钮列柔和尾巴长度。「悬浮操作层」定位仍属表格布局职责。

- 2026-06-27：v1.6.3，按实际落地参数更新文档：按钮列渐隐 coverage 默认 `0.9`、柔和尾巴终点 `× 3`（尾巴长度 = 透明区的两倍，过渡更缓）；并修正文档中过期的代码示例默认值（checkbox `15% → 60%`、表头 `50% → 100%`）。

- 2026-06-27：v1.6.2，按钮列渐隐整体宽度的 coverage 默认值由 `1` 调小为 `0.8`（遮罩宽度 = 实测按钮宽度 × 0.8，整条遮罩按比例收窄、柔和尾巴随之内移、不断层）。coverage 是「占按钮宽度的百分比」型通用值，越小越窄。

- 2026-06-27：v1.6.1，按钮列渐隐过渡改得更柔和（参考 checkbox 侧的长缓过渡）：柔和尾巴终点由透明区 × 1.2 改为 × 1.5（尾巴长度 = 透明区的一半，避免硬边）。完全透明区仍 = 实测按钮宽度（自适应、最小，保证按钮下方内容不透出）。

- 2026-06-27：v1.6.0，按钮列渐隐改为**按实测按钮宽度自适应**：JS 每行测量按钮组实际占用宽度（含右侧内边距）写入行级 `--snowui-table-role-overlay-content-width`，边缘渐隐据此自动收缩到“恰好盖住按钮 + 20% 柔和过渡”，单按钮/多按钮表格均无需再设覆盖列宽。`--snowui-table-actions-fade-coverage-override` 默认改为 `1`（贴合按钮）。背景模糊默认改为 `0rem`（默认仅保留边缘渐隐，渐进式模糊改为按需 `--snowui-table-role-overlay-blur-override` 开启）。Table-Demo 两个表格均移除内联样式，完全使用组件默认值。

- 2026-06-27：v1.5.4，按钮列渐隐的柔和过渡改为**固定长度** `1.5rem`（原为 coverage 的 20%，会随 coverage 变小而消失、且两个 gradient stop 不一致时被夹成硬边）。现透明区宽度 = 覆盖列宽 × `--snowui-table-actions-fade-coverage-override`（默认 `0.75`），过渡恒为 1.5rem，任何 coverage 下都可见。某表想更窄就调小该表的 `--snowui-table-role-overlay-width-override`。

- 2026-06-27：v1.5.3，按钮列渐隐改为单一通用比例控制：新增 `--snowui-table-actions-fade-coverage-override`（默认 `0.8`），完全透明（遮住按钮）区域宽度 = 覆盖列宽 × 该比例，其外再做固定 20% 柔和渐隐。移除原 `--snowui-table-actions-fade-start-override` / `--snowui-table-actions-fade-end-override`（之前完全透明区被硬编码为整列宽，导致遮罩过宽且无法用单值收窄）。该比例按各表自身列宽等比缩放，可在任意祖先设一次全局生效。

- 2026-06-27：v1.5.2，按钮列（actions）渐隐改为按覆盖列宽等比缩放：默认完全透明区 = 覆盖列宽（恰好盖住整列按钮），柔和渐隐终点 = 覆盖列宽 × 1.2，即渐隐遮罩始终比按钮列宽约 20%。无论列多宽，按钮下方内容都被完全遮住、不受干扰；只需把 `--snowui-table-role-overlay-width-override` 设成约等于按钮组宽度。

- 2026-06-27：v1.5.1，调整渐隐默认值：表头第一列默认 `50%` → `100%`，checkbox 列默认 `15%` → `60%`（actions 列默认仍为覆盖列宽 × 0.1 → × 0.6）。补充说明：actions 渐隐起点（完全透明区宽度）应约等于按钮组宽度，列宽固定时单按钮约 × 0.1、多按钮约 × 0.5。

- 2026-06-27：v1.5.0，将 overlay「hover 边缘渐进式透明」的固定参数拆分为三套相互独立、可覆盖的 CSS 变量：表头第一列 `--snowui-table-head-fade-start-override` / `--snowui-table-head-fade-end-override`（默认 4% / 60%）、checkbox 列 `--snowui-table-selection-fade-start-override` / `--snowui-table-selection-fade-end-override`（默认 4% / 60%）、按钮列 `--snowui-table-actions-fade-start-override` / `--snowui-table-actions-fade-end-override`（默认 覆盖列宽 × 0.1 / × 0.6）。新增 `data-force-hover="true"` 行级预览开关，可让某一行静态呈现 hover 态（用于演示 / 视觉走查）。三处同步登记于 ComponentStyleSheet.md 表 3 与 components/src/styles/components.css。

- 2026-06-27：v1.4.4，让表头第一列标题（Date 列）的「hover 边缘渐进式透明」触发条件与表头全选 Checkbox 的出现条件完全对齐：仅在 hover 数据行 / hover 该列表头 / hover|聚焦全选浮层 / 存在选中态时渐隐；全选 Checkbox 未出现时表头不再渐隐（此前为「鼠标进入表格即渐隐」）。

- 2026-06-27：v1.4.3，两项修复：(1) 进一步收敛表头全选 Checkbox 的出现规则——改为仅在 hover 任意数据行、hover 首个数据列表头（overlay 下的 Date 列）、直接 hover/聚焦全选框自身或存在选中态时显示；hover 其他表头列（Stores 等）不再显示。(2) 修复 overlay 行动按钮（actions 列）图标按钮失去 hover 反馈的问题：将按钮包进 `.snowui-table-role-overlay-controls` 包裹层，表格的显隐渐变作用于包裹层 `opacity` 而非按钮元素本身，使弱化 bare 操作的常态 40% / hover 100% 透明度得以保留（两层 `opacity` 相乘而非在同一元素上冲突；2026-08-09 起需显式写 `emphasis="muted"`）。

- 2026-06-27：v1.4.2，调整表头全选 Checkbox 的出现规则：由「鼠标进入表格视口（`.snowui-table-viewport:hover`）即显示」改为「hover 到任意表格行（`.snowui-table-viewport:has(.snowui-table-row:hover)`）、行内键盘聚焦或存在选中态时才显示」，与行内 Checkbox 的可见时机保持一致。因表头本身也是一行，触发条件天然涵盖表头行，从而保证指针从数据行上移到表头时全选框仍可见、可点击。

- 2026-06-27：v1.4.1，修复 overlay 模式下 Date / Stores 等首部数据列被「全选浮层」遮挡导致无法点击排序、无法拖拽列宽、无 hover 效果的问题。根因：表头全选控件 `.snowui-table-selection-control` 命中了非 overlay 专用的 `[data-as="selection"]` hover 状态规则（特异度 0,3,0），在鼠标进入表格时被强制 `pointer-events:auto`，而该容器在 overlay 下宽达 14rem 且 `z-index:4`，从而拦截了其浮层覆盖列的指针事件。修复：将该状态规则用 `:not([data-role-layout="overlay"])` 限定为仅非 overlay 布局；overlay 表头全选容器恒为 `pointer-events:none`（不拦截下方列），仅其中复选框在 hover 时 `pointer-events:auto`，同时容器宽度收敛为 `2rem`（仅复选框区）。
- 2026-06-27：v1.3.2，overlay 角色块模糊层底色固定为 `white/100%`，新增 `--snowui-table-role-overlay-tint-opacity-override` 控制白色磨砂层透明度（默认 `0%`）；用于在背景模糊上叠加可调白色质感。
- 2026-06-27：v1.3.1，`uniform` 背景模糊新增 `roleOverlayUniformFeather` 属性，可用渐变 mask 柔化单层模糊块的硬边界。
- 2026-06-27：v1.3.0，新增 `roleOverlayLayers` 与 `roleOverlayBlurMode` 两个 overlay 角色块模糊属性；模糊层数与模糊模式经 Table context 统一下发，表头与数据单元格的 selection / actions 模糊块共用同一控制器；`uniform` 模式复用新增的 `createUniformBlurStyles` 渲染普通背景模糊以便对比。
- 2026-06-25：v1.2.1，补充 overlay selection 的 fixed 覆盖层、渐进式模糊、层级与点击兜底实现说明；明确 Checkbox 覆盖在第一列上且链接、空白行点击仍可用。
- 2026-06-23：v1.2.0，新增 `roleLayout="overlay"`，selection/actions 角色块可覆盖到表格左右边缘，并使用反向多层透明模糊渐变遮罩保证控件清晰；行动按钮可见规则改为仅行 hover。
- 2026-06-23：v1.1.0，新增显式 selection/actions 角色列；选择列内置 Checkbox 与当前渲染行全选协议，操作列保留自定义按钮内容。
- 2026-06-22：v1.0.1，明确宽表参与页面固有宽度计算，横向滚动由页面容器负责；补充复合管理布局登记。
- 2026-06-19：v1.0.0，新增语义表格与列宽上下文。
