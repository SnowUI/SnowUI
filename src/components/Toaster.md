# Toaster

> **版本**：v1.0.0  
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
