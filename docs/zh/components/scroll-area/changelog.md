# ScrollArea 更新日志

### v1.4.1 (2026-10-20)

- 滚动viewport默认名称随LocaleProvider更新，显式ariaLabel优先；children保持调用方内容。

- 2026-10-08：整条 Overlay 轨道触发 hover；点击空白轨道定位滑块中心并支持继续拖动，取消捕获和卸载时清理交互。

- 2026-09-21：统一使用文档、源码属性表与 Site / AI 阅读入口；仅文档修订，不改变组件行为。

### v1.4.0 (2026-09-18)

- 新增 `horizontalScrollbarVisibility`；横向滚动条可选择仅在 ScrollArea hover 时显示，默认仍为溢出时常显。

### v1.3.0 (2026-09-01)

- 新增 `horizontalTrackPosition="viewport"`，长横向内容经过页面视口时保持横向轨道可达，同时仍由当前 ScrollArea 独占横向滚动。

### v1.2.0 (2026-07-22)

- 纵向 Thumb 保持常态 4px 视觉宽度，同时将常态 hover 命中宽度扩大到 hover 状态的 8px，降低指针命中难度。

### v1.1.0 (2026-06-21)

- 纵向滚动条默认隐藏，鼠标移入 ScrollArea 区域时使用 Frame 默认动效渐显、移出时渐隐；横向滚动条保持溢出时常显。

### v1.0.0 (2026-06-21)

#### 新功能

- 新增纵向、横向和双轴 SnowUI 自建滚动区域。
- 将页面/容器使用所需的 viewport、轨道、Thumb 和拖动逻辑封装为声明式组件。
