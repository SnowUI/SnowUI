# Style Orchestrator (样式编排)

> **版本**: v1.0.0
> **职责**: 提供高优先级的样式集中穿透控制能力，支持跨组件的样式联动与复杂运算。

`frame-orchestrator.svelte.ts` 实现了 SnowUI 的样式编排系统。它通过集中式的规则配置，允许父容器精确驱动深层子组件的视觉表现，是实现复杂交互视觉逻辑的核心模块。

---

## 1. 核心能力

1.  **穿透控制**: `root` -> `#child_btn`，无需逐层传递 Props。
2.  **复杂运算**: 支持 JS 表达式 (e.g. `size > 20 ? 4 : 0`)。
3.  **联动响应**: 监听 A 组件状态 (`width`, `hover`) 实时驱动 B 组件样式。
4.  **高优先级**: 默认作为 Inline Style 应用 (P6)，必要时可通过 `force` 提升至 P7 (`!important`)。

---

## 2. API 概览

在根 Frame 上通过 `styles` 属性定义编排规则：

```svelte
<Frame
    id="root"
    styles={{
        // 简单赋值 (覆盖默认 Props)
        "#frame3": { padding: 8, radius: 4 },

        // 嵌套组件定位
        "#frame3_btn": { size: 32 },

        // 依赖计算 (联动)
        "#frame3_icon": {
            // 当 frame3_btn 变大时，icon 随之变大 (1.2倍)
            size: "1.2 * $#frame3_btn.size",
            // 逻辑判断
            opacity: "$#root.width > 500 ? 1 : 0"
        }
    }}
>
    <!-- ... 任意层级的子组件 ... -->
</Frame>
```

---

## 3. 可编排属性 (Keywords)

> [!NOTE] 唯一标识符 (ID Requirement)
> 样式编排依赖组件的 `id` 属性进行寻址：
> - **受控组件 (Target)**: **必须**提供 `id`，否则无法被 `styles` 规则选中。
> - **变量暴露**: 只有显式设置 ID 的组件，其属性才会暴露为 CSS 变量 (e.g. `--size-width`)。

| 属性 | 说明 | 对应 CSS 变量 (自动暴露) |
| :--- | :--- | :--- |
| `width` | 宽度 | `--[id]-size` |
| `height` | 高度 | `--[id]-size` |
| `minWidth` | 最小宽度 | `--[id]-size` |
| `minHeight` | 最小高度 | `--[id]-size` |
| `size` | 统一尺寸 (Icon/Avatar) | `--[id]-size` |
| `padding` | 内边距 | `--[id]-padding` |
| `gap` | 间距 | `--[id]-gap` |
| `radius` | 圆角 (0-20 token) | `--[id]-radius` |
| `fontSize` | 字体大小 (1-8 token，自动配对行高) | `--[id]-font-size` + `--[id]-line-height` |
| `border` | 外边框 (1-8 token) | `--[id]-border` |
| `innerBorder` | 内边框 (box-shadow) | `--[id]-inner-border` |
| `opacity` | 透明度 (0-1) | `--[id]-opacity` |

---

## 4. 表达式语法 (Expression Syntax)

支持 JS 子集语法，变量需加 `$` 前缀：

- **引用变量**: `$#target.prop` (e.g. `$#sidebar.width`)
- **自身引用**: `$self.width`
- **数学运算**: `+`, `-`, `*`, `/`, `%`
- **逻辑运算**: `>`, `<`, `>=`, `<=`, `==`, `!=`, `&&`, `||`
- **三元运算**: `condition ? trueVal : falseVal`
- **Math 函数**: `Math.max(...)`, `Math.min(...)`, `Math.floor(...)`

---

## 5. 优先级规则 (Priority)

| 场景 | 权重 | 结果 |
| :--- | :--- | :--- |
| **Orchestration** vs **Props** | P6 vs P4 | **Orchestration 胜出** (Inline Style > CSS Var) |
| **Orchestration** vs **Class** | P6 vs P5 | **Orchestration 胜出** (Inline Style > Class) |
| **Orchestration** vs **Style** | P6 vs P6 | **最后应用者胜出** |
| **Orchestration(Force)** | P7 | **胜出** (`!important` 覆盖内联) |

---

## 开发者指南 (AI)

### 开发者关键字

| 类别 | 关键字 | 描述 |
|:---|:---|:---|
| Context Key | `ORCHESTRATION_KEY` | 样式编排上下文的 Symbol |
| 核心类 | `StyleOrchestrator` | 负责逻辑计算与样式生成的类 |

### 关联关系

- **核心组件**: [FramePro.svelte](../components/FramePro.svelte)
- **关联逻辑**: [frame-orchestrator.svelte.ts](frame-orchestrator.svelte.ts)
