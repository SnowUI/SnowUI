# Tooltip 动效感知关闭

`tooltip-motion-dismiss.ts` 是 Tooltip 的 OSS 共享行为能力，用于在触发元素或其祖先开始位置、尺寸动效时立即隐藏已经显示的 Tooltip，避免 Portal 在目标移动期间重新定位而产生跳动。

## 行为

- Tooltip 默认通过 `dismissOnMotion={true}` 接入。
- 监听 CSS `transitionrun` 与 `animationstart`；`transitionrun` 只接受会改变几何位置或尺寸的属性，颜色、背景与透明度过渡不会触发关闭。
- 触发器自身或祖先开始 CSS animation 时立即关闭 Tooltip，因为这两类目标可能直接改变锚点。
- 后代 CSS animation 不关闭 Tooltip。关键帧事件不提供属性名，后代 Logo / Icon 的装饰动效不能被推断为触发器锚点位移。
- 后代的几何 `transitionrun` 仍会关闭 Tooltip，因为后代尺寸或位置过渡可能改变触发器的 border box。
- 动效关闭跳过 Tooltip 的退出动效，确保目标的第一帧位移前浮层已经卸载。
- 非受控 hover Tooltip 关闭后需要重新进入触发器才会再次显示；受控 `open` 模式继续由外部状态完整拥有。

## 性能边界

- 页面没有已显示 Tooltip 时不注册任何动效监听器。
- 同一 `document` 只注册一组 capture 监听器。
- 动效事件发生时只遍历当前已显示的 Tooltip；常见页面通常只有一个共享 hover Tooltip。
- 不使用逐帧 `getBoundingClientRect()`、`ResizeObserver` 或 `MutationObserver`。

## 问题与修复记录

### 2026-08-12：StyleButton 的 SnowUI Logo hover 导致 Tooltip 间歇消失

- **问题位置**：Test 项目 Sidebar Footer 的 `StyleButton`；共享入口为 `components/src/lib/tooltip-motion-dismiss.ts`。
- **触发条件**：先显示相邻按钮 Tooltip，使共享 hover 进入 warm 状态，再快速移入 `StyleButton`；Tooltip 立即出现后，`SnowUILogo` 的五个内部图形启动 hover keyframes。
- **现象与证据**：Tooltip 可在移入后短暂出现，随后收到 Logo 后代的 `animationstart` 并立即卸载；Apple Logo 是静态 SVG，因此另一状态不复现。冷启动时 Logo animation 早于 450ms 首次延迟发生，Tooltip 反而可正常出现，形成“时常无法触发”的表象。
- **根因**：初版能力把触发器后代的任何 `animationstart` 都当成锚点运动。CSS `AnimationEvent` 不提供动画属性名，装饰性后代 transform 与真正移动触发器的动画被错误合并。
- **修改内容**：animation 只匹配触发器自身或祖先；后代 animation 被忽略。几何 `transitionrun` 仍匹配触发器、祖先和后代，以保留后代布局变化可能移动触发器 border box 的原保护。
- **影响面**：所有使用默认 `dismissOnMotion={true}` 且触发内容包含动画 Logo / Icon 的 Tooltip；不改变 Tooltip 外观、hover 延迟、PRO 共享 Portal 或触发器/祖先运动时的关闭行为。
- **验证方式**：在 Test Sidebar 依次触发相邻 Tooltip 与 StyleButton Tooltip，等待 SnowUI Logo hover keyframes 完整启动后 Tooltip 仍保持可见；另验证触发器/祖先 animation 与后代几何 transition 仍立即关闭。
- **回退约束**：不得恢复“所有后代 animation 一律关闭”。若未来必须识别会改变宿主布局的后代 keyframes，应新增显式语义或可判定的几何协议，而不是从无属性信息的 `animationstart` 猜测。
