# ChartGroup API

来源指纹：329e3e53c1c02dfb。仅列本组件具名属性；未重新声明的基础能力按继承来源查询。

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| width | `number \| string` | 800 | 根画布宽度；数字按 px 语义转换为 CSS 长度，字符串支持百分比等 CSS 长度。共享命中区与面板以最终实测尺寸计算；子图仍须自行设置 width，叠加时通常都传 100%。 |
| height | `number \| string` | 400 | 根画布高度；支持数字或 CSS 长度。百分比高度要求父容器有确定高度。此值不自动配置子图高度；关闭 X 轴的叠加子图需扣除唯一 X 轴占用的 24px。 |
| xLabels | `string[]` | [] | 完整分类标签，数组顺序就是共享 activeCellIndex 的索引；同时作为子图未指定 xLabels 时的回退。抽稀不改变此数组和命中数量；空数组仍保留一个回退命中单元格。 |
| yMin | `number` | — | 向子图下发 Y 轴下界；未传时各子图按自身数据计算。组合图需显式统一上下界，ChartGroup 不汇总所有子图的数据 domain。子图显式值优先。 |
| yMax | `number` | — | 向子图下发 Y 轴上界；未传时各子图分别按自身数据计算最大值，可能产生不同标尺。比较同单位数据时显式设置共同上界；子图显式值优先。 |
| yTicks | `number[]` | — | 向子图下发显式数值刻度数组，用于替代自动 ticks；显示数量仍可抽稀，子图显式 yTicks 优先。 |
| yTickCount | `number` | 6 | 自动刻度的目标数量，非保证精确数量；实际刻度由子图 domain、nice step 和标签抽稀共同决定。显式 yTicks 优先。 |
| yTickFormatter | `(value: number) => string` | — | 将每个数值刻度转换为显示字符串；只改变轴文案，不改变原始数值、domain 或悬浮值。子图显式 formatter 优先，未传时使用子图默认格式。 |
| showXAxis | `boolean` | true | 下发 X 轴显示默认值，包括轴线和标签；ChartGroup 自身不绘制坐标轴。叠加组合只让一个子图开启，其他子图显式关闭。 |
| showYAxis | `boolean` | false | 下发 Y 轴标签显示默认值，并参与组级顶部安全区计算。子图显式值优先；左右轴留白由各子图自行测量，容器不自动对齐不同的 Y 轴标签宽度。 |
| showGrid | `boolean` | false | 下发网格线显示默认值，网格由子图绘制并跟随可见 Y ticks；叠加时只保留一个网格绘制者。子图显式值优先。 |
| showGuides | `boolean` | false | 下发辅助线开关；LineChart 可绘制数据点辅助线，BarChart 当前没有额外 guide 图形。子图显式配置优先。 |
| xAxisMode | `ChartGroupXAxisMode` | "edge" | 下发 LineChart 点位模型：edge 将首尾点放在绘图区两端，cell 放在分类格中心。BarChart 叠加折线时使用 cell；容器共享命中区域始终按分类格划分。 |
| xLabelAutoCull | `boolean` | true | 下发 X 轴标签自动抽稀开关，依据子图实测文字与可用宽度减少可见标签；不删除数据、路径、分类格或共享索引。子图显式值优先。 |
| xMaxLabelCount | `number` | — | 下发 X 轴可见标签数量上限，子图可因空间不足显示更少标签；不改变完整分类和可悬浮数据，子图显式值优先。 |
| yLabelAutoCull | `boolean` | true | 下发 Y 轴标签自动抽稀开关，空间不足时减少可见标签；实际布局由各子图处理，子图显式值优先。 |
| yMaxLabelCount | `number` | — | 下发 Y 轴可见标签数量上限；未提供 yTicks 时也参与子图自动刻度数量计算，子图显式值优先。 |
| plotBounds | `ChartGroupPlotBounds` | {} | 相对根画布的绘图区内缩，字段 top/right/bottom/left 均为 px 数字。用于共享命中与面板 bounds；top 只能增加所有子图的最大安全区。其余边不改写子图自身几何，关闭全部 X 轴时可显式设 bottom: 0。 |
| hoverMode | `ChartGroupHoverMode` | "cell" | cell 协调同一分类的共享 hover；item 不创建组级 cell 命中层，保留子图自身命中。此值也作为子图 hoverMode 的回退；子图显式值优先。 |
| activeCellIndex | `number \| null` | — | 受控分类索引，按 xLabels 从 0 开始；null 明确表示没有激活项，undefined 使用内部非受控状态。非 bindable；受控调用方需在 onCellHoverChange 中回写值。 |
| defaultActiveCellIndex | `number \| null` | null | 仅初始化内部非受控索引，后续修改不重置状态；activeCellIndex 有定义时此值不参与当前选择。null 表示初始无激活项。 |
| onCellHoverChange | `(index: number \| null) => void` | — | 共享索引发生变化时接收新索引或 null；由指针、分类格焦点及子图交互触发。内部交互将有限数值限制在有效分类范围内；受控模式只通知，不替调用方改值，无取消返回值。 |
| showHitLayer | `boolean` | true | 控制组级 SVG 分类命中层；仅在 hoverMode=cell 且 showHoverPanel=false 时渲染。开启共享面板后改由根层指针坐标与子图命中处理，false 不等于禁用子图交互。 |
| adaptiveContrast | `boolean` | true | 自适应黑白对比：按纯色宿主背景与同原点叠加柱体的明暗切换黑色数值和默认黑白节点、黑色折线；子图显式值优先，彩色序列与彩色节点不改色。明暗分界为 sRGB 灰度 0.5，随当前柱体形状和透明度变化；不支持背景图片或跨图坐标变换。默认开启，可显式关闭；由 Adaptive Contrast 共享能力实现。 |
| showHoverPanel | `boolean` | true | 将子图上报的数据合并为唯一共享面板；cell 模式下根层指针位置更新当前分类。默认开启；关闭时不显示共享面板，子图按自身 showHoverPanel 配置显示独立面板；若需要数值标签，可同时关闭子图面板或显式设置 showHoverLabel；空数据没有面板。 |
| showHoverLabel | `boolean` | — | 统一控制子图数值标签；未传时沿用子图配置并根据共享面板推导默认显示。显式 true/false 优先于子图同名配置；true 允许数值标签与共享面板同时显示。 |
| alwaysShowHoverLabel | `boolean` | false | 为子图开启数值标签常显；与子图自身 alwaysShowHoverLabel 按逻辑或合并，因此组级 false 不关闭子图显式常显。仍受最终 showHoverLabel 控制。 |
| hoverPanelVariant | `ChartHoverPanelVariant` | "light" | 唯一共享面板的外观：light 为浅色，dark 为深色，surface 为带背景模糊的表面；不修改柱体、折线或子图数值标签颜色。 |
| hoverPanelPlacement | `ChartHoverPanelPlacement` | "pointer" | 共享面板定位：anchor-side 跟随数据图形侧边，anchor-top 对齐最高数据锚点，pointer 跟随指针；pin-* 固定在绘图区对应方位。面板碰撞处理由共享 ChartHoverPanel 完成。 |
| showHoverPanelLabel | `boolean` | false | 在共享面板顶部显示当前分类名称；优先读取 xLabels 中的激活项，没有对应标签时回退到首个子图面板 label。 |
| children | `Snippet` | — | 显式组合子图的无参数 Snippet；不会自动生成 BarChart、LineChart、标题或图例。子图通过各自 width/height 和根定位样式共享同一画布。 |
| class | `string` | "" | 附加到根 Frame 的 class，与内部根类名合并；不下发给子图表。 |
| style | `string` | "" | 根 Frame 的追加 inline style，位于画布尺寸变量声明之后；用于宿主定位等公开覆盖，不下发给子图内部。 |
| enableResponsive | `boolean` | true | 是否开启根 Frame 的响应能力；图表画布的实测尺寸监听独立存在，百分比 width/height 不依赖此开关。 |
| enableContext | `boolean` | true | 是否开启根 Frame 通用 Context 能力；不关闭 ChartGroup 为子图提供的共享分类、轴和悬浮协议。 |
| enableScaleObserver | `boolean` | false | 根 Frame scale observer 的兼容开关，默认关闭；不控制图表自身实测尺寸监听。 |
| enableDefaultMotion | `boolean` | true | 是否启用根 Frame 的默认动效；不会统一开启或关闭子图自身 appearance 动效，子图使用各自公开动效 Props 和实例方法。 |

[类型与状态](./types.md) · [完整组合说明](./reference.md) · [共享 Frame API](../frame/api.md) · [样式覆盖](./styles.md) · [样式选择顺序](../../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F)
