# SearchBox 更新日志

### v1.2.0 (2026-10-23)

- 搜索触发器复用共享单行与间距解析，显式零和字号／间距缩放后仍至少为 4 CSS px，保留较大首选间距与原图标退化态。
- 固定内部三槽位布局，避免响应式 column 或外部关闭 auto layout 破坏已声明的宿主合同；清除、键盘、禁用／只读、外置快捷键与搜索浮层协议不变。

### v1.1.2 (2026-10-20)

- 默认占位和清除名称随 LocaleProvider 切换；显式 placeholder（含空字符串）与 aria-label 优先，查询值保持原样。

- 2026-09-21：统一使用文档、源码属性表与 Site / AI 阅读入口；仅文档修订，不改变组件行为。

### v1.1.1 (2026-08-14)

- SearchBox 根组件默认增加与 Tooltip 一致的 `backdrop-filter: blur(1.25rem)`，并提供 `--snowui-search-box-background-blur-override`。

### v1.1.0 (2026-08-10)

- 新增 `collapseBelow`，可在自身宽度不足时退化为仅 leading 搜索图标；图标态最小宽度等于左右实际 padding + leading Icon 固有宽度。
- 尺寸监听复用 Components 全局 `resizeManager`，页面只负责分配宽度与选择阈值。

### v1.0.3 (2026-05-09)

#### 修复

- 屏蔽 SearchBox 根节点的全局 `focus-visible` outline，避免点击打开后按 Escape 重新出现灰色焦点外圈。

### v1.0.0 (2026-05-08)

#### 新功能

- 新增 搜索框触发器，支持灰底和边框样式。
