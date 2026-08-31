# Switch 组件

> **版本**: v1.1.17
> **职责**: 开关切换控件，用于在两个状态之间切换。

**继承**: 复用 Frame.svelte 的所有通用能力 (交互、动效、响应式)。
**默认能力开关**: `enableResponsive=false`, `enableContext=false`。

## 关键字

| Keyword | Type | Default | Description |
|:---|:---|:---|:---|
| `checked` | `boolean` | `false` | 选中状态（双向绑定） |
| `value` | `any` | - | 表单值 |
| `size` | `ResourceSize \| number` | `16` | 组件高度（标准梯度: 12/16/20/24/28/32/40/48/80） |
| `disabled` | `boolean` | `false` | 禁用状态 |
| `children` | `Snippet` | - | 标签内容 |
| `enableResponsive` | `boolean` | `false` | 启用响应式 |
| `enableContext` | `boolean` | `false` | 启用上下文 |

## 布局模型

主布局模型：**内联外壳布局**。定义见 [../../../specs/LayoutProtocol.md §12.4](../../../specs/LayoutProtocol.md)。

Switch 属于“控件视觉体 + label”的内联外壳子类：

- 根节点保持 `inline-flex`，内容整体 Hug。
- `.snowui-switch-track` 是固定 Hug 的控件视觉体。
- `.snowui-switch-label` 是可选 label，默认 Hug，不承担 Fill。
- track 与 label 的距离由 `--snowui-switch-gap` 管理，可通过 `--snowui-switch-gap-override` 覆盖。
- `size` 只影响 track / thumb 尺寸，不改变 label 的布局策略。

---

## 更新日志 (Changelog)

- **Switch-Docs.2026-05-25** 源码顶部历史变更记录已归档；后续新增变更统一写入本文档 Changelog，源码顶部只保留职责、当前关键架构与文档路径。

### v1.1.17 (2026-08-31)

#### 调整
- **TG-Motion.1** Track 背景与 Thumb 位移继续消费 Frame `control` 通用时序桥接，并将默认时长上限收敛为与 Checkbox、Radio 一致的 `150ms`；`prefers-reduced-motion: reduce` 下取消过渡并直接提交最终状态。

### v1.1.16 (2026-04-28)

#### 调整
- **TG-Layout.1** 按 `LayoutProtocol.md` 将组件注册为内联外壳布局，补充 track + label 的布局边界说明，并将 gap 收敛到 `--snowui-switch-gap` / `--snowui-switch-gap-override` 链路。

### v1.1.15 (2026-03-06)

#### 调整
- **TG-Bridge.4** Track 背景与 Thumb 位移过渡改为消费 Frame `control` 通用时序桥接变量，组件不再维护独立默认 duration / easing。

### v1.1.14 (2026-02-18)

#### 调整
- **TG-Adj.3** 与 Radio/Checkbox 统一动效时间与缓动曲线（`0.2s` + `cubic-bezier(0.4, 0, 0.2, 1)`），覆盖 Track/Thumb 过渡。

### v1.1.13 (2026-02-18)

#### 修复
- **TG-Fix.8** 修复 Switch hover 无效：状态选择器从 `:has(...)` 改为 `input:checked + .snowui-switch-track` 链路，提升兼容性与稳定性。

### v1.1.11 (2026-02-18)

#### 调整
- **TG-Adj.1** 默认颜色链路改为主色：未设置颜色类时激活态使用 `--primary`（行为对齐 Filled Button）。
- **TG-Adj.2** Thumb 圆形固定白色 token：`--static-white-100`。

### v1.1.10 (2026-02-18)

#### 修复
- **TG-Fix.7** 进一步修复 hover 闪动：移除 Track 颜色过渡，避免颜色链插值抖动。

### v1.1.9 (2026-02-18)

#### 修复
- **TG-Fix.5** 修复 hover 进出时的消失闪动：overlay 改为固定 gradient，通过变量切换透明度，避免 hover 时切换 `background-image`。
- **TG-Fix.6** 恢复激活态对比：选中轨道恢复主色实底，Thumb 恢复 `--white-100`。

### v1.1.8 (2026-02-18)

#### 修复
- **TG-Fix.4** 修复 hover 闪动：Track 改为常驻 0% overlay 基线，hover 仅切换 overlay 强度，避免 `none -> gradient` 切换闪烁。

### v1.1.7 (2026-02-18)

#### 调整
- **TG-Color.1** 组件颜色统一改为 `currentColor` 链路，支持 `class="text-*"` 覆盖整组件。
- **TG-Color.2** 原灰阶层改为同色透明度层（20%/40%），激活与未激活统一同色体系。

### v1.1.6 (2026-02-18)

#### 修复
- **TG-Fix.3** 修复大尺寸下 thumb 视觉贴边：`thumb-gap` 改为基于高度等比缩放（`gap = height * 0.125`，16 时为 2px）。

### v1.1.5 (2026-02-18)

#### 优化
- **TG-Opt.1** 尺寸梯度与 Icon 组件对齐：`16/20/24/28/32/40/48/80`。
- **TG-Opt.2** 尺寸链路改为 `--size-*` token，且以高度为基准推导宽度与 thumb 尺寸。
- **TG-Opt.3** 补齐 `override -> internal -> token` 变量桥接链。

### v1.1.4 (2026-02-18)

#### 修复
- **TG-Fix.2** 移除组件内 `cursor: pointer`，禁用态 cursor 统一由 Frame `Surface` + `.snowui-disabled` 通用链路控制。

### v1.1.3 (2026-02-03)

#### 修复
- **TG-Fix.1** 补齐 Frame 能力开关显式传参并对齐内部变量命名规范

---

---

> **以下内容供 AI 阅读，用于维护代码与文档的关联**

## 开发者指南 (AI)

### 模块索引 (Module Index)

- **Switch 组件**: [./Switch.svelte](./Switch.svelte)

### 关联关系

- **父组件**: [Frame.svelte](./Frame.svelte)

---

## 使用示例

```svelte
<script>
  import { Switch } from '@snowui-design-system/components';
  let checked = $state(false);
</script>

<!-- 基础用法 -->
<Switch bind:checked>开关</Switch>

<!-- 自定义尺寸 -->
<Switch bind:checked size={20}>大号开关</Switch>

<!-- 禁用状态 -->
<Switch checked disabled>禁用开关</Switch>
```

## 状态

- **unchecked**: 未选中状态，灰色轨道
- **checked**: 选中状态，主题色轨道
- **disabled**: 禁用状态，降低透明度

## 样式规范

### CSS 变量

| 变量 | 默认值 | 说明 |
|:---|:---|:---|
| `--snowui-switch-size` | `var(--size-4)` | 基准尺寸（16px） |
| `--switch-primary` | `var(--primary, var(--black-100, #000000))` | 激活态背景色 |
| `--switch-width` | `size * 1.8` | 轨道宽度 |
| `--switch-height` | `size` | 轨道高度 |
| `--switch-thumb-gap` | `height * 0.125` | 滑块与轨道间距（等比缩放） |
| `--thumb-size` | `height - gap * 2` | 滑块尺寸 |

### 尺寸与圆角

- **轨道圆角**: `var(--radius-full, 50%)` (pill shape)
- **滑块圆角**: `var(--radius-full, 50%)` (circle)
- **组件间距**: `var(--gap-1)` (4px)

### 状态样式

| 状态 | Track 背景色 | Thumb 位置 |
|:---|:---|:---|
| Unchecked | `--black-20` | `left: gap` |
| Checked | `--switch-primary` | `translateX(width - size - gap*2)` |
| Disabled | 同上 + `opacity: 0.5` | 同上 |

### Hover 效果 (StyleGuide 7.4)

| 状态 | Hover 叠加 |
|:---|:---|
| Unchecked | `background-image` 叠加 4% `currentColor` |
| Checked | `background-image` 叠加 20% `--white-100` |

### 动画

- **Transition**: Track 背景色与 Thumb 位置消费 Frame `control` 通用时序，默认上限为 `150ms ease-out`，与 Checkbox、Radio 的常规点击状态一致
- **减少动效**: `prefers-reduced-motion: reduce` 下取消 Track 与 Thumb 过渡，直接提交最终状态
- **阴影**: Thumb 带 Drop Shadow 2

## 无障碍性

- 使用原生 `<input type="checkbox">` 确保键盘导航
- 支持 Tab 键聚焦
- 支持 Space 键切换
- 禁用状态下 `tabindex=-1`
