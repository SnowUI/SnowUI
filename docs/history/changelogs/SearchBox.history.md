# SearchBox 更新日志归档

### v1.1.0 (2026-08-10)

- 新增 `collapseBelow`，可在自身宽度不足时退化为仅 leading 搜索图标；图标态最小宽度等于左右实际 padding + leading Icon 固有宽度。
- 尺寸监听复用 Components 全局 `resizeManager`，页面只负责分配宽度与选择阈值。

### v1.0.3 (2026-05-09)

#### 修复

- 屏蔽 SearchBox 根节点的全局 `focus-visible` outline，避免点击打开后按 Escape 重新出现灰色焦点外圈。

### v1.0.0 (2026-05-08)

#### 新功能

- 新增 搜索框触发器，支持灰底和边框样式。
