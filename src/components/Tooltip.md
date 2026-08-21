# Tooltip.svelte 文档

> **版本**: v1.22.1
> **职责**: 文字提示组件，在悬停时显示额外信息。

**能力**: 支持通用交互与动效能力 (交互、动效、响应式)。

> **实现**: Tooltip 使用 Portal 模式渲染到 `document.body`；OSS 默认包含 hover / skip-delay、视口边缘碰撞避让、生命周期动效，以及页面级共享 Portal 的连续切换。近距离切换时，单一圆角外框沿任意二维方向移动并同步改变宽高。两个目标 Tooltip 的矩形最短距离不超过 `4px` 时，旧、新内容按各自真实 Snippet 边界沿移动方向以 `16px` 间距拼接，外框与内容带同帧进入有界协调时间线。light 外观保留透明 Black/4 与背景模糊，最终颜色会随被覆盖的宿主像素自然变化。

## 组件特有属性 (Component-Specific Props)

| 属性 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| position | 'top'\|'bottom'\|'left'\|'right' | 'top' | 弹出方向 |
| open | boolean | undefined | 手动控制显示状态 (可绑定) |
| offset | number | 4 | 与触发器的距离 (px) |
| variant | 'dark'\|'light' | 'light' | Tooltip 外观变体，默认 light，可显式切换为 dark |
| dismissOnMotion | boolean | true | 非受控 hover 模式下，触发元素或其祖先开始动效，或后代开始几何 transition 时立即隐藏 Tooltip；后代装饰性 animation 不关闭 |
| widthRebound | boolean | false | 连续切换时是否为外框宽度启用越界回弹；默认关闭，开启后宽度会越过目标再回弹 |
| rapidRetarget | boolean | true | 连续动效进行中再次切换目标时，是否使用 90–160ms cubic ease-out 快速重定向；关闭后继续使用普通 180–360ms 协调时间线 |

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

1. **hover 延迟**: 首次 hover 延迟 `450ms` 显示；Tooltip 成功显示后，在 `300ms` cooldown 窗口内进入其他 Tooltip 时立即切换，不增加固定意图延迟。
2. **OSS 共享外框**: 非受控 hover 模式始终复用页面级 Portal。离开当前触发器后的外框保留窗口与 `300ms` skip-delay 一致；窗口内进入另一个 Tooltip 时取消隐藏，不重新播放出现动效。
3. **二维连续切换**: 仅当共享外框仍可见且切换到另一个触发器时执行。移动距离不超过 `min(240px, 视口短边 25%)` 时，外框沿任意二维向量移动并同步改变宽高；超过阈值时直接定位。普通近距离位置与内容时间线为 `clamp(160ms + distance × 0.6ms/px, 180ms, 360ms)` 正弦协调曲线。默认 `rapidRetarget=true`；运动中再次改目标时从当前可见画面接管，改用 `clamp(60ms + distance × 0.35ms/px, 90ms, 160ms)` cubic ease-out 和 `0.02` 内容滞后。设为 `false` 时，中断仍使用普通协调时间线和 `0.08` 内容滞后。默认 `widthRebound=false`，宽度跟随当前所选位置时间线直接收敛；显式设置 `widthRebound=true` 时，宽度独立使用 `1000ms` 欠阻尼弹簧，不被快速重定向缩短。两种模式都从当前可见宽度为新起点，不继承累计速度。top / bottom 以中心、left 以右边、right 以左边保持触发器侧锚点。具体值以 Tooltip continuous preset 为准。
4. **内容带拼接与协调时间线**: 新旧目标 Tooltip 矩形最短距离不超过 `4px` 时，旧、新内容沿外框移动向量拼成投影间距为 `16px` 的内容带。测量边界是完整 Snippet 的 `.snowui-tooltip-inner`。外框位置与内容移动同帧开始，并在 `180–360ms` 内完成对齐；旧内容层保留至宽度弹簧首次回弹点 `450ms`。旧层清理只卸载 outgoing，不重置 incoming 偏移；incoming 继续按当前外框宽度补偿位置，直到宽度弹簧精确收敛，避免清理帧文字瞬间归零后又恢复造成抖动。运动中改目标时，以裁切窗口内实际可见面积更大的内容层接管，并在同一帧冻结实时视口矩形。圆角外框是唯一裁切窗口；距离超过 `4px` 时不拼接、不保留旧内容，但新内容必须在过渡中的外框内按最终 placement 保持局部对齐：top / bottom 水平居中，left 靠右，right 靠左；垂直方向 top 靠下、bottom 靠上、left / right 居中。
5. **重新出现规则**: 外框已经隐藏后，不论间隔多久再次 hover，都重置上一次的坐标、尺寸和触发器记录；新一轮 Tooltip 首帧先完成不可见测量和定位，再直接从当前 hover 位置出现，不做位移动效和宽度变化动效。
6. **冷却恢复**: 离开 Tooltip 触发器超过 `300ms` 后，恢复首次 hover 的 `450ms` 延迟。未成功显示就移开时，不进入立即显示模式。
7. **边界碰撞**: 自动翻转位置避免溢出视口。
8. **动效感知关闭**: 默认只在 Tooltip 已显示期间，以页面级单例监听触发元素与祖先的 transition / animation，以及后代真实元素的几何 transition；命中后立即卸载 Tooltip 并跳过退出动效。后代 Logo / Icon 等装饰性 animation、颜色、背景、透明度以及 `::before` / `::after` 伪元素 transition 不触发关闭；可通过 `dismissOnMotion={false}` 显式关闭。
9. **连续打断与性能**: 动画未结束又切换目标时，从当前外框和主要可见内容层的实时矩形重新计算下一段移动；旧时间线立即作废，不排队、不等待，也不得先跳到上一段终点。`rapidRetarget` 默认开启并使用 `90–160ms` cubic ease-out；关闭后使用普通 `180–360ms` 正弦协调曲线。合成提示只在 `moving` 阶段使用 `will-change`。
10. **触发与减少动态效果**: warm Tooltip 的每次目标变化都立即提交，不用固定意图延迟、瞬时指针速度或 burst 窗口决定是否播放连续裁切，也不监听 document `pointermove`。`prefers-reduced-motion: reduce` 下，所有连续切换都立即定位并只显示新内容，不保留移动、宽高过渡或中间裁切状态。
11. **交互宿主解析**: Tooltip 直接放在 Link / Button 的内部包装层时，以最近的 `a` / `button` / `role="link"` / `role="button"` 祖先作为 hover 命中与定位触发器；无交互祖先时保持以 Tooltip 的直接父元素为触发器。因此组件内部 label 在折叠态变为零宽或隐藏时，可见主操作仍保留完整 Tooltip 命中区。
12. **多实例性能边界**: 非受控 Tooltip 实例只保留各自触发器的 enter / leave 监听。页面级 Overlay store 响应、动效关闭注册、`prefers-reduced-motion` 查询和 window scroll / resize 定位监听只由唯一共享 Portal host 承担；只有当前可见的受控 Tooltip 会额外注册自身定位监听。scroll、resize 与尺寸测量引起的重复定位请求通过 `requestAnimationFrame` 合并，每帧最多执行一次布局读取。

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
  - Tooltip 成功显示后，页面内其他 Tooltip 在 `300ms` cooldown 窗口内立即响应；每个目标都从当前画面重定向连续裁切，旧时间线立即作废，不累积多段慢动效；
  - 连续切换触发器时复用同一个 Portal 外框；近距离切换沿任意二维方向移动，远距离切换直接定位；
  - 连续移动使用独立的 transform wrapper 承接位置变化，Portal 锚点仍按现有定位语义更新；宽高由同一逐帧几何时间线更新；
  - 新旧目标 Tooltip 矩形最短距离不超过 `4px` 时，旧、新内容沿实际二维移动向量拼成投影间距为 `16px` 的内容带；所有切换都使用 `180–360ms` 有界正弦协调时间线；`snowui-tooltip-size-shell` 的 `overflow: hidden` 与圆角共同形成唯一揭示边界；
  - 新旧目标 Tooltip 矩形最短距离超过 `4px` 时，不拼接、不保留旧内容；新内容按最终 placement 在当前外框内保持局部对齐并随外框一起移动，不能在长内容切短内容时默认贴住左上角；
  - 动画中断时读取外框和当前内容层的实时矩形，再以各自当前可见位置作为下一段起点；
  - 新一轮显示先完成不可见测量和定位，并为毛玻璃层保留一个不可见预绘制帧，再整体显示 Portal；稳定 Backdrop 首帧以完整 opacity 提供 blur，独立 Foreground 通过 `getTooltipAppearMotion(finalPosition)` 执行 opacity、增强 scale 和 placement 定向滑入。top 从下向上、bottom 从上向下、left 从右向左、right 从左向右；具体数值以 Tooltip preset catalog 为准。Portal 与 Backdrop 不参与该出现动效，因此渐显不会削弱滤镜；
  - 外框隐藏后再次出现时重置运动基线，首帧直接定位到当前触发器，并在渐显结束后才开启后续尺寸动效；
  - 离开触发器超过 `300ms` 后恢复 `450ms` 首次延迟；
  - 生命周期出现只在 `snowui-tooltip-foreground` 使用 Tooltip appear preset 的显式 opacity / scale / x / y 通道；transform origin 固定在靠近触发器的一侧中心，后续尺寸变化继续由 Frame `Idle -> Active` 形态时序承接；
  - 内容宽高变化由 `snowui-tooltip-size-shell` 保存明确宽高。普通尺寸变化继续消费 Frame size motion bridge；连续切换默认使用与外框位置相同的逐帧协调时间线并单调收敛，`widthRebound` 显式开启时才由独立宽度弹簧产生轻微越界回弹。圆角和 padding 归 size shell，毛玻璃归稳定 Backdrop，背景色和内容归 Foreground；三个层级共享同一尺寸与裁切边界；
  - top / bottom 方向使用触发器中心作为固定锚点，尺寸外壳用静态 `transform: translateX(-50%)` 保持居中；left / right 方向使用触发器垂直中心作为固定锚点，尺寸外壳用静态 `transform: translateY(-50%)` 保持居中；宽高由 Frame size motion bridge 过渡，但居中偏移不参与过渡，因此连续切换和尺寸变化过程中 Tooltip 仍保持与触发器居中对齐；
  - 鼠标移开后按 `300ms` skip-delay 保留外框以承接相邻触发器切换；窗口内命中新 Tooltip 时取消隐藏并直接复用。超过窗口仍未命中时把 Foreground Frame 切到 `Disappear` 状态，使用参考 transitions.dev Tooltip 的 `50ms` 退出动效：背景色和内容淡出并缩到 `98%`；退出完成后再卸载包含 Backdrop 的共享外框。
  - `prefers-reduced-motion: reduce` 下关闭位置、宽高和内容带过渡，并同步清理旧内容层。
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

### v1.22.1 (2026-08-21)
- 修复不满足内容拼接门槛时，长内容切换到短内容会在尚未收敛的宽外框中贴左显示的问题。
- 未拼接的新内容在整个宽高过渡中按最终 placement 保持中心或触发器侧边缘锚定；外框收敛后偏移自然归零。

### v1.22.0 (2026-08-21)
- 恢复默认开启的 `rapidRetarget`：连续运动被新目标打断时使用 `90–160ms` cubic ease-out 与 `0.02` 内容滞后，从当前可见外框和主要内容层接管。
- `rapidRetarget={false}` 时仍实时接管但使用普通 `180–360ms` 正弦协调时间线；显式宽度回弹保持独立 `1000ms` 曲线。

### v1.21.1 (2026-08-21)
- `widthRebound` 默认值由 `true` 改为 `false`；连续 Tooltip 默认不再产生宽度越界回弹。
- 显式 `widthRebound={true}` 仍完整保留原宽度弹簧、双向回弹与连续裁切行为。

### v1.21.0 (2026-08-21)
- 新增默认开启的 `widthRebound`；设为 `false` 时连续切换宽度使用与位置相同的协调曲线，不产生目标宽度越界。
- 关闭回弹只改变宽度曲线，连续移动、内容拼接、裁切揭示、实时重定向与 reduced-motion 最终状态保持不变。
- 删除 Test 专用动效调节器及组件运行时读取其 CSS 参数的路径，E1 / E2 改为有回弹与无回弹的左右对照。

### v1.20.1 (2026-08-21)
- 旧内容层在 `450ms` 清理时不再同帧清零 incoming 偏移，避免下一帧宽度弹簧重新写入补偿偏移造成文字往返抖动。
- incoming 内容在自身移动完成后保持最终视口位置，直到宽度弹簧结束帧与外框自然对齐。

### v1.20.0 (2026-08-21)
- 删除快速重定向专属的 `90–160ms` 时长、cubic ease-out、`0.02` 内容滞后和运行时状态。
- 运动中改目标仍从当前画面接管，但改为与普通连续切换共用 `180–360ms` 正弦协调时间线和 `0.08` 内容滞后。

### v1.19.9 (2026-08-21)
- 快速重定向接管当前裁切窗口内实际可见面积更大的内容层，不再把未测量、未定位或尚未被揭示的中间 Tooltip 提升为旧内容。
- 取消旧时间线时立即以当前外框为基准冻结内容层偏移，消除重定向首帧复用上一段偏移造成的跳动。

### v1.19.8 (2026-08-21)
- 内容移动恢复原 `180–360ms` 对齐时长，旧内容层仍保留到 `450ms`，拆开“移动速度”和“裁切存活时间”，消除 E1 快速重定向时的内容抖动。
- 小宽度差的双向回弹增加 `1.5px` 可见下限；自然约 `3%` 回弹大于该值时保持原幅度，避免 E1 重定向后回弹退化为不可见亚像素。

### v1.19.7 (2026-08-21)
- E1“归档 → 下载”等长内容切短内容路径中，连续裁切内容带由原位置时长延长到宽度首次回弹点 `450ms`。
- 主要宽度收缩期间始终保留新旧内容拼接与圆角裁切；内容带结束后只剩约 `3%` 的真实宽度回弹，避免短内容提前落入过宽空外框。

### v1.19.6 (2026-08-21)
- 宽度彻底退出 `isRetargeting` 分支：每次目标变化都从当前可见宽度以相同 `1000ms` / `3%` 曲线重新响应。
- 不再继承上一段累计速度，避免 E1 连续扫过时后续宽度变化在视觉上越来越快；位置和内容的快速重定向保持不变。

### v1.19.5 (2026-08-21)
- 参考 beUI 快速连续切换：宽度重定向不再使用独立的较短时长，稳定与重定向统一使用 `1000ms` 弹簧参数。
- 重定向继承当前宽度速度，不再把速度清零；目标反向变化时先保留惯性，再自然减速、反向并回弹。

### v1.19.4 (2026-08-21)
- 双向宽度越界由约 `5%` 进一步收小到约 `3%`。
- 稳定宽度弹性由 `900ms` 放慢到 `1000ms`，快速重定向由 `560ms` 放慢到 `640ms`。

### v1.19.3 (2026-08-21)
- 双向宽度越界由约 `7%` 收小到约 `5%`，减轻回弹幅度。
- 稳定宽度弹性由 `800ms` 放慢到 `900ms`，快速重定向由 `480ms` 放慢到 `560ms`。

### v1.19.2 (2026-08-21)
- 宽度弹性越界由约 `4%` 提高到约 `7%`，让常见文本宽度差也能清楚看到回弹。
- 双向规则明确为：变宽时先宽于目标再缩回，变窄时先窄于目标再扩回；浏览器回归分别逐帧验证最大值和最小值。

### v1.19.1 (2026-08-21)
- 宽度回弹从原 `180–360ms` 位置时间线中拆出，稳定切换使用接近参考效果的 `800ms` 弹性，回弹峰值约在 `360ms`；快速重定向使用 `480ms`。
- 位置、内容与旧内容清理仍按原时间线完成，不会因宽度回弹变慢；宽度变化按 placement 固定靠近触发器的锚点。

### v1.19.0 (2026-08-21)
- 连续切换的 Tooltip 外框宽度改用独立欠阻尼曲线：快速接近目标后约 `4%` 轻微越界，再回弹到目标宽度。
- 回弹复用既有 `180–360ms` / `90–160ms` 时间线，不延长位置、内容或整体动效；高度与位置曲线保持不变。

### v1.18.0 (2026-08-21)
- 连续裁切内容带的新旧内容投影间距由 `4px` 增加为 `16px`。
- 是否允许拼接仍以两个目标 Tooltip 矩形最短距离不超过 `4px` 为门槛；目标更远时仍只移动外框，不建立内容带。

### v1.17.0 (2026-08-21)
- Tooltip Foreground 以 `110ms` 从 `0.94` 放大到 `1`，并按最终 placement 从触发器方向反向滑入 `2px`；具体数值以 Tooltip preset catalog 为准。
- top / bottom / left / right 分别从下 / 上 / 右 / 左进入，transform origin 对齐靠近触发器的一侧中心；Portal、size shell 与 Backdrop 继续保持稳定。
- `prefers-reduced-motion: reduce` 下取消 Foreground 的 opacity、scale 与位移，直接显示最终稳定状态。

### v1.16.0 (2026-08-21)
- 连续裁切揭示调整为最初版本约 `0.75` 倍速度，并优先使用整十毫秒时长。
- 稳定段改为 `180–360ms`，retarget 改为 `90–160ms`；外框、尺寸和内容仍同帧开始、同帧结束，内容相位滞后不变。

### v1.15.0 (2026-08-21)
- 共享 Overlay store、动效关闭、reduced-motion 与 window 定位监听收敛到唯一 Portal host，非 host Tooltip 不再因其他提示切换而执行响应逻辑。
- scroll、resize、ResizeObserver 和 Overlay 更新产生的定位请求改为每帧合并，避免同一帧重复读取布局。
- 动效感知关闭由 Portal host 根据当前 Overlay 的 `dismissOnMotion` 配置注册，公开 Prop 和交互语义不变。

### v1.14.1 (2026-08-21)
- Tooltip 组合在 Link / Button 内部包装层时，改为使用最近交互祖先作为 hover 与定位触发器。
- 修复 SidebarItem 的 Link 路径在折叠 label 后 Tooltip 占位层变为零宽、导致图标 hover 无法显示提示的问题。

### v1.14.0 (2026-08-21)
- 稳定切换改为 `140–280ms`，进行中重定向改为 `70–120ms`；约 40px 的 SidebarItem 切换稳定在约 `140ms`。
- 稳定段 / 重定向段内容相位滞后收敛到 `0.08 / 0.02`。
- Test 增加多层 Frame、Text、Badge、Kbd 与不同宽高 Snippet 的复杂连续切换示例。
- light 外观继续使用透明 Black/4 + `20px` backdrop blur；宿主背景导致的颜色变化属于毛玻璃视觉的一部分。

### v1.13.0 (2026-08-21)
- 动画进行中改目标时进入 `90–160ms` 快速重定向段，从当前画面使用 cubic ease-out 继续运动，不再反复重启完整正弦时间线的低速起步。
- 重定向段内容相位滞后收窄为 `0.04`；首次稳定切换仍保留 `200–320ms` 完整协调动效。
- 触发依据只取当前动画阶段，不新增 pointermove、burst 计时器或待播放队列。

### v1.12.0 (2026-08-21)
- 参考视频逐帧重建连续交接：外框与内容改为 `200–320ms` 有界协调时间线，取消独立像素速度与末段长尾。
- 外框位置和尺寸使用平滑加减速；内容以轻微相位滞后跟随，并与外框同帧结束。
- 删除 `180ms` burst 直达；每个 warm 目标立即提交，进行中的动效从当前画面重定向，快速扫过不会排队或累积时长。
- 删除会切入新内容第一个字形的图层互补 mask；真实文字矩形直接保持 `4px` 间距，只由圆角外框裁切。
- 保留旧连续动效 preset 导出为 deprecated 兼容别名，避免开发服务器 HMR 期间旧模块图请求不存在的 export。

### v1.11.0 (2026-08-21)
- 默认减速起点改为时间线 `90%`，最终速度改为 `0.05px/ms`。
- 连续裁切触发从瞬时指针速度改为切换节奏：首次相邻切换始终执行，`180ms` burst 内后续目标直达，稳定后自动恢复。
- 删除 document `pointermove` 热路径；burst 直达不再读取旧内容和旧图层矩形，也不创建连续动画帧。

### v1.10.0 (2026-08-20)
- 移除已显示 Tooltip 间固定 `100ms` 意图延迟；快速扫过时立即响应并跳过连续裁切，低速进入仍执行完整动效。
- 内容速度改为分段模型：时间线前 `75%` 保持 `0.3px/ms`，后 `25%` 线性减速并以 `0.1px/ms` 结束。
- Test 调节器改为直接控制开始减速时间与最终速度。

### v1.9.0 (2026-08-20)
- 内容速度采用用户调定的 `0.3px/ms`；Test 新增可调外框速度、内容速度与 cubic-bezier 四个控制点的真实动效控制台。
- 已显示 Tooltip 间增加 `100ms` 切换意图确认；短暂掠过新触发器会取消待触发计时，不启动连续裁切动效。

### v1.8.5 (2026-08-20)
- 内容带移动由线性进度改为 cubic ease-out 缓出，外框继续保持线性移动。
- 保留用户当前调定的 `0.4px/ms` 内容时长速度；外框仍为 `0.5px/ms`。

### v1.8.4 (2026-08-20)
- 将外框与内容带速度拆为独立 preset：外框保留 `0.5px/ms`，内容带改为较慢的 `0.3px/ms`。
- 两者仍从同一帧开始，并分别按自身距离和独立速度计算时长。

### v1.8.3 (2026-08-20)
- 外框与拼接内容带改为同一帧开始移动，不再分为“先外框、后内容”两段。
- 两者统一消费 `TOOLTIP_CONTINUOUS_MOVE_SPEED_PX_PER_MS` 的线性像素速度，各自时长按自身移动距离计算；距离更长时动效持续更久，且两者允许在不同时间结束。
- 连续切换期间的外框宽高并入同一逐帧几何时间线，避免固定尺寸 transition 改变外框中心的实际速度。

### v1.8.2 (2026-08-20)
- 将连续裁切改为“拼接内容带 → 移动外框 → 对齐内容带”的两段式切换，还原参考视频中外框与内容分阶段移动的关系。
- 新旧内容沿任意二维移动向量保持精确 `4px` 投影间距；只有目标 Tooltip 矩形最短距离不超过 `4px` 时才拼接。
- 目标 Tooltip 间距超过 `4px` 时取消内容拼接与独立内容位移，只保留外框移动；连续打断仍从实时可见位置继续。

### v1.8.1 (2026-08-20)
- 按参考视频补齐连续裁切中的内容推进：旧内容沿移动方向短距离退出，新内容从反方向短距离归位。
- 内容位移按任意二维移动向量计算，短移动段自动限制距离；中断时从内容层实时矩形继续，不发生回跳。
- 互补蒙版改为按内容实际运动矩形计算，继续保证交集不重叠绘制。

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
