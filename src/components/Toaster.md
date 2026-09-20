# Toaster

> **版本**：v1.0.1
> **职责**：渲染全局 Toast 队列、位置分组和堆叠动效。

## 内置组件双模式

- `parts.Toast`：统一配置 Toaster 直接生成的全部 Toast。
- Toast 队列数据、position、关闭事件和堆叠动效由 Toaster 控制，不能由 part 覆盖。
- parts 只作用于 Toaster 直接创建的 Toast，不递归进入 Toast 内部。
- Toast 实例显式 Prop 高于 `parts.Toast`；class 合并，style 按 parts 在前、显式 style 在后合并。

## 示例

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

完整 Toast API 见 [Toast.md](./Toast.md)。


## 组件属性

| 关键字 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| `offset` | `number` | `16` | 视口边缘到 Toast 区域的距离，单位 px |
| `maxVisible` | `number` | `3` | 单个位置最多可见的层数；仅限制可见层数，不限制 `toast()` 入队数量；达到上限后新 Toast 会把当前最后一层挤出 |
| `gap` | `number` | `8` | 同位置 Toast 之间的视觉偏移，单位 px |
| `scaleStep` | `number` | `0.05` | 每层堆叠的缩放衰减系数；`index=1` 时默认缩放到 `0.95` |
| `stackOpacityStep` | `number` | `0.2` | 每层堆叠的透明度衰减系数；默认第 2 / 3 层为 `0.8 / 0.6` |
| `stackMinOpacity` | `number` | `0.6` | 堆叠条目的最低透明度下限 |
| `stackDuration` | `number` | `300` | 堆叠组合动效时长，单位 ms |
| `stackEasing` | `string` | `"ease"` | 堆叠组合动效缓动 |
| `width` | `number \| string` | — | Toast 区域宽度；默认内容自适应，传入后可固定宽度；窄屏自动限制为 `calc(100vw - 2rem)` |
| `parts` | `ComponentPartsOf<{ Toast: typeof Toast }>` | — | 统一配置直接生成的 Toast 外观；队列数据、位置和关闭行为由 Toaster 管理，单条通知显式属性优先 |


## 定位规则

- top / bottom 的区域占据视口左右 offset 之间的可用空间，通知按自身宽度在区域内居中；通知宽度仍由内容或 width 决定。
- 区域不依赖绝对定位子项提供内禀宽度，避免空区域宽度为 0 时通知从视口中线向右展开。

## 更新日志

### v1.0.1 (2026-09-20)

- 修复默认内容宽度下 top / bottom 通知与堆叠未水平居中。
