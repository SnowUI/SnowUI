# LineChart API

来源指纹：8afd02e81c967956。仅列本组件具名属性；未重新声明的基础能力按继承来源查询。

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| series | `LineChartSeries[]` | [] | 图表序列数据；组件不内置模拟数据 |
| xLabels | `string[]` | — | 横坐标标签；未传时使用 `ChartGroup.xLabels` 或按数据点索引生成内部坐标标签 |
| width | `number \| string` | 800 | 图表整体宽度；支持 `100%`，内部按根层最终实测宽度重算几何 |
| height | `number \| string` | 400 | 图表整体高度；数字按 px 语义转为 rem |
| yMin | `number` | — | 纵坐标最小值；未传时根据数据生成 nice domain，正数数据默认包含 `0` 默认行为：自动 / 继承 `ChartGroup`。 |
| yMax | `number` | — | 纵坐标最大值；自动时等于实际最大数据值，不向上取整 默认行为：自动 / 继承 `ChartGroup`。 |
| yTicks | `number[]` | — | 纵坐标刻度 默认行为：自动 nice ticks / 继承 `ChartGroup`。 |
| yTickCount | `number` | — | 未传 `yTicks` 时用于生成 nice ticks 的目标刻度数量 |
| yTickFormatter | `(value: number) => string` | — | 纵坐标格式化 默认行为：K 格式 / 继承 `ChartGroup`。 |
| showXAxis | `boolean` | — | 是否显示横坐标 |
| showYAxis | `boolean` | — | 是否显示纵坐标 |
| showGrid | `boolean` | — | 是否显示水平网格线 |
| showGuides | `boolean` | — | 是否允许序列绘制节点垂直辅助线 |
| showHoverLabel | `boolean` | — | hover / focus 节点时是否显示数值 label；当 `showHoverPanel=true` 且未显式传入时实际渲染默认关闭 默认行为：按 `showHoverPanel` 推导。 |
| alwaysShowHoverLabel | `boolean` | false | 是否让数值 label 一直显示；与 `showHoverPanel` 同时开启时允许同时显示 |
| adaptiveContrast | `boolean` | — | 自适应黑白对比：按纯色宿主背景与同原点叠加柱体的明暗切换黑色数值和默认黑白节点、黑色折线；子图显式值优先，彩色序列与彩色节点不改色。明暗分界为 sRGB 灰度 0.5，随当前柱体形状和透明度变化；不支持背景图片或跨图坐标变换。默认开启，可显式关闭；由 Adaptive Contrast 共享能力实现。 默认行为：继承 ChartGroup，否则 `true`。 |
| showHoverPanel | `boolean` | true | 是否开启 Chart hover 面板，内容按当前节点 / cell 自动生成；默认开启，hover / focus 时显示面板；设为 false 时回到数值 hover label，显式 showHoverLabel 优先 |
| hoverPanelVariant | `ChartHoverPanelVariant` | "light" | hover 面板视觉样式 |
| hoverPanelPlacement | `ChartHoverPanelPlacement` | "pointer" | hover 面板定位；支持 anchor / pointer / pin 位置 |
| showHoverPanelLabel | `boolean` | false | 是否在 hover 面板顶部显示当前分类 label |
| hoverMode | `ChartGroupHoverMode` | — | hover 命中模式；`cell` 时按分类点位中心左右半格生成整格命中区，并响应共享 hover |
| activeCellIndex | `number \| null` | — | 受控当前 hover 分类点位；未传时可继承 `ChartGroup` |
| onCellHoverChange | `(index: number \| null) => void` | — | 分类点位 hover 变化回调 |
| valueFormat | `NumberFormatOptions` | — | 节点数值 label 的组件级数字格式；可设置 `notation: "auto"` / `"compact"` 使用英文 `k/m/b/t` 缩写 默认行为：NumberFormats 默认。 |
| labelFormatter | `( value: number, context: { series: LineChartSeries; point: NormalizedPoint; seriesIndex: number; pointIndex: number; }, ) => string` | — | 节点数值 label 自定义格式化；优先级高于全局、组件、序列和点级 `valueFormat` |
| xAxisMode | `LineChartXAxisMode` | — | 横坐标点位模式；`edge` 表示首尾数据点与首尾 label 中心都对齐到绘图区两端，`cell` 为分类 cell 中心 |
| xLabelAutoCull | `boolean` | — | 是否根据完整 label 实测宽度自动减少横坐标 label；不删除数据点、路径或命中 cell |
| xMaxLabelCount | `number` | — | 横坐标最多显示 label 数量；始终保留首尾，并按等步数减少中间 label 与对应数据点 默认行为：- / 继承 `ChartGroup`。 |
| yLabelAutoCull | `boolean` | — | 是否根据纵向空间自动减少纵坐标 label |
| yMaxLabelCount | `number` | — | 纵坐标最多显示 label 数量；未传 `yTicks` 时也会作为生成 nice ticks 的上限 默认行为：- / 继承 `ChartGroup`。 |
| cornerRadius | `number \| string` | 8 | 圆角转折线的转角圆角半径；`0` 时为直线 |
| colors | `(LineChartColor \| undefined)[]` | — | 调色板；空项回退当前 `colorMode` |
| colorMode | `LineChartColorMode` | "sequence" | Chart 通用颜色模式：默认色序、单色渐浅、单色 |
| color | `LineChartColor` | — | 单色模式主色；传入后同时作为 `monochromeFade` 与 `monochrome` 的默认颜色 |
| monochromeColor | `LineChartColor` | "Primary" | `monochromeFade` 的单色来源；第一条序列为 100%，最后一条序列为 20%，中间按序列数量均匀递减 |
| mutedMonochromeColor | `LineChartColor` | "Black4" | `monochrome` 的单色来源；默认所有未自定义序列为 4% 黑色本体颜色，描边透明度保持 100% |
| showBaseLayer | `boolean` | false | 是否显示最终尺寸的同色轮廓（影子 / 占位底层），默认不渲染；开启后以 4% 不透明度绘制，不参与出现动效，不改变真实图形、命中区域或时间轴。同时控制完整折线及 Area 底层，不关闭真实 Area 渐变。 |
| appearMotion | `boolean` | true | 是否启用出现动效 |
| appearOnView | `boolean` | true | 是否在触发锚点进入视口默认位置时自动播放出现动效；同源 iframe 中按最外层同源页面的真实位置判断 |
| appearanceProgress | `number` | — | 受控出现进度，范围 `0..1`；传入后组件只根据该进度渲染，不自行播放 |
| defaultAppearanceProgress | `number` | 0 | 非受控初始出现进度 |
| appearanceDuration | `number` | — | 自动播放总时长覆盖；未设置时每条序列自身绘制时长固定为 `1000ms`，多序列总完成时间会随 `360ms` stagger 增加 |
| appearAnchorId | `string` | — | 动效触发锚点元素 ID；不传时使用图表自身根元素 |
| appearAnchorPoint | `AnchorPoint` | "top" | 使用锚点元素的顶端、中间或底部作为触发点 |
| appearViewportPoint | `number \| "top" \| "center" \| "bottom"` | 0.7 | 视口触发位置；`0.7` 表示视口高度 70% |
| scrollAppearance | `boolean \| { distance?: number \| string }` | false | 是否启用滚动条时间轴控制出现动效；同源 iframe 同时响应外层页面滚动 |
| scrollAppearanceDistance | `number \| string` | 320 | 滚动时间轴从 `0` 到 `1` 对应的滚动距离 |
| onAppearanceProgressChange | `(progress: number) => void` | — | 出现进度变化回调 |
| loading | `boolean` | — | 数据等待状态。保持声明的画布尺寸、坐标轴和网格，将折线、面积和 marker 固定在出现动效起点并暂停交互；变为 false 后按当前视口条件播放出现动效。图表不渲染 Skeleton，也会读取上层 Frame 的 loading 上下文。 |
| children | `Snippet` | — | 图表主体后的自定义内容，无参数；不会替换坐标轴或数据系列。 |
| class | `string` | "" | 根层附加 class |
| style | `string` | "" | 根层附加 style |
| enableResponsive | `boolean` | true | 是否启用 Frame responsive 能力 |
| enableContext | `boolean` | true | 是否启用 Frame context 能力 |
| enableScaleObserver | `boolean` | false | 是否启用 Frame scale observer |
| enableDefaultMotion | `boolean` | true | 是否启用 Frame 默认动效 |

[类型与状态](./types.md) · [完整组合说明](./reference.md) · [共享 Frame API](../frame/api.md) · [样式覆盖](./styles.md) · [样式选择顺序](../../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F)
