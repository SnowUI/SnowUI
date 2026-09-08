# Text Motion 动画交接

`animation.ts` 为 SlotText 与 FlowText 提供内部 WAAPI 交接工具，参数由各组件的视觉实现决定，不是公开 API。

- `animateTextMotionDelta`：更新逻辑终点，将旧逻辑终点到新终点的差值叠加到未结束的动画上。
- `animateTextMotionFace`：同样的差值机制用于`transform` 中的位移与旋转，避免槽位逐帧重算 CSS 变量。
- `animateTextMotionOpacity`：从当前显示透明度交接，替换旧透明度通道，不取消位移动画。
- 差值完成后不保留填充效果；组件拥有退出节点与卸载清理。内部动画不写入根 Frame 的视觉属性。
- NumericText 保留自己的原始替换机制，不消费本模块。
