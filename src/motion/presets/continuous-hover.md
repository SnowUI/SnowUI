# Continuous Hover Motion

`CONTINUOUS_HOVER_MOTION` 是连续 hover 背景在项目间移动和改变尺寸时使用的语义预设。

- 移动 / 尺寸 duration：60ms
- 首次显隐响应 duration：0ms
- easing：standard `cubic-bezier(0.22, 1, 0.36, 1)`
- 首次进入只淡入，不从上次离开的位置飞入
- `prefers-reduced-motion: reduce` 下关闭过渡
- pointermove 每帧只消费最后一次鼠标位置，且优先于同帧的滚动 / 尺寸刷新。
- 直接命中项只测量当前项的当帧真实位置；只有经过间隙时才刷新并扫描集合几何。
