# Frame

> **许可阅读**：首次阅读组件文档、源码或 npm 使用流程，先读完整 [LICENSE](../../LICENSE)；同任务同版本去重。公开 API 配置与内部实现修改分别按许可处理；旧 基础与协调 标签仅表示迁移期技术来源。

> **版本**: v5.0.0（统一宿主，2026-10-09）
> **职责**: 统一布局、状态、加载与动效，并通过显式配置支持多个组件的联动和样式编排。
> **包归属**: `@snowui-design-system/components`
> **文档修订**: 2026-10-08

## 组件介绍

统一布局、状态、加载与动效，并通过显式配置支持多个组件的联动和样式编排。

## 使用选择

<!-- usage-guide:start -->
用于需要布局、状态、Context、loading、Skeleton 与动效的通用宿主；普通页面结构可使用语义 HTML。

- row / column / grid 选择布局；as 声明组合角色，bind:element 获取根元素。
- 图标与文字组合显式使用 row firstLine；颜色、间距和圆角优先 Token 与公开 class/style。
- orchestrate*、target/action 和 styles 都由 Frame 承接；跨组件 Motion 使用 initMotion() 建立上下文。
- 没有配置 styles、没有 Motion 上下文时，不创建跨组件注册表或动效订阅。
<!-- usage-guide:end -->

## 快速开始

以下示例展示推荐的基本组合。更多场景与组合限制见后文。

<!-- quick-start:generated -->
```svelte
<script lang="ts">
	import { Frame, Text } from '@snowui-design-system/components';
</script>

<Frame
	id="documentation-workflow"
	orchestrate
	orchestrateMode="sequential"
	orchestrateDelay={100}
	orchestrateOrder="visual-row"
	orchestrateTrigger="appear"
	style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--gap-2); width: min(100%, 36rem);"
>
	<Frame column padding={4} radius={4} border={1} whileAppear={{ opacity: [0, 1], y: [8, 0] }}><Text weight={600}>1 · Generate</Text><Text>Create canonical component pages.</Text></Frame>
	<Frame column padding={4} radius={4} border={1} whileAppear={{ opacity: [0, 1], y: [8, 0] }}><Text weight={600}>2 · Validate</Text><Text>Check API and example parity.</Text></Frame>
	<Frame column padding={4} radius={4} border={1} whileAppear={{ opacity: [0, 1], y: [8, 0] }}><Text weight={600}>3 · Publish</Text><Text>Ship the verified documentation.</Text></Frame>
</Frame>
```
<!-- /quick-start:generated -->

## API

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| componentParts | `ComponentParts` | — | 复合组件内部的 parts 传播边界；普通页面通过宿主组件公开 parts 使用，不直接配置此字段。 |
| enableResponsive | `boolean` | `true` | 响应式监听能力。控制 ResizeObserver 和断点检测。 |
| enableContext | `boolean` | `true` | 上下文提供能力。控制 FramePerception Context。 |
| enableScaleObserver | `boolean` | `false` | 尺寸比例监听能力。开启后向 CSS 变量写入运行时宽高、高宽比与统一尺寸。 |
| enableDefaultMotion | `boolean` | `true` | **New in v3.6.0** 默认动效开关。设为 `false` 时，该 Frame 的所有 `while*` 不自动注入系统默认动效。用户显式传入的 `while*` 配置不受影响。 |
| enableAutoLayout | `boolean` | `true` | 自动布局协议开关。当 Frame 声明了 `row` / `column` 方向时默认激活，在根 DOM 上输出 `data-auto-layout` 属性，继承 `auto-layout.css` 的三槽位感知、首行对齐、Wrap、Gap 等规则。设为 `false` 可关闭。详见 [LayoutProtocol.md](../../../specs/maintainers/LayoutProtocol.md)。 |
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
| firstLine | `boolean` | `false` | Icon＋文字组合的默认设计方式，组合时显式声明；通用 Frame 不自动识别内容。在 row / row-reverse 三槽布局中，将 leading / trailing 附件与正文第一行行框居中；正文须继承宿主行高。非 row、无附件或 enableAutoLayout=false 时不增强；与 Pin 兼容。 |
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

### 能力职责与成本

Frame 是唯一公共宿主；布局、状态、Context、loading / Skeleton、DOM 透传和动效共用一套实现。跨组件 Motion 由 initMotion() 建立上下文，styles 在显式配置时建立样式编排器。纯算法、Observer 与文字或图表的内部时间线继续由独立共享模块负责。

响应式内容适配沿用 Frame 的 props 输入，关闭能力时不建立相应观察器。跨组件监听只在存在上下文时启用；滚动监听在销毁时清理。合并组件入口不代表默认创建全局编排器。

### 关键字速查 (Quick Reference)

| 类别 | 关键字 |
|:---|:---|
| **能力开关** | `enableResponsive`, `enableContext`, `enableScaleObserver`, `enableDefaultMotion` |
| **身份属性** | `class`, `style`, `tag`, `id`, `as`, `size`, `iconSize`, `avatarSize`, `loading`, `skeleton`, `renderHints`, `element`, `use`, `children`, `customStates`, `...rest` |
| **Scale** | `scaleHeightVar`, `scaleWidthVar`, `scaleAspectRatioVar`, `scaleSizeVar`, `scaleObserverTarget`, `scaleBasis`, `scaleMixHeightWeight`, `scaleAspectBaseRatio`, `sizeRatio`, `iconSizeRatio`, `avatarSizeRatio` |
| **状态配置** | `currentState`, `StartLoad`, `Load`, `Reload`, `Appear`, `Disappear`, `Idle`, `Active`, `Disabled`, `Validating`, `Uploading`, `Editing` |
| **状态变量** | `stateVars`, `stateClass`, `stateStyle` |
| **状态触发** | `Click`, `Drag`, `Hover`, `Focus`, `Key`, `Scroll` |
| **形态** | `collapsed`, `expanded` |
| **响应式** | `responsive` 内容适配；`xs`–`2xl` 仅作旧断点兼容 |
| **布局** | `row`, `column`, `grid`, `reverse`, `firstLine`, `morph`, `contentFill`, `contentHug`, `pinOffset`, `pinOffsetX`, `pinOffsetY` |
| **动效触发** | `whileLoad`, `whileReload`, `whileAppear`, `whileDisappear`, `whileIdle`, `whileActive`, `whileDisabled`, `whileClick`, `whileDrag`, `whileHover`, `whileFocus`, `whileKey`, `whileScroll`, `whileValidating`, `whileUploading`, `whileEditing` |
| **形态动效** | `whileCollapsed`, `whileExpanded` |
| **响应式动效** | `whileXs`, `whileSm`, `whileMd`, `whileLg`, `whileXl`, `while2xl` |
| **动效参数** | `delay`, `loopMotion`, `variants`, `timeline`, `scroll`, `layoutId`, `itemId` |
| **编排** | `orchestrate`, `orchestrateMode`, `orchestrateDelay`, `orchestrateOrder`, `orchestrateGroup`, `orchestrateTrigger`, `orchestrateTarget` |
| **回调** | `onReload` |

---

<a id="1-能力开关-capability-switches"></a>

### 能力开关 (Capability Switches)

**关联文件**: [Frame.svelte](Frame.svelte) · `frame-types.ts` · `frame-dom-runtime.svelte.ts`

> **New in v3.2.0**: Scale 支持高度/宽度/混合/高宽比四种计算依据，并可写入运行时宽高比变量。

<a id="布局模型"></a>

### 布局模型

主布局模型：**槽位宿主布局**。定义见 [../../../specs/maintainers/LayoutProtocol.md §12.3](../../../specs/maintainers/LayoutProtocol.md) 与 [../../../specs/maintainers/LayoutProtocol.md §2](../../../specs/maintainers/LayoutProtocol.md)。

`Frame` 是槽位宿主布局的基础设施：

- 当声明 `row` / `column`，或显式传入 `enableAutoLayout={true}` 时，根节点输出 `data-auto-layout="true"`。
- `as="leading"` / `as="trailing"` 会透出为 `data-as`，由 `auto-layout.css` 统一处理 Leading / Content / Trailing 三段。
- Icon＋文字组合默认使用 `row firstLine` 开启首行对齐，输出 `data-first-line="true"`；正文继承宿主行高，附件与单行或多行正文的第一行居中，详见 [LayoutProtocol §4.4](../../../specs/maintainers/LayoutProtocol.md#44-首行对齐first-line-alignment)。
- `as="pin-*"` 会透出为 `data-as="pin-*"`，由 `auto-layout.css` 统一处理九方位绝对定位；`pinOffsetX` / `pinOffsetY` 优先于 `pinOffset`。
- `leading` 与 `trailing` 始终按 Hug 子项处理；普通直系子项作为 Content，必须允许 `min-width: 0`。
- 普通内容宽度默认自动判断：Frame 有显式宽度（`width` prop、`style="width:..."`、`w-full` / `size-full` 等宽度 class）时为 Fill；Frame 为 Hug 宽度时为 Hug。可用 `contentFill` / `contentHug` 强制覆盖，二者同时出现时 `contentFill` 优先。
- `enableAutoLayout={false}` 只关闭普通 Frame 的协议输出；`Input / Select / MenuItem / Field` 这类控件型宿主会在组件内部固定启用协议，外部 false 不关闭内部槽位布局。

### 基础属性 (Base Props)

**关联文件**: [Frame.svelte](Frame.svelte) · `frame-identity.svelte.ts` · `frame-types.ts` · `frame-dom-runtime.svelte.ts` · [frame-class-state.svelte.ts](../logic/frame-class-state.svelte.ts)

...rest | - | - | **属性透传**。所有未显式定义的属性透传给根元素 |

### 2.1 尺寸控制 (Size Control)

Frame 通过 `size` 属性和上下文机制实现跨层级的尺寸控制：

1.  **作为 Provider**: 当 Frame 设置 `size={N}` 时，会通过 `SIZE_CONTEXT_KEY` 向下传递尺寸 N。
2.  **作为 Consumer**: 内部的 `Icon`, `Avatar` 等组件会自动感知并应用此尺寸。
3.  **阻断 (Block)**: 子组件（如 `Button` 或嵌套 `Frame`）可以通过显式设置 `size` 属性来覆盖父级上下文，建立新的尺寸基准。

```svelte
<!-- 场景：统一控制内部不同类型元素的尺寸 -->
<Frame
    size={32}           // 基准尺寸 32px (Fallback)
    iconSize={20}       // 所有的 Icon 变为 20px
    avatarSize={40}     // 所有的 Avatar 变为 40px
>
    <Avatar />          <!-- 40px -->
    <Icon />            <!-- 20px -->

    <!-- 嵌套容器自动继承特定尺寸配置 -->
    <Frame>
        <Icon />        <!-- 20px (继承 iconSize) -->
        <Avatar />      <!-- 40px (继承 avatarSize) -->
    </Frame>

    <!-- 同样支持阻断 -->
    <Button iconOnly aria-label="操作">
        <Icon />        <!-- 16px (Button 内部阻断) -->
    </Button>
</Frame>
```

---

<a id="3-交互与状态-interaction-state"></a>

### 交互与状态 (Interaction & State)

**关联文件**: [Frame.svelte](Frame.svelte) · [frame-state.svelte.ts](../logic/frame-state.svelte.ts) · [frame-motion.svelte.ts](../logic/frame-motion.svelte.ts) · `frame-dom-runtime.svelte.ts` · [frame-class-state.svelte.ts](../logic/frame-class-state.svelte.ts)

### 3.1 核心状态 (Core States)

**关联文件**: [frame-state.svelte.ts](../logic/frame-state.svelte.ts)

核心状态支持**链式转变**：当状态完成后自动转变到下一个状态。


> 支持**自定义状态**：使用 `customStates` 属性定义业务特定状态

**Transition 类型**:
- `State`: 仅转变状态
- `[State, 'auto']`: 动效完成后自动转变
- `() => void`: 仅执行回调
- `{ next?: State, auto?: boolean, run?: () => void }`: 组合配置

**`auto` 关键字**: 表示动效完成后**自动**转变，无需外部触发。

```svelte
<!-- 点击后: Active(1.5s) → Disabled(2s) → Idle -->
<Button
    Click={Active}
    Active={[Disabled, 'auto']}
    Disabled={[Idle, 'auto']}
    whileActive={{ duration: 1500 }}
    whileDisabled={{ duration: 2000 }}
/>
```

#### Reload 状态与 onReload 回调

`Reload` 状态用于**刷新组件内的动态数据**，进入 Reload 状态时自动调用 `onReload` 回调。


```svelte
<!-- 点击刷新按钮：触发数据获取 + 旋转动效 -->
<Button
    Click={Reload}
    Reload={[Idle, 'auto']}
    whileReload={{ duration: 1000, component: Spin }}
    onReload={async () => { await fetchData(); }}
>
    <Refresh /> 刷新
</Button>
```

### 3.2 形态 (Morphology)

**关联文件**: [frame-state.svelte.ts](../logic/frame-state.svelte.ts)

| 关键字 | 描述 |
| :--- | :--- |
| collapsed | 收起状态控制属性 (boolean) |
| expanded | 展开状态控制属性 (boolean) |

### 3.3 事件 (Events)

**关联文件**: [frame-state.svelte.ts](../logic/frame-state.svelte.ts) · [frame-motion.svelte.ts](../logic/frame-motion.svelte.ts)

事件可**驱动状态转变**：当事件触发时，组件进入指定状态。


**Trigger 类型**:
- `State`: 转变到单向定点状态
- `Record<State, State>`: 状态映射字典，根据当前状态自动流转到下一个目标状态（如 `{ Idle: "Active", Active: "Idle" }`）
- `LinkageControl`: 控制其他组件
- `() => void`: 执行回调函数
- `{ run: () => void, ... }`: 组合配置

```svelte
<!-- 示例1: 点击后在两个状态间不停切换，并自动驱动 stateStyle 或 stateContent 进行视图重绘过渡 -->
<Button
    Click={{ Idle: "Active", Active: "Idle" }}
    stateStyle={{
        Idle: "opacity: 0.5; transform: scale(1);",
        Active: "opacity: 1; transform: scale(1.1);"
    }}
>
    Toggle Me
</Button>
```
<!-- 点击进入 Active 状态 -->
<Button Click={Active} />

<!-- 按 Enter 键进入 Active 状态 -->
<Input Key={{ key: 'Enter', state: Active }} />

### 3.4 状态驱动内容 (State Content)

**关联文件**: [Frame.svelte](Frame.svelte) · [frame-class-state.svelte.ts](../logic/frame-class-state.svelte.ts)

**New in v3.6.0**: 使用 `stateContent` 属性，可以直接根据当前状态渲染不同的内容（Snippet）。Frame 内部会自动处理内容的补间动效（**同位替换的交叉淡化 crossfade：旧内容渐隐 150ms，后新内容渐现 150ms**）。

```svelte
{#snippet iconA()}
    <Icon><Bell /></Icon>
{/snippet}
{#snippet iconB()}
    <Icon><Star /></Icon>
{/snippet}

<!-- 点击切换状态，图标自动交叉淡化替换 -->
<Frame
    Click="Active"
    Active={["Idle", "auto"]}
    stateContent={{
        Idle: iconA,
        Active: iconB,
    }}
/>
```

### 3.5 原生事件同步

**关联文件**: [frame-state.svelte.ts](../logic/frame-state.svelte.ts) · `frame-dom-runtime.svelte.ts`

Frame 自动感知并同步所有原生 DOM 事件，确保内部状态机与外部事件监听器保持一致。

**支持的事件类别**:
- **鼠标**: `click`, `dblclick`, `contextmenu`, `mouseenter`, `mouseleave`, `mousemove`, `mousedown`, `mouseup`
- **触控**: `touchstart`, `touchend`, `touchmove`, `touchcancel`
- **键盘**: `keydown`, `keyup`, `keypress`
- **焦点**: `focus`, `blur`
- **表单**: `input`, `change`, `submit`
- **UI**: `scroll`

---

<a id="4-文本截断迁移说明"></a>

### 文本截断（迁移说明）

从 `v3.5.0` 开始，`lines` / `onTruncate` 已从 `Frame` 迁移到 `Text` 组件。
`Frame` 不再初始化截断模块，也不再消费相关关键字。

**关联文件**: `Text.svelte` · `frame-truncation.svelte.ts`

```svelte
<!-- 单行截断（由 Text 提供） -->
<Text lines={1}>
    Very long text...
    <Tooltip as="tooltip">Full content</Tooltip>
</Text>

<!-- 可展开模式（由 Text 提供） -->
<Text lines={0}>
    Expandable content...
    <Button as="more">展开</Button>
</Text>
```

---

<a id="5-响应式能力-responsiveness"></a>

### 响应式能力 (Responsiveness)

**关联文件**: `frame-responsive.svelte.ts`

| 关键字 | 描述 |
| :--- | :--- |
| responsive | 继承 Frame 的内容适配规则：间距先压缩到下限，仍放不下时回退方向、对齐与普通子项尺寸；`minPadding` 支持 all / x / y / 四个单边下限 |

> **开关语义**：当 `enableResponsive={false}` 时，不初始化断点检测；`xs/sm/md/lg/xl/2xl` 覆写不会生效，布局仅使用基础方向（`row/column/grid` + `reverse`）。

### 5.1 断点 (Breakpoints)

**关联文件**: `frame-responsive.svelte.ts`


**Layout 值**: `row` | `column` | `grid` | `row-reverse` | `column-reverse`

**继承逻辑**: 断点属性支持**向下继承**。例如设置 `sm="column"`，则更大断点也默认为 `column`，除非被显式覆盖。

```svelte
<!-- xs: row (默认), sm/md: column (继承), lg+: row (覆盖) -->
<Frame row sm="column" lg="row" />
```

---

<a id="52-scale-能力-scale-capability"></a>

### 2 Scale 能力 (Scale Capability)

**关联文件**: [frame-scale-observer.svelte.ts](../logic/frame-scale-observer.svelte.ts) · [scale.css](../styles/scale.css) · [frame-inline-style.svelte.ts](../logic/frame-inline-style.svelte.ts)

Scale 能力会先监听组件自身或父容器（`self/parent`）的尺寸变化，拿到运行时宽度、高度、高宽比和统一尺寸；再通过 `height`、`width`、`mixed`、`aspect` 四种基准方式计算比例，并用 `sizeRatio`、`iconSizeRatio`、`avatarSizeRatio` 去控制容器内文字、Icon、Avatar 以及 padding、gap、圆角、内边框、边框等样式的缩放效果。默认只做监听和计算，不直接改样式；有显式配置时才应用到界面。


#### 计算说明与示例

完整的 Scale 计算链路、宽度变化示例（含 `H=28px` 场景）与 11 个关键字逐项影响，统一维护在：
- [frame-scale-observer.md](../logic/frame-scale-observer.md)

#### 默认行为（不干预现有样式）

- `enableScaleObserver` 默认只负责写入运行时变量（观察层）。
- 默认不会自动覆盖组件已有的文字、Icon、padding、gap、圆角、边框等视觉样式。
- 仅当进入 apply 模式时，才应用 scale 计算值：
  - `data-scale-apply="true"`（Frame 在显式设置 `sizeRatio` / `iconSizeRatio` / `avatarSizeRatio` 时自动写入）
  - 或 class `snowui-scale-apply`（外部手动启用）

#### Scale 能力特性

- 默认只开观察，不开应用；有显式配置再应用。
- 观察层负责写入运行时尺寸变量（宽/高/高宽比/统一尺寸）。
- 应用层仅在 apply 模式生效，用于接管文字、Icon、Avatar、padding、gap、圆角、内边框等比例样式。

### Scale 覆盖优先级

1. 外部 class 覆盖变量
2. props 注入变量
3. 默认计算值

即：`class > props > default`。

### Scale 与 Context 感知关系

**关联文件**: [frame-perception.svelte.ts](../logic/frame-perception.svelte.ts) · [Frame.svelte](Frame.svelte)

**当前设计结论**：Scale 默认**不接入** `FRAME_CONTEXT_KEY`。

原因：
1. Scale 的核心输出是 CSS 变量（样式系统消费），不需要子组件通过 JS 读取。
2. 避免 Context 结构膨胀，减少无关订阅与耦合。
3. 外部 class 覆盖优先级更清晰：由 CSS 变量链路决定，不依赖 Context 透传。

补充：
- 若未来出现“子组件必须读取父级 scaleBasis 并据此做 JS 分支”的明确场景，再按需向 Context 增量暴露只读字段（例如 `scaleBasis`）。

---

<a id="6-布局与样式-layout-style"></a>

### 布局与样式 (Layout & Style)

关联文件: `frame-layout.svelte.ts` · [Frame.svelte](Frame.svelte) · `layout.css`（styles） · `auto-layout.css`（styles） · [frame-class-state.svelte.ts](../logic/frame-class-state.svelte.ts)

> [!IMPORTANT]
> **开发禁令 (Redline)**:
> Frame 及基于其构建的所有子组件，其内部严禁使用来自 `snowui.css` 的工具类。所有展示逻辑必须在组件自身的 `<style>` 块中通过 `var(--token)` 引用 `tokens.css` 实现。
> 详见 [StyleSpec.md §2.11](../../../specs/maintainers/StyleSpec.md#211-组件开发禁令-system-layer)


### 6.1 内部布局控制 (Direction)

Frame 通过计算 `direction` 生成对应的样式类名（Level 1 权重）：

| 类别 | 类名 (Level 1) | 描述 |
| :--- | :--- | :--- |
| row | `.snowui-direction-row` | 水平布局 (flex) |
| column | `.snowui-direction-column` | 垂直布局 (flex) |
| grid | `.snowui-direction-grid` | 网格布局 (grid) |
| reverse | `.*-reverse` | 反向布局修饰符 |

> 样式优先级体系详见 [StyleSpec.md §2.6](../../../specs/maintainers/StyleSpec.md#26-样式优先级体系)

#### 6.1.1 自动布局协议 (Auto Layout Protocol)

当 `enableAutoLayout={true}`（默认）且 Frame 声明了 `row` / `column` 时，Frame 会在根 DOM 输出 `data-auto-layout` 属性，自动继承 `auto-layout.css` 提供的 Level 1 结构化规则：

- 首行对齐：Icon＋文字组合默认使用 `row firstLine`，沿用三槽角色；完整规则见 [LayoutProtocol §4.4](../../../specs/maintainers/LayoutProtocol.md#44-首行对齐first-line-alignment)。
- Pin：通过 `as="pin-*"` 定位，不占三槽及首行轨道，可与首行对齐共用。
- 三槽位感知：子元素通过 `data-as="leading"` / `data-as="trailing"` 声明角色，CSS `:has()` 自动切换 Flex ↔ Grid
- Wrap 默认开启，Grid 模式下自动抑制
- Gap 默认 `var(--gap-2)`
- 普通内容宽度默认自动跟随容器宽度策略；`contentFill` / `contentHug` 可显式覆盖
- 镜像排列：`reverse` + Grid 时通过 `direction: rtl` 翻转视觉顺序

设置 `enableAutoLayout={false}` 时不输出此属性，仅使用 `layout.css` 的基础方向类。

完整协议规范详见 [LayoutProtocol.md](../../../specs/maintainers/LayoutProtocol.md)。


### 6.2 布局稳定性 (Layout Stability)

| 关键字 | 类名 (Level 1) | 描述 |
| :--- | :--- | :--- |
| morph | `.snowui-morph-container` | 开启形态过渡容器，使用 CSS Grid Stacking 重叠不同状态内容 |

### 6.3 Surface Hover 覆写变量

**关联文件**: `layout.css`（styles） · [StyleSpec.md §2.4.6](../../../specs/maintainers/StyleSpec.md#246-frame-hover-覆写变量能力化) · [frame-inline-style.svelte.ts](../logic/frame-inline-style.svelte.ts)

当 `.snowui-hoverable` 需要覆盖默认 hover 叠加时，可使用以下变量（无需 `!important`，无需事件脚本）：

| 变量 | 作用 | 默认回退 |
| :--- | :--- | :--- |
| `--snowui-frame-hover-image-override` | 直接覆写 hover 的 `background-image` | 默认 `color-mix` 叠加 |

示例（白色完整覆盖）：

```svelte
<Frame
  class="bg-red text-black-100"
  style="--snowui-frame-hover-image-override: linear-gradient(#ffffff, #ffffff);"
/>
```

---

<a id="7-动效能力-motion-capabilities"></a>

### 动效能力 (Motion Capabilities)

**关联文件**: [frame-motion.svelte.ts](../logic/frame-motion.svelte.ts) · `motion-config.ts` · [frame-inline-style.svelte.ts](../logic/frame-inline-style.svelte.ts)

### 7.0 默认动效系统 (Default Motion System)

**关联文件**: `frame-motion-defaults.ts` · `frame-motion-defaults.md` · [motion/](../motion) · [FlowText.svelte](FlowText.svelte) · [FlowText.md](FlowText.md) · [frame-inline-style.svelte.ts](../logic/frame-inline-style.svelte.ts)

> **Changed in v3.6.0**: 动效文件迁移到 `components/src/motion/` 目录，新增 `enableDefaultMotion` 开关。

Frame 的默认动效系统采用“关键字即触发”的规则：

- **开关控制**: `enableDefaultMotion` 默认为 `true`，所有默认动效自动注入。设为 `false` 时，该 Frame 的所有 `while*` 不自动注入系统默认动效，用户显式传入的 `while*` 配置不受影响。
- 只要使用状态链或触发器（如 `Click` / `Hover` / `Load` / `Active`），对应 `while*` 会自动注入默认动效。
- 页面可直接声明视觉通道：传入 `while*={{ ... }}` 时，对象是完整视觉通道声明，只执行对象中出现的 opacity / scale / x / y / blur / rotate 等通道；不会混入默认视觉通道。未声明的 duration / easing / delay 与 spring 动力学参数仍可使用该 `while*` 默认值。
- 可按关键字关闭默认动效：`whileXxx={false}`。
- 可使用其他动效文件覆写默认动效：`whileActive={FLIP_MOTION}`。
- 默认动效文件统一放在 `src/` 目录，由 `frame-motion-defaults.ts` 集中管理。每个 `while*` 对应一个独立的 `while-*.ts` 文件。
- 基础动效定义文件（`replace.ts`、`fade-out.ts`、`morph.ts`、`move.ts`、`rotate.ts`、`number.ts`）存放在 `src/` 目录。
- 默认数字变化动效使用 `FlowText`（`motionDefaults.number` / `motionDefaults.numberComponent`）。
- 当前策略：
  - 状态/生命周期关键字默认注入可见动效（`whileAppear`→fadeIn，scale 需显式声明；`whileDisappear`→fadeOut, `whileActive`→morph, `whileReload`→rotateClockwise, `whileDisabled`→opacity 0.2）；
  - 交互关键字（`Hover/Click/Focus/Drag/Key`）默认注入空配置（无视觉效果）；
  - 页面可通过 `while*={{...}}` 覆写，或 `while*={false}` 关闭。

在 `children` snippet 中，Frame 会透传默认动效注册表：

```svelte
<Frame Click="Load">
    {#snippet children({ motionDefaults })}
        <Frame whileAppear={true} />
    {/snippet}
</Frame>
```

#### 7.0.1 与组件内部专项动效的职责边界

Frame 默认动效是组件级外层动效与控制层，不是所有内部动画算法的唯一实现入口：

- Frame 负责根元素整体的状态、生命周期、透明度、位移、缩放，以及父级对多个子 Frame 的编排。
- 已有正式规范和共享实现的专项通用能力，可以完全独立于 Frame 默认动效实现内部动画，不要求转换为 `while*` 或消费 Frame bridge 时序。文字动效的字符、字形与数位动画是典型示例。
- 专项动效组件仍须以 `Frame` 为根并透传适用的 Frame Props。因此，父级让全部子级渐隐、显式设置子级 `whileDisappear`，或对组件整体执行位移 / 缩放时，专项动效组件必须像其他 Frame 子级一样响应。
- 外层 Frame 动效与内部专项动效允许同时运行：Frame 控制组件整体，内部能力控制内容细节。两层不得覆盖彼此负责的状态与样式。
- `enableDefaultMotion={false}` 仅关闭当前根 Frame 的自动默认注入；内部专项动效继续有效，显式 `while*` 配置也继续有效。

专项能力是否已经“通用化”，由对应规范和共享模块决定。单个组件的私有动画不应以本节为由绕过 Frame 或重复已有动效基础设施。文字动效的完整边界见 [TextMotionSpec.md §5.1](../../../specs/maintainers/TextMotionSpec.md)。

### while* 关键字的作用

**关联文件**: [frame-motion.svelte.ts](../logic/frame-motion.svelte.ts)

`while*` 关键字是**动效调用者**，不是动效定义。

```svelte
<!-- 定义动效 -->
<script>
    const heightGrow = { height: '+20px', duration: 300 };
</script>

<!-- 调用动效 -->
<Frame whileIdle={heightGrow} />
<Frame whileHover={{ scale: 1.05, duration: 200 }} />
```

### while* 动效值配置

**关联文件**: [frame-motion.svelte.ts](../logic/frame-motion.svelte.ts) · `motion-config.ts`

```svelte
whileActive={{
  // 动效属性
  scale: 1.1,
  opacity: [0, 1],
  height: '+20px',    // 支持增量语法

  // 执行参数
  delay: 100,
  duration: 1500,
  easing: 'cubicOut',
  timeline: 'main:1',

  // 引入动效组件
  component: FlowText,

  // 编排模式（容器使用）
  orchestrate: true,
  orchestrateMode: 'sequential',
  orchestrateDelay: 100,
  orchestrateOrder: 'visual-row'
}}
```

显式对象的视觉通道不会与默认视觉浅合并：`whileAppear={{ opacity: [0, 1] }}` 只渐显，`whileAppear={{ scale: [0.95, 1] }}` 只缩放；两者都可继承默认进入时序。需要组合时把两个通道都写入对象。`whileAppear={true}` 才表示使用完整默认视觉。

SnowUI 组件内部若拥有明确默认视觉，应直接引用组件族 preset；不得用 `whileXxx={true}` 把组件视觉绑定到可能演进的 Frame fallback。Frame 的公共 API、页面级 generic 用法与文档示例仍可使用 boolean。普通组件需要显式保留旧 generic opacity + scale 进入时使用 `GENERIC_SCALE_APPEAR_MOTION`。

### 7.1 事件驱动动效

**关联文件**: [frame-motion.svelte.ts](../logic/frame-motion.svelte.ts)

| 关键字 | 描述 |
| :--- | :--- |
| whileLoad | 加载态动效。仅定义真实组件在加载态下的动效，不再负责进入加载态 |
| whileReload | 重新加载时动效 |
| whileAppear | 出现时动效 |
| whileDisappear | 消失时动效 |
| whileIdle | 空闲时动效 |
| whileActive | 激活时动效 |
| whileDisabled | 禁用时动效 |
| whileClick | 点击时动效 |
| whileDrag | 拖拽时动效 |
| whileHover | 悬停时动效 |
| whileFocus | 聚焦时动效 |
| whileKey | 键盘时动效 |
| whileScroll | 滚动到组件中心时触发 |
| whileValidating | 验证中动效 |
| whileUploading | 上传中动效 |
| whileEditing | 编辑中动效 |

### 7.1.1 默认加载协议 (Default Loading Protocol)

**关联文件**: [Frame.svelte](Frame.svelte) · `frame-skeleton-runtime.svelte.ts` · `frame-dom-runtime.svelte.ts` · [frame-inline-style.svelte.ts](../logic/frame-inline-style.svelte.ts)

**Changed in v3.8.0**: `loading` 成为加载状态入口，`whileLoad` 回归纯加载态动效配置，`skeleton` 独立控制骨架是否显示。

当前规则：

- 页面或区块根节点只需要提供一次加载信号，例如 `<Frame loading={pageLoading}>`
- 子组件无需逐个声明 `loading`，会通过 `SKELETON_CONTEXT_KEY` 自动继承父级 loading
- `skeleton` 默认为 `true`；设为 `false` 时，保留真实组件内容，只让 `whileLoad` 负责加载态动效
- 组件根提供 `renderHints` 即完成 Skeleton 自注册；Frame 输出登记标记并自动渲染对应形态
- 父 Frame 只探测第一层已注册 child，并透传最终 `variant / width / height / radius / rows`
- 未注册的普通 Frame 仍渲染通用 fallback；集中 class mapping 仅保留旧调用方兼容
- 容器型 `Frame` 在存在 `children` 且未命中特定组件映射时，优先保留子树，让子组件各自渲染骨架
- 叶子节点且未命中映射时，回退渲染通用矩形骨架
- 加载期间根节点会自动输出 `aria-busy="true"` 与 `data-loading="true"`，并阻断交互

```svelte
<Frame
    loading={pageLoading}
    renderHints={{ variant: "circle", width: 80, height: 80 }}
/>
```

这意味着：

- 不再需要为页面手写一整套与真实组件并行的 Skeleton HTML
- 仍然需要有一个明确的加载信号来源，但它通常只出现在页面根或区块根

```svelte
<Frame loading={pageLoading}>
    <Avatar src={user.avatar} />
    <Text>{user.name}</Text>
    <Button>提交</Button>
</Frame>
```

```svelte
<Frame
    loading={pageLoading}
    skeleton={false}
    whileLoad={{ opacity: 0.6, scale: 0.98 }}
>
    <Button>提交</Button>
</Frame>
```

### 7.2 形态驱动动效

**关联文件**: [frame-motion.svelte.ts](../logic/frame-motion.svelte.ts) · [motion/expand.ts](../motion/expand.ts) · [motion/expand.md](../motion/expand.md)

| 关键字 | 描述 | 默认动效 |
| :--- | :--- | :--- |
| whileCollapsed | 收起时动效 | `EXPAND_OUT_MOTION`（scale 1→0.95 + 渐隐，250ms easeOut） |
| whileExpanded | 展开时动效 | `EXPAND_IN_MOTION`（scale 0.95→1 + 渐现，250ms easeOut） |

`EXPAND_IN_MOTION` / `EXPAND_OUT_MOTION` 也可直接用于 `whileAppear` / `whileDisappear`，适合全屏放大、抽屉弹出等场景。

```svelte
<!-- 示例：全屏面板放大进场，退出反向播放 -->
<script>
    import { EXPAND_IN_MOTION } from "../expand";
</script>

{#if isOpen}
    <Frame
        bind:this={panelFrame}
        whileAppear={EXPAND_IN_MOTION}
    >
        <!-- 内容 -->
    </Frame>
{/if}
```

### 7.3 响应式驱动动效

**关联文件**: [frame-motion.svelte.ts](../logic/frame-motion.svelte.ts) · `frame-responsive.svelte.ts`

| 关键字 | 描述 |
| :--- | :--- |
| whileXs | 超小屏动效 |
| whileSm | 小屏动效 |
| whileMd | 中屏动效 |
| whileLg | 大屏动效 |
| whileXl | 超大屏动效 |
| while2xl | 超超大屏动效 |

### 7.4 动效参数

**关联文件**: `motion-config.ts` · [frame-motion.svelte.ts](../logic/frame-motion.svelte.ts)

**顶级 Props** (直接传给 Frame)：


**MotionConfig 内部属性** (在 `while*` 配置对象内使用)：

| 属性 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| duration | `number` | 300 | 动画持续时间 (ms) |
| easing | `EasingFunction` | cubicOut | 缓动函数 |
| scale | `number \| [number, number]` | - | 缩放 |
| blur | `number \| string \| [number \| string, number \| string]` | - | 模糊半径；数字按 px 处理 |
| component | `Component` | - | 动效组件 (FlowText, Spin 等) |

```svelte
<!-- duration/easing 在 while* 配置内部使用 -->
<Frame whileHover={{ scale: 1.05, duration: 200, easing: 'easeOut' }} />

<!-- 持续循环组件可使用 loopMotion 统一时序 -->
<Frame loopMotion={{ duration: 1000, easing: 'linear', iterationCount: 'infinite' }} />

<!-- 直接启用 Frame 根节点的连续旋转默认能力 -->
<Frame loopMotion={{ preset: 'rotateClockwise', duration: 1000, easing: 'linear', iterationCount: 'infinite' }} />
```

### 7.5 滚动联动 (Scroll-Linked)

**关联文件**: [frame-motion.svelte.ts](../logic/frame-motion.svelte.ts)

通过 `scroll` 属性将动效属性与滚动进度绑定。

```svelte
<Frame
    scroll={{
        offset: ["start center", "end center"],
        y: [50, -50],      // 视差移动
        opacity: [0, 1],   // 透明度变化
        scale: [0.8, 1.2]  // 缩放变化
    }}
>
    Parallax Item
</Frame>
```

### 7.6 共享元素转场 (Shared Element / FLIP)

**关联文件**: [frame-motion.svelte.ts](../logic/frame-motion.svelte.ts) · [layout-flip.ts](../logic/layout-flip.ts)

通过 `layoutId` / `itemId` 实现跨状态或跨挂载周期的无缝形变转场（FLIP：First → Last → Invert → Play）。时序与系统其他动效统一，默认 **300ms ease-out**。

共享 `layout-flip.ts` 提供两种转场策略：

| `strategy` | 实现 | 适用场景 |
| :--- | :--- | :--- |
| `"transform"`（默认） | 过渡 `translate + scale` | 图片、卡片、无需保持内部字形尺寸的高性能共享元素转场 |
| `"layout"` | 实际过渡 `top / left / width / height` | 代码、正文等字体大小前后一致的排版内容；内部字形不参与缩放，宽高变化由浏览器实时重排 |

`layout` 策略属于共享模块能力。进入时由组件在目标挂载后调用 `beginFlipEnter(id, element, { strategy: "layout" })`；退出时可调用 `applyFlipExit(element, target, { strategy: "layout" })`，或把同一选项传给 Frame controller 的 `playFlipTo`。未声明策略的既有 `layoutId` 自动进场保持默认 `transform` 行为。

**自动触发（挂载即播放）**：只需在目标 Frame 声明相同 `layoutId`，Frame 在 `$effect` 中自动从模块注册表读取起点并播放进场动效：

```svelte
<!-- List.svelte：元素消失前会被 Motion 自动记录位置 -->
<Frame layoutId=”product-image-1” class=”size-40 rounded-4” />

<!-- Detail.svelte：挂载后自动 FLIP 从上一个位置放大到当前位置 -->
<Frame layoutId=”product-image-1” class=”w-full h-300 rounded-0” />
```

**手动触发（组件自控进退场）**：适用于覆盖层、全屏放大等需要在 JS 层控制进退的场景。Frame controller 暴露四个方法，其中 `captureFlip` / `playFlipTo` **无需 `initMotion()` 上下文**，在任意组件中均可使用：

| 方法 | 是否需要 initMotion | 描述 |
| :--- | :---: | :--- |
| `captureFlip(layoutId?)` | 否 | 捕获当前 Frame 位置写入模块级注册表，供目标 Frame 挂载时读取起点。 |
| `playFlipTo(target, options?)` | 否 | 将当前 Frame 以 FLIP 方式退场到目标 `HTMLElement` 或 `DOMRect`，动画结束后调用 `options.onComplete`。时序 300ms ease-out。 |
| `captureLayout(layoutId?)` | 是 | 同上，但通过 Motion 编排上下文存储，适合需要全局 Motion 协调的场景。 |
| `playLayoutTo(target, options?)` | 是 | 同上，通过 Motion 编排器驱动，支持更复杂的时序读取（appear bridge 变量）。 |

```svelte
<script lang="ts">
  import { Frame, Button } from '@snowui-design-system/components';
  let rootFrame: ReturnType<typeof Frame>;
  let fullscreenFrame: ReturnType<typeof Frame>;
  let cardElement = $state<HTMLElement>();
  let isFullscreen = $state(false);
  function enterFullscreen() {
    rootFrame.getController().captureFlip('my-fullscreen');
    isFullscreen = true;
  }
  function exitFullscreen() {
    if (!cardElement) return;
    fullscreenFrame.getController().playFlipTo(cardElement, {
      onComplete: () => { isFullscreen = false; }
    });
  }
</script>

<Frame bind:this={rootFrame} bind:element={cardElement}>
  <Button onclick={enterFullscreen}>展开卡片</Button>
</Frame>
{#if isFullscreen}
  <Frame bind:this={fullscreenFrame} layoutId="my-fullscreen" style="position: fixed; inset: 0; background: var(--white-100); padding: var(--padding-6);">
    <Button onclick={exitFullscreen}>返回卡片</Button>
  </Frame>
{/if}
```

###  7.7 编排模式 (Orchestration)

**关联文件**: [frame-motion.svelte.ts](../logic/frame-motion.svelte.ts)

父组件通过简单关键字控制子组件动效的**启动时机**。

| 关键字 | 描述 |
| :--- | :--- |
| orchestrate | 启用编排模式 |
| orchestrateMode | 模式: `sequential`, `random`, `parallel` |
| orchestrateDelay | 子组件启动间隔 (ms)，默认 100ms |
| orchestrateOrder | 排序: `visual-row`, `visual-column`, `dom` |
| orchestrateGroup | 编排组 ID |
| orchestrateTrigger | 触发时机: `appear`, `hover`, `click`, `scroll`, `none` |
| orchestrateTarget | 目标选择器 |

```svelte
<!-- 3个卡片按视觉从左到右顺序，每隔200ms依次淡入 -->
<Frame orchestrate orchestrateMode="sequential" orchestrateDelay={200} orchestrateOrder="visual-row">
    <Card whileAppear={{ opacity: [0, 1] }} />
    <Card whileAppear={{ opacity: [0, 1] }} />
    <Card whileAppear={{ opacity: [0, 1] }} />
</Frame>
```

---

<a id="8-联动控制-linkage-control"></a>

###  联动控制 (Linkage Control)

**关联文件**: [frame-motion.svelte.ts](../logic/frame-motion.svelte.ts) · [frame-state.svelte.ts](../logic/frame-state.svelte.ts)

所有事件关键字 (`Click`, `Hover`, `Focus` 等) 支持**控制其他组件**的动效。

### 用法

**关联文件**: [frame-motion.svelte.ts](../logic/frame-motion.svelte.ts)

| 属性 | 类型 | 描述 |
| :--- | :--- | :--- |
| target | `string` | 目标组件的 `id` |
| action | `'play' \| 'reset' \| 'pause'` | 动作类型 |

### 示例

**关联文件**: [frame-motion.svelte.ts](../logic/frame-motion.svelte.ts)

```svelte
<!-- 点击播放图表动效 -->
<Button Click={{ target: 'chart-bars', action: 'play' }}>Start</Button>

<!-- 悬停时显示提示 -->
<Card Hover={{ target: 'tooltip-1', action: 'play' }}>Hover me</Card>

<!-- 重置动效 -->
<Button Click={{ target: 'chart-bars', action: 'reset' }}>Reset</Button>
```

---

<a id="9-frame-演进-frame-evolution"></a>

### Frame 演进 (Frame Evolution)

**关联文件**: `layout.css` · [frame-perception.svelte.ts](../logic/frame-perception.svelte.ts)

### 9.1 CSS 行为工具类

**关联文件**: `layout.css`

Frame 不再提供角色属性。组件需要共享行为时，主动在 `class` 中声明工具类；组件语义相关的 cursor、user-select、link hover 等由组件 CSS 自治。

| 工具类 | 描述 | 默认行为 |
| :--- | :--- | :--- |
| `.snowui-hoverable` | 可操作表面的 hover 叠加 | 仅提供背景叠加，不提供 cursor |
| `.snowui-field-bordered` | 输入外框 | 边框、hover border、focus-within ring |

```svelte
<Frame>Click Me</Frame>
```

### 9.2 能力作用域 (Scope)

**关联文件**: [frame-perception.svelte.ts](../logic/frame-perception.svelte.ts)

通过 `scope` 属性控制能力的传播范围。

| Scope | 描述 |
| :--- | :--- |
| `undefined` | 默认，无约束 |
| `self` | 仅作用于组件自身 |
| `children` | 仅直接子组件 (深度 = 1) |
| `descendants` | 作用于整个子树 |
| `explicit` | 仅显式指定的目标 |

### 9.3 上下文权限 (Access)

**关联文件**: [frame-perception.svelte.ts](../logic/frame-perception.svelte.ts)

通过 `access` 属性控制组件对上下文的交互权限。

| Access | 描述 |
| :--- | :--- |
| `writeable` | 默认，可触发操作 |
| `readonly` | 只读，不能触发对他人的操作 |

```svelte
<Frame access="readonly">
    I can read context, but I can't trigger actions.
</Frame>
```

---


> 此区域的内容受保护。AI 在修改此区域前必须请求用户审查。

在此处添加您的自定义说明、业务逻辑约束或特定示例。

---

<a id="10-样式编排-style-orchestration"></a>

###  样式编排 (Style Orchestration)

**关联文件**: [frame-orchestrator.svelte.ts](../logic/frame-orchestrator.svelte.ts) · [frame-orchestrator.md](../logic/frame-orchestrator.md) · [frame-inline-style.svelte.ts](../logic/frame-inline-style.svelte.ts) · `frame-dom-runtime.svelte.ts`

Frame 样式编排系统是一个**集中式、高优先级、支持复杂运算**的样式控制系统。它允许开发者在父容器（Orchestrator）中通过 ID 精确控制任意深层子组件（Target）的样式，建立组件间的联动关系。

### 10.1 核心能力

1.  **穿透控制**: `root` -> `#child_btn`，无需逐层传递 Props。
2.  **复杂运算**: 支持 JS 表达式 (e.g. `size > 20 ? 4 : 0`)。
3.  **联动响应**: 监听 A 组件状态 (`width`, `hover`) 实时驱动 B 组件样式。
4.  **高优先级**: 默认作为 Inline Style 应用 (P6)，必要时可通过 `force` 提升至 P7 (`!important`)。

### 10.2 API 概览

在根 Frame 上定义 `styles` 属性：

```svelte
<Frame
    id="root"
    styles={{
        // 简单赋值 (覆盖默认 Props)
        "#frame3": { padding: 8, radius: 4 },

        // 嵌套组件定位
        "#frame3_btn": { size: 32 },

        // 依赖计算 (联动)
        "#frame3_icon": {
            // 当 frame3_btn 变大时，icon 随之变大 (1.2倍)
            size: "1.2 * $#frame3_btn.size",
            // 逻辑判断
            opacity: "$#root.width > 500 ? 1 : 0"
        }
    }}
>
    <!-- ... deep nested children ... -->
</Frame>
```

### 10.3 可编排属性 (Keywords)
**关联文件**: [frame-orchestrator.md](../logic/frame-orchestrator.md)

> [!NOTE] 唯一标识符 (ID Requirement)
> 样式编排依赖组件的 `id` 属性进行寻址，规则如下：
> - **受控组件 (Target)**: **必须**提供 `id` (e.g., `id="icon"`), 否则无法被 `styles` 规则选中。
> - **编排容器 (Provider)**: **可选**提供 `id`。仅当需要引用自身属性（如 `$#root.width`）作为计算源时才需要 ID。
> - **变量暴露**: 只有显式设置 ID 的组件，其属性才会暴露为 CSS 变量 (e.g. `--[id]-padding`)。暴露的规则遵循 [StyleSpec.md §2.1](../../../specs/maintainers/StyleSpec.md#21-token-使用规范)，采用计算后的基准模式。

| 属性 | 说明 | 对应 CSS 变量 (自动暴露计算值) |
| :--- | :--- | :--- |
| `width` | 宽度 | `--[id]-width` |
| `height` | 高度 | `--[id]-height` |
| `minWidth` | 最小宽度 | `--[id]-min-width` |
| `minHeight` | 最小高度 | `--[id]-min-height` |
| `size` | 统一尺寸 | `--[id]-size` |
| `padding` | 内边距 | `--[id]-padding` |
| `gap` | 间距 | `--[id]-gap` |
| `radius` | 圆角 | `--[id]-radius` |
| `fontSize` | 字体大小 (1-8，自动配对行高) | `--[id]-font-size` + `--[id]-line-height` (StyleSpec §2.1 映射模式) |
| `border` | 外边框 | `--[id]-border` |
| `innerBorder` | 内边框 | `--[id]-inner-border` |
| `opacity` | 透明度 (0-1) | `--[id]-opacity` |

### 10.4 表达式语法 (Expression Syntax)

支持 JS 子集语法，变量需加 `$` 前缀：

- **引用变量**: `$#target.prop` (e.g. `$#sidebar.width`)
- **自身引用**: `$self.width`
- **数学运算**: `+`, `-`, `*`, `/`, `%`
- **逻辑运算**: `>`, `<`, `>=`, `<=`, `==`, `!=`, `&&`, `||`
- **三元运算**: `condition ? trueVal : falseVal`
- **Math 函数**: `Math.max(...)`, `Math.min(...)`, `Math.floor(...)`

示例：
```javascript
// 侧边栏展开时(>200px)显示文字，否则隐藏
opacity: "$#sidebar.width > 200 ? 1 : 0"

// 动态字号：宽度每增加 100px，字号 +1
fontSize: "12 + Math.floor($self.width / 100)"
```

### 10.5 优先级规则 (Priority)

| 场景 | 权重 | 结果 |
| :--- | :--- | :--- |
| **Orchestration** vs **Props** | P6 vs P4 | **Orchestration 胜出** (Inline Style > CSS Var) |
| **Orchestration** vs **Class** | P6 vs P5 | **Orchestration 胜出** (Inline Style > Class) |
| **Orchestration** vs **Style** | P6 vs P6 | **最后应用者胜出** (通常 Orchestrator 后执行) |
| **Orchestration(Force)** | P7 | **胜出** (`!important` 覆盖内联) |

如需强制覆盖所有（包括内联样式），请使用 `force` 修饰符（尚未开放 API，目前按需内部处理）。

---



## Site guide: frame

<!-- site-guide:frame -->
### When to use Frame {#when-to-use}

Frame is the shared host for layout, state, loading, motion, and explicit coordination between components. Use semantic HTML when a page only needs ordinary structure.

### Import {#import}

```ts
import { Frame, initMotion } from '@snowui-design-system/components';
```

### Layout and content {#layout-and-content}

Use row, column, grid, as, and row firstLine to compose content. Use public tokens and class/style for visual values. loading and skeleton share the same inherited context.

### Coordination {#coordination}

Call initMotion() during parent component initialization when using cross-component motion. Frame supports orchestrate*, target/action triggers, and styles rules. These capabilities use the same Frame implementation and context as ordinary layout.

### API and examples {#api-and-examples}

[API reference](/components/frame#api-reference) · [Complete manual](/components/frame/reference) · [Quick Start](/components/quick-start)
### Next steps {#next-steps}

- [Quick Start](/components/quick-start)
- [ScrollArea](/components/scroll-area)

<!-- /site-guide:frame -->

## AI Zone

### 1.1 动效时序桥接变量 (Motion Timing Bridge)

**关联文件**: `bridge.ts`

Frame 会在根节点内联样式上暴露以下时序变量，供控制类组件直接复用默认动效的持续时间和缓动曲线，而不再各自维护一套本地 `duration/easing`：

- `--snowui-frame-control-motion-duration` / `--snowui-frame-control-motion-easing` / `--snowui-frame-control-motion-transition`
- `--snowui-frame-border-motion-duration` / `--snowui-frame-border-motion-easing` / `--snowui-frame-border-motion-transition`
- `--snowui-frame-appear-motion-duration` / `--snowui-frame-appear-motion-easing` / `--snowui-frame-appear-motion-transition`
- `--snowui-frame-color-motion-duration` / `--snowui-frame-color-motion-easing` / `--snowui-frame-color-motion-transition`
- `--snowui-frame-size-motion-duration` / `--snowui-frame-size-motion-easing` / `--snowui-frame-size-motion-transition`
- `--snowui-frame-loop-motion-duration` / `--snowui-frame-loop-motion-easing` / `--snowui-frame-loop-motion-iteration-count` / `--snowui-frame-loop-motion-direction` / `--snowui-frame-loop-motion-play-state`

默认解析规则：
- `control` / `border` 默认跟随 `whileActive` 的解析结果；未显式配置时回退到 Frame 的默认 morph 时序（默认 `250ms ease-out`）。
- `appear` 默认跟随 `whileAppear` 的解析结果；若组件走 `Idle -> Active` 自动链路，则可继续复用 `whileActive` / `stateStyle` 的默认时序。
- `color` 默认跟随 `whileHover` 的解析结果（150ms easeOut),用于前景/背景色过渡;Tab/Segmented 等切换组件可直接消费。
- `size` 默认跟随 `whileActive` 的解析结果(回退 `MORPH_MOTION` 250ms easeOut),用于 width/height/min-* 过渡;Tab/Segmented 的 icon-toggle variant 展开宽度即消费此桥接。
- `loop` 仅在显式传入 `loopMotion` 时输出；其中 `duration / easing / iterationCount / direction / playState` 用于时序桥接。
- 当 `loopMotion.preset="rotateClockwise"` 时，`Frame` 会在根节点直接启用内建的连续旋转默认能力；对应关键帧资源定义在 [rotate.css](../motion/rotate.css)，未传 `preset` 时不会强行覆盖组件自己的循环视觉。

> **按需输出说明**: 自 `v3.8.7` 起，`control / border / appear` 这三组桥接变量仅在当前 `Frame` 真的声明了对应 motion 配置时才会写入 HTML；普通无动效组件将直接依赖组件侧 fallback，不再默认输出整段 `300ms ease-out` 内联变量。


---

<a id="2-基础属性-base-props"></a>


> **样式规范**: 详见 [StyleSpec.md](../../../specs/maintainers/StyleSpec.md)


### 统一 Frame 的能力结构

Frame 通过共享模块统一实现布局、状态、自身动效与跨组件协调。编排模式见 §7.7，联动控制见 §8，样式寻址见 §10；所需 Motion 上下文和启用条件以各节 API 为准。


---

`Frame.svelte` 是统一宿主，提供布局、JS 动效、交互状态机、FLIP、可见性感知、动作与跨组件编排。

阅读本文件时，需要先建立以下目录认知：

- `Frame` 的共享逻辑统一位于 `components/src/logic/`。
- `Frame` 的默认动效实现位于 `components/src/`（来自 `@snowui-design-system/components`）。
- `Frame` 的基础动效原子（如 `fade / scale / slide / stackTranslate`）位于 `components/src/motion/primitives.ts`；Frame 负责消费这些原子并参与跨 Frame 协调，不重复定义一套平行原子。

---

<a id="开发者指南-ai"></a>

### 开发者指南 (AI)

### 角色模式覆盖契约模板（适用于所有组件）

> 规范来源：`../../../specs/maintainers/StyleSpec.md` §2.9.1

当组件可作为子组件（`as` / slot / children）被宿主组合时，必须提供可覆盖变量桥接，禁止将视觉属性硬编码为不可覆盖终值。

标准写法：

```css
/* 子组件内部：用 override 变量桥接到内部计算值 */
:global(:where(.snowui-foo)) {
  width: var(--snowui-foo-size-override, var(--size-4));
  height: var(--snowui-foo-size-override, var(--size-4));
  gap: var(--snowui-foo-gap-override, var(--gap-1));
  border-radius: var(--snowui-foo-radius-override, var(--radius-2));
}
```

```svelte
<!-- 宿主组件：只注入 override 变量，不直接耦合子组件私有结构 -->
<Foo class="host-foo" />

<style>
  :global(:where(.host-foo)) {
    --snowui-foo-size-override: 1.2em;
  }
</style>
```

覆盖链（高 → 低）：
1. 用户外部传入 `--snowui-*-override`
2. 宿主组件注入 `--snowui-*-override`
3. 子组件 props 计算值
4. 子组件默认 Token 值

禁止事项：
- 禁止宿主通过选择器直接改子组件私有节点视觉属性。
- 禁止在可组合组件中以 inline style 直接写死最终视觉值（应优先写变量桥接）。

### 开发者关键字 (AI Keywords)

以下关键字用户不直接使用，仅供 AI/开发者维护代码时参考：

| 类别 | 关键字 | 描述 |
|:---|:---|:---|
| **Context Key** | `FRAME_CONTEXT_KEY` | Frame 上下文的 Symbol，用于 `getContext()` |
| **派生状态** | `currentState` | 当前状态机状态 |
| **派生状态** | `breakpoint` | 当前响应式断点 |
| **派生状态** | `parent` | 父组件上下文引用 |

#### 上下文感知范围

子组件通过 `getContext(FRAME_CONTEXT_KEY)` 可感知父组件的完整能力：

| 类别 | 可感知的关键字 |
| :--- | :--- |
| **基础属性** | `class`, `style`, `as`, `tag`, `id`, `size` |
| **核心状态** | `currentState`, `StartLoad`, `Load`, `Reload`, `Appear`, `Disappear`, `Idle`, `Active`, `Disabled`, `Validating`, `Uploading`, `Editing` |
| **事件** | `Click`, `Drag`, `Hover`, `Focus`, `Key`, `Scroll` |
| **形态** | `collapsed`, `expanded` |
| **响应式** | `breakpoint`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl` |
| **布局** | `row`, `column`, `grid`, `reverse`, `firstLine`, `morph` |
| **动效** | `whileLoad`, `whileReload`, `whileAppear`, `whileDisappear`, `whileIdle`, `whileActive`, `whileDisabled`, `whileClick`, `whileDrag`, `whileHover`, `whileFocus`, `whileKey`, `whileScroll`, `whileValidating`, `whileUploading`, `whileEditing`, `whileCollapsed`, `whileExpanded`, `whileXs`, `whileSm`, `whileMd`, `whileLg`, `whileXl`, `while2xl` |
| **编排** | `orchestrate`, `orchestrateMode`, `orchestrateDelay`, `orchestrateOrder`, `orchestrateGroup`, `orchestrateTrigger`, `orchestrateTarget` |
| **链式继承** | `parent` (访问祖父组件上下文) |

#### 父状态声明式消费组件

以下组件已接入父 Frame 状态消费协议。它们通过 `FRAME_CONTEXT_KEY.currentState` 读取最近父级状态，只改变自身展示，不修改父 Frame 状态，不属于 §7.7 / §8 / §10 的跨组件协调能力。

| 组件 | 关键字 | 行为 |
| :--- | :--- | :--- |
| `Icon` | `stateIcon` | 按父 Frame 状态切换图标组件；状态值为 `null` 时隐藏 Icon。 |
| `Text` | `stateText` | 按父 Frame 状态切换文本内容。 |

```svelte
<Button
    Click={{ Idle: "Pending", Active: "Idle" }}
    Pending={["Active", "auto"]}
>
    <Icon stateIcon={{ Idle: null, Pending: Spinner, Active: Check }} />
    <Text stateText={{ Idle: "Ready", Pending: "Loading...", Active: "Completed" }} />
</Button>
```

> `Load` 是 Frame loading / skeleton 协议状态名。若只是按钮任务处理中并需要展示真实 Spinner / 文案,使用 `Pending` 这类业务状态名。

### 模块索引 (Module Index)

| 模块 | 代码文件 | 文档 | 职责 |
|:---|:---|:---|:---|
| Identity | `frame-identity.svelte.ts` | `frame-identity.md` | 身份标识管理 |
| State | [frame-state.svelte.ts](../logic/frame-state.svelte.ts) | [frame-state.md](../logic/frame-state.md) | 状态管理 |
| Layout | `frame-layout.svelte.ts` | `frame-layout.md` | 布局计算 |
| Responsive | `frame-responsive.svelte.ts` | `frame-responsive.md` | 响应式监听 |
| Motion | [frame-motion.svelte.ts](../logic/frame-motion.svelte.ts) | [frame-motion.md](../logic/frame-motion.md) | 动效编排 |
| MotionDefaults | `frame-motion-defaults.ts` | `frame-motion-defaults.md` | 默认 `while*` 动效注册与解析 |
| Perception | [frame-perception.svelte.ts](../logic/frame-perception.svelte.ts) | [frame-perception.md](../logic/frame-perception.md) | 上下文感知 |
| ScaleObserver | [frame-scale-observer.svelte.ts](../logic/frame-scale-observer.svelte.ts) | [frame-scale-observer.md](../logic/frame-scale-observer.md) | 运行时宽高/高宽比/统一尺寸监听与变量写入 |
| ScaleResolver | [frame-scale-resolver.svelte.ts](../logic/frame-scale-resolver.svelte.ts) | [frame-scale-resolver.md](../logic/frame-scale-resolver.md) | Scale 参数与样式变量解析 |
| Actions | [frame-actions.svelte.ts](../logic/frame-actions.svelte.ts) | [frame-actions.md](../logic/frame-actions.md) | Frame actions 组装与挂载 |
| PropFilter | `frame-prop-filter.ts` | `frame-prop-filter.md` | DOM 透传属性过滤 |
| StateValue | `frame-state-value.ts` | `frame-state-value.md` | 子组件按父 Frame `currentState` 解析状态值 |
| CSS 行为工具类 | `layout.css` | `layout.css` | hoverable / field-bordered 样式 |
| Types | `frame-types.ts` | `frame-types.md` | 类型定义 |
| Utils | `frame-utils.ts` | `frame-utils.md` | 工具函数 |
| InlineStyle | [frame-inline-style.svelte.ts](../logic/frame-inline-style.svelte.ts) | [frame-inline-style.md](../logic/frame-inline-style.md) | 统一拼装 `computedStyle`、时序桥接与 `while*` 内联样式 |
| DomRuntime | `frame-dom-runtime.svelte.ts` | `frame-dom-runtime.md` | 统一拼装 DOM props、事件包装器与运行时 `data-*` 属性 |
| SkeletonRuntime | `frame-skeleton-runtime.svelte.ts` | `frame-skeleton-runtime.md` | 统一处理 Skeleton probe、子骨架探测与加载渲染前判定 |
| ClassState | [frame-class-state.svelte.ts](../logic/frame-class-state.svelte.ts) | [frame-class-state.md](../logic/frame-class-state.md) | 统一解析 `stateVars/stateClass/stateStyle`、`childrenRenderContext` 与 `computedClass` |

### 统管式拆分边界（文档先行）

> 本节用于约束本轮 Frame 可维护性重构的边界。当前规划中的 4 个 runtime 模块均已落地，以下内容保留为后续继续维护 `Frame.svelte` 统管结构时的约束记录。

#### 重构目标

- `Frame.svelte` 继续作为唯一渲染入口与统管节点，不拆出新的子组件。
- 对外 API、关键字语义、渲染分支与 Context 协议保持不变。
- 仅把主文件中体积过大的“计算层 / 组装层 / 桥接层”抽到 `components/src/logic/`。

#### `Frame.svelte` 保留职责

- Props 入口、class / style 透传与能力开关推导
- `Identity` / `State` / `Layout` / `Responsive` / `Motion` / `Perception` / `Orchestrator` 初始化
- `getContext()` / `setContext()` 与 loading / skeleton 上下文串接
- `<svelte:element>` 模板本身
- Skeleton / `stateContent` / `children` 的最终渲染分支
- `getController()` 等对外暴露能力

#### 逻辑层落地结果

本轮统管式拆分的 4 个逻辑层均已落地：

| 模块文件 | 已承接职责 |
|:---|:---|
| `./../logic/frame-inline-style.svelte.ts` | `computedStyle`、`while*` 内联样式、时序桥接与 Orchestration 暴露变量 |
| `../logic/frame-dom-runtime.svelte.ts` | DOM props、可访问性补齐、原生事件包装器与运行时 `data-*` 属性 |
| `../logic/frame-skeleton-runtime.svelte.ts` | Skeleton probe、子骨架探测与加载渲染前判定 |
| `./../logic/frame-class-state.svelte.ts` | `stateVars/stateClass/stateStyle`、`childrenRenderContext` 与 `computedClass` |

#### 实施顺序（约束）

1. 已完成：`frame-inline-style.svelte.ts`
2. 已完成：`frame-dom-runtime.svelte.ts`
3. 已完成：`frame-skeleton-runtime.svelte.ts`
4. 已完成：`frame-class-state.svelte.ts`

#### 禁止事项

- 禁止把 `Frame` 的渲染分支拆成新的子组件
- 禁止借重构之名修改公开关键字、删除现有能力或改写 Skeleton / Context 协议

### 关键字映射 (Keyword Handling)

| 关键字 | 处理模块 | 逻辑说明 |
| :--- | :--- | :--- |
| enableResponsive | `Frame.svelte` | 控制 `FrameResponsive` 初始化 |
| enableContext | `Frame.svelte` | 控制 `FramePerception` 初始化 |
| enableScaleObserver | `Frame.svelte` + `frame-actions.svelte.ts` | 控制 `frameScaleObserver` action 是否挂载 |
| scaleHeightVar | `frame-scale-observer.svelte.ts` | 运行时高度写入目标变量名 |
| scaleWidthVar | `frame-scale-observer.svelte.ts` | 运行时宽度写入目标变量名 |
| scaleAspectRatioVar | `frame-scale-observer.svelte.ts` | 运行时高宽比写入目标变量名 |
| scaleSizeVar | `frame-scale-observer.svelte.ts` | 运行时统一尺寸写入目标变量名 |
| scaleObserverTarget | `frame-scale-observer.svelte.ts` | 监听目标（self/parent） |
| scaleBasis | `frame-scale-resolver.svelte.ts` + `scale.css` | 控制 `height/width/mixed/aspect` 计算依据 |
| scaleMixHeightWeight | `Frame.svelte` + `scale.css` | 混合模式下高宽权重 |
| scaleAspectBaseRatio | `Frame.svelte` + `scale.css` | 高宽比模式参考值 |
| sizeRatio | `frame-scale-resolver.svelte.ts` + `frame-scale-observer.svelte.ts` + `scale.css` | 统一尺寸比例（组件/非组件共享） |
| iconSizeRatio | `frame-scale-resolver.svelte.ts` + `scale.css` | Icon 独立比例，默认继承 sizeRatio |
| avatarSizeRatio | `frame-scale-resolver.svelte.ts` + `scale.css` | Avatar 独立比例，默认继承 sizeRatio |
| class/style/id | `Identity` | 样式和标识合并 |
| Click/Hover/Focus | `State` | 事件触发状态转变 |
| stateVars/stateClass/stateStyle | `frame-class-state.svelte.ts` | 按 `currentState` 解析状态变量、附加 class 与内联 style |
| stateContent | `Frame.svelte` + `frame-class-state.svelte.ts` | 使用状态解析结果驱动 Snippet 切换，并沿用统一的 `childrenRenderContext` |
| while* | `Motion` | 动效配置和触发 |
| responsive | `Responsive` | 断点检测和 props 覆写 |
| row/column/grid | `Layout` | 布局方向计算 |
| orchestrate* | `Motion` | 编排配置 || Native DOM Events | `frame-prop-filter.ts` | 原生事件处理器分离 |
| Internal Prop Filtering | `frame-prop-filter.ts` | 过滤内部关键字，避免 DOM 泄漏 |

### 关联关系

**子组件**: Button, Text, Avatar, Icon, Badge, Skeleton, AvatarGroup

**规范文档**:
- [ComponentGuidelines.md](../../../specs/maintainers/ComponentGuidelines.md) - CSS 行为 与样式体系规范
- [KeywordSystem.md](../../../specs/maintainers/KeywordSystem.md) - 关键字分类
- [tokens.css](../styles/tokens.css) - CSS Token 定义

**其他模块**:
- `geometry-cache.ts` - 几何缓存
- [keys.ts](../keys.ts) - Context Keys

---


## 更新日志

### v5.0.0 (2026-10-09)

- 统一为单一 Frame 组件，保留基础宿主与跨组件协调能力；公开 API、文档、Test 与 Site 共用入口。
