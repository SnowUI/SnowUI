# TableHead

> **内置图标统一（2026-09-11）**：功能图标的资源比例、尺寸优先级和按钮宿主遵循 [ComponentGuidelines §2.7](../../../specs/ComponentGuidelines.md#27-组件内置-icon-规范)。内置无外壳操作复用 Button bare；有padding的纯图标操作使用 iconOnly。尺寸从所属宿主继承，显式覆盖优先。


> `selection` / `actions` 角色仅在 PRO DataTable Context 中生效；普通 Table 只提供普通表头与列宽 / 受控排序能力。

## 内置组件双模式

- `parts.Indicator`：统一配置 resize Indicator。
- `parts.Checkbox`：配置 selection 表头的全选 Checkbox。
- 排序、选择和列宽事件属于 TableHead 受控协议，parts 不得覆盖。

> **版本**: v2.3.0
> **职责**: `<th scope="col">`、排序触发器与列宽手柄宿主。

| 属性 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| as | `selection \| actions` | - | 显式角色列；角色列不参与排序与列宽拖动 |
| columnId | `string` | 普通列必填 | 稳定列标识；角色列使用内置标识 |
| label | `string` | `columnId` | 注册给 TableToolbar 排序 Listbox 的可读列名 |
| sortDirection | `ascending \| descending` | context 推导 | 独立受控排序方向 |
| defaultSort | `ascending \| descending` | - | 声明表格默认按当前列的正序或反序排列；同时使当前列可排序 |
| defaultSortActive | `boolean` | `false` | 使 `defaultSort` 的默认方向也显示激活态和图标，并将交互循环扩展为可取消排序 |
| roleLayout | `column \| overlay` | Table context | 覆盖当前角色表头的角色列布局；普通表头忽略 |
| onSortChange | `(direction) => void` | - | 独立使用时的三态排序回调 |
| resizable | `boolean` | `true` | 是否显示列宽手柄；普通列默认可拖动改宽，设为 `false` 时关闭 |
| minWidth / maxWidth | `number` | `64 / Infinity` | 拖动约束 |

排序状态同步到 `aria-sort`。**只有 DataTable `defaultSort` 命中列的默认方向不显示激活态或图标**（`defaultSortActive` 可覆写）；其他已排序状态显示对应图标。图标遵循主流前端表格的“数值方向”语义：ascending（A→Z、0→9、早→晚）显示内置 `ArrowsUp`；descending（Z→A、9→0、晚→早）显示内置 `ArrowsDown`。图标尺寸为 16px，与文字间距为 0。

交互循环：

- `defaultSort` 命中列：默认方向（无图标） → 反向（有图标） → 默认方向（无图标）。
- 其他列：无排序 → ascending（ArrowsUp） → descending（ArrowsDown） → 无排序。

可排序表头遵循通用无底色文字 / Icon hover 规则：使用 `Black/100% × opacity 0.4 → 1`，不切换颜色源。hover、键盘 focus 与排序激活态都为 `opacity: 1`，因此激活时文字与内置图标保持同色。不可排序的列不渲染按钮，没有 hover 和点击态。

不需要 `sortable` prop。DataTable 根据同名原始字段或 `sorters[columnId]` 自动判断列是否可排序；独立 TableHead 在声明 `sortDirection` / `onSortChange` 时也自动启用交互。没有任何排序规则的列不渲染按钮。

普通数据列只要声明 `columnId`，默认就在列尾渲染 Indicator 并允许拖动修改宽度；不需要重复声明 `resizable`。`as="selection"` / `as="actions"` 角色列始终不参与列宽拖动。某一列需要固定宽度时，显式传入 `resizable={false}`。普通与角色表头的左右 padding 与 TableCell 使用同一容器响应规则，在 2px 到 12px 之间流动；常见窄屏宽度使用每侧 2px，使相邻列最小视觉间距为 4px，上下保持 8px。

未显式固定列宽时，表头的不换行 min-content 与同列 TableCell 共同参与 Table 自动列宽；因此列标题不会因窄宿主被逐字压缩。显式 `columnWidths`、拖动列宽或其他固定宽度优先，宽度不足时仍使用表头省略规则。

未声明任何 `defaultSort` 时，TableHead 不会把第一列视为隐式默认排序列。当所有列均未激活排序时，DataTable 保留上层传入的 rows / filteredRows 顺序。

## 角色列

- `as="selection"`：渲染内置全选 Checkbox。Checkbox 距角色列左边缘 8px，仅在鼠标进入 Table 区域或键盘焦点进入 Table 时显示；部分选中时使用 indeterminate。该列 padding 为 `8px 0 8px 8px`。
- `as="actions"`：默认无标题且不渲染任何业务按钮；传入 children 时可显示自定义标题。该列 padding 为 `8px 8px 8px 0`。
- `roleLayout="overlay"`：角色表头自身宽度归零并 sticky 到左右边缘。selection 的 Checkbox 仍距左边缘 8px；actions 标题（如声明）距右边缘 8px。表头真实首尾单元格保持直角；overlay 浮动控件块可继续使用 12px 圆角。控件覆盖块默认宽度为原 overlay 宽度的三分之一；blur layer 默认隐藏，仅在表头区域 hover 时渐显；内部复用 `components/src/lib/progressive-blur.ts` 的通用 Progressive Blur，全覆盖层通过连续 mask 分段实现渐进强度。selection 左强右清，actions 右强左清。
- overlay selection 后方的首个真实标题内容使用固定约 14px → 26px 渐隐遮罩，不再按标题或列宽百分比缩放；可通过 `--snowui-table-head-fade-start-override / --snowui-table-head-fade-end-override` 覆盖。
- 两种角色都采用显式组合契约，不通过 DOM 扫描猜测列身份。

每个 TableHead 会向最近的 Table Context 注册自身列结构（`columnId`、selection/actions 角色与对齐方式），供 TableBody 首次加载时按真实列顺序生成 Skeleton rows。该注册只传递公开列语义，不暴露或扫描 TableHead 内部 DOM。

## 排序类型决策

TableHead **不声明内容类别**，也不公开 `sortType="text | number | date"`。DataTable 根据行数据的原始字段自动比较：

- `Date` 按时间戳排序。
- `number` 按数值排序，因此 Unix 时间戳也自然按时间排序。
- 带时区的 ISO 8601 日期时间字符串先转时间戳再比较。
- 其他字符串使用不区分大小写、支持数字片段的本地化自然顺序。
- 展示值来自派生结果时，由 DataTable `sorters[columnId]` 返回可比较的原始值。

这样可避免把格式化文案（例如 `Just now`、`$1,299`）当作数据排序，也避免页面重复声明数据层已经知道的类型。

## 默认排序声明

默认排序由对应列头直接声明：

```svelte
<TableHead columnId="createdAt" defaultSort="descending">Date</TableHead>
```

同一个 DataTable 只能有一个 TableHead 声明 `defaultSort`。该声明优先于 DataTable 旧的对象式 `defaultSort={{ columnId, direction }}`；DataTable 对象式入口仅作为兼容回退保留。

默认情况下，该列在默认方向不显示激活态，并在“默认 → 反向 → 默认”间循环。需要默认方向也显示激活态时：

```svelte
<TableHead
    columnId="createdAt"
    defaultSort="descending"
    defaultSortActive
>
    Date
</TableHead>
```

`defaultSortActive` 不是纯视觉开关。开启后交互循环改为“默认（激活） → 反向（激活） → 无排序 → 默认（激活）”。

## Keyword

| Keyword | 说明 |
| :--- | :--- |
| component | 当前组件公开契约 |

> **以下内容供 AI 阅读，不展示在文档站点**

- 排序与列宽都通过 Table context 协调，不在组件内保存业务 Store。
- DataTable 下 `as="selection"` / `as="actions"` 受 Context `isSelectionEnabled` / `isActionsEnabled` 控制；关闭时整列不渲染。
- 默认 `font-weight: 400`，字号与行高消费 `--text-12 / --leading-12`。
- 所有表头单元格与数据行使用相同的响应式左右 padding，范围为 2px 到 12px。
- `resizable` 使用通用 Indicator；命中带沿用 line 全高协议（表头单元格右缘全高）；常态视觉线为 **1px × 16px**、贴列右缘、垂直居中（TableHead 覆盖 `.snowui-indicator-visual`）；进入命中带时加粗到 2px。

## Changelog

- 2026-09-01：v2.3.0，未显式固定列宽时，表头不换行 min-content 参与 Table 自动总最小宽度。
- 2026-09-01：v2.2.1，表头跟随 Table 新响应曲线，在常见窄屏容器收敛到每侧 2px，并明确相邻列最小视觉间距为 4px。
- 2026-08-14：v2.2.0，普通、selection、actions 与 overlay 角色表头的左右 padding 改为按 Table 容器宽度响应，范围为 2px 到 12px。
- 2026-08-06：v2.1.0，普通数据列的 `resizable` 默认值改为 `true`；声明 `columnId` 后即可拖动改宽，固定列可显式传入 `resizable={false}`；selection/actions 角色列保持不可拖动。
- 2026-08-03：v1.9.2，selection Checkbox 的 1px 增量改为固定 `0.0625rem` 特例，不再复用边框 Token。
- 2026-08-03：v1.9.1，selection 全选 Checkbox 与数据行统一使用 Token 计算的 17px Table 组合尺寸；独立 Checkbox 默认值不变。

- 2026-07-12：v2.0.1，适配 Indicator line 全高命中带；表头视觉恢复 1×16 贴右缘。
- 2026-07-01：v2.0.0，新增 `label` 并把可排序列元数据注册给 DataTable / TableToolbar。
- 2026-06-30：v1.9.0，overlay selection 标题渐隐改为固定约 14px → 26px，视觉对齐 Table Demo 表格一，不再随标题或列宽变化。
- 2026-06-30：v1.8.0，接入 Table Context 列注册协议，供 TableBody 首次加载时按真实表头顺序生成 Skeleton rows。
- 2026-06-30：v1.7.1，移除表头真实首尾单元格的静态外缘圆角，避免默认 divided 表头分割线在两端弯曲；overlay 浮动控件块圆角保留。
- 2026-06-24：v1.7.0，overlay blur 复用 `progressive-blur.ts` 通用能力，移除组件内旧窄 strip 实现。
- 2026-06-24：v1.6.9，overlay 宽度回调到约 35px，但 strip 分布压在前 65% 内并降低 blur 半径，让模糊早于块宽结束。
- 2026-06-24：v1.6.8，overlay 默认宽度再减半为约 26px，并压缩后续 strip 分布，让右侧过渡更早结束。
- 2026-06-24：v1.6.7，回到已有模糊效果的窄分段 Progressive Blur；移除额外延伸的 blur surface，恢复首段宽 strip + 后续窄 strip 的覆盖方式。
- 2026-06-24：v1.6.6，恢复多层 progressive backdrop 机制，改为 6 层全宽渐隐 mask，保留模糊效果并避免硬分段边缘。
- 2026-06-24：v1.6.5，overlay 控件宽度与 blur surface 宽度解耦，blur surface 额外向内容方向延伸，确保覆盖到相邻表头文字产生模糊。
- 2026-06-24：v1.6.4，blur surface 默认恢复 `.1%` 不可见合成触发面，并调整 alpha mask 曲线，恢复 backdrop-filter 模糊采样。
- 2026-06-24：v1.6.3，overlay blur 从多层 strip 改为单层全宽 blur surface + alpha mask，消除放大后可见的色块边缘。
- 2026-06-24：v1.6.2，TableHeader 首尾与 overlay 可见块补齐行同款圆角；overlay 默认宽度与 strip 尺寸减半，strip tint 默认归零。
- 2026-06-24：v1.6.1，overlay 角色表头的渐进模糊改为 hover 才显示，并收敛为 8 层宽首段 + 重叠窄条带。
- 2026-06-23：v1.6.0，新增角色列 `roleLayout="overlay"` 覆盖布局，selection/actions 表头可贴左右边缘并使用反向多层透明模糊渐变遮罩。
- 2026-06-23：v1.5.0，新增 `as="selection/actions"` 角色；选择表头内置当前渲染行全选 Checkbox，操作表头默认隐藏且允许自定义标题。
- 2026-06-22：v1.4.1，参考 MUI / Ant Design / HeroUI 等主流表格的数值方向语义，正式定义 ascending 使用 ArrowsUp，descending 使用 ArrowsDown；明确未声明 `defaultSort` 时不会隐式按第一列升序。
- 2026-06-22：v1.4.0，新增 `defaultSortActive`；开启后默认排序方向也显示激活态与图标，交互循环改为“默认 → 反向 → 无排序 → 默认”；撤销 v1.3.1 的 `sortable` 必需结论，恢复自动排序能力判断。
- 2026-06-22：v1.3.1，将 `sortable` 确立为排序能力的显式开关；未声明时不再因同名行字段自动启用交互。`defaultSort` 继续自动隐含该能力。
- 2026-06-22：v1.3.0，新增 `defaultSort="ascending | descending"`，由 TableHead 同时声明默认排序列和方向；声明该 prop 时自动启用列排序。
- 2026-06-22：v1.2.3，按列表向下阅读语义修正排序图标映射：ascending 使用 ArrowsDown，descending 使用 ArrowsUp。
- 2026-06-22：v1.2.2，将“默认方向无激活视觉”收窄为仅适用于 `defaultSort` 命中列；其他列恢复为 ascending / descending 均显示激活态与图标。
- 2026-06-22：v1.2.1，默认排序方向改为非激活视觉且不显示图标，只有反向排序显示 ArrowsUp / ArrowsDown；图标与文字间距改为 0。
- 2026-06-22：v1.2.0，恢复排序激活图标；ascending / descending 分别使用内置 ArrowsUp / ArrowsDown；可排序文字与图标统一接入 40% → 100% 通用 hover 规则；明确原始值自动比较、派生列使用 sorter 的类型决策。
- 2026-06-22：v1.1.1，表头列宽 Indicator 改为常态 1px × 16px，并与表头水平中线居中对齐。
- 2026-06-20：v1.1.0，移除列标题右侧排序箭头，保留点击排序与 aria-sort。
- 2026-06-19：v1.0.0，新增排序与 Resizable 接入。
