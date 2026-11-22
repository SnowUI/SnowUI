# Indicator 更新日志归档

### v1.2.0 (2026-07-28)

- 保持 reveal host 任意区域 hover 即显示 Indicator。
- 重叠检测由整条 scrollbar 轨道改为实际 Thumb，并响应 ScrollArea hover、滚动、Thumb 拖动与 opacity transition。
- Indicator 与可见 Thumb 重叠时完全退出 Pointer、hover、拖拽和键盘命中，确保滚动条获得唯一交互优先级。

### v1.1.0 (2026-07-28)

- line 新增 `hitAreaPadding`，允许消费方把全边命中带收窄为视觉条附近的局部范围。
- Indicator 与同一 resize target 内的可见 SnowUI overlay scrollbar 重叠时自动隐藏并停止截获指针。

### v1.0.1 (2026-07-12)

- line 命中带默认铺满所在边缘全高（width）/ 全宽（height）：改为 absolute + top/bottom 或 left/right 贴边，不再用 pin 居中；视觉短条与命中带分层。

### v1.0.0 (2026-06-21)

- 合并 WidthIndicator、HeightIndicator 与 ResizeHandle。
- 新增宿主 hover 显隐、line / corner 视觉、Pointer / 键盘 / ARIA 完整协议。
