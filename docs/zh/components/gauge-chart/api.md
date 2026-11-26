# GaugeChart API

来源指纹：d4bb5aae5a5133f1。仅列本组件具名属性；未重新声明的基础能力按继承来源查询。

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| data | `GaugeChartItem[]` | DEFAULT_DATA | 比例数据数组；每项必填 name（名称）与 value（有限正数），可选 color、percentFormat。按输入顺序过滤非正数和非法值，再取前 maxItems 项；百分比分母是实际显示项之和。省略 `data` 时使用内置示例数据；显式空数组或全部无效时保留最终尺寸并渲染空图表。 默认行为：内置 5 项示例数据。 |
| width | `number \| string` | 320 | 整体宽度，推荐正数（px 设计值转 rem）；字符串直接作为 CSS 长度，但 SVG 几何仅以 parseFloat 提取数值，不换算单位，不支持可靠的百分比、calc() 或 CSS 变量几何。 |
| minWidth | `number \| string` | `${SECTOR_CHART_MIN_WIDTH}px` | 响应式最小显示宽度；数字与 width 使用相同的 px 设计值转 rem 规则，字符串直接作为 CSS 长度。默认固定 40 CSS px；设为与 width 相同可阻止自动缩小，设为更小值允许缩到该下限。仅 enableResponsive=true 时生效。 |
| height | `number \| string` | 160 | 整体高度，推荐正数（px 设计值转 rem），通常为 width 的一半；改变高度会改变圆心与可用半径。字符串解析限制与 width 相同。 |
| ringThickness | `number \| string` | 32 | 环厚，推荐非负数字（px 设计值）；内半径为 max(0, 外半径 − 环厚)。外半径为 max(1, min(width / 2, height) − hoverThicknessGrowth − 1)，环厚达到它时形成实心半饼图。字符串仅提取数值，不换算单位。 |
| cornerRadius | `number \| string \| "auto"` | "auto" | 扇区端部圆角；非负数值或数字字符串表示 320px 宽基准的 px 设计值，按 width / 320 缩放；auto 使用基准值 4。最终受环厚和扇区角度限制；0 为直角。 |
| separatorWidth | `number \| string \| "auto"` | "auto" | 扇区间透明隔断；非负数值或数字字符串表示 320px 宽基准的 px 设计值，按 width / 320 缩放；auto 使用基准值 2，0 关闭间隔。通过路径几何留空，透出真实背景。 |
| colors | `(GaugeChartColor \| undefined)[]` | — | 按过滤后显示索引覆盖颜色；每项支持语义色、CSS 颜色/变量、linear-gradient 字符串或 { type?, angle?, stops } 渐变对象。undefined 空位回退当前 colorMode；数据项 color 优先于调色板。不支持背景 utility 类名。 |
| colorMode | `GaugeChartColorMode` | "sequence" | sequence 按 Primary 与 9 个 Secondary 色序循环；monochromeFade 使用同一主色从首项 100% 均匀降至末项 20%（单项为 100%）；monochrome 所有项使用同一颜色。三种模式均允许数据项和调色板逐项覆盖。 |
| color | `GaugeChartColor` | — | 同时覆盖 monochromeFade 与 monochrome 的回退主色，优先于 monochromeColor / mutedMonochromeColor；sequence 不使用它。支持与数据项 color 相同的纯色、语义色和渐变。 |
| monochromeColor | `GaugeChartColor` | "Primary" | 仅在 monochromeFade 且未传 color 时使用的回退主色；支持纯色和渐变。透明度从首项 100% 降到末项 20%，数据项 color 与 colors 仍优先。 |
| mutedMonochromeColor | `GaugeChartColor` | "Black4" | 仅在 monochrome 且未传 color 时使用的回退色；默认 Black4 是主题自适应的低对比色，扇区填充自身不再降低透明度。数据项 color 与 colors 仍优先。 |
| hoverThicknessGrowth | `number \| string` | 4 | hover / focus 时向外增厚的非负 px 设计值；内半径与圆心不变，0 关闭几何增厚但保留数据提示。字符串只提取数值，不按 width / 320 缩放；没有 hoverScaleSize 别名。 |
| startDirection | `StartDirection` | "left" | left 从左端开始向右揭示，right 从右端开始向左揭示；只改变出现顺序和扫描方向，不旋转数据排布。 |
| showBaseLayer | `boolean` | false | 是否显示最终几何的同色 4% 透明度底层；默认不渲染。开启后底层不参与出现动效与命中，便于观察填充进度；不改变真实扇区和数据。 |
| appearMotion | `boolean` | true | 是否启用图形出现动效；false 时直接显示完整填充，并使 replay / reverseAppearance 不播放。此开关不关闭独立的 hover 增厚反馈。 |
| appearOnView | `boolean` | true | 非受控模式中，锚点到达指定视口位置时自动播放一次；同源 iframe 中按最外层同源页面的真实位置判断。false 可改用实例方法播放。appearanceProgress 优先；scrollAppearance 开启时由滚动驱动。 |
| appearanceProgress | `number` | — | 受控填充进度，数值限制到 0..1；提供后显示由调用方决定，自动播放和实例播放方法不改变受控画面。appearMotion=false 仍直接完整显示；外部进度变化不会触发 onAppearanceProgressChange。 |
| defaultAppearanceProgress | `number` | 0 | 非受控模式首次初始化的进度，限制到 0..1，只读取一次；后续改变此属性不重置动画。有 appearanceProgress 时不决定画面；默认 0 为描边态。 |
| appearanceDuration | `number` | — | 实例播放与自动出现的总时长，单位 ms；未传时固定 1000，不随扇区数改变。非正数在下一动画帧直接到终点；不改变滚动或受控进度映射。 |
| appearAnchorId | `string` | — | 页面内触发锚点元素的 id；未传时使用图表根元素，传入不存在的 id 不回退根元素。仅用于自动出现或滚动时间轴，不改变图表位置。 |
| appearAnchorPoint | `AnchorPoint` | "top" | 选用锚点的 top（顶部）、center（垂直中心）或 bottom（底部）与视口触发线比较；不影响扇区绘制方向。 |
| appearViewportPoint | `number \| "top" \| "center" \| "bottom"` | 0.7 | 视口触发线：数字限制到 0..1，或使用 top=0、center=0.5、bottom=1。默认 0.7 为视口高度 70%；配合 appearAnchorPoint 决定触发/滚动起点。 |
| scrollAppearance | `boolean \| { distance?: number \| string }` | false | true 开启 window 滚动驱动的非受控时间轴；同源 iframe 同时响应外层页面滚动。对象可用 distance 覆盖滚动距离。锚点越过触发线后进度由距离决定，向回滚动会逆向恢复。不监听嵌套 ScrollArea；appearanceProgress / appearMotion=false 优先。 |
| scrollAppearanceDistance | `number \| string` | 320 | 滚动进度从 0 到 1 所需的 CSS px 距离；数字或数字字符串，最低按 1 处理。scrollAppearance.distance 优先；只在滚动时间轴开启时生效，不换算字符串单位。 |
| onAppearanceProgressChange | `(progress: number) => void` | — | 内部进度写入时接收 progress（0..1），包括初始化中的直接完成、自动播放、实例方法与滚动更新；可同步外部进度读数。默认值初始化本身不通知；不用于监听外部 appearanceProgress，返回值被忽略，不能取消更新。 |
| maxItems | `number` | 10 | 过滤后保留的前 N 项数量，不排序、不自动合并 Other；取整并限制到 1..28，0 / NaN 回退 10。百分比只基于保留项，超过 28 类的业务应先聚合小类以保留总量；全无效时渲染空图表。 |
| showCenterLabel | `boolean` | true | 是否渲染中心内容区域；false 同时隐藏默认动态标签、segment-value / segment-name 模板与静态 center-label。隐藏中心不关闭显式启用的 HoverPanel。 |
| centerTitle | `string` | "" | 无 hover / focus 项时显示的中心标题，复用默认数值行排版；悬停或聚焦扇区时被百分比或 labelFormatter 第一行替换，离开后恢复。空字符串不占标题行；showCenterLabel=false 隐藏，静态 center-label 优先。 |
| centerSubtitle | `string` | "" | 无 hover / focus 项时显示的中心副标题，复用默认名称行排版；悬停或聚焦时被当前项名称或 labelFormatter 第二行替换，离开后恢复。可单独设置；不生成 HoverPanel 数据。 |
| hoverMode | `ChartHoverMode` | "cell" | cell 按环带角度命中，跨过透明隔断仍保持所属扇区，排除中心空洞与图外；item 只响应扇区路径命中。两种模式均保留扇区键盘 focus 提示。 |
| showHoverPanel | `boolean` | true | 默认根据当前 hover / focus 扇区显示结构化面板，同时保留动态中心标签。false 关闭面板；但存在可见静态 center-label 时组件自动启用面板承载扇区信息。 |
| hoverPanelVariant | `ChartHoverPanelVariant` | "light" | 面板视觉：light 为默认浅色玻璃样式，dark 为深色样式，surface 为主题表面样式；仅改变面板外观，不改变数据和命中。 |
| hoverPanelPlacement | `ChartHoverPanelPlacement` | "pointer" | 面板位置：pointer 跟随指针；anchor-top / anchor-side 相对当前指针点定位（键盘焦点使用图心）；pin-top-left / pin-top / pin-top-right / pin-right / pin-bottom-right / pin-bottom / pin-bottom-left / pin-left / pin-center 固定在图表对应位置，边缘保留 8px 并参与视口碰撞处理。 |
| showHoverPanelLabel | `boolean` | false | 是否在面板行数据上方额外显示当前扇区名称；false 只显示数据行。仅面板开启且存在当前项时有可见效果。 |
| percentFormat | `NumberFormatOptions` | — | 中心百分比、面板百分比与扇区 aria-label 的数字格式；支持 fractionDigits、locale 等 NumberFormatOptions。优先级为数据项 percentFormat → 本属性 → NumberFormatContext → 默认一位小数；labelFormatter 只覆盖中心文本。 默认行为：NumberFormats 百分比默认。 |
| labelFormatter | `(item: GaugeChartItem, percent: number) => string` | — | hover / focus 时接收 item（当前有效数据项）与 percent（0..100 百分数），返回中心文字；以换行拆成数值行与名称行，最多使用两行。静态 center-label 或 showCenterLabel=false 时不调用；不改变面板和扇区 aria-label 的百分比。 |
| loading | `boolean` | — | 数据等待状态。保留 `width` / `height` 对应的最终占位和中心内容，将扇区固定在出现动效起点并暂停交互；变为 false 后按当前视口条件播放出现动效。图表不渲染 Skeleton，也会读取上层 Frame 的 loading 上下文；显式空 `data={[]}` 不回退默认演示数据。 |
| children | `Snippet` | — | 无参数 Snippet，渲染在 showCenterLabel=true 的中心区域。直系 Text as="segment-value" / "segment-name" 是动态标签模板，由组件写入当前两行文字；直系 Frame as="center-label" 提供常驻内容并自动启用面板。静态内容不自动套用默认中心排版；只需默认文字时无需传 children。中心用于展示，不用于交互工具栏。 |
| class | `string` | "" | 追加到图表根 Frame 的 class 字符串；不传时为空。仅表达调用方公开根样式，不穿透内部 SVG 和标签结构。 |
| style | `string` | "" | 追加到根 Frame 的 inline style 字符串，在组件注入的变量之后合并。可表达外部布局；图表几何优先使用 width、height、ringThickness 等公开 Props。 |
| enableResponsive | `boolean` | true | 默认在容器放不下时等比缩小图表本体，支持 flex 并排收缩，最小显示宽度由 minWidth 决定（默认 40px），与图表宽度相同时不收缩；HoverPanel 不缩放；false 保留声明尺寸。也透传至 Frame。 |
| enableContext | `boolean` | true | 透传 Frame 的上下文能力开关；当前组件自己的 width、height、颜色与出现进度仍由对应 Props 决定。 |
| enableScaleObserver | `boolean` | false | 透传 Frame 的旧版尺寸观察兼容能力，默认关闭；不等同于百分比图表尺寸，不建议新示例依赖此迁移期入口。 |
| enableDefaultMotion | `boolean` | true | 透传 Frame 默认外层动效能力；不接管图表内部出现时间轴和扇区 hover 增厚，后者分别由 appearMotion / appearanceProgress 与 hoverThicknessGrowth 控制。 |

[类型与状态](./types.md) · [完整组合说明](./reference.md) · [共享 Frame API](../frame/api.md) · [样式覆盖](./styles.md) · [样式选择顺序](../../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F)
