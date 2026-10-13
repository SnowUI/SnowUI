# 响应式项目渐隐与停留恢复

权威行为见 [MotionPresetSpec §2.3](../../../specs/maintainers/MotionPresetSpec.md#23-响应式项目收起)。Table／DataTable 与 OverflowActions 使用同一实现。

## 纯进度计算

`getResponsiveExitOpacity(availableWidth, requiredWidth, fadeDistance)` 返回 0～1 的线性进度。三个参数均为同一 CSS 像素坐标系；`requiredWidth` 是下一次收起项目的阈值，`fadeDistance` 由宿主实测 `--size-5`。Table 的可用宽度含原生布局容差；OverflowActions 的预算包含 More、Separator 与 compact 状态。

## 宿主级恢复控制器

`createResponsiveExit(onRecover)` 每个表格或操作组创建一个实例。`update(width, required, distance, key)` 返回当前进度；key 标识本次待收起项目集合，空字符串表示没有待收起项目。宿主在正常布局更新时调用 update，恢复回调只更新当前目标的视觉透明度。

同一目标下有效宽度停止变化 1s 后，用 `RESIZE_MOTION` 时长恢复到进度 1；恢复中或完成后再次缩窄，从当前进度接续至隐藏阈值。重复测量不重置计时，目标集合改变则清理旧状态。`destroy()` 取消计时器和恢复帧，销毁时必须调用。无目标不启动计时，不增加尺寸观察器或全局监听。控制器不测量 DOM、不决定隐藏顺序、不改变布局、不接管焦点或位移动画。

Table 只更新内容的透明度因子，保留表头的弱化语义及完整背景、分隔线和圆角。OverflowActions 更新按钮视觉壳，测量副本、整组背景、Separator 与 More 不受影响；菜单展开冻结布局，但透明度仍可恢复。减少动效由宿主 CSS 保持完全可见直到直接收纳。

验证入口：Playground 的 `table-responsive.spec.ts` 与 `overflow-actions-responsive.spec.ts`，覆盖宽度进度、停留恢复、再次缩窄、隐藏语义、More 预算、对齐位移和减少动效。
