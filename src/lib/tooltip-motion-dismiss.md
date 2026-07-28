# Tooltip 动效感知关闭

`tooltip-motion-dismiss.ts` 是 Tooltip 的 OSS 共享行为能力，用于在触发元素或其祖先开始位置、尺寸动效时立即隐藏已经显示的 Tooltip，避免 Portal 在目标移动期间重新定位而产生跳动。

## 行为

- Tooltip 默认通过 `dismissOnMotion={true}` 接入。
- 监听 CSS `transitionrun` 与 `animationstart`；`transitionrun` 只接受会改变几何位置或尺寸的属性，颜色、背景与透明度过渡不会触发关闭。
- 动效目标是 Tooltip 触发元素、触发元素的祖先或后代时，立即关闭 Tooltip。
- 动效关闭跳过 Tooltip 的退出动效，确保目标的第一帧位移前浮层已经卸载。
- 非受控 hover Tooltip 关闭后需要重新进入触发器才会再次显示；受控 `open` 模式继续由外部状态完整拥有。

## 性能边界

- 页面没有已显示 Tooltip 时不注册任何动效监听器。
- 同一 `document` 只注册一组 capture 监听器。
- 动效事件发生时只遍历当前已显示的 Tooltip；常见页面通常只有一个共享 hover Tooltip。
- 不使用逐帧 `getBoundingClientRect()`、`ResizeObserver` 或 `MutationObserver`。
