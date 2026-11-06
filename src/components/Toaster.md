# Toaster

> **版本**: v1.0.3
> **职责**: 集中展示通过 toast() 触发的全局通知，支持六个屏幕位置、堆叠动效与可见数量控制，让连续反馈保持有序。
> **包归属**: `@snowui-design-system/components`
> **文档修订**: 2026-10-22

## 组件介绍

集中展示通过 toast() 触发的全局通知，支持六个屏幕位置、堆叠动效与可见数量控制，让连续反馈保持有序。

## 使用选择

<!-- usage-guide:start -->
作为 Toast 的展示宿主，协调通知队列与布局。普通页面通知列表由业务页面组织，不把历史消息全部转成瞬时 Toast。

- 挂载为通知展示宿主，使用 toast 创建消息；maxVisible 限制同时可见数量。
- 同一运行实例的命令式通知共用队列，在应用根部挂载一个 Toaster，让多个页面区域复用；重复挂载会重复展示同一条通知。
- offset / gap 控制位置与堆叠间隔；parts 配置默认 Toast 及字符串通知生成的 Text，单条消息的显式外观优先。
<!-- usage-guide:end -->

## 快速开始

以下示例展示推荐的基本组合。更多场景与组合限制见后文。

<!-- quick-start:generated -->
```svelte
<script lang="ts">
	import { Button } from '@snowui-design-system/components';
	import { Toaster, toast, dismissAllToasts } from '@snowui-design-system/components';
</script>

<div style="display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: var(--gap-4) var(--gap-3);">
	<Button onclick={() => toast({ text: "Changes saved", positive: true })}>Save changes</Button>
	<Button onclick={() => toast({ text: "Connection lost", positive: false })}>Connection error</Button>
</div>
<Toaster />
```
<!-- /quick-start:generated -->

## API

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| offset | `number` | `16` | 视口边缘到 Toast 区域的距离，单位 px |
| maxVisible | `number` | `3` | 单个位置最多可见的层数；仅限制可见层数，不限制 `toast()` 入队数量；达到上限后新 Toast 会把当前最后一层挤出 |
| gap | `number` | `8` | 同位置 Toast 之间的视觉偏移，单位 px |
| scaleStep | `number` | `0.05` | 每层堆叠的缩放衰减系数；`index=1` 时默认缩放到 `0.95` |
| stackOpacityStep | `number` | `0.2` | 每层堆叠的透明度衰减系数；默认第 2 / 3 层为 `0.8 / 0.6` |
| stackMinOpacity | `number` | `0.6` | 堆叠条目的最低透明度下限 |
| stackDuration | `number` | `300` | 堆叠组合动效时长，单位 ms |
| stackEasing | `string` | `"ease"` | 堆叠组合动效缓动 |
| width | `number \| string` | — | Toast 区域宽度；默认内容自适应，传入后可固定宽度；窄屏自动限制为 `calc(100vw - 2rem)` |
| parts | `ComponentPartsOf<{ Toast: typeof Toast; Text: typeof Text }>` | — | 统一配置直接生成的 Toast 外观与 text 字符串生成的 Text；Text 默认 lines=1，显式 children 不消费 parts.Text；队列数据、位置和关闭行为由 Toaster 管理，单条通知显式属性优先 |

未重新声明的继承能力请查所属基础组件文档；本表只列本组件源码具名公开属性。

## 使用边界与详细说明

<a id="内置组件双模式"></a>

### 内置组件双模式

- `parts.Toast`：统一配置 Toaster 直接生成的全部 Toast；`parts.Text` 只配置 text 字符串生成的标签，默认单行并提供截断全文。
- Toast 队列数据、position、关闭事件和堆叠动效由 Toaster 控制，不能由 part 覆盖。
- parts 只作用于 Toaster 直接创建的 Toast 与 text 标签，不递归进入 Toast 内部，也不接管显式 leading / children / trailing。
- Toast 实例显式 Prop 高于 `parts.Toast`；class 合并，style 按 parts 在前、显式 style 在后合并。

<a id="示例"></a>

### 示例

```svelte
<Toaster
    parts={{
        Toast: {
            variant: "rich",
            size: "md",
        },
    }}
/>
```

完整 Toast API 见 [Toast.md](Toast.md)。

<a id="定位规则"></a>

### 定位规则

- top / bottom 的区域占据视口左右 offset 之间的可用空间，通知按自身宽度在区域内居中；通知宽度仍由内容或 width 决定。
- 区域不依赖绝对定位子项提供内禀宽度，避免空区域宽度为 0 时通知从视口中线向右展开。



## AI Zone

源码见 [Toaster.svelte](Toaster.svelte)。公开状态与组合所有权以源码和上方使用说明为准。

## 更新日志

### v1.0.3 (2026-10-23)

- 命令式 text 字符串复用单行组合和 Text 默认截断／全文提示，内置标签可由 parts.Text 配置；自定义 children 保留原布局和自身配置，不改变队列、计时、位置与堆叠。

### v1.0.2 (2026-10-22)

- 队列入队及退出后的移除统一替换数组，修复退出节点遗留及后续通知不再更新的问题；保持通知 ID、时长、位置、可见层限制及关闭回调语义。

- 2026-10-22：补明确全局队列与应用单宿主用法，仅文档修订，不改变组件行为。

- 2026-09-21：统一使用文档、源码属性表与 Site / LLM 阅读入口；仅文档修订，不改变组件行为。

### v1.0.1 (2026-09-20)

- 修复默认内容宽度下 top / bottom 通知与堆叠未水平居中。
