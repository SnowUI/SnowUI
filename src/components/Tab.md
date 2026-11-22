# Tab

> **版本**: v1.3.2
> **职责**: 在同一区域的多个视图或内容面板之间切换，支持数据生成或自定义按钮组合，并提供键盘导航。
> **包归属**: `@snowui-design-system/components`
> **文档修订**: 2026-10-22

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
	import { Tab } from '@snowui-design-system/components';
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
| children | `Snippet` | — | 无参数的显式子项内容，使用 Button 或 CopyButton 的 as="item" 并设置唯一 value；替代 items，子项 Props 直接配置。 |
| items | `TabItem[]` | `[]` | 内置子项数据，每项必填唯一 value 和可读 label，可选 icon 组件及 disabled；icon 生成 Icon + Text，禁用项跳过键盘选择。children 存在时忽略 items。 |
| parts | `ComponentPartsOf<{ Button: typeof Button; Icon: typeof Icon; Text: typeof Text; }>` | — | 批量配置默认生成的 Button、Icon 与 Text，例如 parts.Button.scaleOnHover；显式 children 不消费这些默认子项配置。 |

未重新声明的继承能力请查所属基础组件文档；本表只列本组件源码具名公开属性。

## 使用边界与详细说明

<a id="默认内置模式-显式组合模式"></a>

### 默认内置模式 / 显式组合模式

- 默认内置模式（推荐）：`items` 自动生成 `<Button as="item">`；item 可用 `icon` 声明图标，Tab 内置生成 `Icon + Text`，适用于 `icon-toggle`；`parts.Button / parts.Icon / parts.Text` 配置统一 Props。
- 显式组合模式：显式书写 Button，用于 Icon、Text、复杂内容或逐项 Props 差异。


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

显式子项使用 `<Button as="item">`，也可使用以 Button 为宿主的 `<CopyButton as="item">`；在子项上声明:

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

默认items模式在icon-toggle中使用每项label作为可访问名称，文字隐藏时仍可识别；显式children模式由调用方给每个Button提供aria-label。内部图文间距复用Button所有者，不给每个控件外包Frame。

#### variant="bare"
容器无背景、padding 和圆角，不显示 indicator；Item 无背景、padding 和圆角，只通过 `opacity: 0.4 -> 1` 表达未激活、hover 与激活状态。内容可以是文字、单 Icon 或 Icon + 文字。Item gap 复用 underline 的尺寸梯度：SM=12px / MD=16px / LG=20px。

---

<a id="4-动效"></a>

### 动效

Item 颜色、透明度继续消费 Frame 默认动效系统。Tab 根注入 `TAB_INDICATOR_MOTION_STYLE`；共享 indicator 的位移消费 Frame control bridge，宽高变化消费 Frame size bridge，两者统一使用 Tab indicator preset。icon-toggle 因文字显隐触发的重测也保持动效，不再被 ResizeObserver 瞬间贴位覆盖。


Tab indicator 的具体时序以 `TAB_INDICATOR_MOTION` 为准；`TAB_INDICATOR_MOTION_STYLE` 将同一 preset 注入 Frame control / size 两组 bridge，禁止分别维护位移和尺寸数值。

---

<a id="5-布局模型"></a>

### 布局模型

主布局模型:**内联外壳布局**(同 Button)。Tab 自身是一个 flex 容器(`inline-flex`,`column` 时 `flex-direction: column`),内部:

- 第一个 child:绝对定位的 `<div class="snowui-tab-indicator">`,跟随激活 Button 通过 transform/width/height 过渡
- 之后是用户传入的 Button 子项;Button `position: relative; z-index: 1` 确保文字在 indicator 之上

`fill={true}` 时,横向子项使用 `flex: 1 1 0` 等宽填满容器可用宽度。通常配合 `style="width: ..."` / 宽度工具类使用;未定义容器宽度时仍按内容自然宽度布局。

详见 [LayoutProtocol.md §12.3](../../../docs/standards/LayoutProtocol.md)。

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
  import { Tab } from '@snowui-design-system/components';
  import { FourLeafClover, Star } from '@snowui-design-system/resource-svelte';
  let value = $state('web');
</script>

<!-- Variant 1: pill (default) -->
<Tab bind:value variant="pill" size="sm">
  <Button as="item" value="web"><Icon><FourLeafClover /></Icon>Web</Button>
  <Button as="item" value="mobile"><Icon><Star /></Icon>Mobile</Button>
</Tab>

<!-- Variant 2: solid -->
<Tab variant="solid" size="md">
  <Button as="item" value="web"><Icon><FourLeafClover /></Icon>Web</Button>
  <Button as="item" value="mobile"><Icon><Star /></Icon>Mobile</Button>
</Tab>

<!-- Variant 3: underline -->
<Tab variant="underline" size="lg">
  <Button as="item" value="overview"><Icon><FourLeafClover /></Icon>Overview</Button>
  <Button as="item" value="details"><Icon><Star /></Icon>Details</Button>
</Tab>

<!-- Variant 4: icon-toggle -->
<Tab variant="icon-toggle">
  <Button as="item" value="web" aria-label="Web"><Icon><FourLeafClover /></Icon><Text>Web</Text></Button>
  <Button as="item" value="mobile" aria-label="Mobile"><Icon><Star /></Icon><Text>Mobile</Text></Button>
</Tab>

<!-- Variant 4: icon-toggle with items prop -->
<Tab
  variant="icon-toggle"
  value="web"
  items={[
    { value: "web", label: "Web", icon: FourLeafClover },
    { value: "mobile", label: "Mobile", icon: Star }
  ]}
/>

<!-- Bare variant: text, single icon, or mixed content -->
<Tab variant="bare" size="md" value="all">
  <Button as="item" value="all">All</Button>
  <Button as="item" value="random" iconOnly aria-label="收藏"><Icon><Star /></Icon></Button>
</Tab>

<!-- Vertical orientation -->
<Tab column variant="underline">
  <Button as="item" value="a">A</Button>
  <Button as="item" value="b">B</Button>
</Tab>

<!-- Fill width: equal-width items inside fixed-width container -->
<Tab fill style="width: calc(var(--size-20) * 4)" value="web">
  <Button as="item" value="web">Web</Button>
  <Button as="item" value="mobile">Mobile</Button>
</Tab>

<!-- Bare Tab: 40% inactive, 100% active opacity -->
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

### v1.3.2 (2026-10-22)
- icon-toggle默认项保留label可访问名称，不随文字隐藏而丢失；Segmented沿宿主链继承，间距与交互继续复用Button。

### v1.3.1 (2026-10-14)

- 默认 items 生成的 Button、Icon 与 Text 直接接收对应 parts；显式 children 不继承这些默认配置。

- 2026-09-21：统一使用文档、源码属性表与 Site / LLM 阅读入口；仅文档修订，不改变组件行为。

### v1.2.3 (2026-08-17)

- Tab 根尺寸监听迁入共享 `resizeManager`，统一 SSR、能力缺失、按帧交付与资源释放边界。

完整历史见 [更新日志归档](../../docs/history/changelogs/Tab.history.md)。
