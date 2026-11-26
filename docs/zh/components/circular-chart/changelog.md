# CircularChart 更新日志

### v1.4.5 (2026-10-23)

- 共享 HoverPanel 的圆点—名称、名称—数值间距保留 4 CSS px 下限并支持 RTL；保持默认 4px / 8px、较大 Token、图表几何与中心注释。


### v1.4.4 (2026-10-20)

- 内置根名称接入统一 locale；修复显式 aria-label 被默认值覆盖，业务名称与数字格式保持原样。

- 2026-09-21：统一使用文档、源码属性表与 Site / AI 阅读入口；仅文档修订，不改变组件行为。

### v1.4.2 (2026-09-05)

- 扇区 appearance 每帧改为一次线性时间表计算；HoverPanel pointer 与 cell 命中坐标按绘制帧共用一次根层测量。公开 API、扇区 path、动效时长、视觉和交互语义不变。

### v1.4.1 (2026-09-04)

- 零间隔扇区改为通过 alpha paint mask 单次绘制颜色，同时保留 seam cover，减少抗锯齿缝隙并消除半透明 fill / stroke 重叠造成的深色边缘。

### v1.4.0 (2026-09-03)

- 新增 `minWidth`，默认 `"40px"`；与图表宽度相同即可阻止响应式收缩，数字尺寸使用相同单位规则。

### v1.3.1 (2026-09-03)

- 默认响应式支持 flex 并排布局剩余宽度，最小显示宽度固定为 40px；无需手动开启，关闭时保留声明尺寸。

### v1.3.0 (2026-09-03)

- 默认随可用宽度等比缩小图表本体与全部中心内容，空间恢复后回到声明尺寸；`enableResponsive=false` 保留声明尺寸。
- HoverPanel 保持大小，pointer / focus 定位与实际显示尺寸一致。

### v1.2.3 (2026-09-03)

- 常驻 center-label 支持通过直系 segment-value / segment-name 角色显式复用默认中心排版，内容仍由调用方维护；其它自定义内容不受影响。
- 两行角色使用默认居中对齐，并继续支持公开 class / style 和标签 override。

### v1.2.2 (2026-09-03)

- 修复 Loading / Skeleton 或中心显隐切换后，中心节点重新挂载未同步角色识别的问题；常驻 center-label 恢复后不再叠加默认 hover 标签。
- 中心角色识别跟随实际节点生命周期，兼容直接 loading 与上层 Frame 加载状态。

### v1.2.1 (2026-09-03)

- 按现有源码补齐全部 44 个具名 Property 的用途、默认解析、数值单位、回调、中心组合和数据回退边界；未改变运行时行为。

### v1.2.0 (2026-09-03)

- 新增 `showBaseLayer=false`，按需开启最终尺寸的同色轮廓；真实图形和出现动效保持原有行为。

### v1.1.0 (2026-06-04)

- 新增 Chart 通用 `colorMode`：`sequence`、`monochromeFade`、`monochrome`。
- 新增 `color` 主色以及 `monochromeColor` / `mutedMonochromeColor` 细分入口；传入 `color` 后，单色渐浅和单色模式的默认颜色都改为该主色。
- 三种颜色模式均支持 `data[i].color` 与 `colors[i]` 指定扇区自定义颜色。

### v1.0.2 (2026-05-31)

- 间隔改为 path 几何阶段的 `padAngle + padRadius`，淘汰后置 gap mask 与径向短线 mask。
- fill layer 改为完整 padded path 加局部 `revealPath` mask，修复动效填充与占位扇区不重合。
- 圆角统一使用 d3-shape，修复大圆角无效、短弧圆角消失与 hover 裁切问题。
- 补充 ECharts 官网示例、本地源码参考以及本轮问题与解决方法。
- 零间隔多扇区的不透明色增加 `0.5px` 同色 seam cover 与只画描边的 `blur(0.5px)` seam。

### v1.0.1 (2026-05-28)

- 补充完整特性文档：数据形态、扇区绘制、颜色、动效、交互无障碍与 Frame 集成。
- 明确 `cornerRadius` / `separatorWidth` 是 160x160 基准设计值，并按 `size / 160` 等比缩放。
- 明确颜色支持 CSS 变量、`linear-gradient(...)` 字符串和渐变对象；未定义颜色的扇区回退默认序列。
- 记录 4% 同色占位层、透明间隔、反向回退时间轴和组件方法。

### v1.0.0 (2026-05-22)

- 初始实现 圆形图表组件。
- 支持整体尺寸、环厚、圆角、隔断、hover 外侧增厚可调。
- 支持中心 hover 标签、最多 10 项、SnowUI `primary + secondary-*` 颜色序列。
- 接入 Frame 根层、Skeleton、Test 示例与规范登记。
