# Text 组件文档

## 内置组件双模式

- `parts.Button`：配置 `lines=0 + more` 生成的内置展开按钮。
- `parts.Tooltip`：配置截断时内置 Tooltip。
- 外置 Tooltip 或其他 children 不受 Text 私有 DOM 选择器控制。

> **版本**: v3.5.0
> **变更记录 (2026-05-18)**: 新增 `stateText`，支持读取父 Frame `currentState` 后声明式切换文本。
> **变更记录 (2026-04-28)**: 标注主布局模型为文本流布局；Text hover 位移改为 transform 变量，不再通过 margin 改变文本流外部间距。
> **变更记录 (2026-03-16)**: 按需求将 Text 自带 hover 态改为默认关闭，显式传入 `interactive={true}` 才开启。
> **职责**: 智能文本显示与截断组件。

**继承**: 复用 Frame.svelte 的所有通用能力 (交互、动效、响应式、形态等)。
**默认能力开关**: `enableResponsive=false`, `enableContext=true`, `enableScaleObserver=false`。
**核心机制**: 采用 **组件内聚模式 (Component-owned Truncation)**，`Text` 自身直接处理 `lines`/`onTruncate`，`Frame` 仅负责通用能力路由。

## 布局模型

主布局模型：文本流布局。

- Text 的主职责是保留 HTML 文本流、语义 tag、截断和 tooltip/more 角色定位，不参与槽位宿主、内联外壳或复合管理布局注册。
- `tag` 决定 `block / inline-block / list-item / code` 等文本流显示模式；`lines=0/1/2/3` 只改变截断和遮罩，不改变组件的主布局模型。
- `<Tooltip as="tooltip">` 与 `<Button as="more">` 是 Text 内的角色子项：Tooltip 负责截断提示，Button 仍按 Button 的内联外壳布局渲染。
- Text 不使用 padding/gap 管理内部排列，也不通过 margin 改变外部文本流间距；交互位移只能走 transform 变量。

## 1. 用户区域 (User Zone)

### 1.1 功能概览

- **智能截断**: `Text` 直接支持 `lines={0|1|2|3}` 和 `onTruncate`；单行模式复用 `fitTextToElement()`，稳定显示紧跟文字的显式省略符。
- **内置展开**: `lines=0` 时可通过 `more` 开启内置 ArrowLineDown Button，默认关闭；内置按钮默认开启与 BarChart 模糊浮层一致的背景模糊。
- **滚动模式**: `lines=0` 未显示 more 按钮时，内容使用 Textarea 同源的上下渐隐与浮层滚动条；显示 more 时改为展开模式且不渲染滚动条。
- **角色化组合**:
  - `<Tooltip as="tooltip">`: 截断时自动显示的提示。
  - `<Button as="more">`: "展开/收起" 按钮。
- **响应式**: `tag` / `class` 可通过 `responsive` 进行断点覆写。
- **动效**: 继承 Frame 的所有动效触发器 (`whileHover`, `whileClick` 等)。

### 1.2 关键字定义 (Keywords)

| Keyword | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **tag** | `string` | `span` | 根节点标签。 |
| **stateText** | `Partial<Record<CoreState, string \| number>>` | `undefined` | 根据最近父级 Frame 的 `currentState` 渲染文本；未命中当前状态时回退 `Idle`，再回退 children。 |
| **interactive** | `boolean` | `false` | 是否启用 Text hover 动效；显式传 `true` 时开启，默认关闭。 |
| **lines** | `0 \| 1 \| 2 \| 3` | `undefined` | 文本截断模式：`0`=可展开，`1/2/3`=固定行数。 |
| **more** | `boolean` | `false` | `lines=0` 时生成内置展开 Button；默认样式为示例 6 的 ArrowLineDown 按钮。 |
| **parts** | `{ Button?; Tooltip? }` | `undefined` | 配置内置 Button 与 Tooltip。 |
| **tooltip** | `boolean \| string \| Snippet \| Record<string, any>` | `undefined` | Tooltip 配置。支持自动推导、固定文本、Snippet，或传对象仅覆写 Tooltip 位置/偏移等配置。 |
| **onTruncate** | `(isTruncated: boolean) => void` | `undefined` | 截断状态变化回调。 |
| **variants** | `object` | `undefined` | 样式变体配置 (供 Layout 使用)。 |

### `stateText` 解析规则

1. `Text` 读取最近父级 Frame Context 的 `currentState`。
2. 当前状态命中 `stateText[currentState]` 时渲染该文本。
3. 未命中当前状态时回退 `stateText.Idle`。
4. 未传 `stateText` 或仍未解析出文本时继续渲染 children。
5. `stateText` 只用于同结构文本替换,不承载复杂 DOM。复杂自定义子树仍属于 `stateContent` 的例外场景。

> `Load` 是 Frame loading / skeleton 协议状态名。若只是按钮任务处理中并需要展示真实文案,优先使用 `Pending`。

### 1.3 使用示例

```svelte
<!-- 基础使用 -->
<Text>普通文本，无截断。</Text>

<!-- 单行截断：默认自动 Tooltip -->
<Text lines={1}>Very long text that will be truncated...</Text>

<!-- 单行截断 + 角色化 Tooltip -->
<Text lines={1}>
    Very long text that will be truncated...
    <Tooltip as="tooltip">完整的很长的文本内容...</Tooltip>
</Text>

<!-- 多行截断 (3行) -->
<Text lines={3}>长段落将被截断为3行...</Text>

<!-- 可展开模式 + 自定义按钮 -->
<Text lines={0} class="bg-black-5 p-4 rounded-8">
    很长的内容可以展开查看...
    <Button as="more" variant="borderless" class="text-blue">
        展开全文
    </Button>
</Text>

<!-- 可展开模式 + 内置按钮 -->
<Text lines={0} more>
    很长的内容可以展开查看。
</Text>

<!-- 无 more：固定高度内滚动，并显示上下渐隐与浮层滚动条 -->
<Text lines={0} style="height: 5rem;">
    很长的内容可以在约束高度内滚动查看。
</Text>

<!-- 响应式配置 -->
<Text
    lines={1}
    enableResponsive
    class="text-12"
    responsive={{
        sm: { class: "text-14" },
        lg: { class: "text-16" }
    }}
>
    响应式文本...
</Text>

<!-- 父 Frame / Button 状态驱动文本 -->
<Button Click="Active" Active={["Idle", "auto"]} whileActive={{ duration: 2000 }}>
    <Icon stateIcon={{ Idle: Paperclip, Active: Check }} />
    <Text stateText={{ Idle: "复制", Active: "已复制" }} />
</Button>

<!-- 状态流:Pending 展示处理中,Active 展示完成 -->
<Button
    Click={{ Idle: "Pending", Active: "Idle" }}
    Pending={["Active", "auto"]}
>
    <Icon stateIcon={{ Idle: null, Pending: Spinner, Active: Check }} />
    <Text stateText={{ Idle: "Ready", Pending: "Loading...", Active: "Completed" }} />
</Button>
```


### 样式规范 (Style Spec)

#### 1. 基础样式

| 属性 | 值 | 说明 |
|:---|:---|:---|
| **Class** | `.snowui-text` | 组件根类名 |
| **Box-Sizing** | `border-box` | 盒模型标准 |
| **Min Width** | `0` | 防止 flex 溢出 |
| **Max Width** | `100%` | 限制最大宽度 |

#### 2. 布局模式 (Layout Modes)

| 模式 | Class | Display | 适用标签 |
|:---|:---|:---|:---|
| **Block** | `.snowui-text-block` | `block` | `p`, `h1-h6`, `div` 等 |
| **Inline Block** | `.snowui-text-inline-block` | `inline-block` | `span`, `a`, `strong` 等 |
| **List Item** | `.snowui-text-li` | `list-item` | `li` |
| **Tooltip 锚点** | `.snowui-text-trigger-inline` | `inline-flex` | `lines=1 + tooltip` 触发区域 |
| **Tooltip Hug** | `.snowui-text-tooltip-anchor-hug` | `width: fit-content` | 截断 tooltip 锚点宽度收缩 |
| **Code 覆盖契约** | `code.snowui-text` | 组件层不写 `font-size/line-height` | 让 `snowui.css` 的 `code` 规则自然生效 |

#### 3. Hover 交互

默认关闭；仅在 `interactive === true` 时生效：

| Selector | 属性 | 值 |
|:---|:---|:---|
| `.snowui-text-hover-enabled` | Transition | `transform 1000ms ease-out` |
| `.snowui-text-hover-enabled:hover:not(.snowui-disabled):not(:disabled)` | Transform 位移 | 通过 `--snowui-text-hover-shift-x` 注入 |
| `.snowui-text-hover-enabled:hover:not(.snowui-disabled):not(:disabled)` | Hover 位移变量 | `--snowui-text-hover-shift-x: 0.285em` |
| `.snowui-text-hover-enabled:hover:not(.snowui-disabled):not(:disabled)` | Cursor | `default` (不强制 pointer) |

#### 4. 基础动效链路 (Parallax + State)

```css
transform: translate(
  calc(var(--snowui-parallax-x, 0px) + var(--snowui-text-hover-shift-x, 0px)),
  var(--snowui-parallax-y, 0px)
) scale(var(--snowui-parallax-scale, 1));
opacity: var(
  --snowui-button-group-content-opacity,
  var(--snowui-state-opacity, var(--snowui-parallax-opacity, 1))
);
```

说明：基础层只保留 `transform/opacity` 链路；真正的 hover 过渡由 `.snowui-text-hover-enabled` 以显式属性列表注入，避免 `transition: all` 抢占 Frame 默认动效。`--snowui-button-group-content-opacity` 仅由 disabled ButtonGroup 的嵌入态内容提供，用于避免外壳与内部 Text 重复衰减。

#### 5. 截断与可展开样式 (lines=0/2/3)

| Selector | 作用 |
|:---|:---|
| `.snowui-text-truncate-wrapper` | 包裹内容，保持 `width/height: 100%`，作为裁剪层承载体。 |
| `.snowui-text-collapse-motion-enabled` | 为 `lines=0/2/3` 的真实截断/展开链路注入 `--snowui-text-collapse-transition`，并合并 hover 的 `margin/transform` 过渡，避免内联 `transition` 覆盖 hover 缓动。 |
| `.snowui-truncate-container[data-lines="0"][data-expanded="false"] > .snowui-text-truncate-wrapper` | 收起态裁剪，`overflow: hidden`。 |
| `.snowui-text-truncate-wrapper.snowui-scroll-mask` | 收起态接入「内容渐隐层」OSS 通用能力的 CSS 静态形态（`.snowui-scroll-mask`，能力总览见 [`../lib/edge-fade.md`](../lib/edge-fade.md)），通过 `data-scroll-mask="bottom"` 驱动 `mask-image`。 |
| `.snowui-truncate-container .snowui-text-expand-button` | `Button as="more"` 的联动定位：Button 声明为 `pin-bottom-right`，边缘间距 4px；Text 将其提升到根层，避开内容 mask，并在展开 / 未截断时隐藏。 |
| `.snowui-text-multi-line-content.snowui-line-clamp-2/3` | 多行内容独立承载 `display: -webkit-box` + line-clamp；Tooltip 留在 Text 根层，不进入被裁切文本。 |
| `.snowui-text.snowui-line-clamp-2` | 固定两行：`line-clamp: 2`。 |
| `.snowui-text.snowui-line-clamp-3` | 固定三行：`line-clamp: 3`。 |


---

---

> **以下内容供 AI 阅读，用于维护代码与文档的关联**

## 开发者指南 (AI)

- **Implementation**: [Text.svelte](./Text.svelte)
- **Core Logic**:
    - [frame-truncation.svelte.ts](./../logic/frame-truncation.svelte.ts) (TextTruncation 核心截断逻辑)
    - [text-collapse.svelte.ts](./../logic/text-collapse.svelte.ts) (多行截断与可展开计算)
- **Frame Integration**: [Frame.svelte](./Frame.svelte)（承载通用能力：状态、响应式、动效、上下文）
- **Styles**:
    - [Text.svelte](./Text.svelte)（主样式：hover、渐隐、more 定位、多行截断兜底）
    - [layout.css](../styles/layout.css)（全局截断基础规则与按钮基础样式）

### 3.1 关键字映射 (Keyword Mapping)

| User Keyword | Internal Logic | Path |
| :--- | :--- | :--- |
| `lines` | 初始化 `TextTruncation`，挂载 collapse action 与类名/样式 | `TextTruncation` |
| `onTruncate` | 监听截断状态变化并回调 | `TextTruncation.onUpdate` |
| `tooltip` | 推导 Tooltip 内容与配置（支持自动截断态显示） | `Text.svelte` |
| `more` | 兼容保留，不再参与按钮显隐控制 | `Text.svelte` |
| `tag` | 本地推导后传入 `Frame.props.tag` | `resolvedTag` |
| `interactive` | 控制 hover 动效开关（仅 `true` 时启用） | `Text.svelte` |
| `responsive` | 透传给 `Frame.props.responsive` | `FrameResponsive` (via Frame) |

### 3.2 依赖关系 (Dependency Graph)

```mermaid
graph TD
    Text[Text.svelte] --> Frame[Frame.svelte]
    Text --> Truncation[TextTruncation]
    Frame --> Responsive[FrameResponsive]
    Text --> Context[TRUNCATION_CONTEXT_KEY]
    Context -.-> Tooltip[Tooltip (as=tooltip)]
    Context -.-> Button[Button (as=more)]
```

### 3.3 架构备注

1.  **截断内聚**: `Text` 组件在本地初始化 `TextTruncation`，负责 `lines` 解析、状态计算、action 挂载与类名/样式注入。
2.  **Context 协议**: `Text` 通过 `TRUNCATION_CONTEXT_KEY` 暴露 `isCollapsed/isExpanded/fullText/handleExpand`，供 `Tooltip(as="tooltip")` 与 `Button(as="more")` 消费；`Button as="more"` 无需外置 `Click.run` 即可触发展开。
3.  **双模式兼容**: 保留 `tooltip`/`more` 直接配置模式，同时兼容角色化组合模式。
4.  **通用能力复用**: `Text` 仍通过 `Frame` 继承响应式、状态机、动效和上下文能力。

### 3.4 样式逻辑映射 (Text.svelte)

| Selector | 触发条件 | 核心行为 |
|:---|:---|:---|
| `.snowui-text` | 组件根节点 | 基础排版、parallax + state opacity 链路。 |
| `.snowui-text-block / .snowui-text-inline-block / .snowui-text-li` | `tag` 推导 | 映射不同语义标签的 display 行为。 |
| `.snowui-text-trigger-inline + .snowui-text-tooltip-anchor-hug` | `lines=1 && needTooltip` | 截断 tooltip 触发区域改为 inline-flex 且宽度 hug。 |
| `.snowui-text-collapse-motion-enabled` | `lines=0/2/3` | 注入显式的 collapse transition 变量，并合并 hover transition，供截断/展开链路与 hover 共用。 |
| `.snowui-text-hover-enabled` | `interactive === true` | 注入显式的 hover transition；与截断/展开状态无关。 |
| `.snowui-text-hover-enabled:hover:not(.snowui-disabled):not(:disabled)` | hover | 注入 hover 位移变量 + 边距动画，并排除禁用态。 |
| `.snowui-text-truncate-wrapper` | `lines=0` | 收起/展开内容包裹容器。 |
| `.snowui-truncate-container[data-lines="0"][data-expanded="false"] > .snowui-text-truncate-wrapper` | `lines=0` 且存在 more | 强制裁剪 overflow，等待展开。 |
| `.snowui-text-truncate-wrapper.snowui-scroll-mask` | `lines=0` | 有 more 时显示底部截断渐隐；无 more 时按滚动位置显示 top / bottom / both。 |
| `.snowui-text-scrollbar.snowui-overlay-scrollbar` | `lines=0` 且无 more | 复用 Textarea 同源 overlay scrollbar；有 more 时不渲染。 |
| `.snowui-truncate-container .snowui-text-expand-button` | 内容中声明 `<Button as="more">` | more 按钮通过 Pin 布局固定到右下角，边缘间距 4px，展开 / 未截断时隐藏。 |
| 展开宿主高度动画 | `Button as="more"` 触发 Text 展开时 | 参考 Accordion 内容区展开动效，按 `--snowui-frame-size-motion-duration/easing` 将约束宿主从当前高度过渡到完整内容高度；动画期间保持收起态与 more 按钮可见，结束后再切换 expanded 并隐藏按钮。 |
| `.snowui-text-multi-line-content.snowui-line-clamp-2/3` | `lines=2/3` | 多行截断内容层与 Tooltip 分离，并设置具体 line-clamp 值。 |

---

## 更新日志 (Changelog)

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
- **Text-Docs.2026-05-25** 源码顶部历史变更记录已归档；后续新增变更统一写入本文档 Changelog，源码顶部只保留职责、当前关键架构与文档路径。
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
- **TX-Fix.13** 默认 `more` 按钮图标替换为 `@snowui-design-system/resource-svelte` 的 `CaretDown`，移除内联 SVG。

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
- **TX-Fix.1** 补齐 Frame CSS 行为 与能力开关显式传参

### v3.0.0 (2026-01-21)

#### 架构重构
- **委托截断逻辑**: 移除了内部的 `lines` 处理逻辑、`ResponsiveController` 和 `ResizeObserver`。全部委托给 `Frame` 组件处理。
- **Context 优化**: 移除 `setContext`，改用 `context.ts` 的自动回退机制复用 `Frame` 的 `TruncationContext`。

#### 样式优化
- **CSS 内联**: 截断相关样式已内联至 `Frame.svelte`。

### v2.0.0 (Previous)
- 引入智能截断 (lines)
- 支持 Tooltip/Button 角色化组合
