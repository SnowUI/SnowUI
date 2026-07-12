# SidePanel

> **版本**: v1.3.0  
> **包归属**: PRO  
> **职责**: 右侧详情弹出窗，支持浮层与页面右侧内嵌两种预览形态。

## AI Zone

- `SidePanel` 是 PRO 复合管理布局组件，放置在 `pro/src/components/SidePanel.svelte`。
- 组件视觉复用 Dialog 所属的 `.snowui-quick-action-panel` 面板基类，背景为 `Background/3`，背景模糊为 `blur(var(--size-10))`（基础 40px）。该视觉基类与出现/退出位移共同承接在外层 `.snowui-side-panel-motion-shell`，避免 transform 祖先隔离内层 `aside` 的 backdrop 采样；内层 `aside` 只保持稳定局部坐标系、内容与交互。不直接以 `Dialog` 为宿主。
- 关闭：`closeOnEscape`（默认 true）+ `closeOnOutside`（默认 true，点击面板外关闭）。点击 `.snowui-table-row` 不关闭，便于已打开时切换行只换内容、不播退场/进场。
- 内容区 `overflow-y: auto` + overlay scrollbar（根挂 `snowui-overlay-scrollbar-host`，hover 显示），与页面滚动隔离（`overscroll-behavior: contain`）；body 与直系子项 `min-width: 0` 防止长文案顶破右侧 padding。
- 默认宽度为 `460px`，圆角 `20px`（`--radius-5`）；浮层模式与页面上、右、下边缘保持 16px 间距；宽度通过左边缘 `Indicator` 调整（`pinOffset` 4px）；命中带遵循 Indicator line 全高协议（视觉默认 16px）。
- 内嵌模式（`placement="inline"`）默认去掉浮层阴影，使用真实边框 `border: var(--border-1) solid var(--black-10)`（1px / Black/10%），保证圆角边缘连续可见；高度默认 `100dvh - 32px`，可用根 `style` / `class` 或 `--snowui-side-panel-height-override` 覆盖。
- 浮层以及独立内嵌模式的面板本体使用 `SIDE_PANEL_APPEAR_MOTION` / `SIDE_PANEL_DISAPPEAR_MOTION`。SidePanel 的**默认内嵌集成效果**以 `SidePanel-Demo.svelte` 为基准：面板仍浮在页面内容上方，由页面常驻 fixed rail 承载；指定内容区同步让出 `panelWidth + 16px`，形成“浮动停靠 + 挤压指定内容”的效果。
- 默认内嵌集成必须传 `inlineMotionOwner="layout"`，由页面常驻 rail 接管面板位移，避免与内容收缩形成两个启动时钟。页面使用 `createSidePanelLayoutMotionStyle()` 让被挤压区域的 `padding-right` 与 rail 的 `transform` 复用同一 spring timing；内嵌关闭时仍保留 presence 至退场完成。
- SidePanel 不查询或改写页面兄弟 DOM。哪些元素被挤压由页面把哪些元素放入 `data-side-panel-layout` / `data-side-panel-main` 决定；未进入该预留空间链路的 header、导航、悬浮控件或其他区域会保持原宽度，并由 SidePanel 覆盖。
- 内容区默认不生成业务内容；调用方显式写入 children。
- **默认只读**（`editable={false}`）：不显示下工具栏；内容区仍有上下滚动渐隐遮罩（无下栏时底遮罩默认 **16px**，与左右 padding 一致）。
- **`editable={true}`**：自动显示下工具栏默认按钮（左 copy/delete，右取消 `borderless` + 保存 `gray`，组内 gap 8px）。
- **只读 + 自定义下栏**：传入 `bottomLeading` / `bottomTrailing` / `bottomLeadingActions` / `bottomTrailingActions` 任一即显示下工具栏；只自定义一侧时另一侧为空，可编辑时缺省侧用默认按钮。
- **上工具栏固定默认内置**（placement / previous / next + 标题 + 关闭 X），**不支持**替换。
- 上、下工具栏的内置 icon-only Button 会在 hover 时显示自身 `ariaLabel` 的 Tooltip；调用方显式传入的 `bottomLeading` / `bottomTrailing` 不会被改写。
- 内置 placement、previous、next、copy、delete、cancel、save、close 文案通过 `LocaleProvider` / `useLocale()` 读取；对应 key 为 `sidePanel.placement.toInline`、`sidePanel.placement.toFloating`、`sidePanel.previous`、`sidePanel.next`、`sidePanel.copy`、`sidePanel.delete`、`sidePanel.cancel`、`sidePanel.save`、`sidePanel.close`。无 Provider 时为 `zh-CN`。`title` 与 actions 数组的 `label` / `ariaLabel` 属于调用方业务文案，保持最高优先级且不翻译。
- 下栏优先级：Snippet **>** actions 数组 **>** 默认可编辑按钮。
- 内置 Button / Indicator 通过 `parts.Button` / `parts.Indicator` 批量配置。
- 内容区滚动渐隐使用 `.snowui-scroll-mask` + `data-scroll-mask`。上/下 solid-ratio **0.8**。

## Props

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `open` | `boolean` | `false` | 是否显示面板，支持 `bind:open` |
| `placement` | `"floating" \| "inline"` | `"floating"` | 浮层或内嵌到页面右侧，支持 `bind:placement` |
| `width` | `number` | `460` | 面板宽度，支持 `bind:width` |
| `minWidth` / `maxWidth` | `number` | `320` / `720` | 拖动宽度边界 |
| `inlineMotionOwner` | `"component" \| "layout"` | `"component"` | 内嵌位移动效归属。组件级 fallback 为 `component`；采用本文默认浮动停靠集成时必须传 `layout`，并配合 layout helper 与常驻 rail。 |
| `showTopToolbar` | `boolean` | `true` | 是否显示上工具栏（内容固定，不可换按钮） |
| `editable` | `boolean` | `false` | 内容可编辑；`true` 时自动显示下工具栏默认按钮 |
| `showBottomToolbar` | `boolean` | 自动 | 显式覆盖下栏显隐；默认 = `editable` 或任一下栏自定义 |
| `bottomLeading` | `Snippet` | — | 下栏左侧整组显式替换；传入即显示下栏 |
| `bottomTrailing` | `Snippet` | — | 下栏右侧整组显式替换；传入即显示下栏 |
| `bottomLeadingActions` | `SidePanelToolbarAction[]` | 可编辑时默认 copy/delete | 数据内置；传入即显示下栏；有 `bottomLeading` 时忽略 |
| `bottomTrailingActions` | `SidePanelToolbarAction[]` | 可编辑时默认 取消/保存 | 数据内置；传入即显示下栏；有 `bottomTrailing` 时忽略 |
| `title` | `string` | `"Details"` | 上工具栏右侧标题（只读，Black/20%） |
| `closeOnEscape` | `boolean` | `true` | Escape 关闭 |
| `closeOnOutside` | `boolean` | `true` | 点击 SidePanel 外区域关闭 |
| `onPrevious` / `onNext` | `() => void \| Promise<void>` | — | 上一项 / 下一项（上栏内置按钮） |
| `onCopy` / `onDelete` | `() => void \| Promise<void>` | — | 下栏默认复制 / 删除 |
| `onClose` | `() => void \| Promise<void>` | — | 关闭前回调 |
| `parts` | `{ Button?: ..., Indicator?: ... }` | — | 内置工具栏 Button 与宽度 Indicator |

`SidePanelToolbarAction` 字段：

| 字段 | 说明 |
| --- | --- |
| `role` | `"placement" \| "previous" \| "next" \| "copy" \| "delete" \| "close" \| "custom"`；`placement` / `close` 有内置行为 |
| `icon` | `ResourceIcon name` |
| `label` | 按钮文本；无文本时默认 icon-only bare |
| `variant` / `bare` / `disabled` | 透传 Button |
| `onClick` | 自定义回调 |

## 下工具栏替换

优先级：`bottomLeading` / `bottomTrailing` Snippet **>** 对应 actions 数组 **>** 默认内置。

```svelte
<!-- 默认只读：无下工具栏，仍有底滚动遮罩 -->
<SidePanel bind:open title="Subscription">
  <Frame column gap={3}>…</Frame>
</SidePanel>

<!-- 可编辑：自动出现下工具栏默认按钮 -->
<SidePanel bind:open editable title="Subscription">
  <Frame column gap={3}>…</Frame>
</SidePanel>

<!-- 只读 + 自定义下栏左侧：因 actions 出现下工具栏 -->
<SidePanel
  bind:open
  bottomLeadingActions={[{ role: "custom", icon: "arrow-line-down", ariaLabel: "下载", onClick: download }]}
/>

<!-- 显式整组：Frame 内多个 Button -->
<SidePanel bind:open editable>
  {#snippet bottomLeading()}
    <Frame row gap={2}>
      <Button bare size="sm" aria-label="下载" onclick={download}>
        <ResourceIcon name="arrow-line-down" size={16} />
      </Button>
    </Frame>
  {/snippet}
  …
</SidePanel>
```

上工具栏（预览切换 / 上一项 / 下一项 / 标题 / 关闭）**不可**通过 props 或 snippet 替换。

## 默认内嵌布局协议

### 效果定义

`placement="inline"` 的默认产品效果以 [`SidePanel-Demo.svelte`](../../../playground/demo/SidePanel-Demo.svelte) 为基准，它不是把 SidePanel 放进普通文档流，而是采用**浮动停靠布局**：

1. SidePanel 由 fixed layer / rail 承载，始终浮在页面其他元素之上。
2. 页面对指定内容区同步增加右侧 `padding-right`，把这些内容向左挤压。
3. 未参与预留空间的页面区域保持原布局，SidePanel 打开后覆盖在这些区域上方。
4. 面板位移和内容收缩由同一个 `inlineActive` 状态、同一个 helper 和同一轮样式更新驱动，视觉速率保持一致。

因此，“内嵌”表示面板会参与页面可用空间分配，不表示面板进入普通文档流。SidePanel 的视觉层仍是浮层；被挤压范围由页面显式定义。

### 职责分界

| 对象 | 负责方 | 默认规则 |
| --- | --- | --- |
| 面板内容、presence、关闭生命周期 | SidePanel | 组件内部负责；退场结束后才卸载。 |
| 面板视觉、宽度、圆角、边框、内容滚动 | SidePanel | 内嵌默认宽 `460px`、圆角 `20px`、真实边框、独立内容滚动。 |
| 面板在 rail 中的横向位移 | 页面 + layout helper | 默认传 `inlineMotionOwner="layout"`，由常驻 rail 承接 transform。 |
| 哪些元素向左挤压 | 页面 | 只有挂载 `--snowui-side-panel-layout-space` 的布局容器及其内容会收缩。 |
| 哪些元素被覆盖 | 页面 | 不在上述布局容器内，或不消费 layout-space 的区域保持原宽度并可被面板覆盖。 |
| 视口上、右、下间距 | 页面 rail | 默认均为 `16px`。 |
| 面板最终高度 | 页面 rail + SidePanel | rail 定义可用高度，SidePanel 使用 `height: 100%` 填满。 |
| z-index、页面滚动容器、header 偏移 | 页面 | SidePanel 无法推断页面结构，必须由页面决定。 |

### 页面如何定义挤压与覆盖

- **挤压整块主内容**：把 header、Table、分页等都放进 `data-side-panel-layout`，统一消费 `padding-right`。
- **只挤压 Table**：只让 Table 外层消费 `--snowui-side-panel-layout-space`；页面 header、左侧导航等放在该容器外，它们会保持宽度并可能被 SidePanel 覆盖。
- **覆盖悬浮控件**：控件不消费 layout-space，且其 `z-index` 低于 `data-side-panel-layer`。
- **控件保持在面板之上**：控件不消费 layout-space，并由页面设置高于 layer 的 `z-index`。这属于页面层级决策，不由 SidePanel 自动修改。

不要让 SidePanel 查询 Table、main 或 header，也不要在组件内部改写兄弟元素宽度。页面必须通过结构和 CSS 明确选择布局作用范围。

### 动效协调规则

RareUI 的参考实现让面板 `x` 与主内容 `paddingRight` 响应同一状态。SnowUI 沿用这套同步结构，但使用自己的 `SIDE_PANEL_APPEAR_MOTION` / `SIDE_PANEL_DISAPPEAR_MOTION`：临界阻尼 `300 / 34.6410161514 / 1`、500ms 轨迹窗口、无回弹，并保证完整退场距离。

默认内嵌集成必须满足：

1. `inlineActive` 固定为 `open && placement === "inline"`。
2. 只调用一次 `createSidePanelLayoutMotionStyle(inlineActive, panelWidth, 16)`，并把结果挂在协调容器上。
3. 被挤压区域的 `padding-right` 和 rail 的 `transform` 必须直接消费 helper 输出的变量，不得分别定义 duration 或 easing。
4. SidePanel 必须传 `inlineMotionOwner="layout"`，避免组件 transform 与 rail transform 叠加。
5. layer 与 rail 必须常驻 DOM；SidePanel 本体按 presence 挂载和卸载，保证退场完整。
6. `prefers-reduced-motion: reduce` 时同时关闭内容收缩和 rail 位移 transition。

helper 输出以下页面 bridge 变量：

| 变量 | 作用 |
| --- | --- |
| `--snowui-side-panel-layout-space` | 打开时为 `panelWidth + gap`，关闭时为 `0px`。 |
| `--snowui-side-panel-layout-panel-width` | rail 与面板使用的实时宽度。 |
| `--snowui-side-panel-layout-rail-translate-x` | 打开时为 `0px`，关闭时为 `panelWidth + gap`。 |
| `--snowui-side-panel-layout-motion-duration` | 从 SidePanel 当前 appear/disappear preset 解析出的时长。 |
| `--snowui-side-panel-layout-motion-easing` | 从同一 preset 解析出的 spring `linear(...)` easing。 |

### 默认完整写法

```svelte
<script lang="ts">
  import {
    SidePanel,
    createSidePanelLayoutMotionStyle,
  } from "@snowui-design-system/components-pro";

  let open = $state(false);
  let placement = $state<"floating" | "inline">("floating");
  let panelWidth = $state(460);

  const inlineActive = $derived(open && placement === "inline");
  const sidePanelLayoutStyle = $derived(
    createSidePanelLayoutMotionStyle(inlineActive, panelWidth, 16),
  );
</script>

<!-- 只有这个容器中的内容会被挤压。 -->
<div data-side-panel-layout style={sidePanelLayoutStyle}>
  <main data-side-panel-main>
    <!-- Table / 页面主内容 -->
  </main>

  <!-- layer 与 rail 常驻；面板在可视区域内浮动停靠。 -->
  <div data-side-panel-layer aria-hidden={inlineActive ? undefined : "true"}>
    <div data-side-panel-rail>
      <SidePanel
        bind:open
        bind:placement
        bind:width={panelWidth}
        inlineMotionOwner="layout"
        style={placement === "inline" ? "height: 100%;" : undefined}
      >
        <!-- 详情内容 -->
      </SidePanel>
    </div>
  </div>
</div>

<!-- 该区域不消费 layout-space，保持原宽度，可被 SidePanel 覆盖。 -->
<footer>...</footer>

<style>
  [data-side-panel-layout] {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    min-width: 0;
    padding-right: var(--snowui-side-panel-layout-space, 0px);
    transition: padding-right
      var(--snowui-side-panel-layout-motion-duration, 500ms)
      var(--snowui-side-panel-layout-motion-easing, ease-out);
  }

  [data-side-panel-main] {
    min-width: 0;
  }

  [data-side-panel-layer] {
    position: fixed;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
    z-index: 40;
  }

  [data-side-panel-rail] {
    position: absolute;
    top: 16px;
    right: 16px;
    bottom: 16px;
    box-sizing: border-box;
    width: var(--snowui-side-panel-layout-panel-width, 460px);
    transform: translateX(
      var(--snowui-side-panel-layout-rail-translate-x, 476px)
    );
    transition: transform
      var(--snowui-side-panel-layout-motion-duration, 500ms)
      var(--snowui-side-panel-layout-motion-easing, ease-out);
    pointer-events: auto;
  }

  @media (prefers-reduced-motion: reduce) {
    [data-side-panel-layout],
    [data-side-panel-rail] {
      transition: none;
    }
  }
</style>
```

### 高度与视口间距

SidePanel 本身提供高度能力，但页面负责决定它相对于哪个空间定位：

| 场景 | 推荐写法 | 结果 |
| --- | --- | --- |
| 默认内嵌停靠 | rail 使用 `top/right/bottom: 16px`；SidePanel 使用 `height: 100%` | 面板高度为当前视口高度减 32px；长页面不改变可视区域底部间距。 |
| 独立内嵌、无页面 rail | 不覆盖高度 | 使用组件默认 `calc(100dvh - 32px)`。 |
| 产品有固定 header | 页面调整 rail 的 `top`，例如 `top: calc(var(--header-height) + 16px)` | 面板避开 header；bottom 仍由页面定义。 |
| 面板随文档滚动 | 页面使用普通流或 sticky rail，并显式给出高度 | 高度和滚动边界跟随页面容器，不再保证固定视口间距。 |
| 特定容器内停靠 | 容器建立定位上下文，rail 改为 absolute，并定义 top/right/bottom | 面板高度由该容器决定。 |

默认内嵌模式不要同时使用组件默认 `100dvh - 32px` 和 rail 的 top/bottom 高度约束；应让 rail 决定高度，再以 `height: 100%` 传给 SidePanel。这样高度只有一个事实来源。

### 不变量与验收

- 打开后 SidePanel 与可视区域上、右、下默认各 `16px`。
- 默认宽度 `460px`；被挤压区域让出 `460px + 16px`，调整宽度时两者实时同步。
- 面板保持浮层层级，不占普通文档流；只有显式消费 layout-space 的区域收缩。
- 出现时面板位移进度与内容收缩进度一致；退出时内容恢复与面板退场进度一致。
- 圆角、真实边框、Background/3、blur 40px 和内部滚动保持 SidePanel 组件默认值。
- 长页面只改变页面滚动长度，不得扩大 SidePanel 与当前可视区域底部的 16px 间距。
- 可运行权威示例为 [`playground/demo/SidePanel-Demo.svelte`](../../../playground/demo/SidePanel-Demo.svelte)。

## 内嵌模式样式（公开入口）

| 目标 | 公开做法 |
| --- | --- |
| **宽度** | `width` / `bind:width` |
| **高度** | 根 `style` / `class`，或 `--snowui-side-panel-height-override` |
| **圆角** | 根 `border-radius` 或 `--snowui-side-panel-radius-override` |
| **边框 / 阴影** | 内嵌默认真实边框；浮层 quick-action 阴影 |

## 布局模型

主布局模型：**复合管理布局**。定义见 [../../../specs/LayoutProtocol.md §12.3](../../../specs/LayoutProtocol.md)。

## Changelog

- **SP-Init.28 / v1.3.0 (2026-07-13)**：将 SidePanel-Demo 的实现确立为默认内嵌布局协议；定义“浮动停靠 + 挤压指定内容”的语义、页面/组件职责、被挤压与被覆盖区域的选择方式、同步动效不变量、fixed rail 完整写法，以及高度与视口间距的单一事实来源。
- **SP-Init.27 (2026-07-13)**：内嵌边框由 inset box-shadow 改为真实 1px border，修复圆角边缘缺线；SidePanel-Demo 的协调式 rail 改为视口固定并保持上、右、下 16px，长页面不再拉大可视区域底部间距。
- **SP-Init.26 (2026-07-13)**：对照 RareUI 网站与开源源码，将协调式内嵌动效改为常驻 rail `transform` + 主内容 `padding-right` 同状态启动；新增 `inlineMotionOwner="layout"` 防止 SidePanel 重复位移。继续使用 SnowUI 临界阻尼，不恢复 RareUI 回弹。
- **SP-Init.25 (2026-07-13)**：内嵌模式接入与浮层相同的面板进退场 preset 和退出 presence；新增页面级 layout motion helper，SidePanel-Demo 首版以同步 grid rail 挤压 Table，并将页面 padding 从 40px 收到 16px，使表格获得更多宽度；SP-Init.26 改为 RareUI 同构的 padding + transform 协调方式。
- **SP-Init.24 (2026-07-13)**：接入组件 UI 文案多语言；默认使用 `zh-CN`，支持由上层 `LocaleProvider` 切换或覆盖固定工具栏文案。
- **SP-Init.23 (2026-07-13)**：上、下工具栏内置 icon-only Button 改由 SidePanel 内部嵌入 Tooltip，提示文案复用 `ariaLabel`。
- **SP-Init.22 (2026-07-13)**：修复背景模糊无可见效果：将 `.snowui-quick-action-panel` 从 transform 祖先下的内层 `aside` 移至实际承担位移的 motion shell；shell 复用 `Background/3 + blur(40px)`，内层透明化，仅承载内容、滚动与交互。
- **SP-Init.21 (2026-07-12)**：默认 move spring 进入无回弹对照方案：stiffness 300 / damping 34.6410161514（临界阻尼）/ mass 1 / duration 500ms。此前 Rare UI 同参数基线为 300 / 30 / 1 / 500ms，已保留记录，可准确恢复。
- **SP-Init.20 (2026-07-12)**：修复退场末段看似卡住：浮层右侧有 16px 间距，原 `x: 100%` 终点仍在视口内残留 16px；进退场距离统一改为 `calc(100% + var(--padding-4))`，确保面板完整离开视口后再卸载。
- **SP-Init.19 (2026-07-12)**：对照 Rare UI 网站与开源库，Frame 默认 `MOVE_*` 改为同参数高阻尼 spring（stiffness 300 / damping 30 / mass 1）；SidePanel 恢复正常 500ms 轨迹窗口，移除 5 倍调试时长。Frame CSS lifecycle 与 motion-engine 统一通过 spring 采样执行。
- **SP-Init.18 (2026-07-12)**：Frame 默认 `MOVE_*` 曾改为 `cubic-bezier(0.2, 0, 0, 1)` 并保持 5 倍观察时长；SP-Init.19 起由 Rare UI 同参数 spring 取代。明确共享面板视觉为 `Background/3 + blur(40px)`。
- **SP-Init.17 (2026-07-12)**：进退场改为外层 motion shell 整体位移，内层面板/工具栏/滚动条/Indicator 不再承接根 transform；`SIDE_PANEL_*` 复用 Frame 默认 move 时序并临时放大为 5 倍时长便于观察。
- **SP-Init.16 (2026-07-12)**：进退场 easing 改为 linear；`motion-engine` 修正百分比位移单位（`100%` 不再写成 `100%px`）。
- **SP-Init.16b (2026-07-12)**：撤销对 Frame 默认 generic 缓动/scale、以及 SidePanel `transform-origin` / `transition:none` 的改动；保留位移单位 bug 修复。
- **SP-Init.15 (2026-07-12)**：进退场去掉 opacity，仅保留横向位移；点击表格行切换预览时不关面板，避免退场+进场。
- **SP-Init.14 (2026-07-12)**：浮层动效改为从右滑入/滑出；默认点击面板外关闭；内容区独立滚动。
- **SP-Init.13 (2026-07-12)**：默认只读无下栏；`editable` 自动显示下栏；自定义下栏 props 也可唤出下栏；无下栏时仍保留底滚动遮罩。
- **SP-Init.12 (2026-07-12)**：上工具栏固定不可替换；下栏支持 Snippet 整组替换；默认取消 `borderless`、保存 `gray`；移除 `topActions`。
- **SP-Init.11 (2026-07-12)**：左边缘调宽距左缘 4px；命中带改由 Indicator line 全高协议统一提供。
- **SP-Init.10 (2026-07-12)**：内嵌模式默认内边框 0.5px Black/10%（`box-shadow: inset`）。
- **SP-Init.9 (2026-07-12)**：内嵌模式去掉阴影；高度支持 `--snowui-side-panel-height-override`。
- **SP-Init.8 (2026-07-12)**：上工具栏标题与关闭 X 拆分；标题只读、固定 Black/20%。
- **SP-Init.1 (2026-07-08)**：新增 PRO `SidePanel`。

## User Zone

### 示例

```svelte
<SidePanel bind:open title="Subscription">
  <Frame column gap={3}>
    <Text>内容由调用方显式写入。</Text>
  </Frame>
</SidePanel>
```
