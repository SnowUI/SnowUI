# Frame

> **版本**: v5.1.0
> **职责**: 统一布局、状态、加载与动效，并通过显式配置支持多个组件的联动和样式编排。
> **包归属**: `@snowui-design-system/components`

## 组件介绍

统一布局、状态、加载与动效，并通过显式配置支持多个组件的联动和样式编排。

## 使用选择


用于需要布局、状态、Context、loading、Skeleton 与动效的通用宿主；普通页面结构可使用语义 HTML。

- row / column / grid 选择布局；as 声明组合角色，bind:element 获取根元素。
- 单行标签使用 singleLine；允许换行的图文正文使用 row firstLine。颜色、间距和圆角优先 Token 与公开 class/style。
- orchestrate*、target/action 和 styles 都由 Frame 承接；跨组件 Motion 使用 initMotion() 建立上下文。
- 没有配置 styles、没有 Motion 上下文时，不创建跨组件注册表或动效订阅。


## 快速开始

以下示例展示推荐的基本组合。更多场景与组合限制见后文。


```svelte
<script lang="ts">
	import { Frame, Badge, Button, Text } from '@snowui-design-system/components';
</script>

<Frame
	column
	contentFill
	padding={6}
	gap={4}
	radius={5}
	border={1}
	whileHover={{ y: [0, -4], duration: 180 }}
	style="width: min(100%, 30rem); background: var(--background-1);"
>
	<Frame singleLine><Text lines={1} size={20} weight={600}>Build with SnowUI</Text><Badge as="trailing" count="v2.4" color="Indigo" /></Frame>
	<Text>Compose responsive layout, state, interaction, and motion through one public foundation.</Text>
	<Frame row><Button variant="filled" href="/components/quick-start">Quick Start</Button><Button as="trailing" variant="outline" href="/components">Browse components</Button></Frame>
</Frame>
```


## API

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| componentParts | `ComponentParts` | — | 复合组件内部的 parts 传播边界；普通页面通过宿主组件公开 parts 使用，不直接配置此字段。 |
| enableResponsive | `boolean` | `true` | 响应式监听能力。控制 ResizeObserver 和断点检测。 |
| enableContext | `boolean` | `true` | 上下文提供能力。控制 FramePerception Context。 |
| enableScaleObserver | `boolean` | `false` | 尺寸比例监听能力。开启后向 CSS 变量写入运行时宽高、高宽比与统一尺寸。 |
| enableDefaultMotion | `boolean` | `true` | **New in v3.6.0** 默认动效开关。设为 `false` 时，该 Frame 的所有 `while*` 不自动注入系统默认动效。用户显式传入的 `while*` 配置不受影响。 |
| enableAutoLayout | `boolean` | `true` | 自动布局协议开关。当 Frame 声明了 `row` / `column` 方向时默认激活，在根 DOM 上输出 `data-auto-layout` 属性，继承 `auto-layout.css` 的三槽位感知、首行对齐、Wrap、Gap 等规则。设为 `false` 可关闭。详见 LayoutProtocol.md。 |
| contentFill | `boolean` | `false` | 普通内容子项宽度填满 Frame 内容区；优先级高于 `contentHug`。 |
| contentHug | `boolean` | `false` | 普通内容子项宽度按内容收缩。 |
| pinOffset | `number \| string` | — | Pin 布局两个方向的偏移；数字按 px，字符串原样输出；新用法使用对应 Token 字符串。 |
| pinOffsetX | `number \| string` | — | Pin 水平偏移，优先于 pinOffset；数字按 px，字符串原样输出。 |
| pinOffsetY | `number \| string` | — | Pin 垂直偏移，优先于 pinOffset；数字按 px，字符串原样输出。 |
| scaleHeightVar | `string` | `--snowui-scale-height-runtime` | 运行时高度变量名 |
| scaleWidthVar | `string` | `--snowui-scale-width-runtime` | 运行时宽度变量名 |
| scaleAspectRatioVar | `string` | `--snowui-scale-aspect-ratio-runtime` | 运行时高宽比变量名 |
| scaleSizeVar | `string` | `--snowui-scale-size-runtime` | 运行时统一尺寸变量名 |
| scaleObserverTarget | `"self" \| "parent"` | `'self'` | 监听目标节点 |
| scaleBasis | `"height" \| "width" \| "mixed" \| "aspect"` | `'height'` | 比例计算依据模式 |
| scaleMixHeightWeight | `number` | `0.5` | `mixed` 模式下高度权重 |
| scaleAspectBaseRatio | `number` | `1` | `aspect` 模式参考高宽比 |
| sizeRatio | `number` | `1` | 统一尺寸比例（相对 basis size 的倍率；`1`=与 basis size 等大） |
| iconSizeRatio | `number` | `sizeRatio` | Icon 独立比例 |
| avatarSizeRatio | `number` | `sizeRatio` | Avatar 独立比例 |
| class | `string` | — | 外部 CSS 类名，用于样式覆盖或布局调整 |
| style | `string` | — | 行内样式 |
| children | `Snippet<[any]>` | — | 子内容 (容器类组件) |
| as | `string` | — | 角色声明，用于在组合模式下声明自身角色 |
| tag | `string` | `div` | 渲染的 HTML 标签名 |
| id | `string` | — | 元素 ID。**动效编排时必须由用户手动指定** |
| element | `HTMLElement` | — | 绑定根元素 (bindable) |
| use | `any[]` | — | Svelte Actions 数组 |
| size | `number` | — | 组件逻辑尺寸。用于通过 Context 传递给子组件（如资源组件选择分辨率） |
| iconSize | `number` | — | **New** 独立控制内部 Icon 的尺寸 (Context 传递) |
| avatarSize | `number` | — | **New** 独立控制内部 Avatar 的尺寸 (Context 传递) |
| loading | `boolean` | `false` | 是否进入加载态。只表示状态，不决定具体视觉呈现。 |
| skeleton | `boolean` | `true` | 加载态是否渲染骨架。可继承父级 loading protocol。 |
| renderHints | `RenderHints` | — | 组件根的 Skeleton 自注册协议。组件提供最终形态、尺寸、圆角与行数；调用方逐字段覆盖。 |
| currentState | `CoreState` | `"Idle"` | 外部受控核心状态。用于 Toast / Portal 等由父级管理生命周期的场景，把 `Appear` / `Disappear` / `Active` 等状态交给 Frame 默认动效系统解析。 |
| customStates | `string[]` | — | 自定义状态名称数组，用于扩展状态机 |
| StartLoad | `StateTransition` | — | 开始加载后转变 |
| Load | `StateTransition` | — | 加载完成后转变 |
| Reload | `StateTransition` | — | 重新加载后转变，调用 `onReload` 回调 |
| Appear | `StateTransition` | — | 出现完成后转变 |
| Disappear | `StateTransition` | — | 消失完成后转变 |
| Idle | `StateTransition` | — | 空闲后转变 |
| Active | `StateTransition` | — | 激活完成后转变 |
| Disabled | `StateTransition` | — | 禁用后转变 |
| Validating | `StateTransition` | — | 验证中后转变 |
| Uploading | `StateTransition` | — | 上传中后转变 |
| Editing | `StateTransition` | — | 编辑中后转变 |
| onReload | `() => Promise<void>` | — | 进入 Reload 状态时执行的回调，用于数据刷新 |
| stateVars | `Record<string, StateValueMap<any>>` | — | 通用状态变量映射（任意变量名 -> 按状态取值） |
| stateClass | `StateValueMap<string>` | — | 按状态追加 class |
| stateStyle | `StateValueMap<string \| Record<string, string \| number>>` | — | 按状态追加 style |
| stateContent | `StateValueMap<any>` | — | **New in v3.6.0** 按状态切换子内容（Snippet），Frame 自动处理交叉淡化补间动效 (Crossfade) |
| Click | `EventTrigger` | — | 点击时触发 |
| Drag | `EventTrigger` | — | 拖拽时触发 |
| Hover | `EventTrigger` | — | 悬停时触发 |
| Focus | `EventTrigger` | — | 聚焦时触发 |
| Key | `\| { key: string; state: CoreState } \| { key: string; target: string; action: string; reverse?: boolean; } \| { key: string; run: (e?: any) => void }` | — | 指定键盘按键时触发 |
| Scroll | `EventTrigger` | — | 滚动到组件时触发 |
| collapsed | `boolean` | — | 声明收起形态，由形态与状态能力消费；不自动提供触发按钮。 |
| expanded | `boolean` | — | 声明展开形态，由形态与状态能力消费；不自动创建额外内容。 |
| responsive | `FrameResponsiveProps \| false` | — | 基于容器宽度的内容适配配置或 false；启用响应能力时，方向与内容收缩按公开 FrameResponsiveProps 解析。 |
| xs | `"row" \| "column" \| "grid" \| "row-reverse" \| "column-reverse"` | — | 兼容断点方向 xs，启用 enableResponsive 时按 mobile-first 级联；新页面优先页面 responsive utilities。 |
| sm | `"row" \| "column" \| "grid" \| "row-reverse" \| "column-reverse"` | — | 兼容断点方向 sm，启用 enableResponsive 时按 mobile-first 级联；新页面优先页面 responsive utilities。 |
| md | `"row" \| "column" \| "grid" \| "row-reverse" \| "column-reverse"` | — | 兼容断点方向 md，启用 enableResponsive 时按 mobile-first 级联；新页面优先页面 responsive utilities。 |
| lg | `"row" \| "column" \| "grid" \| "row-reverse" \| "column-reverse"` | — | 兼容断点方向 lg，启用 enableResponsive 时按 mobile-first 级联；新页面优先页面 responsive utilities。 |
| xl | `"row" \| "column" \| "grid" \| "row-reverse" \| "column-reverse"` | — | 兼容断点方向 xl，启用 enableResponsive 时按 mobile-first 级联；新页面优先页面 responsive utilities。 |
| 2xl | `"row" \| "column" \| "grid" \| "row-reverse" \| "column-reverse"` | — | 兼容断点方向 2xl，启用 enableResponsive 时按 mobile-first 级联；新页面优先页面 responsive utilities。 |
| singleLine | `boolean` | `false` | 显式单行图文／文字组合预设：横排居中、不换行、gap至少4 CSS px；leading／trailing附件保持尺寸，普通内容可收缩。优先于方向断点及responsive结构回退；不自动识别子项、不生成文字或Tooltip。Text lines=1负责截断与全文访问。enableAutoLayout=false时关闭本预设。 |
| firstLine | `boolean` | `false` | 允许换行的图文正文显式声明首行对齐；单行标签使用singleLine，通用Frame不自动识别内容。在 row / row-reverse 三槽布局中，将 leading / trailing 附件与正文第一行行框居中；正文须继承宿主行高。非 row、无附件或 enableAutoLayout=false 时不增强；与 Pin 兼容。 |
| row | `boolean` | — | 设置横向布局；同时声明 column 或 grid 时 row 优先。 |
| column | `boolean` | — | 设置纵向布局；未启用 row 时生效，配合 reverse 改变方向。 |
| grid | `boolean` | — | 设置网格基础布局；row、column 均未启用时生效，网格列由公开 class/style 配置。 |
| reverse | `boolean` | — | 是否反向执行 |
| morph | `boolean` | — | 启用自身布局变化过渡；不替代图表、表格或文字内部的专业时间线。 |
| whileLoad | `MotionConfig \| boolean` | — | Load 状态或触发阶段的动效配置；对象表达显式动效，boolean 控制该阶段默认能力。不主动创建业务状态，不接管子组件专业内部时间线。 |
| whileReload | `MotionConfig \| boolean` | — | Reload 状态或触发阶段的动效配置；对象表达显式动效，boolean 控制该阶段默认能力。不主动创建业务状态，不接管子组件专业内部时间线。 |
| whileAppear | `MotionConfig \| boolean` | — | Appear 状态或触发阶段的动效配置；对象表达显式动效，boolean 控制该阶段默认能力。不主动创建业务状态，不接管子组件专业内部时间线。 |
| whileDisappear | `MotionConfig \| boolean` | — | Disappear 状态或触发阶段的动效配置；对象表达显式动效，boolean 控制该阶段默认能力。不主动创建业务状态，不接管子组件专业内部时间线。 |
| whileIdle | `MotionConfig \| boolean` | — | Idle 状态或触发阶段的动效配置；对象表达显式动效，boolean 控制该阶段默认能力。不主动创建业务状态，不接管子组件专业内部时间线。 |
| whileActive | `MotionConfig \| boolean` | — | Active 状态或触发阶段的动效配置；对象表达显式动效，boolean 控制该阶段默认能力。不主动创建业务状态，不接管子组件专业内部时间线。 |
| whileDisabled | `MotionConfig \| boolean` | — | Disabled 状态或触发阶段的动效配置；对象表达显式动效，boolean 控制该阶段默认能力。不主动创建业务状态，不接管子组件专业内部时间线。 |
| whileClick | `MotionConfig \| boolean` | — | Click 状态或触发阶段的动效配置；对象表达显式动效，boolean 控制该阶段默认能力。不主动创建业务状态，不接管子组件专业内部时间线。 |
| whileDrag | `MotionConfig \| boolean` | — | Drag 状态或触发阶段的动效配置；对象表达显式动效，boolean 控制该阶段默认能力。不主动创建业务状态，不接管子组件专业内部时间线。 |
| whileHover | `MotionConfig \| boolean` | — | Hover 状态或触发阶段的动效配置；对象表达显式动效，boolean 控制该阶段默认能力。不主动创建业务状态，不接管子组件专业内部时间线。 |
| whileFocus | `MotionConfig \| boolean` | — | Focus 状态或触发阶段的动效配置；对象表达显式动效，boolean 控制该阶段默认能力。不主动创建业务状态，不接管子组件专业内部时间线。 |
| whileKey | `MotionConfig \| boolean` | — | Key 状态或触发阶段的动效配置；对象表达显式动效，boolean 控制该阶段默认能力。不主动创建业务状态，不接管子组件专业内部时间线。 |
| whileScroll | `MotionConfig \| boolean` | — | Scroll 状态或触发阶段的动效配置；对象表达显式动效，boolean 控制该阶段默认能力。不主动创建业务状态，不接管子组件专业内部时间线。 |
| whileValidating | `MotionConfig \| boolean` | — | Validating 状态或触发阶段的动效配置；对象表达显式动效，boolean 控制该阶段默认能力。兼容迁移能力，新页面不扩大使用。 |
| whileUploading | `MotionConfig \| boolean` | — | Uploading 状态或触发阶段的动效配置；对象表达显式动效，boolean 控制该阶段默认能力。兼容迁移能力，新页面不扩大使用。 |
| whileEditing | `MotionConfig \| boolean` | — | Editing 状态或触发阶段的动效配置；对象表达显式动效，boolean 控制该阶段默认能力。兼容迁移能力，新页面不扩大使用。 |
| whileCollapsed | `MotionConfig` | — | Collapsed 状态或触发阶段的动效配置；对象表达显式动效。兼容迁移能力，新页面不扩大使用。 |
| whileExpanded | `MotionConfig` | — | Expanded 状态或触发阶段的动效配置；对象表达显式动效。兼容迁移能力，新页面不扩大使用。 |
| whileXs | `MotionConfig` | — | Xs 状态或触发阶段的动效配置；对象表达显式动效。兼容迁移能力，新页面不扩大使用。 |
| whileSm | `MotionConfig` | — | Sm 状态或触发阶段的动效配置；对象表达显式动效。兼容迁移能力，新页面不扩大使用。 |
| whileMd | `MotionConfig` | — | Md 状态或触发阶段的动效配置；对象表达显式动效。兼容迁移能力，新页面不扩大使用。 |
| whileLg | `MotionConfig` | — | Lg 状态或触发阶段的动效配置；对象表达显式动效。兼容迁移能力，新页面不扩大使用。 |
| whileXl | `MotionConfig` | — | Xl 状态或触发阶段的动效配置；对象表达显式动效。兼容迁移能力，新页面不扩大使用。 |
| while2xl | `MotionConfig` | — | 2xl 状态或触发阶段的动效配置；对象表达显式动效。兼容迁移能力，新页面不扩大使用。 |
| variants | `Record<string, MotionConfig>` | — | 动效变体属性 |
| delay | `number` | `0` | 延迟执行时间 (ms) |
| loopMotion | `LoopMotionConfig` | — | 循环动画配置。默认将 `duration / easing / iteration / direction / playState` 写入 Frame 的 `--snowui-frame-loop-motion-*` 变量；当 `preset="rotateClockwise"` 时，Frame 根节点直接启用内建连续旋转。 |
| scroll | `ScrollConfig` | — | 滚动联动配置 |
| layoutId | `string` | — | 共享元素转场 ID |
| itemId | `string` | — | 元素替换锚点 ID（推荐；语义同 `layoutId`） |
| scope | `FrameScope` | — | Context 能力作用域：self、children、descendants、explicit；未传不额外限制传播。 |
| access | `FrameAccess` | — | Context 操作权限；readonly 为只读，writeable 允许公开协议范围内的操作。 |
| timeline | `string` | — | 时间轴声明: `timeline:[ID]:[Order]` |
| orchestrate | `boolean` | — |  启用父 Frame 对子项的动效编排。 |
| orchestrateMode | `"sequential" \| "random" \| "parallel"` | — |  sequential 按顺序、random 随机、parallel 同时安排子项。 |
| orchestrateDelay | `number` | — |  子项编排的间隔，单位毫秒；不改变每个子项自己的持续时间。 |
| orchestrateOrder | `\| "visual-row" \| "visual-column" \| "visual-row-reverse" \| "visual-column-reverse" \| "dom"` | — |  子项排序按视觉行、视觉列及其反向或 dom 顺序。 |
| orchestrateGroup | `string` | — |  编排组标识，用于区分协同子项。 |
| orchestrateTrigger | `"appear" \| "hover" \| "click" \| "scroll" \| "none"` | — |  编排触发：appear、hover、click、scroll 或 none；none 不自动触发。 |
| orchestrateTarget | `string` | — |  编排目标选择器，限制参与的子项。 |
| styles | `Record<string, Record<string, string \| number>>` | — |  按目标 ID 配置跨 Frame 样式编排；键为 #id，值为样式字段和值，不是任意后代 CSS 选择器。 |
| padding | `number` | — | 兼容标量视觉字段；新页面使用 padding Token 与 class/style，不新增依赖该兼容入口。 |
| gap | `number` | — | 兼容间距编号，直接布局路径映射 --gap-N；新页面优先对应 gap Token，不填写未登记档位。 |
| radius | `number \| "full"` | — | 兼容圆角字段；新页面使用 radius Token 或组件公开圆角入口，不新增对旧标量字段的依赖。 |
| border | `number` | — | 兼容边框字段；新页面使用 border Token 或组件公开边框入口。 |
| innerBorder | `boolean \| string` | — | 兼容内边框字段；新页面使用组件公开入口和已登记 Token，不假定任意输入均可创建内边框。 |
| fontSize | `number \| string` | — | 兼容字号字段；新页面配对使用 --text-* 与 --leading-*，不使用 size Token 表达字号。 |
| minWidth | `number \| string` | — | 最小宽度；数字转为 px，字符串作为 CSS 值；设计还原使用 Token 或适用布局表达式。 |
| minHeight | `number \| string` | — | 兼容最小高度字段；普通页面通过根 style 与尺寸 Token 表达，不依赖未明确的标量解析路径。 |
| width | `number \| string` | — | 宽度；数字转为 px，字符串作为 CSS 值；新用法优先组件 API 与 Token。 |
| height | `number \| string` | — | 兼容高度字段；普通页面通过根 style 与尺寸 Token 表达。 |
| opacity | `number` | — | 透明度 |

此表是 Frame 的共享 API； 字段只在 Frame 生效。

## 使用边界与详细说明

### 布局模型与单行组合

主布局模型：**槽位宿主布局**（见 LayoutProtocol.md）。声明 `row` / `column` 且 `enableAutoLayout={true}` 时输出 `data-auto-layout="true"`，`as="leading"` / `as="trailing"` 为 Hug 槽，普通子项为 Content（允许 `min-width: 0`），`as="pin-*"` 为九方位绝对定位。

- **单行图文组合（`singleLine`）**：隐含 `row`、禁止换行、保持附件尺寸并保证至少 `4 CSS px` 有效间距；截断与全文访问由 `Text lines={1}` 负责。
- **多行首行对齐（`row firstLine`）**：将 `leading` / `trailing` 附件与正文第一行行框垂直居中，正文须继承宿主行高。
- **尺寸上下文**：`size`、`iconSize`、`avatarSize` 通过 `SIZE_CONTEXT_KEY` 向下传递，子组件显式设置 `size` 时建立新基准。

```svelte
<script lang="ts">
	import { Frame, Icon, Text } from '@snowui-design-system/components';
	import { Calendar } from '@snowui-design-system/resource-svelte';
</script>

<Frame singleLine style="width: 12rem;">
	<Icon as="leading" icon={Calendar} size={20} />
	<Text lines={1}>Last updated just now</Text>
</Frame>
```

### 状态、加载与动效

- **状态与加载**：触发器支持目标状态、状态映射、`{ target, action }` 或回调；`[NextState, 'auto']` 完成后自动流转，`stateContent` 提供状态交叉淡化。根级 `loading` 通过 Context 驱动子组件 `renderHints` 骨架，`skeleton={false}` 保留真实内容。
- **动效与转场**：`while*` 对象声明视觉通道（继承默认时序），`false` 关闭默认动效；相同 `layoutId` / `itemId` 自动执行 FLIP 转场，实例提供 `getController().captureFlip` / `playFlipTo`。

```svelte
<ScrollArea axis="horizontal" ariaLabel="Profile actions" width="100%">
<Frame singleLine minWidth="max-content" loading={pageLoading}>
    <Avatar as="leading" src={user.avatar} />
    <Text lines={1}>{user.name}</Text>
    <Button as="trailing">提交</Button>
</Frame>
</ScrollArea>
```

### 跨组件协调

调用 `initMotion()` 后可通过 `orchestrate*` 编排子项动效，或用 `styles` 按 `#id` 执行表达式样式联动；未启用时不创建全局订阅。

### Site guide: frame


### When to use Frame {#when-to-use}

Frame is the shared host for layout, state, loading, motion, and explicit coordination between components. Use semantic HTML when a page only needs ordinary structure.

### Import {#import}

```ts
import { Frame, initMotion } from '@snowui-design-system/components';
```

### Layout and content {#layout-and-content}

Use singleLine with leading/trailing attachments and Text lines={1} for one-line labels. Use row firstLine for wrapping prose; row, column, grid, and as compose other layouts. Use public tokens and class/style for visual values. loading and skeleton share the same inherited context.

### Coordination {#coordination}

Call initMotion() during parent component initialization when using cross-component motion. Frame supports orchestrate*, target/action triggers, and styles rules. These capabilities use the same Frame implementation and context as ordinary layout.

### API and examples {#api-and-examples}

[API reference](./api.md) · [Complete manual](./reference.md) · [Quick Start](https://snowui.dev/components/quick-start)
### Next steps {#next-steps}

- [Quick Start](https://snowui.dev/components/quick-start)
- [ScrollArea](../scroll-area.md)
