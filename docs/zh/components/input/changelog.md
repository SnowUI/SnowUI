# Input 更新日志

### v1.2.0 (2026-10-23)

- 2026-10-23：复杂附件中的图形／短标签示例复用 Frame 单行与 Text 全文缩略；仅文档修订，宿主、清除和选择协议保持。
- 内部单行图文间距统一解析，包含嵌入 Field 的实际网格宿主；显式零与缩放保持 4 CSS px 下限，保留日期分段和绘制结构的内部间距。
- 由 Input 提供实际内容状态，供 SearchInput 折叠使用；清除按钮的可用状态仍独立遵守 disabled、readonly 和 clearable。

### v1.1.5 (2026-09-27)

- 2026-10-05：日期分段聚焦与选中背景、全局文字与输入选区统一使用 Brand 40%，保留原有前景色与交互。
- 只读与禁用输入不再进入清除接管状态，避免聚焦只读输入时误隐藏自定义 trailing 复制按钮。
- 2026-09-21：统一使用文档、源码属性表与 Site / AI 阅读入口；仅文档修订，不改变组件行为。

### v1.1.4 (2026-09-12)

- 修复带附件的 Input 在固定高度下内容偏上：单行 Grid 使用 `align-content: center`，SearchInput 同步继承；默认自适应高度不变。

### v1.1.3 (2026-08-12)

- 更正独立 Input 标准态 padding 记录为源码实际值 `12px / 16px`；组件行为未改变。

### v1.1.2 (2026-08-10)

- 补齐从 Frame 继承的 `bind:element` 根宿主引用，使 SearchInput 等宿主特化组件无需 wrapper 或私有 DOM 查询即可复用根尺寸能力。
- 普通 Input 的 clear + leading 稳定宽度规则在 SearchInput 空值图标态时退出，避免隐藏 clear 的历史 gap 继续占据 Icon 右侧；聚焦或已有值后仍恢复原布局。

### v1.1.1 (2026-07-05)

#### 修复
- 修复有值 Input 位于 shrink-to-fit 宿主中时，聚焦显示清除 X 会改变组件宽度的问题。
- 内置清除 X 与 control 共用同一网格列，X 显隐不再新增轨道；保留原有文字渐隐和清除按钮叠层。

### v1.1.0 (2026-07-05)

#### 新功能
- 新增默认关闭的 `error` 内置模式；仅在 invalid 时显示 `<Text as="error">`，使用 12px/16px 红色样式及 8px 间距。
- 新增 `parts.Text`，显式 `<Text as="error">` 模式保持不变。

### v1.0.44 (2026-05-09)

- 字号 / 行高改为内层控件 `inherit` 外层 `.snowui-input` 的设置；外层 `class="text-18"` 等工具类可直接生效，placeholder 与输入文字同步放大。`--snowui-input-font-size-override` / `--snowui-input-line-height-override` 仍保留，仍由外层消费。

- **v1.0.36**: `type="color"` 默认改为 Figma 对应的“色点 + # + HEX”展示层，颜色值随原生 color picker 同步更新。
- **v1.0.35**: `readonly` 统一升级为“不能编辑”视觉态，独立模式与 `Field` 容器模式都改为 `Background/2` 背景且无边框。


### v1.0.43 (2026-05-09)

#### 调整
- **INP-Overlay.1** 将 Listbox / QuickAction 内搜索输入样式扩展为浮层搜索输入共享规则，覆盖 SearchPopup 内的 SearchInput，并统一移除外扩 focus ring。

### v1.0.42 (2026-04-25)

#### 修复
- **INP-Fix.8** 修复独立 `Input` 有值但未 hover 时右侧输入区域多出 `8px` 的问题：只有内建清除按钮时，隐藏态不再保留 grid gap，hover 显示 X 时再恢复按钮列间距。

### v1.0.40 (2026-04-02)

#### 调整
- **INP-Doc.1** 文档补充 `Input` 进入 `Field` 后的宿主规则：外层 `Field` 统一控制 padding、边框、背景、圆角和 `label` 间距，`Input` 自身退回输入宿主。
- **INP-Doc.2** 文档更新 `leading / trailing` 推荐写法：简单配件型结构直接使用 `Field > leading + Input + trailing`，并明确这类结构不属于带分割线的分段输入。

### v1.0.36 (2026-03-25)

#### 样式
- **INP-Style.5** `type="color"` 默认展示层升级为 Figma 对应的“色点 + # + HEX”结构，颜色点与 HEX 文本统一复用 Input 默认 14 / 20 排版、8 gap 与 12/16 padding。

#### 交互
- **INP-Interaction.1** 保留隐藏原生 `<input type="color">` 作为真实宿主，继续承接表单归属、focus、键盘交互与 `bind:value` 同步；可见展示层仅负责视觉呈现。

### v1.0.35 (2026-03-19)

#### 样式
- **INP-Style.4** `readonly` 统一改为“不能编辑”视觉态：独立模式与 `Field` 容器模式都使用 `Background/2` 背景，并移除默认边框。

### v1.0.34 (2026-03-19)

#### 修复
- **INP-Fix.7** 加强 `type="number"` 的浏览器兜底隐藏规则：原生上下箭头统一追加 `opacity: 0` 与 `pointer-events: none`，并将宿主 input 外观显式收敛为 `textfield`，避免 Playground 中原生步进器再次露出。

### v1.0.33 (2026-03-19)

#### 重构
- **INP-Refactor.7** 按组件规范对齐 `enableResponsive=true` 默认值，并将 `Frame` 的三个能力开关改为显式传参，保持代码与标准检查一致。

#### 样式
- **INP-Style.3** 收敛 stepper 相关选择器到 `:global(:where())`，移除强制优先级写法，补齐主题 token fallback，并把自身几何样式回收到 `--snowui-input-*` 命名空间。

### v1.0.31 (2026-03-16)

#### 重构
- **INP-Refactor.6** 历史上曾为统一普通文字、输入文字和日期分段的选中视觉，引入过 `text` / `date` 的自定义可见编辑层；当前仅 `date` 仍保留自定义 `年/月/日` 分段编辑层，`text` 已回收到原生 `<input>`。

### v1.0.30 (2026-03-16)

#### 调整
- **INP-Adjust.8** 修正 Chrome 日期分段高亮方案：移除无效的 `::-webkit-datetime-edit-*::selection` / 普通 input `::selection` 方案，改为对 `year/month/day-field:focus` 应用统一的 `Black/4% + Black/100% + 8px` 高亮变量。

### v1.0.29 (2026-03-16)

#### 调整
- **INP-Adjust.7** 统一字段文本选中态：`layout.css` 为 field-bordered 工具类 新增 `Black/4%` 背景、`Black/100%` 文字、`8px` 圆角的通用选中变量；`Input.svelte` 额外为日期 `year/month/day` 私有伪元素补齐同款 `::selection` 样式。

### v1.0.28 (2026-03-16)

#### 修复
- **INP-Fix.6** 为 `:placeholder-shown` 的普通输入本体追加 `Black/20%` 文本色，沿用日期空态的成功修复方式，避免浏览器未命中 `::placeholder` 时 placeholder 仍显示为正文色。

### v1.0.27 (2026-03-16)

#### 修复
- **IN-Date.8** 沿用 placeholder 的成功修复方式，把空值 `date input` 本体文字颜色也统一压到 `Black/20%`，避免仅依赖浏览器内部字段伪元素时颜色仍不稳定。

### v1.0.26 (2026-03-16)

#### 修复
- **IN-Date.7** `type="date"` 在空值时，浏览器内部的日期占位文本也统一压到 `Black/20%`，与普通 placeholder 保持一致。

### v1.0.25 (2026-03-16)

#### 修复
- **IN-Date.6** `type="date"` 在没有自定义 trailing 按钮时恢复浏览器原生 appearance，重新显示默认日期 icon；只有检测到 `Button as="trailing"` 时才切换到自定义隐藏链路。

### v1.0.24 (2026-03-16)

#### 修复
- **IN-Date.5** 恢复 `::-webkit-calendar-picker-indicator` 隐藏分支，并与宿主右侧遮罩共同组成日期 icon 修复链路；删除其中任一分支都会导致部分浏览器再次显示默认日期 icon。

### v1.0.23 (2026-03-16)

#### 清理
- **IN-Date.5撤回** 上一版把 `::-webkit-calendar-picker-indicator` 分支误判为无效代码，实际回归验证表明该分支仍参与生效，因此已在 `v1.0.24` 恢复。

### v1.0.22 (2026-03-16)

#### 修复
- **IN-Date.4** 日期输入隐藏原生日历 icon 的规则改为“双保险”：优先走 `::-webkit-calendar-picker-indicator` 隐藏，浏览器不接受该隐藏时再由宿主右侧遮罩覆盖默认 icon 区域。

### v1.0.21 (2026-03-16)

#### 修复
- **IN-Date.3** 日期 trigger 命中改为由 Input 运行时检测同一局部容器内的 direct trailing Button，并回写自身 `data-has-date-trigger`，避免复杂结构选择器漏判。

### v1.0.20 (2026-03-16)

#### 调整
- **IN-Date.2** 移除 `control="date-picker"` 依赖；日期输入的自定义触发器重新收敛为局部容器内的 `Button as="trailing"` 自动识别。

### v1.0.19 (2026-03-15)

#### 新功能
- **IN-Date.1** 新增自定义日期触发器桥接：当 `Field / row / 局部容器` 内的 Button 被绑定为日期选择触发器时，`Input type="date"` 会隐藏原生日期 icon，把交互入口交给外部组合按钮。

### v1.0.18 (2026-03-15)

#### 重构
- **INP-Refactor.1** 默认输入边框回归 `layout.css` 的 `.snowui-field-bordered`：基础态为 `Black/20%`，focus 为 `Black/40% + Black/4% ring`，组件内仅保留 `invalid / disabled / readonly` 等输入特有分支。
- **INP-Fix.1** placeholder 伪元素选择器拆分为标准 / WebKit / Mozilla / MS 独立规则，稳定输出 `Black/20%`。
- **INP-Refactor.2** 组件职责调整为字段宿主优先，推荐与 `Field.svelte` 容器组合使用；在容器上下文中只渲染无外壳的输入宿主。

### v1.0.17 (2026-03-14)

#### 重构
- **INP-Refactor.5** Input 默认 focus 变量桥接回归 `field-bordered 工具类` 的通用值，聚焦态改为 `Black/40%` 内边框 + `Black/4%` 的 `4px` 外层 ring。

### v1.0.16 (2026-03-14)

#### 修复
- **INP-Fix.5** placeholder 最终修复为拆分标准与浏览器私有伪元素选择器，分别设置 `color / -webkit-text-fill-color / opacity`，统一输出 `Black/20%`。

### v1.0.9 (2026-03-14)

#### 清理
- **INP-Cleanup.1** 移除为指针问题引入的 placeholder 覆盖层、焦点显隐状态与专项 cursor 兜底，回归原生 `<input>` + `field-bordered 工具类` 的最小实现。

### v1.0.3 (2026-03-14)

#### 重构
- **INP-Refactor.2** 抽离字段宿主桥接逻辑到 `../logic/frame-field-control.ts`，统一处理 `value/defaultValue`、`invalid/aria-invalid` 和 `input[type="file"]` 的值同步豁免。
- **INP-Refactor.3** 删除组件内重复的默认 hover/focus 规则，改为直接依赖 `.snowui-field-bordered` 的通用行为；移除冗余 `data-disabled` 标记链路。

### v1.0.4 (2026-03-14)

#### 重构
- **INP-Refactor.4** Input 默认边框、hover、focus 和文字光标改为通过 `.snowui-field-bordered` 变量桥接到 `layout.css`，统一控制输入型组件的基础交互表现。

### v1.0.2 (2026-03-14)

#### 重构
- **INP-Refactor.1** 移除组件内联的 `Frame prop` 白名单，改用 `../logic/frame-prop-filter.ts` 提供的共享 props 分发器，避免与 `Frame` 自身 DOM 过滤逻辑重复维护。

### v1.0.1 (2026-03-14)

#### 样式
- **INP-Style.1** 按 Figma 翻译更新 Input 默认样式：`14` 字号、`12/16` padding、`8` gap、`16` 圆角、`Black/20%` 的 `0.5px` 内边框、`Background/3` 背景。
- **INP-Style.2** 默认最小高度调整为 `44px` 推导值，并同步骨架高度与 focus 视觉链路。

### v1.0.0 (2026-03-13)

#### 新功能
- **INP-Feat.1** 新增基于 `Frame` 的单行输入组件，支持原生 `<input>` 属性透传、`bind:value`、Skeleton 与响应式能力。
- **INP-Feat.2** 新增 invalid / readonly / file / datalist 等基础样式链路，并约束 `Input` 仅负责原子输入控件本体。
