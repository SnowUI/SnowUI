# Textarea

> **版本**: v1.0.2
> **职责**: 提供多行文本输入，可承接原生表单属性并组合字段反馈，适合描述、备注和较长内容的编辑。
> **包归属**: `@snowui-design-system/components`
> **文档修订**: 2026-10-23

## 组件介绍

提供多行文本输入，可承接原生表单属性并组合字段反馈，适合描述、备注和较长内容的编辑。

## 使用选择

<!-- usage-guide:start -->
用于多行文本输入，单行用 Input。标签、帮助和错误组合 Field；不要把普通展示文本放进只读输入框来模拟布局。

- bind:value 同步文本；defaultValue 只在 value 未定义时回退，表单重置需恢复绑定值。
- resize 控制调整方向；readonly / disabled 或 resize="none" 时不提供调节手柄。name 用于表单提交。
<!-- usage-guide:end -->

## 快速开始

以下示例展示推荐的基本组合。更多场景与组合限制见后文。

<!-- quick-start:generated -->
```svelte
<script lang="ts">
	import { Textarea } from '@snowui-design-system/components';
</script>

<Textarea placeholder="Share feedback on the SnowUI docs…" aria-label="Documentation feedback" style="width: min(100%, 22.5rem); min-width: 0;" />
```
<!-- /quick-start:generated -->

## API

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| value | `string` | — | 当前文本，支持 `bind:value`。显式值优先于 defaultValue；输入与 change 时先同步绑定值，再调用对应事件回调。 |
| defaultValue | `string` | — | value 为 undefined 时的回退文本；首次输入后由 value 接管。它不是独立的原生 reset 协议；受控表单需要在 onreset 中恢复绑定初值。 |
| placeholder | `string` | — | 空值时的多行提示，可包含换行；不能代替可访问标签。 |
| maxCount | `number` | — | 建议字符上限，只驱动计数器和 exceeded，不阻止输入。以 JavaScript string.length 计数（UTF-16 代码单元）；hover 到组件时显示计数，不再使用 80% 阈值；严格超过上限时变红且持续显示。建议使用正整数；硬性输入限制另设 maxlength。 |
| exceeded | `boolean` | `false` | 由当前文本长度是否严格超过 maxCount 自动计算；支持 bind:exceeded 读取结果。未设置 maxCount 时为 false，传入值会被计算结果覆盖；不会自动设置 invalid。 |
| name | `string` | — | 原生表单字段名，提交时按此名称读取文本；禁用字段不进入 FormData。 |
| disabled | `boolean` | `false` | 禁用输入、原生表单提交与 Tab 聚焦，同时关闭缩放手柄；保留可见内容。 |
| readonly | `boolean` | `false` | 只读，保留聚焦、选择、复制与具名表单提交；关闭缩放手柄，忽略 rows，并使用只读内容布局。 |
| required | `boolean` | `false` | 启用原生必填校验；失败时显示组件内置错误文字，自定义业务文案使用 error。 |
| rows | `number` | `2` | 传给原生 textarea 的可见行数提示，使用正整数；readonly 时不传递。组件挂载、输入和外部值变化时还会按内容测高，因此它不锁定最终高度。 |
| cols | `number` | — | 传给原生 textarea 的字符列数提示，使用正整数；组件默认占满容器宽度，因此它不直接决定外壳宽度。配合 wrap="hard" 可影响提交时的换行。 |
| minlength | `number` | — | 原生最小文本长度约束，按 UTF-16 代码单元计数；不阻止输入。空值需要另设 required；原生 invalid 事件自动接入组件错误反馈。 |
| maxlength | `number` | — | 原生最大输入长度约束，按 UTF-16 代码单元计数；浏览器通常限制用户继续输入，但不会截断外部赋给 value / defaultValue 的文本。与 maxCount 分别控制输入限制和计数提示。 |
| wrap | `HTMLTextareaAttributes["wrap"]` | — | 原生换行策略：soft 在视觉上换行但不为提交补换行；hard 可按列宽为提交内容补换行；off 不自动折行。未设置使用浏览器默认 soft；组件未提供水平滚动条，长行编辑优先使用 soft。 |
| spellcheck | `boolean` | — | 传递浏览器拼写检查开关；未设置遵循浏览器与继承环境，实际词典由浏览器提供。 |
| autocomplete | `HTMLTextareaAttributes["autocomplete"]` | — | 原生自动填充提示，例如 street-address；候选依赖浏览器保存的数据，不由组件提供。 |
| enterkeyhint | `HTMLTextareaAttributes["enterkeyhint"]` | — | 移动端回车键标签提示，例如 done / enter / next；不绑定提交或跳转动作，呈现由输入法决定。 |
| inputmode | `HTMLTextareaAttributes["inputmode"]` | — | 软键盘模式提示，例如 text / numeric；不改变字符串值类型，也不自动校验输入格式。 |
| form | `string` | — | 关联同一文档内指定 id 的原生 form，使位于表单 DOM 外的文本域仍参与该表单提交。 |
| autofocus | `boolean` | — | 传给原生 textarea 的自动聚焦请求；是否执行由浏览器决定，建议在用户主动打开编辑区域时使用。 |
| tabindex | `number` | — | 原生 Tab 顺序；0 使用自然顺序，-1 跳过顺序导航但允许主动聚焦，正数指定优先级。普通表单建议保留自然顺序。 |
| title | `string` | — | 原生提示文本；浏览器决定如何显示，不替代可见标签或错误信息。 |
| id | `string` | — | 内部原生 textarea 的 id，用于 label for 和 ARIA 引用；同一文档内保持唯一。 |
| resize | `"none" \| "vertical" \| "horizontal" \| "both"` | `"both"` | 缩放方向：none 隐藏手柄，vertical 调整高度，horizontal 调整宽度，both 同时调整两者。readonly / disabled 强制使用 none；手柄默认最小宽 120px、高 60px。手动设置高度后停止自动内容测高。 |
| invalid | `boolean` | `false` | 业务错误态，与 aria-invalid 及原生校验反馈合并；仅设置本属性不触发校验或聚焦。maxCount 不触发原生校验，嵌入 Field 后由 Field 汇总视觉反馈。 |
| error | `string` | — | 业务校验错误文字，与 invalid 配合显示在输入框下方；原生校验反馈自动接入。 |
| parts | `ComponentPartsOf<{ Indicator: typeof Indicator }>` | — | 配置内置 Indicator，例如 step / largeStep 键盘步长、maxWidth / maxHeight 边界和 ariaLabel。只作用于组件生成的手柄；resize=none、readonly 或 disabled 时无手柄可配置。 |
| onclick | `(event: MouseEvent) => void` | — | 单击内部原生文本域时触发。参数为原生事件，currentTarget 为内部 textarea；返回值被忽略，需要取消可取消的默认行为时调用 event.preventDefault()。 |
| ondblclick | `(event: MouseEvent) => void` | — | 双击内部原生文本域时触发。参数为原生事件，currentTarget 为内部 textarea；返回值被忽略，需要取消可取消的默认行为时调用 event.preventDefault()。 |
| oninput | `(event: Event) => void` | — | 用户输入改变内容时触发；调用前已同步绑定 value。参数为原生事件，currentTarget 为内部 textarea；返回值被忽略，需要取消可取消的默认行为时调用 event.preventDefault()。 |
| onchange | `(event: Event) => void` | — | 用户提交本次编辑时触发，通常在值改变后失焦；调用前已同步绑定 value。参数为原生事件，currentTarget 为内部 textarea；返回值被忽略，需要取消可取消的默认行为时调用 event.preventDefault()。 |
| onfocus | `(event: FocusEvent) => void` | — | 内部文本域获得焦点时触发。参数为原生事件，currentTarget 为内部 textarea；返回值被忽略，需要取消可取消的默认行为时调用 event.preventDefault()。 |
| onblur | `(event: FocusEvent) => void` | — | 内部文本域失去焦点时触发。参数为原生事件，currentTarget 为内部 textarea；返回值被忽略，需要取消可取消的默认行为时调用 event.preventDefault()。 |
| onkeydown | `(event: KeyboardEvent) => void` | — | 按下键盘按键时触发，可读取 key 等字段。参数为原生事件，currentTarget 为内部 textarea；返回值被忽略，需要取消可取消的默认行为时调用 event.preventDefault()。 |
| onkeyup | `(event: KeyboardEvent) => void` | — | 释放键盘按键时触发，可读取 key 等字段。参数为原生事件，currentTarget 为内部 textarea；返回值被忽略，需要取消可取消的默认行为时调用 event.preventDefault()。 |
| onkeypress | `(event: KeyboardEvent) => void` | — | 浏览器派发旧式 keypress 时触发；此原生事件已弃用，新代码优先使用 onkeydown。参数为原生事件，currentTarget 为内部 textarea；返回值被忽略，需要取消可取消的默认行为时调用 event.preventDefault()。 |
| onpaste | `(event: ClipboardEvent) => void` | — | 粘贴时触发，可通过 clipboardData 读取此次剪贴板内容。参数为原生事件，currentTarget 为内部 textarea；返回值被忽略，需要取消可取消的默认行为时调用 event.preventDefault()。 |
| oncopy | `(event: ClipboardEvent) => void` | — | 复制选中文字时触发，可通过 clipboardData 设置此次复制内容。参数为原生事件，currentTarget 为内部 textarea；返回值被忽略，需要取消可取消的默认行为时调用 event.preventDefault()。 |
| oncut | `(event: ClipboardEvent) => void` | — | 剪切选中文字时触发，可通过 clipboardData 设置此次剪切内容。参数为原生事件，currentTarget 为内部 textarea；返回值被忽略，需要取消可取消的默认行为时调用 event.preventDefault()。 |

未重新声明的继承能力请查所属基础组件文档；本表只列本组件源码具名公开属性。

## 原生表单校验反馈

原生必填、类型、长度和格式校验失败时，组件取消浏览器气泡，将 `validationMessage` 显示在组件下方，并保持原生无效提交拦截。首个无效字段获得焦点；输入修正后更新反馈，表单重置清除反馈。调用方业务校验继续使用 `invalid` 与 `error`，原生错误存在时优先显示原生反馈。原生消息语言由浏览器决定，不将校验状态等同服务端验证结果。

## 使用边界与详细说明

<a id="内置组件双模式"></a>

### 内置组件双模式

- `parts.Indicator`：统一配置 resize 模式下的内置 Indicator。
- Textarea value、invalid、disabled 与输入事件属于父组件受控协议。

> **版本**: v1.0.2
> **更新日志 (2026-04-28)**: 标注主布局模型为复合管理布局，并同步代码版本。
> **职责**: 基础多行文本输入宿主，负责承接原生 `<textarea>` 能力与 Frame 通用能力。

**2026-04-04 补充**: 参考 Figma `10109:19152`，`Textarea` 是表单系列里的单独例外：单独使用时默认内容留白为 `top 12 / right 16 / bottom 24 / left 16`。进入 `Field` 后，只看有没有 `as="segment"`；未标 `segment` 时由外层 `Field` 处理默认 `12 / 16` 与 `gap = 8`，`Textarea` 去掉组件自身 padding，但保留自身 gap；标了 `segment` 时保留 `Textarea` 自身的 padding 与 gap。右下角使用统一 `Indicator appearance="corner"`；字符计数器默认不显示，传入 `maxCount` 后在 hover 到组件时显示计数，超限时持续显示。
**2026-04-09 补充**: `Textarea` 右下角保留区（含缩放图标与计数器）始终存在；默认要求是 `right = 16px`、`bottom = 0`，不得贴边。
**2026-04-24 补充**: `Textarea` 使用与 `Listbox` 一致的自定义浮层滚动条：原生滚动条隐藏，thumb 覆盖在内容之上，不占布局宽度；默认宽 4px，hover 到 thumb 后从右向左变为 8px，右边缘距容器右边框 4px，轨道透明并支持拖拽。
**2026-05-26 补充**: `Textarea` 的顶部/底部滚动渐隐改为复用 `layout.css` 的 `.snowui-scroll-mask` 通用能力（即「内容渐隐层」基础共享能力的 CSS 静态形态，能力总览见 [`../lib/edge-fade.md`](../lib/edge-fade.md)），在原生 `<textarea>` 上通过 `data-scroll-mask` 驱动 `mask-image`，不再绘制可见渐变色块。

**继承**: 复用 Frame.svelte 的所有通用能力（状态、动效、响应式、Skeleton、样式编排）。
**推荐容器**: `Field.svelte`。
**默认能力开关**: `enableResponsive=false`, `enableContext=true`, `enableScaleObserver=false`。

内部原生 `<textarea>` 显式接入 `layout.css` 的 `.snowui-native-control`，只归一化 box sizing、margin 并继承消费环境的字体与颜色；Textarea 自身字号、行高、Padding、边框和状态视觉不依赖可选的 `snowui-base.css`。

<a id="布局模型"></a>

### 布局模型

主布局模型：复合管理布局。

- Textarea 的区域结构为 root host / native control / footer / Indicator corner / counter / overlay scrollbar。
- 进入 Field 时，Textarea 只作为多行输入宿主参与 Field 的槽位宿主布局；自身 footer、计数器、resize 与 scrollbar 仍由 Textarea 私有管理。
- `as="segment"` 只影响 Textarea 与 Field 的连续字段表面关系，不把 Textarea 改造成通用槽位容器。
- footer 的计数器与 Indicator 同排时优先 gap-1，并保留 4 CSS px 间距下限及较大 Token；单一附件不产生空槽。多行输入正文、计数显隐和手柄固有尺寸保持各自协议。
- footer 使用内部 Pin 布局固定到 `pin-bottom-right`。独立模式偏移为 `var(--padding-1)`；嵌入 Field 时通过 `--pin-offset-x/y` 负值补偿 Field padding。
- 自定义浮层滚动条复用 `useOverlayScrollbar`，但滚动条定位和右下角保留区属于 Textarea 私有区域结构。

<a id="2026-04-04-表单样式规则"></a>

### 表单组合与间距

- 基础节奏统一：`Field` 默认 `padding = 12 / 16`，`gap = 8`
- `Textarea` 单独使用时：组件自身默认内容留白为 `top 12 / right 16 / bottom 24 / left 16`
- 放进 `Field` 后，先看有没有 `as="segment"`
- 没有 `as="segment"`：由外层 `Field` 负责 `12 / 16` padding 与 `8` gap；`Textarea` 去掉组件自身 padding，但保留自身 gap
- 有 `as="segment"`：这是连续字段表面的一段；保留 `Textarea` 自身的 padding 与 gap
- `segment` 之间才有分割线：横向是左右分割线，纵向是上下分割线
- 相邻 `segment` 之间只能有一条分割线，不能重复画线
- `label / description / error` 不负责 padding、gap、分割线，它们只是内容元素
- 普通 `label + host + error`：不作为 padding、gap 的判断依据，只负责文字内容
- `Field row` 或 `Field column` 里，如果是连续输入段，子项要显式写 `as="segment"`

<a id="组件定位"></a>

### 组件定位

`Textarea` 的推荐用法是作为 `Field` 容器中的多行宿主：

- 单独使用时可保持兼容性的默认输入框表现
- 进入 `Field` 上下文后，未标 `segment` 时由外层 `Field` 接管 padding；标了 `segment` 时保留 `Textarea` 自身留白
- 适合与 `Text as="label" / "error"`、`Frame as="row"` 等角色组合

<a id="frame-能力继承"></a>

### Frame 能力继承

`Textarea` 仍然基于 `Frame`，因此继续支持：

- `responsive / stateStyle / customStates / variants / styles`
- `Hover / Click / Focus / whileAppear / timeline / orchestrate`
- `loading / skeleton / renderHints`
- `as / use / layoutId / itemId / scope / access`

组件负责的是多行文本宿主，不是放弃 `Frame` 通用能力。

### 错误反馈 Shake

`Textarea invalid / aria-invalid` 默认自动播放错误 shake。单独使用时由 `Textarea` 自身反馈；进入 `Field` 后，嵌入态 `Textarea` 不单独抖动，由外层 `Field` 汇总后整体反馈。

错误态与 shake 不会自动聚焦，也不会模拟 `focus-within`；焦点态只来自用户真实聚焦、显式 `autofocus` 或业务代码主动调用 `focus()`。

<a id="宿主协议"></a>

### 原生能力边界

`Textarea` 负责：

- 原生 `<textarea>` 属性透传
- `value / defaultValue` 解析
- `bind:value` 同步
- `resize` 方向控制
- `invalid` 与 `aria-invalid` 汇总

`Textarea` 不负责：

- 富文本编辑
- markdown 语法增强
- 业务指定的自动高度策略；当前组件按内容自动测高，最高约 15 行行高，手动调整高度后停止自动测高
- 业务级校验提示

<a id="使用示例"></a>

### 使用示例

```svelte
<!-- 推荐：放入 Field -->
<Field>
  <Textarea placeholder="请输入更多说明" />
</Field>

<!-- 带标题与错误提示 -->
<Field invalid>
  <Text as="label">问题描述</Text>
  <Textarea rows={6} placeholder="请详细描述问题" />
  <Text as="error">至少需要 20 个字符。</Text>
</Field>

<!-- 多行表单字段 -->
<Textarea
  name="description"
  rows={6}
  minlength={20}
  maxlength={200}
  maxCount={200}
  placeholder="请描述你的问题"
/>

<!-- 继承 Frame 能力 -->
<Textarea
  Click={{ Idle: "Active", Active: "Idle" }}
  stateStyle={{
    Idle: "--snowui-textarea-background: var(--surface-1, #ffffffcc);",
    Active:
      "--snowui-textarea-background: color-mix(in srgb, var(--primary, #000000) 8%, var(--surface-1, #ffffffcc));",
  }}
  defaultValue="点击切换状态"
/>
```

<a id="与通用逻辑的关系"></a>

### 无障碍与表单建议

- 需要明确标签时，优先在 `Field` 中显式渲染 `label`
- 错误提示建议通过 `aria-describedby` 关联到宿主
- 如果要做聊天输入框、评论框、带工具栏的富输入区，建议在 `Field` 容器里继续组合，而不是把所有 UI 堆进 `Textarea` 本体

---




## 必填反馈

显式设置 `required` 时，空值提交由组件显示错误文字，首个无效字段获得焦点并以红色边框闪动；外光圈保持原色，减少动效时不闪动。取消浏览器校验气泡但保留无效提交拦截；修正输入后更新提示，表单重置清除提示。

## AI Zone

以下章节保留源码维护约束，不属于应用接入步骤。

### 宿主协议

`Textarea` 和 `Input / Select` 一样，进入 `Field` 后会退化成 host：

- 根节点带 `.snowui-field-host`
- 根节点从 `.snowui-field-bordered` 切回 `.snowui-field-host`
- 外壳视觉、focus ring 和分隔线由容器负责
- 未标 `segment` 时，`Textarea` 去掉自身 padding（由外层 `Field` 统一负责 `12 / 16` padding 与 `8` gap），但保留自身 gap
- 标了 `segment` 时，保留 `Textarea` 自身的 padding 与 gap，作为连续字段表面的一段
- 多行输入的值同步、placeholder、readonly、resize 规则仍由宿主自身负责
- 手柄与可见滚动条滑块重叠时滚动条优先，手柄隐藏并退出交互；不再重叠时恢复。优先级契约见 [Indicator](Indicator.md)。
- `Indicator appearance="corner"` 是统一尺寸手柄，随 footer 通过 `pin-bottom-right` 固定在右下角；Textarea 不再私有维护 pointer capture、方向键或 clamp 算法
- 右下角保留区（含缩放图标与计数器）固定在右下角，默认右侧留白为 `16px`
- 字符计数器属于 `Textarea` 组件自身逻辑，不属于通用表单样式规则；传入 `maxCount` 后自动驱动

<a id="原生能力边界"></a>


### 与通用逻辑的关系

`Textarea` 当前优先复用：

- [../logic/frame-prop-filter.ts](../logic/frame-prop-filter.ts)
- [../logic/frame-field-control.ts](../logic/frame-field-control.ts)
- [../lib/overlay-scrollbar.svelte.ts](../lib/overlay-scrollbar.svelte.ts)
- [../context.ts](../context.ts)

因此它的宿主分发和值同步链路，与 `Input / Select` 保持一致。

<a id="无障碍与表单建议"></a>



<a id="样式规范-style-spec"></a>

### 样式规范 (Style Spec)

### 1. 基础几何

| 项目 | 值 |
| :--- | :--- |
| 默认最小高度 | `calc(var(--snowui-textarea-padding-top) + var(--snowui-textarea-padding-bottom) + var(--snowui-textarea-line-height))`；readonly 时为 0，最终高度还受内容测量和手动缩放影响 |
| 圆角 | `var(--radius-4)` |
| 左侧内边距 | `var(--padding-4)` |
| 右侧内边距 | `var(--padding-4)` |
| 顶部内边距 | `var(--padding-3)` |
| 底部内边距 | `var(--padding-6)` |
| 字号 | `var(--text-14)` |
| 行高 | `var(--leading-14)` |
| 默认背景 | `var(--surface-1)` |
| 默认边框 | `inset 0 0 0 var(--border-1) var(--black-20)` |
| placeholder 颜色 | `var(--black-20)` |
| 右下角尺寸手柄 | `Indicator appearance="corner"`，16px，随 footer 固定在右下角 |
| 计数器右侧留白 | `var(--padding-4)` |
| 计数器文本 | `Text 12/16`，设置 `maxCount` 后 hover 时显示，超出时变红并持续显示 |
| 滚动条 | 自定义浮层滚动条，隐藏原生滚动条；默认 4px / hover 8px，右边缘距容器右边框 4px，透明轨道 |
| 滚动渐隐 | `.snowui-scroll-mask` + `data-scroll-mask="top\|bottom\|both"`，默认 32px，可用 `--snowui-textarea-scroll-mask-size-override` 覆盖 |

<a id="开发者指南-ai"></a>

### 开发者指南 (AI)

### 模块索引 (Module Index)

- **Textarea 组件**: [./Textarea.svelte](Textarea.svelte)

### 关联关系

- **父组件**: [Frame.svelte](Frame.svelte)
- **共享逻辑**: [../logic/frame-field-control.ts](../logic/frame-field-control.ts)
- **Props 分发**: [../logic/frame-prop-filter.ts](../logic/frame-prop-filter.ts)
- **字段上下文**: [../context.ts](../context.ts)
- **关联规范**: [../../../docs/standards/HTMLSpec.md](../../../docs/standards/HTMLSpec.md)

---

## 更新日志

### v1.0.2 (2026-10-23)

- 计数器与尺寸手柄之间保留 4 CSS px 间距；独立／Field／segment 共用，保留多行编辑、原生表单、计数显隐与缩放交互。

- 2026-09-28：同步 Indicator 的统一命中与状态视觉；Corner 默认同时调整宽高，显式单轴配置继续生效。

- 2026-09-21：统一使用文档、源码属性表与 Site / LLM 阅读入口；仅文档修订，不改变组件行为。

- **Textarea-Docs.2026-06-22** 右下角私有 RoundedCorner 拖拽迁移到统一 Indicator；保留 vertical / horizontal / both 与宽 120px、高 60px 的独立最小尺寸。
- **Textarea-Docs.2026-05-25** 源码顶部历史更新日志已归档；后续新增变更统一写入本文档 更新日志，源码顶部只保留职责、当前关键架构与文档路径。

### v1.0.1 (2026-04-28)

#### 文档
- 标注主布局模型为复合管理布局，并同步组件代码版本。

### v1.0.0 (2026-03-15)

#### 新功能
- **TXT-Feat.1** 新增基于 `Frame` 的多行文本输入组件，支持原生 `<textarea>` 属性透传、`bind:value`、Skeleton 与响应式能力。
