# BarChart API

来源指纹：9e2a6f3cfeb5eab7。仅列本组件具名属性；未重新声明的基础能力按继承来源查询。

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| data | `BarChartItem[]` | DEFAULT_DATA | 分类数据；overlay 推荐用每类 bars 的前两项表示后层与前层，名称、数值、颜色和数字格式分别配置，详见数据结构。 默认行为：内置默认数据。 |
| orientation | `BarChartOrientation` | "vertical" | 图表方向 |
| mode | `BarChartMode` | "single" | 单元内部柱模式 |
| width | `number \| string` | 800 | 图表整体宽度；支持 `100%`，内部按最终显示宽度重算几何 |
| height | `number \| string` | 400 | 图表整体高度；内部按最终显示高度重算几何 |
| barWidth | `number \| string` | 32 | 单根柱粗细；纵向时为宽度，横向时为高度；响应式下限 `2px` |
| barGap | `number \| string` | 4 | `group` 模式中同一单元内相邻柱间距；下限 `4px` |
| groupGap | `number \| string` | 20 | 分类单元内容与 cell 边缘的预留间距；下限 `4px` |
| segmentGap | `number \| string` | 0 | `stack` 模式中分段间隔；`0` 表示无间隔 |
| cornerRadius | `number \| string` | 8 | 柱圆角大小 |
| roundedStart | `boolean` | true | 是否保留起点端圆角；纵向为底部，横向为左侧 |
| roundedEnd | `boolean` | true | 是否保留终点端圆角；纵向为顶部，横向为右侧 |
| xLabels | `string[]` | — | 分类 label 覆盖；未传时使用 `ChartGroup.xLabels` 或 `data[].name` |
| yMin | `number` | — | 数值轴 domain 最小值 默认行为：自动 / 继承 `ChartGroup`。 |
| yMax | `number` | — | 数值轴 domain 最大值；自动时等于实际最大数据值，不向上取整 默认行为：自动 / 继承 `ChartGroup`。 |
| yTicks | `number[]` | — | 数值轴刻度 默认行为：自动 nice ticks / 继承 `ChartGroup`。 |
| yTickCount | `number` | — | 自动 tick 目标数量 |
| yTickFormatter | `(value: number) => string` | — | 数值轴 label 格式化 默认行为：K 格式 / 继承 `ChartGroup`。 |
| showXAxis | `boolean` | — | 是否显示底部轴线与底部 label |
| showYAxis | `boolean` | — | 是否显示左侧 label |
| showGrid | `boolean` | — | 是否显示网格线 |
| showGuides | `boolean` | — | 保留 Chart API 命名；当前不绘制额外 guide |
| showHoverLabel | `boolean` | — | hover / focus 柱体时是否显示数值 label；当 `showHoverPanel=true` 且未显式传入时实际渲染默认关闭 默认行为：按 `showHoverPanel` 推导。 |
| alwaysShowHoverLabel | `boolean` | false | 是否让数值 label 一直显示；与 `showHoverPanel` 同时开启时允许同时显示 |
| adaptiveContrast | `boolean` | — | 自适应黑白对比：按纯色宿主背景与同原点叠加柱体的明暗切换黑色数值；子图显式值优先，彩色序列与彩色节点不改色。明暗分界为 sRGB 灰度 0.5，随当前柱体形状和透明度变化；不支持背景图片或跨图坐标变换。默认开启，可显式关闭；由 Adaptive Contrast 共享能力实现。 默认行为：继承 ChartGroup，否则 `true`。 |
| showHoverPanel | `boolean` | true | 是否开启 Chart hover 面板，内容按当前柱 / cell 自动生成；默认开启，hover / focus 时显示面板；设为 false 时回到数值 hover label，显式 showHoverLabel 优先 |
| hoverPanelVariant | `ChartHoverPanelVariant` | "light" | hover 面板视觉样式 |
| hoverPanelPlacement | `ChartHoverPanelPlacement` | "pointer" | hover 面板定位；支持 anchor / pointer / pin 位置 |
| showHoverPanelLabel | `boolean` | false | 是否在 hover 面板顶部显示当前分类 label |
| hoverMode | `ChartGroupHoverMode` | — | hover 命中模式；`cell` 时按分类中心左右半格生成整格命中区，同一分类单元内的所有柱 / 分段一起响应 |
| activeCellIndex | `number \| null` | — | 受控当前 hover 分类单元；未传时可继承 `ChartGroup` |
| onCellHoverChange | `(index: number \| null) => void` | — | 分类单元 hover 变化回调 |
| valueFormat | `NumberFormatOptions` | — | 柱体数值 label 的组件级数字格式；可设置 `notation: "auto"` / `"compact"` 使用英文 `k/m/b/t` 缩写 默认行为：NumberFormats 默认。 |
| labelFormatter | `( value: number, context: BarChartValueLabelContext, ) => string` | — | 柱体数值 label 自定义格式化；优先级高于全局、组件和数据项 `valueFormat` |
| xLabelAutoCull | `boolean` | — | 按最终显示尺寸减少分类 label；完整文字间距最小 `4px`，首尾仍放不下时全部隐藏；不删除柱体、坐标轴或命中 cell |
| xMaxLabelCount | `number` | — | 分类 label 最大显示数量 默认行为：- / 继承 `ChartGroup`。 |
| valueLabelAutoCull | `boolean` | true | `alwaysShowHoverLabel` 常驻数值是否按最终显示尺寸自动抽稀；hover / focus 数值不受影响 |
| valueMaxLabelCount | `number` | — | 常驻顶部数值最大显示数量 |
| yLabelAutoCull | `boolean` | — | 是否自动减少数值轴 label |
| yMaxLabelCount | `number` | — | 数值轴 label 最大显示数量 默认行为：- / 继承 `ChartGroup`。 |
| colors | `(BarChartColor \| undefined)[]` | — | 调色板；空项回退当前 `colorMode` |
| colorMode | `BarChartColorMode` | "sequence" | Chart 通用颜色模式 |
| color | `BarChartColor` | — | 单色模式主色 |
| monochromeColor | `BarChartColor` | "Primary" | 单色渐浅来源 |
| mutedMonochromeColor | `BarChartColor` | "Black4" | 单色来源 |
| showBaseLayer | `boolean` | false | 是否显示最终尺寸的同色轮廓（影子 / 占位底层），默认不渲染；开启后以 4% 不透明度绘制，不参与出现动效，不改变真实图形、命中区域或时间轴。与 overlay 的后层数据柱无关；横向柱按最终宽度绘制。 |
| appearMotion | `boolean` | true | 是否启用出现动效 |
| appearOnView | `boolean` | true | 是否进入视口后自动播放；同源 iframe 中按最外层同源页面的真实位置判断 |
| appearanceProgress | `number` | — | 受控出现进度 |
| defaultAppearanceProgress | `number` | 0 | 非受控初始出现进度 |
| appearanceDuration | `number` | — | 自动播放总时长覆盖 |
| appearAnchorId | `string` | — | 动效触发锚点 ID |
| appearAnchorPoint | `AnchorPoint` | "top" | 锚点触发位置 |
| appearViewportPoint | `number \| "top" \| "center" \| "bottom"` | 0.7 | 视口触发位置 |
| scrollAppearance | `boolean \| { distance?: number \| string }` | false | 是否启用滚动时间轴；同源 iframe 同时响应外层页面滚动 |
| scrollAppearanceDistance | `number \| string` | 320 | 滚动映射距离 |
| onAppearanceProgressChange | `(progress: number) => void` | — | 出现进度变化回调 |
| loading | `boolean` | — | 数据等待状态。保持声明的画布尺寸、坐标轴和网格，将柱体固定在出现动效起点并暂停交互；变为 false 后按当前视口条件播放出现动效。图表不渲染 Skeleton，也会读取上层 Frame 的 loading 上下文。 |
| children | `Snippet` | — | 图表主体后的自定义内容，无参数；不会替换坐标轴或数据系列。 |
| class | `string` | "" | 根层附加 class |
| style | `string` | "" | 根层附加 style |
| enableResponsive | `boolean` | true | 是否启用 Frame responsive |
| enableContext | `boolean` | true | 是否启用 Frame context |
| enableScaleObserver | `boolean` | false | 是否启用 Frame scale observer |
| enableDefaultMotion | `boolean` | true | 是否启用 Frame 默认动效 |

[类型与状态](./types.md) · [完整组合说明](./reference.md) · [共享 Frame API](../frame/api.md) · [样式覆盖](./styles.md) · [样式选择顺序](../../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F)
