# tooltip.ts 文档

> **版本**: v1.6.1
> **职责**: 提供 Tooltip 出现 / 消失 preset。

`TOOLTIP_APPEAR_MOTION`、`getTooltipAppearMotion()` 与 `TOOLTIP_DISAPPEAR_MOTION` 专用于 Tooltip Foreground，不与 dropdown overlay 或 Dialog 共用。

## 来源

参考 `transitions.dev-main` Tooltip 的 opacity + 轻微 scale 与快速退出；SnowUI 将该出现动效限定在独立 Foreground，承载毛玻璃的 Portal / Backdrop 保持稳定，确保背景采样和渐显同时成立。

## 使用规则

1. Tooltip 出现 / 消失动效引用本 preset。
2. 出现时必须通过 `getTooltipAppearMotion(position)` 根据最终 placement 生成定向位移：top 从下向上、bottom 从上向下、left 从右向左、right 从左向右。
3. Tooltip 首次 hover 延迟不在本文件，归 `lib/overlay-trigger-timing.ts`。
4. 退出卸载时间使用 `TOOLTIP_DISAPPEAR_TOTAL_MS`。
5. 连续切换的宽度变化使用 `getTooltipWidthSpringProgress()`；该曲线只控制宽度，不替换位置、高度或内容进度。

## 问题与修复记录

### 2026-08-12：Tooltip 已出现后毛玻璃才逐渐清晰

- **问题位置**：Playground Test Sidebar Footer 的 Tooltip；共享 preset 为 `components/src/motion/presets/tooltip.ts`，可见表面为 `Tooltip.svelte` 的 `.snowui-tooltip-content`。
- **触发条件**：OSS Tooltip 默认生命周期动效启用，默认 light Tooltip 覆盖相邻 Icon；hover 延迟结束后观察 Tooltip 出现的前 150ms。
- **现象与证据**：首帧计算样式已经是 `backdrop-filter: blur(20px)`，但 Portal 的 opacity 从 0 渐增。实测 hover 后 500ms、520ms、540ms 的 Portal opacity 约为 `0.03`、`0.29`、`0.58`，模糊对比度随父层透明度一起被削弱，视觉上晚于文字轮廓。
- **根因**：滤镜没有延迟，也不是性能不足；浏览器先生成 backdrop-filter 结果，再把整个 Portal 按父层 opacity 合成。低 opacity 下模糊结果与原背景混合，必须到渐显后段才容易辨认。
- **修改内容**：`TOOLTIP_APPEAR_MOTION` 移除 opacity 与 80ms delay，只保留 `0.98 → 1` 的轻微 scale；Tooltip 可见首帧即以完整 opacity 合成背景、文字和毛玻璃。退出 preset 保留快速 opacity + scale。
- **影响面**：所有启用 Tooltip 生命周期增强的出现态；不改变首次 hover 延迟、共享 warmup/cooldown、定位、尺寸变化、移动、默认变体或退出动效。
- **验证方式**：真实 Test Sidebar hover 后逐帧读取 Portal opacity、content backdrop-filter 与 transform；首个可见采样应同时满足 opacity `1`、blur `20px`，scale 可继续从 `0.98` 过渡到 `1`。
- **回退约束**：不得把 opacity 渐显重新放到承载 backdrop-filter 的祖先。未来如需恢复 fade，必须建立不包裹毛玻璃表面的独立前景层，并验证背景采样在首帧保持完整。

### 2026-08-12 复测：移除 opacity 后 Test Footer 仍存在模糊延迟

- **问题位置**：同一 Test Sidebar Footer 三个按钮的 Tooltip；`Tooltip.svelte` 的 Portal ready 时序与 `TOOLTIP_APPEAR_MOTION`。
- **触发条件**：应用 v1.1.0 opacity 修复后冷启动任一 Footer Tooltip，观察第一个可见帧到 150ms scale 结束之间的实际像素。
- **现象与证据**：计算样式首个可见采样已经同时为 opacity `1`、blur `20px`，但用户真实复测仍能看到明显模糊延迟，证明剩余问题不在 CSS 值，而在新建 backdrop 合成层与祖先 transform 同帧启动的实际栅格化。
- **根因**：Portal 完成挂载和定位后在同一帧切换 `data-ready=true`，同时启动 `0.98 → 1` transform；浏览器没有稳定的预绘制帧来建立 backdrop 采样层。
- **修改内容**：出现 preset 清空所有视觉通道；Portal 定位后保持一个不可见 requestAnimationFrame，再整体显示；Tooltip 表面在挂载期间声明 `will-change: backdrop-filter`，帮助浏览器预建小型合成层。
- **影响面**：Tooltip 冷启动出现态；快速切换继续复用已显示 Portal，定位、尺寸和移动规则不变；退出仍为 50ms opacity + scale。
- **验证方式**：Test Footer 三个按钮分别执行冷启动与连续切换；首个可见帧应为 opacity `1`、transform `none`、blur `20px`，并人工确认相邻 Icon 从 Tooltip 出现首帧起即被模糊。
- **回退约束**：不得在 backdrop-filter Portal 或祖先恢复出现态 opacity / transform。若未来需要进入动效，应只作用于与毛玻璃表面并列、且不包裹它的前景内容层。

### 2026-08-12：恢复 opacity 的分层实现

- **问题位置**：`Tooltip.svelte` 的 Portal / size shell / content 子树和 `TOOLTIP_APPEAR_MOTION`。
- **触发条件**：产品需要保留 Tooltip opacity 出现效果，同时要求 Test Footer 相邻 Icon 从 Tooltip 首帧起即被完整模糊。
- **现象与证据**：opacity 或 transform 作用在 Portal / Backdrop 祖先时会削弱或推迟实际滤镜；完全移除出现动效虽可规避，但丢失 Tooltip 原有渐显语义。
- **根因**：动效层与背景采样层共用同一合成祖先，两个视觉目标无法独立控制。
- **修改内容**：size shell 内新增稳定 `.snowui-tooltip-backdrop` 与绝对定位 `.snowui-tooltip-foreground`；blur 只在 Backdrop，背景色和内容只在 Foreground。出现 / 退出 preset 移到 Foreground，Portal 仅定位、预绘制和移动。
- **影响面**：Tooltip 内部 DOM 增加一个 Backdrop 与一个 Foreground 层；公开 Props、尺寸、padding、gap、圆角、定位、Portal 复用与默认变体不变。
- **验证方式**：Test Footer 三按钮冷启动和连续切换；首个可见帧 Backdrop 为 opacity `1` / blur `20px` / transform `none`，Foreground 从 opacity `0 → 1`、scale `0.98 → 1`。
- **回退约束**：生命周期 opacity / transform 只能作用于 Foreground，不得上移到 Portal、size shell、Backdrop 或它们的共同祖先。

## 变更记录

- v1.6.1 (2026-08-21): 宽度弹性改为独立 `800ms` 时间线，快速重定向为 `480ms`；不再把参考页约 `0.8s` 的回弹压缩进位置的短时间线。
- v1.6.0 (2026-08-21): 参考 beUI Pro Morphic Tooltip 的宽度弹性，增加归一化欠阻尼曲线；约在进度 `45%` 越过目标 `4%` 后回弹，并在既有时间线结束帧精确收敛。
- v1.5.0 (2026-08-21): Tooltip Foreground 以 `110ms` 从 `0.94` 放大到 `1`，并新增按最终 placement 朝 Tooltip 位置移动的 `2px` 定向滑入；transform origin 对齐触发器侧边中心。
- v1.4.0 (2026-08-20): Tooltip 生命周期动效改为 OSS 默认能力；preset 数值和分层边界不变。
- v1.3.0 (2026-08-12): 采用稳定 Backdrop + 动画 Foreground 分层，恢复 opacity + scale 出现效果，同时保持首帧完整毛玻璃。
- v1.2.0 (2026-08-12): 根据 Test Footer 真实复测，进一步移除出现态 scale，并由 Tooltip 在可见前提供一个预绘制帧；退出动效不变。
- v1.1.0 (2026-08-12): 出现态移除 Portal opacity 与额外 delay，仅保留轻微 scale，使 Tooltip 和毛玻璃在同一可见首帧生效。
- v1.0.0 (2026-06-18): 新增 Tooltip preset。
