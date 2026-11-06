# Checkbox

> **版本**: v1.3.0
> **职责**: 选择一个或多个独立选项，支持选中、未选中和部分选中状态，适合表单与批量选择。
> **包归属**: `@snowui-design-system/components`
> **文档修订**: 2026-10-23

## 组件介绍

选择一个或多个独立选项，支持选中、未选中和部分选中状态，适合表单与批量选择。

## 使用选择

<!-- usage-guide:start -->
用于独立开关或多项选择。互斥单选用 Radio，立即生效的二态设置用 Switch；DataTable 选择列优先使用其内置选择协议。

- 独立布尔状态使用 `bind:checked`；多选数组使用 `bind:group` 并为各项提供稳定 value。
- indeterminate 表示部分选中；与 checked 分开管理。提供标签或 ariaLabel，禁用使用 disabled。
<!-- usage-guide:end -->

## 快速开始

以下示例展示推荐的基本组合。更多场景与组合限制见后文。

<!-- quick-start:generated -->
```svelte
<script lang="ts">
	import { Checkbox } from '@snowui-design-system/components';
	let subscribed = $state(false);
</script>

<Checkbox bind:checked={subscribed}>Email me product updates</Checkbox>
```
<!-- /quick-start:generated -->

## API

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| checked | `boolean` | `false` | 选中状态（双向绑定） |
| group | `any[]` | — | 多选值数组，配合 value 双向绑定 |
| value | `any` | — | 表单值 |
| size | `ResourceSize \| number` | — | 组件尺寸（像素，梯度与 Icon 一致：12/16/20/24/28/32/40/48/80） |
| disabled | `boolean` | `false` | 禁用状态 |
| indeterminate | `boolean` | `false` | 不确定状态（双向绑定） |
| onCheckedChange | `(checked: boolean) => void` | — | 原生复选状态变化后的回调 |
| ariaLabel | `string` | — | 无可见 label 时的无障碍名称 |
| singleLine | `boolean` | `true` | 默认标签与控件保持单行，附件不压缩；窄宽时原始标签可省略显示并保留完整可访问名称，不复制 children。复杂多行内容可显式设为 false，由该内容拥有布局。需要全文提示时组合 Text lines={1}。 |
| gap | `number` | — | 继承 Frame 的间距 Token 序号；省略时使用原组件间距，显式值覆盖组件间距。有效间距至少 4 CSS px，包含零值、根字号及 gap-scale 缩放；较大首选值保留。 |
| children | `Snippet` | — | 标签内容 |
| enableResponsive | `boolean` | `false` | 启用响应式 |
| enableContext | `boolean` | `false` | 启用上下文 |

未重新声明的继承能力请查所属基础组件文档；本表只列本组件源码具名公开属性。

## 使用边界与详细说明

<a id="布局模型"></a>

### 布局模型

主布局模型：**内联外壳布局**。定义见 [../../../docs/standards/LayoutProtocol.md §12.4](../../../docs/standards/LayoutProtocol.md)。

Checkbox 属于“控件视觉体 + label”的内联外壳子类：

- 根节点保持 `inline-flex`，内容整体 Hug。
- `.snowui-checkbox-visual` 是固定 Hug 的控件视觉体。
- `.snowui-checkbox-label` 是可选标签，空间充足时 Hug，受限时允许收缩并单行省略；原始内容及完整原生名称保留。
- visual 与 label 的距离由 `--snowui-checkbox-gap` 管理，可通过 gap 或 `--snowui-checkbox-gap-override` 设置首选值；有效间距至少 4 CSS px。
- `size` 表示包含透明留白的控件占位尺寸，不改变 label 的布局策略。
- 四周留白为 `size / 16`，可见图形宽高为 `size × 0.875`；例如 `size={32}` 占位 32×32px、图形 28×28px、四边各 2px。留白与图形随 size、根字号和尺寸 Token 等比缩放，留白仍可点击。
- 留白由共享控件壳持有，label 位于壳外；内边框继续按名义 size 的 `0.0625` 计算，圆角、Dot 与选中环按可见图形尺寸计算。

---

<a id="使用示例"></a>

### 使用示例

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

<a id="状态"></a>


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

<a id="图标"></a>

### 图标

- **勾选图标**: 选中状态显示
- **横线图标**: 不确定状态显示
- 使用 28×28 SVG 描边路径绘制，随组件尺寸缩放并继承选中态颜色

<a id="无障碍性"></a>

### 无障碍性

- 使用原生 `<input type="checkbox">` 确保键盘导航
- 支持 Tab 键聚焦
- 支持 Space 键切换
- 支持 `indeterminate` 属性
- 禁用状态下 `tabindex=-1`

<a id="典型场景"></a>


### 单个复选框
```svelte
<script lang="ts">
  import { Checkbox } from '@snowui-design-system/components';
  let checked = $state(false);
</script>

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

<a id="样式规则-style-spec"></a>

### 样式规则 (Style Spec)

| 属性 | 值 | 说明 |
|:---|:---|:---|
| **Class** | `.snowui-checkbox` | 组件根类名 |
| **CSS 行为** | 组件自管 | hover 视觉由组件内部选择器声明 |
| **Tag** | `label` | 语义化标签，点击区域包含文字 |

### 2. 默认样式 (Defaults)

- **Display**: `inline-flex`, `align-items: center`
- **Gap**: 首选 `var(--gap-1)`，缩放和零值下的有效间距仍至少为 4 CSS px。
- **Cursor**: `pointer` (Disabled 时为 `default`)
- **Font**: `var(--text-14)` (14px), `line-height: var(--leading-14)` (20px)

### 3. CSS 变量 (Variables)

组件使用 CSS 变量实现等比缩放：

```css
--snowui-checkbox-size: var(--size-4); /* 基准 16px */
--snowui-checkbox-size-resolved: var(--snowui-checkbox-size-override, var(--snowui-checkbox-size));
--snowui-checkbox-radius: calc(var(--snowui-checkbox-visual-size) * 0.3125); /* 可见尺寸的 31.25% */
--snowui-checkbox-radius-resolved: var(--snowui-checkbox-radius-override, var(--snowui-checkbox-radius));
--snowui-checkbox-border-width: calc(var(--snowui-checkbox-size-resolved) * 0.0625); /* 16px 时 1px，32px 时 2px */
--snowui-checkbox-border-width-resolved: var(--snowui-checkbox-border-width-override, var(--snowui-checkbox-border-width));
--primary: var(--primary, var(--black-100, #000000)); /* 使用全局 Primary Token (默认黑色) */
```


#### Unchecked
- **Visual**: 透明背景 + `var(--black-20)` 边框
- **Icon**: 勾选与横线均不可见
- **Hover**: 填充保持不变；独立 inset 覆盖层在基础 **20%** 黑色边框上再叠加 **20%** 黑色，默认等效约 **36%** 黑色；仅此状态适用 `StyleSpec §2.4.3` 例外

#### Checked / Indeterminate
- **触发**: 原生 input 的 `:checked` / `:indeterminate` 通过 sibling 选择器驱动
- **Visual**: `var(--primary)` 背景 + 边框
- **Icon**: color: `var(--static-white-100)`；checked 使用路径绘制，indeterminate 保留缩放 / 透明度过渡
- **Hover**: 填充与 inset 边框统一在主色上混合 **20%** Static White

#### Disabled
- **Attr**: `[data-disabled="true"]`
- **Style**: `opacity: 0.5`, `pointer-events: none`, `cursor: default`

### 5. 交互细节

- **点击区域**: 原生 `<input>` 使用 `position: absolute; inset: 0` 覆盖整个 label 区域，确保点击响应灵敏。
- **Focus**: 支持键盘导航，聚焦时显示 `20% primary` 的 Ring。
- **动画**:
  - 容器: hover 填充与 inset 边框使用相同颜色和时序
  - checked 勾选: 参考 Fluid Functionalism 的 pathLength 语义，进入使用 `200ms ease-out` 绘制；取消选择时以常规 `150ms ease-out` 随底色淡出，不反向绘制
  - indeterminate 横线: 与 Radio 状态动效一致，使用 `150ms ease-out`
  - `prefers-reduced-motion: reduce`: 取消视觉体、勾选与横线过渡，直接显示最终状态



## AI Zone

**继承**: 复用 Frame.svelte 的所有通用能力 (交互、动效、响应式)。
**默认能力开关**: `enableResponsive=false`, `enableContext=false`。

<a id="开发者指南-ai"></a>

### 开发者指南 (AI)

### 模块索引 (Module Index)

- **Checkbox 组件**: [./Checkbox.svelte](Checkbox.svelte)

### 关联关系

- **父组件**: [Frame.svelte](Frame.svelte)

---

## 更新日志

### v1.3.0 (2026-10-23)

- 标签采用共享单行预设并保留原始 Snippet；窄宽时允许标签收缩，复杂多行内容可显式退出。控件与标签间距消费共享解析，零值与字体／gap 缩放不低于 4 CSS px；较大首选值、视觉体尺寸和透明留白比例保持。
- 分组同步仅在成员实际变化时更新数组，修复空数组在初始化时重复写入引发的 effect 更新循环；半选清除和单次回调保持。

- 2026-09-21：统一使用文档、源码属性表与 Site / LLM 阅读入口；仅文档修订，不改变组件行为。

- **Checkbox-Docs.2026-05-25** 源码顶部历史更新日志已归档；后续新增变更统一写入本文档 更新日志，源码顶部只保留职责、当前关键架构与文档路径。

### v1.2.28 (2026-08-20)

- **CB-Corner.1** Checkbox 外壳继续复用与 Button 相同的 `.snowui-rounded-rectangle` / `superellipse(1.1)` iOS 连续圆角；内部 Hover 覆盖层显式继承 `border-radius` 与 `corner-shape`，确保基础边框、选中背景和 Hover 表面始终共享同一轮廓。

### v1.2.27 (2026-08-20)

- **CB-Hover.4** 按用户裁决将未选中边框 Hover 覆盖层从 `4%` 提升为 `20%` 黑色；基础边框仍为 `20%` 黑色，默认叠加结果等效约 `36%` 黑色，填充保持不变。该值与独立覆盖层实现已登记为 `StyleSpec §2.4.3` 限定例外。

### v1.2.26 (2026-08-20)

- **CB-Hover.3** Hover 改为独立覆盖层淡入，不再直接插值半透明 inset `box-shadow`。未选中态只叠加 `4%` 主色边框层；选中态用 `20%` Static White 覆盖完整表面，消除边框先变透明再恢复的闪烁。

### v1.2.25 (2026-08-20)

- **CB-Hover.2** 未选中 Hover 保持填充背景不变，仅把基础 `20%` 黑色边框作为底色叠加 `4%` 主色，使边框按 Hover 规则加深；选中态继续保持填充与边框同色。

### v1.2.24 (2026-08-20)

- **CB-Hover.1** Hover 色同时覆盖视觉体填充与 inset 边框：未选中态两者统一为 `4%` 主色混合值，checked / indeterminate 两者统一为主色叠加 `20%` Static White，避免边框与填充分层。

### v1.2.23 (2026-08-20)

- **CB-Motion.4** 勾选与横线描边在整个退场周期固定使用 Static White，避免取消选择后因继承色立即恢复为黑色而产生残影。
- **CB-Test.1** Test 基础示例补充 indeterminate 横线状态。

### v1.2.22 (2026-08-20)

- **CB-Visual.2** checked / indeterminate 图形改为 Workshop `14763:16992` 的 28×28 基准比例：勾选路径使用设计稿精确坐标，横线宽度为外框的 `12/28`，两者随 visual 整体等比缩放。
- **CB-Motion.3** 取消选择时不反向播放勾选绘制；勾选以常规状态时序随选中底色淡出，完全不可见后再无动画复位路径。

### v1.2.21 (2026-08-20)

- **CB-Size.1** 明确 `size` 是包含 inset 边框的视觉体外部尺寸，并用 `border-box` 固化该边界。
- **CB-Motion.2** 常规状态过渡统一为 `150ms ease-out`；checked 勾选作为独立路径绘制，放慢为进入 `200ms ease-out`、退出 `120ms ease-in`。

### v1.2.20 (2026-08-20)

- **CB-Visual.1** checked / indeterminate 图形改为 Workshop `14756:16934` 的 32×32、2px 圆头描边路径，并随组件尺寸整体缩放。
- **CB-Motion.1** checked 勾选改为路径绘制；减少动效时直接提交最终路径。选中态背景、边框和颜色保持不变。
- **CB-Scale.1** 未选中边框以 32px 时 2px 为基准，按 `size × 0.0625` 等比缩放；公开 border-width override 仍优先。

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
