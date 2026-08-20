# Tooltip.svelte 文档

> **版本**: v1.8.0
> **职责**: 文字提示组件，在悬停时显示额外信息。

**能力**: 支持通用交互与动效能力 (交互、动效、响应式)。

> **实现**: Tooltip 使用 Portal 模式渲染到 `document.body`；OSS 默认包含 hover / skip-delay、视口边缘碰撞避让、生命周期动效，以及页面级共享 Portal 的连续切换。近距离切换时，单一圆角外框沿任意二维方向移动并同步改变宽高；旧、新内容保持各自的视口位置，只由移动外框裁切显露。远距离切换直接定位，不产生跨区域飞行。

## 组件特有属性 (Component-Specific Props)

| 属性 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| position | 'top'\|'bottom'\|'left'\|'right' | 'top' | 弹出方向 |
| open | boolean | undefined | 手动控制显示状态 (可绑定) |
| offset | number | 4 | 与触发器的距离 (px) |
| variant | 'dark'\|'light' | 'light' | Tooltip 外观变体，默认 light，可显式切换为 dark |
| dismissOnMotion | boolean | true | 非受控 hover 模式下，触发元素或其祖先开始动效，或后代开始几何 transition 时立即隐藏 Tooltip；后代装饰性 animation 不关闭 |

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
2. **OSS 共享外框**: 非受控 hover 模式始终复用页面级 Portal。离开当前触发器后的外框保留窗口与 `300ms` skip-delay 一致；窗口内进入另一个 Tooltip 时取消隐藏，不重新播放出现动效。
3. **二维连续切换**: 仅当共享外框仍可见且切换到另一个触发器时执行。移动距离小于等于 `min(240px, 视口短边 25%)` 时，外框沿新旧矩形之间的任意二维向量移动，并同步改变宽高；不再限制同排、同列或交叉轴距离。超过距离阈值时直接定位，避免跨区域飞行。位置和尺寸时序均为 `150ms`。
4. **内容裁切揭示**: 连续切换期间，旧内容和新内容各自保持在其目标视口位置，圆角外框是唯一外部裁切窗口。外框离开旧内容时将其裁掉，覆盖新内容时将其显露；当两个内容目标矩形相交时，交集必须沿移动方向使用互补裁切分区，同一像素在任一时刻只由旧、新内容其中一层绘制，不得出现文字重叠。不得用立即替换、内容缩放或 opacity 交叉淡化代替。过渡结束后卸载旧内容，只保留新内容。
5. **重新出现规则**: 外框已经隐藏后，不论间隔多久再次 hover，都重置上一次的坐标、尺寸和触发器记录；新一轮 Tooltip 首帧先完成不可见测量和定位，再直接从当前 hover 位置出现，不做位移动效和宽度变化动效。
6. **冷却恢复**: 离开 Tooltip 触发器超过 `300ms` 后，恢复首次 hover 的 `450ms` 延迟。未成功显示就移开时，不进入立即显示模式。
7. **边界碰撞**: 自动翻转位置避免溢出视口。
8. **动效感知关闭**: 默认只在 Tooltip 已显示期间，以页面级单例监听触发元素与祖先的 transition / animation，以及后代真实元素的几何 transition；命中后立即卸载 Tooltip 并跳过退出动效。后代 Logo / Icon 等装饰性 animation、颜色、背景、透明度以及 `::before` / `::after` 伪元素 transition 不触发关闭；可通过 `dismissOnMotion={false}` 显式关闭。
9. **连续打断**: 动画未结束又切换目标时，从外框当前可见矩形重新计算下一段移动；当前内容继续固定在自身目标位置，不得先跳到上一段终点。
10. **减少动态效果**: `prefers-reduced-motion: reduce` 下，连续切换立即定位并只显示新内容，不保留移动、宽高过渡或中间裁切状态。

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
- Portal 必须保持在应用根节点隔离层之外，且自身不得被全局根节点选择器误加 `isolation: isolate`；否则毛玻璃虽有计算值，但无法采样应用根节点内的页面内容。根节点隔离规则见 [StyleSpec.md §2.6.4](../../../specs/StyleSpec.md#264-全局根层隔离与-portal-背景采样)。
- 当前版本已移除阴影，不使用 `box-shadow`。

### 5) 显隐与连续切换动效
- OSS 非受控模式（`open` 未传入）下：
  - 首次鼠标进入触发器后延迟 `450ms` 显示，显示成功后的 skip-delay 为 `300ms`；
  - 自动根据视口边缘做碰撞翻转；
  - Tooltip 成功显示后，页面内其他 Tooltip 在 `300ms` cooldown 窗口内立即显示；
  - 连续切换触发器时复用同一个 Portal 外框；近距离切换沿任意二维方向移动，远距离切换直接定位；
  - 连续移动使用独立的 transform wrapper 承接位置变化，Portal 锚点仍按现有定位语义更新；宽高继续由 size shell 过渡；
  - 旧、新内容层分别用外框位移的逆向补偿保持视口位置稳定，`snowui-tooltip-size-shell` 的 `overflow: hidden` 与圆角共同形成唯一揭示边界；
  - 动画中断时先读取外框当前矩形，再以该矩形作为下一段起点；内容层仍锚定到各自的目标矩形；
  - 新一轮显示先完成不可见测量和定位，并为毛玻璃层保留一个不可见预绘制帧，再整体显示 Portal；稳定 Backdrop 首帧以完整 opacity 提供 blur，独立 Foreground 使用 `TOOLTIP_APPEAR_MOTION` 对背景色和内容执行 opacity + 轻微 scale。Portal 与 Backdrop 不参与该出现动效，因此渐显不会削弱滤镜；
  - 外框隐藏后再次出现时重置运动基线，首帧直接定位到当前触发器，并在渐显结束后才开启后续尺寸动效；
  - 离开触发器超过 `300ms` 后恢复 `450ms` 首次延迟；
  - 生命周期出现只在 `snowui-tooltip-foreground` 使用 `TOOLTIP_APPEAR_MOTION` 的显式 opacity / scale 通道；后续尺寸变化继续由 Frame `Idle -> Active` 形态时序承接；
  - 内容宽高变化由 `snowui-tooltip-size-shell` 保存明确宽高，并消费 Frame `--snowui-frame-size-motion-*` 桥接变量过渡；尺寸时序基于 Frame 默认形态动效加快一倍为 `150ms`。圆角和 padding 归 size shell，毛玻璃归稳定 Backdrop，背景色和内容归 Foreground；三个层级共享同一尺寸与裁切边界；
  - top / bottom 方向使用触发器中心作为固定锚点，尺寸外壳用静态 `transform: translateX(-50%)` 保持居中；left / right 方向使用触发器垂直中心作为固定锚点，尺寸外壳用静态 `transform: translateY(-50%)` 保持居中；宽高由 Frame size motion bridge 过渡，但居中偏移不参与过渡，因此连续切换和尺寸变化过程中 Tooltip 仍保持与触发器居中对齐；
  - 鼠标移开后按 `300ms` skip-delay 保留外框以承接相邻触发器切换；窗口内命中新 Tooltip 时取消隐藏并直接复用。超过窗口仍未命中时把 Foreground Frame 切到 `Disappear` 状态，使用参考 transitions.dev Tooltip 的 `50ms` 退出动效：背景色和内容淡出并缩到 `98%`；退出完成后再卸载包含 Backdrop 的共享外框。
  - `prefers-reduced-motion: reduce` 下关闭位置、宽高和内容层补偿过渡，并同步清理旧内容层。
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

### v1.8.0 (2026-08-20)
- 连续 Tooltip 切换成为 OSS 默认能力，不再依赖 PRO 注册增强。
- 近距离共享外框支持任意二维方向移动；删除 `48px` 交叉轴限制，保留 `min(240px, 视口短边 25%)` 远距离直接定位阈值。
- 切换期间保留旧、新内容并固定到各自视口位置，由移动圆角外框裁切揭示；补充连续打断和 reduced-motion 收敛规则。
- 修复新旧内容目标矩形相交时被共享外框同时裁入、导致文字重叠的问题；交集改用沿移动方向推进的互补裁切分区。
- 修复 Button hover 伪元素的 inset / radius transition 被误判为触发器锚点运动、导致 warm Tooltip 立即关闭的问题。

### v1.7.6 (2026-08-12)
- 修复 Test Footer 相邻按钮间移动速度不同时，共享 Tooltip 偶发先消失再出现的问题。PRO 外框保留窗口由固定 80ms 对齐到共享 300ms skip-delay，隐藏函数同时改为尊重实际 `delayMs`。

### v1.7.5 (2026-08-12)
- 将 Tooltip 可见表面拆分为稳定 Backdrop 与独立 Foreground：Backdrop 首帧完整执行 `blur(20px)`，Foreground 的背景色和内容恢复 opacity + 轻微 scale。保留一个不可见预绘制帧，退出时 Foreground 继续使用原快速 opacity + scale。

### v1.7.4 (2026-08-12)
- Test Footer 复测仍能看到实际模糊像素晚于 Tooltip。进一步移除出现态 transform，并在 `data-ready=true` 前增加一个不可见预绘制帧；毛玻璃层只在 Tooltip 挂载期间通过 `will-change` 预合成，退出动效保持不变。

### v1.7.3 (2026-08-12)
- 修复 Tooltip 已出现后背景模糊才逐渐清晰的问题。滤镜计算本身没有延迟；出现 preset 移除 Portal opacity 与额外 delay，仅保留轻微 scale，使完整毛玻璃与 Tooltip 同帧出现。

### v1.7.2 (2026-08-12)
- 修复动画 Logo / Icon 作为触发器后代时，装饰性 `animationstart` 误关闭 Tooltip 的问题；触发器自身、祖先动效及后代几何 transition 的关闭保护保持不变。

### v1.7.1 (2026-08-12)
- 修复 Styles 根节点隔离选择器误命中 Tooltip Portal，导致 `blur(1.25rem)` 无法采样应用内容的问题；Tooltip 默认 light 变体保持不变。

### v1.7.0 (2026-07-28)
- 新增默认开启的 `dismissOnMotion`。触发元素或其祖先开始几何动效时，Tooltip 会在第一帧位移前立即卸载，避免 Portal 跟随定位产生跳动。
- 动效监听按需启停并由同一 document 共享，不使用逐帧布局读取或常驻 Observer。

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
