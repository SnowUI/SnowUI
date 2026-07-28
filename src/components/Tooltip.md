# Tooltip.svelte 文档

> **版本**: v1.6.17
> **职责**: 文字提示组件，在悬停时显示额外信息。

**能力**: 支持通用交互与动效能力 (交互、动效、响应式)。

> **实现**: Tooltip 使用 Portal 模式渲染到 `document.body`；默认包含 hover 延迟、立即隐藏、视口边缘碰撞避让，以及参考 transitions.dev Tooltip 的生命周期动效。PRO 包可通过 `registerTooltipBehaviorEnhancement` 增强平滑移动和尺寸动效；非受控 hover 模式会复用页面级共享 Portal 外框，尺寸外壳消费 Frame size motion bridge 执行外框形态变化。

## 组件特有属性 (Component-Specific Props)

| 属性 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| position | 'top'\|'bottom'\|'left'\|'right' | 'top' | 弹出方向 |
| open | boolean | undefined | 手动控制显示状态 (可绑定) |
| offset | number | 4 | 与触发器的距离 (px) |
| variant | 'dark'\|'light' | 'light' | Tooltip 外观变体，默认 light，可显式切换为 dark |

## 关键字 (Keyword)

| 关键字 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| position | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | 弹出位置 |
| as | `'tooltip'` | - | 角色化：作为父组件的提示层 |

## 使用示例

```svelte
<!-- 基础使用 (父元素为触发器) -->
<Icon icon={Info} >
    <Tooltip as="tooltip">更多信息</Tooltip>
</Icon>

<!-- 手动控制 -->
<Button>
    Hover
    <Tooltip open={showTip}>提示内容</Tooltip>
</Button>

<!-- 空 Tooltip：自动抓取父元素文本 -->
<Text lines={1}>
    这是一段会被截断的文本
    <Tooltip as="tooltip" />
</Text>
```

## 布局模型

主布局模型：**内联外壳布局**。定义见 [../../../specs/LayoutProtocol.md §12.4](../../../specs/LayoutProtocol.md)。

Tooltip 的 Portal、定位、碰撞翻转属于组件行为；可见气泡内容本身按内联外壳布局管理：

- `.snowui-tooltip-content` 是 inline-level 外壳，内容整体 Hug。
- 子内容通过 `gap` 自然排列，不提供 Content Fill。
- 气泡自身负责 padding / gap / radius / font-size / line-height，并通过 `--snowui-tooltip-*-override` 变量允许外部覆盖。
- `white-space: nowrap` 是 Tooltip 气泡的稳定尺寸策略，避免提示内容在默认场景下折行导致定位抖动。
- Tooltip 自身 `pointer-events: none`，交互命中由触发器处理，不属于布局协议。

布局变量链：

| 变量 | 默认来源 | 用途 |
| :--- | :--- | :--- |
| `--snowui-tooltip-padding` | `var(--padding-1) var(--padding-2)` | 气泡内边距 |
| `--snowui-tooltip-gap` | `var(--gap-2)` | 子内容间距 |
| `--snowui-tooltip-radius` | `var(--radius-3)` | 气泡圆角 |
| `--snowui-tooltip-font-size` | `var(--text-12)` | 提示文字字号 |
| `--snowui-tooltip-line-height` | `var(--leading-12)` | 提示文字行高 |

## 智能行为

1. **hover 延迟**: 首次 hover 延迟 `450ms` 显示；Tooltip 成功显示后，在 `300ms` cooldown 窗口内切换到其他 Tooltip 时立即显示。
2. **OSS 默认行为**: 首次 hover 延迟 `450ms` 显示；鼠标离开后立即隐藏；定位包含视口边缘碰撞避让和方向翻转；启用 transitions.dev Tooltip 风格出入场动效，平滑移动和尺寸动效默认关闭。
3. **PRO 增强行为**: PRO 入口注册 Tooltip 增强后，非受控 hover 模式复用页面级 Portal；在相邻 Tooltip 触发器之间切换时，外框保持存在，内容、位置和宽高随新触发器更新。
4. **PRO 移动规则**: 仅当共享外框仍然可见并切换到另一个触发器时，才应用移动规则。移动距离小于等于 `min(240px, 视口短边 25%)` 且交叉轴距离小于等于 `48px` 时，外框平滑移动；超过距离阈值或跨上下两排 / 左右两列时直接定位到新触发器，避免跨区域飞行。移动时序与宽高变化保持一致，均为 `150ms`；移动过渡只作用在 Portal 的 `top / left`，避免 snap 状态被 Frame Active 的全属性 transition 影响。
5. **重新出现规则**: 外框已经隐藏后，不论间隔多久再次 hover，都重置上一次的坐标、尺寸和触发器记录；新一轮 Tooltip 首帧先完成不可见测量和定位，再直接从当前 hover 位置出现，不做位移动效和宽度变化动效。
6. **冷却恢复**: 离开 Tooltip 触发器超过 `300ms` 后，恢复首次 hover 的 `450ms` 延迟。未成功显示就移开时，不进入立即显示模式。
7. **边界碰撞**: 自动翻转位置避免溢出视口。

## 样式逻辑（实现对照）

### 1) 气泡基础布局
- 渲染层通过 Portal 挂载到 `document.body`，定位方式为 `position: fixed`。
- 内容容器使用 `inline-flex`，并固定 `align-items: center`、`justify-content: flex-start`。
- 交互命中由触发器处理，Tooltip 自身 `pointer-events: none`。
- 层级固定为 `z-index: 9999`，并保持 `white-space: nowrap`。

### 2) Figma Token 映射
- `padding`: `--snowui-tooltip-padding` → `var(--padding-1) var(--padding-2)`（上下 4，左右 8）
- `gap`: `--snowui-tooltip-gap` → `var(--gap-2)`（8）
- `border-radius`: `--snowui-tooltip-radius` → `var(--radius-3)`（12）
- `font-size/line-height`: `--snowui-tooltip-font-size` / `--snowui-tooltip-line-height` → `var(--text-12)` / `var(--leading-12)`

### 3) 视觉主题
- `variant="dark"`（通过 `data-variant` 驱动）：
  - 背景：`Static Black/80%` + `Static White/10%` 叠加
  - 文字：`Static White/100%`
- 默认 `variant="light"`：
  - 背景：`Black/4%`
  - 文字：`Black/100%`

### 4) 滤镜与阴影
- 保留毛玻璃：`backdrop-filter: blur(1.25rem)`（含 `-webkit-backdrop-filter`）。
- 当前版本已移除阴影，不使用 `box-shadow`。

### 5) 显隐动效
- OSS 非受控模式（`open` 未传入）下：
  - 首次鼠标进入触发器后延迟 `450ms` 显示；
  - 鼠标移开后立即隐藏；
  - 自动根据视口边缘做碰撞翻转；
  - 不启用生命周期动效、平滑移动或尺寸动效。
- PRO 注册增强后：
  - Tooltip 成功显示后，页面内其他 Tooltip 在 `300ms` cooldown 窗口内立即显示；
  - 连续切换触发器时复用同一个 Portal 外框，更新内部文字、定位与尺寸；
  - 新一轮显示先完成不可见测量和定位，再把 Portal Frame 切到 `Appear` 状态，使用 `TOOLTIP_APPEAR_MOTION`；具体 duration / delay / scale 以 motion preset catalog 为准；
  - 近距离切换时外框平滑移动到新触发器上方；远距离切换时外框直接贴到新位置；
  - 外框隐藏后再次出现时重置运动基线，首帧直接定位到当前触发器，并在渐显结束后才开启后续尺寸动效；
  - 离开触发器超过 `300ms` 后恢复 `450ms` 首次延迟；
  - 生命周期出现使用 `TOOLTIP_APPEAR_MOTION` 的显式 opacity / scale / placement 位移通道；后续尺寸变化继续由 Frame `Idle -> Active` 形态时序承接；
  - 内容宽高变化由 `snowui-tooltip-size-shell` 保存明确宽高，并消费 Frame `--snowui-frame-size-motion-*` 桥接变量过渡；尺寸时序基于 Frame 默认形态动效加快一倍为 `150ms`；背景、圆角、padding 和毛玻璃也在该 shell 上，外框本身发生形态变化，而不是通过遮罩裁切一块更长的内容外框；
  - top / bottom 方向使用触发器中心作为固定锚点，尺寸外壳用静态 `transform: translateX(-50%)` 保持居中；left / right 方向使用触发器垂直中心作为固定锚点，尺寸外壳用静态 `transform: translateY(-50%)` 保持居中；宽高由 Frame size motion bridge 过渡，但居中偏移不参与过渡，因此连续切换和尺寸变化过程中 Tooltip 仍保持与触发器居中对齐；
  - 鼠标移开后短暂保留外框以承接相邻触发器切换，未命中新 Tooltip 时把 Portal Frame 切到 `Disappear` 状态，使用参考 transitions.dev Tooltip 的 `50ms` 退出动效：淡出并缩到 `98%`；退出动画完成后再卸载共享外框。
- 受控模式（`open` 传入）由外部状态直接控制显隐，不参与共享 warmup / cooldown 状态。
- 当外部传入 `loopMotion.preset="rotateClockwise"` 等循环默认能力时，Portal 外层 Frame 会直接承接该动效；因此 Tooltip 可见浮层本身可以连续旋转，且不会覆盖内部内容层的 appear `transform`。

---

---

> **以下内容供 AI 阅读，用于维护代码与文档的关联**

## 开发者指南 (AI)

### 模块索引 (Module Index)

- **Tooltip 组件**: [./Tooltip.svelte](./Tooltip.svelte)

### 关联关系

- **父组件**: [Frame.svelte](./Frame.svelte)
- **子组件**: (作为 Tooltip 内容渲染)

---

## 更新日志 (Changelog)

### v1.6.17 (2026-07-28)
- Tooltip 默认外观变体由 `dark` 改为 `light`；仍可显式传入 `variant="dark"`。

### v1.6.16 (2026-06-30)
- 删除 inner Frame 中未进入 Active、也未解析出任何视觉的 `whileActive={true}` 占位；生命周期与尺寸动效继续分别由 Tooltip preset 和显式 `effectiveSizeMotion` 承担，运行时视觉不变。

### v1.6.14 (2026-06-06)
- Tooltip 坐标计算改为使用已测量的目标宽高，而不是 Portal 当前 DOM 高度，修复第一次出现时 top placement 与按钮间距小于规范 offset 的问题。

### v1.6.13 (2026-06-06)
- Tooltip 尺寸 shell 的居中偏移从可过渡的 `translate` 改为静态 `transform: translateX/Y(-50%)`，宽高仍使用 Frame size motion bridge 过渡。
- 修复 E1 示例中多次快速切换后，上一段尺寸偏移动画残留导致 Tooltip 外框未居中到当前触发按钮的问题。

### v1.6.15 (2026-06-18)
- Tooltip 出现/消失动效改为引用 `TOOLTIP_APPEAR_MOTION` / `TOOLTIP_DISAPPEAR_MOTION`，具体值以 motion preset catalog 为准。
- Tooltip 默认启用生命周期出入场动效；平滑移动与尺寸动效仍由增强能力控制。
- Tooltip / Popover 共享首次 hover 延迟调整为 `450ms`。

### v1.6.12 (2026-06-06)
- Tooltip Portal 层移除 `whileActive` 带来的全属性 transition，避免跨行 snap 时 top / left 仍被隐式过渡影响。
- 近距离平滑移动改由 Tooltip Portal CSS 自己持有 `150ms ease-out` timing；尺寸 shell 仍继续使用 Frame size motion bridge。

### v1.6.11 (2026-06-06)
- Tooltip 近距离平滑移动新增同排/同轴限制：top / bottom placement 切换时垂直差超过 `48px` 会直接 snap，left / right placement 切换时水平差超过 `48px` 会直接 snap。
- 修复 E1 示例中从下排按钮快速移动到上排按钮时，Tooltip 在移动途中看起来没有对齐当前触发器的问题。

### v1.6.10 (2026-06-06)
- Tooltip 出现动效时长从 `150ms` 调整为 `100ms`；消失动效、宽度变化、近距离移动规则和 hover 延迟时序保持不变。

### v1.6.9 (2026-06-06)
- Tooltip 出现/消失动效参考 HeroUI Tooltip：出现为 `150ms` 淡入 + `scale(0.9 -> 1)` + placement 反向 `4px` 轻微滑入；消失为 `100ms` 淡出 + `scale(1 -> 0.95)`。
- 仅调整显隐生命周期动效，不改变宽度变化、近距离移动规则和 hover 延迟时序。

### v1.6.8 (2026-06-06)
- Tooltip 出现/消失改为 Frame fade-only 生命周期动效：出现只渐显，消失只渐隐，不再使用默认 `scaleIn`，避免视觉大小变化。
- 显隐动效时长从默认 fade 的 `300ms` 减半为 `150ms`；hover 首次出现延迟与 warmup / cooldown 时序保持不变。
- 新一轮显示先完成不可见测量和定位，下一帧再启动渐显；尺寸动效延后到渐显结束后开启，避免从页面左上角、旧位置或旧宽度过渡进入。

### v1.6.7 (2026-06-06)
- Tooltip 共享 Portal 接入 Frame 生命周期动效：出现时使用默认 `whileAppear`，消失时使用默认 `whileDisappear`。
- 非受控 hover 模式在 overlay 状态清空时保留上一帧 `renderedOverlay` 快照，等待 Frame 默认退出动效完成后再卸载外框。

### v1.6.6 (2026-06-06)
- Tooltip 外框隐藏后再次出现时，会清空上一轮 `coords`、`measuredSize`、`lastPositionTooltipId` 和移动状态，避免从上一次位置飞到当前触发器。
- 新一轮显示先以不可见状态完成测量和定位，首帧直接出现在当前 hover 触发器的正确位置；首轮尺寸写入不执行宽高变化动效，后续同一可见外框切换才开启尺寸动效。

### v1.6.5 (2026-06-06)
- Tooltip 定位改为锚点中心模型：top / bottom 以触发器中心为 portal 坐标，left / right 以触发器垂直中心为 portal 坐标。
- 外框宽高变化、居中偏移和近距离移动统一使用 `150ms` Frame motion timing，避免尺寸动画过程中 Tooltip 与当前触发器中心错位。
- 动态坐标与测量尺寸统一保留 `px` 写入样式，避免根字号不是 `16px` 时 `getBoundingClientRect()` 坐标转 `rem` 造成锚点偏移。

### v1.6.4 (2026-06-06)
- Tooltip 外框变宽 / 变窄动效加快一倍：尺寸 shell 继续基于 Frame 默认 `MORPH_MOTION`，但 duration 减半为 `150ms` 后注入 Frame size motion bridge。

### v1.6.3 (2026-06-06)
- Tooltip 尺寸动画改为外框自身形态变化：`snowui-tooltip-size-shell` 承担视觉外框，内部 `snowui-tooltip-inner` 只负责内容测量与排布，避免出现“遮罩揭开长外框”的视觉。

### v1.6.2 (2026-06-06)
- Tooltip 外框宽高变化改为明确尺寸 shell，内容自然尺寸通过共享 ResizeObserver 测量后写入宽高，过渡时序消费 Frame size motion bridge。

### v1.6.1 (2026-06-06)
- 共享 Portal 切换触发器时新增移动规则：近距离使用 Frame control motion bridge 平滑移动，远距离直接定位到新触发器。
- Tooltip E1 示例中的多个按钮改为不同提示内容，用于验证共享外框、内容更新与位置移动。

### v1.6.0 (2026-06-06)
- 非受控 hover 模式改为页面级共享 Portal，快速切换不同 Tooltip 触发器时复用同一个外框，仅更新内容、定位和尺寸。
- Tooltip 内容外壳消费 Frame size motion bridge，文案变化导致的宽高变化沿用 Frame 默认尺寸动效时序。

### v1.5.0 (2026-06-02)
- 参考 Radix Tooltip 的 `delayDuration` / `skipDelayDuration` 语义，新增共享 warmup / cooldown 协调器。
- 首次 hover 延迟调整为 `600ms`；任一 Tooltip 成功显示后，`300ms` 内切换到其他 Tooltip 时立即显示。
- `open` 受控模式保持由外部状态直接控制，不参与共享延迟状态。

### v1.4.7 (2026-05-15)
- 移除 Tooltip 自定义 `Idle/Active` 缩放淡入动效，统一改用 Frame 默认 `whileAppear`，与 Popover 保持一致马上显示。

### v1.4.6 (2026-03-07)
- 释放 `whileLoad` 关键字：Tooltip 改用 `loading` 作为禁用触发入口，并将 `whileLoad` 透传回 `Frame` 作为加载态动效配置。

### v1.4.5 (2026-03-06)
- Tooltip Portal 外层改为 Frame，`loopMotion` 现在作用于可见浮层根节点；内部内容层继续保留 `Idle -> Active` 的默认进入组合动效

### v1.4.4 (2026-03-03)
- Tooltip 自身进入动效改为 Frame 通用状态动效链（`Idle -> Active` 自动触发）；`0.5s` hover 延迟仍由组件本地控制

### v1.4.3 (2026-02-26)
- 移除 Tooltip 对 `theme` 属性的兼容读取，外观仅通过 `variant` 控制

### v1.4.2 (2026-02-26)
- Tooltip 外观属性从 `theme` 调整为 `variant`（`dark | light`）

### v1.4.1 (2026-02-26)
- 移除 Tooltip 的投影效果（`box-shadow`）

### v1.4.0 (2026-02-26)
- 按 Figma 规范更新 Tooltip 样式（padding/gap/radius/font/backdrop-filter）
- 新增 `theme` 属性：`dark | light`，默认 `dark`
- `dark` 使用 `Static Black/80% + Static White/10%` 叠加背景与 `Static White/100%` 文字
- `light` 使用 `Black/4%` 背景与 `Black/100%` 文字

### v1.3.1 (2026-02-26)
- hover 进入后延迟 `0.5s` 显示 Tooltip，并以淡入呈现；移出时立即隐藏（无淡出）

### v1.3.0 (2026-02-26)
- 移除 `content` prop，统一使用 Tooltip 子内容作为提示文案

### v1.2.1 (2026-02-25)
- 修复 role 判定：仅 `as="tooltip"` 时遵循 Text 截断态显示规则

### v1.2.0 (2026-02-03)
- 初始版本，支持 Portal 模式与角色化组合
