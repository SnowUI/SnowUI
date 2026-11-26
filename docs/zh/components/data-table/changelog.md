# DataTable 更新日志

### v1.15.0 (2026-10-21)

- 配置式操作组透传数量、组级及单项样式；操作预算先于数据响应式分配。

- 2026-10-07：响应式单元格每侧最小 padding 从 2px 调整为 4px，相邻列最小内容间距为 8px。

- 2026-10-07：v1.14.0，新增 horizontalScroll 策略，roleLayout 默认 auto；所有响应式布局交由 Table 统一计算，保留显式 column / overlay。

- 2026-09-21：统一使用文档、源码属性表与 Site / AI 阅读入口；仅文档修订，不改变组件行为。

- 2026-08-14：v1.13.0，组合的 TableHead / TableCell 左右 padding 随内部 Table 容器宽度在 2px 到 12px 之间响应；保持由 Table 单元格唯一拥有实现。
- 2026-08-06：v1.12.0，只读默认态复用稳定空选择状态并跳过逐行 Set 查询 / 全选集合扫描；开启 selection 后保持完整选择行为。
- 2026-07-12：v1.11.0，新增 `selection` / `actions`（默认 false）；默认不显示 checkbox 与操作列，可独立开启。
- 2026-07-08：v1.10.0，新增 `onRowPreview` 行空白点击预览协议；未配置时空白点击不再切换选中。

- 2026-07-07：优化客户端数据管线：搜索与筛选合并为单次遍历；无查询、筛选、排序或增量数据时复用原数组；选择判断使用 Set，减少大数据表的重复线性查找。

- 2026-07-05：v3.0.0，独占 checkbox 选择列、按钮操作列及其选择状态 / overlay 布局；TableToolbar 改为 DataTable 专用组件。

- 2026-07-01：v2.0.0，client 模式内置 query 与 filters 数据处理，并向 TableToolbar 提供查询、筛选、排序和可排序列 Context。
- 2026-07-01：v1.9.0，`pageSize` 支持双向绑定；每页行数变化时自动回到第 1 页，并新增 `onPageSizeChange`。
- 2026-06-30：v1.8.4，首次增量加载在读取数据源前等待 Table 锁定当前自然列宽，避免后续更宽内容触发原生列宽重排、带动初始行左右晃动；手动与自动加载共用该行为。
- 2026-06-30：v1.8.3，auto 模式首次进入触发区也执行默认 500ms 确认等待，离开触发区则取消；避免滚动惯性期间插入 Spinner / 新行扩展滚动高度而带动页面缓动。
- 2026-06-30：v1.8.2，新增行 opacity 渐显从 TableRow 迁移到普通 TableCell，排除 selection/actions overlay，修复加载期间 hover Checkbox 被双重透明度压暗的问题。
- 2026-06-30：v1.8.1，修正 `loadMoreThreshold` 方向：内部哨兵下移到表格底部之后，默认需越过表尾继续滚动 80px 才触发，不再使用正 rootMargin 提前加载。
- 2026-06-30：v1.8.0，新增组件内置自动加载：`loadMoreMode="auto"`、`loadMoreThreshold`（默认 80px）与 `loadMoreThrottleMs`（默认 500ms）；内部管理表尾哨兵、最近滚动祖先、请求节流和清理，页面不再编写 IntersectionObserver。
- 2026-06-30：v1.7.6，页面自动加载示例改为向下进入触发区后延迟 500ms；停留或继续下滚时加载，期间向上滚出触发区则取消。
- 2026-06-30：v1.7.5，适配 Frame `while*` 完整视觉通道语义，删除 `scale: undefined` 临时抵消配置；实验常量数值保持不变。
- 2026-06-30：v1.7.4，新增行渐显配置显式移除 Frame 通用 appear preset 的 scale，只执行 opacity 渐显。
- 2026-06-30：v1.7.3，展示间隔为 0 时跳过 `setTimeout`，避免零时长定时器仍把各行拆到不同事件循环任务；明确服务器数据到达节奏与组件展示节奏的边界。
- 2026-06-30：v1.7.2，修复新增行只获得 `whileAppear` 配置却未进入 Frame `Appear` 状态、导致 opacity 渐显未执行的问题；逐条提交间隔恢复为 100ms，单行渐显保持 1000ms 并允许彼此重叠。
- 2026-06-30：v1.7.1，将内部流式新增行的 opacity 渐显和逐条消费等待统一延长至 1000ms，用于清晰验证渐显效果。
- 2026-06-30：v1.7.0，真正内置增量加载管线：新增 `loadMore / loadMoreSize / hasMore` 与 render-state `loadMore()`；支持 AsyncIterable 流式响应、逐条合并、首行开始时隐藏 Spinner、TableRow 自动 250ms 渐显及请求中止。
- 2026-06-30：v1.6.0，已有 rows 的 `loading` / `refreshing` 状态新增末尾 Spinner 行；Spinner 尺寸由 Table `loadingSpinnerSize` 控制，默认 16×16px。
- 2026-06-30：v1.5.1，移除 `skeletonRows`；首次加载骨架行数直接跟随 `pageSize`，无法读取分页配置时回退为默认 10 行。
- 2026-06-30：v1.5.0，新增首次加载 Skeleton rows：`loading && rows.length === 0` 时保留真实表头，由 TableBody 按 TableHead 注册列自动生成骨架行；新增 `skeletonRows`，已有 rows 的加载/刷新不替换数据。
- 2026-06-30：v1.4.3，striped 所有数据行固定保持 12px 圆角；divided hover 背景仅进入时过渡、移出时立即退场，消除圆角恢复过程的视觉残影。
- 2026-06-30：v1.4.2，默认 divided 变体移除表头与静态数据行两端圆角；数据行仅在 hover 时形成 12px 圆角，并补齐隐藏 hover 行上方分割线。
- 2026-06-22：v1.4.1，明确未声明 `defaultSort` 时不存在“第一列默认升序”；`sort === undefined` 始终保留输入 rows / filteredRows 顺序。
- 2026-06-22：v1.4.0，接入 TableHead `defaultSortActive` 默认激活与可取消排序循环；撤销 v1.3.1 的显式 `sortable` 要求，恢复同名原始字段 / sorter 自动启用排序。
- 2026-06-22：v1.3.1，排序能力改为由 TableHead `sortable` / `defaultSort` 显式开启，不再因数据字段同名自动使列头可交互。
- 2026-06-22：v1.3.0，支持由 TableHead `defaultSort` 注册默认排序列与方向；DataTable 同名对象 prop 保留为兼容回退。
- 2026-06-22：v1.2.2，将 `defaultSort` 方向纳入 Table context；默认列按“默认 → 反向 → 默认”循环，供 TableHead 区分默认与反向视觉。
- 2026-06-22：v1.2.1，补充复合管理布局的区域结构、局部复用、padding / gap 与滚动归属；更正工具栏示例名称。
- 2026-06-20：v1.2.0，默认区域 gap 改为 12px；新增 striped/divided 两种行视觉。
- 2026-06-19：v1.1.0，增加 defaultSort 与同名字段自动排序；恢复 Toolbar / Table / Pagination 显式自由组合。
- 2026-06-19：v1.0.0，新增客户端排序、分页切片和 server 边界。
