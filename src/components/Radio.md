# Radio

> **许可阅读**：首次阅读组件文档、源码或 npm 使用流程，先读完整 [LICENSE](../../LICENSE)；同任务同版本去重。公开 API 配置与内部实现修改分别按许可处理；旧 OSS / PRO 标签仅表示迁移期技术来源。

> **版本**: v1.3.17
> **职责**: 在一组互斥选项中选择一项，适合需要直接展示所有选项的表单设置。
> **包归属**: `@snowui-design-system/components`
> **文档修订**: 2026-09-21

## 组件介绍

在一组互斥选项中选择一项，适合需要直接展示所有选项的表单设置。

## 使用选择

<!-- usage-guide:start -->
用于一组选项中的单选。多选用 Checkbox，分段参数选择用 Segmented；为组和选项提供可访问名称。

- 同组使用 bind:group 和不同的稳定 value；无初始选择可用 null。
- 组件支持取消当前项并写入 undefined，不能假定已选项永远不可取消；提供可读标签。
<!-- usage-guide:end -->

## 快速开始

以下示例展示推荐的基本组合。更多场景与组合限制见后文。

<!-- quick-start:generated -->
```svelte
<script lang="ts">
	import { Radio } from '@snowui-design-system/components';
	let subscribed = $state(false);
</script>

<Radio bind:checked={subscribed}>Email me product updates</Radio>
```
<!-- /quick-start:generated -->

## API

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| checked | `boolean` | `false` | 独立使用时以 bind:checked 双向绑定选中状态；点击或按 Space 切换，再次操作会取消。分组时选中状态由 group 与 value 是否相等决定。 |
| group | `any` | — | 同组 Radio 绑定同一状态并提供不同 value。初始值应为已选项值；无初始选择可设为 null。取消当前项后写入 undefined，后续组联动仍有效。 |
| value | `any` | — | 当前选项对应的值，以严格相等与 group 比较；同组应使用唯一且稳定的值。 |
| size | `ResourceSize \| number` | — | 控件占位尺寸，支持 12/16/20/24/28/32/40/48/80 及自定义数值；未传时优先继承尺寸上下文，否则为 16。图形占尺寸的 87.5%，不改变标签字号。 |
| disabled | `boolean` | `false` | 禁止点击与键盘切换，并移出 Tab 顺序；保留当前选中状态。 |
| variant | `"outline" \| "filled"` | `"filled"` | filled 使用粗选中环，outline 使用细外框与中心点；两者具有相同的选择行为。 |
| children | `Snippet` | — | 显示在圆形控件旁的标签，可组合标题和说明；建议始终提供可读标签。 |
| enableResponsive | `boolean` | `false` | 传递给 Frame 的响应式能力开关；按 Frame 的响应式配置处理布局。 |
| enableContext | `boolean` | `false` | 传递给 Frame 的通用上下文能力开关；不控制 Radio 自身读取的尺寸与 Image 角标上下文。 |

未重新声明的继承能力请查所属基础组件文档；本表只列本组件源码具名公开属性。

## 使用边界与详细说明

<a id="关键字"></a>

### 关键字

| 关键字 | Type | Default | Description |
|:---|:---|:---|:---|
| `as` | `'badge'` | - | 角色化：作为 `Image` 角标挂件 |

分组建议在外层提供带名称的 `role="radiogroup"`。使用 Tab 聚焦、Space 切换；当前组件通过绑定管理组值，不提供组内方向键导航。`name`、`required` 等剩余属性传递到外层 Frame，不等同于内层原生 input 的表单属性。

<a id="布局模型"></a>

### 布局模型

主布局模型：**内联外壳布局**。定义见 [../../../specs/LayoutProtocol.md §12.4](../../../specs/LayoutProtocol.md)。

Radio 属于“控件视觉体 + label”的内联外壳子类：

- 根节点保持 `inline-flex`，内容整体 Hug。
- `.snowui-radio-visual` 是固定 Hug 的控件视觉体。
- `.snowui-radio-label` 是可选 label，默认 Hug，不承担 Fill。
- visual 与 label 的距离由 `--snowui-radio-gap` 管理，可通过 `--snowui-radio-gap-override` 覆盖。
- `size` 表示包含透明留白的控件占位尺寸，不改变 label 的布局策略。
- 四周留白为 `size / 16`，可见图形宽高为 `size × 0.875`；例如 `size={32}` 占位 32×32px、图形 28×28px、四边各 2px。留白与图形随 size、根字号和尺寸 Token 等比缩放，留白仍可点击。
- 留白由共享控件壳持有，label 位于壳外；内边框继续按名义 size 的 `0.0625` 计算，圆角、Dot 与选中环按可见图形尺寸计算。
- `as="badge"` 只表示 Radio 作为 Image 的角标挂件，不改变 Radio 内部布局模型。

---

<a id="使用示例"></a>

### 使用示例

```svelte
<script lang="ts">
  let checked = $state(false);
  import { Radio } from '@snowui-design-system/components';
  let selected = $state('option1');
</script>

<!-- 单选模式 -->
<Radio bind:checked>单个选项</Radio>

<!-- 分组模式 -->
<Radio bind:group={selected} value="option1">选项 1</Radio>
<Radio bind:group={selected} value="option2">选项 2</Radio>
<Radio bind:group={selected} value="option3">选项 3</Radio>

<!-- Filled 变体 -->
<Radio bind:group={selected} value="filled" variant="filled">填充样式</Radio>

<!-- 自定义尺寸 -->
<Radio bind:checked size={20}>大号单选</Radio>
```

<a id="变体"></a>


### Outline
- 未选中：灰色边框，透明背景
- 选中：主题色圆点，灰色边框

### Filled（默认）
- 未选中：灰色边框，透明背景
- 选中：主题色背景，白色圆点

<a id="状态"></a>

### 状态

- **unchecked**: 未选中状态
- **checked**: 选中状态
- **disabled**: 禁用状态

<a id="分组行为"></a>

### 分组行为

当使用 `group` 属性时：
- 自动管理同组内的单选逻辑
- 选中一个会自动取消其他选项
- 再次点击当前选中项会取消选中
- 取消当前选中项后，`group` 值会被清空为 `undefined`
- `group` 值等于选中项的 `value`

<a id="无障碍性"></a>

### 无障碍性

- 使用原生 `<input type="radio">` 作为基础语义，并在组件内补充“再次点击可取消”逻辑
- 支持 Tab 键聚焦
- 支持 Space 键选中与取消
- 支持方向键在同组内切换
- 禁用状态下 `tabindex=-1`



## AI Zone

> **更新日志 (2026-08-20)**: Filled Hover 只改变黑色选中环；Outline Hover 分别改变 Dot 与外框。


**继承**: 复用 Frame.svelte 的所有通用能力 (交互、动效、响应式)。
**默认能力开关**: `enableResponsive=false`, `enableContext=false`。

<a id="开发者指南-ai"></a>

### 开发者指南 (AI)

### 模块索引 (Module Index)

- **Radio 组件**: [./Radio.svelte](Radio.svelte)

### 关联关系

- **父组件**: [Frame.svelte](Frame.svelte)

---

<a id="样式规范-style-spec"></a>

### 样式规范 (Style Spec)

| 属性 | 值 | 说明 |
|:---|:---|:---|
| **Class** | `.snowui-radio` | 组件根类名 |
| **CSS 行为** | 组件自管 | hover 视觉由组件内部选择器声明 |
| **Tag** | `label` | 语义化标签，点击区域包含文字 |

### 2. 默认样式 (Defaults)

- **Display**: `inline-flex`, `align-items: center`
- **Gap**: `var(--gap-1)` (4px) - 图标与文字间距
- **Cursor**: 由 Frame `Surface` 通用规则控制（可交互时 pointer，Disabled 时 default）
- **Font**: `var(--text-14)` (14px), `line-height: var(--leading-14)` (20px)

### 3. CSS 变量 (Variables)

组件使用 CSS 变量实现等比缩放：

```css
--snowui-radio-size: var(--size-4); /* 基准 16px */
--snowui-radio-border-width: calc(var(--snowui-radio-size) * 0.0625); /* 1px */
--snowui-radio-dot-size: calc(var(--snowui-radio-visual-size) * 0.5); /* 可见尺寸的 50% */
--snowui-radio-filled-border: calc(var(--snowui-radio-visual-size) * 0.3); /* 可见尺寸的 30% */
--snowui-radio-primary: var(--primary, var(--black-100, #000000)); /* 使用全局 Primary Token */
```

### 4. 状态样式 (States)

#### Unchecked
- **Visual**: 透明背景 + `var(--black-20)` 边框
- **Border Width**: `size × 0.0625`（16px 时 1px，32px 时 2px）
- **Border Radius**: `var(--radius-full, 50%)` (圆形)
- **Hover**: 填充保持不变；独立 Hover 层在单层 `20%` 黑色边框上再叠加 `20%` 黑色 inset ring，默认等效约 `36%` 黑色；仅此状态适用 `StyleSpec §2.4.3` 例外

#### Checked (Outline 变体)
- **触发**: 根节点 `[data-checked="true"]` 驱动
- **Visual**: 边框不变，内部显示 `--radio-primary` 色 Dot
- **Dot**: `scale(1)` (弹性过渡)
- **Hover**: Dot 在主色上叠加 `20%` Static White；独立边框覆盖层在基础 `20%` 黑色外框上再叠加 `20%` 黑色，默认外框等效约 `36%` 黑色
- **交互**: 允许再次点击取消，不再把 checked 态视为不可操作状态

#### Checked (Filled 变体)
- **触发**: `[data-variant="filled"][data-checked="true"]`
- **Visual**: 边框加粗 `--radio-filled-border` 并变色为 `--radio-primary`
- **Background**: `transparent` (中空效果)
- **实现细节**: 组件始终保留一层细边框；独立选中环默认宽度为 0，仅在 Filled 选中时以 `150ms` 展开为粗边框
- **Hover**: 独立覆盖层只在粗黑选中环上叠加 `20%` Static White；中间白色孔不变，选中环的点击动效不变

#### Disabled
- **Attr**: `[data-disabled="true"]`
- **Style**: `opacity: 0.5`, `pointer-events: none`, `cursor: default`

### 5. 交互细节

- **点击区域**: 原生 `<input>` 使用 `position: absolute; inset: 0` 覆盖整个 label 区域
- **取消选中逻辑**: 组件拦截 click / `Space`，统一走内部 `toggle` 逻辑，而不是完全依赖原生 radio 的不可取消行为
- **Focus**: 支持键盘导航，聚焦时显示 `4% currentColor` 的 Ring
- **动画**: Dot、基础边框与 Filled 描边默认使用 `150ms ease-out`，与 Checkbox 常规状态节奏一致；外部仍可通过组件 CSS 变量覆写。
- **减少动效**: `prefers-reduced-motion: reduce` 下取消视觉体、Dot 与选中环过渡，直接提交最终状态。
- **选中态 Hover**: Outline 分别处理 Dot 与外框；Filled 只处理粗选中环，白色孔不变

## 更新日志

- 2026-09-21：统一使用文档、源码属性表与 Site / LLM 阅读入口；仅文档修订，不改变组件行为。

- **Radio-Docs.2026-05-25** 源码顶部历史更新日志已归档；后续新增变更统一写入本文档 更新日志，源码顶部只保留职责、当前关键架构与文档路径。

### v1.3.17 (2026-08-20)

- **RD-Hover.5** Filled 选中 Hover 只在粗黑选中环上叠加 `20%` Static White，中间白色孔保持不变；Outline 选中 Hover 将 Dot 调整为主色叠加 `20%` Static White，并在基础外框上额外叠加 `20%` 黑色。

### v1.3.16 (2026-08-20)

- **RD-Hover.4** 按用户裁决将未选中边框 Hover 覆盖层从 `4%` 提升为 `20%` 黑色；基础边框仍为单层 `20%` 黑色，默认叠加结果等效约 `36%` 黑色，填充保持不变。该值与独立覆盖层实现已登记为 `StyleSpec §2.4.3` 限定例外。

### v1.3.15 (2026-08-20)

- **RD-Hover.3** Hover 改为位于基础边框和选中环之上的独立覆盖层，避免半透明 `box-shadow` 插值产生闪烁，也不再改写点击后的选中环颜色。
- **RD-Ring.1** 未选中态只绘制单层 `20%` 黑色基础边框；独立选中环默认宽度为 0，仅在 Filled 选中时以 `150ms` 展开，避免两层基础边框叠加。

### v1.3.14 (2026-08-20)

- **RD-Hover.2** 未选中 Hover 保持填充背景不变，仅把基础 `20%` 黑色边框作为底色叠加 `4%` 主色，使 Checkbox 与 Radio 使用相同的边框加深规则。

### v1.3.13 (2026-08-20)

- **RD-Hover.1** Hover 色同时覆盖填充、基础 inset 边框与 Filled 选中环；选中和未选中状态均使用各自既有 Hover 填充色统一整个视觉表面。

### v1.3.12 (2026-08-20)

- **RD-Size.1** 明确 `size` 是包含 inset 边框的视觉体外部尺寸，并用 `border-box` 固化该边界。
- **RD-Motion.1** dot、基础边框与 Filled 选中环统一使用与 Checkbox 常规状态一致的 `150ms ease-out`，替代原 300ms 默认节奏。

### v1.3.11 (2026-08-20)

- **RD-Scale.1** 未选中边框以 Workshop `14756:16934` 的 32px / 2px 为基准，按 `size × 0.0625` 等比缩放；公开 border-width override 仍优先，Filled 选中环结构与动效不变。

### v1.3.10 (2026-04-28)

#### 调整
- **RD-Layout.1** 按 `LayoutProtocol.md` 将组件注册为内联外壳布局，补充 visual + label 的布局边界说明，并将 gap 收敛到 `--snowui-radio-gap` / `--snowui-radio-gap-override` 链路。

### v1.3.9 (2026-03-10)

#### 调整
- **RD-Adjust.8** 撤回单层边框直接变粗的尝试，恢复常驻细边框 + 叠加选中环层方案，保持上一版的边框结构与动效路径。

### v1.3.8 (2026-03-10)

#### 调整
- **RD-Adjust.7** 尝试将 Filled 恢复为单层边框直接变粗/变细，不再保留叠加选中环层；该方案随后撤回。

### v1.3.7 (2026-03-10)

#### 调整
- **RD-Adjust.6** Filled 选中环不再使用“缩放 + 淡出”近似粗细变化；改为常驻选中环层直接过渡边框宽度与颜色，恢复真实的粗细变化动效，并避免末段换层断点。

### v1.3.6 (2026-03-10)

#### 调整
- **RD-Adjust.5** Filled 选中环从“仅透明度淡出”调整为“缩放 + 淡出”，恢复边框由粗到细的观感，同时继续避开小尺寸 inset 宽度插值带来的闪动。

### v1.3.5 (2026-03-10)

#### 修复
- **RD-Fix.16** 小尺寸 Filled 退选时不再对粗边框做 inset 宽度插值；改为稳定细边框常驻，粗边框独立选中环只做透明度过渡，避免末段突然掉到未选中态。

### v1.3.4 (2026-03-10)

#### 修复
- **RD-Fix.15** 默认 Filled 形态退选时保留常驻细边框，选中态粗边框作为独立内层收回，避免边框缩到某个节点后突然掉到未选中视觉。

### v1.3.3 (2026-03-10)

#### 修复
- **RD-Fix.14** 默认 Filled 形态的未选中 hover 不再使用独立 overlay 层，改为在 `.snowui-radio-visual` 同层直接过渡边框与背景变量，消除“粗边框收完后新层闪现”的闪动。

### v1.3.2 (2026-03-10)

#### 修复
- **RD-Fix.13** 默认 Filled 形态的未选中 hover 恢复为“常驻 0% overlay 基线，hover 仅切换透明度”，进一步消除 checked -> unchecked 时的闪动。

### v1.3.1 (2026-03-10)

#### 修复
- **RD-Fix.12** 取消选中时的视觉层补齐 `background-color` 过渡，避免 hover 背景在 checked -> unchecked 切换时瞬时跳变。

### v1.3.0 (2026-03-10)

#### 新功能
- **RD-Behavior.1** Radio 支持点击当前已选项取消选中；键盘 `Space` 也遵循同样行为。
- **RD-Behavior.2** `bind:group` 场景下取消当前项会把 `group` 清空为 `undefined`，并保持后续组联动继续可用。
- **RD-Fix.11** 移除 checked 态 `cursor: default`，避免与“可取消选中”交互冲突。

### v1.2.15 (2026-03-10)

#### 新功能
- **RD-Role.1** Radio 新增 `as="badge"` 角色，可在 `Image` 宿主中作为右上角角标组合使用。

### v1.2.14 (2026-03-06)

#### 调整
- **RD-Bridge.1** Radio 内部 Dot 与 Filled 描边过渡改为消费 Frame 通用时序桥接变量；组件仅定义最终描边粗细，不再内置独立默认时间曲线。

### v1.2.13 (2026-02-23)

#### 修复
- **RD-Fix.10** 修复 checked 态光标语义：选中项输出 `data-checked="true"` 并在组件层设置 `cursor: default`，避免 hover 时出现 pointer 误导。

### v1.2.12 (2026-02-18)

#### 修复
- **RD-Fix.9** 按历史稳定策略修复 hover 闪动：unchecked hover 不再改变边框，仅保留背景混色。
- **RD-Adj.4** 保留默认 filled 激活态“边框加粗”过渡，仅对 checked 状态应用边框动效。

### v1.2.11 (2026-02-18)

#### 修复
- **RD-Fix.8** 进一步修复 hover 闪动：移除 visual 的 `background-image` 叠加链路，改为直接 `background-color` 混色。

### v1.2.10 (2026-02-18)

#### 修复
- **RD-Fix.7** 修复 hover 闪动：状态与 hover 选择器从 `:has(...)` 切换为 sibling 链路（`input + visual`）。

### v1.2.9 (2026-02-18)

#### 修复
- **RD-Fix.6** 修复默认（filled）形态激活动效缺失：选中时“边框加粗”补齐平滑过渡。
- **RD-Adj.3** 与 Checkbox/Switch 统一动效时间与缓动曲线（`0.2s` + `cubic-bezier(0.4, 0, 0.2, 1)`）。

### v1.2.8 (2026-02-18)

#### 调整
- **RD-Adj.2** 默认颜色链路改为主色：未设置颜色类时激活态使用 `--primary`（行为对齐 Filled Button）。

### v1.2.7 (2026-02-18)

#### 修复
- **RD-Fix.5** 进一步修复 hover 闪动：移除视觉层颜色过渡，避免颜色链插值抖动。

### v1.2.6 (2026-02-18)

#### 修复
- **RD-Fix.4** 修复 hover 进出时的消失闪动：overlay 改为固定 gradient，通过变量切换透明度，避免 hover 时切换 `background-image`。

### v1.2.5 (2026-02-18)

#### 修复
- **RD-Fix.3** 修复 hover 闪动：视觉层改为常驻 0% overlay 基线，hover 仅切换 overlay 强度；并收敛过渡属性避免重绘抖动。

### v1.2.4 (2026-02-18)

#### 调整
- **RD-Color.1** 组件颜色统一改为 `currentColor` 链路，支持 `class="text-*"` 覆盖整组件。
- **RD-Color.2** 原灰阶层改为同色透明度层（20%/40%），激活与未激活统一同色体系。

### v1.2.3 (2026-02-18)

#### 调整
- **RD-Adj.1** 默认 `variant` 从 `outline` 调整为 `filled`。

### v1.2.2 (2026-02-18)

#### 优化
- **RD-Opt.1** 尺寸梯度与 Icon 组件对齐：`16/20/24/28/32/40/48/80`。
- **RD-Opt.2** 尺寸链路改为 `--size-*` token，并补齐 `override -> internal -> token` 变量桥接。

### v1.2.1 (2026-02-18)

#### 修复
- **RD-Fix.2** 移除组件内 `cursor: pointer`，禁用态 cursor 统一由 Frame `Surface` + `.snowui-disabled` 通用链路控制。

### v1.2.0 (2026-02-03)

#### 修复
- **RD-Fix.1** 补齐 Frame 能力开关显式传参与内部变量命名规范

---

---

> **以下内容供 AI 阅读，用于维护代码与文档的关联**
