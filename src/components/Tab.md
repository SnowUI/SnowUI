# Tab

> **许可阅读**：首次阅读组件文档、源码或 npm 使用流程，先读完整 [LICENSE](../../LICENSE)；同任务同版本去重。公开 API 配置与内部实现修改分别按许可处理；旧 OSS / PRO 标签仅表示迁移期技术来源。

> **版本**: v1.3.0
> **职责**: 在同一区域的多个视图或内容面板之间切换，支持数据生成或自定义按钮组合，并提供键盘导航。
> **包归属**: `@snowui/components-pro`
> **文档修订**: 2026-09-21

## 组件介绍

在同一区域的多个视图或内容面板之间切换，支持数据生成或自定义按钮组合，并提供键盘导航。

## 使用选择

<!-- usage-guide:start -->
用于同一区域的内容面板或视图切换；截图中的下划线标签页可选 underline 变体。只改变过滤参数时使用 Segmented。

- items 提供唯一 value 与 label；显式 Button as="item" 替换 items。
- bind:value 同步当前项；缺失或不匹配时仅视觉回退，不写回值。内容面板按当前值由页面展示。
<!-- usage-guide:end -->

## 快速开始

以下示例展示推荐的基本组合。更多场景与组合限制见后文。

<!-- quick-start:generated -->
```svelte
<script lang="ts">
	import { Tab } from '@snowui/components-pro';
</script>

<Tab itemRole="tab" size="lg" value="preview" aria-label="Component example view" items={[{ value: 'preview', label: 'Preview' }, { value: 'code', label: 'Code' }, { value: 'api', label: 'API' }]} />
```
<!-- /quick-start:generated -->

## API

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| value | `string` | — | 当前激活项的唯一值，支持 bind:value；点击或键盘激活时更新。缺失或不匹配时视觉回退到首个可用项，不自动写回绑定值。 |
| variant | `TabVariant` | `"pill"` | Tab 视觉变体 |
| size | `TabSize` | `"sm"` | 同时控制 Tab 容器的 padding / radius / gap，并作为组合默认值传给直系 `Button as="item"`；Item 尺寸样式优先级为 `style > class > Button size > Tab size` |
| row | `boolean` | `false` | 显式横向排列；row 与 column 均为 false 时仍横向显示，同时启用时 row 优先。 |
| column | `boolean` | `false` | 纵向排列；与 Frame 写法统一 |
| fill | `boolean` | `false` | Figma fill 宽度;容器有显式宽度时,横向子项等宽填满 |
| onChange | `(value: string) => void` | — | 用户激活不同选项后调用，参数为新 value；重复激活当前项不触发，回调不可取消选择。 |
| selectionFollowsFocus | `boolean` | `false` | 方向键是否直接激活;Tab 默认 `false`(仅切焦点 + Enter 激活),Segmented 默认 `true` |
| role | `string` | `"tablist"` | ARIA 容器 role |
| itemRole | `string` | — | 写入子项的 ARIA role；未传时保留 Button 自身语义。选项卡示例显式传 tab；传 radio 时同步 aria-checked，其余情况同步 aria-selected。 |
| children | `Snippet` | — | 无参数的显式子项内容，使用 Button as="item" 并设置唯一 value；替代 items，子项 Props 直接配置。 |
| items | `TabItem[]` | `[]` | 内置子项数据，每项必填唯一 value 和可读 label，可选 icon 组件及 disabled；icon 生成 Icon + Text，禁用项跳过键盘选择。children 存在时忽略 items。 |
| parts | `ComponentPartsOf<{ Button: typeof Button; Icon: typeof Icon; Text: typeof Text; }>` | — | 批量配置默认生成的 Button、Icon 与 Text，例如 parts.Button.scaleOnHover；显式 children 不消费这些默认子项配置。 |

未重新声明的继承能力请查所属基础组件文档；本表只列本组件源码具名公开属性。

## 使用边界与详细说明

<a id="默认内置模式-显式组合模式"></a>

### 默认内置模式 / 显式组合模式

- 默认内置模式（推荐）：`items` 自动生成 `<Button as="item">`；item 可用 `icon` 声明图标，Tab 内置生成 `Icon + Text`，适用于 `icon-toggle`；`parts.Button / parts.Icon / parts.Text` 配置统一 Props。
- 显式组合模式：显式书写 Button，用于 Icon、Text、复杂内容或逐项 Props 差异。

> **版本**: v1.3.0
> **状态**: 已实现(PRO)
> **职责**: 在多个互斥选项之间切换"视图/内容区"。子项使用 Button,激活态视觉
> 由 Tab 容器通过 CSS override Button 的桥接变量接管。
> **设计稿**: Figma node `11838-19967`

---

<a id="1-设计原则"></a>

### 设计原则

- **子项即 Button**:不新增 TabItem 组件。子项直接使用 Button,在 Button 上声明 `value="..."` 即可。Button 的 size 档位决定 Item 的 padding / radius / font-size / line-height(完全继承 Button SM/MD/LG)。
- **容器接管激活态视觉**:Tab 不修改 Button 源码,而是通过 CSS 上下文 override Button 的三层桥接变量(`--snowui-button-background-override` / `--snowui-button-color-override` / `--snowui-button-opacity-override` / `--snowui-button-padding-override`)在 Tab 上下文内接管视觉,**不污染外部 Button**。
- **共享 indicator FLIP 动效**:激活态的"白底"/"灰底"/"下划线"通过一个共享的 `.snowui-tab-indicator` 元素绝对定位,在 Item 间通过 transform/width/height 平滑过渡,而非每个 Item 各自 fade。
- **复合控件 hover**:Item 默认关闭 Button 的 scale hover，保留 Tab 自己的背景/透明度反馈与 indicator；子 Button 或 `parts.Button.scaleOnHover=true` 可显式重新开启。

---

<a id="2-api"></a>




### 2.2 子项约定

子项必须是 `<Button as="item">`,在 Button 上声明:

- `value="xxx"` —— 必填,项标识值(通过 Button rest-spread 落到根 `<button>` 元素的 `value` 属性)
- 可选 `disabled` —— 禁用单项
- 可选 `href` —— 通过 Button 的 `href` 实现路由型 Tab(Button 会渲染为 `<a>`)
- 可选 `bare` —— 使用无 padding / radius / 背景且不限制内容类型的 Button；Tab 继续通过 Button 根节点上的 `--snowui-button-opacity-override` 独立接管 inactive / hover / active 透明度，因此不依赖 Button bare 的默认强调级别


#### variant="pill"(样式1, 默认)
容器有 `--black-4` 背景 + padding，并使用与 SearchBox 一致的 `blur(1.25rem)`（20px）背景模糊。激活项:`--static-white-80` 白底 + `0 2px 4px rgba(0,0,0,0.1)` shadow。未激活项 Text / Icon 使用 `--black-100 × opacity: 0.4`；激活项 Text / Icon 使用 `--static-black-100` 与 `opacity: 1`；未激活项 hover 时仅将 `opacity` 提升到 `1`。

#### variant="solid"(样式2)
容器**无**背景、**无** padding。激活项:`--black-4` 背景,**无** shadow。激活项 Text / Icon 保持 Button 默认颜色链；未激活项 Text / Icon 使用 `--black-100 × opacity: 0.4`。

#### variant="underline"(样式3)
容器无背景、无圆角。子项 padding 0(override Button)。激活项底部 2px 横向下划线(垂直时为左侧 2px 竖线),颜色 `--primary`；激活项 Text / Icon 同样使用 `--primary`。未激活项 Text / Icon 使用 `--black-100 × opacity: 0.4`。子项间距更大:SM=`--gap-3`(12) / MD=`--gap-4`(16) / LG=`--gap-5`(20)。

#### variant="icon-toggle"(样式4)
容器视觉与 pill 相同，包含与 SearchBox 一致的 `blur(1.25rem)`（20px）背景模糊。未激活项隐藏 `.snowui-text`,只显示图标(子项内部需包含 Icon + Text 节点);激活项显示 icon + text,文字渐显时消费 Frame 生命周期进入 bridge 时序,宽度通过 Frame size motion bridge 平滑展开。

#### variant="bare"
容器无背景、padding 和圆角，不显示 indicator；Item 无背景、padding 和圆角，只通过 `opacity: 0.4 -> 1` 表达未激活、hover 与激活状态。内容可以是文字、单 Icon 或 Icon + 文字。Item gap 复用 underline 的尺寸梯度：SM=12px / MD=16px / LG=20px。

---

<a id="4-动效"></a>

### 动效

Item 颜色、透明度继续消费 Frame 默认动效系统。Tab 根注入 `TAB_INDICATOR_MOTION_STYLE`；共享 indicator 的位移消费 Frame control bridge，宽高变化消费 Frame size bridge，两者统一使用 Tab indicator preset。icon-toggle 因文字显隐触发的重测也保持动效，不再被 ResizeObserver 瞬间贴位覆盖。

| 场景 | 实现 | bridge 变量 |
| :--- | :--- | :--- |
| 激活 indicator 位移 | 共享 indicator 元素 `transform: translate(x, y)` 过渡 | `--snowui-frame-control-motion-*`（`TAB_INDICATOR_MOTION`） |
| 激活 indicator 尺寸变化 | width/height 过渡 | `--snowui-frame-size-motion-*`（`TAB_INDICATOR_MOTION`） |
| inactive / hover / active 前景切换 | opacity 过渡(Button opacity override) | `--snowui-frame-color-motion-*`(fallback 0.15s ease-out) |
| icon-toggle 宽度展开 | Item width 过渡 | `--snowui-frame-size-motion-*` |
| icon-toggle 文字渐显 | Text opacity 过渡 | `--snowui-frame-appear-motion-*`（生命周期进入时序桥接变量） |
| underline 移动 | 同 indicator,仅高度固定 2px | Frame control / size bridge |

Tab indicator 的具体时序以 `TAB_INDICATOR_MOTION` 为准；`TAB_INDICATOR_MOTION_STYLE` 将同一 preset 注入 Frame control / size 两组 bridge，禁止分别维护位移和尺寸数值。

---

<a id="5-布局模型"></a>

### 布局模型

主布局模型:**内联外壳布局**(同 Button)。Tab 自身是一个 flex 容器(`inline-flex`,`column` 时 `flex-direction: column`),内部:

- 第一个 child:绝对定位的 `<div class="snowui-tab-indicator">`,跟随激活 Button 通过 transform/width/height 过渡
- 之后是用户传入的 Button 子项;Button `position: relative; z-index: 1` 确保文字在 indicator 之上

`fill={true}` 时,横向子项使用 `flex: 1 1 0` 等宽填满容器可用宽度。通常配合 `style="width: ..."` / 宽度工具类使用;未定义容器宽度时仍按内容自然宽度布局。

详见 [LayoutProtocol.md §12.3](../../../specs/LayoutProtocol.md)。

---

<a id="6-键盘行为"></a>

### 键盘行为

- `←` / `→`(row)或 `↑` / `↓`(column):移动焦点。当 `selectionFollowsFocus=true`(Segmented)时直接激活。
- `Home` / `End`:跳到首/末项,行为同上。
- `Enter` / `Space`:由 Button 原生 click 行为触发,激活当前焦点项。
- **Roving tabindex**:激活项 `tabindex=0`,其他项 `tabindex=-1`。整个 Tab 在外部 Tab 键序列中只占一位。

### 使用示例

```svelte
<script lang="ts">
  import { Button, Icon, Text } from '@snowui-design-system/components';
  import { Tab } from '@snowui/components-pro';
  import { FourLeafClover, Star } from '@snowui-design-system/resource-svelte';
  let value = $state('web');
</script>

<!-- 样式1 默认 pill -->
<Tab bind:value variant="pill" size="sm">
  <Button as="item" value="web"><Icon><FourLeafClover /></Icon>Web</Button>
  <Button as="item" value="mobile"><Icon><Star /></Icon>Mobile</Button>
</Tab>

<!-- 样式2 solid -->
<Tab variant="solid" size="md">
  <Button as="item" value="web"><Icon><FourLeafClover /></Icon>Web</Button>
  <Button as="item" value="mobile"><Icon><Star /></Icon>Mobile</Button>
</Tab>

<!-- 样式3 underline -->
<Tab variant="underline" size="lg">
  <Button as="item" value="overview"><Icon><FourLeafClover /></Icon>Overview</Button>
  <Button as="item" value="details"><Icon><Star /></Icon>Details</Button>
</Tab>

<!-- 样式4 icon-toggle -->
<Tab variant="icon-toggle">
  <Button as="item" value="web"><Icon><FourLeafClover /></Icon><Text>Web</Text></Button>
  <Button as="item" value="mobile"><Icon><Star /></Icon><Text>Mobile</Text></Button>
</Tab>

<!-- 样式4 icon-toggle：默认内置模式 -->
<Tab
  variant="icon-toggle"
  value="web"
  items={[
    { value: "web", label: "Web", icon: FourLeafClover },
    { value: "mobile", label: "Mobile", icon: Star }
  ]}
/>

<!-- bare：文字、单 Icon、混合内容均可 -->
<Tab variant="bare" size="md" value="all">
  <Button as="item" value="all">All</Button>
  <Button as="item" value="random" iconOnly aria-label="收藏"><Icon><Star /></Icon></Button>
</Tab>

<!-- 纵向排列 -->
<Tab column variant="underline">
  <Button as="item" value="a">A</Button>
  <Button as="item" value="b">B</Button>
</Tab>

<!-- Figma fill 宽度:容器定宽后子项等宽 -->
<Tab fill style="width: calc(var(--size-20) * 4)" value="web">
  <Button as="item" value="web">Web</Button>
  <Button as="item" value="mobile">Mobile</Button>
</Tab>

<!-- 无外壳 Tab：未激活 40%，激活 100% -->
<Tab variant="bare" value="random">
  <Button as="item" value="all">All</Button>
  <Button as="item" value="random">Random</Button>
</Tab>
```

---


## AI Zone

以下章节保留源码维护约束，不属于应用接入步骤。

### 尺寸观察与环境退化

Tab indicator 的位置与尺寸监听统一通过 Components 的 `resizeManager`。服务端输出保留完整 Tab、Item 和选中语义，不创建浏览器 Observer；浏览器缺少 `ResizeObserver` 或初始化失败时，只停止容器尺寸变化后的 indicator 自动重测，切换、键盘与内容继续可用。尺寸通知在下一动画帧统一交付，避免 indicator 写入尺寸后同步触发新的 Observer 循环。

---

<a id="7-使用示例"></a>



<a id="3-样式-token-详表"></a>

### 样式 Token 详表

### 3.1 Item(每个 Button 子项)—— 接收 Tab size，尺寸定义仍归 Button

| 维度 | SM | MD | LG | 来源 |
| :--- | :--- | :--- | :--- | :--- |
| padding-block | `--padding-1` (4) | `--padding-2` (8) | `--padding-3` (12) | Button |
| padding-inline | `--padding-3` (12) | `--padding-4` (16) | `--padding-5` (20) | Button |
| radius | `--radius-3` (12) | `--radius-4` (16) | `--radius-5` (20) | Button |
| font-size | `--text-12` | `--text-14` | `--text-16` | Button |
| line-height | `--leading-12` (16) | `--leading-14` (20) | `--leading-16` (24) | Button |
| min-height/width | 由 padding+line-height 自然撑到 24/36/48 | 同 | 同 | 不声明 |

> Tab 通过 Button size context 把自身 `size` 作为直系 `Button as="item"` 的默认值；Button 仍使用自己的 SM/MD/LG 定义计算 padding、radius、font-size 与 line-height。完整优先级为：Button 内联 `style` > Button 显式 `class` > Button 显式 `size` > Tab 传入的默认 `size`。其中 class 通过直接属性声明覆盖 Button size 的内部变量结果，style 再按 CSS 层叠覆盖 class；Tab 不复制 Button 尺寸 CSS。

### 3.2 容器(`.snowui-tab` 自身)

| 维度 | SM | MD | LG | Token |
| :--- | :--- | :--- | :--- | :--- |
| 容器 padding(pill/icon-toggle) | `calc(var(--padding-1) / 2)` (2) | `--padding-1` (4) | `--padding-1` (4) | `--snowui-tab-padding` |
| 容器 radius(pill/icon-toggle) | `--radius-4` (16) | `--radius-5` (20) | `--radius-6` (24) | `--snowui-tab-radius` |
| 容器 gap(子项之间) | `calc(var(--gap-1) / 2)` (2) | `--gap-1` (4) | `--gap-1` (4) | `--snowui-tab-gap` |
| underline 子项间距 | `--gap-3` (12) | `--gap-4` (16) | `--gap-5` (20) | `--snowui-tab-gap` |
| underline 容器 radius | `0` | `0` | `0` | `--snowui-tab-radius` |
| bare 子项间距 | `--gap-3` (12) | `--gap-4` (16) | `--gap-5` (20) | `--snowui-tab-gap` |
| bare 容器 padding / radius | `0 / 0` | `0 / 0` | `0 / 0` | variant |

> SM 档的 2px padding/gap 用 `calc()` 公式从现有 token 派生,不新增变量。

### 3.3 颜色

| 用途 | Token / 值 |
| :--- | :--- |
| 容器背景(pill/icon-toggle) | `--black-4` (rgba(0,0,0,0.04)) |
| 容器背景模糊(pill/icon-toggle) | `blur(1.25rem)`（20px，与 SearchBox 一致） |
| 激活项背景(pill/icon-toggle) | `--static-white-80` |
| 激活项 shadow(pill/icon-toggle) | `0 2px 4px rgba(0,0,0,0.1)` |
| 激活项背景(solid) | `--black-4` |
| 激活项 shadow(solid) | `none` |
| 未激活 Item Text / Icon 颜色源 | `--black-100` |
| 激活 Item Text / Icon 颜色源(pill / icon-toggle) | `--static-black-100` |
| 激活 Item Text / Icon 颜色源(solid) | Button 默认颜色链 |
| 激活 Item Text / Icon 颜色源(underline) | `--primary` |
| bare Item 颜色源 | `--black-100` |
| 未激活项透明度 | `0.4` |
| 激活 / hover 项透明度 | `1` |
| underline 颜色 | `--primary` |
| underline 高度/宽度 | `2px`(横向 height,纵向 width) |
| bare indicator | 不显示 |

### 3.4 Override 入口

| 变量 | 用途 |
| :--- | :--- |
| `--snowui-tab-padding-override` | 容器 padding |
| `--snowui-tab-radius-override` | 容器 radius |
| `--snowui-tab-gap-override` | 容器 gap |
| `--snowui-tab-background-override` | 容器背景 |
| `--snowui-tab-background-blur-override` | 容器背景模糊；pill/icon-toggle 默认 `1.25rem`，其他变体默认 `none` |
| `--snowui-tab-inactive-opacity-override` | 未激活 item 透明度，默认 `0.4` |
| `--snowui-tab-hover-opacity-override` | 未激活 item hover 透明度，默认 `1` |

---

## 更新日志

- 2026-09-21：统一使用文档、源码属性表与 Site / LLM 阅读入口；仅文档修订，不改变组件行为。

### v1.2.3 (2026-08-17)

- Tab 根尺寸监听迁入共享 `resizeManager`，统一 SSR、能力缺失、按帧交付与资源释放边界。

### v1.2.2 (2026-08-14)

- `icon-toggle` 变体同步启用与 pill、SearchBox 相同的 `blur(1.25rem)` 背景模糊。

### v1.2.1 (2026-08-14)

- 默认 `pill` 变体增加与 SearchBox 一致的 `backdrop-filter: blur(1.25rem)`，并同步 `-webkit-backdrop-filter`。
- 新增 `--snowui-tab-background-blur-override` 公开覆盖入口；其他变体默认不启用背景模糊。

### v1.2.0 (2026-07-06)

- `TabItem` 新增可选 `icon`；默认内置模式可生成 `Button + Icon + Text`，完整支持 `variant="icon-toggle"`。

### v1.1.1 (2026-06-23)

#### Item 尺寸覆盖契约
- 明确 Item 尺寸样式优先级：`style > class > Button size > Tab size`；Tab size 仅作为未显式指定时的组合默认值。

### v1.1.0 (2026-06-23)

#### 新功能与尺寸契约
- 新增 `variant="bare"`：容器与 Item 均无外壳，不显示 indicator，支持文字、单 Icon 和混合内容，使用 12/16/20px gap 与 0.4→1 opacity 状态。
- Tab `size` 通过显式 Button size context 传给直系 `Button as="item"`；Button 自身仍是尺寸定义唯一来源，实例显式 `size` 优先。

### v1.0.8 (2026-06-22)

#### 组合能力
- 补充无外壳 Button Item 组合。Tab 的 `--snowui-button-opacity-override` 与 Button 的内部透明度变量属于同一根节点级联链，未激活仍为 0.4，不会叠乘为 0.16。

### v1.0.7 (2026-06-21)

#### 动效归口
- 新增 `TAB_INDICATOR_MOTION` 组件族 preset，indicator 的 transform、width、height 统一恢复为 transitions.dev Tabs sliding 的 250ms smooth-out。
- 位移改为消费真实存在的 Frame control bridge，移除不存在的 transform bridge 命名；Tab 不再误用通用 `RESIZE_MOTION`。

### v1.0.6 (2026-06-21)

#### 动效修复
- 修复 `variant="icon-toggle"` 切换后 ResizeObserver 以无动画同步覆盖 indicator 移动的问题；初始化后所有尺寸重测继续播放移动效果。
- Tab 根曾注入通用 resize preset；该方案已在 v1.0.7 被 Tab indicator 专属 preset 替代。

### v1.0.5 (2026-06-18)

#### 动效还原
- 完整对齐 transitions.dev Tabs sliding：indicator 的 transform、width、height 统一为 250ms 与 `cubic-bezier(0.22, 1, 0.36, 1)`，消除原先位移 200ms、尺寸 300ms 造成的不同步。
- 保留首次渲染与 resize 瞬间贴位，并补充 `prefers-reduced-motion` 关闭 indicator 过渡。

### v1.0.4 (2026-06-13)

#### 交互修正
- 背景移动对齐 transitions.dev Tabs sliding：indicator 改为直接写入 DOM `transform / width / height`，初始定位与 resize 时临时关闭 transition 并强制 reflow 贴位，只有用户切换时才执行滑动动效。

### v1.0.3 (2026-05-31)

#### 样式调整
- active Text / Icon 按 variant 拆分：pill / icon-toggle 保持 `--static-black-100`，underline 使用 `--primary`，solid 保持 Button 默认颜色链。
- inactive Text / Icon 统一使用 `--black-100 × opacity: 0.4`。
- 四种 variant 示例均补充 Icon，便于直接观察 Text / Icon 颜色继承。

### v1.0.2 (2026-05-31)

#### 样式调整
- 修正 Item 两态颜色源：inactive Text / Icon 保持 Button 默认 `--black-100`，active Text / Icon 使用 `--static-black-100`。
- inactive 的 40% 视觉仍只由整体 `opacity: 0.4` 表达；inactive hover 与 active 使用 `opacity: 1`。

### v1.0.1 (2026-05-31)

#### 样式调整
- 移除 inactive Item 的 40% 颜色值路径，改用 `opacity: 0.4`，hover / active 恢复 `opacity: 1`，对齐 `StyleSpec.md §2.4.5`。
- 新增 `--snowui-tab-inactive-opacity-override` / `--snowui-tab-hover-opacity-override` 外部覆盖入口。

### v1.0.0 (2026-05-20)

#### 新功能
- 初始实现:4 variant(pill / solid / underline / icon-toggle)× 3 size(sm/md/lg)× 2 direction(row/column)
- 共享 indicator 元素位置 / 尺寸过渡，消费 Frame control / size motion bridge 变量
- Roving tabindex 键盘行为,支持 selectionFollowsFocus 模式开关
- 支持 `fill` Figma fill 宽度,容器有显式宽度时横向子项等宽填满
- 配套为 OSS Frame 新增 `FRAME_SIZE_MOTION_BRIDGE`,详见 [bridge.md changelog v1.3.0](../../../components/src/motion/bridge.md)

#### 修正
- `variant="underline"` 容器默认圆角为 0;下划线 / 竖线尺寸由组件计算,不依赖 CSS 强制覆盖内联尺寸
