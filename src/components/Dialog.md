# Dialog

> **许可阅读**：首次阅读组件文档、源码或 npm 使用流程，先读完整 [LICENSE](../../LICENSE)；同任务同版本去重。公开 API 配置与内部实现修改分别按许可处理；全部组件使用统一运行包，源码权益以许可为准。

> **版本**: v1.1.0
> **职责**: 在模态对话框中呈现需要关注的内容或操作，提供遮罩、焦点管理与背景滚动锁定，适合确认和表单任务。
> **包归属**: `@snowui-design-system/components`
> **文档修订**: 2026-09-21

## 组件介绍

在模态对话框中呈现需要关注的内容或操作，提供遮罩、焦点管理与背景滚动锁定，适合确认和表单任务。

## 使用选择

<!-- usage-guide:start -->
用于需要独立焦点和关闭流程的对话框。锚定某个按钮的小浮层用 Popover，短提示用 Tooltip；标题与按钮使用公开组合角色。

- 用 `bind:open` 控制面板；默认支持外部点击和 Escape 关闭。
- 通过公开 title / content / footer / close 角色组合内容；显式子项自行配置，parts 只影响默认标题、分隔线与关闭按钮。
<!-- usage-guide:end -->

## 快速开始

以下示例展示推荐的基本组合。更多场景与组合限制见后文。

<!-- quick-start:generated -->
```svelte
<script lang="ts">
	import { Dialog, Button, Frame, Text } from '@snowui-design-system/components';
	let publishOpen = $state(false);
	function setPublishOpen(next: boolean) { publishOpen = next; }
</script>

<Button variant="filled" onclick={() => publishOpen = true}>Publish documentation</Button>
<Dialog
	open={publishOpen}
	onOpenChange={setPublishOpen}
	size="md"
>
	<Text as="title" tag="h2">Publish 82 component pages?</Text>
	<Frame as="content">This updates the public documentation index and makes every generated example available to visitors.</Frame>
	<Frame as="footer">
		<Button as="item" variant="outline" data-dialog-close>Cancel</Button>
		<Button as="item" variant="filled" onclick={() => publishOpen = false}>Publish</Button>
	</Frame>
</Dialog>
```
<!-- /quick-start:generated -->

## API

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| id | `string` | — | 模版模式唯一标识 |
| template | `boolean` | `false` | 只注册模版,不直接显示 |
| as | `"dialog" \| undefined` | — | 内嵌模式标记 |
| open | `boolean` | `false` | 面板模式显隐,支持 `bind:open` |
| onOpenChange | `(open: boolean) => void` | — | 面板模式状态变化回调 |
| backdrop | `DialogBackdrop` | `"opaque"` | 遮罩层变体；与 ImageViewer 复用共享 backdrop 视觉，关闭与动效仍由 Dialog 管理。 |
| size | `DialogSize` | `"md"` | 面板尺寸 |
| closeOnOutside | `boolean` | `true` | 默认点击面板外的遮罩关闭；false 禁止。面板内部空白处不关闭。未保存表单或必须明确选择的场景建议显式设为 false |
| closeOnEscape | `boolean` | `true` | Escape 是否关闭 |
| pinOffset | `number` | — | 内置与外置 Pin 共用的统一偏移，单位 px；未传时使用随根字号缩放的 Token 默认行为：sm/md 16px、lg 20px。 |
| pinOffsetX | `number` | — | 覆盖内置与外置 Pin 的水平偏移，优先于 pinOffset |
| pinOffsetY | `number` | — | 覆盖内置与外置 Pin 的垂直偏移，优先于 pinOffset |
| role | `"dialog" \| string` | `"dialog"` | 面板可访问角色 |
| title | `string` | — | 生成内置文字标题；外置 as="title" 存在时忽略此值 |
| separator | `boolean` | — | 控制标题下方分割线；无标题时不生成 默认行为：sm 为 false；md/lg 为 true。 |
| showCloseButton | `boolean` | `true` | 是否显示内置右上角关闭按钮；不隐藏外置关闭角色 |
| closeLabel | `string` | `locale 的关闭文案` | 内置关闭按钮的可访问名称 |
| parts | `ComponentPartsOf<{ Button: typeof Button; Text: typeof Text; Separator: typeof Separator }>` | — | 只配置实际内置关闭 Button、标题 Text 与 Separator；不影响 children/footer 中显式组件；标题 id、children 与 ARIA 由 Dialog 拥有 |
| children | `Snippet` | — | 对话框内容 |

未重新声明的继承能力请查所属基础组件文档；本表只列本组件源码具名公开属性。

## 使用边界与详细说明

<a id="三种模式-modes"></a>

### 三种模式 (Modes)

| 模式 | 写法 | 说明 |
| :--- | :--- | :--- |
| 面板模式 | `<Dialog bind:open={state}>...</Dialog>` | 本地状态控制打开关闭 |
| 内嵌模式 | `<Button>打开<Dialog as="dialog">...</Dialog></Button>` | 自动绑定父元素点击触发 |
| 模版模式 | `<Dialog template id="x">...</Dialog>` + `showDialog("x")` / `data-dialog-target="x"` | 跨组件触发或多触发器共享 |

<a id="布局模型"></a>

### 布局模型

主布局模型:复合管理布局。

结构:

```
Backdrop(Portal 到 body)
└── Container(视口居中)
    └── Panel Frame(.snowui-dialog .snowui-quick-action-panel)
        ├── pin-* 槽位(可选)
        ├── title Text + 可选 Separator
        ├── children 正文
        ├── footer 操作区
        └── 内置关闭按钮
```

- padding 归属:Panel 负责整体 padding。
- gap 归属:Panel 内置 sm/md/lg 的 12/16/20px 间距；正文内为 8px，footer 内为 8/12/12px。
- 标题通过 `title` 生成，正文由 `children` 承载；直系 `as="footer"` 提供操作区，`Button as="item"` 读取操作区尺寸默认值，显式 size 优先。
- Pin 归属:Panel 透传 `pinOffset` / `pinOffsetX` / `pinOffsetY`,默认 sm/md 为 16px、lg 为 20px。
- 滚动归属:Panel 自身限制 `max-height`,内容溢出时面板内部滚动。

<a id="关键字-props"></a>

### 关键字 (Props)

调用方的关闭操作使用 `data-dialog-close` 声明:

```svelte
<Button data-dialog-close>取消</Button>
```

<a id="尺寸"></a>

### 尺寸

| size | max-width | padding | border-radius | gap | 标题字号/行高 | 关闭按钮 / 图标 / 上右偏移 | 操作区 gap / Button size |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `sm` | `320px` | 16px | 20px | 12px | 16/24px，600 | 24 / 16 / 16px | 8px / sm |
| `md` | `448px` | 20px | 24px | 16px | 18/28px，600 | 36 / 20 / 16px | 12px / md |
| `lg` | `640px` | 24px | 28px | 20px | 18/28px，600 | 36 / 20 / 20px | 12px / md |

几何与排版使用 rem Token，以上是根字号 16px 的名义值。标题 font-weight 为 600；正文统一 14/20px，标题与正文左右各增加 4px 文本 inset；关闭按钮距离面板上、右边缘为 sm/md 16px、lg 20px。标题为关闭按钮预留空间，长标题可换行。

关闭按钮使用真实 `Button variant="borderless" iconOnly` 与 ComponentIcon：颜色沿用 Button 默认颜色，常态整体 opacity 为 0.4，hover / focus-visible 恢复 1；保留 Button 默认 hover 背景、放大与点击反馈。此为当前任务明确要求的 Dialog 局部特化，不改变其他组件的内置图标宿主规则。`parts.Button` 仅配置内置关闭按钮，点击关闭和可访问名称由 Dialog 拥有。自定义图标随外置 as="close" Button 提供；内置图标使用 IconProvider，缺失时回退包内 close。

```svelte
<script lang="ts">
  import { Dialog, Text, Frame, Button } from '@snowui-design-system/components';
  let open = $state(true);
</script>

<Dialog bind:open>
    <Text as="title" tag="h2">退出编辑</Text>
    <Frame as="content">尚未保存的更改将丢失。</Frame>
    <Frame as="footer">
        <Button as="item" variant="outline" data-dialog-close>取消</Button>
        <Button as="item" variant="filled">保存</Button>
    </Frame>
</Dialog>
```

按钮命令、文案、variant 与业务回调由调用方拥有；Dialog 只通过操作区公开 Context 提供 `as="item"` 的尺寸默认值。未入约 Button 保持自身默认，显式 size 优先。自定义标题/关闭按钮可放在 children 中；直系 close 角色自动替换内置关闭按钮。未提供 title 且关闭内置关闭按钮时，children 直接进入 Panel，保留直系 Pin 组合；未提供标题但显示内置关闭按钮时，正文顶部预留关闭按钮空间。

<a id="完整角色组合"></a>

### 完整角色组合

Dialog 的外置替换统一使用 `as`；不提供 title / closeIcon / footer 具名 Snippet 替换入口。普通 `title` 字符串仍可生成默认标题，普通 children 仍可承载正文。

| 角色 | 默认及替换行为 |
| --- | --- |
| `title` | 替换内置标题，忽略 title 字符串与 parts.Text；移除后恢复字符串标题。默认标题排版和关闭按钮避让由 Dialog 提供，标签如 tag="h2" 由调用方提供。 |
| `separator` | 替换默认分割线，忽略 separator 开关与 parts.Separator；移除后按尺寸和 separator 生成默认分割线。外置 Separator 的 thickness 等直接 Props 由调用方控制。 |
| `content` | 显式正文容器，提供正文排版与内部 gap；内容和直接样式由调用方拥有。 |
| `footer` | 显式操作区，提供布局及直系 item 的尺寸 Context。 |
| `close` | 替换关闭按钮，接管同一关闭行为与定位。 |

五个角色均为单例，仅识别 children 渲染宿主的直系元素；多个同名角色开发环境报错，仅首个显示。外置实例不消费 parts。原生节点使用 data-as。标题、分割线、正文、操作区依次排列，调用方也应按此顺序书写以保持阅读与键盘顺序一致。

外置标题存在时，Dialog 的 aria-labelledby 使用其 id；缺少 id 时自动补齐，角色移除时清理自动生成的 id，保留调用方自带 id。显式 aria-label / aria-labelledby 按调用方配置优先。没有标题时不生成默认分割线。

```svelte
<script lang="ts">
  import { Dialog, Text, Separator, Frame, Button } from '@snowui-design-system/components';
  let open = $state(true);
</script>

<Dialog bind:open>
    <Text as="title" tag="h2">退出编辑 <Text>补充信息</Text></Text>
    <Separator as="separator" />
    <Frame as="content">尚未保存的更改将丢失。</Frame>
    <Frame as="footer">
        <Button as="item" variant="outline" data-dialog-close>取消</Button>
        <Button as="item" variant="filled">保存</Button>
    </Frame>
    <Button as="close" variant="borderless" iconOnly size="md" aria-label="关闭">
        关闭
    </Button>
</Dialog>
```

<a id="底部操作区角色"></a>

### 底部操作区角色

推荐通过 children 中直系 `<Frame as="footer">` 声明操作区，原生元素使用 `data-as="footer"`。Dialog 提供右对齐、垂直居中、自动换行与 sm/md/lg 的 8/12/12px gap；调用方的直接 Props / inline style 可覆盖默认布局，不消费 parts。显式操作区与正文块沿用面板的 12/16/20px 间距；需要正文内部 8px 间距时，将多个正文块放入自己的容器。

仅该操作区的直系 `Button as="item"` 接收 sm/md/md 尺寸 Context，显式 size 优先；按钮内容、variant、业务事件和嵌套布局仍由调用方拥有。未入约的正文、嵌套 Frame 中的 item 不接收此默认值。

footer 为单例，识别范围与 close 相同，不扫描嵌套容器。多个直系 footer 在开发环境报错，仅首个显示。移除 footer 后不生成空操作区。按钮行为始终由真实按钮产生，角色本身不注入确认或取消事件。

<a id="外置关闭按钮替换"></a>

### 外置关闭按钮替换

`children` 中直系 `as="close"`（原生元素为 `data-as="close"`）声明关闭角色，自动替换内置关闭按钮，无需 `showCloseButton={false}` 或 `data-dialog-close`。该角色与内置按钮使用同一 Panel 定位锚点及 pinOffset/X/Y。内部正文包装只承载正文排版，角色识别只检查 children 渲染宿主的直系元素，不扫描嵌套 Frame、footer 或 title 中的角色。

```svelte
<Dialog title="自定义内容">
    <Button as="close" variant="borderless" iconOnly size="md" aria-label="关闭">
        <Close size={20} />
    </Button>
    正文内容
</Dialog>
```

外置按钮的 variant、size、颜色、opacity、Icon 和可访问名称由调用方直接配置，不继承 parts.Button；Dialog 只拥有角色定位、替换和关闭行为。外置按钮点击或键盘激活走同一关闭链路，事件 preventDefault() 可阻止角色关闭。disabled / aria-disabled="true" 不关闭。外置角色优先于 showCloseButton；移除外置角色后，按 showCloseButton 恢复内置按钮。嵌套同名角色不参与替换。

此角色为单例：多个直系外置角色在开发环境报错，生产只显示并使用第一个。图标也通过此角色中的子内容提供。

<a id="backdrop"></a>

### Backdrop

| 变体 | 视觉 |
| :--- | :--- |
| `opaque` | 10% 黑色遮罩 |
| `blur` | 10% 黑色遮罩 + 20px 背景模糊 |
| `transparent` | 透明遮罩,仅阻止背景交互 |

opaque 与 blur 挂载时从 opacity 0 渐入到设定的遮罩效果；关闭时渐出，关闭途中重新打开从当前透明度接续。时长与曲线使用 Dialog backdrop preset；减少动效偏好下直接显示或隐藏，不播放透明度过渡。

<a id="无障碍"></a>

### 无障碍

- `role="dialog"`
- `aria-modal="true"`
- 打开时焦点进入 Dialog 内第一个可聚焦元素。
- Tab / Shift+Tab 在 Dialog 内循环。
- 关闭时焦点回到触发元素。内联模式会穿过 Button 的内容包装层定位实际交互宿主，关闭后将焦点恢复到该按钮或链接。


---




## AI Zone

> **内置关闭图标（2026-09-11）**：由Button的size上下文控制，parts.Button.size可覆盖默认档位，图形比例遵循ComponentGuidelines §2.7。

> **2026-09-10 浮层内边框**：面板复用共享浮层视觉，在原有投影上叠加 `var(--border-2)`（16px 根字号下 1px）、`var(--surface-1)` 的 inset 内边框，不占用布局尺寸。共享契约见 [StyleSpec §2.13](../../../specs/maintainers/StyleSpec.md#213-quick-action-共享浮层视觉强制)。




Dialog 是通用模态容器。面板视觉复用 `.snowui-quick-action-panel`,内容面板出现 / 消失动效使用 `MODAL_DIALOG_APPEAR_MOTION` / `MODAL_DIALOG_DISAPPEAR_MOTION`，遮罩 opacity 使用 `DIALOG_BACKDROP_APPEAR_MOTION` / `DIALOG_BACKDROP_DISAPPEAR_MOTION`。具体 duration / easing / scale 以 motion preset catalog 为准，关闭时保留面板到 disappear preset 完成后再卸载。

<a id="ai-zone"></a>

### AI Zone

- 源码: `./Dialog.svelte`
- Logic: `../logic/dialog.svelte.ts`
- 主布局模型:复合管理布局,登记于 `../../../specs/maintainers/LayoutProtocol.md §12.3`
- 样式覆盖入口:`--snowui-dialog-padding-override`、`--snowui-dialog-radius-override`、`--snowui-dialog-font-size-override`、`--snowui-dialog-line-height-override`、`--snowui-dialog-max-width-override`、`--snowui-dialog-gap-override`、`--snowui-dialog-content-gap-override`、`--snowui-dialog-footer-gap-override`、`--snowui-dialog-text-padding-override`

## 更新日志

- 2026-09-21：统一使用文档、源码属性表与 Site / LLM 阅读入口；仅文档修订，不改变组件行为。

- closeOnOutside 默认改为 true；需要阻止遮罩关闭的消费方应显式传 false，三种激活模式一致。

- v1.1.0: 内置标题、关闭按钮、可选分割线与操作区；按 Workshop 更新三档 padding、圆角与间距；footer 的 Button as="item" 通过 Context 接收尺寸默认值。

- v1.0.0: 新增 Dialog 组件,实现 Panel / Inline / Template 三模式、焦点陷阱、滚动锁定和 backdrop 变体。
