# Text

> **版本**: v3.5.4
> **职责**: 统一展示文本，支持排版与截断，适合正文、标签和受限空间中的信息表达。
> **包归属**: `@snowui-design-system/components`

## 组件介绍

统一展示文本，支持排版与截断，适合正文、标签和受限空间中的信息表达。

## 使用选择

<!-- usage-guide:start -->
用于文本语义、截断、展开和提示。默认不启用 hover 动效；静态普通文字可使用语义 HTML，动态数值或文字过渡按动效组件选择。

- tag 指定文本语义，lines 控制截断，more / tooltip 提供展开与补充提示。
- 默认不启动 hover 交互；stateText 可按状态替换文字，parts 配置默认 Button / Tooltip。
- lines=1 缩短可见文字时仍保留完整可访问名称；用于按钮、链接或原生标签时不丢失名称尾部。
<!-- usage-guide:end -->

## 快速开始

以下示例展示推荐的基本组合。更多场景与组合限制见后文。

<!-- quick-start:generated -->
```svelte
<script lang="ts">
	import { Text, Button, Frame } from '@snowui-design-system/components';
</script>

<div style="width: min(100%, 24rem); min-width: 0;">
	<Text lines={1} tooltip style="font-size: var(--text-14); line-height: var(--leading-14); width: 100%;">Design system documentation — component behavior, accessibility, and release notes</Text>
</div>
```
<!-- /quick-start:generated -->

## API

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| tag | `string` | — | 根节点标签。 默认行为：span。 |
| stateText | `StateValueMap<string \| number>` | — | 根据最近父级 Frame 的 `currentState` 渲染文本；未命中当前状态时回退 `Idle`，再回退 children。 |
| interactive | `boolean` | `false` | 是否启用 Text hover 动效；显式传 `true` 时开启，默认关闭。 |
| lines | `0 \| 1 \| 2 \| 3` | — | 文本截断模式：`0`=可展开，`1/2/3`=固定行数。 |
| more | `boolean` | `false` | `lines=0` 时生成内置展开 Button；默认样式为示例 6 的 ArrowLineDown 按钮。 |
| tooltip | `TooltipProp` | — | Tooltip 配置。支持自动推导、固定文本、Snippet，或传对象仅覆写 Tooltip 位置/偏移等配置。 |
| onTruncate | `(isTruncated: boolean) => void` | — | 截断状态变化回调。 |
| children | `Snippet<[any]>` | — | 默认文字或自定义内容，接收含 breakpoint 的渲染上下文；stateText 命中时以对应状态文本替代。 |
| parts | `ComponentPartsOf<{ Button: typeof Button; Tooltip: typeof Tooltip; }>` | — | 仅配置内置 Button 与 Tooltip；显式 children 中的同名组件不继承。 |

未重新声明的继承能力请查所属基础组件文档；本表只列本组件源码具名公开属性。

## 使用边界与详细说明

<a id="内置组件双模式"></a>

### 内置组件双模式

- `parts.Button`：配置 `lines={0}` + `more` 生成的内置展开按钮；也可在 `children` 中显式放入 `<Button as="more">` 替换内置按钮。
- `parts.Tooltip`：配置截断时内置 Tooltip；也可显式放入 `<Tooltip as="tooltip">`。外置 children 不受 Text 私有选择器影响。
- 未声明 `lines` 时，截断控制器保持休眠，不读取文本、不登记 `MutationObserver` / `ResizeObserver`。

<a id="布局模型"></a>

### 布局模型与截断行为

主布局模型：**文本流布局**。

- `tag` 决定 `block`（`p`、`h1–h6`、`div`，自带 `overflow-wrap: break-word`）、`inline-block`（`span` 等）、`list-item`（`li`）或 `code` 显示模式；Text 不通过内部 padding/gap/margin 改变外部文本流间距。
- **单行截断（`lines={1}`）**：复用 `fitTextToElement()` 显示紧跟文字的省略符，并通过包内无障碍隐藏层保留完整纯文本名称。
- **多行截断（`lines={2 | 3}`）**：独立多行内容层承载 `line-clamp` 与 `text-box-trim: trim-end`，Tooltip 留在根层。
- **约束高度展开与滚动（`lines={0}`）**：传入 `more`（或显式 `<Button as="more">`）时启用收起渐隐遮罩与右下角展开按钮，点击平滑过渡至完整高度；未开启 `more` 时自动切换为上下边缘渐隐 + 浮层滚动条模式。

### `stateText` 解析规则

1. 读取最近父级 Frame Context 的 `currentState`，命中 `stateText[currentState]` 时渲染对应文本，未命中时依次回退 `stateText.Idle` 与 `children`。
2. `stateText` 仅用于同结构纯文本替换，复杂子树切换使用 Frame 的 `stateContent`。按钮处理中需显示真实文案时优先使用 `Pending` 状态名（`Load` 属于 loading/skeleton 协议）。

### 使用示例

```svelte
<!-- Plain text without truncation -->
<Text>普通文本，无截断。</Text>

<!-- Single-line truncation with automatic Tooltip -->
<Text lines={1}>Very long text that will be truncated...</Text>

<!-- Expandable mode with built-in more button -->
<Text lines={0} more style="max-height: 4.5rem;">
    很长的内容可以展开查看。
</Text>

<!-- Expandable mode with custom more button -->
<Text lines={0} style="max-height: 4.5rem;">
    很长的内容可以展开查看...
    <Button as="more" variant="borderless">展开全文</Button>
</Text>

<!-- Scrollable constrained height without more -->
<Text lines={0} style="height: 5rem;">
    很长的内容可以在约束高度内滚动查看。
</Text>

<!-- State-driven text via parent Button -->
<Button Click="Active" Active={["Idle", "auto"]} whileActive={{ duration: 2000 }}>
    <Icon stateIcon={{ Idle: Paperclip, Active: Check }} />
    <Text stateText={{ Idle: "复制", Active: "已复制" }} />
</Button>
```

## AI Zone

- **核心模块**：实现位于 [Text.svelte](Text.svelte)，截断与高度折叠复用 [frame-truncation.svelte.ts](../logic/frame-truncation.svelte.ts) 与 [text-collapse.svelte.ts](../logic/text-collapse.svelte.ts)，渐隐遮罩复用 [edge-fade.md](../lib/edge-fade.md)，继承 [Frame.svelte](Frame.svelte)（默认 `enableResponsive=false`、`enableContext=true`、`enableScaleObserver=false`）。
- **关键字映射**：`more` 控制 `lines={0}` 时是否生成内置 `ArrowLineDown` 展开按钮（复用 `ComponentIcon name="arrow-line-down"` 与 `backgroundBlur`），并通过 `TRUNCATION_CONTEXT_KEY` 与显式 `<Button as="more">` 共用展开状态与高度过渡；`interactive={true}` 显式开启 `.snowui-text-hover-enabled` 位移过渡。

## 更新日志

### v3.5.4 (2026-10-22)

- 显式 singleLine 宿主内，单行 Tooltip Hug 锚点保持垂直居中；普通文本流与列布局不变。
- 单行截断保留完整辅助技术文本，原生标签与按钮名称不随可见前缀缩短；视觉拟合、省略符和 Tooltip 继续由同一 Text 所有者提供。

### v3.5.3 (2026-10-12)

- 传入 children 使用独立内部名称，避免与 Frame 的同名 Snippet 自引用；修复运行包 SSR 分类标题等普通文本导致的递归错误，公开内容和 breakpoint 参数不变。
- 2026-09-21：统一使用文档、源码属性表与 Site / AI 阅读入口；仅文档修订，不改变组件行为。

### v3.5.2 (2026-08-15)

- `p / h1…h6` 语义宿主显式启用 `overflow-wrap: break-word`，未引入可选 `snowui-base.css` 时仍保持长词保护；`tag="code"` 继续允许消费应用级 code 初始化。

完整历史见 [更新日志归档](../../docs/history/changelogs/Text.history.md)。
