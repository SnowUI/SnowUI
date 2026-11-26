# Text 更新日志

### v3.5.4 (2026-10-22)

- 显式 singleLine 宿主内，单行 Tooltip Hug 锚点保持垂直居中；普通文本流与列布局不变。
- 单行截断保留完整辅助技术文本，原生标签与按钮名称不随可见前缀缩短；视觉拟合、省略符和 Tooltip 继续由同一 Text 所有者提供。

### v3.5.3 (2026-10-12)

- 传入 children 使用独立内部名称，避免与 Frame 的同名 Snippet 自引用；修复运行包 SSR 分类标题等普通文本导致的递归错误，公开内容和 breakpoint 参数不变。
- 2026-09-21：统一使用文档、源码属性表与 Site / AI 阅读入口；仅文档修订，不改变组件行为。

### v3.5.2 (2026-08-15)

- `p / h1…h6` 语义宿主显式启用 `overflow-wrap: break-word`，未引入可选 `snowui-base.css` 时仍保持长词保护；`tag="code"` 继续允许消费应用级 code 初始化。

### v3.5.1 (2026-08-06)

- 未声明 `lines` 时截断控制器完全休眠，不读取文字、不创建观察目标；动态启用截断时仍按原协议激活。

### v3.5.0 (2026-07-04)

- `lines=0` 新增默认关闭的 `more` 内置 Button，样式采用示例 6 的 ArrowLineDown 按钮。
- 内置 more Button 开启 `backgroundBlur`，背景模糊强度与 BarChart 模糊浮层保持一致。
- 新增 `parts.Button`，显式 `Button as="more"` 可替换内置按钮。
- 无 more 时复用 `.snowui-scroll-mask` 与 `useOverlayScrollbar`，提供上下渐隐和 Textarea 同规则浮层滚动条；有 more 时保持展开模式且不显示滚动条。

### v3.4.0 (2026-06-23)

#### 修复
- **TX-Fix.57** `lines={1}` 改为共享边界拟合 + 显式行内省略符，修复自动 Tooltip 场景不显示省略号，并避免单词、汉字、emoji 与组合字符被切半。
- **TX-Fix.58** `lines={2|3}` 将 line-clamp 内容层与 Tooltip 拆开，避免省略号之后继续显示文本；真实截断时统一显示 Tooltip 与手形光标。多行宿主恢复 block 布局，消除 inline baseline 产生的底部空白。恢复控制器初始 `lines`，修复 `lines={0}` 收起态底部渐隐丢失。
- **TX-Fix.60** `lines={2|3}` 使用 `text-box-trim: trim-end` 与 `text-box-edge: text` 修剪末行下方的 half-leading；消除字体 ascent / descent 不对称造成的“底部 padding 更大”错觉，同时保留下沉字符安全空间。
- **TX-Fix.61** 修复多行宿主仍被 `.snowui-text-inline-block` 覆盖的问题，确保 `lines={2|3}` 根节点使用 block 布局，不再产生 inline baseline 底部留白；同时将 collapse 的高度样式写入真实的多行内容层，避免根层与内容层之间形成高度反馈循环。
- **TX-Test.59** 示例 4 改用 `tooltip="完整内容…"` 配置，避免子 Tooltip 与 Text 自动 Tooltip 重复注册共享浮层，恢复 mouseleave 自动关闭。
- **TX-Fix.56** Text 基础 opacity 链新增 ButtonGroup 局部内容透明度桥接，确保 disabled ButtonGroup 只由外壳统一应用一次 `opacity: 0.2`。
- **Text-Docs.2026-05-25** 源码顶部历史更新日志已归档；后续新增变更统一写入本文档 更新日志，源码顶部只保留职责、当前关键架构与文档路径。
- **TX-Adjust.55** `Button as="more"` 的展开操作改为组件内聚：示例层不再传 `Click.run` 修改宿主高度；只要按钮位于 `Text lines={0}` 内容中并声明 `as="more"`，即可通过 Text 内部 context 触发展开动画与按钮隐藏。
- **TX-Adjust.54** `Button as="more"` 触发展开时新增宿主高度动效：参考 Accordion 内容区的 size motion，从当前高度过渡到完整内容高度；动画期间保持收起态与 more 按钮可见，结束后再切换 expanded 并隐藏按钮，避免示例层直接设置 `height:auto` 抢掉动画起点。
- **TX-Adjust.53** `Button as="more"` 的定位改为自动布局 Pin：Button 仍声明在 Text 内容中，内部翻译为 `pin-bottom-right`，Text 挂载后将按钮提升到根层避开内容 mask，并在展开 / 未截断时隐藏。
- **TX-Adjust.52** `lines=0` 渐隐改为复用 `layout.css` 的 `.snowui-scroll-mask` 通用透明 mask 能力，不再通过 `::after` 绘制背景色渐变覆盖层。

### v3.3.35 (2026-03-16)

#### 调整
- **TX-Adjust.51** 按需求关闭 Text 自带 hover 默认态：`interactive` 默认值改为 `false`，仅在显式传入 `interactive={true}` 时挂载 `snowui-text-hover-enabled`。

### v3.3.34 (2026-03-06)

#### 调整
- **TX-Adjust.50** 修复 `lines=0/2/3` hover 无缓动：将 `--snowui-text-collapse-transition` 默认值扩展为 `max-height/min-height/height + margin/transform` 组合列表，避免截断链路内联 `transition` 覆盖 hover 过渡。

### v3.3.33 (2026-03-06)

#### 调整
- **TX-Adjust.48** 回退“截断态禁用 hover”策略：`Text` 恢复为只受 `interactive` 控制，所有截断/展开状态统一保留 hover 动效。
- **TX-Adjust.49** 移除 hover 选择器上的 `[data-truncated="true"]` 排除条件，确保 `lines=1` 与 `lines=0` 展开态拥有一致的进入/离开过渡。

### v3.3.32 (2026-03-06)

#### 调整
- **TX-Adjust.47** 强化单行截断态 hover 隔离：hover 选择器显式排除 `[data-truncated="true"]`，避免异步截断测量期间仍出现 hover 位移。

### v3.3.31 (2026-03-06)

#### 调整
- **TX-Adjust.45** 去掉真实截断态的 hover 位移动效：`Text` 仅在 `interactive !== false && !isTruncated` 时挂载 `snowui-text-hover-enabled`。
- **TX-Adjust.46** 将截断/展开过渡变量拆到 `snowui-text-collapse-motion-enabled`，避免为保留 collapse 动画而误恢复截断态 hover。

### v3.3.30 (2026-03-06)

#### 调整
- **TX-Adjust.42** 恢复 Text 组件自有 hover 过渡链：`hover-enabled` 状态重新声明显式的 `margin/transform` 过渡，避免 hover 视觉完全落回 Frame 默认动效。
- **TX-Adjust.43** 恢复截断链路的显式过渡变量：`--snowui-text-collapse-transition` 改为 `max-height/min-height/height` 的定向属性列表，不再使用 `transition: all`。
- **TX-Adjust.44** hover 规则统一排除 `.snowui-disabled` 与 `:disabled`，确保禁用态无额外 hover 位移。

### v3.3.29 (2026-02-25)

#### 调整
- **TX-Adjust.41** 按需求移除 `:not(code)` 补丁（`Text.svelte` 与 `layout.css`），恢复原始排版策略，后续将从样式层级架构而非选择器补丁角度处理 base 覆盖问题。

### v3.3.28 (2026-02-25)

#### 修复
- **TX-Fix.40** 修复 `Text tag="code"` 未被 `snowui.css` 的 `code` 规则覆盖：`Text` 组件默认排版改为仅作用于 `:not(code)`，并在 `layout.css` 中将 `Container` 基准排版排除 `code` 标签，避免覆盖 `@layer base` 的 `code` 样式。

### v3.3.27 (2026-02-25)

#### 修复
- **TX-Fix.39**（历史方案）组件层曾通过 `code.snowui-text` 强制回退 code 排版；该方案已在 `v3.3.28` 调整为“由 `snowui.css` 自然覆盖”的规范实现。

### v3.3.26 (2026-02-25)

#### 修复
- **TX-Fix.37** 修复 `lines=2/3/0` 场景 hover 过渡被截断内联样式覆盖：`text-collapse` 的 `transition` 改为变量驱动（`--snowui-text-collapse-transition`），由 Text 在 hover-enabled 状态统一注入 `all 1000ms ease-out`。

#### 样式优化
- **TX-Doc.38** 文档补全 Text 样式逻辑：同步记录 hover 状态样式、`Button as="more"` 定位联动、`lines=0` 渐隐遮罩、`lines=2/3` 截断兜底规则及选择器映射。

### v3.3.25 (2026-02-25)

#### 修复
- **TX-Fix.35** 修复 `interactive={false}` 仍触发 hover：恢复 `interactive` 为 hover 开关，默认开启、显式 `false` 禁用。
- **TX-Fix.36** 修复示例间 hover 过渡时长不一致：统一由 `.snowui-text-hover-enabled` 常态类声明 `transition: all 1000ms ease-out`。

### v3.3.24 (2026-02-25)

#### 修复
- **TX-Fix.34** 修复基础示例（单独文本居中）hover 效果不明显：在保留 `margin` hover 规则的前提下，引入 `--snowui-text-hover-shift-x` 位移变量，确保 hover 可感知。

### v3.3.23 (2026-02-25)

#### 调整
- **TX-Adjust.32** 交互策略简化：`interactive` 保留兼容但不再控制 Text hover 行为，默认所有 Text 在 hover 时应用过渡与边距变化。
- **TX-Adjust.33** 移除 Text 内部手形指针强制：普通 hover、截断态、tooltip 态均不再注入 `cursor:pointer`。

### v3.3.22 (2026-02-25)

#### 修复
- **TX-Fix.31** 修复 `lines=0` 宿主识别在示例 6 与示例 9-4 间互相回归：不再把 `computed height(px)` 直接视为显式高度约束，改为识别 `inline height/max-height`、`computed max-height` 与高度工具类（`h-* / max-h-* / min-h-* / size-*`），同时保留 overflow 约束判断。

### v3.3.21 (2026-02-25)

#### 修复
- **TX-Fix.30** 修复 `lines=0` 外层固定高度容器场景回归（示例 6）：约束宿主识别新增“自身必须真实发生裁剪”条件，避免把未裁剪的 Text 自身误判为宿主，恢复截断态与 `more` 按钮显示。

### v3.3.20 (2026-02-25)

#### 修复
- **TX-Fix.29** 修复 `lines=0` 在“无外层容器、仅 Text 自身 class 声明高度（如 `h-*`）”下仍不截断：`findConstraintHost` 改为优先识别 Text 自身计算样式高度约束，避免误选外层可滚动容器作为约束宿主。

### v3.3.19 (2026-02-25)

#### 修复
- **TX-Fix.27** 修复 `lines=2/3` 在“无外层容器，仅 Text 自身约束”下偶发未截断：多行模式改为稳定写入 `max-height + overflow:hidden`（原先 `min-height` 仅兜底，不足以保证可视裁剪）。
- **TX-Fix.28** 回退错误兜底覆盖：移除 `Text` 内对 `truncate-container/collapsed` 的 `width:auto/height:auto` 强制覆盖，避免反向覆盖用户 `w-*/h-*` 约束导致 `lines=0` 失效。

### v3.3.18 (2026-02-25)

#### 修复
- **TX-Fix.26** 清理全局截断样式对 Text 的反向覆盖：移除 `layout.css` 中 `truncate` 相关宽高强制规则，并在 `Text` 内增加兜底覆盖，确保“无外层容器，仅 Text 自身宽高约束”时 `lines=3/0` 可稳定截断。

### v3.3.17 (2026-02-25)

#### 修复
- **TX-Fix.25** 修复“无外层容器，仅在 Text 自身声明宽高约束”时 `lines=3/0` 截断失效：移除覆盖用户约束的 `width:100%` 与 `lines=0` 收起态全局 `height:100%` 强制规则，改为优先尊重 Text 自身约束尺寸。

### v3.3.16 (2026-02-25)

#### 修复
- **TX-Fix.24** `lines=0` 渐隐仅在真实截断且未展开时显示，避免未截断内容被误加遮罩导致“按钮可见性/文本可读性”异常。

### v3.3.15 (2026-02-25)

#### 修复
- **TX-Fix.23** 移除组件内置“+5 行行高”扩容规则：`TextTruncation.handleExpand` 回归通用展开；容器分步扩容改为由示例/业务侧通过 `Frame` 事件能力自定义实现。

### v3.3.14 (2026-02-25)

#### 修复
- **TX-Fix.22**（历史方案）组件层曾引入 `lines=0` + `Button as="more"` 分步扩容规则；该方案已在 `v3.3.15` 调整为示例层实现。

### v3.3.13 (2026-02-25)

#### 修复
- **TX-Fix.21** 强化 `Button as="more"` 的定位联动：在 `Text` 内为 `.snowui-text-expand-button` 显式设置右下角绝对定位，避免被 `Button` 基础定位样式覆盖后落入文本流而不可见。

### v3.3.12 (2026-02-25)

#### 修复
- **TX-Fix.19** 对齐新版本约定：`more` 不再作为显隐开关，`more` 按钮是否显示与显示内容完全由 `Text` 内容中的 `<Button as="more">` 决定。
- **TX-Fix.20** 强化 `Button as="more"` 与渐隐层的层级联动：在 `lines=0` 场景由 `Text` 提供按钮层级约束（`z-index`），确保按钮位于渐隐层之上。

### v3.3.11 (2026-02-25)

#### 修复
- **TX-Fix.18** 对齐 `Text2` 的 `lines=0` 收起态高度策略：在收起态强制 `snowui-truncate-container` 使用 `height:100%`，保证裁剪基准稳定，修复初始测量阶段出现“无渐隐/无 more 按钮”的问题。

### v3.3.10 (2026-02-25)

#### 修复
- **TX-Fix.17** 修复 `lines=0` 约束宿主识别回归：`findConstraintHost` 排除 `Text` 自身内部 `height:100%` 控制值，优先父级显式高度约束（`max-height` 或 `overflow + fixed height`），恢复截断态判定，从而恢复底部渐隐与 `more` 按钮显示。

### v3.3.9 (2026-02-25)

#### 修复
- **TX-Fix.14** 对齐 `Text2` 的 `more` 行为：移除“检测到自定义 `as="more"` 后隐藏默认按钮”的抑制逻辑，`lines=0` 收起且截断时稳定显示默认 `more` 按钮。
- **TX-Fix.15** 默认 `more` 图标由 `CaretDown` 调整为 `ArrowLineDown`，并同步 test 示例素材。
- **TX-Fix.16** `findConstraintHost` 增加“显式高度约束优先”策略（`max-height` 或 `overflow + fixed height`），减少 `lines=0` 场景约束宿主抖动导致的截断误判。

### v3.3.8 (2026-02-25)

#### 修复
- **TX-Fix.12** 修复 `lines=0` 在外层容器含 padding 时的截断误判：`checkCollapse` 改为用 `min(constraintHeight, measureClientHeight)` 计算可视高度，恢复 `isTruncated/isCollapsed`，确保 `more` 按钮可见。
- **TX-Fix.13** 默认 `more` 按钮图标改为 `ComponentIcon name="arrow-line-down"`，由 Components 内置回退与 IconProvider 统一解析，不再使用内联 SVG 或强制外部资源依赖。

### v3.3.7 (2026-02-25)

#### 修复
- **TX-Fix.11** 修复约束宿主误判导致的“无渐隐”：`lines=0` 改为基于真实发生裁剪的容器判断截断，避免把 `Text` 自身 auto 高度误识别为约束宿主。

### v3.3.6 (2026-02-25)

#### 修复
- **TX-Fix.10** 强化 `lines=0` 渐隐可见性：收起态稳定启用渐隐层，渐变实现改为 `linear-gradient(transparent -> 背景色)` 并增加覆盖层 `z-index`，避免 `color-mix/mask` 兼容差异导致“无渐隐”。

### v3.3.5 (2026-02-25)

#### 修复
- **TX-Fix.9** 修正 `lines=0` 渐隐通道：移除同层 `mask-image` 干扰，改为统一 `::after` 渐变覆盖层，确保渐隐效果稳定可见。

### v3.3.4 (2026-02-25)

#### 修复
- **TX-Fix.8** 为 `lines=0` 渐隐增加可见性兜底：在 `mask-image` 之外新增 `::after` 渐变覆盖层，确保最后一行渐隐在不同环境下稳定可见。

### v3.3.3 (2026-02-25)

#### 修复
- **TX-Fix.7** 补齐 `lines=0` 容器最后一行渐隐效果：参考 Text2 使用底部 mask 渐变提示未展开内容。

### v3.3.2 (2026-02-25)

#### 修复
- **TX-Fix.5** 修复 `lines=2/3` 在 block 模式下可能被 `display:block` 覆盖的问题，新增多行截断 CSS 兜底规则以确保稳定按 2/3 行截断。
- **TX-Fix.6** 增强多层容器高度探测：将本层容器实际高度纳入约束判断，确保高度不足时进入截断分支。

### v3.3.1 (2026-02-25)

#### 修复
- **TX-Fix.4** 修复 `lines=2/3` 且启用 tooltip 时的行截断失效问题（避免 `inline-flex` 覆盖 `line-clamp` 显示模式）。

### v3.3.0 (2026-02-25)

#### 修复
- **TX-Fix.1** 恢复 `lines=0` 截断遮罩与默认展开按钮链路。
- **TX-Fix.2** 恢复自动 tooltip 推导逻辑（`lines=1/2/3` 截断时默认显示全文）。
- **TX-Fix.3** 新增 `tooltip` / `more` 兼容入口，保留角色化组合能力。

### v3.2.0 (2026-02-23)

#### 架构重构
- **TX-Migration.1** 截断能力从 `Frame` 迁移到 `Text`：`Text` 直接支持 `lines` / `onTruncate`。
- **TX-Migration.2** `Text` 内部接入 `TextTruncation`，统一管理截断 action、状态上下文与类名/样式输出。
- **TX-Migration.3** 移除 `enableTruncation` 能力开关依赖，默认能力开关更新为 `enableResponsive` / `enableContext` / `enableScaleObserver`。

### v3.1.0 (2026-02-23)

#### 精简
- **TX-Refactor.1** 删除与 Frame 重复的上下文/状态逻辑（`getInteraction`/`getSkeleton`/`getSize`/`isLoading`/`isDisabled`）
- **TX-Refactor.2** `enableContext` 从 `false` 改为 `true`，由 Frame 自动处理上下文感知
- **TX-Refactor.3** 移除手动传递的 `loading`/`disabled`/`size`/`renderHints`，script 从 97 行精简至 65 行

### v3.0.2 (2026-02-03)

#### 修复
- **TX-Fix.1** 补齐 Frame 共享行为类与能力开关显式传参

### v3.0.0 (2026-01-21)

#### 架构重构
- **委托截断逻辑**: 移除了内部的 `lines` 处理逻辑、`ResponsiveController` 和 `ResizeObserver`。全部委托给 `Frame` 组件处理。
- **Context 优化**: 移除 `setContext`，改用 `context.ts` 的自动回退机制复用 `Frame` 的 `TruncationContext`。

#### 样式优化
- **CSS 内联**: 截断相关样式已内联至 `Frame.svelte`。

### v2.0.0 (Previous)
- 引入智能截断 (lines)
- 支持 Tooltip/Button 角色化组合
