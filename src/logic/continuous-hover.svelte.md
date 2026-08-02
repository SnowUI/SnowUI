# ContinuousHoverController

容器级连续 hover 能力。容器只创建一个绝对定位背景层，并在符合 `selector`
的可交互项之间移动；项目间存在间隙时选择最近项，因此不会先消失再出现。

## 契约

- `attach(host, { selector, layerClass, axis, enabled, overlayHost, geometryMode })` 挂载能力。
- `enabled` 默认 `true`；关闭后移除能力标记和视觉节点，并恢复组件原有逐项 hover。
- `followActive` 默认 `false`；Listbox 可开启，让 `data-active="true"` 的键盘高亮复用同一层。
- 自动排除 disabled、filtered、hidden、skeleton 与 loading-spinner 项。
- pointer 离开容器时淡出；键盘焦点进入候选项时复用同一背景层。
- 尺寸变化和滚动时重新测量；不创建组件私有 `ResizeObserver`。
- `overlayHost` 允许 `tbody` 等语义容器把视觉层放到合法祖先。
- pointermove 合并为每帧一次且只消费最后一次鼠标位置；滚动 / 尺寸更新不会覆盖待处理的鼠标目标。
- 直接命中项只测量当前项的当帧真实位置；项目间隙才刷新并扫描集合几何。
- `geometryMode="direct"` 用于 TableBody 这类无间隙连续项目：不登记逐项 ResizeObserver、不缓存 / 扫描全部项目几何；`:scope > ...` 收集选择器会转换为可供 `closest()` 使用的直接命中选择器。
- 项目集合只在结构 / 可用状态变化时重建，滚动与尺寸变化只刷新几何缓存。
- pointer 离开时丢弃尚未执行的移动，避免下一帧回到旧项；连续移动不额外创建显隐动画帧。

视觉颜色、圆角和层级由接入组件的 `layerClass` 声明；控制器不拥有组件视觉。
