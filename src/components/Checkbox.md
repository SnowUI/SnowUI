# Checkbox 组件

> **版本**: v1.2.19
> **职责**: 复选框控件，用于选择多个选项或表示开关状态。

**继承**: 复用 Frame.svelte 的所有通用能力 (交互、动效、响应式)。
**默认能力开关**: `enableResponsive=false`, `enableContext=false`。

## 关键字

## 关键字

| Keyword | Type | Default | Description | Category |
|:---|:---|:---|:---|:---|
| `checked` | `boolean` | `false` | 选中状态（双向绑定） | **State** |
| `indeterminate` | `boolean` | `false` | 不确定状态（双向绑定） | **State** |
| `onCheckedChange` | `(checked: boolean) => void` | - | 原生复选状态变化后的回调 | Event |
| `ariaLabel` | `string` | - | 无可见 label 时的无障碍名称 | Accessibility |
| `disabled` | `boolean` | `false` | 禁用状态 | **State** |
| `value` | `any` | - | 表单值 | Data |
| `size` | `number` | `16` | 组件尺寸（像素，梯度与 Icon 一致：16/20/24/28/32/40/48/80） | Style |
| `children` | `Snippet` | - | 标签内容 | Content |
| `enableResponsive` | `boolean` | `false` | 启用响应式 | Capability |
| `enableContext` | `boolean` | `false` | 启用上下文 | Capability |

## 布局模型

主布局模型：**内联外壳布局**。定义见 [../../../specs/LayoutProtocol.md §12.4](../../../specs/LayoutProtocol.md)。

Checkbox 属于“控件视觉体 + label”的内联外壳子类：

- 根节点保持 `inline-flex`，内容整体 Hug。
- `.snowui-checkbox-visual` 是固定 Hug 的控件视觉体。
- `.snowui-checkbox-label` 是可选 label，默认 Hug，不承担 Fill。
- visual 与 label 的距离由 `--snowui-checkbox-gap` 管理，可通过 `--snowui-checkbox-gap-override` 覆盖。
- `size` 只影响视觉体尺寸，不改变 label 的布局策略。

---

## 更新日志 (Changelog)

- **Checkbox-Docs.2026-05-25** 源码顶部历史变更记录已归档；后续新增变更统一写入本文档 Changelog，源码顶部只保留职责、当前关键架构与文档路径。

### v1.2.19 (2026-06-23)

- 新增 `onCheckedChange` 与无可见 label 场景的 `ariaLabel`，供 Table 内置选择列复用。

### v1.2.18 (2026-04-28)

#### 调整
- **CB-Layout.1** 按 `LayoutProtocol.md` 将组件注册为内联外壳布局，补充 visual + label 的布局边界说明，并显式定义 `--snowui-checkbox-gap` 默认值。

### v1.2.17 (2026-04-02)

#### 调整
- **CB-Bridge.3** 新增 label gap、字体与行高的组件级变量桥接，允许组合宿主统一覆盖 checkbox 的 icon-text 间距和标签样式。

### v1.2.16 (2026-03-06)

#### 调整
- **CB-Bridge.2** 勾选 / 半选图标的显隐过渡改为消费 Frame `control` 通用时序桥接变量，组件不再维护独立默认 duration / easing。

### v1.2.15 (2026-02-18)

#### 修复
- **CB-Fix.13** 按历史稳定策略修复 hover 闪动：移除 visual 的颜色/边框过渡，unchecked hover 不再改变边框。

### v1.2.14 (2026-02-18)

#### 修复
- **CB-Fix.12** 进一步修复 hover 闪动：移除 visual 的 `background-image` 叠加链路，改为直接 `background-color` 混色。

### v1.2.13 (2026-02-18)

#### 修复
- **CB-Fix.11** 修复 hover 闪动：状态与 hover 选择器从 `:has(...)` 切换为 sibling 链路（`input + visual`）。

### v1.2.12 (2026-02-18)

#### 调整
- **CB-Adj.5** 与 Radio/Switch 统一动效时间与缓动曲线（`0.2s` + `cubic-bezier(0.4, 0, 0.2, 1)`），同步到 visual/icon 过渡。

### v1.2.11 (2026-02-18)

#### 调整
- **CB-Adj.4** 激活态 hover 叠加改为跟随 icon 白色 token（`--static-white-100`），与“叠加色=图标/文字色”一致。

### v1.2.10 (2026-02-18)

#### 调整
- **CB-Adj.3** 激活态勾选图标白色 token 改为 `--static-white-100`（包含 icon color 与 path fill）。

### v1.2.9 (2026-02-18)

#### 调整
- **CB-Adj.1** 默认颜色链路改为主色：未设置颜色类时，激活态背景使用 `--primary`（行为对齐 Filled Button）。
- **CB-Adj.2** 激活态勾选图标固定白色（显式 path fill）。

### v1.2.8 (2026-02-18)

#### 修复
- **CB-Fix.10** 修复激活态 hover 不生效：checked/indeterminate hover 直接使用 `white 20% + primary` 混合背景色，保证可见变化。

### v1.2.7 (2026-02-18)

#### 修复
- **CB-Fix.8** 修复激活态图标颜色：选中/半选图标显式改为 `--white-100`。
- **CB-Fix.9** 修复激活态无 hover：checked/indeterminate 状态的 hover 叠加改为白色链路，提升可见性。

### v1.2.6 (2026-02-18)

#### 修复
- **CB-Fix.6** 进一步修复 hover 闪动：移除视觉层颜色过渡，避免颜色链插值抖动。
- **CB-Fix.7** 解耦图标颜色与主色链，激活态图标固定使用 `--white-100`，避免主色链被 `currentColor` 反向污染。

### v1.2.5 (2026-02-18)

#### 修复
- **CB-Fix.4** 修复 hover 进出时的消失闪动：overlay 改为固定 gradient，通过变量切换透明度，避免 hover 时切换 `background-image`。
- **CB-Fix.5** 恢复激活态对比：选中/半选图标颜色回到 `--white-100`。

### v1.2.4 (2026-02-18)

#### 修复
- **CB-Fix.3** 修复 hover 闪动：视觉层改为常驻 0% overlay 基线，hover 仅切换 overlay 强度；并收敛过渡属性避免重绘抖动。

### v1.2.3 (2026-02-18)

#### 调整
- **CB-Color.1** 组件颜色统一改为 `currentColor` 链路，支持 `class="text-*"` 覆盖整组件。
- **CB-Color.2** 原灰阶层改为同色透明度层（20%/40%），激活与未激活统一同色体系。

### v1.2.2 (2026-02-18)

#### 修复
- **CB-Fix.2** 移除组件内 `cursor: pointer`，禁用态鼠标样式统一由 Frame `Surface` + `.snowui-disabled` 通用链路控制（禁用时为默认箭头）。

### v1.2.1 (2026-02-18)

#### 调整
- **CB-Map.1** 尺寸梯度与 Icon 对齐：`16/20/24/28/32/40/48/80`，并统一映射到 `--size-4/5/6/7/8/10/12/20`。
- **CB-Bridge.1** 补齐 `radius` 与 `border-width` 的 override 桥接：`--snowui-checkbox-radius-override` / `--snowui-checkbox-border-width-override`。
- **CB-Token.1** 尺寸链路改为 token 写法（标准档位直接用 `--size-*`，非标准值回退到 `calc(var(--size-4) * n / 16)`）。

### v1.2.0 (2026-02-03)

#### 修复
- **CB-Fix.1** 补齐 Frame 能力开关显式传参与内部变量命名规范

---

---

> **以下内容供 AI 阅读，用于维护代码与文档的关联**

## 开发者指南 (AI)

### 模块索引 (Module Index)

- **Checkbox 组件**: [./Checkbox.svelte](./Checkbox.svelte)

### 关联关系

- **父组件**: [Frame.svelte](./Frame.svelte)

---

## 使用示例

```svelte
<script>
  import { Checkbox } from '@snowui-design-system/components';
  let checked = $state(false);
  let indeterminate = $state(false);
</script>

<!-- 基础用法 (双向绑定) -->
<!-- bind:checked 意味着父组件的 checked 变量会随 Checkbox 状态变化而自动更新 -->
<Checkbox bind:checked>复选框</Checkbox>

<!-- 不确定状态 -->
<Checkbox bind:indeterminate>不确定状态</Checkbox>

<!-- 自定义尺寸 -->
<Checkbox bind:checked size={24}>大号复选框 (24px)</Checkbox>

<!-- 禁用状态 -->
<Checkbox checked disabled>禁用复选框</Checkbox>
```

## 状态

### Unchecked（未选中）
- 空的方框
- 灰色边框

### Checked（选中）
- 显示勾选图标
- 主题色背景和边框

### Indeterminate（不确定）
- 显示横线图标
- 主题色背景和边框
- 常用于"全选"场景

## 图标

- **勾选图标**: 选中状态显示
- **横线图标**: 不确定状态显示
- 使用 SVG 路径绘制，支持自定义颜色

## 无障碍性

- 使用原生 `<input type="checkbox">` 确保键盘导航
- 支持 Tab 键聚焦
- 支持 Space 键切换
- 支持 `indeterminate` 属性
- 禁用状态下 `tabindex=-1`

## 典型场景

### 单个复选框
```svelte
<Checkbox bind:checked>同意条款</Checkbox>
```

### 全选/部分选中

```svelte
<script>
  import { Checkbox, Frame } from '@snowui-design-system/components';

  let items = $state([
    { id: 1, checked: false },
    { id: 2, checked: false },
    { id: 3, checked: false }
  ]);
  
  let allChecked = $derived(items.every(item => item.checked));
  let someChecked = $derived(items.some(item => item.checked) && !allChecked);
</script>

<!-- 使用 Frame Container 布局 -->
<Frame class="flex flex-col gap-2 p-4">
  <Checkbox 
    checked={allChecked} 
    indeterminate={someChecked}
    onclick={() => {
      const newState = !allChecked;
      items.forEach(item => item.checked = newState);
    }}
  >
    全选
  </Checkbox>

  <Frame class="flex flex-col gap-2 pl-6 border-l border-black-10">
    {#each items as item}
      <Checkbox bind:checked={item.checked}>选项 {item.id}</Checkbox>
    {/each}
  </Frame>
</Frame>
```

## 样式规则 (Style Spec)


| 属性 | 值 | 说明 |
|:---|:---|:---|
| **Class** | `.snowui-checkbox` | 组件根类名 |
| **CSS 行为** | 组件自管 | hover 视觉由组件内部选择器声明 |
| **Tag** | `label` | 语义化标签，点击区域包含文字 |

### 2. 默认样式 (Defaults)

- **Display**: `inline-flex`, `align-items: center`
- **Gap**: `var(--gap-1)` (4px) - 图标与文字间距
- **Cursor**: `pointer` (Disabled 时为 `default`)
- **Font**: `var(--text-14)` (14px), `line-height: var(--leading-14)` (20px)

### 3. CSS 变量 (Variables)

组件使用 CSS 变量实现等比缩放：

```css
--snowui-checkbox-size: var(--size-4); /* 基准 16px */
--snowui-checkbox-size-resolved: var(--snowui-checkbox-size-override, var(--snowui-checkbox-size));
--snowui-checkbox-radius: calc(var(--snowui-checkbox-size-resolved) * 0.3125); /* 16px 时为 5px */
--snowui-checkbox-radius-resolved: var(--snowui-checkbox-radius-override, var(--snowui-checkbox-radius));
--snowui-checkbox-border-width: var(--border-2); /* 1px */
--snowui-checkbox-border-width-resolved: var(--snowui-checkbox-border-width-override, var(--snowui-checkbox-border-width));
--primary: var(--primary, var(--black-100, #000000)); /* 使用全局 Primary Token (默认黑色) */
```

### 4. 状态样式 (States)

#### Unchecked
- **Visual**: 透明背景 + `var(--black-20)` 边框
- **Icon**: `opacity: 0`, `scale(0.5)`
- **Hover**: 使用 `background-image` 叠加 **4%** `currentColor` (跟随父级文本颜色)

#### Checked / Indeterminate
- **触发**: 通过 CSS `:has(input:checked)` 检测
- **Visual**: `var(--primary)` 背景 + 边框
- **Icon**: `opacity: 1`, `scale(1)` (弹性过渡), color: `var(--static-white-100)`
- **Hover**: 使用 `background-image` 叠加 **20%** `currentColor` (White)

#### Disabled
- **Attr**: `[data-disabled="true"]`
- **Style**: `opacity: 0.5`, `pointer-events: none`, `cursor: default`

### 5. 交互细节

- **点击区域**: 原生 `<input>` 使用 `position: absolute; inset: 0` 覆盖整个 label 区域，确保点击响应灵敏。
- **Focus**: 支持键盘导航，聚焦时显示 `20% primary` 的 Ring。
- **动画**:
  - 容器: hover 背景仍保持直接切换，避免颜色插值闪动
  - 图标: 默认继承 Frame `control` 通用时序（默认 `300ms ease-out`）
