# Toast

> **版本**: v2.3.3
> **职责**: 用短暂通知反馈操作结果或状态变化，支持图标、操作和富内容，适合保存成功、错误与提醒。
> **包归属**: `@snowui-design-system/components`
> **文档修订**: 2026-09-21

简单通知默认使用 Frame `singleLine`；rich 通知保留复合多行正文布局，不将整张通知强制为单行。

## 组件介绍

用短暂通知反馈操作结果或状态变化，支持图标、操作和富内容，适合保存成功、错误与提醒。

## 使用选择

<!-- usage-guide:start -->
用于短暂的操作结果反馈，配合 Toaster 管理展示。通知历史、活动记录使用常驻内容列表，不使用 Toast。

- 调用 toast 发送短暂反馈，由 Toaster 管理队列；独立渲染时页面负责关闭后的移除。
- as="toast" 可接入宿主点击触发；leading / trailing 组合附属内容，parts 只配置默认关闭按钮。短标签使用继承的 singleLine 与 Text lines={1}；内部有效间距至少4 CSS px，rich 多行正文保持原布局。
<!-- usage-guide:end -->

## 快速开始

以下示例展示推荐的基本组合。更多场景与组合限制见后文。

<!-- quick-start:generated -->
```svelte
<script lang="ts">
	import { Toast, Button, Text } from '@snowui-design-system/components';
</script>

<div style="display: flex; flex-direction: column; align-items: center; gap: var(--gap-4); max-width: 100%;">
	<Toast singleLine><Text lines={1}>Draft saved</Text></Toast>
	<Toast positive singleLine><Text lines={1}>Changes published</Text></Toast>
	<Toast positive={false} singleLine><Text lines={1}>Connection lost</Text></Toast>
</div>
```
<!-- /quick-start:generated -->

## API

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| parts | `ComponentPartsOf<{ Button: typeof Button }>` | — | 配置内置关闭 Button 的外观；事件、关闭语义和 ARIA 由 Toast 管理 |
| id | `string` | — | 静态使用时透传为 DOM id；`template` 模式下作为模板 id，供 `showToast(id)` 激活 |
| template | `boolean` | `false` | **模版模式**:只注册为命令式 Toast 模板，不直接渲染；用于"一段 Toast 代码 + 一个触发按钮"的写法 |
| as | `"toast" \| undefined` | — | **内嵌模式**(v1.1.0):`as="toast"` 启用 Inline 模式,自动发现宿主父元素并绑定 click 事件触发 Toast。遵循 [ComponentGuidelines.md §5](../../../docs/standards/ComponentGuidelines.md) 三激活模式规范 |
| positive | `boolean` | — | 语义判定：`true`=积极(CheckCircle)；`false`=问题(Warning)；不传则不渲染内置图标 |
| variant | `ToastVariant` | `"default"` | 视觉变体 |
| size | `ToastSize` | `"md"` | 仅 default 变体生效 |
| position | `ToastPosition` | `"top"` | 用于驱动出入场方向（不直接定位） |
| onDismiss | `() => void` | — | 点击关闭 X 时回调（rich 变体） |
| children | `Snippet` | — | 正文和 leading / trailing 槽位内容；独立使用时由调用方处理关闭后的移除 |

未重新声明的继承能力请查所属基础组件文档；本表只列本组件源码具名公开属性。

## 使用边界与详细说明

<a id="toaster-内置组件双模式"></a>

### Toaster 内置组件双模式

- `Toaster.parts.Toast`：统一配置 Toaster 直接生成的 Toast；`Toaster.parts.Text` 只配置 text 字符串生成的标签，不接管自定义 children。
- Toast 队列状态、position 与关闭事件由 Toaster 控制；外置显式 Props 高于 part。


Toast 是 SnowUI 的全局通知组件。整套能力由三件交付物组成：

| 交付物 | 角色 |
| :--- | :--- |
| `<Toast />` | 单个 Toast 的视觉外壳（三槽位）。可独立用作静态展示，也由 Toaster 内部使用 |
| `<Toaster />` | 全局 Portal 容器；订阅 store，渲染 6 个位置的堆叠队列。一个应用挂载一次即可 |
| `toast(...)` | 命令式入口；可在任意 `.ts` / `.svelte` 中调用 |

独立 Panel 模式的 Toast 根显式使用 `GENERIC_SCALE_APPEAR_MOTION`，保持原 Frame generic appear 的 opacity + scale 视觉与标准时序，不再通过 `whileAppear={true}` 隐式跟随 Frame fallback。Toaster 队列仍使用位置相关的显式 slide + opacity + scale 组合，两层既有视觉均保持不变。

<a id="功能概览"></a>

### 功能概览

- 6 个固定位置：`top` / `top-left` / `top-right` / `bottom` / `bottom-left` / `bottom-right`，距视口边缘 16px，默认 `top`
- 三槽位布局（Leading / Content / Trailing）；内置图标支持外置 Icon 替换
- 默认变体（`default`）：深色 pill，并使用 `blur(var(--size-10))` 背景模糊；rich 变体：`Background/3` 玻璃卡片，复用 `.snowui-quick-action-panel` 的背景模糊
- 自动消失：默认 4 秒；`duration: 0` 表示常驻
- 自动消失计时在最上层 Toast hover 时暂停，离开 hover 后按剩余时间恢复
- 多个同位置 Toast 自动堆叠（HeroUI 风格）：默认 `gap=8`、`maxVisible=3`、`scaleStep=0.05`、`stackOpacityStep=0.2`、宽度内容自适应（均可配置）
- 出现、退出、堆叠前移与最后一层被挤出动效均在 Toast 根元素组合：生命周期使用 `transform + opacity`，堆叠使用独立 `translate + scale`，堆叠透明度直接合并进 Frame fade 数值；关闭时先进入 `Disappear`，动画完成后再从队列移除

---

<a id="布局模型"></a>

### 布局模型

主布局模型：**复合管理布局**。

- Toaster 是页面级 Portal，挂载到 `<body>` 上，使用 6 个绝对定位区域承载 Toast 栈；每个栈槽位是绝对定位的 `Frame`，由 `currentState="Appear" | "Disappear"` 驱动默认动效
- 栈槽位按 HeroUI 的 index 规则写入 `translate` / `z-index`：frontmost index = 0，后层向内侧偏移
- 非 frontmost Toast 禁止交互，但仍保留真实 Toast 内容；叠层差异由位移、缩放、透明度三种动效组合给出
- 单条 Toast 内部为槽位宿主布局（`Frame row` + 三槽位），Leading / Content / Trailing 标准结构
- 关闭 X 按钮属于 rich 变体的内置 trailing 装饰；通过绝对定位浮在 Toast 右上角，不参与三槽位

---

<a id="api-参考"></a>


### `toast(input)` — 命令式入口

```ts
import { toast } from "@snowui-design-system/components";

toast("Done");                                        // String shorthand -> equivalent to { text: "Done" }
toast({ text: "Done", positive: true });              // Positive -> green CheckCircle
toast({ text: "Something Wrong", positive: false });  // Warning / negative -> yellow Warning
toast({ text: "Plain Notice" });                      // Omit positive -> hide built-in status icon
const id = toast({ text: "持久通知", duration: 0 });
dismissToast(id);                                     // Dismiss manually
showToast("saved-template");                          // Trigger <Toast template id="saved-template">
```

| 参数 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| `positive` | `boolean` | — | 语义判定：`true`=积极(CheckCircle)；`false`=问题(Warning)；不传则不显示内置图标 |
| `text` | `string` | — | 命令式快捷文案；Toaster 使用 Text 默认单行截断并提供全文提示 |
| `children` | `Snippet` | — | 自定义正文内容；优先级高于 `text` |
| `leading` | `Snippet` | — | 自定义 Leading 槽 Snippet |
| `trailing` | `Snippet` | — | 自定义 Trailing 槽（rich 变体常用于放 Button） |
| `variant` | `"default" \| "rich"` | `"default"` | 视觉变体 |
| `size` | `"sm" \| "md"` | `"md"` | 仅 default 变体生效；rich 固定 md |
| `position` | `ToastPosition` | `"top"` | 6 个出现位置 |
| `duration` | `number` | `4000` | 单位 ms；`0` 表示常驻 |
| `onDismiss` | `() => void` | — | 关闭回调 |

辅助函数：
- `dismissToast(id: string): void` — 关闭指定 Toast
- `dismissAllToasts(position?: ToastPosition): void` — 关闭全部或指定位置的 Toast
- `showToast(id: string, overrides?: ToastOptions): string | undefined` — 通过 `<Toast template id="...">` 注册的模板触发通知；`overrides` 可覆盖位置、时长等运行时参数

### 动效要点

结论：

- Toast 动效采用单根元素组合结构。`whileAppear / whileDisappear` 输出生命周期 `transform` 与 `--su-motion-opacity`；堆叠位移和缩放分别使用 CSS 独立属性 `translate` / `scale`，不会覆盖生命周期 transform。
- 堆叠透明度直接乘入生命周期 fade 数值；默认第 2 层为 `0.8`、第 3 层为 `0.6`，退场时再降低当前透明度的 `20%`。
- 退出额外越界距离直接合并进 `--snowui-toast-stack-translate-y`，与生命周期的百分比位移共同作用，确保深层 Toast 也能越过可视区域边缘。
- 背景、阴影和 `backdrop-filter` 始终属于同一个 Toast 根元素，不创建独立 blur plate。
- `maxVisible` 只限制可见层数，不限制 `toast()` 入队数量。超过可见层后，当前最后一层进入 `pushed-out`，不是丢弃新 Toast。
- 自动消失计时在同位置任一可见层 hover 时暂停，离开后恢复；只有 `idle` 层 hover 显示关闭 X，后层不显示 X。

### `<Toast />`（视觉单元）

继承 `FrameProps`（排除 `children`），并新增：


> v2.0.0 起：移除 `title` / `description` / `icon` 三个 prop。文字内容统一通过 children 外置；内置图标由 `positive` 判定(undefined 时不显示)。

---

<a id="使用示例"></a>


### 全局挂载 + 命令式触发

```svelte
<script>
    import { Button, Frame, Text, Toast, Toaster, showToast, toast } from "@snowui-design-system/components";
</script>

<Toaster />

<Button onclick={() => toast("Done")}>Show Toast</Button>
<Button onclick={() => toast({ text: "Something Wrong", positive: false })}>
    Warning
</Button>
<Button
    onclick={() =>
        toast({
            text: "Saved",
            positive: true,
            variant: "rich",
            position: "top-right",
        })
    }
>
    Rich Toast
</Button>
```

### 静态使用（不通过 toast()）

```svelte
<Toast positive>Done</Toast>
<Toast positive={false}>Something Wrong</Toast>
<Toast>Plain Notice</Toast>  <!-- Omit positive to hide built-in status icon -->
<Toast variant="rich" positive>
    <Frame column class="flex-1 min-w-0">
        <Text>Saved</Text>
        <Text class="text-12 text-black-40">Your changes are synced.</Text>
    </Frame>
</Toast>
```

### 内嵌模式 (v1.1.0,`as="toast"`)

Toast 作为宿主子节点,点击宿主即触发,无需 id、无需手动 `showToast`。遵循 [ComponentGuidelines.md §5 浮层组件三激活模式规范](../../../docs/standards/ComponentGuidelines.md)。

```svelte
<Toaster />

<Button variant="filled">
    保存
    <Toast as="toast" positive position="top-right">已保存</Toast>
</Button>
```

### 声明式模板 + 按钮触发

```svelte
<Toaster />

<Toast id="saved-rich-toast" template class="items-start" variant="rich" positive style="width: 15rem;">
    <Frame column class="flex-1 min-w-0">
        <Text>Text</Text>
        <Text class="text-12 text-black-40">Text 2</Text>
    </Frame>
    <Button as="trailing" variant="gray">Button</Button>
</Toast>

<Button onclick={() => showToast("saved-rich-toast", { position: "top-right" })}>
    Add Rich Toast
</Button>
```

### 替换内置图标

```svelte
<Toast positive>
    <Icon as="leading"><Heart /></Icon>
    收藏成功
</Toast>
```

## AI Zone

- **模块分工**：[Toast.svelte](Toast.svelte) 提供三槽位视觉外壳（`default` 深色胶囊 `blur(var(--size-10))`；`rich` 复用 `.snowui-quick-action-panel` 玻璃面板与共享浮层内描边）；[Toaster.svelte](Toaster.svelte) 作为页面级 `body` Portal 管理 6 个位置堆叠与 hover 暂停倒计时；[../logic/toast.svelte.ts](../logic/toast.svelte.ts) 维护无阻塞队列与 `toast()` / `showToast()` / `dismissToast()` / `dismissAllToasts()`。
- **单根堆叠与生命周期动效合成**：每条 Toast 独立在 `appearing / idle / stack-1 / stack-2 / exiting / pushed-out` 状态间迁移，不阻塞后续 `toast()` 入队。根元素同时承载 Frame 生命周期 `transform`（`slide + scale`）与独立 CSS `translate / scale` 堆叠属性，堆叠透明度直接乘入 Frame fade 配置（默认第 2 层 `0.8`、第 3 层 `0.6`），退出或超过 `maxVisible` 被挤出（`pushed-out`）时叠加额外越界位移完整离开视口。非最前层保留真实内容但禁用交互，仅 `idle` 层 hover 时显示关闭按钮。
- **内置图标与骨架登记**：`positive` 通过 `ComponentIcon` 渲染 `check-circle` / `warning`（存在直系 `as="leading"` 时自动让位），支持应用级 `IconProvider` 覆盖；`Skeleton.svelte` 映射 `snowui-toast → toast`。

## 更新日志

### v2.3.3 (2026-10-23)

- 通知内部图文和独立文字区域的有效间距至少4 CSS px，根字号及间距缩小时仍保留下限；已有更大间距保持。短标签组合可通过继承的 `singleLine` 与 `Text lines={1}` 保持单行并提供截断全文；rich 的复杂多行正文不自动转成单行。

- 2026-09-21：统一使用文档、源码属性表与 Site / LLM 阅读入口；仅文档修订，不改变组件行为。

### v2.3.2 (2026-07-05)

#### 修复

- 按外置 Icon 替换协议检测 Toast 的直系 `leading` 子项；存在外置 `as="leading"` 时不再渲染内置 CheckCircle / Warning，修复 TS-04 同时显示两个图标的问题。

### v2.3.0 (2026-06-18)

#### 样式调整

- default 变体新增 `backdrop-filter: blur(var(--size-10))` 与 WebKit 前缀，背景模糊档位与共享浮层面板一致。
- rich 变体在 Toaster 的 idle 层不再覆盖为不透明 `Background/1`，统一保留 `.snowui-quick-action-panel` 提供的 `Background/3 + blur(var(--size-10))`。该调整选择玻璃效果优先，允许堆叠后层内容通过半透明背景产生轻微透出。
- Toaster 不再使用独立 slot / measure 包装层承接动效。Toast 根元素自身同时承接堆叠 `translate` / `scale`、生命周期 `transform`、组合 opacity、背景与 `backdrop-filter`，避免外置 blur plate 在内容淡入淡出时单独暴露为灰色层。
- 单层结构中的透明度直接合并进 Frame fade 配置：appear 为 `[80% × stackOpacity, stackOpacity]`，disappear 为 `[stackOpacity, 80% × stackOpacity]`。默认第 2 层稳定态 `0.8`、第 3 层 `0.6`，退场终值分别为 `0.64 / 0.48`；不复用会与 Frame blur motion 冲突的 `filter` 属性。
- 移除已无消费方的 `--snowui-toast-idle-background-override`。

完整历史见 [更新日志归档](../../docs/history/changelogs/Toast.history.md)。
