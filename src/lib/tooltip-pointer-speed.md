# tooltip-pointer-speed.ts

> **版本**: v1.0.0
> **职责**: 为可见共享 Tooltip 提供短时、平滑的鼠标速度样本。

由 Tooltip 唯一共享宿主按需创建 `trackTooltipPointerSpeed(document)`，返回 `read()` 与 `destroy()`。仅采样主鼠标指针的 client 坐标与宿主时钟；不读布局、不写 DOM、不驱动 Svelte 状态，也不启动 timer / rAF。事件间隔不足 1ms 时不消费样本，速度峰值限制为 4px/ms，以 32ms 指数平滑过滤抖动；间隔或样本年龄超过 100ms 即失效。

Tooltip 隐藏、宿主卸载、平滑移动关闭或 reduced-motion 时销毁。模块导入没有浏览器副作用；受控 Tooltip 不建立该监听。速度只用于每个新目标开始时缩短协调时程，公式归 Tooltip motion preset；不改变首次显示延迟，也不因速度跳过连续裁切。
